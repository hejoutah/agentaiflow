"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Code2,
  Search,
  Bug,
  Workflow,
  Network,
  Zap,
  Shield,
  Brain,
  CheckCircle2,
} from "lucide-react";

const DEMOS = [
  {
    href: "/code-review",
    title: "Multi-Agent Code Review",
    description:
      "Four specialised agents (Architect, Security, Performance, Style) review code in parallel and produce a unified, prioritised report.",
    icon: Code2,
    gradient: "from-violet-500 via-purple-500 to-indigo-500",
    stats: ["4 agents", "20+ heuristics", "Real-time"],
  },
  {
    href: "/research",
    title: "Research Pipeline",
    description:
      "Watch a 5-stage agentic research workflow: decompose → search → synthesise → fact-check → write. Inspect every intermediate artifact.",
    icon: Search,
    gradient: "from-cyan-500 via-teal-500 to-emerald-500",
    stats: ["5 stages", "3 topics", "Cited"],
  },
  {
    href: "/bug-hunter",
    title: "Bug Hunter Game",
    description:
      "Gamified debugging. Solve 6 progressive bug challenges with progressive AI hints. XP, streaks, and a real grader agent.",
    icon: Bug,
    gradient: "from-amber-500 via-orange-500 to-rose-500",
    stats: ["6 levels", "AI hints", "XP system"],
  },
];

const FEATURES = [
  {
    icon: Workflow,
    title: "Composable agentic patterns",
    body: "Reflection loops, hierarchical orchestration, schema-bound tools, peer voting — every demo is a working example.",
  },
  {
    icon: Network,
    title: "Visualised collaboration",
    body: "Watch agents pass typed artifacts between each other in real time, with status badges and live streams.",
  },
  {
    icon: Zap,
    title: "Zero backend, zero keys",
    body: "Everything runs client-side with deterministic heuristics. Deploy to Vercel in 60 seconds.",
  },
  {
    icon: Brain,
    title: "Real domain logic",
    body: "Code analysis runs 20+ regex-driven detectors. Not a fake demo — the agents actually do work.",
  },
  {
    icon: Shield,
    title: "Open & inspectable",
    body: "All agent definitions, prompts, and outputs live in plain TypeScript files you can read and extend.",
  },
  {
    icon: CheckCircle2,
    title: "Production patterns",
    body: "Same patterns you would ship in production: typed messages, status state machines, retry semantics.",
  },
];

const STATS = [
  { label: "Agent roles", value: "12" },
  { label: "Demos", value: "3" },
  { label: "Heuristic rules", value: "20+" },
  { label: "Avg response", value: "<200ms" },
];

export default function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute top-32 right-10 w-[500px] h-[500px] bg-accent/15 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium tracking-wide"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-muted">v1.0 live</span>
            <span className="text-white">· multi-agent AI workflow platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05]"
          >
            Build <span className="gradient-text">AI agents</span>
            <br />
            that <span className="gradient-text-warm">collaborate.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-muted leading-relaxed"
          >
            AGENTFLOW is an open playground for multi-agent AI workflows. Three live
            demos show how specialised agents review code, conduct research, and hunt
            bugs — all running in your browser with{" "}
            <span className="text-white">no API key</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              href="/code-review"
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-primary/20"
            >
              Launch a demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#demos"
              className="inline-flex items-center gap-2 glass px-6 py-3 rounded-xl font-semibold text-white hover:bg-white/5 transition"
            >
              Explore agents
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {STATS.map((s) => (
              <div
                key={s.label}
                className="glass rounded-xl p-4 text-center"
              >
                <div className="text-2xl md:text-3xl font-bold gradient-text">
                  {s.value}
                </div>
                <div className="text-[11px] uppercase tracking-wider text-muted mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* DEMOS */}
      <section id="demos" className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary-400 mb-3">
            <Sparkles className="w-4 h-4" /> Live demos
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Three workflows. <span className="gradient-text">Twelve agents.</span>
          </h2>
          <p className="text-muted mt-3 max-w-2xl mx-auto">
            Each demo is a self-contained agentic system. Click in, watch the agents
            work, and read their intermediate artifacts.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {DEMOS.map((demo, i) => {
            const Icon = demo.icon;
            return (
              <motion.div
                key={demo.href}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  href={demo.href}
                  className="group block relative h-full rounded-2xl glass p-6 hover:bg-white/[0.04] transition overflow-hidden"
                >
                  <div
                    className={`absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${demo.gradient} pointer-events-none group-hover:opacity-40 transition-opacity`}
                  />
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${demo.gradient} flex items-center justify-center mb-4`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{demo.title}</h3>
                    <p className="text-sm text-muted leading-relaxed mb-4">
                      {demo.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {demo.stats.map((s) => (
                        <span
                          key={s}
                          className="text-[10px] uppercase tracking-wider bg-white/5 border border-border text-muted px-2 py-1 rounded-md"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-400 group-hover:text-white transition">
                      Open demo
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-accent mb-3">
            <Workflow className="w-4 h-4" /> Why AGENTFLOW
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Built for <span className="gradient-text">agentic patterns</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="glass rounded-xl p-5"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-primary-400" />
                </div>
                <h3 className="font-semibold text-white mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{f.body}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="relative rounded-3xl glass-strong p-10 md:p-14 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />
          <div className="relative text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to see agents <span className="gradient-text">collaborate?</span>
            </h2>
            <p className="text-muted max-w-xl mx-auto mb-8">
              Open the Code Review demo and paste a snippet — four agents will get to
              work in parallel and surface a prioritised report in under a second.
            </p>
            <Link
              href="/code-review"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-primary/30"
            >
              Start with Code Review
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
