export interface BugChallenge {
  id: string;
  title: string;
  language: string;
  difficulty: "easy" | "medium" | "hard";
  code: string;
  buggyLines: number[];
  bugDescription: string;
  bugType: string;
  hints: string[];
  fixSuggestion: string;
  xp: number;
}

export const BUG_CHALLENGES: BugChallenge[] = [
  {
    id: "off-by-one",
    title: "Sum of 1..N",
    language: "javascript",
    difficulty: "easy",
    code: `function sumToN(n) {
  let total = 0;
  for (let i = 1; i < n; i++) {
    total += i;
  }
  return total;
}`,
    buggyLines: [3],
    bugType: "off-by-one",
    bugDescription:
      "The loop stops at n-1 because it uses < instead of <=, missing the final value.",
    hints: [
      "🤔 Check the loop boundary carefully — does it include n?",
      "👀 Compare i < n vs i <= n. Which one captures all values from 1 to n?",
      "💡 The bug is on line 3: change < to <=.",
    ],
    fixSuggestion: "Change `i < n` to `i <= n`.",
    xp: 100,
  },
  {
    id: "mutate-prop",
    title: "Push to props",
    language: "javascript",
    difficulty: "easy",
    code: `function addItem(list, item) {
  list.push(item);
  return list;
}

const original = [1, 2, 3];
const result = addItem(original, 4);
// 'original' was unintentionally mutated`,
    buggyLines: [2],
    bugType: "side-effect / mutation",
    bugDescription:
      "list.push mutates the caller's array. Pure functions should return a new array.",
    hints: [
      "🤔 What happens to 'original' after addItem runs?",
      "👀 push mutates the array in place — that's the side effect.",
      "💡 Replace push with [...list, item] to return a new array.",
    ],
    fixSuggestion: "Use the spread operator: `return [...list, item];`",
    xp: 120,
  },
  {
    id: "async-loop",
    title: "Sequential fetches",
    language: "javascript",
    difficulty: "medium",
    code: `async function fetchAll(urls) {
  const results = [];
  for (const url of urls) {
    const data = await fetch(url).then(r => r.json());
    results.push(data);
  }
  return results;
}`,
    buggyLines: [4],
    bugType: "performance / parallelization",
    bugDescription:
      "Each fetch waits for the previous one. Independent requests should run in parallel.",
    hints: [
      "🤔 If you have 10 URLs that take 1s each, how long does this take?",
      "👀 The await inside the for loop forces sequential execution.",
      "💡 Use Promise.all + map to run all fetches in parallel.",
    ],
    fixSuggestion:
      "Replace with: `return Promise.all(urls.map(u => fetch(u).then(r => r.json())));`",
    xp: 200,
  },
  {
    id: "stale-closure",
    title: "useState stale value",
    language: "javascript",
    difficulty: "medium",
    code: `function Counter() {
  const [count, setCount] = useState(0);

  function tick() {
    setCount(count + 1);
    setCount(count + 1);
  }

  return <button onClick={tick}>Click</button>;
}`,
    buggyLines: [5, 6],
    bugType: "stale closure / state",
    bugDescription:
      "Both setCount calls read the same captured 'count'. The second call overwrites instead of incrementing twice.",
    hints: [
      "🤔 Click once — does count go up by 1 or 2?",
      "👀 Both lines reference the same captured 'count' variable.",
      "💡 Use the function form: setCount(prev => prev + 1).",
    ],
    fixSuggestion: "Use functional updates: `setCount(prev => prev + 1)`.",
    xp: 220,
  },
  {
    id: "regex-greedy",
    title: "Greedy matcher",
    language: "javascript",
    difficulty: "hard",
    code: `function extractTags(html) {
  const tagRegex = /<(.+)>/;
  const match = html.match(tagRegex);
  return match ? match[1] : null;
}

extractTags("<b>bold</b><i>italic</i>");
// Expected: "b"
// Got: "b>bold</b><i>italic</i" (greedy match consumed too much)`,
    buggyLines: [2],
    bugType: "regex / greedy quantifier",
    bugDescription:
      "The dot-plus quantifier is greedy — it matches as much as possible, including other tags.",
    hints: [
      "🤔 What does .+ match by default?",
      "👀 By default, + is greedy. We need it lazy.",
      "💡 Use the lazy quantifier: .+? instead of .+",
    ],
    fixSuggestion: "Make the quantifier lazy: `/<(.+?)>/`",
    xp: 320,
  },
  {
    id: "race-condition",
    title: "Race condition",
    language: "javascript",
    difficulty: "hard",
    code: `let isProcessing = false;

async function handleClick() {
  if (isProcessing) return;
  isProcessing = true;
  await processData();
  isProcessing = false;
}

button.addEventListener("click", handleClick);
button.addEventListener("click", handleClick);`,
    buggyLines: [4, 5],
    bugType: "race condition",
    bugDescription:
      "Two simultaneous clicks both pass the guard before isProcessing is set to true (TOCTOU).",
    hints: [
      "🤔 Two events fire at the exact same tick — what happens?",
      "👀 The check and the assignment are not atomic.",
      "💡 Use a Promise-based mutex or set the flag synchronously before awaiting.",
    ],
    fixSuggestion:
      "Set flag immediately on first sync line, or wrap with a queue / mutex.",
    xp: 350,
  },
];

export interface GameState {
  challengeIndex: number;
  hintsUsed: number;
  score: number;
  streak: number;
  solved: string[];
  startedAt: number;
}

export function emptyGameState(): GameState {
  return {
    challengeIndex: 0,
    hintsUsed: 0,
    score: 0,
    streak: 0,
    solved: [],
    startedAt: Date.now(),
  };
}

export function calculateXp(challenge: BugChallenge, hintsUsed: number, streak: number): number {
  const base = challenge.xp;
  const hintPenalty = hintsUsed * 25;
  const streakBonus = Math.min(streak * 20, 100);
  return Math.max(20, base - hintPenalty + streakBonus);
}
