import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

interface CollegeStats {
  total: number;
  stage1Passed: number;
  stage2Passed: number;
  stage3Passed: number;
  shortlisted: number;
}

export async function GET() {
  const { data, error } = await supabase
    .from("candidates")
    .select("college, stage1_status, stage2_status, stage3_status, shortlisted");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const breakdown: { [key: string]: CollegeStats } = {};

  for (const c of data) {
    const college = c.college || "Unspecified";
    if (!breakdown[college]) {
      breakdown[college] = { total: 0, stage1Passed: 0, stage2Passed: 0, stage3Passed: 0, shortlisted: 0 };
    }
    breakdown[college].total++;
    if (c.stage1_status === "passed") breakdown[college].stage1Passed++;
    if (c.stage2_status === "passed") breakdown[college].stage2Passed++;
    if (c.stage3_status === "passed") breakdown[college].stage3Passed++;
    if (c.shortlisted) breakdown[college].shortlisted++;
  }

  return NextResponse.json({ breakdown }, { status: 200 });
}