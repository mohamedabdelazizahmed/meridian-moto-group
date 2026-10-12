import { adminFetch } from "@/lib/api/admin-client";
import type { User } from "@/types/api";
import { UserFormData } from "./schema";

export interface PaginatedResponse<T> {
  data: T[];
  links?: { first?: string; last?: string; prev?: string; next?: string };
  meta?: { current_page: number; last_page: number; per_page: number; total: number };
}

export interface ListUserParams {
  page?: number;
  per_page?: number;
  search?: string;
  role?: string;
}

export async function listUsers(params?: ListUserParams): Promise<PaginatedResponse<User>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.per_page) searchParams.set("per_page", String(params.per_page));
  if (params?.search) searchParams.set("search", params.search);
  if (params?.role && params.role !== "All") searchParams.set("role", params.role);

  const query = searchParams.toString();
  const endpoint = `/admin/users${query ? `?${query}` : ""}`;
  return await adminFetch<PaginatedResponse<User>>(endpoint);
}

export async function getUser(id: number | string): Promise<{ data: User }> {
  return await adminFetch<{ data: User }>(`/admin/users/${id}`);
}

export async function createUser(data: UserFormData): Promise<{ data: User }> {
  const payload: Record<string, unknown> = {
    name: data.name,
    email: data.email,
    password: data.password || undefined,
    role: data.role,
    brand_ids: data.role === "data_entry" ? data.brand_ids : [],
  };

  return await adminFetch<{ data: User }>(`/admin/users`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
}

export async function updateUser(id: number | string, data: UserFormData): Promise<{ data: User }> {
  const payload: Record<string, unknown> = {
    name: data.name,
    email: data.email,
    role: data.role,
    brand_ids: data.role === "data_entry" ? data.brand_ids : [],
  };

  if (data.password && data.password.trim() !== "") {
    payload.password = data.password;
  }

  return await adminFetch<{ data: User }>(`/admin/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
}

export async function deleteUser(id: number | string): Promise<void> {
  await adminFetch(`/admin/users/${id}`, {
    method: "DELETE",
  });
}
