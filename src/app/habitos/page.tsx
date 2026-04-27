import Link from "next/link";
import { logoutAction } from "@/modules/auth/actions";
import {
  checkinHabitAction,
  createHabitAction,
  toggleHabitAction,
} from "@/modules/habits/actions";
import { getHabitsWithTodayStatus } from "@/modules/habits/server/queries";

export default async function HabitosPage() {
  const habits = await getHabitsWithTodayStatus();

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
        <h2 className="text-lg font-semibold">Novo habito</h2>
        <form action={createHabitAction} className="mt-3 grid gap-3 sm:grid-cols-4">
          <input
            className="rounded-lg border border-zinc-300 px-3 py-2 sm:col-span-2"
            name="title"
            placeholder="Ex: Ler por 15 minutos"
            required
          />
          <input
            className="rounded-lg border border-zinc-300 px-3 py-2"
            name="description"
            placeholder="Descricao opcional"
          />
          <select
            className="rounded-lg border border-zinc-300 px-3 py-2"
            name="frequency"
            defaultValue="daily"
          >
            <option value="daily">Diario</option>
            <option value="weekdays">Dias uteis</option>
            <option value="custom">Custom</option>
          </select>
          <button
            className="rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-700 sm:col-span-4"
            type="submit"
          >
            Criar habito
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <ul className="space-y-3">
          {habits.map((habit) => (
            <li
              key={habit.id}
              className="flex items-center justify-between rounded-lg border border-zinc-200 p-3"
            >
              <div className="max-w-md">
                <p className="font-medium">{habit.title}</p>
                {habit.description ? (
                  <p className="text-sm text-zinc-500">{habit.description}</p>
                ) : null}
                <p className="text-sm text-zinc-500">Frequencia: {habit.frequency}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    habit.active
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {habit.active ? "Ativo" : "Pausado"}
                </span>
                <form action={toggleHabitAction}>
                  <input type="hidden" name="habitId" value={habit.id} />
                  <button
                    type="submit"
                    className="rounded-md border border-zinc-300 px-3 py-1 text-xs font-medium hover:bg-zinc-100"
                  >
                    {habit.active ? "Pausar" : "Ativar"}
                  </button>
                </form>
                <form action={checkinHabitAction}>
                  <input type="hidden" name="habitId" value={habit.id} />
                  <button
                    type="submit"
                    disabled={!habit.active || habit.checkedToday}
                    className="rounded-md bg-zinc-900 px-3 py-1 text-xs font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {habit.checkedToday ? "Feito hoje" : "Check-in"}
                  </button>
                </form>
              </div>
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
