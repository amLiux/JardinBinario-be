import { findUserById } from '../helpers/findUserById';
import { Errors, generateErrorObject } from '../helpers/Logger';
import { BlogEntryModel, RecentlyDeletedBlogEntryModel } from '../models/BlogEntry'
import { BlogEntry, CustomContext } from '../types/sharedTypes';
import { HydratedDocument, CallbackError } from 'mongoose';

interface BlogInput {
	blogInput: {
		id?: string;
		tags: BlogEntry['tags'];
		title: BlogEntry['author'];
		markdown: BlogEntry['markdown'];
	}
}

interface BlogSharesInput {
	blogSharesInput: {
		id?: string;
	}
}

export const BlogResolvers = {
	Query: {
		// TODO implement get by tags and maybe get by theme too
		getMostViewedEntries: async (_:any, __:any, ctx:CustomContext): Promise<BlogEntry[]> => {
			try {
				const latestBlogs = await BlogEntryModel.find().sort({ views : -1 }).limit(4).populate('author', 'lastName email name avatar');
				return latestBlogs;
			} catch (err) {
				throw await generateErrorObject(Errors.INTERNAL_SERVER_ERROR, err as any, ctx);
			}
		},
		getAllEntriesIds: async (_:any, __:any, ctx:CustomContext): Promise<BlogEntry[]> => {
			try {
				const allBlogs = await BlogEntryModel.find().select('_id');
				return allBlogs;
			} catch (err) {
				throw await generateErrorObject(Errors.INTERNAL_SERVER_ERROR, err as any, ctx);
			}
		},
		getRecentEntries: async (_:any, __:any, ctx:CustomContext): Promise<BlogEntry[]> => {
			try {
				const latestBlogs = await BlogEntryModel.find().sort({ _id: -1 }).limit(4).populate('author', 'lastName email name avatar');
				return latestBlogs;
			} catch (err) {
				throw await generateErrorObject(Errors.INTERNAL_SERVER_ERROR, err as any, ctx);
			}
		},
		getDeletedEntries: async (_: any, __:any, ctx:CustomContext): Promise<BlogEntry[]> => {
			try {
				const latestDeletedBlogs = await RecentlyDeletedBlogEntryModel.find().sort({ _id: -1 }).limit(15);
				return latestDeletedBlogs;
			} catch (err) {
				throw await generateErrorObject(Errors.INTERNAL_SERVER_ERROR, err as any, ctx);
			}
		},
		getEntriesByAuthor: async (_: any, { authorId }: Record<string, string>, ctx: CustomContext): Promise<BlogEntry[]> => {
			try {
				const BlogEntriesByAuthor = await BlogEntryModel.find({ author: authorId });

				if (!BlogEntriesByAuthor) {
					throw await generateErrorObject(Errors.NOT_FOUND, `There were no valid BlogEntries with for ${authorId}!`, ctx);
				}

				return BlogEntriesByAuthor;
			} catch (err) {
				throw await generateErrorObject(Errors.INTERNAL_SERVER_ERROR, err as any, ctx);
			}
		},
		getSpecificBlogEntry: async (_: any, { blogId }: Record<string, string>, ctx:CustomContext): Promise<BlogEntry> => {
			try {
				const BlogEntry = await BlogEntryModel.findOne({_id: blogId}).populate('author', 'lastName email name avatar');

				if (!BlogEntry) {
					throw await generateErrorObject(Errors.NOT_FOUND, `There was no valid BlogEntry with id ${blogId}!`, ctx);
				}

				return BlogEntry;
			} catch (err) {
				throw await generateErrorObject(Errors.INTERNAL_SERVER_ERROR, err as any, ctx);
			}
		},
	},
	Mutation: {
		newBlogEntry: async (_: any, { blogInput }: BlogInput, ctx: CustomContext): Promise<BlogEntry> => {
			const { markdown } = blogInput;
			const { User } = ctx;
			
			if (markdown.trim().length <= 0) {
				throw await generateErrorObject(Errors.WRONG_INPUT, 'You should add at least one paragraph to your Blog Entry', ctx);
			}

			const Author = await findUserById(String(User?.id));

			if (!Author) {
				throw await generateErrorObject(Errors.UNKOWN_USER, 'The author is not valid.', ctx);
			}

			try {
				const newBlogEntry = await new BlogEntryModel({...blogInput, author: User?.id}).save();
				return newBlogEntry;
			} catch (err) {
				throw await generateErrorObject(Errors.INTERNAL_SERVER_ERROR, err as any, ctx);
			}
		},
		updateBlogEntry: async (_: any, { blogInput }: BlogInput, ctx:CustomContext): Promise<BlogEntry> => {
			try {
				const { id } = blogInput;

				// TODO shall we do search and then !BlogEntry to avoid casting? not sure
				const BlogEntryToUpdate = await BlogEntryModel.findOneAndUpdate({ _id: id }, blogInput, {
					new: true,
				});

				return <BlogEntry>BlogEntryToUpdate;
			} catch (err) {
				throw await generateErrorObject(Errors.INTERNAL_SERVER_ERROR, err as any, ctx);
			}
		},
		// we do this (a different type of update) because I don't want to expose the updateBlogEntry as a query that doesn't require authentication to avoid a future exploit, not sure if it's the best way, but hey, it get's the job done (double the processing power, check BlogEntry.findOne middleware) but feels safer, and we are not going to get that much workload
		updateBlogShares: async (_: any, { blogSharesInput }: BlogSharesInput, ctx:CustomContext): Promise<boolean> => {
			try {
				const { id } = blogSharesInput;
				BlogEntryModel.findOne({ _id: id }, async (err:CallbackError, blogEntry:HydratedDocument<BlogEntry>) => {
					if (err) {
						await generateErrorObject(Errors.INTERNAL_SERVER_ERROR, err.message, ctx);
						return false;
					}
					blogEntry.shares = blogEntry.shares + 1;
					blogEntry.save();
				});

				return true;

			} catch (err) {
				throw await generateErrorObject(Errors.INTERNAL_SERVER_ERROR, err as any, ctx);
			}
		},
		deleteBlogEntry: async (_: any, { blogId }: Record<string, string>, ctx:CustomContext): Promise<string> => {
			try {
				const deletedBlogEntry = await BlogEntryModel.findOneAndRemove({ _id: blogId });

				if (!deletedBlogEntry) {
					throw await generateErrorObject(Errors.NOT_FOUND, 'There was no BlogEntry to delete', ctx);
				}

				return deletedBlogEntry.id;
			} catch (err) {
				throw await generateErrorObject(Errors.INTERNAL_SERVER_ERROR, err as any, ctx);
			}
		},
		recoverDeletedBlogEntry: async (_: any, { blogId }: Record<string, string>, ctx: CustomContext): Promise<BlogEntry> => {
			try {
				const deletedBlogEntry = await RecentlyDeletedBlogEntryModel.findById(blogId);

				if (!deletedBlogEntry) {
					throw await generateErrorObject(Errors.NOT_FOUND, 'There was no BlogEntry to recover', ctx);
				}

				const { markdown, title, author, tags, createdAt } = deletedBlogEntry;
				const recoveredBlogEntry = await new BlogEntryModel({ markdown, title, author, tags, createdAt }).save();

				return recoveredBlogEntry;
			} catch (err) {
				throw await generateErrorObject(Errors.INTERNAL_SERVER_ERROR, err as any, ctx);
			}
		},
	}
}