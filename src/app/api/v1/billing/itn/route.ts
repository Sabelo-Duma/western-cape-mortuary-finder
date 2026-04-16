import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { validateItn } from "@/lib/payfast";

export async function POST(request: NextRequest) {
  try {
    // Parse form-encoded body
    const text = await request.text();
    const params: Record<string, string> = {};
    for (const pair of text.split("&")) {
      const [key, ...rest] = pair.split("=");
      params[decodeURIComponent(key)] = decodeURIComponent(rest.join("="));
    }

    // Get source IP (Vercel uses x-forwarded-for)
    const sourceIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "0.0.0.0";

    // Validate the ITN
    const { valid, reason } = await validateItn(params, sourceIp);
    if (!valid) {
      console.error("ITN validation failed:", reason);
      // Return 200 anyway — PayFast retries on non-200, and invalid ITNs should be dropped
      return NextResponse.json({ ok: false }, { status: 200 });
    }

    const mortuaryId = params.custom_str1;
    const tier = params.custom_str2;
    const paymentStatus = params.payment_status;
    const pfPaymentId = params.pf_payment_id;
    const token = params.token; // subscription token for recurring
    const amountGross = params.amount_gross;

    if (!mortuaryId || !tier) {
      console.error("ITN missing custom fields:", params);
      return NextResponse.json({ ok: false }, { status: 200 });
    }

    const amountCents = Math.round(parseFloat(amountGross || "0") * 100);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Insert payment record
    await supabase.from("payments").insert({
      mortuary_id: mortuaryId,
      pf_payment_id: pfPaymentId,
      amount_cents: amountCents,
      status: paymentStatus,
      raw_itn: params,
    });

    // Map PayFast payment_status to subscription status
    let subscriptionStatus: string;
    if (paymentStatus === "COMPLETE") {
      subscriptionStatus = "active";
    } else if (paymentStatus === "CANCELLED") {
      subscriptionStatus = "cancelled";
    } else {
      // FAILED, PENDING, etc.
      subscriptionStatus = "failed";
    }

    // Update subscription
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const updateData: Record<string, unknown> = {
      status: subscriptionStatus,
      updated_at: now.toISOString(),
    };

    if (subscriptionStatus === "active") {
      updateData.payfast_token = token;
      updateData.current_period_start = now.toISOString();
      updateData.current_period_end = periodEnd.toISOString();
    }
    if (subscriptionStatus === "cancelled") {
      updateData.cancelled_at = now.toISOString();
    }

    // Also link the payment to the subscription
    const { data: sub } = await supabase
      .from("subscriptions")
      .update(updateData)
      .eq("mortuary_id", mortuaryId)
      .select("id")
      .single();

    if (sub) {
      await supabase
        .from("payments")
        .update({ subscription_id: sub.id })
        .eq("mortuary_id", mortuaryId)
        .eq("pf_payment_id", pfPaymentId);
    }

    // The DB trigger (sync_mortuary_tier) handles updating mortuaries.subscription_tier
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("ITN handler error:", err);
    // Return 200 to prevent PayFast retries on unrecoverable errors
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
