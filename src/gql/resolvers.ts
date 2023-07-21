import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
import { BlogResolvers } from '../controllers/Blog.controller';
import { AuthResolvers } from '../controllers/Auth.controller';
import { TicketResolvers } from '../controllers/Ticket.controller';
import { NewsletterResolvers } from '../controllers/Newsletter.controller';
import { MetricsResolvers } from '../controllers/Metrics.controller';
import { AIResolvers } from '../controllers/AI.controller';

export const resolvers = {
	JSON: GraphQLJSON,
	JSONObject: GraphQLJSONObject,
	Query: {
		...NewsletterResolvers.Query,
		...AuthResolvers.Query,
		...BlogResolvers.Query,
		...MetricsResolvers.Query,
		...AIResolvers.Query,
	},
	Mutation: {
		...TicketResolvers.Mutation,
		...BlogResolvers.Mutation,
		...AuthResolvers.Mutation,
		...NewsletterResolvers.Mutation,
		...MetricsResolvers.Mutation,
	},
};