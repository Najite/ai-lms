from helper import format_lesson

def get_content():
    # Phase 2: 35 lessons
    p2_lessons = [
        # Discrete Math & Logic (2.1 - 2.10)
        ("Propositional Logic, Truth Tables, & Logical Equivalences", "Phase 1", [
            "Atomic propositions, logical connectives: AND, OR, NOT, Implication ($P \implies Q$), Biconditional ($P \iff Q$).",
            "Truth tables and semantic verification of tautologies, contradictions, and contingencies.",
            "De Morgan's Laws for logic: $\neg(P \land Q) \iff \neg P \lor \neg Q$; equivalence to set complements.",
            "Boolean algebra in systems: simplifying nested conditional code branches algebraically."
        ], "Writing nested if-else branches that evaluate to tautologies or unreachable dead-code blocks.",
        "Simplify an ugly 5-level nested conditional statement using boolean algebra and verify equivalence via truth table.",
        "DevAudit: AST conditional simplification rule."),

        ("Predicate Logic, Quantifiers, & Logical Negation", "Lesson 2.1", [
            "Predicates as parameterized truth functions: $P(x)$ mapping domain elements to booleans.",
            "Universal ($\forall$) and Existential ($\exists$) quantifiers: semantics over finite and infinite domains.",
            "Negating quantified statements: $\neg(\forall x, P(x)) \iff \exists x, \neg P(x)$; domain edge cases.",
            "Nested quantifiers: order of quantification ($\forall x \exists y$ vs $\exists y \forall x$) and mathematical meaning."
        ], "Failing to recognize that negating 'all users are active' is 'at least one user is inactive' (not 'all users are inactive').",
        "Translate a natural language business specification with nested quantifiers into formal predicate logic.",
        "DevAudit: Static invariant validation."),

        ("Direct Proofs, Contrapositive, & Proof by Contradiction", "Lesson 2.1", [
            "The architecture of formal mathematical proofs: axioms, definitions, hypotheses, and conclusions.",
            "Direct proof methodology: assuming hypothesis $P$ and deriving conclusion $Q$ through logical deduction.",
            "Proof by Contraposition: proving $P \implies Q$ by proving $\neg Q \implies \neg P$.",
            "Proof by Contradiction (Reductio ad Absurdum): assuming $\neg P$ and deriving an impossible contradiction ($R \land \neg R$)."
        ], "Assuming that a property holding true for 100 test cases constitutes a mathematical proof.",
        "Prove formally that if $3n+2$ is odd, then $n$ is odd, using proof by contraposition.",
        "MathKit: Algorithm verification proofs."),

        ("Mathematical Induction & Loop Invariants", "Lesson 2.3", [
            "Principle of Mathematical Induction: Base Case $P(0)$ and Inductive Step $P(k) \implies P(k+1)$.",
            "Strong Induction: assuming all preceding cases $P(0), \dots, P(k)$ hold to prove $P(k+1)$.",
            "Loop Invariants in software engineering: Initialization, Maintenance, and Termination guarantees.",
            "Proving algorithm correctness: proving binary search and sorting termination via invariants."
        ], "Writing recursive functions with subtle termination bugs where the base case fails to cover all branches.",
        "Prove formally using loop invariants that binary search terminates with the correct index in $O(\log n)$ steps.",
        "Foundation for Phase 3 algorithm correctness."),

        ("Set Theory, Relations, & Equivalence Classes", "Lesson 2.1", [
            "Sets, subsets, power sets, set operations (union, intersection, difference, Cartesian product).",
            "Binary relations: reflexive, symmetric, anti-symmetric, and transitive properties.",
            "Equivalence relations and partitioning sets into disjoint equivalence classes.",
            "Partial orders, total orders, and Hasse diagrams: prerequisite structures."
        ], "Assuming a comparison function defines a total order when it violates transitivity, causing sorting algorithms to loop infinitely.",
        "Prove whether a given custom object comparator satisfies total ordering axioms.",
        "DataSift: Entity resolution and clustering."),

        ("Functions: Injections, Surjections, & Bijections", "Lesson 2.5", [
            "Domain, codomain, and range (image) of mathematical mappings.",
            "Injective (one-to-one) functions: uniqueness of outputs ($f(a) = f(b) \implies a = b$).",
            "Surjective (onto) functions: every element of codomain is mapped.",
            "Bijective functions: one-to-one correspondences, invertibility, and applications in cryptography and data encoding."
        ], "Assuming a hash function is invertible or collision-free without verifying bijective properties.",
        "Prove that Base62 encoding is a bijection between non-negative integers and alphanumeric strings.",
        "Phase 8: URL shortener encoding."),

        ("Combinatorics: Permutations, Combinations, & Pigeonhole", "Lesson 2.5", [
            "The Multiplication Principle and Addition Principle of counting.",
            "Permutations: ordered selections with and without repetition ($n! / (n-k)!$).",
            "Combinations: unordered selections ($nCr = \frac{n!}{k!(n-k)!}$); Pascal's triangle identity.",
            "The Pigeonhole Principle: if $n+1$ items occupy $n$ containers, at least one container holds $\ge 2$ items; hash collision inevitability."
        ], "Combinatorial explosion: underestimating search spaces in brute-force algorithms ($O(n!)$ vs $O(2^n)$).",
        "Calculate the exact collision probability threshold for a 32-bit hash function using the Pigeonhole Principle.",
        "Phase 3: Backtracking search spaces."),

        ("Graph Theory: Definitions, Topologies, & Isomorphisms", "Lesson 2.5", [
            "Graph components: vertices ($V$), edges ($E$), directed vs undirected, weighted vs unweighted.",
            "Vertex degrees, in-degree, out-degree, and the Handshaking Lemma ($\sum \deg(v) = 2|E|$).",
            "Paths, cycles, connectivity, bipartite graphs, and tree definitions (connected acyclic graph with $|V|-1$ edges).",
            "Graph Isomorphism: determining structural equivalence between graph representations."
        ], "Failing to check for cycles in directed graphs, causing infinite loops in dependency resolution engines.",
        "Prove that an undirected graph with $V$ vertices and $V-1$ edges is a tree if and only if it is acyclic.",
        "MathKit: `mathkit.graph` module."),

        ("Directed Acyclic Graphs (DAGs) & Topological Properties", "Lesson 2.8", [
            "DAG properties: directed edges with zero directed cycles.",
            "Sources and Sinks in DAGs; reachability analysis and transitive reduction.",
            "Topological Ordering: linear ordering of vertices where every directed edge $(u, v)$ has $u$ before $v$.",
            "Why DAGs underpin computational workflows: task scheduling, build systems, neural network backpropagation."
        ], "Circular dependency deadlocks in software build systems and package managers.",
        "Implement a mathematical cycle detector that outputs the exact cycle path if a graph fails to be a DAG.",
        "GradFlow: Computational graph evaluation in Phase 9."),

        ("Asymptotic Complexity: Formal Big-O, Big-Omega, Big-Theta", "Lesson 2.1", [
            "Formal definition of Big-$O$: $f(n) \in O(g(n)) \iff \exists c > 0, n_0 > 0 \text{ s.t. } f(n) \le c \cdot g(n) \quad \forall n \ge n_0$.",
            "Formal definition of Big-$\Omega$ (lower bound) and Big-$\Theta$ (tight asymptotic bound).",
            "Little-$o$ and Little-$\omega$ definitions: strict asymptotic dominance.",
            "Limit test for complexity: $\lim_{n \to \infty} \frac{f(n)}{g(n)}$ to classify relative growth rates."
        ], "Claiming an algorithm is $O(1)$ based on a small benchmark without analyzing asymptotic behavior at scale.",
        "Formally prove using limit definitions that $3n^2 + 5n\log n \in \Theta(n^2)$.",
        "Phase 3: Algorithmic complexity proofs."),

        # Numerical Computing & NumPy Architecture (2.11 - 2.15)
        ("NumPy Architecture: Memory Buffers, Strides, & C-Order", "Phase 1 (Lesson 1.1)", [
            "Why NumPy outperforms pure Python: contiguous memory buffers in C, eliminating PyObject pointer chasing.",
            "The `ndarray` memory layout: data pointer, shape tuple, dtype descriptor, strides tuple.",
            "Strides explained: number of bytes to step in physical memory to advance one index along a given axis.",
            "Memory order: C-contiguous (row-major: last index changes fastest) vs Fortran-contiguous (column-major)."
        ], "Triggering slow, full-array memory copies when accidentally converting non-contiguous slices into C-order.",
        "Calculate and verify the exact strides tuple for a $3 \times 4 \times 5$ float64 array manually.",
        "MathKit: Core multidimensional array primitive."),

        ("NumPy Array Creation, Views vs Copies, & Slicing", "Lesson 2.11", [
            "Array creation primitives: `zeros`, `ones`, `empty`, `arange`, `linspace`, `eye`.",
            "Basic slicing: why basic slices return memory *views* sharing the underlying data buffer.",
            "Advanced indexing: integer arrays and boolean masks returning new memory *copies*.",
            "Diagnosing views vs copies: `np.shares_memory()` and checking `arr.base`."
        ], "Modifying a sliced view expecting the original array to remain unchanged, causing silent data corruption.",
        "Write code demonstrating when a slice is a view vs when it is a copy, verified via `shares_memory()`.",
        "MathKit: In-place matrix operations."),

        ("Vectorization, SIMD, & The Universal Function (ufunc)", "Lesson 2.11", [
            "The vectorization paradigm: expressing batch operations on whole arrays without interpreted Python loops.",
            "CPU SIMD (Single Instruction, Multiple Data): AVX-512, NEON vector registers executing parallel float math.",
            "NumPy Universal Functions (`ufunc`): element-wise fast C-implemented loops; broadcasting support.",
            "`ufunc` methods: `.reduce()`, `.accumulate()`, `.outer()`, `.reduceat()`."
        ], "Writing Python `for` loops over NumPy arrays, destroying performance by bypassing vectorized C-loops.",
        "Benchmark a pure Python loop against a vectorized NumPy ufunc, demonstrating a 50x–200x speedup.",
        "MathKit: Vectorized linear algebra."),

        ("The NumPy Broadcasting Rule: Mechanics & Dimensions", "Lesson 2.11", [
            "The Broadcasting problem: performing arithmetic operations on arrays of differing shapes.",
            "The Strict Broadcasting Rule: compare dimensions from trailing (rightmost) axes to leading axes.",
            "Compatibility condition: two dimensions are compatible if they are equal, or if one of them is 1.",
            "Virtual dimension stretching: expanding dimensions without copying memory by setting strides to 0."
        ], "Misaligned trailing dimensions resulting in unexpected broadcasting rather than shape mismatch exceptions.",
        "Predict by hand the output shape of operations on shapes `(5, 1, 4)` and `(3, 4)` and verify with code.",
        "MathKit and GradFlow: Vectorized tensor math."),

        ("NumPy Aggregations, Masking, & Structured Arrays", "Lesson 2.12", [
            "Reduction along axes: `sum`, `mean`, `std`, `min`, `max`, `argmin`, `argmax`; `axis=0` vs `axis=1`.",
            "Preserving dimensions: `keepdims=True` for broadcast-safe reduction outputs.",
            "Boolean masking and filtering: `arr[arr > 0]`, `np.where()`, `np.select()`.",
            "Structured arrays and record arrays: defining C-style structs with heterogeneous datatypes in NumPy."
        ], "Applying reduction on the wrong axis, collapsing rows instead of columns in multi-tenant metric matrices.",
        "Implement a pairwise Manhattan distance calculation using exclusively broadcasting and axis reduction.",
        "DataSift: Fast numeric column profiling."),

        # Linear Algebra & Matrix Decompositions (2.16 - 2.22)
        ("Vectors, Norms, & Geometric Interpretations", "Lesson 2.11", [
            "Vectors in $\mathbb{R}^n$: direction, magnitude, geometric displacement, and coordinate bases.",
            "Vector Norms: $L_1$ (Manhattan norm), $L_2$ (Euclidean norm), $L_p$ generalized norm, $L_\infty$ (Chebyshev norm).",
            "Unit vectors and normalization: projecting vectors onto unit spheres ($\hat{v} = v / \|v\|_2$).",
            "Distance metrics: Euclidean distance, Manhattan distance, Minkowski distance."
        ], "Calculating distance metrics without normalizing vectors, causing large-magnitude features to dominate.",
        "Implement an $L_p$ norm function in pure NumPy supporting arbitrary $p \ge 1$ and verify triangle inequality.",
        "MathKit: `mathkit.linalg` vector norms."),

        ("Dot Products, Angles, & Cosine Similarity", "Lesson 2.16", [
            "The algebraic dot product: $u \cdot v = \sum u_i v_i = u^T v$.",
            "The geometric dot product: $u \cdot v = \|u\| \|v\| \cos\theta$; directional alignment.",
            "Cosine Similarity: $\frac{u \cdot v}{\|u\| \|v\|}$; invariant to scalar multiplication.",
            "Orthogonality: two vectors are orthogonal if and only if their dot product is zero."
        ], "Confusing magnitude similarity with directional similarity when comparing document embedding vectors.",
        "Prove algebraically and computationally that for unit-normalized vectors, Euclidean distance and cosine distance are monotonically related.",
        "Phase 10: Foundation for vector database retrieval."),

        ("Matrices as Linear Transformations & Matrix Multiplication", "Lesson 2.16", [
            "Matrices as coordinate transformations: rotating, scaling, shearing, and reflecting $\mathbb{R}^n$ space.",
            "Matrix-Vector multiplication: linear combination of the columns of the matrix.",
            "Matrix-Matrix multiplication ($C = AB$): row-by-column dot products; non-commutativity ($AB \neq BA$).",
            "Computational complexity: naive $O(n^3)$, Strassen's $O(n^{2.81})$, optimized BLAS cache tiling."
        ], "Multiplying matrices with incompatible inner dimensions ($A_{m \times k} \times B_{j \times n}$ where $k \neq j$).",
        "Implement matrix multiplication from scratch using nested loops, verify against `np.matmul`, and benchmark BLAS speed.",
        "MathKit: `linalg.matmul`."),

        ("Systems of Linear Equations, Gaussian Elimination, & Row Rank", "Lesson 2.18", [
            "Representing systems of linear equations: $Ax = b$; augmented matrix $[A | b]$.",
            "Elementary row operations: row swapping, row multiplication, row addition.",
            "Gaussian Elimination and Row Echelon Form (REF); Reduced Row Echelon Form (RREF).",
            "Matrix Rank: maximum number of linearly independent rows or columns; full-rank vs rank-deficient systems."
        ], "Attempting Gaussian elimination on ill-conditioned systems without partial pivoting, yielding catastrophic numerical rounding errors.",
        "Implement Gaussian elimination with partial pivoting in Python to solve an arbitrary $n \times n$ linear system.",
        "MathKit: System solver."),

        ("Matrix Inversion, Determinants, & Singularity", "Lesson 2.19", [
            "The Identity matrix ($I$) and the Inverse matrix ($A^{-1}$): $A A^{-1} = A^{-1} A = I$.",
            "Invertibility criteria: $A$ is invertible $\iff \det(A) \neq 0 \iff \text{rank}(A) = n \iff \text{nullity}(A) = 0$.",
            "The Determinant: geometric scaling factor of signed area/volume under linear transformation.",
            "Matrix condition number: sensitivity of linear system solutions to numerical perturbations."
        ], "Inverting large matrices directly in production code rather than using matrix decomposition solves ($LU$ or Cholesky).",
        "Calculate the determinant of a $4 \times 4$ matrix using cofactor expansion and verify against Gaussian elimination diagonal product.",
        "MathKit: `linalg.inverse` and `linalg.det`."),

        ("Eigenvalues, Eigenvectors, & Power Iteration", "Lesson 2.20", [
            "The Eigenvalue equation: $Av = \lambda v$; invariant transformation axes.",
            "Characteristic polynomial: $\det(A - \lambda I) = 0$; computing eigenvalues and eigenspaces.",
            "Spectral Theorem: symmetric real matrices have orthogonal real eigenvectors.",
            "The Power Iteration algorithm: iteratively computing the dominant eigenvalue and eigenvector."
        ], "Running power iteration on matrices with multiple complex eigenvalues of equal magnitude, causing oscillation.",
        "Implement Power Iteration in Python to find the dominant eigenvector of a Google PageRank transition matrix.",
        "MathKit: `linalg.eigenvalues`."),

        ("Singular Value Decomposition (SVD) & Low-Rank Approximation", "Lesson 2.21", [
            "Singular Value Decomposition theorem: $A = U \Sigma V^T$ for arbitrary rectangular $m \times n$ matrices.",
            "Left singular vectors ($U$), Singular values ($\Sigma$), Right singular vectors ($V^T$).",
            "Geometric interpretation: rotation $\to$ scaling $\to$ rotation.",
            "Eckart-Young-Mirsky Theorem: low-rank matrix approximation via truncated SVD; dimensionality reduction."
        ], "Assuming SVD can only be performed on square matrices; confusing eigenvalues with singular values.",
        "Implement image compression by computing truncated SVD and reconstructing the image using the top 10% singular values.",
        "MathKit: `linalg.svd`."),

        # Probability & Statistics (2.23 - 2.28)
        ("Probability Axioms, Sample Spaces, & Conditional Probability", "Lesson 2.5", [
            "Kolmogorov's Probability Axioms: non-negativity ($P(E) \ge 0$), unitarity ($P(\Omega) = 1$), countable additivity.",
            "Sample spaces, outcomes, events, mutually exclusive events.",
            "Conditional Probability definition: $P(A|B) = \frac{P(A \cap B)}{P(B)}$ where $P(B) > 0$.",
            "Independence of events: $P(A \cap B) = P(A)P(B)$; conditional independence."
        ], "Assuming two events are independent when they share hidden confounding variables (Simpson's Paradox).",
        "Prove mathematically that if $A$ and $B$ are independent, their complements $\neg A$ and $\neg B$ are also independent.",
        "MathKit: Probability engine."),

        ("Bayes' Theorem: Derivation, Priors, & Posteriors", "Lesson 2.23", [
            "Deriving Bayes' Theorem from the product rule of conditional probability.",
            "Formula: $P(H|D) = \frac{P(D|H) P(H)}{P(D)} = \frac{P(D|H) P(H)}{\sum_k P(D|H_k) P(H_k)}$.",
            "Prior probability, Likelihood, Marginal Evidence, Posterior probability.",
            "The Base Rate Fallacy: why a 99% accurate test for a rare disease yields mostly false positives."
        ], "The prosecutor's fallacy: confusing the probability of evidence given guilt $P(E|G)$ with guilt given evidence $P(G|E)$.",
        "Calculate the posterior probability of a rare disease given positive test results under varying base rates.",
        "MathKit: Bayesian estimation."),

        ("Random Variables, PMF, PDF, & CDF Mechanics", "Lesson 2.23", [
            "Discrete vs Continuous random variables: mappings from sample space to real numbers.",
            "Probability Mass Function (PMF) for discrete variables: $\sum P(X=x) = 1$.",
            "Probability Density Function (PDF) for continuous variables: $P(a \le X \le b) = \int_a^b f(x)dx$.",
            "Cumulative Distribution Function (CDF): $F(x) = P(X \le x)$; properties and quantile functions."
        ], "Evaluating a continuous PDF at a single point and interpreting the value as a probability ($P(X=x) = 0$ for continuous).",
        "Implement a custom CDF sampler using inverse transform sampling for an arbitrary continuous distribution.",
        "MathKit: `stats.normal_pdf` and `stats.normal_cdf`."),

        ("Common Distributions: Normal, Bernoulli, Binomial, Poisson", "Lesson 2.25", [
            "Bernoulli Distribution: single trial coin flip ($p$); mean $p$, variance $p(1-p)$.",
            "Binomial Distribution: sum of $n$ independent Bernoulli trials; combinatoric coefficient.",
            "Poisson Distribution: counting rare events in continuous time intervals; $\lambda$ parameter.",
            "Normal (Gaussian) Distribution: $\mathcal{N}(\mu, \sigma^2)$; bell curve, empirical 68-95-99.7 rule."
        ], "Using a normal distribution to model heavy-tailed financial returns or website traffic latencies.",
        "Generate random samples from Bernoulli and Normal distributions and plot empirical histograms matching theoretical PDFs.",
        "MathKit: Distribution functions."),

        ("Expectation, Variance, Covariance, & Correlation", "Lesson 2.25", [
            "Expected Value (Mean $\mu$): linearity of expectation ($\mathbb{E}[aX + bY] = a\mathbb{E}[X] + b\mathbb{E}[Y]$).",
            "Variance ($\sigma^2$): spread around mean; $\text{Var}(X) = \mathbb{E}[(X - \mu)^2] = \mathbb{E}[X^2] - (\mathbb{E}[X])^2$.",
            "Covariance: $\text{Cov}(X, Y) = \mathbb{E}[(X - \mu_X)(Y - \mu_Y)]$; directional co-movement.",
            "Pearson Correlation Coefficient ($\rho$): normalized covariance bounded in $[-1, 1]$."
        ], "Assuming correlation implies causation, or assuming zero correlation implies statistical independence (only true for Gaussians).",
        "Calculate the covariance matrix for a 3-dimensional dataset manually and verify against `np.cov`.",
        "DataSift: Correlation matrix calculations."),

        ("Hypothesis Testing: $t$-Tests, $p$-Values, & Type I/II Errors", "Lesson 2.27", [
            "The Hypothesis Testing framework: Null Hypothesis ($H_0$) vs Alternative Hypothesis ($H_1$).",
            "Test statistics: Student's two-sample $t$-test (equal and unequal variances / Welch's $t$-test).",
            "The $p$-value: probability of observing data at least as extreme assuming $H_0$ is true.",
            "Decision errors: Type I error ($\alpha$: false positive) and Type II error ($\beta$: false negative); statistical power ($1-\beta$)."
        ], "$p$-hacking: running repeated tests on random subsets until $p < 0.05$ without Bonferroni correction.",
        "Implement Welch's $t$-test from raw mathematical formulas and verify output against `scipy.stats.ttest_ind`.",
        "MathKit: `stats.t_test`."),

        # Information Theory (2.29 - 2.31)
        ("Shannon Information, Surprise, & Entropy", "Lesson 2.25", [
            "Quantifying information: self-information / surprise $I(x) = -\log_2 P(x)$; bits vs nats.",
            "Shannon Entropy: expected information content $H(X) = -\sum P(x) \log_2 P(x)$.",
            "Entropy as uncertainty: proving that entropy is maximized when the distribution is uniform.",
            "Joint Entropy and Conditional Entropy: chain rule for entropy ($H(X, Y) = H(X) + H(Y|X)$)."
        ], "Calculating entropy on un-normalized frequency counts rather than true probability distributions.",
        "Calculate by hand the entropy of an unfair coin across varying bias probabilities $p \in [0, 1]$ and plot the curve.",
        "DevAudit: High-entropy secret detection."),

        ("Cross-Entropy, Kullback-Leibler (KL) Divergence, & Mutual Info", "Lesson 2.29", [
            "Cross-Entropy: $H(P, Q) = -\sum P(x) \log Q(x)$; average cost of encoding distribution $P$ with model $Q$.",
            "Kullback-Leibler (KL) Divergence: $D_{KL}(P \parallel Q) = \sum P(x) \log \frac{P(x)}{Q(x)} = H(P, Q) - H(P)$.",
            "Gibbs' Inequality: proof that $D_{KL}(P \parallel Q) \ge 0$ with equality if and only if $P = Q$.",
            "Mutual Information: $I(X; Y) = H(X) - H(X|Y)$; measuring information sharing between variables."
        ], "Treating KL divergence as a symmetric distance metric ($D_{KL}(P \parallel Q) \neq D_{KL}(Q \parallel P)$).",
        "Implement KL divergence and Cross-Entropy in Python, and verify Gibbs' inequality across 1,000 random distributions.",
        "MathKit: `mathkit.info`."),

        ("Maximum Likelihood Estimation (MLE) & Loss Function Derivation", "Lesson 2.24, 2.30", [
            "The Likelihood function: $L(\theta) = \prod P(x_i | \theta)$; joint probability of observed data.",
            "Log-Likelihood: $\log L(\theta) = \sum \log P(x_i | \theta)$; converting products to sums.",
            "Deriving MLE estimators: taking derivatives of log-likelihood, setting to zero, solving for parameters.",
            "The Fundamental Equivalence: proving that maximizing log-likelihood under multinomial distribution is mathematically identical to minimizing cross-entropy loss."
        ], "Failing to use log-likelihood, causing catastrophic floating point underflow when multiplying thousands of small probabilities.",
        "Derive algebraically the MLE parameter estimators for the mean and variance of a normal distribution.",
        "Phase 9: Theoretical foundation for neural network loss functions."),

        # Calculus & Optimization (2.32 - 2.35)
        ("Differential Calculus: Slopes, Tangents, & The Chain Rule", "Lesson 2.1", [
            "Derivative as instantaneous rate of change: limit definition $f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$.",
            "Differentiation rules: power rule, product rule, quotient rule.",
            "The Single-Variable Chain Rule: $\frac{d}{dx}[f(g(x))] = f'(g(x)) \cdot g'(x)$.",
            "Geometric meaning: tangent lines and local linear approximations."
        ], "Applying the power rule to exponential functions (e.g., differentiating $e^x$ as $x e^{x-1}$).",
        "Calculate the analytical derivative of a composite sigmoid function and verify against finite difference approximations.",
        "GradFlow: Derivative primitives."),

        ("Multivariable Calculus: Partial Derivatives & The Gradient Vector", "Lesson 2.32", [
            "Functions of multiple variables: $f: \mathbb{R}^n \to \mathbb{R}$.",
            "Partial Derivatives: differentiating with respect to one variable while holding all others constant.",
            "The Gradient Vector ($\nabla f$): vector of all first-order partial derivatives.",
            "Geometric meaning of $\nabla f$: points in the direction of steepest ascent; magnitude is the rate of increase."
        ], "Assuming the gradient points toward a minimum (the gradient points in the direction of steepest *ascent*).",
        "Compute the gradient vector of a multivariable function analytically and verify via numerical gradient checking.",
        "MathKit: `mathkit.optim`."),

        ("The Hessian Matrix, Convexity, & Saddle Points", "Lesson 2.33", [
            "Second-order partial derivatives: mixed partials and Clairaut's Theorem ($\frac{\partial^2 f}{\partial x \partial y} = \frac{\partial^2 f}{\partial y \partial x}$).",
            "The Hessian Matrix ($H$): square matrix of second-order partial derivatives describing local curvature.",
            "Convexity: positive semi-definite Hessian ($x^T H x \ge 0 \quad \forall x$); global minima guarantees.",
            "Saddle points: indefinite Hessian with positive and negative eigenvalues; zero gradient without local extrema."
        ], "Assuming that a zero gradient ($\nabla f = 0$) guarantees a local minimum without checking the Hessian eigenvalues.",
        "Classify the stationary points of a 2D non-convex polynomial by computing eigenvalues of the Hessian matrix.",
        "Optimization theory for Phase 9."),

        ("Gradient Descent Optimization: Learning Rates & Momentum", "Lesson 2.33, 2.34", [
            "Gradient Descent update rule: $\theta_{t+1} = \theta_t - \alpha \nabla f(\theta_t)$.",
            "The Learning Rate ($\alpha$): convergence rates, oscillations in ravines, divergence when $\alpha$ is too large.",
            "Momentum update rule: exponential moving average of gradients: $v_{t+1} = \beta v_t + (1-\beta) \nabla f(\theta_t)$; $\theta_{t+1} = \theta_t - \alpha v_{t+1}$.",
            "Adam Optimizer derivation: first moment (momentum) and second moment (uncentered variance) with bias corrections."
        ], "Using an unscaled learning rate on ill-conditioned objectives, causing parameters to explode to infinity.",
        "Implement Gradient Descent with Momentum and Adam from raw formulas and optimize a 2D Rosenbrock function.",
        "MathKit: `optim.adam`.")
    ]

    p2_rendered = []
    for idx, (title, prereqs, subtopics, fail, verif, proj) in enumerate(p2_lessons, 1):
        p2_rendered.append(format_lesson(2, idx, title, prereqs, subtopics, fail, verif, proj))

    # Phase 3: 45 lessons
    p3_lessons = [
        # Memory Layout & Linear DS (3.1 - 3.7)
        ("Memory Contiguity & Cache Locality in Data Structures", "Phase 0 (Lesson 0.6), Phase 2 (Lesson 2.11)", [
            "Physical memory layouts: contiguous memory allocations vs node-pointer graph allocations.",
            "Cache line utilization: iterating contiguous arrays vs dereferencing scattered linked-list pointers.",
            "Memory overhead per element: 8 bytes for 64-bit int array vs 32+ bytes for linked-list node.",
            "Spatial prefetching in hardware: CPU prefetching contiguous memory blocks automatically."
        ], "Assuming linked lists are faster than arrays for insertion without accounting for cache miss penalties.",
        "Benchmark traversal time of 10,000,000 integers in a flat array vs a pointer-linked list, demonstrating a 20x delta.",
        "DataSift: Chunk memory layout."),

        ("Dynamic Array Architecture: Resizing & Amortized Analysis", "Lesson 3.1", [
            "Dynamic array structure: pointer to contiguous heap buffer, capacity, length.",
            "The Resizing Strategy: allocating new buffer of size $k \times \text{capacity}$ and copying elements.",
            "Resize multiplier trade-offs: $2.0\times$ vs $1.5\times$ (reusing previously freed memory chunks).",
            "Amortized $O(1)$ proof: Aggregate method and Potential method proving constant average append time."
        ], "Resizing with a constant additive increase ($\text{capacity} + 1000$), degrading appends to quadratic $O(n^2)$ time.",
        "Implement a dynamic array from scratch with a custom geometric growth factor and prove $O(1)$ amortized append.",
        "DataSift: Dynamic accumulator buffers."),

        ("Singly Linked Lists: Pointer Manipulation & Invariants", "Phase 1 (Lesson 1.1)", [
            "Node structure: payload value and pointer to next node.",
            "Insertion and deletion: head insertion ($O(1)$), tail insertion ($O(n)$ or $O(1)$ with tail pointer), arbitrary deletion ($O(n)$).",
            "Pointer manipulation discipline: maintaining invariants to avoid losing references to remaining list.",
            "The Sentinel / Dummy Node pattern: eliminating edge-case code for empty lists and head deletions."
        ], "Losing the reference to `curr.next` before updating pointers, resulting in dangling memory and broken lists.",
        "Implement a Singly Linked List with dummy head and prove zero memory leaks or lost nodes on edge cases.",
        "LoxLang: Environment scope chains."),

        ("Doubly Linked Lists & Sentinels", "Lesson 3.3", [
            "Node structure: payload, pointer to next node, pointer to previous node.",
            "Bidirectional traversal: traversing forward and backward.",
            "Constant-time node removal: deleting a known node reference in $O(1)$ without searching from head.",
            "Circular doubly linked lists with a single sentinel node: simplifying insertion and deletion logic."
        ], "Failing to update `prev` pointers during node splicing, breaking backward traversals.",
        "Implement a Doubly Linked List supporting $O(1)$ insertion and deletion at both ends and of arbitrary known nodes.",
        "Phase 5: Foundation for CacheKit LRU cache."),

        ("Floyd's Cycle-Finding Algorithm (Tortoise and Hare)", "Lesson 3.3", [
            "The linked list cycle problem: detecting infinite loops in pointer structures.",
            "Two-pointer approach: Slow pointer (1 step) and Fast pointer (2 steps).",
            "Cycle detection proof: why fast and slow pointers must collide within the cycle in $O(n)$ time.",
            "Finding the cycle start node: resetting one pointer to head and advancing both by 1 step."
        ], "Creating infinite loops in traversal routines when circular references exist in linked structures.",
        "Implement Floyd's cycle detection from memory and return the exact node where the cycle begins in $O(1)$ memory.",
        "DevAudit: Cycle detection in linked imports."),

        ("The Stack Abstract Data Type: Array vs Linked Implementations", "Lesson 3.2, 3.3", [
            "Stack LIFO (Last-In, First-Out) semantics: `push`, `pop`, `peek`, `is_empty`.",
            "Array-backed stack: memory contiguity, cache efficiency, amortized $O(1)$ push.",
            "Linked-list-backed stack: strict $O(1)$ worst-case push/pop, pointer memory overhead.",
            "Stack overflow and capacity limits in fixed-size hardware/virtual stacks."
        ], "Calling `pop()` on an empty stack without bounds checks, causing index out-of-range crashes.",
        "Implement a generic Stack supporting `push`, `pop`, and `min()` in constant $O(1)$ time and $O(n)$ space.",
        "LoxLang: Expression evaluation stack."),

        ("The Queue & Circular Buffer Deque", "Lesson 3.2", [
            "Queue FIFO (First-In, First-Out) semantics: `enqueue`, `dequeue`, `peek`.",
            "The flaw of naive array queues: `list.pop(0)` requiring $O(n)$ element shifts.",
            "Circular Buffer array queue: head pointer, tail pointer, modulo arithmetic (`(tail + 1) % capacity`).",
            "Double-Ended Queue (Deque): $O(1)$ insertions and removals at both head and tail."
        ], "Using a standard Python list as a FIFO queue in high-throughput services, incurring massive $O(n)$ CPU penalties.",
        "Implement a high-performance Circular Buffer Deque with zero element shifts passing all FIFO unit tests.",
        "NanoHTTP: Request socket queues in Phase 4."),

        # Hash Tables & Hashing (3.8 - 3.12)
        ("Hash Functions: Uniformity, Avalanche, & Rolling Hashes", "Phase 2 (Lesson 2.1)", [
            "Hash function criteria: deterministic, uniform distribution across buckets, fast evaluation.",
            "The Avalanche Effect: a single bit change in input flips approximately 50% of output bits.",
            "Non-cryptographic hash functions: FNV-1a, MurmurHash3, CityHash, xxHash.",
            "Polynomial Rolling Hash for strings: $H = \sum s[i] \cdot p^i \pmod m$; sliding window string searches."
        ], "Using trivial sum-of-characters hash functions, causing massive collision clusters on anagram strings.",
        "Implement a polynomial rolling hash function and prove avalanche properties across single-character mutations.",
        "DataSift: Fast string hashing."),

        ("Hash Collision Resolution: Separate Chaining vs Open Addressing", "Lesson 3.8", [
            "The Birthday Paradox in hashing: collisions occur much earlier than capacity limit.",
            "Separate Chaining: bucket linked lists; worst-case degradation to $O(n)$ on adversarial keys.",
            "Open Addressing: storing all elements directly in the array; finding open slots via probing sequences.",
            "Load Factor ($\alpha = n/k$): collision frequency scaling as load factor increases."
        ], "Failing to resize a separate chaining hash map when load factor exceeds 1.0, degrading queries to linear scans.",
        "Implement Separate Chaining with red-black tree bucket thresholding on collision chains.",
        "DataSift: Key cardinality counting."),

        ("Open Addressing: Linear Probing, Quadratic, & Double Hashing", "Lesson 3.9", [
            "Linear Probing: probing index $(h(k) + i) \pmod m$; primary clustering phenomena.",
            "Quadratic Probing: probing index $(h(k) + c_1 i + c_2 i^2) \pmod m$; secondary clustering.",
            "Double Hashing: probing index $(h_1(k) + i \cdot h_2(k)) \pmod m$; eliminating clustering.",
            "Tombstones for deletion: marking deleted slots as `TOMBSTONE` to preserve search probe chains."
        ], "Failing to handle tombstones during deletion, prematurely terminating lookups for subsequent inserted keys.",
        "Build an Open-Addressed hash table from scratch using double hashing and tombstone deletion.",
        "DataSift: Core hash map."),

        ("CPython `dict` Architecture: Compact Dict & Perturb Probing", "Lesson 3.10", [
            "Historical Python dict memory layout: 24-byte entries containing sparse unallocated rows.",
            "Modern Compact Dict (PEP 468): dense `entries` array + sparse byte `indices` array; 30%–95% memory savings.",
            "CPython Perturb Probing formula: `j = ((5*j) + 1 + perturb) % m; perturb >>= 5`.",
            "Preserving insertion order: how compact dicts naturally make Python dictionaries ordered."
        ], "Relying on dictionary insertion order in older runtime environments or cross-language serialization.",
        "Implement a compact dictionary prototype matching CPython's indices/entries array architecture.",
        "DataSift: High-cardinality aggregation."),

        ("Bloom Filters & Probabilistic Set Membership", "Lesson 3.8", [
            "The memory limit of exact hash sets: tracking billions of keys exceeding available physical RAM.",
            "Bloom Filter architecture: bit array of size $m$, $k$ independent hash functions.",
            "Operations: `add(key)` sets $k$ bits to 1; `contains(key)` checks if all $k$ bits are 1.",
            "Error bounds: zero false negatives guaranteed; mathematical false positive rate: $(1 - e^{-kn/m})^k$."
        ], "Assuming a Bloom filter can confirm presence with 100% certainty (it only confirms *absence* with certainty).",
        "Implement a Bloom Filter from scratch, calculate optimal $m$ and $k$ for 1M keys at 1% false positive rate, and empirically verify error rate.",
        "Phase 8: Web crawler URL deduplication."),

        # Trees & Heaps (3.13 - 3.19)
        ("Binary Trees: Tree Traversals & Depth Analysis", "Phase 2 (Lesson 2.8)", [
            "Tree recursive definition: root node, left subtree, right subtree, leaves.",
            "Depth-First Traversals: Pre-order ($N-L-R$), In-order ($L-N-R$), Post-order ($L-R-N$); call stack visualization.",
            "Breadth-First Traversal (Level-order): queue-based level-by-level breadth exploration.",
            "Tree properties: height, depth, diameter, complete vs full vs degenerate trees."
        ], "Unbounded recursion in tree traversals exceeding call stack limits on skewed, degenerate trees.",
        "Implement all four tree traversals both recursively and iteratively using an explicit stack/queue.",
        "LoxLang: AST traversals."),

        ("Binary Search Trees (BST): Invariants & Node Deletion", "Lesson 3.13", [
            "The BST Invariant: for every node, all left subtree values are smaller, all right subtree values are larger.",
            "Search and Insertion: $O(h)$ time where $h$ is tree height.",
            "Node Deletion algorithm: 3 cases (Leaf node, Node with one child, Node with two children / in-order successor swap).",
            "The Degeneracy hazard: sorted insertions degrading a BST into an $O(n)$ linked list."
        ], "Deleting a node with two children incorrectly, severing subtree linkages and violating BST invariants.",
        "Implement a full BST from scratch supporting search, insertion, and 3-case node deletion.",
        "DataSift: Sorted indexing."),

        ("Balanced Search Trees: AVL Tree Rotations", "Lesson 3.14", [
            "Why balance matters: guaranteeing $O(\log n)$ height under all insertion sequences.",
            "AVL Balance Factor: $\text{height}(\text{left}) - \text{height}(\text{right}) \in \{-1, 0, 1\}$.",
            "Single Rotations: Left Rotation (LL) and Right Rotation (RR).",
            "Double Rotations: Left-Right Rotation (LR) and Right-Left Rotation (RL)."
        ], "Failing to update tree heights after rotations, causing subsequent balance factor calculations to fail.",
        "Implement an AVL Tree with automatic self-balancing via rotations on insertion.",
        "DataSift: Range query indexes."),

        ("Red-Black Trees: Invariants & Operational Properties", "Lesson 3.15", [
            "Red-Black Tree properties: every node is Red or Black, root is Black, leaves are Black NIL nodes.",
            "No two consecutive Red nodes (Red parent cannot have Red child).",
            "Black-Height invariant: all simple paths from root to NIL leaves contain identical numbers of Black nodes.",
            "Why Red-Black trees dominate standard libraries (`std::map`, Linux CFS scheduler): fewer rotations than AVL."
        ], "Violating black-height invariants during re-coloring operations.",
        "Trace step-by-step the recoloring and rotation steps of inserting 10 keys into an empty Red-Black tree.",
        "Systems foundation for Linux scheduler in Phase 4."),

        ("Binary Heaps: Array Representation & Heap Invariants", "Lesson 3.2, 3.13", [
            "Complete Binary Tree representation in a flat array: root at index 0; children at $2i+1, 2i+2$; parent at $\lfloor(i-1)/2\rfloor$.",
            "Min-Heap and Max-Heap invariants: parent key $\le$ child keys (Min-Heap).",
            "Insertion (`push`): append to array and sift-up in $O(\log n)$ time.",
            "Extraction (`pop`): swap root with last leaf, shrink array, sift-down in $O(\log n)$ time."
        ], "Off-by-one errors in 0-indexed vs 1-indexed heap array parent-child index calculations.",
        "Implement a Min-Heap from scratch in a flat dynamic array supporting `push`, `pop`, and `peek`.",
        "MathKit: Priority queue."),

        ("Floyd's $O(n)$ Heapify Algorithm: Geometric Proof", "Lesson 3.17", [
            "Naive heap building: calling `push` $n$ times is $O(n \log n)$ time.",
            "Floyd's bottom-up `heapify`: starting at the last internal node ($\lfloor n/2 \rfloor - 1$) and sifting down.",
            "Mathematical proof of $O(n)$ complexity: summing nodes at height $h$ times cost $h$: $\sum \frac{n}{2^{h+1}} h = O(n)$.",
            "In-place heap building: transforming raw unsorted arrays into valid heaps without auxiliary memory."
        ], "Assuming heapify must sift up from leaves (which is $O(n \log n)$) rather than sifting down from internal nodes.",
        "Implement Floyd's in-place `heapify` algorithm and prove empirically that it executes in half the operations of naive pushes.",
        "DataSift: Top-K percentile calculations."),

        ("The Trie (Prefix Tree) & Radix Trees", "Lesson 3.13", [
            "Trie node structure: boolean end-of-word flag and alphabet map/array of child pointers.",
            "Operations: `insert`, `search`, `starts_with` in $O(L)$ time where $L$ is word length (independent of dataset size $N$).",
            "Autocomplete and prefix search: traversing prefix node and gathering subtree words.",
            "Memory optimization: Radix / Patricia Trie (merging single-child node chains into edge strings)."
        ], "Memory explosion when using fixed 26-pointer arrays per node on sparse, deep tries with long keys.",
        "Implement a Trie with wildcard prefix searching matching `.` as any single character.",
        "DataSift: Column pattern categorization."),

        # Sorting & Searching (3.20 - 3.26)
        ("Comparison-Based Sorting Lower Bound: $\Omega(n \log n)$ Proof", "Phase 2 (Lesson 2.10)", [
            "The Decision Tree model of comparison sorting: leaves represent permutations of input array.",
            "Height of binary decision tree: $2^h \ge n! \implies h \ge \log_2(n!)$.",
            "Stirling's Approximation: $\log_2(n!) \approx n \log_2 n - n \log_2 e \in \Omega(n \log n)$.",
            "Why comparison sorts (Quick, Merge, Heap) cannot asymptotically beat $n \log n$ in worst case."
        ], "Attempting to invent a comparison-based sorting algorithm that runs in $O(n)$ time.",
        "Write out the formal mathematical decision tree proof establishing the $\Omega(n \log n)$ sorting lower bound.",
        "Algorithmic theory foundation."),

        ("Merge Sort: Divide-and-Conquer & Stability Proof", "Lesson 3.20", [
            "Divide-and-conquer paradigm: splitting array in half, recursively sorting, merging sorted halves.",
            "The Merge operation: two-pointer merge into auxiliary buffer in linear $O(n)$ time.",
            "Stability in sorting: why preserving relative order of equal elements matters for multi-column sorting.",
            "Complexity analysis: $T(n) = 2T(n/2) + O(n) \implies O(n \log n)$ time; $O(n)$ auxiliary space."
        ], "Failing to allocate auxiliary merge buffers properly, causing high garbage collection churn.",
        "Implement a stable Merge Sort from scratch and prove stability by sorting tuples on secondary keys.",
        "DataSift: Stable data frame sorting."),

        ("Quick Sort: Partitioning Schemes & Pivot Selection", "Lesson 3.20", [
            "Partitioning mechanics: placing pivot at its final sorted position, smaller elements left, larger right.",
            "Lomuto partition scheme (simpler) vs Hoare partition scheme (fewer swaps, faster).",
            "Pivot selection strategies: first/last element (worst-case $O(n^2)$ on sorted arrays), random pivot, Median-of-Three.",
            "In-place execution: tail-call optimization keeping recursion stack depth bounded to $O(\log n)$."
        ], "Using fixed first-element pivots, degrading Quick Sort to $O(n^2)$ time on sorted production data.",
        "Implement Quick Sort with Hoare partitioning and Median-of-Three pivot selection from scratch.",
        "DataSift: In-place sorting."),

        ("Heap Sort: In-Place Sorting without Extra Memory", "Lesson 3.18, 3.20", [
            "Heap Sort algorithm: build max-heap via `heapify` in $O(n)$, then repeatedly swap root with end and sift down.",
            "Complexity: strictly $O(n \log n)$ time in best, average, and worst cases.",
            "In-place space complexity: $O(1)$ auxiliary memory (zero allocations).",
            "Why Quick Sort beats Heap Sort in practice: CPU cache locality and branch prediction."
        ], "Assuming Heap Sort is stable (it is fundamentally unstable due to long-distance swaps).",
        "Implement Heap Sort completely in-place on an arbitrary raw array without allocating any auxiliary arrays.",
        "MathKit and DataSift."),

        ("Timsort: Adaptive Hybrid Sorting in Production Systems", "Lesson 3.21, 3.22", [
            "Why Timsort (Python and Java default): exploiting pre-existing natural order in real-world data.",
            "Natural Runs: detecting strictly ascending or descending runs in input data.",
            "Minimum Run length (`minrun`): choosing run sizes (32–64) and using Insertion Sort on small runs.",
            "Stack-based merge coordination: maintaining run invariants ($A > B + C$ and $B > C$) and galloping mode."
        ], "Re-implementing naive sorting algorithms in Python instead of leveraging compiled C-implemented Timsort.",
        "Trace Timsort run creation on a partially sorted dataset, identifying when Insertion Sort vs Merge occurs.",
        "DataSift: Production dataset sorting."),

        ("Non-Comparison Sorting: Counting Sort & Radix Sort", "Lesson 3.20", [
            "Bypassing the comparison lower bound: exploiting integer key representations.",
            "Counting Sort: tallying frequencies in counting array, cumulative sums, stable placement in $O(n + k)$ time.",
            "Radix Sort (LSD vs MSD): sorting integers digit-by-digit from least to most significant using stable counting sort.",
            "Memory trade-offs: when $k \gg n$, counting sort space overhead makes comparison sorts superior."
        ], "Applying Counting Sort to floating-point numbers or sparse 64-bit integers with enormous key ranges.",
        "Implement a Least Significant Digit (LSD) Radix Sort that sorts 1,000,000 32-bit integers faster than standard Quick Sort.",
        "DataSift: High-speed integer column sorting."),

        ("Binary Search: Invariants, Bounds, & Monotonic Spaces", "Phase 2 (Lesson 2.10)", [
            "Binary Search boundary invariants: `low <= high` vs `low < high`; midpoint overflow avoidance.",
            "Lower Bound (First Occurrence) vs Upper Bound (Last Occurrence) search algorithms.",
            "Search on Monotonic Answer Spaces: converting optimization problems into decision problems ($F(x) \to \{\text{T}, \text{F}\}$).",
            "Proving monotonicity: confirming that if condition holds for $x$, it holds for all $y > x$."
        ], "Off-by-one errors causing infinite loops when `low = mid` without integer ceiling division.",
        "Implement binary search on an answer space to solve the 'Ship Packages Within D Days' optimization problem.",
        "Core competitive programming pattern."),

        # Graph Algorithms (3.27 - 3.35)
        ("Graph Representations: Adjacency Matrix vs Adjacency List", "Phase 2 (Lesson 2.8)", [
            "Adjacency Matrix: $V \times V$ 2D array; $O(1)$ edge existence check; $O(V^2)$ memory.",
            "Adjacency List: array of linked lists/vectors; $O(V + E)$ memory; $O(\deg(u))$ neighbor lookup.",
            "Compressed Sparse Row (CSR): high-performance flat array representation for massive static graphs.",
            "Memory and performance trade-offs: sparse graphs ($|E| \ll |V|^2$) vs dense graphs ($|E| \approx |V|^2$)."
        ], "Using an Adjacency Matrix for a graph with 1,000,000 nodes and 2,000,000 edges, exhausting 1TB RAM.",
        "Build both representations and measure memory consumption and neighbor iteration speed across varying graph densities.",
        "MathKit: `mathkit.graph` data structures."),

        ("Breadth-First Search (BFS): Shortest Path in Unweighted Graphs", "Lesson 3.7, 3.27", [
            "BFS mechanics: queue-based level-order traversal; visiting all nodes at distance $k$ before $k+1$.",
            "Shortest path guarantee: first time a node is reached in unweighted graphs is guaranteed shortest path.",
            "Cycle prevention: tracking visited sets; multi-source BFS for simultaneous wavefront expansion.",
            "Complexity: strictly $O(V + E)$ time and $O(V)$ space."
        ], "Failing to mark nodes as visited immediately upon enqueueing, causing nodes to be added to queue multiple times.",
        "Implement Multi-Source BFS to compute distance transforms on a 2D grid matrix in $O(V + E)$ time.",
        "MathKit: `graph.bfs`."),

        ("Depth-First Search (DFS): Connected Components & Recursion", "Lesson 3.6, 3.27", [
            "DFS mechanics: recursive / stack-based deep branch exploration; backtracking on leaf boundaries.",
            "Connected Components: identifying isolated subgraphs in undirected graphs.",
            "Eulerian paths and cycles: traversing every edge exactly once (Fleury's and Hierholzer's algorithms).",
            "Call stack limits: converting recursive DFS to iterative DFS using explicit heap-allocated stacks."
        ], "RecursionError in Python when running recursive DFS on deep linear graphs exceeding 1,000 depth.",
        "Implement an iterative DFS with explicit stack that processes a linear chain graph of 100,000 nodes without stack overflow.",
        "MathKit: `graph.dfs`."),

        ("Cycle Detection in Directed Graphs: 3-Color Algorithm", "Lesson 3.29", [
            "Why undirected cycle detection (visited set) fails on directed graphs: cross edges vs back edges.",
            "The 3-Coloring DFS state machine: White (unvisited), Gray (currently exploring on call stack), Black (finished).",
            "Cycle criterion: encountering a Gray node during traversal indicates a Back Edge, confirming a directed cycle.",
            "Reconstructing the exact cycle path from traversal parent pointers."
        ], "Confusing cross edges in directed graphs with cycles, falsely reporting circular dependencies.",
        "Write a directed cycle detector using 3-color DFS that returns the exact list of nodes involved in the cycle.",
        "DevAudit: Circular import detection."),

        ("Topological Sorting: Kahn's Algorithm & DFS Post-Order", "Lesson 3.30", [
            "Topological sort definition: linear vertex ordering respecting all directed edge dependencies.",
            "Kahn's Algorithm (BFS-based): computing in-degrees, queueing zero in-degree nodes, decrementing neighbor in-degrees.",
            "DFS Post-Order Algorithm: pushing nodes to stack upon reaching Black state, then reversing stack.",
            "Cycle detection property: if Kahn's algorithm outputs fewer than $|V|$ nodes, the graph contains a cycle."
        ], "Attempting topological sort on a graph containing cycles without handling cycle exceptions.",
        "Implement Kahn's algorithm to resolve build dependency graphs and verify cycle rejection.",
        "GradFlow: Computational DAG topological sorting."),

        ("Dijkstra's Algorithm: Priority Queue & Edge Relaxation", "Lesson 3.17, 3.27", [
            "Single-source shortest path on graphs with non-negative edge weights.",
            "Edge Relaxation: if $d[u] + w(u, v) < d[v]$, update $d[v] = d[u] + w(u, v)$.",
            "Min-Heap implementation: extracting minimum distance node in $O(\log V)$; total time $O((V + E) \log V)$.",
            "Why Dijkstra fails on negative edge weights: greedy assumption invalidated by negative shortcuts."
        ], "Running Dijkstra on graphs with negative weights, causing infinite loops or incorrect shortest paths.",
        "Implement Dijkstra's algorithm using a custom binary min-heap and reconstruct the shortest path between two vertices.",
        "MathKit: `graph.dijkstra`."),

        ("Bellman-Ford Algorithm: Negative Weights & Cycle Detection", "Lesson 3.32", [
            "Single-source shortest path supporting negative edge weights.",
            "Dynamic Programming approach: relaxing all $|E|$ edges $|V|-1$ times; $O(V \cdot E)$ time.",
            "Why $|V|-1$ iterations suffice: a simple shortest path contains at most $|V|-1$ edges.",
            "Negative Cycle Detection: running a $|V|$-th iteration; if any edge relaxes, a negative cycle exists."
        ], "Using Dijkstra instead of Bellman-Ford in currency arbitrage detection where negative log exchange rates exist.",
        "Implement the Bellman-Ford algorithm to detect negative weight cycles in a directed financial currency graph.",
        "MathKit: Graph shortest paths."),

        ("Disjoint Set Union (Union-Find): Path Compression & Rank", "Lesson 3.2", [
            "The Dynamic Connectivity problem: `find(x)` (determine set representative) and `union(x, y)` (merge sets).",
            "Naive Union-Find: tree depth degrading to $O(n)$ under sequential unions.",
            "Union by Rank / Size: attaching shorter tree under root of taller tree, keeping depth logarithmic.",
            "Path Compression: flattening tree pointers directly to root during `find(x)`; $\alpha(n)$ Inverse Ackermann bound."
        ], "Omitting path compression, degrading Union-Find performance to logarithmic or linear time under adversarial unions.",
        "Implement Union-Find with path compression and union by rank; prove nearly constant $O(\alpha(n))$ operational performance.",
        "DataSift: Entity resolution and record clustering."),

        ("Minimum Spanning Tree (MST): Kruskal's & Prim's Algorithms", "Lesson 3.32, 3.34", [
            "Minimum Spanning Tree definition: connecting all vertices with minimum total edge weight.",
            "The Cut Property: the minimum weight edge crossing any cut is guaranteed to be in the MST.",
            "Kruskal's Algorithm: sort all edges by weight, add edge if it connects disjoint sets (using Union-Find).",
            "Prim's Algorithm: grow tree from root node by repeatedly adding minimum weight edge connecting tree to non-tree."
        ], "Using Kruskal's on dense graphs without considering Prim's algorithm with adjacency matrices.",
        "Implement Kruskal's algorithm using custom Union-Find to find the MST of a weighted communication network.",
        "DataSift: Minimum network clustering."),

        # Dynamic Programming (3.36 - 3.42)
        ("Dynamic Programming: Overlapping Subproblems & Optimal Substructure", "Lesson 2.4", [
            "The DP paradigm: breaking problems into subproblems, solving each once, storing solutions.",
            "Optimal Substructure: optimal solution to problem contains within it optimal solutions to subproblems.",
            "Overlapping Subproblems: recursion trees repeatedly computing identical state subproblems.",
            "Top-Down (Memoization) vs Bottom-Up (Tabulation): call-stack overhead vs topological order evaluation."
        ], "Attempting DP on problems that lack optimal substructure (e.g., longest simple path).",
        "Formulate the recursive state equation, base cases, and memoization table for the Fibonacci and Climbing Stairs problems.",
        "Core algorithmic problem-solving skill."),

        ("1D Dynamic Programming: Kadane's Algorithm & LIS", "Lesson 3.36", [
            "State formulation in 1D arrays: `dp[i]` representing optimal value ending at or up to index $i$.",
            "Kadane's Algorithm (Maximum Subarray Sum): $O(n)$ time and $O(1)$ space dynamic programming.",
            "Longest Increasing Subsequence (LIS): $O(n^2)$ classical DP vs $O(n \log n)$ patience sorting with binary search.",
            "House Robber and Coin Change: decision transitions ($\max(\text{rob}, \text{skip})$)."
        ], "Allocating $O(n)$ space when state transitions depend only on `dp[i-1]`, wasting memory on large inputs.",
        "Implement Longest Increasing Subsequence in $O(n \log n)$ time using patience sorting and binary search.",
        "DataSift: Monotonic anomaly detection."),

        ("2D Dynamic Programming: 0/1 Knapsack & Unbounded Knapsack", "Lesson 3.36", [
            "State definition with two parameters: `dp[i][w]` considering first $i$ items with capacity $w$.",
            "State transitions: item excluded (`dp[i-1][w]`) vs item included (`dp[i-1][w - weight[i]] + value[i]`).",
            "Space optimization trick: rolling 1D array traversed in reverse to prevent using the same item twice.",
            "Unbounded Knapsack: allowing unlimited item reuse; forward traversal of rolling 1D array."
        ], "Traversing rolling 1D knapsack arrays forward instead of backward, accidentally converting 0/1 Knapsack into Unbounded Knapsack.",
        "Implement 0/1 Knapsack with $O(W)$ space optimization and prove correct item selection reconstruction.",
        "Resource allocation optimization."),

        ("String DP: Longest Common Subsequence & Edit Distance", "Lesson 3.38", [
            "Longest Common Subsequence (LCS): state `dp[i][j]` matching prefixes of two strings.",
            "LCS transitions: character match (`dp[i-1][j-1] + 1`) vs mismatch (`max(dp[i-1][j], dp[i][j-1])`).",
            "Levenshtein Edit Distance: minimum insertions, deletions, substitutions to transform string $A$ to $B$.",
            "Space optimization: reducing 2D string DP tables from $O(n \cdot m)$ space to $O(\min(n, m))$ using two rows."
        ], "Allocating massive 2D tables for gigabyte-scale strings, exhausting memory.",
        "Implement Levenshtein Edit Distance with two-row space optimization and output the minimal transformation script.",
        "EvalKit: ROUGE-L calculation in Phase 10."),

        ("Interval DP: Matrix Chain Multiplication & Burst Balloons", "Lesson 3.38", [
            "Interval state definition: `dp[i][j]` representing optimal cost to solve subproblem over range $[i, j]$.",
            "Evaluation order: iterating by interval length from $2$ to $n$ to guarantee subproblems are tabulated.",
            "Matrix Chain Multiplication: finding optimal parenthesization to minimize scalar multiplications.",
            "Complexity: typically $O(n^3)$ time and $O(n^2)$ space."
        ], "Iterating loop indices in row-major order instead of interval-length order, reading uncomputed DP states.",
        "Implement Matrix Chain Multiplication and output the optimal associative parenthesis ordering string.",
        "MathKit: Expression optimization."),

        ("Tree DP: Maximum Independent Set & Tree Diameter", "Lesson 3.13, 3.36", [
            "Dynamic programming on tree structures: state transitions defined across parent-child edges.",
            "Post-order evaluation: computing children states before parent states.",
            "Maximum Independent Set on Trees: `dp[u][0]` (node $u$ excluded) vs `dp[u][1]` (node $u$ included).",
            "Tree Diameter: calculating maximum distance between any two tree nodes in single DFS traversal."
        ], "Attempting to compute tree DP top-down without memoization, leading to exponential redundant subtree visits.",
        "Implement a Tree DP algorithm that finds the diameter of an unweighted tree in linear $O(V)$ time.",
        "DevAudit: Dependency depth analysis."),

        ("Bitmask DP: Traveling Salesperson Problem (TSP)", "Phase 2 (Lesson 2.3), Lesson 3.36", [
            "Representing subsets as integer bitmasks: $S \subseteq \{0, \dots, n-1\}$ represented by an integer in $[0, 2^n - 1]$.",
            "Bitwise operations for DP: testing membership (`mask & (1 << i)`), adding element (`mask | (1 << i)`).",
            "Traveling Salesperson Problem (TSP): state `dp[mask][u]` (visited cities set `mask`, current city `u`).",
            "Complexity: Bellman-Held-Karp algorithm solving TSP in $O(n^2 2^n)$ time vs naive $O(n!)$ factorial brute force."
        ], "Using bitmask DP when $n > 25$, exceeding memory and computational limits ($2^{25} \approx 33$ million states).",
        "Implement the Held-Karp $O(n^2 2^n)$ algorithm for the Traveling Salesperson Problem and verify correctness on $n=16$.",
        "Phase 8: Fleet routing design."),

        # Competitive Problem-Solving Patterns (3.43 - 3.45)
        ("Two Pointers & Sliding Window Mechanics", "Lesson 3.2", [
            "Two Pointers: converging pointers (sorted arrays), fast/slow pointers, parallel pointers.",
            "Sliding Window: fixed-size windows vs dynamically resizing windows with state accumulators.",
            "Window state invariants: expanding right pointer to satisfy condition, shrinking left to restore invariant.",
            "Time complexity: proving amortized $O(n)$ time because left and right pointers each advance at most $n$ times."
        ], "Nesting loops inside sliding windows, accidentally degrading linear $O(n)$ algorithms to quadratic $O(n^2)$.",
        "Solve 'Minimum Window Substring' in $O(n)$ time using a dynamic sliding window and character frequency hash map.",
        "DataSift: Streaming window aggregations."),

        ("Monotonic Stack & Monotonic Queue Paradigms", "Lesson 3.6, 3.7", [
            "Monotonic Stack invariant: elements maintained in strictly increasing or decreasing order.",
            "Next Greater Element pattern: resolving pending smaller elements when a larger element arrives in $O(n)$.",
            "Largest Rectangle in Histogram: identifying maximal bounding rectangles using stack boundary pops.",
            "Monotonic Queue / Deque: maintaining Sliding Window Maximum in continuous linear $O(n)$ time."
        ], "Failing to clear remaining stack elements at end of input array, missing boundary elements.",
        "Solve 'Trapping Rain Water' and 'Sliding Window Maximum' using monotonic stacks and deques in $O(n)$ time.",
        "DataSift: Spike and anomaly detection."),

        ("Backtracking: Systematic State-Space Pruning", "Lesson 3.29", [
            "Backtracking paradigm: Depth-First tree search over combinatorial candidates with undo transitions.",
            "The Three Steps: Choose candidate, Explore recursively, Unchoose (backtrack state).",
            "Pruning techniques: cutting search branches early as soon as candidate violates constraints.",
            "Canonical problems: N-Queens, Sudoku Solver, Subset Generation, Word Search in 2D Grid."
        ], "Failing to revert state cleanly during unchoose step, corrupting state for subsequent search branches.",
        "Implement an N-Queens solver with bitmask pruning that finds all valid placements for $N=12$ in under 1 second.",
        "LoxLang: AST pattern matching.")
    ]

    p3_rendered = []
    for idx, (title, prereqs, subtopics, fail, verif, proj) in enumerate(p3_lessons, 1):
        p3_rendered.append(format_lesson(3, idx, title, prereqs, subtopics, fail, verif, proj))

    p2_body = "\n".join(p2_rendered)
    p3_body = "\n".join(p3_rendered)

    return f"""
---

## Phase 2: Mathematics for Engineers & Numerical Computing
**Duration**: 6 weeks
**Total Lessons**: 35 Lessons (Lesson 2.1 to Lesson 2.35)
**Builds on**: Phase 1 (Python programming, testing, clean architecture)
**Introduces**: Discrete mathematics, NumPy numerical engine & vectorized memory architecture, linear algebra, matrix decompositions (SVD, Eigenvalues), multivariable calculus, probability theory, statistical inference, information theory, first-order gradient optimization.

---

### Phase 2 Lesson Specifications (Lessons 2.1 – 2.35)

{p2_body}

---

### Phase 2 Project: MathKit

- **Project Type**: Mathematical & Numerical Engineering Library
- **Language**: Python (`mypy --strict`, utilizing NumPy exclusively for array buffer primitives)
- **Module Architecture**:
  - `mathkit.linalg`: `dot`, `matmul`, `transpose`, `inverse`, `determinant`, `eigenvalues_power_iteration`, `svd`.
  - `mathkit.stats`: `mean`, `variance`, `std`, `median`, `percentile`, `normal_pdf`, `normal_cdf`, `t_test`, `chi_squared_test`, `cohen_kappa`.
  - `mathkit.graph`: `bfs`, `dfs`, `topological_sort`, `dijkstra`, `detect_cycles`.
  - `mathkit.info`: `entropy`, `cross_entropy`, `kl_divergence`, `mutual_information`.
  - `mathkit.optim`: `gradient_descent` (with numerical differentiation), `adam` (implemented strictly from Kingma & Ba 2014 formulas).
- **Quality Standard**:
  - `mypy --strict` passes without exemption.
  - Comprehensive property tests with `hypothesis`: verify entropy is non-negative, verify Gibbs' inequality ($D_{{KL}} \ge 0$).
  - Vectorized performance benchmark: `matmul` on $1000 \times 1000$ matrices in $<1$ second.
  - Published to PyPI as an installable package.

---

### Phase 2 Exit Benchmark

- [ ] Derive the backpropagation chain rule equation for a two-layer matrix multiplication network with scalar loss.
- [ ] Prove mathematically why minimizing cross-entropy loss is equivalent to maximizing the likelihood of Bernoulli distributed data.
- [ ] Implement matrix multiplication and Singular Value Decomposition from first principles without using high-level linear algebra library functions.
- [ ] Given an empirical dataset, compute mean, variance, confidence intervals, and execute a two-sample $t$-test using scratch code.
- [ ] Implement gradient descent with momentum and Adam optimizer from mathematical formulas and prove convergence on a non-convex function.

---

## Phase 3: Data Structures, Algorithms & Problem Solving
**Duration**: 8 weeks
**Total Lessons**: 45 Lessons (Lesson 3.1 to Lesson 3.45)
**Builds on**: Phase 1 (Python, testing), Phase 2 (discrete math, Big-$O$, graph theory)
**Introduces**: First-principles implementations of all core data structures, memory layout, sorting algorithms, algorithmic design paradigms, competitive programming problem solving.

---

### Phase 3 Lesson Specifications (Lessons 3.1 – 3.45)

{p3_body}

---

### Phase 3 Problem Solving Discipline

To achieve genuine production competence, algorithmic patterns and complexity analysis must become second nature through deliberate, structured practice:
- **Target Volume**: 200 LeetCode Medium/Hard problems (focusing on depth of understanding over speed-running).
- **Structured Progression**:
  1. *Foundations (50 problems)*: LeetCode Easy — solidify data structure mechanics, pointer manipulation, and base cases.
  2. *Core Pattern Application (100 problems)*: LeetCode Medium — Monotonic Stack, Sliding Window, Graph Traversals, Two Pointers, Top-K, 1D/2D Dynamic Programming.
  3. *Advanced & Adversarial (30 problems)*: LeetCode Hard — Monotonic Queue, Segment Trees, Advanced DP, Multi-State Graph Transitions.
  4. *Competitive Complex Scenarios (20 problems)*: Codeforces Div 2 / Div 3 — unseen problem statements, strict edge cases, adversarial test suites.
- **Deliberate Practice Protocol**:
  - Dedicate 30–45 minutes to analyze and solve each problem independently before consulting hints.
  - If stuck after thorough effort, inspect only the high-level pattern category (e.g. "two-pointer" or "topological sort"); write the implementation from scratch.
  - Post-solve analysis: review alternative implementations to compare memory allocations, branch prediction implications, and asymptotic space/time complexity.
  - Spaced repetition: re-visit and re-implement difficult problems after 1 week and 3 weeks to ensure mental models are retained.

---

### Phase 3 Project: DataSift

- **Project Type**: High-Performance Data Quality & Profiling Engine
- **Language**: Python (`mypy --strict`)
- **Supported Formats**: CSV, JSON Lines, Apache Parquet (via `pyarrow`)
- **Core Algorithms & Data Structures Applied**:
  - Streaming hash map counters for categorical frequencies and cardinality.
  - In-place quicksort / introsort for exact percentile calculations (p50, p90, p99).
  - Prefix Trie for string pattern classification and regex anomaly clustering.
  - Disjoint Set Union (Union-Find) for near-duplicate record clustering based on Jaccard token similarity.
- **Features**:
  - Automated type inference (Integer, Float, Boolean, ISO Timestamp, Categorical, High-Cardinality Text).
  - Data anomaly detection: null rate thresholding, constant columns, formatting divergence, referential integrity breaches between datasets.
  - Multi-threaded processing pool (`multiprocessing.Pool`) handling datasets up to 10GB with $<100$MB resident RAM.
- **Output Formats**: Rich interactive terminal dashboard, structured JSON export, and self-contained HTML report with embedded SVG histograms.
- **Quality Standard**:
  - Processes a 1GB CSV file in $<60$ seconds.
  - 100% type coverage, property-tested with `hypothesis`. Published to PyPI.

---

### Phase 3 Exit Benchmark

- [ ] Implement an open-addressed hash table, a min-heap, and a Trie from memory without looking up reference code.
- [ ] Solve an unseen LeetCode Medium algorithmic problem in under 20 minutes with optimal time and space complexity.
- [ ] Write Dijkstra's algorithm and Kahn's topological sort from scratch, and prove their Big-$O$ time and space bounds.
- [ ] Implement 2D Edit Distance (Levenshtein Distance) using bottom-up dynamic programming with $O(m)$ space optimization.
- [ ] Explain how CPython's `dict` implements collision resolution and memory compaction based on `Objects/dictobject.c`.
"""
