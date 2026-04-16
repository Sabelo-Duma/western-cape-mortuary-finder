import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createAuthClient } from "@/lib/supabase/server";
import { buildCheckoutData, TIER_PRICING } from "@/lib/payfast";

export async function POST(request: Request) {
  try {
    const { tier } = await request.json();

    if (!tier || !TIER_PRICING[tier]) {
      return NextResponse.json(
        { error: "Invalid tier. Must be 'standard' or 'premium'." },
        { status: 400 }
      );
    }

    // Authenticate the user
    const authClient = await createAuthClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Fetch their mortuary
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: mortuary } = await supabase
      .from("mortuaries")
      .select("id, name, subscription_tier")
      .eq("owner_id", user.id)
      .eq("is_active", true)
      .single();

    if (!mortuary) {
      return NextResponse.json(
        { error: "No active mortuary listing found. Complete onboarding first." },
        { status: 404 }
      );
    }

    // Already on this tier or higher
    if (mortuary.subscription_tier === tier) {
      return NextResponse.json(
        { error: `Already on the ${tier} plan.` },
        { status: 409 }
      );
    }
    if (mortuary.subscription_tier === "premium" && tier === "standard") {
      return NextResponse.json(
        { error: "Cannot downgrade via checkout. Cancel your current subscription first." },
        { status: 409 }
      );
    }

    const pricing = TIER_PRICING[tier];

    // Upsert subscription row (handles upgrade from standard -> premium)
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .upsert(
        {
          mortuary_id: mortuary.id,
          tier,
          status: "pending",
          amount_cents: pricing.amountCents,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "mortuary_id" }
      )
      .select("id")
      .single();

    if (subError) {
      console.error("Subscription upsert error:", subError);
      return NextResponse.json(
        { error: "Failed to create subscription record." },
        { status: 500 }
      );
    }

    // Build PayFast checkout data
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const checkoutData = buildCheckoutData({
      mortuaryId: mortuary.id,
      mortuaryName: mortuary.name,
      ownerEmail: user.email ?? "",
      tier: tier as "standard" | "premium",
      returnUrl: `${siteUrl}/admin/billing/success`,
      cancelUrl: `${siteUrl}/admin/billing/cancel`,
      notifyUrl: `${siteUrl}/api/v1/billing/itn`,
    });

    return NextResponse.json(checkoutData);
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
