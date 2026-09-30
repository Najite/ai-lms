-- ==============================================================================
-- Migration: 20260930_seed_mod00_lessons.sql
-- Description: Seeds the canonical 5 lessons and competency alignments for
--              MOD-00 (Digital & Developer Foundations: From User to Systems Operator).
-- Idempotency: Fully idempotent using UPSERT (ON CONFLICT (module_id, slug) DO UPDATE).
-- Safety: Preserves existing foreign keys, user learning progress, and referential integrity.
-- Target DB: Supabase PostgreSQL 15.1+ (ai-native-lms)
-- Author: Principal Database Architect, Curriculum Systems Engineer & LMS Migration Specialist
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- 1. Declare and Verify Parent Module (MOD-00)
-- ------------------------------------------------------------------------------
DO $$
DECLARE
    v_mod00_id UUID;
BEGIN
    SELECT id INTO v_mod00_id 
    FROM public.modules 
    WHERE slug = 'mod-00-digital-foundations';

    IF v_mod00_id IS NULL THEN
        RAISE EXCEPTION 'CRITICAL: Parent module MOD-00 (mod-00-digital-foundations) not found in public.modules.';
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 2. Seed MOD-00 Canonical Lessons (5 Lessons)
-- ------------------------------------------------------------------------------

-- Lesson 1: LES-00-01
INSERT INTO public.lessons (
    id,
    module_id,
    slug,
    title,
    summary,
    content,
    order_index,
    estimated_minutes,
    is_published,
    created_at,
    updated_at
) VALUES (
    'c0000000-0000-0000-0000-000000000001',
    (SELECT id FROM public.modules WHERE slug = 'mod-00-digital-foundations'),
    'les-00-01-files-folders-posix-filesystem',
    'Files, Folders & The POSIX Filesystem Mental Model',
    'Discover how cloud servers, Docker containers, and Git repositories organize information using the filesystem tree, absolute and relative path navigation, and security permissions.',
    '---
lesson_code: "LES-00-01"
source_path: "lessons/les-00-01.md"
blueprint_path: "lessons/les-00-01-blueprint.md"
version: "1.0.0"
status: "canonical_reference"
target_competency: "DEV-00"
target_gate: "gate-1-foundations"
prerequisites: []
---

# LES-00-01: Files, Folders & The POSIX Filesystem Mental Model

**Module:** MOD-00 Digital Foundations  
**Phase:** Phase 1 (Month 1, Week 1)  
**Target Competency:** `DEV-00` (Tooling & Development Environment)  
**Estimated Total Effort:** 6.0 Hours Total Dedicated Effort (60–90 min core reading + interactive sandbox drills & reflection)  
**Prerequisites:** None (Complete Beginner Baseline)

---

### Why This Matters

Every modern technology you will build or work with—from cloud servers running on AWS to Docker containers packaging applications, Git repositories tracking project code, and deployment environments serving millions of users—relies on the exact same underlying filesystem rules.

In production environments, a substantial number of cloud deployment failures, container startup crashes, and build errors trace directly back to misspelled path coordinates or misconfigured file permissions.

Understanding how files and folders are structured gives you the foundational map of the computer. Once you understand this map, working with servers, containers, and codebases will feel intuitive and natural instead of intimidating.

---

### What You Will Learn

- **Explain the root directory (`/`)**: Understand the single origin point where every file and folder in the entire computer begins.
- **Locate your home directory (`~`)**: Confidently find and manage your private personal workspace.
- **Distinguish absolute and relative paths**: Give exact global addresses or step-by-step directions to find any file from anywhere.
- **Identify hidden configuration files**: Recognize dotfiles (like `.config` or `.env`) that store background application settings.
- **Interpret read, write, and execute permissions (`rwx`)**: Read security settings to know who can view, edit, or run any file.

---

### Prerequisites

- ✅ **No coding experience required**: You do not need to know any programming language.
- ✅ **No terminal or command-line experience required**: We start from a visual baseline before typing commands.
- ✅ **No Linux experience required**: Everything is explained clearly with everyday analogies and visual diagrams.
- ✅ **Just your computer and a web browser**: A working keyboard, screen, and curiosity about how software works under the hood.

---

## 1. The Story of the Missing Slash

In 2019, an automated cleanup program on a large payment server was instructed to delete temporary junk files located in a folder written as `temp/logs`.

The person who wrote the instruction forgot a single leading forward slash (`/`).

Because the slash was missing, the computer did not look at the main system storage. Instead, it looked inside the folder where it was currently standing—which happened to be the core system folder of the computer. The computer followed the instruction faithfully and erased crucial operating system files.

The resulting outage lasted 14 hours and prevented millions of people from buying groceries or paying bills.

The computer did not make a mistake. It followed an exact address instruction.

Understanding how files, folders, and path addresses work is the very first step to becoming a confident software engineer.

---

## 2. The Inverted Tree: Moving Beyond Desktop Icons

When you look at your computer screen, you see files scattered on your "Desktop." This often makes it feel like the Desktop is the top or center of your computer.

In reality, your Desktop is just an ordinary folder tucked away inside your personal user account.

Computers organize all files and folders in a structure called an **Inverted Tree** (an upside-down tree). Unlike a natural tree that grows upward from the ground, the computer''s tree starts at the very top with a single origin point and branches downward into more and more folders.

```mermaid
graph TD
    classDef root fill:#1e293b,stroke:#ef4444,stroke-width:3px,color:#fff;
    classDef sys fill:#0f172a,stroke:#8b5cf6,stroke-width:2px,color:#fff;
    classDef usr fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff;

    ROOT["/ (Root - The Very Top)"]:::root
    ROOT --> BIN["/bin (System Programs)"]:::sys
    ROOT --> ETC["/etc (System Settings)"]:::sys
    ROOT --> HOME["/home (User Accounts)"]:::sys
    ROOT --> VAR["/var (Logs & Data)"]:::sys
    ROOT --> TMP["/tmp (Temporary Files)"]:::sys

    HOME --> ALEX["/home/alex (Your Personal Workspace ~)"]:::usr
    ALEX --> DOCS["Documents/"]:::usr
    ALEX --> DESK["Desktop/"]:::usr
    ALEX --> PROJ["projects/"]:::usr
    PROJ --> APP["my-app/"]:::usr
```

---

## 3. The Three Fundamental Anchors of the Filesystem

To find your way around the filesystem tree, you only need to know three core anchors:

1. **The Root Directory (`/`)**: 
   The single forward slash represents the absolute top of the entire computer. Every single file, folder, program, and connected drive lives underneath `/`. There is nothing above Root.
2. **The User Home Directory (`~` or `/home/yourname`)**: 
   Computers are built so multiple people can use the same machine safely. Each person gets their own private workspace inside `/home/`. The tilde symbol (`~`) is a convenient universal shortcut that always stands for "my home folder."
3. **The Current Working Directory**: 
   At any given moment, the computer is "standing" inside one specific folder. The folder you are currently inside is called your **Current Working Directory**.

---

## 4. Absolute vs. Relative Paths: Finding Any File

To open, read, or change a file, you must tell the computer its **Path**—the address coordinates that guide the computer through the branches of the tree.

There are two ways to write any address: **Absolute Paths** and **Relative Paths**.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              PATH TYPES AT A GLANCE                                    │
├───────────────────┬──────────────────────────────────┬─────────────────────────────────┤
│ Path Type         │ How It Starts                    │ Everyday Analogy                │
├───────────────────┼──────────────────────────────────┼─────────────────────────────────┤
│ Absolute Path     │ Always starts with a slash (`/`) │ A Global Postal Address         │
│                   │                                  │ (Country, City, Street, Number) │
├───────────────────┼──────────────────────────────────┼─────────────────────────────────┤
│ Relative Path     │ Starts with a folder name,       │ Local Directions                │
│                   │ `.` (here), or `..` (up one level│ ("Walk two doors down the hall")│
└───────────────────┴──────────────────────────────────┴─────────────────────────────────┘
```

### 4.1 Absolute Paths: The Global Address
An **Absolute Path** gives the complete, exact address of a file starting all the way from the top Root (`/`). Because it starts at Root, an absolute path points to the exact same file no matter where you are currently standing.

- **Example 1**: `/etc/settings.txt`  
  *Meaning*: Start at Root (`/`), open the `etc` folder, and find `settings.txt`.
- **Example 2**: `/home/alex/projects/my-app/index.html`  
  *Meaning*: Start at Root (`/`), open `home`, open `alex`, open `projects`, open `my-app`, and find `index.html`.

> [!TIP]
> If a path starts with a forward slash (`/`), it is an **Absolute Path** anchored directly to Root.

---

### 4.2 Relative Paths: Directions from Where You Are Standing
A **Relative Path** gives directions to a file starting from your **Current Working Directory**. If you move to a different folder, the directions must change.

To write relative directions, you use three special shorthand symbols:
- `.` (Single Dot): "The folder I am currently inside."
- `..` (Double Dot): "The parent folder one level directly above me."
- `~` (Tilde): "My personal home folder."

```mermaid
graph LR
    classDef curr fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef step fill:#0f172a,stroke:#f59e0b,stroke-width:2px,color:#fff;
    classDef targ fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff;

    C["You Are Standing Here:<br/>/home/alex/projects/my-app"]:::curr -->|1. Step Up (..)| P["Parent Folder:<br/>/home/alex/projects"]:::step
    P -->|2. Step Up (..)| H["Your Home Folder:<br/>/home/alex"]:::step
    H -->|3. Enter Folder| D["Documents Folder:<br/>/home/alex/Documents"]:::step
    D -->|4. Target File| T["Target File:<br/>notes.txt"]:::targ
```

### 4.3 Step-by-Step Worked Example: Visiting a Sibling Folder

Imagine you are currently working inside this folder:  
`/home/alex/projects/my-app/`

You need to access a file called `notes.txt` inside your `Documents` folder:  
`/home/alex/Documents/notes.txt`

How do you give step-by-step relative directions?

1. **Step 1 (`..`)**: Step up one level out of `my-app` into `projects`. (Current path: `..`)
2. **Step 2 (`..`)**: Step up one more level out of `projects` into your home folder `alex`. (Current path: `../..`)
3. **Step 3 (`Documents/`)**: Step down into the `Documents` folder. (Current path: `../../Documents`)
4. **Step 4 (`notes.txt`)**: Target the file. (Final Relative Path: `../../Documents/notes.txt`)

---

## 5. Folders, Hidden Files & Basic Permissions

### What is a Folder Really?
Think of a folder as a labeled divider in a physical filing cabinet. It does not change the files inside it; it simply groups them together under a helpful name so both you and the computer can locate them quickly.

---

### Hidden Files (Dotfiles)
Sometimes you will see a file or folder whose name begins with a period, such as `.config` or `.my-settings`.

These are called **Dotfiles** or **Hidden Files**. 

They are not locked, dangerous, or secret. The computer simply hides them from everyday views so your workspace stays clean and free of background configuration settings.

---

### Basic Permissions: Read, Write, and Execute

In any computer shared by teams or connected to the internet, files need protection. The operating system provides three simple permission rights:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              THE THREE BASIC PERMISSIONS                               │
├────────────────────┬──────────┬────────────────────────────────────────────────────────┤
│ Permission Right   │ Symbol   │ What It Allows You To Do                               │
├────────────────────┼──────────┼────────────────────────────────────────────────────────┤
│ Read               │ `r`      │ Look inside the file and view its contents.            │
├────────────────────┼──────────┼────────────────────────────────────────────────────────┤
│ Write              │ `w`      │ Edit, modify, save changes, or delete the file.        │
├────────────────────┼──────────┼────────────────────────────────────────────────────────┤
│ Execute            │ `x`      │ Run the file as a program, tool, or script.            │
└────────────────────┴──────────┴────────────────────────────────────────────────────────┘
```

These three rights can be granted separately to:
- **The Owner**: The person who created the file.
- **The Group**: Teammates who share access.
- **Others**: Anyone else on the system.

For example, a normal document might allow the **Owner** to Read and Write (`rw`), while allowing **Others** only to Read (`r`). This prevents other people from accidentally deleting or altering your work.

*(In the next lesson, you will practice viewing and adjusting these permissions using the terminal).*

---

## 6. Common Beginner Traps & How to Avoid Them

### Trap 1: Forgetting the Leading Slash
When you want to point to a system folder at the top of the computer, forgetting the starting `/` changes the meaning completely:
- `etc/settings.txt` (Relative) &rarr; Looks for an `etc` folder inside *wherever you are right now*. If it is not there, you get an error.
- `/etc/settings.txt` (Absolute) &rarr; Accurately targets the settings file at the top of the computer every time.

---

### Trap 2: Spaces in File and Folder Names
In ordinary everyday use, you might name a file `My Project Notes 2026.txt`. 

To engineering tools and cloud servers, spaces look like separators between separate commands. This can confuse the system into thinking `My`, `Project`, `Notes`, and `2026.txt` are four different things.

Software engineers use hyphens or underscores instead of spaces:
- ✅ `my-project-notes-2026.txt` (Clear and reliable)
- ❌ `My Project Notes 2026.txt` (Can cause unexpected errors)

---

### Trap 3: Panic When Seeing "Permission Denied"
If you try to open or save a file and see `Permission Denied`, do not panic. It simply means the operating system is doing its job to protect a system file or another user''s workspace. You will learn how to handle permissions smoothly as you build your developer toolkit.

---

## 7. Key Takeaways & Coding Lab Bridge

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CORE LESSON TAKEAWAYS                                │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. Files and folders form an Inverted Tree starting at the top Root (`/`).             │
│ 2. An Absolute Path begins with `/` and gives an exact global address from Root.       │
│ 3. A Relative Path gives directions from where you are currently standing.             │
│ 4. `.` means "current folder", `..` means "parent folder above", and `~` means "home". │
│ 5. Files starting with `.` are hidden setting files (Dotfiles).                        │
│ 6. Permissions control who can Read (`r`), Write (`w`), and Execute (`x`) a file.     │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### Cognitive Self-Reflection

Take a moment to answer these two questions in your mind to confirm your mental model:

1. **Tree Hierarchy Question**: *If you are standing inside `/home/alex/projects`, what is the name of the folder directly one level above you (`..`)?*  
   *(Hint: Look at the path backwards—what folder contains `projects`?)*

2. **Path Addressing Question**: *Why does an absolute path like `/home/alex/notes.txt` always work from anywhere, while a relative path like `notes.txt` only works if you are already inside the `alex` folder?*

---

### Next Step: Your First Sandboxed Lab Challenge

You now have the complete mental map of the filesystem. It is time to see it in action.

Proceed to **`EXE-00-01: POSIX Filesystem Navigation & Directory Tree Reconstruction`**, where you will enter an interactive sandbox to explore folders and construct your first real directory tree.
',
    1,
    360,
    true,
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
) ON CONFLICT (module_id, slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    content = EXCLUDED.content,
    order_index = EXCLUDED.order_index,
    estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = EXCLUDED.is_published,
    updated_at = timezone('utc'::text, now());


-- Lesson 2: LES-00-02
INSERT INTO public.lessons (
    id,
    module_id,
    slug,
    title,
    summary,
    content,
    order_index,
    estimated_minutes,
    is_published,
    created_at,
    updated_at
) VALUES (
    'c0000000-0000-0000-0000-000000000002',
    (SELECT id FROM public.modules WHERE slug = 'mod-00-digital-foundations'),
    'les-00-02-cli-shell-streams',
    'The Command-Line Interface (CLI) & Shell Streams',
    'Understand the difference between terminal windows and shell interpreters, deconstruct command anatomy, and route data across standard streams (stdin, stdout, stderr) using pipes and redirection.',
    '---
lesson_code: "LES-00-02"
source_path: "lessons/les-00-02.md"
blueprint_path: "lessons/les-00-02-blueprint.md"
version: "1.0.0"
status: "canonical_reference"
target_competency: "DEV-00"
target_gate: "gate-1-foundations"
prerequisites: ["LES-00-01"]
---

# LES-00-02: The Command-Line Interface (CLI) & Shell Streams

**Module:** MOD-00 Digital Foundations  
**Phase:** Phase 1 (Month 1, Week 1)  
**Target Competency:** `DEV-00` (Tooling & Development Environment)  
**Estimated Time:** 60–90 minutes  
**Prerequisites:** `LES-00-01` (Files, Folders & The POSIX Filesystem Mental Model)

---

## 1. Why This Matters: The Industrial Hook

### The Story of the Silent Backup Failure

In 2021, a high-growth fintech startup believed their customer database was safely backing up every night at midnight. 

The engineering team had set up a routine command to generate the database backup and save the confirmation message into a file called `backup.log`:

```bash
run_backup > backup.log
```

For six consecutive months, the team glanced at the `backup.log` file, saw that it was updated with a fresh timestamp every night, and assumed all customer transactions were completely safe.

Then, a cloud hardware failure occurred. The database crashed.

When the lead engineer opened the database backups to restore customer balances, the backup folder was completely empty. The system had lost six months of financial records.

What happened?

The backup tool had failed on Day 1 because of an expired security certificate. When the program encountered the error, it sent its warning message through **Standard Error (`stderr`)**, while the `>` symbol *only captured* **Standard Output (`stdout`)**. 

Because the error message was printed to a separate channel that nobody was recording, the failure remained completely invisible. The system was crying for help every single night on an unmonitored channel.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              THE LESSON OF STREAM ISOLATION                            │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ In graphical apps (like a web browser or word processor), errors, normal text, and     │
│ user buttons are tangled together on a single screen.                                  │
│                                                                                        │
│ In professional software engineering, every tool communicates through clean, separated │
│ streams of text: one stream for normal data, and one dedicated stream for errors.      │
│                                                                                        │
│ Learning how to route, connect, and split these streams is the secret superpower of     │
│ every backend developer, DevOps engineer, and AI builder.                              │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Learning Outcomes

By the end of this lesson, you will be able to:

1. **Distinguish the Terminal from the Shell**: Explain the physical difference between the graphical window you look at (the Terminal emulator) and the interpreter program running inside it (the Shell).
2. **Deconstruct Command Anatomy**: Break any command-line instruction down into its three grammatical parts: **Command** (the action), **Flags** (the options), and **Arguments** (the target files or data).
3. **Trace the Three Standard Streams**: Follow how **Standard Input (`stdin`)**, **Standard Output (`stdout`)**, and **Standard Error (`stderr`)** flow into and out of running programs.
4. **Direct Output with Redirection**: Save clean results to a file with overwrite (`>`), add records with append (`>>`), and isolate warning messages (`2>`) without corrupting clean data.
5. **Chain Tools with Pipes (`|`)**: Connect multiple single-purpose tools together in memory so the output of one command instantly feeds the input of the next.

---

## 3. Core Concepts

### 3.1 The Terminal vs. The Shell: Screen vs. Brain

When beginners open a black window with white text, they often call the whole thing "the terminal" or "the command line."

In reality, two completely different software components are working together:

1. **The Terminal Emulator (The Screen & Glass)**:  
   The Terminal is just an ordinary window application (such as Terminal on macOS, Windows Terminal, or iTerm2). Its only job is to capture the keys you type on your keyboard and draw letters and colors on your screen. The terminal does not understand what `ls` or `copy` means.
2. **The Shell (The Brain & Interpreter)**:  
   Inside the terminal window lives a separate, background program called the **Shell** (common shells are named **Bash** or **Zsh**). The Shell is the conversational partner that reads the words you type, interprets what you want to do, asks the operating system to run programs, and sends the text results back to the terminal screen.

```mermaid
graph TD
    classDef usr fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef term fill:#0f172a,stroke:#8b5cf6,stroke-width:2px,color:#fff;
    classDef sh fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff;
    classDef os fill:#1e1b4b,stroke:#f59e0b,stroke-width:2px,color:#fff;

    U["1. Your Keystrokes<br/>(Typing on Keyboard)"]:::usr --> T["2. Terminal Window<br/>(Captures keys & draws screen)"]:::term
    T -->|"Passes text string"| S["3. Shell Interpreter (Bash / Zsh)<br/>(The brain that parses commands)"]:::sh
    S -->|"Executes system program"| K["4. Operating System Tools<br/>(ls, grep, cat, node)"]:::os
    K -->|"Returns output text"| S
    S -->|"Sends text to display"| T
    T -->|"Renders characters"| V["5. Your Eyes on Screen"]:::usr
```

---

### 3.2 The Command Prompt: The Ready Signal

When you open a terminal, you will see a short line of text ending with a dollar sign (`-- ==============================================================================
-- Migration: 20260930_seed_mod00_lessons.sql
-- Description: Seeds the canonical 5 lessons and competency alignments for
--              MOD-00 (Digital & Developer Foundations: From User to Systems Operator).
-- Idempotency: Fully idempotent using UPSERT (ON CONFLICT (module_id, slug) DO UPDATE).
-- Safety: Preserves existing foreign keys, user learning progress, and referential integrity.
-- Target DB: Supabase PostgreSQL 15.1+ (ai-native-lms)
-- Author: Principal Database Architect, Curriculum Systems Engineer & LMS Migration Specialist
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- 1. Declare and Verify Parent Module (MOD-00)
-- ------------------------------------------------------------------------------
DO $$
DECLARE
    v_mod00_id UUID;
BEGIN
    SELECT id INTO v_mod00_id 
    FROM public.modules 
    WHERE slug = 'mod-00-digital-foundations';

    IF v_mod00_id IS NULL THEN
        RAISE EXCEPTION 'CRITICAL: Parent module MOD-00 (mod-00-digital-foundations) not found in public.modules.';
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 2. Seed MOD-00 Canonical Lessons (5 Lessons)
-- ------------------------------------------------------------------------------

-- Lesson 1: LES-00-01
INSERT INTO public.lessons (
    id,
    module_id,
    slug,
    title,
    summary,
    content,
    order_index,
    estimated_minutes,
    is_published,
    created_at,
    updated_at
) VALUES (
    'c0000000-0000-0000-0000-000000000001',
    (SELECT id FROM public.modules WHERE slug = 'mod-00-digital-foundations'),
    'les-00-01-files-folders-posix-filesystem',
    'Files, Folders & The POSIX Filesystem Mental Model',
    'Discover how cloud servers, Docker containers, and Git repositories organize information using the filesystem tree, absolute and relative path navigation, and security permissions.',
    '---
lesson_code: "LES-00-01"
source_path: "lessons/les-00-01.md"
blueprint_path: "lessons/les-00-01-blueprint.md"
version: "1.0.0"
status: "canonical_reference"
target_competency: "DEV-00"
target_gate: "gate-1-foundations"
prerequisites: []
---

# LES-00-01: Files, Folders & The POSIX Filesystem Mental Model

**Module:** MOD-00 Digital Foundations  
**Phase:** Phase 1 (Month 1, Week 1)  
**Target Competency:** `DEV-00` (Tooling & Development Environment)  
**Estimated Total Effort:** 6.0 Hours Total Dedicated Effort (60–90 min core reading + interactive sandbox drills & reflection)  
**Prerequisites:** None (Complete Beginner Baseline)

---

### Why This Matters

Every modern technology you will build or work with—from cloud servers running on AWS to Docker containers packaging applications, Git repositories tracking project code, and deployment environments serving millions of users—relies on the exact same underlying filesystem rules.

In production environments, a substantial number of cloud deployment failures, container startup crashes, and build errors trace directly back to misspelled path coordinates or misconfigured file permissions.

Understanding how files and folders are structured gives you the foundational map of the computer. Once you understand this map, working with servers, containers, and codebases will feel intuitive and natural instead of intimidating.

---

### What You Will Learn

- **Explain the root directory (`/`)**: Understand the single origin point where every file and folder in the entire computer begins.
- **Locate your home directory (`~`)**: Confidently find and manage your private personal workspace.
- **Distinguish absolute and relative paths**: Give exact global addresses or step-by-step directions to find any file from anywhere.
- **Identify hidden configuration files**: Recognize dotfiles (like `.config` or `.env`) that store background application settings.
- **Interpret read, write, and execute permissions (`rwx`)**: Read security settings to know who can view, edit, or run any file.

---

### Prerequisites

- ✅ **No coding experience required**: You do not need to know any programming language.
- ✅ **No terminal or command-line experience required**: We start from a visual baseline before typing commands.
- ✅ **No Linux experience required**: Everything is explained clearly with everyday analogies and visual diagrams.
- ✅ **Just your computer and a web browser**: A working keyboard, screen, and curiosity about how software works under the hood.

---

## 1. The Story of the Missing Slash

In 2019, an automated cleanup program on a large payment server was instructed to delete temporary junk files located in a folder written as `temp/logs`.

The person who wrote the instruction forgot a single leading forward slash (`/`).

Because the slash was missing, the computer did not look at the main system storage. Instead, it looked inside the folder where it was currently standing—which happened to be the core system folder of the computer. The computer followed the instruction faithfully and erased crucial operating system files.

The resulting outage lasted 14 hours and prevented millions of people from buying groceries or paying bills.

The computer did not make a mistake. It followed an exact address instruction.

Understanding how files, folders, and path addresses work is the very first step to becoming a confident software engineer.

---

## 2. The Inverted Tree: Moving Beyond Desktop Icons

When you look at your computer screen, you see files scattered on your "Desktop." This often makes it feel like the Desktop is the top or center of your computer.

In reality, your Desktop is just an ordinary folder tucked away inside your personal user account.

Computers organize all files and folders in a structure called an **Inverted Tree** (an upside-down tree). Unlike a natural tree that grows upward from the ground, the computer''s tree starts at the very top with a single origin point and branches downward into more and more folders.

```mermaid
graph TD
    classDef root fill:#1e293b,stroke:#ef4444,stroke-width:3px,color:#fff;
    classDef sys fill:#0f172a,stroke:#8b5cf6,stroke-width:2px,color:#fff;
    classDef usr fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff;

    ROOT["/ (Root - The Very Top)"]:::root
    ROOT --> BIN["/bin (System Programs)"]:::sys
    ROOT --> ETC["/etc (System Settings)"]:::sys
    ROOT --> HOME["/home (User Accounts)"]:::sys
    ROOT --> VAR["/var (Logs & Data)"]:::sys
    ROOT --> TMP["/tmp (Temporary Files)"]:::sys

    HOME --> ALEX["/home/alex (Your Personal Workspace ~)"]:::usr
    ALEX --> DOCS["Documents/"]:::usr
    ALEX --> DESK["Desktop/"]:::usr
    ALEX --> PROJ["projects/"]:::usr
    PROJ --> APP["my-app/"]:::usr
```

---

## 3. The Three Fundamental Anchors of the Filesystem

To find your way around the filesystem tree, you only need to know three core anchors:

1. **The Root Directory (`/`)**: 
   The single forward slash represents the absolute top of the entire computer. Every single file, folder, program, and connected drive lives underneath `/`. There is nothing above Root.
2. **The User Home Directory (`~` or `/home/yourname`)**: 
   Computers are built so multiple people can use the same machine safely. Each person gets their own private workspace inside `/home/`. The tilde symbol (`~`) is a convenient universal shortcut that always stands for "my home folder."
3. **The Current Working Directory**: 
   At any given moment, the computer is "standing" inside one specific folder. The folder you are currently inside is called your **Current Working Directory**.

---

## 4. Absolute vs. Relative Paths: Finding Any File

To open, read, or change a file, you must tell the computer its **Path**—the address coordinates that guide the computer through the branches of the tree.

There are two ways to write any address: **Absolute Paths** and **Relative Paths**.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              PATH TYPES AT A GLANCE                                    │
├───────────────────┬──────────────────────────────────┬─────────────────────────────────┤
│ Path Type         │ How It Starts                    │ Everyday Analogy                │
├───────────────────┼──────────────────────────────────┼─────────────────────────────────┤
│ Absolute Path     │ Always starts with a slash (`/`) │ A Global Postal Address         │
│                   │                                  │ (Country, City, Street, Number) │
├───────────────────┼──────────────────────────────────┼─────────────────────────────────┤
│ Relative Path     │ Starts with a folder name,       │ Local Directions                │
│                   │ `.` (here), or `..` (up one level│ ("Walk two doors down the hall")│
└───────────────────┴──────────────────────────────────┴─────────────────────────────────┘
```

### 4.1 Absolute Paths: The Global Address
An **Absolute Path** gives the complete, exact address of a file starting all the way from the top Root (`/`). Because it starts at Root, an absolute path points to the exact same file no matter where you are currently standing.

- **Example 1**: `/etc/settings.txt`  
  *Meaning*: Start at Root (`/`), open the `etc` folder, and find `settings.txt`.
- **Example 2**: `/home/alex/projects/my-app/index.html`  
  *Meaning*: Start at Root (`/`), open `home`, open `alex`, open `projects`, open `my-app`, and find `index.html`.

> [!TIP]
> If a path starts with a forward slash (`/`), it is an **Absolute Path** anchored directly to Root.

---

### 4.2 Relative Paths: Directions from Where You Are Standing
A **Relative Path** gives directions to a file starting from your **Current Working Directory**. If you move to a different folder, the directions must change.

To write relative directions, you use three special shorthand symbols:
- `.` (Single Dot): "The folder I am currently inside."
- `..` (Double Dot): "The parent folder one level directly above me."
- `~` (Tilde): "My personal home folder."

```mermaid
graph LR
    classDef curr fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef step fill:#0f172a,stroke:#f59e0b,stroke-width:2px,color:#fff;
    classDef targ fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff;

    C["You Are Standing Here:<br/>/home/alex/projects/my-app"]:::curr -->|1. Step Up (..)| P["Parent Folder:<br/>/home/alex/projects"]:::step
    P -->|2. Step Up (..)| H["Your Home Folder:<br/>/home/alex"]:::step
    H -->|3. Enter Folder| D["Documents Folder:<br/>/home/alex/Documents"]:::step
    D -->|4. Target File| T["Target File:<br/>notes.txt"]:::targ
```

### 4.3 Step-by-Step Worked Example: Visiting a Sibling Folder

Imagine you are currently working inside this folder:  
`/home/alex/projects/my-app/`

You need to access a file called `notes.txt` inside your `Documents` folder:  
`/home/alex/Documents/notes.txt`

How do you give step-by-step relative directions?

1. **Step 1 (`..`)**: Step up one level out of `my-app` into `projects`. (Current path: `..`)
2. **Step 2 (`..`)**: Step up one more level out of `projects` into your home folder `alex`. (Current path: `../..`)
3. **Step 3 (`Documents/`)**: Step down into the `Documents` folder. (Current path: `../../Documents`)
4. **Step 4 (`notes.txt`)**: Target the file. (Final Relative Path: `../../Documents/notes.txt`)

---

## 5. Folders, Hidden Files & Basic Permissions

### What is a Folder Really?
Think of a folder as a labeled divider in a physical filing cabinet. It does not change the files inside it; it simply groups them together under a helpful name so both you and the computer can locate them quickly.

---

### Hidden Files (Dotfiles)
Sometimes you will see a file or folder whose name begins with a period, such as `.config` or `.my-settings`.

These are called **Dotfiles** or **Hidden Files**. 

They are not locked, dangerous, or secret. The computer simply hides them from everyday views so your workspace stays clean and free of background configuration settings.

---

### Basic Permissions: Read, Write, and Execute

In any computer shared by teams or connected to the internet, files need protection. The operating system provides three simple permission rights:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              THE THREE BASIC PERMISSIONS                               │
├────────────────────┬──────────┬────────────────────────────────────────────────────────┤
│ Permission Right   │ Symbol   │ What It Allows You To Do                               │
├────────────────────┼──────────┼────────────────────────────────────────────────────────┤
│ Read               │ `r`      │ Look inside the file and view its contents.            │
├────────────────────┼──────────┼────────────────────────────────────────────────────────┤
│ Write              │ `w`      │ Edit, modify, save changes, or delete the file.        │
├────────────────────┼──────────┼────────────────────────────────────────────────────────┤
│ Execute            │ `x`      │ Run the file as a program, tool, or script.            │
└────────────────────┴──────────┴────────────────────────────────────────────────────────┘
```

These three rights can be granted separately to:
- **The Owner**: The person who created the file.
- **The Group**: Teammates who share access.
- **Others**: Anyone else on the system.

For example, a normal document might allow the **Owner** to Read and Write (`rw`), while allowing **Others** only to Read (`r`). This prevents other people from accidentally deleting or altering your work.

*(In the next lesson, you will practice viewing and adjusting these permissions using the terminal).*

---

## 6. Common Beginner Traps & How to Avoid Them

### Trap 1: Forgetting the Leading Slash
When you want to point to a system folder at the top of the computer, forgetting the starting `/` changes the meaning completely:
- `etc/settings.txt` (Relative) &rarr; Looks for an `etc` folder inside *wherever you are right now*. If it is not there, you get an error.
- `/etc/settings.txt` (Absolute) &rarr; Accurately targets the settings file at the top of the computer every time.

---

### Trap 2: Spaces in File and Folder Names
In ordinary everyday use, you might name a file `My Project Notes 2026.txt`. 

To engineering tools and cloud servers, spaces look like separators between separate commands. This can confuse the system into thinking `My`, `Project`, `Notes`, and `2026.txt` are four different things.

Software engineers use hyphens or underscores instead of spaces:
- ✅ `my-project-notes-2026.txt` (Clear and reliable)
- ❌ `My Project Notes 2026.txt` (Can cause unexpected errors)

---

### Trap 3: Panic When Seeing "Permission Denied"
If you try to open or save a file and see `Permission Denied`, do not panic. It simply means the operating system is doing its job to protect a system file or another user''s workspace. You will learn how to handle permissions smoothly as you build your developer toolkit.

---

## 7. Key Takeaways & Coding Lab Bridge

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CORE LESSON TAKEAWAYS                                │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. Files and folders form an Inverted Tree starting at the top Root (`/`).             │
│ 2. An Absolute Path begins with `/` and gives an exact global address from Root.       │
│ 3. A Relative Path gives directions from where you are currently standing.             │
│ 4. `.` means "current folder", `..` means "parent folder above", and `~` means "home". │
│ 5. Files starting with `.` are hidden setting files (Dotfiles).                        │
│ 6. Permissions control who can Read (`r`), Write (`w`), and Execute (`x`) a file.     │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### Cognitive Self-Reflection

Take a moment to answer these two questions in your mind to confirm your mental model:

1. **Tree Hierarchy Question**: *If you are standing inside `/home/alex/projects`, what is the name of the folder directly one level above you (`..`)?*  
   *(Hint: Look at the path backwards—what folder contains `projects`?)*

2. **Path Addressing Question**: *Why does an absolute path like `/home/alex/notes.txt` always work from anywhere, while a relative path like `notes.txt` only works if you are already inside the `alex` folder?*

---

### Next Step: Your First Sandboxed Lab Challenge

You now have the complete mental map of the filesystem. It is time to see it in action.

Proceed to **`EXE-00-01: POSIX Filesystem Navigation & Directory Tree Reconstruction`**, where you will enter an interactive sandbox to explore folders and construct your first real directory tree.
',
    1,
    360,
    true,
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
) ON CONFLICT (module_id, slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    content = EXCLUDED.content,
    order_index = EXCLUDED.order_index,
    estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = EXCLUDED.is_published,
    updated_at = timezone('utc'::text, now());


) or percent sign (`%`), followed by a blinking cursor:

```text
alex@laptop:~$ █
```

This line is called the **Prompt**.

Think of the prompt like a **telephone dial tone**. It tells you: *"The shell is awake, standing inside your home directory (`~`), and waiting for your next instruction."*

Whenever you type a command and hit `Enter`, the shell executes the command. While the program runs, the prompt disappears. When the program finishes, the prompt reappears, letting you know the shell is ready for the next task.

---

### 3.3 The Anatomy of a Command: Verbs, Adverbs, and Nouns

Every command you type into a shell follows a clean, predictable grammatical structure:

```text
command   -flags   arguments
(Verb)   (Adverbs)  (Nouns)
```

```mermaid
graph LR
    classDef cmd fill:#1e293b,stroke:#3b82f6,stroke-width:3px,color:#fff;
    classDef flg fill:#0f172a,stroke:#8b5cf6,stroke-width:2px,color:#fff;
    classDef arg fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff;

    C["grep<br/>[COMMAND / VERB]<br/>What action to take"]:::cmd --- F["-i<br/>[FLAG / ADVERB]<br/>How to modify the action<br/>(case-insensitive)"]:::flg
    F --- A1["''error''<br/>[ARGUMENT 1 / TARGET]<br/>What text to search for"]:::arg
    A1 --- A2["server.log<br/>[ARGUMENT 2 / TARGET]<br/>Which file to search inside"]:::arg
```

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              THE 3 PARTS OF EVERY CLI COMMAND                          │
├──────────────┬────────────────────────────┬────────────────────────────────────────────┤
│ Part         │ Role & Function            │ Real-World Example                         │
├──────────────┼────────────────────────────┼────────────────────────────────────────────┤
│ 1. Command   │ The name of the tool you   │ `ls` (List files)                          │
│    (Verb)    │ want to execute.           │ `cat` (Display file contents)              │
│              │                            │ `grep` (Search text patterns)              │
├──────────────┼────────────────────────────┼────────────────────────────────────────────┤
│ 2. Flags     │ Modifiers or switches that │ `-l` (Show detailed long format)           │
│   (Options)  │ adjust how the tool behaves│ `-a` (Show all files, including dotfiles)  │
│              │ (usually start with `-`).  │ `-la` (Combine both modifiers together)    │
├──────────────┼────────────────────────────┼────────────────────────────────────────────┤
│ 3. Arguments │ The targets, file paths,   │ `/var/log` (Which folder to list)          │
│    (Nouns)   │ or text strings the tool   │ `notes.txt` (Which file to open)           │
│              │ will operate upon.         │ `"error"` (What word to search for)        │
└──────────────┴────────────────────────────┴────────────────────────────────────────────┘
```

> [!NOTE]
> **Spaces are crucial separators:** The shell uses spaces to know where the command ends, where flags begin, and where arguments start. If you write `ls-la` without a space, the shell looks for a nonexistent program called `ls-la`. Always put a space between words: `ls -la`.

---

### 3.4 The Three Standard Streams: The I/O Plumbing Model

Whenever any program runs in a POSIX operating system (Linux, macOS, Unix), the computer automatically attaches **three standard channels of communication** to it.

These channels are called **Streams**. You can picture them as three physical pipes connected to a water pump:

```mermaid
graph LR
    classDef in fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef proc fill:#0f172a,stroke:#8b5cf6,stroke-width:3px,color:#fff;
    classDef out fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff;
    classDef err fill:#450a0a,stroke:#ef4444,stroke-width:2px,color:#fff;

    IN["Standard Input (stdin)<br/>[Channel 0]<br/>Default: Your Keyboard"]:::in -->|"Data In"| P["Running Program<br/>(e.g., sort, grep, cat)"]:::proc
    P -->|"Normal Results"| OUT["Standard Output (stdout)<br/>[Channel 1]<br/>Default: Terminal Screen"]:::out
    P -->|"Diagnostic Errors"| ERR["Standard Error (stderr)<br/>[Channel 2]<br/>Default: Terminal Screen"]:::err
```

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              THE 3 STANDARD STREAMS                                    │
├──────────┬────────────────────────────┬──────────────────┬─────────────────────────────┤
│ Channel  │ Stream Name                │ Default Source   │ Purpose                     │
├──────────┼────────────────────────────┼──────────────────┼─────────────────────────────┤
│ 0        │ Standard Input (`stdin`)   │ Your Keyboard    │ Text sent into the program. │
├──────────┼────────────────────────────┼──────────────────┼─────────────────────────────┤
│ 1        │ Standard Output (`stdout`) │ Terminal Screen  │ The successful result of    │
│          │                            │                  │ the program''s work.         │
├──────────┼────────────────────────────┼──────────────────┼─────────────────────────────┤
│ 2        │ Standard Error (`stderr`)  │ Terminal Screen  │ Diagnostic notices, alarms, │
│          │                            │                  │ and error messages.         │
└──────────┴────────────────────────────┴──────────────────┴─────────────────────────────┘
```

By default, both Channel 1 (`stdout`) and Channel 2 (`stderr`) print directly onto your terminal screen. But because they are separate channels, you can redirect them independently!

---

### 3.5 Redirection Operators: Saving Streams to Disk

Instead of letting a program''s output spill onto the terminal screen and vanish, you can use **Redirection Operators** to funnel the stream directly into a file on your hard drive.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              STREAM REDIRECTION OPERATORS                              │
├──────────┬───────────────────────────┬─────────────────────────────────────────────────┤
│ Operator │ Name                      │ What It Does                                    │
├──────────┼───────────────────────────┼─────────────────────────────────────────────────┤
│ `>`      │ Overwrite Redirection     │ Takes Channel 1 (`stdout`), wipes the target    │
│          │                           │ file completely clean, and writes the new text. │
├──────────┼───────────────────────────┼─────────────────────────────────────────────────┤
│ `>>`     │ Append Redirection        │ Takes Channel 1 (`stdout`) and neatly attaches  │
│          │                           │ the new text to the bottom of the existing file.│
├──────────┼───────────────────────────┼─────────────────────────────────────────────────┤
│ `2>`     │ Error Redirection         │ Takes Channel 2 (`stderr`) specifically and     │
│          │                           │ saves errors to a file, keeping stdout clean.   │
└──────────┴───────────────────────────┴─────────────────────────────────────────────────┘
```

> [!WARNING]
> **The Danger of `>` (Single Arrow)**:  
> The single arrow `>` is an **overwrite** command. If `report.txt` already has 10,000 lines of important notes, running `echo "Hello" > report.txt` will **erase all 10,000 lines** and leave only "Hello".  
> If you want to add to an existing file without deleting its history, always use `>>` (double arrow).

---

### 3.6 The Pipe Operator (`|`): In-Memory Conveyor Belts

One of the greatest design triumphs of computer science is the **UNIX Philosophy**:

> *"Write programs that do one thing and do it well. Write programs to work together. Write programs to handle text streams, because that is a universal interface."*

Instead of building giant, complicated programs that try to do everything, the command line gives you dozens of simple, sharp tools. You combine them using the **Pipe Operator (`|`)**.

The vertical bar (`|`) connects the **Standard Output (`stdout`)** of the tool on the left directly into the **Standard Input (`stdin`)** of the tool on the right—completely inside computer memory, without saving any slow temporary files to your disk.

```mermaid
graph LR
    classDef src fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef p1 fill:#0f172a,stroke:#8b5cf6,stroke-width:2px,color:#fff;
    classDef p2 fill:#042f2e,stroke:#14b8a6,stroke-width:2px,color:#fff;
    classDef p3 fill:#1e1b4b,stroke:#6366f1,stroke-width:2px,color:#fff;
    classDef dst fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff;

    F["customers.txt<br/>(1,000 names)"]:::src -->|"cat customers.txt"| P1["stdout [1]"]:::p1
    P1 -->|"| (Pipe)"| S1["stdin [0]<br/>grep ''London''"]:::p2
    S1 -->|"Filtered stdout [1]<br/>(25 Londoners)"| P2["stdout [1]"]:::p2
    P2 -->|"| (Pipe)"| S2["stdin [0]<br/>sort"]:::p3
    S2 -->|"Sorted stdout [1]"| REDIR["> (Redirect)"]:::dst
    REDIR --> OUT["london_sorted.txt<br/>(Final Clean File)"]:::dst
```

---

## 4. Step-by-Step Worked Examples

### Worked Example 1: Deconstructing Real Commands

Let''s look at two common commands you will use daily and break down their grammar.

#### Scenario A: Detailed Directory Listing
```bash
ls -la /var/log
```
- **Command (`ls`)**: "List directory contents."
- **Flags (`-la`)**:
  - `-l`: Format as a detailed list (shows permissions, owner, size, and date).
  - `-a`: Show *all* files (including hidden dotfiles).
- **Argument (`/var/log`)**: The absolute path of the target folder to inspect.

#### Scenario B: Finding High-Priority Errors
```bash
grep -i "critical" ./application.log
```
- **Command (`grep`)**: "Search for lines of text matching a pattern."
- **Flags (`-i`)**: Ignore uppercase vs lowercase (finds "CRITICAL", "Critical", or "critical").
- **Argument 1 (`"critical"`)**: The search pattern to look for.
- **Argument 2 (`./application.log`)**: The relative path to the file to search through.

---

### Worked Example 2: Stream Redirection and Error Isolation

Imagine you are running a diagnostic tool called `check_system` that checks your server''s health.

#### Step 1: Default Behavior (Everything on Screen)
```bash
check_system
```
**Terminal Screen Shows:**
```text
[OK] Memory usage is normal (stdout)
[OK] Disk space is 45% (stdout)
[ERROR] Database connection failed on port 5432! (stderr)
[OK] Network latency 12ms (stdout)
```
*Notice:* Both normal status lines and error alarms are mixed together on your screen.

#### Step 2: Capturing Clean Output with `>`
```bash
check_system > health_report.txt
```
**Terminal Screen Shows:**
```text
[ERROR] Database connection failed on port 5432!
```
**File `health_report.txt` Contains:**
```text
[OK] Memory usage is normal
[OK] Disk space is 45%
[OK] Network latency 12ms
```
*Why did the error still print on the screen?*  
Because `>` only redirects Channel 1 (`stdout`). The error is on Channel 2 (`stderr`), so it remained on your screen.

#### Step 3: Isolating Output and Errors into Two Separate Files
```bash
check_system > health_report.txt 2> error_audit.txt
```
**Terminal Screen Shows:**
```text
(Completely quiet - nothing printed on screen)
```
- `health_report.txt` contains only the three clean `[OK]` status lines.
- `error_audit.txt` contains only the `[ERROR]` diagnostic line.

---

### Worked Example 3: Building a 3-Stage Data Pipeline

Imagine you manage a busy web server. A log file named `web_traffic.log` has 100,000 entries. You need to know: **"How many requests came from mobile devices?"**

Let''s build a pipeline step by step:

#### Step 1: Read the Source File
```bash
cat web_traffic.log
```
*Result:* 100,000 lines scroll past your eyes in a blur.

#### Step 2: Filter for Mobile Requests Using a Pipe (`|`)
```bash
cat web_traffic.log | grep "Mobile"
```
*Result:* The pipe takes all 100,000 lines and feeds them into `grep`. `grep` filters out everything else and emits only the lines containing the word "Mobile".

#### Step 3: Count the Filtered Lines Using `wc -l`
```bash
cat web_traffic.log | grep "Mobile" | wc -l
```
*Result:* `wc -l` (word count - lines) counts the incoming lines from the stream and prints a single number:
```text
1420
```

#### Step 4: Save the Final Answer to a Summary File
```bash
cat web_traffic.log | grep "Mobile" | wc -l > mobile_count.txt
```
*Result:* The number `1420` is cleanly saved into `mobile_count.txt`. The entire 100,000-line processing task completed in less than one-tenth of a second without writing any temporary files to disk.

---

## 5. Common Beginner Traps & Misconceptions

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              COMMON BEGINNER TRAPS & FIXES                             │
├─────────────────────────┬───────────────────────────────┬──────────────────────────────┤
│ Beginner Trap           │ Why It Happens                │ The Professional Fix         │
├─────────────────────────┼───────────────────────────────┼──────────────────────────────┤
│ Accidental File Wipe    │ Using `>` instead of `>>`     │ When appending log lines or  │
│                         │ when writing to an existing   │ notes, always double-check   │
│                         │ file.                         │ for double arrows (`>>`).    │
├─────────────────────────┼───────────────────────────────┼──────────────────────────────┤
│ The "Broken Command"    │ Forgetting to put a space     │ Treat spaces as essential    │
│ Panic                   │ between the command and flags │ word boundaries (`ls -l`,    │
│                         │ (e.g., `ls-l` or `catnotes`). │ not `ls-l`).                 │
├─────────────────────────┼───────────────────────────────┼──────────────────────────────┤
│ Error Leaks on Screen   │ Assuming `>` captures every-  │ Remember `>` only redirects  │
│                         │ thing; errors still show up.  │ stdout (1). Use `2>` if you  │
│                         │                               │ need to capture errors (2).  │
├─────────────────────────┼───────────────────────────────┼──────────────────────────────┤
│ Memorization Anxiety    │ Feeling overwhelmed by the    │ Real engineers do not        │
│                         │ hundreds of possible flags.   │ memorize flags. They run     │
│                         │                               │ `--help` or `man command`.   │
└─────────────────────────┴───────────────────────────────┴──────────────────────────────┘
```

---

## 6. Guided Practice & Mental Drills

### Drill 1: The Command Anatomy Dissector

Look at the following four commands. Identify the **[Command]**, the **[Flags]**, and the **[Arguments]** for each:

1. `mkdir -p ./projects/web-app/src`
2. `head -n 25 /var/log/syslog`
3. `rm -r ./temporary_folder`
4. `wc -l customers.csv`

<details>
<summary>👉 Click to Reveal the Answer Breakdown</summary>

1. **`mkdir -p ./projects/web-app/src`**:
   - **Command:** `mkdir` (Make Directory)
   - **Flag:** `-p` (Create parent folders if they don''t exist yet)
   - **Argument:** `./projects/web-app/src` (The relative path to create)
2. **`head -n 25 /var/log/syslog`**:
   - **Command:** `head` (View the top lines of a file)
   - **Flag:** `-n 25` (Option to show exactly 25 lines)
   - **Argument:** `/var/log/syslog` (The absolute path to the target file)
3. **`rm -r ./temporary_folder`**:
   - **Command:** `rm` (Remove/delete)
   - **Flag:** `-r` (Recursive - deletes the folder and everything inside it)
   - **Argument:** `./temporary_folder` (The target folder to delete)
4. **`wc -l customers.csv`**:
   - **Command:** `wc` (Word count)
   - **Flag:** `-l` (Count lines instead of words)
   - **Argument:** `customers.csv` (The target file to count)
</details>

---

### Drill 2: Predicting Stream Destinations

For each command below, predict where the **normal output** and any **error messages** will go:

1. `grep "Alice" staff.txt > results.txt`
2. `compile_code 2> build_errors.log`
3. `echo "New Entry" >> daily_journal.txt`
4. `find_files /root > file_list.txt 2> permission_denied.log`

<details>
<summary>👉 Click to Reveal the Stream Analysis</summary>

1. **`grep "Alice" staff.txt > results.txt`**:
   - *Normal Output (stdout):* Overwrites `results.txt`.
   - *Errors (stderr):* Prints on the terminal screen.
2. **`compile_code 2> build_errors.log`**:
   - *Normal Output (stdout):* Prints on the terminal screen.
   - *Errors (stderr):* Saved into `build_errors.log`.
3. **`echo "New Entry" >> daily_journal.txt`**:
   - *Normal Output (stdout):* Appended to the end of `daily_journal.txt` without erasing prior entries.
   - *Errors (stderr):* Prints on the terminal screen.
4. **`find_files /root > file_list.txt 2> permission_denied.log`**:
   - *Normal Output (stdout):* Overwrites `file_list.txt`.
   - *Errors (stderr):* Overwrites `permission_denied.log`.
   - *Terminal Screen:* Completely quiet.
</details>

---

## 7. Cognitive Self-Reflection

Take 60 seconds to reflect on these two questions before moving to the Knowledge Check:

1. **The Water Pipe Mental Model**: *Why is connecting tools with pipes (`|`) much safer and faster than saving intermediate results into temporary files on your hard drive?*  
   *(Hint: Think about disk space, file clutter, and memory speed).*
2. **Stream Separation in Cloud Services**: *If an automated server script runs in the cloud with no human looking at the screen, what happens to error messages if you only redirect `>` and ignore `2>`?*

---

## 8. Knowledge Check

### Question 1
What is the core functional difference between the Terminal and the Shell?
- **A)** The Terminal is for Linux, while the Shell is for Windows.
- **B)** The Terminal is the graphical window that displays characters; the Shell is the program that interprets commands and executes them.
- **C)** The Terminal is used for writing code; the Shell is used for compiling code.
- **D)** There is no difference; they are two names for the exact same program.

<details>
<summary>👉 Click for Answer & Explanation</summary>

**Correct Answer:** **B**  
**Explanation:** The Terminal emulator is the presentation layer (displaying text on screen and capturing keyboard input). The Shell (like Bash or Zsh) is the command language interpreter running inside that window.
</details>

---

### Question 2
You have a file called `servers.log` containing 50 lines of notes. You run the following command:
```bash
echo "Server restart initiated" > servers.log
```
What will `servers.log` contain after this command runs?
- **A)** 51 lines: the original 50 lines plus the new line at the bottom.
- **B)** 51 lines: the new line at the top plus the original 50 lines.
- **C)** Exactly 1 line: `"Server restart initiated"`, because `>` overwrites the entire file.
- **D)** An error message stating that the file already exists.

<details>
<summary>👉 Click for Answer & Explanation</summary>

**Correct Answer:** **C**  
**Explanation:** The single redirection operator `>` overwrites existing file contents. To add a line to the end of an existing file without deleting it, you must use the append operator `>>`.
</details>

---

### Question 3
Which stream channel number is assigned to Standard Error (`stderr`) in POSIX operating systems?
- **A)** Channel 0
- **B)** Channel 1
- **C)** Channel 2
- **D)** Channel 3

<details>
<summary>👉 Click for Answer & Explanation</summary>

**Correct Answer:** **C**  
**Explanation:** Channel 0 is Standard Input (`stdin`), Channel 1 is Standard Output (`stdout`), and Channel 2 is Standard Error (`stderr`).
</details>

---

### Question 4
What does the Pipe operator (`|`) do when placed between two commands, like `tool_a | tool_b`?
- **A)** It runs `tool_a`, waits for it to save a file, then opens `tool_b`.
- **B)** It connects the Standard Output (`stdout`) of `tool_a` directly into the Standard Input (`stdin`) of `tool_b` in memory.
- **C)** It compares the speed of both tools and runs the faster one.
- **D)** It combines the error messages of both tools.

<details>
<summary>👉 Click for Answer & Explanation</summary>

**Correct Answer:** **B**  
**Explanation:** The pipe operator creates an in-memory stream conduit that streams data directly from the upstream process''s `stdout` into the downstream process''s `stdin`.
</details>

---

## 9. Next Step & Coding Lab Bridge

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CORE TAKEAWAYS                                       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. Terminal = Presentation screen. Shell = Command interpreter brain.                  │
│ 2. Command Anatomy = `command` (Verb) + `-flags` (Options) + `arguments` (Targets).   │
│ 3. Three Standard Streams: `stdin` (0), `stdout` (1), and `stderr` (2).               │
│ 4. `>` wipes and overwrites; `>>` appends to the end; `2>` isolates error diagnostics.│
│ 5. Pipes (`|`) stream data between tools in memory without slow disk files.            │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

You now possess the foundational grammar and dataflow plumbing model of the command line.

You are ready for your next hands-on lab:

👉 Proceed to **`EXE-00-02: Shell Stream Processing & Log Grepping Pipeline`**, where you will enter the terminal sandbox to filter production server logs, count error frequencies, and build your first multi-stage stream pipelines!
',
    2,
    480,
    true,
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
) ON CONFLICT (module_id, slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    content = EXCLUDED.content,
    order_index = EXCLUDED.order_index,
    estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = EXCLUDED.is_published,
    updated_at = timezone('utc'::text, now());


-- Lesson 3: LES-00-03
INSERT INTO public.lessons (
    id,
    module_id,
    slug,
    title,
    summary,
    content,
    order_index,
    estimated_minutes,
    is_published,
    created_at,
    updated_at
) VALUES (
    'c0000000-0000-0000-0000-000000000003',
    (SELECT id FROM public.modules WHERE slug = 'mod-00-digital-foundations'),
    'les-00-03-web-http-browser-devtools',
    'How the Web & Browser Work: HTTP, Network & DevTools',
    'Understand client-server architecture, IP addresses, DNS resolution, TCP/TLS handshakes, HTTP request/response lifecycles, status codes (2xx–5xx), headers, JSON payloads, and browser DevTools network inspection.',
    '---
lesson_code: "LES-00-03"
source_path: "lessons/les-00-03.md"
blueprint_path: "lessons/les-00-03-blueprint.md"
version: "1.0.0"
status: "canonical_reference"
target_competency: "DEV-00"
target_gate: "gate-1-foundations"
prerequisites: ["LES-00-01", "LES-00-02"]
---

# LES-00-03: How the Web & Browser Work: HTTP, Network & DevTools

*Canonical lesson source: [`lessons/les-00-03.md`](file:///home/gamp/Documents/lms/lessons/les-00-03.md)*  
*Parent module: [`module-00-blueprint.md`](file:///home/gamp/Documents/lms/module-00-blueprint.md)*  

### Pedagogical Summary
Demystifies the web platform from wire to screen. Teaches complete beginners how browsers fetch resources over HTTP, decode status codes, inspect network traffic payloads in DevTools, and debug frontend-backend communication breakdowns.',
    3,
    480,
    true,
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
) ON CONFLICT (module_id, slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    content = EXCLUDED.content,
    order_index = EXCLUDED.order_index,
    estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = EXCLUDED.is_published,
    updated_at = timezone('utc'::text, now());


-- Lesson 4: LES-00-04
INSERT INTO public.lessons (
    id,
    module_id,
    slug,
    title,
    summary,
    content,
    order_index,
    estimated_minutes,
    is_published,
    created_at,
    updated_at
) VALUES (
    'c0000000-0000-0000-0000-000000000004',
    (SELECT id FROM public.modules WHERE slug = 'mod-00-digital-foundations'),
    'les-00-04-git-directed-acyclic-graphs',
    'Git & Version Control from First Principles (DAG)',
    'Master Git object database architecture (blobs, trees, commits), Directed Acyclic Graphs (DAGs), atomic commits, staging index, branch pointers, fast-forward and 3-way merges, and merge conflict resolution.',
    '---
lesson_code: "LES-00-04"
source_path: "lessons/les-00-04.md"
blueprint_path: "lessons/les-00-04-blueprint.md"
version: "1.0.0"
status: "canonical_reference"
target_competency: "DEV-00"
target_gate: "gate-1-foundations"
prerequisites: ["LES-00-01", "LES-00-02"]
---

# LES-00-04: Git & Version Control from First Principles (DAG)

*Canonical lesson source: [`lessons/les-00-04.md`](file:///home/gamp/Documents/lms/lessons/les-00-04.md)*  
*Parent module: [`module-00-blueprint.md`](file:///home/gamp/Documents/lms/module-00-blueprint.md)*  

### Pedagogical Summary
Replaces rote memorization of git commands with a clear mental model of Git as a Directed Acyclic Graph (DAG) of immutable snapshots. Eliminates fear of branching, merging, and merge conflicts.',
    4,
    600,
    true,
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
) ON CONFLICT (module_id, slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    content = EXCLUDED.content,
    order_index = EXCLUDED.order_index,
    estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = EXCLUDED.is_published,
    updated_at = timezone('utc'::text, now());


-- Lesson 5: LES-00-05
INSERT INTO public.lessons (
    id,
    module_id,
    slug,
    title,
    summary,
    content,
    order_index,
    estimated_minutes,
    is_published,
    created_at,
    updated_at
) VALUES (
    'c0000000-0000-0000-0000-000000000005',
    (SELECT id FROM public.modules WHERE slug = 'mod-00-digital-foundations'),
    'les-00-05-ai-engineering-verification-loops',
    'AI-Assisted Engineering: Context, Prompts & Verification Loops',
    'Master prompt framing (System, User, Constraints), context window provision, LLM token prediction mechanics, 3-step verification loops (Generate → Lint/Test → Audit), and AI hallucination triage.',
    '---
lesson_code: "LES-00-05"
source_path: "lessons/les-00-05.md"
blueprint_path: "lessons/les-00-05-blueprint.md"
version: "1.0.0"
status: "canonical_reference"
target_competency: "CTX-01"
target_gate: "gate-1-foundations"
prerequisites: ["LES-00-01", "LES-00-02", "LES-00-04"]
---

# LES-00-05: AI-Assisted Engineering: Context, Prompts & Verification Loops

*Canonical lesson source: [`lessons/les-00-05.md`](file:///home/gamp/Documents/lms/lessons/les-00-05.md)*  
*Parent module: [`module-00-blueprint.md`](file:///home/gamp/Documents/lms/module-00-blueprint.md)*  

### Pedagogical Summary
Establishes professional AI collaboration hygiene. Teaches complete beginners to treat AI coding assistants as fast, junior pair programmers requiring rigorous verification loops, deliberate constraint framing, and systematic hallucination checks.',
    5,
    480,
    true,
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
) ON CONFLICT (module_id, slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    content = EXCLUDED.content,
    order_index = EXCLUDED.order_index,
    estimated_minutes = EXCLUDED.estimated_minutes,
    is_published = EXCLUDED.is_published,
    updated_at = timezone('utc'::text, now());


-- ------------------------------------------------------------------------------
-- 3. Synchronize Lesson Competency Alignments (public.lesson_competencies)
-- ------------------------------------------------------------------------------

-- Clean previous mappings for these 5 lessons to ensure idempotent synchronization
DELETE FROM public.lesson_competencies
WHERE lesson_id IN (
    'c0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000003',
    'c0000000-0000-0000-0000-000000000004',
    'c0000000-0000-0000-0000-000000000005'
);

-- LES-00-01 -> DEV-00 (introduced, 20 pts)
INSERT INTO public.lesson_competencies (
    lesson_id,
    competency_id,
    target_state,
    contribution_points
) VALUES (
    'c0000000-0000-0000-0000-000000000001',
    (SELECT id FROM public.competencies WHERE code = 'DEV-00'),
    'introduced',
    20
);

-- LES-00-02 -> DEV-00 (practicing, 25 pts)
INSERT INTO public.lesson_competencies (
    lesson_id,
    competency_id,
    target_state,
    contribution_points
) VALUES (
    'c0000000-0000-0000-0000-000000000002',
    (SELECT id FROM public.competencies WHERE code = 'DEV-00'),
    'practicing',
    25
);

-- LES-00-03 -> DEV-00 (reinforced, 25 pts)
INSERT INTO public.lesson_competencies (
    lesson_id,
    competency_id,
    target_state,
    contribution_points
) VALUES (
    'c0000000-0000-0000-0000-000000000003',
    (SELECT id FROM public.competencies WHERE code = 'DEV-00'),
    'reinforced',
    25
);

-- LES-00-04 -> DEV-00 / DEV-01 (mastered / introduced, 20 pts)
-- Dynamically maps to DEV-01 if present, otherwise reinforces DEV-00
INSERT INTO public.lesson_competencies (
    lesson_id,
    competency_id,
    target_state,
    contribution_points
) VALUES (
    'c0000000-0000-0000-0000-000000000004',
    COALESCE(
        (SELECT id FROM public.competencies WHERE code = 'DEV-01'),
        (SELECT id FROM public.competencies WHERE code = 'DEV-00')
    ),
    'mastered',
    20
);

-- LES-00-05 -> CTX-01 / AIE-01 (introduced, 20 pts)
-- Dynamically maps to AIE-01 if present, otherwise maps to CTX-01
INSERT INTO public.lesson_competencies (
    lesson_id,
    competency_id,
    target_state,
    contribution_points
) VALUES (
    'c0000000-0000-0000-0000-000000000005',
    COALESCE(
        (SELECT id FROM public.competencies WHERE code = 'AIE-01'),
        (SELECT id FROM public.competencies WHERE code = 'CTX-01')
    ),
    'introduced',
    20
);

-- ------------------------------------------------------------------------------
-- 4. Verification and Integrity Assertions
-- ------------------------------------------------------------------------------
DO $$
DECLARE
    v_lesson_count INTEGER;
    v_comp_link_count INTEGER;
    v_total_minutes INTEGER;
BEGIN
    -- Verify 5 lessons exist in MOD-00
    SELECT COUNT(*), COALESCE(SUM(estimated_minutes), 0)
    INTO v_lesson_count, v_total_minutes
    FROM public.lessons
    WHERE module_id = (SELECT id FROM public.modules WHERE slug = 'mod-00-digital-foundations');

    IF v_lesson_count != 5 THEN
        RAISE EXCEPTION 'MIGRATION FAILED: Expected 5 lessons in MOD-00, found %.', v_lesson_count;
    END IF;

    IF v_total_minutes != 2400 THEN
        RAISE EXCEPTION 'MIGRATION FAILED: Expected 2400 total lesson minutes in MOD-00, found %.', v_total_minutes;
    END IF;

    -- Verify 5 lesson_competencies links exist
    SELECT COUNT(*)
    INTO v_comp_link_count
    FROM public.lesson_competencies
    WHERE lesson_id IN (
        'c0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000004',
        'c0000000-0000-0000-0000-000000000005'
    );

    IF v_comp_link_count != 5 THEN
        RAISE EXCEPTION 'MIGRATION FAILED: Expected 5 competency mappings for MOD-00 lessons, found %.', v_comp_link_count;
    END IF;

    RAISE NOTICE 'SUCCESS: MOD-00 Lessons successfully synchronized. 5 lessons active, 2400 instructional minutes, 5 competency alignments verified.';
END $$;

COMMIT;
