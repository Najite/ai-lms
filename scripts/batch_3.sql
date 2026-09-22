UPDATE curriculum_nodes 
SET title = 'Lesson 0.21: Text Manipulation, String Methods & Cleaning', 
    subtitle = 'Prerequisites: Lesson 0.3', 
    cs_foundation = 'Prerequisites: Lesson 0.3 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.21: Text Manipulation, String Methods & Cleaning

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.3
- **Subtopics**:
  - `0.21.1` Real-world text cleaning: stripping unwanted whitespace, tabs, and newlines (`strip`, `lstrip`, `rstrip`).
  - `0.21.2` Case transformations and normalization: `lower()`, `upper()`, and case-insensitive matching.
  - `0.21.3` Finding, counting, and replacing text patterns: `.find()`, `.count()`, and `.replace()`.
  - `0.21.4` Splitting and joining text: converting paragraphs to word lists with `.split()` and reconstructing with `.join()`.
- **Key Failure Modes & Edge Cases**: Modifying strings expecting them to change in-place; strings are immutable in Python, so the result must be reassigned.
- **Verification & Mastery Check**: Write a text sanitizer function that removes leading numbers, strips extraneous whitespace, and lowercases user prompts.
- **Project Application**: PromptCLI: Raw prompt preprocessing and token sanitization.'
WHERE id = 'node-0-21';

UPDATE curriculum_nodes 
SET title = 'Lesson 0.22: Working with Python Lists & Collections', 
    subtitle = 'Prerequisites: Lesson 0.6', 
    cs_foundation = 'Prerequisites: Lesson 0.6 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.22: Working with Python Lists & Collections

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.6
- **Subtopics**:
  - `0.22.1` The Python List: storing ordered collections of items in numbered positions.
  - `0.22.2` Modifying lists: `.append()`, `.extend()`, `.insert()`, `.pop()`, and `.remove()`.
  - `0.22.3` Slicing lists: extracting sub-lists with `[start:stop:step]` syntax.
  - `0.22.4` Checking membership: using `in` and `not in` to test if an item exists in a collection.
- **Key Failure Modes & Edge Cases**: Calling `.pop()` or accessing an index on an empty list, triggering an `IndexError`.
- **Verification & Mastery Check**: Build a conversation history list where new messages are appended, and only the 5 most recent turns are retained.
- **Project Application**: PromptCLI: Multi-turn chat message history buffer.'
WHERE id = 'node-0-22';

UPDATE curriculum_nodes 
SET title = 'Lesson 0.23: List Comprehensions & Data Transformations', 
    subtitle = 'Prerequisites: Lesson 0.22', 
    cs_foundation = 'Prerequisites: Lesson 0.22 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.23: List Comprehensions & Data Transformations

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.22
- **Subtopics**:
  - `0.23.1` The List Comprehension syntax: transforming lists in a single readable line.
  - `0.23.2` Filtering with conditionals: `[item for item in items if condition]`.
  - `0.23.3` Transforming text data: stripping and normalizing an entire batch of inputs at once.
  - `0.23.4` When to use comprehensions vs regular loops for clean, maintainable code.
- **Key Failure Modes & Edge Cases**: Nesting three or more list comprehensions, creating unreadable "clever" code that teammates cannot debug.
- **Verification & Mastery Check**: Take a list of raw user inputs and produce a cleaned list of non-empty prompts in a single comprehension.
- **Project Application**: PromptCLI: Batch prompt cleanup and extraction.'
WHERE id = 'node-0-23';

UPDATE curriculum_nodes 
SET title = 'Lesson 0.24: Dictionaries: Keys, Values & Fast Lookups', 
    subtitle = 'Prerequisites: Lesson 0.22', 
    cs_foundation = 'Prerequisites: Lesson 0.22 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.24: Dictionaries: Keys, Values & Fast Lookups

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.22
- **Subtopics**:
  - `0.24.1` The Dictionary mental model: pairing unique keys with stored values (like a phone contact list).
  - `0.24.2` Adding, updating, and removing dictionary entries.
  - `0.24.3` Safe lookups: using `.get(key, default)` to prevent unhandled `KeyError` crashes.
  - `0.24.4` Iterating over dictionaries: accessing `.keys()`, `.values()`, and `.items()`.
- **Key Failure Modes & Edge Cases**: Accessing a missing dictionary key with brackets (`dict[key]`) rather than `.get()`, crashing the application.
- **Verification & Mastery Check**: Build a model pricing dictionary and look up the per-token cost for an arbitrary model name safely.
- **Project Application**: PromptCLI: Dynamic AI model parameter and pricing lookup.'
WHERE id = 'node-0-24';

UPDATE curriculum_nodes 
SET title = 'Lesson 0.25: Sets & Unique Item Filtering', 
    subtitle = 'Prerequisites: Lesson 0.24', 
    cs_foundation = 'Prerequisites: Lesson 0.24 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.25: Sets & Unique Item Filtering

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.24
- **Subtopics**:
  - `0.25.1` What is a Set: an unordered collection that automatically enforces uniqueness.
  - `0.25.2` Instant deduplication: turning lists into sets with `set(my_list)`.
  - `0.25.3` Fast membership testing: why checking `item in my_set` is lightning-fast compared to lists.
  - `0.25.4` Set operations: union, intersection, and difference between collections.
- **Key Failure Modes & Edge Cases**: Trying to index into a set with `my_set[0]`; sets are unordered and do not support indexing.
- **Verification & Mastery Check**: Given a list of 1,000 prompt tags with duplicates, extract the unique tags and find overlapping tags with a whitelist.
- **Project Application**: PromptCLI: User prompt tag deduplication and stopword filtering.'
WHERE id = 'node-0-25';

UPDATE curriculum_nodes 
SET title = 'Lesson 0.26: Reading and Writing Files in Python', 
    subtitle = 'Prerequisites: Lesson 0.8', 
    cs_foundation = 'Prerequisites: Lesson 0.8 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.26: Reading and Writing Files in Python

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.8
- **Subtopics**:
  - `0.26.1` The file system mental model: folders, files, relative paths vs absolute paths.
  - `0.26.2` Opening files safely: the `with open(...) as f:` context manager that closes files automatically.
  - `0.26.3` Reading files: `.read()`, `.readline()`, and iterating over lines efficiently.
  - `0.26.4` Writing files: write mode (`"w"`) vs append mode (`"a"`).
- **Key Failure Modes & Edge Cases**: Using write mode (`"w"`) instead of append mode (`"a"`), accidentally erasing existing file contents.
- **Verification & Mastery Check**: Write a script that reads a prompt template from a `.txt` file, substitutes the user''s name, and appends the result to a log file.
- **Project Application**: PromptCLI: Local prompt template loading and output logging.'
WHERE id = 'node-0-26';

UPDATE curriculum_nodes 
SET title = 'Lesson 0.27: JSON Data: Serialization and Parsing', 
    subtitle = 'Prerequisites: Lesson 0.24, Lesson 0.26', 
    cs_foundation = 'Prerequisites: Lesson 0.24, Lesson 0.26 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.27: JSON Data: Serialization and Parsing

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.24, Lesson 0.26
- **Subtopics**:
  - `0.27.1` What is JSON: the universal data format used by modern web apps and AI APIs.
  - `0.27.2` Parsing JSON text into Python dictionaries using `json.loads()`.
  - `0.27.3` Serializing Python dictionaries into JSON text using `json.dumps()`.
  - `0.27.4` Reading and writing `.json` files directly with `json.load()` and `json.dump()`.
- **Key Failure Modes & Edge Cases**: Passing invalid JSON strings (like single quotes or trailing commas) to `json.loads()`, causing `JSONDecodeError`.
- **Verification & Mastery Check**: Parse a simulated LLM JSON response string, extract the message content, and save the structured record to `session.json`.
- **Project Application**: PromptCLI: Configuration management and structured response logging.'
WHERE id = 'node-0-27';

UPDATE curriculum_nodes 
SET title = 'Lesson 0.28: Error Handling: try, except & Graceful Recovery', 
    subtitle = 'Prerequisites: Lesson 0.8', 
    cs_foundation = 'Prerequisites: Lesson 0.8 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.28: Error Handling: try, except & Graceful Recovery

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.8
- **Subtopics**:
  - `0.28.1` Why programs fail: syntax errors vs runtime exceptions.
  - `0.28.2` Catching errors with `try` and `except`: keeping your application running when inputs are invalid.
  - `0.28.3` Specific exception types: `ValueError`, `KeyError`, `FileNotFoundError`, `TypeError`.
  - `0.28.4` The `finally` and `else` blocks: running cleanup routines reliably.
- **Key Failure Modes & Edge Cases**: Using a bare `except:` clause without specifying the error type, silently masking fatal bugs.
- **Verification & Mastery Check**: Write a robust file-reading function that catches `FileNotFoundError` and returns a friendly default prompt without crashing.
- **Project Application**: PromptCLI: Resilient input parser and configuration loader.'
WHERE id = 'node-0-28';

UPDATE curriculum_nodes 
SET title = 'Lesson 0.29: Environment Variables & Secrets Management', 
    subtitle = 'Prerequisites: Lesson 0.26', 
    cs_foundation = 'Prerequisites: Lesson 0.26 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.29: Environment Variables & Secrets Management

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.26
- **Subtopics**:
  - `0.29.1` Why hardcoding secrets is dangerous: keeping API keys out of Git repositories.
  - `0.29.2` Reading environment variables with Python''s built-in `os.environ` and `os.getenv()`.
  - `0.29.3` Using `.env` files locally with `python-dotenv`.
  - `0.29.4` The `.gitignore` file: preventing secrets and local caches from ever being committed to GitHub.
- **Key Failure Modes & Edge Cases**: Committing an un-ignored `.env` file to a public repository, exposing production AI API keys.
- **Verification & Mastery Check**: Configure a script that loads an `OPENAI_API_KEY` from a local `.env` file, printing an error if the key is missing.
- **Project Application**: PromptCLI: Secure API key configuration manager.'
WHERE id = 'node-0-29';

UPDATE curriculum_nodes 
SET title = 'Lesson 0.30: Making HTTP GET and POST Requests with HTTPX', 
    subtitle = 'Prerequisites: Lesson 0.27, Lesson 0.29', 
    cs_foundation = 'Prerequisites: Lesson 0.27, Lesson 0.29 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.30: Making HTTP GET and POST Requests with HTTPX

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.27, Lesson 0.29
- **Subtopics**:
  - `0.30.1` The Client-Server model: how your computer talks to remote API servers across the internet.
  - `0.30.2` HTTP verbs: GET (fetching data) vs POST (submitting prompts and payloads).
  - `0.30.3` Sending headers: authentication tokens (`Bearer ...`) and Content-Type (`application/json`).
  - `0.30.4` Checking status codes: 200 (OK), 400 (Bad Request), 401 (Unauthorized), 429 (Rate Limited), 500 (Server Error).
- **Key Failure Modes & Edge Cases**: Forgetting to check `.status_code` or call `.raise_for_status()`, leading to subtle bugs on failed requests.
- **Verification & Mastery Check**: Send an HTTP POST request to a mock JSON endpoint using `httpx` and verify the status code is 200.
- **Project Application**: PromptCLI: Remote AI inference gateway client.'
WHERE id = 'node-0-30';