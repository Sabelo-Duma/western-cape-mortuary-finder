import { createClient } from "@/lib/supabase/server";
import { HomeContent } from "@/components/home-content";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: cities } = await supabase
    .from("cities")
    .select("id, name, slug")
    .order("name");

  const { data: mortuaries } = await supabase
    .from("mortuaries")
    .select("city_id, availability")
    .eq("is_active", true)
    .eq("is_approved", true);

  const cityStats = (cities || []).map((city) => {
    const cityMortuaries = (mortuaries || []).filter(
      (m) => m.city_id === city.id
    );
    return {
      name: city.name,
      slug: city.slug,
      total: cityMortuaries.length,
      available: cityMortuaries.filter((m) => m.availability === "available")
        .length,
      limited: cityMortuaries.filter((m) => m.availability === "limited")
        .length,
      full: cityMortuaries.filter((m) => m.availability === "full").length,
    };
  });

  const totalAvailable = cityStats.reduce((sum, c) => sum + c.available, 0);
  const totalMortuaries = cityStats.reduce((sum, c) => sum + c.total, 0);

  return (
    <HomeContent
      cityStats={cityStats}
      totalAvailable={totalAvailable}
      totalMortuaries={totalMortuaries}
    />
  );
}
