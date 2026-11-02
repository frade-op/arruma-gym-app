import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/features/auth/components/AuthProvider";
import { authApi, type AuthApi } from "@/features/auth/api";
import { PreferencesProvider } from "@/shared/preferences/PreferencesProvider";

export function AppProviders({ children, api = authApi }: { children: ReactNode; api?: AuthApi }) {
  return (
    <BrowserRouter>
      <PreferencesProvider>
        <AuthProvider api={api}>{children}</AuthProvider>
      </PreferencesProvider>
    </BrowserRouter>
  );
}
