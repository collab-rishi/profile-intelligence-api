import { Request, Response } from "express";
import { ProfileService } from "../services/profile.service";
import { asyncHandler } from "../utils/asyncHandler";
import prisma from "../db";

export class ProfileController {
 
  static createProfile = asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.body; 

   
    const existingProfile = await prisma.profile.findUnique({
      where: { name },
    });

    if (existingProfile) {
       res.status(200).json({
        status: "success",
        message: "Profile already exists",
        data: existingProfile,
      });
      return;
    }

   
    const newProfile = await ProfileService.createProfile(name);

    res.status(201).json({
      status: "success",
      data: newProfile,
    });
    return;
  });

  
  static getAllProfiles = asyncHandler(async (req: Request, res: Response) => {
    const profiles = await ProfileService.getAllProfiles(req.query);
    
     res.status(200).json({
      status: "success",
      count: profiles.length,
      data: profiles,
    });
    return;
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
}