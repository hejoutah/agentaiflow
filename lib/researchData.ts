import type { AgentRole } from "./agents";

export interface ResearchStep {
  agentId: AgentRole;
  title: string;
  output: string;
  details?: string[];
  delayMs: number;
}

export interface ResearchScenario {
  id: string;
  question: string;
  topic: string;
  emoji: string;
  steps: ResearchStep[];
  finalAnswer: string;
  citations: Array<{ title: string; source: string }>;
}

export const RESEARCH_SCENARIOS: ResearchScenario[] = [
  {
    id: "agentic-design",
    question: "What design patterns make multi-agent systems reliable?",
    topic: "Agentic Architecture",
    emoji: "🏛️",
    steps: [
      {
        agentId: "decomposer",
        title: "Decomposing query",
        output: "Splitting into 3 sub-questions",
        details: [
          "1. What failure modes occur in multi-agent systems?",
          "2. Which orchestration patterns mitigate them?",
          "3. How is reliability measured?",
        ],
        delayMs: 1200,
      },
      {
        agentId: "researcher",
        title: "Searching knowledge base",
        output: "Retrieved 14 sources, kept top 6",
        details: [
          "Hierarchical Orchestrator pattern (Microsoft, 2024)",
          "Reflexion: language agents with verbal RL (Shinn 2023)",
          "MetaGPT: meta-programming for multi-agent (2023)",
          "Constitutional AI guardrails (Anthropic, 2022)",
          "ReAct: synergizing reasoning and acting (Yao 2023)",
          "AutoGen: enabling next-gen LLM apps (Microsoft 2023)",
        ],
        delayMs: 1800,
      },
      {
        agentId: "synthesizer",
        title: "Cross-referencing findings",
        output: "Identified 4 recurring patterns",
        details: [
          "Reflection / self-critique loops",
          "Hierarchical orchestrator → workers",
          "Tool-use with explicit schemas",
          "Voting / debate among peer agents",
        ],
        delayMs: 1400,
      },
      {
        agentId: "fact_checker",
        title: "Verifying claims",
        output: "All 4 patterns cross-confirmed by ≥3 sources",
        details: [
          "Reflection: confirmed (Reflexion, AutoGen, MetaGPT)",
          "Hierarchical: confirmed (AutoGen, LangGraph, MetaGPT)",
          "Tool-schema: confirmed (ReAct, OpenAI tools, Anthropic)",
          "Debate: confirmed (Du 2023, Liang 2023)",
        ],
        delayMs: 1300,
      },
      {
        agentId: "writer",
        title: "Composing final answer",
        output: "Drafted 4-section response with citations",
        delayMs: 1000,
      },
    ],
    finalAnswer: `Reliable multi-agent systems consistently rely on **four orthogonal design patterns**:

**1. Reflection loops** — agents self-critique drafts before committing. Reflexion (Shinn 2023) shows up to **+22%** task accuracy from a single critique pass.

**2. Hierarchical orchestration** — a planner agent decomposes work and delegates to specialists. AutoGen and LangGraph treat this as the default topology because it bounds error propagation.

**3. Schema-bound tool use** — every agent action is constrained by a typed JSON schema (ReAct + OpenAI tools / MCP). This prevents hallucinated tool calls and makes failures reproducible.

**4. Peer debate / voting** — multiple agents independently produce answers; a judge agent picks the consensus. Du 2023 reports a **~15%** lift on reasoning benchmarks.

Across these, the common reliability lever is **structured intermediate state** — agents pass typed artifacts, not free-form chat — which is what AGENTFLOW visualizes in this very pipeline.`,
    citations: [
      { title: "Reflexion: Language Agents with Verbal Reinforcement Learning", source: "Shinn et al. 2023" },
      { title: "AutoGen: Enabling Next-Gen LLM Applications", source: "Microsoft 2023" },
      { title: "ReAct: Synergizing Reasoning and Acting in Language Models", source: "Yao et al. 2023" },
      { title: "MetaGPT: Meta Programming for Multi-Agent Collaborative Framework", source: "Hong et al. 2023" },
      { title: "Improving Factuality and Reasoning via Multi-Agent Debate", source: "Du et al. 2023" },
    ],
  },
  {
    id: "evaluating-agents",
    question: "How should I evaluate an autonomous coding agent?",
    topic: "Agent Evaluation",
    emoji: "📊",
    steps: [
      {
        agentId: "decomposer",
        title: "Decomposing query",
        output: "Splitting into 3 sub-questions",
        details: [
          "1. What benchmarks exist for coding agents?",
          "2. What metrics matter beyond pass-rate?",
          "3. How to measure cost / latency tradeoffs?",
        ],
        delayMs: 1100,
      },
      {
        agentId: "researcher",
        title: "Searching knowledge base",
        output: "Retrieved 11 sources, kept top 5",
        details: [
          "SWE-bench (Jimenez 2023) — real GitHub issues",
          "HumanEval (Chen 2021) — function-level",
          "MBPP — short programming problems",
          "Aider polyglot benchmark",
          "BigCodeBench — multi-file tasks",
        ],
        delayMs: 1700,
      },
      {
        agentId: "synthesizer",
        title: "Combining metrics",
        output: "Built a 5-axis evaluation rubric",
        details: [
          "Pass-rate at k attempts",
          "Tokens / dollars per resolved task",
          "Tool-call accuracy",
          "Diff size vs. ground truth",
          "Recovery from compile / test errors",
        ],
        delayMs: 1300,
      },
      {
        agentId: "fact_checker",
        title: "Cross-checking thresholds",
        output: "Reasonable thresholds confirmed across 4 sources",
        delayMs: 1200,
      },
      {
        agentId: "writer",
        title: "Composing final answer",
        output: "Drafted evaluation guide",
        delayMs: 900,
      },
    ],
    finalAnswer: `A useful evaluation has **5 axes**, not just pass-rate:

**1. Resolution rate on real issues** — SWE-bench Verified is the current gold standard for real GitHub issues. Aim for ≥**40%** to be competitive.

**2. Cost efficiency** — tokens (or USD) per resolved task. A passing agent that costs **$5/task** is worse than a 90% one at **$0.40/task**.

**3. Tool-call accuracy** — fraction of tool calls that succeed without retry. Below **85%** indicates poor schema discipline.

**4. Diff minimality** — agents that touch fewer lines produce safer PRs. Track median diff vs. ground-truth.

**5. Recovery from failure** — instrument compile / test loops; measure how often the agent self-corrects within k iterations.

Run this rubric on a held-out 50–100 task slice every release; regressions on cost or recovery tend to surface before pass-rate drops, so they're early warning signals.`,
    citations: [
      { title: "SWE-bench: Can LLMs Resolve Real-World GitHub Issues?", source: "Jimenez et al. 2023" },
      { title: "HumanEval", source: "Chen et al. 2021" },
      { title: "BigCodeBench", source: "BigCode Project 2024" },
      { title: "Aider Polyglot Benchmark", source: "Aider 2024" },
    ],
  },
  {
    id: "context-engineering",
    question: "What is context engineering and why does it matter?",
    topic: "Context Engineering",
    emoji: "🧠",
    steps: [
      {
        agentId: "decomposer",
        title: "Decomposing query",
        output: "Splitting into 3 sub-questions",
        details: [
          "1. What is the definition of context engineering?",
          "2. How does it differ from prompt engineering?",
          "3. What are the core techniques?",
        ],
        delayMs: 1000,
      },
      {
        agentId: "researcher",
        title: "Searching knowledge base",
        output: "Retrieved 9 sources, kept top 4",
        details: [
          "Karpathy on context engineering (2024)",
          "Anthropic — XML structuring",
          "OpenAI — function calling guide",
          "Lost-in-the-middle phenomenon (Liu 2023)",
        ],
        delayMs: 1500,
      },
      {
        agentId: "synthesizer",
        title: "Synthesizing definition",
        output: "Distilled into a one-line and a long form",
        delayMs: 1200,
      },
      {
        agentId: "fact_checker",
        title: "Cross-validation",
        output: "Definition aligns with 4/4 sources",
        delayMs: 1100,
      },
      {
        agentId: "writer",
        title: "Composing answer",
        output: "Final draft with practical checklist",
        delayMs: 900,
      },
    ],
    finalAnswer: `**Context engineering** is the practice of choosing **what** information enters a model's context window, **where** in the prompt it sits, and **how** it is structured — so that the model produces correct, low-latency outputs.

Compared to prompt engineering, it is **architectural**: it spans retrieval, memory, tool schemas, and response shaping rather than wording.

Core techniques:

**1. Retrieval-first ordering** — facts at the top, instructions near the bottom (mitigates lost-in-the-middle).

**2. Structured templates** — XML / Markdown sections so the model can attend to roles ("<context>", "<task>", "<format>").

**3. Schema-driven tool use** — typed JSON schemas eliminate parsing errors and reduce hallucinated tool names.

**4. Memory tiers** — working memory (current turn), session memory (recent turns), and long-term store (vector DB) — each with its own truncation policy.

**5. Adversarial pruning** — actively removing low-signal context. Smaller windows often outperform larger ones.

Treat the context window as a **product surface**, not a paste-bin. AGENTFLOW's research demo above shows context being progressively narrowed by each agent — that's context engineering in motion.`,
    citations: [
      { title: "Lost in the Middle: How LMs Use Long Contexts", source: "Liu et al. 2023" },
      { title: "Anthropic — Long Context Tips", source: "Anthropic 2024" },
      { title: "OpenAI Function Calling Guide", source: "OpenAI 2024" },
      { title: "On Context Engineering", source: "A. Karpathy 2024" },
    ],
  },
];
