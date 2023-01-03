import { ObjectId } from 'mongoose';
import { Context } from 'apollo-server-core';

export interface ServerStatus {
	connected: boolean;
	message: string;
}

export interface Token {
	token: string;
}
export interface User {
	id: ObjectId;
	name: string;
	email: string;
	lastName: string;
	avatar: string;
	role: string;
	password?: string;
	createdAt: string;
	tempPassword?: string;
	tempPasswordTime?: string;
	checkPassword: (password:User['password'] | User['tempPassword'], isTempPassword?:boolean) => boolean;
	save: () => Promise<User>
}
export interface BlogEntry {
	id: ObjectId;
	author: ObjectId;
	createdAt: string;
	title: string;
	markdown: string;
	views: number;
	shares: number;
	sneakpeak: string;
	tags: string[];
}

export interface Ticket {
	id: ObjectId;
	status: 'open' | 'closed' | 'in progress';
	companyName: string;
	service: string[];
	email: string;
	description: string;
	phoneNumber: string;
	createdAt: string;
}

export interface NewsletterEntry {
	id: ObjectId;
	email: string;
	status: 'subscribed' | 'unsubscribed';
}


export interface DeletedBlogEntry extends BlogEntry {
	deleteIn: string;
}

export interface CustomContext extends TaggedContext{
	User: User;
}

export interface TaggedContext extends Context {
	requestId: string;
	query: string;
}