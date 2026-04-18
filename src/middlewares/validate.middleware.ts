import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";
import { ApiError } from "../utils/ApiError";


export const validate = (schema: ZodType<any, any, any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
  
      const validatedData = await schema.parseAsync({
        ...req.body,
        ...req.query,
        ...req.params,
      });

  
      // if (Object.keys(req.body).length > 0) req.body = validatedData;

      if (req.method != "GET") {
        req.body = validatedData;
      } else {
        req.query = validatedData;
      }
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const firstIssue = error.issues[0];
        
 
        return next(new ApiError(422, firstIssue.message));
      }
      next(error);
    }
  };
};