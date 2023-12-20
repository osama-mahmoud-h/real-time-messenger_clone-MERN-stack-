import { NextFunction, Request, Response } from "express";
import { BaseError } from "../errors/BaseError";

/**
 * Class representing an error handler middleware.
 */
export class ErrorHandler {
    /**
     * Handles the error and sends a JSON response with the error message and status.
     * @param err - The error object.
     * @param req - The request object.
     * @param res - The response object.
     * @param next - The next function.
     * @returns The JSON response with the error message and status.
     */
    public static handle(err: BaseError, req: Request, res: Response, next?: NextFunction) {
        const statusCode = err.statusCode || 500;
        return res.status(statusCode).json({
                message: err.message,
                status: "error",
        });
    }
}