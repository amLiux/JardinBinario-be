import { UserModel } from '../models/User';
import { User } from '../types/sharedTypes';

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
	const User = await UserModel.findOne({ email });

	if (!User) return undefined;

	return User;
}