import { Schema, model } from 'mongoose';
import { notifyEndUsersAboutNewBlog } from '../helpers/SMTP';
import { BlogEntry } from '../types/sharedTypes';
import { NewsletterModel } from './Newsletter';

// 1. Create a Schema corresponding to the BlogEntry interface.
const BlogEntrySchema = new Schema<BlogEntry>({
	title: {
		type: String,
		required: true,
		trim: true,
		unique: true,
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	tags: [String],
	createdAt: {
		type: Date,
		default: Date.now,
	},
	markdown: {
		type: String,
		required: true,
	},
	views: {
		type: Number,
		default: 0,
	},
	shares: {
		type: Number,
		default: 0,
	},
	sneakpeak: {
		type: String,
		required: true,
	},
	deleted: {
		type: Boolean,
		required: false,
		default: false,
	}
});


// Middlewares
BlogEntrySchema.post('save', async function (blog:BlogEntry) {
	if(this.isNew && process.env.RAILWAY_ENVIRONMENT_NAME === 'production') {
		const subscribedEmails = await NewsletterModel.find({ status: 'subscribed' });
		await notifyEndUsersAboutNewBlog(subscribedEmails, blog);
	}
});

// 2. Create a Model.
export const BlogEntryModel = model<BlogEntry>('blogEntries', BlogEntrySchema);