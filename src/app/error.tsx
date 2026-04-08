"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-6">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t("error.title")}
        </h1>
        <p className="text-gray-500 mb-8">
          {t("error.message")}
        </p>
        <Button
          onClick={reset}
          className="bg-[#1B4965] hover:bg-[#143A50]"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {t("error.tryAgain")}
        </Button>
      </div>
    </main>
  );
}
