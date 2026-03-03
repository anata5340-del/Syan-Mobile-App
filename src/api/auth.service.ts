import api from './client';
import { AUTH } from './endpoints';
import type { LoginResponse, LoginPayload } from '../types/api';
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
