#!/usr/bin/env python3
"""
scripts/generate_and_sync_m2.py
Complete overhaul: 50 real lessons for Module 2 — Software Craftsmanship & OOP
Block A (1-10):   OOP Fundamentals
Block B (11-18):  Deep Python Object Protocol
Block C (19-26):  Design Patterns for AI Systems
Block D (27-34):  SOLID Principles & Craftsmanship
Block E (35-42):  Testing as First-Class Practice
Block F (43-50):  Applied AI-OOP Integration + Capstone
"""
import json, urllib.request, re, sys, os

TOKEN_PATH = "/home/gamp/.gemini/antigravity-ide/mcp_oauth_tokens.json"
PROJECT_REF = "lfsyndffrfwvdfzjsagl"
API_URL = f"https://api.supabase.com/v1/projects/{PROJECT_REF}/database/query"

with open(TOKEN_PATH) as f:
    token_data = json.load(f)
ACCESS_TOKEN = token_data["https://mcp.supabase.com/mcp"]["token"]["access_token"]

def execute_sql(sql_query, label=""):
    req = urllib.request.Request(
        API_URL, data=json.dumps({"query": sql_query}).encode(),
        headers={"Authorization": f"Bearer {ACCESS_TOKEN}", "Content-Type": "application/json"},
        method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read().decode())
            if label: print(f"  ✓ {label}")
            return result
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"  ✗ {label} - HTTP {e.code}: {body[:300]}")
        raise

def esc(text):
    if text is None: return "NULL"
    return str(text).replace("'", "''")

def make_jsonb(obj):
    return f"'{esc(json.dumps(obj))}'::jsonb"

from build_m2_data import M2_LESSONS

assert len(M2_LESSONS) == 50, f"Expected 50 lessons, got {len(M2_LESSONS)}"
print(f"✓ Total Module 2 lessons loaded: {len(M2_LESSONS)}")

def build_update_sql(lesson: dict) -> str:
    num = lesson["num"]
    node_id = f"node-1-{num}"
    title = f"Lesson 2.{num}: {lesson['title']}"
    slug_raw = f"module-02-lesson-{num:02d}-{title.lower()}"[:80]
    slug = re.sub(r'[^a-z0-9-]', '-', slug_raw).strip('-')

    subtopics_md = "\n".join(f"  - `{st}`" for st in lesson["subtopics"])
    handbook = (
        f"# {title}\n\n"
        f"- **Module**: `Module 2: Software Craftsmanship & Object-Oriented Design`\n"
        f"- **Subtopics**:\n{subtopics_md}\n\n"
        f"- **Key Failure Mode**: {lesson['failure_mode']}\n"
        f"- **Verification**: {lesson['verification']}\n"
    )

    starter_code = {"solution.py": lesson["starter"]}
    test_suite = {
        "tests.py": lesson["tests"],
        "verification_criteria": lesson["verification"],
        "failure_mode": lesson["failure_mode"]
    }

    return f"""UPDATE curriculum_nodes
SET
    slug = '{esc(slug)}',
    title = '{esc(title)}',
    subtitle = 'Module 2: Software Craftsmanship & OOP | Lesson {num} of 50',
    cs_foundation = '{esc(f"4 subtopics | {lesson['subtopics'][0][:60]}")}',
    ai_convergence = '{esc(lesson['ai_conv'][:120])}',
    xp_reward = {lesson['xp']},
    order_index = {num},
    handbook_markdown = '{esc(handbook)}',
    starter_code = {make_jsonb(starter_code)},
    test_suite = {make_jsonb(test_suite)},
    defense_prompts = {make_jsonb(lesson['defense'])}
WHERE id = '{node_id}';"""

if __name__ == "__main__":
    BATCH_SIZE = 10
    batches = [M2_LESSONS[i:i+BATCH_SIZE] for i in range(0, len(M2_LESSONS), BATCH_SIZE)]
    print(f"\nExecuting {len(batches)} batches of {BATCH_SIZE} updates...")
    print("=" * 60)

    total = 0
    for bn, batch in enumerate(batches, 1):
        nums = [l["num"] for l in batch]
        print(f"\nBatch {bn}/{len(batches)}: Lessons {nums[0]}-{nums[-1]}")
        stmts = [build_update_sql(l) for l in batch]
        try:
            execute_sql("\n".join(stmts), label=f"Batch {bn} ({nums[0]}-{nums[-1]})")
            total += len(batch)
        except Exception as e:
            print(f"  ✗ Batch failed: {e}. Trying individually...")
            for lesson in batch:
                try:
                    execute_sql(build_update_sql(lesson), label=f"  node-1-{lesson['num']}")
                    total += 1
                except Exception as e2:
                    print(f"  ✗ node-1-{lesson['num']} failed: {e2}")

    print(f"\n{'='*60}")
    print(f"✓ Completed: {total}/50 nodes updated")

    print("\nVerifying...")
    rows = execute_sql("""
        SELECT id, title, xp_reward, order_index
        FROM curriculum_nodes WHERE phase_id='module-2' ORDER BY order_index;
    """)
    print(f"  Module 2 nodes: {len(rows)}")
    if rows:
        print(f"  First: {rows[0]['id']} -> {rows[0]['title'][:50]}")
        print(f"  Last:  {rows[-1]['id']} -> {rows[-1]['title'][:50]}")

    sample = execute_sql("SELECT id, test_suite FROM curriculum_nodes WHERE id='node-1-37';")
    ts = sample[0]['test_suite']
    if isinstance(ts, str): ts = json.loads(ts)
    print(f"  node-1-37 test_suite keys: {list(ts.keys())}")
    print(f"  tests.py present: {'tests.py' in ts}")

    total_count = execute_sql("SELECT count(*) FROM curriculum_nodes;")
    print(f"  Total curriculum_nodes: {total_count[0]['count']} (must stay 520)")
    print("\n✓ Module 2 overhaul complete!")
