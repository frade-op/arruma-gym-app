import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/features/auth/components/AuthProvider";
import { authApi, type AuthApi } from "@/features/auth/api";
import { PreferencesProvider } from "@/shared/preferences/PreferencesProvider";
import { EstablishmentsProvider } from "@/features/establishments/EstablishmentsProvider";

export function AppProviders({ children, api = authApi }: { children: ReactNode; api?: AuthApi }) {
  return (
    <BrowserRouter>
      <PreferencesProvider>
        <EstablishmentsProvider>
          <AuthProvider api={api}>{children}</AuthProvider>
        </EstablishmentsProvider>
      </PreferencesProvider>
    </BrowserRouter>
  );
}
