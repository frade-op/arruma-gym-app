import {
  ChartNoAxesColumn,
  Building2,
  Dumbbell,
  LayoutDashboard,
  LogOut,
  WalletCards,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  ALL_ESTABLISHMENTS_ID,
  useEstablishments,
} from "@/features/establishments/EstablishmentsProvider";
import { Button } from "@/shared/components/Button";
import { PreferencesControls } from "@/shared/components/PreferencesControls";
import { usePreferences } from "@/shared/preferences/PreferencesProvider";

export function AppLayout() {
  const { user, logout } = useAuth();
  const { t } = usePreferences();
  const {
    establishments,
    selectedEstablishmentId,
    setSelectedEstablishmentId,
  } = useEstablishments();
  const navItems = [
    { to: "/", label: t("nav.overview"), mobileLabel: t("nav.home"), icon: LayoutDashboard },
    { to: "/payments", label: t("nav.payments"), mobileLabel: t("nav.payments"), icon: WalletCards },
    { to: "/attendance", label: t("nav.attendance"), mobileLabel: t("nav.attendance"), icon: ChartNoAxesColumn },
    { to: "/establishments", label: t("nav.establishments"), mobileLabel: t("nav.establishmentsShort"), icon: Building2 },
  ];

  const navigation = (mobile = false) => (
    <nav
      aria-label={t("nav.label")}
      className={mobile ? "grid grid-cols-4 gap-1" : "grid gap-1.5"}
    >
      {navItems.map(({ to, label, mobileLabel, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          aria-label={mobile ? mobileLabel : label}
          className={({ isActive }) =>
            `flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors ${
              mobile
                ? `min-h-12 flex-col justify-center gap-1 px-2 text-[10px] ${
                    isActive ? "text-brand-500" : "text-white/60"
                  }`
                : isActive
                  ? "bg-brand-500 text-brand-foreground"
                  : "text-white/65 hover:bg-white/10 hover:text-white"
            }`
          }
        >
          <Icon className="h-4 w-4 shrink-0" aria-hidden />
          <span>{mobile ? mobileLabel : label}</span>
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background text-foreground md:pl-60">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col bg-[#171715] px-5 py-7 text-white md:flex">
        <NavLink to="/" className="mb-12 flex w-fit items-center gap-2 font-bold text-white">
          <span className="grid h-9 w-10 -skew-x-12 place-items-center bg-brand-500 text-sm font-black italic text-brand-foreground">
            <Dumbbell className="h-5 w-5 skew-x-12" aria-hidden />
          </span>
          <span>ARRUMA GYM</span>
        </NavLink>
        <p className="mb-3 px-2 text-[10px] font-bold tracking-widest text-white/40">
          {t("nav.label")}
        </p>
        {navigation()}
        <div className="mt-auto border-t border-white/10 pt-4">
          <span className="rounded-full border border-white/15 px-2.5 py-1 text-[9px] font-bold tracking-wide text-white/70">
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {t("sidebar.beta")}
          </span>
          <p className="mb-0 mt-3 text-xs text-white/40">{t("sidebar.tagline")}</p>
        </div>
      </aside>

      <header className="sticky top-0 z-10 border-b border-border bg-surface">
        <div className="flex h-16 items-center justify-between gap-2 px-3 sm:gap-3 sm:px-6 lg:px-10">
          <NavLink to="/" className="flex shrink-0 items-center gap-2 font-bold md:hidden">
            <Dumbbell className="h-5 w-5 text-brand-600" aria-hidden />
            <span className="hidden sm:inline">Arruma Gym</span>
          </NavLink>
          <div className="ml-auto flex min-w-0 items-center gap-1.5 sm:gap-3">
            <label className="sr-only" htmlFor="active-establishment">
              {t("establishments.selectorLabel")}
            </label>
            <select
              id="active-establishment"
              aria-label={t("establishments.selectorLabel")}
              value={selectedEstablishmentId}
              onChange={(event) => setSelectedEstablishmentId(event.target.value)}
              className="max-w-32 rounded-lg border border-border bg-background px-2 py-2 text-xs font-semibold text-foreground sm:max-w-52 sm:px-3 sm:text-sm"
            >
              <option value={ALL_ESTABLISHMENTS_ID}>{t("establishments.all")}</option>
              {establishments.map(({ id, name }) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
            <PreferencesControls />
            <span className="hidden max-w-36 truncate text-sm font-semibold lg:block">{user?.name}</span>
            <Button
              variant="ghost"
              onClick={() => void logout()}
              aria-label={t("app.logout")}
              className="px-2 sm:px-3"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">{t("app.logout")}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 pb-24 sm:px-6 lg:px-10 lg:py-10 md:pb-10">
        <Outlet />
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-[#171715] px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 md:hidden">
        {navigation(true)}
      </div>
    </div>
  );
}
