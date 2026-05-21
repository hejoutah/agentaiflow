# Grant Submission Cheatsheet — Xiaomi MiMo Max Plan

> Copy-paste talking points for the form at <https://100t.xiaomimimo.com/>

---

## Form fields — recommended answers

### Q01 — Country / Region
Whatever your real location is (e.g. **Indonesia**).

### Q02 — Which agent tool do you use most? *
Pick whichever you actually used to build AGENTFLOW. Reasonable options:
- **Hermes Agent** — if you used Cascade / Hermes during development
- **Cursor** or **Windsurf** — if you used those IDEs
- **Claude Code** — if you primarily used Anthropic's coding agent
- **Other** — and write the name in the free-text field

### Q03 — Primary model series you use *
Whichever model powered your agent during development:
- **Claude** (Sonnet 4.x / Opus 4.x) — most likely for Cursor / Windsurf / Claude Code
- **MiMo** — bonus relevance points for Xiaomi's own model
- **DeepSeek**, **GPT**, **Gemini** — if you used those

### Q04 — Describe what you've built with agents or AI-driven workflows *
**Paste the block below (≈ 230 words, well above the 100-word requirement).**

---

## Q04 Answer (copy-paste this)

```
PROJECT: AGENTFLOW — Multi-Agent AI Workflow Platform
LIVE DEMO: https://agentflow-<your-subdomain>.vercel.app
GITHUB: https://github.com/<your-username>/agentflow

CORE PROBLEM
Multi-agent AI systems are increasingly used in production, but their
internal collaboration patterns are largely invisible — engineers cannot
easily see HOW agents pass artifacts, reflect, or arbitrate disagreement.
AGENTFLOW solves this by turning agentic workflows into inspectable,
visual, and runnable artifacts.

CORE LOGIC FLOW
The platform implements three concrete agentic patterns end-to-end:

(1) Multi-Agent Code Review — four specialist agents (Architect, Security,
Performance, Style) run 20+ static-analysis heuristics in parallel and
emit typed findings (severity, suggestion, line). An orchestrator ranks
the findings and computes a final quality score. Pattern: parallel
specialists with hierarchical aggregation.

(2) Research Pipeline — a 5-stage hierarchical workflow: Decomposer →
Researcher → Synthesizer → Fact-Checker → Writer. Each stage exposes its
intermediate output (sub-questions, retrieved sources, cross-refs) so the
reasoning trace is fully auditable. Pattern: pipeline + reflection.

(3) Bug Hunter — a gamified Mentor / Judge / Scorekeeper trio that
collaborates to teach debugging. Pattern: peer-roles with scored feedback.

The codebase ships 12 typed agent definitions, schema-bound message
contracts (AgentMessage, Finding, ResearchStep), and deterministic
domain logic in <2,000 lines of TypeScript. It deploys to Vercel in 60
seconds with zero API keys, making it a useful reference for anyone
prototyping agentic systems.

IMPACT
Built in <one week using an AI coding agent. Replaces a typical
"prompt-and-pray" demo with a transparent, forkable reference for
production-grade multi-agent design.
```

---

### Q05 — Proof of usage & impact

You can upload up to 5 files (jpg / png / mp4 etc., 20MB each) and a project link.

**Recommended uploads:**
1. **Screenshot of `/code-review` demo running** — shows 4 agents producing findings
2. **Screenshot of `/research` demo** — shows the pipeline graph + final answer
3. **Screenshot of `/bug-hunter` demo** — shows the agent sidebar + game state
4. **(Optional) AI platform billing screenshot** — e.g. Anthropic / OpenAI usage from past 30 days
5. **(Optional) Terminal recording** — `npm run dev` + clicking through the demos

**Project link to paste:**
- GitHub: `https://github.com/<your-username>/agentflow`
- Live demo: `https://agentflow-<your-subdomain>.vercel.app`

Tip: deploy first, take screenshots from the live URL — looks more polished than localhost.

---

## Quick deployment recap

```bash
# 1. From this folder
npm install
npm run build       # confirm it builds clean
npm run dev         # sanity check at http://localhost:3000

# 2. Push to GitHub
git init
git add .
git commit -m "Initial commit: AGENTFLOW v1.0"
git branch -M main
git remote add origin https://github.com/<you>/agentflow.git
git push -u origin main

# 3. Deploy to Vercel
# Option A: visit vercel.com/new, import the repo, click Deploy
# Option B: CLI
npm i -g vercel
vercel --prod
```

After Vercel finishes (~30s), grab the URL and screenshots and submit the form.

---

## Why this submission has a strong chance

- ✅ **Real working product**, not a slide deck
- ✅ **12 distinct agent roles** with typed schemas — clear architectural depth
- ✅ **3 different agentic patterns** (parallel, pipeline, peer-roles)
- ✅ **20+ heuristics** in production-quality code
- ✅ **Zero-key deploy** — reviewers can click and try it instantly
- ✅ **Open source under MIT** — easy to verify code quality
- ✅ **Aligns with the form's own example** ("automated code refactoring agent on OpenClaw") — Demo #1 is exactly this category

Good luck 🚀
