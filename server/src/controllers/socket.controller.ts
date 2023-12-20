
import { Server, Socket } from "socket.io";
import {OnlineUsers} from "../repositories/onlineUsers.repository";
import {MessageRepository} from "../repositories/message.repository";
import {IMessage} from "../types/message";
import {UserRepository} from "../repositories/user.repository";
import {IUser} from "../types/user";
import { SocketEventHandler } from "../webSockets/socketHandlers";
/**
 * SocketController class handles socket events and emits messages to the sender and receiver.
 */
export class SocketController{
    private static readonly onlineUsers = OnlineUsers.getInstance();

    /**
     * Handles the "getConversation" event from the socket and emits the conversation messages to the sender and receiver.
     * 
     * @param io - The Socket.IO server instance.
     * @param socket - The Socket.IO socket instance.
     */
    static handleGetConversation = async (io:Server,socket:Socket)=>{
        socket.on("getConversation",async (data:any)=>{            
            const senderId=data.senderId;
            const receiverId=data.receiverId;
            
            const conversation = await MessageRepository.getConversationMessages(senderId,receiverId);
            //emit to sender
            await this.emitConversation(io,socket,senderId,data,conversation);
            //emit to receiver
            await this.emitConversation(io,socket,receiverId,data,conversation);
        });
    };

    /**
     * Emits a conversation to a specific user through a socket.
     * 
     * @param io - The socket.io server instance.
     * @param socket - The socket connection.
     * @param userId - The ID of the user receiving the conversation.
     * @param data - Additional data related to the conversation.
     * @param conversation - The conversation messages to be sent.
     */
    static emitConversation = async (io: Server, socket: Socket, userId: string, data: any, conversation: IMessage[]) => {
        const socketReceiverId = await this.onlineUsers.getSocketId(userId);
        if (!socketReceiverId) return;

        const conversationData: any = {
            senderId: data?.senderId,
            receiverId: data?.receiverId,
            message: Array.from(conversation).reverse()
        };

        io.to(socketReceiverId).emit("Messages-Get-Success", conversationData);
    };

    /**
     * Emits the active users to the specified socket.
     * @param socket - The socket to emit the active users to.
     */
    static emitActiveUsers = async (socket:Socket)=>{
        const activeUsersIds = await this.onlineUsers.getUsersIds();
        socket.emit("get_active_users",activeUsersIds);
    };

    /**
     * Handles the event when a private message is sent.
     * 
     * @param io - The server instance.
     * @param socket - The socket instance.
     */
    static handlePrivateMessage = async (io:Server,socket:Socket)=>{
        socket.on("sendPrivateMessage",async (data:any)=>{
            try {
                if(data?.message){
                    const saved =  await MessageRepository.saveMessage(data);
                    await this.emitNewPrivateMessage(io,socket,data.senderId,data);
                    await this.emitNewPrivateMessage(io,socket,data.receiverId,data);
                }
            } catch (err:any) {
                console.log("🚀 ~ file: socket.controller.ts:49 ~ SocketController ~ socket.on ~ err:", err)
            }
           
        });
    };

    /**
     * Emits a new private message to the specified user.
     * 
     * @param io - The Socket.IO server instance.
     * @param socket - The Socket.IO socket instance.
     * @param userId - The ID of the user receiving the message.
     * @param data - The data of the message to be sent.
     */
    static emitNewPrivateMessage = async (io:Server, socket:Socket, userId:string, data:any)=>{
        const socketId = await this.onlineUsers.getSocketId(userId);
        if(!socketId) return;
        const message:any = {
            message : data.message,
            senderId : data.senderId,
            receiverId : data.receiverId
        };
        io.to(socketId).emit("message-sent-success",data);

    };

    /**
     * Handles the typing message event.
     * 
     * @param io - The server instance.
     * @param socket - The socket instance.
     */
    static handleTypingMessage = async (io:Server,socket:Socket)=>{
        socket.on("typingMessage",async (data:any)=>{
            const receiverId = data.receiverId;
            await this.emitTypingMessage(io,socket,receiverId,data);
        });

    };

    /**
     * Emits a typing message to a specific user.
     * 
     * @param io - The server instance.
     * @param socket - The socket instance.
     * @param userId - The ID of the user.
     * @param data - The data of the typing message.
     */
    static emitTypingMessage = async (io:Server, socket:Socket,userId:string,data:any)=>{
        const message:any = {
            message : data.message,
            senderId : data.senderId,
            receiverId : data.receiverId
        }
        const socketId = await this.onlineUsers.getSocketId(userId);
        if(!socketId) return;
        io.to(socketId).emit("typingMessageGet",data);
    };

    /**
     * Emits the list of friends to a specific socket and also emits the list of active users.
     * @param socket - The socket to emit the friends list to.
     * @param friends - The list of friends to emit.
     */
    static emitAllFriends = async (socket:Socket,friends:IUser[])=>{
        socket.emit("getFriends_success",friends);
        this.emitActiveUsers(socket);
    };

    /**
     * Handles the "getFriends" event and retrieves all friends for a given user ID.
     * @param io - The Socket.IO server instance.
     * @param socket - The Socket.IO socket instance.
     */
    static handleGetAllFriends = async (io:Server,socket:Socket)=>{
        console.log("getAllFriendsHandler: ");
        socket.on("getFriends",async (myid:any)=>{
            const friends = await UserRepository.getAllFriends(myid);
            console.log("friendssss ",friends.length)
            await this.emitAllFriends(socket,friends);
        });
    };

    /**
     * Emits an error event to the specified socket.
     * @param io - The server instance.
     * @param socket - The socket to emit the error event to.
     * @param error - The error object to emit.
     */
    static emitError = async (io:Server,socket:Socket,error:any)=>{
        socket.emit("error",error);
    };
}