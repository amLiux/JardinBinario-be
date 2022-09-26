import { sign, verify } from 'jsonwebtoken';
import { Token, User } from '../types/sharedTypes';

export const generateJWT = async ({ name, lastName, id, email, avatar }: User, privateKey: string, expiration: string): Promise<Token['token']> => {
	const jwt = await sign({ name, lastName, id, email, avatar }, privateKey, {
		expiresIn: expiration,
	});
	return jwt;
};

export const verifyJWT = async (token: string): Promise<User> => {
	const payload = await verify(token, String(process.env.PRIVATE_KEY));
	return payload as User;
};
