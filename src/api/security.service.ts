import api from "./client";
import { AUTH } from "./endpoints";

export const requestOtp = async (email: string ) => {
  const { data } = await api.post(AUTH.VALIDATE, { 
    email,
    type: "user"
  });

  console.log("OTP response VALIDATE API:", data);
  return data;
};

export const verifyOtp = async (otp: string, token: string) => {
  const { data } = await api.post(AUTH.VALIDATE_VERIFY, { otp, token });
  console.log("OTP response VALIDATE VERIFY:", data);
  return data;
};

export const updatePassword = async ({
  id,
  password,
  email
}: {
  id: string;
  password: string;
  email: string;
}) => {
  const { data } = await api.put(AUTH.RESET_PASSWORD, {
    id,
    password,
    email,
    type: "user"
  });
    console.log("Password Update Response:", data);
  return data;
};
