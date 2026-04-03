"use client";

import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type AvailabilityStatus } from "@/types/mortuary";
import { useLanguage, type TranslationKey } from "@/lib/i18n";

const statusStyles: Record<AvailabilityStatus, string> = {
  available: "bg-green-50 text-green-700 border-green-200",
  limited: "bg-amber-50 text-amber-700 border-amber-200",
  full: "bg-red-50 text-red-700 border-red-200",
};

const statusTranslationKeys: Record<AvailabilityStatus, TranslationKey> = {
  available: "availability.available",
  limited: "availability.limited",
  full: "availability.full",
};

const StatusIcon = ({ status }: { status: AvailabilityStatus }) => {
  const iconClass = "h-3 w-3 mr-1";
  switch (status) {
    case "available":
      return <CheckCircle className={iconClass} />;
    case "limited":
      return <AlertCircle className={iconClass} />;
    case "full":
      return <XCircle className={iconClass} />;
  }
};

export function AvailabilityBadge({
  status,
}: {
  status: AvailabilityStatus;
}) {
  const { t } = useLanguage();
  const label = t(statusTranslationKeys[status]);

  return (
    <Badge
      variant="outline"
      className={`${statusStyles[status]} font-medium`}
      role="status"
      aria-label={label}
    >
      <StatusIcon status={status} />
      {label}
    </Badge>
  );
}
