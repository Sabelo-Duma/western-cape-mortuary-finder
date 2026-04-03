import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Check session-based deduplication via cookie
    const viewedKey = `viewed_${slug}`;
    const cookie = request.cookies.get(viewedKey);

    if (cookie) {
      // Already viewed within the window
      return NextResponse.json({ data: { tracked: false } });
    }

    const supabase = await createClient();

    // Increment view count using RPC or direct update
    const { data: mortuary } = await supabase
      .from("mortuaries")
      .select("id, view_count")
      .eq("slug", slug)
      .single();

    if (!mortuary) {
      return NextResponse.json({ data: { tracked: false } });
    }

    await supabase
      .from("mortuaries")
      .update({ view_count: mortuary.view_count + 1 })
      .eq("id", mortuary.id);

    // Set cookie to prevent duplicate counts for 30 minutes
    const response = NextResponse.json({ data: { tracked: true } });
    response.cookies.set(viewedKey, "1", {
      maxAge: 30 * 60, // 30 minutes
      httpOnly: true,
      sameSite: "lax",
    });

    return response;
  } catch {
    // Non-blocking — always return success
    return NextResponse.json({ data: { tracked: false } });
  }
}
