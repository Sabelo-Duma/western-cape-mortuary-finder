"use client";

import { useState } from "react";
import { useLanguage, type TranslationKey } from "@/lib/i18n";

interface HoursEntry {
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_closed: boolean;
}

const DAY_KEYS: TranslationKey[] = [
  "hours.sunday",
  "hours.monday",
  "hours.tuesday",
  "hours.wednesday",
  "hours.thursday",
  "hours.friday",
  "hours.saturday",
];

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}

function getCurrentDayOfWeek(): number {
  return new Date().getDay();
}

export function OperatingHoursStatus({ hours }: { hours: HoursEntry[] }) {
  const { t } = useLanguage();
  const now = new Date();
  const today = now.getDay();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const todayHours = hours.find((h) => h.day_of_week === today);

  if (!todayHours || todayHours.is_closed) {
    // Find next open day
    let nextOpenStr = "";
    for (let i = 1; i <= 7; i++) {
      const nextDay = (today + i) % 7;
      const nextHours = hours.find((h) => h.day_of_week === nextDay);
      if (nextHours && !nextHours.is_closed) {
        nextOpenStr = `${t(DAY_KEYS[nextDay])} ${formatTime(nextHours.open_time)}`;
        break;
      }
    }

    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
        <span className="text-red-700">
          {t("hours.closedNow")} {nextOpenStr ? `· ${t("hours.opensOn")} ${nextOpenStr}` : ""}
        </span>
      </div>
    );
  }

  if (currentTime >= todayHours.open_time && currentTime < todayHours.close_time) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden="true" />
        <span className="text-green-700">
          {t("hours.openNow")} · {t("hours.closesAt")} {formatTime(todayHours.close_time)}
        </span>
      </div>
    );
  }

  if (currentTime < todayHours.open_time) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
        <span className="text-red-700">
          {t("hours.closedNow")} · {t("hours.opensOn")} {t("hours.today")} {formatTime(todayHours.open_time)}
        </span>
      </div>
    );
  }

  // Past closing time today
  let nextOpenStr = "";
  for (let i = 1; i <= 7; i++) {
    const nextDay = (today + i) % 7;
    const nextHours = hours.find((h) => h.day_of_week === nextDay);
    if (nextHours && !nextHours.is_closed) {
      nextOpenStr = `${t(DAY_KEYS[nextDay])} ${formatTime(nextHours.open_time)}`;
      break;
    }
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
      <span className="text-red-700">
        {t("hours.closedNow")} {nextOpenStr ? `· ${t("hours.opensOn")} ${nextOpenStr}` : ""}
      </span>
    </div>
  );
}

export function OperatingHoursFull({ hours }: { hours: HoursEntry[] }) {
  const [expanded, setExpanded] = useState(false);
  const today = getCurrentDayOfWeek();
  const { t } = useLanguage();

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
        aria-expanded={expanded}
      >
        {t("detail.operatingHours")}
        <span aria-hidden="true">{expanded ? "\u25B2" : "\u25BC"}</span>
      </button>

      {expanded && (
        <div className="mt-2 space-y-1">
          {DAY_KEYS.map((dayKey, index) => {
            const dayHours = hours.find((h) => h.day_of_week === index);
            const isToday = index === today;

            return (
              <div
                key={dayKey}
                className={`flex justify-between text-sm px-2 py-1 rounded ${
                  isToday ? "bg-blue-50 font-medium" : ""
                }`}
              >
                <span className="text-gray-700">{t(dayKey)}</span>
                <span className="text-gray-600">
                  {!dayHours || dayHours.is_closed
                    ? t("hours.closed")
                    : `${formatTime(dayHours.open_time)} - ${formatTime(dayHours.close_time)}`}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
