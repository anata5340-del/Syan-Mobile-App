import { useMutation } from '@tanstack/react-query';
import { signup, type SignupFiles } from '../../api/auth.service';
import type { SignupPayload } from '../../types/api';

interface SignupParams {
  payload: SignupPayload;
  files?: SignupFiles;
}

export const useSignup = () => {
  return useMutation({
    mutationFn: ({ payload, files }: SignupParams) => signup(payload, files),
  });
};
