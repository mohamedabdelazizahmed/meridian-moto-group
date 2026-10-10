import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:8000/api/v1"),
  API_INTERNAL_URL: z.string().url().optional(),
  SITE_URL: z.string().url().default("http://localhost:3000"),
});

export function getApiBaseUrl(): string {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    API_INTERNAL_URL: process.env.API_INTERNAL_URL,
    SITE_URL: process.env.SITE_URL,
  });

  const apiBase = parsed.success ? parsed.data.NEXT_PUBLIC_API_URL : "http://localhost:8000/api/v1";
  const internalBase = parsed.success ? parsed.data.API_INTERNAL_URL : undefined;

  if (typeof window === "undefined") {
    // Server-side
    return internalBase || apiBase;
  }
  // Client-side
  return apiBase;
}
