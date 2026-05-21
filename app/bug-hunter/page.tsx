"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Lightbulb,
  Trophy,
  Flame,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import {
  BUG_CHALLENGES,
  emptyGameState,
  calculateXp,
  type BugChallenge,
  type GameState,
} from "@/lib/bugChallenges";
import { AGENTS } from "@/lib/agents";
import { cn } from "@/lib/utils";

export default function BugHunterPage() {
  const [game, setGame] = useState<GameState>(emptyGameState());
  const [picked, setPicked] = useState<number | null>(null);
  const [verdict, setVerdict] = useState<"correct" | "wrong" | null>(null);
  const [agentMessage, setAgentMessage] = useState<string>("");
  const [revealHints, setRevealHints] = useState(0);

  const challenge: BugChallenge | undefined = BUG_CHALLENGES[game.challengeIndex];
  const codeLines = useMemo(
    () => (challenge ? challenge.code.split("\n") : []),
    [challenge]
  );

  if (!challenge) {
    return <GameComplete game={game} onReset={() => setGame(emptyGameState())} />;
  }

  const useHint = () => {
    if (revealHints >= challenge.hints.length || verdict === "correct") return;
    setRevealHints((n) => n + 1);
    setGame((g) => ({ ...g, hintsUsed: g.hintsUsed + 1 }));
    setAgentMessage(challenge.hints[revealHints]);
  };

  const submitGuess = () => {
    if (picked == null) return;
    if (challenge.buggyLines.includes(picked)) {
      const xp = calculateXp(challenge, revealHints, game.streak);
      setVerdict("correct");
      setAgentMessage(
        `${AGENTS.validator.emoji} Correct! Found the bug on line ${picked}. +${xp} XP. ${challenge.fixSuggestion}`
      );
      setGame((g) => ({
        ...g,
        score: g.score + xp,
        streak: g.streak + 1,
        solved: [...g.solved, challenge.id],
      }));
    } else {
      setVerdict("wrong");
      setAgentMessage(
        `${AGENTS.validator.emoji} That line is fine. Bug type: ${challenge.bugType}. Try again or use a hint.`
      );
      setGame((g) => ({ ...g, streak: 0 }));
    }
  };

  const next = () => {
    setPicked(null);
    setVerdict(null);
    setAgentMessage("");
    setRevealHints(0);
    setGame((g) => ({ ...g, challengeIndex: g.challengeIndex + 1, hintsUsed: 0 }));
  };

  const skip = () => {
    setPicked(null);
    setVerdict(null);
    setAgentMessage("");
    setRevealHints(0);
    setGame((g) => ({
      ...g,
      challengeIndex: g.challengeIndex + 1,
      streak: 0,
      hintsUsed: 0,
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 mb-3">
          <Sparkles className="w-4 h-4" /> Demo 3 · gamified
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          <span className="gradient-text-warm">Bug</span> Hunter
        </h1>
        <p className="text-muted max-w-2xl mx-auto">
          Spot the buggy line. Three AI agents assist you: a{" "}
          <strong>Mentor</strong> drops progressive hints, a <strong>Judge</strong>{" "}
          validates your guess, and a <strong>Scorekeeper</strong> tracks XP &
          streaks.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatTile icon={Trophy} label="XP" value={game.score} accent="from-amber-500 to-orange-500" />
        <StatTile icon={Flame} label="Streak" value={game.streak} accent="from-rose-500 to-red-500" />
        <StatTile
          icon={CheckCircle2}
          label="Solved"
          value={`${game.solved.length} / ${BUG_CHALLENGES.length}`}
          accent="from-emerald-500 to-teal-500"
        />
        <StatTile
          icon={Target}
          label="Level"
          value={game.challengeIndex + 1}
          accent="from-violet-500 to-indigo-500"
        />
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* CODE */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-widest text-muted">
                    Level {game.challengeIndex + 1}
                  </span>
                  <DifficultyPill difficulty={challenge.difficulty} />
                </div>
                <h3 className="font-semibold text-lg mt-1">{challenge.title}</h3>
                <p className="text-xs text-muted mt-1">
                  Bug type: <span className="text-white">{challenge.bugType}</span>{" "}
                  · Worth <span className="text-amber-300">{challenge.xp} XP</span>
                </p>
              </div>
              <div className="text-xs text-muted text-right">
                Click the buggy line ↓
              </div>
            </div>
            <div className="code-block !p-0">
              {codeLines.map((line, i) => {
                const lineNum = i + 1;
                const selected = picked === lineNum;
                const isBuggyRevealed =
                  verdict === "correct" && challenge.buggyLines.includes(lineNum);
                const wrongPick =
                  verdict === "wrong" && selected;

                return (
                  <button
                    key={lineNum}
                    onClick={() => {
                      if (verdict === "correct") return;
                      setPicked(lineNum);
                      setVerdict(null);
                    }}
                    disabled={verdict === "correct"}
                    className={cn(
                      "w-full flex items-start gap-3 px-4 py-1 text-left text-[13px] font-mono transition border-l-2",
                      "hover:bg-white/5",
                      selected
                        ? "bg-primary/15 border-primary"
                        : "border-transparent",
                      isBuggyRevealed && "bg-emerald-500/15 border-emerald-400",
                      wrongPick && "bg-rose-500/15 border-rose-400"
                    )}
                  >
                    <span className="text-muted/60 select-none w-7 text-right shrink-0">
                      {lineNum}
                    </span>
                    <span className="flex-1 whitespace-pre">{line || " "}</span>
                    {isBuggyRevealed && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {wrongPick && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                onClick={submitGuess}
                disabled={picked == null || verdict === "correct"}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                <Target className="w-4 h-4" />
                Submit guess {picked != null && `(line ${picked})`}
              </button>
              <button
                onClick={useHint}
                disabled={
                  revealHints >= challenge.hints.length ||
                  verdict === "correct"
                }
                className="inline-flex items-center gap-2 bg-amber-500/15 text-amber-300 border border-amber-500/30 px-4 py-2 rounded-xl font-semibold hover:bg-amber-500/25 transition disabled:opacity-50"
              >
                <Lightbulb className="w-4 h-4" />
                Hint ({revealHints}/{challenge.hints.length})
              </button>
              {verdict === "correct" ? (
                <button
                  onClick={next}
                  className="inline-flex items-center gap-2 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-4 py-2 rounded-xl font-semibold hover:bg-emerald-500/25 transition ml-auto"
                >
                  Next level
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={skip}
                  className="inline-flex items-center gap-2 text-muted hover:text-white px-3 py-2 transition ml-auto text-sm"
                >
                  Skip
                </button>
              )}
            </div>
          </div>

          {/* Reveal solution panel after correct */}
          {verdict === "correct" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-5 border border-emerald-500/30"
            >
              <div className="flex items-center gap-2 text-emerald-300 mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-semibold text-sm uppercase tracking-widest">
                  Bug explained
                </span>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                {challenge.bugDescription}
              </p>
              <div className="mt-3 text-sm">
                <span className="text-primary-400 font-medium">Fix:</span>{" "}
                <span className="text-white">{challenge.fixSuggestion}</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* AGENT SIDEBAR */}
        <div className="lg:col-span-2 space-y-4">
          <SidebarAgent
            agent={AGENTS.hint}
            title="Mentor"
            statusLabel={
              revealHints === 0
                ? "Awaiting request"
                : `${revealHints} hint(s) given`
            }
            tone={revealHints > 0 ? "active" : "idle"}
          >
            {revealHints === 0 ? (
              <p className="text-sm text-muted">
                I deliver progressive hints. The earlier you stop, the more XP
                you keep.
              </p>
            ) : (
              <ul className="text-sm space-y-2">
                {challenge.hints.slice(0, revealHints).map((h, i) => (
                  <li key={i} className="text-muted leading-relaxed">
                    <span className="text-amber-300 font-medium">
                      Hint #{i + 1}:
                    </span>{" "}
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </SidebarAgent>

          <SidebarAgent
            agent={AGENTS.validator}
            title="Judge"
            statusLabel={
              verdict === "correct"
                ? "Confirmed correct"
                : verdict === "wrong"
                ? "Rejected"
                : "Awaiting submission"
            }
            tone={
              verdict === "correct"
                ? "success"
                : verdict === "wrong"
                ? "error"
                : "idle"
            }
          >
            <p className="text-sm text-muted leading-relaxed">
              {agentMessage ||
                "Submit a guess and I'll validate it against the bug pattern."}
            </p>
          </SidebarAgent>

          <SidebarAgent
            agent={AGENTS.scorer}
            title="Scorekeeper"
            statusLabel="Tracking XP, streak, level"
            tone="active"
          >
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <Cell label="XP" value={game.score} />
              <Cell label="Streak" value={game.streak} />
              <Cell label="Solved" value={game.solved.length} />
            </div>
            <p className="text-xs text-muted mt-3 leading-relaxed">
              Streak bonus: <span className="text-white">+{game.streak * 20}</span>{" "}
              XP per future correct guess.
              {revealHints > 0 && (
                <>
                  {" "}
                  Hint penalty:{" "}
                  <span className="text-rose-300">-{revealHints * 25}</span> XP.
                </>
              )}
            </p>
          </SidebarAgent>

          <button
            onClick={() => {
              setPicked(null);
              setVerdict(null);
              setAgentMessage("");
              setRevealHints(0);
              setGame(emptyGameState());
            }}
            className="w-full inline-flex items-center justify-center gap-2 glass px-4 py-2 rounded-xl text-muted hover:text-white transition"
          >
            <RotateCcw className="w-4 h-4" />
            Reset game
          </button>
        </div>
      </div>
    </div>
  );
}

function GameComplete({
  game,
  onReset,
}: {
  game: GameState;
  onReset: () => void;
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 to-rose-500 mb-6 text-4xl"
      >
        🏆
      </motion.div>
      <h1 className="text-5xl font-bold mb-3">
        All <span className="gradient-text-warm">bugs hunted</span>
      </h1>
      <p className="text-muted mb-8 max-w-xl mx-auto">
        You completed every challenge. The Scorekeeper agent has logged your final
        run.
      </p>
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
        <Cell label="Total XP" value={game.score} />
        <Cell label="Best streak" value={game.streak} />
        <Cell label="Solved" value={game.solved.length} />
      </div>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
      >
        <RotateCcw className="w-4 h-4" />
        Play again
      </button>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Target;
  label: string;
  value: number | string;
  accent: string;
}) {
  return (
    <div className="glass rounded-xl p-4 flex items-center gap-3">
      <div
        className={cn(
          "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center",
          accent
        )}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <div className="text-xl font-bold">{value}</div>
        <div className="text-[10px] uppercase tracking-wider text-muted">
          {label}
        </div>
      </div>
    </div>
  );
}

function DifficultyPill({
  difficulty,
}: {
  difficulty: "easy" | "medium" | "hard";
}) {
  const cls =
    difficulty === "easy"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
      : difficulty === "medium"
      ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
      : "bg-rose-500/15 text-rose-300 border-rose-500/30";
  return (
    <span
      className={cn(
        "text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md border font-semibold",
        cls
      )}
    >
      {difficulty}
    </span>
  );
}

function SidebarAgent({
  agent,
  title,
  statusLabel,
  tone,
  children,
}: {
  agent: (typeof AGENTS)[keyof typeof AGENTS];
  title: string;
  statusLabel: string;
  tone: "idle" | "active" | "success" | "error";
  children: React.ReactNode;
}) {
  const toneCls = {
    idle: "border-white/10",
    active: "border-primary/30",
    success: "border-emerald-500/30",
    error: "border-rose-500/30",
  }[tone];
  return (
    <div className={cn("glass rounded-2xl p-5 border", toneCls)}>
      <div className="flex items-center gap-3 mb-3">
        <div
          className={cn(
            "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl shrink-0",
            agent.color
          )}
        >
          {agent.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold">{title}</h4>
            <span className="text-[10px] uppercase tracking-wider text-muted">
              {statusLabel}
            </span>
          </div>
          <p className="text-[10px] text-muted">{agent.role}</p>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={statusLabel + tone}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg bg-white/[0.03] border border-border p-2">
      <div className="text-lg font-bold">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted">{label}</div>
    </div>
  );
}
