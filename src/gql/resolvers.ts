import { BlogResolvers } from '../controllers/Blog.controller';
import { AuthResolvers } from '../controllers/Auth.controller';
import { TicketResolvers } from '../controllers/Ticket.controller';
import { NewsletterResolvers } from '../controllers/Newsletter.controller';
import { MetricsResolvers } from '../controllers/Metrics.controller';
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';

export const resolvers = {
	JSON: GraphQLJSON,
	JSONObject: GraphQLJSONObject,
	Query: {
		...NewsletterResolvers.Query,
		...AuthResolvers.Query,
		...BlogResolvers.Query,
		...MetricsResolvers.Query,
	},
	Mutation: {
		...TicketResolvers.Mutation,
		...BlogResolvers.Mutation,
		...AuthResolvers.Mutation,
		...NewsletterResolvers.Mutation,
		...MetricsResolvers.Mutation,
	},
};