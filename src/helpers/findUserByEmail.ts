import { UserModel } from "../models/User";
import { User } from "../types/sharedTypes";

export const findUserByEmail = async (
  email: string
): Promise<User | undefined> => {
  const User = await UserModel.findOne({ email, active: true });

  return User ?? undefined;
};
