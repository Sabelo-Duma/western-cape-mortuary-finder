"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useLanguage, LOCALE_NAMES, type Locale } from "@/lib/i18n";

const LOCALES: { code: Locale; flag: string }[] = [
  { code: "en", flag: "EN" },
  { code: "af", flag: "AF" },
  { code: "xh", flag: "XH" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors rounded-full px-2.5 py-1.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1B4965]"
        aria-label="Select language"
        aria-expanded={open}
      >
        <Globe className="h-4 w-4" />
        <span className="font-medium">{LOCALE_NAMES[locale]}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          {LOCALES.map(({ code, flag }) => (
            <button
              key={code}
              onClick={() => {
                setLocale(code);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                locale === code
                  ? "text-[#1B4965] bg-blue-50 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="w-7 h-5 flex items-center justify-center rounded bg-gray-100 text-xs font-bold text-gray-500">
                {flag}
              </span>
              <span className="flex-1 text-left">{LOCALE_NAMES[code]}</span>
              {locale === code && (
                <Check className="h-4 w-4 text-[#1B4965]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
