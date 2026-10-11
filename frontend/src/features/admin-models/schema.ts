import { z } from "zod";

export const modelSchema = z.object({
  name: z.string().min(1, "Name is required").max(120, "Name must be at most 120 characters"),
  slug: z
    .string()
    .regex(/^[a-z0-9-_]*$/, "Slug may only contain lowercase letters, numbers, hyphens, and underscores")
    .max(140, "Slug must be at most 140 characters")
    .optional()
    .or(z.literal("")),
  brand_id: z.coerce.number().int().positive("Brand is required"),
  price_from: z.coerce
    .number()
    .min(0, "Price must be at least 0")
    .max(9999999.99, "Price cannot exceed 9,999,999.99"),
  engine_cc: z.coerce
    .number()
    .int()
    .min(0, "Engine CC must be at least 0")
    .max(10000, "Engine CC cannot exceed 10000"),
  power_hp: z.coerce
    .number()
    .int()
    .min(1, "Power must be at least 1 HP")
    .max(2000, "Power cannot exceed 2000 HP"),
  summary: z.string().max(2000, "Summary cannot exceed 2000 characters").optional().or(z.literal("")),
  image: z.any().optional(),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(true),
});

export type ModelFormData = z.infer<typeof modelSchema>;
