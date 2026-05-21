import mongoose from "mongoose";
import { env } from "./env";

export async function connectDB(): Promise<void> {
	try {
		const conn = await mongoose.connect(env.MONGODB_URI);
		console.log(
			`MONGO DB Connection established \n DB Host : ${conn.connection.host}`,
		);
	} catch (error) {
		console.error(
			`[Database] MongoDB connection failed: ${error instanceof Error ? error.message : error}`,
		);
		process.exit(1);
	}
}
