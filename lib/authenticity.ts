export function specificityScore(skills: string[]): number {
  // Very generic/filler skills that add no real signal
  const genericTerms = ["hardworking", "team player", "fast learner", "passionate", "motivated"];

  const genericCount = skills.filter((s) =>
    genericTerms.some((term) => s.includes(term))
  ).length;

  const genericRatio = skills.length > 0 ? genericCount / skills.length : 0;

  // Higher genericRatio = more suspicious/low-effort submission
  return 1 - genericRatio; // returns a score 0-1, 1 = fully specific, 0 = fully generic
}

export function flagForReview(skills: string[]): { flagged: boolean; reason?: string } {
  const score = specificityScore(skills);

  if (skills.length === 0) {
    return { flagged: true, reason: "No skills provided" };
  }

  if (score < 0.5) {
    return { flagged: true, reason: "Skills list contains mostly generic/non-technical terms" };
  }

  return { flagged: false };
}