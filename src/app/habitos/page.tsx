import Link from "next/link";
import { logoutAction } from "@/modules/auth/actions";
import { requireUser } from "@/modules/auth/server/session";
import { getActiveHabits } from "@/modules";
import { HabitsListManager } from "./habits-list-manager";

export default async function HabitosPage() {
  await requireUser();
  const habits = await getActiveHabits();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-zinc-500">Habitos</p>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Seus habitos ativos</h1>
        </div>
        <Link
          href="/dashboard"
          className="rounded-lg border border-zinc-300 px-4 py-2 font-medium text-zinc-800 hover:bg-zinc-100 bg-white"
        >
          Voltar ao dashboard
        </Link>
      </header>

      <HabitsListManager initialHabits={habits} />

      <form action={logoutAction}>
        <button
          type="submit"
          className="w-fit rounded-lg border border-zinc-300 px-4 py-2 font-medium text-zinc-700 hover:bg-zinc-100 bg-white"
        >
          Sair
        </button>
      </form>
    </main>
  );
}
