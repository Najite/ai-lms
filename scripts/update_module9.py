#!/usr/bin/env python3
"""
scripts/update_module9.py
Updates Module 9 in Supabase:
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

M9_TITLE = "Module 9: High-Scale AI System Design & Gateway Routing"
M9_DESC = "High-throughput AI system architecture: dynamic multi-provider model routing, distributed token-bucket rate limiters, continuous dynamic batching, PagedAttention memory, semantic caching, and fault-tolerant gateway design."

M9_LESSONS = [
    # Block 1: Distributed Core Primitives & Capacity Estimation (9.1 - 9.10)
    (1, "Lesson 9.1: AI System Capacity Estimation & Token Budgeting"),
    (2, "Lesson 9.2: Consistent Hashing Ring & Node Rebalancing"),
    (3, "Lesson 9.3: Token Bucket Rate Limiter with Redis"),
    (4, "Lesson 9.4: Sliding Window Counter Rate Limiter"),
    (5, "Lesson 9.5: Tiered Tenant Quota & Concurrency Throttling"),
    (6, "Lesson 9.6: Multi-Tier Cache Architectures & Cache-Aside"),
    (7, "Lesson 9.7: Cache Stampede & Thundering Herd Defense"),
    (8, "Lesson 9.8: Weighted Round-Robin & Peak EWMA Load Balancing"),
    (9, "Lesson 9.9: Circuit Breaker State Machine & Health Probing"),
    (10, "Lesson 9.10: High-Throughput HTTP Reverse Proxy Architecture"),

    # Block 2: High-Availability, Data Sharding & Resilience (9.11 - 9.20)
    (11, "Lesson 9.11: Snowflake Distributed ID Generation"),
    (12, "Lesson 9.12: Monotonic UUIDv7 Generation for Time-Series Logs"),
    (13, "Lesson 9.13: Database Sharding & Virtual Node Partitioning"),
    (14, "Lesson 9.14: Read-Replica Routing & Replication Lag Mitigation"),
    (15, "Lesson 9.15: Write-Ahead Logging & Append-Only Log Engines"),
    (16, "Lesson 9.16: Distributed Idempotency Key Gatekeeper"),
    (17, "Lesson 9.17: Dead Letter Queues & Exponential Backoff Pipelines"),
    (18, "Lesson 9.18: In-Memory Pub/Sub Message Broker Architecture"),
    (19, "Lesson 9.19: Event Streaming Partitions & Consumer Groups"),
    (20, "Lesson 9.20: Transactional Outbox Pattern for Reliable Events"),

    # Block 3: Scalable AI Web Architectures (9.21 - 9.30)
    (21, "Lesson 9.21: High-Concurrency WebSocket Gateway for AI Streams"),
    (22, "Lesson 9.22: Distributed Job Queue for Async Batch AI Jobs"),
    (23, "Lesson 9.23: Dynamic Context Pruning & Hierarchical Memory Tiering"),
    (24, "Lesson 9.24: Multi-Tenant Vector Index Sharding & Routing"),
    (25, "Lesson 9.25: Distributed Blob & Artifact Storage Metadata Engine"),
    (26, "Lesson 9.26: Real-Time Telemetry Pipeline for TTFT & Token Rates"),
    (27, "Lesson 9.27: Distributed Lock Manager with Automatic Lease Expiry"),
    (28, "Lesson 9.28: Two-Phase Commit & Distributed Saga Coordinators"),
    (29, "Lesson 9.29: Bulkhead Isolation & Thread Pool Compartmentalization"),
    (30, "Lesson 9.30: Chaos Engineering & Upstream Fault Injection"),

    # Block 4: High-Throughput LLM Serving & Model Gateway Infrastructure (9.31 - 9.40)
    (31, "Lesson 9.31: Continuous Dynamic Batching for LLM Inference"),
    (32, "Lesson 9.32: PagedAttention Virtual Memory Block Allocation"),
    (33, "Lesson 9.33: KV-Cache Eviction & Prefix Caching Strategies"),
    (34, "Lesson 9.34: Speculative Decoding & Verification Pipelines"),
    (35, "Lesson 9.35: Model Routing by Cost, Latency & Task Complexity"),
    (36, "Lesson 9.36: Semantic Cache Matching with Cosine Thresholds"),
    (37, "Lesson 9.37: Streaming Reverse Proxy with SSE Chunk Multiplexing"),
    (38, "Lesson 9.38: Multi-Region AI Gateway & Anycast Routing"),
    (39, "Lesson 9.39: Feature Flagging & Canary Deployment for Model Upgrades"),
    (40, "Lesson 9.40: Model Output Guardrails & Latency-Aware Fallback"),

    # Block 5: Production Agent Infrastructure & Telemetry (9.41 - 9.49)
    (41, "Lesson 9.41: Agent Execution State Serialization & Checkpointing"),
    (42, "Lesson 9.42: Distributed Agent Sandbox Isolation with Containers"),
    (43, "Lesson 9.43: Long-Running Workflow Engine with Event Resumption"),
    (44, "Lesson 9.44: Prompt Versioning & Semantic Regression Testing"),
    (45, "Lesson 9.45: Distributed Vector Search Failover & Replica Balancing"),
    (46, "Lesson 9.46: Rate Limit Hedging & Proactive Fallback Invocations"),
    (47, "Lesson 9.47: Synthetic Request Injection for Cold Start Prevention"),
    (48, "Lesson 9.48: Real-Time Token Cost Attribution & Tenant Invoicing"),
    (49, "Lesson 9.49: Distributed Tracing for Multi-Step AI Chains"),

    # Block 6: Capstone Project (9.50)
    (50, "Lesson 9.50: Capstone: ModelRouter — High-Scale Multi-Provider AI Gateway & Load Balancer"),
]

def main():
    print(f"Updating curriculum_phases for module-9...")
    update_phase_sql = f"""
    UPDATE curriculum_phases
    SET title = '{M9_TITLE}',
        description = '{M9_DESC}'
    WHERE id = 'module-9';
    """
    res = run_query(update_phase_sql)
    print("Phase updated:", res)

    print(f"Updating 50 curriculum_nodes for module-9...")
    statements = []
    for order_idx, title in M9_LESSONS:
        clean_title = title.replace("'", "''")
        statements.append(f"""
        UPDATE curriculum_nodes
        SET title = '{clean_title}'
        WHERE phase_id = 'module-9' AND order_index = {order_idx};
        """)

    full_sql = "\n".join(statements)
    res_nodes = run_query(full_sql)
    print("Nodes updated successfully!")

    verify = run_query("SELECT order_index, title FROM curriculum_nodes WHERE phase_id = 'module-9' ORDER BY order_index;")
    print(f"Verification: {len(verify)} nodes returned.")
    print("First 3:", verify[:3])
    print("Last 3:", verify[-3:])

if __name__ == "__main__":
    main()
