import { useMutation } from "@tanstack/react-query";
import { requestOtp, verifyOtp, updatePassword } from "../../api/security.service";

export const useRequestOtp = () =>
  useMutation({ mutationFn: (email: string) => requestOtp(email) });

export const useVerifyOtp = () =>
  useMutation({
    mutationFn: ({ otp, token }: { otp: string; token: string }) =>
      verifyOtp(otp, token),
  });

export const useUpdatePassword = () =>
  useMutation({
    mutationFn: updatePassword,
  });
