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
- **Project Application**: VectorCore: Data orientation and reshaping.', '{"solution.py": "# Phase 2 // Lesson 2.10: Transposition & Symmetric Matrices\n\ndef solve():\n    \"\"\"\n    Verification: Implement a matrix transpose function that turns an (M x N) nested list into an (N x M) nested list.\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.10", "subtopics_count": 4, "verification_criteria": "Implement a matrix transpose function that turns an (M x N) nested list into an (N x M) nested list.", "subtopics": ["2.10.1 Matrix transposition: flipping a matrix over its diagonal so rows become columns.", "2.10.2 Shorthand notation: A^T representing the transposed matrix.", "2.10.3 Symmetric matrices: special matrices where A equals A^T (like pairwise distance tables).", "2.10.4 Practical engineering use: reorienting data shapes so they align properly for matrix multiplication."]}'::jsonb, '["Explain how this implementation prevents: Flipping non-square matrices and expecting their diagonal elements to remain in the same positions.", "How does Transposition & Symmetric Matrices scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, phase_id = EXCLUDED.phase_id, order_index = EXCLUDED.order_index, title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, cs_foundation = EXCLUDED.cs_foundation, ai_convergence = EXCLUDED.ai_convergence, xp_reward = EXCLUDED.xp_reward, level_required = EXCLUDED.level_required, position_x = EXCLUDED.position_x, position_y = EXCLUDED.position_y, handbook_markdown = EXCLUDED.handbook_markdown, starter_code = EXCLUDED.starter_code, test_suite = EXCLUDED.test_suite, defense_prompts = EXCLUDED.defense_prompts;
