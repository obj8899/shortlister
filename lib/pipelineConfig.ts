import { supabase } from "@/lib/supabaseClient";

export interface RoleConfig {
  id: string;
  role_name: string;
  required_skills: string;
  min_skill_count: number;
  target_profile: string;
  similarity_threshold: number;
  score_threshold: number;
  shortlist_size: number;
  similarity_weight: number;
  eval_weight: number;
  status: string;
}

export async function getRoleConfig(roleId: string): Promise<RoleConfig> {
  const { data } = await supabase
    .from("roles")
    .select("*")
    .eq("id", roleId)
    .maybeSingle();

  return (
    data ?? {
      id: roleId,
      role_name: "frontend",
      required_skills: "python,sql",
      min_skill_count: 2,
      target_profile: "Experienced in Python, SQL, and data analysis.",
      similarity_threshold: 0.7,
      score_threshold: 60,
      shortlist_size: 15,
      similarity_weight: 0.4,
      eval_weight: 0.6,
      status: "open",
    }
  );
}

export async function listOpenRoles(): Promise<RoleConfig[]> {
  const { data, error } = await supabase
    .from("roles")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error listing open roles:", error);
    return [];
  }
  return data || [];
}
