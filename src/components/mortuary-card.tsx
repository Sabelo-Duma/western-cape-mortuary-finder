import Link from "next/link";
import { MapPin, Phone, ChevronRight } from "lucide-react";
import { AvailabilityBadge } from "@/components/availability-badge";
import { PriceBadge } from "@/components/price-badge";
import { ServiceTags } from "@/components/service-tags";
import { type AvailabilityStatus, type PriceRange } from "@/types/mortuary";

interface MortuaryCardData {
  name: string;
  slug: string;
  address: string;
  phone: string;
  availability: AvailabilityStatus;
  price_range: PriceRange | null;
  mortuary_services: Array<{ id: string; service_name: string }>;
}

interface MortuaryCardProps {
  mortuary: MortuaryCardData;
  citySlug: string;
}

export function MortuaryCard({ mortuary, citySlug }: MortuaryCardProps) {
  return (
    <Link
      href={`/mortuaries/${citySlug}/${mortuary.slug}`}
      className="group block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-lg hover:border-[#5FA8D3]/50 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#1B4965] focus:ring-offset-2"
      aria-label={`${mortuary.name}, ${mortuary.availability === "available" ? "Available" : mortuary.availability === "limited" ? "Limited Space" : "Full"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900 truncate group-hover:text-[#1B4965] transition-colors">
              {mortuary.name}
            </h2>
            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[#1B4965] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </div>
          <p className="text-sm text-gray-500 mt-1.5 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
            {mortuary.address}
          </p>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
            {mortuary.phone}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <AvailabilityBadge status={mortuary.availability} />
          <PriceBadge priceRange={mortuary.price_range} />
        </div>
      </div>

      {mortuary.mortuary_services.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <ServiceTags services={mortuary.mortuary_services} />
        </div>
      )}
    </Link>
  );
}
