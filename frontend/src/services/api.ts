import { getApiBaseUrl } from "@/lib/env";
import { HttpStatus } from "@/lib/http";
import { Result, ok, err } from "@/lib/result";
import type { Brand, Motorcycle, LocationItem, Promotion } from "@/types/api";

export type { Brand, Motorcycle, LocationItem, Promotion };

const API_BASE_URL = getApiBaseUrl();

async function fetchApi<T>(endpoint: string): Promise<Result<T>> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      if (res.status === HttpStatus.NOT_FOUND) {
        return ok([] as unknown as T);
      }
      return err(`API request failed with status ${res.status}`);
    }
    const json = await res.json();
    return ok(json.data ?? json);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Network error";
    return err(message);
  }
}

export async function getBrands(): Promise<Result<Brand[]>> {
  return fetchApi<Brand[]>("/brands");
}

export async function getFeaturedMotorcycles(): Promise<Result<Motorcycle[]>> {
  return fetchApi<Motorcycle[]>("/motorcycles?featured=1");
}

export async function getLocations(): Promise<Result<LocationItem[]>> {
  return fetchApi<LocationItem[]>("/locations");
}

export async function getPromotions(): Promise<Result<Promotion[]>> {
  return fetchApi<Promotion[]>("/promotions");
}
