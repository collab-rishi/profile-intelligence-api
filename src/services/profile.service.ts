import axios from "axios";
import prisma from "../db";
import { ApiError } from "../utils/ApiError";
import { 
  GenderizeSchema, 
  AgifySchema, 
  NationalizeSchema 
} from "../validations/external.schema";
import { Prisma } from "@prisma/client";
import { ProfileFilters } from "../validations/profile.schema";
import { getAgeGroup, generateId } from "../utils/profileHelpers";

export class ProfileService {

  static async createOrFetchProfile(name: string) {
    const existing = await prisma.profile.findUnique({ where: { name } });
    if (existing) return { profile: existing, isNew: false };

    const newProfile = await this.createProfile(name);
    return { profile: newProfile, isNew: true };
  }

  
  
  static async createProfile(name: string) {
    
    if (!name) throw new ApiError(400, "Name parameter is required");

    try {
      const [genderRes, agifyRes, nationalizeRes] = await Promise.all([
        axios.get(`https://api.genderize.io?name=${name}`),
        axios.get(`https://api.agify.io?name=${name}`),
        axios.get(`https://api.nationalize.io?name=${name}`),
      ]);

      const genderData = GenderizeSchema.parse(genderRes.data);
      const agifyData = AgifySchema.parse(agifyRes.data);
      const nationalizeData = NationalizeSchema.parse(nationalizeRes.data);

      
      const topCountry = nationalizeData.country.length > 0 
        ? nationalizeData.country.reduce((prev, curr) => 
            curr.probability > prev.probability ? curr : prev
          )
        : { country_id: "Unknown", probability: 0 };

      return await prisma.profile.create({
        data: {
          id: generateId(), 
          name: name,
          gender: (genderData.gender as string) || "unknown",
          gender_probability: genderData.probability || 0,
          age: (agifyData.age as number) || 0,
          age_group: getAgeGroup((agifyData.age as number) || 0),
          country_id: topCountry.country_id,
          country_name: topCountry.country_id || "Unknown",
          country_probability: topCountry.probability,
        },
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        throw new ApiError(502, `External API validation failed: ${error.issues[0].message}`);
      }
      
      if (axios.isAxiosError(error)) {
        const apiName = error.config?.url?.includes("genderize") ? "Genderize" : 
                        error.config?.url?.includes("agify") ? "Agify" : "Nationalize";
        throw new ApiError(502, `${apiName} returned an invalid response or rate limit hit`);
      }

      throw error;
    }
  }

  static async getAllProfiles(filters: ProfileFilters) {
   const {
      page,
      limit,
      sort_by,
      order,
      ...criteria 
    } = filters;

  
    const skip = (page - 1) * limit;

    
    const where: Prisma.ProfileWhereInput = {
      gender: criteria.gender,
      country_id: criteria.country_id,
      age_group: criteria.age_group,
      age: (criteria.min_age || criteria.max_age) ? {
        gte: criteria.min_age,
        lte: criteria.max_age,
      } : undefined,
      gender_probability: criteria.min_gender_probability ? { gte: criteria.min_gender_probability } : undefined,
      country_probability: criteria.min_country_probability ? { gte: criteria.min_country_probability } : undefined,
    };

    
    const [total, data] = await Promise.all([
      prisma.profile.count({ where }),
      prisma.profile.findMany({
        where,
        skip,
        take: limit,
        orderBy: sort_by ? { [sort_by]: order } : { created_at: "desc" },
      }),
    ]);

    return {
      total,
      data,
      page,
      limit,
    };
  }

  static async getProfileById(id: string) {
    
    if (!id) throw new ApiError(400, "Valid ID is required");

    const profile = await prisma.profile.findUnique({ where: { id } });
    if (!profile) throw new ApiError(404, "Profile not found");
    return profile;
  }

  static async deleteProfile(id: string) {
    if (!id) throw new ApiError(400, "Valid ID is required");
    
    try {
      await prisma.profile.delete({ where: { id } });
    } catch (error) {
      throw new ApiError(404, "Profile not found");
    }
  }
}