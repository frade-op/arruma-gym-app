import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/features/auth/components/AuthProvider";
import { authApi, type AuthApi } from "@/features/auth/api";

export function AppProviders({ children, api = authApi }: { children: ReactNode; api?: AuthApi }) {
  return (
    <BrowserRouter>
      <AuthProvider api={api}>{children}</AuthProvider>
    </BrowserRouter>
  );
}
