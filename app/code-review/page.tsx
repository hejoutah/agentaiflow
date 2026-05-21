"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  RotateCcw,
  FileCode2,
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import AgentCard from "@/components/AgentCard";
import { AGENTS, type AgentRole, type AgentStatus } from "@/lib/agents";
import { analyzeCode, SAMPLE_CODE_SNIPPETS, type Finding } from "@/lib/codeAnalyzer";
import { cn, sleep } from "@/lib/utils";

const REVIEWERS: AgentRole[] = ["architect", "security", "performance", "style"];

const DEFAULT_CODE = SAMPLE_CODE_SNIPPETS[0].code;

export default function CodeReviewPage() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [activeSample, setActiveSample] = useState(0);
  const [running, setRunning] = useState(false);
  const [agentStatuses, setAgentStatuses] = useState<Record<AgentRole, AgentStatus>>({
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
  });
  const [findings, setFindings] = useState<Finding[]>([]);
  const [metrics, setMetrics] = useState<{
    totalLines: number;
    functions: number;
    classes: number;
    score: number;
  } | null>(null);
  const [completedAt, setCompletedAt] = useState<number | null>(null);

  const groupedFindings = useMemo(() => {
    const map: Record<AgentRole, Finding[]> = {} as Record<AgentRole, Finding[]>;
    for (const f of findings) {
      map[f.agentId] = map[f.agentId] || [];
      map[f.agentId].push(f);
    }
    return map;
  }, [findings]);

  const handleSample = (idx: number) => {
    if (running) return;
    setActiveSample(idx);
    setCode(SAMPLE_CODE_SNIPPETS[idx].code);
    resetState();
  };

  const resetState = () => {
    setFindings([]);
    setMetrics(null);
    setCompletedAt(null);
    setAgentStatuses({
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
    });
  };

  const setAgent = (id: AgentRole, status: AgentStatus) => {
    setAgentStatuses((prev) => ({ ...prev, [id]: status }));
  };

  const runReview = async () => {
    if (running || !code.trim()) return;
    resetState();
    setRunning(true);

    // Start everyone thinking briefly
    for (const r of REVIEWERS) setAgent(r, "thinking");
    await sleep(500);

    // Compute results (deterministic, fast)
    const result = analyzeCode(code);

    // Then move each agent to "running" in staggered fashion, dropping in findings
    const stagger = 380;
    const finalFindings: Finding[] = [];
    for (let i = 0; i < REVIEWERS.length; i++) {
      const role = REVIEWERS[i];
      setAgent(role, "running");
      await sleep(stagger);
      const myFindings = result.findings.filter((f) => f.agentId === role);
      finalFindings.push(...myFindings);
      setFindings([...finalFindings]);
      setAgent(role, "done");
      await sleep(180);
    }

    setMetrics({
      totalLines: result.metrics.totalLines,
      functions: result.metrics.functions,
      classes: result.metrics.classes,
      score: result.metrics.score,
    });
    setCompletedAt(Date.now());
    setRunning(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary-400 mb-3">
          <Sparkles className="w-4 h-4" /> Demo 1
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          Multi-Agent <span className="gradient-text">Code Review</span>
        </h1>
        <p className="text-muted max-w-2xl mx-auto">
          Four specialist agents read the same code and produce a unified, prioritised
          report. Each agent owns one concern — when they disagree, the orchestrator
          ranks findings by severity.
        </p>
      </div>

      {/* Sample picker */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {SAMPLE_CODE_SNIPPETS.map((s, i) => (
          <button
            key={s.name}
            onClick={() => handleSample(i)}
            disabled={running}
            className={cn(
              "text-xs px-3 py-1.5 rounded-lg border transition",
              activeSample === i
                ? "bg-primary/15 text-primary-400 border-primary/40"
                : "bg-white/[0.03] text-muted border-border hover:bg-white/5",
              running && "opacity-50 cursor-not-allowed"
            )}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* LEFT: Input */}
        <div className="lg:col-span-2">
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-medium">Input Source</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-muted bg-white/5 px-2 py-1 rounded-md border border-border">
                {SAMPLE_CODE_SNIPPETS[activeSample]?.language ?? "code"}
              </span>
            </div>
            <p className="text-xs text-muted mb-3">
              {SAMPLE_CODE_SNIPPETS[activeSample]?.description ??
                "Paste your snippet and run the review."}
            </p>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={running}
              spellCheck={false}
              className="w-full h-80 code-block resize-none text-emerald-50 focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="// paste any JS/TS/Python..."
            />
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={runReview}
                disabled={running || !code.trim()}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-4 py-2.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                {running ? "Reviewing..." : "Run Review"}
              </button>
              <button
                onClick={resetState}
                disabled={running}
                className="inline-flex items-center gap-2 glass px-4 py-2.5 rounded-xl text-muted hover:text-white transition disabled:opacity-50"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {metrics && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 grid grid-cols-4 gap-2"
              >
                <Metric label="lines" value={metrics.totalLines} />
                <Metric label="fns" value={metrics.functions} />
                <Metric label="classes" value={metrics.classes} />
                <Metric label="score" value={`${metrics.score}`} highlight />
              </motion.div>
            )}
          </div>

          {completedAt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 glass rounded-2xl p-4 text-xs text-muted"
            >
              <div className="flex items-center gap-2 text-emerald-300 mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-medium">Orchestrator summary</span>
              </div>
              <p>
                <span className="text-white">{findings.length}</span> finding
                {findings.length === 1 ? "" : "s"} across{" "}
                <span className="text-white">{REVIEWERS.length}</span> agents.
                Critical:{" "}
                <span className="text-rose-300">
                  {findings.filter((f) => f.severity === "critical").length}
                </span>
                {" · "}Warnings:{" "}
                <span className="text-amber-300">
                  {findings.filter((f) => f.severity === "warning").length}
                </span>
                {" · "}OK:{" "}
                <span className="text-emerald-300">
                  {findings.filter((f) => f.severity === "success").length}
                </span>
                .
              </p>
            </motion.div>
          )}
        </div>

        {/* RIGHT: Agents + findings */}
        <div className="lg:col-span-3 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            {REVIEWERS.map((r) => (
              <AgentCard
                key={r}
                agent={AGENTS[r]}
                status={agentStatuses[r]}
                highlight={agentStatuses[r] === "running"}
              />
            ))}
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Findings stream</h3>
              <span className="text-xs text-muted">
                {findings.length} total
              </span>
            </div>
            {findings.length === 0 ? (
              <div className="text-center py-12 text-muted text-sm">
                {running
                  ? "Agents are analysing the code..."
                  : "Press Run Review to start the agents."}
              </div>
            ) : (
              <div className="space-y-2 max-h-[560px] overflow-y-auto pr-2">
                <AnimatePresence initial={false}>
                  {REVIEWERS.flatMap((role) =>
                    (groupedFindings[role] || []).map((f, idx) => (
                      <FindingRow
                        key={`${role}-${idx}-${f.title}`}
                        finding={f}
                      />
                    ))
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number | string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg p-2 text-center border",
        highlight
          ? "bg-primary/15 border-primary/30"
          : "bg-white/[0.03] border-border"
      )}
    >
      <div
        className={cn(
          "text-lg font-bold",
          highlight ? "gradient-text" : "text-white"
        )}
      >
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-muted">{label}</div>
    </div>
  );
}

function FindingRow({ finding }: { finding: Finding }) {
  const agent = AGENTS[finding.agentId];
  const sev = finding.severity;

  const severityConfig: Record<
    Finding["severity"],
    { cls: string; icon: React.ReactNode; label: string }
  > = {
    critical: {
      cls: "bg-rose-500/10 border-rose-500/30 text-rose-200",
      icon: <AlertCircle className="w-4 h-4 text-rose-400" />,
      label: "critical",
    },
    warning: {
      cls: "bg-amber-500/10 border-amber-500/30 text-amber-100",
      icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
      label: "warning",
    },
    info: {
      cls: "bg-cyan-500/10 border-cyan-500/30 text-cyan-100",
      icon: <Info className="w-4 h-4 text-cyan-400" />,
      label: "info",
    },
    success: {
      cls: "bg-emerald-500/10 border-emerald-500/30 text-emerald-100",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      label: "ok",
    },
  };
  const c = severityConfig[sev];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("rounded-xl border p-3", c.cls)}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{c.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold text-white text-sm leading-tight">
              {finding.title}
            </h4>
            <span className="text-[10px] uppercase tracking-wider text-muted whitespace-nowrap">
              {agent.emoji} {agent.name}
            </span>
          </div>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            {finding.description}
          </p>
          {finding.suggestion && (
            <div className="mt-2 text-xs flex items-start gap-1.5">
              <span className="text-primary-400 font-medium shrink-0">
                Suggest:
              </span>
              <span className="text-muted">{finding.suggestion}</span>
            </div>
          )}
          {finding.line && (
            <div className="mt-1 text-[10px] uppercase tracking-wider text-muted">
              line {finding.line}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
