import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roleId = searchParams.get("roleId");

  if (!roleId) {
    return NextResponse.json({ error: "roleId is required" }, { status: 400 });
  }

  const { count: total } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true })
    .eq("role_id", roleId);

  const { count: stage1Passed } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true })
    .eq("stage1_status", "passed")
    .eq("role_id", roleId);

  const { count: stage2Passed } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true })
    .eq("stage2_status", "passed")
    .eq("role_id", roleId);

  const { count: stage3Passed } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true })
    .eq("stage3_status", "passed")
    .eq("role_id", roleId);

  const { count: shortlisted } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true })
    .eq("shortlisted", true)
    .eq("role_id", roleId);

  return NextResponse.json({
    total: total ?? 0,
    stage1Passed: stage1Passed ?? 0,
    stage2Passed: stage2Passed ?? 0,
    stage3Passed: stage3Passed ?? 0,
    shortlisted: shortlisted ?? 0,
  });
}