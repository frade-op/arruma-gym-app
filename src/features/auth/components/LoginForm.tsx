import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AuthError } from "../api";
import { loginSchema, type LoginFormValues } from "../schemas";
import { getSafeRedirect } from "@/shared/lib/safeRedirect";
import { Button } from "@/shared/components/Button";
import { TextField } from "@/shared/components/TextField";

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await login(values);
      navigate(getSafeRedirect((location.state as { from?: string } | null)?.from), { replace: true });
    } catch (error) {
      setServerError(error instanceof AuthError ? error.message : "Erro inesperado. Tente novamente.");
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <TextField
        label="E-mail"
        type="email"
        autoComplete="username"
        error={errors.email?.message}
        {...register("email")}
      />
      <TextField
        label="Senha"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />
      {serverError && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {serverError}
        </p>
      )}
      <Button type="submit" loading={isSubmitting} className="w-full">
        Entrar
      </Button>
    </form>
  );
}
