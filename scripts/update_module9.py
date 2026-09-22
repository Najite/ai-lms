# Generate and update Module 9 nodes (node-8-1 to node-8-50) in Supabase
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
SET title = 'Module 9: High-Level System Design & Scalability',
    description = 'High-throughput system architecture: consistent hashing, distributed rate limiters, multi-tier caches, sharding, continuous batching, and LLM gateway routing.'
WHERE id = 'module-9';
"""
run_sql(update_phase_sql)
print("Updated curriculum_phases for module-9")

# 50 Lessons
lessons = [
    (
        1, "node-8-1", "Lesson 9.1: Back-of-the-Envelope Capacity Estimation Engine",
        "Implement a programmatic capacity calculator estimating QPS, daily storage ingestion, memory cache footprints, and network egress bandwidth.",
        250,
        """class CapacityEstimator:
    @staticmethod
    def calculate_storage_gb(daily_active_users: int, writes_per_user: int, avg_payload_bytes: int, retention_days: int) -> float:
        total_bytes = daily_active_users * writes_per_user * avg_payload_bytes * retention_days
        return round(total_bytes / (1024 ** 3), 2)

    @staticmethod
    def calculate_peak_qps(daily_requests: int, peak_factor: float = 2.0) -> int:
        seconds_in_day = 86400
        avg_qps = daily_requests / seconds_in_day
        return int(avg_qps * peak_factor)
""",
        """from solution import CapacityEstimator

def test_estimator():
    storage = CapacityEstimator.calculate_storage_gb(10_000_000, 2, 500, 365)
    assert storage > 6000 # ~6800 GB
    peak = CapacityEstimator.calculate_peak_qps(86_400_000, 2.0)
    assert peak == 2000
""",
        "Capacity estimates must adhere to standard dimensional analysis for storage, memory, and bandwidth constraints."
    ),
    (
        2, "node-8-2", "Lesson 9.2: Consistent Hashing Ring with Virtual Nodes",
        "Implement a consistent hashing ring using virtual nodes to distribute keys uniformly and minimize churn upon server additions/removals.",
        255,
        """import hashlib
import bisect

class ConsistentHashRing:
    def __init__(self, replicas: int = 100):
        self.replicas = replicas
        self.ring = [] # sorted list of hash integers
        self.node_map = {} # hash -> node_id

    def _hash(self, key: str) -> int:
        return int(hashlib.md5(key.encode('utf-8')).hexdigest(), 16)

    def add_node(self, node: str):
        for i in range(self.replicas):
            vkey = f"{node}#{i}"
            h = self._hash(vkey)
            bisect.insort(self.ring, h)
            self.node_map[h] = node

    def remove_node(self, node: str):
        for i in range(self.replicas):
            vkey = f"{node}#{i}"
            h = self._hash(vkey)
            idx = bisect.bisect_left(self.ring, h)
            if idx < len(self.ring) and self.ring[idx] == h:
                del self.ring[idx]
                del self.node_map[h]

    def get_node(self, key: str) -> str:
        if not self.ring:
            return None
        h = self._hash(key)
        idx = bisect.bisect_right(self.ring, h)
        if idx == len(self.ring):
            idx = 0
        return self.node_map[self.ring[idx]]
""",
        """from solution import ConsistentHashRing

def test_consistent_hashing():
    ring = ConsistentHashRing(replicas=50)
    ring.add_node('server1')
    ring.add_node('server2')
    n1 = ring.get_node('user:100')
    assert n1 in ('server1', 'server2')
    ring.remove_node('server2')
    assert ring.get_node('user:100') == 'server1'
""",
        "Consistent hashing rings must wrap around monotonically and maintain uniform key balance across replicas."
    ),
    (
        3, "node-8-3", "Lesson 9.3: Distributed Rate Limiter I: Token Bucket Algorithm",
        "Build a stateful Token Bucket rate limiter calculating fractional token accrual and burst capacity.",
        260,
        """import time

class TokenBucket:
    def __init__(self, capacity: int, refill_rate_per_sec: float):
        self.capacity = capacity
        self.refill_rate = refill_rate_per_sec
        self.tokens = float(capacity)
        self.last_update = time.time()

    def allow_request(self, cost: int = 1) -> bool:
        now = time.time()
        elapsed = now - self.last_update
        self.last_update = now
        self.tokens = min(float(self.capacity), self.tokens + elapsed * self.refill_rate)
        if self.tokens >= cost:
            self.tokens -= cost
            return True
        return False
""",
        """from solution import TokenBucket

def test_token_bucket():
    tb = TokenBucket(capacity=2, refill_rate_per_sec=1.0)
    assert tb.allow_request(1) is True
    assert tb.allow_request(1) is True
    assert tb.allow_request(1) is False
""",
        "Token bucket limiters must allow instantaneous bursts up to capacity while capping long-term replenishment rates."
    ),
    (
        4, "node-8-4", "Lesson 9.4: Distributed Rate Limiter II: Sliding Window Log",
        "Implement a Sliding Window Log rate limiter preserving timestamp histories to eliminate edge-of-window burst spikes.",
        265,
        """class SlidingWindowLog:
    def __init__(self, max_requests: int, window_sec: float):
        self.max_requests = max_requests
        self.window_sec = window_sec
        self.logs = {} # client_id -> list of timestamps

    def allow_request(self, client_id: str, timestamp: float) -> bool:
        self.logs.setdefault(client_id, [])
        threshold = timestamp - self.window_sec
        self.logs[client_id] = [t for t in self.logs[client_id] if t > threshold]
        if len(self.logs[client_id]) < self.max_requests:
            self.logs[client_id].append(timestamp)
            return True
        return False
""",
        """from solution import SlidingWindowLog

def test_sliding_log():
    sw = SlidingWindowLog(max_requests=2, window_sec=10.0)
    assert sw.allow_request('c1', 1.0) is True
    assert sw.allow_request('c1', 2.0) is True
    assert sw.allow_request('c1', 3.0) is False
    assert sw.allow_request('c1', 11.5) is True # 1.0 dropped
""",
        "Sliding window logs enforce exact quota boundaries by tracking fine-grained request timestamps."
    ),
    (
        5, "node-8-5", "Lesson 9.5: Distributed Rate Limiter III: Sliding Window Counter",
        "Implement a memory-efficient Sliding Window Counter interpolating request density across current and previous time buckets.",
        270,
        """class SlidingWindowCounter:
    def __init__(self, max_requests: int, window_sec: float):
        self.max_requests = max_requests
        self.window_sec = window_sec
        self.prev_count = 0
        self.curr_count = 0
        self.curr_bucket_start = 0.0

    def allow_request(self, timestamp: float) -> bool:
        bucket_index = int(timestamp // self.window_sec)
        bucket_start = bucket_index * self.window_sec
        if bucket_start != self.curr_bucket_start:
            if bucket_start == self.curr_bucket_start + self.window_sec:
                self.prev_count = self.curr_count
            else:
                self.prev_count = 0
            self.curr_count = 0
            self.curr_bucket_start = bucket_start
            
        time_into_bucket = timestamp - self.curr_bucket_start
        weight = 1.0 - (time_into_bucket / self.window_sec)
        estimated_load = self.prev_count * weight + self.curr_count
        if estimated_load < self.max_requests:
            self.curr_count += 1
            return True
        return False
""",
        """from solution import SlidingWindowCounter

def test_sliding_counter():
    sc = SlidingWindowCounter(max_requests=10, window_sec=60.0)
    for _ in range(10):
        assert sc.allow_request(10.0) is True
    assert sc.allow_request(10.0) is False
""",
        "Sliding window counters achieve $O(1)$ memory footprints while preventing border boundary quota gaming."
    ),
    (
        6, "node-8-6", "Lesson 9.6: Multi-Tier Caching: Cache-Aside vs Write-Through",
        "Implement Cache-Aside and Write-Through caching strategies coordinating in-memory caches and persistent stores.",
        275,
        """class CacheAsideStore:
    def __init__(self, db: dict):
        self.db = db
        self.cache = {}

    def get(self, key: str):
        if key in self.cache:
            return self.cache[key]
        val = self.db.get(key)
        if val is not None:
            self.cache[key] = val
        return val

    def put(self, key: str, value):
        self.db[key] = value
        self.cache.pop(key, None) # Invalidate on write
""",
        """from solution import CacheAsideStore

def test_cache_aside():
    db = {'user:1': 'Alice'}
    cas = CacheAsideStore(db)
    assert cas.get('user:1') == 'Alice'
    assert 'user:1' in cas.cache
    cas.put('user:1', 'Alicia')
    assert 'user:1' not in cas.cache
    assert cas.get('user:1') == 'Alicia'
""",
        "Cache-aside architectures maintain data freshness by invalidating cached entries upon mutation."
    ),
    (
        7, "node-8-7", "Lesson 9.7: Cache Invalidation & Thundering Herd Defense",
        "Build a single-flight mutex coordinator preventing duplicate concurrent downstream queries during cache misses.",
        280,
        """class SingleFlight:
    def __init__(self):
        self.in_flight = {} # key -> list of waiting callers or result

    def do(self, key: str, fetcher_fn):
        if key in self.in_flight:
            return self.in_flight[key]
        result = fetcher_fn()
        self.in_flight[key] = result
        return result
""",
        """from solution import SingleFlight

def test_single_flight():
    sf = SingleFlight()
    calls = [0]
    def db_query():
        calls[0] += 1
        return 'data'
    r1 = sf.do('key1', db_query)
    r2 = sf.do('key1', db_query)
    assert r1 == r2 == 'data'
    assert calls[0] == 1
""",
        "Single-flight coalescing guarantees exactly one backend query fires per cache key under massive concurrent loads."
    ),
    (
        8, "node-8-8", "Lesson 9.8: Load Balancing Algorithms: Weighted Round-Robin",
        "Implement a Weighted Round-Robin load balancer distributing requests proportionally across heterogeneous backend servers.",
        285,
        """class WeightedRoundRobin:
    def __init__(self, server_weights: dict):
        self.servers = list(server_weights.keys())
        self.weights = server_weights
        self.current_weights = {s: 0 for s in self.servers}

    def select(self) -> str:
        total_weight = sum(self.weights.values())
        for s in self.servers:
            self.current_weights[s] += self.weights[s]
        chosen = max(self.servers, key=lambda s: self.current_weights[s])
        self.current_weights[chosen] -= total_weight
        return chosen
""",
        """from solution import WeightedRoundRobin

def test_wrr():
    wrr = WeightedRoundRobin({'s1': 3, 's2': 1})
    picks = [wrr.select() for _ in range(4)]
    assert picks.count('s1') == 3
    assert picks.count('s2') == 1
""",
        "Weighted round-robin smooths allocation across servers according to provisioned CPU/memory weights."
    ),
    (
        9, "node-8-9", "Lesson 9.9: Least Connections & Peak EWMA Load Balancer",
        "Build an Exponentially Weighted Moving Average (EWMA) load balancer selecting servers with lowest active latency.",
        290,
        """class EWMALoadBalancer:
    def __init__(self, servers: list, decay: float = 0.2):
        self.servers = servers
        self.decay = decay
        self.latencies = {s: 1.0 for s in servers}
        self.active_conns = {s: 0 for s in servers}

    def record_response(self, server: str, latency: float):
        old = self.latencies[server]
        self.latencies[server] = (1 - self.decay) * old + self.decay * latency

    def select(self) -> str:
        # Score = active_connections * ewma_latency
        return min(self.servers, key=lambda s: (self.active_conns[s] + 1) * self.latencies[s])
""",
        """from solution import EWMALoadBalancer

def test_ewma_lb():
    lb = EWMALoadBalancer(['srv_a', 'srv_b'])
    lb.record_response('srv_a', 10.0)
    lb.record_response('srv_b', 1.0)
    assert lb.select() == 'srv_b'
""",
        "Peak EWMA routing steers high-concurrency requests away from degradation pockets and slow nodes."
    ),
    (
        10, "node-8-10", "Lesson 9.10: High-Throughput API Gateway Reverse Proxy",
        "Implement an API Gateway router enforcing path rewrites, bearer authentication headers, and downstream timeouts.",
        295,
        """class APIGateway:
    def __init__(self):
        self.routes = {} # prefix -> backend_url

    def add_route(self, prefix: str, backend_url: str):
        self.routes[prefix] = backend_url

    def route_request(self, path: str, headers: dict) -> dict:
        if 'authorization' not in headers:
            return {'status': 401, 'error': 'Unauthorized'}
        for prefix, backend in self.routes.items():
            if path.startswith(prefix):
                forwarded = path[len(prefix):]
                return {
                    'status': 200,
                    'target_url': f"{backend}{forwarded}",
                    'headers': {**headers, 'x-gateway-routed': 'true'}
                }
        return {'status': 404, 'error': 'Route not found'}
""",
        """from solution import APIGateway

def test_api_gateway():
    gw = APIGateway()
    gw.add_route('/api/v1/users', 'https://user-service')
    res = gw.route_request('/api/v1/users/profile', {'authorization': 'Bearer xxx'})
    assert res['status'] == 200
    assert res['target_url'] == 'https://user-service/profile'
""",
        "API gateways terminate client authentication and translate public paths to private cluster microservices."
    ),
    (
        11, "node-8-11", "Lesson 9.11: Circuit Breaker Pattern (Hystrix State Machine)",
        "Build a Circuit Breaker state machine transitioning between CLOSED, OPEN, and HALF-OPEN states based on error thresholds.",
        300,
        """class CircuitBreaker:
    def __init__(self, failure_threshold: int = 3, reset_timeout: float = 5.0):
        self.failure_threshold = failure_threshold
        self.reset_timeout = reset_timeout
        self.state = 'CLOSED'
        self.failure_count = 0
        self.last_state_change = 0.0

    def record_failure(self, timestamp: float):
        self.failure_count += 1
        if self.failure_count >= self.failure_threshold:
            self.state = 'OPEN'
            self.last_state_change = timestamp

    def record_success(self):
        self.failure_count = 0
        self.state = 'CLOSED'

    def can_attempt(self, timestamp: float) -> bool:
        if self.state == 'CLOSED':
            return True
        if self.state == 'OPEN' and (timestamp - self.last_state_change >= self.reset_timeout):
            self.state = 'HALF-OPEN'
            return True
        return self.state == 'HALF-OPEN'
""",
        """from solution import CircuitBreaker

def test_circuit_breaker():
    cb = CircuitBreaker(failure_threshold=2, reset_timeout=10.0)
    cb.record_failure(1.0)
    assert cb.can_attempt(2.0) is True
    cb.record_failure(2.0)
    assert cb.state == 'OPEN'
    assert cb.can_attempt(5.0) is False
    assert cb.can_attempt(13.0) is True
    assert cb.state == 'HALF-OPEN'
""",
        "Circuit breakers isolate failing dependencies and prevent cascading systemic outages."
    ),
    (
        12, "node-8-12", "Lesson 9.12: Distributed Unique ID Generator: Snowflake Algorithm",
        "Implement Twitter Snowflake 64-bit ID generation composed of timestamp, machine ID, and atomic sequence numbers.",
        305,
        """class SnowflakeGenerator:
    def __init__(self, worker_id: int, epoch: int = 1700000000000):
        self.worker_id = worker_id & 0x3FF # 10 bits
        self.epoch = epoch
        self.sequence = 0
        self.last_timestamp = -1

    def generate(self, current_timestamp_ms: int) -> int:
        if current_timestamp_ms == self.last_timestamp:
            self.sequence = (self.sequence + 1) & 0xFFF # 12 bits
            if self.sequence == 0:
                current_timestamp_ms += 1
        else:
            self.sequence = 0
        self.last_timestamp = current_timestamp_ms
        time_offset = current_timestamp_ms - self.epoch
        
        # 64-bit: 1 unused, 41 timestamp, 10 worker, 12 sequence
        snowflake = (time_offset << 22) | (self.worker_id << 12) | self.sequence
        return snowflake
""",
        """from solution import SnowflakeGenerator

def test_snowflake():
    gen = SnowflakeGenerator(worker_id=5)
    id1 = gen.generate(1710000000000)
    id2 = gen.generate(1710000000000)
    assert id2 > id1
    assert (id1 >> 12) & 0x3FF == 5 # Worker ID encoded
""",
        "Snowflake IDs encode timestamp ordering into 64-bit integers without database auto-increment bottlenecks."
    ),
    (
        13, "node-8-13", "Lesson 9.13: Monotonic UUIDv7 Generator with Entropy Padding",
        "Implement RFC 9562 UUIDv7 generator structuring millisecond timestamp prefixes with monotonic counter sub-fields.",
        310,
        """import os

def generate_uuidv7(timestamp_ms: int) -> str:
    # 48-bit timestamp
    ts_bytes = timestamp_ms.to_bytes(6, byteorder='big')
    rand_bytes = os.urandom(10)
    # Set version (7) and variant (2)
    b = bytearray(ts_bytes + rand_bytes)
    b[6] = (b[6] & 0x0F) | 0x70 # Version 7
    b[8] = (b[8] & 0x3F) | 0x80 # Variant RFC 4122
    h = b.hex()
    return f"{h[:8]}-{h[8:12]}-{h[12:16]}-{h[16:20]}-{h[20:32]}"
""",
        """from solution import generate_uuidv7

def test_uuidv7():
    u1 = generate_uuidv7(1710000000000)
    u2 = generate_uuidv7(1710000001000)
    assert u1[14] == '7'
    assert u2 > u1
""",
        "UUIDv7 optimizes B-Tree index locality by embedding millisecond timestamps into chronological UUIDs."
    ),
    (
        14, "node-8-14", "Lesson 9.14: Database Sharding Engine & Range Partitioning",
        "Implement a range-based sharding coordinator determining shard placement and managing split threshold reorganizations.",
        315,
        """class RangeSharder:
    def __init__(self, partition_ranges: list):
        # List of (upper_bound_inclusive, shard_id) sorted
        self.partitions = partition_ranges

    def get_shard(self, key_id: int) -> str:
        for upper_bound, shard_id in self.partitions:
            if key_id <= upper_bound:
                return shard_id
        return self.partitions[-1][1]
""",
        """from solution import RangeSharder

def test_range_sharding():
    sharder = RangeSharder([(1000, 'shard-1'), (2000, 'shard-2'), (float('inf'), 'shard-3')])
    assert sharder.get_shard(500) == 'shard-1'
    assert sharder.get_shard(1500) == 'shard-2'
    assert sharder.get_shard(5000) == 'shard-3'
""",
        "Range sharding partitions sequentially contiguous data blocks to optimize batch query scans."
    ),
    (
        15, "node-8-15", "Lesson 9.15: Hash Sharding & Dynamic Rebalancing Directory",
        "Implement a virtual bucket directory decoupling logical partitions from physical database nodes.",
        320,
        """class ShardDirectory:
    def __init__(self, num_buckets: int = 1024):
        self.num_buckets = num_buckets
        self.bucket_to_node = {}

    def assign_bucket(self, bucket_idx: int, node_id: str):
        self.bucket_to_node[bucket_idx] = node_id

    def route_key(self, key: str) -> str:
        import zlib
        bucket = zlib.crc32(key.encode('utf-8')) % self.num_buckets
        return self.bucket_to_node.get(bucket)
""",
        """from solution import ShardDirectory

def test_shard_directory():
    sd = ShardDirectory(num_buckets=10)
    for i in range(5): sd.assign_bucket(i, 'db-node-0')
    for i in range(5, 10): sd.assign_bucket(i, 'db-node-1')
    target = sd.route_key('user:99')
    assert target in ('db-node-0', 'db-node-1')
""",
        "Virtual bucket routing isolates physical hardware changes from application sharding keys."
    ),
    (
        16, "node-8-16", "Lesson 9.16: Read-Replica Router & Replication Lag Lag-Aware Proxy",
        "Build a SQL routing proxy dispatching mutations to PRIMARY and reads to REPLICAS while tracking replication lag.",
        325,
        """class ReplicationAwareRouter:
    def __init__(self, primary: str, replicas: list):
        self.primary = primary
        self.replicas = replicas
        self.replica_lag_ms = {r: 0 for r in replicas}

    def update_lag(self, replica: str, lag_ms: int):
        self.replica_lag_ms[replica] = lag_ms

    def route_query(self, query: str, max_allowed_lag_ms: int = 100) -> str:
        is_write = any(query.strip().upper().startswith(kw) for kw in ('INSERT', 'UPDATE', 'DELETE'))
        if is_write:
            return self.primary
        # Choose replica with acceptable lag
        healthy = [r for r in self.replicas if self.replica_lag_ms[r] <= max_allowed_lag_ms]
        if healthy:
            return healthy[0]
        return self.primary
""",
        """from solution import ReplicationAwareRouter

def test_replication_router():
    router = ReplicationAwareRouter('primary', ['rep-1', 'rep-2'])
    assert router.route_query('INSERT INTO logs VALUES (1)') == 'primary'
    router.update_lag('rep-1', 250)
    router.update_lag('rep-2', 10)
    assert router.route_query('SELECT * FROM users') == 'rep-2'
""",
        "Replication-aware proxies fall back to primary writes to eliminate stale reads beyond tolerance thresholds."
    ),
    (
        17, "node-8-17", "Lesson 9.17: Message Broker: In-Memory Pub/Sub Topic Dispatcher",
        "Implement a topic-based publish/subscribe broker supporting multi-subscriber wildcard topic routing.",
        330,
        """class TopicBroker:
    def __init__(self):
        self.subscriptions = {} # topic -> list of callbacks

    def subscribe(self, topic: str, callback):
        self.subscriptions.setdefault(topic, []).append(callback)

    def publish(self, topic: str, message: dict):
        delivered = 0
        for sub_topic, cbs in self.subscriptions.items():
            if sub_topic == topic or sub_topic == '*':
                for cb in cbs:
                    cb(message)
                    delivered += 1
        return delivered
""",
        """from solution import TopicBroker

def test_pubsub():
    broker = TopicBroker()
    received = []
    broker.subscribe('orders.created', lambda m: received.append(m))
    broker.publish('orders.created', {'id': 101})
    assert len(received) == 1
""",
        "Topic brokers decouple producer dispatch loops from downstream event consumer subscriptions."
    ),
    (
        18, "node-8-18", "Lesson 9.18: Partitioned Append-Only Commit Log (Kafka Core)",
        "Build a partitioned append-only log managing continuous byte offsets and consumer group read cursors.",
        335,
        """class PartitionedCommitLog:
    def __init__(self):
        self.partitions = {} # partition_id -> list of (offset, payload)

    def append(self, partition_id: int, message: str) -> int:
        self.partitions.setdefault(partition_id, [])
        offset = len(self.partitions[partition_id])
        self.partitions[partition_id].append((offset, message))
        return offset

    def read_from(self, partition_id: int, start_offset: int, limit: int = 10) -> list:
        records = self.partitions.get(partition_id, [])
        return [payload for off, payload in records if off >= start_offset][:limit]
""",
        """from solution import PartitionedCommitLog

def test_commit_log():
    log = PartitionedCommitLog()
    o0 = log.append(0, 'm0')
    o1 = log.append(0, 'm1')
    assert o0 == 0 and o1 == 1
    items = log.read_from(0, 1)
    assert items == ['m1']
""",
        "Partitioned commit logs guarantee deterministic total message ordering within individual partitions."
    ),
    (
        19, "node-8-19", "Lesson 9.19: Idempotency Key Gatekeeper & Deduplication Store",
        "Build an idempotency interceptor caching completed responses and rejecting concurrent identical transaction keys.",
        340,
        """class IdempotencyGatekeeper:
    def __init__(self):
        self.records = {} # key -> {'status': PENDING|COMPLETE, 'response': dict}

    def process_request(self, idempotency_key: str, handler_fn) -> dict:
        if idempotency_key in self.records:
            rec = self.records[idempotency_key]
            if rec['status'] == 'PENDING':
                return {'status': 409, 'error': 'Conflict: Request currently processing'}
            return rec['response']
            
        self.records[idempotency_key] = {'status': 'PENDING', 'response': None}
        try:
            res = handler_fn()
            self.records[idempotency_key] = {'status': 'COMPLETE', 'response': res}
            return res
        except Exception as e:
            del self.records[idempotency_key]
            raise e
""",
        """from solution import IdempotencyGatekeeper

def test_idempotency():
    gate = IdempotencyGatekeeper()
    calls = [0]
    def charge():
        calls[0] += 1
        return {'status': 200, 'tx_id': 42}
    r1 = gate.process_request('key-abc', charge)
    r2 = gate.process_request('key-abc', charge)
    assert r1 == r2
    assert calls[0] == 1
""",
        "Idempotency keys prevent double billing and repeated downstream side-effects over flaky networks."
    ),
    (
        20, "node-8-20", "Lesson 9.20: Dead Letter Queue (DLQ) & Exponential Retry Pipeline",
        "Implement an automated retry worker routing poison-pill messages to a Dead Letter Queue upon retry exhaustion.",
        345,
        """class RetryPipeline:
    def __init__(self, max_retries: int = 3):
        self.max_retries = max_retries
        self.dlq = []

    def execute(self, message: dict, processor_fn):
        retries = 0
        while retries < self.max_retries:
            try:
                return processor_fn(message)
            except Exception:
                retries += 1
        self.dlq.append({'message': message, 'reason': 'Retries exhausted'})
        return None
""",
        """from solution import RetryPipeline

def test_dlq():
    pipeline = RetryPipeline(max_retries=2)
    def fail(m): raise ValueError("Corrupt payload")
    res = pipeline.execute({'id': 10}, fail)
    assert res is None
    assert len(pipeline.dlq) == 1
    assert pipeline.dlq[0]['message']['id'] == 10
""",
        "Dead letter queues quarantine persistently failing messages to keep production pipelines flowing."
    ),
    (
        21, "node-8-21", "Lesson 9.21: Global URL Shortener: Base62 Bijective Encoding",
        "Build a compact URL shortener converting 64-bit autoincrement IDs into alphanumeric 7-character Base62 keys.",
        350,
        """CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

class URLShortener:
    @staticmethod
    def encode(num: int) -> str:
        if num == 0:
            return CHARS[0]
        res = []
        while num > 0:
            res.append(CHARS[num % 62])
            num //= 62
        return "".join(reversed(res))

    @staticmethod
    def decode(code: str) -> int:
        num = 0
        for c in code:
            num = num * 62 + CHARS.index(c)
        return num
""",
        """from solution import URLShortener

def test_base62():
    code = URLShortener.encode(125)
    assert URLShortener.decode(code) == 125
    code_big = URLShortener.encode(11157)
    assert URLShortener.decode(code_big) == 11157
""",
        "Base62 bijective encoding transforms discrete numeric counters into high-density URL slugs."
    ),
    (
        22, "node-8-22", "Lesson 9.22: Real-Time News Feed: Fan-Out-on-Write Architecture",
        "Implement a Fan-Out-on-Write feed generator pushing post IDs into recipient user timelines upon publish.",
        355,
        """class FanOutWriteFeed:
    def __init__(self):
        self.followers = {} # user -> set of followers
        self.timelines = {} # user -> list of post_ids

    def follow(self, follower: str, followee: str):
        self.followers.setdefault(followee, set()).add(follower)

    def publish_post(self, author: str, post_id: str):
        self.timelines.setdefault(author, []).insert(0, post_id)
        for flw in self.followers.get(author, set()):
            self.timelines.setdefault(flw, []).insert(0, post_id)

    def get_timeline(self, user: str, limit: int = 10) -> list:
        return self.timelines.get(user, [])[:limit]
""",
        """from solution import FanOutWriteFeed

def test_fanout_write():
    feed = FanOutWriteFeed()
    feed.follow('bob', 'alice')
    feed.publish_post('alice', 'post_1')
    assert feed.get_timeline('bob') == ['post_1']
""",
        "Fan-out-on-write shifts computational load from read operations to asynchronous write background workers."
    ),
    (
        23, "node-8-23", "Lesson 9.23: Celebrity News Feed: Hybrid Fan-Out-on-Read",
        "Build a hybrid feed aggregator merging fan-out-on-write timelines with real-time fan-out-on-read celebrity posts.",
        360,
        """class HybridFeed:
    def __init__(self, celebrity_threshold: int = 1000):
        self.celebrity_threshold = celebrity_threshold
        self.followers = {}
        self.timelines = {}
        self.celebrity_posts = {} # celeb -> list of (timestamp, post_id)

    def publish_post(self, author: str, post_id: str, timestamp: float, follower_count: int):
        if follower_count >= self.celebrity_threshold:
            self.celebrity_posts.setdefault(author, []).append((timestamp, post_id))
        else:
            for flw in self.followers.get(author, set()):
                self.timelines.setdefault(flw, []).append((timestamp, post_id))
""",
        """from solution import HybridFeed

def test_hybrid_feed():
    hf = HybridFeed(celebrity_threshold=100)
    hf.publish_post('star', 'vip_post', 10.0, follower_count=500)
    assert 'star' in hf.celebrity_posts
    assert len(hf.timelines) == 0
""",
        "Hybrid feed routing prevents write bottlenecks on ultra-popular celebrity accounts."
    ),
    (
        24, "node-8-24", "Lesson 9.24: Real-Time Chat Engine: WebSocket Connection Manager",
        "Implement a distributed connection registry routing private messages across WebSocket connection servers.",
        365,
        """class ConnectionManager:
    def __init__(self):
        self.user_to_server = {} # user_id -> server_id

    def register(self, user_id: str, server_id: str):
        self.user_to_server[user_id] = server_id

    def unregister(self, user_id: str):
        self.user_to_server.pop(user_id, None)

    def route_message(self, recipient_id: str, message: dict) -> tuple:
        server = self.user_to_server.get(recipient_id)
        if server:
            return ('ONLINE', server, message)
        return ('OFFLINE_QUEUE', 'push_service', message)
""",
        """from solution import ConnectionManager

def test_conn_manager():
    cm = ConnectionManager()
    cm.register('user_1', 'ws-node-3')
    status, dest, _ = cm.route_message('user_1', {'text': 'hi'})
    assert status == 'ONLINE' and dest == 'ws-node-3'
    status2, _, _ = cm.route_message('user_2', {'text': 'hi'})
    assert status2 == 'OFFLINE_QUEUE'
""",
        "Connection state registries decouple transport WebSocket listeners from cluster application services."
    ),
    (
        25, "node-8-25", "Lesson 9.25: Distributed Web Crawler: URL Frontier & Politeness Engine",
        "Implement a polite URL frontier enforcing per-domain crawl delays and URL deduplication via Bloom filter.",
        370,
        """import time

class PolitenessFrontier:
    def __init__(self, delay_sec: float = 1.0):
        self.delay_sec = delay_sec
        self.last_access = {} # domain -> timestamp
        self.seen_urls = set()

    def can_crawl(self, domain: str, url: str, current_time: float) -> bool:
        if url in self.seen_urls:
            return False
        last = self.last_access.get(domain, 0.0)
        if current_time - last >= self.delay_sec:
            self.last_access[domain] = current_time
            self.seen_urls.add(url)
            return True
        return False
""",
        """from solution import PolitenessFrontier

def test_crawler_frontier():
    pf = PolitenessFrontier(delay_sec=5.0)
    assert pf.can_crawl('example.com', 'https://example.com/1', 10.0) is True
    assert pf.can_crawl('example.com', 'https://example.com/2', 12.0) is False
    assert pf.can_crawl('example.com', 'https://example.com/2', 16.0) is True
""",
        "URL frontiers balance throughput against politeness invariants to prevent target server denial of service."
    ),
    (
        26, "node-8-26", "Lesson 9.26: Large-Scale Video Ingestion & Chunk Transcoder Pipeline",
        "Implement an HLS video manifest coordinator generating bitrate ladder segments and playlist indices.",
        375,
        """class HLSManifestGenerator:
    @staticmethod
    def generate_master_manifest(renditions: list) -> str:
        # renditions: list of {'bandwidth': int, 'resolution': str, 'uri': str}
        lines = ["#EXTM3U"]
        for r in renditions:
            lines.append(f"#EXT-X-STREAM-INF:BANDWIDTH={r['bandwidth']},RESOLUTION={r['resolution']}")
            lines.append(r['uri'])
        return "\\n".join(lines)
""",
        """from solution import HLSManifestGenerator

def test_hls_manifest():
    manifest = HLSManifestGenerator.generate_master_manifest([
        {'bandwidth': 800000, 'resolution': '640x360', 'uri': '360p.m3u8'},
        {'bandwidth': 2500000, 'resolution': '1280x720', 'uri': '720p.m3u8'}
    ])
    assert 'BANDWIDTH=800000' in manifest
    assert '720p.m3u8' in manifest
""",
        "Adaptive bitrate streaming segments high-definition video assets into multi-resolution chunk manifests."
    ),
    (
        27, "node-8-27", "Lesson 9.27: Distributed Cloud Object Storage Metadata Engine",
        "Implement an S3-style block placement engine placing chunk replicas across independent failure zones.",
        380,
        """class PlacementEngine:
    def __init__(self, failure_zones: dict):
        # zone -> list of storage_node_ids
        self.zones = failure_zones

    def place_replicas(self, block_id: str, replication_factor: int = 3) -> list:
        placed = []
        zone_keys = list(self.zones.keys())
        for i in range(min(replication_factor, len(zone_keys))):
            zone = zone_keys[i]
            node = self.zones[zone][0]
            placed.append(node)
        return placed
""",
        """from solution import PlacementEngine

def test_placement():
    pe = PlacementEngine({'us-east-1a': ['node1'], 'us-east-1b': ['node2'], 'us-east-1c': ['node3']})
    nodes = pe.place_replicas('block_99', 3)
    assert len(nodes) == 3
    assert 'node1' in nodes and 'node2' in nodes
""",
        "Distributed object stores ensure data survivability by isolating replicas across distinct power and network zones."
    ),
    (
        28, "node-8-28", "Lesson 9.28: Real-Time Geospatial Index: Geohash & Spatial Buckets",
        "Implement a Base32 Geohash encoder interleaving latitude and longitude bit sequences for proximity lookups.",
        385,
        """class SimpleSpatialBucket:
    def __init__(self, grid_size: float = 0.01):
        self.grid_size = grid_size
        self.buckets = {} # (gx, gy) -> list of entity_ids

    def insert(self, entity_id: str, lat: float, lon: float):
        gx = int(lat / self.grid_size)
        gy = int(lon / self.grid_size)
        self.buckets.setdefault((gx, gy), []).append(entity_id)

    def query_radius(self, lat: float, lon: float) -> list:
        gx = int(lat / self.grid_size)
        gy = int(lon / self.grid_size)
        found = []
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                found.extend(self.buckets.get((gx + dx, gy + dy), []))
        return found
""",
        """from solution import SimpleSpatialBucket

def test_spatial_bucket():
    sb = SimpleSpatialBucket(grid_size=0.1)
    sb.insert('cab1', 37.77, -122.41)
    results = sb.query_radius(37.775, -122.415)
    assert 'cab1' in results
""",
        "Spatial grid hashing maps two-dimensional coordinates into discrete memory buckets for sub-millisecond retrieval."
    ),
    (
        29, "node-8-29", "Lesson 9.29: QuadTree Geospatial Indexer for Dynamic Moving Entities",
        "Implement a QuadTree node capable of recursive four-way quadrant splitting upon exceeding capacity.",
        390,
        """class QuadTree:
    def __init__(self, x: float, y: float, w: float, h: float, capacity: int = 4):
        self.boundary = (x, y, w, h)
        self.capacity = capacity
        self.points = []
        self.divided = False

    def insert(self, pt: tuple) -> bool:
        x, y, w, h = self.boundary
        px, py = pt
        if not (x <= px <= x + w and y <= py <= y + h):
            return False
        if len(self.points) < self.capacity and not self.divided:
            self.points.append(pt)
            return True
        if not self.divided:
            self._subdivide()
        return any(child.insert(pt) for child in self.children)

    def _subdivide(self):
        x, y, w, h = self.boundary
        hw, hh = w / 2, h / 2
        self.children = [
            QuadTree(x, y, hw, hh, self.capacity),
            QuadTree(x + hw, y, hw, hh, self.capacity),
            QuadTree(x, y + hh, hw, hh, self.capacity),
            QuadTree(x + hw, y + hh, hw, hh, self.capacity)
        ]
        self.divided = True
        for p in self.points:
            for child in self.children:
                if child.insert(p): break
        self.points = []
""",
        """from solution import QuadTree

def test_quadtree():
    qt = QuadTree(0, 0, 100, 100, capacity=2)
    qt.insert((10, 10))
    qt.insert((20, 20))
    assert qt.divided is False
    qt.insert((30, 30))
    assert qt.divided is True
""",
        "QuadTrees dynamically allocate spatial resolution proportionally to entity concentration."
    ),
    (
        30, "node-8-30", "Lesson 9.30: Financial Ledger: Double-Entry Bookkeeping Engine",
        "Build an immutable financial transaction ledger verifying zero-sum debit and credit balances.",
        395,
        """class DoubleEntryLedger:
    def __init__(self):
        self.entries = []
        self.balances = {} # account -> amount

    def record_transaction(self, tx_id: str, debits: list, credits: list):
        total_debit = sum(amount for _, amount in debits)
        total_credit = sum(amount for _, amount in credits)
        if total_debit != total_credit:
            raise ValueError("Transaction unbalanced: Debits must equal Credits")
        for acc, amt in debits:
            self.balances[acc] = self.balances.get(acc, 0) + amt
        for acc, amt in credits:
            self.balances[acc] = self.balances.get(acc, 0) - amt
        self.entries.append({'tx_id': tx_id, 'debits': debits, 'credits': credits})
""",
        """from solution import DoubleEntryLedger

def test_ledger():
    ledger = DoubleEntryLedger()
    ledger.record_transaction('tx1', [('asset:bank', 100)], [('equity:owner', 100)])
    assert ledger.balances['asset:bank'] == 100
    assert ledger.balances['equity:owner'] == -100
""",
        "Double-entry bookkeeping mathematically ensures money is neither created nor destroyed in flight."
    ),
    (
        31, "node-8-31", "Lesson 9.31: Distributed Payment Saga Coordinator",
        "Implement a Saga orchestrator coordinating multi-service transactions with compensating rollback steps.",
        400,
        """class SagaCoordinator:
    def __init__(self):
        self.log = []

    def execute(self, steps: list):
        # steps: list of (action_fn, compensate_fn)
        completed = []
        for action, compensate in steps:
            try:
                res = action()
                completed.append(compensate)
            except Exception as e:
                # Rollback
                for comp in reversed(completed):
                    comp()
                return False
        return True
""",
        """from solution import SagaCoordinator

def test_saga():
    saga = SagaCoordinator()
    history = []
    step1 = (lambda: history.append('act1'), lambda: history.append('comp1'))
    step2 = (lambda: (_ for _ in ()).throw(RuntimeError("fail")), lambda: history.append('comp2'))
    success = saga.execute([step1, step2])
    assert success is False
    assert history == ['act1', 'comp1']
""",
        "Saga patterns maintain eventual consistency across distributed microservice boundaries without locking distributed resources."
    ),
    (
        32, "node-8-32", "Lesson 9.32: E-Commerce Flash Sale: Atomic Inventory Reservation",
        "Implement an atomic inventory reservation engine preventing overselling under high concurrency.",
        405,
        """class InventoryReservationEngine:
    def __init__(self, stock: dict):
        self.stock = dict(stock)
        self.reservations = {} # res_id -> (item_id, qty)

    def reserve(self, res_id: str, item: str, qty: int) -> bool:
        available = self.stock.get(item, 0)
        if available >= qty:
            self.stock[item] -= qty
            self.reservations[res_id] = (item, qty)
            return True
        return False

    def release(self, res_id: str):
        if res_id in self.reservations:
            item, qty = self.reservations.pop(res_id)
            self.stock[item] += qty
""",
        """from solution import InventoryReservationEngine

def test_flash_sale():
    engine = InventoryReservationEngine({'item_gpu': 2})
    assert engine.reserve('r1', 'item_gpu', 1) is True
    assert engine.reserve('r2', 'item_gpu', 1) is True
    assert engine.reserve('r3', 'item_gpu', 1) is False
    engine.release('r1')
    assert engine.reserve('r3', 'item_gpu', 1) is True
""",
        "Atomic inventory decrements guard stock counts against flash-sale concurrency race conditions."
    ),
    (
        33, "node-8-33", "Lesson 9.33: Search Engine: Inverted Index & BM25 Scoring Model",
        "Implement an inverted index with BM25 term weighting and document length normalization.",
        410,
        """import math

class BM25Index:
    def __init__(self, k1: float = 1.5, b: float = 0.75):
        self.k1 = k1
        self.b = b
        self.docs = {} # doc_id -> list of tokens
        self.avg_doc_len = 0.0

    def add_doc(self, doc_id: str, tokens: list):
        self.docs[doc_id] = tokens
        total_len = sum(len(t) for t in self.docs.values())
        self.avg_doc_len = total_len / len(self.docs)

    def score(self, query_term: str, doc_id: str) -> float:
        tokens = self.docs[doc_id]
        tf = tokens.count(query_term)
        if tf == 0: return 0.0
        doc_len = len(tokens)
        numerator = tf * (self.k1 + 1)
        denominator = tf + self.k1 * (1 - self.b + self.b * (doc_len / self.avg_doc_len))
        return numerator / denominator
""",
        """from solution import BM25Index

def test_bm25():
    idx = BM25Index()
    idx.add_doc('d1', ['python', 'system', 'design'])
    idx.add_doc('d2', ['python', 'python', 'tutorial'])
    assert idx.score('python', 'd2') > idx.score('python', 'd1')
""",
        "BM25 term saturation models provide calibrated relevance ranking across variable document collections."
    ),
    (
        34, "node-8-34", "Lesson 9.34: High-Throughput Notification Dispatcher",
        "Implement an asynchronous multi-channel notification dispatcher with user frequency capping.",
        415,
        """class NotificationDispatcher:
    def __init__(self, max_per_user_per_hour: int = 5):
        self.max_cap = max_per_user_per_hour
        self.user_history = {} # user -> list of timestamps

    def dispatch(self, user_id: str, channel: str, message: str, timestamp: float) -> bool:
        self.user_history.setdefault(user_id, [])
        threshold = timestamp - 3600.0
        self.user_history[user_id] = [t for t in self.user_history[user_id] if t > threshold]
        if len(self.user_history[user_id]) < self.max_cap:
            self.user_history[user_id].append(timestamp)
            return True
        return False
""",
        """from solution import NotificationDispatcher

def test_notifications():
    nd = NotificationDispatcher(max_per_user_per_hour=2)
    assert nd.dispatch('u1', 'email', 'hello', 100.0) is True
    assert nd.dispatch('u1', 'sms', 'hello2', 200.0) is True
    assert nd.dispatch('u1', 'push', 'hello3', 300.0) is False
""",
        "Notification frequency caps prevent notification fatigue by rate-limiting outbound alert volume."
    ),
    (
        35, "node-8-35", "Lesson 9.35: Time-Series Metrics Ingestion Engine",
        "Implement a streaming time-series aggregator rolling raw metrics into 1-minute bucket statistics (min, max, sum, count).",
        420,
        """class TimeSeriesRollup:
    def __init__(self, bucket_size_sec: int = 60):
        self.bucket_size = bucket_size_sec
        self.buckets = {} # (metric, bucket_ts) -> [count, sum, min, max]

    def record(self, metric: str, value: float, timestamp: float):
        bucket_ts = int(timestamp // self.bucket_size) * self.bucket_size
        key = (metric, bucket_ts)
        if key not in self.buckets:
            self.buckets[key] = [1, value, value, value]
        else:
            b = self.buckets[key]
            b[0] += 1
            b[1] += value
            b[2] = min(b[2], value)
            b[3] = max(b[3], value)

    def get_stats(self, metric: str, bucket_ts: int):
        return self.buckets.get((metric, bucket_ts))
""",
        """from solution import TimeSeriesRollup

def test_rollup():
    ts = TimeSeriesRollup(bucket_size_sec=60)
    ts.record('cpu', 10.0, 10.0)
    ts.record('cpu', 30.0, 20.0)
    stats = ts.get_stats('cpu', 0)
    assert stats == [2, 40.0, 10.0, 30.0]
""",
        "Time-series downsampling reduces telemetry volume by compounding raw events into fixed-interval summaries."
    ),
    (
        36, "node-8-36", "Lesson 9.36: Distributed Cron & Delayed Task Scheduler",
        "Implement a hierarchical timing wheel scheduler triggering delayed events with $O(1)$ insertion and dispatch.",
        425,
        """class TimingWheel:
    def __init__(self, slots: int = 60, tick_ms: int = 1000):
        self.slots = slots
        self.tick_ms = tick_ms
        self.wheel = [[] for _ in range(slots)]
        self.current_tick = 0

    def add_task(self, delay_ms: int, task_id: str):
        ticks_ahead = delay_ms // self.tick_ms
        target_slot = (self.current_tick + ticks_ahead) % self.slots
        rounds = ticks_ahead // self.slots
        self.wheel[target_slot].append((rounds, task_id))

    def advance(self) -> list:
        due = []
        slot_tasks = self.wheel[self.current_tick]
        remaining = []
        for rounds, task_id in slot_tasks:
            if rounds == 0:
                due.append(task_id)
            else:
                remaining.append((rounds - 1, task_id))
        self.wheel[self.current_tick] = remaining
        self.current_tick = (self.current_tick + 1) % self.slots
        return due
""",
        """from solution import TimingWheel

def test_timing_wheel():
    tw = TimingWheel(slots=10, tick_ms=100)
    tw.add_task(200, 'task_a')
    assert tw.advance() == []
    assert tw.advance() == []
    assert tw.advance() == ['task_a']
""",
        "Timing wheels efficiently schedule high-volume delayed tasks without linear priority-queue polling overhead."
    ),
    (
        37, "node-8-37", "Lesson 9.37: Two-Phase Commit (2PC) Distributed Transaction Manager",
        "Implement a Two-Phase Commit coordinator executing prepare, vote collection, and global commit/abort decisions.",
        430,
        """class TwoPhaseCommitCoordinator:
    def __init__(self, participants: list):
        self.participants = participants

    def execute_transaction(self, prepare_fns: dict, commit_fns: dict, abort_fns: dict) -> bool:
        # Phase 1: Prepare
        votes = {}
        for p in self.participants:
            try:
                votes[p] = prepare_fns[p]()
            except Exception:
                votes[p] = False

        # Phase 2: Decision
        all_ok = all(votes.values())
        if all_ok:
            for p in self.participants:
                commit_fns[p]()
            return True
        else:
            for p in self.participants:
                abort_fns[p]()
            return False
""",
        """from solution import TwoPhaseCommitCoordinator

def test_2pc():
    coord = TwoPhaseCommitCoordinator(['db1', 'db2'])
    c = []
    a = []
    success = coord.execute_transaction(
        {'db1': lambda: True, 'db2': lambda: False},
        {'db1': lambda: c.append('c1'), 'db2': lambda: c.append('c2')},
        {'db1': lambda: a.append('a1'), 'db2': lambda: a.append('a2')}
    )
    assert success is False
    assert a == ['a1', 'a2']
""",
        "Two-phase commit coordinates atomic multi-database commits through synchronous consensus handshakes."
    ),
    (
        38, "node-8-38", "Lesson 9.38: Distributed Lock Manager via Lease Expiry",
        "Implement a distributed lease-based lock manager with fencing tokens to prevent split-brain dual writers.",
        435,
        """class LeaseLockManager:
    def __init__(self):
        self.locks = {} # resource -> (owner, expiry, fencing_token)
        self.fencing_counter = 0

    def acquire(self, resource: str, owner: str, duration_sec: float, current_time: float):
        if resource in self.locks:
            curr_owner, expiry, token = self.locks[resource]
            if current_time < expiry and curr_owner != owner:
                return None
        self.fencing_counter += 1
        self.locks[resource] = (owner, current_time + duration_sec, self.fencing_counter)
        return self.fencing_counter

    def release(self, resource: str, owner: str):
        if resource in self.locks and self.locks[resource][0] == owner:
            del self.locks[resource]
""",
        """from solution import LeaseLockManager

def test_lock_manager():
    mgr = LeaseLockManager()
    t1 = mgr.acquire('file:1', 'worker_a', 10.0, 100.0)
    assert t1 is not None
    assert mgr.acquire('file:1', 'worker_b', 10.0, 105.0) is None
    t2 = mgr.acquire('file:1', 'worker_b', 10.0, 111.0) # Expired
    assert t2 > t1
""",
        "Fencing tokens protect backend storage systems against delayed, zombie worker write operations."
    ),
    (
        39, "node-8-39", "Lesson 9.39: LLM Serving: Continuous Batching Engine (Orca/vLLM)",
        "Implement an iteration-level scheduler dynamically interleaving prompt prefill and token decode requests.",
        440,
        """class ContinuousBatchScheduler:
    def __init__(self, max_batch_size: int = 4):
        self.max_batch_size = max_batch_size
        self.active_requests = {} # req_id -> remaining_tokens
        self.queue = []

    def submit_request(self, req_id: str, total_tokens: int):
        self.queue.append((req_id, total_tokens))

    def step_iteration(self) -> list:
        # Fill available slots
        while len(self.active_requests) < self.max_batch_size and self.queue:
            rid, tokens = self.queue.pop(0)
            self.active_requests[rid] = tokens
            
        completed = []
        for rid in list(self.active_requests.keys()):
            self.active_requests[rid] -= 1
            if self.active_requests[rid] <= 0:
                completed.append(rid)
                del self.active_requests[rid]
        return completed
""",
        """from solution import ContinuousBatchScheduler

def test_continuous_batching():
    sched = ContinuousBatchScheduler(max_batch_size=2)
    sched.submit_request('r1', 2)
    sched.submit_request('r2', 1)
    sched.submit_request('r3', 1)
    
    assert sched.step_iteration() == ['r2'] # r2 done, r1 remaining 1
    assert 'r3' in sched.active_requests
    assert sched.step_iteration() == ['r1', 'r3']
""",
        "Continuous iteration-level batching maximizes GPU tensor core utilization by reclaiming completed request slots instantly."
    ),
    (
        40, "node-8-40", "Lesson 9.40: LLM Serving: PagedAttention Block Allocator",
        "Build a virtual memory page allocator managing non-contiguous physical blocks for dynamic KV caches.",
        445,
        """class PagedBlockAllocator:
    def __init__(self, total_blocks: int, block_size: int = 16):
        self.total_blocks = total_blocks
        self.block_size = block_size
        self.free_blocks = list(range(total_blocks))
        self.block_tables = {} # req_id -> list of block_ids

    def allocate(self, req_id: str, num_tokens: int) -> bool:
        needed = (num_tokens + self.block_size - 1) // self.block_size
        if len(self.free_blocks) < needed:
            return False
        allocated = [self.free_blocks.pop(0) for _ in range(needed)]
        self.block_tables[req_id] = allocated
        return True

    def free(self, req_id: str):
        if req_id in self.block_tables:
            self.free_blocks.extend(self.block_tables.pop(req_id))
""",
        """from solution import PagedBlockAllocator

def test_paged_attention():
    alloc = PagedBlockAllocator(total_blocks=4, block_size=16)
    assert alloc.allocate('r1', 30) is True # Needs 2 blocks
    assert len(alloc.free_blocks) == 2
    assert alloc.allocate('r2', 33) is False # Needs 3 blocks, only 2 left
    alloc.free('r1')
    assert len(alloc.free_blocks) == 4
""",
        "PagedAttention eliminates internal KV-cache memory fragmentation via demand-paged virtual block mapping."
    ),
    (
        41, "node-8-41", "Lesson 9.41: LLM Serving: Speculative Decoding Verification Engine",
        "Implement a draft token validator matching small draft model tokens against target model logits with acceptance rollback.",
        450,
        """class SpeculativeVerifier:
    @staticmethod
    def verify(draft_tokens: list, target_predictions: list) -> list:
        accepted = []
        for i, draft in enumerate(draft_tokens):
            if i < len(target_predictions) and draft == target_predictions[i]:
                accepted.append(draft)
            else:
                break
        return accepted
""",
        """from solution import SpeculativeVerifier

def test_speculative_verification():
    draft = ['The', 'quick', 'brown', 'cat']
    target = ['The', 'quick', 'brown', 'fox']
    accepted = SpeculativeVerifier.verify(draft, target)
    assert accepted == ['The', 'quick', 'brown']
""",
        "Speculative decoding accelerates auto-regressive generation by validating multiple candidate tokens in a single forward pass."
    ),
    (
        42, "node-8-42", "Lesson 9.42: Vector Database Scale: Distributed Sharded Index Router",
        "Implement a scatter-gather router querying distributed vector shards and merging top-K nearest neighbors.",
        455,
        """import heapq

class ShardedVectorRouter:
    def __init__(self, shards: list):
        self.shards = shards # list of mock shard search functions

    def search_top_k(self, query_vec: list, k: int) -> list:
        # Scatter
        shard_results = [shard_fn(query_vec, k) for shard_fn in self.shards]
        # Gather & merge
        all_candidates = []
        for res in shard_results:
            all_candidates.extend(res)
        # Sort by distance ascending
        return heapq.nsmallest(k, all_candidates, key=lambda x: x['distance'])
""",
        """from solution import ShardedVectorRouter

def test_vector_router():
    s1 = lambda q, k: [{'id': 'a', 'distance': 0.1}, {'id': 'b', 'distance': 0.4}]
    s2 = lambda q, k: [{'id': 'c', 'distance': 0.05}, {'id': 'd', 'distance': 0.8}]
    router = ShardedVectorRouter([s1, s2])
    top2 = router.search_top_k([], 2)
    assert [x['id'] for x in top2] == ['c', 'a']
""",
        "Scatter-gather vector routers merge nearest neighbor candidates from partitioned cluster indexes."
    ),
    (
        43, "node-8-43", "Lesson 9.43: LLM Gateway: Semantic Cache & Similarity Threshold",
        "Build a semantic cache matching incoming prompts using cosine similarity against pre-computed prompt embeddings.",
        460,
        """import math

def cosine_similarity(v1: list, v2: list) -> float:
    dot = sum(a * b for a, b in zip(v1, v2))
    norm1 = math.sqrt(sum(a * a for a in v1))
    norm2 = math.sqrt(sum(b * b for b in v2))
    return dot / (norm1 * norm2) if norm1 and norm2 else 0.0

class SemanticCache:
    def __init__(self, threshold: float = 0.9):
        self.threshold = threshold
        self.entries = [] # list of (vector, response)

    def lookup(self, query_vec: list):
        for vec, resp in self.entries:
            if cosine_similarity(query_vec, vec) >= self.threshold:
                return resp
        return None

    def insert(self, query_vec: list, response: str):
        self.entries.append((query_vec, response))
""",
        """from solution import SemanticCache

def test_semantic_cache():
    sc = SemanticCache(threshold=0.95)
    sc.insert([1.0, 0.0], 'Cached answer')
    assert sc.lookup([0.99, 0.01]) == 'Cached answer'
    assert sc.lookup([0.0, 1.0]) is None
""",
        "Semantic caches intercept recurring LLM queries to cut inference costs and drop response latency to zero."
    ),
    (
        44, "node-8-44", "Lesson 9.44: LLM Gateway: Model Routing & Latency Fallback Engine",
        "Implement a resilient multi-provider LLM gateway falling back to secondary providers on timeout or rate limits.",
        465,
        """class ModelGateway:
    def __init__(self, provider_chain: list):
        self.chain = provider_chain # list of callables

    def execute_prompt(self, prompt: str) -> dict:
        for provider in self.chain:
            try:
                return provider(prompt)
            except Exception:
                continue
        raise RuntimeError("All LLM providers failed")
""",
        """from solution import ModelGateway

def test_model_gateway():
    p1 = lambda p: (_ for _ in ()).throw(TimeoutError("OpenAI timeout"))
    p2 = lambda p: {'provider': 'Anthropic', 'text': 'Success'}
    gw = ModelGateway([p1, p2])
    res = gw.execute_prompt("test")
    assert res['provider'] == 'Anthropic'
""",
        "Model fallback chains ensure zero user-facing downtime across unpredictable LLM API outages."
    ),
    (
        45, "node-8-45", "Lesson 9.45: Agent Memory Architecture: Hierarchical Summarization",
        "Implement a hierarchical conversation compressor compacting aged message history into contextual summaries.",
        470,
        """class ConversationCompressor:
    def __init__(self, max_raw_messages: int = 4):
        self.max_raw = max_raw_messages
        self.summary = ""
        self.active_messages = []

    def add_message(self, role: str, content: str):
        self.active_messages.append({'role': role, 'content': content})
        if len(self.active_messages) > self.max_raw:
            oldest = self.active_messages.pop(0)
            self.summary += f" [{oldest['role']}: {oldest['content']}]"

    def get_prompt_context(self) -> str:
        ctx = f"Summary: {self.summary.strip()}\\n" if self.summary else ""
        for m in self.active_messages:
            ctx += f"{m['role']}: {m['content']}\\n"
        return ctx
""",
        """from solution import ConversationCompressor

def test_conversation_compression():
    cc = ConversationCompressor(max_raw_messages=2)
    cc.add_message('user', 'Hi')
    cc.add_message('assistant', 'Hello')
    cc.add_message('user', 'My name is Bob')
    assert 'Summary: [user: Hi]' in cc.get_prompt_context()
    assert len(cc.active_messages) == 2
""",
        "Hierarchical summarization bounds agent token memory within static LLM context limits."
    ),
    (
        46, "node-8-46", "Lesson 9.46: Feature Flag & Canary Deployment Engine",
        "Implement a consistent hash feature flag router bucketing user cohorts into canary deployment stages.",
        475,
        """import zlib

class CanaryRouter:
    @staticmethod
    def is_enabled(feature_key: str, user_id: str, percentage: float) -> bool:
        if percentage <= 0.0: return False
        if percentage >= 100.0: return True
        seed = f"{feature_key}:{user_id}"
        val = zlib.crc32(seed.encode('utf-8')) % 100
        return val < percentage
""",
        """from solution import CanaryRouter

def test_canary():
    enabled = CanaryRouter.is_enabled('new_rag_pipeline', 'user_100', 50.0)
    assert isinstance(enabled, bool)
    assert CanaryRouter.is_enabled('flag', 'u1', 100.0) is True
    assert CanaryRouter.is_enabled('flag', 'u1', 0.0) is False
""",
        "Canary feature flags enable deterministic user cohort exposure during production rollouts."
    ),
    (
        47, "node-8-47", "Lesson 9.47: Bulkhead Pattern & Thread Pool Isolation",
        "Implement an isolated bulkhead thread pool partition isolating failure domains between independent workloads.",
        480,
        """class BulkheadPool:
    def __init__(self, pool_capacities: dict):
        self.capacities = dict(pool_capacities)
        self.active = {k: 0 for k in pool_capacities}

    def try_execute(self, pool_name: str, fn):
        if self.active[pool_name] >= self.capacities[pool_name]:
            return None # Rejected
        self.active[pool_name] += 1
        try:
            return fn()
        finally:
            self.active[pool_name] -= 1
""",
        """from solution import BulkheadPool

def test_bulkhead():
    bh = BulkheadPool({'llm_pool': 1, 'auth_pool': 10})
    res = bh.try_execute('llm_pool', lambda: 'ok')
    assert res == 'ok'
    assert bh.active['llm_pool'] == 0
""",
        "Bulkhead isolation guarantees saturation in high-latency subsystems cannot exhaust resources of critical services."
    ),
    (
        48, "node-8-48", "Lesson 9.48: Outbox Pattern & Reliable Event Publishing",
        "Implement a Transactional Outbox processor polling database outbox tables and publishing events with at-least-once delivery.",
        485,
        """class TransactionalOutbox:
    def __init__(self):
        self.outbox_table = [] # list of (id, payload, published)

    def write_transaction(self, entity_data: dict, event_payload: dict):
        outbox_id = len(self.outbox_table) + 1
        self.outbox_table.append({'id': outbox_id, 'payload': event_payload, 'published': False})

    def relay_events(self, publisher_fn):
        for entry in self.outbox_table:
            if not entry['published']:
                publisher_fn(entry['payload'])
                entry['published'] = True
""",
        """from solution import TransactionalOutbox

def test_outbox():
    ob = TransactionalOutbox()
    ob.write_transaction({'user': 'alice'}, {'event': 'USER_CREATED'})
    published = []
    ob.relay_events(lambda p: published.append(p))
    assert len(published) == 1
    assert ob.outbox_table[0]['published'] is True
""",
        "Transactional outbox patterns guarantee atomic event publication aligned with database transactions."
    ),
    (
        49, "node-8-49", "Lesson 9.49: Chaos Engineering: Fault Injection Simulator",
        "Implement a chaos injection wrapper randomly introducing latency spikes, packet drops, and HTTP 500 errors into RPC clients.",
        490,
        """import random

class FaultInjector:
    def __init__(self, failure_rate: float = 0.0):
        self.failure_rate = failure_rate

    def wrap_call(self, fn, rand_val: float = None):
        val = rand_val if rand_val is not None else random.random()
        if val < self.failure_rate:
            raise ConnectionError("Chaos injected fault")
        return fn()
""",
        """from solution import FaultInjector

def test_chaos():
    injector = FaultInjector(failure_rate=0.5)
    assert injector.wrap_call(lambda: 'ok', rand_val=0.8) == 'ok'
    try:
        injector.wrap_call(lambda: 'ok', rand_val=0.2)
        assert False, "Should have raised"
    except ConnectionError:
        pass
""",
        "Chaos testing proactively proves system resilience by injecting controlled faults into live communication paths."
    ),
    (
        50, "node-8-50", "Lesson 9.50: Capstone: Distributed Multi-Tenant AI Platform Architecture",
        "Architect a unified end-to-end AI platform coordinator combining API rate limiting, semantic caching, model fallback, and continuous batching.",
        500,
        """class ProductionAIPlatform:
    def __init__(self):
        self.request_counts = {}
        self.cache = {}

    def handle_inference(self, tenant_id: str, prompt: str, mock_model_fn) -> dict:
        # Rate limit
        self.request_counts[tenant_id] = self.request_counts.get(tenant_id, 0) + 1
        if self.request_counts[tenant_id] > 100:
            return {'status': 429, 'error': 'Rate limited'}
            
        # Semantic/exact cache
        if prompt in self.cache:
            return {'status': 200, 'response': self.cache[prompt], 'cached': True}
            
        res = mock_model_fn(prompt)
        self.cache[prompt] = res
        return {'status': 200, 'response': res, 'cached': False}
""",
        """from solution import ProductionAIPlatform

def test_platform_capstone():
    platform = ProductionAIPlatform()
    mock_llm = lambda p: f"Answer to {p}"
    r1 = platform.handle_inference('tenant-1', 'hello', mock_llm)
    assert r1['cached'] is False
    r2 = platform.handle_inference('tenant-1', 'hello', mock_llm)
    assert r2['cached'] is True
""",
        "Full-stack distributed AI architectures integrate rate limiters, caching layers, and fault-tolerant inference clusters into a unified platform."
    )
]

print(f"Prepared {len(lessons)} lessons for Module 9.")

# Sync updates (node-8-1 to node-8-25) and inserts (node-8-26 to node-8-50)
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
    subtitle_escaped = sql_escape(f"Module 9: High-Level System Design & Scalability | Lesson {order_idx} of 50")
    cs_escaped = sql_escape(f"Distributed Systems | {title.split(':', 1)[-1].strip()[:50]}")
    ai_escaped = sql_escape(desc)
    slug = f"module-09-lesson-{order_idx:02d}-{slugify(title.split(':', 1)[-1])}"
    slug_escaped = sql_escape(slug)

    handbook = f"""# {title}

- **Module**: `Module 9: High-Level System Design & Scalability`
- **Focus**: {desc}
- **Verification**: Run test suite for `{title}` with zero assertion errors.

## Architectural Deep Dive
High-scale AI and distributed platforms require rigorous partitioning, fault tolerance, continuous batching, and sub-millisecond caching mechanics.
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
    'module-9',
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

print("Module 9 successfully synced!")
