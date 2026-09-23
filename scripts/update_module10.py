#!/usr/bin/env python3
"""
scripts/update_module10.py
Updates Module 10 in Supabase:
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

M10_TITLE = "Module 10: Distributed Systems & AI Cluster Consensus"
M10_DESC = "Distributed consensus and AI cluster primitives: Raft state machines, distributed locking for agent swarms, CRDTs, Ring-AllReduce collective communication, ZeRO parameter sharding, and fault-tolerant cluster coordination."

M10_LESSONS = [
    # Block 1: Distributed Foundations & Clocks (10.1 - 10.10)
    (1, "Lesson 10.1: Fallacies of Distributed Computing & Async RPC"),
    (2, "Lesson 10.2: Lamport Logical Clocks & Causal Ordering"),
    (3, "Lesson 10.3: Vector Clocks & Concurrent Conflict Detection"),
    (4, "Lesson 10.4: Distributed State Snapshots & Chandy-Lamport Algorithm"),
    (5, "Lesson 10.5: Quorum Consensus & Sloppy Quorums with Hinted Handoff"),
    (6, "Lesson 10.6: Anti-Entropy Repair using Merkle Trees"),
    (7, "Lesson 10.7: Read Repair & Monotonic Read Guarantees"),
    (8, "Lesson 10.8: CRDT Grow-Only Counter & PN-Counter"),
    (9, "Lesson 10.9: CRDT Observed-Remove Set for Shared State"),
    (10, "Lesson 10.10: CRDT Last-Write-Wins Register for Agent Memory"),

    # Block 2: Raft Consensus Protocol Internals (10.11 - 10.20)
    (11, "Lesson 10.11: Consensus Foundations & State Machine Replication"),
    (12, "Lesson 10.12: Raft Node State Transitions & Randomized Election Timers"),
    (13, "Lesson 10.13: Raft RequestVote RPC & Term Validation Safety"),
    (14, "Lesson 10.14: Raft AppendEntries RPC & Leader Heartbeats"),
    (15, "Lesson 10.15: Raft Log Replication & Commit Index Progression"),
    (16, "Lesson 10.16: Raft Log Inconsistency Repair & Overwrite Rules"),
    (17, "Lesson 10.17: Raft Leader Completeness & Election Safety Invariants"),
    (18, "Lesson 10.18: Raft Joint Consensus for Dynamic Cluster Membership"),
    (19, "Lesson 10.19: Raft Log Compaction & Snapshot Streaming"),
    (20, "Lesson 10.20: Linearizable Read Leases without State Machine Overhead"),

    # Block 3: Cluster Coordination, Membership & Locking (10.21 - 10.30)
    (21, "Lesson 10.21: SWIM Gossip Protocol for Scalable Node Failure Detection"),
    (22, "Lesson 10.22: Phi-Accrual Failure Detector for Unstable Networks"),
    (23, "Lesson 10.23: Distributed Lease Locks for Agent Task Allocation"),
    (24, "Lesson 10.24: Distributed Barrier Synchronization for Batch Workflows"),
    (25, "Lesson 10.25: Distributed Semaphore & Concurrency Rate Throttling"),
    (26, "Lesson 10.26: Two-Phase Commit Coordinator for Multi-Service Writes"),
    (27, "Lesson 10.27: Distributed Transaction Saga Orchestration"),
    (28, "Lesson 10.28: Split-Brain Mitigation & Fencing Token Verification"),
    (29, "Lesson 10.29: Write-Ahead Log Checkpoint & Replay Recovery Engine"),
    (30, "Lesson 10.30: Multi-Leader Replication & Conflict Resolution Policies"),

    # Block 4: Distributed AI Training & GPU Cluster Primitives (10.31 - 10.40)
    (31, "Lesson 10.31: Ring-AllReduce Bandwidth-Optimal Collective Communication"),
    (32, "Lesson 10.32: Parameter Server Architecture vs AllReduce Topologies"),
    (33, "Lesson 10.33: ZeRO Stage 1 Optimizer State Sharding"),
    (34, "Lesson 10.34: ZeRO Stage 2 Gradient Partitioning"),
    (35, "Lesson 10.35: ZeRO Stage 3 Parameter Partitioning & Prefetching"),
    (36, "Lesson 10.36: Tensor Parallelism Column and Row Matrix Splitting"),
    (37, "Lesson 10.37: Pipeline Parallelism 1F1B Scheduling & Activation Stashing"),
    (38, "Lesson 10.38: Distributed Model Checkpointing & Asynchronous Saves"),
    (39, "Lesson 10.39: GPU Interconnect Topology & NVLink Bandwidth Bottlenecks"),
    (40, "Lesson 10.40: Fault-Tolerant Distributed Training Recovery & Elastic Scaling"),

    # Block 5: Distributed AI Serving & Agent Swarms (10.41 - 10.49)
    (41, "Lesson 10.41: Disaggregated LLM Serving & Prefill-Decode Disaggregation"),
    (42, "Lesson 10.42: KV-Cache Cluster Migration & Paged Remote Transfers"),
    (43, "Lesson 10.43: Agent Swarm Majority Voting & Byzantine Filtering"),
    (44, "Lesson 10.44: Distributed Event Bus for Autonomous Agent Swarms"),
    (45, "Lesson 10.45: Multi-Region Leaderless Replication for AI Knowledge Bases"),
    (46, "Lesson 10.46: Distributed Vector Shard Balancing & Re-Indexing"),
    (47, "Lesson 10.47: Distributed Chaos Injection & Network Partition Simulation"),
    (48, "Lesson 10.48: Cluster Observability with OpenTelemetry Traces & Metrics"),
    (49, "Lesson 10.49: Production High-Availability Cluster Runbooks & Recovery"),

    # Block 6: Capstone Project (10.50)
    (50, "Lesson 10.50: Capstone: QuorumCore — Distributed Raft Consensus & Agent State Cluster"),
]

def main():
    print(f"Updating curriculum_phases for module-10...")
    update_phase_sql = f"""
    UPDATE curriculum_phases
    SET title = '{M10_TITLE}',
        description = '{M10_DESC}'
    WHERE id = 'module-10';
    """
    res = run_query(update_phase_sql)
    print("Phase updated:", res)

    print(f"Updating 50 curriculum_nodes for module-10...")
    statements = []
    for order_idx, title in M10_LESSONS:
        clean_title = title.replace("'", "''")
        statements.append(f"""
        UPDATE curriculum_nodes
        SET title = '{clean_title}'
        WHERE phase_id = 'module-10' AND order_index = {order_idx};
        """)

    full_sql = "\n".join(statements)
    res_nodes = run_query(full_sql)
    print("Nodes updated successfully!")

    verify = run_query("SELECT order_index, title FROM curriculum_nodes WHERE phase_id = 'module-10' ORDER BY order_index;")
    print(f"Verification: {len(verify)} nodes returned.")
    print("First 3:", verify[:3])
    print("Last 3:", verify[-3:])

if __name__ == "__main__":
    main()
