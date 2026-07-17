import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const { count: total } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true });

  const { count: stage1Passed } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true })
    .eq("stage1_status", "passed");

  const { count: stage2Passed } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true })
    .eq("stage2_status", "passed");

  const { count: stage3Passed } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true })
    .eq("stage3_status", "passed");

  const { count: shortlisted } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true })
    .eq("shortlisted", true);

  return NextResponse.json({
    total: total ?? 0,
    stage1Passed: stage1Passed ?? 0,
    stage2Passed: stage2Passed ?? 0,
    stage3Passed: stage3Passed ?? 0,
    shortlisted: shortlisted ?? 0,
  });
}