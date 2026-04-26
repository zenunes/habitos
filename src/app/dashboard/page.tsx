import Link from "next/link";
import {
  createProgressSnapshot,
  sampleProfile,
  sampleRewards,
  weeklyQuest,
} from "@/modules";

export default function DashboardPage() {
  const progress = createProgressSnapshot(340, 6);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10">
      <header className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-wide text-zinc-500">Dashboard</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Ola, {sampleProfile.name}
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

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-semibold">{weeklyQuest.title}</h2>
        <p className="mt-2 text-zinc-600">{weeklyQuest.description}</p>
        <p className="mt-2 text-sm text-zinc-500">Recompensa: {weeklyQuest.xpReward} XP</p>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Loja de recompensas</h2>
        <ul className="mt-3 space-y-2 text-zinc-700">
          {sampleRewards.map((reward) => (
            <li key={reward.id}>
              {reward.title} - {reward.pointsCost} pontos
            </li>
          ))}
        </ul>
      </section>

      <Link
        href="/habitos"
        className="w-fit rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-700"
      >
        Gerenciar habitos
      </Link>
    </main>
  );
}
