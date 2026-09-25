#!/usr/bin/env python3
"""Validate lesson contracts before lesson content is written.

This is a pre-write gate, not a content generator. It checks that the live
curriculum source, exercise, tests, and handbook still describe the same lesson.
It cannot prove that prose is beautiful; that remains a human review step.
"""

from __future__ import annotations

import hashlib
import json
import os
import re
import sys
from typing import Any, Dict, Iterable, List, Tuple
from urllib.parse import quote
from urllib.request import Request, urlopen

STOP_WORDS = {
    "about", "after", "and", "are", "from", "into", "lesson", "module",
    "the", "this", "with", "your", "for", "using", "what", "core",
    "foundations", "advanced", "production", "engineering", "systems",
}


def load_env() -> Dict[str, str]:
    values: Dict[str, str] = {}
    for path in (".env.local", ".env"):
        if not os.path.exists(path):
            continue
        with open(path, "r", encoding="utf-8") as stream:
            for line in stream:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, value = line.split("=", 1)
                    values[key.strip()] = value.strip().strip('"\'')
    return values


def supabase_config() -> Tuple[str, str]:
    env = load_env()
    url = env.get("SUPABASE_URL") or env.get("NEXT_PUBLIC_SUPABASE_URL")
    key = env.get("SUPABASE_SERVICE_ROLE_KEY") or env.get("SUPABASE_ANON_KEY") or env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    if not url or not key:
        raise RuntimeError("Missing Supabase URL or API key in .env.local/.env")
    return url.rstrip("/"), key


def fetch_rows(url: str, key: str) -> List[Dict[str, Any]]:
    query = "curriculum_nodes?select=id,title,phase_id,handbook_markdown,curriculum_spec_markdown,curriculum_spec_hash,starter_code,test_suite,content_status&order=order_index"
    request = Request(
        f"{url}/rest/v1/{query}",
        headers={"apikey": key, "Authorization": f"Bearer {key}", "Accept": "application/json"},
    )
    with urlopen(request, timeout=45) as response:
        return json.loads(response.read().decode("utf-8"))


def words(value: str) -> set[str]:
    return {
        word for word in re.findall(r"[a-z][a-z0-9_+-]{2,}", value.lower())
        if word not in STOP_WORDS
    }


def symbols(starter_code: Any) -> Iterable[str]:
    text = ""
    if isinstance(starter_code, dict):
        text = "\n".join(str(value) for value in starter_code.values())
    elif isinstance(starter_code, str):
        text = starter_code
    return re.findall(r"(?:def|class)\s+([A-Za-z_]\w*)", text)


def validate_row(row: Dict[str, Any]) -> List[str]:
    errors: List[str] = []
    lesson_id = row.get("id", "unknown")
    title = str(row.get("title") or "").strip()
    source = str(row.get("curriculum_spec_markdown") or "").strip()
    handbook = str(row.get("handbook_markdown") or "")
    stored_hash = str(row.get("curriculum_spec_hash") or "")
    starter = row.get("starter_code")
    tests = row.get("test_suite")

    if not title:
        errors.append("missing title")
    if not source:
        errors.append("missing curriculum source contract")
    if source and hashlib.md5(source.encode("utf-8")).hexdigest() != stored_hash:
        errors.append("curriculum source hash does not match source text")
    if not handbook.strip():
        errors.append("missing handbook")
    if not isinstance(starter, dict) or not starter:
        errors.append("missing starter code object")
    if not isinstance(tests, dict) or not tests:
        errors.append("missing test suite object")
    if row.get("content_status") not in {"draft", "reviewed", "verified"}:
        errors.append("invalid content status")

    if title and title.lower() not in handbook.lower():
        errors.append("handbook does not name the lesson")

    title_terms = words(title)
    source_terms = words(source)
    article_terms = words(handbook)
    if source_terms and len(source_terms & article_terms) < min(2, len(source_terms)):
        errors.append("handbook is not sufficiently grounded in the curriculum source")
    if title_terms and not title_terms.intersection(article_terms):
        errors.append("handbook vocabulary does not overlap the lesson title")

    test_text = ""
    starter_text = ""
    if isinstance(starter, dict):
        starter_text = "\n".join(str(value) for value in starter.values())
    elif isinstance(starter, str):
        starter_text = starter
    if isinstance(tests, dict):
        test_text = "\n".join(str(value) for value in tests.values())
    elif isinstance(tests, str):
        test_text = tests
    if starter_text and starter_text not in handbook:
        errors.append("handbook does not preserve the supplied starter code")
    if test_text and test_text not in handbook:
        errors.append("handbook does not preserve the supplied test suite")
    for symbol in symbols(starter):
        if symbol not in handbook:
            errors.append(f"handbook does not explain exercise symbol {symbol}")
    if test_text and not any(marker in handbook for marker in ("assert", "test", "Verification", "verification")):
        errors.append("handbook does not explain how the supplied test verifies behavior")

    return [f"{lesson_id}: {error}" for error in errors]


def main() -> int:
    try:
        url, key = supabase_config()
        rows = fetch_rows(url, key)
    except Exception as exc:
        print(f"VALIDATION BLOCKED: {exc}")
        return 2

    failures = [error for row in rows for error in validate_row(row)]
    print(f"Checked {len(rows)} lesson contracts.")
    if failures:
        print(f"FAILED: {len(failures)} contract checks")
        for failure in failures[:50]:
            print(f"- {failure}")
        if len(failures) > 50:
            print(f"- ... and {len(failures) - 50} more")
        return 1

    print("PASSED: curriculum source, handbook, starter code, and tests are aligned.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
