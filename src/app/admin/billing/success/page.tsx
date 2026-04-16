"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function BillingSuccessPage() {
  const { t } = useLanguage();

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t("billing.success.title")}
        </h1>
        <p className="text-gray-600 mb-6">
          {t("billing.success.message")}
        </p>
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center justify-center px-6 py-3 bg-[#1B4965] hover:bg-[#143A50] text-white font-medium rounded-lg transition-colors"
        >
          {t("billing.backToDashboard")}
        </Link>
      </div>
    </main>
  );
}
