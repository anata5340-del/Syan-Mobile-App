import { z } from "zod";

export const changePasswordSchema = z.object({
  currentPass: z.string().min(6, "Enter current password"),
  newPass: z.string().min(6, "Password must be at least 6 characters"),
  confirmPass: z.string().min(6, "Confirm your password"),
}).refine((data) => data.newPass === data.confirmPass, {
  message: "Passwords do not match",
  path: ["confirmPass"],
});

export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;