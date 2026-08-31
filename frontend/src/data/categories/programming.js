import { createTopic } from '../helpers'

/**
 * PROGRAMMING TOPICS REGISTRY
 * To add a new programming language or framework, simply append a new createTopic entry below!
 */
export const PROGRAMMING_TOPICS = {
  java: createTopic(
    'java',
    'Java',
    '☕',
    'Programming',
    'Master Java syntax, OOP architecture, collections framework, and JVM internals.',
    [
      { title: 'Java Basics & Syntax', description: 'Variables, primitive types, operators, conditionals, and loops.' },
      { title: 'Object-Oriented Programming (OOP)', description: 'Inheritance, Polymorphism, Encapsulation, and Interfaces.' },
      { title: 'Collections Framework & Generics', description: 'ArrayList, LinkedList, HashMap, HashSet, and Generic constraints.' },
      { title: 'Exception Handling & File I/O', description: 'Checked vs unchecked exceptions, try-with-resources, and file streams.' },
      { title: 'Multithreading & Concurrency', description: 'Threads, Synchronization, Locks, and ExecutorService.' },
    ]
  ),

  python: createTopic(
    'python',
    'Python',
    '🐍',
    'Programming',
    'Master Python syntax, data structures, list comprehensions, and functional features.',
    [
      { title: 'Syntax, Variables & Basic Types', description: 'Dynamic typing, numeric operations, string slicing, and basic I/O.' },
      { title: 'Data Structures (Lists, Dicts, Tuples)', description: 'List operations, dictionary hashing, sets, and comprehension expressions.' },
      { title: 'Functions, Lambdas & Decorators', description: 'Arguments (*args, **kwargs), scope, higher-order functions, and decorators.' },
      { title: 'OOP & Class Design', description: 'Classes, dunder methods, inheritance, and property decorators.' },
      { title: 'File Handling & Modules', description: 'File reading/writing, context managers (with), packages, and virtual environments.' },
    ]
  ),

  cpp: createTopic(
    'cpp',
    'C++',
    '⚙️',
    'Programming',
    'High-performance computing, pointers, memory models, and STL.',
    [
      { title: 'Pointers & Memory Architecture', description: 'Memory allocation, raw and smart pointers, references, and RAII.' },
      { title: 'OOP & Virtual Methods', description: 'Constructors, destructors, vtables, multiple inheritance, and polymorphism.' },
      { title: 'Standard Template Library (STL)', description: 'Vectors, maps, sets, algorithms, iterators, and lambdas in C++.' },
      { title: 'Templates & Modern C++ (C++17/20)', description: 'Template metaprogramming, move semantics, and constexpr.' },
    ]
  ),

  javascript: createTopic(
    'javascript',
    'JavaScript',
    '🟨',
    'Programming',
    'Modern asynchronous JavaScript, closures, event loop, and DOM.',
    [
      { title: 'Core Syntax, Scopes & Closures', description: 'let vs const vs var, hoisting, lexical scope, and closures.' },
      { title: 'Arrays, Objects & ES6+ Features', description: 'Destructuring, spread/rest, map/filter/reduce, and modules.' },
      { title: 'Async, Promises & Event Loop', description: 'Callbacks, Promises, async/await, microtasks, and the JS event loop.' },
      { title: 'DOM Manipulation & Web APIs', description: 'Event bubbling, delegation, localStorage, and fetch API.' },
    ]
  ),

  typescript: createTopic(
    'typescript',
    'TypeScript',
    '🔷',
    'Programming',
    'Static typing, interfaces, generics, type narrowing, and decorators for JS.',
    [
      { title: 'Types, Interfaces & Type Aliases', description: 'Primitive types, object interfaces, union, intersection, and literal types.' },
      { title: 'Generics & Advanced Type Gymnastics', description: 'Generic constraints, keyof, typeof, conditional types, and utility types.' },
      { title: 'Classes, Modules & Enums', description: 'Access modifiers, abstract classes, parameter properties, and namespace exports.' },
      { title: 'Type Narrowing & Config (tsconfig)', description: 'Type guards, discriminated unions, assertion functions, and strict mode.' },
    ]
  ),

  golang: createTopic(
    'golang',
    'Go (Golang)',
    '🐹',
    'Programming',
    'Concurrency with goroutines, channels, interfaces, structs, and microservices.',
    [
      { title: 'Go Basics, Structs & Pointers', description: 'Package main, slices, maps, structs, value vs pointer receivers.' },
      { title: 'Interfaces & Composition', description: 'Implicit interface implementation, type assertions, and empty interfaces.' },
      { title: 'Goroutines, Channels & Select', description: 'Lightweight concurrency, buffered/unbuffered channels, and worker pools.' },
      { title: 'Error Handling, Defer & Modules', description: 'Idiomatic error returns, panic/recover, defer execution, and go.mod.' },
    ]
  ),

  rust: createTopic(
    'rust',
    'Rust',
    '🦀',
    'Programming',
    'Memory safety without garbage collection, borrow checker, traits, and lifetimes.',
    [
      { title: 'Ownership, Borrowing & Lifetimes', description: 'Move semantics, mutable vs immutable references, and lifetime annotations.' },
      { title: 'Enums, Pattern Matching & Option/Result', description: 'Algebraic data types, match expressions, Result<T, E>, and ? operator.' },
      { title: 'Structs, Traits & Generics', description: 'Method syntax, trait bounds, orphan rules, and dynamic dispatch.' },
      { title: 'Smart Pointers & Fearless Concurrency', description: 'Box, Rc, Arc, Mutex, channels, and data race prevention.' },
    ]
  ),

  kotlin: createTopic(
    'kotlin',
    'Kotlin',
    '🟣',
    'Programming',
    'Modern JVM programming, null safety, coroutines, extension functions, and Android.',
    [
      { title: 'Null Safety & Basic Syntax', description: 'Nullable types, safe calls (?.), Elvis operator (?:), and smart casting.' },
      { title: 'Data Classes, Lambdas & Scope Functions', description: 'let, run, apply, also, with, and higher-order extension functions.' },
      { title: 'OOP, Interfaces & Sealed Classes', description: 'Primary constructors, open classes, delegation, and sealed hierarchies.' },
      { title: 'Coroutines & Asynchronous Flow', description: 'suspend functions, Dispatchers, structured concurrency, and StateFlow.' },
    ]
  ),

  sql: createTopic(
    'sql',
    'SQL & Databases',
    '🐬',
    'Programming',
    'Relational database querying, aggregations, joins, indexes, and transactions.',
    [
      { title: 'Basic SQL Queries & Filtering', description: 'SELECT, WHERE, LIKE, IN, BETWEEN, ORDER BY, and LIMIT clauses.' },
      { title: 'Joins & Multi-Table Relational Queries', description: 'INNER, LEFT, RIGHT, FULL OUTER, CROSS JOIN, and self-joins.' },
      { title: 'Aggregations & Grouping (GROUP BY)', description: 'COUNT, SUM, AVG, MIN, MAX, HAVING, and window functions (ROW_NUMBER).' },
      { title: 'Subqueries, Views & Schema Definition', description: 'Correlated subqueries, CTEs, CREATE TABLE, FOREIGN KEY, and Indexes.' },
    ]
  ),

  csharp: createTopic(
    'csharp',
    'C# & .NET',
    '🎯',
    'Programming',
    'Enterprise software, LINQ, async/await, delegates, and ASP.NET architecture.',
    [
      { title: 'C# Syntax, Types & OOP', description: 'Properties, namespaces, access modifiers, inheritance, and interfaces.' },
      { title: 'Delegates, Events & Lambdas', description: 'Func, Action, custom delegates, event publishing, and subscriber pattern.' },
      { title: 'LINQ (Language Integrated Query)', description: 'Select, Where, OrderBy, GroupBy, Join, and deferred execution.' },
      { title: 'Asynchronous Programming (Task/async/await)', description: 'Task-based asynchronous pattern, cancellation tokens, and parallel loops.' },
    ]
  ),
}
