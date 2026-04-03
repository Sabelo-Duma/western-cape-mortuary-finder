import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { handleApiError, createErrorResponse } from "@/lib/api/errors";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("mortuaries")
      .select(
        `
        id, name, slug, description, address, phone, whatsapp, email,
        latitude, longitude, availability, price_range,
        view_count, contact_clicks, created_at, updated_at,
        cities (id, name, slug),
        mortuary_services (id, service_name),
        mortuary_hours (id, day_of_week, open_time, close_time, is_closed)
      `
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .eq("is_approved", true)
      .single();

    if (error || !data) {
      return createErrorResponse("MORTUARY_NOT_FOUND");
    }

    return NextResponse.json({ data });
  } catch (error) {
    return handleApiError(error);
  }
}
