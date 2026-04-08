import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { WESTERN_CAPE_CITIES } from "@/lib/constants";
import { hasFeature } from "@/lib/tiers";
import { type SubscriptionTier } from "@/types/mortuary";
import { AvailabilityBadge } from "@/components/availability-badge";
import { ContactButtons } from "@/components/contact-buttons";
import { ServiceTags } from "@/components/service-tags";
import { ShareButton } from "@/components/share-button";
import {
  OperatingHoursStatus,
  OperatingHoursFull,
} from "@/components/operating-hours";
import { PriceBadge } from "@/components/price-badge";
import { ViewTracker } from "@/components/view-tracker";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowLeft, Mail, FileText, ShieldCheck, Phone } from "lucide-react";
import { ReviewList } from "@/components/reviews/review-list";
import { ReviewForm } from "@/components/reviews/review-form";

interface PageProps {
  params: Promise<{ city: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug, slug } = await params;
  const city = WESTERN_CAPE_CITIES.find((c) => c.slug === citySlug);
  const cityName = city?.name || citySlug;

  const supabase = await createClient();
  const { data: mortuary } = await supabase
    .from("mortuaries")
    .select("name")
    .eq("slug", slug)
    .single();

  const name = mortuary?.name || "Mortuary";

  return {
    title: `${name} - ${cityName} | Western Cape Mortuary Finder`,
    description: `View details, availability, services, and contact information for ${name} in ${cityName}, Western Cape.`,
  };
}

export default async function MortuaryDetailPage({ params }: PageProps) {
  const { city: citySlug, slug } = await params;

  const cityInfo = WESTERN_CAPE_CITIES.find((c) => c.slug === citySlug);
  if (!cityInfo) {
    notFound();
  }

  const supabase = await createClient();

  const { data: mortuary } = await supabase
    .from("mortuaries")
    .select(
      `
      id, name, slug, description, address, phone, whatsapp, email,
      availability, price_range, subscription_tier, verified_partner,
      mortuary_services (id, service_name),
      mortuary_hours (id, day_of_week, open_time, close_time, is_closed)
    `
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .eq("is_approved", true)
    .single();

  if (!mortuary) {
    notFound();
  }

  const tier = (mortuary.subscription_tier || "free") as SubscriptionTier;

  // Fetch approved reviews (only if tier supports it)
  let reviews: Array<{
    id: string;
    reviewer_name: string;
    rating: number;
    comment: string | null;
    created_at: string;
  }> = [];

  if (hasFeature(tier, "reviews")) {
    const { data } = await supabase
      .from("reviews")
      .select("id, reviewer_name, rating, comment, created_at")
      .eq("mortuary_id", mortuary.id)
      .eq("is_approved", true)
      .order("created_at", { ascending: false });
    reviews = data || [];
  }

  const services = (mortuary.mortuary_services as Array<{ id: string; service_name: string }>) || [];
  const hours = (mortuary.mortuary_hours as Array<{
    id: string;
    day_of_week: number;
    open_time: string;
    close_time: string;
    is_closed: boolean;
  }>) || [];

  return (
    <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
      {/* Back link */}
      <Link
        href={`/mortuaries/${citySlug}`}
        className="inline-flex items-center gap-1 text-sm text-[#1B4965] hover:text-[#143A50] focus:outline-none focus:ring-2 focus:ring-[#1B4965] rounded transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to {cityInfo.name}
      </Link>

      {/* View Tracker */}
      <ViewTracker slug={slug} />

      {/* Header */}
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">{mortuary.name}</h1>
            {mortuary.verified_partner && (
              <Badge className="bg-green-100 text-green-700 border-green-300 text-xs gap-1">
                <ShieldCheck className="h-3 w-3" />
                Verified Partner
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            {hasFeature(tier, "availability") ? (
              <AvailabilityBadge status={mortuary.availability} />
            ) : (
              <Badge variant="outline" className="text-gray-500 border-gray-300 text-xs">
                <Phone className="h-3 w-3 mr-1" />
                Contact to check availability
              </Badge>
            )}
            {hasFeature(tier, "price_range") && (
              <PriceBadge priceRange={mortuary.price_range} />
            )}
          </div>
        </div>
        <ShareButton
          title={mortuary.name}
          text={`${mortuary.name} - Mortuary in ${cityInfo.name}`}
        />
      </div>

      <Separator className="my-4" />

      {/* Address & Hours */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
          {mortuary.address}
        </p>
        {hasFeature(tier, "services_hours") && (
          <OperatingHoursStatus hours={hours} />
        )}
      </div>

      <Separator className="my-4" />

      {/* Contact Buttons */}
      <ContactButtons
        mortuaryName={mortuary.name}
        mortuarySlug={mortuary.slug}
        phone={mortuary.phone}
        whatsapp={hasFeature(tier, "whatsapp") ? mortuary.whatsapp : null}
        address={mortuary.address}
      />

      {/* Intake Form CTA — only for standard+ */}
      {hasFeature(tier, "intake_forms") && (
        <Link
          href={`/mortuaries/${citySlug}/${slug}/intake`}
          className="mt-3 flex items-center justify-center gap-2 w-full h-12 text-base font-medium rounded-md border-2 border-dashed border-[#1B4965] text-[#1B4965] bg-blue-50/50 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1B4965] focus:ring-offset-2"
        >
          <FileText className="h-4 w-4" />
          Start Digital Intake Form
        </Link>
      )}

      <Separator className="my-4" />

      {/* Services — only for standard+ */}
      {hasFeature(tier, "services_hours") && services.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Services
          </h2>
          <ServiceTags services={services} />
        </section>
      )}

      {hasFeature(tier, "services_hours") && (
        <>
          <Separator className="my-4" />
          <section>
            <OperatingHoursFull hours={hours} />
          </section>
        </>
      )}

      {/* Description */}
      {mortuary.description && (
        <>
          <Separator className="my-4" />
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">About</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {mortuary.description}
            </p>
          </section>
        </>
      )}

      {/* Email */}
      {mortuary.email && (
        <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-400" />
          <a href={`mailto:${mortuary.email}`} className="text-[#1B4965] hover:underline">
            {mortuary.email}
          </a>
        </div>
      )}

      <Separator className="my-4" />

      {/* Reviews — only for standard+ */}
      {hasFeature(tier, "reviews") ? (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Reviews</h2>
          <ReviewList reviews={reviews} />
          <div className="mt-4">
            <ReviewForm mortuaryId={mortuary.id} mortuaryName={mortuary.name} />
          </div>
        </section>
      ) : (
        <section className="text-center py-6">
          <p className="text-sm text-gray-400">
            Reviews are available on Standard and Premium plans.
          </p>
        </section>
      )}
    </main>
  );
}
