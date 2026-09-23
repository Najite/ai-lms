#!/usr/bin/env python3
"""
scripts/update_module12.py
Updates Module 12 in Supabase:
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

M12_TITLE = "Module 12: AI Observability, Evals & Performance Profiling"
M12_DESC = "Production systems performance profiling and full-stack AI observability: flame graphs, OpenTelemetry distributed tracing, TTFT/ITL streaming latency metrics, RAG triad evaluations, and hallucination guardrails."

M12_LESSONS = [
    # Block 1: Async Event Loops & Memory Profiling (12.1 - 12.10)
    (1, "Lesson 12.1: High-Concurrency Speedup Laws & Bottleneck Analysis"),
    (2, "Lesson 12.2: Deterministic Function Call Profiling & Call Graphs"),
    (3, "Lesson 12.3: Statistical Sampling Profiling for Low Overhead"),
    (4, "Lesson 12.4: Interactive Flame Graph Generation and Aggregation"),
    (5, "Lesson 12.5: Peak Heap Memory Tracking and Object Allocation"),
    (6, "Lesson 12.6: Asyncio Event Loop Lag and Task Starvation Detection"),
    (7, "Lesson 12.7: CPython Memory Leaks and Cyclic Garbage Collection"),
    (8, "Lesson 12.8: Continuous Background Memory Profiling Agents"),
    (9, "Lesson 12.9: GPU Utilization and Tensor Core Efficiency Profiling"),
    (10, "Lesson 12.10: High-Throughput Metric Counters with Count-Min Sketch"),

    # Block 2: OpenTelemetry Distributed Tracing (12.11 - 12.20)
    (11, "Lesson 12.11: OpenTelemetry Span Lifecycles and Trace Hierarchies"),
    (12, "Lesson 12.12: W3C TraceContext Header Propagation Across Services"),
    (13, "Lesson 12.13: In-Process Context Propagation and Baggage Attributes"),
    (14, "Lesson 12.14: OpenTelemetry Protocol Exporters and OTLP Formatting"),
    (15, "Lesson 12.15: Multi-Step Agent Tool Call Span Instrumentation"),
    (16, "Lesson 12.16: Distributed Span Link Coordination for Async Queues"),
    (17, "Lesson 12.17: PII Redaction Pipeline for Sensitive Tracing Payloads"),
    (18, "Lesson 12.18: OpenInference Semantic Conventions for LLM Traces"),
    (19, "Lesson 12.19: Distributed Tracing for Vector Search and Embeddings"),
    (20, "Lesson 12.20: Trace-Driven Root Cause Analysis for Agent Failures"),

    # Block 3: Streaming AI Metrics & Cost Accounting (12.21 - 12.30)
    (21, "Lesson 12.21: Time to First Token Measurement and Streaming Gauges"),
    (22, "Lesson 12.22: Inter-Token Latency and Jitter Telemetry"),
    (23, "Lesson 12.23: Token Generation Throughput and Line Rate Monitors"),
    (24, "Lesson 12.24: Multi-Tenant Token Cost Accounting and Metering"),
    (25, "Lesson 12.25: Real-Time Token Budget Circuit Breakers"),
    (26, "Lesson 12.26: Sliding Window Percentile Latency with T-Digest"),
    (27, "Lesson 12.27: LLM Cache Hit Rates and Latency Savings Telemetry"),
    (28, "Lesson 12.28: Multi-Window Burn-Rate Alerting on Error Budgets"),
    (29, "Lesson 12.29: Latency Anomaly and Outlier Distribution Detection"),
    (30, "Lesson 12.30: Synthetic LLM Latency and Error Injection Testing"),

    # Block 4: Automated Evals & LLM-as-a-Judge (12.31 - 12.40)
    (31, "Lesson 12.31: RAG Context Relevance Scoring and Retrieval Metrics"),
    (32, "Lesson 12.32: Groundedness and Faithfulness Evaluation Engines"),
    (33, "Lesson 12.33: Answer Relevance and Semantic Completeness Scorer"),
    (34, "Lesson 12.34: Context Precision and Context Recall Evaluation"),
    (35, "Lesson 12.35: Multi-Criteria Rubric Evaluation with LLM Judges"),
    (36, "Lesson 12.36: Position Bias and Verbosity Bias Mitigation in Judges"),
    (37, "Lesson 12.37: Inter-Annotator Agreement and Cohens Kappa Reliability"),
    (38, "Lesson 12.38: Synthetic Testset Generation from Raw Documents"),
    (39, "Lesson 12.39: Golden Dataset Versioning and Regression Test Runners"),
    (40, "Lesson 12.40: Embedding Drift and Semantic Concept Shift Detection"),

    # Block 5: Guardrails, Prompt CI/CD & Feedback Loops (12.41 - 12.49)
    (41, "Lesson 12.41: Hallucination Detection via Natural Language Inference"),
    (42, "Lesson 12.42: Toxicity and Safety Classification Guardrails"),
    (43, "Lesson 12.43: Prompt Versioning Lineage and Deployment Registries"),
    (44, "Lesson 12.44: Automated Prompt Optimization with Gradient-Free Feedback"),
    (45, "Lesson 12.45: Canary Deployment and Trace-Based A/B Testing"),
    (46, "Lesson 12.46: Real-Time Dynamic Model Routing by Health and Latency"),
    (47, "Lesson 12.47: Model Quality Degradation and Perplexity Tracking"),
    (48, "Lesson 12.48: User Feedback Attribution and Implicit Signal Logging"),
    (49, "Lesson 12.49: Automated Runbooks for Production AI Incidents"),

    # Block 6: Capstone Project (12.50)
    (50, "Lesson 12.50: Capstone: TracePulse — Full-Stack AI Observability & Quality Platform"),
]

def main():
    print(f"Updating curriculum_phases for module-12...")
    update_phase_sql = f"""
    UPDATE curriculum_phases
    SET title = '{M12_TITLE}',
        description = '{M12_DESC}'
    WHERE id = 'module-12';
    """
    res = run_query(update_phase_sql)
    print("Phase updated:", res)

    print(f"Updating 50 curriculum_nodes for module-12...")
    statements = []
    for order_idx, title in M12_LESSONS:
        clean_title = title.replace("'", "''")
        statements.append(f"""
        UPDATE curriculum_nodes
        SET title = '{clean_title}'
        WHERE phase_id = 'module-12' AND order_index = {order_idx};
        """)

    full_sql = "\n".join(statements)
    res_nodes = run_query(full_sql)
    print("Nodes updated successfully!")

    verify = run_query("SELECT order_index, title FROM curriculum_nodes WHERE phase_id = 'module-12' ORDER BY order_index;")
    print(f"Verification: {len(verify)} nodes returned.")
    print("First 3:", verify[:3])
    print("Last 3:", verify[-3:])

if __name__ == "__main__":
    main()
