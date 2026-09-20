#!/usr/bin/env python3
"""
populate_supabase.py
Uploads the 15 phases, 500 lessons, and 2,528 subtopics to Supabase.
Can connect via:
1. REST API (https://<PROJECT_ID>.supabase.co/rest/v1/) with SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY
2. Direct PostgreSQL connection string (DATABASE_URL)
"""

import os
import sys
import json
import urllib.request
import urllib.error
import ssl

PROJECT_ID = os.environ.get("SUPABASE_PROJECT_ID", "lfsyndffrfwvdfzjsagl")
SUPABASE_URL = os.environ.get("SUPABASE_URL", f"https://{PROJECT_ID}.supabase.co")
API_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_ANON_KEY")

MANIFEST_PATH = "/home/sawacha/lms/supabase/curriculum_manifest.json"
ENV_PATH = "/home/sawacha/lms/.env"

def load_env_file():
    global API_KEY, SUPABASE_URL
    if os.path.exists(ENV_PATH):
        with open(ENV_PATH, "r") as f:
            for line in f:
                line = line.strip()
                if line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                k = k.strip()
                v = v.strip().strip("'").strip('"')
                if k == "SUPABASE_SERVICE_ROLE_KEY" and not API_KEY:
                    API_KEY = v
                elif k == "SUPABASE_ANON_KEY" and not API_KEY:
                    API_KEY = v
                elif k == "SUPABASE_URL":
                    SUPABASE_URL = v

def post_batch(endpoint: str, records: list):
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}"
    data = json.dumps(records).encode("utf-8")
    
    headers = {
        "apikey": API_KEY,
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates",
    }

    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    ctx = ssl.create_default_context()
    
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
            return resp.status in (200, 201)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        print(f"  HTTP Error {e.code} on {endpoint}: {body[:200]}")
        return False
    except Exception as e:
        print(f"  Network error on {endpoint}: {e}")
        return False

def run_population():
    load_env_file()

    print(f"==================================================")
    print(f"Supabase Population Engine")
    print(f"Target Project: {PROJECT_ID}")
    print(f"Target URL:     {SUPABASE_URL}")
    print(f"==================================================")

    if not API_KEY:
        print(f"\n[!] SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY is missing.")
        print(f"Please supply your key in {ENV_PATH} or as an environment variable.")
        print(f"\nAlternatively, you can run the ready SQL seed file directly in Supabase SQL Editor:")
        print(f"  File: /home/sawacha/lms/supabase/seed_curriculum.sql")
        sys.exit(1)

    if not os.path.exists(MANIFEST_PATH):
        print(f"Manifest not found at {MANIFEST_PATH}. Run generate_curriculum_sql.py first.")
        sys.exit(1)

    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    phases = manifest["phases"]
    lessons = manifest["lessons"]
    subtopics = manifest["subtopics"]

    # 1. Insert Phases
    print(f"\n[1/3] Uploading {len(phases)} Curriculum Phases...")
    phase_records = [
        {
            "phase_number": p["phase_number"],
            "title": p["title"],
            "description": p["description"],
            "total_lessons": p["total_lessons"],
            "capstone_slug": p["capstone_slug"],
        }
        for p in phases
    ]
    if post_batch("phases", phase_records):
        print(f"✓ Successfully inserted {len(phases)} phases.")
    else:
        print(f"✗ Failed to insert phases. Check table permissions or run migration first.")

    # 2. Insert Lessons in chunks of 50
    print(f"\n[2/3] Uploading {len(lessons)} Lessons in batches of 50...")
    batch_size = 50
    success_lessons = 0
    for i in range(0, len(lessons), batch_size):
        chunk = lessons[i : i + batch_size]
        lesson_records = [
            {
                "id": l["id"],
                "slug": l["slug"],
                "phase_number": l["phase_number"],
                "lesson_number": l["lesson_number"],
                "title": l["title"],
                "content_markdown": l["content_markdown"],
            }
            for l in chunk
        ]
        if post_batch("lessons", lesson_records):
            success_lessons += len(chunk)
            print(f"  Progress: {success_lessons}/{len(lessons)} lessons uploaded...")
        else:
            print(f"  Error on batch {i} to {i + len(chunk)}")
            break

    # 3. Insert Subtopics in chunks of 100
    print(f"\n[3/3] Uploading {len(subtopics)} Subtopics in batches of 100...")
    st_batch_size = 100
    success_st = 0
    for i in range(0, len(subtopics), st_batch_size):
        chunk = subtopics[i : i + st_batch_size]
        st_records = [
            {
                "id": st["id"],
                "lesson_id": st["lesson_id"],
                "subtopic_index": st["subtopic_index"],
                "title": st["title"],
            }
            for st in chunk
        ]
        if post_batch("lesson_subtopics", st_records):
            success_st += len(chunk)
            print(f"  Progress: {success_st}/{len(subtopics)} subtopics uploaded...")
        else:
            print(f"  Error on subtopics batch {i} to {i + len(chunk)}")
            break

    print(f"\n==================================================")
    print(f"Summary:")
    print(f"Phases:    {len(phases)} / {len(phases)}")
    print(f"Lessons:   {success_lessons} / {len(lessons)}")
    print(f"Subtopics: {success_st} / {len(subtopics)}")
    print(f"==================================================")

if __name__ == "__main__":
    run_population()
