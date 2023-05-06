import { Schema, model } from 'mongoose';
import { UserDetails } from '../types/sharedTypes';

// 1. Create a Schema corresponding to the BlogEntry interface.
const UserDetailsSchema = new Schema<UserDetails>({
	browser: {
		type: String,
		required: true,
		trim: true,
	},
	os: {
		type: String,
		required: true,
		trim: true,
	},
	timezone: {
		type: String,
		required: true,
		trim: true,
	},
	country: {
		type: String,
		required: true,
		trim: true,
	},
	language: {
		type: String,
		required: true,
		trim: true,
	},
	visitedAt: {
		type: Date,
		default: new Date(),
	}
});

// Middlewares

// 2. Create a Model.
export const UserDetailsModel = model<UserDetails>('userDetailsMetrics', UserDetailsSchema);
