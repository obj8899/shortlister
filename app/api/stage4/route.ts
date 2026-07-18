import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { SHORTLIST_SIZE } from "@/lib/rankingConfig";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const similarityWeight = body.similarityWeight ?? 0.4;
  const evalWeight = body.evalWeight ?? 0.6;

  const { data: candidates, error } = await supabase
    .from("candidates")
    .select("id, similarity_score, stage3_score, manual_override")
    .eq("stage3_status", "passed");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Separate manually-overridden candidates from auto-ranked ones
  const autoRanked = candidates.filter((c) => !c.manual_override);
  const overridden = candidates.filter((c) => c.manual_override);

  const scored = autoRanked.map((c) => {
    const normalizedSimilarity = (c.similarity_score ?? 0) * 100;
    const finalScore =
      normalizedSimilarity * similarityWeight + (c.stage3_score ?? 0) * evalWeight;
    return { id: c.id, finalScore: Math.round(finalScore * 100) / 100 };
  });

  scored.sort((a, b) => b.finalScore - a.finalScore);

  // Reserve shortlist slots already taken by manual overrides
  const overriddenShortlistedCount = overridden.length; // we'll only count actual shortlisted ones below, refined next
  let updatedCount = 0;

  // Rank only the auto-ranked group; manual overrides keep their existing shortlisted value untouched
  const availableSlots = Math.max(SHORTLIST_SIZE - overriddenShortlistedCount, 0);

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

  return NextResponse.json(
    { totalRanked: updatedCount, skippedOverrides: overridden.length },
    { status: 200 }
  );
}