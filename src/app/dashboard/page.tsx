import Link from "next/link";
import { logoutAction } from "@/modules/auth/actions";
import { requireUser } from "@/modules/auth/server/session";
import {
  getUserProgress,
  getUserRewards,
  getActiveQuests,
  getActiveHabits
} from "@/modules";
import { CheckinButton } from "./checkin-button";

export default async function DashboardPage() {
  const user = await requireUser();
  
  const [progress, rewards, quests, habits] = await Promise.all([
    getUserProgress(),
    getUserRewards(),
    getActiveQuests(),
    getActiveHabits()
  ]);

  const mainQuest = quests.length > 0 ? quests[0] : null;
  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10">
      <header className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-wide text-zinc-500">Dashboard</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Ola, {user.email ?? "usuario"}
        </h1>
        <p className="text-zinc-600">
          Aqui voce acompanha progresso, quests e recompensas.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">XP total</p>
          <p className="mt-2 text-2xl font-semibold">{progress.xpTotal}</p>
        </article>
        <article className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Nivel</p>
          <p className="mt-2 text-2xl font-semibold">{progress.level}</p>
        </article>
        <article className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Streak atual</p>
          <p className="mt-2 text-2xl font-semibold">{progress.currentStreak} dias</p>
        </article>
      </section>

      {/* Secao de Check-in Rapido */}
      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-semibold mb-4">Habitos de Hoje</h2>
        {habits.length > 0 ? (
          <ul className="space-y-3">
            {habits.filter(h => h.active).map(habit => (
              <li key={habit.id} className="flex items-center justify-between border-b border-zinc-100 pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-zinc-800">{habit.title}</p>
                  <p className="text-xs text-zinc-500">{habit.frequency}</p>
                </div>
                <CheckinButton habitId={habit.id} habitTitle={habit.title} todayDateRef={todayStr} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-500">Voce ainda nao possui habitos ativos.</p>
        )}
      </section>

      {mainQuest && (
        <section className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{mainQuest.title}</h2>
            {mainQuest.completed && (
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-800">Concluida</span>
            )}
          </div>
          <p className="mt-2 text-zinc-600">{mainQuest.description}</p>
          <p className="mt-2 text-sm text-zinc-500">Recompensa: {mainQuest.xpReward} XP</p>
        </section>
      )}

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Loja de recompensas</h2>
        {rewards.length > 0 ? (
          <ul className="mt-3 space-y-2 text-zinc-700">
            {rewards.map((reward) => (
              <li key={reward.id}>
                {reward.title} - {reward.pointsCost} pontos
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-zinc-500">
            Nenhuma recompensa disponivel no momento.
          </p>
        )}
      </section>

      <div className="flex items-center gap-3">
        <Link
          href="/habitos"
          className="w-fit rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-700"
        >
          Gerenciar habitos
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-fit rounded-lg border border-zinc-300 px-4 py-2 font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Sair
          </button>
        </form>
      </div>
    </main>
  );
}
