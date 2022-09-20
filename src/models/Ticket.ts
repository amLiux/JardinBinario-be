import { Schema, model } from 'mongoose';
import { Ticket } from '../types/sharedTypes';

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
TicketSchema.post('save', async function (_) {
	// TODO do we send email + slack notification here?
	console.log(_, this);
});

// 2. Create a Model.
export const TicketModel = model<Ticket>('tickets', TicketSchema);
