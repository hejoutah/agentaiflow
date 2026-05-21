import Link from "next/link";
import { Sparkles, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-primary to-accent w-9 h-9 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">
                AGENT<span className="gradient-text">FLOW</span>
              </span>
            </div>
            <p className="text-muted text-sm mt-3 max-w-md">
              An open-source playground for visualising multi-agent AI workflows.
              Showcase real agentic patterns: code review, research pipelines, and
              gamified bug hunting.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://github.com"
                aria-label="GitHub"
                className="text-muted hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                aria-label="Twitter"
                className="text-muted hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                aria-label="LinkedIn"
                className="text-muted hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white mb-3">
              Demos
            </h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link href="/code-review" className="hover:text-white transition-colors">
                  Code Review Agents
                </Link>
              </li>
              <li>
                <Link href="/research" className="hover:text-white transition-colors">
                  Research Pipeline
                </Link>
              </li>
              <li>
                <Link href="/bug-hunter" className="hover:text-white transition-colors">
                  Bug Hunter Game
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white mb-3">
              Built With
            </h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>Next.js 14 · App Router</li>
              <li>TypeScript</li>
              <li>Tailwind CSS · Framer Motion</li>
              <li>Lucide Icons</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
          <p>© {new Date().getFullYear()} AGENTFLOW. Open source · MIT License.</p>
          <p>
            Built to showcase agentic AI workflows ·{" "}
            <span className="text-primary-400">no API key required</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
