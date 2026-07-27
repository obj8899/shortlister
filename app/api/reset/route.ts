import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

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
    .eq("role_id", roleId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}