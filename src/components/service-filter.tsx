"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SERVICE_TYPES } from "@/lib/constants";
import { useLanguage, type TranslationKey } from "@/lib/i18n";

const serviceTranslationKeys: Record<string, TranslationKey> = {
  "Cold Storage": "service.coldStorage",
  Embalming: "service.embalming",
  "Viewing Room": "service.viewingRoom",
  Chapel: "service.chapel",
  Cremation: "service.cremation",
  "Body Collection": "service.bodyCollection",
  Refrigeration: "service.refrigeration",
};

export function ServiceFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const activeServices = searchParams.get("services")?.split(",").filter(Boolean) || [];

  const toggleService = (service: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const slug = service.toLowerCase().replace(/\s+/g, "-");

    let current = params.get("services")?.split(",").filter(Boolean) || [];

    if (current.includes(slug)) {
      current = current.filter((s) => s !== slug);
    } else {
      current.push(slug);
    }

    if (current.length > 0) {
      params.set("services", current.join(","));
    } else {
      params.delete("services");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("services");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const isActive = (service: string) => {
    const slug = service.toLowerCase().replace(/\s+/g, "-");
    return activeServices.includes(slug);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">{t("city.filterByService")}</p>
        {activeServices.length > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            {t("city.clearFilters")}
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {SERVICE_TYPES.map((service) => (
          <button
            key={service}
            onClick={() => toggleService(service)}
            className={`inline-flex items-center rounded-full border px-3 py-1 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isActive(service)
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
            aria-pressed={isActive(service)}
          >
            {t(serviceTranslationKeys[service])}
          </button>
        ))}
      </div>
    </div>
  );
}
