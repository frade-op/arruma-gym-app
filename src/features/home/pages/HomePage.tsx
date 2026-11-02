import { Activity, CalendarCheck, Flame, type LucideIcon } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface Stat {
  label: string;
  value: string;
  icon: LucideIcon;
}

// DADOS FALSOS: substituir por chamada à API.
const STATS: Stat[] = [
  { label: "Treinos no mês", value: "12", icon: CalendarCheck },
  { label: "Calorias queimadas", value: "8.450", icon: Flame },
  { label: "Sequência atual", value: "5 dias", icon: Activity },
];

export function HomePage() {
  const { user } = useAuth();
  return (
    <section>
      <h1 className="text-2xl font-bold text-slate-900">Olá, {user?.name}!</h1>
      <p className="mt-1 text-slate-500">Veja o resumo da sua atividade.</p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-3">
        {STATS.map(({ label, value, icon: Icon }) => (
          <li key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <Icon className="h-5 w-5 text-brand-600" aria-hidden />
            <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
