import { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { AuthApi } from "../api/authApi";
import type { AuthStatus, LoginCredentials, Session, User } from "../types";

export interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  /** Access token mantido apenas em memória (nunca em localStorage). */
  getAccessToken: () => string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const REFRESH_MARGIN_MS = 60 * 1000;

interface AuthProviderProps {
  api: AuthApi;
  children: ReactNode;
}

export function AuthProvider({ api, children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const sessionRef = useRef<Session | null>(null);

  const applySession = useCallback((next: Session | null) => {
    sessionRef.current = next;
    setSession(next);
    setStatus(next ? "authenticated" : "unauthenticated");
  }, []);

  // Restaura a sessão ao abrir o app.
  useEffect(() => {
    let active = true;
    api
      .refresh()
      .then((s) => active && applySession(s))
      .catch(() => active && applySession(null));
    return () => {
      active = false;
    };
  }, [api, applySession]);

  // Renova o token antes de expirar; falha = encerra a sessão.
  useEffect(() => {
    if (!session) return;
    const delay = Math.max(session.expiresAt - Date.now() - REFRESH_MARGIN_MS, 0);
    const timer = setTimeout(() => {
      api.refresh().then(applySession).catch(() => applySession(null));
    }, delay);
    return () => clearTimeout(timer);
  }, [session, api, applySession]);

  const login = useCallback(
    async (credentials: LoginCredentials) => applySession(await api.login(credentials)),
    [api, applySession],
  );

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      applySession(null);
    }
  }, [api, applySession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user: session?.user ?? null,
      getAccessToken: () => sessionRef.current?.accessToken ?? null,
      login,
      logout,
    }),
    [status, session, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
