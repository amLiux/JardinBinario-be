import 'dotenv/config';
import { ApolloServer } from 'apollo-server';
import { typeDefs } from './gql/schema';
import { resolvers } from './gql/resolvers';
import { dbConnection } from './db';
import { ServerStatus } from './types/sharedTypes';

export class JardinBinarioServer {

	public constructor() {
		this.app = new ApolloServer({
			typeDefs,
			resolvers,
		});

		this.database();
	}

	private app: ApolloServer;

	private async database() {
		await dbConnection();
	}

	public async listen(): Promise<ServerStatus> {
		try {
			const { url } = await this.app.listen(process.env.PORT);
			return {
				message: `Listening on: ${url}`,
				connected: true,
			};
		} catch(err:any) {
			return {
				message: err.message,
				connected: false,
			};
		}
	}
}

