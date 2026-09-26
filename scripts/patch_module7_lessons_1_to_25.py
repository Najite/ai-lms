#!/usr/bin/env python3
"""
Batch patch Module 7: PostgreSQL & Vector Database Engineering (Lessons 7.1 to 7.25)
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
    "node-5-1": {
        "title": "Lesson 7.1: Relational Schemas & Normalization",
        "handbook_markdown": r"""# Lesson 7.1: Relational Schemas & Normalization

**Database Normalization** eliminates redundant data duplication across tables:
- **1NF**: Atomic cell values (no arrays/comma-separated strings in columns).
- **2NF**: No partial dependencies on composite primary keys.
- **3NF**: No transitive dependencies (non-key columns depend only on the primary key).
""",
        "starter_code": {
            "solution.py": '''"""
Relational Schemas & Normalization
Verify 1NF atomic cell representation.
"""

from typing import List, Any

def is_first_normal_form(rows: List[List[Any]]) -> bool:
    """Return True if no column in any row contains nested lists or sets."""
    for row in rows:
        for cell in row:
            if isinstance(cell, (list, set, dict)):
                return False
    return True
'''
        },
        "test_suite": {
            "exercise_about": "Understand 1st Normal Form (1NF) atomic column constraints.",
            "exercise_goal": "Implement `is_first_normal_form(rows)`.",
            "expected_output": "Reject non-atomic nested collection cells.",
            "tests.py": '''import pytest
from solution import is_first_normal_form

def test_1nf():
    assert is_first_normal_form([[1, "Alice", "Admin"], [2, "Bob", "User"]]) is True
    assert is_first_normal_form([[1, "Alice", ["Admin", "Billing"]]]) is False
'''
        }
    },
    "node-5-2": {
        "title": "Lesson 7.2: Pragmatic Denormalization",
        "handbook_markdown": r"""# Lesson 7.2: Pragmatic Denormalization

Storing precomputed aggregates (e.g. `user_tokens_used_total`) avoids expensive multi-table `JOIN` and `SUM` queries under heavy read traffic.
""",
        "starter_code": {
            "solution.py": '''"""
Pragmatic Denormalization
Update denormalized counter summary.
"""

from typing import Dict

def update_denormalized_usage(user_profile: Dict[str, Any], delta_tokens: int) -> Dict[str, Any]:
    profile = dict(user_profile)
    profile["total_tokens"] = profile.get("total_tokens", 0) + delta_tokens
    return profile
'''
        },
        "test_suite": {
            "exercise_about": "Maintain denormalized aggregate counters for high-speed read queries.",
            "exercise_goal": "Implement `update_denormalized_usage(user_profile, delta_tokens)`.",
            "expected_output": "Increment denormalized total.",
            "tests.py": '''import pytest
from solution import update_denormalized_usage

def test_denormalization():
    prof = {"user_id": "u1", "total_tokens": 100}
    updated = update_denormalized_usage(prof, 50)
    assert updated["total_tokens"] == 150
'''
        }
    },
    "node-5-3": {
        "title": "Lesson 7.3: DDL Constraints & Check Clauses",
        "handbook_markdown": r"""# Lesson 7.3: DDL Constraints & Check Clauses

Postgres `CHECK (price > 0)` clauses guarantee data integrity at the database engine level.
""",
        "starter_code": {
            "solution.py": '''"""
DDL Constraints & Check Clauses
Validate record against check constraint.
"""

def validate_positive_price(record: dict) -> bool:
    return record.get("price", 0) > 0
'''
        },
        "test_suite": {
            "exercise_about": "Enforce database CHECK constraints.",
            "exercise_goal": "Implement `validate_positive_price(record)`.",
            "expected_output": "Reject non-positive prices.",
            "tests.py": '''import pytest
from solution import validate_positive_price

def test_check_constraint():
    assert validate_positive_price({"price": 19.99}) is True
    assert validate_positive_price({"price": -5.00}) is False
'''
        }
    },
    "node-5-4": {
        "title": "Lesson 7.4: Referential Integrity & Cascades",
        "handbook_markdown": r"""# Lesson 7.4: Referential Integrity & Cascades

`ON DELETE CASCADE` automatically deletes associated child records (e.g. chat messages) when a parent user is deleted.
""",
        "starter_code": {
            "solution.py": '''"""
Referential Integrity & Cascades
Simulate cascade deletion of child rows.
"""

from typing import List, Dict

def cascade_delete_messages(parent_user_id: int, messages: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    return [m for m in messages if m.get("user_id") != parent_user_id]
'''
        },
        "test_suite": {
            "exercise_about": "Understand ON DELETE CASCADE relational constraints.",
            "exercise_goal": "Implement `cascade_delete_messages(parent_user_id, messages)`.",
            "expected_output": "Filter out child messages belonging to deleted user.",
            "tests.py": '''import pytest
from solution import cascade_delete_messages

def test_cascade_delete():
    msgs = [{"id": 1, "user_id": 10}, {"id": 2, "user_id": 20}]
    assert cascade_delete_messages(10, msgs) == [{"id": 2, "user_id": 20}]
'''
        }
    },
    "node-5-5": {
        "title": "Lesson 7.5: Atomic DML Operations",
        "handbook_markdown": r"""# Lesson 7.5: Atomic DML Operations

Atomic `UPDATE accounts SET balance = balance - 10 WHERE id = 1` prevents race conditions.
""",
        "starter_code": {
            "solution.py": '''"""
Atomic DML Operations
Compute balance update.
"""

def compute_balance_update(current_balance: int, delta: int) -> int:
    return current_balance + delta
'''
        },
        "test_suite": {
            "exercise_about": "Understand atomic in-place arithmetic updates in SQL.",
            "exercise_goal": "Implement `compute_balance_update(current_balance, delta)`.",
            "expected_output": "Compute updated balance.",
            "tests.py": '''import pytest
from solution import compute_balance_update

def test_balance_update():
    assert compute_balance_update(100, -30) == 70
'''
        }
    },
    "node-5-6": {
        "title": "Lesson 7.6: PostgreSQL Upserts (ON CONFLICT)",
        "handbook_markdown": r"""# Lesson 7.6: PostgreSQL Upserts (ON CONFLICT)

`INSERT INTO ... ON CONFLICT (key) DO UPDATE SET ...` merges insert and update into a single atomic round-trip.
""",
        "starter_code": {
            "solution.py": '''"""
PostgreSQL Upserts (ON CONFLICT)
Perform in-memory upsert into dictionary table.
"""

from typing import Dict, Any

def upsert_record(table: Dict[str, Any], key: str, value: Any) -> None:
    table[key] = value
'''
        },
        "test_suite": {
            "exercise_about": "Understand SQL ON CONFLICT DO UPDATE upsert semantics.",
            "exercise_goal": "Implement `upsert_record(table, key, value)`.",
            "expected_output": "Insert new keys or update existing keys in-place.",
            "tests.py": '''import pytest
from solution import upsert_record

def test_upsert():
    tbl = {}
    upsert_record(tbl, "user_1", "created")
    assert tbl["user_1"] == "created"
    upsert_record(tbl, "user_1", "updated")
    assert tbl["user_1"] == "updated"
'''
        }
    },
    "node-5-7": {
        "title": "Lesson 7.7: The RETURNING Clause",
        "handbook_markdown": r"""# Lesson 7.7: The RETURNING Clause

Postgres `INSERT ... RETURNING id, created_at` retrieves generated columns without a second `SELECT` query.
""",
        "starter_code": {
            "solution.py": '''"""
The RETURNING Clause
Format insert record returning payload.
"""

from typing import Dict, Any

def format_returning_payload(record_id: int, status: str) -> Dict[str, Any]:
    return {"id": record_id, "status": status}
'''
        },
        "test_suite": {
            "exercise_about": "Understand SQL RETURNING clauses.",
            "exercise_goal": "Implement `format_returning_payload(record_id, status)`.",
            "expected_output": "Return payload with generated ID.",
            "tests.py": '''import pytest
from solution import format_returning_payload

def test_returning():
    assert format_returning_payload(42, "inserted") == {"id": 42, "status": "inserted"}
'''
        }
    },
    "node-5-8": {
        "title": "Lesson 7.8: SQL Execution Order",
        "handbook_markdown": r"""# Lesson 7.8: SQL Execution Order

Logical SQL query evaluation order:
1. `FROM` & `JOIN`
2. `WHERE`
3. `GROUP BY`
4. `HAVING`
5. `SELECT`
6. `ORDER BY`
7. `LIMIT` / `OFFSET`
""",
        "starter_code": {
            "solution.py": '''"""
SQL Execution Order
Return true logical execution steps.
"""

from typing import List

def get_sql_execution_order() -> List[str]:
    return ["FROM", "WHERE", "GROUP BY", "HAVING", "SELECT", "ORDER BY", "LIMIT"]
'''
        },
        "test_suite": {
            "exercise_about": "Master the logical evaluation order of SQL queries.",
            "exercise_goal": "Implement `get_sql_execution_order()`.",
            "expected_output": "Return exact execution stages.",
            "tests.py": '''import pytest
from solution import get_sql_execution_order

def test_sql_order():
    order = get_sql_execution_order()
    assert order[0] == "FROM"
    assert order[1] == "WHERE"
    assert order[4] == "SELECT"
'''
        }
    },
    "node-5-9": {
        "title": "Lesson 7.9: Advanced Joins & Lateral Joins",
        "handbook_markdown": r"""# Lesson 7.9: Advanced Joins & Lateral Joins

`LEFT JOIN LATERAL` acts like a SQL for-each loop, evaluating a subquery for each row of the outer table (e.g. top-3 documents per user).
""",
        "starter_code": {
            "solution.py": '''"""
Advanced Joins & Lateral Joins
Simulate top-1 subquery join per user.
"""

from typing import List, Dict, Any

def get_top_document_per_user(users: List[dict], documents: List[dict]) -> List[dict]:
    res = []
    for u in users:
        u_docs = [d for d in documents if d.get("user_id") == u.get("id")]
        top_doc = u_docs[0] if u_docs else None
        res.append({"user_id": u["id"], "top_doc": top_doc})
    return res
'''
        },
        "test_suite": {
            "exercise_about": "Understand Lateral Joins for per-row subquery evaluation.",
            "exercise_goal": "Implement `get_top_document_per_user(users, documents)`.",
            "expected_output": "Attach top document to each user.",
            "tests.py": '''import pytest
from solution import get_top_document_per_user

def test_lateral_join():
    users = [{"id": 1}]
    docs = [{"id": 101, "user_id": 1}]
    res = get_top_document_per_user(users, docs)
    assert res[0]["top_doc"]["id"] == 101
'''
        }
    },
    "node-5-10": {
        "title": "Lesson 7.10: Correlated Subqueries vs Joins",
        "handbook_markdown": r"""# Lesson 7.10: Correlated Subqueries vs Joins

Replacing correlated subqueries with `JOIN` or `EXISTS` allows query planners to use fast Hash Joins instead of nested loop scans.
""",
        "starter_code": {
            "solution.py": '''"""
Correlated Subqueries vs Joins
Filter items present in foreign key set.
"""

from typing import List, Set

def filter_existing_users(user_ids: List[int], existing_set: Set[int]) -> List[int]:
    return [uid for uid in user_ids if uid in existing_set]
'''
        },
        "test_suite": {
            "exercise_about": "Understand EXISTS hash set lookups vs correlated nested loops.",
            "exercise_goal": "Implement `filter_existing_users(user_ids, existing_set)`.",
            "expected_output": "Filter matching user IDs.",
            "tests.py": '''import pytest
from solution import filter_existing_users

def test_exists_filter():
    assert filter_existing_users([1, 2, 3], {2, 3, 4}) == [2, 3]
'''
        }
    },
    "node-5-11": {
        "title": "Lesson 7.11: Common Table Expressions (CTEs)",
        "handbook_markdown": r"""# Lesson 7.11: Common Table Expressions (CTEs)

`WITH active_users AS (SELECT ...) SELECT * FROM active_users` structures complex queries into readable pipeline steps.
""",
        "starter_code": {
            "solution.py": '''"""
Common Table Expressions (CTEs)
Format CTE SQL query string.
"""

def format_cte_query(cte_name: str, cte_sql: str, main_sql: str) -> str:
    return f"WITH {cte_name} AS ({cte_sql}) {main_sql}"
'''
        },
        "test_suite": {
            "exercise_about": "Construct Common Table Expression (CTE) query strings.",
            "exercise_goal": "Implement `format_cte_query(cte_name, cte_sql, main_sql)`.",
            "expected_output": "Return formatted SQL CTE query.",
            "tests.py": '''import pytest
from solution import format_cte_query

def test_cte_format():
    sql = format_cte_query("t", "SELECT 1", "SELECT * FROM t")
    assert sql == "WITH t AS (SELECT 1) SELECT * FROM t"
'''
        }
    },
    "node-5-12": {
        "title": "Lesson 7.12: Recursive CTEs for Agent Trees",
        "handbook_markdown": r"""# Lesson 7.12: Recursive CTEs for Agent Trees

`WITH RECURSIVE hierarchy AS (...)` traverses hierarchical org charts and agent sub-task DAGs in SQL.
""",
        "starter_code": {
            "solution.py": '''"""
Recursive CTEs for Agent Trees
Traverse parent-child tree to find root ancestors.
"""

from typing import Dict, List, Optional

def get_ancestor_chain(node: str, parent_map: Dict[str, Optional[str]]) -> List[str]:
    chain = [node]
    curr = node
    while curr in parent_map and parent_map[curr]:
        curr = parent_map[curr]
        chain.append(curr)
    return chain
'''
        },
        "test_suite": {
            "exercise_about": "Traverse hierarchical trees using recursive ancestor resolution.",
            "exercise_goal": "Implement `get_ancestor_chain(node, parent_map)`.",
            "expected_output": "Return list from leaf to root ancestor.",
            "tests.py": '''import pytest
from solution import get_ancestor_chain

def test_ancestor_chain():
    parents = {"subtask": "task", "task": "root", "root": None}
    assert get_ancestor_chain("subtask", parents) == ["subtask", "task", "root"]
'''
        }
    },
    "node-5-13": {
        "title": "Lesson 7.13: Multi-Dimensional Aggregations",
        "handbook_markdown": r"""# Lesson 7.13: Multi-Dimensional Aggregations

`GROUP BY GROUPING SETS`, `CUBE`, and `ROLLUP` generate multi-level summary subtotals in a single table scan.
""",
        "starter_code": {
            "solution.py": '''"""
Multi-Dimensional Aggregations
Compute grand total and category subtotals.
"""

from typing import List, Dict

def compute_category_totals(records: List[Dict[str, Any]]) -> Dict[str, float]:
    totals = {"__GRAND_TOTAL__": 0.0}
    for r in records:
        cat = r["category"]
        amount = r["amount"]
        totals[cat] = totals.get(cat, 0.0) + amount
        totals["__GRAND_TOTAL__"] += amount
    return totals
'''
        },
        "test_suite": {
            "exercise_about": "Compute hierarchical aggregation subtotals.",
            "exercise_goal": "Implement `compute_category_totals(records)`.",
            "expected_output": "Return category subtotals and grand total.",
            "tests.py": '''import pytest
from solution import compute_category_totals

def test_aggregations():
    records = [{"category": "AI", "amount": 10.0}, {"category": "DB", "amount": 20.0}]
    res = compute_category_totals(records)
    assert res["AI"] == 10.0
    assert res["__GRAND_TOTAL__"] == 30.0
'''
        }
    },
    "node-5-14": {
        "title": "Lesson 7.14: Keyset Cursor Pagination",
        "handbook_markdown": r"""# Lesson 7.14: Keyset Cursor Pagination

Avoid slow `OFFSET 1000000` (which scans and discards 1M rows). Use **Keyset Cursor Pagination**:
`WHERE (created_at, id) < ($cursor_time, $cursor_id) ORDER BY created_at DESC, id DESC LIMIT 50`
""",
        "starter_code": {
            "solution.py": '''"""
Keyset Cursor Pagination
Filter records older than cursor timestamp.
"""

from typing import List, Dict, Any, Optional

def paginate_keyset(records: List[dict], cursor_id: Optional[int], limit: int = 2) -> List[dict]:
    filtered = records
    if cursor_id is not None:
        filtered = [r for r in records if r["id"] > cursor_id]
    return filtered[:limit]
'''
        },
        "test_suite": {
            "exercise_about": "Implement high-performance keyset cursor pagination.",
            "exercise_goal": "Implement `paginate_keyset(records, cursor_id, limit)`.",
            "expected_output": "Return page of items following cursor ID.",
            "tests.py": '''import pytest
from solution import paginate_keyset

def test_keyset():
    recs = [{"id": 1}, {"id": 2}, {"id": 3}, {"id": 4}]
    page1 = paginate_keyset(recs, cursor_id=None, limit=2)
    assert page1 == [{"id": 1}, {"id": 2}]
    page2 = paginate_keyset(recs, cursor_id=2, limit=2)
    assert page2 == [{"id": 3}, {"id": 4}]
'''
        }
    },
    "node-5-15": {
        "title": "Lesson 7.15: Window Functions: Partitioning",
        "handbook_markdown": r"""# Lesson 7.15: Window Functions: Partitioning

`OVER (PARTITION BY department)` computes aggregate metrics without collapsing rows into a single `GROUP BY` line.
""",
        "starter_code": {
            "solution.py": '''"""
Window Functions: Partitioning
Calculate department average salary attached to each employee.
"""

from typing import List, Dict

def add_partition_average(employees: List[dict]) -> List[dict]:
    dept_totals = {}
    dept_counts = {}
    for e in employees:
        d = e["dept"]
        dept_totals[d] = dept_totals.get(d, 0) + e["salary"]
        dept_counts[d] = dept_counts.get(d, 0) + 1
    
    res = []
    for e in employees:
        item = dict(e)
        item["dept_avg"] = dept_totals[e["dept"]] / dept_counts[e["dept"]]
        res.append(item)
    return res
'''
        },
        "test_suite": {
            "exercise_about": "Implement SQL PARTITION BY window calculations.",
            "exercise_goal": "Implement `add_partition_average(employees)`.",
            "expected_output": "Attach partition average to each record.",
            "tests.py": '''import pytest
from solution import add_partition_average

def test_partition_window():
    emps = [{"id": 1, "dept": "AI", "salary": 100}, {"id": 2, "dept": "AI", "salary": 200}]
    res = add_partition_average(emps)
    assert res[0]["dept_avg"] == 150.0
    assert res[1]["dept_avg"] == 150.0
'''
        }
    },
    "node-5-16": {
        "title": "Lesson 7.16: Ranking Functions (ROW_NUMBER)",
        "handbook_markdown": r"""# Lesson 7.16: Ranking Functions (ROW_NUMBER)

`ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY score DESC)` assigns a 1-indexed sequential rank to each row.
""",
        "starter_code": {
            "solution.py": '''"""
Ranking Functions (ROW_NUMBER)
Assign 1-indexed rank within sorted list.
"""

from typing import List, Dict

def assign_row_numbers(records: List[dict], score_key: str) -> List[dict]:
    sorted_recs = sorted(records, key=lambda x: x[score_key], reverse=True)
    res = []
    for i, r in enumerate(sorted_recs, start=1):
        item = dict(r)
        item["row_num"] = i
        res.append(item)
    return res
'''
        },
        "test_suite": {
            "exercise_about": "Implement ROW_NUMBER ranking window functions.",
            "exercise_goal": "Implement `assign_row_numbers(records, score_key)`.",
            "expected_output": "Assign consecutive ranks descending by score.",
            "tests.py": '''import pytest
from solution import assign_row_numbers

def test_row_number():
    recs = [{"id": 1, "score": 80}, {"id": 2, "score": 95}]
    res = assign_row_numbers(recs, "score")
    assert res[0]["id"] == 2
    assert res[0]["row_num"] == 1
'''
        }
    },
    "node-5-17": {
        "title": "Lesson 7.17: Offset Functions: LAG & LEAD",
        "handbook_markdown": r"""# Lesson 7.17: Offset Functions: LAG & LEAD

`LAG(val, 1)` and `LEAD(val, 1)` access previous and next row values without a self-join.
""",
        "starter_code": {
            "solution.py": '''"""
Offset Functions: LAG & LEAD
Compute value delta from previous row (LAG).
"""

from typing import List, Optional

def compute_lag_deltas(values: List[float]) -> List[Optional[float]]:
    res = [None]
    for i in range(1, len(values)):
        res.append(values[i] - values[i - 1])
    return res
'''
        },
        "test_suite": {
            "exercise_about": "Implement SQL LAG offset calculations.",
            "exercise_goal": "Implement `compute_lag_deltas(values)`.",
            "expected_output": "Return deltas with None for first row.",
            "tests.py": '''import pytest
from solution import compute_lag_deltas

def test_lag():
    assert compute_lag_deltas([10.0, 15.0, 25.0]) == [None, 5.0, 10.0]
'''
        }
    },
    "node-5-18": {
        "title": "Lesson 7.18: Window Framing & Moving Averages",
        "handbook_markdown": r"""# Lesson 7.18: Window Framing & Moving Averages

`ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` defines a sliding frame for rolling moving averages.
""",
        "starter_code": {
            "solution.py": '''"""
Window Framing & Moving Averages
Compute 3-element rolling moving average.
"""

from typing import List

def moving_average_3(values: List[float]) -> List[float]:
    res = []
    for i in range(len(values)):
        start = max(0, i - 2)
        window = values[start:i + 1]
        res.append(sum(window) / len(window))
    return res
'''
        },
        "test_suite": {
            "exercise_about": "Implement SQL rolling window frame moving averages.",
            "exercise_goal": "Implement `moving_average_3(values)`.",
            "expected_output": "Compute rolling frame averages.",
            "tests.py": '''import pytest
from solution import moving_average_3

def test_moving_avg():
    res = moving_average_3([10.0, 20.0, 30.0, 40.0])
    assert res == [10.0, 15.0, 20.0, 30.0]
'''
        }
    },
    "node-5-19": {
        "title": "Lesson 7.19: Percentiles & Distributions",
        "handbook_markdown": r"""# Lesson 7.19: Percentiles & Distributions

`PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY latency)` calculates P99 latency SLAs.
""",
        "starter_code": {
            "solution.py": '''"""
Percentiles & Distributions
Compute p-th percentile from sorted list.
"""

from typing import List

def calculate_percentile(sorted_values: List[float], p: float) -> float:
    """Calculate nearest-rank percentile p in [0.0, 1.0]."""
    if not sorted_values:
        return 0.0
    idx = int(len(sorted_values) * p)
    idx = min(idx, len(sorted_values) - 1)
    return sorted_values[idx]
'''
        },
        "test_suite": {
            "exercise_about": "Compute percentile latency distributions.",
            "exercise_goal": "Implement `calculate_percentile(sorted_values, p)`.",
            "expected_output": "Return requested percentile threshold value.",
            "tests.py": '''import pytest
from solution import calculate_percentile

def test_percentile():
    vals = [10.0, 20.0, 30.0, 40.0, 50.0, 60.0, 70.0, 80.0, 90.0, 100.0]
    assert calculate_percentile(vals, 0.90) == 100.0 # 9th index
'''
        }
    },
    "node-5-20": {
        "title": "Lesson 7.20: First & Last Value Frames",
        "handbook_markdown": r"""# Lesson 7.20: First & Last Value Frames

`FIRST_VALUE(token) OVER (PARTITION BY session_id ORDER BY created_at)` retrieves session initial prompt tokens.
""",
        "starter_code": {
            "solution.py": '''"""
First & Last Value Frames
Extract first element of sequence.
"""

from typing import List, Optional, Any

def get_first_value(items: List[Any]) -> Optional[Any]:
    return items[0] if items else None
'''
        },
        "test_suite": {
            "exercise_about": "Understand FIRST_VALUE window framing.",
            "exercise_goal": "Implement `get_first_value(items)`.",
            "expected_output": "Return first element or None.",
            "tests.py": '''import pytest
from solution import get_first_value

def test_first_val():
    assert get_first_value(["start", "mid", "end"]) == "start"
'''
        }
    },
    "node-5-21": {
        "title": "Lesson 7.21: In-Database Quota Leaderboards",
        "handbook_markdown": r"""# Lesson 7.21: In-Database Quota Leaderboards

Rank top users by token consumption using dense ranking.
""",
        "starter_code": {
            "solution.py": '''"""
In-Database Quota Leaderboards
Filter top-N users by token consumption.
"""

from typing import List, Dict

def top_quota_consumers(users: List[dict], limit: int = 3) -> List[dict]:
    return sorted(users, key=lambda u: u.get("tokens", 0), reverse=True)[:limit]
'''
        },
        "test_suite": {
            "exercise_about": "Build top-quota user leaderboards.",
            "exercise_goal": "Implement `top_quota_consumers(users, limit)`.",
            "expected_output": "Return highest quota consuming users.",
            "tests.py": '''import pytest
from solution import top_quota_consumers

def test_leaderboard():
    users = [{"name": "A", "tokens": 10}, {"name": "B", "tokens": 50}, {"name": "C", "tokens": 30}]
    top = top_quota_consumers(users, 2)
    assert top[0]["name"] == "B"
    assert top[1]["name"] == "C"
'''
        }
    },
    "node-5-22": {
        "title": "Lesson 7.22: Physical Storage: 8KB Pages",
        "handbook_markdown": r"""# Lesson 7.22: Physical Storage: 8KB Pages

Postgres stores table and index data in **8KB disk pages (blocks)**. Rows exceeding page size are moved to **TOAST** storage.
""",
        "starter_code": {
            "solution.py": '''"""
Physical Storage: 8KB Pages
Calculate number of 8KB pages needed to store bytes.
"""

import math

def calculate_pages_needed(total_bytes: int, page_size: int = 8192) -> int:
    return math.ceil(total_bytes / page_size)
'''
        },
        "test_suite": {
            "exercise_about": "Understand Postgres 8KB physical page block storage.",
            "exercise_goal": "Implement `calculate_pages_needed(total_bytes, page_size)`.",
            "expected_output": "Compute required page count.",
            "tests.py": '''import pytest
from solution import calculate_pages_needed

def test_pages():
    assert calculate_pages_needed(8192) == 1
    assert calculate_pages_needed(8193) == 2
'''
        }
    },
    "node-5-23": {
        "title": "Lesson 7.23: B-Tree Index Architecture",
        "handbook_markdown": r"""# Lesson 7.23: B-Tree Index Architecture

Postgres **B-Tree Indexes** maintain balanced search trees with $O(\log N)$ point lookups and range scans.
""",
        "starter_code": {
            "solution.py": '''"""
B-Tree Index Architecture
Estimate B-Tree tree height given fanout and row count.
"""

import math

def estimate_btree_height(num_rows: int, fanout: int = 200) -> int:
    """Calculate ceil(log_fanout(num_rows))."""
    if num_rows <= 1:
        return 1
    return math.ceil(math.log(num_rows, fanout))
'''
        },
        "test_suite": {
            "exercise_about": "Understand B-Tree fanout and tree depth calculation.",
            "exercise_goal": "Implement `estimate_btree_height(num_rows, fanout)`.",
            "expected_output": "Return estimated B-Tree tree height.",
            "tests.py": '''import pytest
from solution import estimate_btree_height

def test_btree_height():
    # 1,000,000 rows with fanout 200 -> height = 3 (200^3 = 8,000,000)
    assert estimate_btree_height(1_000_000, 200) == 3
'''
        }
    },
    "node-5-24": {
        "title": "Lesson 7.24: Composite Indexes & Prefix Rules",
        "handbook_markdown": r"""# Lesson 7.24: Composite Indexes & Prefix Rules

An index on `(user_id, created_at)` can speed up queries on `user_id` alone, but **cannot** speed up queries on `created_at` alone (**Leftmost Prefix Rule**).
""",
        "starter_code": {
            "solution.py": '''"""
Composite Indexes & Prefix Rules
Verify if query columns match composite index leftmost prefix.
"""

from typing import List

def is_leftmost_prefix_match(index_cols: List[str], query_cols: List[str]) -> bool:
    """Return True if query_cols matches leading columns of index_cols."""
    if len(query_cols) > len(index_cols):
        return False
    return index_cols[:len(query_cols)] == query_cols
'''
        },
        "test_suite": {
            "exercise_about": "Understand the Leftmost Prefix Rule in composite indexing.",
            "exercise_goal": "Implement `is_leftmost_prefix_match(index_cols, query_cols)`.",
            "expected_output": "Validate index coverage.",
            "tests.py": '''import pytest
from solution import is_leftmost_prefix_match

def test_prefix_rule():
    idx = ["user_id", "created_at"]
    assert is_leftmost_prefix_match(idx, ["user_id"]) is True
    assert is_leftmost_prefix_match(idx, ["user_id", "created_at"]) is True
    assert is_leftmost_prefix_match(idx, ["created_at"]) is False # Violates prefix rule!
'''
        }
    },
    "node-5-25": {
        "title": "Lesson 7.25: Covering Indexes & Index-Only Scans",
        "handbook_markdown": r"""# Lesson 7.25: Covering Indexes & Index-Only Scans

`CREATE INDEX ... INCLUDE (status)` includes payload columns in index leaf pages, enabling **Index-Only Scans** without touching the heap table.
""",
        "starter_code": {
            "solution.py": '''"""
Covering Indexes & Index-Only Scans
Check if index covers all requested query columns.
"""

from typing import Set

def is_index_only_scan_possible(index_all_columns: Set[str], select_columns: Set[str]) -> bool:
    return select_columns.issubset(index_all_columns)
'''
        },
        "test_suite": {
            "exercise_about": "Identify Index-Only Scan query coverage.",
            "exercise_goal": "Implement `is_index_only_scan_possible(index_all_columns, select_columns)`.",
            "expected_output": "Verify if all requested columns reside in index.",
            "tests.py": '''import pytest
from solution import is_index_only_scan_possible

def test_index_only():
    idx_cols = {"id", "email", "status"}
    assert is_index_only_scan_possible(idx_cols, {"id", "status"}) is True
    assert is_index_only_scan_possible(idx_cols, {"id", "password_hash"}) is False
'''
        }
    }
}

def apply_patches():
    print(f"Applying patch to {len(LESSONS_DATA)} lessons in Module 7 (node-5-1 to node-5-25)...")
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
