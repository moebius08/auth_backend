import { ErrorRequestHandler, Response } from "express";
import { HTTP_STATUS } from "../constants/http";
import { z } from "zod";
import AppError from "../utils/AppError";
import { REFRESH_PATH, clearAuthCookies } from "../utils/cookies";

const handleZodError = (res:Response, error:z.ZodError) => {
    const errors = error.issues.map((err) => ({
        path: err.path.join("."),
        message: err.message,
    }))
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        errors 
    });
}

const handleAppError = (res: Response, error: AppError) => {
    return res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
    });
  };  

  const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    console.log(`PATH ${req.path}`, error);
  
    if (req.path === REFRESH_PATH) {
      clearAuthCookies(res);
    }
  
    if (error instanceof z.ZodError) {
      return handleZodError(res, error);
    }
  
    if (error instanceof AppError) {
      return handleAppError(res, error);
    }
  
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send("Internal server error");
  };
  
  export default errorHandler;