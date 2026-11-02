import { AuthError } from "./authApi";
import { createMockAuthApi, MOCK_REFRESH_KEY } from "./mockAuthApi";

const valid = { email: "membro@exemplo.com", password: "Senha@123" };

describe("mockAuthApi", () => {
  const api = () => createMockAuthApi({ latencyMs: 0 });

  it("faz login e não expõe a senha", async () => {
    const session = await api().login(valid);
    expect(session.user.email).toBe(valid.email);
    expect(session.user).not.toHaveProperty("password");
    expect(session.accessToken).toBeTruthy();
  });

  it("rejeita credenciais inválidas com mensagem genérica", async () => {
    const a = api();
    const wrongPass = await a.login({ ...valid, password: "x" }).catch((e) => e);
    const noUser = await a.login({ email: "nao@existe.com", password: "x" }).catch((e) => e);
    expect(wrongPass).toBeInstanceOf(AuthError);
    expect(wrongPass.message).toBe(noUser.message);
  });

  it("bloqueia após 5 tentativas falhas e libera após o tempo", async () => {
    let time = 1_000_000;
    const a = createMockAuthApi({ latencyMs: 0, now: () => time });
    for (let i = 0; i < 5; i++) await a.login({ ...valid, password: "x" }).catch(() => {});
    await expect(a.login(valid)).rejects.toMatchObject({ code: "TOO_MANY_ATTEMPTS" });
    time += 31_000;
    await expect(a.login(valid)).resolves.toBeDefined();
  });

  it("restaura sessão via refresh e encerra no logout", async () => {
    const a = api();
    await a.login(valid);
    await expect(a.refresh()).resolves.toMatchObject({ user: { email: valid.email } });
    await a.logout();
    expect(sessionStorage.getItem(MOCK_REFRESH_KEY)).toBeNull();
    await expect(a.refresh()).rejects.toMatchObject({ code: "SESSION_EXPIRED" });
  });
});
