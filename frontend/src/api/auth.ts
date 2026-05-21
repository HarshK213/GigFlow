import api from './axios';
import type { AuthResponse } from '../types';

export async function loginApi(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  } catch (err) {
    console.error('[login]', err);
    throw err;
  }
}

export async function registerApi(data: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  } catch (err) {
    console.error('[register]', err);
    throw err;
  }
}
