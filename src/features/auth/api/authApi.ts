import type { LoginCredentials, Session } from "../types";

/**
 * Contrato do backend de autenticação.
 * Para integrar o Spring Boot, crie uma implementação (ex.: httpAuthApi) e troque em `index.ts`.
 */
export interface AuthApi {
  login(credentials: LoginCredentials): Promise<Session>;
  /** Restaura a sessão (no backend real: via cookie httpOnly de refresh). */
  refresh(): Promise<Session>;
  logout(): Promise<void>;
}

export class AuthError extends Error {
  constructor(
    public readonly code: "INVALID_CREDENTIALS" | "TOO_MANY_ATTEMPTS" | "SESSION_EXPIRED",
    message: string,
  ) {
    super(message);
    this.name = "AuthError";
  }
}
