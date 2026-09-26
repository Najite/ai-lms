#!/usr/bin/env python3
"""
Generates the 3-part briefing card fields (exercise_about, exercise_goal, expected_output)
for curriculum nodes in Modules 8 through 14.
Preserves existing verified tests.py, starter_code, and test_suite verification fields.
"""

import json
import re

def derive_briefing(node):
    title = node.get("title", "")
    # Strip Lesson X.Y:
    clean_title = re.sub(r"^Lesson\s+\d+\.\d+:\s*", "", title)
    cs = node.get("cs_foundation") or ""
    ai = node.get("ai_convergence") or ""
    ts = node.get("test_suite") or {}
    fm = ts.get("failure_mode") or ""
    vc = ts.get("verification_criteria") or ""
    
    # 1. exercise_about
    if cs:
        about = f"Understand {clean_title} and core mechanisms of {cs.split('|')[-1].strip()}."
    else:
        about = f"Master {clean_title} and production system engineering principles."

    # 2. exercise_goal
    if ai:
        goal = f"{ai.strip()}"
        if not goal.endswith("."):
            goal += "."
    else:
        goal = f"Implement and verify {clean_title} to satisfy all production invariants and automated test cases."

    # 3. expected_output
    if fm:
        expected = f"{fm.strip()}"
        if not expected.endswith("."):
            expected += "."
    elif vc:
        expected = f"Pass test verification: {vc.strip()}."
    else:
        expected = f"Clean execution passing all deterministic unit tests with zero assertion errors."

    return {
        "exercise_about": about,
        "exercise_goal": goal,
        "expected_output": expected
    }

if __name__ == "__main__":
    with open('/home/sawacha/lms/scripts/curriculum_nodes_m8_to_m14.json') as f:
        data = json.load(f)

    for p_id in sorted(data.keys()):
        print(f"=== {p_id} Sample Briefing ===")
        sample = derive_briefing(data[p_id][0])
        print("💡 About:", sample["exercise_about"])
        print("🎯 Goal:", sample["exercise_goal"])
        print("📋 Expected:", sample["expected_output"])
        print()
