import { Schema, model } from 'mongoose';
import { notifyUsersAboutNewTicket } from '../helpers/SMTP';
import { Ticket } from '../types/sharedTypes';
import { UserModel } from './User';

// 1. Create a Schema corresponding to the BlogEntry interface.
const TicketSchema = new Schema<Ticket>({
	companyName: {
		type: String,
		required: true,
		trim: true,
	},
	status: {
		type: 'string',
		default: 'open',
	},
	email: {
		type: String,
		required: true,
		trim: true,
	},
	description: {
		type: String,
		required: true,
	},
	service: [String],
	createdAt: {
		type: String,
		default: new Date().toUTCString(),
	},
	phoneNumber: {
		type: String,
		required: true,
	},
});

// Middlewares
TicketSchema.post('save', async function (ticket:Ticket) {
	const availableUsers = await UserModel.find().select('email name');
	await notifyUsersAboutNewTicket(availableUsers, ticket);
});

// 2. Create a Model.
export const TicketModel = model<Ticket>('tickets', TicketSchema);
