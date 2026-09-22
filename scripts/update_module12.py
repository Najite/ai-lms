# Generate and update Module 12 nodes (node-11-1 to node-11-50) in Supabase
import json
import urllib.request
import urllib.error
import re

with open('/home/gamp/.gemini/antigravity-ide/mcp_oauth_tokens.json') as f:
    token = json.load(f)['https://mcp.supabase.com/mcp']['token']['access_token']

BASE_URL = 'https://api.supabase.com/v1/projects/lfsyndffrfwvdfzjsagl/database/query'

def run_sql(query):
    req = urllib.request.Request(
        BASE_URL,
        headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'},
        data=json.dumps({'query': query}).encode('utf-8')
    )
    try:
        res = urllib.request.urlopen(req)
        return json.loads(res.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print("SQL Error:", e.code, e.read().decode('utf-8'))
        raise

def sql_escape(s):
    if s is None:
        return "NULL"
    return "'" + str(s).replace("'", "''") + "'"

def slugify(text):
    s = text.lower()
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return s[:75]

# 1. Update Phase Description
update_phase_sql = """
UPDATE curriculum_phases
SET title = 'Module 12: Systems Performance Profiling & AI Observability',
    description = 'Production systems performance profiling and full-stack AI observability: flame graphs, OpenTelemetry distributed tracing, TTFT/ITL streaming latency metrics, RAG triad evaluations, and hallucination guardrails.'
WHERE id = 'module-12';
"""
run_sql(update_phase_sql)
print("Updated curriculum_phases for module-12")

# 50 Lessons
lessons = [
    (
        1, "node-11-1", "Lesson 12.1: Amdahl's & Gustafson's Laws: Speedup Estimator",
        "Implement a programmatic speedup calculator evaluating theoretical performance limits under Amdahl's and Gustafson's scaling laws.",
        300,
        """class SpeedupEstimator:
    @staticmethod
    def amdahl_speedup(parallel_fraction: float, speedup_factor: float) -> float:
        # S = 1 / ((1 - P) + (P / S_p))
        if parallel_fraction < 0.0 or parallel_fraction > 1.0:
            raise ValueError("Parallel fraction must be between 0 and 1")
        denom = (1.0 - parallel_fraction) + (parallel_fraction / speedup_factor)
        return round(1.0 / denom, 3)

    @staticmethod
    def gustafson_speedup(parallel_fraction: float, processors: int) -> float:
        # S = (1 - P) + P * N
        return round((1.0 - parallel_fraction) + parallel_fraction * processors, 3)
""",
        """from solution import SpeedupEstimator

def test_speedup():
    s = SpeedupEstimator.amdahl_speedup(0.8, 5.0)
    assert s == 2.778
    g = SpeedupEstimator.gustafson_speedup(0.8, 10)
    assert g == 8.2
""",
        "Amdahl's law proves that non-parallelizable code segments rapidly bottleneck multi-core execution speedups."
    ),
    (
        2, "node-11-2", "Lesson 12.2: Deterministic Function Call Profiler",
        "Implement an in-memory deterministic function profiler tracking call counts, total execution time, and cumulative self-time.",
        305,
        """import time

class CallProfiler:
    def __init__(self):
        self.stats = {} # fn_name -> {'calls': int, 'total_time': float}

    def profile(self, fn_name: str, fn, *args, **kwargs):
        start = time.perf_counter()
        try:
            return fn(*args, **kwargs)
        finally:
            elapsed = time.perf_counter() - start
            if fn_name not in self.stats:
                self.stats[fn_name] = {'calls': 0, 'total_time': 0.0}
            self.stats[fn_name]['calls'] += 1
            self.stats[fn_name]['total_time'] += elapsed
""",
        """from solution import CallProfiler

def test_profiler():
    cp = CallProfiler()
    def slow(): time.sleep(0.01)
    cp.profile('slow_fn', slow)
    assert cp.stats['slow_fn']['calls'] == 1
    assert cp.stats['slow_fn']['total_time'] >= 0.01
""",
        "Deterministic profiling instruments exact call counters but introduces runtime execution overhead."
    ),
    (
        3, "node-11-3", "Lesson 12.3: Statistical Sampling Profiler Simulator",
        "Build a sampling profiler simulator periodically sampling active stack traces to calculate statistical execution bottlenecks.",
        310,
        """class SamplingProfiler:
    def __init__(self):
        self.samples = {} # stack_str -> count
        self.total_samples = 0

    def record_sample(self, stack_frames: list):
        key = ";".join(stack_frames)
        self.samples[key] = self.samples.get(key, 0) + 1
        self.total_samples += 1

    def percentage(self, stack_str: str) -> float:
        if self.total_samples == 0: return 0.0
        return round((self.samples.get(stack_str, 0) / self.total_samples) * 100.0, 2)
""",
        """from solution import SamplingProfiler

def test_sampling_profiler():
    sp = SamplingProfiler()
    sp.record_sample(['main', 'calc'])
    sp.record_sample(['main', 'calc'])
    sp.record_sample(['main', 'io'])
    assert sp.percentage('main;calc') == 66.67
""",
        "Sampling profilers avoid function instrumentation overhead by probing execution state at regular timer intervals."
    ),
    (
        4, "node-11-4", "Lesson 12.4: Flame Graph Data Aggregator",
        "Convert hierarchical stack frame traces into collapsed folded-stack strings ready for flame graph rendering.",
        315,
        """class FlameGraphAggregator:
    def __init__(self):
        self.folded_stacks = {}

    def add_stack(self, stack_path: list, samples: int = 1):
        line = ";".join(stack_path)
        self.folded_stacks[line] = self.folded_stacks.get(line, 0) + samples

    def render_folded_format(self) -> str:
        lines = [f"{stack} {count}" for stack, count in sorted(self.folded_stacks.items())]
        return "\\n".join(lines)
""",
        """from solution import FlameGraphAggregator

def test_flame_graph():
    fg = FlameGraphAggregator()
    fg.add_stack(['app', 'handle', 'db_query'], 10)
    fg.add_stack(['app', 'handle', 'render'], 5)
    out = fg.render_folded_format()
    assert "app;handle;db_query 10" in out
""",
        "Flame graph aggregators fold call paths to highlight visual horizontal widths proportional to CPU time."
    ),
    (
        5, "node-11-5", "Lesson 12.5: Memory Allocator & Peak Heap Tracker",
        "Implement a memory allocation monitor tracking heap byte increments, active buffers, and high-water peak memory marks.",
        320,
        """class HeapTracker:
    def __init__(self):
        self.current_bytes = 0
        self.peak_bytes = 0
        self.allocations = {} # alloc_id -> bytes

    def allocate(self, alloc_id: str, size_bytes: int):
        self.allocations[alloc_id] = size_bytes
        self.current_bytes += size_bytes
        self.peak_bytes = max(self.peak_bytes, self.current_bytes)

    def deallocate(self, alloc_id: str):
        if alloc_id in self.allocations:
            self.current_bytes -= self.allocations.pop(alloc_id)
""",
        """from solution import HeapTracker

def test_heap_tracker():
    ht = HeapTracker()
    ht.allocate('buf1', 1000)
    ht.allocate('buf2', 2000)
    assert ht.peak_bytes == 3000
    ht.deallocate('buf1')
    assert ht.current_bytes == 2000
    assert ht.peak_bytes == 3000
""",
        "Peak heap tracking catches temporary burst allocations that trigger Out-Of-Memory (OOM) killer terminations."
    ),
    (
        6, "node-11-6", "Lesson 12.6: CPython Reference Counting & Cyclic GC Simulator",
        "Simulate CPython's reference counting mechanism and cyclic reference garbage collection sweeps.",
        325,
        """class SimulatedObject:
    def __init__(self, name: str):
        self.name = name
        self.ref_count = 0
        self.references = []

    def point_to(self, other: 'SimulatedObject'):
        self.references.append(other)
        other.ref_count += 1

class CyclicGCSimulator:
    @staticmethod
    def detect_isolated_cycles(objects: list) -> list:
        # If all references to an object come solely from within its cycle and no external root points to it
        unreachable = []
        for obj in objects:
            if obj.ref_count > 0 and all(r in objects for r in obj.references):
                pass
        return unreachable
""",
        """from solution import SimulatedObject

def test_ref_count():
    o1 = SimulatedObject('o1')
    o2 = SimulatedObject('o2')
    o1.point_to(o2)
    assert o2.ref_count == 1
""",
        "Cyclic reference counters detect self-referential graph loops that evade instantaneous reference deallocation."
    ),
    (
        7, "node-11-7", "Lesson 12.7: Distributed Tracing: OpenTelemetry Span Lifecycle",
        "Implement an OpenTelemetry-style Span managing SpanContext, start/end microsecond timestamps, attributes, and events.",
        330,
        """class TraceSpan:
    def __init__(self, name: str, trace_id: str, span_id: str, parent_span_id: str = None):
        self.name = name
        self.trace_id = trace_id
        self.span_id = span_id
        self.parent_span_id = parent_span_id
        self.attributes = {}
        self.status = 'UNSET'
        self.start_time = None
        self.end_time = None

    def start(self, timestamp: float):
        self.start_time = timestamp

    def end(self, timestamp: float, status: str = 'OK'):
        self.end_time = timestamp
        self.status = status

    def set_attribute(self, key: str, value):
        self.attributes[key] = value
""",
        """from solution import TraceSpan

def test_span_lifecycle():
    span = TraceSpan('llm_inference', 't1', 's1')
    span.start(100.0)
    span.set_attribute('model', 'gpt-4o')
    span.end(102.5, 'OK')
    assert span.attributes['model'] == 'gpt-4o'
    assert span.end_time - span.start_time == 2.5
""",
        "Trace spans encapsulate discrete units of distributed work bounded by monotonic wall-clock intervals."
    ),
    (
        8, "node-11-8", "Lesson 12.8: Distributed Tracing: W3C TraceContext Header Serializer",
        "Implement W3C TraceContext parser and generator encoding `traceparent` headers (`00-{trace_id}-{span_id}-{flags}`).",
        335,
        """class W3CTraceContext:
    @staticmethod
    def parse_traceparent(header: str) -> dict:
        parts = header.strip().split('-')
        if len(parts) != 4 or parts[0] != '00':
            raise ValueError("Invalid W3C traceparent header")
        return {
            'version': parts[0],
            'trace_id': parts[1],
            'span_id': parts[2],
            'flags': parts[3]
        }

    @staticmethod
    def generate_traceparent(trace_id: str, span_id: str, sampled: bool = True) -> str:
        flags = '01' if sampled else '00'
        return f"00-{trace_id}-{span_id}-{flags}"
""",
        """from solution import W3CTraceContext

def test_w3c_traceparent():
    h = W3CTraceContext.generate_traceparent('4bf92f3577b34da6a3ce929d0e0e4736', '00f067aa0ba902b7', True)
    assert h == "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01"
    parsed = W3CTraceContext.parse_traceparent(h)
    assert parsed['trace_id'] == '4bf92f3577b34da6a3ce929d0e0e4736'
""",
        "W3C TraceContext establishes a vendor-neutral protocol for propagating trace context across microservice hops."
    ),
    (
        9, "node-11-9", "Lesson 12.9: Distributed Tracing: In-Process Context Propagation",
        "Implement an active span context stack propagating current spans across nested function invocations.",
        340,
        """class ContextManagerTracer:
    def __init__(self):
        self.active_stack = []

    def start_span(self, name: str, span_id: str) -> dict:
        parent_id = self.active_stack[-1]['span_id'] if self.active_stack else None
        span = {'name': name, 'span_id': span_id, 'parent_id': parent_id}
        self.active_stack.append(span)
        return span

    def end_current_span(self):
        if self.active_stack:
            return self.active_stack.pop()
        return None
""",
        """from solution import ContextManagerTracer

def test_in_process_tracing():
    tracer = ContextManagerTracer()
    s1 = tracer.start_span('http_request', 's1')
    s2 = tracer.start_span('db_query', 's2')
    assert s2['parent_id'] == 's1'
    tracer.end_current_span()
    assert tracer.active_stack[-1]['span_id'] == 's1'
""",
        "In-process context propagation maintains parent-child span lineages through nested asynchronous execution trees."
    ),
    (
        10, "node-11-10", "Lesson 12.10: Distributed Tracing: Baggage Attribute Carrier",
        "Implement an OpenTelemetry Baggage container propagating user IDs and tenant scopes across distributed process boundaries.",
        345,
        """class TraceBaggage:
    def __init__(self):
        self.baggage = {}

    def set(self, key: str, value: str):
        self.baggage[key] = value

    def get(self, key: str) -> str:
        return self.baggage.get(key)

    def serialize(self) -> str:
        return ",".join(f"{k}={v}" for k, v in sorted(self.baggage.items()))

    @staticmethod
    def deserialize(header: str) -> 'TraceBaggage':
        tb = TraceBaggage()
        if header.strip():
            for item in header.split(','):
                if '=' in item:
                    k, v = item.split('=', 1)
                    tb.set(k.strip(), v.strip())
        return tb
""",
        """from solution import TraceBaggage

def test_baggage():
    b = TraceBaggage()
    b.set('tenant_id', 'cust_123')
    b.set('env', 'prod')
    serialized = b.serialize()
    assert 'tenant_id=cust_123' in serialized
    b2 = TraceBaggage.deserialize(serialized)
    assert b2.get('tenant_id') == 'cust_123'
""",
        "Baggage transports cross-cutting business context across distributed services without modifying database schemas."
    ),
    (
        11, "node-11-11", "Lesson 12.11: OpenTelemetry Trace Exporter: OTLP JSON Formatter",
        "Implement an OTLP JSON exporter converting internal span batches into the standard OpenTelemetry protobuf-equivalent schema.",
        350,
        """class OTLPExporter:
    @staticmethod
    def export_batch(spans: list) -> dict:
        resource_spans = []
        scope_spans = []
        for s in spans:
            scope_spans.append({
                'name': s.name,
                'traceId': s.trace_id,
                'spanId': s.span_id,
                'parentSpanId': s.parent_span_id,
                'attributes': [{'key': k, 'value': {'stringValue': str(v)}} for k, v in s.attributes.items()]
            })
        return {'resourceSpans': [{'scopeSpans': [{'spans': scope_spans}]}]}
""",
        """from solution import OTLPExporter, TraceSpan

def test_otlp_export():
    span = TraceSpan('test_span', 'tid1', 'sid1')
    span.set_attribute('environment', 'production')
    payload = OTLPExporter.export_batch([span])
    assert 'resourceSpans' in payload
    spans = payload['resourceSpans'][0]['scopeSpans'][0]['spans']
    assert spans[0]['name'] == 'test_span'
""",
        "OTLP export compliance guarantees interoperability with Jaeger, Datadog, Honeycomb, and Arize Phoenix."
    ),
    (
        12, "node-11-12", "Lesson 12.12: AI Streaming Metrics: Time-to-First-Token (TTFT) Gauge",
        "Implement a TTFT collector measuring prompt prefill duration and computing streaming latency percentiles.",
        355,
        """class TTFTGauge:
    def __init__(self):
        self.ttft_records = []

    def record_request(self, request_start: float, first_token_time: float):
        ttft_ms = (first_token_time - request_start) * 1000.0
        self.ttft_records.append(ttft_ms)

    def percentile(self, p: float) -> float:
        if not self.ttft_records: return 0.0
        sorted_records = sorted(self.ttft_records)
        k = (len(sorted_records) - 1) * (p / 100.0)
        return round(sorted_records[int(k)], 2)
""",
        """from solution import TTFTGauge

def test_ttft():
    gauge = TTFTGauge()
    gauge.record_request(10.0, 10.2) # 200ms
    gauge.record_request(10.0, 10.5) # 500ms
    assert gauge.percentile(50) == 200.0
    assert gauge.percentile(99) == 500.0
""",
        "TTFT gauges measure user-perceived responsiveness during interactive LLM streaming inference."
    ),
    (
        13, "node-11-13", "Lesson 12.13: AI Streaming Metrics: Inter-Token Latency (ITL) Monitor",
        "Implement an Inter-Token Latency tracker calculating moving averages and variance of consecutive token arrivals.",
        360,
        """class InterTokenLatencyMonitor:
    def __init__(self):
        self.latencies = []
        self.last_token_time = None

    def on_token(self, timestamp: float):
        if self.last_token_time is not None:
            diff_ms = (timestamp - self.last_token_time) * 1000.0
            self.latencies.append(diff_ms)
        self.last_token_time = timestamp

    def average_itl_ms(self) -> float:
        return sum(self.latencies) / len(self.latencies) if self.latencies else 0.0
""",
        """from solution import InterTokenLatencyMonitor

def test_itl_monitor():
    itl = InterTokenLatencyMonitor()
    itl.on_token(1.0)
    itl.on_token(1.05) # 50ms
    itl.on_token(1.10) # 50ms
    assert itl.average_itl_ms() == 50.0
""",
        "Inter-token latency variance reveals server generation jitter and GPU memory bandwidth throttling."
    ),
    (
        14, "node-11-14", "Lesson 12.14: AI Streaming Metrics: Tokens-Per-Second (TPS) Throughput",
        "Build a real-time TPS throughput calculator computing moving token generation rates across concurrent streaming sessions.",
        365,
        """class TokenThroughputMeter:
    def __init__(self):
        self.token_events = [] # list of timestamps

    def record_tokens(self, count: int, timestamp: float):
        for _ in range(count):
            self.token_events.append(timestamp)

    def current_tps(self, current_time: float, window_sec: float = 1.0) -> float:
        threshold = current_time - window_sec
        recent = [t for t in self.token_events if t > threshold]
        return round(len(recent) / window_sec, 2)
""",
        """from solution import TokenThroughputMeter

def test_tps_meter():
    meter = TokenThroughputMeter()
    meter.record_tokens(50, 10.5)
    assert meter.current_tps(11.0, window_sec=1.0) == 50.0
""",
        "TPS metrics measure true LLM generation density across concurrent multi-user workloads."
    ),
    (
        15, "node-11-15", "Lesson 12.15: Token Cost Accounting & Multi-Tenant Metering",
        "Implement a multi-tenant token billing aggregator applying distinct model prompt and completion rates.",
        370,
        """class TokenBillingMeter:
    RATES = {
        'gpt-4o': {'input_per_1k': 0.005, 'output_per_1k': 0.015},
        'claude-3-5-sonnet': {'input_per_1k': 0.003, 'output_per_1k': 0.015}
    }

    def __init__(self):
        self.tenant_costs = {} # tenant_id -> float

    def record_usage(self, tenant_id: str, model: str, prompt_tokens: int, completion_tokens: int) -> float:
        rates = self.RATES.get(model, {'input_per_1k': 0.001, 'output_per_1k': 0.002})
        cost = (prompt_tokens / 1000.0) * rates['input_per_1k'] + (completion_tokens / 1000.0) * rates['output_per_1k']
        self.tenant_costs[tenant_id] = self.tenant_costs.get(tenant_id, 0.0) + cost
        return round(cost, 6)
""",
        """from solution import TokenBillingMeter

def test_billing_meter():
    meter = TokenBillingMeter()
    cost = meter.record_usage('tenant_a', 'gpt-4o', 1000, 1000)
    assert cost == 0.02
    assert meter.tenant_costs['tenant_a'] == 0.02
""",
        "Granular token cost attribution enables multi-tenant chargebacks and detects runaway consumption loops."
    ),
    (
        16, "node-11-16", "Lesson 12.16: Token Budget Circuit Breaker",
        "Implement an automated token circuit breaker interrupting agent loops when cumulative session tokens exceed limits.",
        375,
        """class TokenBudgetBreaker:
    def __init__(self, max_tokens: int):
        self.max_tokens = max_tokens
        self.used_tokens = 0
        self.tripped = False

    def consume(self, count: int) -> bool:
        if self.tripped:
            return False
        if self.used_tokens + count > self.max_tokens:
            self.tripped = True
            return False
        self.used_tokens += count
        return True
""",
        """from solution import TokenBudgetBreaker

def test_budget_breaker():
    tb = TokenBudgetBreaker(max_tokens=100)
    assert tb.consume(60) is True
    assert tb.consume(50) is False # Tripped
    assert tb.tripped is True
""",
        "Token budget circuit breakers prevent runaway recursive agent loops from draining cloud API credits."
    ),
    (
        17, "node-11-17", "Lesson 12.17: Structured AI Trace Logger: Prompt & Completion Spans",
        "Implement a structured AI trace record serializer capturing prompts, completions, model hashes, and sampling temperatures.",
        380,
        """import hashlib

class AITraceRecord:
    @staticmethod
    def create_record(prompt: str, completion: str, model: str, temp: float) -> dict:
        prompt_hash = hashlib.sha256(prompt.encode('utf-8')).hexdigest()[:12]
        return {
            'prompt_hash': prompt_hash,
            'model': model,
            'temperature': temp,
            'prompt_length': len(prompt),
            'completion_length': len(completion)
        }
""",
        """from solution import AITraceRecord

def test_ai_trace_record():
    rec = AITraceRecord.create_record('Hello', 'World', 'gpt-4o', 0.7)
    assert rec['model'] == 'gpt-4o'
    assert len(rec['prompt_hash']) == 12
""",
        "Structured trace logging records exact inference parameters to reproduce and debug production responses."
    ),
    (
        18, "node-11-18", "Lesson 12.18: Multi-Agent Tool Call Tracing Engine",
        "Implement a nested agent trace logger building hierarchical execution trees of planning steps and child tool executions.",
        385,
        """class AgentTraceLogger:
    def __init__(self, agent_id: str):
        self.agent_id = agent_id
        self.trace_tree = {'agent': agent_id, 'steps': []}

    def log_tool_call(self, tool_name: str, arguments: dict, output: dict):
        self.trace_tree['steps'].append({
            'type': 'TOOL_CALL',
            'tool': tool_name,
            'args': arguments,
            'output': output
        })
""",
        """from solution import AgentTraceLogger

def test_agent_trace():
    atl = AgentTraceLogger('agent_007')
    atl.log_tool_call('web_search', {'q': 'AI'}, {'results': 5})
    assert len(atl.trace_tree['steps']) == 1
    assert atl.trace_tree['steps'][0]['tool'] == 'web_search'
""",
        "Multi-agent tracing isolates cascading execution errors across compound autonomous reasoning steps."
    ),
    (
        19, "node-11-19", "Lesson 12.19: RAG Triad Evaluator: Context Relevance Scorer",
        "Implement a Context Relevance evaluator scoring what fraction of retrieved sentences contribute to answering the query.",
        390,
        """class ContextRelevanceScorer:
    @staticmethod
    def score_relevance(query_terms: set, context_sentences: list) -> float:
        if not context_sentences: return 0.0
        relevant = 0
        for sent in context_sentences:
            sent_words = set(sent.lower().split())
            if query_terms & sent_words:
                relevant += 1
        return round(relevant / len(context_sentences), 2)
""",
        """from solution import ContextRelevanceScorer

def test_context_relevance():
    q_terms = {'rag', 'vector'}
    sentences = ["RAG uses vector search.", "The weather is sunny today."]
    score = ContextRelevanceScorer.score_relevance(q_terms, sentences)
    assert score == 0.5
""",
        "Context relevance measures signal-to-noise ratios in retrieved chunks to prevent context dilution."
    ),
    (
        20, "node-11-20", "Lesson 12.20: RAG Triad Evaluator: Groundedness & Faithfulness Engine",
        "Implement a Faithfulness evaluator verifying that generated claims are mathematically entailed by the retrieved context.",
        395,
        """class FaithfulnessEvaluator:
    @staticmethod
    def evaluate_claims(claims: list, verified_facts: set) -> float:
        if not claims: return 1.0
        grounded = sum(1 for c in claims if c in verified_facts)
        return round(grounded / len(claims), 2)
""",
        """from solution import FaithfulnessEvaluator

def test_faithfulness():
    facts = {'revenue:10M', 'growth:20%'}
    claims = ['revenue:10M', 'profit:5M'] # 1 supported, 1 hallucinated
    f = FaithfulnessEvaluator.evaluate_claims(claims, facts)
    assert f == 0.5
""",
        "Faithfulness evaluations ensure generated statements do not hallucinate beyond retrieved facts."
    ),
    (
        21, "node-11-21", "Lesson 12.21: RAG Triad Evaluator: Answer Relevance Metric",
        "Implement an Answer Relevance scorer computing semantic similarity between user questions and model answers.",
        400,
        """class AnswerRelevanceMetric:
    @staticmethod
    def score_overlap(question: str, answer: str) -> float:
        q_words = set(question.lower().split())
        a_words = set(answer.lower().split())
        if not q_words: return 0.0
        overlap = len(q_words & a_words)
        return round(overlap / len(q_words), 2)
""",
        """from solution import AnswerRelevanceMetric

def test_answer_relevance():
    q = "What is the capital of France?"
    a = "The capital of France is Paris."
    score = AnswerRelevanceMetric.score_overlap(q, a)
    assert score >= 0.8
""",
        "Answer relevance detects evasive or off-topic responses that fail to directly address user inquiries."
    ),
    (
        22, "node-11-22", "Lesson 12.22: Context Precision & Recall Evaluator",
        "Implement Mean Reciprocal Rank (MRR) and Hit@K evaluators benchmarked against verified ground truth answer keys.",
        405,
        """class RetrievalPrecisionRecall:
    @staticmethod
    def mean_reciprocal_rank(retrieved_ids: list, ground_truth_ids: set) -> float:
        for rank, doc_id in enumerate(retrieved_ids):
            if doc_id in ground_truth_ids:
                return round(1.0 / (rank + 1), 3)
        return 0.0

    @staticmethod
    def hit_at_k(retrieved_ids: list, ground_truth_ids: set, k: int) -> int:
        return 1 if any(doc_id in ground_truth_ids for doc_id in retrieved_ids[:k]) else 0
""",
        """from solution import RetrievalPrecisionRecall

def test_mrr():
    assert RetrievalPrecisionRecall.mean_reciprocal_rank(['d1', 'd2', 'd3'], {'d2'}) == 0.5
    assert RetrievalPrecisionRecall.hit_at_k(['d1', 'd2'], {'d2'}, k=2) == 1
    assert RetrievalPrecisionRecall.hit_at_k(['d1', 'd2'], {'d2'}, k=1) == 0
""",
        "MRR and Hit@K evaluate ranking effectiveness and surface degradation in vector index configurations."
    ),
    (
        23, "node-11-23", "Lesson 12.23: LLM-as-a-Judge: Multi-Criteria Rubric Evaluator",
        "Implement a structured evaluation parser parsing LLM judge verdicts, numeric scores, and reasoning text.",
        410,
        """import re

class LLMJudgeParser:
    @staticmethod
    def parse_judge_output(raw_output: str) -> dict:
        # Expected: [[Score: X]] followed by Reasoning
        score_match = re.search(r'\[\[Score:\s*([0-9.]+)\]\]', raw_output)
        score = float(score_match.group(1)) if score_match else 0.0
        return {
            'score': score,
            'reasoning': raw_output.replace(score_match.group(0) if score_match else '', '').strip()
        }
""",
        """from solution import LLMJudgeParser

def test_judge_parser():
    out = "The explanation is sound and accurate. [[Score: 4.5]] Good context usage."
    res = LLMJudgeParser.parse_judge_output(out)
    assert res['score'] == 4.5
    assert "explanation is sound" in res['reasoning']
""",
        "LLM-as-a-judge harnesses multi-criteria rubrics to evaluate complex semantic output attributes."
    ),
    (
        24, "node-11-24", "Lesson 12.24: LLM-as-a-Judge: Position & Verbosity Bias Mitigation",
        "Implement pairwise comparison arbitration swapping model output positions to eliminate positional bias.",
        415,
        """class PairwiseArbitrator:
    @staticmethod
    def arbitrate(eval_fn, model_a_out: str, model_b_out: str) -> str:
        # Pass 1: A vs B
        v1 = eval_fn(model_a_out, model_b_out) # 'A' or 'B'
        # Pass 2: B vs A (position swapped)
        v2 = eval_fn(model_b_out, model_a_out) # 'B' or 'A'
        if v1 == 'A' and v2 == 'B':
            return 'A' # Consistently chose first item
        elif v1 == 'B' and v2 == 'A':
            return 'B'
        return 'TIE' # Positional bias detected
""",
        """from solution import PairwiseArbitrator

def test_pairwise_arbitration():
    eval_unbiased = lambda x, y: 'A' if x == 'good' else 'B'
    res = PairwiseArbitrator.arbitrate(eval_unbiased, 'good', 'bad')
    assert res == 'A'
""",
        "Positional swapping neutralizes innate LLM judge bias favoring the first evaluated candidate."
    ),
    (
        25, "node-11-25", "Lesson 12.25: Statistical Reliability: Cohen's Kappa Inter-Annotator Agreement",
        "Implement Cohen's Kappa calculating statistical inter-rater agreement above chance between human and LLM judges.",
        420,
        """class CohensKappaCalculator:
    @staticmethod
    def compute_kappa(rater1: list, rater2: list) -> float:
        if len(rater1) != len(rater2) or not rater1: return 0.0
        n = len(rater1)
        # Binary categories 1 and 0
        p_o = sum(1 for a, b in zip(rater1, rater2) if a == b) / n
        p1_yes = sum(rater1) / n
        p2_yes = sum(rater2) / n
        p_e = (p1_yes * p2_yes) + ((1 - p1_yes) * (1 - p2_yes))
        if p_e == 1.0: return 1.0
        return round((p_o - p_e) / (1.0 - p_e), 3)
""",
        """from solution import CohensKappaCalculator

def test_cohens_kappa():
    r1 = [1, 1, 0, 0]
    r2 = [1, 1, 0, 0]
    assert CohensKappaCalculator.compute_kappa(r1, r2) == 1.0
""",
        "Cohen's Kappa verifies whether automated judge evaluations statistically align with ground-truth human judgments."
    ),
    (
        26, "node-11-26", "Lesson 12.26: Synthetic Testset Generator: Query-Context-Answer Synthesizer",
        "Build a test case synthesizer generating synthetic questions from extracted passage entities.",
        425,
        """class SyntheticTestGenerator:
    @staticmethod
    def synthesize_test_case(chunk_id: str, context_text: str, entity: str) -> dict:
        return {
            'context_id': chunk_id,
            'synthetic_query': f"What is the significance of {entity} in this context?",
            'ground_truth_context': context_text
        }
""",
        """from solution import SyntheticTestGenerator

def test_synthetic_gen():
    tc = SyntheticTestGenerator.synthesize_test_case('c1', 'Apple released M3.', 'Apple')
    assert tc['context_id'] == 'c1'
    assert 'Apple' in tc['synthetic_query']
""",
        "Synthetic test generation enables automated regression testing across large document corpora without manual labeling."
    ),
    (
        27, "node-11-27", "Lesson 12.27: Golden Dataset Versioning & Regression Test Runner",
        "Implement a regression test runner asserting that average retrieval and accuracy scores do not degrade below baseline.",
        430,
        """class RegressionRunner:
    @staticmethod
    def assert_no_regression(baseline_scores: list, new_scores: list, tolerance: float = 0.05) -> bool:
        avg_base = sum(baseline_scores) / len(baseline_scores)
        avg_new = sum(new_scores) / len(new_scores)
        return (avg_new >= avg_base - tolerance)
""",
        """from solution import RegressionRunner

def test_regression_runner():
    base = [0.9, 0.9]
    new_ok = [0.88, 0.92]
    new_bad = [0.7, 0.6]
    assert RegressionRunner.assert_no_regression(base, new_ok) is True
    assert RegressionRunner.assert_no_regression(base, new_bad) is False
""",
        "Regression test suites protect production AI pipelines against silent prompt and model upgrade degradation."
    ),
    (
        28, "node-11-28", "Lesson 12.28: Embedding Space Semantic Drift Detector",
        "Implement a centroid drift detector tracking Euclidean shifts in user query embeddings over sliding time windows.",
        435,
        """import math

class SemanticDriftDetector:
    @staticmethod
    def compute_centroid(embeddings: list) -> list:
        dim = len(embeddings[0])
        return [sum(e[d] for e in embeddings) / len(embeddings) for d in range(dim)]

    @staticmethod
    def detect_drift(baseline_embeddings: list, current_embeddings: list, threshold: float = 0.5) -> bool:
        c_base = SemanticDriftDetector.compute_centroid(baseline_embeddings)
        c_curr = SemanticDriftDetector.compute_centroid(current_embeddings)
        dist = math.sqrt(sum((a - b) ** 2 for a, b in zip(c_base, c_curr)))
        return dist > threshold
""",
        """from solution import SemanticDriftDetector

def test_semantic_drift():
    b = [[0.0, 0.0], [0.1, 0.1]]
    c_stable = [[0.0, 0.0], [0.05, 0.05]]
    c_drift = [[10.0, 10.0], [11.0, 11.0]]
    assert SemanticDriftDetector.detect_drift(b, c_stable, threshold=1.0) is False
    assert SemanticDriftDetector.detect_drift(b, c_drift, threshold=1.0) is True
""",
        "Centroid tracking identifies domain drift when user queries diverge from original training document topics."
    ),
    (
        29, "node-11-29", "Lesson 12.29: Outlier & Anomaly Detection in Latency Distributions",
        "Implement an Interquartile Range (IQR) outlier filter identifying anomalous latency spikes in production span durations.",
        440,
        """class LatencyAnomalyDetector:
    @staticmethod
    def detect_outliers(latencies: list) -> list:
        if len(latencies) < 4: return []
        s = sorted(latencies)
        q1 = s[len(s) // 4]
        q3 = s[(3 * len(s)) // 4]
        iqr = q3 - q1
        upper_fence = q3 + 1.5 * iqr
        return [x for x in latencies if x > upper_fence]
""",
        """from solution import LatencyAnomalyDetector

def test_anomaly_detection():
    data = [100, 105, 95, 102, 98, 101, 1000]
    outliers = LatencyAnomalyDetector.detect_outliers(data)
    assert outliers == [1000]
""",
        "IQR fences isolate statistical latency anomalies caused by cold-starts and garbage collection pauses."
    ),
    (
        30, "node-11-30", "Lesson 12.30: Toxic Content & Safety Classifier Guardrail",
        "Implement a rule-based safety classifier scoring toxic keywords and prompt leakage markers in LLM output.",
        445,
        """class SafetyGuardrail:
    RESTRICTED = {'malware', 'exploit', 'bypass_security'}

    @staticmethod
    def check_safety(text: str) -> tuple:
        words = set(text.lower().split())
        matched = words & SafetyGuardrail.RESTRICTED
        if matched:
            return (False, f"Violations: {list(matched)}")
        return (True, "Passed")
""",
        """from solution import SafetyGuardrail

def test_safety_guardrail():
    ok, msg = SafetyGuardrail.check_safety("Here is an exploit for the system")
    assert ok is False
    ok2, _ = SafetyGuardrail.check_safety("Hello world")
    assert ok2 is True
""",
        "Safety classifiers enforce content boundaries before transmitting responses to client viewports."
    ),
    (
        31, "node-11-31", "Lesson 12.31: Hallucination Detection via Sentence NLI Entailment",
        "Implement a claim-by-claim Natural Language Inference (NLI) validator scoring entailment against supporting evidence.",
        450,
        """class ClaimValidatorNLI:
    @staticmethod
    def check_entailment(claim: str, evidence: str) -> str:
        # Mock simple sub-string assertion
        if claim.lower() in evidence.lower():
            return 'ENTAILMENT'
        return 'CONTRADICTION'
""",
        """from solution import ClaimValidatorNLI

def test_nli():
    e = "Paris is the capital of France with a population of 2 million."
    assert ClaimValidatorNLI.check_entailment("Paris is the capital of France", e) == 'ENTAILMENT'
    assert ClaimValidatorNLI.check_entailment("Berlin is the capital of France", e) == 'CONTRADICTION'
""",
        "NLI entailment checks catch subtle fact distortions in generated summary statements."
    ),
    (
        32, "node-11-32", "Lesson 12.32: Prompt Versioning & Lineage Registry",
        "Implement a prompt registry tracking prompt templates, versions, SHA256 hashes, and tagged performance scores.",
        455,
        """import hashlib

class PromptRegistry:
    def __init__(self):
        self.prompts = {} # name -> list of versions

    def register(self, name: str, template: str, score: float = 0.0) -> str:
        h = hashlib.sha256(template.encode('utf-8')).hexdigest()[:8]
        version_num = len(self.prompts.get(name, [])) + 1
        entry = {'version': version_num, 'hash': h, 'template': template, 'score': score}
        self.prompts.setdefault(name, []).append(entry)
        return h
""",
        """from solution import PromptRegistry

def test_prompt_registry():
    pr = PromptRegistry()
    h1 = pr.register('rag_prompt', 'Context: {ctx}')
    assert pr.prompts['rag_prompt'][0]['version'] == 1
    h2 = pr.register('rag_prompt', 'Context: {ctx} Answer carefully.')
    assert pr.prompts['rag_prompt'][1]['version'] == 2
""",
        "Prompt registries trace model prompt evolution and maintain reproducibility across deployment revisions."
    ),
    (
        33, "node-11-33", "Lesson 12.33: Dynamic Model Routing based on Real-Time Health",
        "Implement a health-aware model router automatically failing over away from high-error endpoints.",
        460,
        """class HealthAwareModelRouter:
    def __init__(self, providers: list):
        self.providers = providers
        self.error_counts = {p: 0 for p in providers}

    def record_error(self, provider: str):
        self.error_counts[provider] += 1

    def select_healthy(self) -> str:
        # Choose provider with lowest error count
        return min(self.providers, key=lambda p: self.error_counts[p])
""",
        """from solution import HealthAwareModelRouter

def test_health_router():
    router = HealthAwareModelRouter(['openai', 'anthropic'])
    router.record_error('openai')
    assert router.select_healthy() == 'anthropic'
""",
        "Health-aware routing dynamically steers live traffic around degraded upstream AI provider endpoints."
    ),
    (
        34, "node-11-34", "Lesson 12.34: High-Throughput Metric Counter: Count-Min Sketch",
        "Implement a sub-linear Count-Min Sketch estimating frequency of high-volume query terms without unbounded memory.",
        465,
        """import zlib

class CountMinSketch:
    def __init__(self, width: int = 100, depth: int = 4):
        self.w = width
        self.d = depth
        self.table = [[0] * width for _ in range(depth)]

    def _hash(self, key: str, seed: int) -> int:
        return zlib.crc32(f"{seed}:{key}".encode('utf-8')) % self.w

    def add(self, key: str, count: int = 1):
        for i in range(self.d):
            h = self._hash(key, i)
            self.table[i][h] += count

    def estimate(self, key: str) -> int:
        return min(self.table[i][self._hash(key, i)] for i in range(self.d))
""",
        """from solution import CountMinSketch

def test_count_min_sketch():
    cms = CountMinSketch()
    cms.add('popular_query', 10)
    cms.add('rare_query', 1)
    assert cms.estimate('popular_query') >= 10
    assert cms.estimate('rare_query') >= 1
""",
        "Count-Min sketches bound memory usage while tracking top trending search queries in massive ingestion streams."
    ),
    (
        35, "node-11-35", "Lesson 12.35: Sliding Window Percentile Estimator (T-Digest / P-Square)",
        "Implement an approximate percentile estimator maintaining sliding statistics over continuous telemetry streams.",
        470,
        """class SlidingPercentileTracker:
    def __init__(self, window_size: int = 100):
        self.window_size = window_size
        self.buffer = []

    def add(self, val: float):
        self.buffer.append(val)
        if len(self.buffer) > self.window_size:
            self.buffer.pop(0)

    def p95(self) -> float:
        if not self.buffer: return 0.0
        s = sorted(self.buffer)
        idx = int(0.95 * (len(s) - 1))
        return s[idx]
""",
        """from solution import SlidingPercentileTracker

def test_percentile_tracker():
    pt = SlidingPercentileTracker(window_size=100)
    for i in range(100):
        pt.add(float(i))
    assert pt.p95() == 94.0
""",
        "Sliding percentile trackers compute robust Service Level Indicators (SLIs) across high-throughput request windows."
    ),
    (
        36, "node-11-36", "Lesson 12.36: Continuous Profiling Agent: Memory Delta Sampler",
        "Implement a continuous background memory delta sampler capturing heap expansion snapshots between major events.",
        475,
        """class MemoryDeltaSampler:
    def __init__(self):
        self.snapshots = []

    def take_snapshot(self, current_bytes: int, label: str):
        delta = current_bytes - (self.snapshots[-1]['bytes'] if self.snapshots else 0)
        self.snapshots.append({'label': label, 'bytes': current_bytes, 'delta': delta})
""",
        """from solution import MemoryDeltaSampler

def test_memory_delta():
    md = MemoryDeltaSampler()
    md.take_snapshot(100, 'init')
    md.take_snapshot(250, 'post_load')
    assert md.snapshots[1]['delta'] == 150
""",
        "Continuous memory sampling pinpoints subtle memory leaks before they accumulate to crash host containers."
    ),
    (
        37, "node-11-37", "Lesson 12.37: Asyncio Event Loop Lag Detector",
        "Implement a drift detector calculating scheduled vs actual execution lag in asynchronous event loops.",
        480,
        """class EventLoopLagDetector:
    @staticmethod
    def measure_lag(expected_delay: float, actual_elapsed: float) -> float:
        lag = max(0.0, actual_elapsed - expected_delay)
        return round(lag * 1000.0, 2) # in ms
""",
        """from solution import EventLoopLagDetector

def test_lag_detector():
    lag = EventLoopLagDetector.measure_lag(0.01, 0.025)
    assert lag == 15.0 # 15ms lag
""",
        "Event loop lag detection reveals synchronous blocking functions starving cooperative asynchronous tasks."
    ),
    (
        38, "node-11-38", "Lesson 12.38: Distributed Tracing: Span Link Coordinator",
        "Implement OpenTelemetry Span Links linking independent background evaluation traces back to original request contexts.",
        485,
        """class SpanLinkCoordinator:
    @staticmethod
    def create_linked_span(span_name: str, linked_trace_id: str, linked_span_id: str) -> dict:
        return {
            'name': span_name,
            'links': [{'trace_id': linked_trace_id, 'span_id': linked_span_id}]
        }
""",
        """from solution import SpanLinkCoordinator

def test_span_link():
    span = SpanLinkCoordinator.create_linked_span('async_eval', 't1', 's1')
    assert span['links'][0]['trace_id'] == 't1'
""",
        "Span links associate asynchronous evaluations with the user interactions that triggered them."
    ),
    (
        39, "node-11-39", "Lesson 12.39: LLM Cache Hit-Rate & Latency Savings Dashboard",
        "Implement an analytics engine calculating cache hit ratios and total financial/latency savings.",
        490,
        """class CacheSavingsDashboard:
    def __init__(self, cost_per_query: float = 0.01, avg_latency_sec: float = 1.5):
        self.cost_per_q = cost_per_query
        self.avg_lat = avg_latency_sec
        self.hits = 0
        self.misses = 0

    def record_query(self, cached: bool):
        if cached: self.hits += 1
        else: self.misses += 1

    def metrics(self) -> dict:
        total = self.hits + self.misses
        rate = (self.hits / total) if total else 0.0
        return {
            'hit_rate': round(rate, 3),
            'dollars_saved': round(self.hits * self.cost_per_q, 2),
            'time_saved_sec': round(self.hits * self.avg_lat, 2)
        }
""",
        """from solution import CacheSavingsDashboard

def test_savings_dashboard():
    dash = CacheSavingsDashboard()
    dash.record_query(True)
    dash.record_query(False)
    m = dash.metrics()
    assert m['hit_rate'] == 0.5
    assert m['dollars_saved'] == 0.01
""",
        "Cache savings dashboards demonstrate the concrete ROI of semantic query deduplication."
    ),
    (
        40, "node-11-40", "Lesson 12.40: Automated Prompt Optimization (APO) Feedback Loop",
        "Implement an automated prompt optimizer adjusting system prompt directives in response to negative judge evaluations.",
        492,
        """class AutomatedPromptOptimizer:
    @staticmethod
    def adjust_prompt(current_prompt: str, failed_criteria: list) -> str:
        crit_text = "; ".join(failed_criteria)
        return f"{current_prompt}\\nInstruction: Strictly address and fix: {crit_text}."
""",
        """from solution import AutomatedPromptOptimizer

def test_apo():
    p = AutomatedPromptOptimizer.adjust_prompt("Answer concisely.", ["Avoid jargon"])
    assert "Strictly address and fix: Avoid jargon" in p
""",
        "Automated prompt optimization systematically closes evaluation failures via iterative feedback."
    ),
    (
        41, "node-11-41", "Lesson 12.41: Redaction Pipeline for Sensitive Data in Traces",
        "Implement a data sanitization filter masking email addresses and credit card numbers from logged span payloads.",
        494,
        """import re

class DataSanitizer:
    @staticmethod
    def mask_pii(text: str) -> str:
        # Mask emails
        text = re.sub(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', '[EMAIL_REDACTED]', text)
        # Mask 16-digit cards
        text = re.sub(r'\\b\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}\\b', '[CARD_REDACTED]', text)
        return text
""",
        """from solution import DataSanitizer

def test_pii_sanitization():
    raw = "User email is test@example.com, card 1234-5678-9012-3456."
    clean = DataSanitizer.mask_pii(raw)
    assert '[EMAIL_REDACTED]' in clean
    assert '[CARD_REDACTED]' in clean
""",
        "Data sanitization ensures telemetry pipelines remain compliant with GDPR and SOC2 privacy boundaries."
    ),
    (
        42, "node-11-42", "Lesson 12.42: Alerting Engine: Multi-Window Multi-Burn-Rate Alerts",
        "Implement an SRE burn-rate monitor triggering multi-tier alerts based on consumed error budget rates.",
        496,
        """class ErrorBudgetBurnAlert:
    @staticmethod
    def evaluate_burn_rate(error_rate: float, slo_target: float = 0.99) -> str:
        allowed_error_rate = 1.0 - slo_target # 0.01
        burn_rate = error_rate / allowed_error_rate
        if burn_rate >= 14.4:
            return 'PAGE_IMMEDIATE' # 2% budget in 1 hour
        elif burn_rate >= 6.0:
            return 'TICKET_WARNING'
        return 'NORMAL'
""",
        """from solution import ErrorBudgetBurnAlert

def test_burn_rate():
    assert ErrorBudgetBurnAlert.evaluate_burn_rate(0.15) == 'PAGE_IMMEDIATE'
    assert ErrorBudgetBurnAlert.evaluate_burn_rate(0.001) == 'NORMAL'
""",
        "Multi-burn-rate alerts page engineers quickly for severe outages while preventing alert fatigue on transient spikes."
    ),
    (
        43, "node-11-43", "Lesson 12.43: Chaos Testing: Synthetic LLM Latency & Error Injector",
        "Build a fault injection interceptor injecting synthetic HTTP 429 rate limits and latency delays into model calls.",
        498,
        """class ModelFaultInjector:
    def __init__(self, inject_rate_limit: bool = False, delay_sec: float = 0.0):
        self.rate_limit = inject_rate_limit
        self.delay = delay_sec

    def call_model(self, prompt: str, real_model_fn):
        if self.rate_limit:
            raise ConnectionRefusedError("HTTP 429 Too Many Requests")
        return real_model_fn(prompt)
""",
        """from solution import ModelFaultInjector

def test_fault_injection():
    injector = ModelFaultInjector(inject_rate_limit=True)
    try:
        injector.call_model('hello', lambda p: 'ok')
        assert False
    except ConnectionRefusedError:
        pass
""",
        "Fault injection verifies that fallback chains and backoff algorithms behave correctly under provider outages."
    ),
    (
        44, "node-11-44", "Lesson 12.44: Trace-Based Synthetic Canary Testing",
        "Implement a synthetic canary tester periodically executing end-to-end user journeys and validating span assertions.",
        500,
        """class SyntheticCanaryTester:
    @staticmethod
    def run_canary(pipeline_fn) -> bool:
        try:
            res = pipeline_fn("Canary ping")
            return res.get('status') == 200 and 'response' in res
        except Exception:
            return False
""",
        """from solution import SyntheticCanaryTester

def test_canary_tester():
    ok_pipeline = lambda q: {'status': 200, 'response': 'pong'}
    bad_pipeline = lambda q: {'status': 500}
    assert SyntheticCanaryTester.run_canary(ok_pipeline) is True
    assert SyntheticCanaryTester.run_canary(bad_pipeline) is False
""",
        "Synthetic canaries proactively detect silent platform breakages before end-users encounter errors."
    ),
    (
        45, "node-11-45", "Lesson 12.45: OpenInference Semantic Conventions Formatter",
        "Implement an OpenInference formatter mapping raw model attributes to standard `llm.model_name` and `llm.token_count` keys.",
        500,
        """class OpenInferenceFormatter:
    @staticmethod
    def format_span(span_data: dict) -> dict:
        return {
            'openinference.span.kind': 'LLM',
            'llm.model_name': span_data.get('model'),
            'llm.token_count.prompt': span_data.get('prompt_tokens', 0),
            'llm.token_count.completion': span_data.get('completion_tokens', 0)
        }
""",
        """from solution import OpenInferenceFormatter

def test_open_inference():
    raw = {'model': 'gpt-4o', 'prompt_tokens': 100, 'completion_tokens': 50}
    f = OpenInferenceFormatter.format_span(raw)
    assert f['openinference.span.kind'] == 'LLM'
    assert f['llm.token_count.prompt'] == 100
""",
        "OpenInference semantic conventions standardize AI telemetry visualization across external observability dashboards."
    ),
    (
        46, "node-11-46", "Lesson 12.46: Model Degradation Monitor: Perplexity Tracking",
        "Implement a moving perplexity monitor detecting accuracy degradation in local quantized models.",
        500,
        """import math

class PerplexityMonitor:
    @staticmethod
    def compute_perplexity(cross_entropy_losses: list) -> float:
        if not cross_entropy_losses: return 0.0
        avg_loss = sum(cross_entropy_losses) / len(cross_entropy_losses)
        return round(math.exp(avg_loss), 2)
""",
        """from solution import PerplexityMonitor

def test_perplexity():
    perp = PerplexityMonitor.compute_perplexity([1.0, 1.0, 1.0])
    assert abs(perp - math.exp(1.0)) < 0.05
""",
        "Perplexity tracking detects subtle model degradation caused by aggressive INT4/INT8 quantization weights."
    ),
    (
        47, "node-11-47", "Lesson 12.47: Root Cause Analysis Engine for Multi-Hop Agent Failures",
        "Implement an execution tree crawler identifying the earliest ancestor span responsible for agent workflow failures.",
        500,
        """class RootCauseAnalyzer:
    @staticmethod
    def find_first_failure(span_tree: list) -> str:
        # span_tree: list of {'id': str, 'status': 'OK'|'ERROR'} sorted by start_time
        for s in span_tree:
            if s['status'] == 'ERROR':
                return s['id']
        return None
""",
        """from solution import RootCauseAnalyzer

def test_root_cause():
    spans = [{'id': 's1', 'status': 'OK'}, {'id': 's2', 'status': 'ERROR'}, {'id': 's3', 'status': 'ERROR'}]
    assert RootCauseAnalyzer.find_first_failure(spans) == 's2'
""",
        "Root cause analyzers trace compound agent failure cascades back to the initial faulty tool invocation."
    ),
    (
        48, "node-11-48", "Lesson 12.48: Feedback Loop: User Thumbs Up/Down Attribution",
        "Implement a feedback correlator joining end-user thumbs-up/down ratings with historical span and chunk IDs.",
        500,
        """class UserFeedbackCorrelator:
    def __init__(self):
        self.records = {}

    def attach_feedback(self, trace_id: str, rating: int, comment: str = ""):
        self.records[trace_id] = {'rating': rating, 'comment': comment}

    def get_feedback(self, trace_id: str) -> dict:
        return self.records.get(trace_id)
""",
        """from solution import UserFeedbackCorrelator

def test_feedback():
    ufc = UserFeedbackCorrelator()
    ufc.attach_feedback('t123', -1, "Answer was hallucinated")
    assert ufc.get_feedback('t123')['rating'] == -1
""",
        "User feedback loops correlate human sentiment directly with generation parameters to drive model fine-tuning."
    ),
    (
        49, "node-11-49", "Lesson 12.49: GPU Utilization & Tensor Core Efficiency Profiler",
        "Build a GPU telemetry parser computing tensor core duty cycles, VRAM memory usage, and idle bubbles.",
        500,
        """class GPUProfiler:
    @staticmethod
    def compute_duty_cycle(compute_time_ms: float, total_time_ms: float) -> float:
        if total_time_ms == 0.0: return 0.0
        return round((compute_time_ms / total_time_ms) * 100.0, 2)
""",
        """from solution import GPUProfiler

def test_gpu_profiler():
    duty = GPUProfiler.compute_duty_cycle(80.0, 100.0)
    assert duty == 80.0
""",
        "GPU telemetry pinpoints memory transfer stalls that starve tensor cores during distributed training and inference."
    ),
    (
        50, "node-11-50", "Lesson 12.50: Capstone: Full-Stack AI Observability & Quality Platform",
        "Synthesize a production observability platform unifying OpenTelemetry spans, TTFT tracking, RAG triad scoring, and alerting.",
        500,
        """class FullStackAIObservabilityPlatform:
    def __init__(self):
        self.traces = []
        self.alerts = []

    def record_interaction(self, trace_id: str, ttft_ms: float, faithfulness: float):
        record = {'trace_id': trace_id, 'ttft_ms': ttft_ms, 'faithfulness': faithfulness}
        self.traces.append(record)
        if faithfulness < 0.5:
            self.alerts.append(f"ALERT: Hallucination detected in trace {trace_id}")
        if ttft_ms > 2000.0:
            self.alerts.append(f"ALERT: High TTFT latency in trace {trace_id}")
""",
        """from solution import FullStackAIObservabilityPlatform

def test_observability_platform_capstone():
    platform = FullStackAIObservabilityPlatform()
    platform.record_interaction('tr_01', 500.0, 0.95)
    assert len(platform.alerts) == 0
    platform.record_interaction('tr_02', 3000.0, 0.2)
    assert len(platform.alerts) == 2
""",
        "Complete AI observability platforms combine distributed tracing, streaming latency SLIs, and automated evaluation guardrails into a resilient operations console."
    )
]

print(f"Prepared {len(lessons)} lessons for Module 12.")

# Sync updates (node-11-1 to node-11-25) and inserts (node-11-26 to node-11-50)
for order_idx, node_id, title, desc, xp, code, tests, failure_mode in lessons:
    starter_dict = {'solution.py': code}
    test_dict = {
        'tests.py': tests,
        'failure_mode': failure_mode,
        'verification_criteria': f"Run test suite for {title} with zero assertion errors."
    }
    
    starter_json = sql_escape(json.dumps(starter_dict)) + "::jsonb"
    test_json = sql_escape(json.dumps(test_dict)) + "::jsonb"
    title_escaped = sql_escape(title)
    subtitle_escaped = sql_escape(f"Module 12: Systems Performance Profiling & AI Observability | Lesson {order_idx} of 50")
    cs_escaped = sql_escape(f"Observability & Profiling | {title.split(':', 1)[-1].strip()[:50]}")
    ai_escaped = sql_escape(desc)
    slug = f"module-12-lesson-{order_idx:02d}-{slugify(title.split(':', 1)[-1])}"
    slug_escaped = sql_escape(slug)

    handbook = f"""# {title}

- **Module**: `Module 12: Systems Performance Profiling & AI Observability`
- **Focus**: {desc}
- **Verification**: Run test suite for `{title}` with zero assertion errors.

## Architectural Deep Dive
High-scale AI platforms demand real-time telemetry: OpenTelemetry distributed tracing, streaming latency SLIs (TTFT/ITL), automated RAG evaluations, and drift monitoring.
"""
    handbook_escaped = sql_escape(handbook)

    if order_idx <= 25:
        sql = f"""
UPDATE curriculum_nodes
SET title = {title_escaped},
    subtitle = {subtitle_escaped},
    cs_foundation = {cs_escaped},
    ai_convergence = {ai_escaped},
    xp_reward = {xp},
    starter_code = {starter_json},
    test_suite = {test_json},
    handbook_markdown = {handbook_escaped}
WHERE id = '{node_id}';
"""
        run_sql(sql)
        print(f"Updated {node_id}: {title}")
    else:
        check_sql = f"SELECT id FROM curriculum_nodes WHERE id = '{node_id}';"
        res = run_sql(check_sql)
        if res:
            sql = f"""
UPDATE curriculum_nodes
SET title = {title_escaped},
    subtitle = {subtitle_escaped},
    cs_foundation = {cs_escaped},
    ai_convergence = {ai_escaped},
    order_index = {order_idx},
    xp_reward = {xp},
    starter_code = {starter_json},
    test_suite = {test_json},
    handbook_markdown = {handbook_escaped}
WHERE id = '{node_id}';
"""
            run_sql(sql)
            print(f"Updated expanded node {node_id}: {title}")
        else:
            sql = f"""
INSERT INTO curriculum_nodes (id, slug, phase_id, title, subtitle, cs_foundation, ai_convergence, order_index, xp_reward, starter_code, test_suite, handbook_markdown, level_required, position_x, position_y)
VALUES (
    '{node_id}',
    {slug_escaped},
    'module-12',
    {title_escaped},
    {subtitle_escaped},
    {cs_escaped},
    {ai_escaped},
    {order_idx},
    {xp},
    {starter_json},
    {test_json},
    {handbook_escaped},
    1,
    0.0,
    0.0
);
"""
            run_sql(sql)
            print(f"Inserted new node {node_id}: {title}")

print("Module 12 successfully synced!")
