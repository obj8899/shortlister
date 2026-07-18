import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getPipelineConfig } from "@/lib/pipelineConfig";

export async function POST(req: NextRequest) {
  const config = await getPipelineConfig();
  const body = await req.json().catch(() => ({}));
  const similarityWeight = body.similarityWeight ?? config.similarity_weight;
  const evalWeight = body.evalWeight ?? config.eval_weight;

  const { data: candidates, error } = await supabase
    .from("candidates")
    .select("id, similarity_score, stage3_score, manual_override")
    .eq("stage3_status", "passed");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const autoRanked = candidates.filter((c) => !c.manual_override);
  const overridden = candidates.filter((c) => c.manual_override);

  const scored = autoRanked.map((c) => {
    const normalizedSimilarity = (c.similarity_score ?? 0) * 100;
    const finalScore =
      normalizedSimilarity * similarityWeight + (c.stage3_score ?? 0) * evalWeight;
    return { id: c.id, finalScore: Math.round(finalScore * 100) / 100 };
  });

  scored.sort((a, b) => b.finalScore - a.finalScore);

  const availableSlots = Math.max(config.shortlist_size - overridden.length, 0);
  let updatedCount = 0;

  for (let i = 0; i < scored.length; i++) {
    const rank = i + 1;
    const { error: updateError } = await supabase
      .from("candidates")
      .update({
        final_score: scored[i].finalScore,
        final_rank: rank,
        shortlisted: rank <= availableSlots,
      })
      .eq("id", scored[i].id);
    if (!updateError) updatedCount++;
  }

  return NextResponse.json({ totalRanked: updatedCount }, { status: 200 });
}