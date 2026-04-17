import { z } from "zod";


export const CreateProfileSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name parameter is required" })
    .trim()
    .transform((val) => val.toLowerCase()),
});

export const ProfileFilterSchema = z.object({
  gender: z.string().trim().toLowerCase().optional(),
  country_id: z.string().trim().toUpperCase().optional(),
  age_group: z.enum(["child", "teenager", "adult", "senior"]).optional(),
});


export const IdParamSchema = z.object({
  id: z.string().uuid({ message: "Invalid ID format" }),
});


export type CreateProfileInput = z.infer<typeof CreateProfileSchema>;
export type ProfileFilters = z.infer<typeof ProfileFilterSchema>;
export type IdParam = z.infer<typeof IdParamSchema>;