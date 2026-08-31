import { createTopic } from '../helpers'

export const COMPUTERSCIENCE_TOPICS = {
  datastructures: createTopic('datastructures', 'Data Structures & Algorithms', '🌳', 'Computer Science', 'Linear structures, trees, graphs, sorting, and Big-O computational complexity.', [
    { title: 'Linear Data Structures', description: 'Arrays, Linked Lists, Stacks, Queues, and Circular Buffers.' },
    { title: 'Trees & Binary Search Trees', description: 'Tree traversals, AVL trees, and Binary Heaps.' },
    { title: 'Graphs & Shortest Path Algorithms', description: 'BFS, DFS, Dijkstra’s algorithm, and Minimum Spanning Trees.' },
    { title: 'Algorithm Design & Big-O Complexity', description: 'Dynamic programming, divide & conquer, and time-space tradeoffs.' },
  ]),

  operatingsystems: createTopic('operatingsystems', 'Operating Systems & Architecture', '🖥️', 'Computer Science', 'Process lifecycle, thread concurrency, virtual memory, and CPU scheduling.', [
    { title: 'Process Management & Threads', description: 'Process control blocks, context switching, and user vs kernel threads.' },
    { title: 'CPU Scheduling Algorithms', description: 'First-Come-First-Served, Round Robin, and Shortest Job First.' },
    { title: 'Memory Management & Paging', description: 'Virtual address translation, page tables, TLB, and page replacements.' },
    { title: 'Synchronization & Deadlocks', description: 'Mutexes, semaphores, deadlock conditions, and Banker’s algorithm.' },
  ]),

  networks: createTopic('networks', 'Computer Networks & Security', '🌐', 'Computer Science', 'OSI 7-layer model, TCP/IP stack, routing protocols, and encryption.', [
    { title: 'OSI & TCP/IP Architecture', description: 'Physical, Data Link, Network, Transport, and Application layers.' },
    { title: 'Transport Layer (TCP vs UDP)', description: '3-way handshake, flow control, sliding window, and UDP datagrams.' },
    { title: 'IP Addressing & Routing', description: 'IPv4 vs IPv6, subnetting, CIDR, ARP, NAT, and BGP/OSPF.' },
    { title: 'Network Security & Cryptography', description: 'Symmetric/asymmetric encryption, RSA, TLS certificates, and firewalls.' },
  ]),

  databases: createTopic('databases', 'Database Engineering & SQL', '🗄️', 'Computer Science', 'Relational schemas, SQL queries, indexing, normalization, and ACID transactions.', [
    { title: 'Relational Model & SQL Queries', description: 'SELECT, GROUP BY, HAVING, and aggregation functions.' },
    { title: 'Joins & Subquery Optimization', description: 'INNER, OUTER, CROSS joins, and subquery execution plans.' },
    { title: 'Database Normalization (1NF-BCNF)', description: 'Primary/foreign keys, functional dependencies, and anomaly removal.' },
    { title: 'Transactions, ACID & B-Trees', description: 'ACID properties, isolation levels, and B-Tree index lookup.' },
  ]),

  systemdesign: createTopic('systemdesign', 'System Design & Architecture', '🏗️', 'Computer Science', 'Scalability, microservices, load balancers, caching, and message queues.', [
    { title: 'Horizontal vs Vertical Scaling & Load Balancing', description: 'Round-robin, least connections, sticky sessions, and reverse proxies.' },
    { title: 'Caching Strategies (Redis & CDN)', description: 'Cache-aside, write-through, write-back, and cache invalidation.' },
    { title: 'Message Queues & Event-Driven Systems', description: 'Kafka, RabbitMQ, pub-sub architectures, and async job workers.' },
    { title: 'Microservices & Database Sharding', description: 'Service discovery, API gateways, horizontal sharding, and consistency.' },
  ]),

  clouddevops: createTopic('clouddevops', 'Cloud Computing & DevOps', '☁️', 'Computer Science', 'Docker containers, Kubernetes orchestration, CI/CD pipelines, and AWS/GCP.', [
    { title: 'Docker & Containerization', description: 'Dockerfiles, image layers, container runtimes, volumes, and networking.' },
    { title: 'Kubernetes (K8s) Orchestration', description: 'Pods, Deployments, Services, Ingress, and ConfigMaps.' },
    { title: 'CI/CD Automation Pipelines', description: 'GitHub Actions, automated build pipelines, unit testing, and releases.' },
    { title: 'Cloud Infrastructure (AWS/GCP/Azure)', description: 'Virtual machines (EC2), serverless (Lambda), S3 storage, and VPCs.' },
  ]),

  cybersecurity: createTopic('cybersecurity', 'Cybersecurity & Ethical Hacking', '🛡️', 'Computer Science', 'Web vulnerabilities, OWASP Top 10, penetration testing, and auth protocols.', [
    { title: 'OWASP Top 10 Web Vulnerabilities', description: 'SQL injection, XSS, CSRF, SSRF, and broken access controls.' },
    { title: 'Authentication & Authorization Protocols', description: 'JWT tokens, OAuth 2.0, OpenID Connect, and password hashing.' },
    { title: 'Cryptography & Hash Functions', description: 'SHA-256, bcrypt, AES symmetric cipher, and public-key infrastructure.' },
    { title: 'Penetration Testing & Defense', description: 'Reconnaissance, port scanning, zero-trust architecture, and SIEM monitoring.' },
  ]),

  aiandml: createTopic('aiandml', 'Artificial Intelligence & ML', '🤖', 'Computer Science', 'Supervised learning, neural networks, loss functions, and NLP basics.', [
    { title: 'Supervised vs Unsupervised Learning', description: 'Linear regression, classification, clustering (K-Means), and PCA.' },
    { title: 'Neural Networks & Deep Learning', description: 'Perceptrons, activation functions (ReLU), backpropagation, and epochs.' },
    { title: 'Loss Functions & Optimization', description: 'Mean Squared Error, Cross-Entropy, Gradient Descent, and Adam optimizer.' },
    { title: 'Natural Language Processing (NLP)', description: 'Tokenization, embeddings (Word2Vec), transformer attention, and LLMs.' },
  ]),

  compilers: createTopic('compilers', 'Compilers & Automata Theory', '⚙️', 'Computer Science', 'Lexical analysis, parsing, context-free grammars, Turing machines, and ASTs.', [
    { title: 'Finite Automata & Regular Languages', description: 'DFA, NFA, regular expressions, and state transitions.' },
    { title: 'Lexical Analysis & Tokenization', description: 'Lexers, symbol tables, token streams, and lexer generators.' },
    { title: 'Context-Free Grammars & Parsing', description: 'LL(k), LR(k) parsers, parse trees, and Abstract Syntax Trees (AST).' },
    { title: 'Turing Machines & Computability', description: 'Decidability, the Halting Problem, and Chomsky hierarchy.' },
  ]),

  webarchitecture: createTopic('webarchitecture', 'Web Architecture & Protocols', '🕸️', 'Computer Science', 'HTTP/2, HTTP/3, WebSockets, REST APIs, GraphQL, and browser rendering.', [
    { title: 'HTTP/HTTPS Protocols (HTTP/1.1 to HTTP/3)', description: 'Headers, status codes, multiplexing, TCP vs QUIC protocol.' },
    { title: 'RESTful API Design & GraphQL', description: 'Resource endpoints, idempotent methods, GraphQL schemas, and resolvers.' },
    { title: 'WebSockets & Real-Time Communication', description: 'Full-duplex channels, handshakes, heartbeat pings, and SSE.' },
    { title: 'Browser Rendering & Critical Path', description: 'DOM/CSSOM construction, render tree, layout reflow, and paint.' },
  ]),
}
