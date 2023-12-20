export class OnlineUsers {
    private static instance: OnlineUsers;
    private socketIdsUserIdsMap: Map<string, string>;
    private userIdsSocketIdsMap: Map<string, string>;

    private constructor() {
        this.socketIdsUserIdsMap = new Map();
        this.userIdsSocketIdsMap = new Map();
    }

    /**
     * Returns the singleton instance of the OnlineUsers repository.
     * If the instance does not exist, it creates a new one.
     * @returns The singleton instance of the OnlineUsers repository.
     */
    public static getInstance(): OnlineUsers {
        if (!OnlineUsers.instance) {
            OnlineUsers.instance = new OnlineUsers();
        }
        return OnlineUsers.instance;
    }

    /**
     * Removes all online users from the repository.
     * @returns {boolean} Returns true if all online users were successfully removed, false otherwise.
     */
    private removeAllOnlineUsers(): boolean {
        try {
            this.socketIdsUserIdsMap.clear();
            this.userIdsSocketIdsMap.clear();
            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * Registers a new user with the given socket ID and user ID.
     * 
     * @param socketId The socket ID of the user.
     * @param userId The user ID of the user.
     * @returns A promise that resolves to a boolean indicating whether the registration was successful.
     */
    public async registerNewUser(socketId: string, userId: string): Promise<boolean> {
        try {
            this.socketIdsUserIdsMap.set(socketId, userId);

            this.userIdsSocketIdsMap.set(userId, socketId);

            return true;
        } catch (err) {
            console.log("registerNewUser: err: ", err);
            return false;
        }
    };

    /**
     * Removes a user from the online users repository based on their socket ID.
     * @param socketId The socket ID of the user to be removed.
     * @returns A promise that resolves to a boolean indicating whether the user was successfully removed.
     */
    public async removeUser(socketId: string): Promise<boolean> {
        try {
            const userId = this.socketIdsUserIdsMap.get(socketId);

            if (userId) {
                this.socketIdsUserIdsMap.delete(socketId);
                this.userIdsSocketIdsMap.delete(userId);
            }
            return true;
        } catch (err) {
            console.log("removeUser: err: ", err);
            return false;
        }
    };

    /**
     * Retrieves the socket ID associated with the given user ID.
     * @param userId The ID of the user.
     * @returns The socket ID of the user, or null if none is found.
     */
    public async getSocketId(userId: string): Promise<string | null> {
        try {
            const sockets = this.userIdsSocketIdsMap.get(userId) as string;
            return sockets; // Return the first socketId, or null if none
        } catch (err) {
            console.log("getSocketId: err: ", err);
            return null;
        }
    };

    /**
     * Retrieves the IDs of all online users.
     * @returns An array of user IDs.
     */
    public getUsersIds = async()=>{
        const usersIds = Array.from(this.userIdsSocketIdsMap.keys());
        return usersIds;
    };

    /**
     * Checks if a user is currently online.
     * @param userId - The ID of the user to check.
     * @returns A boolean indicating whether the user is online or not.
     */
    public isUserOnline = async(userId:string)=>{
        const socketId = this.userIdsSocketIdsMap.get(userId);
        return !!socketId;
    };

    /**
     * Retrieves the count of online users.
     * @returns A promise that resolves to the number of online users.
     */
    public async getOnlineUsersCount(): Promise<number> {
        try {
            return this.userIdsSocketIdsMap.size;
        } catch (err) {
            console.log("getOnlineUsersCount: err: ", err);
            return -1;
        }
    };
}
