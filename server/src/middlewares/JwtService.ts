import jwt, { Secret, JwtPayload } from "jsonwebtoken";

/**
 * Service for decoding JWT tokens.
 */
export class JwtService {
    /**
     * Decodes a JWT token and returns the payload.
     * @param token - The JWT token to decode.
     * @returns The decoded payload if the token is valid, otherwise null.
     */
    public static decodeToken = (token: string): JwtPayload | null => {
        try {
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET as Secret) as JwtPayload;
            return decodedToken;
        } catch (error) {
            return null;
        }
    };
}