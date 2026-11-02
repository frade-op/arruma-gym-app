import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AppRoutes } from "@/app/routes";
import { AuthProvider } from "./components/AuthProvider";
import { createMockAuthApi } from "./api/mockAuthApi";
import { PreferencesProvider } from "@/shared/preferences/PreferencesProvider";

function renderApp(path = "/") {
  const api = createMockAuthApi({ latencyMs: 0 });
  render(
    <PreferencesProvider>
      <MemoryRouter initialEntries={[path]}>
        <AuthProvider api={api}>
          <AppRoutes />
        </AuthProvider>
      </MemoryRouter>
    </PreferencesProvider>,
  );
}

async function fillAndSubmit(email: string, password: string) {
  const user = userEvent.setup();
  await user.type(await screen.findByLabelText("E-mail"), email);
  await user.type(screen.getByLabelText("Senha"), password);
  await user.click(screen.getByRole("button", { name: "Entrar" }));
}

describe("fluxo de autenticação", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = "pt-BR";
    document.documentElement.dataset.theme = "dark";
  });

  it("redireciona visitante para o login", async () => {
    renderApp("/");
    expect(await screen.findByRole("heading", { name: /bem-vindo/i })).toBeInTheDocument();
  });

  it("valida campos vazios", async () => {
    renderApp("/login");
    await userEvent.click(await screen.findByRole("button", { name: "Entrar" }));
    expect(await screen.findByText("Informe o e-mail.")).toBeInTheDocument();
    expect(screen.getByText("Informe a senha.")).toBeInTheDocument();
  });

  it("mostra erro com credenciais inválidas", async () => {
    renderApp("/login");
    await fillAndSubmit("membro@exemplo.com", "errada");
    expect(await screen.findByRole("alert")).toHaveTextContent("E-mail ou senha inválidos.");
  });

  it("loga, mostra a home e permite sair", async () => {
    renderApp("/login");
    await fillAndSubmit("membro@exemplo.com", "Senha@123");
    expect(await screen.findByRole("heading", { name: /olá, carlos lima/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /sair/i }));
    await waitFor(() => expect(screen.getByRole("heading", { name: /bem-vindo/i })).toBeInTheDocument());
  });

  it("permite trocar idioma e mostra validações traduzidas", async () => {
    renderApp("/login");
    await userEvent.click(await screen.findByRole("button", { name: "Mudar idioma para inglês" }));

    expect(screen.getByRole("heading", { name: "Welcome back" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("en-US");

    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByText("Enter your email.")).toBeInTheDocument();
    expect(screen.getByText("Enter your password.")).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText("Email"), "membro@exemplo.com");
    await userEvent.type(screen.getByLabelText("Password"), "Senha@123");
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByRole("heading", { name: "Hello, Carlos Lima!" })).toBeInTheDocument();
    expect(screen.getByText("Workouts this month")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
  });

  it("inicia em tema escuro e permite ativar tema claro", async () => {
    renderApp("/login");
    expect(document.documentElement.dataset.theme).toBe("dark");

    await userEvent.click(await screen.findByRole("button", { name: "Ativar tema claro" }));
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem("arruma-gym:theme")).toBe("light");
  });
});
