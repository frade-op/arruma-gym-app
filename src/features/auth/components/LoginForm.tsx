import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AuthError } from "../api";
import { createLoginSchema, type LoginFormValues } from "../schemas";
import { getSafeRedirect } from "@/shared/lib/safeRedirect";
import { Button } from "@/shared/components/Button";
import { TextField } from "@/shared/components/TextField";
import { usePreferences } from "@/shared/preferences/PreferencesProvider";

export function LoginForm() {
  const { login } = useAuth();
  const { language, t } = usePreferences();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);
  const authErrorMessages = {
    INVALID_CREDENTIALS: "auth.error.invalidCredentials",
    TOO_MANY_ATTEMPTS: "auth.error.tooManyAttempts",
    SESSION_EXPIRED: "auth.error.sessionExpired",
  } as const;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(createLoginSchema(language)) });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await login(values);
      navigate(getSafeRedirect((location.state as { from?: string } | null)?.from), { replace: true });
    } catch (error) {
      setServerError(
        error instanceof AuthError
          ? t(authErrorMessages[error.code])
          : t("auth.error.unexpected"),
      );
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <TextField
        label={t("auth.email")}
        type="email"
        autoComplete="username"
        error={errors.email?.message}
        {...register("email")}
      />
      <TextField
        label={t("auth.password")}
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />
      {serverError && (
        <p role="alert" className="rounded-lg bg-danger-surface px-3 py-2 text-sm text-danger-foreground">
          {serverError}
        </p>
      )}
      <Button type="submit" loading={isSubmitting} className="w-full">
        {t("auth.submit")}
      </Button>
    </form>
  );
}
