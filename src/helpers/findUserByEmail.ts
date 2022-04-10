import { UserModel } from '../models/User';
import { User } from '../types/sharedTypes';

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
	try {
		const User = await UserModel.findOne({ email });

		if (!User) {
			return undefined;
			// throw new Error(`There was an issue querying for ${email}`);
		}

		return User;
	} catch(err) {
		console.error(err);
		// throw new Error(`There was an issue querying for ${email}`);
	}
}