const SKILL_ALIASES: Record<string, string> = {
  "reactjs": "react",
  "react.js": "react",
  "nodejs": "node",
  "node.js": "node",
  "js": "javascript",
  "ts": "typescript",
  "py": "python",
  "nextjs": "next.js",
};

export function normalizeSkills(rawSkills: string): string[] {
  return rawSkills
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 0)
    .map((s) => SKILL_ALIASES[s] || s);
}