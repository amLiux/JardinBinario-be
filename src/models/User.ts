import { Schema, model } from 'mongoose';
import { User } from '../types/sharedTypes';
import { genSalt, hash, compareSync } from 'bcryptjs';

// 1. Create a Schema corresponding to the User interface.
const UserSchema = new Schema<User>({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	lastName: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true
	},
	// avatar: String,
	role: String,
	password: {
		type: String,
		required: true
	},
	createdAt: {
		type: String,
		default: new Date().toUTCString(),
	}
});

// Methods
UserSchema.methods.checkPassword = function(password:string):boolean {
	return compareSync(password, this.password);
}

// Middlewares
UserSchema.pre('save', async function (next: ()=> void) {
	if (this.isModified('password')) {
		const salt = await genSalt(10);
		this.password = await hash(String(this.password), salt);
		next();
	}
});

// 2. Create a Model.
export const UserModel = model<User>('users', UserSchema);