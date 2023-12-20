import {BadRequestError} from "../errors/BadRequestError";
import jwt from "jsonwebtoken";
import {UserModel} from "../models/User.model";
import {NotFoundError} from "../errors/NotFoundError";
import bcrypt from "bcrypt";
import fs from "fs";

export class AuthService {
    /**
     * Authenticates a user by their email and password.
     * @param email - The user's email.
     * @param password - The user's password.
     * @returns The authenticated user.
     * @throws Error if email or password is not provided.
     * @throws NotFoundError if user is not found.
     * @throws BadRequestError if credentials are invalid.
     */
    static login = async (email: string, password: string) => {
        if (!email) {
            throw new Error('you should provide email')
        }
        if (!password) {
            throw new Error('you should provide password')
        }
        const user = await UserModel.findOne({email: email});
        if (!user) {
            throw new NotFoundError('User Not Found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new BadRequestError('invalid credentials');
        }

        return user;
    };

    /**
     * Registers a new user.
     * 
     * @param userName - The username of the user.
     * @param email - The email of the user.
     * @param password - The password of the user.
     * @param confirmPassword - The confirmation password of the user.
     * @param image - The image of the user.
     * @returns The saved user object.
     * @throws Error if any required field is missing.
     * @throws BadRequestError if the password and confirmPassword do not match or if the password is less than 6 characters.
     * @throws BadRequestError if the email is already taken.
     */
    static register = async (userName: string,
                             email: string,
                             password: string,
                             confirmPassword: string,
                             image: any
    ) => {
        if (!userName || !email || !password || !confirmPassword) {
            throw new Error('you should provide all fileds');
        }
        // if(!validator.isEmail(email)){
        //     throw new Error('not valid email');
        // }
        if (password !== confirmPassword) {
            throw new BadRequestError("password mismatch");
        }
        if (password.length < 6) {
            throw new BadRequestError("password must be more than or equal 6 ");
        }


        //check if user Exists already
        const oldUser = await UserModel.findOne({email: email});
        if (oldUser) {
            throw new BadRequestError("this email already token try diffrent one");
        }

        //hash password
        const salt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new UserModel({
            userName: userName,
            email: email,
            password: hashedPassword,
            image: image?.newFilename ?? ""
        });

        const saveUser = await newUser.save();
        return saveUser;
    };
}