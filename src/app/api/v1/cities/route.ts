import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { handleApiError } from "@/lib/api/errors";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("cities")
      .select("id, name, slug")
      .order("name", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    return handleApiError(error);
  }
}
