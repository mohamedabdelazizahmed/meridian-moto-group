import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/env";
import { HttpStatus } from "@/lib/http";

export function assertSameOrigin(request: Request): NextResponse | null {
  const method = request.method.toUpperCase();
  const mutatingMethods = ["POST", "PUT", "PATCH", "DELETE"];

  if (!mutatingMethods.includes(method)) {
    return null;
  }

  const origin = request.headers.get("origin");
  if (!origin) {
    return NextResponse.json({ message: "Forbidden." }, { status: HttpStatus.FORBIDDEN });
  }

  try {
    const originUrl = new URL(origin);
    const siteUrlObj = new URL(getSiteUrl());
    const requestUrlObj = new URL(request.url);

    const isMatch =
      originUrl.origin === siteUrlObj.origin || originUrl.origin === requestUrlObj.origin;

    if (!isMatch) {
      return NextResponse.json({ message: "Forbidden." }, { status: HttpStatus.FORBIDDEN });
    }
  } catch {
    return NextResponse.json({ message: "Forbidden." }, { status: HttpStatus.FORBIDDEN });
  }

  return null;
}
