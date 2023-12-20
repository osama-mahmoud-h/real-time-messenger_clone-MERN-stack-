export interface IMessage{
    senderId: string;
    senderName: string;
    receiverId: string;
    message: {
        text: string;
        image: string;
    };
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
}
