import { sign, verify } from 'jsonwebtoken';
import { Token, User } from '../types/sharedTypes';

export const generateJWT = ({ name, lastName, id, email, avatar }: User): Token['token'] => {
	const jwt = sign({ name, lastName, id, email, avatar }, String(process.env.PRIVATE_KEY), {
		expiresIn: String(process.env.EXPIRATION_TIME),
	});
	return jwt;
};

export const verifyJWT = (token: string): User => {
	const payload = verify(token, String(process.env.PRIVATE_KEY));
	return payload as User;
};
