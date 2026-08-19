# IntervuPrep — Architecture

This document describes the technical design of IntervuPrep across all phases. Phase 1 (the current
implementation) is a local-first React app; later phases add a backend, spaced repetition, quizzes,
PWA offline, and deployment.

---

## 1. High-level architecture

```
                        ┌──────────────────────────────┐
                        │        React PWA (client)     │
                        │  React + TS + Tailwind + FM   │
                        │  - Browse / filter questions  │
                        │  - Question detail + notes    │
                        │  - Visualizers (2D / 3D)      │
                        │  - Quiz / mock mode           │
                        │  Offline: Workbox + IndexedDB │
                        └───────────────┬──────────────┘
                          TanStack Query │ REST/JSON
                        ┌───────────────▼──────────────┐
                        │      API (Node + Express)     │
                        │  Auth (JWT) · Prisma ORM      │
                        │  Rate limiting · validation   │
                        └───────┬───────────────┬──────┘
                                │               │
                     ┌──────────▼───┐    ┌──────▼───────┐
                     │  PostgreSQL   │    │ Redis (opt)  │
                     │ users/progress│    │ sessions/RL  │
                     └───────────────┘    └──────────────┘
       (optional) MongoDB for rich question content / examples / visualizations
```

Phase 1 runs only the client box; questions are bundled as data and notes/progress live in
`localStorage`. Phases 2+ introduce the API and databases without changing the UI contracts.

---

## 2. Data model (PostgreSQL, Phase 2+)

```
User          (id, email, passwordHash, displayName, createdAt)
Topic         (id, name, slug, category[dsa|system-design|fullstack], order)
Question      (id, topicId, difficulty, text, order, tags[])
Resource      (id, questionId?, topicId?, title, url, type[doc|video|article|repo])
Example       (id, questionId, language, code, explanation)
Visualization (id, questionId?, topicId?, kind[array|tree|graph|flow|scene3d], config json)
UserNote      (id, userId, questionId, content, updatedAt)   -- unique(userId, questionId)
Review        (id, userId, questionId, easeFactor, interval, repetitions, dueDate, lastRating)
QuizSession   (id, userId, mode, config json, score, startedAt, finishedAt)
QuizItem      (id, sessionId, questionId, selfRating, timeSpent)
```

Difficulty enum: `basic | intermediate | advanced | insane`
(system design uses `fundamentals | easy | medium | hard | insane`).

### Polyglot option
Question content (text, examples, resources, visualization configs) is document-shaped and can live
in **MongoDB**, while user/progress/auth stays in **PostgreSQL**. This justifies polyglot
persistence and is a good interview talking point.

---

## 3. API design (REST, Phase 2+)

```
POST   /auth/register              POST /auth/login      POST /auth/refresh
GET    /topics                     GET  /topics/:slug
GET    /questions?topic=&difficulty=&q=&due=true         (paginated)
GET    /questions/:id              (question + resources + examples + visualizations + my note)
PUT    /questions/:id/note         (upsert personal note)
POST   /questions/:id/review       (submit SM-2 rating -> update schedule)
GET    /reviews/due                (today's spaced-repetition queue)
POST   /quiz/sessions              GET  /quiz/sessions/:id   POST /quiz/sessions/:id/finish
GET    /stats                      (mastery %, streak, per-topic progress)
```

Validation with Zod; auth via short-lived JWT access token + httpOnly refresh cookie.

---

## 4. Visualization framework

The heart of the learning experience. Two clean layers:

### 4.1 Step generator (pure logic)
An algorithm is a generator function that yields immutable **steps**. A step describes *what to show*,
never *how to draw it*:

```ts
interface ArrayStep {
  array: number[];
  highlights: number[];      // indices under comparison
  sorted: number[];          // indices in final position
  pointers?: Record<string, number>;  // e.g. { i: 2, j: 5 }
  note: string;              // human explanation of this step
}

function* bubbleSort(input: number[]): Generator<ArrayStep> { ... }
```

Because it is pure, each algorithm is trivially **unit-testable** (assert the sequence/finale).

### 4.2 Renderer + Player (dumb UI)
- A shared **Player** component owns playback state: current step index, play/pause, speed,
  step forward/back, reset, and "edit input".
- A **Renderer** (e.g. `ArrayBars`) draws the current step; **Framer Motion** animates transitions
  (bar heights, color for highlight/sorted, moving pointers).

Adding a visualizer = write a step generator + reuse/extend a renderer. The Player is generic.

### 4.3 Renderer kinds
| kind    | tech                      | used for |
|---------|---------------------------|----------|
| array   | SVG/HTML + Framer Motion  | sorting, two-pointer, sliding window, binary search |
| tree    | SVG + Framer Motion       | BST, heap, traversals, recursion trees |
| graph   | D3 / React Flow           | BFS/DFS, Dijkstra, union-find |
| flow    | React Flow                | system-design request flow, caching, sharding, replication |
| scene3d | React Three Fiber + drei  | data-center/region scenes, memory tape, event loop (selective) |

### 4.4 On 3D
2D is the primary teaching medium (clearer + cheaper). 3D (React Three Fiber) is reserved for a few
"hero" explainers where spatial layout genuinely helps: multi-region distributed DBs, a rotating
data-center/cluster, or a globe of CDN edge nodes.

---

## 5. Spaced repetition (SM-2)

Each `Review` tracks `easeFactor`, `interval`, `repetitions`, `dueDate`. On each review the user
rates recall (Again/Hard/Good/Easy); SM-2 recomputes the next due date. The "Due today" queue
surfaces items right before predicted forgetting. Self-contained, testable, impressive to explain.

---

## 6. PWA / offline (Phase 4)

- Vite PWA plugin (Workbox) precaches the app shell + bundled content.
- IndexedDB stores notes/progress offline; a sync queue flushes to the API on reconnect.
- Installable to home screen; fully usable offline for study.

---

## 7. Deployment (Phase 4)

- **Frontend:** S3 + CloudFront (or Vercel).
- **API:** AWS ECS/Fargate or Lambda + API Gateway (showcases serverless + AWS skills).
- **DB:** RDS (PostgreSQL); Redis via ElastiCache if used.
- **CI/CD:** GitHub Actions — lint, typecheck, test, build, deploy.

---

## 8. Phase 1 implementation (current)

- Data: `client/src/data/` — topics + questions (seeded from the existing PDF question sets).
- Pages: Home (topic grid + stats), Topic (filterable question list), Question (detail + notes +
  linked resources), Visualize (interactive visualizer gallery).
- Notes & "mastered" flags persist in `localStorage` via a `useLocalStorage` hook.
- First visualizer: **sorting** (bubble/selection/insertion/quick) using the step-generator +
  Framer Motion pattern, with play/step/speed/edit-input controls.
