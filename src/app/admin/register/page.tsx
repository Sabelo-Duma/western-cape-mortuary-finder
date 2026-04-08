"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/lib/i18n";

export default function AdminRegisterPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Password must be at least 8 characters with 1 number and 1 uppercase letter");
      return;
    }
    if (password !== confirmPassword) {
      setError(t("admin.passwordMismatch"));
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (authError) {
      setError(t("admin.registrationFailed"));
      return;
    }
    setSuccess(true);
  };

  if (success) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-sm w-full text-center space-y-4">
          <div className="text-4xl">&#9993;</div>
          <h1 className="text-2xl font-bold text-gray-900">{t("admin.checkEmail")}</h1>
          <p className="text-gray-600">
            {t("admin.verificationSent")} <strong>{email}</strong>.
            {" "}{t("admin.verifyThen")}
          </p>
          <Link href="/admin/login" className="inline-block text-sm text-blue-600 hover:underline mt-4">
            {t("admin.goToLogin")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="max-w-sm w-full space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{t("admin.registerTitle")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("admin.registerSubtitle")}</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3" role="alert">{error}</div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">{t("admin.email")}</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("admin.password")}</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 chars, 1 uppercase, 1 number" required autoComplete="new-password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("admin.confirmPassword")}</Label>
            <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required autoComplete="new-password" />
          </div>
          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading ? t("admin.signingUp") : t("admin.signUp")}
          </Button>
        </form>

        <div className="text-center text-sm">
          <Link href="/admin/login" className="text-blue-600 hover:underline">
            {t("admin.hasAccount")} {t("admin.signIn")}
          </Link>
        </div>
      </div>
    </main>
  );
}
