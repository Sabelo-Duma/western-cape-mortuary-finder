"use client";

import { Globe } from "lucide-react";
import { useLanguage, LOCALE_NAMES, type Locale } from "@/lib/i18n";

const LOCALES: Locale[] = ["en", "af", "xh"];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="relative flex items-center gap-1">
      <Globe className="h-3.5 w-3.5 text-gray-500" aria-hidden="true" />
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="appearance-none bg-transparent text-sm text-gray-600 hover:text-gray-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1B4965] rounded pr-4"
        aria-label="Select language"
      >
        {LOCALES.map((loc) => (
          <option key={loc} value={loc}>
            {LOCALE_NAMES[loc]}
          </option>
        ))}
      </select>
    </div>
  );
}
