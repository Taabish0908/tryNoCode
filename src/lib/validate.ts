// import Joi from 'joi';
// import { Request, Response, NextFunction } from 'express';
// import { ApiError } from './apiError';  // Assuming the ApiError class is here

// const validate = (schema: { body?: any; params?: any; query?: any }) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     // Validate the request body, params, and query
//     const validSchema = {} as { body?: any; params?: any; query?: any };
//     if (schema.body) validSchema.body = schema.body;
//     if (schema.params) validSchema.params = schema.params;
//     if (schema.query) validSchema.query = schema.query;

//     const objectToValidate = {} as { body?: any; params?: any; query?: any };
//     if (validSchema.body) objectToValidate.body = req.body;
//     if (validSchema.params) objectToValidate.params = req.params;
//     if (validSchema.query) objectToValidate.query = req.query;

//     // Perform validation
//     const { error, value } = Joi.object(validSchema).validate(objectToValidate, {
//       abortEarly: false, // This ensures all errors are caught at once, not just the first one
//     });

//     if (error) {
//       // Join validation error messages and send a Bad Request response
//       const errorMessage = error.details.map((details) => details.message).join(', ');
//       return next(new ApiError(400, errorMessage, 'VALIDATION_ERROR'));
//     }

//     // Assign validated values to request object
//     Object.assign(req, value);

//     next();
//   };
// };

// export default validate;

import { Request, Response, NextFunction } from "express";
import Joi from "joi";
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      res.status(400).json({ message: "Validation error", errors });
      return;
    }
    next();
  };
};

export const validateQueryParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      res.status(400).json({ message: "Validation error", errors });
      return
    }
    req.query = value;
    next();
  };
};
