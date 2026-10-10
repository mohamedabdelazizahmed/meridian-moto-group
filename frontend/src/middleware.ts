import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import { resolveCmsAccess } from "@/lib/auth/access";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hasToken = request.cookies.has(AUTH_COOKIE_NAME);

  const decision = resolveCmsAccess(pathname, hasToken);

  if (!decision.allowed && decision.redirectUrl) {
    const loginUrl = new URL(decision.redirectUrl, request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cms/:path*"],
};
