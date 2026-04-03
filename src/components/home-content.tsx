"use client";

import Link from "next/link";
import {
  MapPin,
  ArrowRight,
  Phone,
  Clock,
  Shield,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface CityAvailability {
  name: string;
  slug: string;
  total: number;
  available: number;
  limited: number;
  full: number;
}

interface HomeContentProps {
  cityStats: CityAvailability[];
  totalAvailable: number;
  totalMortuaries: number;
}

export function HomeContent({
  cityStats,
  totalAvailable,
  totalMortuaries,
}: HomeContentProps) {
  const { t } = useLanguage();

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1B4965] via-[#1B4965] to-[#5FA8D3] text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        <div className="relative max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
            {t("hero.title")}
            <br />
            <span className="text-[#BEE3F8]">{t("hero.titleHighlight")}</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            {t("hero.subtitle")}
          </p>

          {/* Live Stats */}
          <div className="mt-10 flex justify-center gap-8 sm:gap-12 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-200" />
              <span className="text-blue-100">
                {cityStats.length} {t("hero.cities")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-300" />
              <span className="text-blue-100">
                {totalAvailable} {t("hero.availableNow")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-blue-200" />
              <span className="text-blue-100">
                {totalMortuaries} {t("hero.mortuaries")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* City Grid */}
      <section className="max-w-4xl mx-auto px-4 -mt-8 relative z-10 pb-16">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            {t("cityGrid.title")}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {t("cityGrid.subtitle")}
          </p>

          <nav aria-label={t("cityGrid.title")}>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cityStats.map((city) => {
                const hasAvailable = city.available > 0;
                const hasLimited = city.limited > 0;
                const allFull =
                  city.total > 0 && city.available === 0 && city.limited === 0;
                const noMortuaries = city.total === 0;

                return (
                  <li key={city.slug}>
                    <Link
                      href={`/mortuaries/${city.slug}`}
                      className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3.5 text-sm font-medium text-gray-900 shadow-sm transition-all duration-200 hover:border-[#5FA8D3] hover:bg-blue-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#1B4965] focus:ring-offset-2"
                    >
                      <span className="flex items-center gap-2.5">
                        <MapPin className="h-4 w-4 text-gray-400 group-hover:text-[#1B4965] transition-colors" />
                        <span>
                          <span className="block">{city.name}</span>
                          {city.total > 0 ? (
                            <span className="flex items-center gap-2 mt-0.5">
                              {hasAvailable && (
                                <span className="flex items-center gap-1 text-xs text-green-600">
                                  <CheckCircle className="h-3 w-3" />
                                  {city.available} {t("cityGrid.available")}
                                </span>
                              )}
                              {hasLimited && (
                                <span className="flex items-center gap-1 text-xs text-amber-600">
                                  <AlertCircle className="h-3 w-3" />
                                  {city.limited} {t("cityGrid.limited")}
                                </span>
                              )}
                              {allFull && (
                                <span className="flex items-center gap-1 text-xs text-red-600">
                                  <XCircle className="h-3 w-3" />
                                  {t("cityGrid.allFull")}
                                </span>
                              )}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">
                              {t("cityGrid.noMortuaries")}
                            </span>
                          )}
                        </span>
                      </span>
                      <div className="flex items-center gap-2">
                        {city.total > 0 && (
                          <span className="text-xs text-gray-400">
                            {city.total}
                          </span>
                        )}
                        <ArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-[#1B4965] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center px-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 mb-4">
              <Clock className="h-6 w-6 text-[#1B4965]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {t("feature.availability")}
            </h3>
            <p className="text-sm text-gray-500">
              {t("feature.availabilityDesc")}
            </p>
          </div>
          <div className="text-center px-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 mb-4">
              <Phone className="h-6 w-6 text-green-700" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {t("feature.contact")}
            </h3>
            <p className="text-sm text-gray-500">
              {t("feature.contactDesc")}
            </p>
          </div>
          <div className="text-center px-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 mb-4">
              <Shield className="h-6 w-6 text-purple-700" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {t("feature.verified")}
            </h3>
            <p className="text-sm text-gray-500">
              {t("feature.verifiedDesc")}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
