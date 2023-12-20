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
    /**
     * Returns the singleton instance of SocketEventHandler.
     * If the instance does not exist, it creates a new one.
     * @param io - The Socket.IO server instance.
     * @returns The singleton instance of SocketEventHandler.
     */
    public static getInstance(io: Server): SocketEventHandler {
        if (!SocketEventHandler.instance) {
            SocketEventHandler.instance = new SocketEventHandler(io);
        }
        return SocketEventHandler.instance;
    }

    /**
     * Sets up event handlers for socket connections.
     * @returns {Promise<void>} A promise that resolves when the event handlers are set up.
     */
    public setupEventHandlers = async()=> {
        this.io.on('connection', async(socket: Socket) => {

            await this.handleConnect(socket);

            socket.on('disconnect', () => {
                this.handleDisconnect(socket);
            });

        });
    };

    /**
     * Handles the incoming message from a socket.
     * @param {Socket} socket - The socket object.
     * @param {string} message - The message received from the client.
     * @returns {void}
     */
    private handleMessage(socket: Socket, message: string) {
        console.log(`Received: ${message}`);

        // Send a response back to the client
        socket.emit('response', `Server received: ${message}`);
    };



    /**
     * Handles the disconnection of a Socket.IO client.
     * Removes the user from the list of online users and logs the disconnection.
     * @param socket - The Socket.IO socket object representing the disconnected client.
     */
    private handleDisconnect = async (socket: Socket)=> {
        await this.onlineUsers.removeUser(socket.id);
        const count = await this.onlineUsers.getOnlineUsersCount();
        console.log(`Socket.IO client disconnected (ID: ${socket.id}), count: ${count}`);
    }
    
    /**
     * Handles the connection event for a socket.
     * Registers the new user with the onlineUsers service, logs the socket information, and invokes the messengerHandler.
     * @param socket - The socket object representing the connection.
     * @returns {Promise<void>} - A promise that resolves when the connection handling is complete.
     */
    private handleConnect = async (socket: Socket)=> {
        await this.onlineUsers.registerNewUser(socket.id,socket.data.userId);
        const count = await this.onlineUsers.getOnlineUsersCount();
        console.log(`Socket.IO (socketid: ${socket.id}), id:${socket.data.userId} , count: ${count}`);

        this.messengerHandler(socket);
    };

    /**
     * Handles the messaging functionality for a socket connection.
     * @param socket - The socket connection.
     */
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