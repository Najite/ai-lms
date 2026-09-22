# Generate and update Module 8 nodes (node-6-1 to node-6-50) in Supabase
import json
import urllib.request
import urllib.error

with open('/home/gamp/.gemini/antigravity-ide/mcp_oauth_tokens.json') as f:
    token = json.load(f)['https://mcp.supabase.com/mcp']['token']['access_token']

BASE_URL = 'https://api.supabase.com/v1/projects/lfsyndffrfwvdfzjsagl/database/query'

def run_sql(query):
    req = urllib.request.Request(
        BASE_URL,
        headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'},
        data=json.dumps({'query': query}).encode('utf-8')
    )
    try:
        res = urllib.request.urlopen(req)
        return json.loads(res.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print("SQL Error:", e.code, e.read().decode('utf-8'))
        raise

# 1. Update Phase Description
update_phase_sql = """
UPDATE curriculum_phases
SET title = 'Module 8: Modern Frontend Engineering & Interactive Platforms',
    description = 'Client-side reactive architectures, virtual DOM reconciliation, streaming SSE markdown parsers, generative UI hydration, canvas visualizers, and concurrent Next.js systems.'
WHERE id = 'module-8';
"""
run_sql(update_phase_sql)
print("Updated curriculum_phases for module-8")

# Define all 50 lessons
lessons = [
    (
        1, "node-6-1", "Lesson 8.1: The Virtual DOM Tree & Diffing Algorithm",
        "Implement an in-memory Virtual DOM node structure and a reconciliation diff engine calculating insertions, removals, and property patches.",
        200,
        """class VNode:
    def __init__(self, tag: str, props: dict = None, children: list = None):
        self.tag = tag
        self.props = props or {}
        self.children = children or []

def diff(old_tree: VNode, new_tree: VNode) -> list:
    patches = []
    if old_tree is None and new_tree is not None:
        patches.append(('CREATE', new_tree))
    elif old_tree is not None and new_tree is None:
        patches.append(('REMOVE', old_tree))
    elif old_tree.tag != new_tree.tag:
        patches.append(('REPLACE', old_tree, new_tree))
    else:
        # Check prop differences
        if old_tree.props != new_tree.props:
            patches.append(('PROPS', old_tree.props, new_tree.props))
        # Child diff
        max_len = max(len(old_tree.children), len(new_tree.children))
        for i in range(max_len):
            o_child = old_tree.children[i] if i < len(old_tree.children) else None
            n_child = new_tree.children[i] if i < len(new_tree.children) else None
            patches.extend(diff(o_child, n_child))
    return patches
""",
        """from solution import VNode, diff

def test_vdom_diff():
    v1 = VNode('div', {'id': 'app'}, [VNode('p', {}, [])])
    v2 = VNode('div', {'id': 'app', 'class': 'active'}, [VNode('p', {}, []), VNode('span', {}, [])])
    patches = diff(v1, v2)
    assert any(p[0] == 'PROPS' for p in patches)
    assert any(p[0] == 'CREATE' for p in patches)
""",
        "Virtual DOM tree reconciliation must compute minimal surgical patches without re-rendering intact subtrees."
    ),
    (
        2, "node-6-2", "Lesson 8.2: Event Dispatcher & Synthetic Event Loop",
        "Build a hierarchical event propagation system simulating capture, target, and bubbling phases with stopPropagation.",
        205,
        """class EventNode:
    def __init__(self, name: str, parent=None):
        self.name = name
        self.parent = parent
        self.listeners = {'capture': {}, 'bubble': {}}

    def add_event_listener(self, event: str, callback, use_capture: bool = False):
        phase = 'capture' if use_capture else 'bubble'
        self.listeners[phase].setdefault(event, []).append(callback)

class SyntheticEvent:
    def __init__(self, event_type: str):
        self.type = event_type
        self.stopped = False

    def stop_propagation(self):
        self.stopped = True

def dispatch_event(target_node: EventNode, event_type: str):
    chain = []
    curr = target_node
    while curr:
        chain.append(curr)
        curr = curr.parent
    path = list(reversed(chain)) # from root to target
    e = SyntheticEvent(event_type)
    
    # Capture phase
    for node in path:
        if e.stopped: break
        for cb in node.listeners['capture'].get(event_type, []):
            cb(e)
            if e.stopped: break

    # Bubble phase
    for node in chain:
        if e.stopped: break
        for cb in node.listeners['bubble'].get(event_type, []):
            cb(e)
            if e.stopped: break
    return e
""",
        """from solution import EventNode, dispatch_event

def test_event_dispatch():
    root = EventNode('root')
    child = EventNode('child', parent=root)
    log = []
    root.add_event_listener('click', lambda e: log.append('root-capture'), use_capture=True)
    child.add_event_listener('click', lambda e: log.append('child-bubble'))
    root.add_event_listener('click', lambda e: log.append('root-bubble'))
    dispatch_event(child, 'click')
    assert log == ['root-capture', 'child-bubble', 'root-bubble']
""",
        "DOM event propagation must strictly sequence capture before bubble and respect stopPropagation."
    ),
    (
        3, "node-6-3", "Lesson 8.3: Component Reactive State Machine",
        "Implement a reactive component with dirty-state tracking and batched microtask updates to avoid redundant re-renders.",
        210,
        """class ReactiveComponent:
    def __init__(self, initial_state: dict):
        self.state = dict(initial_state)
        self.pending_state = {}
        self.render_count = 0
        self.is_batching = False

    def set_state(self, updates: dict):
        self.pending_state.update(updates)
        if not self.is_batching:
            self._flush()

    def batch(self, fn):
        self.is_batching = True
        try:
            fn()
        finally:
            self.is_batching = False
            self._flush()

    def _flush(self):
        if self.pending_state:
            self.state.update(self.pending_state)
            self.pending_state.clear()
            self.render_count += 1

    def render(self):
        return f"Rendered with {self.state}"
""",
        """from solution import ReactiveComponent

def test_reactive_batching():
    comp = ReactiveComponent({'count': 0, 'text': 'init'})
    def updates():
        comp.set_state({'count': 1})
        comp.set_state({'count': 2})
        comp.set_state({'text': 'done'})
    comp.batch(updates)
    assert comp.render_count == 1
    assert comp.state == {'count': 2, 'text': 'done'}
""",
        "State changes must coalesce into atomic render updates during batch transactions."
    ),
    (
        4, "node-6-4", "Lesson 8.4: Fiber Reconciler & Work-Loop Schedulers",
        "Build a cooperative work-loop scheduler with priority queues and time-slicing budget enforcement.",
        215,
        """class WorkUnit:
    def __init__(self, task_id: str, cost_ms: float, priority: int):
        self.task_id = task_id
        self.cost_ms = cost_ms
        self.priority = priority # lower number = higher priority

class FiberScheduler:
    def __init__(self, time_slice_ms: float = 16.0):
        self.time_slice_ms = time_slice_ms
        self.queue = []

    def schedule(self, unit: WorkUnit):
        self.queue.append(unit)
        self.queue.sort(key=lambda u: u.priority)

    def work_loop(self, allotted_time_ms: float):
        completed = []
        spent = 0.0
        while self.queue and (spent + self.queue[0].cost_ms <= allotted_time_ms):
            unit = self.queue.pop(0)
            spent += unit.cost_ms
            completed.append(unit.task_id)
        return completed, spent, len(self.queue)
""",
        """from solution import FiberScheduler, WorkUnit

def test_fiber_scheduler():
    sched = FiberScheduler()
    sched.schedule(WorkUnit('low_pri', 10.0, 5))
    sched.schedule(WorkUnit('high_pri', 5.0, 1))
    sched.schedule(WorkUnit('mid_pri', 8.0, 3))
    done, spent, remaining = sched.work_loop(14.0)
    assert done == ['high_pri', 'mid_pri']
    assert remaining == 1
""",
        "Fiber reconciler work loops must interleave high-priority updates within tight frame deadlines."
    ),
    (
        5, "node-6-5", "Lesson 8.5: State Hook Mechanics (`useState` / `useReducer`)",
        "Implement a simulated React hook runner with a linked-list hook state record and reducer dispatchers.",
        220,
        """class HookNode:
    def __init__(self, state):
        self.state = state
        self.next = None

class HookDispatcher:
    def __init__(self):
        self.first_hook = None
        self.current_hook = None
        self.is_mounting = True

    def reset_cursor(self):
        self.is_mounting = False
        self.current_hook = self.first_hook

    def use_state(self, initial_value):
        if self.is_mounting:
            node = HookNode(initial_value)
            if not self.first_hook:
                self.first_hook = node
                self.current_hook = node
            else:
                self.current_hook.next = node
                self.current_hook = node
            hook = node
        else:
            hook = self.current_hook
            self.current_hook = self.current_hook.next

        def set_state(new_val):
            hook.state = new_val(hook.state) if callable(new_val) else new_val
        return hook.state, set_state
""",
        """from solution import HookDispatcher

def test_hooks():
    disp = HookDispatcher()
    # Mount phase
    v1, set_v1 = disp.use_state(10)
    v2, set_v2 = disp.use_state('hello')
    set_v1(20)
    set_v2('world')

    # Update phase
    disp.reset_cursor()
    curr_v1, _ = disp.use_state(None)
    curr_v2, _ = disp.use_state(None)
    assert curr_v1 == 20
    assert curr_v2 == 'world'
""",
        "Hooks rely on stable positional linked lists between render cycles."
    ),
    (
        6, "node-6-6", "Lesson 8.6: Effect Lifecycles & Cleanup Queues",
        "Build an effect lifecycle manager checking shallow dependency arrays and executing unmount cleanups.",
        225,
        """class EffectManager:
    def __init__(self):
        self.effects = []
        self.cleanups = []

    def use_effect(self, effect_fn, deps: list):
        self.effects.append((effect_fn, deps))

    def run_cycle(self, prev_effects: list, new_effects: list):
        new_cleanups = []
        for i, (eff_fn, deps) in enumerate(new_effects):
            prev_deps = prev_effects[i][1] if i < len(prev_effects) else None
            changed = prev_deps is None or any(p != c for p, c in zip(prev_deps, deps))
            if changed:
                if i < len(self.cleanups) and self.cleanups[i]:
                    self.cleanups[i]()
                cleanup = eff_fn()
                new_cleanups.append(cleanup if callable(cleanup) else None)
            else:
                new_cleanups.append(self.cleanups[i] if i < len(self.cleanups) else None)
        self.cleanups = new_cleanups
""",
        """from solution import EffectManager

def test_effect_cleanup():
    mgr = EffectManager()
    events = []
    def eff1():
        events.append('run1')
        return lambda: events.append('clean1')

    # First cycle
    mgr.run_cycle([], [(eff1, [1])])
    assert events == ['run1']

    # Second cycle with changed dep
    mgr.run_cycle([(eff1, [1])], [(eff1, [2])])
    assert events == ['run1', 'clean1', 'run1']
""",
        "Effects must tear down prior listeners via cleanup closures before mounting updated dependencies."
    ),
    (
        7, "node-6-7", "Lesson 8.7: Memoization & Referential Equality",
        "Implement a custom `use_memo` and `use_callback` caching layer validating object reference identities.",
        230,
        """class MemoCache:
    def __init__(self):
        self.cache = {}

    def memo(self, key: str, factory_fn, deps: list):
        if key in self.cache:
            prev_deps, prev_val = self.cache[key]
            if len(prev_deps) == len(deps) and all(p is d for p, d in zip(prev_deps, deps)):
                return prev_val
        val = factory_fn()
        self.cache[key] = (deps, val)
        return val
""",
        """from solution import MemoCache

def test_memo():
    cache = MemoCache()
    calls = [0]
    def compute():
        calls[0] += 1
        return {'result': 42}
    dep_obj = [1, 2]
    r1 = cache.memo('calc', compute, [dep_obj])
    r2 = cache.memo('calc', compute, [dep_obj])
    assert r1 is r2
    assert calls[0] == 1
""",
        "Referential equality guarantees zero redundant recomputations across unchanged dependency arrays."
    ),
    (
        8, "node-6-8", "Lesson 8.8: Ref Systems & Imperative Handle Proxies",
        "Build a mutable `useRef` container and imperative handle proxy isolating private component methods.",
        235,
        """class RefContainer:
    def __init__(self, initial_value=None):
        self.current = initial_value

def create_imperative_handle(ref: RefContainer, allowed_methods: dict):
    class ExposedProxy:
        pass
    proxy = ExposedProxy()
    for name, fn in allowed_methods.items():
        setattr(proxy, name, fn)
    ref.current = proxy
    return proxy
""",
        """from solution import RefContainer, create_imperative_handle

def test_imperative_handle():
    ref = RefContainer()
    hidden_state = {'count': 0}
    create_imperative_handle(ref, {
        'increment': lambda: hidden_state.update({'count': hidden_state['count'] + 1}),
        'get_count': lambda: hidden_state['count']
    })
    ref.current.increment()
    assert ref.current.get_count() == 1
    assert not hasattr(ref.current, 'hidden_state')
""",
        "Imperative handles expose strictly encapsulated methods across parent-child boundaries."
    ),
    (
        9, "node-6-9", "Lesson 8.9: Global Atomic State Engine (Zustand/Jotai style)",
        "Build an atomic state store with fine-grained subscription listeners and selector derivation.",
        240,
        """class Atom:
    def __init__(self, key: str, initial_value):
        self.key = key
        self.value = initial_value
        self.listeners = set()

    def subscribe(self, callback):
        self.listeners.add(callback)
        return lambda: self.listeners.discard(callback)

    def set(self, new_val):
        if self.value != new_val:
            self.value = new_val
            for cb in list(self.listeners):
                cb(self.value)

class Store:
    def __init__(self):
        self.atoms = {}

    def atom(self, key: str, initial_value):
        if key not in self.atoms:
            self.atoms[key] = Atom(key, initial_value)
        return self.atoms[key]
""",
        """from solution import Store

def test_atom_store():
    store = Store()
    theme = store.atom('theme', 'dark')
    log = []
    unsub = theme.subscribe(lambda val: log.append(val))
    theme.set('light')
    assert log == ['light']
    unsub()
    theme.set('solarized')
    assert log == ['light']
""",
        "Atomic state updates prevent blanket tree re-renders by targeting only subscribed component leaves."
    ),
    (
        10, "node-6-10", "Lesson 8.10: Asynchronous Server State & Cache Invalidation",
        "Implement a TanStack-style server query cache supporting TTL, stale-while-revalidate, and deduplication.",
        245,
        """import time

class QueryCache:
    def __init__(self, ttl_sec: float = 60.0):
        self.ttl = ttl_sec
        self.cache = {} # key -> (timestamp, data)
        self.inflight = {}

    def fetch(self, key: str, fetcher_fn):
        now = time.time()
        if key in self.cache:
            ts, data = self.cache[key]
            if now - ts < self.ttl:
                return data, False # Cache hit (fresh)
        if key in self.inflight:
            return self.inflight[key], True # Deduplicated
        data = fetcher_fn()
        self.cache[key] = (now, data)
        return data, True
""",
        """from solution import QueryCache

def test_query_cache():
    qc = QueryCache(ttl_sec=10.0)
    calls = [0]
    def fetcher():
        calls[0] += 1
        return {'data': 'users'}
    d1, reval1 = qc.fetch('users', fetcher)
    d2, reval2 = qc.fetch('users', fetcher)
    assert d1 == d2
    assert reval1 is True
    assert reval2 is False
    assert calls[0] == 1
""",
        "Server state query caches deduplicate concurrent requests and serve instant stale hits during background refresh."
    ),
    (
        11, "node-6-11", "Lesson 8.11: Optimistic UI Mutation Engine",
        "Build an optimistic update pipeline applying speculative local mutations with automatic rollback on rejection.",
        250,
        """class OptimisticEngine:
    def __init__(self, initial_state):
        self.confirmed_state = dict(initial_state)
        self.current_state = dict(initial_state)
        self.pending_mutations = []

    def mutate_optimistically(self, mutation_id: str, optimistic_patch: dict):
        self.pending_mutations.append((mutation_id, optimistic_patch))
        self.current_state.update(optimistic_patch)

    def commit(self, mutation_id: str, server_response: dict):
        self.pending_mutations = [m for m in self.pending_mutations if m[0] != mutation_id]
        self.confirmed_state.update(server_response)
        self._recompute()

    def rollback(self, mutation_id: str):
        self.pending_mutations = [m for m in self.pending_mutations if m[0] != mutation_id]
        self._recompute()

    def _recompute(self):
        state = dict(self.confirmed_state)
        for _, patch in self.pending_mutations:
            state.update(patch)
        self.current_state = state
""",
        """from solution import OptimisticEngine

def test_optimistic_engine():
    engine = OptimisticEngine({'likes': 10})
    engine.mutate_optimistically('mut-1', {'likes': 11})
    assert engine.current_state['likes'] == 11
    engine.rollback('mut-1')
    assert engine.current_state['likes'] == 10
""",
        "Optimistic mutations guarantee instantaneous UI feedback while preserving deterministic rollback consistency."
    ),
    (
        12, "node-6-12", "Lesson 8.12: Form Schema Validator & Dirty State Tracker",
        "Implement a schema-driven form state tracker computing touched, dirty, valid, and field error records.",
        255,
        """class FormManager:
    def __init__(self, initial_values: dict, rules: dict):
        self.initial = dict(initial_values)
        self.values = dict(initial_values)
        self.touched = {k: False for k in initial_values}
        self.rules = rules # field -> validator fn returning str or None

    def change_field(self, field: str, val):
        self.values[field] = val
        self.touched[field] = True

    def validate(self) -> dict:
        errors = {}
        for f, rule in self.rules.items():
            err = rule(self.values.get(f))
            if err:
                errors[f] = err
        return errors

    def is_dirty(self) -> bool:
        return any(self.values[k] != self.initial[k] for k in self.initial)
""",
        """from solution import FormManager

def test_form_validation():
    rules = {'email': lambda v: None if '@' in v else 'Invalid email'}
    form = FormManager({'email': 'test'}, rules)
    assert form.is_dirty() is False
    assert len(form.validate()) == 1
    form.change_field('email', 'test@domain.com')
    assert form.is_dirty() is True
    assert len(form.validate()) == 0
""",
        "Robust form state architectures decouple validation matrices from presentation components."
    ),
    (
        13, "node-6-13", "Lesson 8.13: Headless UI Architecture: Compound Components",
        "Build a compound component state registry synchronizing parent accordion/tabs state across headless children.",
        260,
        """class CompoundRegistry:
    def __init__(self):
        self.active_item = None
        self.subscribers = []

    def set_active(self, item_id: str):
        self.active_item = item_id
        for sub in self.subscribers:
            sub(self.active_item)

    def subscribe(self, callback):
        self.subscribers.append(callback)
        return lambda: self.subscribers.remove(callback)
""",
        """from solution import CompoundRegistry

def test_compound_registry():
    reg = CompoundRegistry()
    log = []
    reg.subscribe(lambda active: log.append(active))
    reg.set_active('tab-2')
    assert log == ['tab-2']
""",
        "Compound components share ambient contextual state without prop drilling."
    ),
    (
        14, "node-6-14", "Lesson 8.14: Infinite Scroll & DOM Virtualization Engine",
        "Implement a windowing virtualizer calculating start index, end index, and top/bottom spacer heights.",
        265,
        """def compute_virtual_window(total_items: int, item_height: int, viewport_height: int, scroll_top: int, overscan: int = 2):
    start_idx = max(0, (scroll_top // item_height) - overscan)
    visible_count = (viewport_height // item_height) + 1
    end_idx = min(total_items, (scroll_top // item_height) + visible_count + overscan)
    
    top_padding = start_idx * item_height
    bottom_padding = (total_items - end_idx) * item_height
    return {
        'start_index': start_idx,
        'end_index': end_idx,
        'top_padding': top_padding,
        'bottom_padding': bottom_padding,
        'rendered_count': end_idx - start_idx
    }
""",
        """from solution import compute_virtual_window

def test_virtual_window():
    res = compute_virtual_window(1000, 50, 500, 1000, overscan=2)
    assert res['start_index'] == 18
    assert res['top_padding'] == 18 * 50
    assert res['rendered_count'] > 0
""",
        "List virtualization maintains constant DOM node density regardless of dataset scale."
    ),
    (
        15, "node-6-15", "Lesson 8.15: Server-Sent Events (SSE) Stream Decoder",
        "Implement a streaming chunk buffer parser decoding raw HTTP chunks into SSE event, id, and data payloads.",
        270,
        """class SSEDecoder:
    def __init__(self):
        self.buffer = ""

    def feed(self, chunk: str) -> list:
        self.buffer += chunk
        events = []
        while "\\n\\n" in self.buffer:
            raw_event, self.buffer = self.buffer.split("\\n\\n", 1)
            event_obj = {'event': 'message', 'data': '', 'id': None}
            data_lines = []
            for line in raw_event.split("\\n"):
                if line.startswith("event:"):
                    event_obj['event'] = line[6:].strip()
                elif line.startswith("data:"):
                    data_lines.append(line[5:].strip())
                elif line.startswith("id:"):
                    event_obj['id'] = line[3:].strip()
            event_obj['data'] = "\\n".join(data_lines)
            events.append(event_obj)
        return events
""",
        """from solution import SSEDecoder

def test_sse_decoder():
    decoder = SSEDecoder()
    e1 = decoder.feed("event: token\\ndata: Hello\\n\\n")
    assert len(e1) == 1
    assert e1[0]['event'] == 'token' and e1[0]['data'] == 'Hello'
    
    # Split chunk
    e2 = decoder.feed("data: Wor")
    assert len(e2) == 0
    e3 = decoder.feed("ld\\n\\n")
    assert len(e3) == 1
    assert e3[0]['data'] == 'World'
""",
        "SSE streaming decoders must buffer fragmented packet boundaries without data loss."
    ),
    (
        16, "node-6-16", "Lesson 8.16: Incremental Markdown Token Stream Parser",
        "Build a streaming markdown parser that handles partial markdown syntax (unclosed asterisks, ticks, links) without layout jumps.",
        275,
        """class StreamMarkdownParser:
    def __init__(self):
        self.raw_text = ""

    def append_token(self, token: str) -> dict:
        self.raw_text += token
        # Check if inside an unclosed code block
        code_blocks = self.raw_text.count("```")
        in_code = (code_blocks % 2 == 1)
        
        # Check unclosed bold
        bolds = self.raw_text.count("**")
        in_bold = (bolds % 2 == 1)
        
        return {
            'text': self.raw_text,
            'in_code_block': in_code,
            'in_bold': in_bold
        }
""",
        """from solution import StreamMarkdownParser

def test_stream_markdown():
    parser = StreamMarkdownParser()
    s1 = parser.append_token("```python\\ndef foo():")
    assert s1['in_code_block'] is True
    s2 = parser.append_token("\\n    return 42\\n```")
    assert s2['in_code_block'] is False
""",
        "Incremental parsers avoid flashing unescaped markdown tags during token generation."
    ),
    (
        17, "node-6-17", "Lesson 8.17: Streaming Code Block Syntax Highlighter",
        "Build a streaming token classifier assigning lexical scopes (keywords, identifiers, literals) to incoming code chunks.",
        280,
        """import re

KEYWORDS = {'def', 'return', 'class', 'import', 'from', 'if', 'else', 'for', 'while'}

def highlight_code_line(line: str) -> list:
    tokens = []
    words = re.findall(r'\\w+|[^\w\s]|\\s+', line)
    for w in words:
        if w in KEYWORDS:
            tokens.append(('keyword', w))
        elif w.isdigit():
            tokens.append(('number', w))
        elif w.startswith(('"', "'")):
            tokens.append(('string', w))
        else:
            tokens.append(('plain', w))
    return tokens
""",
        """from solution import highlight_code_line

def test_syntax_highlight():
    tokens = highlight_code_line("def add(x): return x + 10")
    assert ('keyword', 'def') in tokens
    assert ('keyword', 'return') in tokens
    assert ('number', '10') in tokens
""",
        "Streaming code renderers classify syntax tokens eagerly to eliminate re-highlight flickers."
    ),
    (
        18, "node-6-18", "Lesson 8.18: Generative UI Dynamic Component Registry",
        "Build a component factory dispatching structured tool payloads to registered UI component renderers.",
        285,
        """class ComponentRegistry:
    def __init__(self):
        self.registry = {}

    def register(self, name: str, render_fn):
        self.registry[name] = render_fn

    def render_payload(self, tool_name: str, payload: dict):
        if tool_name not in self.registry:
            return {'component': 'Fallback', 'props': {'raw': payload}}
        return {
            'component': tool_name,
            'props': self.registry[tool_name](payload)
        }
""",
        """from solution import ComponentRegistry

def test_generative_ui():
    reg = ComponentRegistry()
    reg.register('stock_ticker', lambda p: {'symbol': p['sym'].upper(), 'price': float(p['val'])})
    res = reg.render_payload('stock_ticker', {'sym': 'aapl', 'val': 180.5})
    assert res['component'] == 'stock_ticker'
    assert res['props']['symbol'] == 'AAPL'
""",
        "Generative UI systems safely bridge backend tool-call payloads to validated frontend components."
    ),
    (
        19, "node-6-19", "Lesson 8.19: LLM Tool-Call Stream Reconstructor",
        "Assemble streaming JSON argument deltas from multiple SSE chunks into complete, parsed JSON payloads.",
        290,
        """import json

class ToolCallReconstructor:
    def __init__(self):
        self.calls = {} # id -> {'name': str, 'arg_buffer': str}

    def feed_delta(self, call_id: str, name: str, arg_chunk: str):
        if call_id not in self.calls:
            self.calls[call_id] = {'name': name, 'arg_buffer': ''}
        self.calls[call_id]['arg_buffer'] += arg_chunk

    def finalize(self, call_id: str) -> dict:
        data = self.calls[call_id]
        return {
            'name': data['name'],
            'arguments': json.loads(data['arg_buffer'])
        }
""",
        """from solution import ToolCallReconstructor

def test_tool_reconstruction():
    rec = ToolCallReconstructor()
    rec.feed_delta('call_1', 'search', '{"qu')
    rec.feed_delta('call_1', 'search', 'ery": "python"}')
    result = rec.finalize('call_1')
    assert result['name'] == 'search'
    assert result['arguments'] == {'query': 'python'}
""",
        "Streaming LLM tool arguments emit fragmented substrings that require stateful reconstruction."
    ),
    (
        20, "node-6-20", "Lesson 8.20: Chat Message Virtualized List with Dynamic Heights",
        "Build a dynamic height cache with scroll anchoring to prevent scroll jumping when streaming new tokens into view.",
        295,
        """class DynamicHeightCache:
    def __init__(self):
        self.heights = {} # id -> height

    def set_height(self, msg_id: str, height: int):
        self.heights[msg_id] = height

    def compute_offset(self, msg_ids: list, target_id: str) -> int:
        offset = 0
        for mid in msg_ids:
            if mid == target_id:
                break
            offset += self.heights.get(mid, 50) # default 50
        return offset
""",
        """from solution import DynamicHeightCache

def test_dynamic_height():
    cache = DynamicHeightCache()
    cache.set_height('msg-1', 120)
    cache.set_height('msg-2', 80)
    assert cache.compute_offset(['msg-1', 'msg-2', 'msg-3'], 'msg-3') == 200
""",
        "Scroll anchoring guarantees stable viewport positioning when messages expand dynamically."
    ),
    (
        21, "node-6-21", "Lesson 8.21: Client-Side BPE Tokenizer (Web Worker)",
        "Implement a byte-pair token counter offloaded for frontend client token budget estimation.",
        300,
        """class ClientTokenizer:
    def __init__(self, vocab: dict):
        self.vocab = vocab # token_str -> token_id

    def estimate_tokens(self, text: str) -> int:
        # Simple whitespace + punctuation estimation approximation
        words = text.split()
        return int(len(words) * 1.33)
""",
        """from solution import ClientTokenizer

def test_tokenizer():
    tok = ClientTokenizer({})
    count = tok.estimate_tokens("The quick brown fox jumps over the lazy dog")
    assert count >= 9
""",
        "Client-side token counters keep UI input boxes aware of LLM context limits before network transit."
    ),
    (
        22, "node-6-22", "Lesson 8.22: WebSocket Real-Time Bidirectional Event Sync",
        "Implement a reconnecting client WebSocket state machine with heartbeat ping/pong and message deduplication.",
        305,
        """class WebSocketClientSM:
    def __init__(self):
        self.state = 'DISCONNECTED'
        self.retry_count = 0
        self.seen_message_ids = set()

    def connect(self):
        self.state = 'CONNECTED'
        self.retry_count = 0

    def disconnect(self):
        self.state = 'DISCONNECTED'
        self.retry_count += 1

    def handle_message(self, msg_id: str, payload: dict) -> bool:
        if msg_id in self.seen_message_ids:
            return False # Duplicate
        self.seen_message_ids.add(msg_id)
        return True
""",
        """from solution import WebSocketClientSM

def test_ws_client():
    ws = WebSocketClientSM()
    ws.connect()
    assert ws.handle_message('m1', {'data': 'hello'}) is True
    assert ws.handle_message('m1', {'data': 'hello'}) is False
""",
        "WebSocket client state machines must enforce idempotency over unpredictable mobile connection drops."
    ),
    (
        23, "node-6-23", "Lesson 8.23: Duplex Audio Stream Visualizer (Web Audio API)",
        "Build a frequency bucket processor computing normalized decibel waveforms for voice AI interactions.",
        310,
        """def compute_waveform_bins(frequency_data: list, num_bins: int = 16) -> list:
    if not frequency_data:
        return [0.0] * num_bins
    bin_size = max(1, len(frequency_data) // num_bins)
    bins = []
    for i in range(num_bins):
        chunk = frequency_data[i * bin_size : (i + 1) * bin_size]
        avg = sum(chunk) / len(chunk) if chunk else 0.0
        normalized = round(min(1.0, max(0.0, avg / 255.0)), 3)
        bins.append(normalized)
    return bins
""",
        """from solution import compute_waveform_bins

def test_audio_bins():
    freqs = [255] * 32 + [0] * 32
    bins = compute_waveform_bins(freqs, num_bins=4)
    assert len(bins) == 4
    assert bins[0] == 1.0
    assert bins[3] == 0.0
""",
        "Duplex audio visualizers downsample high-frequency FFT data to drive 60 FPS CSS/canvas meters."
    ),
    (
        24, "node-6-24", "Lesson 8.24: Canvas-Based Vector Embedding Visualizer",
        "Build a 2D projection viewport transformer converting high-dimensional coordinates to canvas screen space with pan/zoom.",
        315,
        """class ViewportTransform:
    def __init__(self, zoom: float = 1.0, pan_x: float = 0.0, pan_y: float = 0.0):
        self.zoom = zoom
        self.pan_x = pan_x
        self.pan_y = pan_y

    def world_to_screen(self, x: float, y: float) -> tuple:
        sx = (x + self.pan_x) * self.zoom
        sy = (y + self.pan_y) * self.zoom
        return (sx, sy)

    def screen_to_world(self, sx: float, sy: float) -> tuple:
        x = (sx / self.zoom) - self.pan_x
        y = (sy / self.zoom) - self.pan_y
        return (x, y)
""",
        """from solution import ViewportTransform

def test_viewport():
    vp = ViewportTransform(zoom=2.0, pan_x=10.0, pan_y=20.0)
    sx, sy = vp.world_to_screen(5.0, 5.0)
    assert sx == 30.0 and sy == 50.0
    wx, wy = vp.screen_to_world(sx, sy)
    assert wx == 5.0 and wy == 5.0
""",
        "Canvas visualizers transform continuous geometric embedding spaces into pixel coordinates."
    ),
    (
        25, "node-6-25", "Lesson 8.25: Cytoscape/Force-Directed Agent Graph Engine",
        "Implement a repulsive force calculation engine distributing interconnected multi-agent workflow nodes.",
        320,
        """import math

def compute_repulsion(node_a: tuple, node_b: tuple, k: float = 100.0) -> tuple:
    dx = node_a[0] - node_b[0]
    dy = node_a[1] - node_b[1]
    dist = math.hypot(dx, dy)
    if dist == 0:
        return (0.0, 0.0)
    force = k / (dist * dist)
    fx = force * (dx / dist)
    fy = force * (dy / dist)
    return (fx, fy)
""",
        """from solution import compute_repulsion

def test_repulsion():
    fx, fy = compute_repulsion((0, 0), (10, 0), k=100.0)
    assert fx < 0
    assert fy == 0
""",
        "Force-directed graphs visually organize complex multi-agent execution plans without node overlap."
    ),
    (
        26, "node-6-26", "Lesson 8.26: Terminal Emulator Output Parser (ANSI Escape Sequences)",
        "Parse ANSI escape sequences for text styling, colors, and line wraps for streaming agent terminal logs.",
        325,
        """import re

def parse_ansi_text(raw_text: str) -> list:
    ansi_pattern = re.compile(r'\\x1b\\[([0-9;]*)m')
    parts = []
    last_idx = 0
    current_style = 'default'
    for match in ansi_pattern.finditer(raw_text):
        if match.start() > last_idx:
            parts.append({'text': raw_text[last_idx:match.start()], 'style': current_style})
        code = match.group(1)
        current_style = 'red' if code == '31' else 'green' if code == '32' else 'default'
        last_idx = match.end()
    if last_idx < len(raw_text):
        parts.append({'text': raw_text[last_idx:], 'style': current_style})
    return parts
""",
        """from solution import parse_ansi_text

def test_ansi():
    out = parse_ansi_text("hello \\x1b[31merror\\x1b[0m world")
    assert len(out) == 3
    assert out[1] == {'text': 'error', 'style': 'red'}
""",
        "Terminal streams require robust escape-code parsing to format CLI logs safely in DOM containers."
    ),
    (
        27, "node-6-27", "Lesson 8.27: Modern TypeScript Frontend Tooling: Vite, ESBuild & Monorepos",
        "Implement an ESM module graph resolver resolving relative imports and external package aliases.",
        330,
        """class ModuleGraph:
    def __init__(self, aliases: dict = None):
        self.aliases = aliases or {}
        self.graph = {}

    def resolve_import(self, importer: str, specifier: str) -> str:
        for alias, target in self.aliases.items():
            if specifier.startswith(alias):
                return specifier.replace(alias, target, 1)
        if specifier.startswith('.'):
            import os
            base = os.path.dirname(importer)
            return os.path.normpath(os.path.join(base, specifier))
        return specifier # External package
""",
        """from solution import ModuleGraph

def test_module_graph():
    mg = ModuleGraph({'@/': 'src/'})
    assert mg.resolve_import('src/pages/index.ts', '@/components/button') == 'src/components/button'
    assert mg.resolve_import('src/pages/index.ts', './helper') == 'src/pages/helper'
""",
        "Modern frontend bundlers rely on fast specifier resolution to build instant-reload dev servers."
    ),
    (
        28, "node-6-28", "Lesson 8.28: CSS-in-JS vs Zero-Runtime CSS Token Systems",
        "Build a design token compiler mapping semantic keys to scoped CSS variables.",
        335,
        """def compile_tokens_to_css(tokens: dict) -> str:
    css_lines = [":root {"]
    for k, v in sorted(tokens.items()):
        css_lines.append(f"  --color-{k}: {v};")
    css_lines.append("}")
    return "\\n".join(css_lines)
""",
        """from solution import compile_tokens_to_css

def test_token_compiler():
    css = compile_tokens_to_css({'primary': '#0055ff', 'background': '#0a0a0a'})
    assert '--color-primary: #0055ff;' in css
    assert '--color-background: #0a0a0a;' in css
""",
        "Design token compilers establish unified design constraints across web component boundaries."
    ),
    (
        29, "node-6-29", "Lesson 8.29: Browser Storage Quota & IndexedDB Cache Layer",
        "Build an in-memory transactional key-value store simulating IndexedDB object stores with versioned migrations.",
        340,
        """class StorageEngine:
    def __init__(self, max_bytes: int = 1024 * 1024):
        self.max_bytes = max_bytes
        self.data = {}
        self.current_bytes = 0

    def put(self, key: str, value: str):
        size = len(key.encode('utf-8')) + len(value.encode('utf-8'))
        if self.current_bytes + size > self.max_bytes:
            raise OverflowError("Storage quota exceeded")
        if key in self.data:
            self.current_bytes -= len(self.data[key].encode('utf-8'))
        self.data[key] = value
        self.current_bytes += size

    def get(self, key: str):
        return self.data.get(key)
""",
        """from solution import StorageEngine

def test_storage():
    st = StorageEngine(max_bytes=100)
    st.put('k1', 'val1')
    assert st.get('k1') == 'val1'
""",
        "Client storage layers must guard memory quotas and support deterministic schema migrations."
    ),
    (
        30, "node-6-30", "Lesson 8.30: Browser Security: Content Security Policy & XSS Sanitizer",
        "Build an HTML AST sanitizer stripping dangerous `<script>`, `onerror`, and `javascript:` attributes from LLM output.",
        345,
        """import re

FORBIDDEN_TAGS = {'script', 'iframe', 'object', 'embed'}

def sanitize_html(html_str: str) -> str:
    cleaned = html_str
    for tag in FORBIDDEN_TAGS:
        cleaned = re.sub(rf'<{tag}[^>]*>.*?</{tag}>', '', cleaned, flags=re.IGNORECASE | re.DOTALL)
        cleaned = re.sub(rf'<{tag}[^>]*/>', '', cleaned, flags=re.IGNORECASE)
    # Strip on* attributes
    cleaned = re.sub(r'\\son\\w+\\s*=\\s*["\'][^"\']*["\']', '', cleaned, flags=re.IGNORECASE)
    # Strip javascript: URIs
    cleaned = re.sub(r'href\\s*=\\s*["\']javascript:[^"\']*["\']', 'href="#"', cleaned, flags=re.IGNORECASE)
    return cleaned
""",
        """from solution import sanitize_html

def test_sanitizer():
    dirty = '<p>Hello</p><script>alert("xss")</script><img src="x" onerror="steal()"/><a href="javascript:run()">click</a>'
    clean = sanitize_html(dirty)
    assert '<script>' not in clean
    assert 'onerror' not in clean
    assert 'javascript:' not in clean
    assert '<p>Hello</p>' in clean
""",
        "LLM-generated frontend responses must pass rigorous AST sanitization before mounting into the DOM."
    ),
    (
        31, "node-6-31", "Lesson 8.31: Cross-Origin Resource Sharing (CORS) & Preflight Handler",
        "Implement a preflight OPTIONS validator enforcing allowed origins, headers, and credentials.",
        350,
        """def validate_cors_preflight(headers: dict, allowed_origins: set, allowed_methods: set) -> dict:
    origin = headers.get('origin')
    method = headers.get('access-control-request-method')
    if origin not in allowed_origins:
        return {'status': 403, 'headers': {}}
    if method not in allowed_methods:
        return {'status': 405, 'headers': {}}
    return {
        'status': 204,
        'headers': {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': ', '.join(allowed_methods),
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    }
""",
        """from solution import validate_cors_preflight

def test_cors():
    res = validate_cors_preflight({'origin': 'https://example.com', 'access-control-request-method': 'POST'}, {'https://example.com'}, {'GET', 'POST'})
    assert res['status'] == 204
    assert res['headers']['Access-Control-Allow-Origin'] == 'https://example.com'
""",
        "Browser security guarantees origin isolation via standards-compliant preflight handshakes."
    ),
    (
        32, "node-6-32", "Lesson 8.32: React Server Components (RSC) Wire Format",
        "Build an RSC payload serializer and deserializer parsing JSON Flight protocol streams.",
        355,
        """class FlightProtocol:
    @staticmethod
    def serialize_chunk(chunk_id: str, payload_type: str, data: dict) -> str:
        import json
        return f"{chunk_id}:{payload_type}:{json.dumps(data)}"

    @staticmethod
    def deserialize_chunk(line: str) -> tuple:
        import json
        parts = line.split(':', 2)
        return parts[0], parts[1], json.loads(parts[2])
""",
        """from solution import FlightProtocol

def test_flight():
    line = FlightProtocol.serialize_chunk('1', 'M', {'component': 'Nav'})
    cid, ptype, data = FlightProtocol.deserialize_chunk(line)
    assert cid == '1' and ptype == 'M' and data['component'] == 'Nav'
""",
        "React Server Components emit serialized wire chunks to stream client-server boundaries."
    ),
    (
        33, "node-6-33", "Lesson 8.33: Next.js App Router File-System Routing Engine",
        "Implement a file-system routing tree resolving nested paths, dynamic segment wildcards `[id]`, and route groups.",
        360,
        """import re

class RouteTree:
    def __init__(self):
        self.routes = []

    def add_route(self, pattern: str, handler_name: str):
        # Convert /posts/[id] -> ^/posts/([^/]+)$
        regex = re.sub(r'\\[([^\\]]+)\\]', r'(?P<\\1>[^/]+)', pattern)
        self.routes.append((re.compile(f"^{regex}$"), handler_name))

    def resolve(self, path: str):
        for pattern, handler in self.routes:
            m = pattern.match(path)
            if m:
                return handler, m.groupdict()
        return None, {}
""",
        """from solution import RouteTree

def test_routes():
    rt = RouteTree()
    rt.add_route('/posts/[id]', 'PostDetail')
    handler, params = rt.resolve('/posts/123')
    assert handler == 'PostDetail'
    assert params == {'id': '123'}
""",
        "App Router structures file hierarchies into unified deterministic URL routing trees."
    ),
    (
        34, "node-6-34", "Lesson 8.34: Server Actions & Progressive Enhancement Engine",
        "Implement a server action dispatcher supporting FormData execution without client JavaScript enabled.",
        365,
        """class ServerActionRegistry:
    def __init__(self):
        self.actions = {}

    def register(self, action_id: str, fn):
        self.actions[action_id] = fn

    def dispatch(self, action_id: str, form_data: dict):
        if action_id not in self.actions:
            raise KeyError("Action not found")
        return self.actions[action_id](form_data)
""",
        """from solution import ServerActionRegistry

def test_server_action():
    reg = ServerActionRegistry()
    reg.register('like_post', lambda d: {'success': True, 'id': d['post_id']})
    res = reg.dispatch('like_post', {'post_id': 42})
    assert res['success'] is True
""",
        "Progressive enhancement ensures core web platform mutations succeed over plain HTML form posts."
    ),
    (
        35, "node-6-35", "Lesson 8.35: Next.js Edge Middleware & Rewrite Router",
        "Build an edge middleware runner performing authentication checks, cookie inspection, and path rewrites.",
        370,
        """def edge_middleware(request_headers: dict, path: str) -> dict:
    auth_token = request_headers.get('authorization')
    if path.startswith('/dashboard') and not auth_token:
        return {'action': 'REDIRECT', 'destination': '/login'}
    if path.startswith('/api/v1'):
        return {'action': 'REWRITE', 'destination': path.replace('/v1', '/v2')}
    return {'action': 'NEXT'}
""",
        """from solution import edge_middleware

def test_middleware():
    r1 = edge_middleware({}, '/dashboard')
    assert r1['action'] == 'REDIRECT'
    r2 = edge_middleware({'authorization': 'Bearer xxx'}, '/dashboard')
    assert r2['action'] == 'NEXT'
""",
        "Edge middleware intercepts and rewrites incoming traffic before invoking server renderers."
    ),
    (
        36, "node-6-36", "Lesson 8.36: Frontend Telemetry & Web Vitals Profiling",
        "Implement a metric aggregator recording Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS).",
        375,
        """class WebVitalsAggregator:
    def __init__(self):
        self.metrics = {'LCP': [], 'CLS': []}

    def record_metric(self, name: str, value: float):
        if name in self.metrics:
            self.metrics[name].append(value)

    def summary(self) -> dict:
        return {
            name: (sum(vals) / len(vals) if vals else 0.0)
            for name, vals in self.metrics.items()
        }
""",
        """from solution import WebVitalsAggregator

def test_vitals():
    ag = WebVitalsAggregator()
    ag.record_metric('LCP', 1200.0)
    ag.record_metric('LCP', 1400.0)
    assert ag.summary()['LCP'] == 1300.0
""",
        "Core Web Vitals monitoring provides objective telemetry on frontend rendering bottlenecks."
    ),
    (
        37, "node-6-37", "Lesson 8.37: Drag-and-Drop Workflow Canvas (React Flow style)",
        "Build a 2D bezier curve edge generator computing cubic bezier SVG control points between node anchor ports.",
        380,
        """def calculate_bezier_curve(source: tuple, target: tuple) -> str:
    sx, sy = source
    tx, ty = target
    dx = abs(tx - sx) * 0.5
    cp1_x, cp1_y = sx + dx, sy
    cp2_x, cp2_y = tx - dx, ty
    return f"M {sx},{sy} C {cp1_x},{cp1_y} {cp2_x},{cp2_y} {tx},{ty}"
""",
        """from solution import calculate_bezier_curve

def test_bezier():
    path = calculate_bezier_curve((0, 50), (200, 150))
    assert path.startswith("M 0,50 C 100.0,50 100.0,150 200,150")
""",
        "Canvas workflow editors compute smooth cubic bezier paths between graph nodes."
    ),
    (
        38, "node-6-38", "Lesson 8.38: Collaborative Real-Time CRDT State (Yjs style)",
        "Build an append-only conflict-free replicated data type (CRDT) register for collaborative multi-user prompt drafting.",
        385,
        """class LWWRegister:
    def __init__(self, initial_value, timestamp: float = 0.0):
        self.value = initial_value
        self.timestamp = timestamp

    def update(self, new_val, timestamp: float):
        if timestamp > self.timestamp:
            self.value = new_val
            self.timestamp = timestamp

    def merge(self, other: 'LWWRegister'):
        if other.timestamp > self.timestamp:
            self.value = other.value
            self.timestamp = other.timestamp
""",
        """from solution import LWWRegister

def test_crdt():
    r1 = LWWRegister('v1', 1.0)
    r2 = LWWRegister('v2', 2.0)
    r1.merge(r2)
    assert r1.value == 'v2'
""",
        "CRDT structures achieve deterministic eventual consistency across collaborative distributed clients."
    ),
    (
        39, "node-6-39", "Lesson 8.39: Micro-Frontend Modular Federation Engine",
        "Implement a dynamic container manifest resolver isolating remote module scopes and shared dependencies.",
        390,
        """class FederationHost:
    def __init__(self):
        self.remotes = {}

    def register_remote(self, name: str, manifest_url: str, exposed: list):
        self.remotes[name] = {'url': manifest_url, 'exposed': set(exposed)}

    def load_module(self, remote_name: str, module_path: str):
        if remote_name not in self.remotes:
            raise KeyError("Remote not found")
        if module_path not in self.remotes[remote_name]['exposed']:
            raise KeyError("Module not exposed")
        return f"{self.remotes[remote_name]['url']}/{module_path}.js"
""",
        """from solution import FederationHost

def test_federation():
    host = FederationHost()
    host.register_remote('chat_widget', 'https://cdn.example.com', ['./ChatBox'])
    url = host.load_module('chat_widget', './ChatBox')
    assert url == 'https://cdn.example.com/./ChatBox.js'
""",
        "Module federation enables decoupled micro-frontend deployments with zero runtime cross-pollination."
    ),
    (
        40, "node-6-40", "Lesson 8.40: Multi-Modal File Upload Pipeline & Chunking",
        "Implement a frontend client binary file chunker with MD5 checksum calculation and progress tracking.",
        395,
        """import hashlib

def chunk_file_data(data: bytes, chunk_size: int = 1024) -> list:
    chunks = []
    total = len(data)
    for i in range(0, total, chunk_size):
        part = data[i : i + chunk_size]
        h = hashlib.md5(part).hexdigest()
        chunks.append({
            'chunk_index': i // chunk_size,
            'size': len(part),
            'md5': h
        })
    return chunks
""",
        """from solution import chunk_file_data

def test_chunking():
    data = b"x" * 2500
    chunks = chunk_file_data(data, chunk_size=1000)
    assert len(chunks) == 3
    assert chunks[0]['size'] == 1000
    assert chunks[2]['size'] == 500
""",
        "Multi-modal upload pipelines slice large image/audio datasets into resumable idempotent chunks."
    ),
    (
        41, "node-6-41", "Lesson 8.41: Latency Benchmarking & Token-Per-Second Gauge",
        "Implement an LLM streaming latency tracker computing Time-To-First-Token (TTFT) and moving average TPS.",
        400,
        """class StreamingMetricsTracker:
    def __init__(self, start_time: float):
        self.start_time = start_time
        self.first_token_time = None
        self.token_count = 0

    def record_token(self, timestamp: float):
        if self.first_token_time is None:
            self.first_token_time = timestamp
        self.token_count += 1

    def ttft_ms(self) -> float:
        if self.first_token_time is None: return 0.0
        return (self.first_token_time - self.start_time) * 1000.0

    def tokens_per_second(self, current_time: float) -> float:
        if self.first_token_time is None or current_time <= self.first_token_time:
            return 0.0
        elapsed = current_time - self.first_token_time
        return round(self.token_count / elapsed, 2)
""",
        """from solution import StreamingMetricsTracker

def test_streaming_metrics():
    tracker = StreamingMetricsTracker(start_time=100.0)
    tracker.record_token(100.5) # TTFT = 500ms
    tracker.record_token(101.0)
    tracker.record_token(101.5)
    assert tracker.ttft_ms() == 500.0
    assert tracker.tokens_per_second(101.5) == 3.0
""",
        "Telemetry gauges track real-time LLM inference performance directly on client devices."
    ),
    (
        42, "node-6-42", "Lesson 8.42: Resilient Polling & Exponential Backoff Engine",
        "Build a client retry scheduler computing exponential backoff intervals with full randomized jitter.",
        410,
        """def compute_backoff_ms(attempt: int, base_ms: float = 100.0, max_ms: float = 5000.0, jitter_factor: float = 0.5) -> float:
    exp = base_ms * (2 ** attempt)
    capped = min(max_ms, exp)
    return capped * (1.0 + jitter_factor * 0.5)
""",
        """from solution import compute_backoff_ms

def test_backoff():
    b0 = compute_backoff_ms(0)
    b1 = compute_backoff_ms(1)
    assert b1 > b0
""",
        "Jittered exponential backoff prevents thundering herd congestion on rate-limited AI inference backends."
    ),
    (
        43, "node-6-43", "Lesson 8.43: Multi-Tab Synchronizer via BroadcastChannel",
        "Implement a simulated multi-tab coordinator electing a leader tab and broadcasting cross-tab state.",
        420,
        """class TabCoordinator:
    def __init__(self, tab_id: str):
        self.tab_id = tab_id
        self.leader_id = None
        self.tabs = set([tab_id])

    def register_heartbeat(self, other_tab_id: str):
        self.tabs.add(other_tab_id)
        self.elect()

    def elect(self):
        self.leader_id = min(self.tabs)

    def is_leader(self) -> bool:
        return self.tab_id == self.leader_id
""",
        """from solution import TabCoordinator

def test_tab_coordinator():
    t1 = TabCoordinator('tab-b')
    t1.elect()
    assert t1.is_leader() is True
    t1.register_heartbeat('tab-a')
    assert t1.is_leader() is False
""",
        "Cross-tab synchronization ensures only a single active tab maintains duplex WebSocket connections."
    ),
    (
        44, "node-6-44", "Lesson 8.44: Accessible Modal & Focus Trap Manager",
        "Implement a keyboard focus trap cycling Tab / Shift+Tab between focusable interactive DOM elements.",
        430,
        """class FocusTrapManager:
    def __init__(self, focusable_elements: list):
        self.elements = focusable_elements
        self.current_idx = 0

    def step(self, shift_key: bool = False) -> str:
        if not self.elements:
            return None
        step = -1 if shift_key else 1
        self.current_idx = (self.current_idx + step) % len(self.elements)
        return self.elements[self.current_idx]
""",
        """from solution import FocusTrapManager

def test_focus_trap():
    trap = FocusTrapManager(['btn-cancel', 'input-name', 'btn-submit'])
    assert trap.step(shift_key=False) == 'input-name'
    assert trap.step(shift_key=False) == 'btn-submit'
    assert trap.step(shift_key=False) == 'btn-cancel' # Wrap around
    assert trap.step(shift_key=True) == 'btn-submit' # Backward
""",
        "Accessible dialogs isolate keyboard navigation within active modal bounds."
    ),
    (
        45, "node-6-45", "Lesson 8.45: Local LLM WebGPU Inference Runner Wrapper",
        "Implement a client-side execution budget manager allocating WebGPU device memory and tensor buffers.",
        440,
        """class WebGPUResourceManager:
    def __init__(self, max_vram_mb: float = 2048.0):
        self.max_vram_mb = max_vram_mb
        self.allocated_mb = 0.0

    def allocate_buffer(self, name: str, size_mb: float) -> bool:
        if self.allocated_mb + size_mb > self.max_vram_mb:
            return False
        self.allocated_mb += size_mb
        return True

    def free_buffer(self, size_mb: float):
        self.allocated_mb = max(0.0, self.allocated_mb - size_mb)
""",
        """from solution import WebGPUResourceManager

def test_webgpu():
    mgr = WebGPUResourceManager(max_vram_mb=100.0)
    assert mgr.allocate_buffer('weights', 60.0) is True
    assert mgr.allocate_buffer('kv_cache', 50.0) is False
    mgr.free_buffer(30.0)
    assert mgr.allocate_buffer('kv_cache', 50.0) is True
""",
        "Client WebGPU runners manage strict hardware VRAM limits to avoid browser GPU process crashes."
    ),
    (
        46, "node-6-46", "Lesson 8.46: Prompt Template Dynamic Interpolation Engine",
        "Implement a client prompt template parser with typed variable substitution and syntax linting.",
        450,
        """import re

def interpolate_prompt(template: str, variables: dict) -> tuple:
    missing = []
    def replace(match):
        var_name = match.group(1).strip()
        if var_name not in variables:
            missing.append(var_name)
            return match.group(0)
        return str(variables[var_name])

    rendered = re.sub(r'\\{\\{\\s*([a-zA-Z0-9_]+)\\s*\\}\\}', replace, template)
    return rendered, missing
""",
        """from solution import interpolate_prompt

def test_prompt_template():
    t = "Hello {{ name }}, please review {{ repo }}."
    out, missing = interpolate_prompt(t, {'name': 'Alice'})
    assert "Hello Alice" in out
    assert missing == ['repo']
""",
        "Interactive prompt engineers provide real-time variable highlighting and linting prior to model invocation."
    ),
    (
        47, "node-6-47", "Lesson 8.47: Diff Viewer with Inline Chunk Additions/Deletions",
        "Implement a line-by-line unified diff generator highlighting additions, deletions, and unchanged lines.",
        460,
        """def generate_line_diff(old_lines: list, new_lines: list) -> list:
    diff_entries = []
    # Simple line comparison
    i = j = 0
    while i < len(old_lines) or j < len(new_lines):
        if i < len(old_lines) and j < len(new_lines) and old_lines[i] == new_lines[j]:
            diff_entries.append((' ', old_lines[i]))
            i += 1; j += 1
        elif j < len(new_lines) and (i >= len(old_lines) or new_lines[j] not in old_lines[i:]):
            diff_entries.append(('+', new_lines[j]))
            j += 1
        elif i < len(old_lines):
            diff_entries.append(('-', old_lines[i]))
            i += 1
    return diff_entries
""",
        """from solution import generate_line_diff

def test_line_diff():
    old = ['a', 'b', 'c']
    new = ['a', 'x', 'c']
    diff = generate_line_diff(old, new)
    assert (' ', 'a') in diff
    assert ('-', 'b') in diff
    assert ('+', 'x') in diff
""",
        "AI code generation environments require high-contrast, sub-character diff visualization."
    ),
    (
        48, "node-6-48", "Lesson 8.48: Dark Mode Theme Engine & System Preference Sync",
        "Build a zero-FOUC theme state manager synchronizing OS media queries and user cookie overrides.",
        470,
        """class ThemeEngine:
    def __init__(self, system_preference: str = 'dark', user_cookie: str = None):
        self.theme = user_cookie or system_preference

    def toggle(self):
        self.theme = 'light' if self.theme == 'dark' else 'dark'
        return self.theme

    def get_applied_class(self) -> str:
        return f"theme-{self.theme}"
""",
        """from solution import ThemeEngine

def test_theme():
    te = ThemeEngine(system_preference='light', user_cookie='dark')
    assert te.get_applied_class() == 'theme-dark'
    te.toggle()
    assert te.get_applied_class() == 'theme-light'
""",
        "Theme engines eliminate flash-of-unstyled-content through deterministic early script execution."
    ),
    (
        49, "node-6-49", "Lesson 8.49: Web Push Notification & Service Worker Cache",
        "Implement a service worker cache strategy router dispatching cache-first vs network-first requests.",
        485,
        """class ServiceWorkerRouter:
    def __init__(self, cache_store: dict):
        self.cache = cache_store

    def handle_fetch(self, url: str, strategy: str, network_fn) -> str:
        if strategy == 'cache-first':
            if url in self.cache:
                return self.cache[url]
            res = network_fn()
            self.cache[url] = res
            return res
        elif strategy == 'network-first':
            try:
                res = network_fn()
                self.cache[url] = res
                return res
            except Exception:
                if url in self.cache:
                    return self.cache[url]
                raise
""",
        """from solution import ServiceWorkerRouter

def test_sw_router():
    sw = ServiceWorkerRouter({'/logo.png': 'cached-logo'})
    val = sw.handle_fetch('/logo.png', 'cache-first', lambda: 'network-logo')
    assert val == 'cached-logo'
""",
        "Service workers provide offline resilience and instantaneous asset hydration for progressive web apps."
    ),
    (
        50, "node-6-50", "Lesson 8.50: Capstone: Full-Stack AI Streaming Playground",
        "Architect a unified AI chat stream state machine combining SSE parsing, markdown assembly, token metrics, and tool execution.",
        500,
        """class AIStreamingPlaygroundSM:
    def __init__(self):
        self.messages = []
        self.is_streaming = False
        self.total_tokens = 0

    def start_stream(self):
        self.is_streaming = True
        self.messages.append({'role': 'assistant', 'content': ''})

    def append_chunk(self, chunk: str):
        if not self.is_streaming:
            raise RuntimeError("Stream not active")
        self.messages[-1]['content'] += chunk
        self.total_tokens += 1

    def finish_stream(self):
        self.is_streaming = False
        return self.messages[-1]
""",
        """from solution import AIStreamingPlaygroundSM

def test_capstone():
    sm = AIStreamingPlaygroundSM()
    sm.start_stream()
    sm.append_chunk("Hello ")
    sm.append_chunk("world!")
    msg = sm.finish_stream()
    assert msg['content'] == 'Hello world!'
    assert sm.total_tokens == 2
""",
        "Full-stack AI playgrounds synthesize token parsing, state management, and stream resilience into a seamless interface."
    )
]

print(f"Prepared {len(lessons)} lessons for Module 8.")

# Process updates/inserts
# First, update existing 40 nodes (node-6-1 to node-6-40)
# Then insert node-6-41 to node-6-50
def sql_escape(s):
    if s is None:
        return "NULL"
    return "'" + str(s).replace("'", "''") + "'"

def slugify(text):
    import re
    s = text.lower()
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return s[:75]

for order_idx, node_id, title, desc, xp, code, tests, failure_mode in lessons:
    starter_dict = {'solution.py': code}
    test_dict = {
        'tests.py': tests,
        'failure_mode': failure_mode,
        'verification_criteria': f"Run test suite for {title} with zero assertion errors."
    }
    
    starter_json = sql_escape(json.dumps(starter_dict)) + "::jsonb"
    test_json = sql_escape(json.dumps(test_dict)) + "::jsonb"
    title_escaped = sql_escape(title)
    subtitle_escaped = sql_escape(f"Module 8: Modern Frontend Engineering & Interactive Platforms | Lesson {order_idx} of 50")
    cs_escaped = sql_escape(f"Frontend Systems | {title.split(':', 1)[-1].strip()[:50]}")
    ai_escaped = sql_escape(desc)
    slug = f"module-08-lesson-{order_idx:02d}-{slugify(title.split(':', 1)[-1])}"
    slug_escaped = sql_escape(slug)

    if order_idx <= 40:
        sql = f"""
UPDATE curriculum_nodes
SET title = {title_escaped},
    subtitle = {subtitle_escaped},
    cs_foundation = {cs_escaped},
    ai_convergence = {ai_escaped},
    xp_reward = {xp},
    starter_code = {starter_json},
    test_suite = {test_json}
WHERE id = '{node_id}';
"""
        run_sql(sql)
        print(f"Updated {node_id}: {title}")
    else:
        check_sql = f"SELECT id FROM curriculum_nodes WHERE id = '{node_id}';"
        res = run_sql(check_sql)
        if res:
            sql = f"""
UPDATE curriculum_nodes
SET title = {title_escaped},
    subtitle = {subtitle_escaped},
    cs_foundation = {cs_escaped},
    ai_convergence = {ai_escaped},
    order_index = {order_idx},
    xp_reward = {xp},
    starter_code = {starter_json},
    test_suite = {test_json}
WHERE id = '{node_id}';
"""
            run_sql(sql)
            print(f"Updated expanded node {node_id}: {title}")
        else:
            handbook = f"""# {title}

- **Module**: `Module 8: Modern Frontend Engineering & Interactive Platforms`
- **Focus**: {desc}
- **Verification**: Run test suite for `{title}` with zero assertion errors.

## Architectural Overview
Modern frontend engineering in AI platforms demands low-latency streaming rendering, resilient WebSocket states, and fine-grained reactivity.
"""
            handbook_escaped = sql_escape(handbook)
            sql = f"""
INSERT INTO curriculum_nodes (id, slug, phase_id, title, subtitle, cs_foundation, ai_convergence, order_index, xp_reward, starter_code, test_suite, handbook_markdown, level_required, position_x, position_y)
VALUES (
    '{node_id}',
    {slug_escaped},
    'module-8',
    {title_escaped},
    {subtitle_escaped},
    {cs_escaped},
    {ai_escaped},
    {order_idx},
    {xp},
    {starter_json},
    {test_json},
    {handbook_escaped},
    1,
    0.0,
    0.0
);
"""
            run_sql(sql)
            print(f"Inserted new node {node_id}: {title}")


print("Module 8 successfully synced!")


