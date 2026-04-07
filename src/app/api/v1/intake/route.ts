import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const required = [
      "mortuary_id",
      "deceased_full_name",
      "deceased_date_of_death",
      "deceased_gender",
      "death_scenario",
      "nok_full_name",
      "nok_phone",
      "nok_relationship",
    ];

    for (const field of required) {
      if (!body[field] || (typeof body[field] === "string" && body[field].trim() === "")) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const supabase = await createClient();

    // Verify the mortuary exists and is active
    const { data: mortuary } = await supabase
      .from("mortuaries")
      .select("id")
      .eq("id", body.mortuary_id)
      .eq("is_active", true)
      .eq("is_approved", true)
      .single();

    if (!mortuary) {
      return NextResponse.json(
        { error: "Mortuary not found or not active" },
        { status: 404 }
      );
    }

    // Clean up empty strings to null for optional fields
    const cleanData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === "string" && value.trim() === "") {
        cleanData[key] = null;
      } else {
        cleanData[key] = value;
      }
    }

    const { data, error } = await supabase
      .from("intake_submissions")
      .insert(cleanData)
      .select("id")
      .single();

    if (error) {
      console.error("Intake insert error:", error);
      return NextResponse.json(
        { error: "Failed to submit form. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id, status: "submitted" });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
