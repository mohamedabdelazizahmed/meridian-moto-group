const API_BASE_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://localhost:8000/api/v1";

export interface Brand {
  id?: number;
  name: string;
  slug: string;
  segment?: string;
  tagline?: string;
  description?: string;
  accent_color?: string;
  logo_url?: string;
}

export interface Motorcycle {
  id?: number;
  name: string;
  slug: string;
  price_from: number;
  engine_cc?: number;
  power_hp?: number;
  torque_nm?: number;
  dry_weight_kg?: number;
  top_speed_kmh?: number;
  acceleration_0_100?: string;
  summary?: string;
  image_url?: string;
  is_featured?: boolean;
  brand?: Brand;
}

export interface LocationItem {
  id?: number;
  name: string;
  type: string;
  city: string;
  address: string;
  phone: string;
  email?: string;
  hours?: string;
  latitude?: number;
  longitude?: number;
}

export interface Promotion {
  id?: number;
  title: string;
  description: string;
  image_url?: string;
  starts_at?: string;
  ends_at?: string;
}

async function fetchApi<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.error(`API error: ${res.status} on ${endpoint}`);
      return null;
    }
    const json = await res.json();
    return json.data ?? json;
  } catch (err) {
    console.error(`Fetch exception on ${endpoint}:`, err);
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
