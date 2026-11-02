import { Activity, Clock3, MapPin } from "lucide-react";
import { useState } from "react";
import { CheckinList } from "@/features/home/components/CheckinList";
import {
  demoPortalData,
  getDemoMonth,
  getDemoUnits,
  getMostVisitedDemoUnit,
} from "@/features/home/data/demoPortalData";
import { usePreferences } from "@/shared/preferences/PreferencesProvider";

export function AttendancePage() {
  const { language, t } = usePreferences();
  const [selectedUnit, setSelectedUnit] = useState("all");
  const filteredCheckins =
    selectedUnit === "all"
      ? demoPortalData.checkins
      : demoPortalData.checkins.filter(({ unit }) => unit === selectedUnit);
  const mostRecent = demoPortalData.checkins[0];
  const stats = [
    {
      icon: Activity,
      value: String(demoPortalData.checkins.length),
      label: t("portal.attendance.workoutsIn", { month: getDemoMonth(language) }),
    },
    {
      icon: Clock3,
      value: mostRecent.time,
      label: t("portal.attendance.lastWorkout"),
    },
    {
      icon: MapPin,
      value: getMostVisitedDemoUnit(),
      label: t("portal.attendance.mostVisited"),
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
          <label className="grid gap-1.5 text-xs font-semibold text-muted">
            {t("portal.unit")}
            <select
              className="min-w-44 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              value={selectedUnit}
              onChange={(event) => setSelectedUnit(event.target.value)}
            >
              <option value="all">{t("portal.attendance.allUnits")}</option>
              {getDemoUnits().map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </label>
        </div>
        {filteredCheckins.length > 0 ? (
          <CheckinList checkins={filteredCheckins} />
        ) : (
          <p className="rounded-xl border border-border bg-surface p-6 text-center text-sm text-muted">
            {t("portal.attendance.empty")}
          </p>
        )}
      </section>
    </section>
  );
}
