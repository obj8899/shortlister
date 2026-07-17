import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { generateEmbedding } from "@/lib/embeddings";
import { cosineSimilarity } from "@/lib/similarity";
import { TARGET_PROFILE_TEXT } from "@/lib/targetProfile";

const SIMILARITY_THRESHOLD = 0.7;

export async function POST() {
  const { data: candidates, error } = await supabase
    .from("candidates")
    .select("id, skills")
    .eq("stage1_status", "passed")
    .eq("stage2_status", "pending");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const targetEmbedding = await generateEmbedding(TARGET_PROFILE_TEXT);

  let passedCount = 0;
  let rejectedCount = 0;
  let failedCount = 0;

  for (const candidate of candidates) {
    try {
      const candidateEmbedding = await generateEmbedding(candidate.skills);
      const score = cosineSimilarity(candidateEmbedding, targetEmbedding);
      const passed = score >= SIMILARITY_THRESHOLD;
      const embeddingString = `[${candidateEmbedding.join(",")}]`;

      const { error: updateError } = await supabase
        .from("candidates")
        .update({
          embedding: embeddingString,
          similarity_score: score,
          stage2_status: passed ? "passed" : "rejected",
        })
        .eq("id", candidate.id);

      if (updateError) {
        console.error(`Failed to update candidate ${candidate.id}:`, updateError);
        failedCount++;
        continue;
      }

      passed ? passedCount++ : rejectedCount++;
    } catch (err) {
      console.error(`Failed to process candidate ${candidate.id}:`, err);
      failedCount++;
    }
  }

  return NextResponse.json({ passedCount, rejectedCount, failedCount }, { status: 200 });
}