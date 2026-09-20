#!/usr/bin/env python3
"""
Populate Supabase curriculum_nodes with comprehensive, production-grade lesson handbooks,
code solutions, and test suites using Kilo Code Gateway (nvidia/nemotron-3-ultra-550b-a55b:free).
"""

import os
import re
import json
import time
import urllib.request
import urllib.error

# 1. Credentials
KILO_API_KEY = "REDACTED_KILO_KEY"
GATEWAY_URL = "https://api.kilo.ai/api/gateway/chat/completions"
MODEL_NAME = "nvidia/nemotron-3-ultra-550b-a55b:free"

# 2. Supabase Settings
SUPABASE_URL = "https://lfsyndffrfwvdfzjsagl.supabase.co"
SUPABASE_KEY = ""

with open(".env") as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            if k.strip() == "SUPABASE_SERVICE_ROLE_KEY":
                SUPABASE_KEY = v.strip().strip("\"'")

def parse_curriculum():
    """Extracts lessons from curriculum_manifest.json or curriculum.md"""
    manifest_path = "supabase/curriculum_manifest.json"
    if os.path.exists(manifest_path):
        with open(manifest_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data.get("lessons", [])
    return []

def generate_lesson_payload(lesson):
    """Prompts Nemotron 3 Ultra 550B via Kilo Gateway for complete beginner-to-professional lesson content."""
    prompt = f"""You are a Principal Systems Architect and Distinguished Computer Science Educator at an AI-Native Engineering LMS.
Your task is to author a complete, production-grade lesson specification for a student who starts with zero software knowledge and must graduate as a job-ready, autonomous software engineer.

### STRICT PEDAGOGICAL CONSTRAINTS:
1. NO ARTIFICIAL URGENCY: Do NOT use phrases like "quickly learn", "fast track", "in just 5 minutes", "don't miss out", or streak gamification. Use a calm, methodical, engineering-first tone.
2. FIRST-PRINCIPLES FOUNDATION: Explain HOW things work under the hood. When explaining numbers or data, show the bits. When explaining memory, show the byte addresses.
3. NO HALLUCINATIONS OR FORWARD REFERENCES: Use ONLY concepts that are either introduced in this lesson or exist in prior lessons according to the sequencing contract.
4. ANTI-SLOP & ANTI-SURFICIALITY: Avoid filler sentences. Jump straight to mechanical reality, syntax, memory layouts, invariants, and execution flows.
5. PRODUCTION RELEVANCE: Tie every lesson to how real systems fail in production (OOM kills, deadlocks, cache thrashing, buffer overflows, off-by-one pointer errors).

### LESSON INPUT:
- Phase: Phase {lesson.get('phase_number')}
- Lesson: Lesson {lesson.get('phase_number')}.{lesson.get('lesson_number')}: {lesson.get('title')}
- Specification & Subtopics:
{lesson.get('content_markdown', '')}

### REQUIRED OUTPUT:
Return ONLY a valid JSON object matching this schema:
{{
  "subtitle": "A concise, 1-sentence technical essence of the lesson.",
  "cs_foundation": "The deep theoretical computer science or hardware primitive underpinning this lesson.",
  "ai_convergence": "How this concept directly connects to modern AI systems, LLM tokenization, tensor memory, or agent architectures.",
  "xp_reward": 100,
  "handbook_markdown": "# Detailed Markdown Handbook (At least 700-1200 words with sections: 1. Architectural Motivation & Mental Model, 2. Deep Technical Mechanics & Memory Layout, 3. Real-World Production Failure Modes, 4. Architectural Trade-offs & Invariants, 5. Verification & Mastery Walkthrough)",
  "starter_code": {{
    "solution.py": "# Complete, executable Python 3 template with docstrings, type hints, and # TODO comments for the student"
  }},
  "test_suite": {{
    "tests.py": "# Uncompromising test assertions testing base cases, large inputs, edge cases, and failure modes using pure assert statements and clean terminal output"
  }},
  "defense_prompts": [
    "Socratic architectural question testing whether the student truly understands why this code works",
    "Edge case challenge asking how this behaves when memory or concurrency boundaries are stressed"
  ]
}}"""

    payload = {
        "model": MODEL_NAME,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "response_format": {"type": "json_object"},
        "max_tokens": 3500,
        "temperature": 0.2
    }

    req = urllib.request.Request(
        GATEWAY_URL,
        headers={
            "Authorization": f"Bearer {KILO_API_KEY}",
            "Content-Type": "application/json"
        },
        data=json.dumps(payload).encode(),
        method="POST"
    )

    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                res = json.loads(resp.read().decode())
                content = res["choices"][0]["message"]["content"]
                # Clean up if model added markdown fences
                content = re.sub(r"^```json\s*", "", content.strip())
                content = re.sub(r"\s*```$", "", content.strip())
                return json.loads(content)
        except Exception as e:
            print(f"      [Retry {attempt+1}/4] Kilo Gateway Error: {e}")
            time.sleep(3 * (attempt + 1))
    return None

def update_supabase(node_id, data):
    """Updates curriculum_nodes in Supabase with verified handbook and code."""
    url = f"{SUPABASE_URL}/rest/v1/curriculum_nodes?id=eq.{node_id}"
    req = urllib.request.Request(
        url,
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        },
        data=json.dumps({
            "subtitle": data.get("subtitle"),
            "cs_foundation": data.get("cs_foundation"),
            "ai_convergence": data.get("ai_convergence"),
            "xp_reward": data.get("xp_reward", 100),
            "handbook_markdown": data.get("handbook_markdown"),
            "starter_code": data.get("starter_code"),
            "test_suite": data.get("test_suite"),
            "defense_prompts": data.get("defense_prompts")
        }).encode(),
        method="PATCH"
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.status

def main():
    print("=" * 60)
    print("AI-Native LMS: Lesson Content Population Engine")
    print(f"Model:   {MODEL_NAME} via Kilo Gateway")
    print(f"Target:  {SUPABASE_URL}")
    print("=" * 60)

    lessons = parse_curriculum()
    print(f"Loaded {len(lessons)} lessons from manifest.\n")

    success_count = 0
    for i, lesson in enumerate(lessons):
        p_num = lesson.get("phase_number")
        l_num = lesson.get("lesson_number")
        node_id = f"node-{p_num}-{l_num}"
        title = lesson.get("title")

        print(f"[{i+1}/{len(lessons)}] Generating: {node_id} ({title})...")
        generated = generate_lesson_payload(lesson)
        if generated and "handbook_markdown" in generated:
            status = update_supabase(node_id, generated)
            hb_len = len(generated.get("handbook_markdown", ""))
            print(f"   ✓ Updated Supabase ({hb_len} chars handbook, HTTP {status})")
            success_count += 1
        else:
            print(f"   ✗ Generation failed for {node_id}")

        # Sleep briefly to pace API calls
        time.sleep(2)

    print(f"\nCompleted! {success_count}/{len(lessons)} lessons fully populated.")

if __name__ == "__main__":
    main()
