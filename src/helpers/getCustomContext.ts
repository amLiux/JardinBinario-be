import { Request } from 'express';
import { v4 } from 'uuid';
import { CustomContext, TaggedContext } from '../types/sharedTypes';
import { verifyJWT } from './authFunctions';
import { Errors, generateErrorObject } from './Logger';

const queriesThatDontRequireAuthentication = [
	'authenticate',
	'introspectionquery',
	'initforgotpassword',
	'finishforgotpassword',
	'anything else'
];

const getQueryName = (body: any): string => {
	let { query: unparsedQuery } = body;
	unparsedQuery = unparsedQuery.trim();
	const type = unparsedQuery.split(" ")[0];

	switch (type) {
		case 'mutation': {
			const queryWithoutType = unparsedQuery.substring(9);
			const toReturn = queryWithoutType.substring(0, queryWithoutType.indexOf('('));
			return toReturn.trim();
		}
		case 'query': {
			const queryWithoutType = unparsedQuery.substring(6).split('\n')[0];
			let toReturn;
			const parenthesis = queryWithoutType.indexOf('(');
			const curlyBrace = queryWithoutType.indexOf('{');

			if(parenthesis > 0 && parenthesis < curlyBrace) {
				toReturn = queryWithoutType.substring(0, queryWithoutType.indexOf('('));
			} else {
				toReturn = queryWithoutType.substring(0, queryWithoutType.indexOf('{'));
			}

			return toReturn.trim();
		}
		default: {
			return '';
		}
	}
};

export const getCustomContext = async (req: Request): Promise<CustomContext> => {
	const token = req.headers['authorization'] || '';
	const query = getQueryName(req.body);
	const taggedContext = initContextTagging(query);

	if (!token) {
		if (queriesThatDontRequireAuthentication.includes(query.toLowerCase())) return taggedContext;
		throw new Error('A verification token is required');
	}

	try {
		const User = await verifyJWT(token);

		if (!User) {
			throw await generateErrorObject(Errors.UNKOWN_USER, 'Not a valid user', taggedContext);
		}

		return {
			User,
			...taggedContext
		};

	} catch (err) {
		throw await generateErrorObject(Errors.INTERNAL_SERVER_ERROR, String(err), taggedContext);
	}

};

const initContextTagging = (query: string): TaggedContext => {
	const requestId = v4();

	return {
		requestId,
		query
	};
}
