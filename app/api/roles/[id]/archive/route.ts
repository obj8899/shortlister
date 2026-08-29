import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { error } = await supabase
    .from("roles")
    .update({ archived: true, status: "closed" })
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true }, { status: 200 });
}
