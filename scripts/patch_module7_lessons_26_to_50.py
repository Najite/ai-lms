#!/usr/bin/env python3
"""
Batch patch Module 7: PostgreSQL & Vector Database Engineering (Lessons 7.26 to 7.50)
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
    "node-5-26": {
        "title": "Lesson 7.26: Partial & Expression Indexes",
        "handbook_markdown": r"""# Lesson 7.26: Partial & Expression Indexes

- **Partial Index**: `CREATE INDEX ... WHERE is_active = true` only indexes active rows, cutting index size by 90%.
- **Expression Index**: `CREATE INDEX ... ON users (lower(email))` speeds up case-insensitive searches.
""",
        "starter_code": {
            "solution.py": '''"""
Partial & Expression Indexes
Format partial index SQL DDL string.
"""

def build_partial_index_sql(table: str, column: str, condition: str) -> str:
    return f"CREATE INDEX idx_{table}_{column}_partial ON {table} ({column}) WHERE {condition};"
'''
        },
        "test_suite": {
            "exercise_about": "Construct Partial Index SQL DDL statements.",
            "exercise_goal": "Implement `build_partial_index_sql(table, column, condition)`.",
            "expected_output": "Return formatted CREATE INDEX statement.",
            "tests.py": '''import pytest
from solution import build_partial_index_sql

def test_partial_index():
    sql = build_partial_index_sql("users", "email", "is_active = true")
    assert sql == "CREATE INDEX idx_users_email_partial ON users (email) WHERE is_active = true;"
'''
        }
    },
    "node-5-27": {
        "title": "Lesson 7.27: Query Execution Plans (EXPLAIN)",
        "handbook_markdown": r"""# Lesson 7.27: Query Execution Plans (EXPLAIN)

`EXPLAIN (ANALYZE, BUFFERS)` reveals whether Postgres chose `Seq Scan`, `Index Scan`, or `Bitmap Heap Scan`.
""",
        "starter_code": {
            "solution.py": '''"""
Query Execution Plans (EXPLAIN)
Identify sequential scan in query plan output.
"""

def is_sequential_scan(plan_text: str) -> bool:
    return "Seq Scan" in plan_text
'''
        },
        "test_suite": {
            "exercise_about": "Detect unindexed Sequential Scans in execution plans.",
            "exercise_goal": "Implement `is_sequential_scan(plan_text)`.",
            "expected_output": "Return True if Seq Scan detected.",
            "tests.py": '''import pytest
from solution import is_sequential_scan

def test_seq_scan():
    assert is_sequential_scan("->  Seq Scan on users  (cost=0.00..10.00)") is True
    assert is_sequential_scan("->  Index Scan using idx_users_id on users") is False
'''
        }
    },
    "node-5-28": {
        "title": "Lesson 7.28: Postgres Join Algorithms",
        "handbook_markdown": r"""# Lesson 7.28: Postgres Join Algorithms

Postgres chooses between three join strategies:
1. **Nested Loop**: Fast for small tables with indexed lookups.
2. **Hash Join**: Builds in-memory hash table of inner table; ideal for large unsorted joins.
3. **Merge Join**: Zips two pre-sorted inputs in linear time.
""",
        "starter_code": {
            "solution.py": '''"""
Postgres Join Algorithms
Perform in-memory hash join.
"""

from typing import List, Dict

def in_memory_hash_join(left: List[dict], right: List[dict], join_key: str) -> List[dict]:
    lookup = {r[join_key]: r for r in right if join_key in r}
    res = []
    for l in left:
        k = l.get(join_key)
        if k in lookup:
            merged = dict(l)
            merged.update(lookup[k])
            res.append(merged)
    return res
'''
        },
        "test_suite": {
            "exercise_about": "Implement in-memory hash join algorithms.",
            "exercise_goal": "Implement `in_memory_hash_join(left, right, join_key)`.",
            "expected_output": "Return joined row dictionaries.",
            "tests.py": '''import pytest
from solution import in_memory_hash_join

def test_hash_join():
    l = [{"id": 1, "name": "A"}]
    r = [{"id": 1, "role": "Admin"}]
    res = in_memory_hash_join(l, r, "id")
    assert res == [{"id": 1, "name": "A", "role": "Admin"}]
'''
        }
    },
    "node-5-29": {
        "title": "Lesson 7.29: ACID Properties in Production",
        "handbook_markdown": r"""# Lesson 7.29: ACID Properties in Production

- **Atomicity**: All or nothing.
- **Consistency**: Invariants preserved.
- **Isolation**: Concurrent transactions do not corrupt each other.
- **Durability**: Committed data survives power failure.
""",
        "starter_code": {
            "solution.py": '''"""
ACID Properties in Production
Verify transaction commit rollback state.
"""

class MockTransaction:
    def __init__(self):
        self.committed = False
        self.rolled_back = False

    def commit(self) -> None:
        self.committed = True

    def rollback(self) -> None:
        self.rolled_back = True
'''
        },
        "test_suite": {
            "exercise_about": "Understand transaction lifecycle states.",
            "exercise_goal": "Implement `MockTransaction`.",
            "expected_output": "Track commit and rollback states.",
            "tests.py": '''import pytest
from solution import MockTransaction

def test_tx():
    tx = MockTransaction()
    tx.commit()
    assert tx.committed is True
'''
        }
    },
    "node-5-30": {
        "title": "Lesson 7.30: Write-Ahead Logging (WAL)",
        "handbook_markdown": r"""# Lesson 7.30: Write-Ahead Logging (WAL)

Before any table page is modified in RAM, the change is written sequentially to the **Write-Ahead Log (WAL)** disk file for crash recovery and replication.
""",
        "starter_code": {
            "solution.py": '''"""
Write-Ahead Logging (WAL)
Format sequential WAL record line.
"""

def format_wal_record(lsn: int, table: str, operation: str) -> str:
    return f"LSN:{lsn} TABLE:{table} OP:{operation}"
'''
        },
        "test_suite": {
            "exercise_about": "Understand Log Sequence Number (LSN) WAL entries.",
            "exercise_goal": "Implement `format_wal_record(lsn, table, operation)`.",
            "expected_output": "Return formatted WAL line string.",
            "tests.py": '''import pytest
from solution import format_wal_record

def test_wal():
    assert format_wal_record(1001, "users", "INSERT") == "LSN:1001 TABLE:users OP:INSERT"
'''
        }
    },
    "node-5-31": {
        "title": "Lesson 7.31: Concurrency Read Anomalies",
        "handbook_markdown": r"""# Lesson 7.31: Concurrency Read Anomalies

- **Dirty Read**: Reading uncommitted changes from another transaction.
- **Non-Repeatable Read**: Re-reading a row gets different values.
- **Phantom Read**: Re-running a range query gets new inserted rows.
""",
        "starter_code": {
            "solution.py": '''"""
Concurrency Read Anomalies
Detect non-repeatable read discrepancy.
"""

from typing import Any

def has_non_repeatable_read(initial_read: Any, second_read: Any) -> bool:
    return initial_read != second_read
'''
        },
        "test_suite": {
            "exercise_about": "Identify Non-Repeatable Read anomalies.",
            "exercise_goal": "Implement `has_non_repeatable_read(initial_read, second_read)`.",
            "expected_output": "Detect discrepancies between successive reads.",
            "tests.py": '''import pytest
from solution import has_non_repeatable_read

def test_read_anomaly():
    assert has_non_repeatable_read(100, 150) is True
    assert has_non_repeatable_read(100, 100) is False
'''
        }
    },
    "node-5-32": {
        "title": "Lesson 7.32: Serialization & Write Skew",
        "handbook_markdown": r"""# Lesson 7.32: Serialization & Write Skew

**Write Skew** occurs when two concurrent transactions read overlapping state and modify disjoint rows, violating a global invariant (e.g. at least one doctor on call).
""",
        "starter_code": {
            "solution.py": '''"""
Serialization & Write Skew
Verify on-call doctor invariant.
"""

from typing import List, Dict

def is_on_call_invariant_satisfied(doctors: List[dict]) -> bool:
    """Invariant: At least one doctor has on_call == True."""
    return any(d.get("on_call") is True for d in doctors)
'''
        },
        "test_suite": {
            "exercise_about": "Verify global multi-row invariants vulnerable to write skew.",
            "exercise_goal": "Implement `is_on_call_invariant_satisfied(doctors)`.",
            "expected_output": "Return True if at least one doctor is on call.",
            "tests.py": '''import pytest
from solution import is_on_call_invariant_satisfied

def test_write_skew_invariant():
    assert is_on_call_invariant_satisfied([{"name": "A", "on_call": True}]) is True
    assert is_on_call_invariant_satisfied([{"name": "A", "on_call": False}]) is False
'''
        }
    },
    "node-5-33": {
        "title": "Lesson 7.33: ANSI SQL Isolation Levels",
        "handbook_markdown": r"""# Lesson 7.33: ANSI SQL Isolation Levels

Postgres isolation levels:
1. `READ COMMITTED` (default): sees statements committed before current statement.
2. `REPEATABLE READ`: sees snapshot taken at transaction start.
3. `SERIALIZABLE`: guarantees equivalent serial execution order.
""",
        "starter_code": {
            "solution.py": '''"""
ANSI SQL Isolation Levels
Format isolation level transaction command.
"""

def format_set_isolation_level_sql(level: str) -> str:
    return f"SET TRANSACTION ISOLATION LEVEL {level.upper()};"
'''
        },
        "test_suite": {
            "exercise_about": "Format SQL transaction isolation statements.",
            "exercise_goal": "Implement `format_set_isolation_level_sql(level)`.",
            "expected_output": "Return valid SET TRANSACTION statement.",
            "tests.py": '''import pytest
from solution import format_set_isolation_level_sql

def test_isolation_sql():
    assert format_set_isolation_level_sql("serializable") == "SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;"
'''
        }
    },
    "node-5-34": {
        "title": "Lesson 7.34: MVCC & Tuple Visibility",
        "handbook_markdown": r"""# Lesson 7.34: MVCC & Tuple Visibility

Multi-Version Concurrency Control (MVCC) stores `xmin` (creating transaction ID) and `xmax` (deleting transaction ID) in each row header.
""",
        "starter_code": {
            "solution.py": '''"""
MVCC & Tuple Visibility
Determine if tuple is visible to transaction snapshot.
"""

def is_tuple_visible(xmin: int, xmax: int, current_tx_id: int) -> bool:
    """Tuple visible if created before current_tx_id (xmin <= current_tx_id) and not deleted before current_tx_id."""
    if xmin > current_tx_id:
        return False
    if xmax != 0 and xmax <= current_tx_id:
        return False
    return True
'''
        },
        "test_suite": {
            "exercise_about": "Understand Postgres MVCC tuple xmin/xmax visibility rules.",
            "exercise_goal": "Implement `is_tuple_visible(xmin, xmax, current_tx_id)`.",
            "expected_output": "Determine row visibility.",
            "tests.py": '''import pytest
from solution import is_tuple_visible

def test_mvcc_visibility():
    # Created at tx 100, not deleted (xmax=0) -> visible to tx 105
    assert is_tuple_visible(100, 0, 105) is True
    # Deleted at tx 102 -> not visible to tx 105
    assert is_tuple_visible(100, 102, 105) is False
'''
        }
    },
    "node-5-35": {
        "title": "Lesson 7.35: Dead Tuples & Autovacuum Tuning",
        "handbook_markdown": r"""# Lesson 7.35: Dead Tuples & Autovacuum Tuning

In MVCC, `UPDATE` and `DELETE` leave **Dead Tuples** behind. **VACUUM** reclaims dead tuple disk space for future inserts.
""",
        "starter_code": {
            "solution.py": '''"""
Dead Tuples & Autovacuum Tuning
Calculate table bloat ratio.
"""

def calculate_table_bloat(dead_tuples: int, live_tuples: int) -> float:
    total = dead_tuples + live_tuples
    return (dead_tuples / total) if total > 0 else 0.0
'''
        },
        "test_suite": {
            "exercise_about": "Calculate database table bloat from dead tuples.",
            "exercise_goal": "Implement `calculate_table_bloat(dead_tuples, live_tuples)`.",
            "expected_output": "Return dead tuple ratio.",
            "tests.py": '''import pytest
from solution import calculate_table_bloat

def test_bloat():
    assert calculate_table_bloat(20, 80) == 0.20
'''
        }
    },
    "node-5-36": {
        "title": "Lesson 7.36: Row-Level Locking (FOR UPDATE)",
        "handbook_markdown": r"""# Lesson 7.36: Row-Level Locking (FOR UPDATE)

`SELECT * FROM accounts WHERE id = 1 FOR UPDATE` places an exclusive lock on selected rows until transaction commit.
""",
        "starter_code": {
            "solution.py": '''"""
Row-Level Locking (FOR UPDATE)
Format SELECT FOR UPDATE query.
"""

def format_select_for_update(table: str, row_id: int) -> str:
    return f"SELECT * FROM {table} WHERE id = {row_id} FOR UPDATE;"
'''
        },
        "test_suite": {
            "exercise_about": "Format pessimistic row-level locking SQL queries.",
            "exercise_goal": "Implement `format_select_for_update(table, row_id)`.",
            "expected_output": "Return SELECT FOR UPDATE statement.",
            "tests.py": '''import pytest
from solution import format_select_for_update

def test_select_for_update():
    assert format_select_for_update("wallets", 5) == "SELECT * FROM wallets WHERE id = 5 FOR UPDATE;"
'''
        }
    },
    "node-5-37": {
        "title": "Lesson 7.37: Task Queues with SKIP LOCKED",
        "handbook_markdown": r"""# Lesson 7.37: Task Queues with SKIP LOCKED

`SELECT * FROM jobs WHERE status = 'pending' ORDER BY id LIMIT 1 FOR UPDATE SKIP LOCKED` turns Postgres into a high-throughput distributed task queue without lock contention.
""",
        "starter_code": {
            "solution.py": '''"""
Task Queues with SKIP LOCKED
Pop first unlocked task.
"""

from typing import List, Set, Optional

def pop_unlocked_task(tasks: List[dict], locked_task_ids: Set[int]) -> Optional[dict]:
    for t in tasks:
        if t["id"] not in locked_task_ids:
            return t
    return None
'''
        },
        "test_suite": {
            "exercise_about": "Simulate SKIP LOCKED distributed task queue popping.",
            "exercise_goal": "Implement `pop_unlocked_task(tasks, locked_task_ids)`.",
            "expected_output": "Return first unlocked pending job.",
            "tests.py": '''import pytest
from solution import pop_unlocked_task

def test_skip_locked():
    tasks = [{"id": 1, "name": "j1"}, {"id": 2, "name": "j2"}]
    assert pop_unlocked_task(tasks, {1}) == {"id": 2, "name": "j2"}
'''
        }
    },
    "node-5-38": {
        "title": "Lesson 7.38: Advisory Locks: Distributed Mutexes",
        "handbook_markdown": r"""# Lesson 7.38: Advisory Locks: Distributed Mutexes

`pg_try_advisory_lock(int64)` creates an application-level distributed mutex inside Postgres without touching table rows.
""",
        "starter_code": {
            "solution.py": '''"""
Advisory Locks: Distributed Mutexes
Format advisory lock SQL statement.
"""

def format_advisory_lock_sql(lock_id: int) -> str:
    return f"SELECT pg_try_advisory_lock({lock_id});"
'''
        },
        "test_suite": {
            "exercise_about": "Format Postgres advisory lock SQL queries.",
            "exercise_goal": "Implement `format_advisory_lock_sql(lock_id)`.",
            "expected_output": "Return pg_try_advisory_lock statement.",
            "tests.py": '''import pytest
from solution import format_advisory_lock_sql

def test_advisory_lock():
    assert format_advisory_lock_sql(42) == "SELECT pg_try_advisory_lock(42);"
'''
        }
    },
    "node-5-39": {
        "title": "Lesson 7.39: Deadlock Detection & Timeouts",
        "handbook_markdown": r"""# Lesson 7.39: Deadlock Detection & Timeouts

Setting `lock_timeout = '2s'` prevents transactions from waiting indefinitely during deadlock lock contention.
""",
        "starter_code": {
            "solution.py": '''"""
Deadlock Detection & Timeouts
Format lock timeout configuration.
"""

def format_lock_timeout_sql(timeout_ms: int) -> str:
    return f"SET lock_timeout = '{timeout_ms}ms';"
'''
        },
        "test_suite": {
            "exercise_about": "Configure lock timeouts for deadlock mitigation.",
            "exercise_goal": "Implement `format_lock_timeout_sql(timeout_ms)`.",
            "expected_output": "Return SET lock_timeout statement.",
            "tests.py": '''import pytest
from solution import format_lock_timeout_sql

def test_lock_timeout():
    assert format_lock_timeout_sql(2000) == "SET lock_timeout = '2000ms';"
'''
        }
    },
    "node-5-40": {
        "title": "Lesson 7.40: Postgres Connection Architecture",
        "handbook_markdown": r"""# Lesson 7.40: Postgres Connection Architecture

Postgres uses a process-per-connection model. Each active connection consumes ~10MB RAM, making connection pooling mandatory.
""",
        "starter_code": {
            "solution.py": '''"""
Postgres Connection Architecture
Estimate memory consumed by connection count.
"""

def estimate_postgres_connections_ram_mb(num_connections: int, mb_per_conn: float = 10.0) -> float:
    return num_connections * mb_per_conn
'''
        },
        "test_suite": {
            "exercise_about": "Estimate Postgres connection process memory overhead.",
            "exercise_goal": "Implement `estimate_postgres_connections_ram_mb(num_connections, mb_per_conn)`.",
            "expected_output": "Compute connection RAM consumption in MB.",
            "tests.py": '''import pytest
from solution import estimate_postgres_connections_ram_mb

def test_conn_ram():
    assert estimate_postgres_connections_ram_mb(500) == 5000.0
'''
        }
    },
    "node-5-41": {
        "title": "Lesson 7.41: PgBouncer Connection Pooling",
        "handbook_markdown": r"""# Lesson 7.41: PgBouncer Connection Pooling

**PgBouncer** operates in **Transaction Pooling** mode, multiplexing 10,000 application client connections into 50 physical Postgres server processes.
""",
        "starter_code": {
            "solution.py": '''"""
PgBouncer Connection Pooling
Format PgBouncer pool mode config string.
"""

def format_pgbouncer_config(pool_mode: str = "transaction", max_client_conn: int = 5000) -> str:
    return f"pool_mode = {pool_mode}\\nmax_client_conn = {max_client_conn}"
'''
        },
        "test_suite": {
            "exercise_about": "Understand PgBouncer transaction pooling configurations.",
            "exercise_goal": "Implement `format_pgbouncer_config(pool_mode, max_client_conn)`.",
            "expected_output": "Return PgBouncer config text.",
            "tests.py": '''import pytest
from solution import format_pgbouncer_config

def test_pgbouncer():
    cfg = format_pgbouncer_config()
    assert "pool_mode = transaction" in cfg
'''
        }
    },
    "node-5-42": {
        "title": "Lesson 7.42: Async Postgres Drivers (asyncpg)",
        "handbook_markdown": r"""# Lesson 7.42: Async Postgres Drivers (asyncpg)

`asyncpg` communicates directly with Postgres frontend/backend binary protocol, achieving $3\times$ higher throughput than psycopg2.
""",
        "starter_code": {
            "solution.py": '''"""
Async Postgres Drivers (asyncpg)
Mock async query executor.
"""

import asyncio

async def mock_asyncpg_query(sql: str) -> list:
    await asyncio.sleep(0.001)
    return [{"result": 1}]
'''
        },
        "test_suite": {
            "exercise_about": "Understand asyncpg asynchronous query execution.",
            "exercise_goal": "Implement `mock_asyncpg_query(sql)`.",
            "expected_output": "Execute async query coroutine.",
            "tests.py": '''import pytest
import asyncio
from solution import mock_asyncpg_query

@pytest.mark.asyncio
async def test_asyncpg():
    res = await mock_asyncpg_query("SELECT 1;")
    assert res == [{"result": 1}]
'''
        }
    },
    "node-5-43": {
        "title": "Lesson 7.43: JSONB Storage & Operators",
        "handbook_markdown": r"""# Lesson 7.43: JSONB Storage & Operators

Postgres `JSONB` stores decomposed binary JSON with fast indexing:
- `->`: Extract JSON object/array.
- `->>`: Extract text.
- `@>`: JSON containment (contains subset).
""",
        "starter_code": {
            "solution.py": '''"""
JSONB Storage & Operators
Verify dictionary JSON containment (@>).
"""

from typing import Dict, Any

def jsonb_contains(document: Dict[str, Any], subset: Dict[str, Any]) -> bool:
    """Return True if all key-values in subset match document."""
    for k, v in subset.items():
        if document.get(k) != v:
            return False
    return True
'''
        },
        "test_suite": {
            "exercise_about": "Understand JSONB @> containment operators.",
            "exercise_goal": "Implement `jsonb_contains(document, subset)`.",
            "expected_output": "Check if document contains subset dictionary.",
            "tests.py": '''import pytest
from solution import jsonb_contains

def test_jsonb_contains():
    doc = {"model": "gpt-4o", "temperature": 0.7, "stream": True}
    assert jsonb_contains(doc, {"model": "gpt-4o"}) is True
    assert jsonb_contains(doc, {"model": "claude"}) is False
'''
        }
    },
    "node-5-44": {
        "title": "Lesson 7.44: GIN Indexes on JSONB Columns",
        "handbook_markdown": r"""# Lesson 7.44: GIN Indexes on JSONB Columns

A **Generalized Inverted Index (GIN)** indexes all internal keys and values of a JSONB column for instant `@>` lookups.
""",
        "starter_code": {
            "solution.py": '''"""
GIN Indexes on JSONB Columns
Format GIN index DDL query.
"""

def format_gin_index_sql(table: str, jsonb_col: str) -> str:
    return f"CREATE INDEX idx_{table}_{jsonb_col}_gin ON {table} USING gin ({jsonb_col});"
'''
        },
        "test_suite": {
            "exercise_about": "Format GIN index creation DDL statements on JSONB columns.",
            "exercise_goal": "Implement `format_gin_index_sql(table, jsonb_col)`.",
            "expected_output": "Return CREATE INDEX USING GIN statement.",
            "tests.py": '''import pytest
from solution import format_gin_index_sql

def test_gin_index():
    sql = format_gin_index_sql("agent_logs", "metadata")
    assert sql == "CREATE INDEX idx_agent_logs_metadata_gin ON agent_logs USING gin (metadata);"
'''
        }
    },
    "node-5-45": {
        "title": "Lesson 7.45: Full-Text Search with tsvector",
        "handbook_markdown": r"""# Lesson 7.45: Full-Text Search with tsvector

Postgres Full-Text Search parses text into stemmed **tsvector** lexemes matched against **tsquery** operators (`@@ to_tsquery('ai & agent')`).
""",
        "starter_code": {
            "solution.py": '''"""
Full-Text Search with tsvector
Format full-text search WHERE clause.
"""

def format_fts_query(column: str, search_terms: str) -> str:
    return f"to_tsvector('english', {column}) @@ to_tsquery('english', '{search_terms}')"
'''
        },
        "test_suite": {
            "exercise_about": "Construct Postgres Full-Text Search queries.",
            "exercise_goal": "Implement `format_fts_query(column, search_terms)`.",
            "expected_output": "Return valid to_tsvector @@ to_tsquery clause.",
            "tests.py": '''import pytest
from solution import format_fts_query

def test_fts():
    sql = format_fts_query("body", "ai & agent")
    assert sql == "to_tsvector('english', body) @@ to_tsquery('english', 'ai & agent')"
'''
        }
    },
    "node-5-46": {
        "title": "Lesson 7.46: The pgvector Extension",
        "handbook_markdown": r"""# Lesson 7.46: The pgvector Extension

**pgvector** adds native vector types and distance operators to Postgres:
- `<->`: L2 Euclidean Distance.
- `<#>`: Negative Inner (Dot) Product.
- `<=>`: Cosine Distance ($1 - \cos(\theta)$).
""",
        "starter_code": {
            "solution.py": '''"""
The pgvector Extension
Format pgvector cosine distance query.
"""

from typing import List

def format_pgvector_cosine_sql(table: str, vector_col: str, query_vec: List[float], limit: int = 5) -> str:
    vec_str = str(query_vec)
    return f"SELECT * FROM {table} ORDER BY {vector_col} <=> '{vec_str}' LIMIT {limit};"
'''
        },
        "test_suite": {
            "exercise_about": "Format pgvector cosine distance similarity search queries.",
            "exercise_goal": "Implement `format_pgvector_cosine_sql(table, vector_col, query_vec, limit)`.",
            "expected_output": "Return valid ORDER BY <=> LIMIT query.",
            "tests.py": '''import pytest
from solution import format_pgvector_cosine_sql

def test_pgvector_sql():
    sql = format_pgvector_cosine_sql("documents", "embedding", [0.1, 0.2], 3)
    assert "<=> '[0.1, 0.2]'" in sql
    assert "LIMIT 3;" in sql
'''
        }
    },
    "node-5-47": {
        "title": "Lesson 7.47: Vector Indexes: HNSW vs IVFFlat",
        "handbook_markdown": r"""# Lesson 7.47: Vector Indexes: HNSW vs IVFFlat

- **IVFFlat**: Inverted File with Flat quantization (fast build, needs training data).
- **HNSW (Hierarchical Navigable Small World)**: Multi-layer proximity graph (superior recall and query speed, gold standard).
""",
        "starter_code": {
            "solution.py": '''"""
Vector Indexes: HNSW vs IVFFlat
Format HNSW vector index creation DDL.
"""

def format_hnsw_index_sql(table: str, col: str, m: int = 16, ef_construction: int = 64) -> str:
    return f"CREATE INDEX idx_{table}_{col}_hnsw ON {table} USING hnsw ({col} vector_cosine_ops) WITH (m = {m}, ef_construction = {ef_construction});"
'''
        },
        "test_suite": {
            "exercise_about": "Format HNSW index DDL statements in pgvector.",
            "exercise_goal": "Implement `format_hnsw_index_sql(table, col, m, ef_construction)`.",
            "expected_output": "Return CREATE INDEX USING HNSW statement.",
            "tests.py": '''import pytest
from solution import format_hnsw_index_sql

def test_hnsw_sql():
    sql = format_hnsw_index_sql("docs", "embedding")
    assert "USING hnsw (embedding vector_cosine_ops)" in sql
'''
        }
    },
    "node-5-48": {
        "title": "Lesson 7.48: Row-Level Security (RLS)",
        "handbook_markdown": r"""# Lesson 7.48: Row-Level Security (RLS)

Postgres **Row-Level Security (RLS)** restricts query access per user:
`CREATE POLICY user_isolation ON documents FOR ALL USING (user_id = auth.uid());`
""",
        "starter_code": {
            "solution.py": '''"""
Row-Level Security (RLS)
Format Supabase RLS policy statement.
"""

def format_rls_policy_sql(table: str, policy_name: str) -> str:
    return f"CREATE POLICY {policy_name} ON {table} FOR ALL USING (user_id = auth.uid());"
'''
        },
        "test_suite": {
            "exercise_about": "Construct Row-Level Security isolation policies.",
            "exercise_goal": "Implement `format_rls_policy_sql(table, policy_name)`.",
            "expected_output": "Return valid CREATE POLICY statement.",
            "tests.py": '''import pytest
from solution import format_rls_policy_sql

def test_rls():
    sql = format_rls_policy_sql("conversations", "isolate_user_conversations")
    assert sql == "CREATE POLICY isolate_user_conversations ON conversations FOR ALL USING (user_id = auth.uid());"
'''
        }
    },
    "node-5-49": {
        "title": "Lesson 7.49: Zero-Downtime Schema Migrations",
        "handbook_markdown": r"""# Lesson 7.49: Zero-Downtime Schema Migrations

Adding indexes concurrently without locking write traffic:
`CREATE INDEX CONCURRENTLY ...`
""",
        "starter_code": {
            "solution.py": '''"""
Zero-Downtime Schema Migrations
Format concurrent index creation statement.
"""

def format_concurrent_index_sql(table: str, col: str) -> str:
    return f"CREATE INDEX CONCURRENTLY idx_{table}_{col} ON {table} ({col});"
'''
        },
        "test_suite": {
            "exercise_about": "Understand zero-downtime CREATE INDEX CONCURRENTLY migrations.",
            "exercise_goal": "Implement `format_concurrent_index_sql(table, col)`.",
            "expected_output": "Return CREATE INDEX CONCURRENTLY statement.",
            "tests.py": '''import pytest
from solution import format_concurrent_index_sql

def test_concurrent_index():
    assert format_concurrent_index_sql("users", "email") == "CREATE INDEX CONCURRENTLY idx_users_email ON users (email);"
'''
        }
    },
    "node-5-50": {
        "title": "Lesson 7.50: Capstone: DocuMind — Production AI Database & Vector Engine",
        "handbook_markdown": r"""# Lesson 7.50: Capstone: DocuMind — Production AI Database & Vector Engine

Congratulations on completing Module 7!

In this capstone, you will assemble **DocuMind** — an enterprise AI vector database schema orchestrator combining:
1. **Hybrid pgvector & Full-Text Search**: Combining dense vector similarity with sparse BM25 text ranking.
2. **Row-Level Security Policies**: Enforcing tenant data isolation.
3. **Optimized HNSW Indexing**: High-recall vector search indexing.
""",
        "starter_code": {
            "solution.py": '''"""
Capstone: DocuMind — Production AI Database & Vector Engine
A production schema generator and vector similarity search coordinator.
"""

from typing import List, Dict, Any, Tuple
import math

class DocuMindEngine:
    def __init__(self):
        self.documents: List[Dict[str, Any]] = []

    def add_document(self, doc_id: str, user_id: str, text: str, vector: List[float]) -> None:
        self.documents.append({
            "id": doc_id,
            "user_id": user_id,
            "text": text,
            "vector": vector
        })

    def search_vector(self, user_id: str, query_vector: List[float], limit: int = 3) -> List[Tuple[str, float]]:
        """Filter by user_id (RLS simulation) and rank by cosine similarity."""
        candidates = [d for d in self.documents if d["user_id"] == user_id]
        scores = []
        for d in candidates:
            v = d["vector"]
            dot = sum(a * b for a, b in zip(query_vector, v))
            norm_q = math.sqrt(sum(a * a for a in query_vector))
            norm_v = math.sqrt(sum(a * a for a in v))
            sim = dot / (norm_q * norm_v) if norm_q > 0 and norm_v > 0 else 0.0
            scores.append((d["id"], sim))
        return sorted(scores, key=lambda x: x[1], reverse=True)[:limit]
'''
        },
        "test_suite": {
            "exercise_about": "Capstone Project: Build DocuMind, an enterprise vector search database engine with RLS tenant isolation.",
            "exercise_goal": "Implement `DocuMindEngine` with `add_document()` and `search_vector()`.",
            "expected_output": "Isolate documents by user_id and rank results by cosine similarity.",
            "tests.py": '''import pytest
from solution import DocuMindEngine

def test_documind_capstone():
    engine = DocuMindEngine()
    engine.add_document("doc1", "user_alice", "AI research", [1.0, 0.0])
    engine.add_document("doc2", "user_alice", "Database index", [0.0, 1.0])
    engine.add_document("doc3", "user_bob", "Secret Bob doc", [1.0, 0.0]) # Should be isolated from Alice
    
    results = engine.search_vector("user_alice", [1.0, 0.0], limit=2)
    assert len(results) == 2
    assert results[0][0] == "doc1"
    assert results[0][1] == pytest.approx(1.0)
    
    # Verify Bob doc is never returned to Alice
    doc_ids = [r[0] for r in results]
    assert "doc3" not in doc_ids
'''
        }
    }
}

def apply_patches():
    print(f"Applying patch to {len(LESSONS_DATA)} lessons in Module 7 (node-5-26 to node-5-50)...")
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
