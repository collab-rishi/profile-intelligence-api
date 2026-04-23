import { z } from "zod";

export const CreateProfileSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name parameter is required" })
    .trim()
    .transform((val) => val.toLowerCase()),
});


export const ProfileFilterSchema = z.object({
 
  gender: z.enum(["male", "female"]).optional(),
  country_id: z.string().trim().length(2).toUpperCase().optional(),
  age_group: z.enum(["child", "teenager", "adult", "senior"]).optional(),

  
  min_age: z.coerce.number().int().min(0).optional(),
  max_age: z.coerce.number().int().min(0).optional(),
  min_gender_probability: z.coerce.number().min(0).max(1).optional(),
  min_country_probability: z.coerce.number().min(0).max(1).optional(),

  
  sort_by: z.enum(["age", "created_at", "gender_probability"]).optional(),
  order: z.enum(["asc", "desc"]).default("asc").optional(),

  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const IdParamSchema = z.object({
  id: z.string().uuid({ message: "Invalid ID format" }),
});

export const SearchQuerySchema = z.object({
  q: z.string().min(1, "Query string 'q' cannot be empty"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});


export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export type CreateProfileInput = z.infer<typeof CreateProfileSchema>;
export type ProfileFilters = z.infer<typeof ProfileFilterSchema>;
export type IdParam = z.infer<typeof IdParamSchema>;