import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandlers";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // for wrong mongoDb id
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // for duplicate key
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  // wrong jwt error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again`;
    err = new ErrorHandler(message, 400);
  }

  // jwt expire error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, Try again`;
    err = new ErrorHandler(message, 400);
  }

  // send error response
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

// this needs to be imported in index.ts/server.ts file and pass in as middleware
