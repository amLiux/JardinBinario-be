import { sign, verify } from 'jsonwebtoken';
import { Token, User } from '../types/sharedTypes';

export const generateJWT = async ({name, lastName, id, email}: User, privateKey: string, expiration: string): Promise<Token['token']> => {
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

export const verifyJWT = async (token:string): Promise<User> => {
	try {
		const payload = await verify(token, String(process.env.PRIVATE_KEY));
		return payload as User;
	} catch (err) {
		console.error(err);
		throw new Error('There was an error trying to verify your JWT');
	}
}