import {
  demoPortalData,
  formatDemoDate,
  formatDemoMoney,
} from "@/features/home/data/demoPortalData";
import { usePreferences } from "@/shared/preferences/PreferencesProvider";

export function PaymentsPage() {
  const { language, t } = usePreferences();

  return (
    <section>
      <div className="mb-7">
        <p className="mb-1 text-[10px] font-bold tracking-widest text-muted">{t("portal.payments.eyebrow")}</p>
        <h1 className="text-3xl font-bold tracking-tight">{t("portal.payments.title")}</h1>
        <p className="mt-1 text-sm text-muted">{t("portal.payments.subtitle")}</p>
      </div>

      <article className="rounded-xl border border-border bg-surface p-5 sm:p-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-success-background px-3 py-1.5 text-xs font-bold text-success-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {t("portal.payments.upToDate")}
        </span>
        <dl className="mt-5 grid gap-5 border-t border-border pt-5 sm:grid-cols-2">
          <div>
            <dt className="text-[10px] font-bold tracking-widest text-muted">{t("portal.plan.nameLabel")}</dt>
            <dd className="mt-1 text-sm font-semibold">{t("portal.plan.name")}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold tracking-widest text-muted">{t("portal.plan.nextDue")}</dt>
            <dd className="mt-1 text-sm font-semibold">
              {formatDemoDate(demoPortalData.nextDueDate, language)}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold tracking-widest text-muted">{t("portal.plan.lastPayment")}</dt>
            <dd className="mt-1 text-sm font-semibold">
              {formatDemoDate(demoPortalData.payments[0].date, language)}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold tracking-widest text-muted">{t("portal.payments.monthlyAmount")}</dt>
            <dd className="mt-1 text-sm font-semibold">
              {formatDemoMoney(demoPortalData.monthlyPrice, language)}
            </dd>
          </div>
        </dl>
        <p className="mt-5 border-t border-border pt-4 text-xs text-muted">{t("portal.demo.notice")}</p>
      </article>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-[10px] font-bold tracking-widest text-muted">{t("portal.payments.activity")}</p>
            <h2 className="text-xl font-bold">{t("portal.payments.history")}</h2>
          </div>
          <span className="text-xs text-muted">
            {t("portal.payments.records", { count: String(demoPortalData.payments.length) })}
          </span>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[560px] text-left text-xs">
            <thead className="bg-background text-[10px] font-bold tracking-wider text-muted">
              <tr>
                <th scope="col" className="px-4 py-3">{t("portal.payments.reference")}</th>
                <th scope="col" className="px-4 py-3">{t("portal.payments.date")}</th>
                <th scope="col" className="px-4 py-3">{t("portal.payments.amount")}</th>
                <th scope="col" className="px-4 py-3">{t("portal.payments.status")}</th>
              </tr>
            </thead>
            <tbody>
              {demoPortalData.payments.map((payment) => (
                <tr key={payment.date} className="border-t border-border">
                  <td className="px-4 py-4 font-semibold">
                    {formatDemoDate(payment.date, language, { month: "long", year: "numeric" })}
                  </td>
                  <td className="px-4 py-4">{formatDemoDate(payment.date, language, { day: "2-digit", month: "short", year: "numeric" })}</td>
                  <td className="px-4 py-4 font-semibold">{formatDemoMoney(payment.amount, language)}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 font-bold text-success-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {t("portal.payments.paid")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
