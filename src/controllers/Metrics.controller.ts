import { UAParser } from 'ua-parser-js';

import { Errors, generateErrorObject } from '../helpers/Logger';
import { goBackOneMonth } from '../helpers/date';
import { UserDetailsModel } from '../models/Metrics';
import { CustomContext } from '../types/sharedTypes';

interface UserDetailsInput {
	metricsInput: {
		timezone: string;
		language: string;
		country: string;
		userAgent:string;
	}
}

type MetricName = 'browser' | 'country';

type CountBase = {
	[key in MetricName]: string;
};

interface Count extends CountBase {
	count: number;
}

interface Metrics {
	metricName: MetricName;
	count: Count[];
	dueDate: string;
}

const simpleAggregate = async (groupBy:MetricName) => {
	const oneMonthAgo = goBackOneMonth();
	return await UserDetailsModel.aggregate([
		{ $match: { visitedAt: { $gte: oneMonthAgo, $lt: new Date() } } },
		{
			$group: {
				_id: `$${groupBy}`,
				count: { $sum: 1 }
			},
		},
		{
			$project: {
				_id: 0,
				[groupBy]: "$_id",
				count: 1,
				sum: 1

			},
		}
	]);
}

export const MetricsResolvers = {
	Query: {
		getMetric: async (_: any, {metricName}: Record<string, MetricName>, ctx: CustomContext): Promise<Metrics> => {
			try {
				const aggregateResult = <unknown> simpleAggregate(metricName) as Count[];
				return {
					metricName: metricName,
					count: aggregateResult,
					dueDate: new Date().toUTCString(),
				};
			} catch (err) {
				throw await generateErrorObject(Errors.INTERNAL_SERVER_ERROR, err as any, ctx);
			}
		},
	},
	Mutation: {
		newUserDetailsEntry: async (_: any, { metricsInput: {userAgent, ...props} }: UserDetailsInput, ctx: CustomContext): Promise<boolean> => {
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