import mongoose from 'mongoose';

export async function dbConnection(): Promise<any> {
	try {
		const db = await mongoose.connect(String(process.env.MONGODB_URI));
		const dbInstance = mongoose.connections[0].db;
		const gridFs = new mongoose.mongo.GridFSBucket(dbInstance, {bucketName: 'jb-files'});
		console.log(`JardinBinario is connected to: ${db.connection.name}`);
		return gridFs;
	} catch (error) {
		throw new Error(`There was an error connecting to the database: ${error}`);
	}
}