#!/usr/bin/env python3
"""
Batch patch Module 4: Vector Embeddings, Tensors & Autograd (Lessons 4.1 to 4.15)
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
    "node-9-1": {
        "title": "Lesson 4.1: Vector Geometry & Normalization",
        "handbook_markdown": r"""# Lesson 4.1: Vector Geometry & Normalization

In AI embeddings and linear algebra, a **Vector** represents a direction and magnitude in multi-dimensional space.

**L2 Normalization (Unit Vector)** scales any vector so its length (Euclidean norm) is exactly $1.0$:
$$\|v\|_2 = \sqrt{\sum_{i=1}^n v_i^2}$$
$$\hat{v} = \frac{v}{\|v\|_2}$$

---

### 💡 The Mental Model: The Compass Needle
Imagine arrows of different lengths pointing in various directions.
Normalizing vectors trims or stretches every arrow so it touches the outer ring of the compass unit circle ($r=1$), preserving **pure direction** regardless of magnitude.

---

### 🔍 Deep Dive: Unit Vectors in AI Search
When embeddings are normalized to unit length, computing cosine similarity reduces to a blazing-fast dot product: $\cos(\theta) = \hat{u} \cdot \hat{v}$.
""",
        "starter_code": {
            "solution.py": '''"""
Vector Geometry & Normalization
Compute vector Euclidean magnitude and normalize vectors to unit length.
"""

import math
from typing import List

def vector_magnitude(v: List[float]) -> float:
    """Calculate Euclidean L2 norm: sqrt(sum(x^2))."""
    # TODO: Implement L2 magnitude calculation
    pass

def normalize_vector(v: List[float]) -> List[float]:
    """
    Normalize vector v to unit length (L2 norm = 1.0).
    If v is the zero vector, return a copy of v unchanged.
    """
    # TODO: Compute magnitude; if zero return v, else return [x / mag for x in v]
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand vector geometry and implement L2 normalization to project multi-dimensional vectors onto the unit hypersphere.",
            "exercise_goal": "Implement `vector_magnitude(v)` and `normalize_vector(v)` in pure Python.",
            "expected_output": "Return correct Euclidean lengths and unit-normalized vectors where length equals 1.0.",
            "tests.py": '''import pytest
import math
from solution import vector_magnitude, normalize_vector

def test_magnitude_calculation():
    assert vector_magnitude([3.0, 4.0]) == 5.0
    assert vector_magnitude([1.0, 2.0, 2.0]) == 3.0
    assert vector_magnitude([0.0, 0.0]) == 0.0

def test_normalize_vector():
    v = [3.0, 4.0]
    unit_v = normalize_vector(v)
    assert unit_v == [0.6, 0.8]
    assert vector_magnitude(unit_v) == pytest.approx(1.0)

def test_zero_vector_normalization():
    assert normalize_vector([0.0, 0.0]) == [0.0, 0.0]
'''
        }
    },
    "node-9-2": {
        "title": "Lesson 4.2: Vector Distance Metrics",
        "handbook_markdown": r"""# Lesson 4.2: Vector Distance Metrics

Measuring distance between embeddings dictates how search engines rank nearest documents:
1. **Euclidean Distance (L2)**: Straight-line distance: $d(u, v) = \sqrt{\sum (u_i - v_i)^2}$.
2. **Manhattan Distance (L1)**: Grid-street walking distance: $d(u, v) = \sum |u_i - v_i|$.
3. **Chebyshev Distance ($L_\infty$)**: Maximum single coordinate delta: $d(u, v) = \max_i |u_i - v_i|$.

---

### 💡 The Mental Model: Traveling Across Manhattan
- **Euclidean (As the crow flies)**: A bird flies straight across buildings.
- **Manhattan (Taxicab)**: A taxi must drive strictly along avenues and cross-streets.
- **Chebyshev (Chess King)**: A king takes the maximum moves along either rank or file.
""",
        "starter_code": {
            "solution.py": '''"""
Vector Distance Metrics
Compute Euclidean (L2), Manhattan (L1), and Chebyshev (L-inf) distance metrics.
"""

import math
from typing import List

def euclidean_distance(u: List[float], v: List[float]) -> float:
    """Compute L2 distance: sqrt(sum((u_i - v_i)^2))."""
    # TODO: Implement Euclidean distance
    pass

def manhattan_distance(u: List[float], v: List[float]) -> float:
    """Compute L1 distance: sum(|u_i - v_i|)."""
    # TODO: Implement Manhattan distance
    pass

def chebyshev_distance(u: List[float], v: List[float]) -> float:
    """Compute L-infinity distance: max(|u_i - v_i|)."""
    # TODO: Implement Chebyshev distance
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Master multi-dimensional distance metrics (L1, L2, Chebyshev) used in vector similarity search engines.",
            "exercise_goal": "Implement `euclidean_distance(u, v)`, `manhattan_distance(u, v)`, and `chebyshev_distance(u, v)`.",
            "expected_output": "Return precise float distance measurements between coordinate pairs.",
            "tests.py": '''import pytest
from solution import euclidean_distance, manhattan_distance, chebyshev_distance

def test_distance_metrics():
    u = [1.0, 2.0, 3.0]
    v = [4.0, 6.0, 3.0]
    # deltas: [3, 4, 0]
    
    assert euclidean_distance(u, v) == 5.0 # sqrt(3^2 + 4^2) = 5
    assert manhattan_distance(u, v) == 7.0 # 3 + 4 + 0 = 7
    assert chebyshev_distance(u, v) == 4.0 # max(3, 4, 0) = 4
'''
        }
    },
    "node-9-3": {
        "title": "Lesson 4.3: Dot Products & Cosine Similarity",
        "handbook_markdown": r"""# Lesson 4.3: Dot Products & Cosine Similarity

The **Dot Product** multiplies corresponding vector elements and sums them:
$$u \cdot v = \sum_{i=1}^n u_i v_i$$

**Cosine Similarity** measures the angle $\theta$ between two vectors, bounded in $[-1.0, +1.0]$:
$$\cos(\theta) = \frac{u \cdot v}{\|u\|_2 \|v\|_2}$$
- $+1.0$: Pointing in the exact same direction (perfect semantic match).
- $0.0$: Orthogonal (perpendicular / unrelated).
- $-1.0$: Opposite direction (diametrically opposed meaning).

---

### 💡 The Mental Model: Flashlight Beams
- Shine two flashlights at the same wall spot $\to \cos(\theta) = 1.0$.
- Shine one flashlight north and one east $\to \cos(\theta) = 0.0$.
""",
        "starter_code": {
            "solution.py": '''"""
Dot Products & Cosine Similarity
Compute vector dot products and cosine semantic similarity scores.
"""

import math
from typing import List

def dot_product(u: List[float], v: List[float]) -> float:
    """Calculate dot product: sum(u_i * v_i)."""
    # TODO: Implement dot product
    pass

def cosine_similarity(u: List[float], v: List[float]) -> float:
    """
    Calculate cosine similarity: (u . v) / (||u|| * ||v||).
    If either vector has zero magnitude, return 0.0.
    """
    # TODO: Implement cosine similarity with zero division guard
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand vector alignment and implement cosine similarity used in modern semantic embedding search.",
            "exercise_goal": "Implement `dot_product(u, v)` and `cosine_similarity(u, v)`.",
            "expected_output": "Return 1.0 for parallel vectors, 0.0 for perpendicular vectors, and handle zero vectors safely.",
            "tests.py": '''import pytest
from solution import dot_product, cosine_similarity

def test_dot_product():
    assert dot_product([1.0, 2.0, 3.0], [4.0, 5.0, 6.0]) == 32.0

def test_cosine_similarity_parallel():
    u = [1.0, 2.0]
    v = [2.0, 4.0] # Same direction, double magnitude
    assert cosine_similarity(u, v) == pytest.approx(1.0)

def test_cosine_similarity_orthogonal():
    u = [1.0, 0.0]
    v = [0.0, 1.0] # Perpendicular
    assert cosine_similarity(u, v) == pytest.approx(0.0)

def test_cosine_similarity_zero_vector():
    assert cosine_similarity([0.0, 0.0], [1.0, 2.0]) == 0.0
'''
        }
    },
    "node-9-4": {
        "title": "Lesson 4.4: The Curse of High Dimensions",
        "handbook_markdown": r"""# Lesson 4.4: The Curse of High Dimensions

In 1,536-dimensional embedding spaces (such as OpenAI `text-embedding-3`), geometric intuition breaks down:
1. **Hypersphere Volume Collapse**: Almost all the volume of a high-dimensional cube is concentrated in its outer shell and corners.
2. **Distance Concentration**: As dimension $D \to \infty$, the distance between the closest pair and furthest pair of random points converges to nearly the same value.
3. **Orthogonality**: Any two random high-dimensional vectors are almost guaranteed to be orthogonal ($\cos(\theta) \approx 0$).

---

### 💡 The Mental Model: The Orange Peel
In a 2D orange (circle), the peel is a thin fraction of the fruit.
In a 1,000-dimensional orange, **99.999% of the orange is peel**, and virtually none is inside!
""",
        "starter_code": {
            "solution.py": '''"""
The Curse of High Dimensions
Demonstrate distance concentration across increasing dimensions.
"""

import math
from typing import List

def calculate_distance_contrast(distances: List[float]) -> float:
    """
    Calculate the relative distance contrast: (d_max - d_min) / d_min.
    If d_min is 0 or distances empty, return 0.0.
    """
    # TODO: Compute distance contrast metric
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand the mathematical effects of high-dimensional geometry (distance concentration and orthogonality).",
            "exercise_goal": "Implement `calculate_distance_contrast(distances)` to quantify distance variance.",
            "expected_output": "Return exact relative spread ratios for distance metric arrays.",
            "tests.py": '''import pytest
from solution import calculate_distance_contrast

def test_distance_contrast():
    distances = [10.0, 12.0, 15.0, 20.0]
    # (20 - 10) / 10 = 1.0
    assert calculate_distance_contrast(distances) == 1.0

def test_flat_contrast():
    distances = [5.0, 5.0, 5.0]
    assert calculate_distance_contrast(distances) == 0.0
'''
        }
    },
    "node-9-5": {
        "title": "Lesson 4.5: K-Nearest Neighbors from Scratch",
        "handbook_markdown": r"""# Lesson 4.5: K-Nearest Neighbors from Scratch

**K-Nearest Neighbors (KNN)** is the core foundation of vector database retrieval: given a query vector $q$, find the $K$ closest vectors in the index based on cosine similarity or Euclidean distance.

---

### 💡 The Mental Model: Asking Your Neighbors
To classify a mystery fruit:
Look at the 3 closest fruits on the table. If 2 are apples and 1 is a pear, vote that the mystery fruit is an apple.
""",
        "starter_code": {
            "solution.py": '''"""
K-Nearest Neighbors from Scratch
Perform brute-force top-K vector search ranking.
"""

from typing import List, Tuple
import math

def knn_search(
    query: List[float],
    database: List[Tuple[str, List[float]]], # (doc_id, vector)
    k: int = 3
) -> List[Tuple[str, float]]:
    """
    Find top-k documents with highest cosine similarity to query vector.

    Returns:
        List of (doc_id, cosine_sim_score) sorted descending by score.
    """
    # TODO: Compute cosine similarity for each document vector
    # TODO: Sort by similarity score descending
    # TODO: Return top-k matches
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Build an exact K-Nearest Neighbors (KNN) vector similarity search engine.",
            "exercise_goal": "Implement `knn_search(query, database, k)` returning the top-k highest similarity document IDs.",
            "expected_output": "Return correctly ranked `(doc_id, similarity)` tuples in descending order.",
            "tests.py": '''import pytest
from solution import knn_search

def test_knn_ranking():
    db = [
        ("doc_ai", [0.9, 0.1]),
        ("doc_db", [0.1, 0.9]),
        ("doc_ml", [0.8, 0.2]),
        ("doc_web", [0.0, 1.0]),
    ]
    query = [1.0, 0.0] # High AI affinity
    
    results = knn_search(query, db, k=2)
    assert len(results) == 2
    assert results[0][0] == "doc_ai"
    assert results[1][0] == "doc_ml"
'''
        }
    },
    "node-9-6": {
        "title": "Lesson 4.6: Vector Projections & Orthogonality",
        "handbook_markdown": r"""# Lesson 4.6: Vector Projections & Orthogonality

The **Vector Projection** of vector $u$ onto vector $v$ finds the component of $u$ that lies directly along the direction of $v$:
$$\text{proj}_v(u) = \frac{u \cdot v}{v \cdot v} v$$

The remainder $u - \text{proj}_v(u)$ is the **Orthogonal Component** (perpendicular to $v$).

---

### 💡 The Mental Model: The Sun's Shadow at Noon
Imagine the sun directly above vector $v$:
The shadow that vector $u$ casts onto the ground line $v$ is the projection $\text{proj}_v(u)$.
""",
        "starter_code": {
            "solution.py": '''"""
Vector Projections & Orthogonality
Calculate vector projections and orthogonal rejections.
"""

from typing import List, Tuple

def project_vector(u: List[float], v: List[float]) -> List[float]:
    """
    Compute vector projection of u onto v: ((u . v) / (v . v)) * v.
    If v is zero vector, return zero vector.
    """
    # TODO: Implement vector projection
    pass

def orthogonal_component(u: List[float], v: List[float]) -> List[float]:
    """Compute orthogonal rejection: u - proj_v(u)."""
    # TODO: Implement orthogonal component
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand vector projections, decomposition, and Gram-Schmidt orthogonalization primitives.",
            "exercise_goal": "Implement `project_vector(u, v)` and `orthogonal_component(u, v)`.",
            "expected_output": "Decompose vectors into parallel and perpendicular components.",
            "tests.py": '''import pytest
from solution import project_vector, orthogonal_component

def test_vector_projection():
    u = [3.0, 4.0]
    v = [1.0, 0.0] # X-axis
    proj = project_vector(u, v)
    assert proj == [3.0, 0.0]
    
    ortho = orthogonal_component(u, v)
    assert ortho == [0.0, 4.0]
'''
        }
    },
    "node-9-7": {
        "title": "Lesson 4.7: Linear Decision Boundaries",
        "handbook_markdown": r"""# Lesson 4.7: Linear Decision Boundaries

A **Hyperplane** partitions vector space into two halves using a weight vector $w$ and bias $b$:
$$f(x) = w \cdot x + b$$
- If $f(x) \ge 0$: Class $+1$.
- If $f(x) < 0$: Class $-1$.

---

### 💡 The Mental Model: The Fence in the Yard
Think of building a straight wooden fence across a pasture:
Sheep stay on the left side of the fence ($f(x) \ge 0$), and cows stay on the right side ($f(x) < 0$).
""",
        "starter_code": {
            "solution.py": '''"""
Linear Decision Boundaries
Classify multi-dimensional points across a linear hyperplane boundary.
"""

from typing import List

def classify_linear_boundary(x: List[float], weights: List[float], bias: float) -> int:
    """
    Calculate dot_product(weights, x) + bias.
    Return +1 if >= 0, else -1.
    """
    # TODO: Implement linear decision function
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand linear classifiers, hyperplanes, and perceptron decision boundaries.",
            "exercise_goal": "Implement `classify_linear_boundary(x, weights, bias)`.",
            "expected_output": "Return +1 or -1 based on which side of the hyperplane the input vector falls.",
            "tests.py": '''import pytest
from solution import classify_linear_boundary

def test_linear_classification():
    weights = [2.0, -1.0] # 2x - y + 1
    bias = 1.0
    
    assert classify_linear_boundary([1.0, 1.0], weights, bias) == 1   # 2(1) - 1(1) + 1 = 2 >= 0 -> +1
    assert classify_linear_boundary([0.0, 5.0], weights, bias) == -1  # 2(0) - 1(5) + 1 = -4 < 0 -> -1
'''
        }
    },
    "node-9-8": {
        "title": "Lesson 4.8: Matrix Multiplication Mechanics",
        "handbook_markdown": r"""# Lesson 4.8: Matrix Multiplication Mechanics

Matrix multiplication $C = A \times B$ computes the dot product of each row of $A$ with each column of $B$:
$$C_{i, j} = \sum_{k=1}^K A_{i, k} B_{k, j}$$
Dimensions: $(M \times K) \times (K \times N) \to (M \times N)$.

---

### 💡 The Mental Model: Batch Processing Orders
- Matrix $A$ ($M$ customers, $K$ items ordered).
- Matrix $B$ ($K$ items, $N$ warehouse price/tax rates).
- Matrix $C$ ($M \times N$ customer bill totals across warehouses).
""",
        "starter_code": {
            "solution.py": '''"""
Matrix Multiplication Mechanics
Multiply 2D matrices using row-column dot products.
"""

from typing import List

Matrix = List[List[float]]

def matrix_multiply(a: Matrix, b: Matrix) -> Matrix:
    """
    Multiply matrix a (M x K) by matrix b (K x N) -> (M x N).
    
    Raises:
        ValueError: If inner dimensions do not match or matrices are empty.
    """
    # TODO: Verify matrix dimensions
    # TODO: Compute dot products for each cell (i, j)
    # TODO: Return result matrix
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Implement fundamental 2D matrix multiplication with strict inner-dimension validation.",
            "exercise_goal": "Implement `matrix_multiply(a, b)` returning the (M x N) product matrix.",
            "expected_output": "Correctly calculate matrix products and raise ValueError on mismatched dimensions.",
            "tests.py": '''import pytest
from solution import matrix_multiply

def test_matrix_multiply_2x2():
    a = [[1.0, 2.0], [3.0, 4.0]]
    b = [[2.0, 0.0], [1.0, 2.0]]
    # [[1*2 + 2*1, 1*0 + 2*2], [3*2 + 4*1, 3*0 + 4*2]] = [[4, 4], [10, 8]]
    assert matrix_multiply(a, b) == [[4.0, 4.0], [10.0, 8.0]]

def test_dimension_mismatch():
    a = [[1.0, 2.0]] # 1x2
    b = [[1.0, 2.0]] # 1x2 (mismatch!)
    with pytest.raises(ValueError):
        matrix_multiply(a, b)
'''
        }
    },
    "node-9-9": {
        "title": "Lesson 4.9: Linear Transformations & Projections",
        "handbook_markdown": r"""# Lesson 4.9: Linear Transformations & Projections

A matrix transformation $y = A x$ warps space while keeping the origin $(0,0)$ fixed and grid lines parallel.

Common 2D transformations:
- **Scaling**: $\begin{pmatrix} s_x & 0 \\ 0 & s_y \end{pmatrix}$
- **Rotation ($\theta$)**: $\begin{pmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{pmatrix}$
- **Reflection**: $\begin{pmatrix} 1 & 0 \\ 0 & -1 \end{pmatrix}$
""",
        "starter_code": {
            "solution.py": '''"""
Linear Transformations & Projections
Apply 2D geometric rotation and scaling transformations to vectors.
"""

import math
from typing import List

def rotate_2d_vector(v: List[float], angle_radians: float) -> List[float]:
    """Rotate a 2D vector [x, y] counter-clockwise by angle_radians."""
    # TODO: Apply 2D rotation matrix
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand linear transformations and implement 2D trigonometric rotation matrices.",
            "exercise_goal": "Implement `rotate_2d_vector(v, angle_radians)`.",
            "expected_output": "Accurately rotate 2D vectors in space.",
            "tests.py": '''import pytest
import math
from solution import rotate_2d_vector

def test_rotate_90_degrees():
    v = [1.0, 0.0]
    # Rotate 90 deg counter-clockwise -> [0, 1]
    res = rotate_2d_vector(v, math.pi / 2)
    assert res[0] == pytest.approx(0.0, abs=1e-6)
    assert res[1] == pytest.approx(1.0, abs=1e-6)
'''
        }
    },
    "node-9-10": {
        "title": "Lesson 4.10: Memory Layouts: C-Order vs Fortran",
        "handbook_markdown": r"""# Lesson 4.10: Memory Layouts: C-Order vs Fortran

Computer RAM is a flat 1D sequence of bytes. Storing a 2D matrix in 1D memory requires a flattening convention:
1. **Row-Major (C-Order)**: Consecutive elements of a row are placed adjacent in memory (`arr[0][0], arr[0][1], arr[1][0]...`). Used by C, C++, Python (NumPy default), PyTorch.
2. **Column-Major (Fortran-Order)**: Consecutive elements of a column are placed adjacent in memory (`arr[0][0], arr[1][0], arr[0][1]...`). Used by Fortran, MATLAB, R.

---

### 💡 The Mental Model: Reading a Book
- **C-Order**: Reading left-to-right along each line, then moving to the next line.
- **Fortran-Order**: Reading top-to-bottom down column 1, then moving to column 2.
""",
        "starter_code": {
            "solution.py": '''"""
Memory Layouts: C-Order vs Fortran
Flatten 2D matrices into 1D memory buffers using row-major and column-major orders.
"""

from typing import List

Matrix = List[List[float]]

def flatten_c_order(mat: Matrix) -> List[float]:
    """Flatten 2D matrix into 1D array in Row-Major (C) order."""
    # TODO: Implement C-order flattening
    pass

def flatten_fortran_order(mat: Matrix) -> List[float]:
    """Flatten 2D matrix into 1D array in Column-Major (Fortran) order."""
    # TODO: Implement Fortran-order flattening
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand hardware memory layout conventions (Row-Major vs Column-Major) essential for high-performance tensor computing.",
            "exercise_goal": "Implement `flatten_c_order(mat)` and `flatten_fortran_order(mat)`.",
            "expected_output": "Correctly serialize 2D grids into flat 1D memory buffers.",
            "tests.py": '''import pytest
from solution import flatten_c_order, flatten_fortran_order

@pytest.fixture
def sample_mat():
    return [
        [1.0, 2.0, 3.0],
        [4.0, 5.0, 6.0]
    ]

def test_flatten_c_order(sample_mat):
    assert flatten_c_order(sample_mat) == [1.0, 2.0, 3.0, 4.0, 5.0, 6.0]

def test_flatten_fortran_order(sample_mat):
    assert flatten_fortran_order(sample_mat) == [1.0, 4.0, 2.0, 5.0, 3.0, 6.0]
'''
        }
    },
    "node-9-11": {
        "title": "Lesson 4.11: Tensor Strides & Zero-Copy Views",
        "handbook_markdown": r"""# Lesson 4.11: Tensor Strides & Zero-Copy Views

In PyTorch and NumPy, operations like `transpose()`, `reshape()`, and slicing do **not copy memory**. They simply create a new **View** with modified **Strides**.

For a matrix with shape $(R, C)$ in C-order:
- $\text{strides} = (C, 1)$.
- Element $(i, j)$ lives at 1D memory offset: $\text{offset} = i \times \text{strides}[0] + j \times \text{strides}[1]$.
""",
        "starter_code": {
            "solution.py": '''"""
Tensor Strides & Zero-Copy Views
Calculate 1D memory buffer index from multi-dimensional coordinates and strides.
"""

from typing import List, Tuple

def compute_strided_offset(coords: Tuple[int, ...], strides: Tuple[int, ...]) -> int:
    """Calculate flat memory index: sum(coord_i * stride_i)."""
    # TODO: Calculate flat offset
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand tensor striding mechanics that enable zero-copy views and fast matrix transformations.",
            "exercise_goal": "Implement `compute_strided_offset(coords, strides)`.",
            "expected_output": "Compute exact flat memory indices from n-dimensional coordinates.",
            "tests.py": '''import pytest
from solution import compute_strided_offset

def test_2d_c_order_offset():
    # 3x4 matrix -> strides (4, 1). Coordinate (2, 3) -> 2*4 + 3*1 = 11
    assert compute_strided_offset((2, 3), (4, 1)) == 11

def test_transposed_view_offset():
    # Transposed view has swapped strides (1, 4)
    assert compute_strided_offset((2, 3), (1, 4)) == 14
'''
        }
    },
    "node-9-12": {
        "title": "Lesson 4.12: Einstein Summation (Einsum)",
        "handbook_markdown": r"""# Lesson 4.12: Einstein Summation (Einsum)

`einsum` provides a unified, expressive notation for tensor contractions:
- Vector dot product: `"i,i->"` ($u \cdot v$).
- Matrix multiplication: `"ik,kj->ij"` ($A B$).
- Matrix trace: `"ii->"` ($\text{Tr}(A)$).
- Batch matrix multiply: `"bik,bkj->bij"`.
""",
        "starter_code": {
            "solution.py": '''"""
Einstein Summation (Einsum)
Implement basic einsum matrix multiplication and trace contractions.
"""

from typing import List

def einsum_trace_2d(matrix: List[List[float]]) -> float:
    """Compute matrix trace (sum of diagonal elements: 'ii->')."""
    # TODO: Sum diagonal elements matrix[i][i]
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand Einstein Summation index notation for tensor contractions.",
            "exercise_goal": "Implement `einsum_trace_2d(matrix)`.",
            "expected_output": "Compute trace of square matrices.",
            "tests.py": '''import pytest
from solution import einsum_trace_2d

def test_matrix_trace():
    mat = [
        [5.0, 2.0, 1.0],
        [0.0, 3.0, 4.0],
        [1.0, 2.0, 2.0]
    ]
    # Trace = 5 + 3 + 2 = 10.0
    assert einsum_trace_2d(mat) == 10.0
'''
        }
    },
    "node-9-13": {
        "title": "Lesson 4.13: Matrix Rank & Dimensional Collapse",
        "handbook_markdown": r"""# Lesson 4.13: Matrix Rank & Dimensional Collapse

The **Rank** of a matrix is the number of linearly independent rows or columns.
If an $N \times N$ matrix has $\text{Rank} < N$, it is **Rank-Deficient (Singular)**, squashing multi-dimensional space into a lower-dimensional flat plane or line.
""",
        "starter_code": {
            "solution.py": '''"""
Matrix Rank & Dimensional Collapse
Check if two 2D vectors are linearly dependent (collinear).
"""

from typing import List

def are_collinear_2d(u: List[float], v: List[float]) -> bool:
    """Return True if vectors u and v are linearly dependent (u[0]*v[1] - u[1]*v[0] == 0)."""
    # TODO: Compute 2D determinant
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand matrix rank, linear independence, and singular dimensional collapse.",
            "exercise_goal": "Implement `are_collinear_2d(u, v)`.",
            "expected_output": "Return True for linearly dependent vectors and False for independent vectors.",
            "tests.py": '''import pytest
from solution import are_collinear_2d

def test_collinear_vectors():
    assert are_collinear_2d([1.0, 2.0], [2.0, 4.0]) is True
    assert are_collinear_2d([1.0, 0.0], [0.0, 1.0]) is False
'''
        }
    },
    "node-9-14": {
        "title": "Lesson 4.14: Inverses & Pseudo-Inverses",
        "handbook_markdown": r"""# Lesson 4.14: Inverses & Pseudo-Inverses

The **Inverse Matrix** $A^{-1}$ undoes the linear transformation of $A$:
$$A A^{-1} = I$$

For a $2 \times 2$ matrix $\begin{pmatrix} a & b \\ c & d \end{pmatrix}$:
$$A^{-1} = \frac{1}{ad - bc} \begin{pmatrix} d & -b \\ -c & a \end{pmatrix}$$
""",
        "starter_code": {
            "solution.py": '''"""
Inverses & Pseudo-Inverses
Calculate the analytical inverse of a 2x2 matrix.
"""

from typing import List, Optional

Matrix2x2 = List[List[float]]

def inverse_2x2(mat: Matrix2x2) -> Optional[Matrix2x2]:
    """
    Compute 2x2 matrix inverse.
    Return None if matrix is singular (det == 0).
    """
    # TODO: Calculate determinant ad - bc
    # TODO: If det == 0 return None, else return scaled adjoint matrix
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Master matrix inversion algorithms and handle singular non-invertible boundary conditions.",
            "exercise_goal": "Implement `inverse_2x2(mat)`.",
            "expected_output": "Return exact inverse matrix or None if determinant is zero.",
            "tests.py": '''import pytest
from solution import inverse_2x2

def test_invertible_matrix():
    mat = [[4.0, 7.0], [2.0, 6.0]]
    # det = 24 - 14 = 10 -> inv = [[0.6, -0.7], [-0.2, 0.4]]
    inv = inverse_2x2(mat)
    assert inv is not None
    assert inv[0][0] == pytest.approx(0.6)
    assert inv[0][1] == pytest.approx(-0.7)

def test_singular_matrix():
    mat = [[1.0, 2.0], [2.0, 4.0]] # det = 0
    assert inverse_2x2(mat) is None
'''
        }
    },
    "node-9-15": {
        "title": "Lesson 4.15: Eigenvalues & Principal Axes",
        "handbook_markdown": r"""# Lesson 4.15: Eigenvalues & Principal Axes

An **Eigenvector** $v$ of transformation $A$ is a special vector whose direction is unchanged by $A$, only scaled by factor $\lambda$ (**Eigenvalue**):
$$A v = \lambda v$$

Eigenvectors define the principal axes of variance in embeddings and graphs (PageRank).
""",
        "starter_code": {
            "solution.py": '''"""
Eigenvalues & Principal Axes
Verify whether a candidate vector and scalar satisfy the eigenvalue equation Av = lambda*v.
"""

from typing import List
import pytest

def is_eigenpair(
    matrix: List[List[float]],
    vector: List[float],
    eigenvalue: float,
    tol: float = 1e-5
) -> bool:
    """Verify if matrix * vector == eigenvalue * vector within tolerance."""
    # TODO: Compute Av and lambda*v and compare elements
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand the fundamental eigenvalue equation Av = lambda*v.",
            "exercise_goal": "Implement `is_eigenpair(matrix, vector, eigenvalue)`.",
            "expected_output": "Return True if the candidate vector and eigenvalue satisfy the equation.",
            "tests.py": '''import pytest
from solution import is_eigenpair

def test_valid_eigenpair():
    # Diagonal matrix [[2, 0], [0, 5]] has eigenpair ([1, 0], 2.0)
    mat = [[2.0, 0.0], [0.0, 5.0]]
    assert is_eigenpair(mat, [1.0, 0.0], 2.0) is True
    assert is_eigenpair(mat, [0.0, 1.0], 5.0) is True
    assert is_eigenpair(mat, [1.0, 1.0], 2.0) is False
'''
        }
    }
}

def apply_patches():
    print(f"Applying patch to {len(LESSONS_DATA)} lessons in Module 4 (node-9-1 to node-9-15)...")
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
