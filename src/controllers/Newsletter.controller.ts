import { Errors, generateErrorObject } from '../helpers/Logger';
import { NewsletterModel } from '../models/Newsletter';
import { CustomContext, NewsletterEntry } from '../types/sharedTypes';

interface NewsletterInput {
	newsletterInput: {
		id?: string;
		email: NewsletterEntry['email'];
	}
}

export const NewsletterResolvers = {
	Query: {
		getSubscribedEmails: async (_: any, __: any, ctx: CustomContext): Promise<NewsletterEntry[]> => {
			try {
				const subscribedEmails = await NewsletterModel.find({ status: 'subscribed' });
				return subscribedEmails;
			} catch (err) {
				throw await generateErrorObject(Errors.INTERNAL_SERVER_ERROR, err as any, ctx);
			}
		},
	},
	Mutation: {
		newNewsletterEntry: async (_: any, { newsletterInput }: NewsletterInput, ctx: CustomContext): Promise<NewsletterEntry> => {
			const { email } = newsletterInput;

			if (email.trim().length <= 0) {
				throw await generateErrorObject(Errors.WRONG_INPUT, 'Por favor agrega un e-mail a la peticion', ctx);
			}

			try {
				const newNewsletterEntry = await new NewsletterModel({ ...newsletterInput }).save();
				return newNewsletterEntry;
			} catch (err) {
				throw await generateErrorObject(Errors.INTERNAL_SERVER_ERROR, err as any, ctx);
			}
		},
		updateNewsletterEntry: async (_: any, { newsletterInput }: NewsletterInput, ctx: CustomContext): Promise<NewsletterEntry> => {
			try {
				const { id } = newsletterInput;

				const NewsletterEntryToUpdate = await NewsletterModel.findOneAndUpdate({ _id: id }, newsletterInput, {
					new: true,
				});

				return <NewsletterEntry>NewsletterEntryToUpdate;
			} catch (err) {
				throw await generateErrorObject(Errors.INTERNAL_SERVER_ERROR, err as any, ctx);
			}
		},
	}
}