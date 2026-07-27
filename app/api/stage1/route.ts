import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { runHardFilter } from "@/lib/hardFilter";
import { getRoleConfig } from "@/lib/pipelineConfig";

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
  const requiredSkills = config.required_skills.split(",").map((s) => s.trim().toLowerCase());

  const { data: candidates, error } = await supabase
    .from("candidates")
    .select("id, skills")
    .eq("stage1_status", "pending")
    .eq("role_id", roleId);

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
      .eq("id", candidate.id)
      .eq("role_id", roleId);

    if (updateError) continue;
    result.passed ? passedCount++ : rejectedCount++;
  }

  return NextResponse.json({ passedCount, rejectedCount }, { status: 200 });
}