import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { normalizeSkills } from "@/lib/normalize";
import { flagForReview } from "@/lib/authenticity";
import { extractResumeText } from "@/lib/extractResumeText";
export async function POST(req: NextRequest) {
  const body = await req.json();

  const { data: existing, error: lookupError } = await supabase
    .from("candidates")
    .select("id")
    .eq("email", body.email)
    .maybeSingle();

  if (lookupError) {
    return NextResponse.json({ error: lookupError.message }, { status: 500 });
  }

  if (existing) {
    return NextResponse.json(
      { error: "A submission with this email already exists." },
      { status: 409 }
    );
  }

  const normalizedSkills = normalizeSkills(body.skills);
  const authCheck = flagForReview(normalizedSkills);
  const resumeText = await extractResumeText(body.resumeUrl); 

  const { error } = await supabase.from("candidates").insert({
    name: body.name,
    email: body.email,
    skills: normalizedSkills.join(", "),
    resume_url: body.resumeUrl,
    linkedin_url: body.linkedinUrl || null,
    flagged: authCheck.flagged,
    flag_reason: authCheck.reason || null,
    resume_text: resumeText,  
    college: body.college,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}