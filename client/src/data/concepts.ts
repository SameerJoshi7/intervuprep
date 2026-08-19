import type { Concept } from "../types";

// In-house written explanations. Each concept can link curated resources
// and (optionally) an interactive visualizer.
const raw: Concept[] = [
  // =================== JavaScript ===================
  {
    id: "",
    topicId: "javascript",
    title: "The Event Loop & Async JavaScript",
    summary: "How single-threaded JS runs timers, promises, and callbacks without blocking.",
    difficulty: "intermediate",
    body: [
      { type: "text", text: "JavaScript runs on a single thread, so it can only do one thing at a time. To stay responsive it offloads slow work (timers, network, file I/O) to the environment (browser or Node) and processes the results later via the event loop." },
      { type: "heading", text: "The pieces" },
      { type: "list", items: [
        "Call stack: where functions currently execute (LIFO).",
        "Web/Node APIs: handle async work off-thread (setTimeout, fetch, fs).",
        "Macrotask queue: callbacks from timers, I/O, events.",
        "Microtask queue: promise callbacks (.then) and queueMicrotask; drained fully after each task.",
      ]},
      { type: "heading", text: "The rule" },
      { type: "text", text: "After the call stack empties, the loop drains ALL microtasks, then takes ONE macrotask, then drains microtasks again, and repeats. This is why a resolved promise always runs before a setTimeout(0)." },
      { type: "code", language: "javascript", code: "console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');\n// Output: 1, 4, 3, 2" },
      { type: "text", text: "'1' and '4' run synchronously. The promise ('3') is a microtask and runs before the timer ('2'), a macrotask." },
    ],
    resources: [
      { title: "MDN: The event loop", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop", type: "doc" },
      { title: "Jake Archibald: In The Loop", url: "https://www.youtube.com/watch?v=cCOL7MC4Pl0", type: "video" },
    ],
  },
  {
    id: "",
    topicId: "javascript",
    title: "Closures",
    summary: "Functions that remember the variables from where they were defined.",
    difficulty: "intermediate",
    body: [
      { type: "text", text: "A closure is a function bundled with references to its surrounding lexical scope. Even after the outer function returns, the inner function still 'closes over' those variables and can read/update them." },
      { type: "text", text: "Closures power private state, memoization, currying, and event handlers that remember context." },
      { type: "code", language: "javascript", code: "function makeCounter() {\n  let count = 0;              // private\n  return {\n    inc: () => ++count,\n    get: () => count,\n  };\n}\nconst c = makeCounter();\nc.inc(); c.inc();\nc.get(); // 2 — count is not accessible from outside" },
      { type: "heading", text: "Classic gotcha" },
      { type: "text", text: "Using var in a loop shares one binding across all iterations; let creates a fresh binding per iteration, which is usually what you want in callbacks." },
    ],
    resources: [
      { title: "MDN: Closures", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures", type: "doc" },
      { title: "javascript.info: Closures", url: "https://javascript.info/closure", type: "article" },
    ],
  },
  {
    id: "",
    topicId: "javascript",
    title: "Prototypes & Inheritance",
    summary: "How objects share behavior via the prototype chain.",
    difficulty: "intermediate",
    body: [
      { type: "text", text: "Every JS object has a hidden link to another object called its prototype. When you access a property that doesn't exist on the object, the engine walks up this prototype chain until it finds it or reaches null." },
      { type: "text", text: "class syntax is largely sugar over this prototype mechanism: methods defined in a class live on the prototype, shared by all instances rather than copied per instance." },
      { type: "code", language: "javascript", code: "class Animal {\n  constructor(name) { this.name = name; }\n  speak() { return `${this.name} makes a sound`; }\n}\nclass Dog extends Animal {\n  speak() { return `${this.name} barks`; }\n}\nnew Dog('Rex').speak(); // 'Rex barks'" },
    ],
    resources: [
      { title: "MDN: Inheritance and the prototype chain", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain", type: "doc" },
    ],
  },

  // =================== TypeScript ===================
  {
    id: "",
    topicId: "typescript",
    title: "Generics",
    summary: "Reusable, type-safe components parameterized by type.",
    difficulty: "intermediate",
    body: [
      { type: "text", text: "Generics let you write functions and types that work over many types while preserving type information, instead of falling back to any." },
      { type: "code", language: "typescript", code: "function first<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\nfirst([1, 2, 3]);      // number | undefined\nfirst(['a', 'b']);     // string | undefined" },
      { type: "heading", text: "Constraints" },
      { type: "text", text: "Use `extends` to constrain what a type parameter can be, so you can safely access properties." },
      { type: "code", language: "typescript", code: "function longest<T extends { length: number }>(a: T, b: T): T {\n  return a.length >= b.length ? a : b;\n}" },
    ],
    resources: [
      { title: "TS Handbook: Generics", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html", type: "doc" },
    ],
  },
  {
    id: "",
    topicId: "typescript",
    title: "Utility & Mapped Types",
    summary: "Transform existing types with Partial, Pick, Omit, Record, and mapped types.",
    difficulty: "intermediate",
    body: [
      { type: "text", text: "TypeScript ships utility types that derive new types from existing ones, avoiding duplication and keeping types in sync." },
      { type: "list", items: [
        "Partial<T>: all properties optional.",
        "Required<T>: all properties required.",
        "Pick<T, K>: keep only keys K.",
        "Omit<T, K>: remove keys K.",
        "Record<K, V>: object type with keys K and values V.",
      ]},
      { type: "code", language: "typescript", code: "interface User { id: string; name: string; email: string; }\ntype UserPreview = Pick<User, 'id' | 'name'>;\ntype UserPatch = Partial<Omit<User, 'id'>>;\n\n// Mapped type: make everything readonly\ntype ReadonlyUser = { readonly [K in keyof User]: User[K] };" },
    ],
    resources: [
      { title: "TS Handbook: Utility Types", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html", type: "doc" },
    ],
  },

  // =================== React ===================
  {
    id: "",
    topicId: "react",
    title: "How Rendering & Reconciliation Work",
    summary: "What triggers a render and how React updates the DOM efficiently.",
    difficulty: "intermediate",
    body: [
      { type: "text", text: "A component 're-renders' when its state changes, its parent re-renders, or its context value changes. Rendering means React calls your component function to produce a new tree of elements (the virtual DOM)." },
      { type: "text", text: "React then 'reconciles': it diffs the new tree against the previous one and applies the minimal set of real DOM changes. Keys help it match list items across renders so it can reuse DOM nodes instead of recreating them." },
      { type: "heading", text: "Avoiding wasted renders" },
      { type: "list", items: [
        "React.memo skips re-rendering a component if its props are shallow-equal.",
        "useMemo caches an expensive computed value.",
        "useCallback caches a function identity so memoized children don't re-render.",
        "Stable keys prevent unnecessary unmount/remount of list items.",
      ]},
    ],
    resources: [
      { title: "react.dev: Render and Commit", url: "https://react.dev/learn/render-and-commit", type: "doc" },
      { title: "A (Mostly) Complete Guide to React Rendering Behavior", url: "https://blog.isquaredsoftware.com/2020/05/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior/", type: "article" },
    ],
  },
  {
    id: "",
    topicId: "react",
    title: "Hooks: useState, useEffect, useRef",
    summary: "The core hooks and the rules that keep them working.",
    difficulty: "basic",
    body: [
      { type: "text", text: "Hooks let function components use state and lifecycle features. They must be called at the top level, in the same order every render — never inside conditions or loops — because React tracks them by call order." },
      { type: "list", items: [
        "useState: local reactive state; setting it schedules a re-render.",
        "useEffect: run side effects after render; the dependency array controls when it re-runs; return a cleanup function.",
        "useRef: a mutable box that persists across renders WITHOUT causing re-renders (great for DOM nodes or timers).",
      ]},
      { type: "code", language: "typescript", code: "useEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id); // cleanup on unmount / dep change\n}, []); // [] = run once on mount" },
    ],
    resources: [
      { title: "react.dev: Reusing Logic with Custom Hooks", url: "https://react.dev/learn/reusing-logic-with-custom-hooks", type: "doc" },
      { title: "react.dev: Synchronizing with Effects", url: "https://react.dev/learn/synchronizing-with-effects", type: "doc" },
    ],
  },

  // =================== Node.js ===================
  {
    id: "",
    topicId: "nodejs",
    title: "The Node.js Event Loop & libuv",
    summary: "Phases of the loop, the thread pool, and nextTick vs setImmediate.",
    difficulty: "advanced",
    body: [
      { type: "text", text: "Node uses libuv to provide an event loop with distinct phases. Async callbacks are queued into the phase they belong to and processed in order each iteration ('tick')." },
      { type: "list", items: [
        "timers: setTimeout / setInterval callbacks.",
        "pending callbacks: some system operations.",
        "poll: retrieve new I/O events; execute I/O callbacks.",
        "check: setImmediate callbacks.",
        "close callbacks: e.g. socket 'close'.",
      ]},
      { type: "text", text: "process.nextTick callbacks and microtasks (promises) run BETWEEN phases, before the loop continues — so nextTick can starve the loop if abused." },
      { type: "text", text: "CPU-bound work blocks the single main thread. Offload it to worker_threads or a separate service. Only certain operations (fs, crypto, dns) use libuv's thread pool." },
    ],
    resources: [
      { title: "Node.js: The event loop", url: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick", type: "doc" },
    ],
  },
  {
    id: "",
    topicId: "nodejs",
    title: "Streams & Backpressure",
    summary: "Process data piece by piece instead of buffering it all in memory.",
    difficulty: "intermediate",
    body: [
      { type: "text", text: "Streams let you handle large data incrementally: readable (source), writable (sink), duplex (both), and transform (modify in transit). This keeps memory flat even for huge files." },
      { type: "text", text: "Backpressure is the mechanism that stops a fast producer from overwhelming a slow consumer. pipe() (and pipeline()) handle it automatically by pausing the source when the destination's buffer is full." },
      { type: "code", language: "javascript", code: "const { pipeline } = require('stream/promises');\nawait pipeline(\n  fs.createReadStream('big.log'),\n  zlib.createGzip(),\n  fs.createWriteStream('big.log.gz')\n); // memory stays low; backpressure handled" },
    ],
    resources: [
      { title: "Node.js: Stream API", url: "https://nodejs.org/api/stream.html", type: "doc" },
    ],
  },

  // =================== AWS ===================
  {
    id: "",
    topicId: "aws",
    title: "Core Compute: EC2 vs Lambda vs Containers",
    summary: "When to reach for servers, functions, or containers.",
    difficulty: "basic",
    body: [
      { type: "list", items: [
        "EC2: virtual machines you manage. Full control, always-on, you handle scaling/patching.",
        "Lambda: run code in response to events, scales to zero, pay per invocation. Great for spiky/event-driven work; watch cold starts and the 15-min limit.",
        "ECS/Fargate: run containers without managing servers. Good for long-running services and consistent workloads.",
      ]},
      { type: "text", text: "Rule of thumb: event-driven & bursty -> Lambda; steady long-running services -> containers; need OS-level control or specialized instances -> EC2." },
    ],
    resources: [
      { title: "AWS Well-Architected Framework", url: "https://aws.amazon.com/architecture/well-architected/", type: "doc" },
      { title: "Open Guide to AWS", url: "https://github.com/open-guides/og-aws", type: "repo" },
    ],
  },
  {
    id: "",
    topicId: "aws",
    title: "IAM & the Principle of Least Privilege",
    summary: "Users, roles, and policies — and why roles beat long-lived keys.",
    difficulty: "intermediate",
    body: [
      { type: "text", text: "IAM controls who can do what. Policies are JSON documents granting/denying actions on resources. Attach them to users, groups, or roles." },
      { type: "text", text: "Prefer ROLES over static access keys: an EC2 instance, Lambda, or ECS task assumes a role and gets temporary, rotated credentials — no secrets to leak. Grant only the specific actions each component needs (least privilege)." },
      { type: "code", language: "json", code: "{\n  \"Effect\": \"Allow\",\n  \"Action\": [\"s3:GetObject\"],\n  \"Resource\": \"arn:aws:s3:::my-bucket/*\"\n}" },
    ],
    resources: [
      { title: "AWS IAM best practices", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html", type: "doc" },
    ],
  },

  // =================== PostgreSQL ===================
  {
    id: "",
    topicId: "postgres",
    title: "Indexes & Query Planning",
    summary: "How indexes speed up reads and how to read EXPLAIN.",
    difficulty: "intermediate",
    body: [
      { type: "text", text: "An index is a sorted data structure (usually a B-tree) that lets Postgres find rows without scanning the whole table. It speeds up reads but adds write overhead and storage, so index the columns you filter/join/order by." },
      { type: "text", text: "For composite indexes, column order matters: an index on (a, b) helps queries filtering on a, or a AND b, but not b alone." },
      { type: "text", text: "Use EXPLAIN ANALYZE to see the actual plan. A 'Seq Scan' on a large table for a selective query is a red flag; an 'Index Scan' is usually what you want." },
      { type: "code", language: "sql", code: "EXPLAIN ANALYZE\nSELECT * FROM orders WHERE customer_id = 42 ORDER BY created_at DESC;\n-- add: CREATE INDEX ON orders (customer_id, created_at DESC);" },
    ],
    resources: [
      { title: "Use The Index, Luke!", url: "https://use-the-index-luke.com/", type: "article" },
      { title: "PostgreSQL: Indexes", url: "https://www.postgresql.org/docs/current/indexes.html", type: "doc" },
    ],
  },
  {
    id: "",
    topicId: "postgres",
    title: "Transactions, ACID & MVCC",
    summary: "Isolation levels and how Postgres gives readers and writers a consistent view.",
    difficulty: "advanced",
    body: [
      { type: "text", text: "A transaction groups statements so they all commit or all roll back. ACID = Atomicity, Consistency, Isolation, Durability." },
      { type: "text", text: "Isolation levels trade correctness for concurrency: Read Committed (default) -> Repeatable Read -> Serializable. Higher levels prevent more anomalies (dirty/non-repeatable/phantom reads) but cost more." },
      { type: "text", text: "Postgres uses MVCC (Multi-Version Concurrency Control): writers create new row versions instead of overwriting, so readers never block writers and vice versa. Old versions are cleaned up by VACUUM." },
    ],
    resources: [
      { title: "PostgreSQL: Transaction Isolation", url: "https://www.postgresql.org/docs/current/transaction-iso.html", type: "doc" },
      { title: "PostgreSQL: MVCC", url: "https://www.postgresql.org/docs/current/mvcc-intro.html", type: "doc" },
    ],
  },

  // =================== MongoDB ===================
  {
    id: "",
    topicId: "mongodb",
    title: "Data Modeling: Embed vs Reference",
    summary: "The central MongoDB design decision and how to choose.",
    difficulty: "intermediate",
    body: [
      { type: "text", text: "Unlike relational DBs, you model MongoDB around your ACCESS PATTERNS. The big choice is embedding related data in one document vs referencing it in another collection." },
      { type: "list", items: [
        "Embed when data is read together, is owned by the parent, and won't grow unbounded (e.g. an order and its line items).",
        "Reference when data is large, shared across documents, or updated independently (e.g. users and their many posts).",
        "Watch the 16MB document limit and unbounded arrays — those signal you should reference instead.",
      ]},
      { type: "text", text: "$lookup can join collections in an aggregation, but it's not as cheap as SQL joins — design so your hot queries hit a single collection." },
    ],
    resources: [
      { title: "MongoDB: Data Modeling", url: "https://www.mongodb.com/docs/manual/data-modeling/", type: "doc" },
    ],
  },
  {
    id: "",
    topicId: "mongodb",
    title: "Replica Sets & Sharding",
    summary: "How MongoDB achieves high availability and horizontal scale.",
    difficulty: "advanced",
    body: [
      { type: "text", text: "A replica set is a group of nodes holding the same data: one primary (takes writes) and secondaries (replicate the oplog). If the primary fails, the set elects a new one automatically — that's your high availability." },
      { type: "text", text: "Sharding splits a collection across multiple shards using a shard key, enabling horizontal scale beyond one machine. Choosing a good shard key is critical: it should have high cardinality and spread writes evenly to avoid hotspots." },
    ],
    resources: [
      { title: "MongoDB: Replication", url: "https://www.mongodb.com/docs/manual/replication/", type: "doc" },
      { title: "MongoDB: Sharding", url: "https://www.mongodb.com/docs/manual/sharding/", type: "doc" },
    ],
  },

  // =================== DSA ===================
  {
    id: "",
    topicId: "dsa",
    title: "Big-O Notation",
    summary: "How to reason about how algorithms scale.",
    difficulty: "basic",
    body: [
      { type: "text", text: "Big-O describes how runtime (or memory) grows as input size n grows, ignoring constants. It's about scalability, not exact timing." },
      { type: "list", items: [
        "O(1): constant — hash lookup, array index.",
        "O(log n): halves the problem each step — binary search.",
        "O(n): touch every element once — a single loop.",
        "O(n log n): good sorting (merge/quick average).",
        "O(n^2): nested loops over the same data — naive sorts.",
        "O(2^n): exponential — brute-force subsets; usually needs optimization.",
      ]},
      { type: "text", text: "Always state both time AND space complexity in interviews, and mention best/average/worst cases where they differ." },
    ],
    resources: [
      { title: "Big-O Cheat Sheet", url: "https://www.bigocheatsheet.com/", type: "article" },
    ],
  },
  {
    id: "",
    topicId: "dsa",
    title: "Sorting Algorithms",
    summary: "Compare simple and efficient sorts — and see them run.",
    difficulty: "basic",
    visualizer: "sorting",
    body: [
      { type: "text", text: "Sorting is a foundation for many other algorithms (searching, deduping, interval problems). Know the tradeoffs and be able to implement at least one O(n log n) sort." },
      { type: "list", items: [
        "Bubble/Selection/Insertion: O(n^2), simple; insertion is fast on nearly-sorted data.",
        "Merge sort: O(n log n) always, stable, needs O(n) extra space.",
        "Quick sort: O(n log n) average, O(n^2) worst (bad pivots), in-place, usually fastest in practice.",
      ]},
      { type: "text", text: "Use the interactive visualizer below to watch comparisons, swaps, and the growing sorted region." },
    ],
    resources: [
      { title: "VisuAlgo: Sorting", url: "https://visualgo.net/en/sorting", type: "doc" },
    ],
  },
  {
    id: "",
    topicId: "dsa",
    title: "Binary Search",
    summary: "Find an element in a sorted array in O(log n).",
    difficulty: "basic",
    visualizer: "binary-search",
    body: [
      { type: "text", text: "Binary search repeatedly halves the search space by comparing the target to the middle element. It requires SORTED data and runs in O(log n)." },
      { type: "text", text: "The pattern generalizes far beyond arrays: 'binary search on the answer' solves many optimization problems (find the smallest value that satisfies a monotonic condition)." },
      { type: "code", language: "javascript", code: "function binarySearch(a, target) {\n  let lo = 0, hi = a.length - 1;\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1;\n    if (a[mid] === target) return mid;\n    if (a[mid] < target) lo = mid + 1;\n    else hi = mid - 1;\n  }\n  return -1;\n}" },
    ],
    resources: [
      { title: "VisuAlgo: Binary Search Tree / search", url: "https://visualgo.net/en/bst", type: "doc" },
    ],
  },
  {
    id: "",
    topicId: "dsa",
    title: "Graph Traversal: BFS & DFS",
    summary: "The two fundamental ways to explore a graph.",
    difficulty: "intermediate",
    visualizer: "graph-traversal",
    body: [
      { type: "text", text: "Graphs model relationships (networks, dependencies, maps). The two core traversals are BFS and DFS; both visit every reachable node once in O(V + E)." },
      { type: "list", items: [
        "BFS uses a QUEUE, explores level by level, and finds the shortest path in unweighted graphs.",
        "DFS uses a STACK (or recursion), goes deep first, and is natural for cycle detection, topological sort, and connected components.",
        "Always track visited nodes to avoid infinite loops in cyclic graphs.",
      ]},
      { type: "text", text: "Watch the queue vs stack drive the visit order in the visualizer below." },
    ],
    resources: [
      { title: "VisuAlgo: Graph Traversal", url: "https://visualgo.net/en/dfsbfs", type: "doc" },
    ],
  },

  // =================== System Design ===================
  {
    id: "",
    topicId: "system-design",
    title: "Scalability: Vertical vs Horizontal",
    summary: "Two ways to handle more load, and why horizontal wins at scale.",
    difficulty: "fundamentals",
    body: [
      { type: "text", text: "Vertical scaling = a bigger machine (more CPU/RAM). Simple, but has a ceiling and a single point of failure." },
      { type: "text", text: "Horizontal scaling = more machines behind a load balancer. Near-limitless and fault-tolerant, but requires your app to be stateless (store session/state in a shared cache or DB) so any node can serve any request." },
      { type: "text", text: "The usual playbook: make services stateless, put a load balancer in front, add read replicas and caching, then shard the database when a single primary can't keep up." },
    ],
    resources: [
      { title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", type: "repo" },
    ],
  },
  {
    id: "",
    topicId: "system-design",
    title: "Caching & Request Flow",
    summary: "Where to add caches and the cache-aside pattern.",
    difficulty: "fundamentals",
    visualizer: "request-flow",
    body: [
      { type: "text", text: "Caching stores hot data in fast storage (memory) to cut latency and load on the database. You can cache at many layers: browser, CDN, application, and database." },
      { type: "heading", text: "Cache-aside (lazy loading)" },
      { type: "list", items: [
        "On read: check cache; on HIT return it; on MISS read the DB, write it to cache, then return.",
        "On write: update the DB and invalidate/update the cache entry.",
        "Set a TTL so stale data eventually expires.",
      ]},
      { type: "text", text: "The hard part is invalidation — keeping the cache consistent with the source of truth. The visualizer shows the fast cache-hit path vs a full DB round-trip on a miss." },
    ],
    resources: [
      { title: "System Design Primer: Caching", url: "https://github.com/donnemartin/system-design-primer#cache", type: "repo" },
    ],
  },
  {
    id: "",
    topicId: "system-design",
    title: "CAP Theorem & Consistency",
    summary: "The fundamental tradeoff in distributed data stores.",
    difficulty: "fundamentals",
    body: [
      { type: "text", text: "CAP says that when a network partition happens, a distributed system must choose between Consistency (every read sees the latest write) and Availability (every request gets a response). You can't have both during a partition." },
      { type: "list", items: [
        "CP systems (e.g. traditional RDBMS, HBase): stay consistent, may reject requests during a partition.",
        "AP systems (e.g. Cassandra, DynamoDB default): stay available, may return stale data (eventual consistency).",
      ]},
      { type: "text", text: "In practice, PACELC extends this: Even when there's no partition (Else), you trade Latency vs Consistency. Choose based on whether your use case tolerates stale reads." },
    ],
    resources: [
      { title: "System Design Primer: Consistency patterns", url: "https://github.com/donnemartin/system-design-primer#consistency-patterns", type: "repo" },
    ],
  },
  // =================== JavaScript (more) ===================
  {
    id: "",
    topicId: "javascript",
    title: "Promises & async/await",
    summary: "Composing async work cleanly and handling errors correctly.",
    difficulty: "intermediate",
    body: [
      { type: "text", text: "A Promise represents a future value in one of three states: pending, fulfilled, or rejected. async/await is syntax sugar over promises that lets you write asynchronous code that reads synchronously." },
      { type: "list", items: [
        "Promise.all: wait for all, fail fast if any rejects.",
        "Promise.allSettled: wait for all, never rejects — get each result/status.",
        "Promise.race: settle as soon as the first one settles.",
        "Promise.any: resolve on the first fulfilled (ignores rejections until all fail).",
      ]},
      { type: "code", language: "javascript", code: "async function load() {\n  try {\n    const [user, posts] = await Promise.all([\n      fetch('/user').then(r => r.json()),\n      fetch('/posts').then(r => r.json()),\n    ]);\n    return { user, posts };\n  } catch (err) {\n    // any rejection lands here\n  }\n}" },
      { type: "text", text: "Always await or .catch() a promise — an unhandled rejection can crash a Node process." },
    ],
    resources: [
      { title: "MDN: Using Promises", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises", type: "doc" },
      { title: "javascript.info: Promises, async/await", url: "https://javascript.info/async", type: "article" },
    ],
  },
  {
    id: "",
    topicId: "javascript",
    title: "'this' & Execution Context",
    summary: "What 'this' points to in each calling context, and call/apply/bind.",
    difficulty: "intermediate",
    body: [
      { type: "text", text: "'this' is determined by HOW a function is called, not where it's defined (except arrow functions, which capture 'this' lexically)." },
      { type: "list", items: [
        "Regular function called plainly: 'this' is undefined (strict) or the global object.",
        "Method call obj.fn(): 'this' is obj.",
        "new Fn(): 'this' is the newly created object.",
        "Arrow function: 'this' is inherited from the enclosing scope.",
      ]},
      { type: "text", text: "call and apply invoke a function with an explicit 'this' (apply takes args as an array); bind returns a new function permanently bound to a given 'this'." },
    ],
    resources: [
      { title: "MDN: this", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this", type: "doc" },
      { title: "javascript.info: Object methods, 'this'", url: "https://javascript.info/object-methods", type: "article" },
    ],
  },

  // =================== TypeScript (more) ===================
  {
    id: "",
    topicId: "typescript",
    title: "Narrowing & Type Guards",
    summary: "How TypeScript refines a broad type to a specific one at runtime.",
    difficulty: "intermediate",
    body: [
      { type: "text", text: "Narrowing is how TS reduces a union to a more specific type inside a branch, using runtime checks it understands." },
      { type: "list", items: [
        "typeof for primitives: if (typeof x === 'string') ...",
        "instanceof for classes.",
        "'in' operator for object shape: if ('length' in x) ...",
        "Discriminated unions: switch on a shared literal 'kind' field.",
        "Custom type guards: functions returning `x is Foo`.",
      ]},
      { type: "code", language: "typescript", code: "type Shape =\n  | { kind: 'circle'; r: number }\n  | { kind: 'square'; side: number };\n\nfunction area(s: Shape) {\n  switch (s.kind) {\n    case 'circle': return Math.PI * s.r ** 2;\n    case 'square': return s.side ** 2;\n  }\n}" },
    ],
    resources: [
      { title: "TS Handbook: Narrowing", url: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html", type: "doc" },
    ],
  },

  // =================== React (more) ===================
  {
    id: "",
    topicId: "react",
    title: "State Management: Context & Beyond",
    summary: "When Context is enough and when to reach for a library.",
    difficulty: "intermediate",
    body: [
      { type: "text", text: "Not all state is equal: local UI state (useState), server cache (React Query/SWR), URL state (router), and global client state (Context or a store) have different best tools." },
      { type: "text", text: "Context is great for low-frequency global values (theme, current user). But every consumer re-renders when the value changes, so it's a poor fit for high-frequency updates — that's where Zustand/Jotai/Redux shine with fine-grained subscriptions." },
      { type: "list", items: [
        "Redux Toolkit: predictable, great devtools, more boilerplate.",
        "Zustand: tiny, hook-based, minimal boilerplate.",
        "Jotai/Recoil: atom-based, fine-grained reactivity.",
        "React Query / SWR: for server state (caching, refetch) — not really 'global state'.",
      ]},
    ],
    resources: [
      { title: "react.dev: Passing Data Deeply with Context", url: "https://react.dev/learn/passing-data-deeply-with-context", type: "doc" },
      { title: "React Query docs", url: "https://tanstack.com/query/latest/docs/framework/react/overview", type: "doc" },
    ],
  },
  {
    id: "",
    topicId: "react",
    title: "Performance Optimization",
    summary: "Find and fix wasted renders and slow updates.",
    difficulty: "advanced",
    body: [
      { type: "text", text: "Optimize only after measuring with the React DevTools Profiler. Common wins:" },
      { type: "list", items: [
        "memo/useMemo/useCallback to skip work when inputs are unchanged.",
        "Virtualize long lists (react-window / TanStack Virtual).",
        "Split state so unrelated updates don't re-render large trees.",
        "Move context that updates often lower in the tree, or split it.",
        "Use useTransition to keep the UI responsive during heavy updates.",
      ]},
      { type: "text", text: "Beware premature memoization — it adds complexity and can even be slower for cheap components." },
    ],
    resources: [
      { title: "react.dev: useMemo", url: "https://react.dev/reference/react/useMemo", type: "doc" },
      { title: "React Profiler guide", url: "https://react.dev/reference/react/Profiler", type: "doc" },
    ],
  },

  // =================== Node.js (more) ===================
  {
    id: "",
    topicId: "nodejs",
    title: "Express & Middleware",
    summary: "How the request pipeline and error handling work.",
    difficulty: "intermediate",
    body: [
      { type: "text", text: "Express processes a request through an ordered chain of middleware functions (req, res, next). Each can read/modify req/res, end the response, or call next() to pass control on." },
      { type: "text", text: "Error-handling middleware has four args (err, req, res, next) and must be registered last. In async handlers, catch errors and pass them to next(err) (or use a wrapper) so they reach it." },
      { type: "code", language: "javascript", code: "app.use(express.json());\napp.get('/users/:id', async (req, res, next) => {\n  try { res.json(await getUser(req.params.id)); }\n  catch (e) { next(e); }\n});\napp.use((err, req, res, next) => {\n  res.status(500).json({ error: err.message });\n});" },
    ],
    resources: [
      { title: "Express: Using middleware", url: "https://expressjs.com/en/guide/using-middleware.html", type: "doc" },
      { title: "Express: Error handling", url: "https://expressjs.com/en/guide/error-handling.html", type: "doc" },
    ],
  },
  {
    id: "",
    topicId: "nodejs",
    title: "Authentication: JWT vs Sessions",
    summary: "Two ways to keep users logged in, and their tradeoffs.",
    difficulty: "intermediate",
    body: [
      { type: "text", text: "Sessions store state on the server (or a shared store like Redis) and give the client an opaque session id cookie. Easy to revoke, but requires shared storage when scaled horizontally." },
      { type: "text", text: "JWTs are self-contained signed tokens the server can verify without a lookup — stateless and scale-friendly. The downside is revocation is hard (they're valid until expiry), so keep them short-lived and use refresh tokens." },
      { type: "list", items: [
        "Store tokens in httpOnly cookies (not localStorage) to reduce XSS risk.",
        "Use SameSite and CSRF protection for cookie-based auth.",
        "Never put secrets in a JWT payload — it's signed, not encrypted.",
      ]},
    ],
    resources: [
      { title: "jwt.io Introduction", url: "https://jwt.io/introduction", type: "article" },
      { title: "OWASP: Session Management Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html", type: "doc" },
    ],
  },

  // =================== AWS (more) ===================
  {
    id: "",
    topicId: "aws",
    title: "Networking: VPC, Subnets & Security Groups",
    summary: "The building blocks of a secure AWS network.",
    difficulty: "intermediate",
    body: [
      { type: "text", text: "A VPC is your private network in AWS. You divide it into subnets (public with a route to an internet gateway; private without). Put load balancers in public subnets and databases/app servers in private ones." },
      { type: "list", items: [
        "Security group: stateful virtual firewall on a resource (return traffic auto-allowed).",
        "Network ACL: stateless firewall at the subnet level (must allow both directions).",
        "NAT gateway: lets private-subnet resources reach the internet outbound without being reachable inbound.",
        "VPC endpoints: reach AWS services (e.g. S3) privately without the internet.",
      ]},
    ],
    resources: [
      { title: "AWS: What is a VPC?", url: "https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html", type: "doc" },
    ],
  },

  // =================== PostgreSQL (more) ===================
  {
    id: "",
    topicId: "postgres",
    title: "Joins & Query Basics",
    summary: "Combine rows across tables and filter/aggregate correctly.",
    difficulty: "basic",
    body: [
      { type: "list", items: [
        "INNER JOIN: only rows matching in both tables.",
        "LEFT JOIN: all left rows, NULLs where no right match.",
        "RIGHT/FULL JOIN: mirror / both sides.",
        "WHERE filters rows before grouping; HAVING filters after aggregation.",
      ]},
      { type: "code", language: "sql", code: "SELECT c.name, COUNT(o.id) AS orders\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id\nGROUP BY c.name\nHAVING COUNT(o.id) > 5\nORDER BY orders DESC;" },
    ],
    resources: [
      { title: "PostgreSQL: Joins", url: "https://www.postgresql.org/docs/current/tutorial-join.html", type: "doc" },
      { title: "PostgreSQL Tutorial: Joins", url: "https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-joins/", type: "article" },
    ],
  },
  {
    id: "",
    topicId: "postgres",
    title: "Scaling Postgres: Replication & Partitioning",
    summary: "Handle more reads, more data, and stay available.",
    difficulty: "advanced",
    body: [
      { type: "text", text: "Scale reads with streaming replication and read replicas (route SELECTs to replicas, writes to the primary). Beware replication lag: replicas can be slightly behind." },
      { type: "text", text: "Handle huge tables with partitioning (range/list/hash) so queries hit smaller chunks and old partitions can be dropped cheaply. When one primary can't keep up with writes, you shard across multiple databases — at the cost of cross-shard queries and complexity." },
    ],
    resources: [
      { title: "PostgreSQL: High Availability & Replication", url: "https://www.postgresql.org/docs/current/high-availability.html", type: "doc" },
      { title: "PostgreSQL: Table Partitioning", url: "https://www.postgresql.org/docs/current/ddl-partitioning.html", type: "doc" },
    ],
  },

  // =================== MongoDB (more) ===================
  {
    id: "",
    topicId: "mongodb",
    title: "Aggregation Pipeline",
    summary: "Transform and analyze documents through composable stages.",
    difficulty: "intermediate",
    body: [
      { type: "text", text: "The aggregation pipeline processes documents through an ordered series of stages, each transforming the stream. It's MongoDB's answer to complex SQL queries." },
      { type: "list", items: [
        "$match: filter (put early to use indexes and cut data).",
        "$group: aggregate by a key (sum, avg, count).",
        "$project: shape the output fields.",
        "$lookup: left-outer-join another collection.",
        "$sort / $limit / $skip: order and paginate.",
      ]},
      { type: "code", language: "javascript", code: "db.orders.aggregate([\n  { $match: { status: 'paid' } },\n  { $group: { _id: '$customerId', total: { $sum: '$amount' } } },\n  { $sort: { total: -1 } },\n  { $limit: 10 }\n]);" },
    ],
    resources: [
      { title: "MongoDB: Aggregation Pipeline", url: "https://www.mongodb.com/docs/manual/core/aggregation-pipeline/", type: "doc" },
    ],
  },

  // =================== DSA (more) ===================
  {
    id: "",
    topicId: "dsa",
    title: "Hash Maps & Sets",
    summary: "O(1) lookups that unlock many optimal solutions.",
    difficulty: "basic",
    body: [
      { type: "text", text: "Hash maps store key→value with average O(1) insert/lookup/delete by hashing the key to a bucket. Sets are the same idea without values — great for membership checks and dedup." },
      { type: "text", text: "Countless interview problems go from O(n^2) to O(n) by trading space for time with a hash map: two-sum, grouping, frequency counts, detecting duplicates, caching seen values." },
      { type: "code", language: "javascript", code: "function twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need)) return [seen.get(need), i];\n    seen.set(nums[i], i);\n  }\n}" },
    ],
    resources: [
      { title: "MDN: Map", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map", type: "doc" },
    ],
  },
  {
    id: "",
    topicId: "dsa",
    title: "Two Pointers & Sliding Window",
    summary: "Efficient patterns for arrays and strings.",
    difficulty: "intermediate",
    body: [
      { type: "text", text: "Two pointers walk an array from both ends (or at different speeds) to solve pair/partition problems in O(n) without extra space — e.g. pair sum in a sorted array, reversing, removing duplicates." },
      { type: "text", text: "Sliding window maintains a moving range and updates an aggregate incrementally instead of recomputing — ideal for 'longest/shortest subarray with property' problems like longest substring without repeats or max sum of size-k window." },
    ],
    resources: [
      { title: "NeetCode: Two Pointers / Sliding Window", url: "https://neetcode.io/roadmap", type: "video" },
    ],
  },
  {
    id: "",
    topicId: "dsa",
    title: "Dynamic Programming",
    summary: "Solve overlapping subproblems by remembering results.",
    difficulty: "advanced",
    body: [
      { type: "text", text: "DP applies when a problem has optimal substructure (optimal solution built from optimal subsolutions) and overlapping subproblems (the same subproblem recurs). You cache subresults to avoid recomputation." },
      { type: "list", items: [
        "Top-down (memoization): recursion + a cache.",
        "Bottom-up (tabulation): fill a table iteratively.",
        "Define the state, the recurrence, and the base cases — that's 90% of DP.",
      ]},
      { type: "text", text: "Classics: Fibonacci, coin change, longest common subsequence, knapsack, edit distance." },
    ],
    resources: [
      { title: "MIT OCW: Dynamic Programming (video)", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/", type: "video" },
    ],
  },

  {
    id: "",
    topicId: "dsa",
    title: "Linked Lists",
    summary: "Pointer-based sequences and the classic in-place reversal.",
    difficulty: "intermediate",
    visualizer: "linked-list",
    body: [
      { type: "text", text: "A linked list stores elements as nodes, each holding a value and a pointer to the next node. Insertion/deletion at a known position is O(1) (just re-point), but random access is O(n) since you must walk from the head." },
      { type: "text", text: "The signature interview exercise is reversing a list in place using three pointers (prev, curr, next) in O(n) time and O(1) space. Master the pointer dance below." },
      { type: "code", language: "javascript", code: "function reverse(head) {\n  let prev = null, curr = head;\n  while (curr) {\n    const next = curr.next; // save\n    curr.next = prev;       // reverse\n    prev = curr;            // advance\n    curr = next;\n  }\n  return prev; // new head\n}" },
      { type: "text", text: "Other must-knows: detect a cycle (Floyd's fast/slow pointers), find the middle, and merge two sorted lists." },
    ],
    resources: [
      { title: "VisuAlgo: Linked List", url: "https://visualgo.net/en/list", type: "doc" },
      { title: "NeetCode: Linked List problems", url: "https://neetcode.io/roadmap", type: "video" },
    ],
  },

  // =================== System Design (more) ===================
  {
    id: "",
    topicId: "system-design",
    title: "Load Balancing",
    summary: "Spread traffic across servers for scale and availability.",
    difficulty: "fundamentals",
    body: [
      { type: "text", text: "A load balancer distributes incoming requests across a pool of servers, removing unhealthy ones and enabling horizontal scale. L4 balances on TCP/IP; L7 understands HTTP (route by path/host, terminate TLS)." },
      { type: "list", items: [
        "Round robin: rotate evenly.",
        "Least connections: send to the least busy server.",
        "IP hash / sticky sessions: same client to same server (avoid if you can be stateless).",
        "Health checks remove failing instances automatically.",
      ]},
    ],
    resources: [
      { title: "System Design Primer: Load balancer", url: "https://github.com/donnemartin/system-design-primer#load-balancer", type: "repo" },
    ],
  },
  {
    id: "",
    topicId: "system-design",
    title: "Message Queues & Async Processing",
    summary: "Decouple services and absorb spikes with queues.",
    difficulty: "easy",
    body: [
      { type: "text", text: "A message queue lets a producer hand off work to be processed later by a consumer, decoupling the two. This smooths traffic spikes, improves resilience (retries), and enables background/async work (emails, image processing)." },
      { type: "list", items: [
        "Queue (e.g. SQS/RabbitMQ): one consumer processes each message.",
        "Pub/Sub (e.g. SNS/Kafka topics): many subscribers get each message.",
        "Delivery guarantees: at-least-once is common; design idempotent consumers.",
        "Dead-letter queues capture messages that repeatedly fail.",
      ]},
    ],
    resources: [
      { title: "System Design Primer: Asynchronism", url: "https://github.com/donnemartin/system-design-primer#asynchronism", type: "repo" },
    ],
  },
  {
    id: "",
    topicId: "system-design",
    title: "Sharding & Replication",
    summary: "Scale a database beyond one machine while staying available.",
    difficulty: "medium",
    body: [
      { type: "text", text: "Replication copies data to multiple nodes: it boosts read throughput (read replicas) and availability (failover). Writes usually go to one primary; replicas may lag." },
      { type: "text", text: "Sharding partitions data across nodes by a shard key so each holds a subset — this scales writes and storage. The hard parts: choosing a key that avoids hotspots, cross-shard queries/joins, and rebalancing (consistent hashing helps)." },
    ],
    resources: [
      { title: "System Design Primer: Database", url: "https://github.com/donnemartin/system-design-primer#database", type: "repo" },
    ],
  },
];

export const concepts: Concept[] = raw.map((c, i) => ({
  ...c,
  id: `${c.topicId}-c${i}`,
}));

export const conceptsByTopic = (topicId: string) =>
  concepts.filter((c) => c.topicId === topicId);

export const conceptById = (id: string) =>
  concepts.find((c) => c.id === id);
