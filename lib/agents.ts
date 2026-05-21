export type AgentRole =
  | "architect"
  | "security"
  | "performance"
  | "style"
  | "decomposer"
  | "researcher"
  | "synthesizer"
  | "fact_checker"
  | "writer"
  | "hint"
  | "validator"
  | "scorer";

export interface AgentDefinition {
  id: AgentRole;
  name: string;
  emoji: string;
  role: string;
  description: string;
  color: string;
  glowColor: string;
  expertise: string[];
}

export const AGENTS: Record<AgentRole, AgentDefinition> = {
  architect: {
    id: "architect",
    name: "Architect",
    emoji: "🏛️",
    role: "Structural Analysis",
    description: "Maps code structure, identifies design patterns, and evaluates architectural quality.",
    color: "from-purple-500 to-indigo-500",
    glowColor: "rgba(139, 92, 246, 0.5)",
    expertise: ["Design Patterns", "SOLID Principles", "Module Structure", "Coupling"],
  },
  security: {
    id: "security",
    name: "Security",
    emoji: "🛡️",
    role: "Vulnerability Scanner",
    description: "Hunts for security vulnerabilities, secret leaks, and unsafe patterns.",
    color: "from-rose-500 to-red-500",
    glowColor: "rgba(244, 63, 94, 0.5)",
    expertise: ["XSS", "SQL Injection", "Secret Detection", "Auth Flow"],
  },
  performance: {
    id: "performance",
    name: "Performance",
    emoji: "⚡",
    role: "Optimization Expert",
    description: "Detects bottlenecks, inefficient loops, and memory issues.",
    color: "from-amber-500 to-orange-500",
    glowColor: "rgba(245, 158, 11, 0.5)",
    expertise: ["Algorithmic Complexity", "Memory Leaks", "I/O Patterns", "Caching"],
  },
  style: {
    id: "style",
    name: "Style",
    emoji: "✨",
    role: "Code Quality",
    description: "Reviews naming conventions, formatting, and readability.",
    color: "from-cyan-500 to-teal-500",
    glowColor: "rgba(6, 182, 212, 0.5)",
    expertise: ["Naming", "Formatting", "Comments", "Consistency"],
  },
  decomposer: {
    id: "decomposer",
    name: "Decomposer",
    emoji: "🧩",
    role: "Question Splitter",
    description: "Breaks complex queries into focused sub-questions.",
    color: "from-violet-500 to-purple-500",
    glowColor: "rgba(139, 92, 246, 0.5)",
    expertise: ["Query Analysis", "Sub-task Planning", "Scope Definition"],
  },
  researcher: {
    id: "researcher",
    name: "Researcher",
    emoji: "🔍",
    role: "Information Gatherer",
    description: "Searches knowledge bases and gathers relevant facts.",
    color: "from-blue-500 to-cyan-500",
    glowColor: "rgba(59, 130, 246, 0.5)",
    expertise: ["Web Search", "Knowledge Retrieval", "Source Ranking"],
  },
  synthesizer: {
    id: "synthesizer",
    name: "Synthesizer",
    emoji: "🧠",
    role: "Insight Combiner",
    description: "Merges findings into coherent insights.",
    color: "from-emerald-500 to-green-500",
    glowColor: "rgba(16, 185, 129, 0.5)",
    expertise: ["Pattern Recognition", "Cross-referencing", "Summarization"],
  },
  fact_checker: {
    id: "fact_checker",
    name: "Fact Checker",
    emoji: "✅",
    role: "Truth Validator",
    description: "Verifies claims against multiple sources.",
    color: "from-pink-500 to-rose-500",
    glowColor: "rgba(236, 72, 153, 0.5)",
    expertise: ["Source Verification", "Cross-validation", "Confidence Scoring"],
  },
  writer: {
    id: "writer",
    name: "Writer",
    emoji: "✍️",
    role: "Final Composer",
    description: "Crafts the final polished response.",
    color: "from-fuchsia-500 to-pink-500",
    glowColor: "rgba(217, 70, 239, 0.5)",
    expertise: ["Clarity", "Tone", "Structure", "Citations"],
  },
  hint: {
    id: "hint",
    name: "Mentor",
    emoji: "💡",
    role: "Hint Generator",
    description: "Crafts progressive hints to guide bug discovery.",
    color: "from-yellow-500 to-amber-500",
    glowColor: "rgba(234, 179, 8, 0.5)",
    expertise: ["Pattern Hints", "Progressive Disclosure", "Encouragement"],
  },
  validator: {
    id: "validator",
    name: "Judge",
    emoji: "⚖️",
    role: "Bug Validator",
    description: "Validates whether the user found the actual bug.",
    color: "from-indigo-500 to-blue-500",
    glowColor: "rgba(99, 102, 241, 0.5)",
    expertise: ["Pattern Matching", "Severity Scoring", "Feedback"],
  },
  scorer: {
    id: "scorer",
    name: "Scorekeeper",
    emoji: "🎯",
    role: "Performance Tracker",
    description: "Tracks streaks, accuracy, and progression.",
    color: "from-orange-500 to-red-500",
    glowColor: "rgba(249, 115, 22, 0.5)",
    expertise: ["Streaks", "XP", "Achievements", "Stats"],
  },
};

export type AgentStatus = "idle" | "thinking" | "running" | "done" | "error";

export interface AgentMessage {
  id: string;
  agentId: AgentRole;
  status: AgentStatus;
  content: string;
  timestamp: string;
  details?: string[];
  severity?: "info" | "warning" | "critical" | "success";
}
