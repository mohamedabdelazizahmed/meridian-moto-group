import { z } from "zod";

export const promotionSchema = z.object({
  brand_id: z.coerce.number().int().positive("Marque brand is required"),
  title: z.string().min(1, "Title is required").max(150, "Title cannot exceed 150 characters"),
  description: z.string().max(2000, "Description cannot exceed 2000 characters").optional().nullable(),
  image: z.union([z.instanceof(File), z.string()]).optional().nullable(),
  starts_at: z.string().min(1, "Start date is required"),
  ends_at: z.string().min(1, "End date is required"),
  is_published: z.boolean().default(true),
}).refine((data) => {
  if (data.starts_at && data.ends_at) {
    return new Date(data.ends_at) >= new Date(data.starts_at);
  }
  return true;
}, {
  message: "End date must be after or equal to start date",
  path: ["ends_at"],
});

export type PromotionFormData = z.infer<typeof promotionSchema>;
