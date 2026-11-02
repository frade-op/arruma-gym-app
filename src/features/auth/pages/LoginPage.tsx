import { LoginForm } from "../components/LoginForm";
import { PreferencesControls } from "@/shared/components/PreferencesControls";
import { usePreferences } from "@/shared/preferences/PreferencesProvider";

export function LoginPage() {
  const { t } = usePreferences();

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
      <div className="absolute right-4 top-4">
        <PreferencesControls />
      </div>
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-xl">
        <div className="mb-8 text-center">
          <img
            src="/images/miss-anilha.jpg"
            alt={t("mascot.alt")}
            className="mx-auto mb-4 h-20 w-20 rounded-full bg-white object-contain"
          />
          <h1 className="text-2xl font-bold">{t("login.title")}</h1>
          <p className="mt-1 text-sm text-muted">{t("login.subtitle")}</p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-xs text-muted">
          {t("login.demo")}
        </p>
      </div>
    </main>
  );
}
