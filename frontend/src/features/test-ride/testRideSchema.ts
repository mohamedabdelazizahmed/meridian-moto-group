import { z } from "zod";

export const testRideSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().min(7, "Please enter a valid phone number").max(25),
  email: z.string().email("Please enter a valid email address"),
  preferred_date: z.string().refine((val) => {
    if (!val) return false;
    const selected = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today;
  }, "Preferred date cannot be in the past"),
  motorcycle: z.string().optional(),
  website: z.string().max(0, "Bot detected").optional(),
});

export type TestRideFormData = z.infer<typeof testRideSchema>;
