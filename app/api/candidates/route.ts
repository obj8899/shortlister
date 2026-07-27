import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { normalizeSkills } from "@/lib/normalize";
import { flagForReview } from "@/lib/authenticity";
import { extractResumeText } from "@/lib/extractResumeText";
import { checkNearDuplicate } from "@/lib/duplicateCheck";
import { buildCandidateText } from "@/lib/candidateText";
import { analyzeATS } from "@/lib/atsAnalysis";
export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.roleId) {
    return NextResponse.json({ error: "roleId is required" }, { status: 400 });
  }

  const { data: existing, error: lookupError } = await supabase
    .from("candidates")
    .select("id")
    .eq("email", body.email)
    .eq("role_id", body.roleId)
    .maybeSingle();

  if (lookupError) {
    return NextResponse.json({ error: lookupError.message }, { status: 500 });
  }

  if (existing) {
    return NextResponse.json(
      { error: "A submission with this email already exists for this role." },
      { status: 409 }
    );
  }

  const normalizedSkills = normalizeSkills(body.skills);
  const authCheck = flagForReview(normalizedSkills);
  const resumeText = await extractResumeText(body.resumeUrl); 
  const candidateTextForDupCheck = buildCandidateText(normalizedSkills.join(", "), resumeText);
  const dupCheck = await checkNearDuplicate(candidateTextForDupCheck);

  const { data: roleData, error: roleError } = await supabase
    .from("roles")
    .select("target_profile")
    .eq("id", body.roleId)
    .maybeSingle();

  if (roleError) {
    return NextResponse.json({ error: roleError.message }, { status: 500 });
  }
  if (!roleData) {
    return NextResponse.json({ error: "Role not found" }, { status: 404 });
  }

  const atsResult = await analyzeATS(normalizedSkills.join(", "), resumeText, roleData.target_profile);

  const { error } = await supabase.from("candidates").insert({
    name: body.name,
    email: body.email,
    role_id: body.roleId,
    skills: normalizedSkills.join(", "),
    resume_url: body.resumeUrl,
    linkedin_url: body.linkedinUrl || null,
    flagged: authCheck.flagged,
    flag_reason: authCheck.reason || null,
    resume_text: resumeText,  
    college: body.college,
    duplicate_flag: dupCheck.flagged,
    duplicate_reason: dupCheck.reason || null,
    ats_score: atsResult.score,
    ats_feedback: atsResult.feedback,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}