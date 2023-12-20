import { CorsOptions } from 'cors';
import http from 'http';
import { Server } from 'socket.io';

/**
 * Represents a socket server for real-time chatting messenger.
 */
class SocketServer {
    private static instance: SocketServer;
    private readonly server: http.Server;
    private readonly io: Server;

    private constructor(server: http.Server,corsOptions: any) {
        this.server = server;
        this.io = new Server(this.server, { cors: corsOptions });
    }

    /**
     * Returns the singleton instance of SocketServer.
     * @param server - The HTTP server instance.
     * @param corsOptions - The CORS options for socket server.
     * @returns The singleton instance of SocketServer.
     */
    public static getInstance = (server: http.Server,corsOptions: CorsOptions): SocketServer =>{
        if (!SocketServer.instance) {
            SocketServer.instance = new SocketServer(server, corsOptions);
        }
        return SocketServer.instance;
    }

    /**
     * Returns the socket.io server instance.
     * @returns The socket.io server instance.
     */
    public getIO = (): Server =>{
        return this.io;
    }
}

export default SocketServer;
