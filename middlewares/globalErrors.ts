import { NextFunction, Request, Response } from "express";
import { CustomError } from "../interfaces/customError";

export const globalErrors = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode != null ? err.statusCode : 500;
    err.status = err.status || 'Server Side Error';
    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            message: err.message,
            error: err,
            stack: err.stack
        });
    } else {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
};
