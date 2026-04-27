import Link from "next/link";
import { logoutAction } from "@/modules/auth/actions";
import { requireUser } from "@/modules/auth/server/session";
import { getActiveHabits } from "@/modules";
import { CreateHabitForm } from "./create-habit-form";
import { HabitItem } from "./habit-item";

export default async function HabitosPage() {
  await requireUser();
  const habits = await getActiveHabits();

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

      <section className="space-y-6">
        <CreateHabitForm onSuccess={async () => {
          "use server";
          // Esta action fake existe apenas para contornar a assinatura "use client" do form
          // A revalidação real do Next.js já foi feita na action principal `createHabitAction`
        }} />
        
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          {habits.length > 0 ? (
            <ul className="space-y-3">
              {habits.map((habit) => (
                <HabitItem
                  key={habit.id}
                  habitId={habit.id}
                  title={habit.title}
                  frequency={habit.frequency}
                  active={habit.active}
                />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500">Nenhum habito cadastrado.</p>
          )}
        </div>
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
