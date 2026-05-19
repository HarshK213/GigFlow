import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import * as authService from '../services/auth.service';
import { registerSchema, loginSchema } from '../types';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);
  const user = await authService.registerUser(data.name, data.email, data.password);
  ApiResponse.success(res, user, 'User registered successfully', 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);
  const result = await authService.loginUser(data.email, data.password);
  ApiResponse.success(res, result, 'Login successful');
});
