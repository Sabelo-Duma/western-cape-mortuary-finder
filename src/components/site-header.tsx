"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/lib/i18n";

export function SiteHeader() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B4965] text-white transition-transform group-hover:scale-105">
            <Heart className="h-4 w-4" />
          </div>
          <span className="font-semibold text-gray-900 text-sm sm:text-base">
            {t("header.brand")}
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link
            href="/"
            className="hidden sm:inline text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            {t("header.findMortuary")}
          </Link>
          <Link
            href="/admin/login"
            className="text-sm font-medium text-white bg-[#1B4965] hover:bg-[#143A50] px-3 py-1.5 rounded-lg transition-colors"
          >
            {t("header.ownerPortal")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
