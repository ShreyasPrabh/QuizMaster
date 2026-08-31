import { createTopic } from '../helpers'

export const MATHEMATICS_TOPICS = {
  algebra: createTopic('algebra', 'Algebra & Equations', '📐', 'Mathematics', 'Linear equations, polynomials, quadratic formulas, and factorials.', [
    { title: 'Linear Equations & Systems', description: 'Single-variable and two-variable systems of equations and matrices.' },
    { title: 'Quadratic Equations & Polynomials', description: 'Quadratic formula, roots, factoring polynomials, and discriminant.' },
    { title: 'Coordinate Geometry & Slopes', description: 'Distance formula, midpoint, slope-intercept form, and line intercepts.' },
    { title: 'Sequences & Arithmetic Series', description: 'Arithmetic progressions, geometric progressions, and finite sums.' },
  ]),

  geometry: createTopic('geometry', 'Geometry & Trigonometry', '📏', 'Mathematics', 'Triangles, circles, polygons, trigonometric identities, and angles.', [
    { title: 'Triangles, Angles & Theorems', description: 'Pythagorean theorem, congruence, similarity, and angle sum properties.' },
    { title: 'Circles, Arcs & Tangents', description: 'Chords, inscribed angles, radius-tangent theorem, and sector area.' },
    { title: 'Trigonometric Ratios & Identities', description: 'Sine, cosine, tangent ratios, unit circle, and Pythagorean identities.' },
    { title: '3D Solids, Surface Area & Volume', description: 'Prisms, cylinders, cones, spheres, pyramids, and volume formulas.' },
  ]),

  calculus: createTopic('calculus', 'Calculus & Analysis', '📈', 'Mathematics', 'Limits, differential calculus, integrals, and calculus theorems.', [
    { title: 'Limits & Continuity', description: 'One-sided limits, infinite limits, L’Hopital’s rule, and continuous functions.' },
    { title: 'Derivatives & Chain Rule', description: 'Power rule, product/quotient rule, chain rule, and implicit differentiation.' },
    { title: 'Applications of Derivatives', description: 'Critical points, concavity, optimization, and mean value theorem.' },
    { title: 'Integration & Area Under Curves', description: 'Definite integrals, substitution, integration by parts, and Riemann sums.' },
  ]),

  statistics: createTopic('statistics', 'Probability & Statistics', '📊', 'Mathematics', 'Data distributions, variance, permutations, combinations, and probability.', [
    { title: 'Descriptive Statistics & Measures', description: 'Mean, median, mode, range, variance, and standard deviation.' },
    { title: 'Combinatorics & Permutations', description: 'Factorials, counting principle, nCr combinations, and nPr permutations.' },
    { title: 'Probability Rules & Independence', description: 'Addition rule, multiplication rule, conditional probability, and Bayes theorem.' },
    { title: 'Probability Distributions & Z-Score', description: 'Binomial distribution, normal curve, z-scores, and random variables.' },
  ]),

  linearalgebra: createTopic('linearalgebra', 'Linear Algebra & Matrices', '🔢', 'Mathematics', 'Vector spaces, matrix transformations, determinants, eigenvalues, and dot products.', [
    { title: 'Vectors & Dot Products', description: 'Vector addition, scalar multiplication, dot/cross products, and unit vectors.' },
    { title: 'Matrix Operations & Inverses', description: 'Matrix multiplication, transpose, Gaussian elimination, and inverse matrices.' },
    { title: 'Determinants & Linear Systems', description: 'Cramer’s rule, 2x2 and 3x3 determinant formulas, and rank of matrices.' },
    { title: 'Eigenvalues & Eigenvectors', description: 'Characteristic polynomials, eigenspaces, diagonalization, and transformations.' },
  ]),

  numbertheory: createTopic('numbertheory', 'Number Theory & Primes', '🧩', 'Mathematics', 'Prime factorization, modular arithmetic, GCD/LCM, and Euclidean algorithm.', [
    { title: 'Primes & Divisibility Rules', description: 'Fundamental theorem of arithmetic, sieve of Eratosthenes, and prime factors.' },
    { title: 'Modular Arithmetic & Congruences', description: 'Modulo operations, linear congruences, and clock arithmetic.' },
    { title: 'GCD, LCM & Euclidean Algorithm', description: 'Greatest common divisor, Bezout’s identity, and Euclidean division.' },
    { title: 'Fermat’s & Euler’s Theorems', description: 'Fermat’s Little Theorem, Euler’s totient function, and modular inverses.' },
  ]),

  discrete: createTopic('discrete', 'Discrete Mathematics', '🕸️', 'Mathematics', 'Set theory, propositional logic, mathematical induction, and graph theory.', [
    { title: 'Set Theory & Venn Diagrams', description: 'Unions, intersections, subsets, power sets, and Cartesian products.' },
    { title: 'Propositional Logic & Truth Tables', description: 'Conjunction, disjunction, negation, implication, and tautologies.' },
    { title: 'Mathematical Induction & Recurrence', description: 'Base cases, inductive steps, strong induction, and recurrence relations.' },
    { title: 'Graph Theory & Relations', description: 'Vertices, edges, trees, Eulerian paths, and equivalence relations.' },
  ]),

  diffeq: createTopic('diffeq', 'Differential Equations', '📉', 'Mathematics', 'First-order ODEs, separation of variables, Laplace transforms, and modeling.', [
    { title: 'First-Order Differential Equations', description: 'Separation of variables, integrating factors, and initial value problems.' },
    { title: 'Second-Order Linear ODEs', description: 'Homogeneous equations, characteristic equations, and undetermined coefficients.' },
    { title: 'Laplace Transforms & Applications', description: 'Transform tables, inverse Laplace transforms, and step functions.' },
    { title: 'System of ODEs & Population Models', description: 'Matrix methods for systems, phase plane analysis, and exponential growth models.' },
  ]),

  financialmath: createTopic('financialmath', 'Financial Mathematics', '💰', 'Mathematics', 'Compound interest, annuities, amortization, present value, and risk calculations.', [
    { title: 'Simple & Compound Interest', description: 'Principal, annual interest rate, compounding frequencies, and continuous compounding.' },
    { title: 'Annuities & Present Value', description: 'Future value of annuities, ordinary annuities, and discounted cash flows.' },
    { title: 'Loans, Mortgages & Amortization', description: 'Monthly payments, amortization schedules, and principal breakdown.' },
    { title: 'Return on Investment & Yield', description: 'ROI formulas, internal rate of return (IRR), and inflation adjustments.' },
  ]),

  logicsets: createTopic('logicsets', 'Mathematical Logic & Sets', '💡', 'Mathematics', 'Predicates, quantifiers, boolean algebra, Karnaugh maps, and proofs.', [
    { title: 'Predicates & Quantifiers', description: 'Universal and existential quantifiers, domain of discourse, and negations.' },
    { title: 'Boolean Algebra & Logic Gates', description: 'De Morgan’s laws, AND/OR/NOT gates, and boolean simplification.' },
    { title: 'Proof Techniques & Contradictions', description: 'Direct proof, proof by contrapositive, and proof by contradiction.' },
    { title: 'Karnaugh Maps & Canonical Forms', description: 'Sum-of-products, product-of-sums, and 4-variable K-Map optimization.' },
  ]),
}
