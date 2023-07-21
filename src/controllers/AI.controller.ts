import { ObjectId } from 'mongodb';
import AI from '../ai/AI';
import { Errors, generateErrorObject } from '../helpers/Logger';
import { ImageEntryModel } from '../models/ImageEntry';
import { CustomContext, ImageEntry } from '../types/sharedTypes';

interface ImageData {
	prompt: string;
	date: string;
	img: {
		buffer: string;
		contentType: string;
	};
}

const getDateInfo = () => {
	const currentDate = new Date();
	const startOfDay = new Date(currentDate);
	startOfDay.setHours(0, 0, 0, 0);
	const endOfDay = new Date(currentDate);
	endOfDay.setHours(23, 59, 59, 999);
	return {
		startOfDay,
		endOfDay,
	};
}

export const AIResolvers = {
	Query: {
		getImageByPrompt: async (_: any, { prompt }: Record<string, string>, ctx: CustomContext): Promise<ImageData> => {
			const { gridFs } = ctx;
			try {
				const {startOfDay, endOfDay} = getDateInfo();

				const count = await ImageEntryModel.aggregate([
					{
						$match: {
							date: {
								$gte: startOfDay,
								$lt: endOfDay,
							},
						},
					},
					{
						$group: {
						  _id: null,
						  total: { $sum: 1 },
						},
					  },
					  {
						$project: {
						  _id: 0,
						  total: 1,
						
						},
					}
				]);

				if (count.length > 0 && count[0].total >= 5) {
					throw new Error ('Se ha alcanzado el límite diario de imágenes generadas.');
				}

				const ai = new AI();
				const imageBuffer = await ai.getImageFromPrompt(prompt);
				const base64Image = imageBuffer.toString('base64');
				const bucket = gridFs.openUploadStream(`image_${prompt.split(' ').join('_')}`, {
					contentType: 'image/png'
				});
				bucket.write(imageBuffer);
				bucket.end();
				const fileId = bucket.id.toString();

				await new ImageEntryModel({
					prompt,
					fileId,
				}).save();

				return {
					prompt,
					date: new Date().toISOString(), // Asegúrate de obtener la fecha actual correctamente.
					img: {
						buffer: base64Image,
						contentType: 'image/png', // Asegúrate de especificar el contentType correcto aquí.
					},
				};

			} catch (err) {
				throw await generateErrorObject(Errors.INTERNAL_SERVER_ERROR, err as any, ctx);
			}
		},
		getImageById: async (_: any, { imageId }: Record<string, string>, ctx: CustomContext): Promise<ImageData> => {
			const { gridFs } = ctx;

			try {
				const imageStream = gridFs.openDownloadStream(new ObjectId(imageId));
				const chunks: any[] = [];

				imageStream.on('data', (chunk:Buffer) => chunks.push(chunk));

				return new Promise((resolve, reject) => {
					imageStream.on('end', async () => {
						const buffer = Buffer.concat(chunks);

						const imageEntry = <ImageEntry>await ImageEntryModel.findOne({ fileId: imageId });

						if (!imageEntry) reject(new Error('Image entry not found'));

						const { prompt, date } = imageEntry;
						const parsedDate = new Date(date).toUTCString();
						resolve({
							prompt,
							date: parsedDate,
							img: {
								buffer: buffer.toString('base64'),
								contentType: imageEntry.contentType,
							},
						});
					});

					imageStream.on('error', (error:any) => {
						reject(error);
					});
				});
			} catch (err) {
				throw await generateErrorObject(Errors.INTERNAL_SERVER_ERROR, err as any, ctx);
			}
		},
		getAllImagesOfDay: async (_: any, __: any, ctx: CustomContext): Promise<ImageData[]> => {
			try {
				const {startOfDay, endOfDay} = getDateInfo();

				const images = await ImageEntryModel.find({
					date: {
					  $gte: startOfDay,
					  $lte: endOfDay,
					},
				  });

				const imagesWBufferPromises = images.map((image) => AIResolvers.Query.getImageById(_, { imageId: <unknown> image.fileId as string }, ctx));

				const imagesWBuffer = await Promise.all(imagesWBufferPromises);
				const result: ImageData[] = imagesWBuffer.map((image, index) => ({
					prompt: image.prompt,
					date: image.date,
					img: {
					  buffer: imagesWBuffer[index].img.buffer,
					  contentType: imagesWBuffer[index].img.contentType,
					},
				  }));

				return result;

			} catch (err) {
				throw await generateErrorObject(Errors.INTERNAL_SERVER_ERROR, err as any, ctx);
			}
		},
	},
}