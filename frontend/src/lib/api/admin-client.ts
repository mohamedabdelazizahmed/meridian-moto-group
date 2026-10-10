import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import { HttpStatus } from "@/lib/http";
import { Routes } from "@/lib/routes";

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export async function adminFetch<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${Routes.ApiAdmin}${cleanPath}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      "Accept": "application/json",
      ...(init?.body && typeof init.body === "string" ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers || {}),
    },
  });

  let json: Record<string, unknown> | null = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (res.status === HttpStatus.UNAUTHORIZED) {
    useAuthStore.getState().clear();
    toast.error("Session expired. Please sign in again.");
    if (typeof window !== "undefined") {
      window.location.href = Routes.CmsLogin;
    }
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Unauthenticated.");
  }

  if (res.status === HttpStatus.FORBIDDEN) {
    toast.error("You do not have access to this resource.");
    const msg = typeof json?.message === 'string' ? json.message : "Forbidden.";
    throw new ApiError(HttpStatus.FORBIDDEN, msg);
  }

  if (res.status === HttpStatus.UNPROCESSABLE_ENTITY) {
    const msg = typeof json?.message === 'string' ? json.message : "Validation failed.";
    const errs = typeof json?.errors === 'object' && json?.errors !== null ? (json.errors as Record<string, string[]>) : undefined;
    throw new ApiError(
      HttpStatus.UNPROCESSABLE_ENTITY,
      msg,
      errs
    );
  }

  if (res.status === HttpStatus.TOO_MANY_REQUESTS) {
    const msg = typeof json?.message === 'string' ? json.message : "Too many requests. Please try again later.";
    toast.error(msg);
    throw new ApiError(HttpStatus.TOO_MANY_REQUESTS, msg);
  }

  if (!res.ok) {
    const msg = typeof json?.message === 'string' ? json.message : `Request failed with status ${res.status}`;
    toast.error(msg);
    throw new ApiError(res.status, msg);
  }

  return json as T;
}
