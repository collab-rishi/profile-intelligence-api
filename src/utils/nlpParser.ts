import countries from "i18n-iso-countries";
import { ProfileFilters } from "../validations/profile.schema";


countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

export const parseNaturalLanguageQuery = (query: string): Partial<ProfileFilters> => {
  const normalized = query.toLowerCase().trim();
  const tokens = normalized.split(/\s+/);
  const filters: Partial<ProfileFilters> = {};

 
  if (/\b(male|males|men|man)\b/.test(normalized)) filters.gender = "male";
  if (/\b(female|females|women|woman)\b/.test(normalized)) filters.gender = "female";

  if (normalized.includes("young")) {
    filters.min_age = 16;
    filters.max_age = 24;
  }
  
  if (normalized.includes("child") || normalized.includes("kid")) filters.age_group = "child";
  if (normalized.includes("teenager")) filters.age_group = "teenager";
  if (normalized.includes("adult")) filters.age_group = "adult";
  if (normalized.includes("senior") || normalized.includes("old")) filters.age_group = "senior";

  
  for (const token of tokens) {
    const countryCode = countries.getAlpha2Code(token, "en");
    if (countryCode) {
      filters.country_id = countryCode;
      break; 
    }
  }

  
  const aboveMatch = normalized.match(/(?:above|over|older than)\s+(\d+)/);
  if (aboveMatch) filters.min_age = parseInt(aboveMatch[1], 10);

  const underMatch = normalized.match(/(?:under|below|younger than)\s+(\d+)/);
  if (underMatch) filters.max_age = parseInt(underMatch[1], 10);

  return filters;
};