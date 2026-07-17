import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const { data, error } = await supabase
    .from("candidates")
    .select("name, final_score, final_rank, stage3_reasoning")
    .eq("shortlisted", true)
    .order("final_rank", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ candidates: data });
}