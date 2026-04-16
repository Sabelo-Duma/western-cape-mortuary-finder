import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyTransaction, TIER_PRICING } from "@/lib/callpay";

// CallPay sends IPN as GET or POST with transaction_id parameter
export async function GET(request: NextRequest) {
  return handleIpn(request);
}

export async function POST(request: NextRequest) {
  return handleIpn(request);
}

async function handleIpn(request: NextRequest) {
  try {
    // CallPay sends transaction_id as a query param or form field
    const url = new URL(request.url);
    let transactionId = url.searchParams.get("transaction_id");

    // Also check POST body if not in query
    if (!transactionId) {
      try {
        const text = await request.text();
        const params = new URLSearchParams(text);
        transactionId = params.get("transaction_id");
      } catch {
        // ignore parse errors
      }
    }

    if (!transactionId) {
      console.error("IPN missing transaction_id");
      return NextResponse.json({ ok: false }, { status: 200 });
    }

    // Verify transaction with CallPay API
    const tx = await verifyTransaction(transactionId);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Parse merchant_reference: "mortuaryId|tier"
    const [mortuaryId, tier] = tx.merchantReference.split("|");

    if (!mortuaryId || !tier) {
      console.error("IPN invalid merchant_reference:", tx.merchantReference);
      return NextResponse.json({ ok: false }, { status: 200 });
    }

    // Verify amount matches expected tier pricing
    const pricing = TIER_PRICING[tier];
    if (pricing && Math.abs(tx.amount - pricing.amount) > 1) {
      console.error("IPN amount mismatch:", tx.amount, "expected:", pricing.amount);
      return NextResponse.json({ ok: false }, { status: 200 });
    }

    const amountCents = Math.round(tx.amount * 100);

    // Insert payment record
    await supabase.from("payments").insert({
      mortuary_id: mortuaryId,
      pf_payment_id: tx.id,
      amount_cents: amountCents,
      status: tx.successful ? "COMPLETE" : "FAILED",
      raw_itn: tx.raw,
    });

    // Update subscription
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const updateData: Record<string, unknown> = {
      updated_at: now.toISOString(),
    };

    if (tx.successful) {
      updateData.status = "active";
      updateData.current_period_start = now.toISOString();
      updateData.current_period_end = periodEnd.toISOString();
      // Store card token for future recurring charges
      if (tx.cardToken) {
        updateData.payfast_token = tx.cardToken; // reusing column for card token
      }
    } else {
      updateData.status = "failed";
    }

    const { data: sub } = await supabase
      .from("subscriptions")
      .update(updateData)
      .eq("mortuary_id", mortuaryId)
      .select("id")
      .single();

    // Link payment to subscription
    if (sub) {
      await supabase
        .from("payments")
        .update({ subscription_id: sub.id })
        .eq("mortuary_id", mortuaryId)
        .eq("pf_payment_id", tx.id);
    }

    // DB trigger auto-syncs mortuaries.subscription_tier
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("IPN handler error:", err);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
