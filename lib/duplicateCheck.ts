import { supabase } from "@/lib/supabaseClient";
import { generateEmbedding } from "@/lib/embeddings";
import { cosineSimilarity } from "@/lib/similarity";

const DUPLICATE_THRESHOLD = 0.95;

export async function checkNearDuplicate(
  candidateText: string
): Promise<{ flagged: boolean; reason?: string }> {
  const { data: existing, error } = await supabase
    .from("candidates")
    .select("name, embedding")
    .not("embedding", "is", null);

  if (error || !existing || existing.length === 0) {
    return { flagged: false };
  }

  const newEmbedding = await generateEmbedding(candidateText);

  for (const c of existing) {
    if (!c.embedding) continue;
    const existingEmbedding = JSON.parse(c.embedding as unknown as string);
    const similarity = cosineSimilarity(newEmbedding, existingEmbedding);

    if (similarity >= DUPLICATE_THRESHOLD) {
      return {
        flagged: true,
        reason: `Resume is ${(similarity * 100).toFixed(1)}% similar to existing candidate "${c.name}"`,
      };
    }
  }

  return { flagged: false };
}