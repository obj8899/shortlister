import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roleId = searchParams.get("roleId");

  if (!roleId) {
    return NextResponse.json({ error: "roleId query parameter is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("candidates")
    .select(
      "id, name, skills, resume_url, linkedin_url, flagged, flag_reason, stage1_status, stage1_reason, stage2_status, similarity_score, stage3_status, stage3_score, stage3_reasoning, final_rank, final_score, shortlisted, manual_override, duplicate_flag, duplicate_reason"
    )
    .eq("role_id", roleId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ candidates: data });
}
