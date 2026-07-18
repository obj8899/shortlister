export function runHardFilter(
  skills: string[],
  criteria: { requiredSkills: string[]; minSkillCount: number }
): { passed: boolean; reason?: string } {
  if (skills.length < criteria.minSkillCount) {
    return { passed: false, reason: `Fewer than ${criteria.minSkillCount} skills listed` };
  }
  const hasRequiredSkill = skills.some((s) => criteria.requiredSkills.includes(s));
  if (!hasRequiredSkill) {
    return {
      passed: false,
      reason: `Missing all required skills: ${criteria.requiredSkills.join(", ")}`,
    };
  }
  return { passed: true };
}