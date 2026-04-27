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
      className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-zinc-200 p-4 transition-opacity ${
        isPending ? "opacity-50" : "opacity-100"
      }`}
    >
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-zinc-500">Frequência: {frequency}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`rounded-full px-3 py-1 text-xs font-semibold cursor-pointer transition-colors ${
            active
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          {active ? "Ativo" : "Pausado"}
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="text-xs font-medium text-red-600 hover:text-red-800 hover:underline disabled:opacity-50"
        >
          Excluir
        </button>
      </div>
    </li>
  );
}
