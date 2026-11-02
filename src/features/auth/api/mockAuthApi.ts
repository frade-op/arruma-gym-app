import { AuthError, type AuthApi } from "./authApi";
import type { Session, User } from "../types";

// DADOS FALSOS: nunca coloque credenciais reais ou senhas em texto puro no código.
const FAKE_USERS: Array<User & { password: string }> = [
  { id: "1", name: "Ana Souza", email: "admin@exemplo.com", password: "Senha@123", role: "admin" },
  { id: "2", name: "Carlos Lima", email: "membro@exemplo.com", password: "Senha@123", role: "member" },
];

const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 30 * 1000;
/** Simula o cookie httpOnly de refresh que o backend real controlaria. */
export const MOCK_REFRESH_KEY = "mock_refresh_token";

interface MockOptions {
  latencyMs?: number;
  now?: () => number;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function randomToken(): string {
  return crypto.randomUUID().replaceAll("-", "");
}

export function createMockAuthApi({ latencyMs = 400, now = Date.now }: MockOptions = {}): AuthApi {
  const failures = new Map<string, { count: number; lockedUntil: number }>();

  function buildSession(user: User): Session {
    return { accessToken: randomToken(), expiresAt: now() + ACCESS_TOKEN_TTL_MS, user };
  }

  function toPublicUser({ password: _password, ...user }: User & { password: string }): User {
    return user;
  }

  return {
    async login({ email, password }) {
      await wait(latencyMs);
      const key = email.trim().toLowerCase();
      const record = failures.get(key) ?? { count: 0, lockedUntil: 0 };

      if (record.lockedUntil > now()) {
        throw new AuthError("TOO_MANY_ATTEMPTS", "Muitas tentativas. Tente novamente em instantes.");
      }

      const found = FAKE_USERS.find((u) => u.email === key);
      if (!found || found.password !== password) {
        const count = record.count + 1;
        failures.set(key, { count, lockedUntil: count >= MAX_ATTEMPTS ? now() + LOCKOUT_MS : 0 });
        // Mensagem genérica: não revela se o e-mail existe.
        throw new AuthError("INVALID_CREDENTIALS", "E-mail ou senha inválidos.");
      }

      failures.delete(key);
      const refreshToken = randomToken();
      sessionStorage.setItem(MOCK_REFRESH_KEY, `${refreshToken}:${found.id}`);
      return buildSession(toPublicUser(found));
    },

    async refresh() {
      await wait(latencyMs / 4);
      const userId = sessionStorage.getItem(MOCK_REFRESH_KEY)?.split(":")[1];
      const found = FAKE_USERS.find((u) => u.id === userId);
      if (!found) throw new AuthError("SESSION_EXPIRED", "Sessão expirada.");
      return buildSession(toPublicUser(found));
    },

    async logout() {
      sessionStorage.removeItem(MOCK_REFRESH_KEY);
    },
  };
}
