import * as async_hooks from "async_hooks";

require("dotenv").config({path:"./.env"});

import { Server, Socket } from 'socket.io';
import {OnlineUsers} from "../repositories/onlineUsers.repository";
import { JwtService } from '../middlewares/JwtService';
import {SocketController} from "../controllers/socket.controller";

export class SocketEventHandler {
    private readonly onlineUsers = OnlineUsers.getInstance();

    private static instance: SocketEventHandler;
    private readonly io: Server;

    constructor(io: Server) {
        this.io = io;
        // this.setupEventHandlers();
    }
    public static getInstance(io: Server): SocketEventHandler {
        if (!SocketEventHandler.instance) {
            SocketEventHandler.instance = new SocketEventHandler(io);
        }
        return SocketEventHandler.instance;
    }

    public setupEventHandlers = async()=> {
        this.io.on('connection', async(socket: Socket) => {

            await this.handleConnect(socket);

            socket.on('message', (message: string) => {
                this.handleMessage(socket, message);
            });

            socket.on('disconnect', () => {
                this.handleDisconnect(socket);
            });

            //this.io.to(socket.id).emit("notification","daoooooooooo")
        });
    };

    // public emitNotification = (userId:string, data:any)=>{
    //     const getUserSocketId = this.onlineUsers.getSocketId(userId);
    //     console.log("🚀 ~ file: sockets.ts:34 ~ SocketEventHandler ~ getUserSocketId:",userId, getUserSocketId)
    //     if(getUserSocketId){
    //         this.io.to(getUserSocketId).emit("notification",data);
    //     }
    // };

    private handleSendJwt = (socket: Socket)=>{
        socket.on("my-jwt",(data:any)=>{
            console.log("jwt: ",data);
            const decodedToken = JwtService.decodeToken(data);
            if(decodedToken && decodedToken?._id){
                this.onlineUsers.registerNewUser(socket.id,decodedToken._id);
                const count = this.onlineUsers.getOnlineUsersCount();
                console.log(`Socket.IO client connected (ID: ${socket.id}), userid:${ decodedToken?._id}, count: ${count}`);
            }else{ //send Erorr

            }
            console.log("my-jwt:decodedToken: ",decodedToken?._id,', ',socket.id);
        });
    };

    private handleMessage(socket: Socket, message: string) {
        console.log(`Received: ${message}`);

        // Send a response back to the client
        socket.emit('response', `Server received: ${message}`);
    };



    private handleDisconnect = async (socket: Socket)=> {
        await this.onlineUsers.removeUser(socket.id);
        const count = await this.onlineUsers.getOnlineUsersCount();
        console.log(`Socket.IO client disconnected (ID: ${socket.id}), count: ${count}`);
    }
    private handleConnect = async (socket: Socket)=> {
        await this.onlineUsers.registerNewUser(socket.id,socket.data.userId);
        const count = await this.onlineUsers.getOnlineUsersCount();
        console.log(`Socket.IO (socketid: ${socket.id}), id:${socket.data.userId} , count: ${count}`);

        this.messengerHandler(socket);
    };

    private messengerHandler = async (socket:Socket)=>{
        
        SocketController.handlePrivateMessage(this.io,socket);
        SocketController.handleGetAllFriends(this.io, socket);
        SocketController.handleTypingMessage(this.io, socket)
        SocketController.handleGetConversation(this.io, socket);
    };

    private emitErorr(socket:Socket,error:any){
        socket.emit("error",error);
    }
}