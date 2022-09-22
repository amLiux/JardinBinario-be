import { Schema, model } from 'mongoose';
import { BlogEntry, DeletedBlogEntry } from '../types/sharedTypes';
import { NewsletterModel } from './Newsletter';

const getToday = () => new Date().getDate();

// TODO add views and tags
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
		type: String,
		default: new Date().toUTCString(),
	},
	markdown: {
		type: String,
		required: true,
	}
});

// Middlewares
BlogEntrySchema.post('save', async function (_) {
	const subscribedEmails =  await NewsletterModel.find({ status: 'subscribed' });
	// TODO let's send an email to our subscribed emails
	console.log(_, this);
});

BlogEntrySchema.post('findOneAndRemove', async function (doc: BlogEntry, next) {
	try {
		const { markdown, tags, title, author, createdAt } = doc;
		const deletedBlogEntry = new RecentlyDeletedBlogEntryModel({ markdown, tags, title, author, createdAt });
		await deletedBlogEntry.save();
	} catch (err) {
		next(err as any);
	}
});

// 2. Create a Model.
export const BlogEntryModel = model<BlogEntry>('blogEntries', BlogEntrySchema);

const RecentlyDeletedBlogEntrySchema = new Schema<DeletedBlogEntry>({
	...BlogEntrySchema.obj,
	deleteIn: {
		type: String,
		default: new Date(new Date().setDate(getToday() + 30)).toUTCString(),
	},
});

export const RecentlyDeletedBlogEntryModel = model<DeletedBlogEntry>('deletedblogEntries', RecentlyDeletedBlogEntrySchema);
