import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { assertSameOrigin } from "./origin";

describe("origin", () => {
  it("allows GET requests without checking origin", () => {
    const req = new NextRequest("http://localhost:3000/api/admin/models", {
      method: "GET",
    });
    const err = assertSameOrigin(req);
    expect(err).toBeNull();
  });

  it("allows POST requests with matching origin", () => {
    const req = new NextRequest("http://localhost:3000/api/admin/models", {
      method: "POST",
      headers: {
        Origin: "http://localhost:3000",
      },
    });
    const err = assertSameOrigin(req);
    expect(err).toBeNull();
  });

  it("rejects POST requests with missing or mismatched origin", () => {
    const reqNoOrigin = new NextRequest("http://localhost:3000/api/admin/models", {
      method: "POST",
    });
    expect(assertSameOrigin(reqNoOrigin)).not.toBeNull();

    const reqBadOrigin = new NextRequest("http://localhost:3000/api/admin/models", {
      method: "POST",
      headers: {
        Origin: "http://evil.example",
      },
    });
    expect(assertSameOrigin(reqBadOrigin)).not.toBeNull();
  });
});
