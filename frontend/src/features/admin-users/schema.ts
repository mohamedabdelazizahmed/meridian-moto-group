import { z } from "zod";
import { Role } from "@/lib/roles";

export const userSchema = z.object({
  name: z.string().min(1, "Name is required").max(120, "Name must be at most 120 characters"),
  email: z.string().email("Invalid email address").max(255, "Email cannot exceed 255 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, "Password must contain letters and numbers")
    .optional()
    .or(z.literal("")),
  role: z.enum([Role.Admin, Role.DataEntry]),
  brand_ids: z.array(z.number()),
}).refine((data) => {
  if (data.role === Role.DataEntry) {
    return Array.isArray(data.brand_ids) && data.brand_ids.length > 0;
  }
  return true;
}, {
  message: "At least one brand must be assigned for Data Entry users",
  path: ["brand_ids"],
});

export type UserFormData = z.infer<typeof userSchema>;
