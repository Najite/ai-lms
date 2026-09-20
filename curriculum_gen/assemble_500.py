# assemble_500.py
import re
import gen_preamble
import gen_phase0_1
import gen_phase2_3
import gen_phase4_5
import gen_phase6_7
import gen_phase8_9
import gen_phase10_11
import gen_phase12_14

def get_assembled_curriculum():
    sections = []
    
    # 1. Preamble
    sections.append(gen_preamble.get_preamble().strip())
    
    # 2. Phase 0 & 1 (80 lessons: 30 + 50)
    sections.append(gen_phase0_1.get_content().strip())
    
    # 3. Phase 2 & 3 (80 lessons: 35 + 45)
    sections.append(gen_phase2_3.get_content().strip())
    
    # 4. Phase 4 & 5 (80 lessons: 35 + 45)
    # Parse Phase 4 & 5 from gen_phase4_5
    p4_5_raw = gen_phase4_5.get_content()
    # Phase 4 header to projects
    p4_match = re.search(r"(## Phase 4:.*?)(?=### Phase 4 Project)", p4_5_raw, re.DOTALL)
    p4_projects = re.search(r"(### Phase 4 Project.*?)(?=## Phase 5:)", p4_5_raw, re.DOTALL)
    p5_match = re.search(r"(## Phase 5:.*?)(?=### Phase 5 Projects)", p4_5_raw, re.DOTALL)
    p5_projects = re.search(r"(### Phase 5 Projects.*)", p4_5_raw, re.DOTALL)
    
    if p4_match and p4_projects and p5_match and p5_projects:
        # Extract lessons from p4
        p4_text = p4_match.group(1)
        p4_lessons = re.findall(r"(#### Lesson 4\.\d+:.*?)(?=(?:#### Lesson 4\.\d+:|\Z))", p4_text, re.DOTALL)
        # Select first 35 lessons
        p4_header = p4_text.split("#### Lesson 4.1:")[0]
        p4_header = re.sub(r"40 Lessons \(Lesson 4\.1 to Lesson 4\.40\)", "35 Lessons (Lesson 4.1 to Lesson 4.35)", p4_header)
        p4_header = re.sub(r"Lessons 4\.1 – 4\.40", "Lessons 4.1 – 4.35", p4_header)
        p4_assembled = p4_header + "".join(p4_lessons[:35]) + p4_projects.group(1).strip()
        sections.append(p4_assembled.strip())
        
        # Extract lessons from p5
        p5_text = p5_match.group(1)
        p5_lessons = re.findall(r"(#### Lesson 5\.\d+:.*?)(?=(?:#### Lesson 5\.\d+:|\Z))", p5_text, re.DOTALL)
        # Select first 45 lessons
        p5_header = p5_text.split("#### Lesson 5.1:")[0]
        p5_header = re.sub(r"50 Lessons \(Lesson 5\.1 to Lesson 5\.50\)", "45 Lessons (Lesson 5.1 to Lesson 5.45)", p5_header)
        p5_header = re.sub(r"Lessons 5\.1 – 5\.50", "Lessons 5.1 – 5.45", p5_header)
        p5_assembled = p5_header + "".join(p5_lessons[:45]) + p5_projects.group(1).strip()
        sections.append(p5_assembled.strip())
    else:
        sections.append(p4_5_raw.strip())
        
    # 5. Phase 6 (40 lessons) & Phase 7 (35 lessons)
    p6_raw = gen_phase6_7.generate_phase6()
    p6_header = p6_raw.split("#### Lesson 6.1:")[0]
    p6_header = re.sub(r"Lessons 6\.1 – 6\.45", "Lessons 6.1 – 6.40", p6_header)
    p6_lessons = re.findall(r"(#### Lesson 6\.\d+:.*?)(?=(?:#### Lesson 6\.\d+:|\Z|### Phase 6 Capstone Deliverables))", p6_raw, re.DOTALL)
    p6_footer = p6_raw[p6_raw.find("### Phase 6 Capstone Deliverables"):]
    sections.append((p6_header + "".join(p6_lessons[:40]) + p6_footer).strip())
    
    p7_raw = gen_phase6_7.generate_phase7()
    p7_header = p7_raw.split("#### Lesson 7.1:")[0]
    p7_header = re.sub(r"Lessons 7\.1 – 7\.40", "Lessons 7.1 – 7.35", p7_header)
    p7_lessons = re.findall(r"(#### Lesson 7\.\d+:.*?)(?=(?:#### Lesson 7\.\d+:|\Z|### Phase 7 Capstone Deliverables))", p7_raw, re.DOTALL)
    p7_footer = p7_raw[p7_raw.find("### Phase 7 Capstone Deliverables"):]
    # For Phase 7, take 1-34 and lesson 39 (LitmusChaos renamed to 7.35)
    lesson_35 = p7_lessons[38] # lesson 7.39 (0-indexed 38 is lesson 39)
    lesson_35 = re.sub(r"#### Lesson 7\.39:", "#### Lesson 7.35:", lesson_35)
    lesson_35 = re.sub(r"`7\.39\.", "`7.35.", lesson_35)
    p7_selected = p7_lessons[:34] + [lesson_35]
    sections.append((p7_header + "".join(p7_selected) + p7_footer).strip())
    
    # 6. Phase 8 (25 lessons) & Phase 9 (35 lessons)
    p8_raw = gen_phase8_9.generate_phase8()
    p8_header = p8_raw.split("#### Lesson 8.1:")[0]
    p8_header = re.sub(r"Lessons 8\.1 – 8\.30", "Lessons 8.1 – 8.25", p8_header)
    p8_lessons = re.findall(r"(#### Lesson 8\.\d+:.*?)(?=(?:#### Lesson 8\.\d+:|\Z|### Phase 8 Capstone Deliverables))", p8_raw, re.DOTALL)
    p8_footer = p8_raw[p8_raw.find("### Phase 8 Capstone Deliverables"):]
    sections.append((p8_header + "".join(p8_lessons[:25]) + p8_footer).strip())
    
    p9_raw = gen_phase8_9.generate_phase9()
    p9_header = p9_raw.split("#### Lesson 9.1:")[0]
    p9_header = re.sub(r"Lessons 9\.1 – 9\.40", "Lessons 9.1 – 9.35", p9_header)
    p9_lessons = re.findall(r"(#### Lesson 9\.\d+:.*?)(?=(?:#### Lesson 9\.\d+:|\Z|### Phase 9 Capstone Deliverables))", p9_raw, re.DOTALL)
    p9_footer = p9_raw[p9_raw.find("### Phase 9 Capstone Deliverables"):]
    sections.append((p9_header + "".join(p9_lessons[:35]) + p9_footer).strip())
    
    # 7. Phase 10 (35 lessons) & Phase 11 (25 lessons)
    p10_raw = gen_phase10_11.generate_phase10()
    p10_header = p10_raw.split("#### Lesson 10.1:")[0]
    p10_header = re.sub(r"Lessons 10\.1 – 10\.40", "Lessons 10.1 – 10.35", p10_header)
    p10_lessons = re.findall(r"(#### Lesson 10\.\d+:.*?)(?=(?:#### Lesson 10\.\d+:|\Z|### Phase 10 Capstone Deliverables))", p10_raw, re.DOTALL)
    p10_footer = p10_raw[p10_raw.find("### Phase 10 Capstone Deliverables"):]
    sections.append((p10_header + "".join(p10_lessons[:35]) + p10_footer).strip())
    
    p11_raw = gen_phase10_11.generate_phase11()
    p11_header = p11_raw.split("#### Lesson 11.1:")[0]
    p11_header = re.sub(r"Lessons 11\.1 – 11\.30", "Lessons 11.1 – 11.25", p11_header)
    p11_lessons = re.findall(r"(#### Lesson 11\.\d+:.*?)(?=(?:#### Lesson 11\.\d+:|\Z|### Phase 11 Capstone Deliverables))", p11_raw, re.DOTALL)
    p11_footer = p11_raw[p11_raw.find("### Phase 11 Capstone Deliverables"):]
    sections.append((p11_header + "".join(p11_lessons[:25]) + p11_footer).strip())
    
    # 8. Phase 12 (30 lessons), Phase 13 (20 lessons), Phase 14 (15 lessons)
    p12_raw = gen_phase12_14.generate_phase12()
    sections.append(p12_raw.strip())
    
    p13_raw = gen_phase12_14.generate_phase13()
    sections.append(p13_raw.strip())
    
    p14_raw = gen_phase12_14.generate_phase14()
    sections.append(p14_raw.strip())
    
    # Master appendix section
    appendices = """
---

## Appendix A: Master Index of All 22 Projects

| # | Project Name | Phase | Type | Technology Stack | Core Engineering Deliverable |
|---|---|---|---|---|---|
| **1** | **SysTrace** | Phase 0 | Systems Tool | C / Python | System call tracer, virtual memory address mapper, and process hierarchy inspector |
| **2** | **LoxLang** | Phase 1 | Compiler / Runtime | Python | Full tree-walk interpreter for Lox (lexing, recursive descent parser, AST, environment, closures) |
| **3** | **TypeTrace** | Phase 1 | Static Analysis Tool | Python (`mypy`, `ast`) | Static type checker, type inference engine, and custom linter with strict type guards |
| **4** | **DevAudit** | Phase 1 | Code Quality Engine | Python | Automated SOLID & design pattern audit tool parsing ASTs to detect code smells |
| **5** | **MathKit** | Phase 2 | Numerical Library | Python (`numpy`, `hypothesis`) | Numerical linear algebra, statistics, vector calculus, and Adam optimizer from scratch |
| **6** | **DataSift** | Phase 3 | Algorithmic Library | Python (`pytest-benchmark`) | Cache-conscious data structures, SkipLists, LRU/LFU caches, graph algorithms, and Top-K streams |
| **7** | **NanoHTTP** | Phase 4 | High-Performance Server | C / Python (Raw Sockets) | Raw socket HTTP/1.1 server, `epoll` asynchronous multiplexer, and static file streaming engine |
| **8** | **SchemaVault** | Phase 5 | Database Migration CLI | Python (`psycopg2`) | Transactional database migration engine with distributed advisory locks and state verification |
| **9** | **CacheKit** | Phase 5 | Distributed Caching | Python (Redis) | Caching patterns library (Cache-Aside with XFetch stampede protection, Token Bucket rate limiting) |
| **10** | **AuthForge** | Phase 5 | Identity Microservice | FastAPI, gRPC, PostgreSQL, Redis | Dual-protocol auth service (JWT with Redis revocation, OAuth2/PKCE, RBAC, gRPC health probes) |
| **11** | **CompKit** | Phase 6 | Production Design System | React, TypeScript, Radix, Tailwind | Production-ready, fully accessible (WCAG 2.2 AAA compliant) headless UI component library |
| **12** | **TenantIQ** | Phase 6 | Multi-Tenant SaaS App | Next.js App Router, RSC, Stripe | Multi-tenant SaaS frontend with Server Actions, real-time SSE streaming, and Playwright E2E suites |
| **13** | **InfraBlueprint** | Phase 7 | Multi-Region Cloud IaC | Terraform, GKE, Kafka, Cilium | Multi-region private GKE platform with Terraform, Kafka KRaft, ESO, and LitmusChaos resilience |
| **14** | **10 System Portfolios** | Phase 8 | Architecture Portfolio | Markdown, Mermaid, ADRs | 10 canonical production architecture specifications with back-of-the-envelope capacity models |
| **15** | **GradFlow** | Phase 9 | Deep Learning Engine | Pure Python / NumPy | Lightweight autograd engine with topological sorting, broadcasting, VJPs, modules, and AdamW |
| **16** | **TransformerLab** | Phase 9 | LLM From Scratch | PyTorch | Decoder-only autoregressive transformer language model with RoPE, RMSNorm, and KV-cache generation |
| **17** | **EvalKit** | Phase 10 | RAG Evaluation Suite | Python (`ragas`, `hypothesis`) | Production RAG evaluation library with RAG Triad metrics, synthetic testsets, and Cohen's Kappa |
| **18** | **DocuMind** | Phase 10 | Enterprise Hybrid RAG | PostgreSQL/pgvector, BM25, Cohere | End-to-end hybrid RAG engine with layout parsing, RRF fusion, cross-encoder re-ranking, and OTel |
| **19** | **ModelPulse** | Phase 11 | Production MLOps & Profiler | Python (`py-spy`, `memray`, `k6`) | Automated performance profiling, memory leak detection, distributed k6 stress tests, and Flagger canaries |
| **20** | **CodeAgent** | Phase 12 | Autonomous Software Agent | LangGraph, PostgreSQL, Docker | Autonomous software engineering agent with durable checkpointing, Tree-sitter AST, and TDD loop |
| **21** | **Track Capstone** | Phase 13 | Advanced Specialization | Track Specific (A/B/C/D) | Deep specialization capstone (Micro-frontends, FSDP MLOps, eBPF Security, or Frontier AI Research) |
| **22** | **Enterprise Capstone**| Phase 14 | Unified AI-Native Platform | Full Production Stack | The ultimate enterprise multi-tenant, autonomous AI-native SaaS system defended live before staff engineers |

---

## Appendix B: State Tracking Invariant & Integrity Verification

Every lesson in this curriculum follows the strict 4-attribute execution contract:
1. **Explicit Prerequisites**: No lesson may introduce a concept that has not been explicitly covered in a previous lesson.
2. **Trackable Subtopics**: 4 to 6 numbered, atomic subtopics per lesson detailing low-level implementation mechanics.
3. **Key Failure Modes & Edge Cases**: Concrete technical breakdown of edge cases, memory leaks, security exploits, or concurrency bugs.
4. **Verification & Mastery Check**: Demonstrable coding challenges, test suites, or formal derivations required to certify completion.
"""
    sections.append(appendices.strip())
    
    return "\n\n".join(sections) + "\n"

if __name__ == "__main__":
    content = get_assembled_curriculum()
    lesson_count = content.count("#### Lesson ")
    print(f"Total Assembled Lessons: {lesson_count}")
    
    # Audit per phase
    for p in range(15):
        p_count = len(re.findall(rf"#### Lesson {p}\.\d+:", content))
        print(f"Phase {p}: {p_count} lessons")
        
    with open("/home/sawacha/lms/curriculum.md", "w", encoding="utf-8") as f:
        f.write(content)
        
    print("Successfully wrote 500 lessons to /home/sawacha/lms/curriculum.md")
