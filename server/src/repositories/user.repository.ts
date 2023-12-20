import {IUser} from "../types/user";
import {UserModel} from "../models/User.model";


export class UserRepository{
    /**
     * Retrieves all friends of a user.
     * @param userId - The ID of the user.
     * @returns A promise that resolves to an array of IUser objects representing the user's friends.
     */
    static getAllFriends = async (userId: string):Promise<IUser[]> => {
      try{
          const friends:IUser[] = await UserModel
              .find({_id:{$ne:userId}})
              .select({password:0})
              .limit(1000)
              .lean();

          return friends;
      } catch (err:any) {
          console.log("getAllFriends: err: ", err);
          return [];
      }
    };
}