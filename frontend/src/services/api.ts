import { getApiBaseUrl } from "@/lib/env";
import { HttpStatus } from "@/lib/http";
import type { Brand, Motorcycle, LocationItem, Promotion } from "@/types/api";

export type { Brand, Motorcycle, LocationItem, Promotion };

const API_BASE_URL = getApiBaseUrl();

async function fetchApi<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      if (res.status !== HttpStatus.NOT_FOUND) {
        // API error handled gracefully by caller error states
      }
      return null;
    }
    const json = await res.json();
    return json.data ?? json;
  } catch {
    return null;
  }
}

export async function getBrands(): Promise<Brand[]> {
  const data = await fetchApi<Brand[]>("/brands");
  return data || [];
}

export async function getFeaturedMotorcycles(): Promise<Motorcycle[]> {
  const data = await fetchApi<Motorcycle[]>("/motorcycles?featured=1");
  return data || [];
}

export async function getLocations(): Promise<LocationItem[]> {
  const data = await fetchApi<LocationItem[]>("/locations");
  return data || [];
}

export async function getPromotions(): Promise<Promotion[]> {
  const data = await fetchApi<Promotion[]>("/promotions");
  return data || [];
}
