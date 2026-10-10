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

  const env = parsed.success ? parsed.data : {
    NEXT_PUBLIC_API_URL: "http://localhost:8000/api/v1",
    API_INTERNAL_URL: undefined,
    SITE_URL: "http://localhost:3000",
  };

  if (typeof window === "undefined") {
    return env.API_INTERNAL_URL || env.NEXT_PUBLIC_API_URL;
  }
  return env.NEXT_PUBLIC_API_URL;
}

export function getSiteUrl(): string {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    API_INTERNAL_URL: process.env.API_INTERNAL_URL,
    SITE_URL: process.env.SITE_URL,
  });
  return parsed.success ? parsed.data.SITE_URL : "http://localhost:3000";
}
