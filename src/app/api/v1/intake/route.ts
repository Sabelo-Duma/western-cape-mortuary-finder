import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

    // Use service role client to bypass RLS for inserts
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

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

    // Only include valid database columns
    const toNull = (val: unknown) =>
      typeof val === "string" && val.trim() === "" ? null : val;

    const insertData = {
      mortuary_id: body.mortuary_id,
      deceased_full_name: body.deceased_full_name,
      deceased_id_number: toNull(body.deceased_id_number),
      deceased_date_of_birth: toNull(body.deceased_date_of_birth) || null,
      deceased_date_of_death: body.deceased_date_of_death,
      deceased_gender: body.deceased_gender,
      deceased_address: toNull(body.deceased_address),
      deceased_marital_status: toNull(body.deceased_marital_status) || null,
      deceased_spouse_name: toNull(body.deceased_spouse_name),
      death_scenario: body.death_scenario,
      death_location: toNull(body.death_location),
      hospital_name: toNull(body.hospital_name),
      saps_case_number: toNull(body.saps_case_number),
      doctor_name: toNull(body.doctor_name),
      doctor_practice_number: toNull(body.doctor_practice_number),
      doctor_phone: toNull(body.doctor_phone),
      nok_full_name: body.nok_full_name,
      nok_id_number: toNull(body.nok_id_number),
      nok_relationship: body.nok_relationship,
      nok_phone: body.nok_phone,
      nok_email: toNull(body.nok_email),
      nok_address: toNull(body.nok_address),
      disposition: body.disposition || "burial",
      religion: toNull(body.religion),
      cultural_requirements: toNull(body.cultural_requirements),
      urgent_burial: body.urgent_burial || false,
      has_funeral_policy: body.has_funeral_policy || false,
      insurance_provider: toNull(body.insurance_provider),
      policy_number: toNull(body.policy_number),
      additional_notes: toNull(body.additional_notes),
    };

    const { data, error } = await supabase
      .from("intake_submissions")
      .insert(insertData)
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
  } catch (err) {
    console.error("Intake API error:", err);
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
