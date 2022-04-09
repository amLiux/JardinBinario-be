import { UserModel } from '../models/User';
import { User } from '../types/sharedTypes';
import { sign, verify } from 'jsonwebtoken';

interface UserInput {
	userInput: {
		name: User['name'];
		email: User['email'];
		lastName: User['lastName'];
		password: User['password'];
	}
}

interface AuthInput {
	authInput: {
		email: User['email'];
		password: User['password'];
	}
}

interface Token {
	token: string;
}

// TODO, abstract this into a different file and write unit tests
const findUserByEmail = async (email: string): Promise<User | undefined> => {
	const User = await UserModel.findOne({ email });
	if (!User) {
		return undefined;
	}
	return User;
}

const generateJWT = async ({name, lastName, id, email}: User, privateKey: string, expiration: string): Promise<Token['token']> => {
	try {
		const jwt = await sign({name, lastName, id, email}, privateKey, {
			expiresIn: expiration,
		});
		return jwt;
	} catch (err) {
		console.error(err);
		throw new Error('There was an issue creating the JWT');
	}
};

export const resolvers = {
	Query: {
		getUserInfo: async (_:any, {token}:Record<string, string>): Promise<User> => {
			try {
				const payload = await verify(token, String(process.env.PRIVATE_KEY));
				return payload as User;
			} catch (err) {
				console.error(err);
				throw new Error('There was an error trying to verify your JWT');
			}
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

			if (!User.checkPassword(password)) {
				throw new Error('Incorrect password!');
			}

			const token = await generateJWT(User, String(process.env.PRIVATE_KEY), String(process.env.EXPIRATION_TIME));

			return {
				token,
			};
		},
	},
};