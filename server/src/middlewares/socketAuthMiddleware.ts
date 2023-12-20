import {Socket} from "socket.io";
import {JwtService} from "./JwtService";

export class SocketAuthMiddleware {
    static verifyTokenMiddleware(socket: Socket, next: (err?: Error) => void): void {
        const token = socket.handshake.auth.token;
       // console.log("socket token: ", token);
        if (!token) {
            const error = new Error('Authentication error: Token missing') as any;
            error.data = {message: 'Token missing'};  // You can add additional data if needed
            return next(error);
        }

        const decodedToken = JwtService.decodeToken(token);
        console.log("decodedToken: ", decodedToken?.id)
        if (!decodedToken) {
            const error = new Error('Authentication error: Invalid token') as any;
            error.data = {message: 'Invalid token'};  // You can add additional data if needed
            return next(error);
        }

        socket.data.userId = decodedToken?.id;
        return next();
    }
}