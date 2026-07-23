import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const { data } = await supabase
    .from("pipeline_config")
    .select("role_name")
    .eq("id", 1)
    .maybeSingle();

  return NextResponse.json({ roleName: data?.role_name || "this role" });
}
