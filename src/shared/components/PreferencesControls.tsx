import { Moon, Sun } from "lucide-react";
import { Button } from "./Button";
import { usePreferences } from "@/shared/preferences/PreferencesProvider";

export function PreferencesControls() {
  const { language, theme, setLanguage, setTheme, t } = usePreferences();

  return (
    <div className="flex items-center gap-2" aria-label={t("preferences.controls")}>
      <Button
        variant="ghost"
        type="button"
        aria-label={theme === "dark" ? t("preferences.themeToLight") : t("preferences.themeToDark")}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? (
          <Sun className="h-4 w-4" aria-hidden />
        ) : (
          <Moon className="h-4 w-4" aria-hidden />
        )}
      </Button>
      <Button
        variant="ghost"
        type="button"
        aria-label={
          language === "pt-BR"
            ? t("preferences.languageToEnglish")
            : t("preferences.languageToPortuguese")
        }
        onClick={() => setLanguage(language === "pt-BR" ? "en-US" : "pt-BR")}
      >
        {language === "pt-BR" ? "EN" : "PT-BR"}
      </Button>
    </div>
  );
}
