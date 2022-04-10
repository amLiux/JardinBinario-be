import { generateJWT, verifyJWT } from '../helpers/authFunctions';
import { findUserByEmail } from '../helpers/findUserByEmail';
import { UserModel } from '../models/User';
import { Token, User } from '../types/sharedTypes';

interface AuthInput {
	authInput: {
		email: User['email'];
		password: User['password'];
	}
}

interface UserInput {
	userInput: {
		name: User['name'];
		email: User['email'];
		lastName: User['lastName'];
		password: User['password'];
	}
}


export const AuthResolvers = {
	Query: {
		getUserInfo: async (_: any, { token }: Record<string, string>): Promise<User> => {
			const payload = await verifyJWT(token);
			return payload;
		},
	},
	Mutation: {
		newUser: async (_: any, { userInput }: UserInput): Promise<User> => {
			const { email } = userInput;
			const User = await findUserByEmail(email);

			if (User) {
				throw new Error(`${email} it's already in use!`)
			}

			try {
				const newUser = await new UserModel(userInput).save();
				return newUser;
			} catch (err) {
				console.error(err);
				throw new Error('There was an issue creating the user.');
			}
		},
		authenticate: async (_: any, { authInput }: AuthInput): Promise<Token> => {
			const { email, password } = authInput;
			const User = await findUserByEmail(email);

			if (!User) {
				throw new Error(`${email} is not registered`);
			}

			if (!User?.checkPassword?.(password)) {
				throw new Error('Incorrect password!');
			}

			const token = await generateJWT(User, String(process.env.PRIVATE_KEY), String(process.env.EXPIRATION_TIME));

			return {
				token,
			};
		},
	}
}