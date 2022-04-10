import { BlogResolvers } from '../controllers/Blog.controller';
import { AuthResolvers } from '../controllers/Auth.controller';

export const resolvers = {
	Query: {
		...AuthResolvers.Query,
		...BlogResolvers.Query,
	},
	Mutation: {
		...BlogResolvers.Mutation,
		...AuthResolvers.Mutation,
	},
};