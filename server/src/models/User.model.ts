import mongoose from 'mongoose';
import {IUser} from "../types/user";

const UserSchema = new mongoose.Schema<IUser>({
    userName: { type: String, required: true },
    password: { type: String, required: true },
    image: { type: String },
    email: { type: String, required: true },
    timestamp: { type: Date, required: true , default: Date.now()},
});

export const UserModel = mongoose.model<IUser>("User", UserSchema);