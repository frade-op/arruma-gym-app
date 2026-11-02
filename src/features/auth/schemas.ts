import { z } from "zod";
import { messages, type Language } from "@/shared/preferences/messages";

export function createLoginSchema(language: Language) {
  const copy = messages[language];
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, copy["validation.emailRequired"])
      .email(copy["validation.emailInvalid"])
      .max(254, copy["validation.emailTooLong"]),
    password: z
      .string()
      .min(1, copy["validation.passwordRequired"])
      .max(128, copy["validation.passwordTooLong"]),
  });
}

export const loginSchema = createLoginSchema("pt-BR");
export type LoginFormValues = z.infer<typeof loginSchema>;
