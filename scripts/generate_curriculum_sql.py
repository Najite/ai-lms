#!/usr/bin/env python3
"""
generate_curriculum_sql.py
Extracts the exact 15 phases, 500 lessons, and 2,528 subtopics from curriculum.md
and produces:
1. supabase/seed_curriculum.sql (Standard PostgreSQL atomic seed transaction)
2. supabase/curriculum_manifest.json (Structured JSON manifest for direct REST API seeding)
"""

import re
import json
import uuid
import os

CURRICULUM_PATH = "/home/sawacha/lms/curriculum.md"
SEED_SQL_PATH = "/home/sawacha/lms/supabase/seed_curriculum.sql"
JSON_MANIFEST_PATH = "/home/sawacha/lms/supabase/curriculum_manifest.json"

def escape_sql(text: str) -> str:
    if text is None:
        return "NULL"
    return "'" + text.replace("'", "''") + "'"

def parse_curriculum():
    with open(CURRICULUM_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    # Split into phases
    phase_blocks = list(re.finditer(r"## Phase (\d+): (.*?)\n(.*?)(?=\n## Phase |\Z)", content, re.DOTALL))
    
    phases_data = []
    lessons_data = []
    subtopics_data = []

    global_lesson_counter = 0

    for p_match in phase_blocks:
        phase_num = int(p_match.group(1))
        phase_title = p_match.group(2).strip()
        phase_body = p_match.group(3)

        # Capstone slug extraction
        capstone_match = re.search(r"### Phase \d+.*?Capstone.*?: (.*?)\n", phase_body)
        capstone_title = capstone_match.group(1).strip() if capstone_match else f"Phase {phase_num} Capstone"
        capstone_slug = re.sub(r"[^a-z0-9]+", "-", capstone_title.lower()).strip("-")

        # Extract lessons in this phase
        lesson_blocks = list(re.finditer(
            r"#### Lesson (\d+)\.(\d+): (.*?)\n(.*?)(?=(?:#### Lesson \d+\.\d+:|### Phase |\Z))",
            phase_body,
            re.DOTALL
        ))

        phase_record = {
            "phase_number": phase_num,
            "title": phase_title,
            "description": f"Phase {phase_num}: {phase_title}. Covers foundational concepts, architectural tradeoffs, and hands-on systems engineering.",
            "total_lessons": len(lesson_blocks),
            "capstone_slug": capstone_slug,
            "capstone_title": capstone_title,
        }
        phases_data.append(phase_record)

        for l_match in lesson_blocks:
            global_lesson_counter += 1
            l_pnum = int(l_match.group(1))
            l_num = int(l_match.group(2))
            l_title = l_match.group(3).strip()
            l_body = l_match.group(4).strip()

            lesson_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"lms.phase{phase_num}.lesson{l_num}"))
            lesson_slug = f"phase-{phase_num:02d}-lesson-{l_num:02d}-{re.sub(r'[^a-z0-9]+', '-', l_title.lower()).strip('-')}"[:60]

            # Parse subtopics
            st_matches = re.findall(r"  - `(\d+)\.(\d+)\.(\d+)` (.*?)\n", l_body)
            
            lesson_record = {
                "id": lesson_uuid,
                "slug": lesson_slug,
                "phase_number": phase_num,
                "lesson_number": l_num,
                "global_number": global_lesson_counter,
                "title": l_title,
                "content_markdown": l_body,
                "subtopics_count": len(st_matches),
            }
            lessons_data.append(lesson_record)

            for st in st_matches:
                st_pnum, st_lnum, st_idx, st_title = st
                subtopic_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"lms.subtopic.{st_pnum}.{st_lnum}.{st_idx}"))
                subtopic_record = {
                    "id": subtopic_uuid,
                    "lesson_id": lesson_uuid,
                    "subtopic_index": int(st_idx),
                    "title": st_title.strip(),
                    "code": f"{st_pnum}.{st_lnum}.{st_idx}",
                }
                subtopics_data.append(subtopic_record)

    return phases_data, lessons_data, subtopics_data

def generate_files(phases, lessons, subtopics):
    os.makedirs("/home/sawacha/lms/supabase", exist_ok=True)

    # 1. Write JSON Manifest
    manifest = {
        "stats": {
            "phases_count": len(phases),
            "lessons_count": len(lessons),
            "subtopics_count": len(subtopics),
        },
        "phases": phases,
        "lessons": lessons,
        "subtopics": subtopics,
    }
    with open(JSON_MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    print(f"✓ Created {JSON_MANIFEST_PATH} ({len(phases)} phases, {len(lessons)} lessons, {len(subtopics)} subtopics)")

    # 2. Write SQL Seed File (Atomic Transaction with Idempotency)
    with open(SEED_SQL_PATH, "w", encoding="utf-8") as f:
        f.write("-- ==============================================================================\n")
        f.write("-- AI-Native LMS Curriculum Database Seed\n")
        f.write(f"-- Exactly {len(phases)} Phases, {len(lessons)} Lessons, {len(subtopics)} Subtopics\n")
        f.write("-- ==============================================================================\n\n")
        f.write("BEGIN;\n\n")

        # Phases
        f.write("-- 1. Phases\n")
        for p in phases:
            f.write(f"""INSERT INTO phases (phase_number, title, description, total_lessons, capstone_slug)
VALUES ({p['phase_number']}, {escape_sql(p['title'])}, {escape_sql(p['description'])}, {p['total_lessons']}, {escape_sql(p['capstone_slug'])})
ON CONFLICT (phase_number) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  total_lessons = EXCLUDED.total_lessons,
  capstone_slug = EXCLUDED.capstone_slug;\n""")
        f.write("\n")

        # Lessons
        f.write("-- 2. Lessons\n")
        for l in lessons:
            f.write(f"""INSERT INTO lessons (id, slug, phase_number, lesson_number, title, content_markdown)
VALUES ({escape_sql(l['id'])}, {escape_sql(l['slug'])}, {l['phase_number']}, {l['lesson_number']}, {escape_sql(l['title'])}, {escape_sql(l['content_markdown'])})
ON CONFLICT (phase_number, lesson_number) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  content_markdown = EXCLUDED.content_markdown;\n""")
        f.write("\n")

        # Subtopics in batch chunks of 100 for fast execution
        f.write("-- 3. Subtopics\n")
        for st in subtopics:
            f.write(f"""INSERT INTO lesson_subtopics (id, lesson_id, subtopic_index, title)
VALUES ({escape_sql(st['id'])}, {escape_sql(st['lesson_id'])}, {st['subtopic_index']}, {escape_sql(st['title'])})
ON CONFLICT (lesson_id, subtopic_index) DO UPDATE SET
  title = EXCLUDED.title;\n""")
        f.write("\n")

        f.write("COMMIT;\n")

    size_mb = os.path.getsize(SEED_SQL_PATH) / (1024 * 1024)
    print(f"✓ Created {SEED_SQL_PATH} ({size_mb:.2f} MB SQL seed script)")

if __name__ == "__main__":
    phases, lessons, subtopics = parse_curriculum()
    generate_files(phases, lessons, subtopics)
