import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { WESTERN_CAPE_CITIES } from "@/lib/constants";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wc-mortuary-finder.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  // City pages
  for (const city of WESTERN_CAPE_CITIES) {
    entries.push({
      url: `${BASE_URL}/mortuaries/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    });
  }

  // Mortuary detail pages
  try {
    const supabase = await createClient();
    const { data: mortuaries } = await supabase
      .from("mortuaries")
      .select("slug, updated_at, cities(slug)")
      .eq("is_active", true)
      .eq("is_approved", true);

    if (mortuaries) {
      for (const m of mortuaries) {
        const cities = m.cities as unknown as { slug: string } | null;
        const citySlug = cities?.slug;
        if (citySlug) {
          entries.push({
            url: `${BASE_URL}/mortuaries/${citySlug}/${m.slug}`,
            lastModified: new Date(m.updated_at),
            changeFrequency: "daily",
            priority: 0.6,
          });
        }
      }
    }
  } catch {
    // If DB unavailable, return static entries only
  }

  return entries;
}
