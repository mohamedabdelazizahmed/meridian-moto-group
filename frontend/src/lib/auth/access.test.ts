import { describe, it, expect } from "vitest";
import { resolveCmsAccess, validateNextParam } from "./access";

describe("access", () => {
  it("resolves CMS access correctly", () => {
    // /cms/login always allowed regardless of token
    expect(resolveCmsAccess("/cms/login", false).allowed).toBe(true);
    expect(resolveCmsAccess("/cms/login", true).allowed).toBe(true);

    // Protected path without token redirects
    const decisionNoToken = resolveCmsAccess("/cms/models", false);
    expect(decisionNoToken.allowed).toBe(false);
    expect(decisionNoToken.redirectUrl).toBe("/cms/login?next=%2Fcms%2Fmodels");

    // Protected path with token allowed
    expect(resolveCmsAccess("/cms/models", true).allowed).toBe(true);
    expect(resolveCmsAccess("/cms/admin/users", true).allowed).toBe(true);
  });

  it("validates next param safely", () => {
    expect(validateNextParam("/cms/models")).toBe("/cms/models");
    expect(validateNextParam("https://evil.example")).toBe("/cms/models");
    expect(validateNextParam("//evil.example")).toBe("/cms/models");
    expect(validateNextParam(null)).toBe("/cms/models");
  });
});
