import { type SubscriptionTier } from "@/types/mortuary";

export const TIER_FEATURES: Record<SubscriptionTier, Set<string>> = {
  free: new Set([
    "listed",
    "name_address_phone",
    "availability",
  ]),
  standard: new Set([
    "listed",
    "name_address_phone",
    "availability",
    "services_hours",
    "whatsapp",
    "intake_forms",
    "price_range",
    "analytics",
    "map_pin",
  ]),
  premium: new Set([
    "listed",
    "name_address_phone",
    "availability",
    "services_hours",
    "whatsapp",
    "intake_forms",
    "price_range",
    "analytics",
    "map_pin",
    "reviews",
    "email_notifications",
    "verified_badge",
    "priority_placement",
    "featured_homepage",
  ]),
};

export function hasFeature(tier: SubscriptionTier, feature: string): boolean {
  return TIER_FEATURES[tier]?.has(feature) ?? false;
}

export const TIER_LABELS: Record<SubscriptionTier, string> = {
  free: "Free",
  standard: "Standard",
  premium: "Premium",
};
