# Arruma Gym App

Portal de academia em React. Interface disponível em português (pt-BR) e inglês (en-US), com tema escuro por padrão e opção de tema claro.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router · React Hook Form + Zod · Lucide · Vitest + Testing Library

## Começando

```bash
npm install
npm run dev
npm test
npm run typecheck
npm run build
```

Login de demonstração: `membro@exemplo.com` / `Senha@123` (ou `admin@exemplo.com`).

## Preferências e identidade

- Idioma inicial: português (pt-BR); inglês (en-US) disponível nos controles da tela.
- Tema inicial: escuro; tema claro disponível nos controles da tela.
- Idioma e tema ficam em `localStorage`. Não armazene tokens ou dados de autenticação nessas preferências.
- Área do aluno inclui visão geral, pagamentos e frequência.
- Planos, matrículas, pagamentos e frequências são demonstrativos e ficam em `src/features/establishments/data/establishments.ts`. Nenhum pagamento é processado.
- Base Ativa Ermo usa mensalidade; Energia Jardim e Movimento Centro cobram por diária, vinculada às frequências demonstrativas.
- A identidade usa amarelo e preto.
- Gestão inclui três academias fictícias. O portal abre com visão geral de todas e permite selecionar uma academia.
- Na gestão, academias podem ser adicionadas por conexão (com contato por e-mail quando não listadas) ou cadastradas manualmente pelo nome. Cadastros manuais começam sem dados de pagamentos e frequência.
- Cadastros manuais desta demonstração ficam em memória e não persistem após recarregar a página.
- Pedidos de conexão são apenas demonstrativos; nenhum e-mail é enviado.
- Mascote Miss Anilha fica em `public/images/miss-anilha.jpg`.

## Estrutura

```text
src/
  app/        providers e rotas
  features/   domínios (auth, home, establishments, ...)
  shared/     componentes, utilitários e preferências sem regra de negócio
```

Novas funcionalidades entram em `features/`. Código genérico compartilhado fica em `shared/`. A arquitetura deve poder evoluir para atender mais de uma academia, mas modelo de tenant, permissões e isolamento de dados ficam fora do escopo até receber regras de negócio.

## Segurança da autenticação

- Access token somente em memória; nunca em `localStorage`.
- Rotas privadas protegidas por `ProtectedRoute`; login por `GuestRoute`.
- Redirecionamento pós-login validado por `getSafeRedirect`.
- Validação de entrada com Zod; mensagens de erro de login são genéricas nos dois idiomas.
- Mock simula bloqueio após 5 tentativas falhas (30 s).
- CSP injetado no build; React escapa saída por padrão.

## Integrando o backend (Spring Boot)

1. Implemente `AuthApi` em `src/features/auth/api/authApi.ts` com chamadas HTTP.
2. Troque o export em `src/features/auth/api/index.ts`.
3. No backend: refresh token em cookie `HttpOnly; Secure; SameSite=Strict`, access token de curta duração, rate limit e hash de senha (BCrypt/Argon2), CORS restrito, headers de segurança e CSRF conforme o desenho do cookie.

O mock guarda um refresh token em `sessionStorage` apenas para simular persistência; não é seguro e deve sumir com o backend real.

English documentation: [README.en.md](./README.en.md).
