import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { generateEmbedding } from "@/lib/embeddings";

export async function POST() {
  const { data: candidates, error } = await supabase
    .from("candidates")
    .select("id, skills")
    .eq("stage1_status", "passed")
    .eq("stage2_status", "pending");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let processedCount = 0;
  let failedCount = 0;

  for (const candidate of candidates) {
    try {
      const embeddingArray = await generateEmbedding(candidate.skills);
      const embeddingString = `[${embeddingArray.join(",")}]`;

      const { error: updateError } = await supabase
        .from("candidates")
        .update({
          embedding: embeddingString,
          stage2_status: "processed",
        })
        .eq("id", candidate.id);

      if (updateError) {
        console.error(`Failed to update candidate ${candidate.id}:`, updateError);
        failedCount++;
        continue;
      }

      processedCount++;
    } catch (err) {
      console.error(`Failed to generate embedding for candidate ${candidate.id}:`, err);
      failedCount++;
    }
  }

  return NextResponse.json({ processedCount, failedCount }, { status: 200 });
}