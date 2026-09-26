#!/usr/bin/env python3
"""
Directly updates all curriculum nodes across Modules 8 through 14 in Supabase.
Applies:
1. Complete 3-Part Briefing Card schema (exercise_about, exercise_goal, expected_output) to test_suite.
2. Preserves all verified starter_code and test_suite['tests.py'].
3. Updates Supabase via REST API using SUPABASE_SERVICE_ROLE_KEY.
"""

import urllib.request
import json
import os
import re

env_vars = {}
with open('/home/sawacha/lms/.env') as f:
    for line in f:
        if '=' in line and not line.startswith('#'):
            k, v = line.strip().split('=', 1)
            env_vars[k] = v.strip('\"\'')

SUPABASE_URL = env_vars.get('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = env_vars.get('SUPABASE_SERVICE_ROLE_KEY')

with open('/home/sawacha/lms/scripts/curriculum_nodes_m8_to_m14.json') as f:
    data = json.load(f)

def derive_briefing(node):
    title = node.get("title", "")
    clean_title = re.sub(r"^Lesson\s+\d+\.\d+:\s*", "", title)
    cs = node.get("cs_foundation") or ""
    ai = node.get("ai_convergence") or ""
    ts = node.get("test_suite") or {}
    fm = ts.get("failure_mode") or ""
    vc = ts.get("verification_criteria") or ""
    
    if cs:
        cs_clean = cs.split('|')[-1].strip()
        about = f"Understand {clean_title} and core mechanisms of {cs_clean}."
    else:
        about = f"Master {clean_title} and production system engineering principles."

    if ai:
        goal = f"{ai.strip()}"
        if not goal.endswith("."):
            goal += "."
    else:
        goal = f"Implement and verify {clean_title} to satisfy all production invariants and automated test cases."

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

total_patched = 0
total_failed = 0

for p_num in range(8, 15):
    p_id = f'module-{p_num}'
    nodes = data.get(p_id, [])
    print(f"\n==========================================")
    print(f"Patching {p_id} ({len(nodes)} nodes)...")
    print(f"==========================================")
    
    for n in nodes:
        node_id = n["id"]
        title = n.get("title", "")
        ts = n.get("test_suite") or {}
        briefing = derive_briefing(n)
        
        # Merge briefing into test_suite
        updated_ts = {**ts, **briefing}
        
        payload = {
            "test_suite": updated_ts
        }
        
        body = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1/curriculum_nodes?id=eq.{node_id}",
            data=body,
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            },
            method="PATCH"
        )
        
        try:
            with urllib.request.urlopen(req) as resp:
                if resp.status in (200, 204):
                    print(f"✓ Patched {node_id} ({title})")
                    total_patched += 1
                else:
                    print(f"✗ Unexpected status {resp.status} for {node_id}")
                    total_failed += 1
        except Exception as e:
            print(f"✗ Failed {node_id}: {e}")
            total_failed += 1

print(f"\nCompleted patching! Total patched: {total_patched}, Total failed: {total_failed}")
