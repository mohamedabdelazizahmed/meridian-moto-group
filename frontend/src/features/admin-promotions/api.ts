import { adminFetch } from "@/lib/api/admin-client";
import type { Promotion } from "@/types/api";
import { PromotionFormData } from "./schema";

export interface PaginatedResponse<T> {
  data: T[];
  links?: { first?: string; last?: string; prev?: string; next?: string };
  meta?: { current_page: number; last_page: number; per_page: number; total: number };
}

export async function listPromotions(): Promise<Promotion[]> {
  const res = await adminFetch<{ data: Promotion[] } | Promotion[]>("/promotions");
  return Array.isArray(res) ? res : res.data || [];
}

export async function getPromotion(id: number | string): Promise<{ data: Promotion }> {
  return await adminFetch<{ data: Promotion }>(`/promotions/${id}`);
}

export async function createPromotion(formData: FormData): Promise<{ data: Promotion }> {
  return await adminFetch<{ data: Promotion }>(`/promotions`, {
    method: "POST",
    body: formData,
  });
}

export async function updatePromotion(id: number | string, formData: FormData): Promise<{ data: Promotion }> {
  formData.set("_method", "PUT");
  return await adminFetch<{ data: Promotion }>(`/promotions/${id}`, {
    method: "POST",
    body: formData,
  });
}

export async function deletePromotion(id: number | string): Promise<void> {
  await adminFetch(`/promotions/${id}`, {
    method: "DELETE",
  });
}

export function toFormData(values: PromotionFormData): FormData {
  const fd = new FormData();
  fd.set("brand_id", String(values.brand_id));
  fd.set("title", values.title);
  if (values.description) {
    fd.set("description", values.description);
  }
  fd.set("starts_at", values.starts_at);
  fd.set("ends_at", values.ends_at);
  fd.set("is_published", values.is_published ? "1" : "0");

  if (values.image instanceof File) {
    fd.set("image", values.image);
  }

  return fd;
}
