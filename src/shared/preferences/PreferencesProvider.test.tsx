import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PreferencesProvider, usePreferences } from "./PreferencesProvider";

function PreferencesProbe() {
  const { language, setLanguage, setTheme, t, theme } = usePreferences();
  return (
    <>
      <p>{t("login.title")}</p>
      <p>{`${language}:${theme}`}</p>
      <button onClick={() => setLanguage("en-US")}>English</button>
      <button onClick={() => setTheme("light")}>Light</button>
    </>
  );
}

describe("preferências do app", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = "pt-BR";
    document.documentElement.dataset.theme = "dark";
  });

  it("usa português e tema escuro por padrão", () => {
    render(
      <PreferencesProvider>
        <PreferencesProbe />
      </PreferencesProvider>,
    );

    expect(screen.getByText("Bem-vindo de volta")).toBeInTheDocument();
    expect(screen.getByText("pt-BR:dark")).toBeInTheDocument();
  });

  it("persiste idioma e tema selecionados", async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <PreferencesProvider>
        <PreferencesProbe />
      </PreferencesProvider>,
    );

    await user.click(screen.getByRole("button", { name: "English" }));
    await user.click(screen.getByRole("button", { name: "Light" }));
    expect(localStorage.getItem("arruma-gym:language")).toBe("en-US");
    expect(localStorage.getItem("arruma-gym:theme")).toBe("light");

    unmount();
    render(
      <PreferencesProvider>
        <PreferencesProbe />
      </PreferencesProvider>,
    );
    expect(screen.getByText("en-US:light")).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("en-US");
    expect(document.documentElement.dataset.theme).toBe("light");
  });
});
