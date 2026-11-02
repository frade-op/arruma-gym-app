export type UserRole = "admin" | "member";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Session {
  accessToken: string;
  /** Epoch em ms em que o access token expira. */
  expiresAt: number;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";
