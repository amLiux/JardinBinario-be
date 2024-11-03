import { UserModel } from "../models/User";
import { User } from "../types/sharedTypes";

export const getAllUsers = async (): Promise<User[] | undefined> => {
  const Users = await UserModel.find();

  return Users ?? undefined;
};
