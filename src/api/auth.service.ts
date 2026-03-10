import api from './client';
import { AUTH } from './endpoints';
import type { LoginResponse, LoginPayload, SignupPayload, SignupResponse } from '../types/api';
import { setToken, removeToken } from '../utils/token';

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await api.post(AUTH.LOGIN, payload);

   console.log("[LOGIN API RAW RESPONSE]:", response.data);
  const data = response.data as LoginResponse;

  // store token securely
  if (data?.token) {
    await setToken(data.token);
  }
  return data;
}



export interface SignupFiles {
  cnicFront?: string | null;
  cnicBack?: string | null;
}

export async function signup(
  payload: SignupPayload,
  files?: SignupFiles,
): Promise<SignupResponse> {
  const hasFiles = files?.cnicFront || files?.cnicBack;

  if (hasFiles) {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(`user[${key}]`, value);
      }
    });
    if (files?.cnicFront) {
      formData.append('user[cnicFront]', {
        uri: files.cnicFront,
        type: 'image/jpeg',
        name: 'cnic_front.jpg',
      } as any);
    }
    if (files?.cnicBack) {
      formData.append('user[cnicBack]', {
        uri: files.cnicBack,
        type: 'image/jpeg',
        name: 'cnic_back.jpg',
      } as any);
    }
    const response = await api.post(AUTH.SIGNUP, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('[SIGNUP API RAW RESPONSE]:', response.data);
    return response.data as SignupResponse;
  }

  const response = await api.post(AUTH.SIGNUP, { user: payload });
  console.log('[SIGNUP API RAW RESPONSE]:', response.data);
  return response.data as SignupResponse;
}

/** Step 1: Check email -> returns type & id */
export async function requestResetEmail(email: string) {
  const { data } = await api.post(AUTH.RESET_PASSWORD, { email });
  return data;
}




export async function sendOtp(type: string, email: string) {
  const { data } = await api.post(AUTH.VALIDATE, { type, email });
  return data; // { success, message, token }
}



export async function verifyOtp(otp: string, token: string) {
  const { data } = await api.post(AUTH.VALIDATE_VERIFY, { otp, token });
  return data; // { success: true }
}

// Finalize reset (PUT /api/users/reset-password)
//  *  body: { password, type, id }
export async function resetPasswordBackend(password: string, type: string, id: string, email: string) {
  const { data } = await api.put(AUTH.RESET_PASSWORD, { email, password, type, id });
  return data; // { message, data: updatedUser } (no bearer token for mobile)
}



export async function logout(): Promise<void> {
  try {
    // try informing backend
    await api.post(AUTH.LOGOUT);
  } catch (err) {
    // ignore network errors here, proceed to remove token anyway
  } finally {
    await removeToken();
  }
}
