import { CorsOptions } from 'cors';
import http from 'http';
import { Server } from 'socket.io';

class SocketServer {
    private static instance: SocketServer;
    private readonly server: http.Server;
    private readonly io: Server;

    private constructor(server: http.Server,corsOptions: any) {
        this.server = server;
        this.io = new Server(this.server, { cors: corsOptions });
    }

    public static getInstance = (server: http.Server,corsOptions: CorsOptions): SocketServer =>{
        if (!SocketServer.instance) {
            SocketServer.instance = new SocketServer(server, corsOptions);
        }
        return SocketServer.instance;
    }

    public getIO = (): Server =>{
        return this.io;
    }
}

export default SocketServer;
