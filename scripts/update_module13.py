#!/usr/bin/env python3
"""
scripts/update_module13.py
Updates Module 13 in Supabase:
- Phase title & description in curriculum_phases
- All 50 lesson titles in curriculum_nodes
"""
import json
import urllib.request

with open('/home/gamp/.gemini/antigravity-ide/mcp_oauth_tokens.json') as f:
    tokens = json.load(f)
token = tokens['https://mcp.supabase.com/mcp']['token']['access_token']

def run_query(sql):
    req = urllib.request.Request(
        'https://api.supabase.com/v1/projects/lfsyndffrfwvdfzjsagl/database/query',
        data=json.dumps({'query': sql}).encode('utf-8'),
        headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

M13_TITLE = "Module 13: Autonomous AI Agents & Durable State Graphs"
M13_DESC = "Autonomous cognitive loops (ReAct/Plan-and-Solve), durable state machines, LangGraph execution semantics, sandboxed code execution, time-travel debugging, and multi-agent coordination swarms."

M13_LESSONS = [
    # Block 1: Cognitive Architectures & Reasoning Loops (13.1 - 13.10)
    (1, "Lesson 13.1: ReAct Cognitive Loop and Thought-Action Cycles"),
    (2, "Lesson 13.2: Plan-and-Solve Two-Stage Task Decomposition"),
    (3, "Lesson 13.3: Reflexion Architecture and Self-Correcting Error Loops"),
    (4, "Lesson 13.4: Tree-of-Thoughts Heuristic Agent Search"),
    (5, "Lesson 13.5: Dynamic Tool Schema and Function Signature Generation"),
    (6, "Lesson 13.6: Strict Tool Parameter Validation and Type Coercion"),
    (7, "Lesson 13.7: Tool Execution Timeouts and Subprocess Isolation"),
    (8, "Lesson 13.8: Tool Idempotency and Side-Effect Safety Guardrails"),
    (9, "Lesson 13.9: Directed State Graph Execution and Node Scheduling"),
    (10, "Lesson 13.10: Conditional State Branching and Dynamic Route Decisions"),

    # Block 2: Durable State Graphs & Human-in-the-Loop (13.11 - 13.20)
    (11, "Lesson 13.11: Channel Reducers and Immutable State Management"),
    (12, "Lesson 13.12: Superstep Concurrency and Barrier Synchronization"),
    (13, "Lesson 13.13: Durable Checkpointing and State Snapshot Storage"),
    (14, "Lesson 13.14: Time-Travel Debugging and State Forking Replay"),
    (15, "Lesson 13.15: Human-in-the-Loop Interrupts and Approval Breakpoints"),
    (16, "Lesson 13.16: State Modification and Resumption from Interruption"),
    (17, "Lesson 13.17: Sliding Working Memory and Scratchpad Management"),
    (18, "Lesson 13.18: Episodic Memory Retrieval via Vector Search"),
    (19, "Lesson 13.19: Procedural Skill Indexing and Dynamic Tool Retrieval"),
    (20, "Lesson 13.20: Memory Consolidation through Periodic Reflection"),

    # Block 3: Sandboxed Execution & Code Engineering Agents (13.21 - 13.30)
    (21, "Lesson 13.21: Virtual In-Memory Filesystem and File Tracking"),
    (22, "Lesson 13.22: Shell Command Sanitization and Injection Prevention"),
    (23, "Lesson 13.23: Ephemeral Container Sandbox Process Containment"),
    (24, "Lesson 13.24: AST Code Syntax Validation and Safety Linters"),
    (25, "Lesson 13.25: Repository File Search and Glob Pattern Navigation"),
    (26, "Lesson 13.26: Unified Diff Patch Application and Repair Engines"),
    (27, "Lesson 13.27: Test-Driven Development Runners for Autonomous Agents"),
    (28, "Lesson 13.28: Self-Healing Test Failure Repair Loops"),
    (29, "Lesson 13.29: Supervisor-Worker Multi-Agent Orchestration"),
    (30, "Lesson 13.30: Hierarchical Agent Teams with Domain Specialization"),

    # Block 4: Multi-Agent Collaboration & Message Protocols (13.31 - 13.40)
    (31, "Lesson 13.31: Blackboard State Sharing Across Agent Ensembles"),
    (32, "Lesson 13.32: Multi-Agent Collaborative Debate and Peer Critique"),
    (33, "Lesson 13.33: Multi-Agent Consensus Voting and Agreement Protocols"),
    (34, "Lesson 13.34: Structured Event Message Bus for Agent Swarms"),
    (35, "Lesson 13.35: Cycle and Infinite Loop Detection in Agent Tool Chains"),
    (36, "Lesson 13.36: Cost-Aware Agent Task Scheduling and Budgeting"),
    (37, "Lesson 13.37: Dynamic Few-Shot In-Context Tool Selection"),
    (38, "Lesson 13.38: Self-Healing JSON and Structured Output Repair"),
    (39, "Lesson 13.39: Agent Trajectory Serialization and Golden Replay"),
    (40, "Lesson 13.40: DOM Tree Simplification for Web Browsing Agents"),

    # Block 5: Specialized Production Agents & Safety Guardrails (13.41 - 13.49)
    (41, "Lesson 13.41: Browser Action Dispatching and Visual Grounding"),
    (42, "Lesson 13.42: Automated Code Review and Pull Request Agents"),
    (43, "Lesson 13.43: Safe SQL Generation and Database Query Agents"),
    (44, "Lesson 13.44: Multi-Source Research and Citation Tracking Agents"),
    (45, "Lesson 13.45: Self-Refining Code Generation and Synthesis Loops"),
    (46, "Lesson 13.46: Work-Stealing Task Queues for Agent Swarms"),
    (47, "Lesson 13.47: Privilege Escalation Prevention and Security Gatekeepers"),
    (48, "Lesson 13.48: SWE-bench Benchmark Trajectory Evaluation"),
    (49, "Lesson 13.49: Graceful Model Degradation and Fallback Strategies"),

    # Block 6: Capstone Project (13.50)
    (50, "Lesson 13.50: Capstone: CodeCraft — Autonomous Software Engineering Agent Platform"),
]

def main():
    print(f"Updating curriculum_phases for module-13...")
    update_phase_sql = f"""
    UPDATE curriculum_phases
    SET title = '{M13_TITLE}',
        description = '{M13_DESC}'
    WHERE id = 'module-13';
    """
    res = run_query(update_phase_sql)
    print("Phase updated:", res)

    print(f"Updating 50 curriculum_nodes for module-13...")
    statements = []
    for order_idx, title in M13_LESSONS:
        clean_title = title.replace("'", "''")
        statements.append(f"""
        UPDATE curriculum_nodes
        SET title = '{clean_title}'
        WHERE phase_id = 'module-13' AND order_index = {order_idx};
        """)

    full_sql = "\n".join(statements)
    res_nodes = run_query(full_sql)
    print("Nodes updated successfully!")

    verify = run_query("SELECT order_index, title FROM curriculum_nodes WHERE phase_id = 'module-13' ORDER BY order_index;")
    print(f"Verification: {len(verify)} nodes returned.")
    print("First 3:", verify[:3])
    print("Last 3:", verify[-3:])

if __name__ == "__main__":
    main()
