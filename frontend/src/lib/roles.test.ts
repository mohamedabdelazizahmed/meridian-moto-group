import { describe, it, expect } from "vitest";
import { isAdmin, isDataEntry, canManageBrand, canAccessUsers, canManageBrands } from "./roles";
import type { AuthUser } from "@/types/api";

describe("roles", () => {
  const adminUser: AuthUser = {
    id: 1,
    name: "Admin User",
    email: "admin@meridianmoto.ae",
    role: "admin",
    brands: [],
  };

  const dataEntryUser: AuthUser = {
    id: 2,
    name: "Data Entry User",
    email: "dataentry@meridianmoto.ae",
    role: "data_entry",
    brands: [
      { id: 1, name: "Apex", slug: "apex" },
      { id: 2, name: "Nomad", slug: "nomad" },
    ],
  };

  it("identifies admin correctly", () => {
    expect(isAdmin(adminUser)).toBe(true);
    expect(isAdmin(dataEntryUser)).toBe(false);
    expect(isAdmin(null)).toBe(false);
  });

  it("identifies data entry correctly", () => {
    expect(isDataEntry(dataEntryUser)).toBe(true);
    expect(isDataEntry(adminUser)).toBe(false);
    expect(isDataEntry(null)).toBe(false);
  });

  it("checks brand management permission", () => {
    // Admin can manage any brand
    expect(canManageBrand(adminUser, "apex")).toBe(true);
    expect(canManageBrand(adminUser, 99)).toBe(true);

    // Data entry can manage assigned brands
    expect(canManageBrand(dataEntryUser, "apex")).toBe(true);
    expect(canManageBrand(dataEntryUser, 2)).toBe(true);
    expect(canManageBrand(dataEntryUser, "volt")).toBe(false);
    expect(canManageBrand(dataEntryUser, null)).toBe(false);
  });

  it("checks user access and brand management privileges", () => {
    expect(canAccessUsers(adminUser)).toBe(true);
    expect(canAccessUsers(dataEntryUser)).toBe(false);
    expect(canAccessUsers(null)).toBe(false);

    expect(canManageBrands(adminUser)).toBe(true);
    expect(canManageBrands(dataEntryUser)).toBe(false);
  });
});
