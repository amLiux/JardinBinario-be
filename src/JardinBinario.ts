import 'dotenv/config';
import { ApolloServer, BaseContext } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './gql/schema';
import { resolvers } from './gql/resolvers';
import { dbConnection } from './db';
import { ServerStatus, User } from './types/sharedTypes';
import { getCustomContext } from './helpers/getCustomContext';


interface CustomContext extends BaseContext {
	User?: User;
	requestId?: string;
	query?: string;
	gridFs?: any;
}

export class JardinBinarioServer {

	private app!: ApolloServer;
	private gridFs!: any;

	public constructor() {
		// No es necesario realizar una inicialización aquí
	}

	private async init(): Promise<void> {
		this.gridFs = await dbConnection();

		this.app = new ApolloServer<CustomContext>({
			typeDefs,
			resolvers,
		});
	}

	public async listen(): Promise<ServerStatus> {
		try {
			await this.init();

			const { url } = await startStandaloneServer(this.app, {
				listen: { port: Number(process.env.PORT) || 4000 },
				context: async ({ req }) => {
					try {
						// TODO start planning on injecting locale from next on getCustomContext to localize the backend messages sent to front-end
						const customContext = await getCustomContext(req, this.gridFs);
						return { ...customContext };
					} catch (err) {
						const error = err as Error;
						throw new Error(error.message);
					}
				}
			});

			return {
				message: `Listening on: ${url}`,
				connected: true,
			};
		} catch (err: any) {
			return {
				message: err.message,
				connected: false,
			};
		}
	}
}