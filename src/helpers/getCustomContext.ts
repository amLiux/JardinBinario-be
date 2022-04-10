import { Request } from 'express';
import { v4 } from 'uuid';
import { CustomContext, TaggedContext } from '../types/sharedTypes';
import { verifyJWT } from './authFunctions';

export const getCustomContext = async (req:Request):Promise<CustomContext> => {
	const token = req.headers['authorization'] || '';
	const taggedContext = initContextTagging();

	if(!token) {
		return taggedContext;
	}

	try {
		const User = await verifyJWT(token);

		if (!User) {
			throw new Error('Not a valid user');
		}

		return {
			User,
			...taggedContext
		};

	} catch(err) {
		console.error(err);
		throw new Error('There was an issue validating the JWT');
	}

};

const initContextTagging = ():TaggedContext => {
	const requestId = v4();
	
	return {
		requestId,
	};
}
