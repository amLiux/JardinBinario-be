import { ObjectId } from 'mongoose';

export interface ServerStatus {
	connected: boolean;
	message: string;
}
export interface User {
	id: ObjectId,
	name: string;
	email: string;
	lastName: string;
	// avatar?: string;
	role: string;
	password?: string;
	createdAt: string;
	checkPassword: (password:User['password']) => boolean;
}