import { ErrorRequestHandler } from "express";


const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.log(`PATH: ${req.path}`, err);
    return res.status(500).json({
        success: false,
        server_response: 'Something went wrong',
    });
}
