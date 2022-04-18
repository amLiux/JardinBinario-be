import axios from 'axios';
import { CustomContext } from '../types/sharedTypes';

interface InternalError {
	code: string;
	notify: boolean;
}

export const Errors = {
	INTERNAL_SERVER_ERROR: {
		code: 'INTERNAL_SERVER_ERROR',
		notify: true,
	},
	WRONG_PASSWORD: {
		code: 'WRONG_PASSWORD',
		notify: false,
	},
	UNKOWN_USER: {
		code: 'UNKOWN_USER',
		notify: false,
	},
	DUPLICATED_RECORD: {
		code: 'DUP_RECORD',
		notify: false,
	},
	NOT_FOUND: {
		code: 'NOT_FOUND',
		notify: false,
	},
	UNAUTHORIZED: {
		code: 'UNAUTHORIZED',
		notify: false,
	},
	WRONG_INPUT: {
		code: 'WRONG_INPUT',
		notify: true,
	},
	SMTP_ERROR: {
		code: 'SMTP_ERROR',
		notify: true,
	},
	TIMEOUT: {
		code: 'TIMEOUT',
		notify: false,
	}
};

const generateSlackCard = (error: InternalError, message: string, requestId: string, query:string) => ({
	text: "Error en Jardin Binario.",
	blocks: [
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: `*${message}* \n In query: _*${query}*_`
			}
		},
		{
			type: "section",
			block_id: "errorDetails",
			text: {
				type: "mrkdwn",
				text: `_Request Id:_ <https://example.com|${requestId}> :heavy_exclamation_mark: \n\n *Error Code:*\n${error.code}`,
			},
			accessory: {
				type: "image",
				image_url: "https://is5-ssl.mzstatic.com/image/thumb/Purple3/v4/d3/72/5c/d3725c8f-c642-5d69-1904-aa36e4297885/source/256x256bb.jpg",
				alt_text: "Haunted hotel image"
			}
		}
	]
});

export const generateErrorObject = async (error: InternalError, message: string, ctx: CustomContext): Promise<Error> => {
	const { requestId, query } = ctx;

	if (error.notify) {
		// TODO create an HTTP abstraction module we will need to hit GitHub, LinkedIn so we'll use that abstraction for that e.g: async processRequest.
		await axios.post(
			String(process.env.SLACK_HOOK_URL),
			generateSlackCard(error, message, requestId, query)
		).catch((err) => {
			console.error(err);
		});
	}

	return new Error(message) as Error;
	
};