import type { Topic } from "../types";

export const topics: Topic[] = [
  {
    id: "javascript",
    name: "JavaScript",
    slug: "javascript",
    category: "fullstack",
    icon: "JS",
    blurb: "Closures, the event loop, prototypes, async, and the tricky bits.",
    resources: [
      { title: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", type: "doc" },
      { title: "javascript.info", url: "https://javascript.info/", type: "doc" },
      { title: "You Don't Know JS (book series)", url: "https://github.com/getify/You-Dont-Know-JS", type: "repo" },
    ],
  },
  {
    id: "typescript",
    name: "TypeScript",
    slug: "typescript",
    category: "fullstack",
    icon: "TS",
    blurb: "Types, generics, utility types, and advanced type-level programming.",
    resources: [
      { title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html", type: "doc" },
      { title: "Type Challenges", url: "https://github.com/type-challenges/type-challenges", type: "repo" },
      { title: "Total TypeScript tips", url: "https://www.totaltypescript.com/tips", type: "article" },
    ],
  },
  {
    id: "react",
    name: "React",
    slug: "react",
    category: "fullstack",
    icon: "RE",
    blurb: "Hooks, reconciliation, performance, concurrent features, and RSC.",
    resources: [
      { title: "react.dev (official)", url: "https://react.dev/learn", type: "doc" },
      { title: "Patterns.dev", url: "https://www.patterns.dev/", type: "article" },
      { title: "A (Mostly) Complete Guide to React Rendering", url: "https://blog.isquaredsoftware.com/2020/05/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior/", type: "article" },
    ],
  },
  {
    id: "nodejs",
    name: "Node.js",
    slug: "nodejs",
    category: "fullstack",
    icon: "ND",
    blurb: "Event loop, streams, clustering, Express, and production concerns.",
    resources: [
      { title: "Node.js Official Docs", url: "https://nodejs.org/en/learn", type: "doc" },
      { title: "The Node.js Event Loop (official guide)", url: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick", type: "doc" },
      { title: "Node.js Best Practices", url: "https://github.com/goldbergyoni/nodebestpractices", type: "repo" },
    ],
  },
  {
    id: "aws",
    name: "AWS",
    slug: "aws",
    category: "fullstack",
    icon: "AW",
    blurb: "Compute, storage, networking, serverless, and well-architected design.",
    resources: [
      { title: "AWS Well-Architected Framework", url: "https://aws.amazon.com/architecture/well-architected/", type: "doc" },
      { title: "AWS Documentation", url: "https://docs.aws.amazon.com/", type: "doc" },
      { title: "Open Guide to AWS", url: "https://github.com/open-guides/og-aws", type: "repo" },
    ],
  },
  {
    id: "postgres",
    name: "PostgreSQL / SQL",
    slug: "postgres",
    category: "fullstack",
    icon: "PG",
    blurb: "Indexes, transactions, MVCC, query planning, and scaling.",
    resources: [
      { title: "PostgreSQL Official Docs", url: "https://www.postgresql.org/docs/current/", type: "doc" },
      { title: "Use The Index, Luke!", url: "https://use-the-index-luke.com/", type: "article" },
      { title: "PostgreSQL Tutorial", url: "https://www.postgresqltutorial.com/", type: "doc" },
    ],
  },
  {
    id: "mongodb",
    name: "MongoDB / NoSQL",
    slug: "mongodb",
    category: "fullstack",
    icon: "MG",
    blurb: "Documents, aggregation, indexing, replica sets, and sharding.",
    resources: [
      { title: "MongoDB Manual", url: "https://www.mongodb.com/docs/manual/", type: "doc" },
      { title: "Data Modeling Introduction", url: "https://www.mongodb.com/docs/manual/data-modeling/", type: "doc" },
      { title: "MongoDB University (free courses)", url: "https://learn.mongodb.com/", type: "video" },
    ],
  },
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    slug: "dsa",
    category: "dsa",
    icon: "DS",
    blurb: "Arrays, trees, graphs, sorting, DP — with interactive visualizations.",
    resources: [
      { title: "VisuAlgo (algorithm visualizations)", url: "https://visualgo.net/en", type: "doc" },
      { title: "Tech Interview Handbook", url: "https://github.com/yangshun/tech-interview-handbook", type: "repo" },
      { title: "NeetCode (free problem walkthroughs)", url: "https://neetcode.io/", type: "video" },
    ],
  },
  {
    id: "system-design",
    name: "System Design",
    slug: "system-design",
    category: "system-design",
    icon: "SD",
    blurb: "Scalability, caching, sharding, consistency, and large-scale designs.",
    resources: [
      { title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", type: "repo" },
      { title: "ByteByteGo Blog (free articles)", url: "https://bytebytego.com/", type: "article" },
      { title: "Awesome Scalability", url: "https://github.com/binhnguyennus/awesome-scalability", type: "repo" },
    ],
  },
];

export const topicById = Object.fromEntries(topics.map((t) => [t.id, t]));
