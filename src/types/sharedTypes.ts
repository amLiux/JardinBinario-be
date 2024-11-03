import { Document, ObjectId } from 'mongoose';
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
	active: boolean;
	tempPassword?: string;
	tempPasswordTime?: string;
	checkPassword: (password:User['password'] | User['tempPassword'], isTempPassword?:boolean) => boolean;
	save: () => Promise<User>
}
export interface BlogEntry extends Document {
	_id: ObjectId;
	author: ObjectId;
	createdAt: Date;
	title: string;
	markdown: string;
	views: number;
	shares: number;
	sneakpeak: string;
	tags: string[];
	deleted: boolean;
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
	gridFs: any;
}

export interface UserDetails {
	browser: string;
	timezone: string;
	language: string;
	visitedAt: Date;
	country: string;
	os: string;
}

export interface ImageEntry {
	id: ObjectId;
	prompt: string;
	date: Date;
	fileId: ObjectId;
	contentType: string;
}