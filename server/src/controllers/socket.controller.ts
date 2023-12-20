
import { Server, Socket } from "socket.io";
import {OnlineUsers} from "../repositories/onlineUsers.repository";
import {MessageRepository} from "../repositories/message.repository";
import {IMessage} from "../types/message";
import {UserRepository} from "../repositories/user.repository";
import {IUser} from "../types/user";
import { SocketEventHandler } from "../webSockets/socketHandlers";
export class SocketController{
    private static readonly onlineUsers = OnlineUsers.getInstance();

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

    static emitConversation = async (io:Server,socket:Socket,userId:string,data:any,conversation:IMessage[])=>{
        const socketReceiverId = await this.onlineUsers.getSocketId(userId);
        if(!socketReceiverId) return;

        const conversationData:any = {
            senderId:data?.senderId,
            receiverId:data?.receiverId,
            message:Array.from(conversation).reverse()
        };
        
        io.to(socketReceiverId).emit("Messages-Get-Success", conversationData);
    };

    static emitActiveUsers = async (socket:Socket)=>{
        const activeUsersIds = await this.onlineUsers.getUsersIds();
        socket.emit("get_active_users",activeUsersIds);
    };

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

    static handleTypingMessage = async (io:Server,socket:Socket)=>{
        socket.on("typingMessage",async (data:any)=>{
            const receiverId = data.receiverId;
            await this.emitTypingMessage(io,socket,receiverId,data);
        });

    };

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

    static emitAllFriends = async (socket:Socket,friends:IUser[])=>{
        socket.emit("getFriends_success",friends);
        this.emitActiveUsers(socket);
    };
    static handleGetAllFriends = async (io:Server,socket:Socket)=>{
        console.log("getAllFriendsHandler: ");
        socket.on("getFriends",async (myid:any)=>{
            const friends = await UserRepository.getAllFriends(myid);
            console.log("friendssss ",friends.length)
            await this.emitAllFriends(socket,friends);
        });
    };

    static emitError = async (io:Server,socket:Socket,error:any)=>{
        socket.emit("error",error);
    };
}