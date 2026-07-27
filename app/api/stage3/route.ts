import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { evaluateCandidate } from "@/lib/evaluator";
import { getRoleConfig } from "@/lib/pipelineConfig";
import { buildCandidateText } from "@/lib/candidateText";
import { logApiCall } from "@/lib/logCost";

export async function POST(req: Request) {
  let roleId: string;
  try {
    const body = await req.json();
    roleId = body?.roleId;
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!roleId) {
    return NextResponse.json({ error: "roleId is required" }, { status: 400 });
  }

  const config = await getRoleConfig(roleId);
  const { data: candidates, error } = await supabase
    .from("candidates")
    .select("id, skills,resume_text")
    .eq("stage2_status", "passed")
    .eq("stage3_status", "pending")
    .eq("role_id", roleId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let passedCount = 0;
  let rejectedCount = 0;
  let failedCount = 0;

  for (const candidate of candidates) {
    try {
      const candidateText = buildCandidateText(candidate.skills, candidate.resume_text);
      const { score, reasoning } = await evaluateCandidate(candidateText); 
      await logApiCall("stage3", "gemini-llm");
      const passed = score >= config.score_threshold;

      const { error: updateError } = await supabase
        .from("candidates")
        .update({
          stage3_score: score,
          stage3_reasoning: reasoning,
          stage3_status: passed ? "passed" : "rejected",
        })
        .eq("id", candidate.id)
        .eq("role_id", roleId);

      if (updateError) {
        console.error(`Failed to update candidate ${candidate.id}:`, updateError);
        failedCount++;
        continue;
      }

      passed ? passedCount++ : rejectedCount++;
    } catch (err) {
      console.error(`Failed to evaluate candidate ${candidate.id}:`, err);
      failedCount++;
    }
  }

  return NextResponse.json({ passedCount, rejectedCount, failedCount }, { status: 200 });
}