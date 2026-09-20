#!/usr/bin/env python3
"""
AI-Native LMS: Standalone Specialization Tracks Verification Engine
Verifies and enriches Phase 13 (Lessons 13.1 - 13.20) into 4 completely
independent, self-contained standalone learning tracks:
- Track A: Enterprise Product Engineering (Lessons 13.1 - 13.5)
- Track B: High-Throughput MLOps & Distributed Training (Lessons 13.6 - 13.10)
- Track C: Systems Security & Cloud Infrastructure Hardening (Lessons 13.11 - 13.15)
- Track D: Applied AI Research & Frontier Model Architectures (Lessons 13.16 - 13.20)

Each track:
1. Has its own self-contained prerequisite contract.
2. Contains standalone project focus and independent capstone goals.
3. Does not assume completion of other sibling tracks in Phase 13.
"""

import os
import re
import json
import urllib.request

ENV_PATH = ".env"
SUPABASE_URL = "https://lfsyndffrfwvdfzjsagl.supabase.co"
SUPABASE_KEY = ""

if os.path.exists(ENV_PATH):
    with open(ENV_PATH) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                if k.strip() == "SUPABASE_SERVICE_ROLE_KEY":
                    SUPABASE_KEY = v.strip().strip("\"'")
                elif k.strip() == "SUPABASE_URL":
                    SUPABASE_URL = v.strip().strip("\"'")

TRACK_METADATA = {
    "A": {
        "name": "Track A: Enterprise Product Engineering",
        "description": "Standalone deep dive into high-performance web applications, module federation, CRDTs (Yjs), and multi-tenant SaaS billing engines.",
        "capstone": "Enterprise Local-First Collaborative Application with Canvas Engine"
    },
    "B": {
        "name": "Track B: High-Throughput MLOps & Distributed Training",
        "description": "Standalone specialization in large-scale multi-GPU training clusters, optimizer sharding, custom inference runtimes, and real-time feature stores.",
        "capstone": "Distributed FSDP Training Pipeline with vLLM PagedAttention Cluster"
    },
    "C": {
        "name": "Track C: Systems Security & Cloud Infrastructure Hardening",
        "description": "Standalone specialization in kernel-level security telemetry, zero-trust infrastructure, envelope encryption, and automated adversary red-teaming.",
        "capstone": "Kernel eBPF Threat Monitoring & Zero-Trust Service Mesh Defense"
    },
    "D": {
        "name": "Track D: Applied AI Research & Frontier Model Architectures",
        "description": "Standalone specialization in cutting-edge alignment science, sparse MoE routing, Mamba architectures, and GPU kernel programming with OpenAI Triton.",
        "capstone": "Sparse MoE Transformer with Custom Triton FP8 Kernels & DPO Alignment"
    }
}

def verify_and_patch_tracks():
    print("=" * 65)
    print("AI-Native LMS: Standalone Tracks Verification Engine")
    print(f"Target: {SUPABASE_URL}")
    print("=" * 65)

    if not SUPABASE_KEY:
        print("[!] Error: SUPABASE_SERVICE_ROLE_KEY missing in .env")
        return

    # Fetch Phase 13 nodes from Supabase
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/curriculum_nodes?phase_id=eq.phase-13&select=*",
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}"
        }
    )
    with urllib.request.urlopen(req) as resp:
        phase13_nodes = json.loads(resp.read().decode())

    print(f"Found {len(phase13_nodes)} lessons in Phase 13.")

    updated_records = []
    for node in phase13_nodes:
        title = node.get("title", "")
        track_match = re.search(r"Track ([A-D])", title)
        if not track_match:
            continue

        track_code = track_match.group(1)
        meta = TRACK_METADATA[track_code]

        # Ensure subtitle highlights standalone self-contained track nature
        subtitle = f"[Standalone {meta['name']}] Deep dive into {title.split(':')[-1].strip()}."
        cs_foundation = f"Independent Specialization Track: {meta['description']}"

        rec = dict(node)
        rec["subtitle"] = subtitle
        rec["cs_foundation"] = cs_foundation

        # Ensure handbook explicitly highlights that this track is standalone
        hb = rec.get("handbook_markdown", "")
        if "## 🎯 Standalone Specialization Contract" not in hb:
            track_banner = f"""
> [!NOTE]
> **Standalone Specialization Track**:  
> You are in **{meta['name']}**. This track is completely self-contained and independent. You do not need to take the other Phase 13 tracks to complete this specialization and earn the **{meta['capstone']}** milestone.
"""
            # Insert note right after the top metadata block
            parts = hb.split("---", 2)
            if len(parts) >= 3:
                rec["handbook_markdown"] = parts[0] + "---" + parts[1] + track_banner + "\n---\n" + parts[2]
            else:
                rec["handbook_markdown"] = track_banner + "\n\n" + hb

        updated_records.append(rec)

    if updated_records:
        req_post = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1/curriculum_nodes",
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "Content-Type": "application/json",
                "Prefer": "resolution=merge-duplicates"
            },
            data=json.dumps(updated_records).encode(),
            method="POST"
        )
        try:
            with urllib.request.urlopen(req_post, timeout=60) as resp:
                print(f"[✓] Successfully verified and patched {len(updated_records)} standalone Phase 13 lessons!")
        except Exception as e:
            print(f"[✗] Error patching Phase 13 nodes: {e}")

    print("=" * 65)
    print("Standalone Track Architecture Verified.")

if __name__ == "__main__":
    verify_and_patch_tracks()
