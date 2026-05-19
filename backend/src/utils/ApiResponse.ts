import { Response } from 'express';

interface ApiResponseBody<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export class ApiResponse {
  static success<T>(res: Response, data: T, message = 'Success', statusCode = 200): void {
    const body: ApiResponseBody<T> = { success: true, message, data };
    res.status(statusCode).json(body);
  }

  static error(res: Response, message = 'Internal server error', statusCode = 500): void {
    const body: ApiResponseBody = { success: false, message };
    res.status(statusCode).json(body);
  }
}
