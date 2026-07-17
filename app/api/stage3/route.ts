import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { evaluateCandidate } from "@/lib/evaluator";

const SCORE_THRESHOLD = 60;

export async function POST() {
  const { data: candidates, error } = await supabase
    .from("candidates")
    .select("id, skills")
    .eq("stage2_status", "passed")
    .eq("stage3_status", "pending");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let passedCount = 0;
  let rejectedCount = 0;
  let failedCount = 0;

  for (const candidate of candidates) {
    try {
      const { score, reasoning } = await evaluateCandidate(candidate.skills);
      const passed = score >= SCORE_THRESHOLD;

      const { error: updateError } = await supabase
        .from("candidates")
        .update({
          stage3_score: score,
          stage3_reasoning: reasoning,
          stage3_status: passed ? "passed" : "rejected",
        })
        .eq("id", candidate.id);

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