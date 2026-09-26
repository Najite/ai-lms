#!/usr/bin/env python3
"""
Patch script for Lessons 1.36 through 1.50 (node-0-36 to node-0-50).
Applies:
- Single-topic real-world mental models.
- Step-by-step guides and common beginner pitfalls.
- 3-part exercise briefings: exercise_about, exercise_goal, expected_output outside code.
- Clean starter code with guided # TODOs.
- Robust unit tests in test_suite['tests.py'].
"""

import os
import json
import urllib.request
import ssl

ENV_PATH = "/home/sawacha/lms/.env"
API_KEY = None
SUPABASE_URL = None

if os.path.exists(ENV_PATH):
    with open(ENV_PATH, "r") as f:
        for line in f:
            line = line.strip()
            if line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            k, v = k.strip(), v.strip().strip("'").strip('"')
            if k == "SUPABASE_SERVICE_ROLE_KEY" and not API_KEY:
                API_KEY = v
            elif k == "SUPABASE_ANON_KEY" and not API_KEY:
                API_KEY = v
            elif k == "NEXT_PUBLIC_SUPABASE_URL" and not SUPABASE_URL:
                SUPABASE_URL = v
            elif k == "SUPABASE_URL" and not SUPABASE_URL:
                SUPABASE_URL = v

if not API_KEY or not SUPABASE_URL:
    raise RuntimeError("Missing Supabase credentials")

LESSONS_36_50 = {
    # --------------------------------------------------------------------------
    # LESSON 1.36: Clean Code, Formatting & Linting
    # --------------------------------------------------------------------------
    "node-0-36": {
        "title": "Lesson 1.36: Clean Code, PEP 8 & Automated Linting",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 36 of 50",
        "cs_foundation": "PEP 8 Style Guide, Readable Naming Conventions, Single Responsibility, and Ruff/Black",
        "ai_convergence": "Real-World Engineering: Refactoring Tangled Functions into Clean Modular Code",
        "handbook_markdown": """# Lesson 1.36: Clean Code, PEP 8 & Automated Linting

Code is read far more often than it is written. Writing **clean, Pythonic code** adhering to the PEP 8 standard ensures that other software engineers (and your future self) can easily understand and maintain your work.

---

## 💡 The Real-World Mental Model: A Well-Organized Workshop

- **Messy Code**: Screwdrivers tossed into paint cans, unlabeled mystery jars, and wires crisscrossing the floor. Every task takes 10x longer because you have to untangle the mess first.
- **Clean Code (PEP 8)**: Standardized, labeled tool racks where every single tool has a predictable spot and purpose. Anyone walking into the workshop can immediately get to work.

```python
# Unclean:
def f(x,y):
    z=x*0.08
    return x+z+y

# Clean & Pythonic:
def calculate_order_total(subtotal: float, shipping_fee: float, tax_rate: float = 0.08) -> float:
    tax_amount = subtotal * tax_rate
    return round(subtotal + tax_amount + shipping_fee, 2)
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Key PEP 8 Principles
- **Variable Names**: `snake_case` (e.g. `order_subtotal`, `is_active`).
- **Constant Names**: `UPPER_SNAKE_CASE` (e.g. `MAX_RETRY_COUNT = 3`).
- **Function Names**: Verbs indicating actions (`calculate_tax`, `validate_order`).
- **Single Responsibility Principle**: A function should do one thing and do it well.

---

## 🛠️ Step-by-Step Exercise Guide

Implement `sanitize_identifier(raw_name: str) -> str`:

1. **Input**: A messy string name like `"  Order Total (USD)  "`.
2. **Transform**:
   - Strip leading/trailing whitespace and convert to lowercase.
   - Replace any spaces, hyphens, and parentheses with underscores `_`.
   - Remove consecutive duplicate underscores so `"order___total"` becomes `"order_total"`.
   - Strip any leading or trailing underscores.
3. **Return**: The cleaned `snake_case` identifier string.

---

## ⚠️ Common Pitfalls

- **Single-letter variable names**: Avoid using `x`, `temp`, `data2` for important business values; use explicit descriptive names.
""",
        "starter_code": {
            "solution.py": """import re

def sanitize_identifier(raw_name: str) -> str:
    \"\"\"
    Converts a messy input name into a clean, PEP 8 compliant snake_case identifier.
    \"\"\"
    # TODO: Clean, lowercase, replace non-alphanumeric chars with _, and clean up underscores
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Schema migration tools sanitize human-entered column names into valid, clean snake_case database identifiers.",
            "exercise_goal": "Implement sanitize_identifier(raw_name) returning clean snake_case identifier string.",
            "expected_output": "sanitize_identifier('  Customer First Name (Billing)  ') -> 'customer_first_name_billing'",
            "failure_mode": "Leaving spaces, uppercase letters, or consecutive underscores in output.",
            "verification_criteria": "Function converts dirty strings into valid snake_case names.",
            "tests.py": """from solution import sanitize_identifier

def test_clean_code():
    assert sanitize_identifier("  User First Name  ") == "user_first_name"
    assert sanitize_identifier("Order-ID (2026)") == "order_id_2026"
    assert sanitize_identifier("___Item__Price___") == "item_price"

    print("✓ All assertions passed for Lesson 1.36: Clean Code & Naming")

if __name__ == '__main__':
    test_clean_code()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.37: HTTP Requests with HTTPX
    # --------------------------------------------------------------------------
    "node-0-37": {
        "title": "Lesson 1.37: HTTP Requests & Web APIs with HTTPX",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 37 of 50",
        "cs_foundation": "HTTP Protocols, REST Methods (GET, POST), Headers, Status Codes, and httpx.Client",
        "ai_convergence": "Real-World Engineering: Fetching Weather Data & Sending Orders to Shipping Web APIs",
        "handbook_markdown": """# Lesson 1.37: HTTP Requests & Web APIs with HTTPX

Modern software connects to external web services over the internet using **HTTP (Hypertext Transfer Protocol)**.

Python's **`httpx`** library provides a modern, fast HTTP client for sending `GET` requests (to fetch data) and `POST` requests (to submit data) with JSON payloads and authentication headers.

---

## 💡 The Real-World Mental Model: A Restaurant Waiter

- **The Client (You)**: Sitting at the table reviewing the menu.
- **The HTTP Request**: You hand your order ticket to the waiter with your table number (**Headers**) and meal choice (**JSON Payload**).
- **The Server (The Kitchen)**: Cooks the food.
- **The HTTP Response**: The waiter returns with the meal (**Response Body**) and a receipt confirmation (**Status Code 200 OK**).

```
GET  https://api.store.com/products/101  -> Fetches product #101
POST https://api.store.com/checkout      -> Submits new cart order payload
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. HTTP Status Codes
- **200 OK**: Request succeeded.
- **201 Created**: Resource created successfully.
- **400 Bad Request**: Malformed payload or missing parameters.
- **404 Not Found**: Endpoint or resource does not exist.
- **500 Internal Server Error**: Remote server encountered a crash.

---

## 🛠️ Step-by-Step Exercise Guide

Implement `build_http_request_payload(endpoint: str, api_key: str, data: dict) -> dict`:

1. **Parameters**:
   - `endpoint`: URL path string (e.g. `"/v1/orders"`).
   - `api_key`: Secret authorization token.
   - `data`: Payload dictionary.
2. **Build Request Spec**:
   - Headers: `{"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}`.
   - Method: `"POST"`.
   - URL: `f"https://api.gateway.com{endpoint}"`.
   - Body: `json.dumps(data)`.
3. **Return**: A dictionary containing `"method"`, `"url"`, `"headers"`, and `"body"`.

---

## ⚠️ Common Pitfalls

- **Missing Bearer prefix**: Many modern APIs require the `Bearer ` keyword in the `Authorization` header.
""",
        "starter_code": {
            "solution.py": """import json

def build_http_request_payload(endpoint: str, api_key: str, data: dict) -> dict:
    \"\"\"
    Constructs a standardized HTTP POST request specification dictionary.
    \"\"\"
    # TODO: Build and return dict with method, url, headers (Bearer token), and serialized body
    pass
"""
        },
        "test_suite": {
            "exercise_about": "API gateways format standardized HTTP request headers and serialized payloads before dispatching calls across network boundaries.",
            "exercise_goal": "Implement build_http_request_payload(endpoint, api_key, data) returning complete HTTP request specification dictionary.",
            "expected_output": "build_http_request_payload('/orders', 'key123', {'id': 1}) ->\n{'method': 'POST', 'url': 'https://api.gateway.com/orders', 'headers': {'Authorization': 'Bearer key123', 'Content-Type': 'application/json'}, 'body': '{\"id\": 1}'}",
            "failure_mode": "Missing Bearer token or invalid URL concatenation.",
            "verification_criteria": "Function returns complete request dictionary matching HTTP standards.",
            "tests.py": """import json
from solution import build_http_request_payload

def test_http_payload():
    payload = build_http_request_payload("/v1/charge", "sec_token_999", {"amount": 45.0})
    assert payload["method"] == "POST"
    assert payload["url"] == "https://api.gateway.com/v1/charge"
    assert payload["headers"]["Authorization"] == "Bearer sec_token_999"
    assert json.loads(payload["body"]) == {"amount": 45.0}

    print("✓ All assertions passed for Lesson 1.37: HTTP Requests & HTTPX")

if __name__ == '__main__':
    test_http_payload()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.38: Exponential Backoff & Retry Logic
    # --------------------------------------------------------------------------
    "node-0-38": {
        "title": "Lesson 1.38: Exponential Backoff & Resilient Retry Logic",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 38 of 50",
        "cs_foundation": "Network Resilience, Transient Failures, Exponential Backoff (2^attempt), and Jitter",
        "ai_convergence": "Real-World Engineering: Retrying Transient Payment Failures Without Overloading Servers",
        "handbook_markdown": """# Lesson 1.38: Exponential Backoff & Resilient Retry Logic

Network calls fail unexpectedly all the time: a momentary Wi-Fi glitch, server congestion, or rate limits.

If 1,000 users immediately retry a failed request at the exact same instant, they crash the server in a **retry storm**. **Exponential backoff** progressively doubles the wait delay between attempts (`1s`, `2s`, `4s`, `8s`), allowing servers to recover gracefully.

---

## 💡 The Real-World Mental Model: Knocking on a Busy Office Door

- **Hammering the Door (No Backoff)**: Knocking continuously 100 times a second. You distract the person inside and guarantee they can never finish their work.
- **Exponential Backoff**: Knock once. If no answer, wait 1 minute. If still no answer, wait 2 minutes, then 4 minutes. You give the person breathing room to finish their task.

```
Attempt 1: Immediate
Attempt 2: Wait base_delay * (2 ^ 0) = 1.0s
Attempt 3: Wait base_delay * (2 ^ 1) = 2.0s
Attempt 4: Wait base_delay * (2 ^ 2) = 4.0s
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. The Exponential Delay Formula
```python
def get_backoff_delay(attempt: int, base_delay: float = 1.0, max_delay: float = 60.0) -> float:
    delay = base_delay * (2 ** (attempt - 1))
    return min(delay, max_delay)
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `calculate_retry_schedule(max_attempts: int, base_delay: float = 1.0, max_delay: float = 30.0) -> list[float]`:

1. **Parameters**: `max_attempts` (e.g. 4), `base_delay` (e.g. 1.0), `max_delay` (e.g. 30.0).
2. **Calculate Delays**:
   - For attempt numbers `1` through `max_attempts`:
     - `delay = base_delay * (2 ** (attempt - 1))`
     - `capped_delay = min(delay, max_delay)`
     - Store `round(capped_delay, 2)`.
3. **Return**: List of float delays for each attempt in order.

---

## ⚠️ Common Pitfalls

- **Uncapped exponential growth**: $2^{10}$ is 1,024 seconds (17 minutes!). Always enforce a sensible `max_delay` cap.
""",
        "starter_code": {
            "solution.py": """def calculate_retry_schedule(max_attempts: int, base_delay: float = 1.0, max_delay: float = 30.0) -> list[float]:
    \"\"\"
    Generates a list of exponential backoff delays capped at max_delay.
    \"\"\"
    # TODO: Generate list of backoff delays for attempt 1..max_attempts
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Payment gateway SDKs calculate progressive exponential backoff delay schedules to retry transient network drops safely.",
            "exercise_goal": "Implement calculate_retry_schedule(max_attempts, base_delay, max_delay) returning list of capped delays.",
            "expected_output": "calculate_retry_schedule(4, 1.0, 30.0) -> [1.0, 2.0, 4.0, 8.0]",
            "failure_mode": "Failing to cap delays at max_delay or incorrect power formula.",
            "verification_criteria": "Function returns correct exponential backoff delay sequence.",
            "tests.py": """from solution import calculate_retry_schedule

def test_backoff_schedule():
    schedule = calculate_retry_schedule(5, base_delay=1.0, max_delay=10.0)
    assert schedule == [1.0, 2.0, 4.0, 8.0, 10.0]

    schedule_small = calculate_retry_schedule(3, base_delay=0.5, max_delay=5.0)
    assert schedule_small == [0.5, 1.0, 2.0]

    print("✓ All assertions passed for Lesson 1.38: Exponential Backoff")

if __name__ == '__main__':
    test_backoff_schedule()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.39: Tokenization & Text Splitting
    # --------------------------------------------------------------------------
    "node-0-39": {
        "title": "Lesson 1.39: Text Chunking & Length Estimation",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 39 of 50",
        "cs_foundation": "String Partitioning, Chunking Long Documents, and Character Count Estimation",
        "ai_convergence": "Real-World Engineering: Splitting Lengthy Legal Contracts & Customer Manuals for Processing",
        "handbook_markdown": """# Lesson 1.39: Text Chunking & Length Estimation

When processing large articles, documentation guides, or transcripts, systems often have maximum text capacity limits per request.

Splitting text into clean, word-boundary-respecting **chunks** ensures that sentences are never cut in half mid-word.

---

## 💡 The Real-World Mental Model: Packing Books into Moving Boxes

- **Cutting Pages with Scissors**: Forcing a book into a box by cutting pages in half. The words become unreadable.
- **Word-Boundary Chunking**: Packing as many whole paragraphs and sentences as fit within the weight limit, neatly starting the next box with the next whole word.

```
Long Document (5,000 words)
   ├── Chunk 1: [Words 1 - 500]   (Fits within chunk limit)
   ├── Chunk 2: [Words 501 - 1000]
   └── Chunk 3: [Words 1001 - 1500]
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Splitting Text by Word Limits
```python
def chunk_text_by_words(text: str, max_words_per_chunk: int = 200) -> list[str]:
    words = text.split()
    chunks = []
    for i in range(0, len(words), max_words_per_chunk):
        chunk = " ".join(words[i : i + max_words_per_chunk])
        chunks.append(chunk)
    return chunks
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `chunk_document_by_words(text: str, words_per_chunk: int) -> list[dict]`:

1. **Parameters**: `text` (raw document string) and `words_per_chunk` (integer).
2. **Tokenize/Split**: Split `text.split()` into words.
3. **Build Chunks**:
   - For each slice of size `words_per_chunk`:
     - Reconstruct text: `" ".join(slice)`.
     - Build dict: `{"chunk_index": i, "word_count": len(slice), "text": chunk_text}`.
4. **Return**: List of chunk dictionaries.

---

## ⚠️ Common Pitfalls

- **Empty input text**: Handle empty string input gracefully by returning an empty list `[]`.
""",
        "starter_code": {
            "solution.py": """def chunk_document_by_words(text: str, words_per_chunk: int) -> list[dict]:
    \"\"\"
    Splits document text into structured chunks of at most words_per_chunk words.
    \"\"\"
    # TODO: Split words, iterate slices, and build list of chunk dictionaries
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Document indexing pipelines partition lengthy manuals and articles into structured word-bounded chunks for searchable storage.",
            "exercise_goal": "Implement chunk_document_by_words(text, words_per_chunk) returning list of chunk dicts.",
            "expected_output": "chunk_document_by_words('one two three four', 2) -> [{'chunk_index': 0, 'word_count': 2, 'text': 'one two'}, {'chunk_index': 1, 'word_count': 2, 'text': 'three four'}]",
            "failure_mode": "Failing to preserve words or incorrect indexing.",
            "verification_criteria": "Function returns accurately segmented chunks with indices.",
            "tests.py": """from solution import chunk_document_by_words

def test_text_chunking():
    doc = "Alpha Beta Gamma Delta Epsilon Zeta Eta Theta"
    chunks = chunk_document_by_words(doc, 3)
    assert len(chunks) == 3
    assert chunks[0]["text"] == "Alpha Beta Gamma"
    assert chunks[0]["word_count"] == 3
    assert chunks[2]["text"] == "Eta Theta"
    assert chunks[2]["word_count"] == 2

    print("✓ All assertions passed for Lesson 1.39: Text Chunking")

if __name__ == '__main__':
    test_text_chunking()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.40: Structured Prompt Templates & XML Tags
    # --------------------------------------------------------------------------
    "node-0-40": {
        "title": "Lesson 1.40: Structured Text Templates & XML Tagging",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 40 of 50",
        "cs_foundation": "Structured Text Interpolation, Tagged Data Formats, and XML Delimiters",
        "ai_convergence": "Real-World Engineering: Structuring Instructions & User Input with Clean XML Delimiters",
        "handbook_markdown": """# Lesson 1.40: Structured Text Templates & XML Tagging

When preparing complex prompts, system instructions, or report templates, mixing raw user data directly into instruction text can cause ambiguity.

Using **XML tags** (e.g. `<context>`, `<query>`, `<rules>`) clearly separates instructions from variable data.

---

## 💡 The Real-World Mental Model: Labeled Shipping Folders

- **Unstructured Mixed Text**: Tossing customer notes, payment receipts, and instructions all into one unorganized pile.
- **XML Tagged Sections**: Putting each item into a clearly labeled folder tab: `<instructions>`, `<customer_data>`, `<security_rules>`. The recipient immediately knows what each section represents.

```
<system_instructions>
Summarize the following customer transcript accurately.
</system_instructions>

<customer_input>
My delivery arrived 2 days late.
</customer_input>
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Composing Tagged Templates
```python
def wrap_xml_tag(tag_name: str, content: str) -> str:
    cleaned = content.strip()
    return f"<{tag_name}>\\n{cleaned}\\n</{tag_name}>"
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `build_tagged_prompt(instruction: str, context_text: str, user_query: str) -> str`:

1. **Parameters**: `instruction` (str), `context_text` (str), `user_query` (str).
2. **Format Sections**:
   - `<instructions>\n{instruction.strip()}\n</instructions>`
   - `<context>\n{context_text.strip()}\n</context>`
   - `<query>\n{user_query.strip()}\n</query>`
3. **Combine**: Join all three tagged blocks separated by two newlines (`\n\n`).
4. **Return**: The combined structured string.

---

## ⚠️ Common Pitfalls

- **Missing closing tag slash (`/`)**: Always ensure matching closing tags like `</context>`.
""",
        "starter_code": {
            "solution.py": """def build_tagged_prompt(instruction: str, context_text: str, user_query: str) -> str:
    \"\"\"
    Builds a structured prompt string wrapped in <instructions>, <context>, and <query> XML tags.
    \"\"\"
    # TODO: Format and join the three tagged blocks
    pass
"""
        },
        "test_suite": {
            "exercise_about": "AI application prompt engineers structure complex multi-part prompts with XML tags to clearly separate instructions from user-submitted context.",
            "exercise_goal": "Implement build_tagged_prompt(instruction, context_text, user_query) returning formatted XML tagged string.",
            "expected_output": "build_tagged_prompt('Translate', 'Hello world', 'Spanish') ->\n'<instructions>\\nTranslate\\n</instructions>\\n\\n<context>\\nHello world\\n</context>\\n\\n<query>\\nSpanish\\n</query>'",
            "failure_mode": "Malformed XML tags or incorrect tag names.",
            "verification_criteria": "Function formats all three sections into valid XML tagged blocks.",
            "tests.py": """from solution import build_tagged_prompt

def test_xml_tagging():
    res = build_tagged_prompt("Extract dates", "Invoice received on 2026-03-15", "Find due date")
    assert "<instructions>\nExtract dates\n</instructions>" in res
    assert "<context>\nInvoice received on 2026-03-15\n</context>" in res
    assert "<query>\nFind due date\n</query>" in res

    print("✓ All assertions passed for Lesson 1.40: Structured Text Templates")

if __name__ == '__main__':
    test_xml_tagging()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.41: Parsing Unstructured Text & JSON Extraction
    # --------------------------------------------------------------------------
    "node-0-41": {
        "title": "Lesson 1.41: Parsing Unstructured Text & Markdown Extraction",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 41 of 50",
        "cs_foundation": "Markdown Code Block Extraction, Regex JSON Isolators, and Defensive Parsing",
        "ai_convergence": "Real-World Engineering: Extracting Embedded JSON Objects from Markdown Responses",
        "handbook_markdown": """# Lesson 1.41: Parsing Unstructured Text & Markdown Extraction

External APIs and LLMs frequently return JSON embedded inside Markdown code fences (e.g. ````json { ... } ````) or surrounded by conversational greetings like *"Here is your requested JSON:"*.

Building defensive extractors using regular expressions strips away conversational markdown noise and extracts clean, parseable JSON dictionaries.

---

## 💡 The Real-World Mental Model: Opening Bubble Wrap to Find the Product

- **Raw API Output**: A cardboard shipping box filled with bubble wrap, packing peanuts, and receipts with the product hidden in the center.
- **Defensive Extractor**: A tool that cleanly slices away the bubble wrap (` ```json ` fences) and extracts the clean product directly.

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Regex Code Fence Extraction
```python
import re
import json

def extract_json_from_markdown(raw_text: str) -> dict | None:
    # Match content inside ```json ... ``` or ``` ... ```
    pattern = r"```(?:json)?\s*([\s\S]*?)\s*```"
    match = re.search(pattern, raw_text)
    
    candidate_text = match.group(1) if match else raw_text
    try:
        return json.loads(candidate_text.strip())
    except (json.JSONDecodeError, ValueError):
        return None
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `extract_json_from_markdown(raw_text: str) -> dict | None`:

1. **Extract**: Check for markdown code blocks using `re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", raw_text)`.
2. **Candidate Text**: If a markdown block is matched, use its inner group; otherwise, attempt parsing `raw_text` directly.
3. **Parse**: In a `try` block, run `json.loads(candidate_text.strip())`.
4. **Return**: The parsed dictionary on success, or `None` if parsing fails.

---

## ⚠️ Common Pitfalls

- **Non-greedy regex**: Always use `[\s\S]*?` with `?` so the regex stops at the first closing fence ` ``` `.
""",
        "starter_code": {
            "solution.py": """import re
import json

def extract_json_from_markdown(raw_text: str) -> dict | None:
    \"\"\"
    Extracts and parses JSON embedded inside markdown code fences or plain text.
    Returns parsed dict, or None if invalid.
    \"\"\"
    # TODO: Use regex to extract JSON from code fences and parse with json.loads
    pass
"""
        },
        "test_suite": {
            "exercise_about": "API response parsers strip conversational greetings and markdown code blocks to extract clean JSON payloads reliably.",
            "exercise_goal": "Implement extract_json_from_markdown(raw_text) returning parsed dict or None.",
            "expected_output": "extract_json_from_markdown('Here is data:\\n```json\\n{\"score\": 95}\\n```') -> {'score': 95}",
            "failure_mode": "Crashing on malformed JSON or failing to strip markdown code fences.",
            "verification_criteria": "Function cleanly parses fenced JSON or plain JSON strings, returning None on failure.",
            "tests.py": """from solution import extract_json_from_markdown

def test_markdown_json():
    fenced_sample = \"\"\"
    Sure! Here is the order data you requested:
    ```json
    {
      "order_id": 4021,
      "status": "shipped"
    }
    ```
    Let me know if you need anything else!
    \"\"\"
    res = extract_json_from_markdown(fenced_sample)
    assert res == {"order_id": 4021, "status": "shipped"}

    # Plain JSON
    assert extract_json_from_markdown('{"count": 10}') == {"count": 10}

    # Invalid JSON
    assert extract_json_from_markdown('Not JSON at all') is None

    print("✓ All assertions passed for Lesson 1.41: Markdown JSON Extraction")

if __name__ == '__main__':
    test_markdown_json()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.42: Server-Sent Events (SSE) & Token Streams
    # --------------------------------------------------------------------------
    "node-0-42": {
        "title": "Lesson 1.42: Server-Sent Events (SSE) & Stream Parsing",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 42 of 50",
        "cs_foundation": "Server-Sent Events (SSE), 'data: ' Stream Protocol, Line Delimiters, and Chunk Assembly",
        "ai_convergence": "Real-World Engineering: Reconstructing Real-Time Live Chat Transcripts from SSE Feeds",
        "handbook_markdown": """# Lesson 1.42: Server-Sent Events (SSE) & Stream Parsing

When streaming live AI responses or stock ticker updates in real time, web servers send data using **Server-Sent Events (SSE)**.

In SSE, each chunk of data arrives prefixed with **`data: `** followed by payload text and terminated with double newlines. Understanding how to parse SSE lines allows you to assemble streaming tokens as they arrive.

---

## 💡 The Real-World Mental Model: A Live Teletype Ticker Tape

- **Standard HTTP Request**: Waiting 30 seconds in silence until an entire 10-page report is finished printing before you see a single word.
- **Server-Sent Events (SSE)**: A continuous stock ticker tape printing word by word as each syllable is thought of.

```
data: {"token": "The"}
data: {"token": " package"}
data: {"token": " arrived."}
data: [DONE]
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. The SSE Protocol Format
- Lines starting with `data: ` contain payload strings.
- A line `data: [DONE]` signals stream completion.
- Empty lines separate discrete event messages.

---

## 🛠️ Step-by-Step Exercise Guide

Implement `parse_sse_stream_lines(raw_sse_lines: list[str]) -> str`:

1. **Parameters**: `raw_sse_lines` (list of raw strings from an SSE connection).
2. **Iterate & Parse**:
   - For each line in `raw_sse_lines`:
     - Strip leading and trailing whitespace.
     - If line starts with `"data:"`:
       - Extract the content after `"data:"`.
       - Strip whitespace from the extracted content.
       - If content is `"[DONE]"`, break/stop processing.
       - Try parsing the content with `json.loads`. If it has a `"token"` key, append `token` string to output.
3. **Return**: The assembled full message string.

---

## ⚠️ Common Pitfalls

- **Ignoring `[DONE]` marker**: Always check for `[DONE]` to avoid attempting JSON parsing on stream terminator signals.
""",
        "starter_code": {
            "solution.py": """import json

def parse_sse_stream_lines(raw_sse_lines: list[str]) -> str:
    \"\"\"
    Parses SSE lines starting with 'data: ', extracts 'token' values from JSON,
    and returns assembled text. Stops on '[DONE]'.
    \"\"\"
    # TODO: Parse SSE data: lines, extract token strings, and assemble full text
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Streaming client libraries parse SSE data: lines from live chat APIs and assemble individual token chunks into smooth real-time text.",
            "exercise_goal": "Implement parse_sse_stream_lines(raw_sse_lines) assembling token stream into full string.",
            "expected_output": "parse_sse_stream_lines(['data: {\"token\": \"Hello \"}', 'data: {\"token\": \"World\"}', 'data: [DONE]']) -> 'Hello World'",
            "failure_mode": "Crashing on [DONE] marker or failing to strip data: prefix.",
            "verification_criteria": "Function accurately assembles text chunks from SSE stream lines.",
            "tests.py": """from solution import parse_sse_stream_lines

def test_sse_parser():
    stream = [
        "",
        'data: {"token": "System "}',
        'data: {"token": "is "}',
        'data: {"token": "operational."}',
        "data: [DONE]",
        'data: {"token": "extra"}'
    ]
    res = parse_sse_stream_lines(stream)
    assert res == "System is operational."

    print("✓ All assertions passed for Lesson 1.42: Server-Sent Events (SSE)")

if __name__ == '__main__':
    test_sse_parser()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.43: Pydantic v2 & Data Contracts
    # --------------------------------------------------------------------------
    "node-0-43": {
        "title": "Lesson 1.43: Pydantic v2 & Strict Data Contracts",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 43 of 50",
        "cs_foundation": "Pydantic BaseModel, Field Validation, Type Coercion, and Schema Enforcement",
        "ai_convergence": "Real-World Engineering: Enforcing Strict Customer Checkout & Payment Data Schemas",
        "handbook_markdown": """# Lesson 1.43: Pydantic v2 & Strict Data Contracts

While dataclasses provide basic structure, they do not validate field constraints (such as ensuring an email contains `@` or a price is greater than `0`).

**Pydantic (v2)** is the industry-standard data validation library in Python. It parses messy input dictionaries, coerces types safely, and enforces strict schema contracts.

---

## 💡 The Real-World Mental Model: A Building Inspector with a Strict Checklist

- **Standard Dictionary**: An informal hand-written note saying *"House looks okay"*.
- **Pydantic Model (`BaseModel`)**: A certified building inspector with a digital scanner. If a required beam is missing or a measurement is negative, the inspector immediately issues an exact violation report (**`ValidationError`**).

```python
from pydantic import BaseModel, Field

class OrderItem(BaseModel):
    sku: str
    price: float = Field(gt=0, description="Price must be positive")
    quantity: int = Field(default=1, ge=1)
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Parsing & Validation
```python
from pydantic import BaseModel, ValidationError

class UserAccount(BaseModel):
    user_id: int
    email: str
    is_admin: bool = False

# Automatic type coercion:
account = UserAccount(user_id="105", email="alice@work.com")
print(account.user_id)  # Converted to integer 105!
```

---

## 🛠️ Step-by-Step Exercise Guide

Create a Pydantic model `ShippingAddress`:

1. **Fields**:
   - `street: str`
   - `city: str`
   - `postal_code: str`
   - `country: str = "US"`
2. **Method**: `def format_label(self) -> str`:
   - Returns `f"{self.street.title()}, {self.city.title()} {self.postal_code}, {self.country.upper()}"`

---

## ⚠️ Common Pitfalls

- **Using mutable defaults directly**: Pydantic handles `default_factory=list` safely, unlike standard Python `def fn(x=[])`.
""",
        "starter_code": {
            "solution.py": """from pydantic import BaseModel

class ShippingAddress(BaseModel):
    \"\"\"
    Pydantic schema representing a validated customer shipping address.
    \"\"\"
    # TODO: Define street, city, postal_code, country='US'
    # TODO: Implement format_label() -> str
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Logistics dispatch microservices validate incoming customer shipping address records with Pydantic before printing parcel labels.",
            "exercise_goal": "Define ShippingAddress Pydantic model with validation and format_label method.",
            "expected_output": "addr = ShippingAddress(street='123 main st', city='boston', postal_code='02101')\naddr.format_label() -> '123 Main St, Boston 02101, US'",
            "failure_mode": "Failing to inherit from BaseModel or incorrect label formatting.",
            "verification_criteria": "Model validates fields with Pydantic and returns formatted address label.",
            "tests.py": """from solution import ShippingAddress
from pydantic import ValidationError

def test_pydantic_model():
    addr = ShippingAddress(
        street="456 oak ave",
        city="seattle",
        postal_code="98101",
        country="us"
    )
    assert addr.format_label() == "456 Oak Ave, Seattle 98101, US"

    # Test validation error on missing required field
    try:
        ShippingAddress(city="seattle", postal_code="98101")
        assert False, "Expected ValidationError on missing street"
    except ValidationError:
        pass

    print("✓ All assertions passed for Lesson 1.43: Pydantic v2")

if __name__ == '__main__':
    test_pydantic_model()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.44: Defensive Parsing & Schema Enforcement
    # --------------------------------------------------------------------------
    "node-0-44": {
        "title": "Lesson 1.44: Defensive Parsing & Schema Enforcement",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 44 of 50",
        "cs_foundation": "Defensive Parsing, Schema Reconciliation, Default Fallbacks, and Error Recovery",
        "ai_convergence": "Real-World Engineering: Sanitizing & Normalizing Foreign Partner API Payloads",
        "handbook_markdown": """# Lesson 1.44: Defensive Parsing & Schema Enforcement

When receiving data from external partner APIs or uncurated third-party datasets, records often arrive with inconsistent keys, missing fields, or unexpected nulls.

Building **defensive parsing pipelines** ensures your core application logic never crashes due to malformed upstream data.

---

## 💡 The Real-World Mental Model: A Border Customs Inspection Station

- **Unprotected Ingestion**: Letting every unmarked crate straight into the warehouse without opening it. One corrupted crate causes a warehouse fire.
- **Defensive Inspection Pipeline**: Every incoming crate is opened at customs. If labels are misprinted, customs sanitizes them; if critical contents are missing, customs routes the crate to an exception holding pen.

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Safe Schema Reconciliation
```python
def parse_raw_partner_item(raw_dict: dict) -> dict:
    return {
        "sku": str(raw_dict.get("id") or raw_dict.get("sku") or "UNKNOWN").strip().upper(),
        "price": max(0.0, float(raw_dict.get("price") or 0.0)),
        "available": bool(raw_dict.get("in_stock", True))
    }
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `sanitize_partner_record(raw_record: dict) -> dict`:

1. **Extract & Clean**:
   - `"product_id"`: Check `"product_id"` or `"id"`. Convert to string, strip, and uppercase. If neither exists, default to `"UNASSIGNED"`.
   - `"unit_price"`: Try converting `"price"` or `"cost"` to float. If invalid or negative, default to `0.0`.
   - `"tags"`: Extract list of tags from `"tags"`. Ensure all items are stripped lowercase strings. If `"tags"` is not a list, default to `[]`.
2. **Return**: A pristine dictionary with `"product_id"`, `"unit_price"`, and `"tags"`.

---

## ⚠️ Common Pitfalls

- **Handling non-numeric price strings**: Wrap `float()` conversions in `try/except ValueError` to catch strings like `"N/A"`.
""",
        "starter_code": {
            "solution.py": """def sanitize_partner_record(raw_record: dict) -> dict:
    \"\"\"
    Defensively sanitizes messy partner records, resolving product_id, unit_price, and clean tags.
    \"\"\"
    # TODO: Safely extract product_id, parse unit_price, and clean tags list
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Catalog aggregation pipelines sanitize messy vendor inventory feeds, resolving alternative key names and fallback defaults.",
            "exercise_goal": "Implement sanitize_partner_record(raw_record) returning normalized product dictionary.",
            "expected_output": "sanitize_partner_record({'id': 'sku-99', 'cost': '19.99', 'tags': ['Sale', ' New ']}) -> {'product_id': 'SKU-99', 'unit_price': 19.99, 'tags': ['sale', 'new']}",
            "failure_mode": "Crashing on missing keys or non-numeric cost values.",
            "verification_criteria": "Function defensively normalizes dirty input dicts without raising exceptions.",
            "tests.py": """from solution import sanitize_partner_record

def test_defensive_parsing():
    dirty_input = {
        "id": "  prod_42  ",
        "price": "45.50",
        "tags": ["Electronics", "  ACCESSORY "]
    }
    cleaned = sanitize_partner_record(dirty_input)
    assert cleaned["product_id"] == "PROD_42"
    assert cleaned["unit_price"] == 45.50
    assert cleaned["tags"] == ["electronics", "accessory"]

    # Fallback test
    fallback = sanitize_partner_record({})
    assert fallback["product_id"] == "UNASSIGNED"
    assert fallback["unit_price"] == 0.0
    assert fallback["tags"] == []

    print("✓ All assertions passed for Lesson 1.44: Defensive Parsing")

if __name__ == '__main__':
    test_defensive_parsing()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.45: Async Python Fundamentals (asyncio)
    # --------------------------------------------------------------------------
    "node-0-45": {
        "title": "Lesson 1.45: Async Python & Concurrent Execution with asyncio",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 45 of 50",
        "cs_foundation": "Asynchronous Programming, Coroutines (async/await), Event Loop, and asyncio.gather()",
        "ai_convergence": "Real-World Engineering: Fetching Multiple Independent API Endpoints Concurrently",
        "handbook_markdown": """# Lesson 1.45: Async Python & Concurrent Execution with asyncio

When an application performs multiple network requests or database queries, running them sequentially means waiting for each one to finish before starting the next.

With **`asyncio`** and **`async/await`**, Python can send multiple requests concurrently on a single thread, reducing total wait time by up to 90%.

---

## 💡 The Real-World Mental Model: A Chef with Multiple Stove Burners

- **Synchronous Execution**: Boiling a pot of pasta for 10 minutes while standing completely frozen, refusing to chop vegetables or heat sauce until the pasta timer rings.
- **Asynchronous Execution (`async/await`)**: Putting the pasta water on the stove (`await boil_water()`), and while the water is heating, immediately chopping tomatoes and seasoning sauce.

```
Synchronous:   [Fetch User 1 (1s)] ───► [Fetch User 2 (1s)] ───► Total: 2.0s
Asynchronous:  [Fetch User 1 (1s)]
               [Fetch User 2 (1s)] ────────────────────────────► Total: 1.0s!
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. `async def` and `await`
```python
import asyncio

async def fetch_user_data(user_id: int) -> dict:
    # Simulate network delay without blocking other tasks:
    await asyncio.sleep(0.01)
    return {"user_id": user_id, "status": "active"}

async def main():
    # Run multiple coroutines concurrently:
    results = await asyncio.gather(
        fetch_user_data(101),
        fetch_user_data(102),
        fetch_user_data(103)
    )
    print(results)
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement the async function `fetch_all_inventories(warehouse_ids: list[str]) -> list[dict]`:

1. **Async Helper**: Create `async def fetch_single_warehouse(wid: str) -> dict`:
   - `await asyncio.sleep(0.01)` (simulating network call).
   - Return `{"warehouse": wid, "status": "synced"}`.
2. **Main Async Function**: `async def fetch_all_inventories(warehouse_ids: list[str]) -> list[dict]`:
   - Use `tasks = [fetch_single_warehouse(wid) for wid in warehouse_ids]`.
   - Run `results = await asyncio.gather(*tasks)`.
   - Return `list(results)`.

---

## ⚠️ Common Pitfalls

- **Calling async functions without `await`**: Forgetting `await` returns an unawaited coroutine object instead of the actual data.
""",
        "starter_code": {
            "solution.py": """import asyncio

async def fetch_all_inventories(warehouse_ids: list[str]) -> list[dict]:
    \"\"\"
    Concurrently fetches inventory status for all warehouse_ids using asyncio.gather.
    \"\"\"
    # TODO: Implement async concurrent gather across all warehouse_ids
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Warehouse aggregation gateways query regional depot inventory APIs concurrently to provide unified live stock status.",
            "exercise_goal": "Implement async fetch_all_inventories(warehouse_ids) using asyncio.gather.",
            "expected_output": "asyncio.run(fetch_all_inventories(['WH-1', 'WH-2'])) -> [{'warehouse': 'WH-1', 'status': 'synced'}, {'warehouse': 'WH-2', 'status': 'synced'}]",
            "failure_mode": "Failing to use async/await or failing to gather concurrent tasks.",
            "verification_criteria": "Function is a valid coroutine gathering concurrent results correctly.",
            "tests.py": """import asyncio
from solution import fetch_all_inventories

def test_asyncio_concurrency():
    res = asyncio.run(fetch_all_inventories(["WH-North", "WH-South"]))
    assert len(res) == 2
    assert res[0]["warehouse"] == "WH-North"
    assert res[1]["warehouse"] == "WH-South"
    assert res[0]["status"] == "synced"

    print("✓ All assertions passed for Lesson 1.45: Async Python & asyncio")

if __name__ == '__main__':
    test_asyncio_concurrency()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.46: Structured JSON Logging & Observability
    # --------------------------------------------------------------------------
    "node-0-46": {
        "title": "Lesson 1.46: Structured Logging & Telemetry",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 46 of 50",
        "cs_foundation": "Structured Logging, Log Levels (DEBUG, INFO, WARNING, ERROR), JSON Logs, and Contextual Metadata",
        "ai_convergence": "Real-World Engineering: Emitting Structured JSON Audit Events for Cloud Telemetry",
        "handbook_markdown": """# Lesson 1.46: Structured Logging & Telemetry

Using plain `print()` statements in production code is problematic: print output lacks timestamps, severity levels, and machine-readable structure.

**Structured JSON logging** formats events as single-line JSON objects with standardized fields (`timestamp`, `level`, `event`, `duration_ms`), allowing log monitoring tools (like Datadog or CloudWatch) to index and query metrics easily.

---

## 💡 The Real-World Mental Model: Black Box Flight Recorders

- **`print("something failed")`**: A scribbled scrap of paper with no date, time, or flight number. When something breaks, nobody knows which flight it belonged to.
- **Structured JSON Event**: An airplane's flight data recorder logging timestamped telemetry records with exact flight ID, altitude, and component status.

```json
{"timestamp": "2026-03-26T12:00:00Z", "level": "INFO", "event": "order_placed", "order_id": 1042, "amount": 89.50}
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Building Structured Log Payloads
```python
import json
import time

def format_log_event(level: str, event_name: str, **context) -> str:
    payload = {
        "timestamp": int(time.time()),
        "level": level.upper(),
        "event": event_name,
        "context": context
    }
    return json.dumps(payload)
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `create_audit_log_entry(level: str, message: str, service: str, **metadata) -> dict`:

1. **Parameters**: `level` (str), `message` (str), `service` (str), `**metadata` (extra kwargs).
2. **Build Payload**: Construct dictionary with:
   - `"level"`: `level.upper()`
   - `"service"`: `service.lower()`
   - `"message"`: `message.strip()`
   - `"metadata"`: dictionary of keyword arguments passed in.
3. **Return**: The dictionary object.

---

## ⚠️ Common Pitfalls

- **Embedding non-serializable objects**: Ensure all metadata items are primitive JSON types (strings, numbers, booleans, lists).
""",
        "starter_code": {
            "solution.py": """def create_audit_log_entry(level: str, message: str, service: str, **metadata) -> dict:
    \"\"\"
    Builds a standardized structured audit log dictionary.
    \"\"\"
    # TODO: Build and return dictionary with level, service, message, and metadata
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Cloud backend services emit standardized JSON telemetry log events to monitor system health and audit security actions.",
            "exercise_goal": "Implement create_audit_log_entry(level, message, service, **metadata) returning structured dictionary.",
            "expected_output": "create_audit_log_entry('info', 'User login', 'auth_service', user_id=42) ->\n{'level': 'INFO', 'service': 'auth_service', 'message': 'User login', 'metadata': {'user_id': 42}}",
            "failure_mode": "Failing to uppercase level or failing to bundle kwargs into metadata dict.",
            "verification_criteria": "Function produces valid structured log event dictionary.",
            "tests.py": """from solution import create_audit_log_entry

def test_structured_logging():
    log = create_audit_log_entry("warning", "High memory usage", "BillingService", memory_pct=88.5, host="srv-01")
    assert log["level"] == "WARNING"
    assert log["service"] == "billingservice"
    assert log["message"] == "High memory usage"
    assert log["metadata"]["memory_pct"] == 88.5
    assert log["metadata"]["host"] == "srv-01"

    print("✓ All assertions passed for Lesson 1.46: Structured Logging")

if __name__ == '__main__':
    test_structured_logging()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.47: Git Fundamentals & Commit Diffs
    # --------------------------------------------------------------------------
    "node-0-47": {
        "title": "Lesson 1.47: Version Control & Git Fundamentals",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 47 of 50",
        "cs_foundation": "Version Control Concepts, Git Commits, Diffs, Branches, and Staging Areas",
        "ai_convergence": "Real-World Engineering: Parsing Git Diffs & Automating Version Tracking",
        "handbook_markdown": """# Lesson 1.47: Version Control & Git Fundamentals

**Git** is the foundation of modern collaborative software engineering. It tracks every change made to a codebase over time, allowing teams to collaborate seamlessly and roll back bugs.

Understanding commit snapshots, branch workflows, and unified diff formats is essential for any professional developer.

---

## 💡 The Real-World Mental Model: Video Game Save States & Rewind Trees

- **Working Directory**: Playing the live video game right now.
- **`git add` (Staging Area)**: Selecting which achievements and items to include in your upcoming save snapshot.
- **`git commit`**: Creating a permanent, timestamped save slot with a descriptive message (*"Defeated level 3 boss"*). You can travel back in time to any save state at any moment.
- **`git diff`**: A side-by-side comparison showing exactly which lines were added (`+`) or removed (`-`).

---

## 🔍 Deep Dive: Understanding the Concept

### 1. The 3 Trees of Git
1. **Working Tree**: Your actual files on disk.
2. **Index (Staging Area)**: Staged changes prepared for the next commit.
3. **Commit History (`HEAD`)**: Immutable record of past snapshots.

---

## 🛠️ Step-by-Step Exercise Guide

Implement `parse_git_diff_summary(diff_lines: list[str]) -> dict`:

1. **Parameters**: `diff_lines` (list of strings from a `git diff` output).
2. **Count Modifications**:
   - Lines starting with `"+"` (and not `"+++"`): Increment `lines_added`.
   - Lines starting with `"-"` (and not `"---"`): Increment `lines_deleted`.
   - Ignore header lines starting with `"diff"`, `"index"`, `"+++"`, or `"---"`.
3. **Return**: `{"lines_added": lines_added, "lines_deleted": lines_deleted, "net_change": lines_added - lines_deleted}`.

---

## ⚠️ Common Pitfalls

- **Counting diff file header prefixes (`+++` and `---`)**: Make sure to exclude headers from line modification counts.
""",
        "starter_code": {
            "solution.py": """def parse_git_diff_summary(diff_lines: list[str]) -> dict:
    \"\"\"
    Parses unified git diff lines and returns lines_added, lines_deleted, and net_change.
    \"\"\"
    # TODO: Count '+' and '-' lines, excluding header lines
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Code review automation tools parse unified git diff outputs to calculate pull request change volume and metrics.",
            "exercise_goal": "Implement parse_git_diff_summary(diff_lines) calculating lines_added, lines_deleted, and net_change.",
            "expected_output": "parse_git_diff_summary(['+new code', '-old code', '+another line']) -> {'lines_added': 2, 'lines_deleted': 1, 'net_change': 1}",
            "failure_mode": "Counting +++ / --- diff header lines as code changes.",
            "verification_criteria": "Function accurately tallies additions and deletions from git diff lines.",
            "tests.py": """from solution import parse_git_diff_summary

def test_git_diff_parser():
    sample_diff = [
        "diff --git a/app.py b/app.py",
        "--- a/app.py",
        "+++ b/app.py",
        "-def old_tax_calc():",
        "-    return 0.05",
        "+def new_tax_calc(rate=0.08):",
        "+    # Updated rate",
        "+    return rate",
        " def unchanged_function():"
    ]
    summary = parse_git_diff_summary(sample_diff)
    assert summary["lines_added"] == 3
    assert summary["lines_deleted"] == 2
    assert summary["net_change"] == 1

    print("✓ All assertions passed for Lesson 1.47: Git Fundamentals")

if __name__ == '__main__':
    test_git_diff_parser()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.48: Automated Testing with Pytest
    # --------------------------------------------------------------------------
    "node-0-48": {
        "title": "Lesson 1.48: Automated Unit Testing with Pytest",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 48 of 50",
        "cs_foundation": "Test-Driven Development (TDD), Pytest Framework, Assertions, and Edge Case Coverage",
        "ai_convergence": "Real-World Engineering: Writing Regression Suites to Protect Critical Business Calculations",
        "handbook_markdown": """# Lesson 1.48: Automated Unit Testing with Pytest

Manually testing code in a terminal by running `print()` statements does not scale. When you change one part of a codebase, automated tests guarantee that existing features didn't break (**regression prevention**).

**`pytest`** is the standard Python testing framework: write functions starting with `test_` and verify results with clean Python `assert` statements.

---

## 💡 The Real-World Mental Model: Factory Stress-Testing Crash Test Dummies

- **Manual Testing**: Taking a freshly built car for a casual 10-second drive in a parking lot and hoping the airbags work.
- **Automated Test Suite (`pytest`)**: Rigorous, automated stress tests that slam the car at 60 MPH, test brake fluid levels, and check every electronic sensor in 3 seconds before any car leaves the factory.

```python
def test_discount_calculation():
    assert calculate_discount(100.0, 0.2) == 80.0
    assert calculate_discount(50.0, 0.0) == 50.0
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Test Conventions in Pytest
- Test files are named `test_*.py`.
- Test functions are named `test_*()`.
- Use standard `assert actual == expected, "Error message"` syntax.

---

## 🛠️ Step-by-Step Exercise Guide

Implement `run_test_suite_runner(tests_to_run: list[callable]) -> dict`:

1. **Parameters**: `tests_to_run` (list of zero-argument test functions).
2. **Execute**:
   - For each test function:
     - Run it in a `try` block.
     - If it executes without error, record as passed.
     - If it raises `AssertionError` or `Exception`, record as failed.
3. **Return**: `{"total": total, "passed": passed_count, "failed": failed_count}`.

---

## ⚠️ Common Pitfalls

- **Testing only the 'happy path'**: Always write tests for edge cases (zero values, negative numbers, empty strings, missing keys).
""",
        "starter_code": {
            "solution.py": """def run_test_suite_runner(tests_to_run: list) -> dict:
    \"\"\"
    Executes a list of test functions, catching exceptions and returning total, passed, and failed counts.
    \"\"\"
    # TODO: Loop over test callables, run with try/except, and tally pass/fail
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Continuous integration test runners execute test suites in isolated sandboxes and summarize pass/fail metrics.",
            "exercise_goal": "Implement run_test_suite_runner(tests_to_run) executing test callables and returning summary metrics.",
            "expected_output": "run_test_suite_runner([test_fn1, test_fn2]) -> {'total': 2, 'passed': 2, 'failed': 0}",
            "failure_mode": "Crashing when a test fails instead of catching exception.",
            "verification_criteria": "Function runs all test functions and returns accurate summary counts.",
            "tests.py": """from solution import run_test_suite_runner

def test_suite_runner():
    def pass_test():
        assert 1 + 1 == 2

    def fail_test():
        assert 2 * 2 == 5

    res = run_test_suite_runner([pass_test, fail_test, pass_test])
    assert res["total"] == 3
    assert res["passed"] == 2
    assert res["failed"] == 1

    print("✓ All assertions passed for Lesson 1.48: Automated Testing & Pytest")

if __name__ == '__main__':
    test_suite_runner()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.49: Refactoring & Technical Debt
    # --------------------------------------------------------------------------
    "node-0-49": {
        "title": "Lesson 1.49: Code Refactoring & Managing Technical Debt",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 49 of 50",
        "cs_foundation": "Code Smells, Extract Method Refactoring, Guard Clauses, and Reducing Cyclomatic Complexity",
        "ai_convergence": "Real-World Engineering: Refactoring Tangled Nested If-Statements into Clean Guard Clauses",
        "handbook_markdown": """# Lesson 1.49: Code Refactoring & Technical Debt

**Refactoring** is the disciplined practice of improving the internal structure of code without changing its external behavior.

Replacing deeply nested `if` statements with **guard clauses** (early returns) flattens code and makes business rules immediately readable.

---

## 💡 The Real-World Mental Model: Organizing Kitchen Cabinets While Cooking

- **Accumulating Technical Debt**: Throwing spice jars, mixing bowls, and pots into a messy heap on the counter to finish cooking 2 minutes faster. Next time you cook, you spend 30 minutes searching for the salt.
- **Continuous Refactoring**: Washing tools and putting spices back on the rack immediately after using them. The kitchen stays clean, fast, and ready for work.

```python
# Deeply Nested (Hard to read):
def check_order(order):
    if order is not None:
        if order.get("active"):
            if order.get("total", 0) > 0:
                return "Valid"
    return "Invalid"

# Refactored with Guard Clauses (Clean & Flat):
def check_order(order):
    if not order or not order.get("active") or order.get("total", 0) <= 0:
        return "Invalid"
    return "Valid"
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Guard Clauses (Early Returns)
Check for invalid conditions upfront and return early. This avoids the *"Arrow Anti-Pattern"* (nested triangles of indentation).

---

## 🛠️ Step-by-Step Exercise Guide

Implement `evaluate_user_subscription_status(user: dict | None) -> str`:

1. **Guard 1 (Missing user)**: If `user is None`, return `"INVALID_USER"`.
2. **Guard 2 (Banned user)**: If `user.get("is_banned") is True`, return `"ACCESS_DENIED"`.
3. **Guard 3 (Expired subscription)**: If `user.get("days_remaining", 0) <= 0`, return `"SUBSCRIPTION_EXPIRED"`.
4. **Valid Result**: Return `"ACTIVE_SUBSCRIBER"`.

---

## ⚠️ Common Pitfalls

- **Changing function signatures or return types**: Refactoring must never change external behavior or return contracts.
""",
        "starter_code": {
            "solution.py": """def evaluate_user_subscription_status(user: dict | None) -> str:
    \"\"\"
    Uses clean guard clauses to evaluate user status:
    - user is None -> 'INVALID_USER'
    - is_banned is True -> 'ACCESS_DENIED'
    - days_remaining <= 0 -> 'SUBSCRIPTION_EXPIRED'
    - Otherwise -> 'ACTIVE_SUBSCRIBER'
    \"\"\"
    # TODO: Implement flat guard clauses with early returns
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Subscription billing engines use flat guard clauses to evaluate membership validity and return immediate error codes for banned or expired accounts.",
            "exercise_goal": "Implement evaluate_user_subscription_status(user) using guard clauses.",
            "expected_output": "evaluate_user_subscription_status({'is_banned': False, 'days_remaining': 15}) -> 'ACTIVE_SUBSCRIBER'",
            "failure_mode": "Failing to check None or wrong return codes.",
            "verification_criteria": "Function evaluates all subscription states accurately using early return guard clauses.",
            "tests.py": """from solution import evaluate_user_subscription_status

def test_guard_clauses():
    assert evaluate_user_subscription_status(None) == "INVALID_USER"
    assert evaluate_user_subscription_status({"is_banned": True}) == "ACCESS_DENIED"
    assert evaluate_user_subscription_status({"is_banned": False, "days_remaining": 0}) == "SUBSCRIPTION_EXPIRED"
    assert evaluate_user_subscription_status({"is_banned": False, "days_remaining": 30}) == "ACTIVE_SUBSCRIBER"

    print("✓ All assertions passed for Lesson 1.49: Refactoring & Guard Clauses")

if __name__ == '__main__':
    test_guard_clauses()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.50: Capstone Project: Production Developer CLI Workbench
    # --------------------------------------------------------------------------
    "node-0-50": {
        "title": "Lesson 1.50: Module 1 Capstone: PromptCLI — Developer AI Workbench",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 50 of 50",
        "cs_foundation": "End-to-End System Integration: Clean Architecture, CLI, Config, Validation, and Testing",
        "ai_convergence": "Real-World Engineering: Building a Modular Production-Grade Developer Utility",
        "handbook_markdown": """# Lesson 1.50: Module 1 Capstone: PromptCLI — Developer AI Workbench

Congratulations on reaching the **Module 1 Capstone**! 

In this comprehensive capstone, you will synthesize all fundamental programming concepts you have mastered across Lessons 1.1 through 1.49:
- **Clean modular functions & dataclasses**
- **Robust error handling & custom exceptions**
- **JSON configuration loading & environment secrets**
- **Data validation & input sanitization**
- **Formatting and execution pipelines**

---

## 💡 The Real-World Mental Model: The Master Craftsman's Multi-Tool

You are assembling a professional, modular Developer Command Workbench (**PromptCLI**) that:
1. Loads application settings and secret keys safely.
2. Validates incoming task payloads against strict criteria.
3. Formats prompt templates with structured XML tags.
4. Emits structured JSON audit log records for monitoring.

```
+─────────────────────────────────────────────────────────────+
│                       PROMPT CLI ENGINE                     │
│                                                             │
│  [Config Manager] ──► [Input Validator] ──► [XML Formatter] │
│          │                                         │        │
│          ▼                                         ▼        │
│  [Audit Telemetry]                             [Output]     │
+─────────────────────────────────────────────────────────────+
```

---

## 🔍 Deep Dive: Capstone Architecture Specifications

Your capstone module provides a clean `PromptWorkbench` class:

1. **`__init__(self, api_key: str, default_model: str = "gpt-4o-mini")`**:
   - Stores `self.api_key = api_key` (raises `ValueError` if empty).
   - Stores `self.default_model = default_model`.
   - Initializes `self.execution_history = []`.

2. **`format_prompt_payload(self, instruction: str, user_input: str) -> dict`**:
   - Validates that neither `instruction` nor `user_input` is empty string.
   - Formats tagged prompt:
     `f"<instruction>\\n{instruction.strip()}\\n</instruction>\\n\\n<input>\\n{user_input.strip()}\\n</input>"`
   - Returns a structured dictionary:
     `{"model": self.default_model, "prompt": formatted_prompt, "timestamp": int(time.time())}`

3. **`record_execution(self, prompt_dict: dict, status: str = "success") -> None`**:
   - Appends `{**prompt_dict, "status": status}` to `self.execution_history`.

---

## 🛠️ Step-by-Step Exercise Guide

Implement the complete `PromptWorkbench` class according to the specifications above.

---

## ⚠️ Common Pitfalls

- **Empty string validation**: Validate both `instruction.strip()` and `user_input.strip()` before assembling the prompt payload.
""",
        "starter_code": {
            "solution.py": """import time

class PromptWorkbench:
    \"\"\"
    Production-grade Prompt Workbench orchestrator combining configuration,
    structured XML formatting, validation, and telemetry tracking.
    \"\"\"
    def __init__(self, api_key: str, default_model: str = "gpt-4o-mini"):
        # TODO: Validate api_key and initialize workbench state
        pass

    def format_prompt_payload(self, instruction: str, user_input: str) -> dict:
        \"\"\"
        Validates inputs, formats prompt in XML tags, and returns structured payload dict.
        \"\"\"
        # TODO: Validate non-empty strings and return payload dictionary
        pass

    def record_execution(self, prompt_dict: dict, status: str = "success") -> None:
        \"\"\"Records execution payload and status in history list.\"\"\"
        # TODO: Append record to self.execution_history
        pass
"""
        },
        "test_suite": {
            "exercise_about": "The Module 1 Capstone builds a complete Developer AI Workbench orchestrator integrating configuration, validation, prompt templating, and audit tracking.",
            "exercise_goal": "Implement PromptWorkbench class with initialization, format_prompt_payload, and record_execution methods.",
            "expected_output": "wb = PromptWorkbench('sec_key')\np = wb.format_prompt_payload('Summarize', 'Text')\nwb.record_execution(p)\nlen(wb.execution_history) == 1",
            "failure_mode": "Failing to validate API key or malformed prompt structure.",
            "verification_criteria": "PromptWorkbench correctly integrates all Module 1 software engineering primitives.",
            "tests.py": """from solution import PromptWorkbench

def test_capstone_workbench():
    # Validation test
    try:
        PromptWorkbench("")
        assert False, "Expected ValueError on empty api_key"
    except ValueError:
        pass

    wb = PromptWorkbench("api_key_12345", default_model="model-v1")
    payload = wb.format_prompt_payload("Classify sentiment", "Product was great!")
    
    assert payload["model"] == "model-v1"
    assert "<instruction>\nClassify sentiment\n</instruction>" in payload["prompt"]
    assert "<input>\nProduct was great!\n</input>" in payload["prompt"]
    assert "timestamp" in payload

    # History recording
    wb.record_execution(payload, status="completed")
    assert len(wb.execution_history) == 1
    assert wb.execution_history[0]["status"] == "completed"

    print("✓ All assertions passed for Lesson 1.50: Module 1 Capstone Project!")

if __name__ == '__main__':
    test_capstone_workbench()
"""
        }
    }
}

def apply_patch():
    print(f"Applying patch to {len(LESSONS_36_50)} lessons (node-0-36 to node-0-50)...")
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    for node_id, data in LESSONS_36_50.items():
        payload = {
            "title": data["title"],
            "subtitle": data["subtitle"],
            "cs_foundation": data["cs_foundation"],
            "ai_convergence": data["ai_convergence"],
            "handbook_markdown": data["handbook_markdown"],
            "starter_code": data["starter_code"],
            "test_suite": data["test_suite"]
        }
        url = f"{SUPABASE_URL}/rest/v1/curriculum_nodes?id=eq.{node_id}"
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "apikey": API_KEY,
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            },
            method="PATCH"
        )
        try:
            with urllib.request.urlopen(req, context=ctx) as response:
                print(f"✓ Patched {node_id} ({data['title']}) -> HTTP {response.status}")
        except Exception as e:
            print(f"✗ Failed to patch {node_id}: {e}")

if __name__ == "__main__":
    apply_patch()
