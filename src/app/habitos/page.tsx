import Link from "next/link";
import { requireUser } from "@/modules/auth/server/session";
import { getActiveHabits } from "@/modules/habits/server/queries";
import { HabitsListManager } from "./habits-list-manager";
import { TopNav } from "@/components/layout/top-nav";
import { Target } from "lucide-react";

export default async function HabitosPage() {
  await requireUser();
  const habits = await getActiveHabits();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10 relative z-10">
      <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse shadow-[0_0_8px_var(--primary-glow)]"></span>
            <p className="text-xs uppercase tracking-[0.2em] text-sky-400 font-heading font-bold flex items-center gap-2">
              <Target size={12} /> Registro de Quests
            </p>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
            Painel de Quests Diárias
          </h1>
          <p className="text-sm md:text-base text-slate-400 mt-1">Gerencie as quests que guiarão sua evolução.</p>
        </div>
        <div className="hidden md:flex flex-col items-end gap-4">
          <TopNav />
        </div>
      </header>

      <HabitsListManager initialHabits={habits} />
    </main>
  );
}
