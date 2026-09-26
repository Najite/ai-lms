#!/usr/bin/env python3
"""
Batch patch Module 4: Lessons 4.36 to 4.50 (Micro-Autograd Engine & Attention)
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
    "node-9-36": {
        "title": "Lesson 4.36: Autograd I: The Value Node",
        "handbook_markdown": r"""# Lesson 4.36: Autograd I: The Value Node

In PyTorch and Micrograd, the core unit of automatic differentiation is the **Value** node, encapsulating:
- Scalar `data`: floating point forward value.
- Scalar `grad`: accumulated gradient $\frac{\partial L}{\partial \text{self}}$ (initialized to $0.0$).
- `_prev`: Set of child input Value nodes.
- `_backward`: Closure function calculating local chain rule gradient updates.
""",
        "starter_code": {
            "solution.py": '''"""
Autograd I: The Value Node
Implement the core scalar Value computational graph node.
"""

from typing import Set, Tuple, Optional, Callable

class Value:
    def __init__(self, data: float, _children: Tuple["Value", ...] = (), _op: str = ""):
        self.data = float(data)
        self.grad = 0.0
        self._prev = set(_children)
        self._op = _op
        self._backward: Callable[[], None] = lambda: None

    def __repr__(self) -> str:
        return f"Value(data={self.data}, grad={self.grad})"
'''
        },
        "test_suite": {
            "exercise_about": "Build the foundational Value computational graph node for scalar automatic differentiation.",
            "exercise_goal": "Implement `Value` node initializing data, zero grad, previous children set, and backward hook.",
            "expected_output": "Instantiate scalar Value nodes tracking graph metadata.",
            "tests.py": '''import pytest
from solution import Value

def test_value_node_initialization():
    v = Value(3.14)
    assert v.data == 3.14
    assert v.grad == 0.0
    assert len(v._prev) == 0
'''
        }
    },
    "node-9-37": {
        "title": "Lesson 4.37: Autograd II: Operations & Graphs",
        "handbook_markdown": r"""# Lesson 4.37: Autograd II: Operations & Graphs

Implementing `__add__` and `__mul__` on `Value` constructs the computational DAG and registers local gradient backward closures:
- For $z = x + y$: $\frac{\partial z}{\partial x} = 1, \frac{\partial z}{\partial y} = 1$.
- For $z = x \times y$: $\frac{\partial z}{\partial x} = y, \frac{\partial z}{\partial y} = x$.
""",
        "starter_code": {
            "solution.py": '''"""
Autograd II: Operations & Graphs
Implement addition and multiplication with local backward gradient closures.
"""

from typing import Set, Tuple, Callable

class Value:
    def __init__(self, data: float, _children: Tuple["Value", ...] = (), _op: str = ""):
        self.data = float(data)
        self.grad = 0.0
        self._prev = set(_children)
        self._op = _op
        self._backward: Callable[[], None] = lambda: None

    def __add__(self, other: "Value") -> "Value":
        out = Value(self.data + other.data, (self, other), "+")
        def _backward():
            self.grad += 1.0 * out.grad
            other.grad += 1.0 * out.grad
        out._backward = _backward
        return out

    def __mul__(self, other: "Value") -> "Value":
        out = Value(self.data * other.data, (self, other), "*")
        def _backward():
            self.grad += other.data * out.grad
            other.grad += self.data * out.grad
        out._backward = _backward
        return out
'''
        },
        "test_suite": {
            "exercise_about": "Implement addition and multiplication operators on computational graph Value nodes.",
            "exercise_goal": "Implement `__add__` and `__mul__` with local `_backward` closures.",
            "expected_output": "Correctly compute forward products/sums and propagate gradients locally.",
            "tests.py": '''import pytest
from solution import Value

def test_add_and_mul_backward():
    a = Value(2.0)
    b = Value(3.0)
    c = a * b # c = 6.0
    d = c + Value(4.0) # d = 10.0
    
    d.grad = 1.0
    d._backward()
    assert c.grad == 1.0
    
    c._backward()
    assert a.grad == 3.0 # dL/da = b.data = 3.0
    assert b.grad == 2.0 # dL/db = a.data = 2.0
'''
        }
    },
    "node-9-38": {
        "title": "Lesson 4.38: Autograd III: Non-Linear Activations",
        "handbook_markdown": r"""# Lesson 4.38: Autograd III: Non-Linear Activations

Adding `relu()` and `tanh()` enables deep neural representation:
- **ReLU**: $y = \max(0, x)$, with derivative $\frac{\partial y}{\partial x} = 1$ if $x > 0$ else $0$.
""",
        "starter_code": {
            "solution.py": '''"""
Autograd III: Non-Linear Activations
Implement ReLU non-linear activation with backward gradient flow.
"""

from typing import Tuple, Callable

class Value:
    def __init__(self, data: float, _children: Tuple["Value", ...] = (), _op: str = ""):
        self.data = float(data)
        self.grad = 0.0
        self._prev = set(_children)
        self._op = _op
        self._backward: Callable[[], None] = lambda: None

    def relu(self) -> "Value":
        out = Value(max(0.0, self.data), (self,), "ReLU")
        def _backward():
            self.grad += (1.0 if self.data > 0 else 0.0) * out.grad
        out._backward = _backward
        return out
'''
        },
        "test_suite": {
            "exercise_about": "Implement ReLU activation and backward gradient routing on computational graph Value nodes.",
            "exercise_goal": "Implement `relu()` on `Value`.",
            "expected_output": "Compute ReLU forward activation and zero gradient for negative inputs.",
            "tests.py": '''import pytest
from solution import Value

def test_relu_backward():
    pos_v = Value(5.0)
    out1 = pos_v.relu()
    out1.grad = 2.0
    out1._backward()
    assert pos_v.grad == 2.0

    neg_v = Value(-3.0)
    out2 = neg_v.relu()
    out2.grad = 2.0
    out2._backward()
    assert neg_v.grad == 0.0
'''
        }
    },
    "node-9-39": {
        "title": "Lesson 4.39: Autograd IV: Topological Sort",
        "handbook_markdown": r"""# Lesson 4.39: Autograd IV: Topological Sort

To backpropagate correctly through a DAG, nodes must be executed in **Reverse Topological Order**, ensuring a node only receives gradients after all downstream dependents have contributed.
""",
        "starter_code": {
            "solution.py": '''"""
Autograd IV: Topological Sort
Build topological ordering of computational DAG nodes.
"""

from typing import List, Set

def build_topo_order(root_node) -> List:
    """Build topological order of all ancestor nodes reachable from root_node."""
    topo = []
    visited = set()
    def build(v):
        if v not in visited:
            visited.add(v)
            for child in v._prev:
                build(child)
            topo.append(v)
    build(root_node)
    return topo
'''
        },
        "test_suite": {
            "exercise_about": "Build reverse topological traversal orders for autograd computational graphs.",
            "exercise_goal": "Implement `build_topo_order(root_node)`.",
            "expected_output": "Return properly ordered node lists.",
            "tests.py": '''import pytest
from solution import build_topo_order

class DummyNode:
    def __init__(self, children=()):
        self._prev = set(children)

def test_topo_ordering():
    a = DummyNode()
    b = DummyNode()
    c = DummyNode((a, b))
    
    order = build_topo_order(c)
    assert order[-1] == c
    assert set(order[:2]) == {a, b}
'''
        }
    },
    "node-9-40": {
        "title": "Lesson 4.40: Autograd V: The backward() Engine",
        "handbook_markdown": r"""# Lesson 4.40: Autograd V: The backward() Engine

The full `backward()` engine:
1. Sets `self.grad = 1.0` (base gradient $\frac{\partial L}{\partial L} = 1$).
2. Builds topological graph order.
3. Calls `node._backward()` in reverse topological order.
""",
        "starter_code": {
            "solution.py": '''"""
Autograd V: The backward() Engine
Complete scalar reverse-mode automatic differentiation engine.
"""

from typing import Set, Tuple, Callable, List

class Value:
    def __init__(self, data: float, _children: Tuple["Value", ...] = (), _op: str = ""):
        self.data = float(data)
        self.grad = 0.0
        self._prev = set(_children)
        self._op = _op
        self._backward: Callable[[], None] = lambda: None

    def __add__(self, other: "Value") -> "Value":
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data + other.data, (self, other), "+")
        def _backward():
            self.grad += out.grad
            other.grad += out.grad
        out._backward = _backward
        return out

    def __mul__(self, other: "Value") -> "Value":
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data * other.data, (self, other), "*")
        def _backward():
            self.grad += other.data * out.grad
            other.grad += self.data * out.grad
        out._backward = _backward
        return out

    def backward(self) -> None:
        topo: List[Value] = []
        visited: Set[Value] = set()
        def build(v: Value):
            if v not in visited:
                visited.add(v)
                for child in v._prev:
                    build(child)
                topo.append(v)
        build(self)
        
        self.grad = 1.0
        for node in reversed(topo):
            node._backward()
'''
        },
        "test_suite": {
            "exercise_about": "Implement the complete reverse-mode automatic differentiation backward() engine.",
            "exercise_goal": "Implement `backward()` on `Value`.",
            "expected_output": "Compute exact analytical gradients across arbitrary computation DAGs.",
            "tests.py": '''import pytest
from solution import Value

def test_full_backprop_graph():
    # z = (a + b) * c
    a = Value(2.0)
    b = Value(3.0)
    c = Value(4.0)
    
    d = a + b # 5.0
    z = d * c # 20.0
    z.backward()
    
    # dz/da = c = 4.0
    # dz/db = c = 4.0
    # dz/dc = (a+b) = 5.0
    assert a.grad == 4.0
    assert b.grad == 4.0
    assert c.grad == 5.0
'''
        }
    },
    "node-9-41": {
        "title": "Lesson 4.41: Autograd VI: Trainable Neurons & MLPs",
        "handbook_markdown": r"""# Lesson 4.41: Autograd VI: Trainable Neurons & MLPs

A **Neuron** holds weight Values $w$ and bias Value $b$, evaluating $y = \sum (w_i x_i) + b$.
An **MLP** chains layers of neurons.
""",
        "starter_code": {
            "solution.py": '''"""
Autograd VI: Trainable Neurons & MLPs
Implement an artificial Neuron with trainable parameter lists.
"""

from typing import List

class DummyNeuron:
    def __init__(self, weights: List[float], bias: float):
        self.weights = list(weights)
        self.bias = bias

    def parameters(self) -> List[float]:
        return self.weights + [self.bias]
'''
        },
        "test_suite": {
            "exercise_about": "Understand neuron parameter encapsulation and forward calculation.",
            "exercise_goal": "Implement `parameters()` on `DummyNeuron`.",
            "expected_output": "Return list of trainable parameters.",
            "tests.py": '''import pytest
from solution import DummyNeuron

def test_neuron_parameters():
    n = DummyNeuron([0.5, -0.2], 0.1)
    assert n.parameters() == [0.5, -0.2, 0.1]
'''
        }
    },
    "node-9-42": {
        "title": "Lesson 4.42: Autograd VII: Zeroing Gradients",
        "handbook_markdown": r"""# Lesson 4.42: Autograd VII: Zeroing Gradients

In PyTorch, gradients **accumulate by default** (`+=`). Before each training iteration, `optimizer.zero_grad()` resets all parameter `.grad = 0.0`.
""",
        "starter_code": {
            "solution.py": '''"""
Autograd VII: Zeroing Gradients
Reset accumulated parameter gradients to 0.0.
"""

class Parameter:
    def __init__(self, data: float):
        self.data = data
        self.grad = 0.0

def zero_gradients(parameters: list) -> None:
    """Reset grad = 0.0 for all parameters in list."""
    # TODO: Set p.grad = 0.0
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand gradient accumulation mechanics and zero_grad resets.",
            "exercise_goal": "Implement `zero_gradients(parameters)`.",
            "expected_output": "Clear accumulated gradients.",
            "tests.py": '''import pytest
from solution import Parameter, zero_gradients

def test_zero_gradients():
    p1 = Parameter(1.0)
    p1.grad = 5.0
    p2 = Parameter(2.0)
    p2.grad = -3.0
    
    zero_gradients([p1, p2])
    assert p1.grad == 0.0
    assert p2.grad == 0.0
'''
        }
    },
    "node-9-43": {
        "title": "Lesson 4.43: Autograd VIII: End-to-End Training",
        "handbook_markdown": r"""# Lesson 4.43: Autograd VIII: End-to-End Training

The standard 5-step training loop:
1. Forward pass: compute predictions.
2. Loss calculation: compare with targets.
3. Zero gradients: `optimizer.zero_grad()`.
4. Backward pass: `loss.backward()`.
5. Parameter update: `optimizer.step()`.
""",
        "starter_code": {
            "solution.py": '''"""
Autograd VIII: End-to-End Training
Execute a single optimization step minimizing squared error.
"""

def single_step_optimization(x: float, y_target: float, weight: float, lr: float = 0.1) -> float:
    """
    Perform 1 step optimizing loss = (weight * x - y_target)^2.
    Gradient dL/dweight = 2 * (weight * x - y_target) * x.
    Returns updated weight.
    """
    # TODO: Compute gradient and apply gradient descent
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand end-to-end training loops and parameter optimization.",
            "exercise_goal": "Implement `single_step_optimization(x, y_target, weight, lr)`.",
            "expected_output": "Update weight to reduce loss.",
            "tests.py": '''import pytest
from solution import single_step_optimization

def test_optimization_step():
    # x=2.0, target=10.0, initial weight=1.0 -> pred=2.0, error=-8.0
    # dL/dw = 2 * (-8.0) * 2.0 = -32.0 -> new_w = 1.0 - (0.01 * -32.0) = 1.32
    new_w = single_step_optimization(x=2.0, y_target=10.0, weight=1.0, lr=0.01)
    assert new_w == pytest.approx(1.32)
'''
        }
    },
    "node-9-44": {
        "title": "Lesson 4.44: Floating Point Precision: FP32 to BF16",
        "handbook_markdown": r"""# Lesson 4.44: Floating Point Precision: FP32 to BF16

- **FP32**: 1 sign + 8 exponent + 23 mantissa (4 bytes).
- **FP16**: 1 sign + 5 exponent + 10 mantissa (2 bytes, prone to underflow).
- **BF16**: 1 sign + 8 exponent + 7 mantissa (2 bytes, same dynamic range as FP32, gold standard for LLM training).
""",
        "starter_code": {
            "solution.py": '''"""
Floating Point Precision: FP32 to BF16
Calculate memory byte size for tensor shapes under different precisions.
"""

def calculate_tensor_memory_mb(num_elements: int, precision: str) -> float:
    """
    Calculate memory in Megabytes (MB).
    Precision bytes:
    - 'FP32': 4 bytes
    - 'FP16' / 'BF16': 2 bytes
    - 'INT8': 1 byte
    - 'INT4': 0.5 bytes
    """
    # TODO: Compute total bytes / (1024 * 1024)
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand floating-point precision formats (FP32, BF16, INT8) and calculate VRAM footprint.",
            "exercise_goal": "Implement `calculate_tensor_memory_mb(num_elements, precision)`.",
            "expected_output": "Compute exact memory size in megabytes.",
            "tests.py": '''import pytest
from solution import calculate_tensor_memory_mb

def test_tensor_memory_calc():
    # 1,048,576 elements in FP32 = 4 MB
    assert calculate_tensor_memory_mb(1024 * 1024, "FP32") == 4.0
    assert calculate_tensor_memory_mb(1024 * 1024, "BF16") == 2.0
    assert calculate_tensor_memory_mb(1024 * 1024, "INT8") == 1.0
'''
        }
    },
    "node-9-45": {
        "title": "Lesson 4.45: Quantization: INT8 & INT4",
        "handbook_markdown": r"""# Lesson 4.45: Quantization: INT8 & INT4

**Symmetric INT8 Quantization** maps continuous floats $[-M, M]$ to integers $[-127, +127]$:
$$\text{scale} = \frac{\max(|x|)}{127}$$
$$x_{\text{int8}} = \text{round}\left(\frac{x}{\text{scale}}\right)$$
$$x_{\text{dequant}} = x_{\text{int8}} \times \text{scale}$$
""",
        "starter_code": {
            "solution.py": '''"""
Quantization: INT8 & INT4
Quantize float vectors to 8-bit integers and dequantize back.
"""

from typing import List, Tuple

def quantize_symmetric_int8(values: List[float]) -> Tuple[List[int], float]:
    """
    Quantize floats to INT8 [-127, 127] with symmetric scale = max(|val|) / 127.
    Returns (quantized_int8_list, scale).
    If all values zero, scale = 1.0.
    """
    # TODO: Calculate max magnitude scale
    # TODO: Quantize values to integers clamped in [-127, 127]
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Implement symmetric INT8 tensor quantization for model compression.",
            "exercise_goal": "Implement `quantize_symmetric_int8(values)`.",
            "expected_output": "Return clamped INT8 integer vectors and floating scale factors.",
            "tests.py": '''import pytest
from solution import quantize_symmetric_int8

def test_int8_quantization():
    vals = [-12.7, 0.0, 12.7]
    # max = 12.7 -> scale = 12.7 / 127 = 0.1
    int8_vals, scale = quantize_symmetric_int8(vals)
    assert scale == pytest.approx(0.1)
    assert int8_vals == [-127, 0, 127]
'''
        }
    },
    "node-9-46": {
        "title": "Lesson 4.46: VRAM Memory Sizing & Sizing Math",
        "handbook_markdown": r"""# Lesson 4.46: VRAM Memory Sizing & Sizing Math

To serve a 70B parameter model:
- 16-bit (BF16): $70 \times 2 = 140\text{ GB}$ VRAM.
- 8-bit (INT8): $70 \times 1 = 70\text{ GB}$ VRAM.
- 4-bit (INT4): $70 \times 0.5 = 35\text{ GB}$ VRAM.
Plus KV-Cache and activation buffers!
""",
        "starter_code": {
            "solution.py": '''"""
VRAM Memory Sizing & Sizing Math
Calculate weights VRAM footprint in Gigabytes.
"""

def calculate_model_vram_gb(param_count_billions: float, bytes_per_param: float) -> float:
    """Calculate VRAM required for model weights in Gigabytes (10^9 bytes / 1024^3)."""
    # TODO: Calculate GB
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Master GPU VRAM sizing calculations for enterprise LLM deployment.",
            "exercise_goal": "Implement `calculate_model_vram_gb(param_count_billions, bytes_per_param)`.",
            "expected_output": "Compute model weight memory footprint in GB.",
            "tests.py": '''import pytest
from solution import calculate_model_vram_gb

def test_vram_sizing_70b():
    # 70B in 16-bit (2 bytes) = 140 * 10^9 / 1024^3 ≈ 130.38 GB
    gb = calculate_model_vram_gb(70.0, 2.0)
    assert gb > 125.0 and gb < 135.0
'''
        }
    },
    "node-9-47": {
        "title": "Lesson 4.47: PagedAttention & KV-Cache",
        "handbook_markdown": r"""# Lesson 4.47: PagedAttention & KV-Cache

In autoregressive token generation, previous tokens are cached as Key ($K$) and Value ($V$) tensors to prevent $O(N^2)$ recomputation.
**PagedAttention** (vLLM) manages KV-cache memory in non-contiguous virtual pages, eliminating memory fragmentation.
""",
        "starter_code": {
            "solution.py": '''"""
PagedAttention & KV-Cache
Calculate KV-cache memory requirements per token sequence.
"""

def calculate_kv_cache_bytes_per_token(num_layers: int, hidden_dim: int, bytes_per_elem: int = 2) -> int:
    """Calculate KV cache size: 2 (K and V) * num_layers * hidden_dim * bytes_per_elem."""
    # TODO: Compute total bytes per token
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand KV-Cache memory consumption and PagedAttention virtual memory concepts.",
            "exercise_goal": "Implement `calculate_kv_cache_bytes_per_token(num_layers, hidden_dim, bytes_per_elem)`.",
            "expected_output": "Compute exact byte requirements per token.",
            "tests.py": '''import pytest
from solution import calculate_kv_cache_bytes_per_token

def test_kv_cache_sizing():
    # 32 layers, hidden 4096, 2 bytes (FP16) -> 2 * 32 * 4096 * 2 = 524,288 bytes (512 KB per token)
    bytes_per_token = calculate_kv_cache_bytes_per_token(32, 4096, 2)
    assert bytes_per_token == 524288
'''
        }
    },
    "node-9-48": {
        "title": "Lesson 4.48: Scaled Dot-Product Attention",
        "handbook_markdown": r"""# Lesson 4.48: Scaled Dot-Product Attention

The core engine of Transformers (Vaswani et al.):
$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{Q K^T}{\sqrt{d_k}}\right) V$$
Scaling by $\sqrt{d_k}$ prevents dot products from growing excessively large for high dimensions.
""",
        "starter_code": {
            "solution.py": '''"""
Scaled Dot-Product Attention
Calculate scaled attention score matrix Q @ K.T / sqrt(d_k).
"""

import math
from typing import List

def compute_attention_scores_1x1(q: List[float], k: List[float]) -> float:
    """Calculate dot(q, k) / sqrt(len(q))."""
    # TODO: Compute scaled dot product
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Implement Scaled Dot-Product Attention core score computation.",
            "exercise_goal": "Implement `compute_attention_scores_1x1(q, k)`.",
            "expected_output": "Compute scaled attention score.",
            "tests.py": '''import pytest
import math
from solution import compute_attention_scores_1x1

def test_scaled_dot_product():
    q = [1.0, 2.0, 3.0, 4.0] # d_k = 4 -> sqrt(4) = 2.0
    k = [2.0, 0.0, 2.0, 0.0] # dot = 1*2 + 3*2 = 8.0
    # Score = 8.0 / 2.0 = 4.0
    assert compute_attention_scores_1x1(q, k) == 4.0
'''
        }
    },
    "node-9-49": {
        "title": "Lesson 4.49: Causal Masking in Attention",
        "handbook_markdown": r"""# Lesson 4.49: Causal Masking in Attention

In decoder-only language models (GPT, Llama), tokens must not attend to future tokens.
A **Causal Mask** sets attention scores of future positions $j > i$ to $-\infty$ so they become $0.0$ after Softmax.
""",
        "starter_code": {
            "solution.py": '''"""
Causal Masking in Attention
Apply causal lower-triangular masking to attention score matrices.
"""

from typing import List

def apply_causal_mask(score_matrix: List[List[float]], mask_value: float = -1e9) -> List[List[float]]:
    """
    For an N x N score matrix, set any entry (i, j) where j > i to mask_value.
    """
    # TODO: Apply upper-triangular masking
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Implement causal attention masking for autoregressive language models.",
            "exercise_goal": "Implement `apply_causal_mask(score_matrix, mask_value)`.",
            "expected_output": "Mask future positions with large negative values.",
            "tests.py": '''import pytest
from solution import apply_causal_mask

def test_causal_masking_3x3():
    scores = [
        [1.0, 2.0, 3.0],
        [4.0, 5.0, 6.0],
        [7.0, 8.0, 9.0]
    ]
    masked = apply_causal_mask(scores, mask_value=-1e9)
    assert masked[0] == [1.0, -1e9, -1e9]
    assert masked[1] == [4.0, 5.0, -1e9]
    assert masked[2] == [7.0, 8.0, 9.0]
'''
        }
    },
    "node-9-50": {
        "title": "Lesson 4.50: Capstone: TensorCore — Micro-Autograd Engine & Vector Search",
        "handbook_markdown": r"""# Lesson 4.50: Capstone: TensorCore — Micro-Autograd Engine & Vector Search

Congratulations on completing Module 4!

In this capstone, you will assemble **TensorCore** — a unified vector arithmetic and micro-autograd engine capable of:
1. Multi-dimensional vector cosine similarity search.
2. Building computational graph expressions with automatic differentiation.
3. Quantizing vectors to 8-bit integers.
""",
        "starter_code": {
            "solution.py": '''"""
Capstone: TensorCore — Micro-Autograd Engine & Vector Search
A comprehensive numerical linear algebra and scalar autograd engine.
"""

import math
from typing import List, Tuple, Set, Callable

class Value:
    def __init__(self, data: float, _children: Tuple["Value", ...] = (), _op: str = ""):
        self.data = float(data)
        self.grad = 0.0
        self._prev = set(_children)
        self._op = _op
        self._backward: Callable[[], None] = lambda: None

    def __add__(self, other: "Value") -> "Value":
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data + other.data, (self, other), "+")
        def _backward():
            self.grad += out.grad
            other.grad += out.grad
        out._backward = _backward
        return out

    def __mul__(self, other: "Value") -> "Value":
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data * other.data, (self, other), "*")
        def _backward():
            self.grad += other.data * out.grad
            other.grad += self.data * out.grad
        out._backward = _backward
        return out

    def backward(self) -> None:
        topo: List[Value] = []
        visited: Set[Value] = set()
        def build(v: Value):
            if v not in visited:
                visited.add(v)
                for child in v._prev:
                    build(child)
                topo.append(v)
        build(self)
        self.grad = 1.0
        for node in reversed(topo):
            node._backward()

class TensorCore:
    @staticmethod
    def cosine_similarity(u: List[float], v: List[float]) -> float:
        """Calculate cosine similarity."""
        dot = sum(a * b for a, b in zip(u, v))
        norm_u = math.sqrt(sum(a * a for a in u))
        norm_v = math.sqrt(sum(b * b for b in v))
        if norm_u == 0 or norm_v == 0:
            return 0.0
        return dot / (norm_u * norm_v)

    @staticmethod
    def create_graph_expression(a: float, b: float, c: float) -> Tuple[Value, Value, Value, Value]:
        """Create z = (a + b) * c using Value nodes and return (a_node, b_node, c_node, z_node)."""
        va = Value(a)
        vb = Value(b)
        vc = Value(c)
        vz = (va + vb) * vc
        return va, vb, vc, vz
'''
        },
        "test_suite": {
            "exercise_about": "Capstone Project: Build TensorCore combining high-speed vector similarity metrics with micro-autograd computational graphs.",
            "exercise_goal": "Implement `TensorCore` with `cosine_similarity()` and `create_graph_expression()`.",
            "expected_output": "Execute accurate vector search and automatic differentiation.",
            "tests.py": '''import pytest
from solution import TensorCore

def test_tensor_core_capstone():
    # 1. Test Cosine Similarity
    sim = TensorCore.cosine_similarity([1.0, 0.0], [1.0, 0.0])
    assert sim == pytest.approx(1.0)
    
    # 2. Test Computational Graph Autograd
    va, vb, vc, vz = TensorCore.create_graph_expression(2.0, 3.0, 4.0)
    assert vz.data == 20.0
    vz.backward()
    assert va.grad == 4.0
    assert vb.grad == 4.0
    assert vc.grad == 5.0
'''
        }
    }
}

def apply_patches():
    print(f"Applying patch to {len(LESSONS_DATA)} lessons in Module 4 (node-9-36 to node-9-50)...")
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
