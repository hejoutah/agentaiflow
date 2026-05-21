"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Github } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/code-review", label: "Code Review" },
  { href: "/research", label: "Research" },
  { href: "/bug-hunter", label: "Bug Hunter" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="absolute inset-0 glass-strong border-b border-border" />
      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary blur-xl opacity-50 group-hover:opacity-80 transition" />
            <div className="relative bg-gradient-to-br from-primary to-accent w-9 h-9 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="font-bold text-lg tracking-tight">
            AGENT<span className="gradient-text">FLOW</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm transition-colors",
                  active
                    ? "text-white bg-white/5"
                    : "text-muted hover:text-white hover:bg-white/5"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-muted hover:text-white hover:bg-white/5 transition-colors"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          <Link
            href="/code-review"
            className="hidden sm:inline-flex bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            Try Demo
          </Link>
        </div>
      </nav>
    </header>
  );
}
