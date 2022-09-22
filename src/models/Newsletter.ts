import { Schema, model } from 'mongoose';
import { NewsletterEntry } from '../types/sharedTypes';

// 1. Create a Schema corresponding to the BlogEntry interface.
const NewsletterSchema = new Schema<NewsletterEntry>({
	email: {
		type: String,
		unique: true,
		required: true,
	},
	status: {
		type: String,
		default: 'subscribed'
	},
});

// Middlewares
NewsletterSchema.post('save', async function (_) {
	// TODO do we send a welcoming email?
	console.log(_, this);
});

// 2. Create a Model.
export const NewsletterModel = model<NewsletterEntry>('newsletter', NewsletterSchema);
