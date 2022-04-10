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
	checkPassword?: (password:User['password']) => boolean;
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

export interface CustomContext extends Context {
	requestId: string;
	User?: User;
}

export interface TaggedContext extends Context {
	requestId: string;
}