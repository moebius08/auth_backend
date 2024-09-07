import { ErrorRequestHandler, Response } from "express";
import { HTTP_STATUS } from "../constants/http";
import { z } from "zod";

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

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.log(`PATH: ${req.path}`, err);

    if (err instanceof z.ZodError) {
        return handleZodError(res, err);
    }
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        server_response: 'Something went wrong',
    });
}

export default errorHandler;