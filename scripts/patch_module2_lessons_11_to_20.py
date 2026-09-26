#!/usr/bin/env python3
"""
Patch script for Module 2, Lessons 2.11 through 2.30 (node-1-11 to node-1-30).
Applies:
- High-density real-world engineering handbooks with physical mental models.
- 3-part exercise briefings (exercise_about, exercise_goal, expected_output outside code).
- Clean starter code with guided # TODOs.
- Strict unit tests in test_suite['tests.py'].
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

LESSONS_2_11_TO_30 = {
    # --------------------------------------------------------------------------
    # 2.11: CPython Object References & Identity
    # --------------------------------------------------------------------------
    "node-1-11": {
        "title": "Lesson 2.11: CPython Object References & Memory Identity",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 11 of 50",
        "cs_foundation": "CPython PyObject C-Struct, Object Identity (id()), Value Equality (== vs is), and Interning",
        "ai_convergence": "Real-World Engineering: Debugging Shared Cache Mutations & Memory Aliasing Bugs",
        "handbook_markdown": """# Lesson 2.11: CPython Object References & Identity

In Python, variables do not hold values directly; they hold **memory pointers (references)** to underlying objects allocated on the heap.

Understanding the difference between **value equality (`==`)** and **identity (`is`)** is essential for debugging subtle object mutation bugs in high-scale backends.

---

## 💡 The Real-World Mental Model: Name Tags on Luggage

- **Two Identical Suitcases (`a == b`)**: Two separate suitcases purchased from the same store. They have identical brand, color, and dimensions, but they exist in separate physical locations in the airport.
- **Two Name Tags on One Suitcase (`a is b`)**: A single physical suitcase that has both your personal name tag (`a`) and a company travel sticker (`b`). If someone zips open suitcase `a` and places an item inside, opening suitcase `b` reveals the exact same item because they are the same physical object.

```
a = [1, 2]
b = [1, 2]
c = a

a == b  -> True  (Same contents)
a is b  -> False (Two distinct memory addresses)
a is c  -> True  (Exact same memory reference)
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. The `id()` Function and Memory Addresses
Every object in Python has a unique integer ID representing its memory location in CPython:
```python
x = {"status": "active"}
y = x
print(id(x) == id(y))  # True
print(x is y)          # True
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `verify_object_isolation(base_list: list, shallow_copy_list: list, deep_copy_list: list) -> dict`:

1. **Check Equality & Identity**:
   - `is_shallow_same_obj`: `shallow_copy_list is base_list` (should be `False`).
   - `is_inner_shared`: `shallow_copy_list[0] is base_list[0]` (if first element is mutable dict/list).
   - `is_deep_isolated`: `deep_copy_list[0] is not base_list[0]` (True independence).
2. **Return**: A dictionary with `"shallow_isolated_outer"`, `"shallow_shared_inner"`, and `"deep_completely_isolated"`.

---

## ⚠️ Common Pitfalls

- **Using `is` to compare numbers or strings**: Always use `==` for values. Python interns small integers (`-5` to `256`), which makes `is` accidentally appear to work for small numbers but fail for large ones.
""",
        "starter_code": {
            "solution.py": """def verify_object_isolation(base_list: list, shallow_copy_list: list, deep_copy_list: list) -> dict:
    \"\"\"
    Inspects object identity to verify shallow vs deep memory isolation.
    \"\"\"
    # TODO: Compare outer and inner object identities using 'is' and return verification dict
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Distributed caching layers verify that retrieved cache objects are completely isolated from shared in-memory references to prevent accidental cache corruption.",
            "exercise_goal": "Implement verify_object_isolation(base, shallow, deep) returning boolean identity checks.",
            "expected_output": "verify_object_isolation([{'a': 1}], [{'a': 1}], [{'a': 1}]) -> {'shallow_isolated_outer': True, 'shallow_shared_inner': True, 'deep_completely_isolated': True}",
            "failure_mode": "Confusing == with is or failing to inspect nested element identities.",
            "verification_criteria": "Function correctly diagnoses memory reference aliasing between outer and inner collections.",
            "tests.py": """import copy
from solution import verify_object_isolation

def test_memory_identity():
    base = [{"token": "alpha"}]
    shallow = base.copy()
    deep = copy.deepcopy(base)

    res = verify_object_isolation(base, shallow, deep)
    assert res["shallow_isolated_outer"] is True
    assert res["shallow_shared_inner"] is True
    assert res["deep_completely_isolated"] is True

    print("✓ All assertions passed for Lesson 2.11: Object References & Identity")

if __name__ == '__main__':
    test_memory_identity()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.12: Reference Counting & Resource Cleanup
    # --------------------------------------------------------------------------
    "node-1-12": {
        "title": "Lesson 2.12: Reference Counting & Deterministic Cleanup",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 12 of 50",
        "cs_foundation": "CPython Reference Counting, sys.getrefcount(), and the __del__ Finalizer Method",
        "ai_convergence": "Real-World Engineering: Safely Releasing Database Sockets & File Descriptors",
        "handbook_markdown": """# Lesson 2.12: Reference Counting & Deterministic Cleanup

CPython manages memory primarily through **Reference Counting**: every object tracks how many variables, lists, or functions point to it.

When an object's reference count drops to **zero**, Python immediately reclaims its memory and calls its destructor method (**`__del__`**).

---

## 💡 The Real-World Mental Model: Hotel Key Cards

- Each time a guest registers for Room 204, the hotel issues a key card (**reference count increments by 1**).
- When a guest checks out, they return their key card (**reference count decrements by 1**).
- As soon as the last key card is returned (**count reaches 0**), housekeeping immediately enters to clean the room and turn off all electricity (**`__del__`**).

```
a = Resource()      # refcount: 1
b = a               # refcount: 2
del a               # refcount: 1 (still in memory!)
del b               # refcount: 0 -> Memory immediately freed!
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement the `ResourceHandle` class:

1. **`__init__(self, resource_id: str, registry: dict)`**:
   - Stores `self.resource_id = resource_id` and `self.registry = registry`.
   - Records `self.registry[resource_id] = "OPEN"`.
2. **`close(self)`**:
   - If `self.resource_id in self.registry`:
     - Sets `self.registry[self.resource_id] = "CLOSED"`.
3. **`__del__(self)`**:
   - Calls `self.close()` to guarantee cleanup.

---

## ⚠️ Common Pitfalls

- **Relying solely on `__del__` for critical cleanup**: Circular references can delay `__del__`. Always provide an explicit `.close()` method or context manager.
""",
        "starter_code": {
            "solution.py": """class ResourceHandle:
    \"\"\"
    Represents an open system resource tracking lifecycle in a central registry.
    \"\"\"
    def __init__(self, resource_id: str, registry: dict):
        # TODO: Store attributes and mark resource_id as 'OPEN' in registry
        pass

    def close(self):
        # TODO: Mark resource_id as 'CLOSED' in registry
        pass

    def __del__(self):
        # TODO: Ensure resource is closed upon deletion
        pass
"""
        },
        "test_suite": {
            "exercise_about": "System connection pools track active file descriptors and database handles in central registries, ensuring closed status upon object deletion.",
            "exercise_goal": "Implement ResourceHandle with __init__, close, and __del__ updating shared registry.",
            "expected_output": "reg = {}\nh = ResourceHandle('sock-1', reg)\nreg['sock-1'] == 'OPEN'\nh.close()\nreg['sock-1'] == 'CLOSED'",
            "failure_mode": "Failing to update registry on close or __del__.",
            "verification_criteria": "Resource handle tracks state in registry and releases cleanly.",
            "tests.py": """from solution import ResourceHandle

def test_reference_cleanup():
    reg = {}
    h = ResourceHandle("conn-99", reg)
    assert reg["conn-99"] == "OPEN"

    h.close()
    assert reg["conn-99"] == "CLOSED"

    # Test automatic __del__ behavior
    h2 = ResourceHandle("conn-100", reg)
    assert reg["conn-100"] == "OPEN"
    h2.__del__()
    assert reg["conn-100"] == "CLOSED"

    print("✓ All assertions passed for Lesson 2.12: Reference Counting & Cleanup")

if __name__ == '__main__':
    test_reference_cleanup()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.13: Garbage Collection & Cycle Leaks
    # --------------------------------------------------------------------------
    "node-1-13": {
        "title": "Lesson 2.13: Cyclic Garbage Collection & Memory Leaks",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 13 of 50",
        "cs_foundation": "Cyclic Reference Traps, gc Module, Generational GC, and weakref Module",
        "ai_convergence": "Real-World Engineering: Preventing Memory Leaks in Doubly-Linked Agent Graphs",
        "handbook_markdown": """# Lesson 2.13: Cyclic Garbage Collection & Memory Leaks

Reference counting alone has a major flaw: **circular references**. If Object A points to Object B, and Object B points back to Object A, their reference counts will never drop to zero, even if your application no longer uses them.

Python's **Cyclic Garbage Collector (`gc` module)** runs in the background to detect and destroy isolated circular reference islands. Using **`weakref`** prevents cycles from forming in the first place.

---

## 💡 The Real-World Mental Model: Two Hands Gripping Each Other

Imagine two trapeze artists gripping each other's wrists in mid-air:
- If both lose connection to the safety rope, they are still holding onto each other, so neither drops their grip.
- Without a cyclic garbage collector to sweep through the empty air, they stay suspended forever (**memory leak**).
- A **`weakref`** is like one person lightly resting a finger on the other's shoulder: it allows access without maintaining a lock grip.

```
Node A ──────(points to)──────► Node B
   ▲                              │
   └──────(points back to)────────┘
(Reference count never reaches 0 without cyclic GC!)
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `break_circular_references(parent_node: dict)`:

1. **Detection & Breaking**:
   - `parent_node` contains `"children": [child_1, child_2]`.
   - Each child dictionary contains a reference `"parent": parent_node`.
   - Iterate over each child in `parent_node["children"]` and set `child["parent"] = None`.
2. **Return**: Integer count of broken circular parent references.

---

## ⚠️ Common Pitfalls

- **Parent-child data models**: Always use `weakref.ref(parent)` or explicit `.detach()` methods in tree data structures.
""",
        "starter_code": {
            "solution.py": """def break_circular_references(parent_node: dict) -> int:
    \"\"\"
    Breaks cyclic back-references from children to parent, returning count of references cleared.
    \"\"\"
    # TODO: Loop over parent_node['children'], set child['parent'] = None, and return count
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Tree structures and hierarchical DOM nodes clean up parent-child pointer cycles during teardown to avoid memory leaks in long-running services.",
            "exercise_goal": "Implement break_circular_references(parent_node) detaching child back-references.",
            "expected_output": "parent = {'children': [{'parent': None}, {'parent': None}]}\nbreak_circular_references(parent) -> 2",
            "failure_mode": "Failing to iterate all children or failing to clear parent references.",
            "verification_criteria": "Function breaks all cyclic child-to-parent pointers and returns accurate count.",
            "tests.py": """from solution import break_circular_references

def test_gc_cycles():
    parent = {"id": "p1", "children": []}
    c1 = {"id": "c1", "parent": parent}
    c2 = {"id": "c2", "parent": parent}
    parent["children"] = [c1, c2]

    cleared = break_circular_references(parent)
    assert cleared == 2
    assert c1["parent"] is None
    assert c2["parent"] is None

    print("✓ All assertions passed for Lesson 2.13: Garbage Collection & Cycles")

if __name__ == '__main__':
    test_gc_cycles()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.14: The GIL & Thread Safety
    # --------------------------------------------------------------------------
    "node-1-14": {
        "title": "Lesson 2.14: The Global Interpreter Lock (GIL) & Thread Safety",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 14 of 50",
        "cs_foundation": "CPython GIL Architecture, CPU-Bound vs I/O-Bound Workloads, and threading.Lock",
        "ai_convergence": "Real-World Engineering: Synchronizing Shared Metrics Counters Across Threaded Request Workers",
        "handbook_markdown": """# Lesson 2.14: The Global Interpreter Lock & Thread Safety

In standard CPython, the **Global Interpreter Lock (GIL)** is a mutex that prevents multiple native OS threads from executing Python bytecode simultaneously on multiple CPU cores.

While the GIL allows threads to run concurrently during **I/O-bound tasks** (network requests, file reads), operations on shared Python state are **not thread-safe**. You must use **`threading.Lock`** to prevent race conditions.

---

## 💡 The Real-World Mental Model: A Single Microphone in a Debate Room

- **The GIL**: Only one speaker can hold the microphone at a time. While one person is pausing to read their notes (**I/O wait**), another speaker can take the microphone.
- **Race Condition**: Two speakers both rushing the stage to write on the whiteboard at the exact same second, smudging each other's numbers.
- **`threading.Lock`**: A physical velvet rope around the whiteboard ensuring only one thread can modify the counter at a time.

```python
import threading

class ThreadSafeCounter:
    def __init__(self):
        self._count = 0
        self._lock = threading.Lock()

    def increment(self):
        with self._lock:
            self._count += 1
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `ThreadSafeCounter`:

1. **`__init__(self)`**:
   - `self._value = 0`
   - `self._lock = threading.Lock()`
2. **`increment(self, amount: int = 1) -> int`**:
   - Uses `with self._lock:` to add `amount` to `self._value`.
   - Returns updated `self._value`.
3. **`get_value(self) -> int`**:
   - Uses `with self._lock:` to return `self._value`.

---

## ⚠️ Common Pitfalls

- **Assuming `+=` is atomic in Python**: In bytecode, `count += 1` is three separate instructions (`LOAD`, `ADD`, `STORE`). A thread switch can happen in between, corrupting numbers without a Lock!
""",
        "starter_code": {
            "solution.py": """import threading

class ThreadSafeCounter:
    \"\"\"
    Thread-safe counter synchronized with threading.Lock to prevent race conditions.
    \"\"\"
    def __init__(self):
        # TODO: Initialize _value and _lock
        pass

    def increment(self, amount: int = 1) -> int:
        # TODO: Acquire lock, add amount to _value, and return new value
        pass

    def get_value(self) -> int:
        # TODO: Acquire lock and return current _value
        pass
"""
        },
        "test_suite": {
            "exercise_about": "High-concurrency web servers use thread-safe mutex locks to synchronize global request counters and prevent race condition corruption.",
            "exercise_goal": "Implement ThreadSafeCounter with threading.Lock in increment and get_value methods.",
            "expected_output": "c = ThreadSafeCounter()\nc.increment(5)\nc.get_value() -> 5",
            "failure_mode": "Failing to acquire lock or race condition vulnerabilities.",
            "verification_criteria": "Counter uses threading.Lock properly across multiple thread executions.",
            "tests.py": """import threading
from solution import ThreadSafeCounter

def test_thread_safety():
    counter = ThreadSafeCounter()

    def worker():
        for _ in range(100):
            counter.increment(1)

    threads = [threading.Thread(target=worker) for _ in range(10)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()

    assert counter.get_value() == 1000

    print("✓ All assertions passed for Lesson 2.14: The GIL & Thread Safety")

if __name__ == '__main__':
    test_thread_safety()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.15: Python Bytecode & Execution Loops
    # --------------------------------------------------------------------------
    "node-1-15": {
        "title": "Lesson 2.15: CPython Bytecode & The dis Module",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 15 of 50",
        "cs_foundation": "CPython Compiler Pipeline, Abstract Syntax Trees (AST), Bytecode Opcodes, and dis.dis()",
        "ai_convergence": "Real-World Engineering: Inspecting Bytecode Opcode Efficiency & Stack Operations",
        "handbook_markdown": """# Lesson 2.15: CPython Bytecode & The dis Module

When Python runs your code, it does not interpret raw text directly. It compiles source code into **CPython Bytecode** (`.pyc` files), which is then executed by the CPython virtual machine stack loop.

Using the built-in **`dis` module**, you can disassemble functions into their underlying bytecode opcodes to analyze performance and execution mechanics.

---

## 💡 The Real-World Mental Model: Sheet Music for an Automated Piano

- **Python Source Code**: A musical composer singing a melody in conversational English.
- **Bytecode**: The perforated paper music roll loaded into an automated mechanical piano (`LOAD_FAST`, `BINARY_OP`, `RETURN_VALUE`). The piano executes each physical pin hole mechanically.

```
def add(a, b):
    return a + b

# Disassembled Bytecode (dis.dis):
# 1 LOAD_FAST     0 (a)
# 2 LOAD_FAST     1 (b)
# 3 BINARY_OP     0 (+)
# 4 RETURN_VALUE
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `analyze_function_opcodes(func: callable) -> list[str]`:

1. **Disassemble**: Use `dis.get_instructions(func)` to iterate over all bytecode instructions.
2. **Extract Opcodes**: For each instruction, extract its `opname` string (e.g. `'LOAD_FAST'`, `'RETURN_VALUE'`).
3. **Return**: The list of opcode names in execution order.

---

## ⚠️ Common Pitfalls

- **Bytecode varies across Python versions**: Python 3.11+ introduced specialized adaptive opcodes (`LOAD_FAST__LOAD_FAST`). Test for standard core opcode categories.
""",
        "starter_code": {
            "solution.py": """import dis

def analyze_function_opcodes(func) -> list[str]:
    \"\"\"
    Disassembles a callable function and returns a list of its bytecode opcode names.
    \"\"\"
    # TODO: Use dis.get_instructions to collect instruction.opname strings
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Performance profilers inspect CPython bytecode instruction streams to identify expensive opcode bottlenecks in critical execution loops.",
            "exercise_goal": "Implement analyze_function_opcodes(func) using dis.get_instructions.",
            "expected_output": "def add(a, b): return a + b\nanalyze_function_opcodes(add) -> ['LOAD_FAST', 'LOAD_FAST', 'BINARY_OP' or 'BINARY_ADD', 'RETURN_VALUE']",
            "failure_mode": "Failing to use dis.get_instructions or returning instruction objects instead of names.",
            "verification_criteria": "Function returns list of string opcode names from disassembled function.",
            "tests.py": """from solution import analyze_function_opcodes

def test_bytecode_disassembly():
    def sample_calc(x, y):
        return x + y

    opcodes = analyze_function_opcodes(sample_calc)
    assert isinstance(opcodes, list)
    assert "RETURN_VALUE" in opcodes
    assert any("LOAD_FAST" in op for op in opcodes)

    print("✓ All assertions passed for Lesson 2.15: Bytecode & dis Module")

if __name__ == '__main__':
    test_bytecode_disassembly()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.16: Memory Optimization with __slots__
    # --------------------------------------------------------------------------
    "node-1-16": {
        "title": "Lesson 2.16: Memory Optimization with __slots__",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 16 of 50",
        "cs_foundation": "The __dict__ Overhead, Fixed Attribute Offsets with __slots__, and Memory Profiling",
        "ai_convergence": "Real-World Engineering: Storing Millions of Embeddings & Token Coordinates in Memory",
        "handbook_markdown": """# Lesson 2.16: Memory Optimization with __slots__

By default, every Python object stores its attributes inside a dynamic dictionary (**`__dict__`**). While this allows adding arbitrary new fields at runtime, a dictionary consumes ~150 bytes of memory overhead per instance.

When creating millions of lightweight objects (like 2D coordinate points or log records), defining **`__slots__`** eliminates the `__dict__` entirely, reducing memory consumption by up to **60%**.

---

## 💡 The Real-World Mental Model: Custom Tailored Suit vs One-Size Baggy Overcoat

- **Standard Object (`__dict__`)**: A giant baggy coat with 50 empty pockets. It fits anything you want to stuff into it later, but it is heavy and takes up massive closet space.
- **Slotted Object (`__slots__`)**: A sleek, custom-tailored flight suit with exactly 2 fitted badge slots (`x` and `y`). It takes up minimal physical space and cannot hold unauthorized clutter.

```python
class SlottedPoint:
    __slots__ = ("x", "y")  # Eliminates __dict__!

    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement the `SlottedTelemetryPoint` class:

1. **`__slots__ = ("timestamp", "value", "sensor_id")`**: Declare fixed slots.
2. **`__init__(self, timestamp: int, value: float, sensor_id: str)`**:
   - Binds `self.timestamp`, `self.value`, and `self.sensor_id`.
3. **Verification Property**:
   - Ensure attempting to assign a new attribute (like `point.extra = 123`) raises `AttributeError`.

---

## ⚠️ Common Pitfalls

- **Forgetting `__slots__` in subclasses**: If a subclass does not define `__slots__`, Python reintroduces `__dict__` for the subclass instances.
""",
        "starter_code": {
            "solution.py": """class SlottedTelemetryPoint:
    \"\"\"
    Memory-optimized telemetry point using __slots__ to eliminate __dict__ overhead.
    \"\"\"
    __slots__ = ("timestamp", "value", "sensor_id")

    def __init__(self, timestamp: int, value: float, sensor_id: str):
        # TODO: Initialize slotted attributes
        pass
"""
        },
        "test_suite": {
            "exercise_about": "High-throughput telemetry ingestion pipelines use __slots__ to store millions of sensor metric points in RAM without running out of memory.",
            "exercise_goal": "Implement SlottedTelemetryPoint with __slots__ for timestamp, value, and sensor_id.",
            "expected_output": "p = SlottedTelemetryPoint(1000, 24.5, 'temp-1')\nhasattr(p, '__dict__') -> False",
            "failure_mode": "Failing to define __slots__ or allowing undeclared dynamic attributes.",
            "verification_criteria": "Class uses __slots__, has no __dict__, and blocks dynamic attribute assignment.",
            "tests.py": """from solution import SlottedTelemetryPoint

def test_slotted_memory():
    p = SlottedTelemetryPoint(1710000000, 98.6, "SENSOR-01")
    assert p.timestamp == 1710000000
    assert p.value == 98.6
    assert p.sensor_id == "SENSOR-01"

    # Verify no __dict__ exists
    assert not hasattr(p, "__dict__")

    # Verify dynamic assignment fails
    try:
        p.unregistered_attribute = "test"
        assert False, "Expected AttributeError on slotted class"
    except AttributeError:
        pass

    print("✓ All assertions passed for Lesson 2.16: Memory Optimization with __slots__")

if __name__ == '__main__':
    test_slotted_memory()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.17: Metaclasses & Class Construction
    # --------------------------------------------------------------------------
    "node-1-17": {
        "title": "Lesson 2.17: Metaclasses & Class Registration Hooks",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 17 of 50",
        "cs_foundation": "Metaclasses (type), __new__ vs __init__ on Classes, and Automatic Plugin Registries",
        "ai_convergence": "Real-World Engineering: Building Self-Registering Plugin & Tool Architectures",
        "handbook_markdown": """# Lesson 2.17: Metaclasses & Class Registration Hooks

In Python, classes themselves are objects created at runtime. The "class of a class" is called a **Metaclass** (defaulting to `type`).

By defining a custom metaclass or using **`__init_subclass__`**, you can intercept class creation to automatically register new plugins into a central tool registry without manual configuration.

---

## 💡 The Real-World Mental Model: An Automatic Employee Badge Printing Machine

- **Standard Class Creation**: A new employee is hired, but they have to manually find the security desk, fill out paper forms, and ask to be added to the registry.
- **Metaclass / `__init_subclass__`**: The moment any new department subclass is created in the codebase, Python automatically stamps their security badge and registers them in the company directory immediately.

```python
class PluginRegistryMeta(type):
    registry = {}

    def __new__(mcs, name, bases, namespace):
        cls = super().__new__(mcs, name, bases, namespace)
        if name != "BasePlugin":
            mcs.registry[name] = cls
        return cls
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement an automated plugin registration system:

1. **`class PluginMeta(type)`**:
   - `registry = {}` (class dictionary).
   - In `__new__(mcs, name, bases, namespace)`:
     - Create the class: `cls = super().__new__(mcs, name, bases, namespace)`.
     - If `name != "BasePlugin"`:
       - `mcs.registry[name.lower()] = cls`.
     - Return `cls`.
2. **`class BasePlugin(metaclass=PluginMeta)`**: Base class for plugins.

---

## ⚠️ Common Pitfalls

- **Overusing metaclasses**: For simple inheritance registration, Python 3.6+ `__init_subclass__` is often cleaner than a full metaclass.
""",
        "starter_code": {
            "solution.py": """class PluginMeta(type):
    \"\"\"
    Metaclass that automatically registers subclasses into its registry dictionary.
    \"\"\"
    registry = {}

    def __new__(mcs, name, bases, namespace):
        # TODO: Create class and register in mcs.registry if name != 'BasePlugin'
        pass


class BasePlugin(metaclass=PluginMeta):
    \"\"\"Base plugin class inheriting from PluginMeta.\"\"\"
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Plugin architectures use metaclasses to automatically discover and register third-party integrations as soon as their modules are imported.",
            "exercise_goal": "Implement PluginMeta metaclass that registers subclasses into PluginMeta.registry.",
            "expected_output": "class WeatherPlugin(BasePlugin): pass\n'weatherplugin' in PluginMeta.registry -> True",
            "failure_mode": "Failing to register subclasses or registering BasePlugin itself.",
            "verification_criteria": "Subclasses of BasePlugin are automatically cataloged in PluginMeta.registry.",
            "tests.py": """from solution import PluginMeta, BasePlugin

def test_metaclass_registry():
    class EmailPlugin(BasePlugin):
        def execute(self): return "email_sent"

    class SlackPlugin(BasePlugin):
        def execute(self): return "slack_sent"

    assert "emailplugin" in PluginMeta.registry
    assert "slackplugin" in PluginMeta.registry
    assert PluginMeta.registry["emailplugin"] is EmailPlugin

    print("✓ All assertions passed for Lesson 2.17: Metaclasses & Plugin Registries")

if __name__ == '__main__':
    test_metaclass_registry()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.18: Descriptors & Field Validation
    # --------------------------------------------------------------------------
    "node-1-18": {
        "title": "Lesson 2.18: Descriptors & Reusable Field Validation",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 18 of 50",
        "cs_foundation": "The Descriptor Protocol (__get__, __set__, __set_name__), and Reusable Attribute Validators",
        "ai_convergence": "Real-World Engineering: Building Reusable PositiveNumber & NonEmptyString Validators",
        "handbook_markdown": """# Lesson 2.18: Descriptors & Reusable Field Validation

While `@property` works well for a single class, writing identical getters and setters across 20 different classes creates massive code duplication.

Python **Descriptors** encapsulate attribute access logic (`__get__`, `__set__`, and `__set_name__`) into standalone, reusable validator classes (the secret machinery powering Pydantic and Django ORM).

---

## 💡 The Real-World Mental Model: A Reusable Security Turnstile

- **`@property`**: Stationing a security guard at one specific door. If your building has 20 doors, you have to hire and train 20 separate guards.
- **Descriptor**: A standardized, mass-produced electronic RFID turnstile. You can install the exact same turnstile hardware at every door in the building.

```python
class PositiveNumber:
    def __set_name__(self, owner, name):
        self.name = f"_{name}"

    def __get__(self, obj, objtype=None):
        if obj is None: return self
        return getattr(obj, self.name, 0.0)

    def __set__(self, obj, value):
        if value < 0:
            raise ValueError("Value must be non-negative")
        setattr(obj, self.name, value)
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement the `NonEmptyString` descriptor:

1. **`__set_name__(self, owner, name)`**: Stores `self.private_name = f"_{name}"`.
2. **`__get__(self, obj, objtype=None)`**: Returns `getattr(obj, self.private_name, "")`.
3. **`__set__(self, obj, value)`**:
   - If not isinstance `value` str or `len(value.strip()) == 0`:
     - Raise `ValueError("String cannot be empty")`.
   - Sets `setattr(obj, self.private_name, value.strip())`.

---

## ⚠️ Common Pitfalls

- **Storing state on the descriptor instance itself**: A descriptor is shared across all class instances. Always store the value on the target instance `obj` using `setattr(obj, self.private_name, value)`.
""",
        "starter_code": {
            "solution.py": """class NonEmptyString:
    \"\"\"
    Descriptor enforcing non-empty string validation across reusable class attributes.
    \"\"\"
    def __set_name__(self, owner, name):
        # TODO: Store private name attribute
        pass

    def __get__(self, obj, objtype=None):
        # TODO: Retrieve private attribute from obj
        pass

    def __set__(self, obj, value):
        # TODO: Validate string is non-empty, strip, and set on obj
        pass
"""
        },
        "test_suite": {
            "exercise_about": "ORM frameworks and data validation engines use descriptors to enforce reusable field type and boundary constraints across schema classes.",
            "exercise_goal": "Implement NonEmptyString descriptor with __set_name__, __get__, and __set__ validation.",
            "expected_output": "class User:\n    username = NonEmptyString()\nu = User()\nu.username = 'alice'\nu.username = '' -> Raises ValueError",
            "failure_mode": "Storing value on self instead of obj or failing to validate empty string.",
            "verification_criteria": "Descriptor enforces non-empty string constraint across independent instances.",
            "tests.py": """from solution import NonEmptyString

def test_descriptors():
    class Profile:
        name = NonEmptyString()

    p1 = Profile()
    p2 = Profile()

    p1.name = "  Alice  "
    p2.name = "Bob"

    assert p1.name == "Alice"
    assert p2.name == "Bob"

    # Test validation
    try:
        p1.name = "   "
        assert False, "Expected ValueError on empty string"
    except ValueError:
        pass

    print("✓ All assertions passed for Lesson 2.18: Descriptors & Field Validation")

if __name__ == '__main__':
    test_descriptors()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.19: Strategy Pattern & Swappable Algorithms
    # --------------------------------------------------------------------------
    "node-1-19": {
        "title": "Lesson 2.19: The Strategy Pattern: Swappable Algorithms",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 19 of 50",
        "cs_foundation": "Strategy Design Pattern, Behavioral Polymorphism, and Runtime Algorithm Swapping",
        "ai_convergence": "Real-World Engineering: Swapping Pricing Discount Strategies in Checkout Workflows",
        "handbook_markdown": """# Lesson 2.19: The Strategy Pattern: Swappable Algorithms

Hardcoding long chains of `if/elif/else` statements for different calculation methods (e.g. VIP discount, Holiday sale, Wholesale bulk) makes code rigid and difficult to extend.

The **Strategy Pattern** extracts each algorithm into its own independent class with a unified interface, allowing the host application to swap strategies dynamically at runtime.

---

## 💡 The Real-World Mental Model: Commuting Navigation Modes

Think of Google Maps:
- The overall goal is getting to the airport (**Context**).
- Depending on your budget and urgency, you can switch the strategy icon to:
  - **Driving Strategy** (Fastest route via highways)
  - **Transit Strategy** (Lowest cost via subways)
  - **Walking Strategy** (Pedestrian walkways)
- The map interface never changes; only the underlying routing strategy is swapped.

```
┌─────────────────────────────────┐
│ CartPricingContext              │
│ - strategy: DiscountStrategy    │
│ + calculate_final(total)        │
└─────────────────────────────────┘
                 │
       Swappable Strategy:
                 ├── PercentageDiscount(0.15)
                 ├── FlatDiscount(10.0)
                 └── NoDiscount()
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement the Strategy Pattern for cart discounts:

1. **`PercentageDiscount`**:
   - `__init__(self, percent: float)`: stores `self.percent = percent`.
   - `apply(self, total: float) -> float`: Returns `round(total * (1 - self.percent / 100), 2)`.
2. **`FlatDiscount`**:
   - `__init__(self, amount: float)`: stores `self.amount = amount`.
   - `apply(self, total: float) -> float`: Returns `round(max(0.0, total - self.amount), 2)`.
3. **`CartContext`**:
   - `__init__(self, strategy)`: stores `self.strategy = strategy`.
   - `calculate_bill(self, total: float) -> float`: Calls and returns `self.strategy.apply(total)`.

---

## ⚠️ Common Pitfalls

- **Coupling Context to concrete strategies**: `CartContext` should only call `self.strategy.apply(...)` without caring which strategy is active.
""",
        "starter_code": {
            "solution.py": """class PercentageDiscount:
    def __init__(self, percent: float):
        # TODO: Store percent
        pass

    def apply(self, total: float) -> float:
        # TODO: Return total discounted by percent
        pass


class FlatDiscount:
    def __init__(self, amount: float):
        # TODO: Store amount
        pass

    def apply(self, total: float) -> float:
        # TODO: Return total minus flat amount (never below 0.0)
        pass


class CartContext:
    def __init__(self, strategy):
        # TODO: Store strategy instance
        pass

    def calculate_bill(self, total: float) -> float:
        # TODO: Delegate calculation to strategy.apply(total)
        pass
"""
        },
        "test_suite": {
            "exercise_about": "E-commerce checkout engines use the Strategy pattern to apply seasonal discounts, coupons, and member perks dynamically at runtime.",
            "exercise_goal": "Implement PercentageDiscount, FlatDiscount, and CartContext strategy swapper.",
            "expected_output": "cart = CartContext(PercentageDiscount(20.0))\ncart.calculate_bill(100.0) -> 80.00\ncart.strategy = FlatDiscount(15.0)\ncart.calculate_bill(100.0) -> 85.00",
            "failure_mode": "Allowing flat discount to return negative numbers or hardcoding strategies.",
            "verification_criteria": "Strategies calculate discounts accurately and context delegates calculation seamlessly.",
            "tests.py": """from solution import PercentageDiscount, FlatDiscount, CartContext

def test_strategy_pattern():
    cart = CartContext(PercentageDiscount(10.0)) # 10% off
    assert cart.calculate_bill(200.0) == 180.00

    # Swap strategy at runtime
    cart.strategy = FlatDiscount(50.0) # $50 off
    assert cart.calculate_bill(200.0) == 150.00
    assert cart.calculate_bill(30.0) == 0.00 # Max 0 floor

    print("✓ All assertions passed for Lesson 2.19: The Strategy Pattern")

if __name__ == '__main__':
    test_strategy_pattern()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.20: Observer Pattern & Event Emitters
    # --------------------------------------------------------------------------
    "node-1-20": {
        "title": "Lesson 2.20: The Observer Pattern: Event Broadcasting",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 20 of 50",
        "cs_foundation": "Observer Design Pattern, Publish/Subscribe, Event Broadcasting, and Loose Coupling",
        "ai_convergence": "Real-World Engineering: Broadcasting Order Status Events to Email, SMS & Audit Loggers",
        "handbook_markdown": """# Lesson 2.20: The Observer Pattern: Event Broadcasting

When a state change occurs in one component (e.g. an order is placed or payment succeeds), multiple downstream systems need to react (send email, update inventory, write audit log).

The **Observer Pattern** (Publish/Subscribe) allows a subject to notify a list of subscribed listener functions automatically without knowing who or what is listening.

---

## 💡 The Real-World Mental Model: A Newspaper Subscription

- **The Publisher (`EventEmitter`)**: Prints the daily newspaper. The printing press doesn't care who reads the paper; it simply broadcasts copies to every address on the subscriber list.
- **The Subscribers (`Listeners`)**: Alice reads the sports section, Bob reads the financial news, and Charlie recycles the paper. If a subscriber moves away (**`unsubscribe`**), the publisher continues delivering to everyone else unaffected.

```
EventEmitter (Order Placed)
       ├──► Notifies Email Service
       ├──► Notifies Warehouse Dispatch
       └──► Notifies Audit Logger
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement the `EventEmitter` class:

1. **`__init__(self)`**: Initializes `self._listeners = []`.
2. **`subscribe(self, callback: callable) -> None`**: Adds `callback` to `self._listeners` (if not already subscribed).
3. **`unsubscribe(self, callback: callable) -> None`**: Removes `callback` from `self._listeners` (if present).
4. **`emit(self, event_data: dict) -> None`**: Iterates through all registered listener callbacks and executes `cb(event_data)`.

---

## ⚠️ Common Pitfalls

- **Mutating listener list while iterating**: In high-concurrency systems, iterate over a copy `for cb in list(self._listeners):`.
""",
        "starter_code": {
            "solution.py": """class EventEmitter:
    \"\"\"
    PubSub event emitter implementing subscribe, unsubscribe, and emit.
    \"\"\"
    def __init__(self):
        # TODO: Initialize listener list
        pass

    def subscribe(self, callback) -> None:
        # TODO: Add callback to listeners if not present
        pass

    def unsubscribe(self, callback) -> None:
        # TODO: Remove callback from listeners if present
        pass

    def emit(self, event_data: dict) -> None:
        # TODO: Broadcast event_data to all registered callbacks
        pass
"""
        },
        "test_suite": {
            "exercise_about": "Event-driven microservices broadcast status updates to registered audit loggers, analytics sinks, and notification handlers using the Observer pattern.",
            "exercise_goal": "Implement EventEmitter with subscribe, unsubscribe, and emit methods.",
            "expected_output": "emitter = EventEmitter()\nevents = []\nemitter.subscribe(lambda d: events.append(d))\nemitter.emit({'status': 'ok'})\nevents == [{'status': 'ok'}]",
            "failure_mode": "Failing to broadcast to all listeners or failing to unsubscribe properly.",
            "verification_criteria": "Event emitter correctly dispatches payloads to registered subscriber callbacks.",
            "tests.py": """from solution import EventEmitter

def test_observer_pattern():
    emitter = EventEmitter()
    logs = []

    def audit_listener(data):
        logs.append(f"AUDIT: {data['event']}")

    def metrics_listener(data):
        logs.append(f"METRIC: {data['event']}")

    emitter.subscribe(audit_listener)
    emitter.subscribe(metrics_listener)

    emitter.emit({"event": "USER_LOGIN"})
    assert len(logs) == 2
    assert "AUDIT: USER_LOGIN" in logs
    assert "METRIC: USER_LOGIN" in logs

    # Unsubscribe
    emitter.unsubscribe(metrics_listener)
    emitter.emit({"event": "USER_LOGOUT"})
    assert len(logs) == 3
    assert logs[-1] == "AUDIT: USER_LOGOUT"

    print("✓ All assertions passed for Lesson 2.20: The Observer Pattern")

if __name__ == '__main__':
    test_observer_pattern()
"""
        }
    }
}

def apply_patch():
    print(f"Applying patch to {len(LESSONS_2_11_TO_30)} lessons in Module 2 (node-1-11 to node-1-20)...")
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    for node_id, data in LESSONS_2_11_TO_30.items():
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
