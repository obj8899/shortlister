import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { generateEmbedding } from "@/lib/embeddings";
import { cosineSimilarity } from "@/lib/similarity";
import { getPipelineConfig } from "@/lib/pipelineConfig";
import { buildCandidateText } from "@/lib/candidateText";

export async function POST() {
  const config = await getPipelineConfig();

  const { data: candidates, error } = await supabase
    .from("candidates")
    .select("id, skills, resume_text")
    .eq("stage1_status", "passed")
    .eq("stage2_status", "pending");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const targetEmbedding = await generateEmbedding(config.target_profile);

  let passedCount = 0;
  let rejectedCount = 0;
  let failedCount = 0;

  for (const candidate of candidates) {
    try {
      const candidateText = buildCandidateText(candidate.skills, candidate.resume_text);
const candidateEmbedding = await generateEmbedding(candidateText);
      const score = cosineSimilarity(candidateEmbedding, targetEmbedding);
      const passed = score >= config.similarity_threshold;
      const embeddingString = `[${candidateEmbedding.join(",")}]`;

      const { error: updateError } = await supabase
        .from("candidates")
        .update({
          embedding: embeddingString,
          similarity_score: score,
          stage2_status: passed ? "passed" : "rejected",
        })
        .eq("id", candidate.id);

      if (updateError) { failedCount++; continue; }
      passed ? passedCount++ : rejectedCount++;
    } catch {
      failedCount++;
    }
  }

  return NextResponse.json({ passedCount, rejectedCount, failedCount }, { status: 200 });
}