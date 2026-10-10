import { NextRequest, NextResponse } from "next/server";
import { readAuthToken, clearAuthCookie } from "@/lib/auth/cookie";
import { laravelFetch } from "@/lib/auth/laravel";
import { assertSameOrigin } from "@/lib/auth/origin";
import { HttpStatus } from "@/lib/http";

export async function POST(request: NextRequest) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;

  const token = await readAuthToken();
  if (token) {
    try {
      await laravelFetch("/auth/logout", {
        method: "POST",
        token,
      });
    } catch {
      // Ignore upstream logout failures
    }
  }

  await clearAuthCookie();
  const response = new NextResponse(null, { status: HttpStatus.NO_CONTENT });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
