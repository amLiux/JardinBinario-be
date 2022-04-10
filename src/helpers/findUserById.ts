import { UserModel } from '../models/User';
import { User } from '../types/sharedTypes';

export const findUserById = async (id: string): Promise<User | undefined> => {
	try {
		const User = await UserModel.findById(id);

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