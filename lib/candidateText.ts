export function buildCandidateText(skills: string, resumeText: string | null): string {
  if (resumeText && resumeText.trim().length > 0) {
    return `Skills: ${skills}\n\nResume excerpt: ${resumeText.slice(0, 2000)}`;
  }
  return skills;
}