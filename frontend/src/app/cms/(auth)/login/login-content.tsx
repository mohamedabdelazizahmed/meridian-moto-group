'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import CmsFooter from '@/components/CmsFooter';
import { useAuthStore } from '@/store/auth.store';
import { Routes } from '@/lib/routes';
import { HttpStatus } from '@/lib/http';
import { validateNextParam } from '@/lib/auth/access';
import type { AuthUser } from '@/types/api';

const loginFormSchema = z.object({
  email: z.string().email('Please enter a valid corporate email address.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

export default function CmsLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');
  const setUser = useAuthStore((state) => state.setUser);

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [retryAfterSeconds, setRetryAfterSeconds] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    setRetryAfterSeconds(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      let json: Record<string, unknown> | null = null;
      try {
        json = await res.json();
      } catch {
        json = null;
      }

      if (res.status === HttpStatus.OK) {
        if (json?.user && typeof json.user === 'object') {
          setUser(json.user as AuthUser);
        }
        const target = validateNextParam(nextParam);
        router.replace(target);
        router.refresh();
        return;
      }

      if (res.status === HttpStatus.UNAUTHORIZED) {
        setServerError('These credentials do not match our records.');
        return;
      }

      if (res.status === HttpStatus.UNPROCESSABLE_ENTITY && json?.errors) {
        const fieldErrors = json.errors as Record<string, string[]>;
        Object.keys(fieldErrors).forEach((field) => {
          setError(field as keyof LoginFormData, {
            type: 'server',
            message: fieldErrors[field]?.[0] || 'Invalid value',
          });
        });
        return;
      }

      if (res.status === HttpStatus.TOO_MANY_REQUESTS) {
        const retryHeader = res.headers.get('retry-after');
        const seconds = retryHeader ? parseInt(retryHeader, 10) : 60;
        setRetryAfterSeconds(isNaN(seconds) ? 60 : seconds);
        const errorMsg = typeof json?.message === 'string' ? json.message : `Too many attempts. Please try again in ${seconds} seconds.`;
        setServerError(errorMsg);
        return;
      }

      const defaultErrorMsg = typeof json?.message === 'string' ? json.message : 'Authentication failed. Please try again.';
      setServerError(defaultErrorMsg);
    } catch {
      setServerError('Network error or server unavailable. Please check your connection.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-moto-bg text-moto-text selection:bg-moto-copper selection:text-white">
      {/* Top minimal header */}
      <header className="border-b border-moto-border px-6 py-4 flex items-center justify-between">
        <Link href={Routes.Home} className="flex items-center gap-2 text-moto-text">
          <div className="w-2.5 h-2.5 bg-moto-copper rotate-45"></div>
          <span className="font-barlow font-bold text-lg tracking-[0.12em] uppercase">
            MERIDIAN <span className="text-moto-copper">MOTO GROUP</span>
          </span>
        </Link>
        <Link href={Routes.Home} className="text-xs text-moto-muted hover:text-moto-text font-mono uppercase">
          ← Consumer Website
        </Link>
      </header>

      {/* Main Centered Sign In Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-moto-surface border border-moto-border rounded-xl p-8 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-wider text-moto-text uppercase font-barlow">
              CMS Sign In
            </h1>
            <p className="text-xs text-moto-muted">
              Enter your corporate credentials to manage vehicle catalog & brand scoping clearances.
            </p>
          </div>

          {/* Error / Rate Limit Banner */}
          {serverError && (
            <div
              role="alert"
              aria-live="polite"
              className="bg-moto-apex/10 border border-moto-apex/40 text-moto-apex px-4 py-3 rounded-lg text-xs font-mono flex items-center gap-2"
            >
              <span>⚠️</span>
              <div>
                <p className="font-semibold">{serverError}</p>
                {retryAfterSeconds !== null && (
                  <p className="text-[11px] mt-0.5">Please wait {retryAfterSeconds} seconds before retrying.</p>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-mono text-moto-muted uppercase mb-1.5">
                Corporate Email Address *
              </label>
              <input
                id="email"
                type="email"
                required
                {...register('email')}
                placeholder="admin@meridianmoto.ae"
                className="w-full bg-moto-bg border border-moto-border px-4 py-3 rounded text-sm text-moto-text focus:outline-none focus:border-moto-copper transition-colors font-mono"
              />
              {errors.email && <p className="mt-1 text-xs text-moto-apex font-mono">{errors.email.message}</p>}
            </div>

            {/* Password Field with Eye Toggle */}
            <div>
              <label htmlFor="password" className="block text-xs font-mono text-moto-muted uppercase mb-1.5">
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  {...register('password')}
                  placeholder="••••••••••••"
                  className="w-full bg-moto-bg border border-moto-border px-4 py-3 rounded text-sm text-moto-text focus:outline-none focus:border-moto-copper transition-colors font-mono pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-moto-muted hover:text-moto-text text-sm focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-moto-apex font-mono">{errors.password.message}</p>}
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
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In →</span>
              )}
            </button>
          </form>

          {/* Fictional Company Note */}
          <div className="pt-4 border-t border-moto-border text-[11px] text-center text-moto-muted font-mono">
            Fictional company created for recruitment assessment purposes only.
          </div>
        </div>
      </main>

      <CmsFooter />
    </div>
  );
}
