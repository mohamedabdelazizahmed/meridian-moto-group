import { NextResponse } from "next/server";
import { readAuthToken, clearAuthCookie } from "@/lib/auth/cookie";
import { laravelFetch } from "@/lib/auth/laravel";
import { HttpStatus } from "@/lib/http";
import type { AuthUser } from "@/types/api";

export async function GET() {
  const token = await readAuthToken();
  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: HttpStatus.UNAUTHORIZED });
  }

  const res = await laravelFetch<{ data?: AuthUser; user?: AuthUser }>("/auth/me", {
    method: "GET",
    token,
  });

  if (res.status === HttpStatus.UNAUTHORIZED) {
    await clearAuthCookie();
    return NextResponse.json({ message: "Unauthenticated." }, { status: HttpStatus.UNAUTHORIZED });
  }

  if (res.status === HttpStatus.OK && res.body) {
    const user = (res.body as any).data || (res.body as any).user || res.body;
    const response = NextResponse.json({ user }, { status: HttpStatus.OK });
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  return NextResponse.json({ message: "Unauthenticated." }, { status: HttpStatus.UNAUTHORIZED });
}
