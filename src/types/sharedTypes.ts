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
	// avatar?: string;
	role: string;
	password?: string;
	createdAt: string;
	tempPassword?: string;
	tempPasswordTime?: string;
	checkPassword: (password:User['password'] | User['tempPassword'], isTempPassword?:boolean) => boolean;
	save: () => Promise<User>
}

type ImagePosition = 'start' | 'end';
interface Image {
	url: string;
	position: ImagePosition;
}

interface Paragraph {
	subtitle?: string;
	image?: Image;
	text: string;
}
export interface BlogEntry {
	id: ObjectId;
	author: ObjectId;
	theme: string;
	createdAt: string;
	title: string;
	paragraphs: Paragraph[];
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