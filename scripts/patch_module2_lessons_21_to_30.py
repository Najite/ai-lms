#!/usr/bin/env python3
"""
Patch script for Module 2, Lessons 2.21 through 2.35 (node-1-21 to node-1-35).
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

LESSONS_2_21_TO_35 = {
    # --------------------------------------------------------------------------
    # 2.21: Factory Pattern
    # --------------------------------------------------------------------------
    "node-1-21": {
        "title": "Lesson 2.21: The Factory Pattern & Dynamic Instantiation",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 21 of 50",
        "cs_foundation": "Factory Design Pattern, Dynamic Class Instantiation, and Decoupled Object Creation",
        "ai_convergence": "Real-World Engineering: Dynamically Instantiating AI Model Adapters (OpenAI vs Anthropic)",
        "handbook_markdown": """# Lesson 2.21: The Factory Pattern & Dynamic Instantiation

When your system supports multiple interchangeable integrations (e.g. database connectors, image encoders, or AI model providers), hardcoding `new OpenAIClient()` directly into your business logic creates tight coupling.

The **Factory Pattern** centralizes object creation in a single factory function or class, allowing caller code to request an adapter simply by passing a provider string name.

---

## 💡 The Real-World Mental Model: A Vending Machine Dispenser

- **Direct Construction**: Reaching inside the internal refrigeration coils of the vending machine and soldering wires to extract a can of soda.
- **Factory Interface**: Pressing the button labeled `"orange_juice"`. The vending machine's internal dispenser factory inspects the code and drops the correct sealed beverage into the slot for you.

```
ModelFactory.create("fast")     ──► Returns FastModelAdapter()
ModelFactory.create("reasoner") ──► Returns ReasoningModelAdapter()
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `ModelClientFactory`:

1. **`class FastClient`**:
   - `def query(self, prompt: str) -> str`: Returns `f"FAST: {prompt}"`.
2. **`class AccurateClient`**:
   - `def query(self, prompt: str) -> str`: Returns `f"ACCURATE: {prompt}"`.
3. **`class ModelClientFactory`**:
   - `_registry = {"fast": FastClient, "accurate": AccurateClient}`
   - `@classmethod def create(cls, provider_type: str)`:
     - Normalizes `provider_type = provider_type.strip().lower()`.
     - If `provider_type` in `cls._registry`, instantiates and returns `cls._registry[provider_type]()`.
     - Else raises `ValueError(f"Unsupported provider: {provider_type}")`.

---

## ⚠️ Common Pitfalls

- **Throwing generic exceptions**: Always raise a clear `ValueError` with supported provider options when an unknown provider string is passed.
""",
        "starter_code": {
            "solution.py": """class FastClient:
    def query(self, prompt: str) -> str:
        # TODO: Return 'FAST: {prompt}'
        pass


class AccurateClient:
    def query(self, prompt: str) -> str:
        # TODO: Return 'ACCURATE: {prompt}'
        pass


class ModelClientFactory:
    \"\"\"Factory responsible for instantiating model clients based on provider string.\"\"\"
    _registry = {
        "fast": FastClient,
        "accurate": AccurateClient
    }

    @classmethod
    def create(cls, provider_type: str):
        # TODO: Look up provider_type in _registry, instantiate, or raise ValueError
        pass
"""
        },
        "test_suite": {
            "exercise_about": "Model routing gateways use the Factory pattern to instantiate the appropriate LLM client adapter based on user configuration or task speed requirements.",
            "exercise_goal": "Implement FastClient, AccurateClient, and ModelClientFactory.create(provider_type).",
            "expected_output": "client = ModelClientFactory.create('fast')\nclient.query('hello') -> 'FAST: hello'",
            "failure_mode": "Failing to normalize string or failing to raise ValueError on unknown provider.",
            "verification_criteria": "Factory instantiates correct client class and handles invalid keys gracefully.",
            "tests.py": """from solution import FastClient, AccurateClient, ModelClientFactory

def test_factory_pattern():
    c1 = ModelClientFactory.create("fast")
    assert isinstance(c1, FastClient)
    assert c1.query("Ping") == "FAST: Ping"

    c2 = ModelClientFactory.create("  ACCURATE ")
    assert isinstance(c2, AccurateClient)
    assert c2.query("Solve") == "ACCURATE: Solve"

    # Unsupported
    try:
        ModelClientFactory.create("unknown_xyz")
        assert False, "Expected ValueError on unsupported provider"
    except ValueError:
        pass

    print("✓ All assertions passed for Lesson 2.21: The Factory Pattern")

if __name__ == '__main__':
    test_factory_pattern()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.22: Builder Pattern & Pipeline Assembly
    # --------------------------------------------------------------------------
    "node-1-22": {
        "title": "Lesson 2.22: The Builder Pattern & Fluent Configuration",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 22 of 50",
        "cs_foundation": "Builder Design Pattern, Method Chaining (Fluent Interface), and Step-by-Step Construction",
        "ai_convergence": "Real-World Engineering: Assembling Complex Request Pipelines with Custom Filters",
        "handbook_markdown": """# Lesson 2.22: The Builder Pattern & Fluent Configuration

When constructing complex objects with dozens of optional configuration settings (e.g. database query builders, HTTP requests, or RAG indexing pipelines), constructors with 15 arguments become unreadable.

The **Builder Pattern** allows step-by-step construction with method chaining (`return self`), culminating in a final `.build()` call that produces a validated object.

---

## 💡 The Real-World Mental Model: Custom Sub Sandwich Assembly

- **Telescoping Constructor**: Trying to yell your 20-ingredient custom sandwich order in one single breath at the cashier: `Sandwich("Wheat", "Turkey", True, False, "Cheddar", "Toasted", True, ...)`.
- **Builder Pattern**: Walking down the assembly counter step-by-step:
  - `.set_bread("Wheat")`
  - `.add_protein("Turkey")`
  - `.add_cheese("Cheddar")`
  - `.toast()`
  - `.build()` (Wraps the finished sandwich).

```python
pipeline = (
    PipelineBuilder()
    .set_timeout(30)
    .enable_retries(3)
    .add_filter("profanity")
    .build()
)
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement the `PromptPipelineBuilder` class:

1. **`__init__(self)`**:
   - `self._system_prompt = ""`
   - `self._temperature = 0.7`
   - `self._stop_sequences = []`
2. **Chaining Methods**:
   - `set_system_prompt(self, prompt: str)`: Stores `self._system_prompt = prompt.strip()` and returns `self`.
   - `set_temperature(self, temp: float)`: If not `0.0 <= temp <= 2.0`, raise `ValueError`; stores `self._temperature = temp` and returns `self`.
   - `add_stop_sequence(self, seq: str)`: Appends `seq` to `self._stop_sequences` and returns `self`.
3. **`build(self) -> dict`**:
   - Returns final configuration dictionary: `{"system_prompt": self._system_prompt, "temperature": self._temperature, "stop_sequences": list(self._stop_sequences)}`.

---

## ⚠️ Common Pitfalls

- **Forgetting `return self`**: Every configuration setter method in a builder must return `self` to enable fluent method chaining (`builder.step1().step2()`).
""",
        "starter_code": {
            "solution.py": """class PromptPipelineBuilder:
    \"\"\"
    Fluent builder pattern for constructing validated prompt pipeline configuration dicts.
    \"\"\"
    def __init__(self):
        # TODO: Initialize private configuration state
        pass

    def set_system_prompt(self, prompt: str):
        # TODO: Store prompt and return self
        pass

    def set_temperature(self, temp: float):
        # TODO: Validate 0.0 <= temp <= 2.0 (raise ValueError if out of bounds) and return self
        pass

    def add_stop_sequence(self, seq: str):
        # TODO: Append seq and return self
        pass

    def build(self) -> dict:
        # TODO: Return final configuration dictionary
        pass
"""
        },
        "test_suite": {
            "exercise_about": "SDK query builders construct complex request payloads fluently with method chaining before dispatching network calls.",
            "exercise_goal": "Implement PromptPipelineBuilder with fluent chaining setters and build() method.",
            "expected_output": "cfg = PromptPipelineBuilder().set_system_prompt('Help').set_temperature(0.5).build()\ncfg == {'system_prompt': 'Help', 'temperature': 0.5, 'stop_sequences': []}",
            "failure_mode": "Failing to return self in setters or allowing invalid temperature values.",
            "verification_criteria": "Builder supports fluent method chaining and builds validated dictionary.",
            "tests.py": """from solution import PromptPipelineBuilder

def test_builder_pattern():
    builder = PromptPipelineBuilder()
    config = (
        builder
        .set_system_prompt("You are a helpful coding tutor.")
        .set_temperature(0.2)
        .add_stop_sequence("```")
        .add_stop_sequence("END")
        .build()
    )

    assert config["system_prompt"] == "You are a helpful coding tutor."
    assert config["temperature"] == 0.2
    assert config["stop_sequences"] == ["```", "END"]

    # Test temperature bounds validation
    try:
        PromptPipelineBuilder().set_temperature(5.0)
        assert False, "Expected ValueError on temperature > 2.0"
    except ValueError:
        pass

    print("✓ All assertions passed for Lesson 2.22: The Builder Pattern")

if __name__ == '__main__':
    test_builder_pattern()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.23: Singleton Pattern & Global State
    # --------------------------------------------------------------------------
    "node-1-23": {
        "title": "Lesson 2.23: The Singleton Pattern: Controlled Shared State",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 23 of 50",
        "cs_foundation": "Singleton Design Pattern, __new__ Interception, and Thread-Safe Single Instance Guarantees",
        "ai_convergence": "Real-World Engineering: Managing Central Database Connection Pools & Config Singletons",
        "handbook_markdown": """# Lesson 2.23: The Singleton Pattern: Controlled Shared State

Certain system resources—such as a database connection pool, a global hardware logger, or an application runtime configuration—must have **exactly one shared instance** across the entire lifetime of a program.

The **Singleton Pattern** ensures that no matter how many times caller code calls `DatabasePool()`, Python always returns the exact same underlying object instance.

---

## 💡 The Real-World Mental Model: The White House Oval Office

- **Standard Class (Houses)**: Anyone can build a new house in their town. There are millions of independent houses.
- **Singleton (The Oval Office)**: There is only one physical Oval Office in the government. If different departments request a meeting in the Oval Office, they are all directed to the exact same room in Washington D.C.

```python
class AppConfig:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement the `GlobalMetricsTracker` singleton:

1. **`__new__(cls)`**:
   - Check `if cls._instance is None:`
     - `cls._instance = super().__new__(cls)`
     - `cls._instance._metrics = {}`
   - Return `cls._instance`.
2. **`record(self, metric_name: str, value: float) -> None`**:
   - Stores `self._metrics[metric_name] = value`.
3. **`get(self, metric_name: str, default: float = 0.0) -> float`**:
   - Returns `self._metrics.get(metric_name, default)`.

---

## ⚠️ Common Pitfalls

- **Re-initializing state in `__init__`**: In Python, `__init__` is called every time `Singleton()` is called. Guard internal initialization so state isn't wiped out on subsequent instantiations.
""",
        "starter_code": {
            "solution.py": """class GlobalMetricsTracker:
    \"\"\"
    Singleton metrics tracker ensuring exactly one shared metrics repository.
    \"\"\"
    _instance = None

    def __new__(cls):
        # TODO: Implement Singleton pattern in __new__
        pass

    def record(self, metric_name: str, value: float) -> None:
        # TODO: Store metric value in shared state
        pass

    def get(self, metric_name: str, default: float = 0.0) -> float:
        # TODO: Retrieve metric value from shared state
        pass
"""
        },
        "test_suite": {
            "exercise_about": "Application observability frameworks use the Singleton pattern to share a central metrics recorder across hundreds of distributed background worker threads.",
            "exercise_goal": "Implement GlobalMetricsTracker singleton ensuring single instance and shared state.",
            "expected_output": "t1 = GlobalMetricsTracker()\nt2 = GlobalMetricsTracker()\nt1.record('latency', 45.0)\nt2.get('latency') -> 45.0\nt1 is t2 -> True",
            "failure_mode": "Creating separate instances or resetting metrics dict on re-instantiation.",
            "verification_criteria": "All instantiations return the exact same object reference and share internal state.",
            "tests.py": """from solution import GlobalMetricsTracker

def test_singleton_pattern():
    tracker_a = GlobalMetricsTracker()
    tracker_b = GlobalMetricsTracker()

    assert tracker_a is tracker_b

    tracker_a.record("cpu_percent", 42.5)
    assert tracker_b.get("cpu_percent") == 42.5

    tracker_b.record("memory_mb", 1024.0)
    assert tracker_a.get("memory_mb") == 1024.0

    print("✓ All assertions passed for Lesson 2.23: The Singleton Pattern")

if __name__ == '__main__':
    test_singleton_pattern()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.24: Adapter Pattern & Vendor Normalization
    # --------------------------------------------------------------------------
    "node-1-24": {
        "title": "Lesson 2.24: The Adapter Pattern: Interface Normalization",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 24 of 50",
        "cs_foundation": "Adapter Design Pattern, Legacy Wrapping, and Unified Interface Normalization",
        "ai_convergence": "Real-World Engineering: Normalizing Incompatible Third-Party Payment & Vendor APIs",
        "handbook_markdown": """# Lesson 2.24: The Adapter Pattern: Interface Normalization

When integrating legacy systems or third-party APIs (e.g. Stripe, PayPal, or custom internal ledgers), their method names and payload formats almost never match.

The **Adapter Pattern** wraps an incompatible third-party class inside a standard wrapper, converting its non-standard interface into the exact contract expected by your application.

---

## 💡 The Real-World Mental Model: International Travel Power Plug Adapters

- **Wall Outlet (Your App Contract)**: A standard 3-prong North American wall socket expecting `charge(amount)`.
- **Foreign Appliance (Legacy Vendor)**: A European electric razor with two round prongs requiring `execute_foreign_payment(val_cents, curr)`.
- **The Adapter**: A small physical plug adapter that lets the European razor plug seamlessly into the North American wall without rewiring the building.

```
App Code ──► PaymentAdapter.charge(50.0)
                     │
         Translates & converts
                     ▼
         LegacyVendor.make_payment(5000, currency="USD")
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement an adapter for a legacy vendor API:

1. **`LegacyThirdPartyVendor` (Given)**:
   - `def make_vendor_payment(self, cents: int, currency: str) -> str`: Returns `f"PAID {cents} {currency}"`.
2. **`VendorPaymentAdapter`**:
   - `__init__(self, vendor_service)`: stores `self.vendor = vendor_service`.
   - `charge(self, dollars: float) -> str`:
     - Converts `dollars` to integer cents: `cents = int(round(dollars * 100))`.
     - Calls and returns `self.vendor.make_vendor_payment(cents, "USD")`.

---

## ⚠️ Common Pitfalls

- **Floating-point cent conversions**: Always use `int(round(dollars * 100))` to prevent float rounding truncation bugs (`49.99 * 100` being cast to `4998`).
""",
        "starter_code": {
            "solution.py": """class LegacyThirdPartyVendor:
    \"\"\"Simulated legacy third-party vendor requiring payments in integer cents.\"\"\"
    def make_vendor_payment(self, cents: int, currency: str) -> str:
        return f"PAID {cents} {currency}"


class VendorPaymentAdapter:
    \"\"\"
    Adapter wrapping LegacyThirdPartyVendor to provide a standard charge(dollars) interface.
    \"\"\"
    def __init__(self, vendor_service: LegacyThirdPartyVendor):
        # TODO: Store vendor_service
        pass

    def charge(self, dollars: float) -> str:
        # TODO: Convert dollars to integer cents and call vendor_service.make_vendor_payment
        pass
"""
        },
        "test_suite": {
            "exercise_about": "Payment gateways use the Adapter pattern to wrap incompatible foreign vendor SDKs into a standardized internal charge(dollars) contract.",
            "exercise_goal": "Implement VendorPaymentAdapter converting dollars to cents and delegating to legacy vendor.",
            "expected_output": "adapter = VendorPaymentAdapter(LegacyThirdPartyVendor())\nadapter.charge(49.99) -> 'PAID 4999 USD'",
            "failure_mode": "Failing to convert dollars to cents correctly or failing to wrap vendor method.",
            "verification_criteria": "Adapter successfully translates standard charge interface into legacy vendor calls.",
            "tests.py": """from solution import LegacyThirdPartyVendor, VendorPaymentAdapter

def test_adapter_pattern():
    vendor = LegacyThirdPartyVendor()
    adapter = VendorPaymentAdapter(vendor)

    res1 = adapter.charge(12.50)
    assert res1 == "PAID 1250 USD"

    res2 = adapter.charge(99.99)
    assert res2 == "PAID 9999 USD"

    print("✓ All assertions passed for Lesson 2.24: The Adapter Pattern")

if __name__ == '__main__':
    test_adapter_pattern()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.25: Command Pattern & Queueable Actions
    # --------------------------------------------------------------------------
    "node-1-25": {
        "title": "Lesson 2.25: The Command Pattern: Queueable & Undoable Actions",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 25 of 50",
        "cs_foundation": "Command Design Pattern, Encapsulating Actions as Objects, Undo/Redo, and Task Queues",
        "ai_convergence": "Real-World Engineering: Queueing & Auditing Critical Financial Ledger Operations",
        "handbook_markdown": """# Lesson 2.25: The Command Pattern: Queueable Actions

Executing operations immediately by direct function call makes it difficult to support transaction logging, background queueing, or **Undo / Redo** operations.

The **Command Pattern** turns a request into a standalone object containing all information necessary to execute or reverse the action.

---

## 💡 The Real-World Mental Model: A Restaurant Kitchen Order Ticket

- **Direct Call**: Yelling an order directly across a loud kitchen. If the chef is busy, the order is forgotten; if the customer changes their mind, there is no record of what was ordered.
- **Command Object**: A physical paper order ticket clipped to the queue board. The ticket can be queued, delayed, replayed, or unclipped (**`undo`**) cleanly.

```python
class Command:
    def execute(self) -> None: ...
    def undo(self) -> None: ...
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement the Command Pattern with Undo support:

1. **`AccountBalance` (Receiver)**:
   - `__init__(self, initial: float = 0.0)`: `self.balance = initial`.
2. **`DepositCommand`**:
   - `__init__(self, account: AccountBalance, amount: float)`: stores `self.account` and `self.amount`.
   - `execute(self) -> None`: `self.account.balance += self.amount`.
   - `undo(self) -> None`: `self.account.balance -= self.amount`.
3. **`CommandInvoker`**:
   - `__init__(self)`: `self.history = []`.
   - `run(self, cmd)`: executes `cmd.execute()` and appends `cmd` to `self.history`.
   - `undo_last(self) -> bool`: If `self.history` is not empty, pops the last command, calls `last_cmd.undo()`, and returns `True`. Else returns `False`.

---

## ⚠️ Common Pitfalls

- **Commands must store their own parameters**: A command must hold all necessary context (`account`, `amount`) so it can be executed or undone later without extra arguments.
""",
        "starter_code": {
            "solution.py": """class AccountBalance:
    def __init__(self, initial: float = 0.0):
        self.balance = initial


class DepositCommand:
    def __init__(self, account: AccountBalance, amount: float):
        # TODO: Store account and amount
        pass

    def execute(self) -> None:
        # TODO: Add amount to account balance
        pass

    def undo(self) -> None:
        # TODO: Deduct amount from account balance
        pass


class CommandInvoker:
    def __init__(self):
        # TODO: Initialize history list
        pass

    def run(self, cmd) -> None:
        # TODO: Execute command and append to history
        pass

    def undo_last(self) -> bool:
        # TODO: Pop last command, call undo(), and return True, or return False if empty
        pass
"""
        },
        "test_suite": {
            "exercise_about": "Transactional systems use the Command pattern to queue database actions and provide reversible undo capabilities during error rollbacks.",
            "exercise_goal": "Implement AccountBalance, DepositCommand with execute/undo, and CommandInvoker.",
            "expected_output": "acc = AccountBalance(100.0)\ninv = CommandInvoker()\ninv.run(DepositCommand(acc, 50.0))\nacc.balance == 150.0\ninv.undo_last()\nacc.balance == 100.0",
            "failure_mode": "Failing to maintain history or failing to reverse balance on undo.",
            "verification_criteria": "Invoker accurately runs and rolls back commands via execute and undo contracts.",
            "tests.py": """from solution import AccountBalance, DepositCommand, CommandInvoker

def test_command_pattern():
    acc = AccountBalance(100.0)
    invoker = CommandInvoker()

    cmd1 = DepositCommand(acc, 50.0)
    cmd2 = DepositCommand(acc, 25.0)

    invoker.run(cmd1)
    invoker.run(cmd2)
    assert acc.balance == 175.0

    # Undo cmd2
    assert invoker.undo_last() is True
    assert acc.balance == 150.0

    # Undo cmd1
    assert invoker.undo_last() is True
    assert acc.balance == 100.0

    # Nothing left to undo
    assert invoker.undo_last() is False

    print("✓ All assertions passed for Lesson 2.25: The Command Pattern")

if __name__ == '__main__':
    test_command_pattern()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.26: Chain of Responsibility & Middleware
    # --------------------------------------------------------------------------
    "node-1-26": {
        "title": "Lesson 2.26: Chain of Responsibility & Middleware Pipelines",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 26 of 50",
        "cs_foundation": "Chain of Responsibility Pattern, Request Pipelines, and Intercepting Middleware",
        "ai_convergence": "Real-World Engineering: Building Multi-Stage Request Security & Rate Limit Middleware",
        "handbook_markdown": """# Lesson 2.26: Chain of Responsibility & Middleware

When handling incoming HTTP requests or API calls, requests must pass through multiple validation checkpoints (e.g. rate limit check $\\to$ authentication check $\\to$ payload validation).

The **Chain of Responsibility Pattern** links discrete handler objects into a sequential pipeline. Each handler either processes and forwards the request to the next handler, or rejects it early.

---

## 💡 The Real-World Mental Model: Airport Security Checkpoints

Imagine boarding an international flight:
1. **Checkpoint 1 (Passport Check)**: If passport is invalid, turn passenger away immediately. If valid, forward to Checkpoint 2.
2. **Checkpoint 2 (Luggage Scanner)**: If luggage contains prohibited items, confiscate immediately. If clear, forward to Checkpoint 3.
3. **Checkpoint 3 (Boarding Gate)**: Scan ticket and grant access to the aircraft.

```
Request ──► [AuthHandler] ──► [RateLimitHandler] ──► [Final Handler]
                 │                    │
              Reject               Reject
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement the Chain of Responsibility middleware pipeline:

1. **`BaseHandler`**:
   - `__init__(self)`: `self._next_handler = None`.
   - `set_next(self, handler)`: Sets `self._next_handler = handler` and returns `handler`.
   - `handle(self, request: dict) -> dict | None`:
     - If `self._next_handler`: returns `self._next_handler.handle(request)`.
     - Else returns `{"status": "PASSED"}`.
2. **`AuthHandler(BaseHandler)`**:
   - If `"auth_token"` not in `request` or `request["auth_token"] != "valid_token"`:
     - Return `{"status": "REJECTED", "reason": "invalid_auth"}`.
   - Else return `super().handle(request)`.
3. **`SanitizationHandler(BaseHandler)`**:
   - If `"payload"` not in `request` or len(`request["payload"].strip()`) == 0:
     - Return `{"status": "REJECTED", "reason": "empty_payload"}`.
   - Else return `super().handle(request)`.

---

## ⚠️ Common Pitfalls

- **Forgetting to forward to `super().handle(request)`**: If a handler passes its check, it must call the next handler in the chain.
""",
        "starter_code": {
            "solution.py": """class BaseHandler:
    def __init__(self):
        self._next_handler = None

    def set_next(self, handler):
        self._next_handler = handler
        return handler

    def handle(self, request: dict) -> dict:
        if self._next_handler:
            return self._next_handler.handle(request)
        return {"status": "PASSED"}


class AuthHandler(BaseHandler):
    def handle(self, request: dict) -> dict:
        # TODO: Check request.get('auth_token') == 'valid_token' or reject
        pass


class SanitizationHandler(BaseHandler):
    def handle(self, request: dict) -> dict:
        # TODO: Check non-empty request.get('payload') or reject
        pass
"""
        },
        "test_suite": {
            "exercise_about": "Web frameworks and API gateways use the Chain of Responsibility pattern to pipeline authentication, rate limiting, and sanitization middleware sequentially.",
            "exercise_goal": "Implement AuthHandler and SanitizationHandler chained via BaseHandler.",
            "expected_output": "auth = AuthHandler(); auth.set_next(SanitizationHandler())\nauth.handle({'auth_token': 'valid_token', 'payload': 'Hello'}) -> {'status': 'PASSED'}",
            "failure_mode": "Failing to forward valid requests or failing to stop on rejected steps.",
            "verification_criteria": "Chain terminates on rejection and passes valid requests through all links.",
            "tests.py": """from solution import AuthHandler, SanitizationHandler

def test_chain_of_responsibility():
    auth = AuthHandler()
    sanitize = SanitizationHandler()
    auth.set_next(sanitize)

    # Valid request passing through all chains
    valid_req = {"auth_token": "valid_token", "payload": "Valid query data"}
    assert auth.handle(valid_req) == {"status": "PASSED"}

    # Fails auth
    bad_auth = {"auth_token": "wrong_key", "payload": "Hello"}
    assert auth.handle(bad_auth) == {"status": "REJECTED", "reason": "invalid_auth"}

    # Passes auth, fails sanitization
    empty_payload = {"auth_token": "valid_token", "payload": "   "}
    assert auth.handle(empty_payload) == {"status": "REJECTED", "reason": "empty_payload"}

    print("✓ All assertions passed for Lesson 2.26: Chain of Responsibility")

if __name__ == '__main__':
    test_chain_of_responsibility()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.27: Single Responsibility Principle (SRP)
    # --------------------------------------------------------------------------
    "node-1-27": {
        "title": "Lesson 2.27: Single Responsibility Principle (SRP)",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 27 of 50",
        "cs_foundation": "SOLID Principles, Single Responsibility Principle (SRP), and Cohesion vs Coupling",
        "ai_convergence": "Real-World Engineering: Separating Invoice Calculation from PDF Rendering & Email Delivery",
        "handbook_markdown": """# Lesson 2.27: Single Responsibility Principle (SRP)

The **Single Responsibility Principle (SRP)**—the 'S' in SOLID—states: *"A class or module should have one, and only one, reason to change."*

A 'God Class' that calculates taxes, formats HTML tables, saves to SQL, and sends emails violates SRP. When the email format changes, you risk breaking your tax math.

---

## 💡 The Real-World Mental Model: A Swiss Army Knife vs A Professional Kitchen Knife Set

- **God Object Violation**: A single giant tool combining a blender, microwave, vacuum cleaner, and toaster. If the toaster heating coil burns out, you have to throw the entire blender and vacuum into the trash.
- **SRP Design**: A dedicated chef knife for slicing, a dedicated thermometer for temperature, and a dedicated timer for baking. Each tool does one job masterfully and can be replaced independently.

```
Monolithic (Bad):
OrderService -> [Calculates Total + Generates Invoice + Sends Email + Saves DB]

SRP Architecture (Clean):
OrderCalculator -> Calculates math & discounts
InvoiceFormatter -> Formats text receipt
NotificationService -> Dispatches email
```

---

## 🛠️ Step-by-Step Exercise Guide

Refactor a monolithic order processor into two SRP-compliant classes:

1. **`OrderPriceCalculator`**:
   - `calculate_subtotal(self, items: list[dict]) -> float`: Sums `price * quantity` for all items, returned rounded to 2 decimals.
2. **`ReceiptFormatter`**:
   - `format_receipt(self, store_name: str, total: float) -> str`: Returns `f"Store: {store_name} | Total: ${total:.2f}"`.

---

## ⚠️ Common Pitfalls

- **Mixing business calculation logic with presentation formatting**: Always separate data transformations from string/UI formatting.
""",
        "starter_code": {
            "solution.py": """class OrderPriceCalculator:
    \"\"\"Responsible solely for calculating numerical order costs.\"\"\"
    def calculate_subtotal(self, items: list[dict]) -> float:
        # TODO: Sum price * quantity for each item and return rounded to 2 decimals
        pass


class ReceiptFormatter:
    \"\"\"Responsible solely for rendering formatted receipt strings.\"\"\"
    def format_receipt(self, store_name: str, total: float) -> str:
        # TODO: Return 'Store: {store_name} | Total: ${total:.2f}'
        pass
"""
        },
        "test_suite": {
            "exercise_about": "Software refactoring pipelines decompose monolithic 'God objects' into cohesive, single-responsibility calculation and presentation modules.",
            "exercise_goal": "Implement OrderPriceCalculator and ReceiptFormatter adhering to SRP.",
            "expected_output": "calc = OrderPriceCalculator()\nsubtotal = calc.calculate_subtotal([{'price': 10.0, 'quantity': 2}])\nReceiptFormatter().format_receipt('Cafe', subtotal) -> 'Store: Cafe | Total: $20.00'",
            "failure_mode": "Failing to separate calculation from formatting.",
            "verification_criteria": "Classes cleanly isolate calculation from presentation logic.",
            "tests.py": """from solution import OrderPriceCalculator, ReceiptFormatter

def test_srp_principle():
    calc = OrderPriceCalculator()
    items = [
        {"name": "Book", "price": 12.50, "quantity": 2},
        {"name": "Pen", "price": 2.00, "quantity": 3}
    ]
    subtotal = calc.calculate_subtotal(items)
    assert subtotal == 31.00

    formatter = ReceiptFormatter()
    receipt = formatter.format_receipt("City Books", subtotal)
    assert receipt == "Store: City Books | Total: $31.00"

    print("✓ All assertions passed for Lesson 2.27: Single Responsibility Principle")

if __name__ == '__main__':
    test_srp_principle()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.28: Open/Closed Principle (OCP)
    # --------------------------------------------------------------------------
    "node-1-28": {
        "title": "Lesson 2.28: Open/Closed Principle (OCP)",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 28 of 50",
        "cs_foundation": "SOLID Principles, Open for Extension / Closed for Modification, and Polymorphic Handlers",
        "ai_convergence": "Real-World Engineering: Adding New Shipping Carrier Adapters Without Touching Core Code",
        "handbook_markdown": """# Lesson 2.28: Open/Closed Principle (OCP)

The **Open/Closed Principle (OCP)**—the 'O' in SOLID—states: *"Software entities (classes, modules, functions) should be open for extension, but closed for modification."*

You should be able to add new functionality (such as a new FedEx or DHL shipping carrier) by writing a **new class**, without modifying and potentially breaking existing, battle-tested shipping router code.

---

## 💡 The Real-World Mental Model: USB Ports on a Laptop

- **Violation (Closed to Extension)**: A laptop with internal circuit boards soldered directly to one specific printer model. If you buy a new microphone, you have to solder open the laptop's motherboard.
- **OCP Adherence (USB Ports)**: The laptop exposes an open USB port specification. You can plug in a mouse, a keyboard, or a brand new camera invented 5 years later without opening the laptop casing.

```
ShippingCalculator
   └── Evaluates carrier.calculate_rate(weight)
         ├── StandardGroundCarrier
         ├── ExpressAirCarrier
         └── NewDroneCarrier (Added without touching ShippingCalculator!)
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement an extensible shipping rate architecture:

1. **`GroundShipping`**:
   - `calculate_rate(self, weight_kg: float) -> float`: Returns `round(weight_kg * 1.5 + 5.0, 2)`.
2. **`ExpressShipping`**:
   - `calculate_rate(self, weight_kg: float) -> float`: Returns `round(weight_kg * 3.0 + 15.0, 2)`.
3. **`ShippingRateCalculator`**:
   - `calculate(self, carrier, weight_kg: float) -> float`:
     - Calls and returns `carrier.calculate_rate(weight_kg)`.

---

## ⚠️ Common Pitfalls

- **Using `if carrier_type == "ground": ... elif carrier_type == "express":`**: Switch statements on types violate OCP because adding a carrier requires modifying the function. Use polymorphism instead.
""",
        "starter_code": {
            "solution.py": """class GroundShipping:
    def calculate_rate(self, weight_kg: float) -> float:
        # TODO: Return weight_kg * 1.5 + 5.0 rounded to 2 decimals
        pass


class ExpressShipping:
    def calculate_rate(self, weight_kg: float) -> float:
        # TODO: Return weight_kg * 3.0 + 15.0 rounded to 2 decimals
        pass


class ShippingRateCalculator:
    \"\"\"Open for extension: accepts any carrier implementing calculate_rate.\"\"\"
    def calculate(self, carrier, weight_kg: float) -> float:
        # TODO: Delegate to carrier.calculate_rate(weight_kg)
        pass
"""
        },
        "test_suite": {
            "exercise_about": "Logistics rate calculators adhere to OCP by allowing third-party logistics carriers to be plugged in polymorphically without modifying core router logic.",
            "exercise_goal": "Implement GroundShipping, ExpressShipping, and ShippingRateCalculator.",
            "expected_output": "calc = ShippingRateCalculator()\ncalc.calculate(GroundShipping(), 10.0) -> 20.00\ncalc.calculate(ExpressShipping(), 10.0) -> 45.00",
            "failure_mode": "Using if/elif type checks instead of delegating to carrier object.",
            "verification_criteria": "Calculator evaluates rates polymorphically across distinct carrier implementations.",
            "tests.py": """from solution import GroundShipping, ExpressShipping, ShippingRateCalculator

def test_ocp_principle():
    calc = ShippingRateCalculator()

    ground = GroundShipping()
    assert calc.calculate(ground, 10.0) == 20.00

    express = ExpressShipping()
    assert calc.calculate(express, 10.0) == 45.00

    # Test adding a brand new carrier without modifying ShippingRateCalculator
    class DroneCarrier:
        def calculate_rate(self, weight_kg: float) -> float:
            return 50.0

    assert calc.calculate(DroneCarrier(), 5.0) == 50.0

    print("✓ All assertions passed for Lesson 2.28: Open/Closed Principle")

if __name__ == '__main__':
    test_ocp_principle()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.29: Liskov Substitution Principle (LSP)
    # --------------------------------------------------------------------------
    "node-1-29": {
        "title": "Lesson 2.29: Liskov Substitution Principle (LSP)",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 29 of 50",
        "cs_foundation": "SOLID Principles, Liskov Substitution Principle (LSP), and Subtype Behavioral Contracts",
        "ai_convergence": "Real-World Engineering: Preventing Inheritance Violations (The Classic Square/Rectangle Bug)",
        "handbook_markdown": """# Lesson 2.29: Liskov Substitution Principle (LSP)

The **Liskov Substitution Principle (LSP)**—the 'L' in SOLID—states: *"Subtypes must be substitutable for their base types without altering the correctness of the program."*

If class `B` inherits from class `A`, your application should be able to pass an instance of `B` anywhere `A` is expected without crashes, unexpected exceptions, or broken mathematical assumptions.

---

## 💡 The Real-World Mental Model: A Stunt Double Actor

Imagine an action movie director:
- The script calls for the lead actor (**Base Class**) to drive a motorcycle at 50 MPH.
- The stunt double (**Subclass**) steps in. The stunt double must be able to drive the motorcycle at 50 MPH without altering the movie scene.
- If the stunt double suddenly raises their hands and says *"I don't know how to drive a motorcycle"* (raising an unexpected `NotImplementedError`), the production crashes.

```
Base: Rectangle(width, height) -> Area: width * height
Subclass: Square(side)         -> Mutating width secretly changes height! (Violates LSP!)

Clean LSP: Shape -> area() implemented independently by both!
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement LSP-compliant geometric shapes:

1. **`Shape` (Base Protocol)**:
   - `def area(self) -> float`: Returns area.
2. **`Rectangle(Shape)`**:
   - `__init__(self, width: float, height: float)`: stores `self.width` and `self.height`.
   - `area(self) -> float`: Returns `round(self.width * self.height, 2)`.
3. **`Square(Shape)`**:
   - `__init__(self, side: float)`: stores `self.side`.
   - `area(self) -> float`: Returns `round(self.side * self.side, 2)`.
4. **`calculate_total_area(shapes: list[Shape]) -> float`**:
   - Sums `s.area()` for all shapes in list, returning rounded float.

---

## ⚠️ Common Pitfalls

- **Subclasses raising unexpected exceptions on base methods**: Overriding a base method with `raise NotImplementedError` is an immediate violation of LSP.
""",
        "starter_code": {
            "solution.py": """class Shape:
    def area(self) -> float:
        # TODO: Base area method contract
        pass


class Rectangle(Shape):
    def __init__(self, width: float, height: float):
        # TODO: Store width and height
        pass

    def area(self) -> float:
        # TODO: Return width * height
        pass


class Square(Shape):
    def __init__(self, side: float):
        # TODO: Store side
        pass

    def area(self) -> float:
        # TODO: Return side * side
        pass


def calculate_total_area(shapes: list[Shape]) -> float:
    # TODO: Sum area() for all shapes in list
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Geometry engines adhere to LSP by guaranteeing that all shape subtypes fulfill the area contract without unexpected side effects or mutations.",
            "exercise_goal": "Implement Rectangle, Square, and calculate_total_area adhering strictly to LSP.",
            "expected_output": "calculate_total_area([Rectangle(4, 5), Square(3)]) -> 29.00",
            "failure_mode": "Failing to inherit from Shape or incorrect area calculations.",
            "verification_criteria": "Subtypes cleanly substitute for base Shape type in polymorphic calculations.",
            "tests.py": """from solution import Rectangle, Square, calculate_total_area

def test_lsp_principle():
    rect = Rectangle(10.0, 5.0)
    assert rect.area() == 50.0

    sq = Square(4.0)
    assert sq.area() == 16.0

    total = calculate_total_area([rect, sq, Rectangle(2.0, 3.0)])
    assert total == 72.0

    print("✓ All assertions passed for Lesson 2.29: Liskov Substitution Principle")

if __name__ == '__main__':
    test_lsp_principle()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.30: Interface Segregation Principle (ISP)
    # --------------------------------------------------------------------------
    "node-1-30": {
        "title": "Lesson 2.30: Interface Segregation Principle (ISP)",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 30 of 50",
        "cs_foundation": "SOLID Principles, Interface Segregation Principle (ISP), and Granular Focused Interfaces",
        "ai_convergence": "Real-World Engineering: Segregating Read-Only vs Writable Storage Contracts",
        "handbook_markdown": """# Lesson 2.30: Interface Segregation Principle (ISP)

The **Interface Segregation Principle (ISP)**—the 'I' in SOLID—states: *"Clients should not be forced to depend on methods they do not use."*

Instead of creating one giant "fat interface" containing 20 methods (`read`, `write`, `delete`, `audit`, `stream`), create small, granular interfaces (`Readable`, `Writable`, `Deletable`).

---

## 💡 The Real-World Mental Model: A Simple Reading Light vs A Cockpit Dashboard

- **Fat Interface (Violation)**: Forcing someone who just wants to read a book in bed to sit in an airplane cockpit with 200 blinking dials, autopilot toggles, and rudder pedals.
- **Segregated Interfaces (ISP)**: A simple bedtime lamp with a single `toggle()` switch. The book reader depends solely on the `Readable` interface without being burdened by flight avionics.

```
Fat Interface (Bad):
StorageEngine -> [read, write, delete, purge, replicate, snapshot]

Segregated Interfaces (Clean):
Reader -> [read]
Writer -> [write]
Deleter -> [delete]
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement segregated storage protocols:

1. **`class ReadOnlyStorage`**:
   - `def __init__(self, data_store: dict)`: `self._data = data_store`.
   - `def get(self, key: str, default=None)`: Returns `self._data.get(key, default)`.
2. **`class WritableStorage`**:
   - `def __init__(self, data_store: dict)`: `self._data = data_store`.
   - `def set(self, key: str, value)`: Sets `self._data[key] = value`.
3. **`audit_read_only_client(reader: ReadOnlyStorage, key: str)`**:
   - Calls and returns `reader.get(key)`.

---

## ⚠️ Common Pitfalls

- **Forcing read-only adapters to implement dummy write methods**: Never write `def write(self): raise NotImplementedError`. Split the interfaces instead!
""",
        "starter_code": {
            "solution.py": """class ReadOnlyStorage:
    \"\"\"Focused interface strictly providing read-only access.\"\"\"
    def __init__(self, data_store: dict):
        self._data = data_store

    def get(self, key: str, default=None):
        # TODO: Return value for key from _data
        pass


class WritableStorage:
    \"\"\"Focused interface strictly providing write access.\"\"\"
    def __init__(self, data_store: dict):
        self._data = data_store

    def set(self, key: str, value) -> None:
        # TODO: Store key-value in _data
        pass


def audit_read_only_client(reader: ReadOnlyStorage, key: str):
    \"\"\"Consumes only the ReadOnlyStorage contract without write dependencies.\"\"\"
    # TODO: Fetch and return key from reader
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Security boundaries enforce Interface Segregation by providing separate read-only vs read-write database clients to prevent unauthorized mutations.",
            "exercise_goal": "Implement ReadOnlyStorage, WritableStorage, and audit_read_only_client.",
            "expected_output": "db = {'role': 'admin'}\nreader = ReadOnlyStorage(db)\naudit_read_only_client(reader, 'role') -> 'admin'",
            "failure_mode": "Exposing write methods on ReadOnlyStorage or failing to retrieve values.",
            "verification_criteria": "Classes provide segregated read and write capabilities independently.",
            "tests.py": """from solution import ReadOnlyStorage, WritableStorage, audit_read_only_client

def test_isp_principle():
    shared_db = {"theme": "dark", "version": 2}

    reader = ReadOnlyStorage(shared_db)
    writer = WritableStorage(shared_db)

    assert audit_read_only_client(reader, "theme") == "dark"
    assert not hasattr(reader, "set") # Guarantees read-only interface segregation!

    writer.set("theme", "light")
    assert audit_read_only_client(reader, "theme") == "light"

    print("✓ All assertions passed for Lesson 2.30: Interface Segregation Principle")

if __name__ == '__main__':
    test_isp_principle()
"""
        }
    }
}

def apply_patch():
    print(f"Applying patch to {len(LESSONS_2_21_TO_35)} lessons in Module 2 (node-1-21 to node-1-30)...")
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    for node_id, data in LESSONS_2_21_TO_35.items():
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
