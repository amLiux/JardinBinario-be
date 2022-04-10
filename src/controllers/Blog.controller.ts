import { findUserById } from '../helpers/findUserById';
import { BlogEntryModel } from '../models/BlogEntry'
import { BlogEntry } from '../types/sharedTypes';

interface BlogInput {
	blogInput: {
		author: string,
		theme: BlogEntry['theme'],
		title: BlogEntry['author'],
		paragraphs: BlogEntry['paragraphs'],
	}
}

export const BlogResolvers = {
	Query: {
		getRecentEntries: async ():Promise<BlogEntry[]> => {
			const latestBlogs = await BlogEntryModel.find().sort({ _id: -1 }).limit(4);
			return latestBlogs;
		},
		// getEntriesByAuthor: (_:any, {userId}) => {

		// },
		getSpecificBlogEntry: async (_: any, { blogId }: Record<string, string>): Promise<BlogEntry> => {
			const BlogEntry = await BlogEntryModel.findById(blogId);
			console.log(blogId);
			if (!BlogEntry) {
				throw new Error(`There was no valid BlogEntry with id ${blogId}!`)
			}

			return BlogEntry;
		},
	},
	Mutation: {
		newBlogEntry: async (_: any, { blogInput }: BlogInput): Promise<BlogEntry> => {
			const { author, paragraphs } = blogInput;
			// we mi
			const Author = await findUserById(author);

			if(!paragraphs[0]) {
				throw new Error('You should add at least one paragraph to your Blog Entry');
			}

			if (!Author) {
				throw new Error('The author is not valid!');
			}

			try {
				const newBlogEntry = await new BlogEntryModel(blogInput).save();
				return newBlogEntry;
			} catch (err) {
				console.error(err);
				throw new Error('There was an issue creating the Blog Entry.');
			}
		},
		// updateBlogEntry: async (_:any, { blogInput }: BlogInput): Promise<BlogEntry> => {}
	}
}