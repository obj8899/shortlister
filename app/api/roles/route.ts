import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const { data, error } = await supabase
    .from("roles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ roles: data || [] }, { status: 200 });
}

export async function POST() {
  const { data, error } = await supabase
    .from("roles")
    .insert({
      role_name: "New Role",
      required_skills: "python,sql",
      min_skill_count: 2,
      target_profile: "Experienced in Python, SQL, and data analysis.",
      similarity_threshold: 0.7,
      score_threshold: 60,
      shortlist_size: 15,
      similarity_weight: 0.4,
      eval_weight: 0.6,
      status: "open",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ role: data }, { status: 201 });
}
