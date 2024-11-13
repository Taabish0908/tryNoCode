export class ApiError extends Error {
    statusCode: number;
    errorCode: string;
    isOperational: boolean;
    stack?: string;
  
    constructor(
      statusCode: number,
      message: string,
      errorCode: string,
      isOperational: boolean = true,
      stack: string = ""
    ) {
      super(message);
      Object.setPrototypeOf(this, ApiError.prototype);
  
      this.statusCode = statusCode;
      this.errorCode = errorCode;
      this.isOperational = isOperational;
  
      if (stack || process.env.NODE_ENV === 'development') {
        this.stack = stack || new Error().stack;
      }
    }
  }
  