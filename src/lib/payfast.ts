import crypto from "crypto";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID ?? "";
const MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY ?? "";
const PASSPHRASE = process.env.PAYFAST_PASSPHRASE ?? "";
const IS_SANDBOX = process.env.PAYFAST_SANDBOX === "true";

const PAYFAST_HOST = IS_SANDBOX
  ? "sandbox.payfast.co.za"
  : "www.payfast.co.za";

export const PAYFAST_PROCESS_URL = `https://${PAYFAST_HOST}/eng/process`;
export const PAYFAST_VALIDATE_URL = `https://${PAYFAST_HOST}/eng/query/validate`;
export const PAYFAST_API_BASE = IS_SANDBOX
  ? "https://api.payfast.co.za"
  : "https://api.payfast.co.za";

// PayFast known IP ranges (for ITN source verification)
const PAYFAST_IPS = [
  "197.97.145.144/28", // 197.97.145.144 – 197.97.145.159
  "41.74.179.192/27",  // 41.74.179.192 – 41.74.179.223
];

// ---------------------------------------------------------------------------
// Tier pricing (cents)
// ---------------------------------------------------------------------------
export const TIER_PRICING: Record<string, { amountCents: number; name: string }> = {
  standard: { amountCents: 29900, name: "Standard Plan – R299/mo" },
  premium: { amountCents: 59900, name: "Premium Plan – R599/mo" },
};

// ---------------------------------------------------------------------------
// Signature generation
// ---------------------------------------------------------------------------
export function generateSignature(
  data: Array<[string, string]>,
  passphrase?: string
): string {
  // PayFast requires fields in the EXACT order submitted (not alphabetical)
  const params = data
    .filter(([, v]) => v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v.trim()).replace(/%20/g, "+")}`)
    .join("&");

  const withPassphrase = passphrase ? `${params}&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, "+")}` : params;
  return crypto.createHash("md5").update(withPassphrase).digest("hex");
}

// ---------------------------------------------------------------------------
// Build checkout form data for subscription
// ---------------------------------------------------------------------------
interface CheckoutParams {
  mortuaryId: string;
  mortuaryName: string;
  ownerEmail: string;
  tier: "standard" | "premium";
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
}

export function buildCheckoutData(params: CheckoutParams): {
  url: string;
  fields: Record<string, string>;
} {
  const pricing = TIER_PRICING[params.tier];
  if (!pricing) throw new Error(`Unknown tier: ${params.tier}`);

  const amountRands = (pricing.amountCents / 100).toFixed(2);

  // PayFast fields in required order
  const data: Array<[string, string]> = [
    ["merchant_id", MERCHANT_ID],
    ["merchant_key", MERCHANT_KEY],
    ["return_url", params.returnUrl],
    ["cancel_url", params.cancelUrl],
    ["notify_url", params.notifyUrl],
    ["email_address", params.ownerEmail],
    ["amount", amountRands],
    ["item_name", pricing.name],
    ["item_description", `${params.tier} subscription for ${params.mortuaryName}`],
    ["subscription_type", "1"],
    ["billing_date", getBillingDate()],
    ["recurring_amount", amountRands],
    ["frequency", "3"], // monthly
    ["cycles", "0"], // indefinite
    ["custom_str1", params.mortuaryId],
    ["custom_str2", params.tier],
  ];

  const signature = generateSignature(data, PASSPHRASE);
  data.push(["signature", signature]);

  const fields: Record<string, string> = {};
  for (const [k, v] of data) {
    fields[k] = v;
  }

  return { url: PAYFAST_PROCESS_URL, fields };
}

// Billing date: 1st of next month, or today's day if before the 28th
function getBillingDate(): string {
  const now = new Date();
  const day = now.getDate();
  if (day <= 28) {
    return String(day);
  }
  return "1";
}

// ---------------------------------------------------------------------------
// ITN validation
// ---------------------------------------------------------------------------
export async function validateItn(
  params: Record<string, string>,
  sourceIp: string
): Promise<{ valid: boolean; reason?: string }> {
  // 1. Verify source IP
  if (!IS_SANDBOX && !isPayFastIp(sourceIp)) {
    return { valid: false, reason: `Invalid source IP: ${sourceIp}` };
  }

  // 2. Verify signature
  const receivedSig = params.signature;
  const dataEntries: Array<[string, string]> = Object.entries(params).filter(
    ([k]) => k !== "signature"
  );
  const expectedSig = generateSignature(dataEntries, PASSPHRASE);
  if (receivedSig !== expectedSig) {
    return { valid: false, reason: "Signature mismatch" };
  }

  // 3. Verify with PayFast server (POST-back validation)
  const postData = dataEntries
    .map(([k, v]) => `${k}=${encodeURIComponent(v.trim()).replace(/%20/g, "+")}`)
    .join("&");

  try {
    const response = await fetch(PAYFAST_VALIDATE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: postData,
    });
    const body = await response.text();
    if (body !== "VALID") {
      return { valid: false, reason: `PayFast validation returned: ${body}` };
    }
  } catch (err) {
    return { valid: false, reason: `PayFast validation fetch failed: ${err}` };
  }

  return { valid: true };
}

// ---------------------------------------------------------------------------
// Cancel subscription via PayFast API
// ---------------------------------------------------------------------------
export async function cancelSubscription(token: string): Promise<boolean> {
  const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, "+02:00");

  // Generate API signature
  const sigData: Array<[string, string]> = [
    ["merchant-id", MERCHANT_ID],
    ["passphrase", PASSPHRASE],
    ["timestamp", timestamp],
    ["version", "v1"],
  ];
  const signature = generateSignature(sigData);

  const response = await fetch(
    `${PAYFAST_API_BASE}/subscriptions/${token}/cancel`,
    {
      method: "PUT",
      headers: {
        "merchant-id": MERCHANT_ID,
        version: "v1",
        timestamp,
        signature,
      },
    }
  );

  return response.ok;
}

// ---------------------------------------------------------------------------
// IP range check
// ---------------------------------------------------------------------------
function isPayFastIp(ip: string): boolean {
  for (const cidr of PAYFAST_IPS) {
    if (ipInCidr(ip, cidr)) return true;
  }
  return false;
}

function ipInCidr(ip: string, cidr: string): boolean {
  const [range, bits] = cidr.split("/");
  const mask = ~(2 ** (32 - parseInt(bits)) - 1);
  const ipNum = ipToNum(ip);
  const rangeNum = ipToNum(range);
  return (ipNum & mask) === (rangeNum & mask);
}

function ipToNum(ip: string): number {
  return ip
    .split(".")
    .reduce((sum, octet) => (sum << 8) + parseInt(octet), 0);
}
