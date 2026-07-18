import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { SHORTLIST_SIZE } from "@/lib/rankingConfig";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const similarityWeight = body.similarityWeight ?? 0.4;
  const evalWeight = body.evalWeight ?? 0.6;

  const { data: candidates, error } = await supabase
    .from("candidates")
    .select("id, similarity_score, stage3_score")
    .eq("stage3_status", "passed");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const scored = candidates.map((c) => {
    const normalizedSimilarity = (c.similarity_score ?? 0) * 100;
    const finalScore =
      normalizedSimilarity * similarityWeight + (c.stage3_score ?? 0) * evalWeight;
    return { id: c.id, finalScore: Math.round(finalScore * 100) / 100 };
  });

  scored.sort((a, b) => b.finalScore - a.finalScore);

  let updatedCount = 0;

  for (let i = 0; i < scored.length; i++) {
    const rank = i + 1;
    await supabase
      .from("candidates")
      .update({
        final_score: scored[i].finalScore,
        final_rank: rank,
        shortlisted: rank <= SHORTLIST_SIZE,
        manual_override: false,
      })
      .eq("id", scored[i].id);
    updatedCount++;
  }

  return NextResponse.json({ totalRanked: updatedCount }, { status: 200 });
}