import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from "react";
import { messages, type Language, type MessageKey } from "./messages";

type Theme = "dark" | "light";
type MessageParams = Record<string, string>;

interface PreferencesContextValue {
  language: Language;
  theme: Theme;
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
  t: (key: MessageKey, params?: MessageParams) => string;
}

const LANGUAGE_KEY = "arruma-gym:language";
const THEME_KEY = "arruma-gym:theme";
const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function readLanguage(): Language {
  return localStorage.getItem(LANGUAGE_KEY) === "en-US" ? "en-US" : "pt-BR";
}

function readTheme(): Theme {
  return localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(readLanguage);
  const [theme, setTheme] = useState<Theme>(readTheme);

  useLayoutEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(LANGUAGE_KEY, language);
    localStorage.setItem(THEME_KEY, theme);
  }, [language, theme]);

  const t = (key: MessageKey, params: MessageParams = {}) => {
    let message: string = messages[language][key];
    for (const [name, value] of Object.entries(params)) {
      message = message.replaceAll(`{${name}}`, value);
    }
    return message;
  };

  return (
    <PreferencesContext.Provider value={{ language, theme, setLanguage, setTheme, t }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const preferences = useContext(PreferencesContext);
  if (!preferences) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }
  return preferences;
}
