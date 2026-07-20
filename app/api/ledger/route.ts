import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const { data, error } = await supabase
    .from("candidates")
    .select(
      "id, name, skills, flagged, flag_reason, stage1_status, stage1_reason, stage2_status, similarity_score, stage3_status, stage3_score, stage3_reasoning, final_rank,final_score, shortlisted,manual_override,duplicate_flag, duplicate_reason"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ candidates: data });
}