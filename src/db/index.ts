import mongoose from 'mongoose';

export async function dbConnection():Promise<void> {
	try {
		const db = await mongoose.connect(String(process.env.MONGODB_URI));
		console.log(`JardinBinario is connected to: ${db.connection.name}`);
	} catch(error) {
		throw new Error(`There was an error connecting to the database: ${error}`);
	}
}