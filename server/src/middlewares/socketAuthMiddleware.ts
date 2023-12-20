import {Socket} from "socket.io";
import {JwtService} from "./JwtService";

/**
 * Middleware for socket authentication.
 */
export class SocketAuthMiddleware {
    /**
     * Verifies the token provided in the socket handshake and attaches the decoded user ID to the socket data.
     * @param socket - The socket object.
     * @param next - The callback function to proceed to the next middleware.
     */
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