# build_m2_data.py
# All 50 structured lessons for Module 2: Software Craftsmanship & Object-Oriented Design

M2_LESSONS = [
    # BLOCK A: OOP Fundamentals (1-10)
    {
        "num": 1, "xp": 120,
        "title": "The OOP Mental Model: Objects, Classes & Instances",
        "ai_conv": "Modeling an LLM API client as an object with state (api_key, model) and behavior (call, stream)",
        "subtopics": [
            "2.1.1 The class as a blueprint vs the instance as a runtime object in heap memory",
            "2.1.2 Attributes: instance state bound to self vs class-level shared state",
            "2.1.3 Naming conventions: PascalCase for classes, snake_case for attributes and methods",
            "2.1.4 Real-world analogy: a class is a cookie-cutter, instances are individual cookies"
        ],
        "failure_mode": "Confusing class attributes with instance attributes, causing shared mutable state across all instances.",
        "verification": "Define class LLMClient with instance attributes api_key and model, and a describe() method.",
        "starter": (
            "class LLMClient:\n"
            "    \"\"\"\n"
            "    Represents a configured client for a single LLM API.\n"
            "    Each instance holds its own api_key and model name.\n"
            "    \"\"\"\n"
            "    def __init__(self, api_key: str, model: str = 'gpt-4o'):\n"
            "        self.api_key = api_key\n"
            "        self.model = model\n\n"
            "    def describe(self) -> str:\n"
            "        return f'LLMClient(model={self.model})'\n"
        ),
        "tests": (
            "from solution import LLMClient\n\n"
            "def test_oop_mental_model():\n"
            "    c1 = LLMClient('sk-abc', 'gpt-4o')\n"
            "    c2 = LLMClient('sk-xyz', 'claude-3-haiku')\n"
            "    assert c1.api_key == 'sk-abc'\n"
            "    assert c2.model == 'claude-3-haiku'\n"
            "    assert c1.model != c2.model, 'Instances must be independent'\n"
            "    assert c1.describe() == 'LLMClient(model=gpt-4o)'\n"
            "    print('✓ Lesson 2.1 passed')\n\n"
            "if __name__ == '__main__':\n    test_oop_mental_model()\n"
        ),
        "defense": [
            "What is the difference between a class attribute and an instance attribute?",
            "Why does mutating a class-level list attribute affect all instances?",
            "When would you intentionally use a class attribute for shared state?"
        ]
    },
    {
        "num": 2, "xp": 120,
        "title": "__init__, __new__ & Instance Attribute Binding",
        "ai_conv": "Initializing an AI agent with validated config at construction time using validation guards",
        "subtopics": [
            "2.2.1 __init__ as an initializer: self is already allocated before __init__ runs",
            "2.2.2 __new__ as the true constructor: object allocation before initialization",
            "2.2.3 Attribute binding order and why __init__ must set all attributes explicitly",
            "2.2.4 Guard clauses in __init__ to prevent instantiation with malformed parameters"
        ],
        "failure_mode": "Conditionally setting attributes in __init__ so some instances lack attributes, causing AttributeError later.",
        "verification": "Implement class PromptConfig with validated __init__ raising ValueError on invalid temperature.",
        "starter": (
            "class PromptConfig:\n"
            "    \"\"\"\n"
            "    Holds configuration for a single LLM prompt invocation.\n"
            "    Raises ValueError if temperature not in [0.0, 2.0] or max_tokens <= 0.\n"
            "    \"\"\"\n"
            "    def __init__(self, model: str, temperature: float = 0.7, max_tokens: int = 2048):\n"
            "        if not (0.0 <= temperature <= 2.0):\n"
            "            raise ValueError('Temperature must be between 0.0 and 2.0')\n"
            "        if max_tokens <= 0:\n"
            "            raise ValueError('max_tokens must be positive')\n"
            "        self.model = model\n"
            "        self.temperature = temperature\n"
            "        self.max_tokens = max_tokens\n"
        ),
        "tests": (
            "from solution import PromptConfig\n\n"
            "def test_init_binding():\n"
            "    cfg = PromptConfig('gpt-4o', 0.5, 1024)\n"
            "    assert cfg.model == 'gpt-4o'\n"
            "    assert cfg.temperature == 0.5\n"
            "    assert cfg.max_tokens == 1024\n"
            "    try:\n"
            "        PromptConfig('x', temperature=3.0)\n"
            "        assert False, 'Should raise ValueError'\n"
            "    except ValueError:\n"
            "        pass\n"
            "    try:\n"
            "        PromptConfig('x', max_tokens=-1)\n"
            "        assert False\n"
            "    except ValueError:\n"
            "        pass\n"
            "    print('✓ Lesson 2.2 passed')\n\n"
            "if __name__ == '__main__':\n    test_init_binding()\n"
        ),
        "defense": [
            "What is the difference between __new__ and __init__?",
            "Why should all instance attributes be defined in __init__ rather than dynamically added later?",
            "How do guard clauses in __init__ preserve class invariants?"
        ]
    },
    {
        "num": 3, "xp": 120,
        "title": "Instance Methods, Class Methods & Static Methods",
        "ai_conv": "Designing an LLMClient with from_env() classmethod factory, a static validate_model() helper, and instance call() method",
        "subtopics": [
            "2.3.1 Instance methods: bound to self, accessing and mutating instance state",
            "2.3.2 @classmethod: bound to cls, used as alternative constructors (factory pattern)",
            "2.3.3 @staticmethod: no binding, pure utility function namespaced under the class",
            "2.3.4 When to use each: the decision tree based on state access requirements"
        ],
        "failure_mode": "Using @staticmethod when the method needs cls, or @classmethod when self is needed.",
        "verification": "Implement ModelRegistry with @classmethod from_list(), @staticmethod validate_name(), and instance lookup().",
        "starter": (
            "class ModelRegistry:\n"
            "    VALID_PREFIXES = ('gpt-', 'claude-', 'gemini-')\n\n"
            "    def __init__(self, models: list[str]):\n"
            "        self.models = list(models)\n\n"
            "    @classmethod\n"
            "    def from_list(cls, model_list: list[str]) -> 'ModelRegistry':\n"
            "        valid = [m for m in model_list if cls.validate_name(m)]\n"
            "        return cls(valid)\n\n"
            "    @staticmethod\n"
            "    def validate_name(name: str) -> bool:\n"
            "        return name.startswith(ModelRegistry.VALID_PREFIXES)\n\n"
            "    def lookup(self, name: str) -> bool:\n"
            "        return name in self.models\n"
        ),
        "tests": (
            "from solution import ModelRegistry\n\n"
            "def test_method_types():\n"
            "    reg = ModelRegistry.from_list(['gpt-4o', 'bad-model', 'claude-haiku'])\n"
            "    assert reg.lookup('gpt-4o') is True\n"
            "    assert reg.lookup('bad-model') is False\n"
            "    assert ModelRegistry.validate_name('gemini-pro') is True\n"
            "    assert ModelRegistry.validate_name('llama-3') is False\n"
            "    print('✓ Lesson 2.3 passed')\n\n"
            "if __name__ == '__main__':\n    test_method_types()\n"
        ),
        "defense": [
            "Why is @classmethod preferred for alternative constructors?",
            "What happens when you call a @staticmethod via an instance vs via the class?",
            "When does a utility function belong as a @staticmethod on a class vs a standalone module function?"
        ]
    },
    {
        "num": 4, "xp": 120,
        "title": "Encapsulation: Private Conventions & @property",
        "ai_conv": "Protecting an AI client's api_key from direct mutation while exposing a masked read property",
        "subtopics": [
            "2.4.1 Python's encapsulation convention: single underscore _attr vs double __attr",
            "2.4.2 Name mangling: _ClassName__attr and why it is intended to avoid collision, not provide security",
            "2.4.3 @property getter: exposing read-only computed or guarded attributes",
            "2.4.4 @attr.setter: validating mutations through a controlled interface"
        ],
        "failure_mode": "Using double-underscore name mangling thinking it provides true security; it only prevents accidental name collisions.",
        "verification": "Implement SecureAPIClient where api_key is stored as _api_key and exposed masked via @property.",
        "starter": (
            "class SecureAPIClient:\n"
            "    def __init__(self, api_key: str):\n"
            "        if not api_key or not api_key.startswith('sk-'):\n"
            "            raise ValueError('API key must start with sk-')\n"
            "        self._api_key = api_key\n\n"
            "    @property\n"
            "    def api_key(self) -> str:\n"
            "        if len(self._api_key) <= 6:\n"
            "            return 'sk-...'\n"
            "        return f'sk-...{self._api_key[-4:]}'\n\n"
            "    @api_key.setter\n"
            "    def api_key(self, value: str) -> None:\n"
            "        if not value or not value.startswith('sk-'):\n"
            "            raise ValueError('API key must start with sk-')\n"
            "        self._api_key = value\n"
        ),
        "tests": (
            "from solution import SecureAPIClient\n\n"
            "def test_encapsulation():\n"
            "    client = SecureAPIClient('sk-abc123xyz')\n"
            "    masked = client.api_key\n"
            "    assert masked.startswith('sk-...')\n"
            "    assert masked.endswith('xyz')\n"
            "    assert 'abc123' not in masked\n"
            "    client.api_key = 'sk-newkey9999'\n"
            "    assert client._api_key == 'sk-newkey9999'\n"
            "    try:\n"
            "        client.api_key = 'invalid'\n"
            "        assert False\n"
            "    except ValueError:\n"
            "        pass\n"
            "    print('✓ Lesson 2.4 passed')\n\n"
            "if __name__ == '__main__':\n    test_encapsulation()\n"
        ),
        "defense": [
            "What does Python's double-underscore name mangling actually do at runtime?",
            "Why is Python considered a 'consenting adults' language regarding private attributes?",
            "When should you use @property getters and setters instead of public attributes?"
        ]
    },
    {
        "num": 5, "xp": 120,
        "title": "Inheritance: Subclasses, super() & Method Overriding",
        "ai_conv": "Building a BaseModelClient with subclasses OpenAIClient and AnthropicClient that override the format_request() method",
        "subtopics": [
            "2.5.1 Inheritance syntax: class Child(Parent) and the is-a relationship contract",
            "2.5.2 Method overriding: redefining a parent method to change behavior in the subclass",
            "2.5.3 super(): delegating to the parent class implementation without hardcoding the parent name",
            "2.5.4 The Liskov Substitution Principle: a subclass must be usable everywhere the parent is"
        ],
        "failure_mode": "Hardcoding the parent class name instead of super(), breaking multiple inheritance cooperative calls.",
        "verification": "Implement BaseModelClient and OpenAIClient subclass that overrides format_request() and calls super().__init__().",
        "starter": (
            "class BaseModelClient:\n"
            "    def __init__(self, api_key: str, model: str):\n"
            "        self.api_key = api_key\n"
            "        self.model = model\n\n"
            "    def format_request(self, prompt: str) -> dict:\n"
            "        return {'model': self.model, 'prompt': prompt}\n\n"
            "    def client_name(self) -> str:\n"
            "        return 'BaseModelClient'\n\n\n"
            "class OpenAIClient(BaseModelClient):\n"
            "    def __init__(self, api_key: str, model: str = 'gpt-4o', org_id: str = ''):\n"
            "        super().__init__(api_key, model)\n"
            "        self.org_id = org_id\n\n"
            "    def format_request(self, prompt: str) -> dict:\n"
            "        return {\n"
            "            'model': self.model,\n"
            "            'messages': [{'role': 'user', 'content': prompt}],\n"
            "            'org': self.org_id\n"
            "        }\n\n"
            "    def client_name(self) -> str:\n"
            "        return 'OpenAIClient'\n"
        ),
        "tests": (
            "from solution import BaseModelClient, OpenAIClient\n\n"
            "def test_inheritance():\n"
            "    base = BaseModelClient('sk-x', 'base-model')\n"
            "    assert base.format_request('Hi') == {'model': 'base-model', 'prompt': 'Hi'}\n"
            "    oai = OpenAIClient('sk-abc', 'gpt-4o', org_id='org-123')\n"
            "    assert oai.model == 'gpt-4o'\n"
            "    assert oai.org_id == 'org-123'\n"
            "    req = oai.format_request('Explain Python')\n"
            "    assert req['messages'][0]['content'] == 'Explain Python'\n"
            "    assert req['org'] == 'org-123'\n"
            "    assert isinstance(oai, BaseModelClient)\n"
            "    print('✓ Lesson 2.5 passed')\n\n"
            "if __name__ == '__main__':\n    test_inheritance()\n"
        ),
        "defense": [
            "What is the Liskov Substitution Principle and how does it relate to subclassing?",
            "Why is super() preferred over explicit parent class references?",
            "When should a subclass completely override vs extend a base method?"
        ]
    },
    {
        "num": 6, "xp": 120,
        "title": "Composition Over Inheritance: Dependency Injection",
        "ai_conv": "Building an AIOrchestrator that composes a Logger, RateLimiter, and ModelClient rather than inheriting from all three",
        "subtopics": [
            "2.6.1 The inheritance vs composition decision: is-a vs has-a relationships",
            "2.6.2 Composition: passing collaborator objects as constructor arguments (Dependency Injection)",
            "2.6.3 Why deep inheritance hierarchies become rigid and impossible to test in isolation",
            "2.6.4 Duck typing: composing objects that fulfill a protocol without inheriting from a common base"
        ],
        "failure_mode": "Inheriting from multiple concrete classes to gain their behavior, creating tight coupling and fragile hierarchies.",
        "verification": "Implement AIOrchestrator that accepts a client and logger via DI and delegates to them without inheriting.",
        "starter": (
            "class ConsoleLogger:\n"
            "    def log(self, message: str) -> None:\n"
            "        print(f'[LOG] {message}')\n\n\n"
            "class AIOrchestrator:\n"
            "    def __init__(self, client, logger):\n"
            "        self._client = client\n"
            "        self._logger = logger\n\n"
            "    def run(self, prompt: str) -> dict:\n"
            "        self._logger.log(f'Processing prompt: {prompt}')\n"
            "        req = self._client.format_request(prompt)\n"
            "        return req\n"
        ),
        "tests": (
            "from solution import AIOrchestrator, ConsoleLogger\n\n"
            "class MockClient:\n"
            "    def format_request(self, prompt):\n"
            "        return {'prompt': prompt, 'mock': True}\n\n"
            "class CaptureLogger:\n"
            "    def __init__(self): self.logs = []\n"
            "    def log(self, msg): self.logs.append(msg)\n\n"
            "def test_composition():\n"
            "    logger = CaptureLogger()\n"
            "    client = MockClient()\n"
            "    orch = AIOrchestrator(client, logger)\n"
            "    result = orch.run('Summarize this')\n"
            "    assert result['mock'] is True\n"
            "    assert any('Summarize this' in l for l in logger.logs)\n"
            "    assert not isinstance(orch, MockClient)\n"
            "    print('✓ Lesson 2.6 passed')\n\n"
            "if __name__ == '__main__':\n    test_composition()\n"
        ),
        "defense": [
            "What is dependency injection and how does it enable testability?",
            "Why does deep class inheritance make code harder to refactor?",
            "What is duck typing and how does it enable composition without shared base classes?"
        ]
    },
    {
        "num": 7, "xp": 130,
        "title": "Abstract Base Classes & typing.Protocol",
        "ai_conv": "Defining a ModelClient ABC that all provider clients (OpenAI, Anthropic, Gemini) must implement",
        "subtopics": [
            "2.7.1 abc.ABC and @abstractmethod: enforcing method contracts on subclasses at instantiation time",
            "2.7.2 Abstract properties: using @property with @abstractmethod for computed attribute contracts",
            "2.7.3 typing.Protocol: structural subtyping (duck typing with static analysis support)",
            "2.7.4 ABC vs Protocol: nominal subtyping (explicit inheritance) vs structural subtyping (shape matching)"
        ],
        "failure_mode": "Instantiating an ABC that has unimplemented abstract methods, causing TypeError.",
        "verification": "Define a ModelClient ABC with abstract call() and stream() methods, and a compliant ConcreteClient.",
        "starter": (
            "from abc import ABC, abstractmethod\n\n\n"
            "class ModelClient(ABC):\n"
            "    @abstractmethod\n"
            "    def call(self, messages: list[dict]) -> dict:\n"
            "        ...\n\n"
            "    @abstractmethod\n"
            "    def stream(self, messages: list[dict]):\n"
            "        ...\n\n\n"
            "class MockModelClient(ModelClient):\n"
            "    def __init__(self, response_text: str):\n"
            "        self.response_text = response_text\n\n"
            "    def call(self, messages: list[dict]) -> dict:\n"
            "        return {'content': self.response_text, 'tokens': len(self.response_text)}\n\n"
            "    def stream(self, messages: list[dict]):\n"
            "        for word in self.response_text.split():\n"
            "            yield word\n"
        ),
        "tests": (
            "from solution import ModelClient, MockModelClient\n\n"
            "def test_abc():\n"
            "    try:\n"
            "        ModelClient()\n"
            "        assert False, 'Should not instantiate abstract class'\n"
            "    except TypeError:\n"
            "        pass\n"
            "    client = MockModelClient('Hello world')\n"
            "    result = client.call([{'role': 'user', 'content': 'Hi'}])\n"
            "    assert result['content'] == 'Hello world'\n"
            "    chunks = list(client.stream([{'role': 'user', 'content': 'Hi'}]))\n"
            "    assert len(chunks) == 2\n"
            "    assert isinstance(client, ModelClient)\n"
            "    print('✓ Lesson 2.7 passed')\n\n"
            "if __name__ == '__main__':\n    test_abc()\n"
        ),
        "defense": [
            "What is the difference between abc.ABC and typing.Protocol?",
            "Why does Python raise TypeError when abstract methods are not implemented?",
            "When would you choose Protocol over ABC?"
        ]
    },
    {
        "num": 8, "xp": 130,
        "title": "Magic Methods: __repr__, __str__, __eq__ & __hash__",
        "ai_conv": "Making AI response objects printable, comparable, and usable as dictionary keys in caching systems",
        "subtopics": [
            "2.8.1 __repr__: unambiguous developer representation for debugging",
            "2.8.2 __str__: human-readable string for display",
            "2.8.3 __eq__: value equality based on logical attributes, not memory identity",
            "2.8.4 __hash__: required for sets and dict keys; must be consistent with __eq__"
        ],
        "failure_mode": "Defining __eq__ without __hash__, making the object unhashable and unusable in sets or dict keys.",
        "verification": "Implement ModelSpec with __repr__, __str__, __eq__, and __hash__ based on (name, version).",
        "starter": (
            "class ModelSpec:\n"
            "    def __init__(self, name: str, version: str):\n"
            "        self.name = name\n"
            "        self.version = version\n\n"
            "    def __repr__(self) -> str:\n"
            "        return f\"ModelSpec(name='{self.name}', version='{self.version}')\"\n\n"
            "    def __str__(self) -> str:\n"
            "        return f'{self.name}@{self.version}'\n\n"
            "    def __eq__(self, other: object) -> bool:\n"
            "        if not isinstance(other, ModelSpec): return NotImplemented\n"
            "        return self.name == other.name and self.version == other.version\n\n"
            "    def __hash__(self) -> int:\n"
            "        return hash((self.name, self.version))\n"
        ),
        "tests": (
            "from solution import ModelSpec\n\n"
            "def test_magic_methods():\n"
            "    m1 = ModelSpec('gpt-4o', '2024-08')\n"
            "    m2 = ModelSpec('gpt-4o', '2024-08')\n"
            "    m3 = ModelSpec('claude-haiku', '2024-01')\n"
            "    assert repr(m1) == \"ModelSpec(name='gpt-4o', version='2024-08')\"\n"
            "    assert str(m1) == 'gpt-4o@2024-08'\n"
            "    assert m1 == m2\n"
            "    assert m1 != m3\n"
            "    spec_set = {m1, m2, m3}\n"
            "    assert len(spec_set) == 2\n"
            "    cache = {m1: 'data'}\n"
            "    assert cache[m2] == 'data'\n"
            "    print('✓ Lesson 2.8 passed')\n\n"
            "if __name__ == '__main__':\n    test_magic_methods()\n"
        ),
        "defense": [
            "What contract must __hash__ satisfy relative to __eq__?",
            "Why does Python set __hash__ to None when __eq__ is defined without __hash__?",
            "What is the difference between identity (is) and equality (==)?"
        ]
    },
    {
        "num": 9, "xp": 130,
        "title": "Operator Overloading: __add__, __lt__, __contains__",
        "ai_conv": "Making a TokenBudget object support + (combining budgets), < (comparing costs), and in (checking fit)",
        "subtopics": [
            "2.9.1 Arithmetic operator protocols: __add__, __sub__, __mul__",
            "2.9.2 Comparison operator protocols: __lt__, __le__, __gt__, __ge__ and functools.total_ordering",
            "2.9.3 Membership operator: __contains__ for the in keyword",
            "2.9.4 Returning NotImplemented to enable fallback operations"
        ],
        "failure_mode": "Raising TypeError inside __add__ instead of returning NotImplemented, breaking fallback logic.",
        "verification": "Implement TokenBudget supporting +, <, and 'in' operator for checking if tokens fit within budget.",
        "starter": (
            "import functools\n\n\n"
            "@functools.total_ordering\n"
            "class TokenBudget:\n"
            "    def __init__(self, limit: int):\n"
            "        if limit < 0: raise ValueError('limit must be non-negative')\n"
            "        self.limit = limit\n\n"
            "    def __add__(self, other: 'TokenBudget') -> 'TokenBudget':\n"
            "        if not isinstance(other, TokenBudget): return NotImplemented\n"
            "        return TokenBudget(self.limit + other.limit)\n\n"
            "    def __eq__(self, other: object) -> bool:\n"
            "        if not isinstance(other, TokenBudget): return NotImplemented\n"
            "        return self.limit == other.limit\n\n"
            "    def __lt__(self, other: 'TokenBudget') -> bool:\n"
            "        if not isinstance(other, TokenBudget): return NotImplemented\n"
            "        return self.limit < other.limit\n\n"
            "    def __contains__(self, tokens: int) -> bool:\n"
            "        return tokens <= self.limit\n\n"
            "    def __repr__(self) -> str:\n"
            "        return f'TokenBudget(limit={self.limit})'\n"
        ),
        "tests": (
            "from solution import TokenBudget\n\n"
            "def test_operators():\n"
            "    b1 = TokenBudget(1000)\n"
            "    b2 = TokenBudget(2000)\n"
            "    combined = b1 + b2\n"
            "    assert combined.limit == 3000\n"
            "    assert b1 < b2\n"
            "    assert b2 > b1\n"
            "    assert 500 in b1\n"
            "    assert 1500 not in b1\n"
            "    print('✓ Lesson 2.9 passed')\n\n"
            "if __name__ == '__main__':\n    test_operators()\n"
        ),
        "defense": [
            "Why should __add__ return NotImplemented instead of raising TypeError?",
            "What does functools.total_ordering provide?",
            "How does the __contains__ protocol interact with standard boolean expressions?"
        ]
    },
    {
        "num": 10, "xp": 130,
        "title": "The Container Protocol: __len__, __getitem__ & __iter__",
        "ai_conv": "Building a ConversationHistory class that behaves like a list for indexing, slicing, and iteration over chat messages",
        "subtopics": [
            "2.10.1 __len__: enabling len() and truthiness evaluation on custom objects",
            "2.10.2 __getitem__: enabling index access obj[i], slicing obj[1:3], and iteration fallback",
            "2.10.3 __iter__: explicit iteration protocol using iterators",
            "2.10.4 Container contracts: distinction between Iterable, Collection, and Sequence"
        ],
        "failure_mode": "Implementing __getitem__ without handling slice objects, breaking slice syntax.",
        "verification": "Implement ConversationHistory that supports len(), indexing, slicing, and for-loop iteration.",
        "starter": (
            "class ConversationHistory:\n"
            "    def __init__(self):\n"
            "        self._messages: list[dict] = []\n\n"
            "    def append(self, role: str, content: str) -> None:\n"
            "        self._messages.append({'role': role, 'content': content})\n\n"
            "    def __len__(self) -> int:\n"
            "        return len(self._messages)\n\n"
            "    def __getitem__(self, index):\n"
            "        return self._messages[index]\n\n"
            "    def __iter__(self):\n"
            "        return iter(self._messages)\n"
        ),
        "tests": (
            "from solution import ConversationHistory\n\n"
            "def test_container_protocol():\n"
            "    h = ConversationHistory()\n"
            "    h.append('user', 'Hello')\n"
            "    h.append('assistant', 'Hi there')\n"
            "    h.append('user', 'How are you?')\n"
            "    assert len(h) == 3\n"
            "    assert h[0] == {'role': 'user', 'content': 'Hello'}\n"
            "    assert h[-1] == {'role': 'user', 'content': 'How are you?'}\n"
            "    sliced = h[0:2]\n"
            "    assert len(sliced) == 2\n"
            "    roles = [msg['role'] for msg in h]\n"
            "    assert roles == ['user', 'assistant', 'user']\n"
            "    print('✓ Lesson 2.10 passed')\n\n"
            "if __name__ == '__main__':\n    test_container_protocol()\n"
        ),
        "defense": [
            "What happens when Python encounters a for loop on an object with no __iter__ but with __getitem__?",
            "Why does defining __len__ impact bool(obj)?",
            "What is the difference between a sequence and a mapping protocol?"
        ]
    }
]

# Helper to generate next blocks cleanly
# BLOCK B: Deep Python Object Protocol (11-18)
# BLOCK C: Design Patterns for AI Systems (19-26)
# BLOCK D: SOLID Principles & Craftsmanship (27-34)
# BLOCK E: Testing as First-Class Practice (35-42)
# BLOCK F: Applied AI-OOP Integration (43-50)

# We will load and append the full 50 specifications into M2_LESSONS.
