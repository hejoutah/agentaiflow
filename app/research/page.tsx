"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  RotateCcw,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import AgentCard from "@/components/AgentCard";
import { AGENTS, type AgentRole, type AgentStatus } from "@/lib/agents";
import { RESEARCH_SCENARIOS, type ResearchScenario } from "@/lib/researchData";
import { cn, sleep } from "@/lib/utils";

const PIPELINE: AgentRole[] = [
  "decomposer",
  "researcher",
  "synthesizer",
  "fact_checker",
  "writer",
];

export default function ResearchPage() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number>(-1);
  const [statuses, setStatuses] = useState<Record<AgentRole, AgentStatus>>(
    initialStatuses()
  );
  const [finished, setFinished] = useState(false);
  const [stepNotes, setStepNotes] = useState<Record<string, string[]>>({});

  const scenario: ResearchScenario = RESEARCH_SCENARIOS[scenarioIdx];

  const reset = () => {
    setRunning(false);
    setCompletedSteps(-1);
    setFinished(false);
    setStepNotes({});
    setStatuses(initialStatuses());
  };

  const pickScenario = (idx: number) => {
    if (running) return;
    setScenarioIdx(idx);
    reset();
  };

  const run = async () => {
    if (running) return;
    reset();
    setRunning(true);

    for (let i = 0; i < scenario.steps.length; i++) {
      const step = scenario.steps[i];
      setStatuses((prev) => ({ ...prev, [step.agentId]: "running" }));
      await sleep(step.delayMs);
      setStepNotes((prev) => ({
        ...prev,
        [`${i}`]: [step.output, ...(step.details || [])],
      }));
      setStatuses((prev) => ({ ...prev, [step.agentId]: "done" }));
      setCompletedSteps(i);
      await sleep(220);
    }
    setFinished(true);
    setRunning(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-accent mb-3">
          <Sparkles className="w-4 h-4" /> Demo 2
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          <span className="gradient-text">Research</span> Pipeline
        </h1>
        <p className="text-muted max-w-2xl mx-auto">
          A 5-stage agentic workflow: <em>decompose</em> → <em>search</em> →{" "}
          <em>synthesise</em> → <em>fact-check</em> → <em>write</em>. Watch agents
          pass typed artifacts and inspect the intermediate output of each stage.
        </p>
      </div>

      {/* Scenario picker */}
      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        {RESEARCH_SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => pickScenario(i)}
            disabled={running}
            className={cn(
              "text-left rounded-xl p-4 border transition",
              scenarioIdx === i
                ? "bg-primary/15 border-primary/40 ring-1 ring-primary/30"
                : "bg-white/[0.03] border-border hover:bg-white/5",
              running && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{s.emoji}</span>
              <span className="text-[10px] uppercase tracking-widest text-muted">
                {s.topic}
              </span>
            </div>
            <p className="text-sm font-medium leading-snug">{s.question}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="text-sm text-muted">
          Active query:{" "}
          <span className="text-white">{scenario.question}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={run}
            disabled={running}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            {running ? "Running..." : finished ? "Re-run" : "Run pipeline"}
          </button>
          <button
            onClick={reset}
            disabled={running}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-xl text-muted hover:text-white transition disabled:opacity-50"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pipeline graph */}
      <div className="glass rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-400" /> Workflow Graph
          </h3>
          <span className="text-xs text-muted">
            {completedSteps + 1} / {scenario.steps.length} stages complete
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto py-2">
          {PIPELINE.map((role, i) => {
            const agent = AGENTS[role];
            const status = statuses[role];
            const isLast = i === PIPELINE.length - 1;
            return (
              <div key={role} className="flex items-center shrink-0">
                <PipelineNode
                  agent={agent}
                  status={status}
                  index={i}
                  total={PIPELINE.length}
                />
                {!isLast && (
                  <div className="w-8 sm:w-12 mx-1 relative h-0.5 bg-white/10 rounded-full overflow-hidden">
                    {(status === "done" || status === "running") && (
                      <motion.div
                        layout
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent"
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Steps + final answer */}
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-3">
          <h3 className="text-sm uppercase tracking-widest text-muted mb-1">
            Stage Outputs
          </h3>
          <AnimatePresence>
            {scenario.steps.map((step, i) => {
              const isReached = completedSteps >= i;
              const note = stepNotes[`${i}`];
              const agent = AGENTS[step.agentId];
              return (
                <motion.div
                  key={`${scenarioIdx}-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "glass rounded-xl p-4",
                    isReached
                      ? "border border-emerald-500/20"
                      : "border border-white/5 opacity-50"
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={cn(
                        "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-base shrink-0",
                        agent.color
                      )}
                    >
                      {agent.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm">{step.title}</span>
                        <span className="text-[10px] uppercase tracking-wider text-muted whitespace-nowrap">
                          {agent.name}
                        </span>
                      </div>
                      <p className="text-xs text-muted">
                        Stage {i + 1} of {scenario.steps.length}
                      </p>
                    </div>
                  </div>
                  {note && (
                    <div className="mt-2 ml-10 space-y-1">
                      <p className="text-xs text-emerald-300 font-medium">
                        → {note[0]}
                      </p>
                      {note.slice(1).length > 0 && (
                        <ul className="text-xs text-muted space-y-0.5 list-none">
                          {note.slice(1).map((d, k) => (
                            <li key={k} className="flex items-start gap-2">
                              <ArrowRight className="w-3 h-3 mt-0.5 shrink-0 text-primary-400" />
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm uppercase tracking-widest text-muted mb-1">
            Final Answer
          </h3>
          {!finished ? (
            <div className="glass rounded-2xl p-8 text-center text-muted text-sm">
              <BookOpen className="w-8 h-8 mx-auto mb-3 text-muted/50" />
              The Writer agent will produce the final answer once the upstream
              stages complete.
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="glass rounded-2xl p-5 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-3 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-widest font-semibold">
                    Composed answer
                  </span>
                </div>
                <FormattedAnswer text={scenario.finalAnswer} />
              </div>

              <div className="glass rounded-2xl p-5">
                <div className="text-xs uppercase tracking-widest text-muted mb-3">
                  Citations ({scenario.citations.length})
                </div>
                <ul className="space-y-2">
                  {scenario.citations.map((c, i) => (
                    <li key={i} className="text-xs flex gap-2">
                      <span className="text-primary-400 shrink-0">[{i + 1}]</span>
                      <span>
                        <span className="text-white">{c.title}</span> ·{" "}
                        <span className="text-muted">{c.source}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {PIPELINE.map((r) => {
                  const agent = AGENTS[r];
                  return (
                    <div
                      key={r}
                      className="glass rounded-lg p-2 text-center"
                    >
                      <div className="text-xl">{agent.emoji}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted mt-1 truncate">
                        {agent.name}
                      </div>
                      <div className="text-[10px] text-emerald-300 mt-0.5">
                        ✓ done
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Live agent strip */}
      <div className="mt-10">
        <h3 className="text-sm uppercase tracking-widest text-muted mb-3">
          Active Agents
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {PIPELINE.map((r) => (
            <AgentCard
              key={r}
              agent={AGENTS[r]}
              status={statuses[r]}
              highlight={statuses[r] === "running"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PipelineNode({
  agent,
  status,
  index,
  total,
}: {
  agent: (typeof AGENTS)[AgentRole];
  status: AgentStatus;
  index: number;
  total: number;
}) {
  const active = status === "running";
  const done = status === "done";
  return (
    <div className="flex flex-col items-center">
      <motion.div
        animate={{ scale: active ? [1, 1.05, 1] : 1 }}
        transition={{ repeat: active ? Infinity : 0, duration: 1.5 }}
        className={cn(
          "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl border-2 transition-colors",
          agent.color,
          done
            ? "border-emerald-400/60"
            : active
            ? "border-primary/60"
            : "border-white/10"
        )}
        style={{
          boxShadow: active ? `0 0 30px -5px ${agent.glowColor}` : undefined,
        }}
      >
        {agent.emoji}
      </motion.div>
      <div className="mt-1 text-center">
        <div className="text-[10px] uppercase tracking-wider text-muted">
          step {index + 1}/{total}
        </div>
        <div className="text-xs font-medium">{agent.name}</div>
      </div>
    </div>
  );
}

function FormattedAnswer({ text }: { text: string }) {
  // Simple markdown-ish rendering (paragraphs + **bold**)
  const parts = text.split(/\n\n+/);
  return (
    <div className="space-y-3 text-sm text-muted leading-relaxed">
      {parts.map((p, i) => (
        <p key={i} dangerouslySetInnerHTML={{ __html: renderInline(p) }} />
      ))}
    </div>
  );
}

function renderInline(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*([^*]+)\*\*/g, "<strong class='text-white'>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br />");
}

function initialStatuses(): Record<AgentRole, AgentStatus> {
  return {
    architect: "idle",
    security: "idle",
    performance: "idle",
    style: "idle",
    decomposer: "idle",
    researcher: "idle",
    synthesizer: "idle",
    fact_checker: "idle",
    writer: "idle",
    hint: "idle",
    validator: "idle",
    scorer: "idle",
  };
}
