#!/usr/bin/env python3
"""
sync_manifest_subtopics_content.py
1. Parses all 600 lessons and subtopics from curriculum.md.
2. Updates supabase/curriculum_manifest.json with exact content_markdown,
   subtopic counts, and subtopic entities.
3. Regenerates supabase/seed_curriculum.sql with the fully synchronized database rows.
"""

import json
import re
import uuid

CURRICULUM_PATH = "/home/sawacha/lms/curriculum.md"
MANIFEST_PATH = "/home/sawacha/lms/supabase/curriculum_manifest.json"
SEED_SQL_PATH = "/home/sawacha/lms/supabase/seed_curriculum.sql"

def parse_curriculum():
    with open(CURRICULUM_PATH, "r", encoding="utf-8") as f:
        text = f.read()

    # Pattern for lesson headers
    pattern = r'#### Lesson (\d+)\.(\d+):\s*([^\n]+)\n(.*?)(?=(?:#### Lesson \d+\.\d+:|### Phase \d+ Project|### Phase \d+ Problem Solving|### Phase \d+ Capstone|\Z))'
    matches = list(re.finditer(pattern, text, re.DOTALL))
    print(f"Parsed {len(matches)} lessons from curriculum.md")

    lessons_data = []
    subtopics_data = []

    for m in matches:
        phase_num = int(m.group(1))
        lesson_num = int(m.group(2))
        title = m.group(3).strip()
        body = m.group(4).strip()

        # Extract subtopics
        # lines like: - `0.1.1` What is physical...
        sub_pattern = rf'-\s*`({phase_num}\.{lesson_num}\.(\d+))`\s*([^\n]+)'
        sub_matches = re.findall(sub_pattern, body)
        
        full_markdown = f"- **Status**: `[State: Active | Complete Specification | Core]`\n" + body
        # If body already has Status, don't duplicate
        if body.startswith("- **Status**:"):
            full_markdown = body

        lessons_data.append({
            "phase_number": phase_num,
            "lesson_number": lesson_num,
            "title": title,
            "content_markdown": full_markdown,
            "subtopics": [
                {
                    "code": sm[0],
                    "index": int(sm[1]),
                    "title": sm[2].strip()
                } for sm in sub_matches
            ]
        })

    return lessons_data

def main():
    parsed_lessons = parse_curriculum()
    assert len(parsed_lessons) == 600, f"Expected 600 lessons, got {len(parsed_lessons)}"

    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    # Map existing lessons in manifest by (phase_number, lesson_number)
    manifest_lessons = manifest["lessons"]
    lesson_map = {(l["phase_number"], l["lesson_number"]): l for l in manifest_lessons}

    new_subtopics = []
    global_num = 1

    for pl in parsed_lessons:
        key = (pl["phase_number"], pl["lesson_number"])
        if key in lesson_map:
            ml = lesson_map[key]
            ml["title"] = pl["title"]
            ml["global_number"] = global_num
            # If the lesson already has a rich handbook (like Phase 0 lessons 1-10), keep it!
            if not ml.get("content_markdown") or ml["content_markdown"].startswith("- **Status**"):
                ml["content_markdown"] = pl["content_markdown"]
            ml["subtopics_count"] = len(pl["subtopics"])

            lesson_id = ml["id"]
            for st in pl["subtopics"]:
                new_subtopics.append({
                    "id": str(uuid.uuid5(uuid.NAMESPACE_DNS, f"subtopic_{lesson_id}_{st['code']}")),
                    "lesson_id": lesson_id,
                    "subtopic_index": st["index"],
                    "title": st["title"],
                    "code": st["code"]
                })
        else:
            print(f"Warning: Lesson {key} not found in manifest!")
        global_num += 1

    manifest["subtopics"] = new_subtopics
    manifest["stats"]["total_lessons"] = len(manifest_lessons)
    manifest["stats"]["total_subtopics"] = len(new_subtopics)

    print(f"Updated manifest: {len(manifest_lessons)} lessons, {len(new_subtopics)} subtopics.")

    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    print(f"Saved manifest to {MANIFEST_PATH}")

    # Regenerate seed_curriculum.sql
    print(f"Regenerating {SEED_SQL_PATH}...")
    with open(SEED_SQL_PATH, "w", encoding="utf-8") as f:
        f.write("-- ==============================================================================\n")
        f.write("-- AI-Native LMS Curriculum Database Seed (4 Stages, 600 Lessons, 3,000 Subtopics)\n")
        f.write("-- ==============================================================================\n\n")
        f.write("BEGIN;\n\n")

        # 1. Phases
        f.write("-- 1. Phases\n")
        for phase in manifest["phases"]:
            title_esc = phase["title"].replace("'", "''")
            desc_esc = phase["description"].replace("'", "''")
            cap_slug_esc = phase["capstone_slug"].replace("'", "''")
            f.write(
                f"INSERT INTO phases (phase_number, title, description, total_lessons, capstone_slug)\n"
                f"VALUES ({phase['phase_number']}, '{title_esc}', '{desc_esc}', {phase['total_lessons']}, '{cap_slug_esc}')\n"
                f"ON CONFLICT (phase_number) DO UPDATE SET\n"
                f"  title = EXCLUDED.title, description = EXCLUDED.description,\n"
                f"  total_lessons = EXCLUDED.total_lessons, capstone_slug = EXCLUDED.capstone_slug;\n"
            )

        # 2. Lessons
        f.write("\n-- 2. Lessons\n")
        for l in manifest_lessons:
            id_val = l["id"]
            slug_esc = l["slug"].replace("'", "''")
            phase_num = l["phase_number"]
            lesson_num = l["lesson_number"]
            title_esc = l["title"].replace("'", "''")
            content_esc = l["content_markdown"].replace("'", "''")
            starter_esc = json.dumps(l.get("starter_code", {})).replace("'", "''")
            tests_esc = json.dumps(l.get("test_suite", {})).replace("'", "''")

            f.write(
                f"INSERT INTO lessons (id, slug, phase_number, lesson_number, title, content_markdown, starter_code, test_assertions)\n"
                f"VALUES ('{id_val}', '{slug_esc}', {phase_num}, {lesson_num}, '{title_esc}', '{content_esc}', '{starter_esc}', '{tests_esc}')\n"
                f"ON CONFLICT (phase_number, lesson_number) DO UPDATE SET\n"
                f"  title = EXCLUDED.title, content_markdown = EXCLUDED.content_markdown, starter_code = EXCLUDED.starter_code;\n"
            )

        # 3. Subtopics
        f.write("\n-- 3. Subtopics\n")
        for st in new_subtopics:
            id_val = st["id"]
            l_id = st["lesson_id"]
            idx = st["subtopic_index"]
            title_esc = st["title"].replace("'", "''")
            code_esc = st["code"].replace("'", "''")
            f.write(
                f"INSERT INTO subtopics (id, lesson_id, subtopic_index, title, code)\n"
                f"VALUES ('{id_val}', '{l_id}', {idx}, '{title_esc}', '{code_esc}')\n"
                f"ON CONFLICT (id) DO UPDATE SET\n"
                f"  title = EXCLUDED.title, code = EXCLUDED.code;\n"
            )

        f.write("\nCOMMIT;\n")
    print(f"Successfully regenerated {SEED_SQL_PATH}.")

if __name__ == "__main__":
    main()
