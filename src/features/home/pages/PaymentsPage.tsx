import {
  formatDemoDate,
  formatDemoMoney,
  getEstablishmentPayments,
} from "@/features/establishments/data/establishments";
import { useEstablishments } from "@/features/establishments/EstablishmentsProvider";
import { usePreferences } from "@/shared/preferences/PreferencesProvider";

export function PaymentsPage() {
  const { language, t } = usePreferences();
  const { selectedEstablishmentId, selectedEstablishments } = useEstablishments();
  const isAllEstablishments = selectedEstablishmentId === "all";
  const payments = getEstablishmentPayments(selectedEstablishments);
  const establishments = [...selectedEstablishments].sort((a, b) => {
    const displayOrder = ["ermo", "jardim", "centro"];
    const aOrder = displayOrder.indexOf(a.id);
    const bOrder = displayOrder.indexOf(b.id);
    return (aOrder < 0 ? displayOrder.length : aOrder) - (bOrder < 0 ? displayOrder.length : bOrder);
  });

  return (
    <section>
      <div className="mb-7">
        <p className="mb-1 text-[10px] font-bold tracking-widest text-muted">{t("portal.payments.eyebrow")}</p>
        <h1 className="text-3xl font-bold tracking-tight">{t("portal.payments.title")}</h1>
        <p className="mt-1 text-sm text-muted">{t("portal.payments.subtitle")}</p>
      </div>

      <div className={`grid gap-4 ${isAllEstablishments ? "lg:grid-cols-3" : ""}`}>
        {establishments.map((establishment) => {
          const establishmentPayments = getEstablishmentPayments([establishment]);
          const isDaily = establishment.billingType === "daily";
          return (
          <article key={establishment.id} className="rounded-xl border border-border bg-surface p-5 sm:p-6">
            {isAllEstablishments && (
              <h2 className="mb-4 text-lg font-bold">{establishment.name}</h2>
            )}
            {isDaily ? (
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
                establishmentPayments.length > 0
                  ? "bg-success-background text-success-foreground"
                  : "bg-background text-muted"
              }`}>
                {establishmentPayments.length > 0 && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                )}
                {establishmentPayments.length > 0
                  ? t("portal.payments.dailyPaid", { count: String(establishmentPayments.length) })
                  : t("portal.payments.noDailyVisits")}
              </span>
            ) : establishment.nextDueDate ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-success-background px-3 py-1.5 text-xs font-bold text-success-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {t("portal.payments.upToDate")}
              </span>
            ) : (
              <span className="text-xs font-semibold text-muted">{t("establishments.noData")}</span>
            )}
            <dl className="mt-5 grid gap-5 border-t border-border pt-5 sm:grid-cols-2">
              {!isAllEstablishments && !isDaily && (
                <div>
                  <dt className="text-[10px] font-bold tracking-widest text-muted">{t("portal.plan.nameLabel")}</dt>
                  <dd className="mt-1 text-sm font-semibold">{t("portal.plan.name")}</dd>
                </div>
              )}
              <div>
                <dt className="text-[10px] font-bold tracking-widest text-muted">
                  {isDaily ? t("portal.payments.billingType") : t("portal.plan.nextDue")}
                </dt>
                <dd className="mt-1 text-sm font-semibold">
                  {isDaily
                    ? t("portal.payments.perVisit")
                    : establishment.nextDueDate
                      ? formatDemoDate(establishment.nextDueDate, language)
                      : t("establishments.noData")}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold tracking-widest text-muted">
                  {isDaily ? t("portal.payments.lastVisitPayment") : t("portal.plan.lastPayment")}
                </dt>
                <dd className="mt-1 text-sm font-semibold">
                  {establishmentPayments[0]
                    ? formatDemoDate(establishmentPayments[0].date, language)
                    : t("establishments.noData")}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold tracking-widest text-muted">{t("portal.payments.amountLabel")}</dt>
                <dd className="mt-1 text-sm font-semibold">
                  {establishment.amount !== undefined
                    ? `${formatDemoMoney(establishment.amount, language)}${isDaily ? ` / ${t("portal.payments.perDayUnit")}` : ""}`
                    : t("establishments.noData")}
                </dd>
              </div>
            </dl>
            {!isAllEstablishments && (
              <p className="mt-5 border-t border-border pt-4 text-xs text-muted">{t("portal.demo.notice")}</p>
            )}
          </article>
          );
        })}
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-[10px] font-bold tracking-widest text-muted">{t("portal.payments.activity")}</p>
            <h2 className="text-xl font-bold">{t("portal.payments.history")}</h2>
          </div>
          <span className="text-xs text-muted">
            {t("portal.payments.records", { count: String(payments.length) })}
          </span>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[560px] text-left text-xs">
            <thead className="bg-background text-[10px] font-bold tracking-wider text-muted">
              <tr>
                <th scope="col" className="px-4 py-3">{t("portal.payments.reference")}</th>
                {isAllEstablishments && (
                  <th scope="col" className="px-4 py-3">{t("establishments.title")}</th>
                )}
                <th scope="col" className="px-4 py-3">{t("portal.payments.date")}</th>
                <th scope="col" className="px-4 py-3">{t("portal.payments.amount")}</th>
                <th scope="col" className="px-4 py-3">{t("portal.payments.status")}</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={`${payment.establishmentId}-${payment.date}`} className="border-t border-border">
                  <td className="px-4 py-4 font-semibold">
                    {formatDemoDate(payment.date, language, { month: "long", year: "numeric" })}
                  </td>
                  {isAllEstablishments && (
                    <td className="px-4 py-4 font-medium">{payment.establishmentName}</td>
                  )}
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
