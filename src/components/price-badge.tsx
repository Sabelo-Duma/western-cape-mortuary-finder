"use client";

import { Badge } from "@/components/ui/badge";
import { type PriceRange } from "@/types/mortuary";
import { useLanguage, type TranslationKey } from "@/lib/i18n";

const priceTranslationKeys: Record<PriceRange, TranslationKey> = {
  budget: "price.budget",
  "mid-range": "price.midRange",
  premium: "price.premium",
};

export function PriceBadge({ priceRange }: { priceRange: PriceRange | null }) {
  const { t } = useLanguage();
  if (!priceRange) return null;

  const label = t(priceTranslationKeys[priceRange]);

  return (
    <Badge
      variant="outline"
      className="text-gray-600 border-gray-200 font-normal"
      aria-label={label}
    >
      {label}
    </Badge>
  );
}
