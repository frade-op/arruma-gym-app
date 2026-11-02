import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AppRoutes } from "@/app/routes";
import { AuthProvider } from "./components/AuthProvider";
import { createMockAuthApi } from "./api/mockAuthApi";

function renderApp(path = "/") {
  const api = createMockAuthApi({ latencyMs: 0 });
  render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider api={api}>
        <AppRoutes />
      </AuthProvider>
    </MemoryRouter>,
  );
}

async function fillAndSubmit(email: string, password: string) {
  const user = userEvent.setup();
  await user.type(await screen.findByLabelText("E-mail"), email);
  await user.type(screen.getByLabelText("Senha"), password);
  await user.click(screen.getByRole("button", { name: "Entrar" }));
}

describe("fluxo de autenticação", () => {
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
});
