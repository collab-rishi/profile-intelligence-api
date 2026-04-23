import { Request, Response } from "express";
import { ProfileService } from "../services/profile.service";
import { asyncHandler } from "../utils/asyncHandler";
import prisma from "../db";
import { ProfileFilters } from "../validations/profile.schema";
import { parseNaturalLanguageQuery } from "../utils/nlpParser";
import { ApiError } from "../utils/ApiError";
export class ProfileController {
 
  static createProfile = asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.body; 

    
    const result = await ProfileService.createOrFetchProfile(name);

    
    const statusCode = result.isNew ? 201 : 200;
    
    res.status(statusCode).json({
      status: "success",
      message: result.isNew ? "Profile created" : "Profile already exists",
      data: result.profile,
    });
  });

  
  static getAllProfiles = asyncHandler(async (req: Request, res: Response) => {
    
    const filters = req.query as unknown as ProfileFilters;
    const result = await ProfileService.getAllProfiles(filters);
    
    
    res.status(200).json({
      status: "success",
      page: result.page,
      limit: result.limit,
      total: result.total,
      data: result.data,
    });
  });

  
  static getProfileById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const profile = await ProfileService.getProfileById(id);
    
     res.status(200).json({
      status: "success",
      data: profile,
    });
    return;
  });

  
  static deleteProfile = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await ProfileService.deleteProfile(id);
    
     res.status(204).send(); 
     return;
  });


  static searchProfiles = asyncHandler(async (req: Request, res: Response) => {
  const { q, page, limit } = req.query;

  if (!q || typeof q !== "string") {
    throw new ApiError(400, "Search query 'q' is required");
  }

  
  const parsedFilters = parseNaturalLanguageQuery(q);

  
  if (Object.keys(parsedFilters).length === 0) {
    throw new ApiError(422, "Unable to interpret search query. Try keywords like 'males', 'young', or 'Nigeria'.");
  }

  
  const finalFilters = {
    ...parsedFilters,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
  } as ProfileFilters;

  const result = await ProfileService.getAllProfiles(finalFilters);

  res.status(200).json({
    status: "success",
    page: result.page,
    limit: result.limit,
    total: result.total,
    data: result.data,
    interpreted_filters: parsedFilters 
  });
});
}