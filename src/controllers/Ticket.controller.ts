import { Errors, generateErrorObject } from '../helpers/Logger';
import { TicketModel } from '../models/Ticket'
import { Ticket, CustomContext } from '../types/sharedTypes';

interface TicketInput {
	ticketInput: {
		id?: string;
		companyName: Ticket['companyName'];
		email: Ticket['email'];
		description: Ticket['description'];
		service: Ticket['service'];
		phoneNumber: Ticket['phoneNumber'];
	}
}

export const TicketResolvers = {
	Query: {
		getOpenTickets: async (_: any, __: any, ctx: CustomContext): Promise<Ticket[]> => {
			try {
				const openTickets = await TicketModel.find({status: 'open'});
				return openTickets;
			} catch (err) {
				throw await generateErrorObject(Errors.INTERNAL_SERVER_ERROR, err as any, ctx);
			}
		},
	},
	Mutation: {
		newTicket: async (_: any, { ticketInput }: TicketInput, ctx: CustomContext): Promise<Ticket> => {
			const { description } = ticketInput;

			if (description.trim().length <= 0) {
				throw await generateErrorObject(Errors.WRONG_INPUT, 'Por favor agrega una descripcion a tu tiquete', ctx);
			}

			try {
				const newTicket = await new TicketModel({ ...ticketInput }).save();
				return newTicket;
			} catch (err) {
				throw await generateErrorObject(Errors.INTERNAL_SERVER_ERROR, err as any, ctx);
			}
		},
		updateTicket: async (_: any, { ticketInput }: TicketInput, ctx: CustomContext): Promise<Ticket> => {
			try {
				const { id } = ticketInput;

				const TicketToUpdate = await TicketModel.findOneAndUpdate({ _id: id }, ticketInput, {
					new: true,
				});

				return <Ticket>TicketToUpdate;
			} catch (err) {
				throw await generateErrorObject(Errors.INTERNAL_SERVER_ERROR, err as any, ctx);
			}
		},
		// deleteBlogEntry: async (_: any, { blogId }: Record<string, string>, ctx: CustomContext): Promise<string> => {
		// 	try {
		// 		const deletedBlogEntry = await BlogEntryModel.findOneAndRemove({ _id: blogId });

		// 		if (!deletedBlogEntry) {
		// 			throw await generateErrorObject(Errors.NOT_FOUND, 'There was no BlogEntry to delete', ctx);
		// 		}

		// 		return deletedBlogEntry.id;
		// 	} catch (err) {
		// 		throw await generateErrorObject(Errors.INTERNAL_SERVER_ERROR, err as any, ctx);
		// 	}
		// },
	}
}