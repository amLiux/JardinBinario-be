import { BlogResolvers } from '../controllers/Blog.controller';
import { AuthResolvers } from '../controllers/Auth.controller';
import { TicketResolvers } from '../controllers/Ticket.controller';
import { NewsletterResolvers } from '../controllers/Newsletter.controller';

export const resolvers = {
	Query: {
		...NewsletterResolvers.Query,
		...AuthResolvers.Query,
		...BlogResolvers.Query,
	},
	Mutation: {
		...TicketResolvers.Mutation,
		...BlogResolvers.Mutation,
		...AuthResolvers.Mutation,
		...NewsletterResolvers.Mutation,
	},
};