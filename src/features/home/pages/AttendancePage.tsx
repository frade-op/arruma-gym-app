import { Activity, Clock3, MapPin } from "lucide-react";
import { CheckinList } from "@/features/home/components/CheckinList";
import {
  getDemoMonth,
  getEstablishmentCheckins,
  getMostVisitedEstablishment,
} from "@/features/establishments/data/establishments";
import { useEstablishments } from "@/features/establishments/EstablishmentsProvider";
import { usePreferences } from "@/shared/preferences/PreferencesProvider";

export function AttendancePage() {
  const { language, t } = usePreferences();
  const { selectedEstablishmentId, selectedEstablishments } = useEstablishments();
  const checkins = getEstablishmentCheckins(selectedEstablishments);
  const establishment = selectedEstablishments[0];
  const mostRecent = checkins[0];
  const period = selectedEstablishments.find(({ period: itemPeriod }) => itemPeriod)?.period;
  const establishmentSummary = selectedEstablishmentId === "all"
    ? getMostVisitedEstablishment(selectedEstablishments)
    : establishment.name;
  const stats = [
    {
      icon: Activity,
      value: String(checkins.length),
      label: t("portal.attendance.workoutsIn", {
        month: period ? getDemoMonth({ period }, language) : t("establishments.noData"),
      }),
    },
    {
      icon: Clock3,
      value: mostRecent?.time ?? t("establishments.noData"),
      label: t("portal.attendance.lastWorkout"),
    },
    {
      icon: MapPin,
      value: establishmentSummary,
      label: t("portal.attendance.selectedEstablishment"),
    },
  ];

  return (
    <section>
      <div className="mb-7">
        <p className="mb-1 text-[10px] font-bold tracking-widest text-muted">{t("portal.attendance.eyebrow")}</p>
        <h1 className="text-3xl font-bold tracking-tight">{t("portal.attendance.title")}</h1>
        <p className="mt-1 text-sm text-muted">{t("portal.attendance.subtitle")}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map(({ icon: Icon, value, label }, index) => (
          <article key={label} className="flex min-h-24 items-center gap-3 rounded-xl border border-border bg-surface p-4">
            <span
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${
                index === 0
                  ? "bg-brand-tint-background text-brand-tint-foreground"
                  : "bg-background text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <span className="grid gap-1">
              <strong className="max-w-40 truncate text-lg font-bold">{value}</strong>
              <span className="text-xs text-muted">{label}</span>
            </span>
          </article>
        ))}
      </div>

      <section className="mt-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-[10px] font-bold tracking-widest text-muted">{t("portal.attendance.entries")}</p>
            <h2 className="text-xl font-bold">{t("portal.attendance.history")}</h2>
          </div>
        </div>
        {checkins.length > 0 ? (
          <CheckinList checkins={checkins} />
        ) : (
          <p className="rounded-xl border border-border bg-surface p-6 text-center text-sm text-muted">
            {t("portal.attendance.empty")}
          </p>
        )}
      </section>
    </section>
  );
}
