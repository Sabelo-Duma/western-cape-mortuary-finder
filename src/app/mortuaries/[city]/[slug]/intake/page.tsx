import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { IntakeWizard } from "@/components/intake/intake-wizard";

interface IntakePageProps {
  params: Promise<{ city: string; slug: string }>;
}

export default async function IntakePage({ params }: IntakePageProps) {
  const { city, slug } = await params;
  const supabase = await createClient();

  const { data: mortuary } = await supabase
    .from("mortuaries")
    .select("id, name, slug, city_id, cities(name, slug)")
    .eq("slug", slug)
    .eq("is_active", true)
    .eq("is_approved", true)
    .single();

  if (!mortuary) notFound();

  return (
    <main className="flex-1 bg-[#FAFBFC]">
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <Link
          href={`/mortuaries/${city}/${slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to {mortuary.name}
        </Link>
      </div>

      <IntakeWizard
        mortuaryId={mortuary.id}
        mortuaryName={mortuary.name}
        mortuarySlug={mortuary.slug}
        citySlug={city}
      />
    </main>
  );
}
