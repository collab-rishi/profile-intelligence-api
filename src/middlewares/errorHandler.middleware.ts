import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
 let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";


  if (err.code === "P2002") {
    statusCode = 409;
    message = "Record already exists";
  }


  console.error(`[Error] ${statusCode} - ${message}`);


  res.status(statusCode).json({
    status: "error",
    message: message,
  });

   return;
};