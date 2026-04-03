export const WESTERN_CAPE_CITIES = [
  { name: "Beaufort West", slug: "beaufort-west" },
  { name: "Cape Town", slug: "cape-town" },
  { name: "George", slug: "george" },
  { name: "Hermanus", slug: "hermanus" },
  { name: "Knysna", slug: "knysna" },
  { name: "Malmesbury", slug: "malmesbury" },
  { name: "Mossel Bay", slug: "mossel-bay" },
  { name: "Paarl", slug: "paarl" },
  { name: "Stellenbosch", slug: "stellenbosch" },
  { name: "Worcester", slug: "worcester" },
] as const;

export const SERVICE_TYPES = [
  "Cold Storage",
  "Embalming",
  "Viewing Room",
  "Chapel",
  "Cremation",
  "Body Collection",
  "Refrigeration",
] as const;

export const AVAILABILITY_LABELS = {
  available: "Available",
  limited: "Limited Space",
  full: "Full",
} as const;

export const PRICE_RANGE_LABELS = {
  budget: "Budget",
  "mid-range": "Mid-range",
  premium: "Premium",
} as const;
