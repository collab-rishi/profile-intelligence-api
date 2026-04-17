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
    try {
      // 1. Concurrent API Calls
      const [genderRes, agifyRes, nationalizeRes] = await Promise.all([
        axios.get(`https://api.genderize.io?name=${name}`),
        axios.get(`https://api.agify.io?name=${name}`),
        axios.get(`https://api.nationalize.io?name=${name}`),
      ]);

      
      const genderData = GenderizeSchema.parse(genderRes.data);
      const agifyData = AgifySchema.parse(agifyRes.data);
      const nationalizeData = NationalizeSchema.parse(nationalizeRes.data);

     
      const topCountry = nationalizeData.country.reduce((prev, curr) => 
        curr.probability > prev.probability ? curr : prev
      );

     
      return await prisma.profile.create({
        data: {
          id: generateId(), 
          name: name,
          gender: genderData.gender as string,
          gender_probability: genderData.probability,
          sample_size: genderData.count,
          age: agifyData.age as number,
          age_group: getAgeGroup(agifyData.age as number),
          country_id: topCountry.country_id,
          country_probability: topCountry.probability,
        },
      });
    } catch (error: any) {
      
      if (error.name === "ZodError") {
        throw new ApiError(502, error.issues[0].message);
      }
      
     
      if (axios.isAxiosError(error)) {
        const apiName = error.config?.url?.includes("genderize") ? "Genderize" : 
                        error.config?.url?.includes("agify") ? "Agify" : "Nationalize";
        throw new ApiError(502, `${apiName} returned an invalid response`);
      }

      throw error;
    }
  }


  static async getAllProfiles(filters: any) {
    return await prisma.profile.findMany({
      where: {
        gender: filters.gender,
        country_id: filters.country_id,
        age_group: filters.age_group,
      },
     
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
    const profile = await prisma.profile.findUnique({ where: { id } });
    if (!profile) throw new ApiError(404, "Profile not found");
    return profile;
  }

  static async deleteProfile(id: string) {
    try {
      await prisma.profile.delete({ where: { id } });
    } catch (error) {
      throw new ApiError(404, "Profile not found");
    }
  }
}