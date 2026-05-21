"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Loader2, AlertCircle, Circle } from "lucide-react";
import type { AgentDefinition, AgentStatus } from "@/lib/agents";
import { cn } from "@/lib/utils";

interface AgentCardProps {
  agent: AgentDefinition;
  status: AgentStatus;
  message?: string;
  highlight?: boolean;
}

export default function AgentCard({
  agent,
  status,
  message,
  highlight = false,
}: AgentCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "relative rounded-2xl p-5 glass overflow-hidden transition-all",
        highlight && "ring-2 ring-primary/40",
        status === "running" && "ring-pulse"
      )}
      style={{
        boxShadow:
          status === "running"
            ? `0 0 40px -10px ${agent.glowColor}`
            : undefined,
      }}
    >
      <div
        className={cn(
          "absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-40 bg-gradient-to-br pointer-events-none",
          agent.color
        )}
      />

      <div className="relative flex items-start gap-3">
        <div
          className={cn(
            "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl shrink-0",
            agent.color
          )}
        >
          {agent.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-white">{agent.name}</h3>
            <StatusBadge status={status} />
          </div>
          <p className="text-xs text-muted mt-0.5">{agent.role}</p>
        </div>
      </div>

      <p className="relative text-sm text-muted/90 mt-3 leading-relaxed">
        {message || agent.description}
      </p>

      {status === "thinking" && (
        <div className="relative mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
        </div>
      )}

      <div className="relative flex flex-wrap gap-1.5 mt-3">
        {agent.expertise.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[10px] uppercase tracking-wider text-muted bg-white/5 px-2 py-1 rounded-md border border-border"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: AgentStatus }) {
  const configs: Record<AgentStatus, { icon: React.ReactNode; text: string; cls: string }> = {
    idle: {
      icon: <Circle className="w-3 h-3" />,
      text: "idle",
      cls: "bg-white/5 text-muted border-white/10",
    },
    thinking: {
      icon: <Loader2 className="w-3 h-3 animate-spin" />,
      text: "thinking",
      cls: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    },
    running: {
      icon: <Loader2 className="w-3 h-3 animate-spin" />,
      text: "running",
      cls: "bg-primary/15 text-primary-400 border-primary/30",
    },
    done: {
      icon: <CheckCircle2 className="w-3 h-3" />,
      text: "done",
      cls: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    },
    error: {
      icon: <AlertCircle className="w-3 h-3" />,
      text: "error",
      cls: "bg-rose-500/10 text-rose-300 border-rose-500/30",
    },
  };
  const c = configs[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-md border uppercase tracking-wider font-medium",
        c.cls
      )}
    >
      {c.icon}
      {c.text}
    </span>
  );
}
