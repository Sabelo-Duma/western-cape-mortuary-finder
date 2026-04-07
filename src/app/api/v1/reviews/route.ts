import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.mortuary_id || !body.reviewer_name?.trim() || !body.reviewer_phone?.trim() || !body.rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        mortuary_id: body.mortuary_id,
        reviewer_name: body.reviewer_name.trim(),
        reviewer_phone: body.reviewer_phone.trim(),
        rating: body.rating,
        comment: body.comment || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Review insert error:", error);
      return NextResponse.json(
        { error: "Failed to submit review" },
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
