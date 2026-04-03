"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { type AvailabilityStatus } from "@/types/mortuary";
import { AVAILABILITY_LABELS } from "@/lib/constants";

interface MortuaryData {
  id: string;
  name: string;
  availability: AvailabilityStatus;
  is_active: boolean;
  view_count: number;
  contact_clicks: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [mortuary, setMortuary] = useState<MortuaryData | null>(null);
  const [availability, setAvailability] = useState<AvailabilityStatus>("available");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasListing, setHasListing] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");
        return;
      }

      const { data, error } = await supabase
        .from("mortuaries")
        .select("id, name, availability, is_active, view_count, contact_clicks")
        .eq("owner_id", user.id)
        .single();

      if (error || !data) {
        setHasListing(false);
        setLoading(false);
        router.push("/admin/onboarding");
        return;
      }

      setMortuary(data);
      setAvailability(data.availability);
      setLoading(false);
    };

    loadDashboard();
  }, [router]);

  const handleUpdateAvailability = async () => {
    if (!mortuary) return;
    setSaving(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("mortuaries")
      .update({ availability })
      .eq("id", mortuary.id);

    setSaving(false);

    if (error) {
      toast.error("Couldn't update status. Please try again.");
      return;
    }

    setMortuary({ ...mortuary, availability });
    toast.success("Availability updated!");
  };

  const handleToggleListing = async () => {
    if (!mortuary) return;
    const newStatus = !mortuary.is_active;

    const supabase = createClient();
    const { error } = await supabase
      .from("mortuaries")
      .update({ is_active: newStatus })
      .eq("id", mortuary.id);

    if (error) {
      toast.error("Couldn't update listing status.");
      return;
    }

    setMortuary({ ...mortuary, is_active: newStatus });
    toast.success(newStatus ? "Listing is now visible" : "Listing is paused");
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </main>
    );
  }

  if (!hasListing || !mortuary) {
    return null;
  }

  return (
    <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <p className="text-gray-600 mb-4">{mortuary.name}</p>

      {!mortuary.is_active && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg p-3 mb-4">
          Your listing is paused and not visible to the public.
        </div>
      )}

      {/* Availability Update */}
      <section className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="font-semibold text-gray-900 mb-3">Availability</h2>

        <RadioGroup
          value={availability}
          onValueChange={(v) => setAvailability(v as AvailabilityStatus)}
          className="space-y-3"
        >
          {(
            Object.entries(AVAILABILITY_LABELS) as [AvailabilityStatus, string][]
          ).map(([value, label]) => (
            <div key={value} className="flex items-center space-x-3">
              <RadioGroupItem value={value} id={`avail-${value}`} />
              <Label htmlFor={`avail-${value}`} className="cursor-pointer">
                {label}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <Button
          onClick={handleUpdateAvailability}
          className="w-full mt-4"
          disabled={saving || availability === mortuary.availability}
        >
          {saving ? "Saving..." : "Update"}
        </Button>
      </section>

      <Separator className="my-6" />

      {/* Stats */}
      <section>
        <h2 className="font-semibold text-gray-900 mb-3">This Month</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {mortuary.view_count}
            </p>
            <p className="text-sm text-gray-500">Views</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {mortuary.contact_clicks}
            </p>
            <p className="text-sm text-gray-500">Contacts</p>
          </div>
        </div>
      </section>

      <Separator className="my-6" />

      {/* Actions */}
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push("/admin/onboarding")}
        >
          Edit Listing Details &rarr;
        </Button>
        <Button
          variant={mortuary.is_active ? "destructive" : "default"}
          className="w-full"
          onClick={handleToggleListing}
        >
          {mortuary.is_active ? "Pause Listing" : "Unpause Listing"}
        </Button>
      </div>
    </main>
  );
}
