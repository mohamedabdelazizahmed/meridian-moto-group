import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getApiBaseUrl } from "./env";

describe("env", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns public url on client side", () => {
    // Mock window to simulate browser
    vi.stubGlobal("window", {});
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:8000/api/v1";

    const url = getApiBaseUrl();
    expect(url).toBe("http://localhost:8000/api/v1");
  });

  it("returns internal url on server side when provided", () => {
    // Remove window to simulate server
    vi.stubGlobal("window", undefined);
    process.env.API_INTERNAL_URL = "http://backend-service:8000/api/v1";
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:8000/api/v1";

    const url = getApiBaseUrl();
    expect(url).toBe("http://backend-service:8000/api/v1");
  });

  it("falls back to public url on server side when internal url is missing", () => {
    vi.stubGlobal("window", undefined);
    delete process.env.API_INTERNAL_URL;
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:8000/api/v1";

    const url = getApiBaseUrl();
    expect(url).toBe("http://localhost:8000/api/v1");
  });
});
