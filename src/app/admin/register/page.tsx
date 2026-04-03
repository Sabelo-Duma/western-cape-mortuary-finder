"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminRegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters with 1 number and 1 uppercase letter"
      );
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError(
        "Password must be at least 8 characters with 1 number and 1 uppercase letter"
      );
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError(
        "Password must be at least 8 characters with 1 number and 1 uppercase letter"
      );
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      if (authError.message.includes("already registered")) {
        setError(
          "An account with this email already exists. Log in or reset password."
        );
      } else {
        setError(authError.message);
      }
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-sm w-full text-center space-y-4">
          <div className="text-4xl">&#9993;</div>
          <h1 className="text-2xl font-bold text-gray-900">Check your email</h1>
          <p className="text-gray-600">
            We sent a verification link to <strong>{email}</strong>. Click the
            link to verify your account, then you can set up your mortuary
            listing.
          </p>
          <Link
            href="/admin/login"
            className="inline-block text-sm text-blue-600 hover:underline mt-4"
          >
            Go to login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="max-w-sm w-full space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Register Your Mortuary
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create an account to list your mortuary
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
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
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              required
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              autoComplete="new-password"
            />
          </div>

          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <Link href="/admin/login" className="text-blue-600 hover:underline">
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </main>
  );
}
