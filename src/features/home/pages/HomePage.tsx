import { Activity, CalendarCheck, Flame, type LucideIcon } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { usePreferences } from "@/shared/preferences/PreferencesProvider";

interface Stat {
  label: string;
  value: string;
  icon: LucideIcon;
}

export function HomePage() {
  const { user } = useAuth();
  const { language, t } = usePreferences();
  // DADOS FALSOS: substituir por chamada à API.
  const stats: Stat[] = [
    { label: t("home.stats.workouts"), value: "12", icon: CalendarCheck },
    {
      label: t("home.stats.calories"),
      value: new Intl.NumberFormat(language).format(8450),
      icon: Flame,
    },
    { label: t("home.stats.streak"), value: t("home.stats.days", { count: "5" }), icon: Activity },
  ];

  return (
    <section>
      <h1 className="text-2xl font-bold">{t("home.greeting", { name: user?.name ?? "" })}</h1>
      <p className="mt-1 text-muted">{t("home.summary")}</p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <li key={label} className="rounded-xl border border-border bg-surface p-5 shadow-sm">
            <Icon className="h-5 w-5 text-brand-600" aria-hidden />
            <p className="mt-3 text-2xl font-semibold">{value}</p>
            <p className="text-sm text-muted">{label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
