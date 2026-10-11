import type { components } from "./api.d";

export type Schemas = components["schemas"];

export interface Brand {
  id?: number;
  name: string;
  slug: string;
  segment?: string;
  tagline?: string;
  description?: string;
  accent_color?: string;
  logo_url?: string;
  hero_image_url?: string;
  is_active?: boolean;
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
  is_published?: boolean;
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
  description?: string;
  image_url?: string;
  starts_at?: string;
  ends_at?: string;
  code?: string;
  discount_percentage?: number;
  is_published?: boolean;
  brand?: Brand;
}

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "data_entry";
  brands?: Brand[];
};

export type RoleName = "admin" | "data_entry";
export type ValidationError = Schemas["ValidationError"];
export type AuthResponse = Schemas["AuthResponse"];
