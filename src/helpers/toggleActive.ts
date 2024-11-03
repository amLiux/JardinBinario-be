import { UserModel } from "../models/User";
import { User } from "../types/sharedTypes";

export const toggleActive = async (
  email: string
): Promise<User | undefined> => {
  const User = await UserModel.findOneAndUpdate(
    { email },
    [{ $set: { active: { $cond: { if: "$active", then: false, else: true } } } }]
  );

  return User ?? undefined;
};
