export interface AccessDecision {
  allowed: boolean;
  redirectUrl?: string;
}

export function resolveCmsAccess(pathname: string, hasToken: boolean): AccessDecision {
  if (pathname === "/cms/login" || pathname.startsWith("/cms/login/")) {
    return { allowed: true };
  }

  if (pathname.startsWith("/cms") || pathname === "/cms") {
    if (!hasToken) {
      const encodedNext = encodeURIComponent(pathname);
      return {
        allowed: false,
        redirectUrl: `/cms/login?next=${encodedNext}`,
      };
    }
  }

  return { allowed: true };
}

export function validateNextParam(next: string | null): string {
  if (!next) return "/cms/models";
  // Must be an internal path starting with /cms but not // or external
  if (next.startsWith("/cms") && !next.startsWith("//") && !next.includes(":\\")) {
    return next;
  }
  return "/cms/models";
}
