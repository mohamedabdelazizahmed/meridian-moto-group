"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { testRideSchema, TestRideFormData } from "./testRideSchema";
import { Motorcycle } from "@/services/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://localhost:8000/api/v1";

interface TestRideFormProps {
  motorcycles: Motorcycle[];
}

interface ServerErrorResponse {
  status?: number;
  errors?: Record<string, string[]>;
  message?: string;
}

export default function TestRideForm({ motorcycles }: TestRideFormProps) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TestRideFormData>({
    resolver: zodResolver(testRideSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      preferred_date: "",
      motorcycle: motorcycles[0]?.slug || "",
      website: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TestRideFormData) => {
      const res = await fetch(`${API_BASE_URL}/test-ride-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (res.status === 422) {
        throw { status: 422, errors: json.errors, message: json.message };
      }
      if (res.status === 429) {
        throw { status: 429, message: "Too many attempts. Please try again later." };
      }
      if (!res.ok && res.status !== 201) {
        throw { status: res.status, message: json.message || "An unexpected error occurred." };
      }

      return json;
    },
    onSuccess: () => {
      setSuccessMessage("Your private test drive request has been successfully submitted. Our concierge team will contact you shortly.");
      setServerError(null);
      reset();
    },
    onError: (err: unknown) => {
      setSuccessMessage(null);
      const errorObj = err as ServerErrorResponse;
      if (errorObj.status === 422 && errorObj.errors) {
        Object.keys(errorObj.errors).forEach((field) => {
          setError(field as keyof TestRideFormData, {
            type: "server",
            message: errorObj.errors?.[field]?.[0] || "Invalid field",
          });
        });
      } else if (errorObj.status === 429) {
        setServerError("Too many test ride requests submitted. Please try again later.");
      } else {
        setServerError(errorObj.message || "Failed to submit test ride request. Please check your connection and try again.");
      }
    },
  });

  const onSubmit = (data: TestRideFormData) => {
    setSuccessMessage(null);
    setServerError(null);
    mutation.mutate(data);
  };

  return (
    <div className="bg-moto-surface border border-moto-border rounded-xl p-8 shadow-2xl">
      <div className="mb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-moto-copper mb-2 block">
          [PRIVATE CONCIERGE BOOKING]
        </span>
        <h3 className="text-2xl sm:text-3xl font-bold tracking-wider text-moto-text uppercase">
          REQUEST A PRIVATE TEST DRIVE
        </h3>
        <p className="text-moto-muted text-xs sm:text-sm mt-1">
          Experience uncompromising performance at our GCC track-side ateliers or private flagship lounges.
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 rounded bg-moto-volt/10 border border-moto-volt/40 text-moto-volt text-xs font-mono">
          ✓ {successMessage}
        </div>
      )}

      {serverError && (
        <div className="mb-6 p-4 rounded bg-moto-apex/10 border border-moto-apex/40 text-moto-apex text-xs font-mono">
          ⚠ {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Honeypot field (hidden from users and AT) */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            {...register("website")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-moto-muted mb-1" htmlFor="name">
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="w-full bg-moto-bg border border-moto-border rounded px-4 py-3 text-sm text-moto-text focus:border-moto-copper focus:outline-none"
              placeholder="e.g. Sheikh Hamdan"
            />
            {errors.name && <p className="mt-1 text-xs text-moto-apex font-mono">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-moto-muted mb-1" htmlFor="phone">
              Phone Number *
            </label>
            <input
              id="phone"
              type="tel"
              {...register("phone")}
              className="w-full bg-moto-bg border border-moto-border rounded px-4 py-3 text-sm text-moto-text focus:border-moto-copper focus:outline-none"
              placeholder="+971 50 000 0000"
            />
            {errors.phone && <p className="mt-1 text-xs text-moto-apex font-mono">{errors.phone.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-moto-muted mb-1" htmlFor="email">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full bg-moto-bg border border-moto-border rounded px-4 py-3 text-sm text-moto-text focus:border-moto-copper focus:outline-none"
              placeholder="vip@meridianmoto.ae"
            />
            {errors.email && <p className="mt-1 text-xs text-moto-apex font-mono">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-moto-muted mb-1" htmlFor="preferred_date">
              Preferred Date *
            </label>
            <input
              id="preferred_date"
              type="date"
              {...register("preferred_date")}
              className="w-full bg-moto-bg border border-moto-border rounded px-4 py-3 text-sm text-moto-text focus:border-moto-copper focus:outline-none"
            />
            {errors.preferred_date && <p className="mt-1 text-xs text-moto-apex font-mono">{errors.preferred_date.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-moto-muted mb-1" htmlFor="motorcycle">
            Preferred Motorcycle Model
          </label>
          <select
            id="motorcycle"
            {...register("motorcycle")}
            className="w-full bg-moto-bg border border-moto-border rounded px-4 py-3 text-sm text-moto-text focus:border-moto-copper focus:outline-none"
          >
            <option value="">Select a flagship model...</option>
            {motorcycles.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.name} ({m.brand?.name || 'Marque'})
              </option>
            ))}
          </select>
          {errors.motorcycle && <p className="mt-1 text-xs text-moto-apex font-mono">{errors.motorcycle.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || mutation.isPending}
          className="w-full bg-moto-copper text-moto-bg font-barlow font-bold text-sm tracking-wider uppercase py-4 rounded hover:bg-moto-copper/90 transition-all shadow-xl shadow-moto-copper/20 disabled:opacity-50 mt-4 cursor-pointer"
        >
          {isSubmitting || mutation.isPending ? "Submitting Request..." : "Submit Test Ride Request →"}
        </button>
      </form>
    </div>
  );
}
