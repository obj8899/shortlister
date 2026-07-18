import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { runHardFilter } from "@/lib/hardFilter";
import { getPipelineConfig } from "@/lib/pipelineConfig";

export async function POST() {
  const config = await getPipelineConfig();
  const requiredSkills = config.required_skills.split(",").map((s) => s.trim().toLowerCase());

  const { data: candidates, error } = await supabase
    .from("candidates")
    .select("id, skills")
    .eq("stage1_status", "pending");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let passedCount = 0;
  let rejectedCount = 0;

  for (const candidate of candidates) {
    const skillsArray = candidate.skills.split(",").map((s: string) => s.trim());
    const result = runHardFilter(skillsArray, {
      requiredSkills,
      minSkillCount: config.min_skill_count,
    });

    const { error: updateError } = await supabase
      .from("candidates")
      .update({
        stage1_status: result.passed ? "passed" : "rejected",
        stage1_reason: result.reason || null,
      })
      .eq("id", candidate.id);

    if (updateError) continue;
    result.passed ? passedCount++ : rejectedCount++;
  }

  return NextResponse.json({ passedCount, rejectedCount }, { status: 200 });
}