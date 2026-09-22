#!/usr/bin/env python3
"""
execute_curriculum_sync.py
Executes the generated SQL batches in Supabase via Supabase MCP.
"""
import re

SQL_FILE = "/home/gamp/Documents/lms/scripts/update_database_ai_native.sql"

def get_node_updates():
    with open(SQL_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Split by UPDATE curriculum_nodes
    parts = re.split(r"(UPDATE curriculum_nodes\s+SET\s+title\s*=)", content)
    
    statements = []
    for i in range(1, len(parts), 2):
        stmt = parts[i] + parts[i+1]
        stmt = stmt.strip()
        if stmt:
            statements.append(stmt)
            
    return statements

if __name__ == "__main__":
    stmts = get_node_updates()
    print(f"Total node update statements: {len(stmts)}")
    for idx, s in enumerate(stmts[:5]):
        first_line = s.split("\n")[0]
        id_match = re.search(r"WHERE id = '(node-\d+-\d+)';", s)
        node_id = id_match.group(1) if id_match else "unknown"
        print(f"[{idx+1}] {node_id} -> {first_line[:60]}")
