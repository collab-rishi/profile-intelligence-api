import { z } from "zod";


export const GenderizeSchema = z.object({
  gender: z
    .string()
    .nullable()
    .refine((val) => val !== null, {
      message: "Genderize returned an invalid response",
    }),
  probability: z.number(),
  count: z.number().gt(0, "Genderize returned an invalid response"),
});


export const AgifySchema = z.object({
  age: z
    .number()
    .nullable()
    .refine((val) => val !== null, {
      message: "Agify returned an invalid response",
    }),
});


export const NationalizeSchema = z.object({
  country: z
    .array(
      z.object({
        country_id: z.string(),
        probability: z.number(),
      })
    )
    .min(1, "Nationalize returned an invalid response"),
});

export type GenderizeData = z.infer<typeof GenderizeSchema>;
export type AgifyData = z.infer<typeof AgifySchema>;
export type NationalizeData = z.infer<typeof NationalizeSchema>;