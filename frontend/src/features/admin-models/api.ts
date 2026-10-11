import { adminFetch } from "@/lib/api/admin-client";
import type { Motorcycle } from "@/types/api";
import { ModelFormData } from "./schema";

export interface PaginatedResponse<T> {
  data: T[];
  links?: { first?: string; last?: string; prev?: string; next?: string };
  meta?: { current_page: number; last_page: number; per_page: number; total: number };
}

export interface ListModelParams {
  page?: number;
  per_page?: number;
  search?: string;
  brand_id?: string | number;
  status?: string;
}

export async function listModels(params?: ListModelParams): Promise<PaginatedResponse<Motorcycle>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.per_page) searchParams.set("per_page", String(params.per_page));
  if (params?.search) searchParams.set("search", params.search);
  if (params?.brand_id && params.brand_id !== "All") searchParams.set("brand_id", String(params.brand_id));
  if (params?.status && params.status !== "All") searchParams.set("status", params.status);

  const query = searchParams.toString();
  const endpoint = `/motorcycles${query ? `?${query}` : ""}`;
  return await adminFetch<PaginatedResponse<Motorcycle>>(endpoint);
}

export async function getModel(id: number | string): Promise<{ data: Motorcycle }> {
  return await adminFetch<{ data: Motorcycle }>(`/motorcycles/${id}`);
}

export async function createModel(formData: FormData): Promise<{ data: Motorcycle }> {
  return await adminFetch<{ data: Motorcycle }>(`/motorcycles`, {
    method: "POST",
    body: formData,
    headers: {},
  });
}

export async function updateModel(id: number | string, formData: FormData): Promise<{ data: Motorcycle }> {
  formData.set("_method", "PUT");
  return await adminFetch<{ data: Motorcycle }>(`/motorcycles/${id}`, {
    method: "POST",
    body: formData,
    headers: {},
  });
}

export async function deleteModel(id: number | string): Promise<void> {
  await adminFetch(`/motorcycles/${id}`, {
    method: "DELETE",
  });
}

export function toFormData(values: ModelFormData): FormData {
  const fd = new FormData();
  fd.set("name", values.name);
  if (values.slug) {
    fd.set("slug", values.slug);
  }
  fd.set("brand_id", String(values.brand_id));
  fd.set("price_from", String(values.price_from));
  fd.set("engine_cc", String(values.engine_cc));
  fd.set("power_hp", String(values.power_hp));
  if (values.summary) {
    fd.set("summary", values.summary);
  }
  fd.set("is_featured", values.is_featured ? "1" : "0");
  fd.set("is_published", values.is_published ? "1" : "0");

  if (values.image instanceof File) {
    fd.set("image", values.image);
  }

  return fd;
}
