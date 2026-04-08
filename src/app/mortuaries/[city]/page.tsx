import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { WESTERN_CAPE_CITIES } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";
import { MortuaryCard } from "@/components/mortuary-card";
import { ShareButton } from "@/components/share-button";
import { ServiceFilter } from "@/components/service-filter";
import { SortSelect } from "@/components/sort-select";
import { MortuaryMap } from "@/components/mortuary-map";

interface PageProps {
  params: Promise<{ city: string }>;
  searchParams: Promise<{ services?: string; sort?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = WESTERN_CAPE_CITIES.find((c) => c.slug === citySlug);
  const cityName = city?.name || citySlug;

  return {
    title: `Mortuaries in ${cityName} | Western Cape Mortuary Finder`,
    description: `Find mortuaries with available space in ${cityName}, Western Cape. View availability, services, and contact details.`,
  };
}

export default async function CityMortuariesPage({ params, searchParams }: PageProps) {
  const { city: citySlug } = await params;
  const { services: servicesParam, sort: sortParam } = await searchParams;

  // Validate city slug
  const cityInfo = WESTERN_CAPE_CITIES.find((c) => c.slug === citySlug);
  if (!cityInfo) {
    notFound();
  }

  const supabase = await createClient();

  // Get city from database
  const { data: city } = await supabase
    .from("cities")
    .select("id, name, slug")
    .eq("slug", citySlug)
    .single();

  // Get mortuaries
  let mortuaries: Array<Record<string, unknown>> = [];
  if (city) {
    const { data } = await supabase
      .from("mortuaries")
      .select(
        `
        id, name, slug, address, phone, whatsapp, availability,
        price_range, description, latitude, longitude,
        subscription_tier, verified_partner, is_featured,
        mortuary_services (id, service_name),
        mortuary_hours (id, day_of_week, open_time, close_time, is_closed)
      `
      )
      .eq("city_id", city.id)
      .eq("is_active", true)
      .eq("is_approved", true)
      .order("name", { ascending: true });

    mortuaries = data || [];
  }

  // Apply service filter (client-side filtering on server-fetched data)
  const activeFilters = servicesParam?.split(",").filter(Boolean) || [];
  let filteredMortuaries = mortuaries;

  if (activeFilters.length > 0) {
    filteredMortuaries = mortuaries.filter((m) => {
      const services = (m.mortuary_services as Array<{ service_name: string }>) || [];
      return services.some((s) =>
        activeFilters.includes(s.service_name.toLowerCase().replace(/\s+/g, "-"))
      );
    });
  }

  // Apply sorting — premium mortuaries always first (priority placement)
  const tierOrder: Record<string, number> = { premium: 0, standard: 1, free: 2 };
  const availabilityOrder: Record<string, number> = { available: 0, limited: 1, full: 2 };
  const priceOrder: Record<string, number> = { budget: 0, "mid-range": 1, premium: 2 };

  // Always sort by tier first (premium on top), then by user-selected sort
  filteredMortuaries.sort((a, b) => {
    const tierDiff = (tierOrder[a.subscription_tier as string] ?? 2) - (tierOrder[b.subscription_tier as string] ?? 2);
    if (tierDiff !== 0) return tierDiff;

    if (sortParam === "availability") {
      return (availabilityOrder[a.availability as string] ?? 3) - (availabilityOrder[b.availability as string] ?? 3);
    } else if (sortParam === "price-low") {
      return (priceOrder[a.price_range as string] ?? 3) - (priceOrder[b.price_range as string] ?? 3);
    } else if (sortParam === "price-high") {
      return (priceOrder[b.price_range as string] ?? -1) - (priceOrder[a.price_range as string] ?? -1);
    }
    return (a.name as string).localeCompare(b.name as string);
  });

  const isFiltered = activeFilters.length > 0;

  // Find nearby cities for empty state
  const currentIndex = WESTERN_CAPE_CITIES.findIndex(
    (c) => c.slug === citySlug
  );
  const nearbyCities = WESTERN_CAPE_CITIES.filter(
    (_, i) => i !== currentIndex
  ).slice(0, 3);

  return (
    <main className="flex-1 px-4 py-6 max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-[#1B4965] hover:text-[#143A50] focus:outline-none focus:ring-2 focus:ring-[#1B4965] rounded transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All cities
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            Mortuaries in {cityInfo.name}
          </h1>
          <p className="text-sm text-gray-500">
            {filteredMortuaries.length} {filteredMortuaries.length === 1 ? "result" : "results"}
            {isFiltered && ` (filtered from ${mortuaries.length})`}
          </p>
        </div>
        <ShareButton
          title={`Mortuaries in ${cityInfo.name}`}
          text={`Find mortuaries with available space in ${cityInfo.name}`}
        />
      </div>

      {/* Filters & Sort */}
      {mortuaries.length > 0 && (
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <Suspense fallback={null}>
              <ServiceFilter />
            </Suspense>
          </div>
          <div className="flex justify-end">
            <Suspense fallback={null}>
              <SortSelect />
            </Suspense>
          </div>
        </div>
      )}

      {/* Map — only for standard+ tiers */}
      {filteredMortuaries.length > 0 && (
        <MortuaryMap
          mortuaries={filteredMortuaries
            .filter((m) => {
              const tier = (m.subscription_tier as string) || "free";
              return tier === "standard" || tier === "premium";
            })
            .map((m) => ({
              name: m.name as string,
              slug: m.slug as string,
              address: m.address as string,
              availability: m.availability as string,
              latitude: m.latitude as number | null,
              longitude: m.longitude as number | null,
            }))}
          citySlug={citySlug}
          cityName={cityInfo.name}
        />
      )}

      {/* Results */}
      {filteredMortuaries.length > 0 ? (
        <div className="space-y-4" aria-live="polite">
          {filteredMortuaries.map((mortuary: Record<string, unknown>) => (
            <MortuaryCard
              key={mortuary.id as string}
              mortuary={mortuary as never}
              citySlug={citySlug}
            />
          ))}
        </div>
      ) : isFiltered ? (
        <div className="text-center py-16">
          <p className="text-lg text-gray-600">
            No mortuaries match your filters.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Try removing some filters to see more results.
          </p>
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-gray-600">
            No mortuaries registered in {cityInfo.name} yet.
          </p>
          <p className="text-sm text-gray-400 mt-2">Try a nearby city:</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {nearbyCities.map((c) => (
              <Link
                key={c.slug}
                href={`/mortuaries/${c.slug}`}
                className="inline-block rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
