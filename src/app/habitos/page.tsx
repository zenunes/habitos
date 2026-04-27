import Link from "next/link";
import { logoutAction } from "@/modules/auth/actions";
import { requireUser } from "@/modules/auth/server/session";
import { sampleHabits } from "@/modules";

export default async function HabitosPage() {
  await requireUser();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-zinc-500">Habitos</p>
          <h1 className="text-3xl font-bold tracking-tight">Seus habitos ativos</h1>
        </div>
        <Link
          href="/dashboard"
          className="rounded-lg border border-zinc-300 px-4 py-2 font-medium text-zinc-800 hover:bg-zinc-100"
        >
          Voltar ao dashboard
        </Link>
      </header>

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <ul className="space-y-3">
          {sampleHabits.map((habit) => (
            <li
              key={habit.id}
              className="flex items-center justify-between rounded-lg border border-zinc-200 p-3"
            >
              <div>
                <p className="font-medium">{habit.title}</p>
                <p className="text-sm text-zinc-500">Frequencia: {habit.frequency}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  habit.active
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-zinc-100 text-zinc-600"
                }`}
              >
                {habit.active ? "Ativo" : "Pausado"}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <form action={logoutAction}>
        <button
          type="submit"
          className="w-fit rounded-lg border border-zinc-300 px-4 py-2 font-medium text-zinc-700 hover:bg-zinc-100"
        >
          Sair
        </button>
      </form>
    </main>
  );
}
