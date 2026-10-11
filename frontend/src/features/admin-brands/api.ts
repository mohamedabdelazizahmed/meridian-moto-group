import { adminFetch } from "@/lib/api/admin-client";
import type { Brand } from "@/types/api";
import { BrandFormData } from "./schema";

export async function listBrands(): Promise<Brand[]> {
  const res = await adminFetch<{ data: Brand[] } | Brand[]>("/brands");
  return Array.isArray(res) ? res : res.data || [];
}

export async function createBrand(formData: FormData): Promise<{ data: Brand }> {
  return await adminFetch<{ data: Brand }>("/brands", {
    method: "POST",
    body: formData,
  });
}

export async function updateBrand(id: number | string, formData: FormData): Promise<{ data: Brand }> {
  formData.set("_method", "PUT");
  return await adminFetch<{ data: Brand }>(`/brands/${id}`, {
    method: "POST",
    body: formData,
  });
}

export async function deleteBrand(id: number | string): Promise<void> {
  await adminFetch(`/brands/${id}`, {
    method: "DELETE",
  });
}

export function toFormData(values: BrandFormData): FormData {
  const fd = new FormData();
  fd.set("name", values.name);
  if (values.slug) fd.set("slug", values.slug);
  fd.set("segment", values.segment);
  if (values.tagline) fd.set("tagline", values.tagline);
  if (values.description) fd.set("description", values.description);
  fd.set("accent_color", values.accent_color);
  fd.set("is_active", values.is_active ? "1" : "0");

  if (values.logo instanceof File) {
    fd.set("logo", values.logo);
  }
  if (values.hero_image instanceof File) {
    fd.set("hero_image", values.hero_image);
  }

  return fd;
}
