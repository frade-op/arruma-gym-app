# Arruma Gym App

Frontend em React com autenticação, tela de login e home. Backend ainda não existe (previsto: Spring Boot), então tudo usa **dados falsos**.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router · React Hook Form + Zod · Lucide · Vitest + Testing Library

## Começando

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # testes unitários
npm run typecheck
npm run build
```

Login de demonstração: `membro@exemplo.com` / `Senha@123` (ou `admin@exemplo.com`).

## Estrutura

```
src/
  app/        providers e rotas
  features/   um diretório por domínio (auth, home, ...)
    auth/     api/, components/, hooks/, pages/, schemas.ts, types.ts
  shared/     componentes e utilitários sem regra de negócio
  test/       setup dos testes
```

Novas funcionalidades entram como nova pasta em `features/`. Código usado por mais de uma feature vai para `shared/`.

## Segurança da autenticação

- Access token **somente em memória** (nunca `localStorage`), renovado antes de expirar.
- Rotas privadas protegidas por `ProtectedRoute`; login por `GuestRoute`.
- Redirecionamento pós-login validado (`getSafeRedirect`) contra open redirect.
- Validação de entrada com Zod; mensagem de erro genérica (não revela se o e-mail existe).
- Mock simula bloqueio após 5 tentativas falhas (30 s).
- CSP injetado no build; React escapa saída por padrão (sem `dangerouslySetInnerHTML`).

## Integrando o backend (Spring Boot)

1. Implemente a interface `AuthApi` ([authApi.ts](src/features/auth/api/authApi.ts)) com chamadas HTTP.
2. Troque o export em [api/index.ts](src/features/auth/api/index.ts).
3. No backend: refresh token em cookie `HttpOnly; Secure; SameSite=Strict`, access token de curta duração, rate limit e hash de senha (BCrypt/Argon2), CORS restrito, headers de segurança e CSRF conforme o desenho do cookie.

O mock guarda um "refresh token" em `sessionStorage` apenas para simular persistência; **não** é seguro e deve sumir com o backend real.
