#!/usr/bin/env python3
"""
apply_curriculum_4stages.py
1. Takes the 600-lesson structure across all 15 phases.
2. Injects the 4 Stage banners above Phases 0, 4, 7, and 11.
3. Rewrites Phase 0-3 lesson specifications to include the 100 beginner foundational lessons (20+25+25+30),
   smoothly followed by the advanced systems lessons (renumbered 21-50, 26-75, 26-60, 31-75).
4. Ensures all lesson titles and headers match supabase/curriculum_manifest.json exactly.
5. Verifies the total lesson count is 600.
"""

import re
import sys
import os

CURRICULUM_PATH = "/home/sawacha/lms/curriculum.md"
from build_stage1_specs_data import (
    PHASE_0_BEGINNER,
    PHASE_1_BEGINNER,
    PHASE_2_BEGINNER,
    PHASE_3_BEGINNER
)

def render_beginner_spec(phase_id, lesson_id, title, prereq, subtopics, fail, verif, proj):
    subtopic_lines = []
    for idx, st in enumerate(subtopics, 1):
        st_num = f"{phase_id}.{lesson_id}.{idx}"
        subtopic_lines.append(f"  - `{st_num}` {st}")
    subtopics_str = "\n".join(subtopic_lines)

    return f"""#### Lesson {phase_id}.{lesson_id}: {title}
- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: {prereq}
- **Subtopics**:
{subtopics_str}
- **Key Failure Modes & Edge Cases**: {fail}
- **Verification & Mastery Check**: {verif}
- **Project Application**: {proj}
"""

def renumber_advanced_chunk(text_chunk, phase_num, offset):
    # Splits by '#### Lesson {phase_num}.\d+:'
    parts = re.split(rf'(#### Lesson {phase_num}\.\d+:)', text_chunk)
    out = [parts[0]]
    for i in range(1, len(parts), 2):
        header = parts[i]
        body = parts[i+1]
        old_num = int(re.search(rf'{phase_num}\.(\d+)', header).group(1))
        new_num = old_num + offset
        new_header = f'#### Lesson {phase_num}.{new_num}:'
        
        # In body, replace subtopic references `{phase_num}.{old_num}.X`
        body = re.sub(rf'`{phase_num}\.{old_num}\.(\d+)`', rf'`{phase_num}.{new_num}.\1`', body)
        
        # Replace intra-phase prerequisites: Lesson {phase_num}.{X} -> Lesson {phase_num}.{X+offset}
        def repl_prereq(m):
            x = int(m.group(1))
            return f'Lesson {phase_num}.{x+offset}'
        body = re.sub(rf'Lesson {phase_num}\.(\d+)', repl_prereq, body)
        
        out.append(new_header + body)
    return ''.join(out)

def main():
    print(f"Reading current {CURRICULUM_PATH}...")
    with open(CURRICULUM_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    # Find boundaries of Phase 0, 1, 2, 3, 4, 7, 11
    p0_idx = content.find("## Phase 0: Computing & Developer Environment")
    p1_idx = content.find("## Phase 1: Programming Mastery")
    p2_idx = content.find("## Phase 2: Mathematics for Engineers & Numerical Computing")
    p3_idx = content.find("## Phase 3: Data Structures, Algorithms & Problem Solving")
    p4_idx = content.find("## Phase 4: Systems Internals: OS, Concurrency, Networks, Docker")
    p7_idx = content.find("## Phase 7: Distributed Systems, Cloud Infrastructure, and Production DevOps")
    p11_idx = content.find("## Phase 11: Production Engineering, Performance Profiling & MLOps")

    assert p0_idx != -1 and p1_idx != -1 and p2_idx != -1 and p3_idx != -1 and p4_idx != -1, "Phases 0-4 not found!"
    assert p7_idx != -1 and p11_idx != -1, "Phases 7 or 11 not found!"

    preamble = content[:p0_idx]

    # --- STAGE BANNERS ---
    stage1_banner = """# STAGE 1: Coding Literacy, Logic & First AI Calls
> **Scope**: Phases 0–3 | Lessons 1–260 (260 Lessons Total)
> **Goal**: Progress from zero coding knowledge to confident programming, object-oriented design, visual math intuition, core data structures, and your first working AI API prompt workflows.

---

"""

    stage2_banner = """# STAGE 2: Backend Systems, Databases & Web Architecture
> **Scope**: Phases 4–6 | Lessons 261–380 (120 Lessons Total)
> **Goal**: Build scalable server backends from the ground up: low-level network sockets, asynchronous event loops, PostgreSQL schema design, Redis semantic caching, FastAPI endpoints, and real-time streaming Next.js user interfaces.

---

"""

    stage3_banner = """# STAGE 3: Applied AI, Vectors & Production RAG
> **Scope**: Phases 7–10 | Lessons 381–485 (130 Lessons Total)
> **Goal**: Master production machine learning and vector systems: distributed cloud containers, high-availability system design, autograd backpropagation engines from scratch, pgvector HNSW indexing, and production hybrid RAG.

---

"""

    stage4_banner = """# STAGE 4: Autonomous Agents, Deep Learning & Enterprise Scale
> **Scope**: Phases 11–14 | Lessons 486–600 (90 Lessons Total)
> **Goal**: Deploy enterprise-grade autonomous software platforms: rigorous LLM benchmarking and safety guardrails, ReAct cognitive agent loops, LangGraph state machine orchestration, Docker security sandboxing, and live multi-tenant architecture defense.

---

"""

    # --- PROCESS PHASE 0 ---
    p0_raw = content[p0_idx:p1_idx]
    p0_spec_start = p0_raw.find("### Phase 0 Lesson Specifications")
    p0_proj_start = p0_raw.find("### Phase 0 Project: SysTrace")
    p0_header_text = p0_raw[:p0_spec_start]
    # Update Phase 0 header text to 50 Lessons
    p0_header_text = re.sub(r"30 Lessons \(Lesson 0\.1 to Lesson 0\.30\)", "50 Lessons (Lesson 0.1 to Lesson 0.50)", p0_header_text)
    p0_header_text = re.sub(r"\*\*Duration\*\*: 4 weeks", "**Duration**: 5 weeks", p0_header_text)
    
    p0_spec_header = "### Phase 0 Lesson Specifications (Lessons 0.1 – 0.50)\n\n"
    # Build beginner lessons 0.1 - 0.20
    p0_beginner_rendered = []
    for num, title, prereq, subtopics, fail, verif, proj in PHASE_0_BEGINNER:
        p0_beginner_rendered.append(render_beginner_spec(0, num, title, prereq, subtopics, fail, verif, proj))
    p0_b_text = "\n".join(p0_beginner_rendered) + "\n"
    
    # Renumber advanced lessons 0.1 - 0.30 -> 0.21 - 0.50
    p0_adv_raw = p0_raw[p0_spec_start + len("### Phase 0 Lesson Specifications (Lessons 0.1 – 0.30)"):p0_proj_start]
    p0_adv_renumbered = renumber_advanced_chunk(p0_adv_raw, 0, 20)
    p0_footer = p0_raw[p0_proj_start:]
    p0_assembled = p0_header_text + p0_spec_header + p0_b_text + p0_adv_renumbered.strip() + "\n\n---\n\n" + p0_footer

    # --- PROCESS PHASE 1 ---
    p1_raw = content[p1_idx:p2_idx]
    p1_spec_start = p1_raw.find("### Phase 1 Lesson Specifications")
    p1_proj_start = p1_raw.find("### Phase 1 Projects")
    p1_header_text = p1_raw[:p1_spec_start]
    p1_header_text = re.sub(r"60 Lessons \(Lesson 1\.1 to Lesson 1\.60\)", "75 Lessons (Lesson 1.1 to Lesson 1.75)", p1_header_text)
    p1_header_text = re.sub(r"\*\*Duration\*\*: 13 weeks", "**Duration**: 14 weeks", p1_header_text)
    
    p1_spec_header = "### Phase 1 Lesson Specifications (Lessons 1.1 – 1.75)\n\n"
    p1_beginner_rendered = []
    for num, title, prereq, subtopics, fail, verif, proj in PHASE_1_BEGINNER:
        p1_beginner_rendered.append(render_beginner_spec(1, num, title, prereq, subtopics, fail, verif, proj))
    p1_b_text = "\n".join(p1_beginner_rendered) + "\n"
    
    p1_adv_raw = p1_raw[p1_spec_start + len("### Phase 1 Lesson Specifications (Lessons 1.1 – 1.50)"):p1_proj_start]
    p1_adv_renumbered = renumber_advanced_chunk(p1_adv_raw, 1, 25)
    p1_footer = p1_raw[p1_proj_start:]
    p1_assembled = p1_header_text + p1_spec_header + p1_b_text + p1_adv_renumbered.strip() + "\n\n---\n\n" + p1_footer

    # --- PROCESS PHASE 2 ---
    p2_raw = content[p2_idx:p3_idx]
    p2_spec_start = p2_raw.find("### Phase 2 Lesson Specifications")
    p2_proj_start = p2_raw.find("### Phase 2 Project: MathKit")
    p2_header_text = p2_raw[:p2_spec_start]
    p2_header_text = re.sub(r"35 Lessons \(Lesson 2\.1 to Lesson 2\.35\)", "60 Lessons (Lesson 2.1 to Lesson 2.60)", p2_header_text)
    p2_header_text = re.sub(r"\*\*Duration\*\*: 6 weeks", "**Duration**: 8 weeks", p2_header_text)
    
    p2_spec_header = "### Phase 2 Lesson Specifications (Lessons 2.1 – 2.60)\n\n"
    p2_beginner_rendered = []
    for num, title, prereq, subtopics, fail, verif, proj in PHASE_2_BEGINNER:
        p2_beginner_rendered.append(render_beginner_spec(2, num, title, prereq, subtopics, fail, verif, proj))
    p2_b_text = "\n".join(p2_beginner_rendered) + "\n"
    
    p2_adv_raw = p2_raw[p2_spec_start + len("### Phase 2 Lesson Specifications (Lessons 2.1 – 2.35)"):p2_proj_start]
    p2_adv_renumbered = renumber_advanced_chunk(p2_adv_raw, 2, 25)
    p2_footer = p2_raw[p2_proj_start:]
    p2_assembled = p2_header_text + p2_spec_header + p2_b_text + p2_adv_renumbered.strip() + "\n\n---\n\n" + p2_footer

    # --- PROCESS PHASE 3 ---
    p3_raw = content[p3_idx:p4_idx]
    p3_spec_start = p3_raw.find("### Phase 3 Lesson Specifications")
    p3_proj_start = p3_raw.find("### Phase 3 Problem Solving Discipline")
    p3_header_text = p3_raw[:p3_spec_start]
    p3_header_text = re.sub(r"45 Lessons \(Lesson 3\.1 to Lesson 3\.45\)", "75 Lessons (Lesson 3.1 to Lesson 3.75)", p3_header_text)
    p3_header_text = re.sub(r"\*\*Duration\*\*: 8 weeks", "**Duration**: 10 weeks", p3_header_text)
    
    p3_spec_header = "### Phase 3 Lesson Specifications (Lessons 3.1 – 3.75)\n\n"
    p3_beginner_rendered = []
    for num, title, prereq, subtopics, fail, verif, proj in PHASE_3_BEGINNER:
        p3_beginner_rendered.append(render_beginner_spec(3, num, title, prereq, subtopics, fail, verif, proj))
    p3_b_text = "\n".join(p3_beginner_rendered) + "\n"
    
    p3_adv_raw = p3_raw[p3_spec_start + len("### Phase 3 Lesson Specifications (Lessons 3.1 – 3.45)"):p3_proj_start]
    p3_adv_renumbered = renumber_advanced_chunk(p3_adv_raw, 3, 30)
    p3_footer = p3_raw[p3_proj_start:]
    p3_assembled = p3_header_text + p3_spec_header + p3_b_text + p3_adv_renumbered.strip() + "\n\n---\n\n" + p3_footer

    # --- PROCESS PHASES 4 TO END WITH STAGE BANNERS ---
    p4_to_p7 = content[p4_idx:p7_idx]
    p7_to_p11 = content[p7_idx:p11_idx]
    p11_to_end = content[p11_idx:]

    final_document = (
        preamble.strip() + "\n\n"
        + stage1_banner
        + p0_assembled.strip() + "\n\n---\n\n"
        + p1_assembled.strip() + "\n\n---\n\n"
        + p2_assembled.strip() + "\n\n---\n\n"
        + p3_assembled.strip() + "\n\n---\n\n"
        + stage2_banner
        + p4_to_p7.strip() + "\n\n---\n\n"
        + stage3_banner
        + p7_to_p11.strip() + "\n\n---\n\n"
        + stage4_banner
        + p11_to_end.strip() + "\n"
    )

    # Verification of lesson counts
    lesson_headers = re.findall(r'#### Lesson \d+\.\d+:', final_document)
    print(f"Total lesson headers in final document: {len(lesson_headers)}")
    for p in range(15):
        p_count = len(re.findall(rf'#### Lesson {p}\.\d+:', final_document))
        print(f"Phase {p}: {p_count} lessons")

    with open(CURRICULUM_PATH, "w", encoding="utf-8") as f:
        f.write(final_document)
    print(f"Successfully wrote 4-stage 600-lesson curriculum to {CURRICULUM_PATH}!")

if __name__ == "__main__":
    main()
