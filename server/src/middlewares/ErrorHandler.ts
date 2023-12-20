import { NextFunction, Request, Response } from "express";
import { BaseError } from "../errors/BaseError";

export class ErrorHandler {
    public static handle(err: BaseError, req: Request, res: Response, next?: NextFunction) {
        const statusCode = err.statusCode || 500;
        return res.status(statusCode).json({
                message: err.message,
                status: "error",
        });
    }
}