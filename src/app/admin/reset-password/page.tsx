"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function ResetPasswordPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/dashboard`,
    });

    setLoading(false);
    if (resetError) { setError(resetError.message); return; }
    setSent(true);
  };

  if (sent) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-sm w-full text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("admin.checkEmailTitle")}</h1>
          <p className="text-sm text-gray-600 mb-2">{t("admin.resetSent")}</p>
          <p className="text-sm font-semibold text-gray-900 mb-6">{email}</p>
          <p className="text-xs text-gray-500 mb-8">{t("admin.checkSpam")}</p>
          <Link href="/admin/login" className="text-sm text-[#1B4965] hover:underline font-medium">
            {t("admin.backToLogin")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="max-w-sm w-full">
        <Link href="/admin/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("admin.backToLogin")}
        </Link>
        <div className="text-center mb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 mb-4">
            <Mail className="h-6 w-6 text-[#1B4965]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t("admin.resetTitle")}</h1>
          <p className="text-sm text-gray-500 mt-2">{t("admin.resetSubtitle")}</p>
        </div>
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <Label htmlFor="email">{t("admin.email")}</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required className="mt-1" />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>}
          <Button type="submit" className="w-full bg-[#1B4965] hover:bg-[#143A50] h-11" disabled={loading || !email}>
            {loading ? t("admin.sending") : t("admin.sendResetLink")}
          </Button>
        </form>
      </div>
    </main>
  );
}
