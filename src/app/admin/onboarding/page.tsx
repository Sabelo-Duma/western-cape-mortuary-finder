"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { WESTERN_CAPE_CITIES, SERVICE_TYPES } from "@/lib/constants";

interface FormData {
  name: string;
  address: string;
  city_slug: string;
  phone: string;
  whatsapp: string;
  email: string;
  description: string;
  services: string[];
  price_range: string;
}

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface HoursData {
  open_time: string;
  close_time: string;
  is_closed: boolean;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [mortuaryId, setMortuaryId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cities, setCities] = useState<Array<{ id: string; name: string; slug: string }>>([]);

  const [form, setForm] = useState<FormData>({
    name: "",
    address: "",
    city_slug: "",
    phone: "",
    whatsapp: "",
    email: "",
    description: "",
    services: [],
    price_range: "",
  });

  const [hours, setHours] = useState<HoursData[]>(
    DAYS.map((_, i) => ({
      open_time: i === 0 ? "" : "08:00",
      close_time: i === 0 ? "" : "17:00",
      is_closed: i === 0,
    }))
  );

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");
        return;
      }

      // Load cities
      const { data: cityData } = await supabase
        .from("cities")
        .select("id, name, slug")
        .order("name");

      setCities(cityData || []);

      // Check if editing existing listing
      const { data: existing } = await supabase
        .from("mortuaries")
        .select(
          `*, mortuary_services (service_name),
          mortuary_hours (day_of_week, open_time, close_time, is_closed)`
        )
        .eq("owner_id", user.id)
        .single();

      if (existing) {
        setIsEdit(true);
        setMortuaryId(existing.id);

        const cityMatch = cityData?.find(
          (c: { id: string }) => c.id === existing.city_id
        );

        setForm({
          name: existing.name || "",
          address: existing.address || "",
          city_slug: cityMatch?.slug || "",
          phone: existing.phone || "",
          whatsapp: existing.whatsapp || "",
          email: existing.email || "",
          description: existing.description || "",
          services: (
            existing.mortuary_services as Array<{ service_name: string }>
          ).map((s) => s.service_name),
          price_range: existing.price_range || "",
        });

        // Map existing hours
        const existingHours = [...hours];
        (
          existing.mortuary_hours as Array<{
            day_of_week: number;
            open_time: string;
            close_time: string;
            is_closed: boolean;
          }>
        ).forEach((h) => {
          existingHours[h.day_of_week] = {
            open_time: h.open_time,
            close_time: h.close_time,
            is_closed: h.is_closed,
          };
        });
        setHours(existingHours);
      }

      setLoading(false);
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const toggleService = (service: string) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const updateHours = (
    dayIndex: number,
    field: keyof HoursData,
    value: string | boolean
  ) => {
    setHours((prev) => {
      const updated = [...prev];
      updated[dayIndex] = { ...updated[dayIndex], [field]: value };
      return updated;
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Mortuary name is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city_slug) newErrors.city_slug = "Please select a city";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^(\+27|0)\d{9}$/.test(form.phone.replace(/\s/g, "")))
      newErrors.phone = "Please enter a valid South African phone number";
    if (form.services.length === 0)
      newErrors.services = "Select at least one service";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/admin/login");
      return;
    }

    const city = cities.find((c) => c.slug === form.city_slug);
    if (!city) {
      setSaving(false);
      return;
    }

    const slug = form.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const mortuaryData = {
      owner_id: user.id,
      name: form.name,
      slug,
      address: form.address,
      city_id: city.id,
      phone: form.phone.replace(/\s/g, ""),
      whatsapp: form.whatsapp.replace(/\s/g, "") || null,
      email: form.email || null,
      description: form.description || null,
      price_range: form.price_range || null,
    };

    if (isEdit && mortuaryId) {
      // Update existing
      const { error } = await supabase
        .from("mortuaries")
        .update(mortuaryData)
        .eq("id", mortuaryId);

      if (error) {
        toast.error("Failed to update listing. Please try again.");
        setSaving(false);
        return;
      }

      // Replace services
      await supabase
        .from("mortuary_services")
        .delete()
        .eq("mortuary_id", mortuaryId);
      await supabase.from("mortuary_services").insert(
        form.services.map((s) => ({
          mortuary_id: mortuaryId,
          service_name: s,
        }))
      );

      // Replace hours
      await supabase
        .from("mortuary_hours")
        .delete()
        .eq("mortuary_id", mortuaryId);
      await supabase.from("mortuary_hours").insert(
        hours.map((h, i) => ({
          mortuary_id: mortuaryId,
          day_of_week: i,
          open_time: h.is_closed ? "00:00" : h.open_time,
          close_time: h.is_closed ? "00:00" : h.close_time,
          is_closed: h.is_closed,
        }))
      );

      toast.success("Listing updated!");
    } else {
      // Insert new
      const { data: newMortuary, error } = await supabase
        .from("mortuaries")
        .insert(mortuaryData)
        .select("id")
        .single();

      if (error || !newMortuary) {
        toast.error("Failed to create listing. Please try again.");
        setSaving(false);
        return;
      }

      // Insert services
      await supabase.from("mortuary_services").insert(
        form.services.map((s) => ({
          mortuary_id: newMortuary.id,
          service_name: s,
        }))
      );

      // Insert hours
      await supabase.from("mortuary_hours").insert(
        hours.map((h, i) => ({
          mortuary_id: newMortuary.id,
          day_of_week: i,
          open_time: h.is_closed ? "00:00" : h.open_time,
          close_time: h.is_closed ? "00:00" : h.close_time,
          is_closed: h.is_closed,
        }))
      );

      toast.success(
        "Listing created! It will be visible once approved."
      );
    }

    setSaving(false);
    router.push("/admin/dashboard");
  };

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? "Edit Listing Details" : "Set Up Your Mortuary Listing"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Mortuary Name *</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Sunrise Mortuary"
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address">Physical Address *</Label>
          <Input
            id="address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="e.g. 45 Main Road, Observatory, Cape Town"
          />
          {errors.address && (
            <p className="text-sm text-red-600">{errors.address}</p>
          )}
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label>City *</Label>
          <Select
            value={form.city_slug}
            onValueChange={(v) => v && setForm({ ...form, city_slug: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent>
              {(cities.length > 0 ? cities : WESTERN_CAPE_CITIES).map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.city_slug && (
            <p className="text-sm text-red-600">{errors.city_slug}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+27211234567 or 0211234567"
          />
          {errors.phone && (
            <p className="text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        {/* WhatsApp */}
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp Number (optional)</Label>
          <Input
            id="whatsapp"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            placeholder="Same as phone or different"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email-contact">Contact Email (optional)</Label>
          <Input
            id="email-contact"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="contact@yourmortuary.co.za"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell families about your mortuary..."
            maxLength={1000}
          />
        </div>

        {/* Services */}
        <div className="space-y-2">
          <Label>Services Offered *</Label>
          <div className="grid grid-cols-2 gap-2">
            {SERVICE_TYPES.map((service) => (
              <label
                key={service}
                className={`flex items-center gap-2 rounded-lg border p-3 cursor-pointer text-sm ${
                  form.services.includes(service)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.services.includes(service)}
                  onChange={() => toggleService(service)}
                  className="rounded"
                />
                {service}
              </label>
            ))}
          </div>
          {errors.services && (
            <p className="text-sm text-red-600">{errors.services}</p>
          )}
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label>Price Range (optional)</Label>
          <Select
            value={form.price_range}
            onValueChange={(v) => v && setForm({ ...form, price_range: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select price range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="budget">Budget</SelectItem>
              <SelectItem value="mid-range">Mid-range</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Operating Hours */}
        <div className="space-y-3">
          <Label>Operating Hours</Label>
          {DAYS.map((day, index) => (
            <div
              key={day}
              className="flex items-center gap-3 text-sm"
            >
              <span className="w-24 font-medium">{day}</span>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={hours[index].is_closed}
                  onChange={(e) =>
                    updateHours(index, "is_closed", e.target.checked)
                  }
                />
                Closed
              </label>
              {!hours[index].is_closed && (
                <>
                  <Input
                    type="time"
                    value={hours[index].open_time}
                    onChange={(e) =>
                      updateHours(index, "open_time", e.target.value)
                    }
                    className="w-28"
                  />
                  <span>to</span>
                  <Input
                    type="time"
                    value={hours[index].close_time}
                    onChange={(e) =>
                      updateHours(index, "close_time", e.target.value)
                    }
                    className="w-28"
                  />
                </>
              )}
            </div>
          ))}
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full h-12 text-base" disabled={saving}>
          {saving
            ? "Saving..."
            : isEdit
              ? "Save Changes"
              : "Create Listing"}
        </Button>
      </form>
    </main>
  );
}
