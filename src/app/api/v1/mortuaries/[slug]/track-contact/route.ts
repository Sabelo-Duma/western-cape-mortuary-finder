import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { handleApiError, createErrorResponse } from "@/lib/api/errors";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: mortuary, error: findError } = await supabase
      .from("mortuaries")
      .select("id, contact_clicks")
      .eq("slug", slug)
      .single();

    if (findError || !mortuary) {
      return createErrorResponse("MORTUARY_NOT_FOUND");
    }

    const { error: updateError } = await supabase
      .from("mortuaries")
      .update({ contact_clicks: mortuary.contact_clicks + 1 })
      .eq("id", mortuary.id);

    if (updateError) throw updateError;

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    return handleApiError(error);
  }
}
