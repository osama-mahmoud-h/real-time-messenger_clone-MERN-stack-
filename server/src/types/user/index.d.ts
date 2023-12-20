export interface IUser {
    userName: string;
    email: string;
    password: string; // Ensure this is handled securely
    image: string;

    timestamp?: Date;
}