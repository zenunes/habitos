"use client";

import { useState } from "react";
import { HabitItem } from "./habit-item";
import { CreateHabitForm } from "./create-habit-form";
import { Habit } from "@/modules/habits/domain/habit";
import { Plus, X, ListTodo, Filter } from "lucide-react";

export function HabitsListManager({ initialHabits }: { initialHabits: Habit[] }) {
  const [isCreating, setIsCreating] = useState(false);
  const [filter, setFilter] = useState<"all" | "daily" | "weekdays" | "once" | "negative">("all");

  const filteredHabits = initialHabits.filter(habit => {
    if (filter === "all") return true;
    return habit.frequency === filter;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-4">
        <h2 className="text-xl font-heading font-bold text-white tracking-widest uppercase flex items-center gap-3">
          <ListTodo size={24} className="text-sky-500" />
          Quests Ativas
        </h2>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="flex flex-wrap bg-slate-900 border border-slate-700 rounded p-1 w-full sm:w-auto justify-center sm:justify-start">
            <button 
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 text-xs font-heading tracking-widest uppercase rounded whitespace-nowrap flex-1 sm:flex-none ${filter === "all" ? "bg-sky-900/50 text-sky-400" : "text-slate-400 hover:text-slate-200"}`}
            >
              Todas
            </button>
            <button 
              onClick={() => setFilter("daily")}
              className={`px-3 py-1.5 text-xs font-heading tracking-widest uppercase rounded whitespace-nowrap flex-1 sm:flex-none ${filter === "daily" ? "bg-sky-900/50 text-sky-400" : "text-slate-400 hover:text-slate-200"}`}
            >
              Diárias
            </button>
            <button 
              onClick={() => setFilter("weekdays")}
              className={`px-3 py-1.5 text-xs font-heading tracking-widest uppercase rounded whitespace-nowrap flex-1 sm:flex-none ${filter === "weekdays" ? "bg-sky-900/50 text-sky-400" : "text-slate-400 hover:text-slate-200"}`}
            >
              Dias Úteis
            </button>
            <button 
              onClick={() => setFilter("once")}
              className={`px-3 py-1.5 text-xs font-heading tracking-widest uppercase rounded whitespace-nowrap flex-1 sm:flex-none ${filter === "once" ? "bg-sky-900/50 text-sky-400" : "text-slate-400 hover:text-slate-200"}`}
            >
              Únicas
            </button>
            <button 
              onClick={() => setFilter("negative")}
              className={`px-3 py-1.5 text-xs font-heading tracking-widest uppercase rounded whitespace-nowrap flex-1 sm:flex-none ${filter === "negative" ? "bg-red-900/50 text-red-400" : "text-slate-400 hover:text-slate-200"}`}
            >
              Inimigos
            </button>
          </div>
          
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="system-btn-primary py-2 px-4 text-xs shadow-[0_0_10px_var(--primary-glow)] flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Plus size={16} /> <span>Adicionar Quest</span>
            </button>
          )}
        </div>
      </div>

      {isCreating && (
        <div className="system-card p-6 border-sky-500/50 bg-sky-950/10">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <h3 className="font-heading text-lg font-bold text-sky-400 tracking-widest uppercase">Formular Missão</h3>
            <button 
              onClick={() => setIsCreating(false)}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-heading uppercase tracking-widest"
            >
              <X size={16} /> Cancelar
            </button>
          </div>
          <CreateHabitForm onSuccess={() => setIsCreating(false)} />
        </div>
      )}

      <section className="system-card p-6">
        {filteredHabits.length > 0 ? (
          <ul className="space-y-4">
            {filteredHabits.map((habit) => (
              <HabitItem
                key={habit.id}
                habitId={habit.id}
                title={habit.title}
                description={habit.description}
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
            <p className="text-slate-400 font-body mb-2">Nenhuma quest encontrada para este filtro.</p>
            <p className="text-xs text-sky-500/70 font-heading tracking-widest uppercase">O mundo aguarda seu despertar.</p>
          </div>
        )}
      </section>
    </div>
  );
}
