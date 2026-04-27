"use client";

import { useActionState } from "react";
import { createHabitAction, type HabitActionState } from "@/modules/habits/actions";

const initialState: HabitActionState = {};

export function CreateHabitForm({ onSuccess }: { onSuccess: () => void }) {
  const [state, formAction, pending] = useActionState(createHabitAction, initialState);

  // Fecha o form caso tenha sucesso, mas usando um "trick" simples via React 
  // que escuta o estado da variavel de sucesso e fecha.
  if (state.message) {
    setTimeout(onSuccess, 500);
  }

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5 text-zinc-900">
      <h2 className="text-lg font-semibold text-zinc-800">Novo Hábito</h2>
      
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-zinc-700">Título</span>
        <input
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 bg-white text-zinc-900"
          name="title"
          type="text"
          placeholder="Ex: Beber 2L de água"
          required
        />
      </label>
      
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-zinc-700">Descrição (opcional)</span>
        <textarea
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 bg-white text-zinc-900"
          name="description"
          rows={2}
          placeholder="Ex: Garrafa sempre na mesa"
        />
      </label>
      
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-zinc-700">Frequência</span>
        <select
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 bg-white text-zinc-900"
          name="frequency"
          defaultValue="daily"
        >
          <option value="daily">Todos os dias</option>
          <option value="weekdays">Dias de semana (Seg-Sex)</option>
        </select>
      </label>

      {state.error && <p className="text-sm text-red-600 font-medium">{state.error}</p>}
      {state.message && <p className="text-sm text-emerald-600 font-medium">{state.message}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onSuccess}
          className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={pending || !!state.message}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60"
        >
          {pending ? "Salvando..." : "Salvar Hábito"}
        </button>
      </div>
    </form>
  );
}
