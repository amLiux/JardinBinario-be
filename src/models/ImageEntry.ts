import { Schema, model } from 'mongoose';
import { ImageEntry } from '../types/sharedTypes';

const ImageEntrySchema = new Schema<ImageEntry>({
	prompt: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	fileId: {
		type: Schema.Types.ObjectId,
		required: true,
	},
	contentType: {
		type: String,
		default: 'image/png'
	}
});

export const ImageEntryModel = model<ImageEntry>('openAiImages', ImageEntrySchema);
