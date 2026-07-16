import { STAGE1_CRITERIA } from "@/lib/filterCriteria";

export function runHardFilter(skills: string[]): { passed: boolean; reason?: string } {
  if (skills.length < STAGE1_CRITERIA.minSkillCount) {
    return { passed: false, reason: `Fewer than ${STAGE1_CRITERIA.minSkillCount} skills listed` };
  }

  const hasRequiredSkill = skills.some((s) => STAGE1_CRITERIA.requiredSkills.includes(s));
  if (!hasRequiredSkill) {
    return {
      passed: false,
      reason: `Missing all required skills: ${STAGE1_CRITERIA.requiredSkills.join(", ")}`,
    };
  }

  return { passed: true };
}