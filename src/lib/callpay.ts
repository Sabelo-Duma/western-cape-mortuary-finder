import crypto from "crypto";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const ORG_ID = process.env.CALLPAY_ORG_ID ?? "";
const API_SALT = process.env.CALLPAY_API_SALT ?? "";
const BASE_URL = process.env.CALLPAY_BASE_URL || "https://agent.callpay.com/api/v2";

// ---------------------------------------------------------------------------
// Tier pricing (Rands)
// ---------------------------------------------------------------------------
export const TIER_PRICING: Record<string, { amount: number; name: string }> = {
  standard: { amount: 299, name: "Standard Plan – R299/mo" },
  premium: { amount: 599, name: "Premium Plan – R599/mo" },
};

// ---------------------------------------------------------------------------
// Auth header generation
// ---------------------------------------------------------------------------
function generateAuth(): {
  authToken: string;
  timestamp: number;
  orgId: string;
} {
  const timestamp = Math.floor(Date.now() / 1000);
  const tokenString = `${API_SALT}_${ORG_ID}_${timestamp}`;
  const authToken = crypto
    .createHash("sha256")
    .update(tokenString)
    .digest("hex");
  return { authToken, timestamp, orgId: ORG_ID };
}

function authHeaders(): Record<string, string> {
  const { authToken, timestamp, orgId } = generateAuth();
  return {
    "Auth-Token": authToken,
    "Org-Id": orgId,
    Timestamp: String(timestamp),
  };
}

// ---------------------------------------------------------------------------
// Create a payment key (initiates checkout)
// ---------------------------------------------------------------------------
interface CheckoutParams {
  mortuaryId: string;
  mortuaryName: string;
  tier: "standard" | "premium";
  successUrl: string;
  errorUrl: string;
  cancelUrl: string;
  notifyUrl: string;
  cardToken?: string;
}

interface PaymentKeyResponse {
  key: string;
  url: string;
  [key: string]: unknown;
}

export async function createPaymentKey(
  params: CheckoutParams
): Promise<{ url: string; paymentKey: string }> {
  const pricing = TIER_PRICING[params.tier];
  if (!pricing) throw new Error(`Unknown tier: ${params.tier}`);

  // merchant_reference encodes mortuary_id and tier for the IPN callback
  const merchantRef = `${params.mortuaryId}|${params.tier}`;

  const body = new URLSearchParams({
    amount: pricing.amount.toFixed(2),
    merchant_reference: merchantRef,
    notify_url: params.notifyUrl,
    success_url: params.successUrl,
    error_url: params.errorUrl,
    cancel_url: params.cancelUrl,
    "payment_type[]": "credit_card",
    item_description: `${pricing.name} for ${params.mortuaryName}`,
  });

  if (params.cardToken) {
    body.set("card_token", params.cardToken);
  }

  const response = await fetch(`${BASE_URL}/payment-key`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`CallPay payment-key failed (${response.status}): ${text}`);
  }

  const data = (await response.json()) as PaymentKeyResponse;
  return { url: data.url, paymentKey: data.key };
}

// ---------------------------------------------------------------------------
// Verify a transaction (called after IPN notification)
// ---------------------------------------------------------------------------
export interface TransactionResult {
  id: string;
  successful: boolean;
  amount: number;
  merchantReference: string;
  reason: string | null;
  cardToken: string | null;
  raw: Record<string, unknown>;
}

export async function verifyTransaction(
  transactionId: string
): Promise<TransactionResult> {
  const response = await fetch(
    `${BASE_URL}/gateway-transaction/${transactionId}`,
    {
      method: "GET",
      headers: authHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      `CallPay verify failed (${response.status}): ${await response.text()}`
    );
  }

  const data = await response.json();

  return {
    id: String(data.id ?? transactionId),
    successful: data.successful === 1 || data.successful === "1",
    amount: parseFloat(data.amount ?? "0"),
    merchantReference: data.merchant_reference ?? "",
    reason: data.reason ?? null,
    cardToken: data.card_token ?? data.guid ?? null,
    raw: data,
  };
}

// ---------------------------------------------------------------------------
// Test connection
// ---------------------------------------------------------------------------
export async function testConnection(): Promise<boolean> {
  try {
    const response = await fetch(
      `${BASE_URL}/organisation/${ORG_ID}/services`,
      { method: "GET", headers: authHeaders() }
    );
    return response.ok;
  } catch {
    return false;
  }
}
