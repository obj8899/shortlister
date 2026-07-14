import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Steps 2-4 (validation, normalization, dedup) will go here

  const { error } = await supabase.from("candidates").insert({
    name: body.name,
    email: body.email,
    skills: body.skills,
    resume_url: body.resumeUrl,
    linkedin_url: body.linkedinUrl || null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}