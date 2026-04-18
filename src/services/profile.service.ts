import axios from "axios";
import prisma from "../db";
import { ApiError } from "../utils/ApiError";
import { 
  GenderizeSchema, 
  AgifySchema, 
  NationalizeSchema 
} from "../validations/external.schema";
import { getAgeGroup, generateId } from "../utils/profileHelpers";

export class ProfileService {
  
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

      // Guard: If nationalize returns no countries, we need a fallback
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
          sample_size: genderData.count || 0,
          age: (agifyData.age as number) || 0,
          age_group: getAgeGroup((agifyData.age as number) || 0),
          country_id: topCountry.country_id,
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

  static async getAllProfiles(filters: any) {
    // Build a clean 'where' object so we don't pass 'undefined' to Prisma
    const whereClause: any = {};
    
    if (filters.gender) whereClause.gender = filters.gender;
    if (filters.country_id) whereClause.country_id = filters.country_id;
    if (filters.age_group) whereClause.age_group = filters.age_group;

    return await prisma.profile.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        gender: true,
        age: true,
        age_group: true,
        country_id: true,
      }
    });
  }

  static async getProfileById(id: string) {
    // Guard: Prevent Prisma findUnique(undefined) crash
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