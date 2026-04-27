"use client";

import { useTransition } from "react";
import { toggleHabitStatusAction, deleteHabitAction } from "@/modules/habits/actions";
import { Target, Play, Pause, Trash2 } from "lucide-react";

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
      className={`group relative flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900/60 border border-slate-700 rounded-xl p-5 hover:border-sky-500/60 hover:bg-slate-800/80 transition-all shadow-sm hover:shadow-[0_0_20px_rgba(14,165,233,0.15)] ${
        isPending ? "opacity-50" : "opacity-100"
      }`}
    >
      <div className="flex items-start gap-4 mb-4 sm:mb-0">
        <div className="mt-1 p-2 bg-slate-800 rounded-lg group-hover:bg-sky-900/40 group-hover:text-sky-400 text-slate-500 transition-colors border border-slate-700 group-hover:border-sky-500/30">
          <Target size={20} />
        </div>
        <div>
          <p className="text-lg font-heading font-bold text-slate-100 group-hover:text-white transition-colors">{title}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[10px] font-heading tracking-widest uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
              {frequency === 'daily' ? 'Diária' : 'Dias Úteis'}
            </span>
            {!active && (
              <span className="text-[10px] font-heading tracking-widest uppercase text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded border border-slate-800">
                Inativa
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-heading font-bold tracking-widest uppercase transition-all ${
            active
              ? "bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500/20"
              : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-slate-200"
          }`}
          title={active ? "Pausar Quest" : "Ativar Quest"}
        >
          {active ? <Pause size={14} /> : <Play size={14} />}
          <span className="hidden sm:inline">{active ? "Pausar" : "Ativar"}</span>
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="flex items-center justify-center p-2 rounded text-red-400/70 hover:text-red-400 bg-red-950/10 border border-transparent hover:border-red-900/30 hover:bg-red-950/30 transition-all disabled:opacity-50"
          title="Excluir Quest"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
}
