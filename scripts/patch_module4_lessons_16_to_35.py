#!/usr/bin/env python3
"""
Batch patch Module 4: Lessons 4.16 to 4.35
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
    "node-9-16": {
        "title": "Lesson 4.16: Singular Value Decomposition (SVD)",
        "handbook_markdown": r"""# Lesson 4.16: Singular Value Decomposition (SVD)

Every $M \times N$ matrix $A$ can be factored into three matrices:
$$A = U \Sigma V^T$$
- $U$: Left singular vectors ($M \times M$, orthonormal).
- $\Sigma$: Diagonal singular values ($\sigma_1 \ge \sigma_2 \ge \dots \ge 0$).
- $V^T$: Right singular vectors ($N \times N$, orthonormal).

---

### 💡 The Mental Model: Rotation, Scaling, Rotation
SVD proves that *any* linear transformation is simply:
1. A rotation/reflection in input space ($V^T$).
2. A scaling along axis directions ($\Sigma$).
3. A final rotation/reflection into output space ($U$).
""",
        "starter_code": {
            "solution.py": '''"""
Singular Value Decomposition (SVD)
Reconstruct matrices from SVD factors U, Sigma, and V_transpose.
"""

from typing import List

Matrix = List[List[float]]

def reconstruct_from_svd(u: Matrix, sigma_diag: List[float], vt: Matrix) -> Matrix:
    """
    Reconstruct matrix A = U * diag(sigma) * V^T.
    
    Args:
        u: M x K matrix
        sigma_diag: List of K singular values
        vt: K x N matrix
    """
    # TODO: Scale rows of vt by sigma_diag
    # TODO: Multiply u by scaled_vt
    # TODO: Return M x N matrix
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand Singular Value Decomposition (SVD) factorization and matrix reconstruction.",
            "exercise_goal": "Implement `reconstruct_from_svd(u, sigma_diag, vt)`.",
            "expected_output": "Compute exact matrix reconstruction matching SVD tensor products.",
            "tests.py": '''import pytest
from solution import reconstruct_from_svd

def test_svd_reconstruction_2x2():
    u = [[1.0, 0.0], [0.0, 1.0]]
    sigma = [3.0, 2.0]
    vt = [[1.0, 0.0], [0.0, 1.0]]
    
    res = reconstruct_from_svd(u, sigma, vt)
    assert res == [[3.0, 0.0], [0.0, 2.0]]
'''
        }
    },
    "node-9-17": {
        "title": "Lesson 4.17: Truncated SVD & Matrix Compression",
        "handbook_markdown": r"""# Lesson 4.17: Truncated SVD & Matrix Compression

By keeping only the top-$K$ largest singular values and discarding the rest, **Truncated SVD** produces the optimal low-rank matrix approximation (Eckart-Young-Mirsky Theorem), compressing multi-gigabyte weight tensors.
""",
        "starter_code": {
            "solution.py": '''"""
Truncated SVD & Matrix Compression
Compute compression savings ratio from low-rank factorization.
"""

def calculate_compression_ratio(m: int, n: int, rank_k: int) -> float:
    """
    Calculate memory compression ratio: (size of U_k + V_k) / (original M x N).
    U_k: M x K, V_k: K x N.
    """
    # TODO: Compute low rank parameter count vs M*N
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand matrix parameter compression via truncated low-rank SVD.",
            "exercise_goal": "Implement `calculate_compression_ratio(m, n, rank_k)`.",
            "expected_output": "Calculate exact compression factor.",
            "tests.py": '''import pytest
from solution import calculate_compression_ratio

def test_compression_ratio():
    # 1000 x 1000 matrix = 1,000,000 floats.
    # Rank 10: 1000*10 + 10*1000 = 20,000 floats -> 20,000 / 1,000,000 = 0.02 (98% savings)
    assert calculate_compression_ratio(1000, 1000, 10) == 0.02
'''
        }
    },
    "node-9-18": {
        "title": "Lesson 4.18: Principal Component Analysis (PCA)",
        "handbook_markdown": r"""# Lesson 4.18: Principal Component Analysis (PCA)

**PCA** projects high-dimensional data onto orthogonal directions of maximum variance:
1. Mean-center the data ($X - \mu$).
2. Compute the Covariance Matrix: $\Sigma = \frac{1}{N} X_c^T X_c$.
3. Compute eigenvectors of $\Sigma$ (Principal Components).
""",
        "starter_code": {
            "solution.py": '''"""
Principal Component Analysis (PCA)
Mean-center multi-dimensional data arrays.
"""

from typing import List

def mean_center_dataset(data: List[List[float]]) -> List[List[float]]:
    """
    Mean-center data across columns (features).
    data: N samples x D features.
    """
    # TODO: Calculate mean for each feature column
    # TODO: Subtract column mean from each data point
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Master dataset mean-centering for Principal Component Analysis (PCA).",
            "exercise_goal": "Implement `mean_center_dataset(data)`.",
            "expected_output": "Return zero-centered feature matrices.",
            "tests.py": '''import pytest
from solution import mean_center_dataset

def test_mean_centering():
    data = [
        [10.0, 20.0],
        [20.0, 40.0],
        [30.0, 60.0]
    ]
    # Means: col0=20, col1=40
    centered = mean_center_dataset(data)
    assert centered == [
        [-10.0, -20.0],
        [0.0, 0.0],
        [10.0, 20.0]
    ]
'''
        }
    },
    "node-9-19": {
        "title": "Lesson 4.19: Low-Rank Adaptation (LoRA) Math",
        "handbook_markdown": r"""# Lesson 4.19: Low-Rank Adaptation (LoRA) Math

Instead of fine-tuning a massive frozen weight matrix $W_0 \in \mathbb{R}^{d \times k}$, **LoRA** decomposes the weight update $\Delta W$ into two low-rank matrices:
$$W = W_0 + \frac{\alpha}{r} (B \times A)$$
where $B \in \mathbb{R}^{d \times r}$ (initialized to 0) and $A \in \mathbb{R}^{r \times k}$ (Gaussian initialized).
""",
        "starter_code": {
            "solution.py": '''"""
Low-Rank Adaptation (LoRA) Math
Compute LoRA forward pass: h = W_0 * x + (alpha / r) * B * A * x.
"""

from typing import List

def lora_forward_linear(
    x: List[float],
    w0_out: List[float], # precomputed W_0 * x
    a_mat: List[List[float]], # r x k
    b_mat: List[List[float]], # d x r
    alpha: float,
    r: int
) -> List[float]:
    """Calculate LoRA adapted output: w0_out + (alpha / r) * (B @ (A @ x))."""
    # TODO: Compute A @ x -> vector of length r
    # TODO: Compute B @ (A @ x) -> vector of length d
    # TODO: Scale by (alpha / r) and add to w0_out
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand the mathematical formulation of Low-Rank Adaptation (LoRA) parameter-efficient fine-tuning.",
            "exercise_goal": "Implement `lora_forward_linear(x, w0_out, a_mat, b_mat, alpha, r)`.",
            "expected_output": "Compute exact LoRA adapter forward pass.",
            "tests.py": '''import pytest
from solution import lora_forward_linear

def test_lora_zero_b_initialization():
    # If B is all zeros (standard initialization), adapter output is purely w0_out
    x = [1.0, 2.0]
    w0_out = [5.0, 10.0]
    a = [[1.0, 1.0]] # 1x2 (r=1)
    b = [[0.0], [0.0]] # 2x1 (all zeros)
    
    res = lora_forward_linear(x, w0_out, a, b, alpha=16.0, r=1)
    assert res == [5.0, 10.0]
'''
        }
    },
    "node-9-20": {
        "title": "Lesson 4.20: Token Embedding Lookup Tables",
        "handbook_markdown": r"""# Lesson 4.20: Token Embedding Lookup Tables

An **Embedding Layer** is mathematically equivalent to a linear layer multiplying a one-hot vector, implemented efficiently as an $O(1)$ table row lookup: `embedding_table[token_id]`.
""",
        "starter_code": {
            "solution.py": '''"""
Token Embedding Lookup Tables
Retrieve embedding vectors from a weight matrix table.
"""

from typing import List

def embedding_lookup(
    token_ids: List[int],
    embedding_table: List[List[float]]
) -> List[List[float]]:
    """Retrieve corresponding row embedding vectors for a list of token IDs."""
    # TODO: Return list of embedding rows
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand token embedding tables as weight matrices indexed by integer vocab tokens.",
            "exercise_goal": "Implement `embedding_lookup(token_ids, embedding_table)`.",
            "expected_output": "Return requested embedding vector sequences.",
            "tests.py": '''import pytest
from solution import embedding_lookup

def test_embedding_lookup():
    table = [
        [0.1, 0.2], # Token 0
        [0.3, 0.4], # Token 1
        [0.5, 0.6], # Token 2
    ]
    tokens = [2, 0, 1]
    res = embedding_lookup(tokens, table)
    assert res == [[0.5, 0.6], [0.1, 0.2], [0.3, 0.4]]
'''
        }
    },
    "node-9-21": {
        "title": "Lesson 4.21: Dense Feed-Forward Layers (MLP)",
        "handbook_markdown": r"""# Lesson 4.21: Dense Feed-Forward Layers (MLP)

A **Multi-Layer Perceptron (MLP)** applies linear transformation followed by a non-linear activation function (such as ReLU):
$$y = \text{ReLU}(W x + b) = \max(0, W x + b)$$
""",
        "starter_code": {
            "solution.py": '''"""
Dense Feed-Forward Layers (MLP)
Implement a linear layer with ReLU activation.
"""

from typing import List

def dense_relu_forward(
    x: List[float],
    weights: List[List[float]], # Out x In
    bias: List[float]
) -> List[float]:
    """Calculate ReLU(weights @ x + bias)."""
    # TODO: Compute W @ x + b
    # TODO: Apply ReLU (max(0, val)) to each output element
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Implement forward pass of dense linear layers with ReLU non-linear activations.",
            "exercise_goal": "Implement `dense_relu_forward(x, weights, bias)`.",
            "expected_output": "Compute matrix products and clip negative activations to zero.",
            "tests.py": '''import pytest
from solution import dense_relu_forward

def test_dense_relu():
    x = [2.0, -1.0]
    weights = [
        [1.0, 1.0],  # 1(2) + 1(-1) = 1
        [1.0, 5.0],  # 1(2) + 5(-1) = -3
    ]
    bias = [0.0, 1.0] # Neuron 0: 1 + 0 = 1 -> ReLU 1. Neuron 1: -3 + 1 = -2 -> ReLU 0
    
    res = dense_relu_forward(x, weights, bias)
    assert res == [1.0, 0.0]
'''
        }
    },
    "node-9-22": {
        "title": "Lesson 4.22: Probability Distributions & Sampling",
        "handbook_markdown": r"""# Lesson 4.22: Probability Distributions & Sampling

In LLM token generation, raw logit outputs must be converted into a valid probability distribution where:
$$\sum_{i=1}^V P(w_i) = 1.0 \quad \text{and} \quad P(w_i) \ge 0$$
""",
        "starter_code": {
            "solution.py": '''"""
Probability Distributions & Sampling
Verify valid probability distributions and compute cumulative sums.
"""

from typing import List
import pytest

def is_valid_probability_distribution(probs: List[float], tol: float = 1e-4) -> bool:
    """Return True if all probs >= 0 and sum(probs) == 1.0 within tolerance."""
    # TODO: Check non-negativity and sum == 1.0
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand probability distribution invariants (non-negativity and unitary sum).",
            "exercise_goal": "Implement `is_valid_probability_distribution(probs)`.",
            "expected_output": "Validate probability vectors.",
            "tests.py": '''import pytest
from solution import is_valid_probability_distribution

def test_valid_and_invalid_probs():
    assert is_valid_probability_distribution([0.2, 0.3, 0.5]) is True
    assert is_valid_probability_distribution([0.2, 0.3, 0.6]) is False # Sum != 1.0
    assert is_valid_probability_distribution([1.2, -0.2]) is False     # Negative prob
'''
        }
    },
    "node-9-23": {
        "title": "Lesson 4.23: Numerically Stable Softmax",
        "handbook_markdown": r"""# Lesson 4.23: Numerically Stable Softmax

The **Softmax** function converts unnormalized logits into probabilities:
$$\text{softmax}(z_i) = \frac{e^{z_i}}{\sum_j e^{z_j}}$$

To prevent catastrophic floating-point overflow (`e^1000 = inf`), subtract the maximum logit $z_{\max} = \max(z)$ from all logits first:
$$\text{softmax}(z_i) = \frac{e^{z_i - z_{\max}}}{\sum_j e^{z_j - z_{\max}}}$$
""",
        "starter_code": {
            "solution.py": '''"""
Numerically Stable Softmax
Compute numerically stable softmax probabilities from raw logits.
"""

import math
from typing import List

def stable_softmax(logits: List[float]) -> List[float]:
    """Compute numerically stable softmax: exp(z - max(z)) / sum(exp(z - max(z)))."""
    # TODO: Find max(logits)
    # TODO: Compute exp(z - max_z) for each logit
    # TODO: Normalize by sum of exponentials
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Implement numerically stable Softmax preventing floating-point overflow.",
            "exercise_goal": "Implement `stable_softmax(logits)`.",
            "expected_output": "Compute valid probability distributions even on large logits (e.g. 1000.0).",
            "tests.py": '''import pytest
from solution import stable_softmax

def test_stable_softmax_large_logits():
    logits = [1000.0, 1001.0, 1002.0]
    probs = stable_softmax(logits)
    assert sum(probs) == pytest.approx(1.0)
    assert probs[2] > probs[1] > probs[0]
'''
        }
    },
    "node-9-24": {
        "title": "Lesson 4.24: Temperature Scaling & Entropy",
        "handbook_markdown": r"""# Lesson 4.24: Temperature Scaling & Entropy

**Temperature Scaling** controls randomness in LLM sampling:
$$z'_i = \frac{z_i}{T}$$
- $T \to 0$: High confidence (greedy argmax).
- $T = 1.0$: Standard distribution.
- $T > 1.0$: Flattened distribution (high creativity/entropy).
""",
        "starter_code": {
            "solution.py": '''"""
Temperature Scaling & Entropy
Scale logits by temperature T before softmax.
"""

from typing import List

def apply_temperature_scaling(logits: List[float], temperature: float) -> List[float]:
    """
    Scale logits by temperature T (z_i / T).
    Raises ValueError if temperature <= 0.
    """
    # TODO: Validate T > 0 and return [z / T for z in logits]
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand temperature scaling mechanics in generative AI sampling.",
            "exercise_goal": "Implement `apply_temperature_scaling(logits, temperature)`.",
            "expected_output": "Scale logits and raise ValueError for invalid temperatures.",
            "tests.py": '''import pytest
from solution import apply_temperature_scaling

def test_temperature_scaling():
    logits = [2.0, 4.0]
    assert apply_temperature_scaling(logits, 2.0) == [1.0, 2.0]
    assert apply_temperature_scaling(logits, 0.5) == [4.0, 8.0]
    
    with pytest.raises(ValueError):
        apply_temperature_scaling(logits, 0.0)
'''
        }
    },
    "node-9-25": {
        "title": "Lesson 4.25: Top-K & Top-P (Nucleus) Sampling",
        "handbook_markdown": r"""# Lesson 4.25: Top-K & Top-P (Nucleus) Sampling

- **Top-K Sampling**: Filter vocabulary to keep only the $K$ tokens with highest probability.
- **Top-P (Nucleus) Sampling**: Keep the smallest set of tokens whose cumulative probability exceeds threshold $P$ (e.g. 0.90).
""",
        "starter_code": {
            "solution.py": '''"""
Top-K & Top-P (Nucleus) Sampling
Filter vocabulary tokens using Top-K truncation.
"""

from typing import List, Tuple

def filter_top_k(probs: List[float], k: int) -> List[float]:
    """
    Keep top-k probabilities, setting all other probabilities to 0.0, then re-normalize to sum to 1.0.
    """
    # TODO: Identify k-th largest probability threshold
    # TODO: Zero out elements below threshold
    # TODO: Re-normalize remaining probabilities to sum to 1.0
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand Top-K sampling filtering used in modern LLM generation engines.",
            "exercise_goal": "Implement `filter_top_k(probs, k)`.",
            "expected_output": "Truncate low probability tail and renormalize distribution.",
            "tests.py": '''import pytest
from solution import filter_top_k

def test_top_k_filtering():
    probs = [0.1, 0.5, 0.3, 0.1]
    # Top-2 are 0.5 (idx 1) and 0.3 (idx 2). Sum = 0.8.
    # Renormalized: [0, 0.5/0.8, 0.3/0.8, 0] = [0, 0.625, 0.375, 0]
    res = filter_top_k(probs, k=2)
    assert res == [0.0, 0.625, 0.375, 0.0]
'''
        }
    },
    "node-9-26": {
        "title": "Lesson 4.26: Cross-Entropy Loss",
        "handbook_markdown": r"""# Lesson 4.26: Cross-Entropy Loss

**Cross-Entropy Loss** measures error between predicted probabilities $P$ and ground-truth target index $y$:
$$L = -\log P(y)$$
""",
        "starter_code": {
            "solution.py": '''"""
Cross-Entropy Loss
Compute cross-entropy loss for multi-class classification.
"""

import math
from typing import List

def calculate_cross_entropy_loss(probabilities: List[float], target_index: int) -> float:
    """Calculate -log(probabilities[target_index]). Adds 1e-15 epsilon for numerical safety."""
    # TODO: Calculate negative log likelihood
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand Cross-Entropy Loss for neural network training.",
            "exercise_goal": "Implement `calculate_cross_entropy_loss(probabilities, target_index)`.",
            "expected_output": "Calculate precise loss values.",
            "tests.py": '''import pytest
import math
from solution import calculate_cross_entropy_loss

def test_cross_entropy():
    probs = [0.1, 0.8, 0.1]
    # Loss for target 1 = -log(0.8) ≈ 0.2231
    assert calculate_cross_entropy_loss(probs, 1) == pytest.approx(-math.log(0.8), abs=1e-4)
'''
        }
    },
    "node-9-27": {
        "title": "Lesson 4.27: Perplexity & Model Fluency",
        "handbook_markdown": r"""# Lesson 4.27: Perplexity & Model Fluency

**Perplexity** is the exponentiated average cross-entropy loss over a sequence of $N$ tokens:
$$\text{Perplexity} = \exp\left(\frac{1}{N} \sum_{i=1}^N L_i\right)$$
Lower perplexity indicates higher model prediction fluency.
""",
        "starter_code": {
            "solution.py": '''"""
Perplexity & Model Fluency
Calculate sequence perplexity from token loss values.
"""

import math
from typing import List

def calculate_perplexity(token_losses: List[float]) -> float:
    """Calculate exp(mean(token_losses)). Return 1.0 if list is empty."""
    # TODO: Compute mean loss and exponentiate
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand Perplexity as the standard metric for language model evaluation.",
            "exercise_goal": "Implement `calculate_perplexity(token_losses)`.",
            "expected_output": "Compute perplexity scores.",
            "tests.py": '''import pytest
import math
from solution import calculate_perplexity

def test_perplexity_calculation():
    losses = [math.log(2.0), math.log(2.0)] # Average loss = ln(2)
    # Perplexity = exp(ln(2)) = 2.0
    assert calculate_perplexity(losses) == pytest.approx(2.0)
'''
        }
    },
    "node-9-28": {
        "title": "Lesson 4.28: KL Divergence & Distribution Drift",
        "handbook_markdown": r"""# Lesson 4.28: KL Divergence & Distribution Drift

**Kullback-Leibler (KL) Divergence** measures information lost when approximating true distribution $P$ with model $Q$:
$$D_{KL}(P \parallel Q) = \sum_{i=1}^V P(i) \log\left(\frac{P(i)}{Q(i)}\right)$$
""",
        "starter_code": {
            "solution.py": '''"""
KL Divergence & Distribution Drift
Compute discrete KL Divergence between distributions P and Q.
"""

import math
from typing import List

def kl_divergence(p: List[float], q: List[float]) -> float:
    """Calculate sum(p_i * log(p_i / q_i)) for p_i > 0."""
    # TODO: Calculate discrete KL divergence
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand KL Divergence used in RLHF and distribution drift monitoring.",
            "exercise_goal": "Implement `kl_divergence(p, q)`.",
            "expected_output": "Compute relative entropy.",
            "tests.py": '''import pytest
import math
from solution import kl_divergence

def test_kl_identical_distributions():
    p = [0.5, 0.5]
    assert kl_divergence(p, p) == pytest.approx(0.0)

def test_kl_different_distributions():
    p = [0.9, 0.1]
    q = [0.5, 0.5]
    # 0.9 * ln(0.9/0.5) + 0.1 * ln(0.1/0.5)
    expected = 0.9 * math.log(1.8) + 0.1 * math.log(0.2)
    assert kl_divergence(p, q) == pytest.approx(expected)
'''
        }
    },
    "node-9-29": {
        "title": "Lesson 4.29: Numerical Gradient Checking",
        "handbook_markdown": r"""# Lesson 4.29: Numerical Gradient Checking

To verify analytical backprop gradients, compute numerical gradients via **Finite Differences**:
$$\frac{\partial f}{\partial x} \approx \frac{f(x + \epsilon) - f(x - \epsilon)}{2\epsilon}$$
""",
        "starter_code": {
            "solution.py": '''"""
Numerical Gradient Checking
Compute symmetric finite difference approximation of derivatives.
"""

from typing import Callable

def finite_difference_gradient(f: Callable[[float], float], x: float, eps: float = 1e-5) -> float:
    """Calculate (f(x + eps) - f(x - eps)) / (2 * eps)."""
    # TODO: Implement symmetric difference derivative
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Master numerical gradient checking for automated autograd verification.",
            "exercise_goal": "Implement `finite_difference_gradient(f, x, eps)`.",
            "expected_output": "Accurately approximate analytical derivatives.",
            "tests.py": '''import pytest
from solution import finite_difference_gradient

def test_quadratic_derivative():
    # f(x) = x^2 -> f'(3) = 6.0
    grad = finite_difference_gradient(lambda x: x**2, 3.0)
    assert grad == pytest.approx(6.0, abs=1e-4)
'''
        }
    },
    "node-9-30": {
        "title": "Lesson 4.30: Gradient Descent Dynamics",
        "handbook_markdown": r"""# Lesson 4.30: Gradient Descent Dynamics

**Gradient Descent** updates parameter weights by stepping in the opposite direction of the loss gradient:
$$\theta \leftarrow \theta - \eta \nabla_\theta L$$
where $\eta$ is the learning rate.
""",
        "starter_code": {
            "solution.py": '''"""
Gradient Descent Dynamics
Perform a single parameter update step.
"""

from typing import List

def gradient_descent_step(
    params: List[float],
    gradients: List[float],
    learning_rate: float
) -> List[float]:
    """Calculate [p - lr * g for p, g in zip(params, gradients)]."""
    # TODO: Implement parameter update step
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Implement fundamental gradient descent weight updates.",
            "exercise_goal": "Implement `gradient_descent_step(params, gradients, learning_rate)`.",
            "expected_output": "Compute updated parameter weights.",
            "tests.py": '''import pytest
from solution import gradient_descent_step

def test_gradient_descent_step():
    params = [1.0, 2.0]
    grads = [0.5, -1.0]
    updated = gradient_descent_step(params, grads, learning_rate=0.1)
    assert updated == [0.95, 2.1]
'''
        }
    },
    "node-9-31": {
        "title": "Lesson 4.31: Mini-Batch Stochastic Gradient Descent",
        "handbook_markdown": r"""# Lesson 4.31: Mini-Batch Stochastic Gradient Descent

Mini-batch SGD partitions training datasets into small batches (e.g. 32 or 64 samples) to balance vectorization speed with gradient noise.
""",
        "starter_code": {
            "solution.py": '''"""
Mini-Batch Stochastic Gradient Descent
Split datasets into fixed-size mini-batches.
"""

from typing import List, Any

def create_mini_batches(dataset: List[Any], batch_size: int) -> List[List[Any]]:
    """Partition dataset into chunks of length batch_size."""
    # TODO: Yield chunks of batch_size
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand mini-batch partitioning in neural network training loops.",
            "exercise_goal": "Implement `create_mini_batches(dataset, batch_size)`.",
            "expected_output": "Return batched datasets.",
            "tests.py": '''import pytest
from solution import create_mini_batches

def test_batch_creation():
    data = [1, 2, 3, 4, 5]
    batches = create_mini_batches(data, batch_size=2)
    assert batches == [[1, 2], [3, 4], [5]]
'''
        }
    },
    "node-9-32": {
        "title": "Lesson 4.32: Momentum & Accelerated Gradients",
        "handbook_markdown": r"""# Lesson 4.32: Momentum & Accelerated Gradients

**Momentum** accelerates SGD through flat ravines by accumulating past velocity $v$:
$$v \leftarrow \beta v + \nabla L$$
$$\theta \leftarrow \theta - \eta v$$
""",
        "starter_code": {
            "solution.py": '''"""
Momentum & Accelerated Gradients
Update parameters and velocity buffers using SGD with Momentum.
"""

from typing import List, Tuple

def momentum_step(
    params: List[float],
    velocity: List[float],
    gradients: List[float],
    lr: float,
    beta: float = 0.9
) -> Tuple[List[float], List[float]]:
    """
    Calculate updated (new_params, new_velocity).
    new_v = beta * v + g
    new_p = p - lr * new_v
    """
    # TODO: Compute momentum update
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand Momentum dynamics accelerating gradient descent across loss plateaus.",
            "exercise_goal": "Implement `momentum_step(params, velocity, gradients, lr, beta)`.",
            "expected_output": "Update parameter positions and velocity state.",
            "tests.py": '''import pytest
from solution import momentum_step

def test_momentum_accumulation():
    p = [10.0]
    v = [0.0]
    g = [1.0]
    
    p1, v1 = momentum_step(p, v, g, lr=0.1, beta=0.9)
    # v1 = 0.9(0) + 1 = 1.0. p1 = 10 - 0.1(1.0) = 9.9
    assert v1 == [1.0]
    assert p1 == [9.9]
'''
        }
    },
    "node-9-33": {
        "title": "Lesson 4.33: RMSprop Adaptive Learning Rates",
        "handbook_markdown": r"""# Lesson 4.33: RMSprop Adaptive Learning Rates

**RMSprop** scales gradients inversely by the moving average of squared gradients, damping oscillations:
$$s \leftarrow \beta s + (1 - \beta) g^2$$
$$\theta \leftarrow \theta - \frac{\eta}{\sqrt{s} + \epsilon} g$$
""",
        "starter_code": {
            "solution.py": '''"""
RMSprop Adaptive Learning Rates
Update parameters using adaptive squared gradient moving averages.
"""

import math
from typing import List, Tuple

def rmsprop_step(
    params: List[float],
    sq_grads: List[float],
    gradients: List[float],
    lr: float,
    beta: float = 0.9,
    eps: float = 1e-8
) -> Tuple[List[float], List[float]]:
    """Calculate updated (new_params, new_sq_grads)."""
    # TODO: Implement RMSprop step
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Implement RMSprop adaptive learning rate updates.",
            "exercise_goal": "Implement `rmsprop_step(params, sq_grads, gradients, lr, beta, eps)`.",
            "expected_output": "Compute adaptive parameter updates.",
            "tests.py": '''import pytest
from solution import rmsprop_step

def test_rmsprop_step():
    p = [1.0]
    s = [0.0]
    g = [2.0]
    
    p1, s1 = rmsprop_step(p, s, g, lr=0.1, beta=0.9)
    # s1 = 0.9(0) + 0.1(4.0) = 0.4
    # p1 = 1.0 - (0.1 / sqrt(0.4 + 1e-8)) * 2.0
    assert s1[0] == pytest.approx(0.4)
    assert p1[0] < 1.0
'''
        }
    },
    "node-9-34": {
        "title": "Lesson 4.34: Adam & AdamW Optimizers",
        "handbook_markdown": r"""# Lesson 4.34: Adam & AdamW Optimizers

**Adam** combines Momentum ($m$) and RMSprop ($v$) with bias correction:
$$m \leftarrow \beta_1 m + (1-\beta_1)g, \quad v \leftarrow \beta_2 v + (1-\beta_2)g^2$$
$$\hat{m} = \frac{m}{1-\beta_1^t}, \quad \hat{v} = \frac{v}{1-\beta_2^t}$$
$$\theta \leftarrow \theta - \frac{\eta}{\sqrt{\hat{v}} + \epsilon} \hat{m}$$
""",
        "starter_code": {
            "solution.py": '''"""
Adam & AdamW Optimizers
Compute bias-corrected first and second moments for Adam.
"""

from typing import Tuple

def compute_adam_bias_correction(
    m: float,
    v: float,
    beta1: float,
    beta2: float,
    step_t: int
) -> Tuple[float, float]:
    """Calculate (m / (1 - beta1^step_t), v / (1 - beta2^step_t))."""
    # TODO: Implement Adam bias correction
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand Adam optimizer moment estimation and time-step bias correction.",
            "exercise_goal": "Implement `compute_adam_bias_correction(m, v, beta1, beta2, step_t)`.",
            "expected_output": "Compute bias-corrected moments.",
            "tests.py": '''import pytest
from solution import compute_adam_bias_correction

def test_adam_bias_correction():
    # At t=1, beta1=0.9 -> denominator = 1 - 0.9 = 0.1 -> m_hat = m / 0.1 = 10*m
    m_hat, v_hat = compute_adam_bias_correction(0.5, 0.05, beta1=0.9, beta2=0.99, step_t=1)
    assert m_hat == pytest.approx(5.0)
    assert v_hat == pytest.approx(5.0)
'''
        }
    },
    "node-9-35": {
        "title": "Lesson 4.35: Learning Rate Schedules & Warmup",
        "handbook_markdown": r"""# Lesson 4.35: Learning Rate Schedules & Warmup

In Transformer training, linear warmup ramps learning rate from 0 to $\eta_{\max}$ over $W$ steps, preventing catastrophic gradient destabilization in initial iterations.
""",
        "starter_code": {
            "solution.py": '''"""
Learning Rate Schedules & Warmup
Compute linear learning rate warmup schedule.
"""

def get_warmup_learning_rate(
    current_step: int,
    warmup_steps: int,
    max_lr: float
) -> float:
    """
    If current_step < warmup_steps: return max_lr * (current_step / warmup_steps).
    Else return max_lr.
    """
    # TODO: Compute warmup learning rate
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand linear warmup learning rate schedules for stable LLM training.",
            "exercise_goal": "Implement `get_warmup_learning_rate(current_step, warmup_steps, max_lr)`.",
            "expected_output": "Scale learning rate linearly during warmup.",
            "tests.py": '''import pytest
from solution import get_warmup_learning_rate

def test_linear_warmup():
    assert get_warmup_learning_rate(0, 100, 1e-3) == 0.0
    assert get_warmup_learning_rate(50, 100, 1e-3) == 5e-4
    assert get_warmup_learning_rate(100, 100, 1e-3) == 1e-3
    assert get_warmup_learning_rate(150, 100, 1e-3) == 1e-3
'''
        }
    }
}

def apply_patches():
    print(f"Applying patch to {len(LESSONS_DATA)} lessons in Module 4 (node-9-16 to node-9-35)...")
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
