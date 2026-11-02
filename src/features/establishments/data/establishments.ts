import type { MessageKey } from "@/shared/preferences/messages";

export interface Establishment {
  id: string;
  name: string;
  location?: string;
  memberId?: string;
  dataSource: "manual" | "connection";
  billingType?: "monthly" | "daily";
  period?: string;
  nextDueDate?: string;
  amount?: number;
  weeklyActivity?: readonly {
    day: MessageKey;
    height: number;
  }[];
  payments: readonly {
    date: string;
    amount: number;
  }[];
  checkins: readonly {
    date: string;
    time: string;
  }[];
}

const ermoPayments = [
  { date: "2026-10-05", amount: 129.9 },
  { date: "2026-09-05", amount: 129.9 },
  { date: "2026-08-05", amount: 129.9 },
  { date: "2026-07-05", amount: 129.9 },
  { date: "2026-06-05", amount: 129.9 },
] as const;

const demoWeeklyActivity = [
  { day: "portal.weekday.mon", height: 28 },
  { day: "portal.weekday.tue", height: 72 },
  { day: "portal.weekday.wed", height: 46 },
  { day: "portal.weekday.thu", height: 84 },
  { day: "portal.weekday.fri", height: 58 },
  { day: "portal.weekday.sat", height: 22 },
  { day: "portal.weekday.sun", height: 12 },
] as const;

// DADOS FALSOS: substituir por estabelecimentos e dados da API.
export const demoEstablishments: readonly Establishment[] = [
  {
    id: "centro",
    name: "Movimento Centro",
    location: "Centro",
    memberId: "08421",
    dataSource: "manual",
    period: "2026-10-28",
    weeklyActivity: demoWeeklyActivity,
    billingType: "daily",
    amount: 29.9,
    payments: [],
    checkins: [
      { date: "2026-10-22", time: "18:35" },
      { date: "2026-10-04", time: "09:58" },
    ],
  },
  {
    id: "ermo",
    name: "Base Ativa Ermo",
    location: "Ermo",
    memberId: "02713",
    dataSource: "connection",
    period: "2026-10-28",
    nextDueDate: "2026-11-10",
    billingType: "monthly",
    amount: 129.9,
    weeklyActivity: demoWeeklyActivity,
    payments: ermoPayments,
    checkins: [
      { date: "2026-10-28", time: "07:42" },
      { date: "2026-10-26", time: "08:08" },
      { date: "2026-10-25", time: "07:35" },
      { date: "2026-10-24", time: "07:48" },
      { date: "2026-10-23", time: "07:35" },
      { date: "2026-10-20", time: "18:51" },
      { date: "2026-10-19", time: "07:39" },
      { date: "2026-10-18", time: "09:44" },
      { date: "2026-10-17", time: "07:42" },
      { date: "2026-10-16", time: "07:39" },
      { date: "2026-10-15", time: "18:47" },
      { date: "2026-10-14", time: "07:39" },
      { date: "2026-10-13", time: "07:47" },
      { date: "2026-10-12", time: "07:52" },
      { date: "2026-10-11", time: "09:44" },
      { date: "2026-10-08", time: "18:47" },
      { date: "2026-10-07", time: "07:39" },
      { date: "2026-10-06", time: "18:31" },
      { date: "2026-10-05", time: "07:48" },
      { date: "2026-10-03", time: "09:58" },
      { date: "2026-10-02", time: "07:45" },
    ],
  },
  {
    id: "jardim",
    name: "Energia Jardim",
    location: "Jardim",
    memberId: "06508",
    dataSource: "connection",
    period: "2026-10-28",
    billingType: "daily",
    amount: 24.9,
    weeklyActivity: demoWeeklyActivity,
    payments: [],
    checkins: [
      { date: "2026-10-27", time: "18:12" },
      { date: "2026-10-21", time: "18:25" },
      { date: "2026-10-10", time: "10:08" },
    ],
  },
] as const;

export type DemoEstablishment = Establishment;
export interface EstablishmentCheckin {
  date: string;
  time: string;
  establishmentId: string;
  establishmentName: string;
}

export function getEstablishmentCheckins(
  establishments: readonly Establishment[],
): EstablishmentCheckin[] {
  return establishments
    .flatMap((establishment) =>
      establishment.checkins.map((checkin) => ({
        ...checkin,
        establishmentId: establishment.id,
        establishmentName: establishment.name,
      })),
    )
    .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
}

export function getEstablishmentPayments(establishments: readonly Establishment[]) {
  return establishments
    .flatMap((establishment) =>
      (establishment.billingType === "daily"
        ? establishment.checkins.map(({ date }) => ({
            date,
            amount: establishment.amount ?? 0,
          }))
        : establishment.payments
      ).map((payment) => ({
        ...payment,
        establishmentId: establishment.id,
        establishmentName: establishment.name,
      })),
    )
    .sort((a, b) => b.date.localeCompare(a.date) || a.establishmentName.localeCompare(b.establishmentName));
}

export function getNextDueEstablishment(establishments: readonly Establishment[]) {
  return establishments
    .filter((establishment): establishment is Establishment & { nextDueDate: string } =>
      establishment.billingType !== "daily" && Boolean(establishment.nextDueDate),
    )
    .sort((a, b) => a.nextDueDate.localeCompare(b.nextDueDate))[0];
}

export function getMostVisitedEstablishment(establishments: readonly Establishment[]) {
  const visitsByEstablishment = new Map<string, number>();
  for (const establishment of establishments) {
    visitsByEstablishment.set(establishment.name, establishment.checkins.length);
  }
  return [...visitsByEstablishment].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
}

export function getWeeklyActivity(establishments: readonly Establishment[]) {
  const dayKeys = [
    "portal.weekday.mon",
    "portal.weekday.tue",
    "portal.weekday.wed",
    "portal.weekday.thu",
    "portal.weekday.fri",
    "portal.weekday.sat",
    "portal.weekday.sun",
  ] as const;
  const counts = Array.from({ length: 7 }, () => 0);
  for (const { date } of getEstablishmentCheckins(establishments)) {
    counts[(new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7] += 1;
  }

  const maxCount = Math.max(...counts, 1);
  return dayKeys.map((day, index) => ({
    day,
    height: Math.max(12, Math.round((counts[index] / maxCount) * 100)),
  }));
}

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

export function getDemoMonth(establishment: { period: string }, language: string) {
  return formatDemoDate(establishment.period, language, { month: "long" });
}
