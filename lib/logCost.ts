import { supabase } from "@/lib/supabaseClient";

export async function logApiCall(stage: string, provider: "gemini-embedding" | "gemini-llm") {
  await supabase.from("api_cost_log").insert({ stage, provider });
}