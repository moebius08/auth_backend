import { ErrorRequestHandler, Response } from "express";
import { HTTP_STATUS } from "../constants/http";
import { z } from "zod";
import AppError from "../utils/AppError";

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

const handleApperror = (res:Response, error:AppError) => {
    return res.status(error.statusCode).json({
        message: error.message,
        errorCode: error.errorCode,
    });
}

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.log(`PATH: ${req.path}`, err);

    if (err instanceof z.ZodError) {
        return handleZodError(res, err);
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
            errorCode: err.errorCode,
        });
    }
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        server_response: 'Something went wrong',
    });
}

export default errorHandler;