import { findUserById } from '../helpers/findUserById';
import { BlogEntryModel, RecentlyDeletedBlogEntryModel } from '../models/BlogEntry'
import { BlogEntry, CustomContext } from '../types/sharedTypes';

interface BlogInput {
	blogInput: {
		id: string;
		theme: BlogEntry['theme'];
		title: BlogEntry['author'];
		paragraphs: BlogEntry['paragraphs'];
	}
}

const queryFailureMsg = 'There was an issue while querying the BlogEntries:';

export const BlogResolvers = {
	Query: {
		// TODO implement top 4 with most views
		// TODO implement get by tags and maybe get by theme too
		getRecentEntries: async (): Promise<BlogEntry[]> => {
			try {
				const latestBlogs = await BlogEntryModel.find().sort({ _id: -1 }).limit(4);
				return latestBlogs;
			} catch (err) {
				console.error(err);
				throw new Error(`${queryFailureMsg}${err}`)
			}
		},
		getDeletedEntries: async (): Promise<BlogEntry[]> => {
			try {
				const latestDeletedBlogs = await RecentlyDeletedBlogEntryModel.find().sort({ _id: -1 }).limit(15);
				return latestDeletedBlogs;
			} catch (err) {
				console.error(err);
				throw new Error(`${queryFailureMsg}${err}`)
			}
		},
		getEntriesByAuthor: async (_: any, { authorId }: Record<string, string>): Promise<BlogEntry[]> => {
			try {
				const BlogEntriesByAuthor = await BlogEntryModel.find({ author: authorId });

				if (!BlogEntriesByAuthor) {
					throw new Error(`There were no valid BlogEntries with for ${authorId}!`)
				}

				return BlogEntriesByAuthor;
			} catch (err) {
				console.error(err);
				throw new Error(`${queryFailureMsg}${err}`);
			}
		},
		getSpecificBlogEntry: async (_: any, { blogId }: Record<string, string>): Promise<BlogEntry> => {
			try {
				const BlogEntry = await BlogEntryModel.findById(blogId);

				if (!BlogEntry) {
					throw new Error(`There was no valid BlogEntry with id ${blogId}!`)
				}

				return BlogEntry;
			} catch (err) {
				console.error(err);
				throw new Error(`${queryFailureMsg}${err}`);
			}
		},
	},
	Mutation: {
		newBlogEntry: async (_: any, { blogInput }: BlogInput, ctx: CustomContext): Promise<BlogEntry> => {
			const { paragraphs } = blogInput;
			const { User } = ctx;

			if(!User) {
				throw new Error('Please provide an author');
			}

			console.log(User);

			const Author = await findUserById(String(User.id));

			if (!paragraphs[0]) {
				throw new Error('You should add at least one paragraph to your Blog Entry');
			}

			if (!Author) {
				throw new Error('The author is not valid!');
			}

			try {
				const newBlogEntry = await new BlogEntryModel({...blogInput, author: User.id}).save();
				return newBlogEntry;
			} catch (err) {
				console.error(err);
				throw new Error('There was an issue creating the Blog Entry.');
			}
		},
		updateBlogEntry: async (_: any, { blogInput }: BlogInput): Promise<BlogEntry> => {
			try {
				const { id } = blogInput;

				const BlogEntryToUpdate = await BlogEntryModel.findOneAndUpdate({ _id: id }, blogInput, {
					new: true,
				});

				return <BlogEntry>BlogEntryToUpdate;
			} catch (err) {
				console.error(err);
				throw new Error('There was an issue updating the Blog Entry.');
			}
		},
		deleteBlogEntry: async (_: any, { blogId }: Record<string, string>): Promise<string> => {
			try {
				const deletedBlogEntry = await BlogEntryModel.findOneAndRemove({ _id: blogId });
				if (!deletedBlogEntry) {
					throw new Error('There was no BlogEntry to delete');
				}
				return deletedBlogEntry.id;
			} catch (err) {
				console.error(err);
				throw new Error('There was an issue deleting the Blog Entry.');
			}
		},
		recoverDeletedBlogEntry: async (_: any, { blogId }: Record<string, string>): Promise<BlogEntry> => {
			try {
				const deletedBlogEntry = await RecentlyDeletedBlogEntryModel.findById(blogId);
				if (!deletedBlogEntry) {
					throw new Error('There was no BlogEntry to recover');
				}

				const { paragraphs, title, author, theme, createdAt } = deletedBlogEntry;
				const recoveredBlogEntry = await new BlogEntryModel({ paragraphs, title, author, theme, createdAt }).save();

				return recoveredBlogEntry;
			} catch (err) {
				console.error(err);
				throw new Error('There was an issue recovering the Blog Entry.');
			}
		},
	}
}