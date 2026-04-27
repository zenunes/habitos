"use client";

import { useState } from "react";
import { HabitItem } from "./habit-item";
import { CreateHabitForm } from "./create-habit-form";
import { Habit } from "@/modules/habits/domain/habit";

export function HabitsListManager({ initialHabits }: { initialHabits: Habit[] }) {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-heading font-bold text-white tracking-widest uppercase">Quests Ativas</h2>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="system-btn-primary py-2 px-4 text-xs shadow-[0_0_10px_var(--primary-glow)]"
          >
            + Adicionar Nova Quest
          </button>
        )}
      </div>

      {isCreating && (
        <div className="system-card p-6 border-sky-500/50 bg-sky-950/10">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <h3 className="font-heading text-lg font-bold text-sky-400 tracking-widest uppercase">Formular Missão</h3>
            <button 
              onClick={() => setIsCreating(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
          </div>
          <CreateHabitForm onSuccess={() => setIsCreating(false)} />
        </div>
      )}

      <section className="system-card p-6">
        {initialHabits.length > 0 ? (
          <ul className="space-y-4">
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
          <div className="text-center py-10 border border-dashed border-slate-800 rounded-lg bg-slate-900/30">
            <div className="mx-auto h-12 w-12 rounded-full bg-sky-900/30 flex items-center justify-center mb-4">
              <span className="h-4 w-1 bg-sky-500 rounded-full shadow-[0_0_8px_var(--primary-glow)]" />
            </div>
            <p className="text-slate-400 font-body mb-2">Nenhuma quest cadastrada no sistema.</p>
            <p className="text-xs text-sky-500/70 font-heading tracking-widest uppercase">O mundo aguarda seu despertar.</p>
          </div>
        )}
      </section>
    </div>
  );
}
