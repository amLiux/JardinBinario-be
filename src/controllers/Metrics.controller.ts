import { Errors, generateErrorObject } from '../helpers/Logger';
import { goBackOneMonth } from '../helpers/date';
import { UserDetailsModel } from '../models/Metrics';
import { UAParser } from 'ua-parser-js';
import { CustomContext } from '../types/sharedTypes';

interface MetricsInput {
	metricsInput: {
		timezone: string;
		language: string;
		country: string;
		userAgent:string;
	}
}

type BrowserCount = {
	browser: string;
	count: number;
}

interface Metrics {
	metricName: 'browser';
	count: BrowserCount;
	dueDate: string;
}

export const MetricsResolvers = {
	Query: {
		getMostUsedBrowsers: async (_: any, __: any, ctx: CustomContext): Promise<Metrics> => {
			try {
				const oneMonthAgo = goBackOneMonth();
				const aggregateResult = <unknown> await UserDetailsModel.aggregate([
					{ $match: { visitedAt: { $gte: oneMonthAgo, $lt: new Date() } } },
					{
						$group: {
							_id: "$browser",
							count: { $sum: 1 }
						},
					},
					{
						$project: {
							_id: 0,
							browser: "$_id",
							count: 1,
							sum: 1

						},
					}
				]) as BrowserCount;
				return {
					metricName: 'browser',
					count: aggregateResult,
					dueDate: new Date().toUTCString(),
				};
			} catch (err) {
				throw await generateErrorObject(Errors.INTERNAL_SERVER_ERROR, err as any, ctx);
			}
		},
		// TODO get countries that visit the most
		// TODO get the most languages visitors speak
		// TODO get the timezone that users are in the most 
	},
	Mutation: {
		newUserDetailsEntry: async (_: any, { metricsInput: {userAgent, ...props} }: MetricsInput, ctx: CustomContext): Promise<boolean> => {
			try {
				// TODO don't be sketchy, save browser versions later
				const {os: {name: os}, browser: {name: browser}} = new UAParser(userAgent).getResult();
				await new UserDetailsModel({ ...props, os, browser }).save();
				return true;
			} catch (err) {
				throw await generateErrorObject(Errors.INTERNAL_SERVER_ERROR, err as any, ctx);
			}
		},
	}
}