UPDATE curriculum_nodes 
SET title = 'Lesson 0.31: Handling Network Timeouts & Exponential Backoff', 
    subtitle = 'Prerequisites: Lesson 0.30', 
    cs_foundation = 'Prerequisites: Lesson 0.30 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.31: Handling Network Timeouts & Exponential Backoff

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.30
- **Subtopics**:
  - `0.31.1` Transient network failures: why remote API calls will inevitably fail in production.
  - `0.31.2` Setting request timeouts: preventing programs from hanging forever when servers lag.
  - `0.31.3` The Exponential Backoff algorithm: waiting 1s, 2s, 4s before retrying to prevent overwhelming servers.
  - `0.31.4` Adding random jitter: avoiding retry storms across distributed clients.
- **Key Failure Modes & Edge Cases**: Retrying immediately in a tight `while` loop without backoff, getting your IP permanently rate-limited.
- **Verification & Mastery Check**: Implement a retry loop that retries a failing simulated HTTP request up to 3 times with exponential backoff.
- **Project Application**: PromptCLI: Automated network retry resilience engine.'
WHERE id = 'node-0-31';

UPDATE curriculum_nodes 
SET title = 'Lesson 0.32: Parsing XML, Markdown & Unstructured AI Text', 
    subtitle = 'Prerequisites: Lesson 0.21', 
    cs_foundation = 'Prerequisites: Lesson 0.21 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.32: Parsing XML, Markdown & Unstructured AI Text

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.21
- **Subtopics**:
  - `0.32.1` The reality of AI outputs: why models often return markdown code blocks, XML tags, or conversational text.
  - `0.32.2` Extracting text between XML tags (e.g., `<thought>...</thought>` or `<answer>...</answer>`).
  - `0.32.3` Stripping markdown code fences: extracting clean JSON from ` ```json ... ``` ` blocks.
  - `0.32.4` Regular expressions for text extraction: using `re.search()` to isolate structured patterns.
- **Key Failure Modes & Edge Cases**: Assuming an LLM will return pure JSON without markdown backticks, causing `json.loads()` to crash.
- **Verification & Mastery Check**: Write a robust extractor that extracts valid JSON from a response string wrapped in conversational filler and markdown fences.
- **Project Application**: PromptCLI: Response parser and code block extractor.'
WHERE id = 'node-0-32';

UPDATE curriculum_nodes 
SET title = 'Lesson 0.33: Command-Line Arguments with Argparse', 
    subtitle = 'Prerequisites: Lesson 0.8', 
    cs_foundation = 'Prerequisites: Lesson 0.8 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.33: Command-Line Arguments with Argparse

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.8
- **Subtopics**:
  - `0.33.1` Why CLI tools matter: running scripts with flags and options directly from the terminal.
  - `0.33.2` Python''s `argparse` module: defining positional arguments and optional flags (`--model`, `--temp`).
  - `0.33.3` Type casting and default values: automatically converting string inputs to integers or floats.
  - `0.33.4` Generating automated help menus: `--help` documentation generated directly from argument descriptions.
- **Key Failure Modes & Edge Cases**: Failing to provide help descriptions, making command-line tools impossible for teammates to use.
- **Verification & Mastery Check**: Build a CLI script `prompt_tool.py` that takes `--prompt`, `--temperature`, and `--verbose` flags and prints the settings.
- **Project Application**: PromptCLI: Terminal CLI argument parsing interface.'
WHERE id = 'node-0-33';

UPDATE curriculum_nodes 
SET title = 'Lesson 0.34: Packaging Reusable Modules & Python Imports', 
    subtitle = 'Prerequisites: Lesson 0.8', 
    cs_foundation = 'Prerequisites: Lesson 0.8 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.34: Packaging Reusable Modules & Python Imports

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.8
- **Subtopics**:
  - `0.34.1` Breaking scripts into modules: separating logic into multiple `.py` files.
  - `0.34.2` Import statements: `import utils`, `from config import MODEL_NAME`.
  - `0.34.3` The `if __name__ == "__main__":` idiom: making files both importable modules and executable scripts.
  - `0.34.4` Creating packages: using folders and `__init__.py` to organize multi-file projects.
- **Key Failure Modes & Edge Cases**: Circular imports where module A imports module B and module B imports module A, causing import crashes.
- **Verification & Mastery Check**: Organize a 3-file project (`main.py`, `prompt_templates.py`, `api_client.py`) and successfully run the application.
- **Project Application**: PromptCLI: Modular codebase architecture.'
WHERE id = 'node-0-34';

UPDATE curriculum_nodes 
SET title = 'Lesson 0.35: Virtual Environments & Modern Package Management (uv / pip)', 
    subtitle = 'Prerequisites: Lesson 0.34', 
    cs_foundation = 'Prerequisites: Lesson 0.34 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.35: Virtual Environments & Modern Package Management (uv / pip)

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.34
- **Subtopics**:
  - `0.35.1` Why virtual environments exist: preventing dependency version conflicts across projects.
  - `0.35.2` Creating and activating environments with `python -m venv .venv`.
  - `0.35.3` Installing dependencies with `pip install` and generating `requirements.txt`.
  - `0.35.4` Ultra-fast modern package management with `uv`: lightning-fast dependency resolution.
- **Key Failure Modes & Edge Cases**: Installing packages into the global system Python instead of an active virtual environment.
- **Verification & Mastery Check**: Create an isolated `.venv`, install `httpx` and `pydantic`, and export a pinned `requirements.txt`.
- **Project Application**: PromptCLI: Isolated dependency blueprint.'
WHERE id = 'node-0-35';

UPDATE curriculum_nodes 
SET title = 'Lesson 0.36: Modern Python Type Hints & Static Typing', 
    subtitle = 'Prerequisites: Lesson 0.8', 
    cs_foundation = 'Prerequisites: Lesson 0.8 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.36: Modern Python Type Hints & Static Typing

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.8
- **Subtopics**:
  - `0.36.1` Why type hints matter: catching bugs before running code and unlocking superior IDE autocomplete.
  - `0.36.2` Basic type annotations: `name: str`, `age: int`, `score: float`, `is_active: bool`.
  - `0.36.3` Container types: `list[str]`, `dict[str, int]`, `tuple[int, int]`.
  - `0.36.4` Optional and Union types: `str | None` for values that might be missing.
- **Key Failure Modes & Edge Cases**: Assuming Python enforces types at runtime; type hints are for static analysis and tools like Mypy/IDE, not runtime checks.
- **Verification & Mastery Check**: Annotate a prompt-formatting function with full parameter and return types, verifying it with `mypy`.
- **Project Application**: PromptCLI: Type-safe prompt orchestration pipeline.'
WHERE id = 'node-0-36';

UPDATE curriculum_nodes 
SET title = 'Lesson 0.37: Introduction to Pydantic: Data Validation from Scratch', 
    subtitle = 'Prerequisites: Lesson 0.36', 
    cs_foundation = 'Prerequisites: Lesson 0.36 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.37: Introduction to Pydantic: Data Validation from Scratch

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.36
- **Subtopics**:
  - `0.37.1` The Pydantic mental model: turning loose dictionaries into guaranteed, validated data models.
  - `0.37.2` Creating a `BaseModel`: defining fields, default values, and required attributes.
  - `0.37.3` Automatic type coercion: how Pydantic cleanly converts strings like `"123"` into integers `123`.
  - `0.37.4` Catching validation errors: inspecting `ValidationError` when data fails to meet schema rules.
- **Key Failure Modes & Edge Cases**: Passing invalid data into Pydantic models without a `try/except ValidationError` block.
- **Verification & Mastery Check**: Define an `AIResponse` Pydantic model with fields `content: str`, `tokens: int`, and validate a dirty dictionary against it.
- **Project Application**: PromptCLI: Structured output validation foundation.'
WHERE id = 'node-0-37';

UPDATE curriculum_nodes 
SET title = 'Lesson 0.38: Git Fundamentals: Commits, History & Diffs', 
    subtitle = 'Prerequisites: Lesson 0.26', 
    cs_foundation = 'Prerequisites: Lesson 0.26 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.38: Git Fundamentals: Commits, History & Diffs

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.26
- **Subtopics**:
  - `0.38.1` Why version control is mandatory: time-traveling through project history and safe experimentation.
  - `0.38.2` The 3 Git states: Working Directory, Staging Area (`git add`), and Repository (`git commit`).
  - `0.38.3` Writing meaningful commit messages: describing the "why" rather than just the "what".
  - `0.38.4` Inspecting changes: using `git status`, `git diff`, and `git log --oneline`.
- **Key Failure Modes & Edge Cases**: Running `git add .` without checking `git status`, accidentally staging sensitive `.env` files.
- **Verification & Mastery Check**: Initialize a Git repository, stage files, make 3 distinct commits, and view the commit history log.
- **Project Application**: PromptCLI: Version control initialization.'
WHERE id = 'node-0-38';

UPDATE curriculum_nodes 
SET title = 'Lesson 0.39: Git Branching & Merging Workflows', 
    subtitle = 'Prerequisites: Lesson 0.38', 
    cs_foundation = 'Prerequisites: Lesson 0.38 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.39: Git Branching & Merging Workflows

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.38
- **Subtopics**:
  - `0.39.1` Why branch: developing new features or prompt experiments in isolation without breaking the main codebase.
  - `0.39.2` Creating and switching branches: `git branch` and `git switch -c feature-prompt-v2`.
  - `0.39.3` Merging branches: bringing feature changes cleanly into the `main` branch.
  - `0.39.4` Resolving merge conflicts calmly: understanding conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`).
- **Key Failure Modes & Edge Cases**: Panic-deleting code during merge conflicts; conflict markers are simply Git asking you to choose which version to keep.
- **Verification & Mastery Check**: Create a feature branch, make a change, merge it into main, and cleanly delete the feature branch.
- **Project Application**: PromptCLI: Feature branch workflow for prompt enhancements.'
WHERE id = 'node-0-39';

UPDATE curriculum_nodes 
SET title = 'Lesson 0.40: Remote Repositories & GitHub Collaboration', 
    subtitle = 'Prerequisites: Lesson 0.39', 
    cs_foundation = 'Prerequisites: Lesson 0.39 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.40: Remote Repositories & GitHub Collaboration

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.39
- **Subtopics**:
  - `0.40.1` Local vs Remote: connecting local Git repositories to GitHub with `git remote add origin`.
  - `0.40.2` Pushing and pulling: `git push -u origin main` and `git pull`.
  - `0.40.3` Pull Requests (PRs): proposing changes, code review etiquette, and automated CI checks.
  - `0.40.4` Writing a professional README.md: explaining how to install, configure, and run your project.
- **Key Failure Modes & Edge Cases**: Pushing directly to `main` without testing, breaking the production deployment for other engineers.
- **Verification & Mastery Check**: Write a clean, comprehensive `README.md` for a project including installation, configuration, and example usage.
- **Project Application**: PromptCLI: Open-source project portfolio presentation.'
WHERE id = 'node-0-40';