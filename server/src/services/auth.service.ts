import {BadRequestError} from "../errors/BadRequestError";
import jwt from "jsonwebtoken";
import {UserModel} from "../models/User.model";
import {NotFoundError} from "../errors/NotFoundError";
import bcrypt from "bcrypt";
import fs from "fs";

export class AuthService {
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

        // if (image) {
        //     //generate random number
        //     const random = Math.floor(Math.random() * 10e9);
        //     //new unique name
        //     image.newFilename = random + image.originalFilename;
        //     //new path
        //     const newPath = __dirname + '/../client/build/uploads/images/' + image.newFilename;

        //     const fileCopying = await new Promise((fill, reject) => {
        //         fs.copyFile(image.filepath, newPath, (err) => {
        //             if (err)
        //                 reject("image uploading error");
        //             fill("copied successfully");
        //         })
        //     });
        // }

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