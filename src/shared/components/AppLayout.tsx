import { Dumbbell, LogOut } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/shared/components/Button";
import { PreferencesControls } from "@/shared/components/PreferencesControls";
import { usePreferences } from "@/shared/preferences/PreferencesProvider";

export function AppLayout() {
  const { user, logout } = useAuth();
  const { t } = usePreferences();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 font-bold">
            <Dumbbell className="h-5 w-5 text-brand-600" aria-hidden />
            Arruma Gym
          </div>
          <div className="flex items-center gap-3">
            <PreferencesControls />
            <span className="hidden text-sm text-muted sm:inline">{user?.name}</span>
            <Button variant="ghost" onClick={() => void logout()}>
              <LogOut className="h-4 w-4" aria-hidden />
              {t("app.logout")}
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
