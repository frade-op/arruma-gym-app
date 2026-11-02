// DADOS FALSOS: substituir por dados da API quando o backend estiver disponível.
export const demoPortalData = {
  memberId: "08421",
  unit: "Centro",
  plan: "Musculação + Funcional",
  nextDueDate: "2026-11-05",
  monthlyPrice: 119.9,
  period: "2026-10-28",
  payments: [
    { date: "2026-10-05", amount: 119.9 },
    { date: "2026-09-05", amount: 119.9 },
    { date: "2026-08-05", amount: 119.9 },
    { date: "2026-07-05", amount: 119.9 },
    { date: "2026-06-05", amount: 119.9 },
  ],
  checkins: [
    { date: "2026-10-28", time: "18:42", unit: "Centro" },
    { date: "2026-10-26", time: "19:08", unit: "Centro" },
    { date: "2026-10-24", time: "10:16", unit: "Jardim" },
    { date: "2026-10-22", time: "18:35", unit: "Centro" },
    { date: "2026-10-20", time: "18:51", unit: "Centro" },
    { date: "2026-10-17", time: "09:44", unit: "Vila Nova" },
    { date: "2026-10-15", time: "18:39", unit: "Centro" },
    { date: "2026-10-13", time: "19:02", unit: "Centro" },
    { date: "2026-10-10", time: "10:08", unit: "Jardim" },
    { date: "2026-10-08", time: "18:47", unit: "Centro" },
    { date: "2026-10-06", time: "18:31", unit: "Centro" },
    { date: "2026-10-03", time: "09:58", unit: "Vila Nova" },
  ],
  weeklyActivity: [
    { day: "portal.weekday.mon", height: 28 },
    { day: "portal.weekday.tue", height: 72 },
    { day: "portal.weekday.wed", height: 46 },
    { day: "portal.weekday.thu", height: 84 },
    { day: "portal.weekday.fri", height: 58 },
    { day: "portal.weekday.sat", height: 22 },
    { day: "portal.weekday.sun", height: 12 },
  ],
} as const;

export type DemoCheckin = (typeof demoPortalData.checkins)[number];
export type DemoPayment = (typeof demoPortalData.payments)[number];

export function formatDemoDate(
  date: string,
  language: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: "long" },
) {
  return new Intl.DateTimeFormat(language, { ...options, timeZone: "UTC" }).format(
    new Date(`${date}T12:00:00Z`),
  );
}

export function formatDemoMoney(amount: number, language: string) {
  return new Intl.NumberFormat(language, { style: "currency", currency: "BRL" }).format(amount);
}

export function getDemoMonth(language: string) {
  return formatDemoDate(demoPortalData.period, language, { month: "long" });
}

export function getMostVisitedDemoUnit() {
  const visitsByUnit = new Map<string, number>();
  for (const { unit } of demoPortalData.checkins) {
    visitsByUnit.set(unit, (visitsByUnit.get(unit) ?? 0) + 1);
  }

  let mostVisitedUnit = "";
  let mostVisitedCount = 0;
  for (const [unit, count] of visitsByUnit) {
    if (count > mostVisitedCount) {
      mostVisitedUnit = unit;
      mostVisitedCount = count;
    }
  }
  return mostVisitedUnit;
}

export function getDemoUnits() {
  return [...new Set(demoPortalData.checkins.map(({ unit }) => unit))];
}
