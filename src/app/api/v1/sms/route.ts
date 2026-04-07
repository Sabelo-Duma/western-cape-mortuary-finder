import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * SMS/USSD Query Endpoint
 *
 * Accepts a city name via query parameter and returns a plain text list
 * of available mortuaries. Designed to be called by an SMS gateway
 * (e.g. Africa's Talking, ClickSend, Twilio) when a user sends an SMS.
 *
 * Usage:
 *   GET /api/v1/sms?city=cape+town
 *   GET /api/v1/sms?city=george
 *
 * SMS Gateway Integration:
 *   1. User sends SMS "Cape Town" to your short code
 *   2. Gateway hits this endpoint with ?city=cape+town
 *   3. This returns plain text response
 *   4. Gateway sends the text back to the user
 *
 * Response format: plain text (for SMS delivery)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cityQuery = searchParams.get("city")?.trim().toLowerCase();

  if (!cityQuery) {
    return new Response(
      "WC Mortuary Finder\nSend a city name to find available mortuaries.\nCities: Cape Town, Stellenbosch, Paarl, George, Worcester, Knysna, Mossel Bay, Hermanus, Malmesbury, Beaufort West",
      { headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Find city by name (fuzzy match)
  const { data: cities } = await supabase
    .from("cities")
    .select("id, name")
    .ilike("name", `%${cityQuery}%`);

  if (!cities || cities.length === 0) {
    return new Response(
      `No city found for "${cityQuery}".\nTry: Cape Town, Stellenbosch, Paarl, George, Worcester, Knysna, Mossel Bay, Hermanus, Malmesbury, Beaufort West`,
      { headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }

  const city = cities[0];

  const { data: mortuaries } = await supabase
    .from("mortuaries")
    .select("name, phone, availability")
    .eq("city_id", city.id)
    .eq("is_active", true)
    .eq("is_approved", true)
    .order("availability");

  if (!mortuaries || mortuaries.length === 0) {
    return new Response(
      `No mortuaries in ${city.name} yet.\nVisit western-cape-mortuary-finder.vercel.app for more info.`,
      { headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }

  const statusEmoji: Record<string, string> = {
    available: "[OPEN]",
    limited: "[LIMITED]",
    full: "[FULL]",
  };

  const lines = [
    `Mortuaries in ${city.name}:`,
    "",
    ...mortuaries.map(
      (m) => `${statusEmoji[m.availability] || ""} ${m.name}\nCall: ${m.phone}`
    ),
    "",
    "More info: western-cape-mortuary-finder.vercel.app",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
