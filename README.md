# IntervuPrep

An open, visual learning platform for **DSA**, **system design**, and **full-stack interview prep**.
Browse questions by topic and difficulty, attach curated open-source learning links and code
examples, track mastery with spaced repetition, test yourself in quiz/mock mode — and *see*
concepts through interactive 2D (and selective 3D) animations.

> Built as a portfolio project showcasing React, TypeScript, Node, PostgreSQL/MongoDB and AWS.

---

## Vision

Most interview prep is walls of text. IntervuPrep is different: every concept can be paired with
an **interactive animation** (watch quicksort partition, a BFS flood a graph, or a request flow
through a load balancer → cache → DB). Learning by seeing + doing beats memorizing.

Useful for anyone learning DSA or system design — not just interview candidates.

---

## Feature roadmap

| Phase | Scope | Status |
|-------|-------|--------|
| 1 | Local-first web app: browse/filter questions & concepts, question detail, personal notes | Done |
| 2 | Node/Express + Postgres backend, auth, server-synced notes & progress | Done |
| 3 | Spaced repetition (SM-2), "due today" review queue, stats dashboard | Done |
| 4 | Quiz + timed mock-interview mode, PWA offline/installable | Done |
| 5 | Interactive visualizers (sorting, binary search, BFS/DFS, linked list, BST, Dijkstra, request flow) | Done |
| 6 | Runnable code snippets, 3D hero scenes, PDF export, deploy | Future |

### Features at a glance
- **310+ questions** and **40+ in-house concept explanations** across 9 topics, every one with curated free learning URLs.
- **7 interactive visualizers** (DSA + system design) built on a reusable step-generator + player framework.
- **Quiz mode** (self-test) and **timed mock-interview mode**.
- **Spaced-repetition review** (SM-2) with a due-today queue.
- **Stats dashboard**: overall/per-topic/per-difficulty mastery and review counts.
- **Accounts** (JWT) that sync notes & progress across devices; full **guest mode** with localStorage.
- **PWA**: installable and works offline.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full technical design.

---

## Tech stack

- **Frontend:** React + TypeScript + Vite, Tailwind CSS, React Router, Framer Motion (animations)
- **Backend (Phase 2+):** Node + Express + TypeScript, Prisma
- **Database:** PostgreSQL (users/progress) + optional MongoDB (question content)
- **PWA:** Vite PWA plugin (Workbox) + IndexedDB
- **Infra:** AWS (S3 + CloudFront for FE, ECS/Lambda for API, RDS for DB), GitHub Actions CI/CD

---

## Project structure

```
intervu-prep/
├─ README.md              # this file
├─ ARCHITECTURE.md        # full design: data model, API, visualization framework
├─ DEPLOYMENT.md          # deploy for free (Vercel + Render + Neon)
├─ client/                # React + TS frontend
│  ├─ src/
│  │  ├─ components/       # shared UI
│  │  ├─ data/            # seeded questions, concepts & topics
│  │  ├─ pages/           # route pages (Home, Topic, Question, Concept, Visualize, Account)
│  │  ├─ visualizers/     # animation framework + individual visualizers
│  │  ├─ api/             # backend API client
│  │  ├─ state/           # auth + progress context (syncs to backend)
│  │  └─ types.ts         # shared TypeScript types
└─ server/                # Node + Express + Prisma backend (auth + sync)
   ├─ prisma/schema.prisma # User, Note, Progress models
   └─ src/                 # env, db, auth (JWT), routes (auth, sync)
```

---

## Running from a fresh copy (e.g. after unzipping)

The zip does **not** include `node_modules` or build output, so install dependencies first.
You need **Node.js 18+** installed.

```bash
# 1) Frontend
cd client
npm install
npm run dev            # open http://localhost:5173  (works fully as a guest)

# 2) Backend (optional — only for account sync across devices)
cd ../server
npm install
copy .env.example .env        # then edit values (Windows);  cp on macOS/Linux
npm run prisma:generate
npm run prisma:migrate        # requires a local PostgreSQL + DATABASE_URL in .env
npm run dev                   # http://localhost:4000
```

The app is fully usable with just the frontend (progress saved in your browser). See
DEPLOYMENT.md to host it online for free.

## Getting started

Frontend:
```bash
cd client
npm install
npm run dev      # start dev server (http://localhost:5173)
npm run build    # production build
npm run preview  # preview the build
```

Backend (optional — enables cross-device sync via accounts):
```bash
cd server
npm install
npm run prisma:generate
npm run prisma:migrate   # requires local Postgres + server/.env
npm run dev              # API on http://localhost:4000
```

The app works fully as a guest (progress saved in `localStorage`). Running the backend
and signing in syncs your notes and progress across devices. See DEPLOYMENT.md to host
the whole thing for free.

---

## The visualization framework (core idea)

Each algorithm is modeled as a **step generator** that `yield`s immutable snapshots of state
(array values, highlighted indices, pointers, notes). The UI is a dumb **renderer** that draws the
current step and animates transitions with Framer Motion. This cleanly separates *algorithm logic*
from *rendering*, so:

- Algorithms are unit-testable in isolation.
- Adding a new visualizer = write a step generator + a small renderer.
- Play / pause / step / rewind / speed / edit-input come for free from the shared player.

See `client/src/visualizers/` and ARCHITECTURE.md for details.

---

## License

Intended to reference **open-source / free** learning resources (MDN, javascript.info, react.dev,
system-design-primer, etc.). Content links are stored as data so the library can grow over time.
