import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";

interface TokenPayload {
	id: string;
	name: string;
	email: string;
	role: "Admin" | "Sales";
}

interface LoginResult {
	user: Omit<TokenPayload, "id"> & { _id: string };
	token: string;
}

function generateToken(payload: TokenPayload): string {
	return jwt.sign(payload, env.JWT_SECRET, {
		expiresIn: 604800,
	});
}

export async function registerUser(
	name: string,
	email: string,
	password: string,
	role: "Admin" | "Sales" = "Sales",
): Promise<Omit<TokenPayload, "id"> & { _id: string }> {
	const existingUser = await User.findOne({ email: email.toLowerCase() });

	if (existingUser) {
		throw ApiError.badRequest("User with this email already exists");
	}
	let user;
	try {
		user = await User.create({ name, email, password, role });
	} catch (error) {
		console.error("Error registering user:", error);
		throw ApiError.badRequest(
			"Something went wrong while registering user",
		);
	}

	return {
		_id: user._id.toString(),
		name: user.name,
		email: user.email,
		role: user.role,
	};
}

export async function loginUser(
	email: string,
	password: string,
): Promise<LoginResult> {
	const user = await User.findOne({ email: email.toLowerCase() });

	if (!user) {
		throw ApiError.unauthorized("Invalid email or password");
	}

	const isPasswordValid = await user.comparePassword(password);
	if (!isPasswordValid) {
		throw ApiError.unauthorized("Invalid email or password");
	}

	const payload: TokenPayload = {
		id: user._id.toString(),
		name: user.name,
		email: user.email,
		role: user.role,
	};

	const token = generateToken(payload);

	return {
		user: {
			_id: user._id.toString(),
			name: user.name,
			email: user.email,
			role: user.role,
		},
		token,
	};
}
