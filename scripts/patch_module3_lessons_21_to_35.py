#!/usr/bin/env python3
"""
Batch patch Module 3: Lessons 3.21 to 3.35
Enforces:
1. Physical intuitive mental models with zero unintroduced jargon.
2. 3-Part Briefing card schema (exercise_about, exercise_goal, expected_output).
3. Clean guided starter code (clean types, docstrings, # TODO comments, no spoilers).
4. Full automated test suite verification.
"""

import urllib.request
import json
import os

SUPABASE_URL = ""
SUPABASE_KEY = ""

env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
with open(env_path) as f:
    for line in f:
        if line.startswith("SUPABASE_SERVICE_ROLE_KEY="):
            SUPABASE_KEY = line.split("=", 1)[1].strip().strip('"').strip("'")
        elif line.startswith("NEXT_PUBLIC_SUPABASE_URL="):
            SUPABASE_URL = line.split("=", 1)[1].strip().strip('"').strip("'")

LESSONS_DATA = {
    "node-2-21": {
        "title": "Lesson 3.21: Topological Sort & Dependencies",
        "handbook_markdown": r"""# Lesson 3.21: Topological Sort & Dependencies

In task scheduling, compiler builds, and agent workflows, tasks must run in an order that satisfies all dependencies. **Topological Sort** transforms a Directed Acyclic Graph (DAG) into a linear sequence of execution where every task comes *after* its prerequisites.

---

### 💡 The Mental Model: University Course Prerequisites
Think of a degree plan:
- Math 101 must precede Math 201.
- CS 101 must precede CS 201.
- CS 201 & Math 201 must precede Machine Learning 301.
Topological sort outputs a valid term-by-term class schedule where you never sit in a class without having completed all its prerequisites.

---

### 🔍 Deep Dive: Kahn's Algorithm (In-Degree BFS)
1. Calculate the **in-degree** (number of incoming dependency arrows) for every node.
2. Push all nodes with `in_degree == 0` into a queue (these are ready to execute immediately).
3. While queue is not empty:
   - Pop node $u$, append to result list.
   - For each neighbor $v$ of $u$: decrement $v$'s in-degree by 1.
   - If $v$'s in-degree reaches 0, push $v$ into the queue.
4. If result length $< |V|$, a cycle was present!
""",
        "starter_code": {
            "solution.py": '''"""
Topological Sort & Dependencies
Calculate a valid task execution schedule using Kahn's algorithm.
"""

from typing import Dict, List
from collections import deque

def topological_sort(graph: Dict[str, List[str]]) -> List[str]:
    """
    Compute a valid linear execution order for nodes in a DAG using Kahn's algorithm.

    Args:
        graph: Adjacency list mapping node -> list of dependent nodes that depend on it
               (i.e. edge U -> V means U must execute BEFORE V).

    Returns:
        A list of node IDs in valid topological order.

    Raises:
        ValueError: If a cycle is detected in the graph.
    """
    # TODO: Calculate in-degree for every node in graph
    # TODO: Collect all nodes with in-degree == 0 in a queue
    # TODO: Process queue, updating in-degrees of neighbors
    # TODO: Check if all nodes were scheduled; raise ValueError if cycle exists
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Learn Kahn's algorithm to compute valid linear execution orders for Directed Acyclic Graphs (DAGs) in compiler build systems and task runners.",
            "exercise_goal": "Implement `topological_sort(graph)` to return a valid ordered list of tasks or raise `ValueError` on cyclic dependencies.",
            "expected_output": "Return a schedule where every prerequisite appears before its dependent tasks.",
            "tests.py": '''import pytest
from solution import topological_sort

def test_linear_order():
    # A -> B -> C
    graph = {
        "A": ["B"],
        "B": ["C"],
        "C": []
    }
    result = topological_sort(graph)
    assert result == ["A", "B", "C"]

def test_diamond_dag():
    # A -> B, A -> C, B -> D, C -> D
    graph = {
        "A": ["B", "C"],
        "B": ["D"],
        "C": ["D"],
        "D": []
    }
    result = topological_sort(graph)
    assert result[0] == "A"
    assert result[-1] == "D"
    assert set(result[1:3]) == {"B", "C"}

def test_cycle_detection():
    # A -> B -> A
    cyclic = {
        "A": ["B"],
        "B": ["A"]
    }
    with pytest.raises(ValueError):
        topological_sort(cyclic)
'''
        }
    },
    "node-2-22": {
        "title": "Lesson 3.22: DAG Workflow Execution Engine",
        "handbook_markdown": r"""# Lesson 3.22: DAG Workflow Execution Engine

Modern agent orchestration frameworks (such as LangGraph, Airflow, and Prefect) execute complex workflows as **Durable Execution DAGs**.

---

### 💡 The Mental Model: Parallel Cooking Stations
Imagine a restaurant kitchen preparing a gourmet burger:
- Station 1: Grill patty (Takes 5 min).
- Station 2: Toast buns & chop lettuce (Takes 2 min).
- Station 3: Assemble & Plate (Requires BOTH patty and toasted buns).

Stations 1 and 2 can run **in parallel**. Station 3 must wait until all incoming upstream dependencies have finished.

---

### 🔍 Deep Dive: Stateful DAG Execution
Each node in a DAG receives an aggregated state dictionary from its upstream dependencies, executes its transformation function, and passes its output state downstream.
""",
        "starter_code": {
            "solution.py": '''"""
DAG Workflow Execution Engine
Execute step nodes in topological waves, propagating state across dependencies.
"""

from typing import Dict, List, Callable, Any

class WorkflowEngine:
    def __init__(self):
        # task_id -> {"func": Callable, "deps": List[str]}
        self.tasks: Dict[str, Dict[str, Any]] = {}

    def register_task(self, task_id: str, func: Callable[[Dict[str, Any]], Any], dependencies: List[str] = None) -> None:
        """Register a named task with its function and required prerequisite task IDs."""
        self.tasks[task_id] = {
            "func": func,
            "deps": dependencies or []
        }

    def run(self, initial_state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute all tasks in topological dependency order.
        Each task receives the shared state dict and its return value is stored in state[task_id].
        Returns the final combined state.
        """
        # TODO: Determine execution order of tasks based on dependencies
        # TODO: Iterate through tasks in order
        # TODO: Execute each task's func(state) and store result in state[task_id]
        # TODO: Return updated state
        pass
'''
        },
        "test_suite": {
            "exercise_about": "Build a stateful workflow execution engine that orchestrates multi-step pipelines respecting dependency constraints.",
            "exercise_goal": "Implement `WorkflowEngine` with `register_task(task_id, func, dependencies)` and `run(initial_state)`.",
            "expected_output": "Execute all registered tasks in proper dependency order, passing accumulated state down the pipeline.",
            "tests.py": '''import pytest
from solution import WorkflowEngine

def test_workflow_execution():
    engine = WorkflowEngine()
    
    # Task 1: Fetch raw input
    engine.register_task("fetch_data", lambda state: state["input_val"] * 2)
    # Task 2: Transform data (depends on fetch_data)
    engine.register_task(
        "transform", 
        lambda state: f"Result: {state['fetch_data'] + 5}", 
        dependencies=["fetch_data"]
    )
    # Task 3: Format output (depends on transform)
    engine.register_task(
        "finalize", 
        lambda state: state["transform"].upper(), 
        dependencies=["transform"]
    )
    
    final_state = engine.run({"input_val": 10})
    assert final_state["fetch_data"] == 20
    assert final_state["transform"] == "Result: 25"
    assert final_state["finalize"] == "RESULT: 25"
'''
        }
    },
    "node-2-23": {
        "title": "Lesson 3.23: Shortest Path & Cost Graphs",
        "handbook_markdown": r"""# Lesson 3.23: Shortest Path & Cost Graphs

In network routing, GPS navigation, and cost-optimized LLM agent tool dispatching, finding the cheapest path between nodes is solved by **Dijkstra's Algorithm**.

---

### 💡 The Mental Model: Ripple in a Water Pond
Imagine dropping a pebble at your start location:
The water ripples outward in circular rings. The first ripple to touch the target destination is guaranteed to have traveled the absolute shortest distance.

---

### 🔍 Deep Dive: Dijkstra with a Priority Queue
1. Maintain a distance map `dist[node] = float('inf')`, with `dist[start] = 0`.
2. Push `(0, start)` into a min-heap priority queue.
3. While heap is not empty:
   - Pop `(current_cost, u)`. If `current_cost > dist[u]`, continue (stale entry).
   - If `u == target`, return `current_cost`.
   - For each neighbor `(v, edge_weight)` of `u`:
     - If `dist[u] + edge_weight < dist[v]`:
       - `dist[v] = dist[u] + edge_weight`
       - Push `(dist[v], v)` into min-heap.
""",
        "starter_code": {
            "solution.py": '''"""
Shortest Path & Cost Graphs
Find the minimum cost path between nodes using Dijkstra's algorithm.
"""

from typing import Dict, List, Tuple, Optional
import heapq

def dijkstra_shortest_path(
    graph: Dict[str, List[Tuple[str, float]]],
    start_node: str,
    end_node: str
) -> Optional[float]:
    """
    Calculate the minimum path cost from start_node to end_node in a weighted graph.

    Args:
        graph: Mapping node -> list of (neighbor_node, weight).
        start_node: Starting node ID.
        end_node: Target destination node ID.

    Returns:
        The minimum total cost as a float, or None if end_node is unreachable.
    """
    # TODO: Initialize distances map and min-heap with (0.0, start_node)
    # TODO: Process nodes with lowest cost first
    # TODO: Relax neighbor edges and push updated costs
    # TODO: Return minimum cost to end_node
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Master Dijkstra's algorithm with priority queues (min-heaps) to calculate lowest-cost paths across weighted graphs.",
            "exercise_goal": "Write `dijkstra_shortest_path(graph, start_node, end_node)` returning the minimum cost float or `None`.",
            "expected_output": "Find optimal shortest paths and correctly detect unreachable destination nodes.",
            "tests.py": '''import pytest
from solution import dijkstra_shortest_path

def test_dijkstra_simple_path():
    graph = {
        "A": [("B", 1.0), ("C", 4.0)],
        "B": [("C", 2.0), ("D", 5.0)],
        "C": [("D", 1.0)],
        "D": []
    }
    # Path A -> B (1) -> C (2) -> D (1) = Total cost 4.0
    cost = dijkstra_shortest_path(graph, "A", "D")
    assert cost == 4.0

def test_start_equals_end():
    graph = {"A": []}
    assert dijkstra_shortest_path(graph, "A", "A") == 0.0

def test_unreachable_node():
    graph = {
        "A": [("B", 2.0)],
        "B": [],
        "C": []
    }
    assert dijkstra_shortest_path(graph, "A", "C") is None
'''
        }
    },
    "node-2-24": {
        "title": "Lesson 3.24: Critical Path Method (CPM)",
        "handbook_markdown": r"""# Lesson 3.24: Critical Path Method (CPM)

In project management and distributed AI batch scheduling, the **Critical Path** is the longest sequence of dependent activities from project start to finish.

Activities on the critical path have **zero slack time**: if any critical task is delayed by 1 hour, the entire project deadline is delayed by 1 hour.

---

### 💡 The Mental Model: Building a House
- Digging foundation: 5 days.
- Framing walls (after foundation): 10 days.
- Painting interior (after framing): 3 days.
- Ordering decorative plants (can start day 1, takes 2 days).
The foundation $\to$ framing $\to$ painting chain takes 18 days (**Critical Path**). Ordering plants has 16 days of slack time.

---

### 🔍 Deep Dive: Calculating Earliest Finish Times
For each node $v$ in topological order:
$$\text{ES}(v) = \max_{u \in \text{predecessors}(v)} \text{EF}(u)$$
$$\text{EF}(v) = \text{ES}(v) + \text{duration}(v)$$
""",
        "starter_code": {
            "solution.py": '''"""
Critical Path Method (CPM)
Calculate earliest finish times and the total duration of the critical path.
"""

from typing import Dict, List, Tuple

def calculate_critical_path_duration(
    task_durations: Dict[str, float],
    dependencies: Dict[str, List[str]]
) -> float:
    """
    Calculate the total project duration (length of the critical path).

    Args:
        task_durations: Mapping task_id -> duration (in hours/days).
        dependencies: Mapping task_id -> list of prerequisite task_ids that must finish before it starts.

    Returns:
        The total minimum time required to complete all tasks as a float.
    """
    # TODO: Compute in-degree or topological order
    # TODO: Calculate Earliest Start (ES) and Earliest Finish (EF) for each task
    # TODO: Total project duration = max(EF across all tasks)
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand project scheduling, slack analysis, and compute the Critical Path duration for dependent task networks.",
            "exercise_goal": "Implement `calculate_critical_path_duration(task_durations, dependencies)` to calculate the longest dependent chain duration.",
            "expected_output": "Return the exact float duration of the critical path.",
            "tests.py": '''import pytest
from solution import calculate_critical_path_duration

def test_critical_path_simple():
    durations = {"A": 3.0, "B": 2.0, "C": 5.0, "D": 4.0}
    # Branch 1: A (3) -> B (2) -> D (4) = 9
    # Branch 2: A (3) -> C (5) -> D (4) = 12 (Critical Path)
    deps = {
        "A": [],
        "B": ["A"],
        "C": ["A"],
        "D": ["B", "C"]
    }
    assert calculate_critical_path_duration(durations, deps) == 12.0

def test_parallel_independent_tasks():
    durations = {"task1": 10.0, "task2": 25.0, "task3": 15.0}
    deps = {"task1": [], "task2": [], "task3": []}
    assert calculate_critical_path_duration(durations, deps) == 25.0
'''
        }
    },
    "node-2-25": {
        "title": "Lesson 3.25: Finite State Machines (FSM/DFA)",
        "handbook_markdown": r"""# Lesson 3.25: Finite State Machines (FSM/DFA)

A **Deterministic Finite Automaton (DFA)** is a mathematical model of computation consisting of:
- A finite set of **States** ($S$).
- An initial starting state ($s_0$).
- An alphabet of **Input Symbols** ($\Sigma$).
- A deterministic **Transition Function** $\delta(s, c) \to s'$.
- A set of **Accepting (Final) States** ($F$).

---

### 💡 The Mental Model: The Turnstile Gate
A subway turnstile has two states:
- **Locked**:
  - Insert Coin $\to$ Transition to **Unlocked**.
  - Push Turnstile $\to$ Remains **Locked** (Alarm beeps).
- **Unlocked**:
  - Push Turnstile $\to$ Passenger passes $\to$ Transition to **Locked**.
  - Insert Coin $\to$ Remains **Unlocked** (Coin returned).

---

### 🔍 Deep Dive: String Token Recognition
DFAs recognize regular languages without backtracking, executing in strict $O(N)$ time over an $N$-character input stream.
""",
        "starter_code": {
            "solution.py": '''"""
Finite State Machines (FSM/DFA)
Implement a deterministic finite automaton state machine.
"""

from typing import Set, Dict, Tuple

class DeterministicFiniteAutomaton:
    def __init__(
        self,
        states: Set[str],
        alphabet: Set[str],
        transitions: Dict[Tuple[str, str], str],
        start_state: str,
        accept_states: Set[str]
    ):
        self.states = states
        self.alphabet = alphabet
        self.transitions = transitions # (state, char) -> next_state
        self.start_state = start_state
        self.accept_states = accept_states

    def process(self, input_string: str) -> bool:
        """
        Feed input_string character-by-character into the DFA starting from self.start_state.
        Return True if final state is in self.accept_states, False otherwise (or if transition invalid).
        """
        # TODO: Initialize current_state = self.start_state
        # TODO: Loop over each char in input_string
        # TODO: Look up transition; if missing, return False
        # TODO: Return True if current_state in self.accept_states
        pass
'''
        },
        "test_suite": {
            "exercise_about": "Build a formal Deterministic Finite Automaton (DFA) engine to validate input sequences and token streams.",
            "exercise_goal": "Implement `process(input_string)` on `DeterministicFiniteAutomaton` to step through state transitions and evaluate acceptance.",
            "expected_output": "Return `True` if the machine terminates in an accept state, and `False` on invalid transitions or non-accepting end states.",
            "tests.py": '''import pytest
from solution import DeterministicFiniteAutomaton

def test_binary_even_zeros_dfa():
    # DFA that accepts binary strings with an even number of '0's
    # q0 (even 0s, start & accept), q1 (odd 0s)
    dfa = DeterministicFiniteAutomaton(
        states={"q0", "q1"},
        alphabet={"0", "1"},
        transitions={
            ("q0", "0"): "q1",
            ("q0", "1"): "q0",
            ("q1", "0"): "q0",
            ("q1", "1"): "q1",
        },
        start_state="q0",
        accept_states={"q0"}
    )
    
    assert dfa.process("") is True       # 0 zeros (even)
    assert dfa.process("111") is True    # 0 zeros
    assert dfa.process("10101") is True  # 2 zeros (even)
    assert dfa.process("101") is False   # 1 zero (odd)
    assert dfa.process("000") is False   # 3 zeros (odd)

def test_invalid_character_transition():
    dfa = DeterministicFiniteAutomaton(
        states={"s"},
        alphabet={"a"},
        transitions={("s", "a"): "s"},
        start_state="s",
        accept_states={"s"}
    )
    assert dfa.process("aab") is False # 'b' is not in transitions
'''
        }
    },
    "node-2-26": {
        "title": "Lesson 3.26: NFA to DFA Subset Construction",
        "handbook_markdown": r"""# Lesson 3.26: NFA to DFA Subset Construction

A **Non-Deterministic Finite Automaton (NFA)** allows:
1. Multiple transitions for the same character from one state.
2. **$\epsilon$-transitions** (spontaneous jumps without consuming input).

The **Powerset Subset Construction Algorithm** proves that every NFA can be converted into an equivalent deterministic DFA whose states are *subsets* of the original NFA states.

---

### 💡 The Mental Model: Parallel Multiverse Tracking
When an NFA reaches a fork with 2 paths, instead of guessing, you clone your observation into both parallel timelines simultaneously. A DFA state simply records the set of all active timelines: `{"state_1", "state_2"}`.

---

### 🔍 Deep Dive: $\epsilon$-Closure
The $\epsilon$-closure of state $s$ is the set of all states reachable from $s$ by taking zero or more $\epsilon$-transitions.
""",
        "starter_code": {
            "solution.py": '''"""
NFA to DFA Subset Construction
Calculate epsilon-closures and step multi-state NFA simulations.
"""

from typing import Set, Dict, Tuple

class SimpleNFA:
    def __init__(
        self,
        transitions: Dict[Tuple[str, str], Set[str]], # (state, char_or_eps) -> set of next states
        start_state: str,
        accept_states: Set[str]
    ):
        self.transitions = transitions
        self.start_state = start_state
        self.accept_states = accept_states

    def epsilon_closure(self, current_states: Set[str]) -> Set[str]:
        """Compute the set of all states reachable from current_states using only epsilon ('') transitions."""
        # TODO: Use BFS/DFS stack to expand all reachable states via ('state', '') transitions
        pass

    def step(self, current_states: Set[str], char: str) -> Set[str]:
        """Transition from current_states consuming `char`, followed by epsilon closure."""
        # TODO: For each state in current_states, find next states on char
        # TODO: Compute epsilon_closure on the resulting state set
        pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand non-deterministic finite automata (NFAs), epsilon closures, and subset tracking simulations.",
            "exercise_goal": "Implement `epsilon_closure(current_states)` and `step(current_states, char)` on `SimpleNFA`.",
            "expected_output": "Correctly resolve epsilon cascades and multi-state transition sets.",
            "tests.py": '''import pytest
from solution import SimpleNFA

def test_epsilon_closure_chain():
    # s0 --eps--> s1 --eps--> s2
    transitions = {
        ("s0", ""): {"s1"},
        ("s1", ""): {"s2"},
    }
    nfa = SimpleNFA(transitions, start_state="s0", accept_states={"s2"})
    closure = nfa.epsilon_closure({"s0"})
    assert closure == {"s0", "s1", "s2"}

def test_nfa_step_transition():
    # s0 --'a'--> {s1, s2}, s2 --eps--> s3
    transitions = {
        ("s0", "a"): {"s1", "s2"},
        ("s2", ""): {"s3"},
    }
    nfa = SimpleNFA(transitions, start_state="s0", accept_states={"s3"})
    
    next_states = nfa.step({"s0"}, "a")
    assert next_states == {"s1", "s2", "s3"}
'''
        }
    },
    "node-2-27": {
        "title": "Lesson 3.27: Agent State Machine Architecture",
        "handbook_markdown": r"""# Lesson 3.27: Agent State Machine Architecture

In production AI systems, autonomous agents should not be loose while loops. They must be structured as **Finite State Machines** with explicit states (`IDLE`, `PLANNING`, `TOOL_CALL`, `AWAITING_USER`, `TERMINATED`).

---

### 💡 The Mental Model: The Air Traffic Controller
An air traffic controller follows rigid protocol states:
1. `APPROACH` $\to$ Clear for descent.
2. `HOLDING_PATTERN` $\to$ Circling until runway clear.
3. `FINAL_APPROACH` $\to$ Wheels down.
4. `LANDED` $\to$ Taxi to gate.

If an unexpected condition occurs (e.g. wind shear), the state machine enforces a safe transition back to `HOLDING_PATTERN` rather than crashing.

---

### 🔍 Deep Dive: Transition Guards & Actions
Each state transition is protected by a guard condition and executes an entry/exit hook.
""",
        "starter_code": {
            "solution.py": '''"""
Agent State Machine Architecture
Implement a guarded state machine for orchestrating autonomous AI agent lifecycles.
"""

from typing import Dict, Tuple, Callable, Any, Optional

class AgentStateMachine:
    def __init__(self, initial_state: str):
        self.current_state = initial_state
        # (from_state, event) -> (to_state, guard_callable, action_callable)
        self.transitions: Dict[Tuple[str, str], Tuple[str, Optional[Callable[[Dict[str, Any]], bool]], Optional[Callable[[Dict[str, Any]], None]]]] = {}

    def add_transition(
        self,
        from_state: str,
        event: str,
        to_state: str,
        guard: Optional[Callable[[Dict[str, Any]], bool]] = None,
        action: Optional[Callable[[Dict[str, Any]], None]] = None
    ) -> None:
        """Register a valid state transition with optional guard and action hooks."""
        self.transitions[(from_state, event)] = (to_state, guard, action)

    def trigger(self, event: str, context: Dict[str, Any]) -> bool:
        """
        Attempt to trigger `event` on current_state.
        If transition exists and guard passes (or guard is None):
        - Execute action(context) if defined
        - Update self.current_state = to_state
        - Return True
        Otherwise, leave state unchanged and return False.
        """
        # TODO: Look up transition for (self.current_state, event)
        # TODO: Check guard condition
        # TODO: Execute action and update state
        pass
'''
        },
        "test_suite": {
            "exercise_about": "Build an event-driven guarded state machine to enforce robust lifecycle transitions in autonomous AI agents.",
            "exercise_goal": "Implement `add_transition()` and `trigger(event, context)` on `AgentStateMachine`.",
            "expected_output": "Successfully transition states when guards pass and reject illegal transitions or failed guards.",
            "tests.py": '''import pytest
from solution import AgentStateMachine

def test_agent_lifecycle_transitions():
    fsm = AgentStateMachine("IDLE")
    
    # Transition: IDLE -> PLANNING on "START"
    fsm.add_transition("IDLE", "START", "PLANNING")
    # Transition: PLANNING -> TOOL_CALL on "EXECUTE" only if has_tools is True
    fsm.add_transition(
        "PLANNING", 
        "EXECUTE", 
        "TOOL_CALL",
        guard=lambda ctx: ctx.get("has_tools") is True
    )
    
    assert fsm.current_state == "IDLE"
    assert fsm.trigger("START", {}) is True
    assert fsm.current_state == "PLANNING"
    
    # Guard failure
    assert fsm.trigger("EXECUTE", {"has_tools": False}) is False
    assert fsm.current_state == "PLANNING"
    
    # Guard pass
    assert fsm.trigger("EXECUTE", {"has_tools": True}) is True
    assert fsm.current_state == "TOOL_CALL"

def test_invalid_event():
    fsm = AgentStateMachine("IDLE")
    assert fsm.trigger("UNKNOWN_EVENT", {}) is False
    assert fsm.current_state == "IDLE"
'''
        }
    },
    "node-2-28": {
        "title": "Lesson 3.28: Context-Free Grammars & BNF",
        "handbook_markdown": r"""# Lesson 3.28: Context-Free Grammars & BNF

A **Context-Free Grammar (CFG)** defines the formal syntax rules for programming languages, JSON, and structured LLM outputs using **Backus-Naur Form (BNF)**.

A grammar consists of:
- **Terminals**: Concrete tokens (e.g. `NUMBER`, `"+"`, `"*"`).
- **Non-terminals**: Syntactic variables (e.g. `expr`, `term`, `factor`).
- **Production Rules**: $A \to \alpha$, describing how non-terminals expand.

---

### 💡 The Mental Model: LEGO Instruction Manuals
- A **Castle** is composed of: `Walls + Towers + Gate`.
- A **Tower** is composed of: `Base + 4 Blocks + Flag`.
Production rules define how complex structures break down into fundamental atomic bricks.

---

### 🔍 Deep Dive: Arithmetic Expression Grammar
$$\text{expr} \to \text{term} (('+' \mid '-') \text{term})^*$$
$$\text{term} \to \text{factor} (('*' \mid '/') \text{factor})^*$$
$$\text{factor} \to \text{NUMBER} \mid '(' \text{expr} ')'$$
""",
        "starter_code": {
            "solution.py": '''"""
Context-Free Grammars & BNF
Validate simple bracket and token nesting using context-free grammar rules.
"""

from typing import List

def validate_nested_parentheses_grammar(tokens: List[str]) -> bool:
    """
    Validate if a token list matches the CFG:
    S -> '(' S ')' S | '' (empty)
    
    Returns True if properly matched and balanced, False otherwise.
    """
    # TODO: Use a stack to track open brackets
    # TODO: Verify all opens match closes and stack ends empty
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand Context-Free Grammars (CFG), formal production rules, and balanced token matching.",
            "exercise_goal": "Implement `validate_nested_parentheses_grammar(tokens)` to verify structured bracket nesting.",
            "expected_output": "Return True for valid balanced CFG strings and False for unbalanced or misordered brackets.",
            "tests.py": '''import pytest
from solution import validate_nested_parentheses_grammar

def test_valid_nesting():
    assert validate_nested_parentheses_grammar([]) is True
    assert validate_nested_parentheses_grammar(["(", ")"]) is True
    assert validate_nested_parentheses_grammar(["(", "(", ")", ")", "(", ")"]) is True

def test_invalid_nesting():
    assert validate_nested_parentheses_grammar(["("]) is False
    assert validate_nested_parentheses_grammar([")", "("]) is False
    assert validate_nested_parentheses_grammar(["(", ")", ")"]) is False
'''
        }
    },
    "node-2-29": {
        "title": "Lesson 3.29: Lexing & Query Tokenization",
        "handbook_markdown": r"""# Lesson 3.29: Lexing & Query Tokenization

Before a compiler or interpreter can parse a program, the **Lexer (Tokenizer)** scans raw source text and converts it into a stream of structured **Tokens** (Tag, Value, Position).

---

### 💡 The Mental Model: Cutting Words from a Magazine
Raw source code is just an unsegmented string of characters: `"count = 42 + 8;"`.
The Lexer acts like a pair of scissors cutting out words and labeling each one:
- `IDENTIFIER("count")`
- `EQUALS("=")`
- `NUMBER(42)`
- `PLUS("+")`
- `NUMBER(8)`
- `SEMICOLON(";")`

---

### 🔍 Deep Dive: Regex Lexer Implementation
Using compiled regular expressions to match tokens in priority order.
""",
        "starter_code": {
            "solution.py": '''"""
Lexing & Query Tokenization
Convert arithmetic query strings into structured token objects.
"""

from typing import List, Tuple
import re

Token = Tuple[str, str] # (TOKEN_TYPE, VALUE)

def tokenize_expression(source: str) -> List[Token]:
    """
    Tokenize an arithmetic expression into a list of (TYPE, VALUE) tuples.
    Recognized types:
    - "NUMBER": Sequence of digits
    - "PLUS": "+"
    - "MINUS": "-"
    - "STAR": "*"
    - "SLASH": "/"
    - "LPAREN": "("
    - "RPAREN": ")"
    Whitespace should be skipped.
    
    Raises:
        ValueError: If an unrecognized character is encountered.
    """
    # TODO: Define regex patterns for tokens
    # TODO: Scan source string and yield (TYPE, VALUE)
    # TODO: Raise ValueError on illegal characters
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Build a lexical scanner (lexer/tokenizer) that converts raw text into typed token streams for compilers and parsers.",
            "exercise_goal": "Implement `tokenize_expression(source)` to produce typed token lists or raise `ValueError` on syntax errors.",
            "expected_output": "Return clean token lists matching input operators and numbers.",
            "tests.py": '''import pytest
from solution import tokenize_expression

def test_tokenize_basic_expression():
    tokens = tokenize_expression("42 + 8 * (10 - 2)")
    assert tokens == [
        ("NUMBER", "42"),
        ("PLUS", "+"),
        ("NUMBER", "8"),
        ("STAR", "*"),
        ("LPAREN", "("),
        ("NUMBER", "10"),
        ("MINUS", "-"),
        ("NUMBER", "2"),
        ("RPAREN", ")"),
    ]

def test_tokenize_illegal_character():
    with pytest.raises(ValueError):
        tokenize_expression("10 @ 5")
'''
        }
    },
    "node-2-30": {
        "title": "Lesson 3.30: Recursive Descent AST Parsing",
        "handbook_markdown": r"""# Lesson 3.30: Recursive Descent AST Parsing

A **Recursive Descent Parser** transforms a flat token stream into an **Abstract Syntax Tree (AST)** by implementing one recursive function for each non-terminal rule in the grammar.

---

### 💡 The Mental Model: Parsing a Math Problem
To evaluate `3 + 4 * 2`:
Because multiplication has higher precedence than addition, the parser constructs a tree where `4 * 2` is grouped first:
```
    [ + ]
   /     \
  3     [ * ]
       /     \
      4       2
```
Evaluating the root produces $3 + (4 \times 2) = 11$.

---

### 🔍 Deep Dive: Operator Precedence Architecture
- `parse_expr()`: handles `+` and `-`.
- `parse_term()`: handles `*` and `/`.
- `parse_factor()`: handles numbers and parenthesized expressions `(expr)`.
""",
        "starter_code": {
            "solution.py": '''"""
Recursive Descent AST Parsing
Parse tokens into an AST and evaluate the resulting arithmetic expression.
"""

from typing import List, Tuple, Any

Token = Tuple[str, str]

class ExpressionParser:
    def __init__(self, tokens: List[Token]):
        self.tokens = tokens
        self.pos = 0

    def _peek(self) -> Tuple[str, str]:
        if self.pos < len(self.tokens):
            return self.tokens[self.pos]
        return ("EOF", "")

    def _consume(self, expected_type: str = None) -> Tuple[str, str]:
        token = self._peek()
        if expected_type and token[0] != expected_type:
            raise ValueError(f"Expected {expected_type} but found {token[0]}")
        self.pos += 1
        return token

    def parse_factor(self) -> int:
        """factor -> NUMBER | LPAREN expr RPAREN"""
        # TODO: Handle NUMBER or parenthesized expression
        pass

    def parse_term(self) -> int:
        """term -> factor (('STAR' | 'SLASH') factor)*"""
        # TODO: Parse left factor, then loop over * and /
        pass

    def parse_expr(self) -> int:
        """expr -> term (('PLUS' | 'MINUS') term)*"""
        # TODO: Parse left term, then loop over + and -
        pass

def parse_and_evaluate(tokens: List[Token]) -> int:
    """Parse a token stream and evaluate its integer result."""
    parser = ExpressionParser(tokens)
    return parser.parse_expr()
'''
        },
        "test_suite": {
            "exercise_about": "Implement a Recursive Descent Parser that respects mathematical operator precedence and evaluates arithmetic token trees.",
            "exercise_goal": "Implement `parse_factor()`, `parse_term()`, and `parse_expr()` in `ExpressionParser`.",
            "expected_output": "Correctly compute arithmetic results respecting PEMDAS precedence and parenthesis grouping.",
            "tests.py": '''import pytest
from solution import parse_and_evaluate

def test_precedence_multiplication_over_addition():
    # 3 + 4 * 2 = 11
    tokens = [
        ("NUMBER", "3"),
        ("PLUS", "+"),
        ("NUMBER", "4"),
        ("STAR", "*"),
        ("NUMBER", "2")
    ]
    assert parse_and_evaluate(tokens) == 11

def test_parentheses_override_precedence():
    # (3 + 4) * 2 = 14
    tokens = [
        ("LPAREN", "("),
        ("NUMBER", "3"),
        ("PLUS", "+"),
        ("NUMBER", "4"),
        ("RPAREN", ")"),
        ("STAR", "*"),
        ("NUMBER", "2")
    ]
    assert parse_and_evaluate(tokens) == 14
'''
        }
    },
    "node-2-31": {
        "title": "Lesson 3.31: Algorithmic Complexity (Big-O)",
        "handbook_markdown": r"""# Lesson 3.31: Algorithmic Complexity (Big-O)

**Big-O Notation** describes how an algorithm's execution time and memory usage scale as the input size $N$ grows toward infinity:
- $O(1)$: Constant time (Hash map lookup).
- $O(\log N)$: Logarithmic time (Binary search).
- $O(N)$: Linear time (Single loop scan).
- $O(N \log N)$: Linearithmic time (Merge sort, Quick sort).
- $O(N^2)$: Quadratic time (Nested loops over $N$).
- $O(2^N)$: Exponential time (Brute-force subset search).

---

### 💡 The Mental Model: Finding a Word in a Dictionary
- **$O(N)$ (Linear scan)**: Reading every single word from page 1 until you find "Zebras" (300,000 checks).
- **$O(\log N)$ (Binary search)**: Opening to the exact middle, checking if "Zebras" is left or right, and halving the pages each step (only 18 checks for 300,000 words!).

---

### 🔍 Deep Dive: Estimating Scaling in Code
Understanding Big-O allows engineers to predict when an algorithm will crash under production traffic.
""",
        "starter_code": {
            "solution.py": '''"""
Algorithmic Complexity (Big-O)
Analyze algorithmic scaling and verify binary search logarithmic efficiency.
"""

from typing import List, Optional

def binary_search(sorted_list: List[int], target: int) -> Tuple[Optional[int], int]:
    """
    Perform binary search for `target` in `sorted_list`.

    Returns:
        A tuple (index, comparisons_count):
        - index: Integer index if found, else None
        - comparisons_count: Number of iterations executed (must be <= log2(N) + 1)
    """
    # TODO: Implement binary search tracking step count
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand asymptotic computational complexity and implement an O(log N) binary search tracking comparison bounds.",
            "exercise_goal": "Implement `binary_search(sorted_list, target)` returning `(found_index, steps_count)`.",
            "expected_output": "Find items in logarithmic iterations ($O(\log N)$) and return None if absent.",
            "tests.py": '''import pytest
from solution import binary_search

def test_binary_search_found():
    data = list(range(0, 1000, 2)) # 500 items
    idx, steps = binary_search(data, 400)
    assert idx == 200
    assert steps <= 10 # log2(500) ≈ 8.96 -> <= 10 steps

def test_binary_search_not_found():
    data = [1, 3, 5, 7, 9]
    idx, steps = binary_search(data, 6)
    assert idx is None
    assert steps <= 4
'''
        }
    },
    "node-2-32": {
        "title": "Lesson 3.32: Recurrence Relations",
        "handbook_markdown": r"""# Lesson 3.32: Recurrence Relations

A **Recurrence Relation** expresses the runtime or value of a function in terms of smaller instances of itself:
- Fibonacci: $F(n) = F(n-1) + F(n-2)$ with $F(0)=0, F(1)=1$.
- Divide-and-Conquer (Merge Sort): $T(n) = 2T(n/2) + O(n) \implies O(n \log n)$ via the Master Theorem.

---

### 💡 The Mental Model: Russian Nesting Dolls
To solve a large 10-inch doll, you open it to find two 5-inch dolls plus 1 minute of work. To solve the 5-inch dolls, you open them to find 2.5-inch dolls. You stop when you reach the solid 1-inch doll (the base case).

---

### 🔍 Deep Dive: Memoization vs Naive Recursion
Naive recursive Fibonacci takes $O(2^N)$ exponential time. With memoization, each subproblem is solved once, reducing runtime to $O(N)$.
""",
        "starter_code": {
            "solution.py": '''"""
Recurrence Relations
Solve recursive relations using memoization and dynamic programming.
"""

from typing import Dict

def solve_fibonacci_memoized(n: int, memo: Dict[int, int] = None) -> int:
    """
    Calculate the n-th Fibonacci number in O(N) time using memoization.
    Base cases: F(0) = 0, F(1) = 1.
    """
    # TODO: Implement memoized Fibonacci
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Master recurrence relations, divide-and-conquer mechanics, and memoized dynamic programming.",
            "exercise_goal": "Implement `solve_fibonacci_memoized(n)` computing large Fibonacci numbers in O(N) time without stack overflow.",
            "expected_output": "Quickly return exact Fibonacci numbers for n >= 50.",
            "tests.py": '''import pytest
from solution import solve_fibonacci_memoized

def test_fibonacci_base_and_small():
    assert solve_fibonacci_memoized(0) == 0
    assert solve_fibonacci_memoized(1) == 1
    assert solve_fibonacci_memoized(10) == 55

def test_fibonacci_large_memoized():
    # Would hang forever in naive recursion
    assert solve_fibonacci_memoized(50) == 12586269025
'''
        }
    },
    "node-2-33": {
        "title": "Lesson 3.33: NP-Completeness & Heuristics",
        "handbook_markdown": r"""# Lesson 3.33: NP-Completeness & Heuristics

In computational complexity:
- **P**: Problems solvable in polynomial time ($O(N^k)$).
- **NP**: Problems whose solutions can be *verified* in polynomial time.
- **NP-Complete**: The hardest problems in NP (e.g. Traveling Salesperson, Knapsack, SAT). No known polynomial algorithm exists.

---

### 💡 The Mental Model: The Jigsaw Puzzle
- **Solving** a 5,000-piece pure-white jigsaw puzzle might take months of trial-and-error ($NP$).
- **Verifying** that a completed puzzle has no gaps takes 5 seconds ($P$).

When facing NP-complete problems in production, engineers don't search for exact exponential solutions; they use fast **Approximation Heuristics** (Greedy, Simulated Annealing, Genetic).
""",
        "starter_code": {
            "solution.py": '''"""
NP-Completeness & Heuristics
Implement a greedy approximation heuristic for the 0/1 Knapsack Problem.
"""

from typing import List, Tuple

def greedy_knapsack_heuristic(
    items: List[Tuple[str, float, float]], # (item_name, weight, value)
    capacity: float
) -> Tuple[List[str], float, float]:
    """
    Approximate 0/1 knapsack using the value-to-weight density greedy heuristic.
    
    Returns:
        (selected_item_names, total_weight, total_value)
    """
    # TODO: Sort items by value/weight ratio descending
    # TODO: Greedily pick items if they fit within remaining capacity
    # TODO: Return selected names, total weight, total value
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand NP-complete optimization problems and apply greedy approximation heuristics to find near-optimal solutions quickly.",
            "exercise_goal": "Implement `greedy_knapsack_heuristic(items, capacity)` based on value-to-weight ratio sorting.",
            "expected_output": "Return selected items within capacity maximizing captured value.",
            "tests.py": '''import pytest
from solution import greedy_knapsack_heuristic

def test_greedy_knapsack():
    items = [
        ("gold_bar", 10.0, 100.0),    # ratio 10.0
        ("silver_bar", 20.0, 120.0),  # ratio 6.0
        ("diamond", 2.0, 50.0),       # ratio 25.0
    ]
    # Capacity 15.0: Picks diamond (2kg, 50v) then gold_bar (10kg, 100v) -> Total weight 12.0, Value 150.0
    names, weight, value = greedy_knapsack_heuristic(items, 15.0)
    assert names == ["diamond", "gold_bar"]
    assert weight == 12.0
    assert value == 150.0
'''
        }
    },
    "node-2-34": {
        "title": "Lesson 3.34: Formal Invariants & Termination",
        "handbook_markdown": r"""# Lesson 3.34: Formal Invariants & Termination

In formal verification, proving an algorithm is correct requires two mathematical proofs:
1. **Loop Invariant**: A logical property that is `True` before the loop, stays `True` after each iteration, and guarantees correctness upon termination.
2. **Termination Metric (Variant)**: A strictly decreasing non-negative integer measure proving the loop cannot run forever.

---

### 💡 The Mental Model: Sand in the Hourglass
- **Invariant**: The total number of sand grains (Top + Bottom) is constant at all times.
- **Variant**: The sand in the top chamber strictly decreases each second until reaching 0 (Guaranteed Termination).
""",
        "starter_code": {
            "solution.py": '''"""
Formal Invariants & Termination
Verify loop invariants and prove termination metrics.
"""

from typing import List, Tuple

def verified_euclidean_gcd(a: int, b: int) -> Tuple[int, List[Tuple[int, int]]]:
    """
    Compute GCD(a, b) using Euclidean algorithm while recording loop invariant states.
    Invariant: gcd(a_initial, b_initial) == gcd(current_a, current_b) at every step.
    
    Returns:
        (gcd_result, trace_of_states)
    """
    # TODO: Implement Euclidean GCD loop tracking (a, b) at each step
    # TODO: Return final gcd and state history
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand formal loop invariants and termination metrics to guarantee mathematical algorithm correctness.",
            "exercise_goal": "Implement `verified_euclidean_gcd(a, b)` tracking state transitions and computing greatest common divisor.",
            "expected_output": "Return correct GCD along with the sequence of state tuples proving termination.",
            "tests.py": '''import pytest
from solution import verified_euclidean_gcd

def test_gcd_trace_and_correctness():
    gcd_val, trace = verified_euclidean_gcd(48, 18)
    assert gcd_val == 6
    assert trace[0] == (48, 18)
    assert trace[-1][1] == 0 # Loop terminates when b == 0
'''
        }
    },
    "node-2-35": {
        "title": "Lesson 3.35: System Invariant Verification",
        "handbook_markdown": r"""# Lesson 3.35: System Invariant Verification

In distributed financial ledgers and transactional systems, **System Invariants** must hold across all concurrent mutations:
- *Conservation of Money*: Total account balances + escrow balance = Total initial capital.
- *Non-Negativity*: No debit account balance can ever drop below zero.

---

### 💡 The Mental Model: The Double-Entry Balance Sheet
In double-entry bookkeeping, every debit must have an equal and opposite credit. Money is never created or destroyed; it only moves across ledger rows.
""",
        "starter_code": {
            "solution.py": '''"""
System Invariant Verification
Implement an in-memory double-entry ledger with transactional invariant verification.
"""

from typing import Dict

class InvariantLedger:
    def __init__(self, initial_balances: Dict[str, int]):
        self.balances = dict(initial_balances)
        self.total_supply = sum(initial_balances.values())

    def transfer(self, from_acc: str, to_acc: str, amount: int) -> bool:
        """
        Execute an atomic transfer from from_acc to to_acc.
        Invariant checks:
        1. amount > 0
        2. from_acc has sufficient balance (balances[from_acc] >= amount)
        3. Total supply remains constant
        If any invariant violated, abort and return False without modifying balances.
        """
        # TODO: Check preconditions
        # TODO: Mutate balances atomically
        # TODO: Verify total supply invariant; return True if successful
        pass
'''
        },
        "test_suite": {
            "exercise_about": "Build transactional system invariant checkers ensuring conservation laws hold during state mutations.",
            "exercise_goal": "Implement `transfer(from_acc, to_acc, amount)` on `InvariantLedger` verifying balance bounds and total supply invariants.",
            "expected_output": "Allow valid balance transfers while rejecting overdrafts and preserving total ledger supply.",
            "tests.py": '''import pytest
from solution import InvariantLedger

def test_valid_transfer():
    ledger = InvariantLedger({"alice": 100, "bob": 50})
    assert ledger.transfer("alice", "bob", 30) is True
    assert ledger.balances["alice"] == 70
    assert ledger.balances["bob"] == 80
    assert sum(ledger.balances.values()) == ledger.total_supply

def test_overdraft_rejection():
    ledger = InvariantLedger({"alice": 20, "bob": 50})
    assert ledger.transfer("alice", "bob", 50) is False
    assert ledger.balances["alice"] == 20
    assert ledger.balances["bob"] == 50
'''
        }
    }
}

def apply_patches():
    print(f"Applying patch to {len(LESSONS_DATA)} lessons in Module 3 (node-2-21 to node-2-35)...")
    for node_id, data in LESSONS_DATA.items():
        payload = {
            "title": data["title"],
            "handbook_markdown": data["handbook_markdown"],
            "starter_code": data["starter_code"],
            "test_suite": data["test_suite"]
        }
        
        req = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1/curriculum_nodes?id=eq.{node_id}",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            },
            method="PATCH"
        )
        with urllib.request.urlopen(req) as resp:
            print(f"✓ Patched {node_id} ({data['title']}) -> HTTP {resp.status}")

if __name__ == "__main__":
    apply_patches()
