-- ==============================================================================
-- Seed Script: LES-00-03 Decomposed Database Sections & Formative Checkpoints
-- Module: MOD-00 Digital Foundations
-- Target Lesson ID: c0000000-0000-0000-0000-000000000003
-- ==============================================================================

DO $$
DECLARE
  v_lesson_id UUID := 'c0000000-0000-0000-0000-000000000003';
  v_sec1_id UUID := 'c0000000-0000-0000-0001-000000000001';
  v_sec2_id UUID := 'c0000000-0000-0000-0001-000000000002';
  v_sec3_id UUID := 'c0000000-0000-0000-0001-000000000003';
  v_sec4_id UUID := 'c0000000-0000-0000-0001-000000000004';
  v_sec5_id UUID := 'c0000000-0000-0000-0001-000000000005';
  v_sec6_id UUID := 'c0000000-0000-0000-0001-000000000006';
  v_sec7_id UUID := 'c0000000-0000-0000-0001-000000000007';
BEGIN

  -- Clean existing sections and checkpoints for this lesson
  DELETE FROM public.lesson_checkpoints WHERE lesson_id = v_lesson_id;
  DELETE FROM public.lesson_sections WHERE lesson_id = v_lesson_id;

  -- ----------------------------------------------------------------------------
  -- SECTION 1: The 300ms Journey & Client–Server Architecture
  -- ----------------------------------------------------------------------------
  INSERT INTO public.lesson_sections (
    id, lesson_id, section_order, section_type, section_title, section_slug,
    section_learning_goal, estimated_minutes, diagram_reference, key_takeaways, section_content
  ) VALUES (
    v_sec1_id,
    v_lesson_id,
    1,
    'orientation',
    'The 300ms Journey & Client–Server Architecture',
    'client-server-journey',
    'Explain the 4 core stages of visiting a website and differentiate the responsibilities of clients and servers.',
    12,
    jsonb_build_object(
      'type', 'sequence_and_graph',
      'caption', 'The 300ms Navigation Sequence and Client–Server Conversation Model'
    ),
    ARRAY[
      'The web is a structured conversation between a Client (initiates requests) and a Server (prepares responses).',
      'The Internet is the global highway; the World Wide Web is the delivery service running on top of it.',
      'Servers listen 24/7 in data centers and prepare data on demand.'
    ],
    '### What Actually Happens in 300 Milliseconds?

When you type `https://github.com/explore` into your browser and press **Enter**, four rapid stages occur before pixels appear on your screen:

1. **DNS Lookup**: Your browser asks the global directory service to translate the human name `github.com` into a machine IP address (`140.82.121.4`).
2. **Secure Connection Handshake**: The browser establishes an encrypted digital telephone call with the server via TCP/TLS.
3. **The HTTP Request**: The browser sends a structured text order: *"Please give me the resources at `/explore`."*
4. **The HTTP Response**: The server processes the request in its kitchen, packages the HTML/CSS/JSON, and returns a `200 OK` response.

```mermaid
sequenceDiagram
    autonumber
    actor User as You (Learner)
    participant Browser as Web Browser (Client)
    participant DNS as DNS Server (Phone Book)
    participant Server as GitHub Server (Kitchen)

    User->>Browser: Types "https://github.com/explore" & hits Enter
    Browser->>DNS: "What is the IP address for github.com?"
    DNS-->>Browser: "github.com is located at 140.82.121.4"
    Note over Browser,Server: Secure Encrypted Connection (HTTPS)
    Browser->>Server: HTTP Request: GET /explore
    Server->>Server: Processes request and prepares HTML & JSON
    Server-->>Browser: HTTP Response: 200 OK + Content
    Browser->>User: Renders the complete web page
```

### The Restaurant Analogy
- **The Client is the Customer**: Sitting at the table, requesting dishes from the menu.
- **The Server is the Kitchen**: Listening 24/7 in the back, preparing dishes on demand.
- **The Protocol (HTTP) is the Waiter & Menu**: The universal rules ensuring both parties understand each other.'
  );

  -- ----------------------------------------------------------------------------
  -- SECTION 2: Addressing the Web: URLs, Domains, DNS & IP Addresses
  -- ----------------------------------------------------------------------------
  INSERT INTO public.lesson_sections (
    id, lesson_id, section_order, section_type, section_title, section_slug,
    section_learning_goal, estimated_minutes, diagram_reference, key_takeaways, section_content
  ) VALUES (
    v_sec2_id,
    v_lesson_id,
    2,
    'concept_model',
    'Addressing the Web: URLs, Domains, DNS & IP Addresses',
    'urls-domains-dns-ip',
    'Deconstruct any URL into its 6 coordinate components and explain how DNS translates names to IP addresses.',
    15,
    jsonb_build_object(
      'type', 'dns_lookup_flow',
      'caption', 'Domain Name System (DNS) Translation Flow'
    ),
    ARRAY[
      'Computers route data across the internet using numeric IP Addresses (e.g. 140.82.121.4).',
      'DNS is the internet global phone book mapping human domain names to machine IP addresses.',
      'A URL coordinates Scheme (protocol), Domain (host), Port (doorway), Path (resource), and Query Strings (filters).'
    ],
    '### The Coordinate System of the Internet

Just as a postal address specifies Country, City, Street, and Apartment Number, a **URL (Uniform Resource Locator)** tells your browser exactly where to travel on the internet:

```
https://api.github.com:443/repos/octocat/Hello-World/issues?state=open&sort=created#comments
└──┬──┘  └──────┬──────┘ └─┬─┘ └──────────────┬──────────────┘ └───────────┬───────────┘ └───┬────┘
Scheme       Domain      Port               Path                     Query String         Fragment
```

### The 6 Parts of a URL:
1. **Scheme / Protocol (`https://`)**: The communication rulebook.
2. **Domain / Host (`api.github.com`)**: The human-friendly server name.
3. **Port (`:443`)**: The specific numbered doorway on the server handling traffic (443 for HTTPS, 80 for HTTP).
4. **Path (`/repos/octocat/...`)**: The hierarchical folder/file location on the server (just like POSIX paths from `LES-00-01`!).
5. **Query String (`?state=open&sort=created`)**: Key-value filters narrowing down the requested data.
6. **Fragment / Anchor (`#comments`)**: Jumps directly to a specific bookmark on the page.

### DNS: The Internet''s Phone Book
Computers do not natively route packets using words like `github.com`. They route data using numbers called **IP Addresses** (e.g. `140.82.121.4`).

```mermaid
graph TD
    classDef client fill:#0f172a,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef dns fill:#1e1b4b,stroke:#f59e0b,stroke-width:2px,color:#fff;
    classDef ip fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff;

    B["Browser wants to reach<br/><b>github.com</b>"]:::client -->|"Lookup: Who is github.com?"| D["DNS Server<br/>(Global Phone Book)"]:::dns
    D -->|"Answer: 140.82.121.4"| B
    B -->|"Connects directly to IP address"| S["Server at 140.82.121.4"]:::ip
```'
  );

  -- ----------------------------------------------------------------------------
  -- SECTION 3: HTTP Requests: Asking for Data with GET, POST & Headers
  -- ----------------------------------------------------------------------------
  INSERT INTO public.lesson_sections (
    id, lesson_id, section_order, section_type, section_title, section_slug,
    section_learning_goal, estimated_minutes, diagram_reference, key_takeaways, section_content
  ) VALUES (
    v_sec3_id,
    v_lesson_id,
    3,
    'protocol_spec',
    'HTTP Requests: Asking for Data with GET, POST & Headers',
    'http-requests-methods-headers',
    'Understand the 3-part structure of an HTTP request, master GET vs POST actions, and interpret request headers.',
    15,
    jsonb_build_object(
      'type', 'request_anatomy',
      'caption', 'Anatomy of an HTTP Request: Method, Path, Headers, Body'
    ),
    ARRAY[
      'An HTTP Request consists of a Request Line (Method + Path), Headers (metadata), and an optional Body.',
      'GET requests fetch data without modifying the server; POST requests submit new data to create records.',
      'Headers act like postal shipping labels describing client type, accepted formats, and credentials.'
    ],
    '### The Anatomy of an HTTP Request

An HTTP request is a plain-text message structured into three parts:
1. **The Request Line**: The action verb (Method) and target location (Path).
2. **Headers**: Key-value metadata about the client (browser type, accepted formats, auth tokens).
3. **Body (Optional)**: The payload sent to the server (e.g. form fields or JSON).

```mermaid
graph TD
    classDef req fill:#0f172a,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef parts fill:#1e293b,stroke:#8b5cf6,stroke-width:2px,color:#fff;

    R["HTTP REQUEST"]:::req --> M["1. METHOD & PATH<br/>GET /api/v1/users/alex HTTP/1.1"]:::parts
    R --> H["2. HEADERS (Metadata)<br/>Host: example.com<br/>User-Agent: Chrome/120.0<br/>Accept: application/json"]:::parts
    R --> B["3. BODY (Optional Payload)<br/>{\"theme\": \"dark\"}"]:::parts
```

### The Core HTTP Verbs
- **`GET`**: *"Please fetch and give me this data."* (Used when loading web pages, searching, or reading profiles. Safe and non-mutating).
- **`POST`**: *"Please accept this new data and create a new record."* (Used when creating accounts, submitting orders, or logging in).
- *Reference Verbs*: `PUT`/`PATCH` (update existing records) and `DELETE` (remove records).'
  );

  -- ----------------------------------------------------------------------------
  -- SECTION 4: HTTP Responses: Status Codes & JSON Data
  -- ----------------------------------------------------------------------------
  INSERT INTO public.lesson_sections (
    id, lesson_id, section_order, section_type, section_title, section_slug,
    section_learning_goal, estimated_minutes, diagram_reference, key_takeaways, section_content
  ) VALUES (
    v_sec4_id,
    v_lesson_id,
    4,
    'protocol_spec',
    'HTTP Responses: Status Codes & JSON Data',
    'http-responses-status-codes-json',
    'Decode 3-digit status codes by family (2xx-5xx) and read structured JSON payloads returned by APIs.',
    18,
    jsonb_build_object(
      'type', 'response_anatomy_and_status_codes',
      'caption', 'HTTP Response Anatomy and Status Code Traffic Lights'
    ),
    ARRAY[
      'Every HTTP response starts with a 3-digit Status Code: 2xx (Success), 3xx (Redirect), 4xx (Client Error), 5xx (Server Error).',
      '404 Not Found means the path does not exist; 500/502/504 mean the server backend crashed or timed out.',
      'JSON is the universal plain-text data format used by modern APIs, structured with key-value objects and arrays.'
    ],
    '### The Anatomy of an HTTP Response

Once the server processes your request, it returns an HTTP Response containing:
1. **Status Line**: Protocol version and 3-digit **Status Code**.
2. **Headers**: Metadata describing the response (e.g. `Content-Type: application/json`).
3. **Body**: The actual payload (HTML, images, or JSON data).

### Status Code Families
- **`2xx` (Success)**: `200 OK` (Standard success), `201 Created` (New item created).
- **`3xx` (Redirection)**: `301 Moved Permanently` (Redirecting from `http://` to `https://`).
- **`4xx` (Client Errors)**: `400 Bad Request` (Malformed input), `401 Unauthorized` (Not logged in), `403 Forbidden` (No permission), `404 Not Found` (Missing resource).
- **`5xx` (Server Errors)**: `500 Internal Server Error` (Server crash), `502 Bad Gateway` / `504 Gateway Timeout` (Upstream cloud server failed).

### JSON: The Universal Language of Web APIs
When modern applications communicate, they exchange pure data formatted as **JSON** (JavaScript Object Notation):

```json
{
  "user_id": "usr_48291",
  "username": "alex_engineer",
  "is_active": true,
  "enrolled_courses": ["MOD-00 Digital Foundations"],
  "profile": { "role": "Learner", "country": "Germany" }
}
```'
  );

  -- ----------------------------------------------------------------------------
  -- SECTION 5: HTTPS & Wire Security: Encryption, Integrity & Trust
  -- ----------------------------------------------------------------------------
  INSERT INTO public.lesson_sections (
    id, lesson_id, section_order, section_type, section_title, section_slug,
    section_learning_goal, estimated_minutes, diagram_reference, key_takeaways, section_content
  ) VALUES (
    v_sec5_id,
    v_lesson_id,
    5,
    'security_spec',
    'HTTPS & Wire Security: Encryption, Integrity & Trust',
    'https-transport-security',
    'Explain how HTTPS (TLS) protects data over public networks through encryption and certificate authentication.',
    10,
    jsonb_build_object(
      'type', 'https_wire_security',
      'caption', 'Plain HTTP Cleartext vs HTTPS TLS Encrypted Ciphertext'
    ),
    ARRAY[
      'Plain HTTP transmits passwords and data in unencrypted cleartext across public networks.',
      'HTTPS wraps HTTP in TLS encryption, providing Confidentiality, Integrity, and Authentication.',
      'Digital certificates verify that you are communicating with the genuine domain owner.'
    ],
    '### Why Plain HTTP Is Dangerous on Public Networks

In plain HTTP, every message travels as cleartext. Anyone between you and the server (such as an untrusted café Wi-Fi router) can inspect, steal, or tamper with your session tokens and passwords.

```mermaid
graph TD
    classDef plain fill:#7f1d1d,stroke:#ef4444,stroke-width:2px,color:#fff;
    classDef crypt fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff;

    subgraph Plain HTTP (Insecure)
        C1["Browser"] -->|"GET /login Password=secret123 (Cleartext!)"| S1["Server"]
    end
    
    subgraph Secure HTTPS (TLS Encrypted)
        C2["Browser"] -->|"🔒 Encrypted Ciphertext: %9A#f8!k2... (Unreadable!)"| S2["Server"]
    end
```

### The 3 Pillars of HTTPS (TLS)
1. **Confidentiality (Encryption)**: Eavesdroppers cannot read your traffic.
2. **Integrity**: Intermediaries cannot alter responses or inject malware in transit.
3. **Authentication**: Cryptographic certificates guarantee you are connected to the genuine server.'
  );

  -- ----------------------------------------------------------------------------
  -- SECTION 6: Browser DevTools & The Network Tab: Inspecting the Wire
  -- ----------------------------------------------------------------------------
  INSERT INTO public.lesson_sections (
    id, lesson_id, section_order, section_type, section_title, section_slug,
    section_learning_goal, estimated_minutes, diagram_reference, key_takeaways, section_content
  ) VALUES (
    v_sec6_id,
    v_lesson_id,
    6,
    'tooling_guide',
    'Browser DevTools & The Network Tab: Inspecting the Wire',
    'devtools-network-tab-inspection',
    'Open browser DevTools, filter requests, and inspect live HTTP headers and response payloads.',
    15,
    jsonb_build_object(
      'type', 'devtools_column_map',
      'caption', 'DevTools Network Tab Column Map and Request Drawer'
    ),
    ARRAY[
      'DevTools is built into every major browser (F12 or Ctrl+Shift+I / Cmd+Opt+I).',
      'The Network Tab logs every live HTTP request sent and received over the wire in real time.',
      'Clicking any request exposes its General status, Headers, and raw Response Body preview.'
    ],
    '### Opening Your Window into the Wire

Every browser includes built-in **Developer Tools** (press `F12` or `Ctrl+Shift+I` on Windows/Linux; `Cmd+Option+I` on macOS).

### The 4-Step Network Tab Investigation:
1. **Open the Network Tab**: Open DevTools and click the **Network** tab at the top.
2. **Reload the Page**: Press `Ctrl+R` / `Cmd+R` with the Network tab open to record live requests.
3. **Filter for Data (Fetch/XHR)**: Click the **Fetch/XHR** filter button to isolate pure API and data requests from images/fonts.
4. **Inspect Request Details**: Click any request row to inspect:
   - **General**: Request URL, Method (`GET`/`POST`), Status Code (`200 OK`).
   - **Headers**: Request & Response headers.
   - **Preview / Response**: View raw JSON or text payload returned by the server.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              INSPECTING A REQUEST IN DEVTOOLS                          │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  Headers   Payload   [Preview]   Response   Initiator   Timing                         │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ ▼ General                                                                              │
│   Request URL: https://api.github.com/users/octocat                                    │
│   Request Method: GET                                                                  │
│   Status Code: 200 OK                                                                  │
│   Remote Address: 140.82.121.4:443                                                     │
│                                                                                        │
│ ▼ Response Headers                                                                     │
│   content-type: application/json; charset=utf-8                                        │
│                                                                                        │
│ ▼ Response Body Preview                                                                │
│   { "login": "octocat", "id": 583231, "name": "The Octocat" }                          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```'
  );

  -- ----------------------------------------------------------------------------
  -- SECTION 7: Synthesis: Real-World Diagnostics & Mental Model Anchors
  -- ----------------------------------------------------------------------------
  INSERT INTO public.lesson_sections (
    id, lesson_id, section_order, section_type, section_title, section_slug,
    section_learning_goal, estimated_minutes, diagram_reference, key_takeaways, section_content
  ) VALUES (
    v_sec7_id,
    v_lesson_id,
    7,
    'synthesis',
    'Synthesis: Real-World Diagnostics & Mental Model Anchors',
    'synthesis-diagnostics-misconceptions',
    'Synthesize web networking primitives to troubleshoot real-world failure scenarios and avoid common beginner misconceptions.',
    15,
    jsonb_build_object(
      'type', 'diagnostics_flowchart',
      'caption', 'Web Diagnostics Decision Matrix'
    ),
    ARRAY[
      'The browser is only a client application; Google is a website/service, not the internet itself.',
      'JSON is plain data, not executable programming code.',
      'System diagnostic fluency begins by checking the status code and response payload in the Network Tab.'
    ],
    '### Common Beginner Misconceptions

| Misconception | The Reality | Why It Matters |
| :--- | :--- | :--- |
| **"The browser is the internet."** | The browser is a local client app that displays server responses. | You can communicate with servers via CLI (`curl`), apps, or AI bots without any browser. |
| **"Google is the internet."** | Google is a search service hosted on cloud servers. | The internet functions even when individual search engines experience downtime. |
| **"DNS hosts the website."** | DNS only translates domain names into IP addresses. | A DNS outage prevents lookup, even if the target web server is running perfectly. |
| **"JSON is programming code."** | JSON is pure text data structure. | JSON contains no executable logic and cannot run programs. |

### Ready for Hands-On Diagnostics
In **`EXE-00-03: Network Request Investigation & HTTP Diagnostics`**, you will step into an interactive network simulation workbench to inspect live request streams, troubleshoot HTTP status codes (`401`, `404`, `502`, `504`), and validate JSON API payloads.'
  );

  -- ----------------------------------------------------------------------------
  -- FORMATIVE CHECKPOINTS
  -- ----------------------------------------------------------------------------
  INSERT INTO public.lesson_checkpoints (
    lesson_id, section_id, checkpoint_order, question, options, correct_option_index, explanation, target_concept
  ) VALUES
  (
    v_lesson_id,
    v_sec2_id,
    1,
    'When you enter "https://github.com/explore" into your browser and press Enter, what system translates the human domain name "github.com" into the machine IP address "140.82.121.4"?',
    '["The Local Operating System Kernel", "The Domain Name System (DNS)", "The HyperText Transfer Protocol (HTTP)", "The POSIX Shell Stream"]'::jsonb,
    1,
    'DNS functions as the internet''s global phone book, translating human-friendly domain names into machine-routable numerical IP addresses.',
    'DNS_IP_TRANSLATION'
  ),
  (
    v_lesson_id,
    v_sec3_id,
    2,
    'Which HTTP method should a client application use when retrieving a user''s public profile without altering any data on the server?',
    '["POST", "GET", "DELETE", "PATCH"]'::jsonb,
    1,
    'GET is the standard HTTP method used to fetch and read resources safely without mutating server state.',
    'HTTP_GET_METHOD'
  ),
  (
    v_lesson_id,
    v_sec4_id,
    3,
    'A user clicks a checkout button and the screen displays an HTTP 504 Gateway Timeout status code. What does this code indicate?',
    '["The user entered an invalid password", "The browser is missing an HTML file on local disk", "An upstream cloud server took too long or failed to respond", "The user''s internet cable is unplugged"]'::jsonb,
    2,
    '5xx status codes indicate server-side failures. A 504 Gateway Timeout specifically means an intermediary or upstream cloud server timed out while waiting for a response.',
    'HTTP_5XX_SERVER_ERRORS'
  ),
  (
    v_lesson_id,
    v_sec5_id,
    4,
    'Why is HTTPS required for modern websites instead of plain HTTP?',
    '["HTTPS compresses text files to save disk space", "HTTPS encrypts network traffic with TLS to protect passwords and session tokens from eavesdropping and tampering", "HTTPS allows websites to work without IP addresses", "HTTPS replaces HTML with JSON"]'::jsonb,
    1,
    'HTTPS uses TLS encryption to provide Confidentiality, Data Integrity, and Server Authentication across public networks.',
    'HTTPS_TLS_SECURITY'
  ),
  (
    v_lesson_id,
    v_sec6_id,
    5,
    'You open your browser DevTools to diagnose why an API call failed. Which tab displays every live HTTP request, status code, header, and response payload in real time?',
    '["Elements Tab", "Console Tab", "Network Tab", "Application Tab"]'::jsonb,
    2,
    'The Network Tab logs and inspects all real-time network traffic exchanged between the browser client and external web servers.',
    'DEVTOOLS_NETWORK_INSPECTION'
  );

END $$;
