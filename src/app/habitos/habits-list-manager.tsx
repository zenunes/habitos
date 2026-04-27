"use client";

import { useState } from "react";
import { HabitItem } from "./habit-item";
import { CreateHabitForm } from "./create-habit-form";
import { Habit } from "@/modules/habits/domain/habit";

export function HabitsListManager({ initialHabits }: { initialHabits: Habit[] }) {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {!isCreating && (
        <button
          onClick={() => setIsCreating(true)}
          className="w-full sm:w-fit rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-700 transition-colors"
        >
          + Adicionar novo hábito
        </button>
      )}

      {isCreating && (
        <CreateHabitForm onSuccess={() => setIsCreating(false)} />
      )}

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        {initialHabits.length > 0 ? (
          <ul className="space-y-3">
            {initialHabits.map((habit) => (
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
          <p className="text-sm text-zinc-500">Nenhum habito cadastrado ainda. Comece adicionando um acima!</p>
        )}
      </section>
    </div>
  );
}
