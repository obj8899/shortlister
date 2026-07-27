import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface ATSResult {
  score: number;
  feedback: string;
}

export async function analyzeATS(
  skills: string,
  resumeText: string | null,
  targetProfile: string
): Promise<ATSResult> {
  const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

  const prompt = `You are an ATS (Applicant Tracking System) resume analyzer.

Target role profile: ${targetProfile}

Candidate skills: ${skills}
Candidate resume excerpt: ${resumeText ? resumeText.slice(0, 2000) : "No resume text available"}

Score this resume's match to the target role from 0-100, and give 2-3 short, constructive, specific tips to improve it for this role.
Respond ONLY with valid JSON, no markdown fences:
{"score": <number 0-100>, "feedback": "<2-3 short actionable tips, one sentence each>"}`;

  try {
    const result = await model.generateContent(prompt);
    const cleaned = result.response.text().trim().replace(/^```json\s*/, "").replace(/```$/, "").trim();
    const parsed = JSON.parse(cleaned);
    return { score: parsed.score, feedback: parsed.feedback };
  } catch (err) {
    console.error("ATS analysis failed:", err);
    return { score: 0, feedback: "Analysis unavailable right now." };
  }
}