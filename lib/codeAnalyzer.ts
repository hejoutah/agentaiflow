import type { AgentRole } from "./agents";

export interface Finding {
  agentId: AgentRole;
  severity: "info" | "warning" | "critical" | "success";
  title: string;
  description: string;
  line?: number;
  suggestion?: string;
}

export interface AnalysisResult {
  findings: Finding[];
  metrics: {
    totalLines: number;
    nonEmptyLines: number;
    functions: number;
    classes: number;
    imports: number;
    avgLineLength: number;
    maxNesting: number;
    score: number;
  };
}

const SECURITY_PATTERNS: Array<{
  regex: RegExp;
  title: string;
  description: string;
  severity: Finding["severity"];
  suggestion: string;
}> = [
  {
    regex: /eval\s*\(/g,
    title: "Use of eval()",
    description: "eval() executes arbitrary code and is a major XSS / RCE vector.",
    severity: "critical",
    suggestion: "Replace eval with explicit parsers (JSON.parse, Function constructor with strict input validation).",
  },
  {
    regex: /innerHTML\s*=/g,
    title: "Direct innerHTML assignment",
    description: "Assigning raw strings to innerHTML can introduce XSS if any input is user-controlled.",
    severity: "warning",
    suggestion: "Use textContent for plain text, or sanitize via DOMPurify for HTML.",
  },
  {
    regex: /document\.write\s*\(/g,
    title: "document.write detected",
    description: "document.write is XSS-prone and blocks parsing.",
    severity: "warning",
    suggestion: "Use modern DOM manipulation (createElement / appendChild).",
  },
  {
    regex: /(api[_-]?key|secret|password|token)\s*[:=]\s*["'][^"']{8,}["']/gi,
    title: "Possible hardcoded secret",
    description: "A literal that looks like a credential was detected in source code.",
    severity: "critical",
    suggestion: "Move secrets to environment variables (.env) and never commit them to VCS.",
  },
  {
    regex: /SELECT\s+.*\s+FROM\s+.*\+\s*\w+/gi,
    title: "Possible SQL string concatenation",
    description: "Building SQL via string concatenation may open SQL injection holes.",
    severity: "critical",
    suggestion: "Use parameterized queries / prepared statements.",
  },
  {
    regex: /Math\.random\(\)/g,
    title: "Math.random for security purposes?",
    description: "Math.random is not cryptographically secure.",
    severity: "info",
    suggestion: "If used for tokens / IDs, prefer crypto.getRandomValues / crypto.randomUUID.",
  },
  {
    regex: /http:\/\//g,
    title: "Insecure HTTP URL",
    description: "Plain HTTP traffic is unencrypted and vulnerable to MITM.",
    severity: "warning",
    suggestion: "Switch to HTTPS where possible.",
  },
];

const PERFORMANCE_PATTERNS: Array<{
  regex: RegExp;
  title: string;
  description: string;
  severity: Finding["severity"];
  suggestion: string;
}> = [
  {
    regex: /for\s*\([^)]*\)\s*\{[^}]*for\s*\([^)]*\)/g,
    title: "Nested loop detected",
    description: "Two nested for-loops typically yield O(n^2). Verify the inner loop is necessary.",
    severity: "warning",
    suggestion: "If applicable, use a Map / Set lookup to drop one loop layer.",
  },
  {
    regex: /\.indexOf\([^)]+\)\s*[!=]==?\s*-1/g,
    title: "indexOf used as a contains-check",
    description: ".indexOf(...) !== -1 is harder to read.",
    severity: "info",
    suggestion: "Use Array.prototype.includes() or Set.has() for clarity and speed on large arrays.",
  },
  {
    regex: /JSON\.parse\(JSON\.stringify\(/g,
    title: "JSON deep-clone detected",
    description: "JSON deep-clone is slow and loses non-JSON values (Date, undefined, functions).",
    severity: "warning",
    suggestion: "Use structuredClone(...) (Node 17+, modern browsers).",
  },
  {
    regex: /document\.querySelectorAll\([^)]+\)/g,
    title: "DOM query in code",
    description: "querySelectorAll is fine but repeated calls inside loops are wasteful.",
    severity: "info",
    suggestion: "Cache the NodeList outside the loop if it does not change.",
  },
  {
    regex: /\bawait\s+\w+\s*\([^)]*\)\s*;[\s\n]*await/g,
    title: "Sequential awaits",
    description: "Two independent awaits run sequentially; if independent they could be parallelized.",
    severity: "info",
    suggestion: "Wrap with Promise.all([...]) when calls do not depend on each other.",
  },
  {
    regex: /setTimeout\s*\(\s*[^,]+,\s*0\s*\)/g,
    title: "setTimeout with 0ms",
    description: "Used as a microtask hack; queueMicrotask is clearer.",
    severity: "info",
    suggestion: "Use queueMicrotask() or Promise.resolve().then(...).",
  },
];

const STYLE_PATTERNS: Array<{
  regex: RegExp;
  title: string;
  description: string;
  severity: Finding["severity"];
  suggestion: string;
}> = [
  {
    regex: /\bvar\s+\w+/g,
    title: "var keyword used",
    description: "var has function scope and hoisting quirks.",
    severity: "info",
    suggestion: "Use const by default, let when reassignment is required.",
  },
  {
    regex: /==[^=]/g,
    title: "Loose equality (==)",
    description: "== performs type coercion, often the source of subtle bugs.",
    severity: "warning",
    suggestion: "Use === / !== for strict comparison.",
  },
  {
    regex: /console\.log\(/g,
    title: "console.log left in code",
    description: "Debug statements should not ship to production.",
    severity: "info",
    suggestion: "Remove or replace with a logger that respects log levels.",
  },
  {
    regex: /TODO|FIXME|HACK|XXX/g,
    title: "TODO / FIXME marker",
    description: "Unfinished work marker found in source.",
    severity: "info",
    suggestion: "Convert into a tracked issue with a link.",
  },
  {
    regex: /function\s+[a-z][a-zA-Z]*\s*\(/g,
    title: "Function naming",
    description: "Function naming follows camelCase — good.",
    severity: "success",
    suggestion: "Keep this style consistent across modules.",
  },
];

function countMatches(text: string, regex: RegExp): number {
  const m = text.match(regex);
  return m ? m.length : 0;
}

function findLine(text: string, match: string): number | undefined {
  const idx = text.indexOf(match);
  if (idx === -1) return undefined;
  return text.slice(0, idx).split("\n").length;
}

function maxNestingLevel(text: string): number {
  let depth = 0;
  let max = 0;
  for (const ch of text) {
    if (ch === "{") {
      depth += 1;
      if (depth > max) max = depth;
    } else if (ch === "}") {
      depth = Math.max(0, depth - 1);
    }
  }
  return max;
}

export function analyzeCode(code: string): AnalysisResult {
  const findings: Finding[] = [];
  const lines = code.split("\n");
  const nonEmpty = lines.filter((l) => l.trim().length > 0);

  // Architect findings
  const functionCount =
    countMatches(code, /function\s+\w+/g) +
    countMatches(code, /=>\s*\{/g) +
    countMatches(code, /\b(async\s+)?\w+\s*\([^)]*\)\s*\{/g);
  const classCount = countMatches(code, /\bclass\s+\w+/g);
  const importCount = countMatches(code, /^\s*(import|require\()/gm);
  const nesting = maxNestingLevel(code);
  const avgLineLen =
    nonEmpty.reduce((s, l) => s + l.length, 0) / Math.max(1, nonEmpty.length);

  if (nesting >= 5) {
    findings.push({
      agentId: "architect",
      severity: "warning",
      title: `Deep nesting detected (depth ${nesting})`,
      description:
        "Code is nested more than 4 levels deep, hurting readability and testability.",
      suggestion:
        "Extract inner blocks into helper functions or use early returns / guard clauses.",
    });
  } else if (nesting > 0) {
    findings.push({
      agentId: "architect",
      severity: "success",
      title: `Healthy nesting depth (${nesting})`,
      description: "Control flow is reasonably flat.",
    });
  }

  if (functionCount === 0 && nonEmpty.length > 8) {
    findings.push({
      agentId: "architect",
      severity: "info",
      title: "Procedural style",
      description: "No functions detected — long script in global scope.",
      suggestion: "Group related logic into named functions / a small class.",
    });
  } else if (functionCount > 0) {
    findings.push({
      agentId: "architect",
      severity: "success",
      title: `${functionCount} function(s) detected`,
      description: "Code is decomposed into reusable units.",
    });
  }

  if (classCount > 0) {
    findings.push({
      agentId: "architect",
      severity: "info",
      title: `${classCount} class definition(s)`,
      description: "Object-oriented decomposition detected.",
    });
  }

  // Security findings
  for (const pattern of SECURITY_PATTERNS) {
    const matches = code.match(pattern.regex);
    if (matches && matches.length > 0) {
      findings.push({
        agentId: "security",
        severity: pattern.severity,
        title: pattern.title,
        description: `${pattern.description} (${matches.length} occurrence${
          matches.length === 1 ? "" : "s"
        })`,
        line: findLine(code, matches[0]),
        suggestion: pattern.suggestion,
      });
    }
  }
  if (
    findings.filter((f) => f.agentId === "security").length === 0
  ) {
    findings.push({
      agentId: "security",
      severity: "success",
      title: "No obvious vulnerabilities",
      description: "Static patterns for XSS, secrets, and SQLi were not detected.",
    });
  }

  // Performance findings
  for (const pattern of PERFORMANCE_PATTERNS) {
    const matches = code.match(pattern.regex);
    if (matches && matches.length > 0) {
      findings.push({
        agentId: "performance",
        severity: pattern.severity,
        title: pattern.title,
        description: `${pattern.description} (${matches.length} hit${
          matches.length === 1 ? "" : "s"
        })`,
        line: findLine(code, matches[0]),
        suggestion: pattern.suggestion,
      });
    }
  }
  if (
    findings.filter((f) => f.agentId === "performance").length === 0
  ) {
    findings.push({
      agentId: "performance",
      severity: "success",
      title: "No obvious performance smells",
      description: "Loops, async calls and DOM access patterns look healthy.",
    });
  }

  // Style findings (cap at 4)
  let styleCount = 0;
  for (const pattern of STYLE_PATTERNS) {
    if (styleCount >= 4) break;
    const matches = code.match(pattern.regex);
    if (matches && matches.length > 0) {
      findings.push({
        agentId: "style",
        severity: pattern.severity,
        title: pattern.title,
        description: `${pattern.description} (${matches.length})`,
        suggestion: pattern.suggestion,
      });
      styleCount += 1;
    }
  }

  if (avgLineLen > 100) {
    findings.push({
      agentId: "style",
      severity: "warning",
      title: `Long average line length (${avgLineLen.toFixed(0)} chars)`,
      description: "Long lines hurt readability.",
      suggestion: "Wrap at ~100 chars; configure Prettier / ESLint.",
    });
  }

  // Final score (0-100)
  const critical = findings.filter((f) => f.severity === "critical").length;
  const warnings = findings.filter((f) => f.severity === "warning").length;
  const score = Math.max(
    0,
    Math.min(100, 100 - critical * 18 - warnings * 6)
  );

  return {
    findings,
    metrics: {
      totalLines: lines.length,
      nonEmptyLines: nonEmpty.length,
      functions: functionCount,
      classes: classCount,
      imports: importCount,
      avgLineLength: avgLineLen,
      maxNesting: nesting,
      score,
    },
  };
}

export const SAMPLE_CODE_SNIPPETS: Array<{
  name: string;
  language: string;
  code: string;
  description: string;
}> = [
  {
    name: "Vulnerable login",
    language: "javascript",
    description: "Demo: hardcoded secret + SQL concat + eval. Should trigger 3 critical alerts.",
    code: `const API_KEY = "sk_live_3f9a8b7c6d5e4f3a2b1c0d9e8f7a";

function login(username, password) {
  // TODO: switch to bcrypt
  var hash = md5(password);
  var query = "SELECT * FROM users WHERE name='" + username + "' AND pwd='" + hash + "'";
  db.exec(query);
  if (rememberMe) {
    document.cookie = "session=" + username;
  }
  // dangerous: dynamic require
  eval(userInput);
}

function render(html) {
  document.getElementById("root").innerHTML = html;
}`,
  },
  {
    name: "Slow data pipeline",
    language: "javascript",
    description: "Demo: nested loops, JSON deep-clone, sequential awaits.",
    code: `async function buildReport(users, orders) {
  var report = [];
  for (var i = 0; i < users.length; i++) {
    for (var j = 0; j < orders.length; j++) {
      if (orders[j].userId == users[i].id) {
        var copy = JSON.parse(JSON.stringify(orders[j]));
        report.push(copy);
      }
    }
  }
  await fetchMeta();
  await fetchTags();
  await fetchOwner();
  return report;
}`,
  },
  {
    name: "Clean React component",
    language: "tsx",
    description: "Demo: well-structured code. Most agents return success.",
    code: `import { useState } from "react";

interface Props {
  initial: number;
}

export function Counter({ initial }: Props) {
  const [count, setCount] = useState(initial);
  const increment = () => setCount((prev) => prev + 1);

  return (
    <button onClick={increment} className="px-4 py-2 rounded bg-violet-500">
      Count: {count}
    </button>
  );
}`,
  },
];
