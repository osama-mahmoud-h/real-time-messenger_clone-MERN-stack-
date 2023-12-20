import {Request, Response, NextFunction} from "express";
import {ErrorHandler} from "./ErrorHandler";
import {UnauthorizedError} from "../errors/UnauthorizedError";
import {JwtService} from "./JwtService";

export class UserAuthMiddleware {
    static verifyToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies?._token;
            if (!token) {
                throw new UnauthorizedError("unauthorized user");
            }
            const decoded: any = await JwtService.decodeToken(token);
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