INSERT INTO curriculum_nodes (id, slug, phase_id, order_index, title, subtitle, cs_foundation, ai_convergence, xp_reward, level_required, position_x, position_y, handbook_markdown, starter_code, test_suite, defense_prompts) VALUES
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
- **Project Application**: VectorCore: Classification loss calculation.', '{"solution.py": "# Phase 2 // Lesson 2.25: Cross-Entropy Loss: Measuring Prediction Error\n\ndef solve():\n    \"\"\"\n    Verification: Calculate cross-entropy loss for two scenarios: a confident correct guess vs a confident incorrect g\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.25", "subtopics_count": 4, "verification_criteria": "Calculate cross-entropy loss for two scenarios: a confident correct guess vs a confident incorrect guess.", "subtopics": ["2.25.1 Loss functions: mathematical scorecards that tell an AI model how wrong its predictions were.", "2.25.2 Cross-entropy loss: comparing the predicted probability distribution against the true target label.", "2.25.3 The negative log penalty: heavily penalizing models that are confidently wrong.", "2.25.4 Why cross-entropy guides neural networks to learn faster and more accurately than squared error."]}'::jsonb, '["Explain how this implementation prevents: Computing log(0.0) when a predicted probability is 0, which crashes with a math domain error.", "How does Cross-Entropy Loss: Measuring Prediction Error scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-2-26', 'phase-02-lesson-26-propositional-logic-truth-tables-logical-', 'module-3', 26, 'Lesson 3.26: Propositional Logic, Truth Tables, & Logical Equivalences', 'Prerequisites: Phase 1', 'Prerequisites: Phase 1 | Subtopics: 4 items', 'Systems project application', 140, 3, 620.0, 1300.0, '# Lesson 2.26: Propositional Logic, Truth Tables, & Logical Equivalences

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Phase 1
- **Subtopics**:
  - `2.26.1` Atomic propositions, logical connectives: AND, OR, NOT, Implication ($P \implies Q$), Biconditional ($P \iff Q$).
  - `2.26.2` Truth tables and semantic verification of tautologies, contradictions, and contingencies.
  - `2.26.3` De Morgan''s Laws for logic: $
eg(P \land Q) \iff 
eg P \lor 
eg Q$; equivalence to set complements.
  - `2.26.4` Boolean algebra in systems: simplifying nested conditional code branches algebraically.
- **Key Failure Modes & Edge Cases**: Writing nested if-else branches that evaluate to tautologies or unreachable dead-code blocks.
- **Verification & Mastery Check**: Simplify an ugly 5-level nested conditional statement using boolean algebra and verify equivalence via truth table.
- **Project Application**: DevAudit: AST conditional simplification rule.', '{"solution.py": "# Phase 2 // Lesson 2.26: Propositional Logic, Truth Tables, & Logical Equivalences\n\ndef solve():\n    \"\"\"\n    Verification: Simplify an ugly 5-level nested conditional statement using boolean algebra and verify equivalence v\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.26", "subtopics_count": 4, "verification_criteria": "Simplify an ugly 5-level nested conditional statement using boolean algebra and verify equivalence via truth table.", "subtopics": ["2.26.1 Atomic propositions, logical connectives: AND, OR, NOT, Implication ($P \\implies Q$), Biconditional ($P \\iff Q$).", "2.26.2 Truth tables and semantic verification of tautologies, contradictions, and contingencies.", "2.26.3 De Morgan''s Laws for logic: $", "2.26.4 Boolean algebra in systems: simplifying nested conditional code branches algebraically."]}'::jsonb, '["Explain how this implementation prevents: Writing nested if-else branches that evaluate to tautologies or unreachable dead-code blocks.", "How does Propositional Logic, Truth Tables, & Logical Equivalences scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-2-27', 'phase-02-lesson-27-predicate-logic-quantifiers-logical-negat', 'module-3', 27, 'Lesson 3.27: Predicate Logic, Quantifiers, & Logical Negation', 'Prerequisites: Lesson 2.26', 'Prerequisites: Lesson 2.26 | Subtopics: 4 items', 'Systems project application', 140, 3, 500.0, 1350.0, '# Lesson 2.27: Predicate Logic, Quantifiers, & Logical Negation

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 2.26
- **Subtopics**:
  - `2.27.1` Predicates as parameterized truth functions: $P(x)$ mapping domain elements to booleans.
  - `2.27.2` Universal ($orall$) and Existential ($\exists$) quantifiers: semantics over finite and infinite domains.
  - `2.27.3` Negating quantified statements: $
eg(orall x, P(x)) \iff \exists x, 
eg P(x)$; domain edge cases.
  - `2.27.4` Nested quantifiers: order of quantification ($orall x \exists y$ vs $\exists y orall x$) and mathematical meaning.
- **Key Failure Modes & Edge Cases**: Failing to recognize that negating ''all users are active'' is ''at least one user is inactive'' (not ''all users are inactive'').
- **Verification & Mastery Check**: Translate a natural language business specification with nested quantifiers into formal predicate logic.
- **Project Application**: DevAudit: Static invariant validation.', '{"solution.py": "# Phase 2 // Lesson 2.27: Predicate Logic, Quantifiers, & Logical Negation\n\ndef solve():\n    \"\"\"\n    Verification: Translate a natural language business specification with nested quantifiers into formal predicate lo\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.27", "subtopics_count": 4, "verification_criteria": "Translate a natural language business specification with nested quantifiers into formal predicate logic.", "subtopics": ["2.27.1 Predicates as parameterized truth functions: $P(x)$ mapping domain elements to booleans.", "2.27.2 Universal ($\forall$) and Existential ($\\exists$) quantifiers: semantics over finite and infinite domains.", "2.27.3 Negating quantified statements: $", "2.27.4 Nested quantifiers: order of quantification ($\forall x \\exists y$ vs $\\exists y \forall x$) and mathematical meaning."]}'::jsonb, '["Explain how this implementation prevents: Failing to recognize that negating ''all users are active'' is ''at least one user is inactive'' (not ''all users are inactiv", "How does Predicate Logic, Quantifiers, & Logical Negation scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-2-28', 'phase-02-lesson-28-direct-proofs-contrapositive-proof-by-con', 'module-3', 28, 'Lesson 3.28: Direct Proofs, Contrapositive, & Proof by Contradiction', 'Prerequisites: Lesson 2.26', 'Prerequisites: Lesson 2.26 | Subtopics: 4 items', 'Systems project application', 140, 3, 560.0, 1400.0, '# Lesson 2.28: Direct Proofs, Contrapositive, & Proof by Contradiction

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 2.26
- **Subtopics**:
  - `2.28.1` The architecture of formal mathematical proofs: axioms, definitions, hypotheses, and conclusions.
  - `2.28.2` Direct proof methodology: assuming hypothesis $P$ and deriving conclusion $Q$ through logical deduction.
  - `2.28.3` Proof by Contraposition: proving $P \implies Q$ by proving $
eg Q \implies 
eg P$.
  - `2.28.4` Proof by Contradiction (Reductio ad Absurdum): assuming $
eg P$ and deriving an impossible contradiction ($R \land 
eg R$).
- **Key Failure Modes & Edge Cases**: Assuming that a property holding true for 100 test cases constitutes a mathematical proof.
- **Verification & Mastery Check**: Prove formally that if $3n+2$ is odd, then $n$ is odd, using proof by contraposition.
- **Project Application**: MathKit: Algorithm verification proofs.', '{"solution.py": "# Phase 2 // Lesson 2.28: Direct Proofs, Contrapositive, & Proof by Contradiction\n\ndef solve():\n    \"\"\"\n    Verification: Prove formally that if $3n+2$ is odd, then $n$ is odd, using proof by contraposition.\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.28", "subtopics_count": 4, "verification_criteria": "Prove formally that if $3n+2$ is odd, then $n$ is odd, using proof by contraposition.", "subtopics": ["2.28.1 The architecture of formal mathematical proofs: axioms, definitions, hypotheses, and conclusions.", "2.28.2 Direct proof methodology: assuming hypothesis $P$ and deriving conclusion $Q$ through logical deduction.", "2.28.3 Proof by Contraposition: proving $P \\implies Q$ by proving $", "2.28.4 Proof by Contradiction (Reductio ad Absurdum): assuming $"]}'::jsonb, '["Explain how this implementation prevents: Assuming that a property holding true for 100 test cases constitutes a mathematical proof.", "How does Direct Proofs, Contrapositive, & Proof by Contradiction scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-2-29', 'phase-02-lesson-29-mathematical-induction-loop-invariants', 'module-3', 29, 'Lesson 3.29: Mathematical Induction & Loop Invariants', 'Prerequisites: Lesson 2.28', 'Prerequisites: Lesson 2.28 | Subtopics: 4 items', 'Systems project application', 140, 3, 620.0, 1450.0, '# Lesson 2.29: Mathematical Induction & Loop Invariants

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 2.28
- **Subtopics**:
  - `2.29.1` Principle of Mathematical Induction: Base Case $P(0)$ and Inductive Step $P(k) \implies P(k+1)$.
  - `2.29.2` Strong Induction: assuming all preceding cases $P(0), \dots, P(k)$ hold to prove $P(k+1)$.
  - `2.29.3` Loop Invariants in software engineering: Initialization, Maintenance, and Termination guarantees.
  - `2.29.4` Proving algorithm correctness: proving binary search and sorting termination via invariants.
- **Key Failure Modes & Edge Cases**: Writing recursive functions with subtle termination bugs where the base case fails to cover all branches.
- **Verification & Mastery Check**: Prove formally using loop invariants that binary search terminates with the correct index in $O(\log n)$ steps.
- **Project Application**: Foundation for Phase 3 algorithm correctness.', '{"solution.py": "# Phase 2 // Lesson 2.29: Mathematical Induction & Loop Invariants\n\ndef solve():\n    \"\"\"\n    Verification: Prove formally using loop invariants that binary search terminates with the correct index in $O(\\log\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.29", "subtopics_count": 4, "verification_criteria": "Prove formally using loop invariants that binary search terminates with the correct index in $O(\\log n)$ steps.", "subtopics": ["2.29.1 Principle of Mathematical Induction: Base Case $P(0)$ and Inductive Step $P(k) \\implies P(k+1)$.", "2.29.2 Strong Induction: assuming all preceding cases $P(0), \\dots, P(k)$ hold to prove $P(k+1)$.", "2.29.3 Loop Invariants in software engineering: Initialization, Maintenance, and Termination guarantees.", "2.29.4 Proving algorithm correctness: proving binary search and sorting termination via invariants."]}'::jsonb, '["Explain how this implementation prevents: Writing recursive functions with subtle termination bugs where the base case fails to cover all branches.", "How does Mathematical Induction & Loop Invariants scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-2-30', 'phase-02-lesson-30-set-theory-relations-equivalence-classes', 'module-3', 30, 'Lesson 3.30: Set Theory, Relations, & Equivalence Classes', 'Prerequisites: Lesson 2.26', 'Prerequisites: Lesson 2.26 | Subtopics: 4 items', 'Systems project application', 140, 3, 500.0, 1500.0, '# Lesson 2.30: Set Theory, Relations, & Equivalence Classes

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 2.26
- **Subtopics**:
  - `2.30.1` Sets, subsets, power sets, set operations (union, intersection, difference, Cartesian product).
  - `2.30.2` Binary relations: reflexive, symmetric, anti-symmetric, and transitive properties.
  - `2.30.3` Equivalence relations and partitioning sets into disjoint equivalence classes.
  - `2.30.4` Partial orders, total orders, and Hasse diagrams: prerequisite structures.
- **Key Failure Modes & Edge Cases**: Assuming a comparison function defines a total order when it violates transitivity, causing sorting algorithms to loop infinitely.
- **Verification & Mastery Check**: Prove whether a given custom object comparator satisfies total ordering axioms.
- **Project Application**: DataSift: Entity resolution and clustering.', '{"solution.py": "# Phase 2 // Lesson 2.30: Set Theory, Relations, & Equivalence Classes\n\ndef solve():\n    \"\"\"\n    Verification: Prove whether a given custom object comparator satisfies total ordering axioms.\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "2.30", "subtopics_count": 4, "verification_criteria": "Prove whether a given custom object comparator satisfies total ordering axioms.", "subtopics": ["2.30.1 Sets, subsets, power sets, set operations (union, intersection, difference, Cartesian product).", "2.30.2 Binary relations: reflexive, symmetric, anti-symmetric, and transitive properties.", "2.30.3 Equivalence relations and partitioning sets into disjoint equivalence classes.", "2.30.4 Partial orders, total orders, and Hasse diagrams: prerequisite structures."]}'::jsonb, '["Explain how this implementation prevents: Assuming a comparison function defines a total order when it violates transitivity, causing sorting algorithms to loop i", "How does Set Theory, Relations, & Equivalence Classes scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, phase_id = EXCLUDED.phase_id, order_index = EXCLUDED.order_index, title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, cs_foundation = EXCLUDED.cs_foundation, ai_convergence = EXCLUDED.ai_convergence, xp_reward = EXCLUDED.xp_reward, level_required = EXCLUDED.level_required, position_x = EXCLUDED.position_x, position_y = EXCLUDED.position_y, handbook_markdown = EXCLUDED.handbook_markdown, starter_code = EXCLUDED.starter_code, test_suite = EXCLUDED.test_suite, defense_prompts = EXCLUDED.defense_prompts;
