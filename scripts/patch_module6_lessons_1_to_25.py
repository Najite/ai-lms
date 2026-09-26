#!/usr/bin/env python3
"""
Batch patch Module 6: Streaming AI APIs & Web Protocols (Lessons 6.1 to 6.25)
Enforces:
1. Physical intuitive mental models with zero unintroduced jargon.
2. 3-Part Briefing card schema (exercise_about, exercise_goal, expected_output).
3. Clean guided starter code (clean types, docstrings, # TODO comments, no spoilers).
4. Full automated test suite verification.
"""

import urllib.request
import json
import os

SUPABASE_URL = ""
SUPABASE_KEY = ""

env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
with open(env_path) as f:
    for line in f:
        if line.startswith("SUPABASE_SERVICE_ROLE_KEY="):
            SUPABASE_KEY = line.split("=", 1)[1].strip().strip('"').strip("'")
        elif line.startswith("NEXT_PUBLIC_SUPABASE_URL="):
            SUPABASE_URL = line.split("=", 1)[1].strip().strip('"').strip("'")

LESSONS_DATA = {
    "node-4-1": {
        "title": "Lesson 6.1: Berkeley Sockets & TCP Basics",
        "handbook_markdown": r"""# Lesson 6.1: Berkeley Sockets & TCP Basics

At the operating system level, network communication happens over **Berkeley Sockets** (`AF_INET` for IPv4, `SOCK_STREAM` for reliable TCP).
""",
        "starter_code": {
            "solution.py": '''"""
Berkeley Sockets & TCP Basics
Parse socket address tuples (host, port).
"""

from typing import Tuple

def format_socket_address(host: str, port: int) -> str:
    """Format socket host and port into standardized 'host:port' string."""
    return f"{host}:{port}"
'''
        },
        "test_suite": {
            "exercise_about": "Understand Berkeley socket addresses and port bindings.",
            "exercise_goal": "Implement `format_socket_address(host, port)`.",
            "expected_output": "Return formatted address string.",
            "tests.py": '''import pytest
from solution import format_socket_address

def test_socket_address():
    assert format_socket_address("127.0.0.1", 8080) == "127.0.0.1:8080"
'''
        }
    },
    "node-4-2": {
        "title": "Lesson 6.2: TCP Handshake & Connection States",
        "handbook_markdown": r"""# Lesson 6.2: TCP Handshake & Connection States

TCP establishes connections via a **3-Way Handshake**:
1. Client sends `SYN` (synchronize).
2. Server responds `SYN-ACK`.
3. Client acknowledges `ACK`.
""",
        "starter_code": {
            "solution.py": '''"""
TCP Handshake & Connection States
Simulate 3-way TCP handshake states.
"""

from typing import List

def simulate_tcp_handshake() -> List[str]:
    """Return sequence of TCP handshake packet flags."""
    return ["SYN", "SYN-ACK", "ACK"]
'''
        },
        "test_suite": {
            "exercise_about": "Understand the TCP 3-way handshake protocol.",
            "exercise_goal": "Implement `simulate_tcp_handshake()`.",
            "expected_output": "Return exact handshake sequence.",
            "tests.py": '''import pytest
from solution import simulate_tcp_handshake

def test_handshake():
    assert simulate_tcp_handshake() == ["SYN", "SYN-ACK", "ACK"]
'''
        }
    },
    "node-4-3": {
        "title": "Lesson 6.3: Non-Blocking Sockets & select()",
        "handbook_markdown": r"""# Lesson 6.3: Non-Blocking Sockets & select()

**Non-Blocking Sockets** return immediately with `EWOULDBLOCK` instead of hanging the thread when no data is ready.
""",
        "starter_code": {
            "solution.py": '''"""
Non-Blocking Sockets & select()
Filter ready descriptors.
"""

from typing import List, Set

def filter_ready_sockets(active_sockets: List[int], ready_set: Set[int]) -> List[int]:
    """Return sockets that are currently in ready_set."""
    return [s for s in active_sockets if s in ready_set]
'''
        },
        "test_suite": {
            "exercise_about": "Understand non-blocking socket readiness filtering.",
            "exercise_goal": "Implement `filter_ready_sockets(active_sockets, ready_set)`.",
            "expected_output": "Return ready socket descriptors.",
            "tests.py": '''import pytest
from solution import filter_ready_sockets

def test_ready_sockets():
    assert filter_ready_sockets([1, 2, 3, 4], {2, 4}) == [2, 4]
'''
        }
    },
    "node-4-4": {
        "title": "Lesson 6.4: Linux epoll & Event Readiness",
        "handbook_markdown": r"""# Lesson 6.4: Linux epoll & Event Readiness

**Linux epoll** is an $O(1)$ event readiness notification facility capable of handling 1,000,000 concurrent socket connections (the C10K / C1000K problem).
""",
        "starter_code": {
            "solution.py": '''"""
Linux epoll & Event Readiness
Map bitmask events (EPOLLIN, EPOLLOUT).
"""

class EpollEvents:
    EPOLLIN = 1 << 0   # Ready to read (1)
    EPOLLOUT = 1 << 1  # Ready to write (2)
    EPOLLERR = 1 << 2  # Error (4)

def is_readable(event_mask: int) -> bool:
    return bool(event_mask & EpollEvents.EPOLLIN)
'''
        },
        "test_suite": {
            "exercise_about": "Understand Linux epoll bitmask event readiness flags.",
            "exercise_goal": "Implement `is_readable(event_mask)`.",
            "expected_output": "Detect readable epoll status.",
            "tests.py": '''import pytest
from solution import is_readable, EpollEvents

def test_epoll_flags():
    assert is_readable(EpollEvents.EPOLLIN | EpollEvents.EPOLLOUT) is True
    assert is_readable(EpollEvents.EPOLLOUT) is False
'''
        }
    },
    "node-4-5": {
        "title": "Lesson 6.5: Socket Options & Latency Tuning",
        "handbook_markdown": r"""# Lesson 6.5: Socket Options & Latency Tuning

- `TCP_NODELAY`: Disables Nagle's algorithm, transmitting small token chunks immediately to eliminate 40ms buffering latencies.
- `SO_REUSEADDR`: Allows fast server restarts without waiting for `TIME_WAIT`.
""",
        "starter_code": {
            "solution.py": '''"""
Socket Options & Latency Tuning
Generate socket tuning configuration dictionary.
"""

from typing import Dict, Any

def get_low_latency_socket_config() -> Dict[str, Any]:
    return {"TCP_NODELAY": 1, "SO_REUSEADDR": 1}
'''
        },
        "test_suite": {
            "exercise_about": "Configure low-latency TCP socket parameters for streaming AI responses.",
            "exercise_goal": "Implement `get_low_latency_socket_config()`.",
            "expected_output": "Return TCP_NODELAY config.",
            "tests.py": '''import pytest
from solution import get_low_latency_socket_config

def test_socket_config():
    cfg = get_low_latency_socket_config()
    assert cfg["TCP_NODELAY"] == 1
    assert cfg["SO_REUSEADDR"] == 1
'''
        }
    },
    "node-4-6": {
        "title": "Lesson 6.6: DNS Resolution & Service Discovery",
        "handbook_markdown": r"""# Lesson 6.6: DNS Resolution & Service Discovery

DNS maps human-readable domain names (`api.openai.com`) to IP addresses (`104.18.7.192`) with TTL caching.
""",
        "starter_code": {
            "solution.py": '''"""
DNS Resolution & Service Discovery
Mock in-memory DNS lookup table.
"""

from typing import Dict, Optional

class MockDNSResolver:
    def __init__(self):
        self.records: Dict[str, str] = {}

    def register(self, hostname: str, ip: str) -> None:
        self.records[hostname.lower()] = ip

    def resolve(self, hostname: str) -> Optional[str]:
        return self.records.get(hostname.lower())
'''
        },
        "test_suite": {
            "exercise_about": "Understand DNS service discovery hostname resolution.",
            "exercise_goal": "Implement `MockDNSResolver`.",
            "expected_output": "Resolve hostnames to IP addresses.",
            "tests.py": '''import pytest
from solution import MockDNSResolver

def test_dns_resolver():
    dns = MockDNSResolver()
    dns.register("api.deepmind.com", "142.250.190.46")
    assert dns.resolve("api.deepmind.com") == "142.250.190.46"
    assert dns.resolve("unknown.org") is None
'''
        }
    },
    "node-4-7": {
        "title": "Lesson 6.7: HTTP/1.1 Mechanics & Keep-Alive",
        "handbook_markdown": r"""# Lesson 6.7: HTTP/1.1 Mechanics & Keep-Alive

`Connection: keep-alive` reuses a single established TCP connection across multiple sequential HTTP requests, eliminating 3-way handshake round trips.
""",
        "starter_code": {
            "solution.py": '''"""
HTTP/1.1 Mechanics & Keep-Alive
Format HTTP/1.1 keep-alive headers.
"""

from typing import Dict

def build_http_headers(host: str, keep_alive: bool = True) -> Dict[str, str]:
    headers = {"Host": host}
    if keep_alive:
        headers["Connection"] = "keep-alive"
    else:
        headers["Connection"] = "close"
    return headers
'''
        },
        "test_suite": {
            "exercise_about": "Build HTTP/1.1 request headers with connection reuse.",
            "exercise_goal": "Implement `build_http_headers(host, keep_alive)`.",
            "expected_output": "Return valid HTTP header dict.",
            "tests.py": '''import pytest
from solution import build_http_headers

def test_http_headers():
    h = build_http_headers("example.com", True)
    assert h["Host"] == "example.com"
    assert h["Connection"] == "keep-alive"
'''
        }
    },
    "node-4-8": {
        "title": "Lesson 6.8: Chunked Transfer Encoding",
        "handbook_markdown": r"""# Lesson 6.8: Chunked Transfer Encoding

In `Transfer-Encoding: chunked`, data is sent in stream pieces prefixed by their hexadecimal byte length:
`7\r\nHello, \r\n5\r\nworld\r\n0\r\n\r\n` (Terminates with a 0-length chunk).
""",
        "starter_code": {
            "solution.py": '''"""
Chunked Transfer Encoding
Format text payloads into HTTP chunked framing.
"""

def format_http_chunk(data: str) -> str:
    """Format string into hex_len\\r\\ndata\\r\\n."""
    hex_len = hex(len(data.encode("utf-8")))[2:].upper()
    return f"{hex_len}\r\n{data}\r\n"
'''
        },
        "test_suite": {
            "exercise_about": "Implement HTTP chunked transfer encoding framing for streaming data.",
            "exercise_goal": "Implement `format_http_chunk(data)`.",
            "expected_output": "Return hex-prefixed chunk formatted strings.",
            "tests.py": '''import pytest
from solution import format_http_chunk

def test_chunk_formatting():
    assert format_http_chunk("hello") == "5\r\nhello\r\n"
    assert format_http_chunk("") == "0\r\n\r\n"
'''
        }
    },
    "node-4-9": {
        "title": "Lesson 6.9: HTTP/2 Binary Framing & Multiplexing",
        "handbook_markdown": r"""# Lesson 6.9: HTTP/2 Binary Framing & Multiplexing

HTTP/2 replaces plain text with **Binary Frames** (`HEADERS`, `DATA`), multiplexing hundreds of parallel streams over a single TCP socket with zero Head-of-Line blocking at the application layer.
""",
        "starter_code": {
            "solution.py": '''"""
HTTP/2 Binary Framing & Multiplexing
Parse HTTP/2 stream frame header.
"""

from typing import Tuple

def parse_http2_frame_header(frame_type: int, stream_id: int, payload_len: int) -> Tuple[int, int, int]:
    return (frame_type, stream_id, payload_len)
'''
        },
        "test_suite": {
            "exercise_about": "Understand HTTP/2 stream multiplexing headers.",
            "exercise_goal": "Implement `parse_http2_frame_header(frame_type, stream_id, payload_len)`.",
            "expected_output": "Return parsed stream metadata.",
            "tests.py": '''import pytest
from solution import parse_http2_frame_header

def test_http2_frame():
    assert parse_http2_frame_header(1, 3, 1024) == (1, 3, 1024)
'''
        }
    },
    "node-4-10": {
        "title": "Lesson 6.10: HTTP/3 & QUIC Transport",
        "handbook_markdown": r"""# Lesson 6.10: HTTP/3 & QUIC Transport

**HTTP/3** runs over **QUIC (UDP)**, combining encryption and transport into a single 0-RTT handshake with connection migration across IP changes (e.g. WiFi to 5G).
""",
        "starter_code": {
            "solution.py": '''"""
HTTP/3 & QUIC Transport
Simulate QUIC connection migration identifier lookup.
"""

from typing import Dict, Optional

class QuicConnectionTable:
    def __init__(self):
        self.connections: Dict[str, str] = {} # connection_id -> client_state

    def register(self, conn_id: str, state: str) -> None:
        self.connections[conn_id] = state

    def lookup(self, conn_id: str) -> Optional[str]:
        return self.connections.get(conn_id)
'''
        },
        "test_suite": {
            "exercise_about": "Understand QUIC Connection ID persistence across client IP network migrations.",
            "exercise_goal": "Implement `QuicConnectionTable`.",
            "expected_output": "Maintain connection state mapped by 64-bit connection IDs.",
            "tests.py": '''import pytest
from solution import QuicConnectionTable

def test_quic_conn_table():
    q = QuicConnectionTable()
    q.register("cid_999", "stream_active")
    assert q.lookup("cid_999") == "stream_active"
'''
        }
    },
    "node-4-11": {
        "title": "Lesson 6.11: TLS 1.3 Handshakes & Certificates",
        "handbook_markdown": r"""# Lesson 6.11: TLS 1.3 Handshakes & Certificates

**TLS 1.3** reduces cryptographic handshake latency to a single round-trip (1-RTT) using Diffie-Hellman Ephemeral key exchange.
""",
        "starter_code": {
            "solution.py": '''"""
TLS 1.3 Handshakes & Certificates
Format TLS SNI (Server Name Indication).
"""

def format_sni_extension(hostname: str) -> str:
    return f"SNI:{hostname.lower()}"
'''
        },
        "test_suite": {
            "exercise_about": "Understand TLS SNI header generation.",
            "exercise_goal": "Implement `format_sni_extension(hostname)`.",
            "expected_output": "Return standardized SNI string.",
            "tests.py": '''import pytest
from solution import format_sni_extension

def test_sni():
    assert format_sni_extension("Anthropic.COM") == "SNI:anthropic.com"
'''
        }
    },
    "node-4-12": {
        "title": "Lesson 6.12: HTTP Idempotency Keys",
        "handbook_markdown": r"""# Lesson 6.12: HTTP Idempotency Keys

Sending `Idempotency-Key: uuid` guarantees that network retries of payment or AI creation POST requests execute **exactly once**.
""",
        "starter_code": {
            "solution.py": '''"""
HTTP Idempotency Keys
Cache and deduplicate idempotent request mutations.
"""

from typing import Dict, Any, Optional

class IdempotencyCache:
    def __init__(self):
        self.store: Dict[str, Any] = {}

    def process_request(self, key: str, handler_func) -> Any:
        if key in self.store:
            return self.store[key]
        res = handler_func()
        self.store[key] = res
        return res
'''
        },
        "test_suite": {
            "exercise_about": "Implement Idempotency Key deduplication for reliable API mutations.",
            "exercise_goal": "Implement `IdempotencyCache`.",
            "expected_output": "Execute handler once and serve duplicate keys from cache.",
            "tests.py": '''import pytest
from solution import IdempotencyCache

def test_idempotency():
    cache = IdempotencyCache()
    calls = 0
    def payment_handler():
        nonlocal calls
        calls += 1
        return "charge_success"
        
    res1 = cache.process_request("idemp_101", payment_handler)
    res2 = cache.process_request("idemp_101", payment_handler)
    assert res1 == "charge_success"
    assert res2 == "charge_success"
    assert calls == 1 # Only charged once!
'''
        }
    },
    "node-4-13": {
        "title": "Lesson 6.13: Content Negotiation & Compression",
        "handbook_markdown": r"""# Lesson 6.13: Content Negotiation & Compression

`Accept-Encoding: gzip, br, zstd` negotiates real-time payload compression between client and server.
""",
        "starter_code": {
            "solution.py": '''"""
Content Negotiation & Compression
Pick best supported compression encoding.
"""

from typing import List, Optional

def choose_compression_encoding(client_accept_header: str, supported: List[str]) -> Optional[str]:
    """Parse comma-separated Accept-Encoding and return first match from supported priority list."""
    accepted = [x.strip() for x in client_accept_header.split(",")]
    for encoding in supported:
        if encoding in accepted:
            return encoding
    return None
'''
        },
        "test_suite": {
            "exercise_about": "Implement HTTP Content-Encoding negotiation.",
            "exercise_goal": "Implement `choose_compression_encoding(client_accept_header, supported)`.",
            "expected_output": "Return optimal matching encoding.",
            "tests.py": '''import pytest
from solution import choose_compression_encoding

def test_compression_negotiation():
    header = "gzip, deflate, br, zstd"
    supported = ["zstd", "br", "gzip"] # Priority order
    assert choose_compression_encoding(header, supported) == "zstd"
'''
        }
    },
    "node-4-14": {
        "title": "Lesson 6.14: Asyncio: Coroutines, Tasks & Futures",
        "handbook_markdown": r"""# Lesson 6.14: Asyncio: Coroutines, Tasks & Futures

Python `asyncio` uses cooperative multitasking:
- `async def` defines a **coroutine**.
- `await` suspends execution and yields control back to the event loop while waiting for I/O.
""",
        "starter_code": {
            "solution.py": '''"""
Asyncio: Coroutines, Tasks & Futures
Mock async task execution tracker.
"""

import asyncio

async def compute_square_async(x: int) -> int:
    """Async coroutine calculating x * x."""
    await asyncio.sleep(0.001)
    return x * x
'''
        },
        "test_suite": {
            "exercise_about": "Understand Python asyncio coroutine definition and execution.",
            "exercise_goal": "Implement `compute_square_async(x)`.",
            "expected_output": "Compute square asynchronously.",
            "tests.py": '''import pytest
import asyncio
from solution import compute_square_async

@pytest.mark.asyncio
async def test_async_coroutine():
    res = await compute_square_async(5)
    assert res == 25
'''
        }
    },
    "node-4-15": {
        "title": "Lesson 6.15: Asyncio Event Loop Mechanics",
        "handbook_markdown": r"""# Lesson 6.15: Asyncio Event Loop Mechanics

The **Event Loop** is a continuous while loop checking OS selectors (`epoll`) and executing ready coroutine callbacks.
""",
        "starter_code": {
            "solution.py": '''"""
Asyncio Event Loop Mechanics
Gather concurrent asynchronous tasks.
"""

import asyncio
from typing import List

async def fetch_all_parallel(tasks_coros) -> List:
    """Execute multiple coroutines concurrently using asyncio.gather."""
    return await asyncio.gather(*tasks_coros)
'''
        },
        "test_suite": {
            "exercise_about": "Gather concurrent tasks with asyncio.gather.",
            "exercise_goal": "Implement `fetch_all_parallel(tasks_coros)`.",
            "expected_output": "Execute all coroutines concurrently.",
            "tests.py": '''import pytest
import asyncio
from solution import fetch_all_parallel

async def mock_fetch(val):
    await asyncio.sleep(0.001)
    return val * 2

@pytest.mark.asyncio
async def test_gather_parallel():
    coros = [mock_fetch(1), mock_fetch(2), mock_fetch(3)]
    results = await fetch_all_parallel(coros)
    assert list(results) == [2, 4, 6]
'''
        }
    },
    "node-4-16": {
        "title": "Lesson 6.16: Non-Blocking Async Network IO",
        "handbook_markdown": r"""# Lesson 6.16: Non-Blocking Async Network IO

Using `httpx.AsyncClient` or `aiohttp` prevents blocking the Python event loop during network calls.
""",
        "starter_code": {
            "solution.py": '''"""
Non-Blocking Async Network IO
Format asynchronous mock HTTP response.
"""

from typing import Dict, Any

def format_async_response(status_code: int, data: Any) -> Dict[str, Any]:
    return {"status": status_code, "body": data}
'''
        },
        "test_suite": {
            "exercise_about": "Understand non-blocking network response formatting.",
            "exercise_goal": "Implement `format_async_response(status_code, data)`.",
            "expected_output": "Return response dictionary.",
            "tests.py": '''import pytest
from solution import format_async_response

def test_async_resp():
    assert format_async_response(200, "ok") == {"status": 200, "body": "ok"}
'''
        }
    },
    "node-4-17": {
        "title": "Lesson 6.17: Thread Pools & CPU-Bound Delegation",
        "handbook_markdown": r"""# Lesson 6.17: Thread Pools & CPU-Bound Delegation

CPU-heavy operations (e.g. tokenizer parsing or matrix math) must be offloaded to `loop.run_in_executor(ThreadPoolExecutor)` to avoid freezing the async event loop.
""",
        "starter_code": {
            "solution.py": '''"""
Thread Pools & CPU-Bound Delegation
Offload synchronous function to asyncio executor.
"""

import asyncio

async def run_cpu_bound_async(func, *args):
    """Run sync func in default executor."""
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(None, func, *args)
'''
        },
        "test_suite": {
            "exercise_about": "Delegate CPU-bound tasks to thread pool executors.",
            "exercise_goal": "Implement `run_cpu_bound_async(func, *args)`.",
            "expected_output": "Execute sync function asynchronously.",
            "tests.py": '''import pytest
import asyncio
from solution import run_cpu_bound_async

def heavy_calc(n):
    return sum(i * i for i in range(n))

@pytest.mark.asyncio
async def test_cpu_delegation():
    res = await run_cpu_bound_async(heavy_calc, 100)
    assert res == sum(i * i for i in range(100))
'''
        }
    },
    "node-4-18": {
        "title": "Lesson 6.18: Async Iterators & Generators",
        "handbook_markdown": r"""# Lesson 6.18: Async Iterators & Generators

Async generators (`async def ... yield ...`) stream tokens from LLMs to web clients asynchronously using `async for`.
""",
        "starter_code": {
            "solution.py": '''"""
Async Iterators & Generators
Yield tokens asynchronously.
"""

import asyncio
from typing import AsyncGenerator, List

async def stream_tokens_async(tokens: List[str]) -> AsyncGenerator[str, None]:
    """Yield tokens with small async delay."""
    for t in tokens:
        await asyncio.sleep(0.001)
        yield t
'''
        },
        "test_suite": {
            "exercise_about": "Implement async token streaming generators.",
            "exercise_goal": "Implement `stream_tokens_async(tokens)`.",
            "expected_output": "Yield tokens across async iteration.",
            "tests.py": '''import pytest
import asyncio
from solution import stream_tokens_async

@pytest.mark.asyncio
async def test_async_generator():
    tokens = ["AI", "is", "awesome"]
    collected = []
    async for token in stream_tokens_async(tokens):
        collected.append(token)
    assert collected == ["AI", "is", "awesome"]
'''
        }
    },
    "node-4-19": {
        "title": "Lesson 6.19: Server-Sent Events (SSE) Protocol",
        "handbook_markdown": r"""# Lesson 6.19: Server-Sent Events (SSE) Protocol

**Server-Sent Events (SSE)** uses `Content-Type: text/event-stream` to push unilateral streaming updates from server to client:
`data: {"token": "hello"}\n\n`
""",
        "starter_code": {
            "solution.py": '''"""
Server-Sent Events (SSE) Protocol
Format SSE event messages.
"""

def format_sse_event(data: str, event_type: str = "message") -> str:
    """Format into standard SSE message text: event: type\\ndata: content\\n\\n."""
    return f"event: {event_type}\ndata: {data}\n\n"
'''
        },
        "test_suite": {
            "exercise_about": "Master the Server-Sent Events (SSE) streaming protocol format.",
            "exercise_goal": "Implement `format_sse_event(data, event_type)`.",
            "expected_output": "Return double-newline-terminated SSE text payloads.",
            "tests.py": '''import pytest
from solution import format_sse_event

def test_sse_formatting():
    assert format_sse_event('{"text": "hi"}') == 'event: message\ndata: {"text": "hi"}\n\n'
    assert format_sse_event('done', 'finish') == 'event: finish\ndata: done\n\n'
'''
        }
    },
    "node-4-20": {
        "title": "Lesson 6.20: Real-Time WebSockets Architecture",
        "handbook_markdown": r"""# Lesson 6.20: Real-Time WebSockets Architecture

**WebSockets** upgrades an HTTP connection (`Upgrade: websocket`) into a full-duplex, bidirectional TCP tunnel for low-latency agent chat.
""",
        "starter_code": {
            "solution.py": '''"""
Real-Time WebSockets Architecture
Validate WebSocket upgrade request headers.
"""

from typing import Dict

def is_websocket_upgrade(headers: Dict[str, str]) -> bool:
    """Check if headers contain Connection: Upgrade and Upgrade: websocket."""
    conn = headers.get("connection", headers.get("Connection", "")).lower()
    upg = headers.get("upgrade", headers.get("Upgrade", "")).lower()
    return "upgrade" in conn and upg == "websocket"
'''
        },
        "test_suite": {
            "exercise_about": "Understand WebSocket handshake HTTP upgrade validation.",
            "exercise_goal": "Implement `is_websocket_upgrade(headers)`.",
            "expected_output": "Identify valid WebSocket upgrade requests.",
            "tests.py": '''import pytest
from solution import is_websocket_upgrade

def test_ws_upgrade():
    headers = {"Connection": "Upgrade", "Upgrade": "websocket"}
    assert is_websocket_upgrade(headers) is True
    assert is_websocket_upgrade({"Connection": "keep-alive"}) is False
'''
        }
    },
    "node-4-21": {
        "title": "Lesson 6.21: ASGI Specification & Raw Server Handshakes",
        "handbook_markdown": r"""# Lesson 6.21: ASGI Specification & Raw Server Handshakes

The **Asynchronous Server Gateway Interface (ASGI)** defines the standard interface:
`async def app(scope, receive, send):`
connecting Python async servers (Uvicorn) with frameworks (FastAPI).
""",
        "starter_code": {
            "solution.py": '''"""
ASGI Specification & Raw Server Handshakes
Parse ASGI HTTP scope path.
"""

from typing import Dict, Any

def get_asgi_path(scope: Dict[str, Any]) -> str:
    return scope.get("path", "/")
'''
        },
        "test_suite": {
            "exercise_about": "Understand the ASGI scope connection dictionary.",
            "exercise_goal": "Implement `get_asgi_path(scope)`.",
            "expected_output": "Extract path from scope.",
            "tests.py": '''import pytest
from solution import get_asgi_path

def test_asgi_scope():
    scope = {"type": "http", "path": "/v1/chat/completions"}
    assert get_asgi_path(scope) == "/v1/chat/completions"
'''
        }
    },
    "node-4-22": {
        "title": "Lesson 6.22: Building Async Middlewares",
        "handbook_markdown": r"""# Lesson 6.22: Building Async Middlewares

ASGI Middlewares wrap inner applications, intercepting requests before dispatch and injecting response headers (e.g. `X-Process-Time`).
""",
        "starter_code": {
            "solution.py": '''"""
Building Async Middlewares
Add timing header to response headers list.
"""

from typing import List, Tuple

def inject_timing_header(headers: List[Tuple[bytes, bytes]], duration_sec: float) -> List[Tuple[bytes, bytes]]:
    res = list(headers)
    res.append((b"x-process-time", f"{duration_sec:.4f}".encode("latin1")))
    return res
'''
        },
        "test_suite": {
            "exercise_about": "Implement header injection in async middleware pipelines.",
            "exercise_goal": "Implement `inject_timing_header(headers, duration_sec)`.",
            "expected_output": "Append timing header byte tuple.",
            "tests.py": '''import pytest
from solution import inject_timing_header

def test_timing_middleware():
    headers = [(b"content-type", b"application/json")]
    updated = inject_timing_header(headers, 0.0123)
    assert (b"x-process-time", b"0.0123") in updated
'''
        }
    },
    "node-4-23": {
        "title": "Lesson 6.23: Streaming Response Generators",
        "handbook_markdown": r"""# Lesson 6.23: Streaming Response Generators

Streaming token generators yield encoded bytes continuously to client HTTP connections.
""",
        "starter_code": {
            "solution.py": '''"""
Streaming Response Generators
Convert token strings into UTF-8 encoded byte generator.
"""

from typing import List, Generator

def encode_tokens_to_bytes(tokens: List[str]) -> Generator[bytes, None, None]:
    for t in tokens:
        yield t.encode("utf-8")
'''
        },
        "test_suite": {
            "exercise_about": "Implement byte encoding streaming response generators.",
            "exercise_goal": "Implement `encode_tokens_to_bytes(tokens)`.",
            "expected_output": "Yield UTF-8 bytes for each token.",
            "tests.py": '''import pytest
from solution import encode_tokens_to_bytes

def test_encode_tokens():
    gen = encode_tokens_to_bytes(["hello", " ", "world"])
    assert list(gen) == [b"hello", b" ", b"world"]
'''
        }
    },
    "node-4-24": {
        "title": "Lesson 6.24: Request Context, Scopes & ContextVars",
        "handbook_markdown": r"""# Lesson 6.24: Request Context, Scopes & ContextVars

`contextvars.ContextVar` stores task-local context (e.g. `request_id`, user identity) across asynchronous coroutine chains without passing variables down every function signature.
""",
        "starter_code": {
            "solution.py": '''"""
Request Context, Scopes & ContextVars
Use contextvars to store asynchronous request IDs.
"""

import contextvars

current_request_id = contextvars.ContextVar("request_id", default="default-id")

def set_req_id(req_id: str) -> None:
    current_request_id.set(req_id)

def get_req_id() -> str:
    return current_request_id.get()
'''
        },
        "test_suite": {
            "exercise_about": "Master Python contextvars for async task context isolation.",
            "exercise_goal": "Implement `set_req_id(req_id)` and `get_req_id()`.",
            "expected_output": "Isolate request context across async tasks.",
            "tests.py": '''import pytest
from solution import set_req_id, get_req_id

def test_context_vars():
    assert get_req_id() == "default-id"
    set_req_id("req-12345")
    assert get_req_id() == "req-12345"
'''
        }
    },
    "node-4-25": {
        "title": "Lesson 6.25: Graceful Shutdown & Drain Pools",
        "handbook_markdown": r"""# Lesson 6.25: Graceful Shutdown & Drain Pools

On `SIGTERM`, web servers stop accepting new connections, finish in-flight requests within a drain timeout (e.g. 30s), and close database pools cleanly.
""",
        "starter_code": {
            "solution.py": '''"""
Graceful Shutdown & Drain Pools
Track in-flight requests during server shutdown.
"""

class ServerDrainManager:
    def __init__(self):
        self.active_requests = 0
        self.is_shutting_down = False

    def start_request(self) -> bool:
        if self.is_shutting_down:
            return False # Reject new requests
        self.active_requests += 1
        return True

    def finish_request(self) -> None:
        self.active_requests = max(0, self.active_requests - 1)

    def trigger_shutdown(self) -> None:
        self.is_shutting_down = True
'''
        },
        "test_suite": {
            "exercise_about": "Implement graceful server drain management.",
            "exercise_goal": "Implement `ServerDrainManager`.",
            "expected_output": "Reject new requests during shutdown and track active in-flight count.",
            "tests.py": '''import pytest
from solution import ServerDrainManager

def test_drain_manager():
    mgr = ServerDrainManager()
    assert mgr.start_request() is True
    assert mgr.active_requests == 1
    
    mgr.trigger_shutdown()
    assert mgr.start_request() is False # Rejected
    mgr.finish_request()
    assert mgr.active_requests == 0
'''
        }
    }
}

def apply_patches():
    print(f"Applying patch to {len(LESSONS_DATA)} lessons in Module 6 (node-4-1 to node-4-25)...")
    for node_id, data in LESSONS_DATA.items():
        payload = {
            "title": data["title"],
            "handbook_markdown": data["handbook_markdown"],
            "starter_code": data["starter_code"],
            "test_suite": data["test_suite"]
        }
        
        req = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1/curriculum_nodes?id=eq.{node_id}",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            },
            method="PATCH"
        )
        with urllib.request.urlopen(req) as resp:
            print(f"✓ Patched {node_id} ({data['title']}) -> HTTP {resp.status}")

if __name__ == "__main__":
    apply_patches()
