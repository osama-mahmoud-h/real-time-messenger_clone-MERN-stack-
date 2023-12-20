import {IMessage} from "../types/message";
import {MessageModel} from "../models/Message.model";


export class MessageRepository{
    public static saveMessage = async (data: any) => {
        
        const newMessage: IMessage = {
            senderId:data.senderId,
            senderName:data.senderName,
            receiverId:data.receiverId,
            message:{
                text:data.message,
                image:''
            },
            status: "unseen",
            createdAt: new Date(),
            updatedAt: new Date()
        }
        return await MessageModel.create(newMessage);
    };

    public  static  getConversationMessages = async (senderId: string, receiverId: string): Promise<IMessage[]> => {
        const messages = await MessageModel
            .find({
            $and: [
                { $or: [{ senderId: senderId }, { senderId: receiverId }] },
                { $or: [{ receiverId: senderId }, { receiverId: receiverId }] }
            ]
        })
            .limit(100)
            .select({_id: 0, __v: 0})
            .sort({ createdAt: -1 });

        return messages as IMessage[]; // Cast the result to IMessage[] for type safety
    };
}