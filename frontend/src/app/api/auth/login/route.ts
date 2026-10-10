import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { laravelFetch } from "@/lib/auth/laravel";
import { setAuthCookie } from "@/lib/auth/cookie";
import { assertSameOrigin } from "@/lib/auth/origin";
import { HttpStatus } from "@/lib/http";
import type { AuthUser } from "@/types/api";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "The given data was invalid.", errors: { email: ["The email field is required."] } },
      { status: HttpStatus.UNPROCESSABLE_ENTITY }
    );
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "The given data was invalid.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: HttpStatus.UNPROCESSABLE_ENTITY }
    );
  }

  const res = await laravelFetch<{ token?: string; access_token?: string; user?: AuthUser; data?: { user?: AuthUser; token?: string } }>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(parsed.data),
    }
  );

  if (res.status === HttpStatus.OK && res.body) {
    const raw = res.body as Record<string, unknown> & { token?: string; access_token?: string; user?: AuthUser; data?: { user?: AuthUser; token?: string } };
    const token = raw.token || raw.access_token || raw.data?.token;
    const user = raw.user || raw.data?.user;

    if (token) {
      await setAuthCookie(token);
    }

    const response = NextResponse.json({ user }, { status: HttpStatus.OK });
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  if (res.status === HttpStatus.UNAUTHORIZED) {
    const response = NextResponse.json(
      { message: "These credentials do not match our records." },
      { status: HttpStatus.UNAUTHORIZED }
    );
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  if (res.status === HttpStatus.UNPROCESSABLE_ENTITY) {
    const response = NextResponse.json(res.body, { status: HttpStatus.UNPROCESSABLE_ENTITY });
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  if (res.status === HttpStatus.TOO_MANY_REQUESTS) {
    const response = NextResponse.json(res.body || { message: "Too many attempts. Please try again later." }, { status: HttpStatus.TOO_MANY_REQUESTS });
    const retryAfter = res.headers.get("retry-after");
    if (retryAfter) {
      response.headers.set("Retry-After", retryAfter);
    }
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  const response = NextResponse.json(
    { message: (res.body as Record<string, unknown>)?.message || "Authentication failed." },
    { status: res.status || HttpStatus.UNAUTHORIZED }
  );
  response.headers.set("Cache-Control", "no-store");
  return response;
}
