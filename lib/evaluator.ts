import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface EvaluationResult {
  score: number;
  reasoning: string;
}

export async function evaluateCandidate(skills: string): Promise<EvaluationResult> {
  const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

  const prompt = `You are evaluating a candidate for a technical role based on their listed skills.

Candidate skills: ${skills}

Rate this candidate from 0 to 100 based on technical depth and relevance to a software/data role.
Respond ONLY with valid JSON in this exact format, no other text, no markdown code fences:
{"score": <number 0-100>, "reasoning": "<one sentence explanation>"}`;

  const result = await model.generateContent(prompt);
  const rawText = result.response.text().trim();

  // Strip markdown code fences if the model adds them despite instructions
  const cleaned = rawText.replace(/^```json\s*/, "").replace(/```$/, "").trim();

  const parsed = JSON.parse(cleaned);
  return { score: parsed.score, reasoning: parsed.reasoning };
}