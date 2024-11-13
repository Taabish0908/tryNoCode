import { Request, Response, NextFunction } from "express";
import { ApiError } from "./apiError";
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err);

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      message: err.message,
      errorCode: err.errorCode,
    });
    return;
  }

  res.status(500).json({
    message: "Internal Server Error",
  });
  return;
};

