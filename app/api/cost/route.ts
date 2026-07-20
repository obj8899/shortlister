import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// Rough public per-call cost estimates (USD), for illustration
const COST_PER_CALL = {
  "gemini-embedding": 0.00002,
  "gemini-llm": 0.0009,
};
const NAIVE_LLM_COST_PER_CANDIDATE = 0.006; // cost if every candidate got a full LLM pass, no funnel

export async function GET() {
  const { count: totalCandidates } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true });

  const { data: logs } = await supabase.from("api_cost_log").select("stage, provider");

  let actualCost = 0;
  const counts = { stage2: 0, stage3: 0 };
  for (const log of logs || []) {
    actualCost += COST_PER_CALL[log.provider as keyof typeof COST_PER_CALL] || 0;
    if (log.stage === "stage2") counts.stage2++;
    if (log.stage === "stage3") counts.stage3++;
  }

  const naiveCost = (totalCandidates ?? 0) * NAIVE_LLM_COST_PER_CANDIDATE;
  const savings = naiveCost > 0 ? Math.round((1 - actualCost / naiveCost) * 100) : 0;

  return NextResponse.json({
    totalCandidates: totalCandidates ?? 0,
    stage2Calls: counts.stage2,
    stage3Calls: counts.stage3,
    actualCost: actualCost.toFixed(4),
    naiveCost: naiveCost.toFixed(4),
    savingsPercent: savings,
  });
}