import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { runHardFilter } from "@/lib/hardFilter";

export async function POST() {
  const { data: candidates, error } = await supabase
    .from("candidates")
    .select("id, skills")
    .eq("stage1_status", "pending");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let passedCount = 0;
  let rejectedCount = 0;

  for (const candidate of candidates) {
    const skillsArray = candidate.skills.split(",").map((s: string) => s.trim());
    const result = runHardFilter(skillsArray);

    const { error: updateError } = await supabase
      .from("candidates")
      .update({
        stage1_status: result.passed ? "passed" : "rejected",
        stage1_reason: result.reason || null,
      })
      .eq("id", candidate.id);

    if (updateError) {
      console.error(`Failed to update candidate ${candidate.id}:`, updateError);
      continue;
    }

    result.passed ? passedCount++ : rejectedCount++;
  }

  return NextResponse.json({ passedCount, rejectedCount }, { status: 200 });
}