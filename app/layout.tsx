import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AGENTFLOW — Multi-Agent AI Workflow Platform",
  description:
    "Build, visualize and run multi-agent AI workflows. Showcase agentic collaboration patterns: code review, research pipelines, and gamified bug hunting.",
  keywords: [
    "AI agents",
    "multi-agent",
    "agentic workflow",
    "code review",
    "agent collaboration",
    "AI orchestration",
    "Xiaomi MiMo",
  ],
  authors: [{ name: "AGENTFLOW" }],
  openGraph: {
    title: "AGENTFLOW — Multi-Agent AI Workflow Platform",
    description:
      "Visualize and run multi-agent AI workflows with real-time collaboration patterns.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <div className="fixed inset-0 -z-10 grid-bg opacity-40" />
        <div className="fixed inset-0 -z-10 bg-hero-glow" />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
