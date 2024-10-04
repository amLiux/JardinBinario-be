import { UserModel } from "../models/User";
import { User } from "../types/sharedTypes";

export const findUserById = async (id: string): Promise<User | undefined> => {
  const User = await UserModel.findById(id);

  return User ?? undefined;
};
