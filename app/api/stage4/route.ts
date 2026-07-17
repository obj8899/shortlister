import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { RANKING_WEIGHTS, SHORTLIST_SIZE } from "@/lib/rankingConfig";

export async function POST() {
  const { data: candidates, error } = await supabase
    .from("candidates")
    .select("id, similarity_score, stage3_score")
    .eq("stage3_status", "passed");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Compute final_score for each candidate
  // similarity_score is 0-1, stage3_score is 0-100 — normalize similarity to same 0-100 scale first
  const scored = candidates.map((c) => {
    const normalizedSimilarity = (c.similarity_score ?? 0) * 100;
    const finalScore =
      normalizedSimilarity * RANKING_WEIGHTS.similarity +
      (c.stage3_score ?? 0) * RANKING_WEIGHTS.aiEvaluation;
    return { id: c.id, finalScore: Math.round(finalScore * 100) / 100 };
  });

  // Sort descending by final score
  scored.sort((a, b) => b.finalScore - a.finalScore);

  let updatedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < scored.length; i++) {
    const rank = i + 1;
    const isShortlisted = rank <= SHORTLIST_SIZE;

    const { error: updateError } = await supabase
      .from("candidates")
      .update({
        final_score: scored[i].finalScore,
        final_rank: rank,
        shortlisted: isShortlisted,
      })
      .eq("id", scored[i].id);

    if (updateError) {
      console.error(`Failed to update candidate ${scored[i].id}:`, updateError);
      failedCount++;
      continue;
    }

    updatedCount++;
  }

  return NextResponse.json(
    { totalRanked: updatedCount, shortlisted: Math.min(SHORTLIST_SIZE, updatedCount), failedCount },
    { status: 200 }
  );
}