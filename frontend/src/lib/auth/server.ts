import { cache } from "react";
import { readAuthToken, clearAuthCookie } from "./cookie";
import { laravelFetch } from "./laravel";
import type { AuthUser } from "@/types/api";
import { HttpStatus } from "@/lib/http";

export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const token = await readAuthToken();
  if (!token) {
    return null;
  }

  const res = await laravelFetch<{ data?: AuthUser; user?: AuthUser }>("/auth/me", {
    method: "GET",
    token,
  });

  if (res.status === HttpStatus.UNAUTHORIZED) {
    await clearAuthCookie();
    return null;
  }

  if (res.status !== HttpStatus.OK || !res.body) {
    return null;
  }

  const user = (res.body as { data?: AuthUser; user?: AuthUser }).data || (res.body as AuthUser);
  return user && typeof user === "object" && "id" in user ? (user as AuthUser) : null;
});
