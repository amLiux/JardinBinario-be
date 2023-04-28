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
	'getspecificblogentry',
	'newticket',
	'newnewsletterentry',
	'getrecententries',
	'getmostviewedentries',
	'getallentriesids',
	'updateblogmetrics',
	'newuserdetailsentry',
	'getmostusedbrowsers'
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

			if (parenthesis > 0 && parenthesis < curlyBrace) {
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

export const getCustomContext = async (req: Request): Promise<CustomContext | TaggedContext> => {
	const token = req.headers?.['authorization'] || '';
	const tokenWithoutBearer = token.replace('Bearer', '').trim();
	const query = req.body?.operationName || getQueryName(req.body);
	const taggedContext = initContextTagging(query);

	if (queriesThatDontRequireAuthentication.includes(query.toLowerCase())) return taggedContext;

	if (!token || tokenWithoutBearer === '') throw new Error('A verification token is required.');

	try {
		const User = verifyJWT(tokenWithoutBearer);

		if (!User) {
			throw await generateErrorObject(Errors.UNKOWN_USER, 'Not a valid user', taggedContext);
		}

		return {
			User,
			...taggedContext
		};

	} catch (err) {
		let error = err as Error;

		if (error.message === 'jwt expired') {
			error = 'Session expired.' as any;
		}

		throw await generateErrorObject(Errors.INTERNAL_SERVER_ERROR, String(error), taggedContext);
	}

};

const initContextTagging = (query: string): TaggedContext => {
	const requestId = v4();

	return {
		requestId,
		query
	};
}
