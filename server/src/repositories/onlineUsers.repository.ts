export class OnlineUsers {
    private static instance: OnlineUsers;
    private socketIdsUserIdsMap: Map<string, string>;
    private userIdsSocketIdsMap: Map<string, string>;

    private constructor() {
        this.socketIdsUserIdsMap = new Map();
        this.userIdsSocketIdsMap = new Map();
    }

    public static getInstance(): OnlineUsers {
        if (!OnlineUsers.instance) {
            OnlineUsers.instance = new OnlineUsers();
        }
        return OnlineUsers.instance;
    }

    private removeAllOnlineUsers(): boolean {
        try {
            this.socketIdsUserIdsMap.clear();
            this.userIdsSocketIdsMap.clear();
            return true;
        } catch (err) {
            return false;
        }
    }

    public async registerNewUser(socketId: string, userId: string): Promise<boolean> {
        try {
            this.socketIdsUserIdsMap.set(socketId, userId);

            this.userIdsSocketIdsMap.set(userId, socketId);

            return true;
        } catch (err) {
            console.log("registerNewUser: err: ", err);
            return false;
        }
    }

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
    }

    public async getSocketId(userId: string): Promise<string | null> {
        try {
            const sockets = this.userIdsSocketIdsMap.get(userId) as string;
            return sockets; // Return the first socketId, or null if none
        } catch (err) {
            console.log("getSocketId: err: ", err);
            return null;
        }
    };

    public getUsersIds = async()=>{
        const usersIds = Array.from(this.userIdsSocketIdsMap.keys());
        return usersIds;
    };

    public isUserOnline = async(userId:string)=>{
        const socketId = this.userIdsSocketIdsMap.get(userId);
        return !!socketId;
    };

    public async getOnlineUsersCount(): Promise<number> {
        try {
            return this.userIdsSocketIdsMap.size;
        } catch (err) {
            console.log("getOnlineUsersCount: err: ", err);
            return -1;
        }
    }
}
