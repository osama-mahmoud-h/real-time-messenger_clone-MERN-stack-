import {IMessage} from "../types/message";
import {MessageModel} from "../models/Message.model";


export class MessageRepository{
    /**
     * Saves a new message in the database.
     * @param data - The data of the message to be saved.
     * @returns A promise that resolves to the saved message.
     */
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

    /**
     * Retrieves the conversation messages between two users.
     * 
     * @param senderId - The ID of the sender user.
     * @param receiverId - The ID of the receiver user.
     * @returns A promise that resolves to an array of IMessage objects representing the conversation messages.
     */
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