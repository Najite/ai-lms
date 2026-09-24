#!/usr/bin/env python3
"""
Safe curriculum content generation for the AI-Native LMS.

This script intentionally does not invent deep domain facts or fake product claims.
Instead, it creates a beginner-friendly blog-style handbook for every lesson using:
- the actual lesson title from the database
- the actual phase name from the database
- a deterministic template for every lesson
- inline SVG illustrations generated from the lesson topic

This avoids hallucination while still giving the app readable lesson content.

Usage:
    python3 scripts/generate_blog_style_lesson_content.py

Requirements:
- .env or .env.local with SUPABASE_SERVICE_ROLE_KEY and SUPABASE_URL
- valid internet connectivity to Supabase
"""

from __future__ import annotations

import base64
import json
import os
import re
import sys
import argparse
from typing import Any, Dict, List, Tuple
from urllib import request, error


ENV_CANDIDATES = [".env.local", ".env"]


def load_env() -> Dict[str, str]:
    env: Dict[str, str] = {}
    for path in ENV_CANDIDATES:
        if not os.path.exists(path):
            continue
        with open(path, "r", encoding="utf-8") as fh:
            for raw in fh:
                line = raw.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, value = line.split("=", 1)
                env[key.strip()] = value.strip().strip('"\'')
    return env


def pick_supabase_config() -> Tuple[str, str]:
    env = load_env()
    url = env.get("SUPABASE_URL") or env.get("NEXT_PUBLIC_SUPABASE_URL") or "https://lfsyndffrfwvdfzjsagl.supabase.co"
    key = env.get("SUPABASE_SERVICE_ROLE_KEY") or env.get("SUPABASE_ANON_KEY") or ""
    return url, key


def get_request(url: str, key: str, query: str) -> Any:
    req = request.Request(
        f"{url}/rest/v1/{query}",
        headers={
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        method="GET",
    )
    with request.urlopen(req, timeout=45) as resp:
        return json.loads(resp.read().decode("utf-8"))


def post_request(url: str, key: str, table: str, payload: Dict[str, Any]) -> None:
    req = request.Request(
        f"{url}/rest/v1/{table}?id=eq.{payload['id']}",
        headers={
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
        },
        data=json.dumps(payload).encode("utf-8"),
        method="PATCH",
    )
    with request.urlopen(req, timeout=45) as resp:
        resp.read()


def slugify(value: str) -> str:
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = re.sub(r"-+", "-", value).strip("-")
    return value or "lesson"


def clean_title(raw: str) -> str:
    raw = raw.strip()
    raw = re.sub(r"^Lesson\s*\d+\.\d+:\s*", "", raw)
    raw = raw.replace("—", "-")
    return raw.strip()


def title_to_topic(raw: str) -> str:
    title = clean_title(raw)
    return title.split(":", 1)[0].strip() if ":" in title else title


def phase_name_for(phase_id: str, phase_rows: Dict[str, str]) -> str:
    return phase_rows.get(phase_id, "Core Engineering")


def generate_svg_diagram(topic: str, phase_name: str) -> str:
    topic_simple = topic[:42]
    svg = f"""
    <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='420' viewBox='0 0 1200 420'>
      <defs>
        <linearGradient id='g1' x1='0' x2='1'>
          <stop offset='0%' stop-color='#101318'/>
          <stop offset='100%' stop-color='#1f2942'/>
        </linearGradient>
      </defs>
      <rect width='1200' height='420' fill='#08090a'/>
      <rect x='60' y='60' width='1080' height='300' rx='18' fill='url(#g1)' stroke='#2a2d36'/>
      <rect x='120' y='130' width='280' height='120' rx='12' fill='#111827' stroke='#5e6ad2'/>
      <rect x='460' y='90' width='180' height='200' rx='12' fill='#0b1220' stroke='#10b981'/>
      <rect x='700' y='130' width='300' height='120' rx='12' fill='#111827' stroke='#8a8f98'/>
      <text x='120' y='100' fill='#8a8f98' font-family='Arial' font-size='26'>Topic</text>
      <text x='140' y='195' fill='#f3f4f6' font-family='Arial' font-size='30' font-weight='700'>{topic_simple}</text>
      <text x='490' y='165' fill='#10b981' font-family='Arial' font-size='28' font-weight='700'>input</text>
      <text x='490' y='245' fill='#d1d5db' font-family='Arial' font-size='22'>state</text>
      <path d='M400 190 L460 190' stroke='#5e6ad2' stroke-width='6'/>
      <path d='M640 190 L700 190' stroke='#10b981' stroke-width='6'/>
      <text x='720' y='195' fill='#f3f4f6' font-family='Arial' font-size='26' font-weight='700'>output</text>
      <text x='700' y='250' fill='#a1a1aa' font-family='Arial' font-size='22'>{phase_name[:28]}</text>
    </svg>
    """
    encoded = base64.b64encode(svg.encode("utf-8")).decode("ascii")
    return f"data:image/svg+xml;base64,{encoded}"


def build_blog_handbook(title: str, phase_name: str) -> str:
    clean = clean_title(title)
    topic = title_to_topic(title)
    core_idea = topic
    image = generate_svg_diagram(core_idea, phase_name)

    return f"""# {title}

## Why this matters
This lesson is about {topic.lower()} in a way that is useful to a real beginner. You do not need to memorize everything at once. The goal is to understand the idea clearly and then use it in a small, realistic example.

The best way to learn this concept is to slow down and connect it to something you already know. In engineering, a new idea becomes easier when you see what the system is trying to protect, preserve, or move.

![{topic} diagram]({image})

## The simple idea
When you work with {topic.lower()}, think of it as a small system with a few moving parts. There is input, there is a process, and there is output. The important question is not “can I copy the syntax?” It is: “do I understand the rule that keeps the system correct?”

In {phase_name}, this idea matters because it is part of a larger pattern. Small ideas stack up. Once you understand the rule, the harder problems become easier to reason about.

## The mental model
A beginner-friendly mental model is:

- The input is the data you start with.
- The process is the rule or operation that transforms it.
- The output is the result you can inspect and verify.

This keeps the topic grounded. You are not learning abstract symbols for their own sake. You are learning how a system moves from one state to another without losing meaning.

## A practical example
```python
# Example: {topic}
value = "hello"
print(value)
```

This tiny example is not meant to impress anyone. It is meant to make the rule visible. When the rule is visible, it becomes easier to reason about and easier to debug later.

## What can go wrong
The most common beginner problem is not a big conceptual failure. It is usually a small mismatch between expectation and reality.

For example:

- assuming the system does more than it really does
- ignoring a boundary condition
- changing the state before checking the previous state
- mixing up input and output

A careful engineer reads the rule, tests the edge cases, and only then moves on.

## A good habit
Work in small steps. First, understand the input. Then, understand the transformation. Finally, verify the output.

This is a better habit than trying to memorize a whole pattern at once. Good engineering is usually a sequence of simple decisions made carefully.

## Try this on your own
Write a tiny example that uses {topic.lower()} in a real situation. Keep it small. Make it readable. Then explain the result in one sentence.

If you can explain the result in plain English, you are learning the real concept.

## Quick takeaway
{topic} becomes easier to understand when you treat it as a rule, not as a trick. Learn the pattern, test the edge case, and keep the mental model simple.

## Check yourself
Ask these questions:

1. What is the input?
2. What is the transformation?
3. What is the output?
4. What would fail if the rule were slightly wrong?

If you can answer those clearly, you understand the lesson at a useful level.
"""


def generate_lesson_data(title: str, phase_name: str) -> Dict[str, Any]:
    handbook = build_blog_handbook(title, phase_name)
    return {
        "handbook_markdown": handbook,
        "subtitle": f"A beginner-friendly look at {clean_title(title).lower()}",
        "cs_foundation": f"This lesson is part of the {phase_name} track. It introduces a core concept and helps build a reliable mental model before moving to more advanced engineering work.",
        "ai_convergence": f"This concept connects to how software systems process input, transform data, and produce consistent output in modern AI and system pipelines.",
        "xp_reward": 100,
    }


def candidate_is_source_bound(
    title: str,
    source_spec: str,
    starter_code: Any,
    handbook: str,
) -> bool:
    """Reject generic prose before it can overwrite a real lesson contract."""
    source_words = {
        word
        for word in re.findall(r"[a-z][a-z0-9_+-]{2,}", source_spec.lower())
        if word not in {"the", "and", "for", "with", "lesson", "module"}
    }
    handbook_words = set(re.findall(r"[a-z][a-z0-9_+-]{2,}", handbook.lower()))
    if len(source_words & handbook_words) < min(3, len(source_words)):
        return False

    source_code = "\n".join(starter_code.values()) if isinstance(starter_code, dict) else str(starter_code)
    symbols = re.findall(r"(?:def|class)\s+([A-Za-z_]\w*)", source_code)
    return bool(title.strip() and all(symbol in handbook for symbol in symbols))


def query_all_nodes(url: str, key: str) -> List[Dict[str, Any]]:
    rows = get_request(url, key, "curriculum_nodes?select=id,title,phase_id,handbook_markdown,curriculum_spec_markdown,starter_code,order_index")
    return rows


def query_phase_map(url: str, key: str) -> Dict[str, str]:
    rows = get_request(url, key, "curriculum_phases?select=id,title")
    return {row["id"]: row["title"] for row in rows}


def update_node(url: str, key: str, lesson: Dict[str, Any], generated: Dict[str, Any]) -> None:
    payload = {
        "id": lesson["id"],
        "subtitle": generated["subtitle"],
        "cs_foundation": generated["cs_foundation"],
        "ai_convergence": generated["ai_convergence"],
        "xp_reward": int(generated["xp_reward"]),
        "handbook_markdown": generated["handbook_markdown"],
    }
    post_request(url, key, "curriculum_nodes", payload)


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate source-bound lesson content")
    parser.add_argument(
        "--write",
        action="store_true",
        help="Allow database writes after source-bound validation; default is audit-only",
    )
    args = parser.parse_args()

    url, key = pick_supabase_config()
    if not key:
        print("Missing SUPABASE_SERVICE_ROLE_KEY in .env or .env.local.")
        print("Add it, then run this script again.")
        return 1

    try:
        phase_map = query_phase_map(url, key)
        nodes = query_all_nodes(url, key)
    except Exception as exc:  # pragma: no cover
        print(f"Unable to load lesson metadata: {exc}")
        return 1

    missing_contracts = [
        lesson.get("id", "unknown")
        for lesson in nodes
        if not (lesson.get("curriculum_spec_markdown") or "").strip()
    ]
    if missing_contracts:
        print("Blocked: curriculum contracts are missing for " + ", ".join(missing_contracts[:10]))
        return 1
    if not args.write:
        print("Audit mode only. No lesson records will be written. Use --write only after review.")

    updated = 0
    skipped = 0

    for lesson in sorted(nodes, key=lambda item: item.get("order_index", 99999)):
        title = lesson.get("title") or "Untitled Lesson"
        phase_name = phase_name_for(lesson.get("phase_id", "unknown"), phase_map)
        existing = (lesson.get("handbook_markdown") or "").strip()

        if len(existing) > 200:
            skipped += 1
            continue

        generated = generate_lesson_data(title, phase_name)
        if not candidate_is_source_bound(
            title,
            lesson.get("curriculum_spec_markdown", ""),
            lesson.get("starter_code", {}),
            generated["handbook_markdown"],
        ):
            print(f"Blocked: {lesson.get('id')} is not source-bound")
            continue
        if not args.write:
            print(f"Audit only: {lesson.get('id')} passed source-bound checks")
            continue
        update_node(url, key, lesson, generated)
        updated += 1
        print(f"Updated: {lesson.get('id')} - {title}")

    print(f"Completed. Updated {updated} lessons. Skipped {skipped} lessons that already had content.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
