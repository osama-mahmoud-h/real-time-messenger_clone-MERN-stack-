
import mongoose,{ Schema } from 'mongoose';
import {IMessage} from "../types/message";
const MessageSchema = new Schema<IMessage>({
    senderId: { type: String, required: true },
    senderName: { type: String, required: true },
    receiverId: { type: String, required: true },
    message: {
        text: { type: String, required: true },
        image: { type: String,  },
    },
    status: { type: String, required: true },
    createdAt: { type: Date, required: true , default: Date.now()},
    updatedAt: { type: Date, required: true, default: Date.now() },
});

MessageSchema.index({ senderId: 1, receiverId: 1 });
MessageSchema.index({ createdAt: 1 });

export const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);