"use client";

import { Phone, MessageCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

interface ContactButtonsProps {
  mortuaryName: string;
  mortuarySlug: string;
  phone: string;
  whatsapp: string | null;
  address: string;
}

async function trackContact(slug: string) {
  try {
    await fetch(`/api/v1/mortuaries/${slug}/track-contact`, {
      method: "POST",
    });
  } catch {
    // Non-blocking
  }
}

export function ContactButtons({
  mortuaryName,
  mortuarySlug,
  phone,
  whatsapp,
  address,
}: ContactButtonsProps) {
  const { t } = useLanguage();

  const handleCall = () => {
    trackContact(mortuarySlug);
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = () => {
    trackContact(mortuarySlug);
    const cleanNumber = (whatsapp || phone).replace(/[^0-9+]/g, "");
    window.open(`https://wa.me/${cleanNumber.replace("+", "")}`, "_blank");
  };

  const handleDirections = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
      "_blank"
    );
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <Button
        onClick={handleCall}
        className="w-full h-12 text-base bg-[#1B4965] hover:bg-[#143A50] cursor-pointer transition-all duration-200 hover:shadow-md"
        aria-label={`${t("contact.call")} ${mortuaryName} - ${phone}`}
      >
        <Phone className="h-4 w-4 mr-2" />
        {t("contact.call")} {mortuaryName}
      </Button>

      {whatsapp && (
        <Button
          onClick={handleWhatsApp}
          className="w-full h-12 text-base bg-[#25D366] hover:bg-[#1DA851] text-white cursor-pointer transition-all duration-200 hover:shadow-md"
          aria-label={`${t("contact.whatsapp")} ${mortuaryName} - ${whatsapp}`}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          {t("contact.whatsapp")} {mortuaryName}
        </Button>
      )}

      <Button
        onClick={handleDirections}
        variant="outline"
        className="w-full h-12 text-base cursor-pointer transition-all duration-200 hover:shadow-md"
        aria-label={`${t("contact.directions")} - ${mortuaryName}`}
      >
        <MapPin className="h-4 w-4 mr-2" />
        {t("contact.directions")}
      </Button>
    </div>
  );
}
