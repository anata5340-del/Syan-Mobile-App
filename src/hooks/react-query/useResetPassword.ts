import { useMutation } from '@tanstack/react-query';
import * as authService from '../../api/auth.service'


export function useRequestResetEmail() {
  return useMutation({
    mutationFn: (email: string) => authService.requestResetEmail(email),
  });
}

export function useSendOtp() {
  return useMutation({
    mutationFn: ({ type, email }: { type: string; email: string }) =>
      authService.sendOtp(type, email),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: ({ otp, token }: { otp: string; token: string }) =>
      authService.verifyOtp(otp, token),
  });
}

export function useResetPasswordBackend() {
  return useMutation({
    mutationFn: ({ password, type, id, email }: { password: string; type: string; id: string , email : string }) =>
      authService.resetPasswordBackend(password, type, id , email),
  });
}
