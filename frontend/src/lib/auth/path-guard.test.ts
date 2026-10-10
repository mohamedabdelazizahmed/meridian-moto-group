import { describe, it, expect } from "vitest";
import { isSafeAdminPath } from "./path-guard";

describe("path-guard", () => {
  it("allows valid admin paths", () => {
    expect(isSafeAdminPath(["models"])).toBe(true);
    expect(isSafeAdminPath(["models", "12"])).toBe(true);
    expect(isSafeAdminPath(["brands", "volt"])).toBe(true);
    expect(isSafeAdminPath(["promotions"])).toBe(true);
  });

  it("rejects traversal and unsafe segments", () => {
    expect(isSafeAdminPath([])).toBe(false);
    expect(isSafeAdminPath([".."])).toBe(false);
    expect(isSafeAdminPath(["."])).toBe(false);
    expect(isSafeAdminPath(["a", "..", "b"])).toBe(false);
    expect(isSafeAdminPath(["%2e%2e"])).toBe(false);
    expect(isSafeAdminPath(["%2f"])).toBe(false);
    expect(isSafeAdminPath(["%5c"])).toBe(false);
    expect(isSafeAdminPath(["https://x"])).toBe(false);
    expect(isSafeAdminPath(["//x"])).toBe(false);
    expect(isSafeAdminPath(["a\\b"])).toBe(false);
    expect(isSafeAdminPath(["models?x=1"])).toBe(false);
    expect(isSafeAdminPath(["a:b"])).toBe(false);
  });
});
