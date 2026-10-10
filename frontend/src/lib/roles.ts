import type { AuthUser } from "@/types/api";

export const Role = {
  Admin: "admin",
  DataEntry: "data_entry",
} as const;

export function isAdmin(user: AuthUser | null): boolean {
  if (!user) return false;
  return user.role === Role.Admin;
}

export function isDataEntry(user: AuthUser | null): boolean {
  if (!user) return false;
  return user.role === Role.DataEntry;
}

export function canManageBrand(user: AuthUser | null, brandSlugOrId: string | number | null | undefined): boolean {
  if (!user || brandSlugOrId === null || brandSlugOrId === undefined) return false;
  if (isAdmin(user)) return true;
  if (!user.brands) return false;

  return user.brands.some(
    (b) =>
      b.slug === brandSlugOrId ||
      b.id === Number(brandSlugOrId) ||
      (b.name && b.name.toLowerCase() === String(brandSlugOrId).toLowerCase())
  );
}

export function canAccessUsers(user: AuthUser | null): boolean {
  return isAdmin(user);
}

export function canManageBrands(user: AuthUser | null): boolean {
  return isAdmin(user);
}
