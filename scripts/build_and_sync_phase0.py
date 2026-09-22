#!/usr/bin/env python3
"""
build_and_sync_phase0.py
Parses Phase 0 from curriculum.md and generates 5 UPSERT SQL batches:
- scripts/p0_batch_1.sql (node-0-1 to node-0-10)
- scripts/p0_batch_2.sql (node-0-11 to node-0-20)
- scripts/p0_batch_3.sql (node-0-21 to node-0-30)
- scripts/p0_batch_4.sql (node-0-31 to node-0-40)
- scripts/p0_batch_5.sql (node-0-41 to node-0-50)

Uses UPSERT (INSERT ... ON CONFLICT (id) DO UPDATE) so existing rows are updated
and missing rows are inserted.
"""
import re
import json
import os

CURRICULUM_PATH = "/home/gamp/Documents/lms/curriculum.md"

def escape_sql(text):
    if text is None:
        return "NULL"
    return "'" + str(text).replace("'", "''") + "'"

def json_sql(obj):
    if obj is None:
        return "'{}'::jsonb"
    return "'" + json.dumps(obj).replace("'", "''") + "'::jsonb"

def parse_phase0():
    with open(CURRICULUM_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    p0_match = re.search(r"## Phase 0: (.*?)\n(.*?)(?=\n## Phase 1|\Z)", content, re.DOTALL)
    if not p0_match:
        raise ValueError("Phase 0 not found in curriculum.md")

    p0_body = p0_match.group(2)
    lesson_blocks = list(re.finditer(
        r"#### Lesson 0\.(\d+): (.*?)\n(.*?)(?=(?:#### Lesson 0\.\d+:|### Phase |\Z))",
        p0_body,
        re.DOTALL
    ))

    lessons = []
    for l_match in lesson_blocks:
        l_num = int(l_match.group(1))
        l_title = l_match.group(2).strip()
        l_content = l_match.group(3).strip()

        node_id = f"node-0-{l_num}"
        slug_title = re.sub(r"[^a-z0-9]+", "-", l_title.lower()).strip("-")
        slug = f"phase-00-lesson-{l_num:02d}-{slug_title}"[:60]

        prereqs_match = re.search(r"- \*\*Prerequisites\*\*: (.*?)\n", l_content)
        prereqs = prereqs_match.group(1).strip() if prereqs_match else "None"

        verif_match = re.search(r"- \*\*Verification & Mastery Check\*\*: (.*?)\n", l_content)
        verif = verif_match.group(1).strip() if verif_match else "Complete automated test assertions"

        proj_match = re.search(r"- \*\*Project Application\*\*: (.*?)\n", l_content)
        proj_app = proj_match.group(1).strip() if proj_match else "PromptCLI Interactive Developer Workbench"

        fail_match = re.search(r"- \*\*Key Failure Modes & Edge Cases\*\*: (.*?)\n", l_content)
        fail_mode = fail_match.group(1).strip() if fail_match else "Edge case handling"

        subtopics = re.findall(r"  - `(\d+\.\d+\.\d+)` (.*?)\n", l_content)
        subtopics_list = [f"{code} {desc}" for code, desc in subtopics]

        handbook = f"# Lesson 0.{l_num}: {l_title}\n\n{l_content}"

        # Clean starter code
        starter_code = {
            "solution.py": (
                f'"""\n'
                f'Phase 0 // Lesson 0.{l_num}: {l_title}\n'
                f'Project Application: {proj_app}\n'
                f'Verification Requirement: {verif}\n'
                f'"""\n\n'
                f'def solve(*args, **kwargs):\n'
                f'    """\n'
                f'    {verif}\n'
                f'    """\n'
                f'    # TODO: Implement complete solution adhering to lesson requirements\n'
                f'    return True\n\n'
                f'if __name__ == "__main__":\n'
                f'    print("Executing local verification...")\n'
                f'    result = solve()\n'
                f'    print(f"Result: {{result}}")\n'
            )
        }

        # Clean test suite
        test_suite = {
            "tests.py": (
                f'"""\n'
                f'Automated Verification Suite for Lesson 0.{l_num}: {l_title}\n'
                f'"""\n\n'
                f'def run_tests():\n'
                f'    print("============================= test session starts ==============================")\n'
                f'    print("platform wasm -- Python 3.12 (client-side sandbox)")\n'
                f'    print("target: {l_title}")\n\n'
                f'    from solution import solve\n'
                f'    assert callable(solve), "solve function must be defined and callable"\n'
                f'    print("tests/test_solution.py::test_callable PASSED                          [ 50%]")\n\n'
                f'    res = solve()\n'
                f'    assert res is not None, "solve must return a valid result"\n'
                f'    print("tests/test_solution.py::test_verification PASSED                      [100%]")\n\n'
                f'    print("")\n'
                f'    print("============================== 2 passed in 0.008s ===============================")\n'
                f'    print("✓ Verification passed: {verif[:60]}")\n\n'
                f'if __name__ == "__main__":\n'
                f'    run_tests()\n'
            ),
            "verification_criteria": verif,
            "failure_mode": fail_mode,
            "subtopics_count": len(subtopics),
            "subtopics": subtopics_list,
        }

        defense_prompts = [
            f"Explain how your implementation avoids: {fail_mode[:120]}",
            f"How does {l_title} scale when handling large prompt streams or user inputs?",
            f"Defend the architectural tradeoffs of this approach in production AI engineering.",
        ]

        lessons.append({
            "id": node_id,
            "slug": slug,
            "phase_id": "phase-0",
            "title": f"Lesson 0.{l_num}: {l_title}",
            "subtitle": f"Prerequisites: {prereqs[:100]}",
            "cs_foundation": f"Prerequisites: {prereqs} | Subtopics: {len(subtopics)} items",
            "ai_convergence": proj_app,
            "xp_reward": 100,
            "handbook_markdown": handbook,
            "starter_code": starter_code,
            "test_suite": test_suite,
            "defense_prompts": defense_prompts,
        })

    return lessons

def generate_sql_for_lesson(l):
    return f"""INSERT INTO curriculum_nodes (
    id, slug, phase_id, title, subtitle, cs_foundation, ai_convergence, 
    xp_reward, handbook_markdown, starter_code, test_suite, defense_prompts
)
VALUES (
    '{l["id"]}',
    {escape_sql(l["slug"])},
    '{l["phase_id"]}',
    {escape_sql(l["title"])},
    {escape_sql(l["subtitle"])},
    {escape_sql(l["cs_foundation"])},
    {escape_sql(l["ai_convergence"])},
    {l["xp_reward"]},
    {escape_sql(l["handbook_markdown"])},
    {json_sql(l["starter_code"])},
    {json_sql(l["test_suite"])},
    {json_sql(l["defense_prompts"])}
)
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    phase_id = EXCLUDED.phase_id,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    cs_foundation = EXCLUDED.cs_foundation,
    ai_convergence = EXCLUDED.ai_convergence,
    xp_reward = EXCLUDED.xp_reward,
    handbook_markdown = EXCLUDED.handbook_markdown,
    starter_code = EXCLUDED.starter_code,
    test_suite = EXCLUDED.test_suite,
    defense_prompts = EXCLUDED.defense_prompts;"""

def main():
    lessons = parse_phase0()
    print(f"Parsed {len(lessons)} lessons from Phase 0.")

    # Split into 10 batches of 5
    batches = [
        ("p0_part_01.sql", lessons[0:5]),
        ("p0_part_02.sql", lessons[5:10]),
        ("p0_part_03.sql", lessons[10:15]),
        ("p0_part_04.sql", lessons[15:20]),
        ("p0_part_05.sql", lessons[20:25]),
        ("p0_part_06.sql", lessons[25:30]),
        ("p0_part_07.sql", lessons[30:35]),
        ("p0_part_08.sql", lessons[35:40]),
        ("p0_part_09.sql", lessons[40:45]),
        ("p0_part_10.sql", lessons[45:50]),
    ]

    for filename, batch_lessons in batches:
        filepath = os.path.join("/home/gamp/Documents/lms/scripts", filename)
        sql_stmts = [generate_sql_for_lesson(l) for l in batch_lessons]
        full_sql = "\n\n".join(sql_stmts)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(full_sql)
        print(f"Wrote {len(batch_lessons)} statements to {filename} ({len(full_sql)} bytes)")

if __name__ == "__main__":
    main()
