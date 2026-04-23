import { Router } from "express";
import { ProfileController } from "../controllers/profile.controller";
import { validate } from "../middlewares/validate.middleware";
import { 
  CreateProfileSchema, 
  ProfileFilterSchema, 
  IdParamSchema,
  SearchQuerySchema
} from "../validations/profile.schema";

const router = Router();

router.post(
  "/", 
  validate(CreateProfileSchema), 
  ProfileController.createProfile
);

router.get(
  "/search",
  validate(SearchQuerySchema),
  ProfileController.searchProfiles
);

router.get(
  "/", 
  validate(ProfileFilterSchema), 
  ProfileController.getAllProfiles
);

router.get(
  "/:id", 
  validate(IdParamSchema), 
  ProfileController.getProfileById
);

router.delete(
  "/:id", 
  validate(IdParamSchema), 
  ProfileController.deleteProfile
);

export default router;