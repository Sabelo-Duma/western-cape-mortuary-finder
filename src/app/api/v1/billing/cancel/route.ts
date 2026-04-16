import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createAuthClient } from "@/lib/supabase/server";
import { cancelSubscription } from "@/lib/payfast";

export async function POST() {
  try {
    // Authenticate user
    const authClient = await createAuthClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Find user's mortuary
    const { data: mortuary } = await supabase
      .from("mortuaries")
      .select("id")
      .eq("owner_id", user.id)
      .single();

    if (!mortuary) {
      return NextResponse.json({ error: "No mortuary found" }, { status: 404 });
    }

    // Find active subscription
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("id, payfast_token, status")
      .eq("mortuary_id", mortuary.id)
      .eq("status", "active")
      .single();

    if (!subscription) {
      return NextResponse.json(
        { error: "No active subscription to cancel" },
        { status: 404 }
      );
    }

    // Cancel via PayFast API
    if (subscription.payfast_token) {
      const cancelled = await cancelSubscription(subscription.payfast_token);
      if (!cancelled) {
        return NextResponse.json(
          { error: "Failed to cancel subscription with PayFast. Please try again." },
          { status: 502 }
        );
      }
    }

    // Update local record
    await supabase
      .from("subscriptions")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscription.id);

    // The DB trigger handles reverting mortuaries.subscription_tier to 'free'
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Cancel subscription error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
