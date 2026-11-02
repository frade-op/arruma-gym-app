import { ArrowRight, CalendarCheck, ChartNoAxesColumn, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { CheckinList } from "@/features/home/components/CheckinList";
import {
  formatDemoDate,
  formatDemoMoney,
  getDemoMonth,
  getEstablishmentCheckins,
  getNextDueEstablishment,
  getWeeklyActivity,
} from "@/features/establishments/data/establishments";
import { useEstablishments } from "@/features/establishments/EstablishmentsProvider";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { usePreferences } from "@/shared/preferences/PreferencesProvider";

export function HomePage() {
  const { user } = useAuth();
  const { language, t } = usePreferences();
  const { selectedEstablishmentId, selectedEstablishments } = useEstablishments();
  const isAllEstablishments = selectedEstablishmentId === "all";
  const establishment = selectedEstablishments[0];
  const checkins = getEstablishmentCheckins(selectedEstablishments);
  const nextDueEstablishment = getNextDueEstablishment(selectedEstablishments);
  const planPayment = nextDueEstablishment?.payments[0];
  const period = selectedEstablishments.find(({ period: itemPeriod }) => itemPeriod)?.period;
  const month = period
    ? getDemoMonth({ period }, language)
    : t("establishments.noData");
  const weeklyActivity = getWeeklyActivity(selectedEstablishments);

  return (
    <section>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">
            {period
              ? formatDemoDate(period, language, {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })
              : t("establishments.noData")}
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("home.greeting", { name: user?.name ?? "" })}{" "}
            <span className="text-brand-600" aria-hidden>✦</span>
          </h1>
          <p className="mt-1 text-sm text-muted">{t("portal.overview.subtitle")}</p>
        </div>
        <span className="rounded-lg border border-border px-3 py-2 text-[10px] font-bold tracking-wider text-muted">
          {isAllEstablishments ? (
            <strong className="ml-1 text-foreground">
              {t("establishments.count", { count: String(selectedEstablishments.length) })}
            </strong>
          ) : (
            <>
              {t("portal.memberId")}{" "}
              <strong className="ml-1 text-foreground">
                {establishment.memberId ? `#${establishment.memberId}` : t("establishments.noData")}
              </strong>
            </>
          )}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="relative overflow-hidden rounded-xl bg-[#171715] p-5 text-white sm:p-6">
          <div className="pointer-events-none absolute -bottom-28 -right-10 h-56 w-56 rounded-full border border-brand-500/20" />
          <div className="pointer-events-none absolute -bottom-24 -right-4 h-44 w-44 rounded-full border border-brand-500/15" />
          <div className="relative flex items-center justify-between gap-3">
            <p className="text-[10px] font-bold tracking-widest text-white/65">{t("portal.plan.status")}</p>
            {nextDueEstablishment ? (
              <span className="rounded-full bg-success-background px-2.5 py-1 text-[9px] font-bold tracking-wide text-success-foreground">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {t("portal.plan.active")}
              </span>
            ) : (
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-bold tracking-wide text-white/65">
                {t("establishments.noData")}
              </span>
            )}
          </div>
          <div className="relative my-6 flex items-center justify-between gap-4">
            <div>
              <p className="mb-4 text-xs text-white/75">
                {isAllEstablishments
                  ? nextDueEstablishment?.name ?? t("establishments.noData")
                  : t("portal.plan.name")}
              </p>
              <p className="mb-0.5 text-xs text-white/55">{t("portal.plan.nextDue")}</p>
              <p className="text-4xl font-black leading-none text-brand-500">
                {nextDueEstablishment
                  ? formatDemoDate(nextDueEstablishment.nextDueDate, language, { day: "2-digit" })
                  : t("establishments.noData")}
                {nextDueEstablishment && (
                  <>
                    <span className="ml-1 text-base uppercase">
                      {formatDemoDate(nextDueEstablishment.nextDueDate, language, { month: "short" })}
                    </span>
                    <span className="ml-2 text-xs font-medium text-white/75">
                      {formatDemoDate(nextDueEstablishment.nextDueDate, language, { year: "numeric" })}
                    </span>
                  </>
                )}
              </p>
              {isAllEstablishments && nextDueEstablishment && (
                <p className="mt-1 text-xs text-white/65">{nextDueEstablishment.name}</p>
              )}
            </div>
            <CreditCard className="h-14 w-14 shrink-0 rounded-full border border-brand-500/25 p-3 text-brand-500" aria-hidden />
          </div>
          <div className="relative flex flex-wrap justify-between gap-2 border-t border-white/15 pt-3 text-[10px]">
            <span className="text-white/60">{t("portal.plan.lastPayment")}</span>
            <strong>
              {planPayment
                ? <>
                    {formatDemoDate(planPayment.date, language, { day: "2-digit", month: "short", year: "numeric" })}
                    {" · "}
                    {formatDemoMoney(planPayment.amount, language)}
                    {isAllEstablishments && ` · ${nextDueEstablishment.name}`}
                  </>
                : t("establishments.noData")}
            </strong>
          </div>
          <Link
            to="/payments"
            className="relative mt-3 inline-flex items-center gap-2 text-xs font-bold text-brand-500 hover:text-white"
          >
            {t("portal.payments.viewHistory")} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </article>

        <article className="rounded-xl border border-border bg-surface p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-[10px] font-bold tracking-widest text-muted">{t("portal.attendance.rhythm")}</p>
              <h2 className="text-xl font-bold">{t("portal.attendance.title")}</h2>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-tint-background text-brand-tint-foreground">
              <ChartNoAxesColumn className="h-4 w-4" aria-hidden />
            </span>
          </div>
          <p className="my-3 flex items-baseline gap-2">
            <strong className="text-3xl font-black">{checkins.length}</strong>
            <span className="text-xs text-muted">{t("portal.attendance.workoutsIn", { month })}</span>
          </p>
          {checkins.length > 0 ? <div
            className="mb-3 flex h-24 items-end justify-between gap-2 border-b border-border px-1"
            role="img"
            aria-label={t("portal.attendance.weeklyChart")}
          >
            {weeklyActivity.map(({ day, height }, index) => (
              <span key={day} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                <span
                  className={`w-full max-w-6 rounded-t ${[1, 3, 4].includes(index) ? "bg-brand-500" : "bg-border"}`}
                  style={{ height: `${height}%` }}
                />
                <span className="pb-1 text-[8px] font-bold text-muted">{t(day)}</span>
              </span>
            ))}
          </div> : (
            <p className="mb-3 border-b border-border py-8 text-center text-xs text-muted">
              {t("portal.attendance.empty")}
            </p>
          )}
          <Link
            to="/attendance"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-tint-foreground hover:text-foreground"
          >
            {t("portal.attendance.viewHistory")} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </article>
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-[10px] font-bold tracking-widest text-muted">{t("portal.overview.routine")}</p>
            <h2 className="text-xl font-bold">{t("portal.attendance.recent")}</h2>
          </div>
          <Link to="/attendance" className="inline-flex items-center gap-2 text-xs font-bold text-brand-tint-foreground hover:text-foreground">
            {t("portal.common.viewAll")} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
        <CheckinList checkins={checkins.slice(0, 3)} />
      </section>

      <p className="mt-5 flex items-center gap-2 text-xs text-muted">
        <CalendarCheck className="h-4 w-4" aria-hidden />
        {t("portal.demo.notice")}
      </p>
    </section>
  );
}
