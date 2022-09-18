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
		required: true,
		unique: true,
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
	},
	tempPassword: String,
	tempPasswordTime: String,
});

// Methods
UserSchema.methods.checkPassword = function (password: string, isTempPassword?: boolean): boolean {
	if (isTempPassword) return compareSync(password, this.tempPassword);
	return compareSync(password, this.password);
}

// Middlewares
UserSchema.pre('save', async function (next: () => void) {

	const hashString = async (toHash: string) => {
		const salt = await genSalt(10);
		return await hash(String(toHash), salt);
	}

	if (this.isModified('password')) {
		const hashedPassword = await hashString(String(this.password));
		this.password = hashedPassword;
		next();
	}

	if (this.isModified('tempPassword') && this.tempPassword !== undefined) {
		const hashedPassword = await hashString(String(this.tempPassword));
		this.tempPassword = hashedPassword;
		this.tempPasswordTime = new Date().toUTCString();
		next();
	}
});

// 2. Create a Model.
export const UserModel = model<User>('users', UserSchema);