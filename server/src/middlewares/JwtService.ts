import jwt, { Secret, JwtPayload } from "jsonwebtoken";

export class JwtService{
    public static decodeToken = (token: string): JwtPayload | null => {
        try {
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET as Secret) as JwtPayload;
            // console.log("🚀 ~ file: Auth.ts:100 ~ Auth ~ decodedToken:", decodedToken);
            return decodedToken;
        } catch (error) {
            return null;
        }
    };

}