#!/usr/bin/env python3
"""
split_sql_batches.py
Writes the 50 UPDATE statements into 5 cleanly sized SQL batch files of 10 statements each.
"""
from execute_curriculum_sync import get_node_updates

stmts = get_node_updates()
batch_size = 10

for b_idx in range(0, len(stmts), batch_size):
    batch = stmts[b_idx : b_idx + batch_size]
    filename = f"/home/gamp/Documents/lms/scripts/batch_{b_idx//batch_size + 1}.sql"
    with open(filename, "w", encoding="utf-8") as f:
        f.write("\n\n".join(batch))
    print(f"Wrote batch {b_idx//batch_size + 1} with {len(batch)} statements to {filename}")
