import {Request, Response, NextFunction} from "express";
import {ErrorHandler} from "./ErrorHandler";
import {UnauthorizedError} from "../errors/UnauthorizedError";
import {JwtService} from "./JwtService";

/**
 * Middleware for user authentication.
 */
export class UserAuthMiddleware {
    /**
     * Verifies the user token and sets the current user in the request object.
     * @param req - The request object.
     * @param res - The response object.
     * @param next - The next function to call.
     * @returns The next function or an error handler.
     */
    static verifyToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies?._token;
            if (!token) {
                throw new UnauthorizedError("unauthorized user");
            }
            const decoded: any =  JwtService.decodeToken(token);
            if (!decoded) {
                throw new UnauthorizedError("unauthorized user");
            }

            const currentUser = {
                id: decoded.id,
                email: decoded.email,
                userName: decoded.userName
            };
            req.user = currentUser;
            next();
        } catch (err: any) {
            return ErrorHandler.handle(err, req, res);
        }
    };
}