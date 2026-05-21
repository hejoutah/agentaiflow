# AGENTFLOW — Multi-Agent AI Workflow Platform

> An open-source playground that **visualises and runs multi-agent AI workflows** end-to-end. Built to showcase agentic collaboration patterns: hierarchical orchestration, schema-bound tool use, reflection loops, and peer voting.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)

---

## What is AGENTFLOW?

AGENTFLOW is a fully working web app that demonstrates **how multiple AI agents collaborate to solve real tasks**. It is not a slide deck or a chat-only demo — every workflow runs deterministic, inspectable logic that you can read, fork, and extend.

It ships with **three live demos**:

| # | Demo                             | Pattern                            | Agents                                                          |
|---|----------------------------------|------------------------------------|-----------------------------------------------------------------|
| 1 | **Multi-Agent Code Review**      | Parallel specialists + orchestrator | Architect, Security, Performance, Style                         |
| 2 | **Research Pipeline**            | Hierarchical pipeline (5 stages)   | Decomposer → Researcher → Synthesizer → Fact-Checker → Writer   |
| 3 | **Bug Hunter Game** (gamified)   | Mentor / Judge / Scorekeeper trio  | Mentor (hints), Judge (validator), Scorekeeper (XP & streaks)   |

**12 distinct agent roles**, **20+ static-analysis heuristics**, and a polished UI built with Next.js 14, Tailwind, and Framer Motion. **No API key required** — everything runs client-side and is deterministic, so the demos work offline and never break.

---

## Why this matters (agentic AI patterns)

The project is a working reference for the four design patterns that consistently make multi-agent systems reliable in production:

1. **Reflection / self-critique** — agents critique their own draft before committing.
2. **Hierarchical orchestration** — a planner decomposes work and delegates to specialists.
3. **Schema-bound tool use** — every agent action is constrained by a typed contract (`AgentMessage`, `Finding`, `ResearchStep`).
4. **Peer voting / debate** — multiple specialists produce findings; the orchestrator ranks by severity.

Each demo is an executable example of these patterns. See [`lib/agents.ts`](lib/agents.ts), [`lib/codeAnalyzer.ts`](lib/codeAnalyzer.ts), and [`lib/researchData.ts`](lib/researchData.ts) for the typed agent definitions and workflows.

---

## Demos in detail

### 1. Multi-Agent Code Review (`/code-review`)

Four specialist agents read the same code and emit findings in parallel:

- **🏛️ Architect** — Detects deep nesting, function/class structure, design issues
- **🛡️ Security** — Hunts XSS (eval, innerHTML), SQL concat, hardcoded secrets, weak randomness
- **⚡ Performance** — Spots O(n²) loops, JSON deep-clone, sequential awaits, microtask hacks
- **✨ Style** — Catches `var`, loose `==`, `console.log`, long lines, TODO markers

Each finding carries a severity (`critical | warning | info | success`) and a fix suggestion. The orchestrator aggregates and ranks them, with a final code-quality score (0–100).

Three sample snippets are included to show the agents reacting differently:
- A vulnerable login (3 critical alerts expected)
- A slow data pipeline (performance smells)
- A clean React component (mostly success findings)

### 2. Research Pipeline (`/research`)

A 5-stage agentic research workflow:

```
Decomposer → Researcher → Synthesizer → Fact-Checker → Writer
   🧩            🔍             🧠              ✅            ✍️
```

Three pre-loaded queries demonstrate the pipeline:
- *"What design patterns make multi-agent systems reliable?"*
- *"How should I evaluate an autonomous coding agent?"*
- *"What is context engineering and why does it matter?"*

Each stage exposes its intermediate output (sub-questions, retrieved sources, synthesised insights) so the entire reasoning trace is auditable. The Writer composes a final answer with citations.

### 3. Bug Hunter Game (`/bug-hunter`)

Six progressive bug challenges (easy → hard). Three agents collaborate:
- **💡 Mentor** — Drops three progressive hints when asked (with XP penalty)
- **⚖️ Judge** — Validates your guess against the bug pattern
- **🎯 Scorekeeper** — Tracks XP, streak bonuses, and level

Bug types covered: off-by-one, mutation side-effects, sequential async, stale closures, greedy regex, and race conditions.

---

## Tech stack

| Layer       | Choice                                                       |
|-------------|--------------------------------------------------------------|
| Framework   | **Next.js 14** (App Router) + **React 18** + **TypeScript 5** |
| Styling     | **Tailwind CSS 3** + custom design system                    |
| Animations  | **Framer Motion 11**                                         |
| Icons       | **Lucide React**                                             |
| Deployment  | **Vercel** (zero-config) — builds to a static-friendly Next app |
| Backend     | **None.** All agent logic is deterministic TypeScript.       |

Why no backend? Because the goal is to make **agentic patterns visible and tinkerable**. Replacing the deterministic heuristic with an LLM call is a one-line swap if you want to extend it.

---

## Quick start

Requires Node 18.17+ (Node 20+ recommended).

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev
# → http://localhost:3000

# 3. Production build (used by Vercel)
npm run build && npm run start
```

That is the full setup. No `.env`, no API keys, no databases.

---

## Deploy to Vercel (60 seconds)

### Option A — One click via GitHub

1. Push this folder to a new GitHub repo (`AGENTFLOW` or any name you like).
2. Open <https://vercel.com/new>.
3. **Import Git Repository** → pick your repo.
4. Framework preset: **Next.js** (auto-detected).
5. Click **Deploy**. Done.

You'll get a URL like `https://agentflow-yourname.vercel.app`.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel
# follow prompts; first deploy takes ~30s
```

No environment variables to configure. Vercel detects Next.js automatically and runs `npm run build`.

---

## Project structure

```
agentflow/
├── app/
│   ├── layout.tsx              # Root layout, fonts, navbar/footer
│   ├── page.tsx                # Landing page (hero + demo cards)
│   ├── globals.css             # Design tokens, glass effects
│   ├── code-review/page.tsx    # Demo 1
│   ├── research/page.tsx       # Demo 2
│   └── bug-hunter/page.tsx     # Demo 3
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── AgentCard.tsx           # Reusable agent visual block
├── lib/
│   ├── agents.ts               # 12 agent definitions (types + metadata)
│   ├── codeAnalyzer.ts         # 20+ heuristics across 4 specialists
│   ├── researchData.ts         # 3 pre-built research scenarios
│   ├── bugChallenges.ts        # 6 progressive bug challenges
│   └── utils.ts                # cn(), sleep(), uniqueId(), etc.
├── package.json
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## Extending AGENTFLOW

Add a new agent role in three steps:

1. **Define it** in `lib/agents.ts`:
   ```ts
   testing: {
     id: "testing",
     name: "Tester",
     emoji: "🧪",
     role: "Test Coverage Agent",
     description: "Estimates test coverage and missing cases.",
     color: "from-lime-500 to-green-500",
     glowColor: "rgba(132, 204, 22, 0.5)",
     expertise: ["Unit Tests", "Edge Cases", "Mocks"],
   },
   ```
2. **Add a heuristic** (in `lib/codeAnalyzer.ts`) or a new pipeline step (in `lib/researchData.ts`).
3. **Render it** with the existing `<AgentCard agent={AGENTS.testing} status={...} />`.

Swap deterministic logic for a real LLM call by replacing the `analyzeCode()` function with a `fetch('/api/analyse', ...)` to your own backend.

---

## License

MIT. Use it, fork it, ship it.

---

## About

AGENTFLOW was built as a **working reference for multi-agent AI workflow patterns**. It demonstrates that agentic systems do not need to be a black box — every agent's role, contract, and contribution can be made visible and inspectable.

If you are evaluating AI-driven workflows or building your own multi-agent system, the codebase here is a small, readable starting point.
