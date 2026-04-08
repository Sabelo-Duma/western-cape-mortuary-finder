"use client";

import Link from "next/link";
import { Search, Home } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function NotFoundContent() {
  const { t } = useLanguage();

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-6">
          <Search className="h-8 w-8 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t("notFound.title")}
        </h1>
        <p className="text-gray-500 mb-8">
          {t("notFound.message")}
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1B4965] hover:bg-[#143A50] text-white px-5 py-2.5 text-sm font-medium transition-colors"
        >
          <Home className="h-4 w-4" />
          {t("notFound.backHome")}
        </Link>
      </div>
    </main>
  );
}
