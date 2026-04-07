"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
  };

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="max-w-sm w-full space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Mortuary Owner Login
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your mortuary listing
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <div className="text-center space-y-2 text-sm">
          <Link
            href="/admin/reset-password"
            className="block text-gray-500 hover:text-gray-700"
          >
            Forgot your password?
          </Link>
          <Link
            href="/admin/register"
            className="block text-blue-600 hover:underline"
          >
            Register your mortuary
          </Link>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            &larr; Back to search
          </Link>
        </div>
      </div>
    </main>
  );
}
