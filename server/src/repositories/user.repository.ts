import {IUser} from "../types/user";
import {UserModel} from "../models/User.model";


export class UserRepository{
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