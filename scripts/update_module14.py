#!/usr/bin/env python3
"""
scripts/update_module14.py
Updates Module 14 in Supabase:
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

M14_TITLE = "Module 14: Cloud Infrastructure & Enterprise AI Platform"
M14_DESC = "Industrial cloud-native platform engineering, Kubernetes operators, Terraform IaC, zero-trust security (mTLS/SPIFFE), chaos engineering, and the grand finale autonomous enterprise platform."

M14_LESSONS = [
    # Block 1: Infrastructure as Code & Container Internals (14.1 - 14.10)
    (1, "Lesson 14.1: Infrastructure as Code Graph Dependency Resolvers"),
    (2, "Lesson 14.2: Declarative State Diffing and Plan Generation"),
    (3, "Lesson 14.3: Distributed State Locking and Lease Expiry Engines"),
    (4, "Lesson 14.4: Infrastructure Drift Detection and Automated Reconciliation"),
    (5, "Lesson 14.5: Linux Container Namespaces and Isolation Primitives"),
    (6, "Lesson 14.6: Cgroups v2 Resource Allocation and Memory Limits"),
    (7, "Lesson 14.7: OCI Container Layering and OverlayFS Union Mounts"),
    (8, "Lesson 14.8: Kubernetes Control Plane Architecture and Reconciliation"),
    (9, "Lesson 14.9: Kubernetes ReplicaSets and Pod Lifecycle Management"),
    (10, "Lesson 14.10: Zero-Downtime Rolling Deployment State Machines"),

    # Block 2: Kubernetes Orchestration & GPU Scheduling (14.11 - 14.20)
    (11, "Lesson 14.11: Kubernetes Scheduling Predicates and Node Filtering"),
    (12, "Lesson 14.12: Node Affinity Priority and Taint Tolerations"),
    (13, "Lesson 14.13: Kubernetes Custom Resource Definitions and Operators"),
    (14, "Lesson 14.14: Dynamic Admission Webhook Validation and Security"),
    (15, "Lesson 14.15: ClusterIP Networking and Service Proxy Mesh"),
    (16, "Lesson 14.16: Gateway API Ingress Controllers and Route Matchers"),
    (17, "Lesson 14.17: Horizontal Pod Autoscaling and Custom Metric Triggers"),
    (18, "Lesson 14.18: GPU Device Allocation and Multi-Instance GPU Slicing"),
    (19, "Lesson 14.19: Gang Scheduling for Distributed AI Training Clusters"),
    (20, "Lesson 14.20: Spot Instance Preemption Handling and Graceful Eviction"),

    # Block 3: Zero-Trust Security & DevSecOps (14.21 - 14.30)
    (21, "Lesson 14.21: GitOps Continuous Delivery and Automated Reconciliation"),
    (22, "Lesson 14.22: Mutual TLS Handshake Verification and Zero-Trust Networks"),
    (23, "Lesson 14.23: SPIFFE Workload Attestation and Cryptographic Identity"),
    (24, "Lesson 14.24: Envelope Encryption and Key Management Architecture"),
    (25, "Lesson 14.25: Dynamic Secret Leasing and Token Lifecycle Management"),
    (26, "Lesson 14.26: Static Application Security Testing and Code Scanners"),
    (27, "Lesson 14.27: eBPF Kernel Runtime Security and Syscall Filtering"),
    (28, "Lesson 14.28: Multi-Region Active-Active Database Failover Routers"),
    (29, "Lesson 14.29: Chaos Engineering and Automated Network Partition Injection"),
    (30, "Lesson 14.30: Tamper-Evident Merkle Trees for Enterprise Audit Logging"),

    # Block 4: High-Concurrency Streaming & Task Queues (14.31 - 14.35)
    (31, "Lesson 14.31: Kafka Partitioning and Consumer Group Rebalancing"),
    (32, "Lesson 14.32: Distributed Workflow Engines and Activity Orchestration"),
    (33, "Lesson 14.33: Distributed Token Quota Synchronization Across Clusters"),
    (34, "Lesson 14.34: High-Throughput Load Testing and Virtual User Generators"),
    (35, "Lesson 14.35: Automated Runbooks and Incident Triage Controllers"),

    # Block 5 & 6: Grand Finale Capstone — CloudMatrix Architecture (14.36 - 14.50)
    (36, "Lesson 14.36: CloudMatrix Multi-Tenant Domain Boundary Architecture"),
    (37, "Lesson 14.37: CloudMatrix Streaming Ingestion and Change Data Capture"),
    (38, "Lesson 14.38: CloudMatrix Distributed Vector Sharding and pgvector Indexing"),
    (39, "Lesson 14.39: CloudMatrix Multi-Modal Hybrid Search Coordination"),
    (40, "Lesson 14.40: CloudMatrix Continuous Batching Inference Serving"),
    (41, "Lesson 14.41: CloudMatrix Multi-Tier Distributed Semantic Caching"),
    (42, "Lesson 14.42: CloudMatrix Raft Consensus Cluster State Coordination"),
    (43, "Lesson 14.43: CloudMatrix LangGraph Autonomous Agent Orchestration"),
    (44, "Lesson 14.44: CloudMatrix Next.js Streaming Workspace and Canvas Visualizer"),
    (45, "Lesson 14.45: CloudMatrix OpenTelemetry Distributed Tracing and Spans"),
    (46, "Lesson 14.46: CloudMatrix Automated RAG Triad and Guardrail Evals"),
    (47, "Lesson 14.47: CloudMatrix Circuit Breakers and Dead Letter Queues"),
    (48, "Lesson 14.48: CloudMatrix Zero-Trust Mutual TLS and Role-Based Access"),
    (49, "Lesson 14.49: CloudMatrix Error Budget Alerting and Self-Healing Automation"),
    (50, "Lesson 14.50: Capstone: CloudMatrix — Enterprise Multi-Tenant AI Platform"),
]

def main():
    print(f"Updating curriculum_phases for module-14...")
    update_phase_sql = f"""
    UPDATE curriculum_phases
    SET title = '{M14_TITLE}',
        description = '{M14_DESC}'
    WHERE id = 'module-14';
    """
    res = run_query(update_phase_sql)
    print("Phase updated:", res)

    print(f"Updating 50 curriculum_nodes for module-14...")
    statements = []
    for order_idx, title in M14_LESSONS:
        clean_title = title.replace("'", "''")
        statements.append(f"""
        UPDATE curriculum_nodes
        SET title = '{clean_title}'
        WHERE phase_id = 'module-14' AND order_index = {order_idx};
        """)

    full_sql = "\n".join(statements)
    res_nodes = run_query(full_sql)
    print("Nodes updated successfully!")

    verify = run_query("SELECT order_index, title FROM curriculum_nodes WHERE phase_id = 'module-14' ORDER BY order_index;")
    print(f"Verification: {len(verify)} nodes returned.")
    print("First 3:", verify[:3])
    print("Last 3:", verify[-3:])

if __name__ == "__main__":
    main()
