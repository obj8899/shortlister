import { supabase } from "@/lib/supabaseClient";

export interface PipelineConfig {
  required_skills: string;
  min_skill_count: number;
  target_profile: string;
  similarity_threshold: number;
  score_threshold: number;
  shortlist_size: number;
  similarity_weight: number;
  eval_weight: number;
}

export async function getPipelineConfig(): Promise<PipelineConfig> {
  const { data } = await supabase.from("pipeline_config").select("*").eq("id", 1).single();
  return (
    data ?? {
      required_skills: "python,sql",
      min_skill_count: 2,
      target_profile: "Experienced in Python, SQL, and data analysis.",
      similarity_threshold: 0.7,
      score_threshold: 60,
      shortlist_size: 15,
      similarity_weight: 0.4,
      eval_weight: 0.6,
    }
  );
}