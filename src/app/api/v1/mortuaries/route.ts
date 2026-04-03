import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { handleApiError, createErrorResponse } from "@/lib/api/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const citySlug = searchParams.get("city");

    const supabase = await createClient();

    // If city slug provided, filter by city
    if (citySlug) {
      // First find the city
      const { data: city, error: cityError } = await supabase
        .from("cities")
        .select("id")
        .eq("slug", citySlug)
        .single();

      if (cityError || !city) {
        return createErrorResponse("CITY_NOT_FOUND");
      }

      // Then get mortuaries in that city with services
      const { data, error } = await supabase
        .from("mortuaries")
        .select(
          `
          id, name, slug, address, phone, whatsapp, availability,
          price_range, description,
          mortuary_services (id, service_name),
          mortuary_hours (id, day_of_week, open_time, close_time, is_closed)
        `
        )
        .eq("city_id", city.id)
        .eq("is_active", true)
        .eq("is_approved", true)
        .order("name", { ascending: true });

      if (error) throw error;

      return NextResponse.json({ data });
    }

    // No city filter — return all active mortuaries (limited use case)
    const { data, error } = await supabase
      .from("mortuaries")
      .select("id, name, slug, address, phone, availability, price_range")
      .eq("is_active", true)
      .eq("is_approved", true)
      .order("name", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    return handleApiError(error);
  }
}
