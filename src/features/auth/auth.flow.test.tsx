import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AppRoutes } from "@/app/routes";
import { AuthProvider } from "./components/AuthProvider";
import { createMockAuthApi } from "./api/mockAuthApi";
import { PreferencesProvider } from "@/shared/preferences/PreferencesProvider";
import { EstablishmentsProvider } from "@/features/establishments/EstablishmentsProvider";

function renderApp(path = "/") {
  const api = createMockAuthApi({ latencyMs: 0 });
  render(
    <PreferencesProvider>
      <EstablishmentsProvider>
        <MemoryRouter initialEntries={[path]}>
          <AuthProvider api={api}>
            <AppRoutes />
          </AuthProvider>
        </MemoryRouter>
      </EstablishmentsProvider>
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
    expect(screen.getByText("workouts in October")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("link", { name: "View payment history" }));
    expect(await screen.findByRole("heading", { name: "Payment history" })).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole("link", { name: "Attendance" })[0]);
    expect(await screen.findByRole("heading", { name: "Workout history" })).toBeInTheDocument();

    await userEvent.click(screen.getAllByRole("link", { name: "Gyms" })[0]);
    expect(await screen.findByRole("heading", { name: "Gyms and fitness centers" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Add a gym" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("radio", { name: /i can't find the gym/i }));
    expect(screen.getByText("This demo does not send requests. The Arruma Gym team must contact the establishment to request access to its system.")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Close dialog" }));
  });

  it("inicia em tema escuro e permite ativar tema claro", async () => {
    renderApp("/login");
    expect(document.documentElement.dataset.theme).toBe("dark");

    await userEvent.click(await screen.findByRole("button", { name: "Ativar tema claro" }));
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem("arruma-gym:theme")).toBe("light");
  });

  it("navega por pagamentos e frequência da academia selecionada", async () => {
    renderApp("/login");
    await fillAndSubmit("membro@exemplo.com", "Senha@123");

    const establishmentSelect = await screen.findByRole("combobox", { name: "Selecionar academia" });
    expect(establishmentSelect).toHaveValue("all");
    await userEvent.click(await screen.findByRole("link", { name: "Ver histórico de pagamentos" }));
    expect(await screen.findByRole("heading", { name: "Pagamentos" })).toBeInTheDocument();
    expect(screen.getByText("10 registros")).toBeInTheDocument();
    expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(11);
    const paymentCards = screen.getAllByRole("article");
    expect(paymentCards.map((card) => within(card).getByRole("heading").textContent)).toEqual([
      "Base Ativa Ermo",
      "Energia Jardim",
      "Movimento Centro",
    ]);
    expect(within(paymentCards[0]).getByText("R$ 129,90")).toBeInTheDocument();
    expect(within(paymentCards[1]).getByText("R$ 24,90 / diária")).toBeInTheDocument();
    expect(within(paymentCards[1]).getByText("3 DIÁRIAS PAGAS")).toBeInTheDocument();
    expect(within(paymentCards[2]).getByText("R$ 29,90 / diária")).toBeInTheDocument();
    expect(within(paymentCards[2]).getByText("2 DIÁRIAS PAGAS")).toBeInTheDocument();

    await userEvent.selectOptions(establishmentSelect, "jardim");
    expect(screen.getByText("3 registros")).toBeInTheDocument();
    expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(4);
    await userEvent.click(screen.getAllByRole("link", { name: "Frequência" })[0]);
    expect(await screen.findByRole("heading", { name: "Histórico de treinos" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getAllByText("Energia Jardim").length).toBeGreaterThan(0);
  });

  it("abre sempre com todas as academias selecionadas e agrega frequências", async () => {
    localStorage.setItem("arruma-gym:establishment", "jardim");
    renderApp("/login");
    await fillAndSubmit("membro@exemplo.com", "Senha@123");

    expect(await screen.findByRole("combobox", { name: "Selecionar academia" })).toHaveValue("all");
    const activePlanCard = screen.getAllByRole("article")[0];
    expect(within(activePlanCard).getAllByText("Base Ativa Ermo")).toHaveLength(2);
    expect(within(activePlanCard).getByText(/R\$ 129,90 · Base Ativa Ermo/)).toBeInTheDocument();
    expect(within(activePlanCard).queryByText(/Energia Jardim/)).not.toBeInTheDocument();
    await userEvent.click(await screen.findByRole("link", { name: "Ver histórico de treinos" }));
    expect(await screen.findByRole("heading", { name: "Histórico de treinos" })).toBeInTheDocument();
    const attendanceList = screen.getByRole("list");
    expect(within(attendanceList).getAllByRole("listitem")).toHaveLength(26);
    expect(within(attendanceList).getAllByText("Base Ativa Ermo")).toHaveLength(21);
    expect(within(attendanceList).getAllByText("Energia Jardim")).toHaveLength(3);
    expect(within(attendanceList).getAllByText("Movimento Centro")).toHaveLength(2);
  });

  it("registra pedido de contato para uma academia fora da lista", async () => {
    renderApp("/login");
    await fillAndSubmit("membro@exemplo.com", "Senha@123");

    await userEvent.click((await screen.findAllByRole("link", { name: "Academias" }))[0]);
    expect(await screen.findByRole("heading", { name: "Academias e centros" })).toBeInTheDocument();
    expect(screen.getAllByText("Movimento Centro").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Base Ativa Ermo").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Energia Jardim").length).toBeGreaterThan(0);

    await userEvent.click(screen.getByRole("button", { name: "Adicionar academia" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.queryByText(
      "Nesta demonstração, a solicitação não é enviada. A equipe Arruma Gym precisará entrar em contato para pedir acesso ao sistema do estabelecimento.",
    )).not.toBeInTheDocument();

    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Academia" }), "ermo");
    await userEvent.click(screen.getByRole("button", { name: "Registrar solicitação" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Solicitação demonstrativa registrada para Base Ativa Ermo.",
    );

    await userEvent.click(screen.getByRole("button", { name: "Adicionar academia" }));
    await userEvent.click(screen.getByRole("radio", { name: /não encontrei a academia/i }));
    expect(screen.getByText(
      "Nesta demonstração, a solicitação não é enviada. A equipe Arruma Gym precisará entrar em contato para pedir acesso ao sistema do estabelecimento.",
    )).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText("Nome da academia ou estabelecimento"), "Força e Saúde");
    await userEvent.type(screen.getByLabelText("E-mail de contato da academia"), "contato@forca.exemplo");
    await userEvent.click(screen.getByRole("button", { name: "Registrar solicitação" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Solicitação demonstrativa registrada para Força e Saúde.",
    );
    expect(screen.getByText("contato@forca.exemplo")).toBeInTheDocument();
    expect(screen.getByText(/Nenhum e-mail foi enviado/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Adicionar academia" }));
    await userEvent.click(screen.getByRole("radio", { name: /quero cadastrar manualmente/i }));
    expect(screen.queryByText(
      "Nesta demonstração, a solicitação não é enviada. A equipe Arruma Gym precisará entrar em contato para pedir acesso ao sistema do estabelecimento.",
    )).not.toBeInTheDocument();
    expect(screen.queryByLabelText("E-mail de contato da academia")).not.toBeInTheDocument();
    await userEvent.type(screen.getByLabelText("Nome da academia ou estabelecimento"), "Clube Novo");
    await userEvent.click(screen.getByRole("button", { name: "Cadastrar academia" }));

    expect(screen.getByRole("status")).toHaveTextContent("Academia Clube Novo cadastrada manualmente.");
    const gymSelector = screen.getByRole("combobox", { name: "Selecionar academia" });
    const manualGymOption = screen.getByRole("option", { name: "Clube Novo" });
    await userEvent.selectOptions(gymSelector, manualGymOption);
    await userEvent.click(screen.getAllByRole("link", { name: "Visão geral" })[0]);
    expect(await screen.findAllByText("Sem dados registrados")).not.toHaveLength(0);
    await userEvent.click(screen.getByRole("link", { name: "Ver histórico de pagamentos" }));
    expect(await screen.findByRole("heading", { name: "Pagamentos" })).toBeInTheDocument();
    expect(screen.getByText("0 registros")).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole("link", { name: "Frequência" })[0]);
    expect(await screen.findByRole("heading", { name: "Histórico de treinos" })).toBeInTheDocument();
    expect(screen.getByText("Nenhum treino encontrado nesta academia.")).toBeInTheDocument();
  });
});
