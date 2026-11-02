# Arruma Gym App

Gym portal built with React. The interface supports Brazilian Portuguese (pt-BR) and English (en-US), with dark mode enabled by default and a light theme option.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router · React Hook Form + Zod · Lucide · Vitest + Testing Library

## Getting started

```bash
npm install
npm run dev
npm test
npm run typecheck
npm run build
```

Demo login: `membro@exemplo.com` / `Senha@123` (or `admin@exemplo.com`).

## Preferences and identity

- Default language: Brazilian Portuguese (pt-BR); English (en-US) is available in the screen controls.
- Default theme: dark; light theme is available in the screen controls.
- Language and theme are stored in `localStorage`. Never store tokens or authentication data in these preferences.
- The yellow-and-black identity takes visual inspiration from the RT Fitness demo. The demo is a visual and functional reference; its data and brand are not used.
- The Miss Anilha mascot is stored at `public/images/miss-anilha.jpg`.

## Structure

```text
src/
  app/        providers and routes
  features/   domains (auth, home, ...)
  shared/     components, utilities, and preferences without business rules
```

Add features under `features/`. Keep generic shared code in `shared/`. The architecture should be able to evolve for multiple gyms, but tenant models, permissions, and data isolation remain out of scope until business rules are provided.

## Authentication security

- Keep access tokens in memory only; never use `localStorage`.
- Protect private routes with `ProtectedRoute`; use `GuestRoute` for login.
- Validate post-login redirects with `getSafeRedirect`.
- Validate input with Zod; login errors stay generic in both languages.
- The mock simulates a lockout after 5 failed attempts (30 s).
- CSP is injected at build time; React escapes output by default.

## Connecting the backend (Spring Boot)

1. Implement `AuthApi` in `src/features/auth/api/authApi.ts` with HTTP calls.
2. Replace the export in `src/features/auth/api/index.ts`.
3. Backend requirements: refresh token in an `HttpOnly; Secure; SameSite=Strict` cookie, short-lived access token, rate limiting, password hashing (BCrypt/Argon2), restricted CORS, security headers, and CSRF protection as required by the cookie design.

The mock stores a refresh token in `sessionStorage` only to simulate persistence; this is not secure and must be removed when the real backend is added.

Documentação em português: [README.md](./README.md).
