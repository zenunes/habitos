"use client";

import { useTransition } from "react";
import { toggleHabitStatusAction, deleteHabitAction } from "@/modules/habits/actions";

type HabitItemProps = {
  habitId: string;
  title: string;
  frequency: string;
  active: boolean;
};

export function HabitItem({ habitId, title, frequency, active }: HabitItemProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleHabitStatusAction(habitId, active);
    });
  };

  const handleDelete = () => {
    if (window.confirm(`Deseja realmente excluir o hábito "${title}"?`)) {
      startTransition(async () => {
        await deleteHabitAction(habitId);
      });
    }
  };

  return (
    <li
      className={`group relative flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900/40 border border-slate-800 rounded-lg p-4 hover:border-sky-500/50 transition-all ${
        isPending ? "opacity-50" : "opacity-100"
      }`}
    >
      <div className="mb-3 sm:mb-0">
        <p className="font-heading font-bold text-slate-200 group-hover:text-white transition-colors">{title}</p>
        <p className="text-xs text-slate-500 mt-1">Frequência: {frequency === 'daily' ? 'Diária' : 'Dias Úteis'}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`rounded px-3 py-1.5 text-xs font-heading font-bold tracking-widest uppercase transition-all ${
            active
              ? "bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500/20"
              : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-slate-200"
          }`}
        >
          {active ? "Ativa" : "Pausada"}
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="rounded px-3 py-1.5 text-xs font-heading font-bold tracking-widest uppercase bg-red-950/20 text-red-400 border border-red-900/30 hover:bg-red-900/40 hover:border-red-500/50 transition-all disabled:opacity-50"
        >
          Excluir
        </button>
      </div>
    </li>
  );
}
