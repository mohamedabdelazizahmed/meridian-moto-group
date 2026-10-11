import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().min(1, "Name is required").max(80, "Max 80 characters"),
  slug: z.string().regex(/^[a-z0-9-_]*$/, "Invalid slug format").max(100).optional().or(z.literal("")),
  segment: z.string().min(1, "Segment is required").max(80, "Max 80 characters"),
  tagline: z.string().max(160, "Max 160 characters").optional().or(z.literal("")),
  description: z.string().max(2000, "Max 2000 characters").optional().or(z.literal("")),
  accent_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be valid hex color (#RRGGBB)"),
  logo: z.any().optional(),
  hero_image: z.any().optional(),
  is_active: z.boolean().default(true),
});

export type BrandFormData = z.infer<typeof brandSchema>;
