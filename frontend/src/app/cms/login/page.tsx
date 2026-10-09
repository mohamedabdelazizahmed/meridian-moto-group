"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CmsFooter from "@/components/CmsFooter";

export default function CmsLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("dataentry@meridianmoto.ae");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick fill helper for testing roles
  const fillCredentials = (role: "admin" | "data_entry" | "invalid" | "ratelimit") => {
    setErrorBanner(null);
    if (role === "admin") {
      setEmail("admin@meridianmoto.ae");
      setPassword("admin2026");
    } else if (role === "data_entry") {
      setEmail("dataentry@meridianmoto.ae");
      setPassword("password123");
    } else if (role === "invalid") {
      setEmail("wrong@meridianmoto.ae");
      setPassword("wrongpass");
    } else if (role === "ratelimit") {
      setEmail("limit@meridianmoto.ae");
      setPassword("password123");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBanner(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      if (email.includes("wrong")) {
        setErrorBanner("These credentials do not match our records.");
        return;
      }

      if (email.includes("limit")) {
        setErrorBanner("Too many attempts. Try again in 60 seconds.");
        return;
      }

      // Successful client-side redirect based on role clearance
      if (email.includes("admin")) {
        router.push("/cms/admin/users");
      } else {
        router.push("/cms/models");
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-moto-bg text-moto-text selection:bg-moto-copper selection:text-white">
      {/* Top minimal header */}
      <header className="border-b border-moto-border px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-moto-text">
          <div className="w-2.5 h-2.5 bg-moto-copper rotate-45"></div>
          <span className="font-barlow font-bold text-lg tracking-[0.12em] uppercase">
            MERIDIAN <span className="text-moto-copper">MOTO GROUP</span>
          </span>
        </Link>
        <Link href="/" className="text-xs text-moto-muted hover:text-moto-text font-mono uppercase">
          ← Consumer Website
        </Link>
      </header>

      {/* Main Centered Sign In Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-moto-surface border border-moto-border rounded-xl p-8 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-moto-copper/10 border border-moto-copper/30 flex items-center justify-center text-moto-copper font-bold text-lg">
              🔑
            </div>
            <h1 className="text-3xl font-bold tracking-wider text-moto-text uppercase font-barlow">
              CMS SIGN IN
            </h1>
            <p className="text-xs text-moto-muted">
              Enter your corporate credentials to manage vehicle catalog & brand scoping clearances.
            </p>
          </div>

          {/* Quick Demo Credentials Switcher for Evaluation */}
          <div className="bg-moto-bg border border-moto-border p-3 rounded-lg text-xs space-y-2">
            <div className="font-mono text-[11px] text-moto-copper uppercase font-semibold">
              Select Demo Credentials:
            </div>
            <div className="grid grid-cols-2 gap-2 font-mono">
              <button
                type="button"
                onClick={() => fillCredentials("data_entry")}
                className={`px-2 py-1.5 rounded border text-left transition-colors ${
                  email.includes("dataentry")
                    ? "bg-moto-apex/20 border-moto-apex text-moto-apex font-bold"
                    : "bg-moto-surface border-moto-border text-moto-muted hover:text-moto-text"
                }`}
              >
                Data Entry Role
                <span className="block text-[10px] text-moto-muted font-normal truncate">
                  dataentry@... (Apex, Nomad)
                </span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials("admin")}
                className={`px-2 py-1.5 rounded border text-left transition-colors ${
                  email.includes("admin")
                    ? "bg-moto-copper/20 border-moto-copper text-moto-copper font-bold"
                    : "bg-moto-surface border-moto-border text-moto-muted hover:text-moto-text"
                }`}
              >
                Administrator Role
                <span className="block text-[10px] text-moto-muted font-normal truncate">
                  admin@... (All Brands)
                </span>
              </button>
            </div>

            <div className="flex justify-between text-[10px] text-moto-muted pt-1">
              <button
                type="button"
                onClick={() => fillCredentials("invalid")}
                className="underline hover:text-moto-apex"
              >
                Test Invalid Error
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("ratelimit")}
                className="underline hover:text-moto-apex"
              >
                Test Rate Limit Alert
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {errorBanner && (
            <div className="bg-moto-apex/10 border border-moto-apex/40 text-moto-apex px-4 py-3 rounded-lg text-xs font-mono flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorBanner}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-mono text-moto-muted uppercase mb-1.5">
                Corporate Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@meridianmoto.ae"
                className="w-full bg-moto-bg border border-moto-border px-4 py-3 rounded text-sm text-moto-text focus:outline-none focus:border-moto-copper transition-colors font-mono"
              />
            </div>

            {/* Password Field with Eye Toggle */}
            <div>
              <label className="block text-xs font-mono text-moto-muted uppercase mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-moto-bg border border-moto-border px-4 py-3 rounded text-sm text-moto-text focus:outline-none focus:border-moto-copper transition-colors font-mono pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-moto-muted hover:text-moto-text text-sm focus:outline-none"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-moto-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-moto-border bg-moto-bg text-moto-copper focus:ring-0"
                />
                <span>Remember me on this workstation</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-moto-copper text-moto-bg font-barlow font-bold text-base uppercase tracking-wider py-3.5 rounded-lg shadow-lg shadow-moto-copper/20 hover:bg-moto-copper/90 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-moto-bg border-t-transparent rounded-full animate-spin"></span>
                  <span>Verifying Clearance...</span>
                </>
              ) : (
                <span>SIGN IN →</span>
              )}
            </button>
          </form>
        </div>
      </main>

      <CmsFooter />
    </div>
  );
}
