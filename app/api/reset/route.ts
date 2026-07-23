import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST() {
  const { error } = await supabase
    .from("candidates")
    .update({
      stage1_status: "pending",
      stage1_reason: null,
      stage2_status: "pending",
      similarity_score: null,
      embedding: null,
      stage3_status: "pending",
      stage3_score: null,
      stage3_reasoning: null,
      final_rank: null,
      final_score: null,
      shortlisted: false,
      manual_override: false,
      email_sent: false,
    })
    .gte("created_at", "1970-01-01");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}