#!/usr/bin/env python3
"""
sync_curriculum_to_supabase.py
Parses curriculum.md and syncs curriculum_phases and curriculum_nodes directly to Supabase.
"""
import re
import json

CURRICULUM_PATH = "/home/gamp/Documents/lms/curriculum.md"

def parse_curriculum():
    with open(CURRICULUM_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    phase_blocks = list(re.finditer(r"## Phase (\d+): (.*?)\n(.*?)(?=\n## Phase |\Z)", content, re.DOTALL))
    
    phases = []
    nodes = []

    for p_match in phase_blocks:
        p_num = int(p_match.group(1))
        p_title = p_match.group(2).strip()
        p_body = p_match.group(3)

        phase_id = f"phase-{p_num}"
        phases.append({
            "id": phase_id,
            "title": f"Phase {p_num}: {p_title}",
            "order_index": p_num,
            "description": f"Phase {p_num}: {p_title}. Rigorous, scaffolded AI-native software engineering.",
        })

        lesson_blocks = list(re.finditer(
            r"#### Lesson (\d+)\.(\d+): (.*?)\n(.*?)(?=(?:#### Lesson \d+\.\d+:|### Phase |\Z))",
            p_body,
            re.DOTALL
        ))

        for l_match in lesson_blocks:
            lp_num = int(l_match.group(1))
            l_num = int(l_match.group(2))
            l_title = l_match.group(3).strip()
            l_content = l_match.group(4).strip()

            node_id = f"node-{lp_num}-{l_num}"
            slug = f"phase-{lp_num:02d}-lesson-{l_num:02d}-{re.sub(r'[^a-z0-9]+', '-', l_title.lower()).strip('-')}"[:60]

            prereqs_match = re.search(r"- \*\*Prerequisites\*\*: (.*?)\n", l_content)
            prereqs = prereqs_match.group(1).strip() if prereqs_match else "None (Foundational)"

            verif_match = re.search(r"- \*\*Verification & Mastery Check\*\*: (.*?)\n", l_content)
            verif = verif_match.group(1).strip() if verif_match else "Complete test suite passing with 100% assertions"

            proj_match = re.search(r"- \*\*Project Application\*\*: (.*?)\n", l_content)
            proj_app = proj_match.group(1).strip() if proj_match else "AI software application"

            subtopics = re.findall(r"  - `(\d+\.\d+\.\d+)` (.*?)\n", l_content)
            subtopics_list = [f"{code} {desc}" for code, desc in subtopics]

            nodes.append({
                "id": node_id,
                "slug": slug,
                "phase_id": phase_id,
                "title": f"Lesson {lp_num}.{l_num}: {l_title}",
                "subtitle": f"Prerequisites: {prereqs[:100]}",
                "cs_foundation": f"Prerequisites: {prereqs} | Subtopics: {len(subtopics)} items",
                "ai_convergence": proj_app,
                "xp_reward": 100 + (lp_num * 20),
                "handbook_markdown": f"# Lesson {lp_num}.{l_num}: {l_title}\n\n" + l_content,
            })

    return phases, nodes

if __name__ == "__main__":
    phases, nodes = parse_curriculum()
    print(f"Total phases: {len(phases)}, Total nodes: {len(nodes)}")
    phase0_nodes = [n for n in nodes if n["phase_id"] == "phase-0"]
    print(f"Phase 0 nodes: {len(phase0_nodes)}")
    for n in phase0_nodes[20:30]:
        print(n["id"], "->", n["title"])
