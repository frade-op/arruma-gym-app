import {
  formatDemoDate,
  type EstablishmentCheckin,
} from "@/features/establishments/data/establishments";
import { usePreferences } from "@/shared/preferences/PreferencesProvider";

export function CheckinList({
  checkins,
}: {
  checkins: readonly EstablishmentCheckin[];
}) {
  const { language, t } = usePreferences();

  return (
    <ul className="overflow-hidden rounded-xl border border-border bg-surface">
      {checkins.map((checkin) => (
        <li
          key={`${checkin.establishmentId}-${checkin.date}-${checkin.time}`}
          className="grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 border-b border-border p-3 last:border-b-0 sm:grid-cols-[44px_minmax(0,1fr)_minmax(110px,0.55fr)_auto] sm:gap-4 sm:px-4"
        >
          <span className="grid h-11 w-11 content-center justify-items-center rounded-lg bg-brand-tint-background text-brand-tint-foreground">
            <strong className="text-base leading-none">
              {formatDemoDate(checkin.date, language, { day: "numeric" })}
            </strong>
            <span className="mt-1 text-[9px] font-bold uppercase">
              {formatDemoDate(checkin.date, language, { month: "short" })}
            </span>
          </span>
          <span className="grid min-w-0 gap-1">
            <strong className="truncate text-xs">
              {formatDemoDate(checkin.date, language, { weekday: "long", day: "numeric", month: "long" })}
            </strong>
            <span className="text-xs text-muted sm:hidden">
              {t("portal.checkin.recorded")} · {checkin.establishmentName}
            </span>
            <span className="hidden text-xs text-muted sm:inline">{t("portal.checkin.recorded")}</span>
          </span>
          <span className="hidden min-w-0 gap-1 sm:grid">
            <strong className="truncate text-xs">{checkin.establishmentName}</strong>
            <span className="text-xs text-muted">{t("portal.unit")}</span>
          </span>
          <time className="text-xs font-semibold" dateTime={`${checkin.date}T${checkin.time}`}>
            {checkin.time}
          </time>
        </li>
      ))}
    </ul>
  );
}
