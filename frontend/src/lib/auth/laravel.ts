import { getApiBaseUrl } from "@/lib/env";
import { UPSTREAM_TIMEOUT_MS } from "./constants";

export interface LaravelResponse<T = unknown> {
  status: number;
  body: T;
  headers: Headers;
}

export async function laravelFetch<T = unknown>(
  endpoint: string,
  init?: RequestInit & { token?: string }
): Promise<LaravelResponse<T>> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");

  if (init?.token) {
    headers.set("Authorization", `Bearer ${init.token}`);
  }

  if (init?.body && typeof init.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const res = await fetch(url, {
      ...init,
      headers,
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      cache: "no-store",
    });

    let body = null as unknown as T;
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      try {
        body = (await res.json()) as T;
      } catch {
        // body remains default
      }
    } else {
      try {
        body = (await res.text()) as T;
      } catch {
        // body remains default
      }
    }

    return {
      status: res.status,
      body,
      headers: res.headers,
    };
  } catch {
    return {
      status: 502,
      body: ({ message: "Upstream unavailable." } as { message: string }) as unknown as T,
      headers: new Headers(),
    };
  }
}
