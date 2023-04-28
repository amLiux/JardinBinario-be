import { BlogResolvers } from '../controllers/Blog.controller';
import { AuthResolvers } from '../controllers/Auth.controller';
import { TicketResolvers } from '../controllers/Ticket.controller';
import { NewsletterResolvers } from '../controllers/Newsletter.controller';
import { MetricsResolvers } from '../controllers/Metrics.controller';

export const resolvers = {
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