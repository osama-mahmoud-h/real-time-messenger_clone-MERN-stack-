import {Request, Response} from "express";
import {ErrorHandler} from "../middlewares/ErrorHandler";
import {sendSuccessResponse} from "../utils/JsonResponse";
import {AuthService} from "../services/auth.service";
import jwt from "jsonwebtoken";
import {IncomingForm, Fields, Files} from 'formidable';
import {UserModel} from "../models/User.model";

export class AuthController {
   
    /**
     * Logs in a user.
     * 
     * @param req - The request object.
     * @param res - The response object.
     * @returns A success response with the user's information and token if login is successful, or an error response if there is an error.
     */
    static login = async (req: Request, res: Response) => {
        try {
            const {email, password} = req.body;
            const user = await AuthService.login(email, password);
            const payload: any = {
                id: user._id,
                userName: user.userName,
                email: user.email
            };
            const token = await new Promise<string>((resolve, reject) => {
                jwt.sign(
                    payload,
                    process.env.TOKEN_SECRET as string,
                    {expiresIn: "5d"},
                    (err: any, token: any) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(token as string);
                        }
                    }
                );
            });

            res.cookie("_token", token, {
                maxAge: 1000 * 60 * 60 * 24 * 10, // 10 days
                httpOnly: true,
                // secure: true, // enable this in production for HTTPS
            });

            return sendSuccessResponse(res, 200, "user logged in successfully", {
                userName: user.userName,
                email: user.email,
                id: user._id,
                image: user.image,
                token: token
            });
        } catch (err: any) {
            return ErrorHandler.handle(err, req, res);
        }
    };

    /**
     * Registers a new user.
     * 
     * @param req - The request object.
     * @param res - The response object.
     * @returns The response with the registered user's details.
     */
    static register = async (req: Request, res: Response) => {
        try {
            const formData = new IncomingForm();

            // Define the type for the formFields
            type FormFields = {
                fields: Fields;
                files: Files;
            };

            const formFields: FormFields = await new Promise((resolve, reject) => {
                formData.parse(req, (err, fields, files) => {
                    if (err) {
                        reject("Something went wrong");
                        return;
                    }
                    resolve({fields, files});
                });
            });

            const {
                userName,
                email,
                password,
                confirmPassword
            } = formFields.fields as any;

            const {image} = formFields.files as any;

            const saveUser = await AuthService.register(userName, email, password, confirmPassword, image);
            return sendSuccessResponse(res, 200, "user registered successfully", {
                "userName": saveUser.userName,
                "email": saveUser.email,
                "image": saveUser.image || "",
                "id": saveUser._id
            });
        } catch (err: any) {
            console.log(" register err", err);
            return ErrorHandler.handle(err, req, res);
        }
    };

    /**
     * Logout user by clearing the authentication token cookie.
     * @param req - The request object.
     * @param res - The response object.
     * @returns A success response indicating that the user has been logged out successfully.
     */
    static logout = async (req: Request, res: Response) => {
        try {
            res.clearCookie('_token');
            return sendSuccessResponse(res, 200, "logged out successfully", {});
        } catch (err: any) {
            return ErrorHandler.handle(err, req, res);
        }
    };

    /**
     * Retrieves user information based on the authenticated user's ID.
     * @param req - The request object.
     * @param res - The response object.
     * @returns A success response with the user information if found, or an error response if not found.
     */
    static getUserInfo = async (req: Request, res: Response) => {
        try {
            const id = req.user?.id;
            const user = await UserModel.findById(id);
            if (!user) {
                throw new Error("user not found");
            }
            return sendSuccessResponse(res, 200, "user found", {
                "userName": user.userName,
                "email": user.email,
                "id": user._id,
                "image": user.image,
            });
        } catch (err: any) {
            console.log("get user info err: ", err);
            return ErrorHandler.handle(err, req, res);
        }
    };
}