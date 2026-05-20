import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
	PORT: number;
	MONGODB_URI: string;
	JWT_SECRET: string;
	JWT_EXPIRES_IN: string;
	NODE_ENV: "development" | "production" | "test";
}

function loadConfig(): EnvConfig {
	const port = parseInt(process.env.PORT || "5000", 10);
	if (isNaN(port)) {
		throw new Error("PORT must be a valid number");
	}

	const mongodbUri = process.env.MONGODB_URI;
	if (!mongodbUri) {
		throw new Error("MONGODB_URI environment variable is required");
	}

	const jwtSecret = process.env.JWT_SECRET;
	if (!jwtSecret) {
		throw new Error("JWT_SECRET environment variable is required");
	}

	const nodeEnv = process.env.NODE_ENV || "development";
	if (!["development", "production", "test"].includes(nodeEnv)) {
		throw new Error("NODE_ENV must be development, production, or test");
	}

	return {
		PORT: port,
		MONGODB_URI: mongodbUri,
		JWT_SECRET: jwtSecret,
		JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
		NODE_ENV: nodeEnv as EnvConfig["NODE_ENV"],
	};
}

export const env = loadConfig();
