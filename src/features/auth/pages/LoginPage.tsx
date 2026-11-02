import { Dumbbell } from "lucide-react";
import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Dumbbell className="h-6 w-6" aria-hidden />
          </span>
          <h1 className="text-2xl font-bold text-slate-900">Bem-vindo de volta</h1>
          <p className="mt-1 text-sm text-slate-500">Entre na sua conta para continuar</p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-xs text-slate-400">
          Demo: membro@exemplo.com / Senha@123
        </p>
      </div>
    </main>
  );
}
