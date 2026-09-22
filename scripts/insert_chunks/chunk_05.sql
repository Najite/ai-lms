INSERT INTO curriculum_nodes (id, slug, phase_id, order_index, title, subtitle, cs_foundation, ai_convergence, xp_reward, level_required, position_x, position_y, handbook_markdown, starter_code, test_suite, defense_prompts) VALUES
('node-2-1', 'phase-02-lesson-01-mental-model-why-math-powers-systems-ai', 'module-3', 1, 'Lesson 3.1: Mental Model: Why Math Powers Systems & AI', 'Prerequisites: Phase 1', 'Prerequisites: Phase 1 | Subtopics: 4 items', 'Systems project application', 140, 3, 560.0, 50.0, '# Lesson 2.1: Mental Model: Why Math Powers Systems & AI

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Phase 1
- **Subtopics**:
  - `2.1.1` Why modern software and AI run on math: transforming fuzzy ideas into precise numbers.
  - `2.1.2` From code to geometry: how words and documents are represented as points in multi-dimensional space.
  - `2.1.3` No advanced prerequisites: building intuition through pictures, arrows, and physical metaphors first.
  - `2.1.4` The mathematical roadmap: moving from simple coordinates to vectors, slopes, and AI optimization.
- **Key Failure Modes & Edge Cases**: Believing math is abstract memorization rather than practical tools for measuring similarity and movement.
- **Verification & Mastery Check**: Write a 200-word explanation comparing how a librarian sorts books by category vs how an AI maps words in space.
- **Project Application**: VectorCore: Mathematical mental foundations.', '{"solution.py": "# Phase 2 // Lesson 2.1: Mental Model: Why Math Powers Systems & AI\n\ndef solve():\n    \"\"\"\n    Verification: Write a 200-word explanation comparing how a librarian sorts books by category vs how an AI maps wor\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.1", "subtopics_count": 4, "verification_criteria": "Write a 200-word explanation comparing how a librarian sorts books by category vs how an AI maps words in space.", "subtopics": ["2.1.1 Why modern software and AI run on math: transforming fuzzy ideas into precise numbers.", "2.1.2 From code to geometry: how words and documents are represented as points in multi-dimensional space.", "2.1.3 No advanced prerequisites: building intuition through pictures, arrows, and physical metaphors first.", "2.1.4 The mathematical roadmap: moving from simple coordinates to vectors, slopes, and AI optimization."]}'::jsonb, '["Explain how this implementation prevents: Believing math is abstract memorization rather than practical tools for measuring similarity and movement.", "How does Mental Model: Why Math Powers Systems & AI scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-2-2', 'phase-02-lesson-02-algebraic-equations-unknown-variables', 'module-3', 2, 'Lesson 3.2: Algebraic Equations & Unknown Variables', 'Prerequisites: Lesson 2.1', 'Prerequisites: Lesson 2.1 | Subtopics: 4 items', 'Systems project application', 140, 3, 620.0, 100.0, '# Lesson 2.2: Algebraic Equations & Unknown Variables

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 2.1
- **Subtopics**:
  - `2.2.1` Variables in math vs variables in code: unknown values to solve for vs named boxes in memory.
  - `2.2.2` Linear equations: solving simple equations like y = mx + b step-by-step.
  - `2.2.3` Balancing equations: applying the same operation to both sides without changing equality.
  - `2.2.4` Translating engineering problems into algebraic formulas (calculating cloud server costs and token limits).
- **Key Failure Modes & Edge Cases**: Forgetting order of operations when rearranging algebraic equations, leading to incorrect calculations.
- **Verification & Mastery Check**: Write a Python function that solves for the maximum requests allowed given a monthly budget and cost per call.
- **Project Application**: VectorCore: Rate and capacity budgeting formulas.', '{"solution.py": "# Phase 2 // Lesson 2.2: Algebraic Equations & Unknown Variables\n\ndef solve():\n    \"\"\"\n    Verification: Write a Python function that solves for the maximum requests allowed given a monthly budget and cost\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.2", "subtopics_count": 4, "verification_criteria": "Write a Python function that solves for the maximum requests allowed given a monthly budget and cost per call.", "subtopics": ["2.2.1 Variables in math vs variables in code: unknown values to solve for vs named boxes in memory.", "2.2.2 Linear equations: solving simple equations like y = mx + b step-by-step.", "2.2.3 Balancing equations: applying the same operation to both sides without changing equality.", "2.2.4 Translating engineering problems into algebraic formulas (calculating cloud server costs and token limits)."]}'::jsonb, '["Explain how this implementation prevents: Forgetting order of operations when rearranging algebraic equations, leading to incorrect calculations.", "How does Algebraic Equations & Unknown Variables scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-2-3', 'phase-02-lesson-03-functions-as-mappings-inputs-to-outputs', 'module-3', 3, 'Lesson 3.3: Functions as Mappings: Inputs to Outputs', 'Prerequisites: Lesson 2.2', 'Prerequisites: Lesson 2.2 | Subtopics: 4 items', 'Systems project application', 140, 3, 500.0, 150.0, '# Lesson 2.3: Functions as Mappings: Inputs to Outputs

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 2.2
- **Subtopics**:
  - `2.3.1` Mathematical functions: rules that map every input in a domain to exactly one output.
  - `2.3.2` Visualizing functions as graphs: plots of f(x) showing curves, trends, and plateaus.
  - `2.3.3` Linear vs non-linear functions: why straight lines cannot model complex human language or vision.
  - `2.3.4` Activation functions preview: introducing functions that turn numbers on or off like light switches.
- **Key Failure Modes & Edge Cases**: Assuming all real-world relationships are straight lines, failing to model exponential growth or saturation.
- **Verification & Mastery Check**: Plot a simple non-linear mapping (like a threshold function) in terminal text and explain its behavior.
- **Project Application**: VectorCore: Function mapping foundations.', '{"solution.py": "# Phase 2 // Lesson 2.3: Functions as Mappings: Inputs to Outputs\n\ndef solve():\n    \"\"\"\n    Verification: Plot a simple non-linear mapping (like a threshold function) in terminal text and explain its behavi\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.3", "subtopics_count": 4, "verification_criteria": "Plot a simple non-linear mapping (like a threshold function) in terminal text and explain its behavior.", "subtopics": ["2.3.1 Mathematical functions: rules that map every input in a domain to exactly one output.", "2.3.2 Visualizing functions as graphs: plots of f(x) showing curves, trends, and plateaus.", "2.3.3 Linear vs non-linear functions: why straight lines cannot model complex human language or vision.", "2.3.4 Activation functions preview: introducing functions that turn numbers on or off like light switches."]}'::jsonb, '["Explain how this implementation prevents: Assuming all real-world relationships are straight lines, failing to model exponential growth or saturation.", "How does Functions as Mappings: Inputs to Outputs scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-2-4', 'phase-02-lesson-04-cartesian-coordinates-2d-3d-space', 'module-3', 4, 'Lesson 3.4: Cartesian Coordinates: 2D & 3D Space', 'Prerequisites: Lesson 2.3', 'Prerequisites: Lesson 2.3 | Subtopics: 4 items', 'Systems project application', 140, 3, 560.0, 200.0, '# Lesson 2.4: Cartesian Coordinates: 2D & 3D Space

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 2.3
- **Subtopics**:
  - `2.4.1` The coordinate plane: measuring positions along X and Y perpendicular axes.
  - `2.4.2` Extending to 3D: adding the Z depth axis to represent physical objects in 3D space.
  - `2.4.3` Points as coordinates: representing a location as an ordered pair (x, y) or triplet (x, y, z).
  - `2.4.4` Plotting data: how scatter plots reveal clusters, patterns, and outliers in datasets.
- **Key Failure Modes & Edge Cases**: Mixing up the order of axes (confusing (x, y) with (row, column) in matrix grids).
- **Verification & Mastery Check**: Create a Point2D class that calculates the midpoint between any two coordinate points.
- **Project Application**: VectorCore: Spatial coordinate systems.', '{"solution.py": "# Phase 2 // Lesson 2.4: Cartesian Coordinates: 2D & 3D Space\n\ndef solve():\n    \"\"\"\n    Verification: Create a Point2D class that calculates the midpoint between any two coordinate points.\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.4", "subtopics_count": 4, "verification_criteria": "Create a Point2D class that calculates the midpoint between any two coordinate points.", "subtopics": ["2.4.1 The coordinate plane: measuring positions along X and Y perpendicular axes.", "2.4.2 Extending to 3D: adding the Z depth axis to represent physical objects in 3D space.", "2.4.3 Points as coordinates: representing a location as an ordered pair (x, y) or triplet (x, y, z).", "2.4.4 Plotting data: how scatter plots reveal clusters, patterns, and outliers in datasets."]}'::jsonb, '["Explain how this implementation prevents: Mixing up the order of axes (confusing (x, y) with (row, column) in matrix grids).", "How does Cartesian Coordinates: 2D & 3D Space scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-2-5', 'phase-02-lesson-05-distance-metrics-euclidean-vs-manhattan', 'module-3', 5, 'Lesson 3.5: Distance Metrics: Euclidean vs Manhattan', 'Prerequisites: Lesson 2.4', 'Prerequisites: Lesson 2.4 | Subtopics: 4 items', 'Systems project application', 140, 3, 620.0, 250.0, '# Lesson 2.5: Distance Metrics: Euclidean vs Manhattan

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 2.4
- **Subtopics**:
  - `2.5.1` Measuring distance between points: straight-line distance vs grid-based distance.
  - `2.5.2` Euclidean distance: the Pythagorean theorem in action (square root of sum of squared differences).
  - `2.5.3` Manhattan distance: city-block distance along grid lines (|x1 - x2| + |y1 - y2|).
  - `2.5.4` When to use which metric: physical navigation vs high-dimensional data similarity.
- **Key Failure Modes & Edge Cases**: Forgetting the square root in Euclidean distance, accidentally calculating squared distance.
- **Verification & Mastery Check**: Implement both distance metrics in pure Python and compare their outputs on a grid of points.
- **Project Application**: VectorCore: Distance and proximity calculation.', '{"solution.py": "# Phase 2 // Lesson 2.5: Distance Metrics: Euclidean vs Manhattan\n\ndef solve():\n    \"\"\"\n    Verification: Implement both distance metrics in pure Python and compare their outputs on a grid of points.\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.5", "subtopics_count": 4, "verification_criteria": "Implement both distance metrics in pure Python and compare their outputs on a grid of points.", "subtopics": ["2.5.1 Measuring distance between points: straight-line distance vs grid-based distance.", "2.5.2 Euclidean distance: the Pythagorean theorem in action (square root of sum of squared differences).", "2.5.3 Manhattan distance: city-block distance along grid lines (|x1 - x2| + |y1 - y2|).", "2.5.4 When to use which metric: physical navigation vs high-dimensional data similarity."]}'::jsonb, '["Explain how this implementation prevents: Forgetting the square root in Euclidean distance, accidentally calculating squared distance.", "How does Distance Metrics: Euclidean vs Manhattan scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-2-6', 'phase-02-lesson-06-vectors-magnitude-direction-components', 'module-3', 6, 'Lesson 3.6: Vectors: Magnitude, Direction & Components', 'Prerequisites: Lesson 2.5', 'Prerequisites: Lesson 2.5 | Subtopics: 4 items', 'Systems project application', 140, 3, 500.0, 300.0, '# Lesson 2.6: Vectors: Magnitude, Direction & Components

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 2.5
- **Subtopics**:
  - `2.6.1` What is a vector: an arrow pointing from the origin (0, 0) to a coordinate point.
  - `2.6.2` The two key properties: magnitude (the length of the arrow) and direction (where it points).
  - `2.6.3` Vector components: breaking an arrow into horizontal and vertical steps.
  - `2.6.4` Adding vectors: placing arrows head-to-tail to compute net movement.
- **Key Failure Modes & Edge Cases**: Confusing a single scalar number (like speed: 60) with a vector (like velocity: 60 mph North).
- **Verification & Mastery Check**: Build a Vector2D class that implements vector addition and calculates length (magnitude).
- **Project Application**: VectorCore: Core vector data types.', '{"solution.py": "# Phase 2 // Lesson 2.6: Vectors: Magnitude, Direction & Components\n\ndef solve():\n    \"\"\"\n    Verification: Build a Vector2D class that implements vector addition and calculates length (magnitude).\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.6", "subtopics_count": 4, "verification_criteria": "Build a Vector2D class that implements vector addition and calculates length (magnitude).", "subtopics": ["2.6.1 What is a vector: an arrow pointing from the origin (0, 0) to a coordinate point.", "2.6.2 The two key properties: magnitude (the length of the arrow) and direction (where it points).", "2.6.3 Vector components: breaking an arrow into horizontal and vertical steps.", "2.6.4 Adding vectors: placing arrows head-to-tail to compute net movement."]}'::jsonb, '["Explain how this implementation prevents: Confusing a single scalar number (like speed: 60) with a vector (like velocity: 60 mph North).", "How does Vectors: Magnitude, Direction & Components scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-2-7', 'phase-02-lesson-07-vector-dot-product-angular-similarity', 'module-3', 7, 'Lesson 3.7: Vector Dot Product & Angular Similarity', 'Prerequisites: Lesson 2.6', 'Prerequisites: Lesson 2.6 | Subtopics: 4 items', 'Systems project application', 140, 3, 560.0, 350.0, '# Lesson 2.7: Vector Dot Product & Angular Similarity

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 2.6
- **Subtopics**:
  - `2.7.1` The dot product operation: multiplying matching components and summing the results.
  - `2.7.2` Geometric meaning: measuring how much two vectors point in the exact same direction.
  - `2.7.3` Orthogonal vectors: why a dot product of 0 means two vectors are at a perfect 90-degree right angle.
  - `2.7.4` The secret behind AI search: how dot products determine whether a query matches a document.
- **Key Failure Modes & Edge Cases**: Assuming a higher dot product always means closer meaning, without normalizing for vector lengths.
- **Verification & Mastery Check**: Calculate the dot product of two simple 3D vectors manually and verify with Python code.
- **Project Application**: VectorCore: Vector similarity scoring engine.', '{"solution.py": "# Phase 2 // Lesson 2.7: Vector Dot Product & Angular Similarity\n\ndef solve():\n    \"\"\"\n    Verification: Calculate the dot product of two simple 3D vectors manually and verify with Python code.\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.7", "subtopics_count": 4, "verification_criteria": "Calculate the dot product of two simple 3D vectors manually and verify with Python code.", "subtopics": ["2.7.1 The dot product operation: multiplying matching components and summing the results.", "2.7.2 Geometric meaning: measuring how much two vectors point in the exact same direction.", "2.7.3 Orthogonal vectors: why a dot product of 0 means two vectors are at a perfect 90-degree right angle.", "2.7.4 The secret behind AI search: how dot products determine whether a query matches a document."]}'::jsonb, '["Explain how this implementation prevents: Assuming a higher dot product always means closer meaning, without normalizing for vector lengths.", "How does Vector Dot Product & Angular Similarity scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-2-8', 'phase-02-lesson-08-matrices-as-coordinate-transformers', 'module-3', 8, 'Lesson 3.8: Matrices as Coordinate Transformers', 'Prerequisites: Lesson 2.6', 'Prerequisites: Lesson 2.6 | Subtopics: 4 items', 'Systems project application', 140, 3, 620.0, 400.0, '# Lesson 2.8: Matrices as Coordinate Transformers

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 2.6
- **Subtopics**:
  - `2.8.1` What is a matrix: a 2D grid of numbers organized into rows and columns.
  - `2.8.2` Geometric view of matrices: instructions for stretching, rotating, and skewing space.
  - `2.8.3` Basis vectors: how the standard grid unit arrows (1,0) and (0,1) move under a transformation.
  - `2.8.4` Identity matrix: the ''do nothing'' matrix that leaves all coordinates completely unchanged.
- **Key Failure Modes & Edge Cases**: Confusing rows with columns, causing dimensional shape mismatch errors.
- **Verification & Mastery Check**: Write a function that multiplies a 2D coordinate vector by a scaling matrix to double its size.
- **Project Application**: VectorCore: Coordinate transformation engine.', '{"solution.py": "# Phase 2 // Lesson 2.8: Matrices as Coordinate Transformers\n\ndef solve():\n    \"\"\"\n    Verification: Write a function that multiplies a 2D coordinate vector by a scaling matrix to double its size.\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.8", "subtopics_count": 4, "verification_criteria": "Write a function that multiplies a 2D coordinate vector by a scaling matrix to double its size.", "subtopics": ["2.8.1 What is a matrix: a 2D grid of numbers organized into rows and columns.", "2.8.2 Geometric view of matrices: instructions for stretching, rotating, and skewing space.", "2.8.3 Basis vectors: how the standard grid unit arrows (1,0) and (0,1) move under a transformation.", "2.8.4 Identity matrix: the ''do nothing'' matrix that leaves all coordinates completely unchanged."]}'::jsonb, '["Explain how this implementation prevents: Confusing rows with columns, causing dimensional shape mismatch errors.", "How does Matrices as Coordinate Transformers scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-2-9', 'phase-02-lesson-09-matrix-multiplication-row-by-column-mecha', 'module-3', 9, 'Lesson 3.9: Matrix Multiplication: Row-by-Column Mechanics', 'Prerequisites: Lesson 2.8', 'Prerequisites: Lesson 2.8 | Subtopics: 4 items', 'Systems project application', 140, 3, 500.0, 450.0, '# Lesson 2.9: Matrix Multiplication: Row-by-Column Mechanics

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 2.8
- **Subtopics**:
  - `2.9.1` The dot product rule: computing each output element as the dot product of a row and a column.
  - `2.9.2` Shape compatibility rules: why multiplying an (M x K) matrix by a (K x N) matrix yields an (M x N) matrix.
  - `2.9.3` Non-commutative property: why A * B does NOT equal B * A in matrix multiplication.
  - `2.9.4` Why GPUs excel at AI: performing billions of row-by-column multiplications in parallel.
- **Key Failure Modes & Edge Cases**: Attempting to multiply two matrices where the inner dimensions do not match, causing dimension mismatch.
- **Verification & Mastery Check**: Multiply two (2x2) matrices by hand on paper, then write a Python function to verify your answer.
- **Project Application**: VectorCore: Matrix multiplication kernels.', '{"solution.py": "# Phase 2 // Lesson 2.9: Matrix Multiplication: Row-by-Column Mechanics\n\ndef solve():\n    \"\"\"\n    Verification: Multiply two (2x2) matrices by hand on paper, then write a Python function to verify your answer.\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.9", "subtopics_count": 4, "verification_criteria": "Multiply two (2x2) matrices by hand on paper, then write a Python function to verify your answer.", "subtopics": ["2.9.1 The dot product rule: computing each output element as the dot product of a row and a column.", "2.9.2 Shape compatibility rules: why multiplying an (M x K) matrix by a (K x N) matrix yields an (M x N) matrix.", "2.9.3 Non-commutative property: why A * B does NOT equal B * A in matrix multiplication.", "2.9.4 Why GPUs excel at AI: performing billions of row-by-column multiplications in parallel."]}'::jsonb, '["Explain how this implementation prevents: Attempting to multiply two matrices where the inner dimensions do not match, causing dimension mismatch.", "How does Matrix Multiplication: Row-by-Column Mechanics scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-2-10', 'phase-02-lesson-10-transposition-symmetric-matrices', 'module-3', 10, 'Lesson 3.10: Transposition & Symmetric Matrices', 'Prerequisites: Lesson 2.9', 'Prerequisites: Lesson 2.9 | Subtopics: 4 items', 'Systems project application', 140, 3, 560.0, 500.0, '# Lesson 2.10: Transposition & Symmetric Matrices

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 2.9
- **Subtopics**:
  - `2.10.1` Matrix transposition: flipping a matrix over its diagonal so rows become columns.
  - `2.10.2` Shorthand notation: A^T representing the transposed matrix.
  - `2.10.3` Symmetric matrices: special matrices where A equals A^T (like pairwise distance tables).
  - `2.10.4` Practical engineering use: reorienting data shapes so they align properly for matrix multiplication.
- **Key Failure Modes & Edge Cases**: Flipping non-square matrices and expecting their diagonal elements to remain in the same positions.
- **Verification & Mastery Check**: Implement a matrix transpose function that turns an (M x N) nested list into an (N x M) nested list.
- **Project Application**: VectorCore: Data orientation and reshaping.', '{"solution.py": "# Phase 2 // Lesson 2.10: Transposition & Symmetric Matrices\n\ndef solve():\n    \"\"\"\n    Verification: Implement a matrix transpose function that turns an (M x N) nested list into an (N x M) nested list.\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.10", "subtopics_count": 4, "verification_criteria": "Implement a matrix transpose function that turns an (M x N) nested list into an (N x M) nested list.", "subtopics": ["2.10.1 Matrix transposition: flipping a matrix over its diagonal so rows become columns.", "2.10.2 Shorthand notation: A^T representing the transposed matrix.", "2.10.3 Symmetric matrices: special matrices where A equals A^T (like pairwise distance tables).", "2.10.4 Practical engineering use: reorienting data shapes so they align properly for matrix multiplication."]}'::jsonb, '["Explain how this implementation prevents: Flipping non-square matrices and expecting their diagonal elements to remain in the same positions.", "How does Transposition & Symmetric Matrices scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-2-11', 'phase-02-lesson-11-linear-systems-of-equations-gaussian-elim', 'module-3', 11, 'Lesson 3.11: Linear Systems of Equations & Gaussian Elimination', 'Prerequisites: Lesson 2.9', 'Prerequisites: Lesson 2.9 | Subtopics: 4 items', 'Systems project application', 140, 3, 620.0, 550.0, '# Lesson 2.11: Linear Systems of Equations & Gaussian Elimination

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 2.9
- **Subtopics**:
  - `2.11.1` Systems of equations: finding values that simultaneously satisfy multiple linear constraints.
  - `2.11.2` Matrix form: expressing systems cleanly as A * x = b.
  - `2.11.3` Gaussian elimination: systematically adding and subtracting rows to eliminate unknowns.
  - `2.11.4` Unique solutions vs infinite solutions vs no solution.
- **Key Failure Modes & Edge Cases**: Dividing by zero during row elimination when a pivot element is zero, requiring row swapping.
- **Verification & Mastery Check**: Solve a 2-variable linear system using Python code and verify by plugging answers back into formulas.
- **Project Application**: VectorCore: Linear equation solver.', '{"solution.py": "# Phase 2 // Lesson 2.11: Linear Systems of Equations & Gaussian Elimination\n\ndef solve():\n    \"\"\"\n    Verification: Solve a 2-variable linear system using Python code and verify by plugging answers back into formulas\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.11", "subtopics_count": 4, "verification_criteria": "Solve a 2-variable linear system using Python code and verify by plugging answers back into formulas.", "subtopics": ["2.11.1 Systems of equations: finding values that simultaneously satisfy multiple linear constraints.", "2.11.2 Matrix form: expressing systems cleanly as A * x = b.", "2.11.3 Gaussian elimination: systematically adding and subtracting rows to eliminate unknowns.", "2.11.4 Unique solutions vs infinite solutions vs no solution."]}'::jsonb, '["Explain how this implementation prevents: Dividing by zero during row elimination when a pivot element is zero, requiring row swapping.", "How does Linear Systems of Equations & Gaussian Elimination scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-2-12', 'phase-02-lesson-12-determinants-area-scaling-invertibility', 'module-3', 12, 'Lesson 3.12: Determinants: Area Scaling & Invertibility', 'Prerequisites: Lesson 2.8', 'Prerequisites: Lesson 2.8 | Subtopics: 4 items', 'Systems project application', 140, 3, 500.0, 600.0, '# Lesson 2.12: Determinants: Area Scaling & Invertibility

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 2.8
- **Subtopics**:
  - `2.12.1` What is a determinant: a single number measuring how much a matrix stretches or shrinks area.
  - `2.12.2` Geometric intuition: a determinant of 2 doubles area; a determinant of 0 squashes area into a flat line.
  - `2.12.3` Invertibility: why a matrix with a determinant of 0 has no inverse (information was permanently lost).
  - `2.12.4` Calculating the determinant of a simple (2x2) matrix: ad - bc.
- **Key Failure Modes & Edge Cases**: Attempting to invert a matrix whose determinant is 0, causing mathematical singularity errors.
- **Verification & Mastery Check**: Calculate the determinant of a 2x2 matrix and state whether the transformation can be reversed.
- **Project Application**: VectorCore: Matrix invertibility checks.', '{"solution.py": "# Phase 2 // Lesson 2.12: Determinants: Area Scaling & Invertibility\n\ndef solve():\n    \"\"\"\n    Verification: Calculate the determinant of a 2x2 matrix and state whether the transformation can be reversed.\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.12", "subtopics_count": 4, "verification_criteria": "Calculate the determinant of a 2x2 matrix and state whether the transformation can be reversed.", "subtopics": ["2.12.1 What is a determinant: a single number measuring how much a matrix stretches or shrinks area.", "2.12.2 Geometric intuition: a determinant of 2 doubles area; a determinant of 0 squashes area into a flat line.", "2.12.3 Invertibility: why a matrix with a determinant of 0 has no inverse (information was permanently lost).", "2.12.4 Calculating the determinant of a simple (2x2) matrix: ad - bc."]}'::jsonb, '["Explain how this implementation prevents: Attempting to invert a matrix whose determinant is 0, causing mathematical singularity errors.", "How does Determinants: Area Scaling & Invertibility scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-2-13', 'phase-02-lesson-13-intuitive-slope-rate-of-change', 'module-3', 13, 'Lesson 3.13: Intuitive Slope: Rate of Change', 'Prerequisites: Lesson 2.3', 'Prerequisites: Lesson 2.3 | Subtopics: 4 items', 'Systems project application', 140, 3, 560.0, 650.0, '# Lesson 2.13: Intuitive Slope: Rate of Change

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 2.3
- **Subtopics**:
  - `2.13.1` What is a slope: rise over run, or how much output changes when input moves by 1 unit.
  - `2.13.2` Secant lines vs tangent lines: measuring average speed over time vs instantaneous speed on a speedometer.
  - `2.13.3` The fundamental idea of calculus: zooming in so close to a curve that it looks like a straight line.
  - `2.13.4` Why rates of change matter: knowing which direction moves a machine learning model toward lower error.
- **Key Failure Modes & Edge Cases**: Confusing the value of a function at a point with the slope of the function at that point.
- **Verification & Mastery Check**: Compute the average rate of change of f(x) = x^2 between x=2 and x=2.001 using Python arithmetic.
- **Project Application**: VectorCore: Numerical slope approximations.', '{"solution.py": "# Phase 2 // Lesson 2.13: Intuitive Slope: Rate of Change\n\ndef solve():\n    \"\"\"\n    Verification: Compute the average rate of change of f(x) = x^2 between x=2 and x=2.001 using Python arithmetic.\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.13", "subtopics_count": 4, "verification_criteria": "Compute the average rate of change of f(x) = x^2 between x=2 and x=2.001 using Python arithmetic.", "subtopics": ["2.13.1 What is a slope: rise over run, or how much output changes when input moves by 1 unit.", "2.13.2 Secant lines vs tangent lines: measuring average speed over time vs instantaneous speed on a speedometer.", "2.13.3 The fundamental idea of calculus: zooming in so close to a curve that it looks like a straight line.", "2.13.4 Why rates of change matter: knowing which direction moves a machine learning model toward lower error."]}'::jsonb, '["Explain how this implementation prevents: Confusing the value of a function at a point with the slope of the function at that point.", "How does Intuitive Slope: Rate of Change scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-2-14', 'phase-02-lesson-14-derivatives-of-polynomials-power-rule', 'module-3', 14, 'Lesson 3.14: Derivatives of Polynomials: Power Rule', 'Prerequisites: Lesson 2.13', 'Prerequisites: Lesson 2.13 | Subtopics: 4 items', 'Systems project application', 140, 3, 620.0, 700.0, '# Lesson 2.14: Derivatives of Polynomials: Power Rule

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 2.13
- **Subtopics**:
  - `2.14.1` The derivative function f''(x): a formula that tells you the slope at any input x.
  - `2.14.2` The Power Rule: taking the derivative of x^n by multiplying by n and subtracting 1 from exponent (n * x^(n-1)).
  - `2.14.3` Constant rules: why the derivative of a flat constant number is always 0.
  - `2.14.4` Sum rule: finding derivatives of multi-term polynomials by differentiating term-by-term.
- **Key Failure Modes & Edge Cases**: Applying the power rule to exponential functions like 2^x instead of polynomial functions like x^2.
- **Verification & Mastery Check**: Write a Python function that computes both the exact analytical derivative and the numerical derivative of x^3.
- **Project Application**: VectorCore: Symbolic and numerical derivatives.', '{"solution.py": "# Phase 2 // Lesson 2.14: Derivatives of Polynomials: Power Rule\n\ndef solve():\n    \"\"\"\n    Verification: Write a Python function that computes both the exact analytical derivative and the numerical derivat\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.14", "subtopics_count": 4, "verification_criteria": "Write a Python function that computes both the exact analytical derivative and the numerical derivative of x^3.", "subtopics": ["2.14.1 The derivative function f''(x): a formula that tells you the slope at any input x.", "2.14.2 The Power Rule: taking the derivative of x^n by multiplying by n and subtracting 1 from exponent (n * x^(n-1)).", "2.14.3 Constant rules: why the derivative of a flat constant number is always 0.", "2.14.4 Sum rule: finding derivatives of multi-term polynomials by differentiating term-by-term."]}'::jsonb, '["Explain how this implementation prevents: Applying the power rule to exponential functions like 2^x instead of polynomial functions like x^2.", "How does Derivatives of Polynomials: Power Rule scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-2-15', 'phase-02-lesson-15-the-chain-rule-combining-derivatives', 'module-3', 15, 'Lesson 3.15: The Chain Rule: Combining Derivatives', 'Prerequisites: Lesson 2.14', 'Prerequisites: Lesson 2.14 | Subtopics: 4 items', 'Systems project application', 140, 3, 500.0, 750.0, '# Lesson 2.15: The Chain Rule: Combining Derivatives

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 2.14
- **Subtopics**:
  - `2.15.1` Composite functions: functions nested inside other functions (f(g(x))).
  - `2.15.2` The Chain Rule intuition: multiplying the rates of change along each link in the chain.
  - `2.15.3` Real-world analogy: gear ratios in a bicycle (pedal to chainwheel to wheel speed).
  - `2.15.4` The mathematical foundation of deep learning: how error signals flow backward through neural layers.
- **Key Failure Modes & Edge Cases**: Forgetting to multiply by the derivative of the inner function, a classic calculus mistake.
- **Verification & Mastery Check**: Calculate the derivative of f(x) = (3x + 2)^2 using the chain rule and verify with numerical steps.
- **Project Application**: VectorCore: Chain rule backpropagation foundations.', '{"solution.py": "# Phase 2 // Lesson 2.15: The Chain Rule: Combining Derivatives\n\ndef solve():\n    \"\"\"\n    Verification: Calculate the derivative of f(x) = (3x + 2)^2 using the chain rule and verify with numerical steps.\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.15", "subtopics_count": 4, "verification_criteria": "Calculate the derivative of f(x) = (3x + 2)^2 using the chain rule and verify with numerical steps.", "subtopics": ["2.15.1 Composite functions: functions nested inside other functions (f(g(x))).", "2.15.2 The Chain Rule intuition: multiplying the rates of change along each link in the chain.", "2.15.3 Real-world analogy: gear ratios in a bicycle (pedal to chainwheel to wheel speed).", "2.15.4 The mathematical foundation of deep learning: how error signals flow backward through neural layers."]}'::jsonb, '["Explain how this implementation prevents: Forgetting to multiply by the derivative of the inner function, a classic calculus mistake.", "How does The Chain Rule: Combining Derivatives scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-2-16', 'phase-02-lesson-16-partial-derivatives-multi-variable-gradie', 'module-3', 16, 'Lesson 3.16: Partial Derivatives: Multi-Variable Gradients', 'Prerequisites: Lesson 2.15', 'Prerequisites: Lesson 2.15 | Subtopics: 4 items', 'Systems project application', 140, 3, 560.0, 800.0, '# Lesson 2.16: Partial Derivatives: Multi-Variable Gradients

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 2.15
- **Subtopics**:
  - `2.16.1` Functions of multiple variables: functions taking multiple inputs, like cost(price, quantity).
  - `2.16.2` The partial derivative trick: treating all other variables as frozen constants while differentiating one.
  - `2.16.3` Notation: ∂f/∂x measuring sensitivity to x, and ∂f/∂y measuring sensitivity to y.
  - `2.16.4` Interpreting results: which input knob has the biggest impact on the final output.
- **Key Failure Modes & Edge Cases**: Accidentally changing multiple variables simultaneously instead of holding one variable strictly constant.
- **Verification & Mastery Check**: Given f(x, y) = x^2 * y + 3y, calculate both partial derivatives at the point (2, 5).
- **Project Application**: VectorCore: Multi-variable sensitivity analysis.', '{"solution.py": "# Phase 2 // Lesson 2.16: Partial Derivatives: Multi-Variable Gradients\n\ndef solve():\n    \"\"\"\n    Verification: Given f(x, y) = x^2 * y + 3y, calculate both partial derivatives at the point (2, 5).\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.16", "subtopics_count": 4, "verification_criteria": "Given f(x, y) = x^2 * y + 3y, calculate both partial derivatives at the point (2, 5).", "subtopics": ["2.16.1 Functions of multiple variables: functions taking multiple inputs, like cost(price, quantity).", "2.16.2 The partial derivative trick: treating all other variables as frozen constants while differentiating one.", "2.16.3 Notation: \u2202f/\u2202x measuring sensitivity to x, and \u2202f/\u2202y measuring sensitivity to y.", "2.16.4 Interpreting results: which input knob has the biggest impact on the final output."]}'::jsonb, '["Explain how this implementation prevents: Accidentally changing multiple variables simultaneously instead of holding one variable strictly constant.", "How does Partial Derivatives: Multi-Variable Gradients scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-2-17', 'phase-02-lesson-17-the-gradient-vector-direction-of-steepest', 'module-3', 17, 'Lesson 3.17: The Gradient Vector: Direction of Steepest Ascent', 'Prerequisites: Lesson 2.16', 'Prerequisites: Lesson 2.16 | Subtopics: 4 items', 'Systems project application', 140, 3, 620.0, 850.0, '# Lesson 2.17: The Gradient Vector: Direction of Steepest Ascent

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 2.16
- **Subtopics**:
  - `2.17.1` Packing partial derivatives into a vector: the gradient ∇f.
  - `2.17.2` Geometric meaning: the gradient arrow always points directly toward the steepest uphill climb.
  - `2.17.3` Magnitude of the gradient: how steep the hill is at that exact coordinate.
  - `2.17.4` Negative gradient: pointing directly in the opposite direction—the fastest way downhill toward minimum error.
- **Key Failure Modes & Edge Cases**: Assuming the gradient points downhill; the gradient points uphill, so we must subtract it to go down!
- **Verification & Mastery Check**: Compute the gradient vector for a 2D bowl function at point (3, 4) and print the downhill direction.
- **Project Application**: VectorCore: Gradient vector computation.', '{"solution.py": "# Phase 2 // Lesson 2.17: The Gradient Vector: Direction of Steepest Ascent\n\ndef solve():\n    \"\"\"\n    Verification: Compute the gradient vector for a 2D bowl function at point (3, 4) and print the downhill direction.\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.17", "subtopics_count": 4, "verification_criteria": "Compute the gradient vector for a 2D bowl function at point (3, 4) and print the downhill direction.", "subtopics": ["2.17.1 Packing partial derivatives into a vector: the gradient \u2207f.", "2.17.2 Geometric meaning: the gradient arrow always points directly toward the steepest uphill climb.", "2.17.3 Magnitude of the gradient: how steep the hill is at that exact coordinate.", "2.17.4 Negative gradient: pointing directly in the opposite direction\u2014the fastest way downhill toward minimum error."]}'::jsonb, '["Explain how this implementation prevents: Assuming the gradient points downhill; the gradient points uphill, so we must subtract it to go down!", "How does The Gradient Vector: Direction of Steepest Ascent scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-2-18', 'phase-02-lesson-18-gradient-descent-intuition-walking-downhi', 'module-3', 18, 'Lesson 3.18: Gradient Descent Intuition: Walking Downhill', 'Prerequisites: Lesson 2.17', 'Prerequisites: Lesson 2.17 | Subtopics: 4 items', 'Systems project application', 140, 3, 500.0, 900.0, '# Lesson 2.18: Gradient Descent Intuition: Walking Downhill

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 2.17
- **Subtopics**:
  - `2.18.1` The fog on the mountain metaphor: finding your way down to the valley by feeling the slope under your boots.
  - `2.18.2` The update formula: new_position = old_position - (learning_rate * gradient).
  - `2.18.3` The learning rate (step size): taking small careful steps vs large reckless leaps.
  - `2.18.4` Visualizing convergence: watching parameters step closer and closer to the bottom of the bowl.
- **Key Failure Modes & Edge Cases**: Setting the learning rate too large, causing the algorithm to oscillate wildly and explode to infinity.
- **Verification & Mastery Check**: Implement a 20-step gradient descent loop in Python that finds the minimum of f(x) = (x - 4)^2.
- **Project Application**: VectorCore: 1D Gradient descent optimizer.', '{"solution.py": "# Phase 2 // Lesson 2.18: Gradient Descent Intuition: Walking Downhill\n\ndef solve():\n    \"\"\"\n    Verification: Implement a 20-step gradient descent loop in Python that finds the minimum of f(x) = (x - 4)^2.\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.18", "subtopics_count": 4, "verification_criteria": "Implement a 20-step gradient descent loop in Python that finds the minimum of f(x) = (x - 4)^2.", "subtopics": ["2.18.1 The fog on the mountain metaphor: finding your way down to the valley by feeling the slope under your boots.", "2.18.2 The update formula: new_position = old_position - (learning_rate * gradient).", "2.18.3 The learning rate (step size): taking small careful steps vs large reckless leaps.", "2.18.4 Visualizing convergence: watching parameters step closer and closer to the bottom of the bowl."]}'::jsonb, '["Explain how this implementation prevents: Setting the learning rate too large, causing the algorithm to oscillate wildly and explode to infinity.", "How does Gradient Descent Intuition: Walking Downhill scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-2-19', 'phase-02-lesson-19-probability-basics-sample-spaces-events', 'module-3', 19, 'Lesson 3.19: Probability Basics: Sample Spaces & Events', 'Prerequisites: Phase 0', 'Prerequisites: Phase 0 | Subtopics: 4 items', 'Systems project application', 140, 3, 560.0, 950.0, '# Lesson 2.19: Probability Basics: Sample Spaces & Events

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Phase 0
- **Subtopics**:
  - `2.19.1` Quantifying uncertainty: assigning numbers between 0.0 (impossible) and 1.0 (certain) to outcomes.
  - `2.19.2` Sample spaces: the complete collection of all possible outcomes.
  - `2.19.3` Events: specific outcomes we are interested in measuring.
  - `2.19.4` Probability axioms: probabilities must sum to 1.0; no probability can ever be negative.
- **Key Failure Modes & Edge Cases**: Assigning probabilities that sum to more than 1.0, breaking fundamental probability laws.
- **Verification & Mastery Check**: Simulate rolling two dice 10,000 times in Python and verify that the empirical probabilities match theory.
- **Project Application**: VectorCore: Probability simulation.', '{"solution.py": "# Phase 2 // Lesson 2.19: Probability Basics: Sample Spaces & Events\n\ndef solve():\n    \"\"\"\n    Verification: Simulate rolling two dice 10,000 times in Python and verify that the empirical probabilities match t\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.19", "subtopics_count": 4, "verification_criteria": "Simulate rolling two dice 10,000 times in Python and verify that the empirical probabilities match theory.", "subtopics": ["2.19.1 Quantifying uncertainty: assigning numbers between 0.0 (impossible) and 1.0 (certain) to outcomes.", "2.19.2 Sample spaces: the complete collection of all possible outcomes.", "2.19.3 Events: specific outcomes we are interested in measuring.", "2.19.4 Probability axioms: probabilities must sum to 1.0; no probability can ever be negative."]}'::jsonb, '["Explain how this implementation prevents: Assigning probabilities that sum to more than 1.0, breaking fundamental probability laws.", "How does Probability Basics: Sample Spaces & Events scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-2-20', 'phase-02-lesson-20-independent-vs-dependent-events-condition', 'module-3', 20, 'Lesson 3.20: Independent vs Dependent Events & Conditional Prob', 'Prerequisites: Lesson 2.19', 'Prerequisites: Lesson 2.19 | Subtopics: 4 items', 'Systems project application', 140, 3, 620.0, 1000.0, '# Lesson 2.20: Independent vs Dependent Events & Conditional Prob

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 2.19
- **Subtopics**:
  - `2.20.1` Independent events: when one outcome has zero influence on another (like coin flips).
  - `2.20.2` Dependent events: when the outcome of the first event changes the odds of the second (drawing cards without replacement).
  - `2.20.3` Conditional probability P(A|B): what are the odds of A, given that we already know B happened?
  - `2.20.4` AI context: predicting the next word given the preceding sentence context.
- **Key Failure Modes & Edge Cases**: Treating dependent events as independent, leading to massive underestimation of risk.
- **Verification & Mastery Check**: Calculate the conditional probability that an email is spam given that it contains the word ''free''.
- **Project Application**: VectorCore: Conditional probability models.', '{"solution.py": "# Phase 2 // Lesson 2.20: Independent vs Dependent Events & Conditional Prob\n\ndef solve():\n    \"\"\"\n    Verification: Calculate the conditional probability that an email is spam given that it contains the word ''free''.\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.20", "subtopics_count": 4, "verification_criteria": "Calculate the conditional probability that an email is spam given that it contains the word ''free''.", "subtopics": ["2.20.1 Independent events: when one outcome has zero influence on another (like coin flips).", "2.20.2 Dependent events: when the outcome of the first event changes the odds of the second (drawing cards without replacement).", "2.20.3 Conditional probability P(A|B): what are the odds of A, given that we already know B happened?", "2.20.4 AI context: predicting the next word given the preceding sentence context."]}'::jsonb, '["Explain how this implementation prevents: Treating dependent events as independent, leading to massive underestimation of risk.", "How does Independent vs Dependent Events & Conditional Prob scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-2-21', 'phase-02-lesson-21-mean-median-mode-central-tendency', 'module-3', 21, 'Lesson 3.21: Mean, Median & Mode: Central Tendency', 'Prerequisites: Lesson 2.19', 'Prerequisites: Lesson 2.19 | Subtopics: 5 items', 'Systems project application', 140, 3, 500.0, 1050.0, '# Lesson 2.21: Mean, Median & Mode: Central Tendency

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 2.19
- **Subtopics**:
  - `2.21.1` Summarizing datasets: finding the center of a group of numbers.
  - `2.21.2` The Mean (average): summing all values and dividing by total count.
  - `2.21.3` The Median: the physical middle value when numbers are sorted in order.
  - `2.21.4` The Mode: the most frequently occurring value in the dataset.
  - `2.21.5` Handling outliers: why median is far more reliable than mean when measuring response latency.
- **Key Failure Modes & Edge Cases**: Relying solely on the average latency of an API, hiding the fact that 5% of users experience 10-second lag.
- **Verification & Mastery Check**: Write a function that calculates mean, median, and 95th percentile latency from a list of request times.
- **Project Application**: VectorCore: Latency summary statistics.', '{"solution.py": "# Phase 2 // Lesson 2.21: Mean, Median & Mode: Central Tendency\n\ndef solve():\n    \"\"\"\n    Verification: Write a function that calculates mean, median, and 95th percentile latency from a list of request ti\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.21", "subtopics_count": 5, "verification_criteria": "Write a function that calculates mean, median, and 95th percentile latency from a list of request times.", "subtopics": ["2.21.1 Summarizing datasets: finding the center of a group of numbers.", "2.21.2 The Mean (average): summing all values and dividing by total count.", "2.21.3 The Median: the physical middle value when numbers are sorted in order.", "2.21.4 The Mode: the most frequently occurring value in the dataset.", "2.21.5 Handling outliers: why median is far more reliable than mean when measuring response latency."]}'::jsonb, '["Explain how this implementation prevents: Relying solely on the average latency of an API, hiding the fact that 5% of users experience 10-second lag.", "How does Mean, Median & Mode: Central Tendency scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-2-22', 'phase-02-lesson-22-variance-standard-deviation-spread-of-dat', 'module-3', 22, 'Lesson 3.22: Variance & Standard Deviation: Spread of Data', 'Prerequisites: Lesson 2.21', 'Prerequisites: Lesson 2.21 | Subtopics: 4 items', 'Systems project application', 140, 3, 560.0, 1100.0, '# Lesson 2.22: Variance & Standard Deviation: Spread of Data

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 2.21
- **Subtopics**:
  - `2.22.1` Measuring spread: how dispersed numbers are around their average.
  - `2.22.2` Variance: the average squared difference from the mean.
  - `2.22.3` Standard deviation: the square root of variance, returning the spread back to original units.
  - `2.22.4` Consistent systems: why low standard deviation is the hallmark of reliable software systems.
- **Key Failure Modes & Edge Cases**: Forgetting to take the square root of variance, confusing squared units with actual data units.
- **Verification & Mastery Check**: Implement variance and standard deviation from scratch in pure Python without using math libraries.
- **Project Application**: VectorCore: Distribution dispersion metrics.', '{"solution.py": "# Phase 2 // Lesson 2.22: Variance & Standard Deviation: Spread of Data\n\ndef solve():\n    \"\"\"\n    Verification: Implement variance and standard deviation from scratch in pure Python without using math libraries.\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.22", "subtopics_count": 4, "verification_criteria": "Implement variance and standard deviation from scratch in pure Python without using math libraries.", "subtopics": ["2.22.1 Measuring spread: how dispersed numbers are around their average.", "2.22.2 Variance: the average squared difference from the mean.", "2.22.3 Standard deviation: the square root of variance, returning the spread back to original units.", "2.22.4 Consistent systems: why low standard deviation is the hallmark of reliable software systems."]}'::jsonb, '["Explain how this implementation prevents: Forgetting to take the square root of variance, confusing squared units with actual data units.", "How does Variance & Standard Deviation: Spread of Data scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-2-23', 'phase-02-lesson-23-normal-gaussian-distribution-the-bell-cur', 'module-3', 23, 'Lesson 3.23: Normal Gaussian Distribution: The Bell Curve', 'Prerequisites: Lesson 2.22', 'Prerequisites: Lesson 2.22 | Subtopics: 4 items', 'Systems project application', 140, 3, 620.0, 1150.0, '# Lesson 2.23: Normal Gaussian Distribution: The Bell Curve

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 2.22
- **Subtopics**:
  - `2.23.1` The classic bell curve: why natural processes and measurement errors cluster around the center.
  - `2.23.2` Mean (center) and Standard Deviation (width) as the two parameters defining the entire curve.
  - `2.23.3` The 68-95-99.7 empirical rule: what percentage of data falls within 1, 2, and 3 standard deviations.
  - `2.23.4` Standardizing scores (Z-scores): converting arbitrary numbers into distance from the mean.
- **Key Failure Modes & Edge Cases**: Assuming all software metrics follow normal curves, when server traffic and response times are heavily skewed.
- **Verification & Mastery Check**: Generate 1,000 normal random samples in Python and verify that ~68% fall within 1 standard deviation.
- **Project Application**: VectorCore: Statistical distributions.', '{"solution.py": "# Phase 2 // Lesson 2.23: Normal Gaussian Distribution: The Bell Curve\n\ndef solve():\n    \"\"\"\n    Verification: Generate 1,000 normal random samples in Python and verify that ~68% fall within 1 standard deviation\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.23", "subtopics_count": 4, "verification_criteria": "Generate 1,000 normal random samples in Python and verify that ~68% fall within 1 standard deviation.", "subtopics": ["2.23.1 The classic bell curve: why natural processes and measurement errors cluster around the center.", "2.23.2 Mean (center) and Standard Deviation (width) as the two parameters defining the entire curve.", "2.23.3 The 68-95-99.7 empirical rule: what percentage of data falls within 1, 2, and 3 standard deviations.", "2.23.4 Standardizing scores (Z-scores): converting arbitrary numbers into distance from the mean."]}'::jsonb, '["Explain how this implementation prevents: Assuming all software metrics follow normal curves, when server traffic and response times are heavily skewed.", "How does Normal Gaussian Distribution: The Bell Curve scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-2-24', 'phase-02-lesson-24-softmax-function-numbers-to-probabilities', 'module-3', 24, 'Lesson 3.24: Softmax Function: Numbers to Probabilities', 'Prerequisites: Lesson 2.3, Lesson 2.20', 'Prerequisites: Lesson 2.3, Lesson 2.20 | Subtopics: 4 items', 'Systems project application', 140, 3, 500.0, 1200.0, '# Lesson 2.24: Softmax Function: Numbers to Probabilities

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 2.3, Lesson 2.20
- **Subtopics**:
  - `2.24.1` The challenge of raw model outputs (logits): unconstrained positive and negative real numbers.
  - `2.24.2` The Softmax formula: exponentiating numbers to make them strictly positive, then dividing by their sum.
  - `2.24.3` Two magical properties: all outputs are between 0 and 1, and the entire output array sums to exactly 1.0.
  - `2.24.4` The temperature parameter: controlling whether probabilities are sharp (confident) or smooth (creative).
- **Key Failure Modes & Edge Cases**: Numerical overflow: exponentiating large numbers like e^1000 causing float overflow to infinity.
- **Verification & Mastery Check**: Implement a numerically stable softmax function that subtracts the maximum logit before exponentiating.
- **Project Application**: VectorCore: Logit-to-probability converter.', '{"solution.py": "# Phase 2 // Lesson 2.24: Softmax Function: Numbers to Probabilities\n\ndef solve():\n    \"\"\"\n    Verification: Implement a numerically stable softmax function that subtracts the maximum logit before exponentiati\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.24", "subtopics_count": 4, "verification_criteria": "Implement a numerically stable softmax function that subtracts the maximum logit before exponentiating.", "subtopics": ["2.24.1 The challenge of raw model outputs (logits): unconstrained positive and negative real numbers.", "2.24.2 The Softmax formula: exponentiating numbers to make them strictly positive, then dividing by their sum.", "2.24.3 Two magical properties: all outputs are between 0 and 1, and the entire output array sums to exactly 1.0.", "2.24.4 The temperature parameter: controlling whether probabilities are sharp (confident) or smooth (creative)."]}'::jsonb, '["Explain how this implementation prevents: Numerical overflow: exponentiating large numbers like e^1000 causing float overflow to infinity.", "How does Softmax Function: Numbers to Probabilities scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-2-25', 'phase-02-lesson-25-cross-entropy-loss-measuring-prediction-e', 'module-3', 25, 'Lesson 3.25: Cross-Entropy Loss: Measuring Prediction Error', 'Prerequisites: Lesson 2.24', 'Prerequisites: Lesson 2.24 | Subtopics: 4 items', 'Systems project application', 140, 3, 560.0, 1250.0, '# Lesson 2.25: Cross-Entropy Loss: Measuring Prediction Error

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 2.24
- **Subtopics**:
  - `2.25.1` Loss functions: mathematical scorecards that tell an AI model how wrong its predictions were.
  - `2.25.2` Cross-entropy loss: comparing the predicted probability distribution against the true target label.
  - `2.25.3` The negative log penalty: heavily penalizing models that are confidently wrong.
  - `2.25.4` Why cross-entropy guides neural networks to learn faster and more accurately than squared error.
- **Key Failure Modes & Edge Cases**: Computing log(0.0) when a predicted probability is 0, which crashes with a math domain error.
- **Verification & Mastery Check**: Calculate cross-entropy loss for two scenarios: a confident correct guess vs a confident incorrect guess.
- **Project Application**: VectorCore: Classification loss calculation.', '{"solution.py": "# Phase 2 // Lesson 2.25: Cross-Entropy Loss: Measuring Prediction Error\n\ndef solve():\n    \"\"\"\n    Verification: Calculate cross-entropy loss for two scenarios: a confident correct guess vs a confident incorrect g\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.25", "subtopics_count": 4, "verification_criteria": "Calculate cross-entropy loss for two scenarios: a confident correct guess vs a confident incorrect guess.", "subtopics": ["2.25.1 Loss functions: mathematical scorecards that tell an AI model how wrong its predictions were.", "2.25.2 Cross-entropy loss: comparing the predicted probability distribution against the true target label.", "2.25.3 The negative log penalty: heavily penalizing models that are confidently wrong.", "2.25.4 Why cross-entropy guides neural networks to learn faster and more accurately than squared error."]}'::jsonb, '["Explain how this implementation prevents: Computing log(0.0) when a predicted probability is 0, which crashes with a math domain error.", "How does Cross-Entropy Loss: Measuring Prediction Error scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, phase_id = EXCLUDED.phase_id, order_index = EXCLUDED.order_index, title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, cs_foundation = EXCLUDED.cs_foundation, ai_convergence = EXCLUDED.ai_convergence, xp_reward = EXCLUDED.xp_reward, level_required = EXCLUDED.level_required, position_x = EXCLUDED.position_x, position_y = EXCLUDED.position_y, handbook_markdown = EXCLUDED.handbook_markdown, starter_code = EXCLUDED.starter_code, test_suite = EXCLUDED.test_suite, defense_prompts = EXCLUDED.defense_prompts;
