"use client";

import { useActionState, useState } from "react";
import { createHabitAction, type HabitActionState } from "@/modules/habits/actions";

const initialState: HabitActionState = {};
type FrequencyOption = "daily" | "weekdays" | "weekly" | "once" | "negative";

export function CreateHabitForm({ onSuccess }: { onSuccess: () => void }) {
  const [state, formAction, pending] = useActionState(createHabitAction, initialState);
  const [frequency, setFrequency] = useState<FrequencyOption>("daily");

  if (state.message) {
    setTimeout(onSuccess, 500);
  }

  return (
    <form action={formAction} className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
      <label className="block">
        <span className="mb-1.5 block text-xs font-heading font-semibold tracking-widest uppercase text-sky-400">Título da Quest</span>
        <input
          className="system-input"
          name="title"
          type="text"
          placeholder="Ex: Treinamento de Força (100 Flexões)"
          required
        />
      </label>
      
      <label className="block">
        <span className="mb-1.5 block text-xs font-heading font-semibold tracking-widest uppercase text-slate-400">Descrição (Opcional)</span>
        <textarea
          className="system-input min-h-[80px]"
          name="description"
          rows={2}
          placeholder="Ex: Completar antes do anoitecer"
        />
      </label>
      
      <label className="block">
        <span className="mb-1.5 block text-xs font-heading font-semibold tracking-widest uppercase text-slate-400">Tipo / Frequência da Quest</span>
        <select
          className="system-input"
          name="frequency"
          defaultValue="daily"
          onChange={(e) => setFrequency(e.target.value as FrequencyOption)}
        >
          <option value="daily" className="bg-slate-900 text-white">Quest Diária (+10 XP)</option>
          <option value="weekdays" className="bg-slate-900 text-white">Quest de Dias Úteis (+10 XP)</option>
          <option value="weekly" className="bg-slate-900 text-white">Quest Semanal (X dias/semana) (+10 XP)</option>
          <option value="once" className="bg-slate-900 text-sky-300 font-bold">Tarefa Única (+10 XP) - Some ao concluir</option>
          <option value="negative" className="bg-slate-900 text-red-400 font-bold">Inimigo / Hábito Negativo (-10 HP) - Causa Dano</option>
        </select>
      </label>

      {frequency === "weekly" && (
        <label className="block">
          <span className="mb-1.5 block text-xs font-heading font-semibold tracking-widest uppercase text-slate-400">
            Meta Semanal (Dias por Semana)
          </span>
          <select className="system-input" name="targetPerWeek" defaultValue="3">
            {Array.from({ length: 7 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n} className="bg-slate-900 text-white">
                {n} {n === 1 ? "dia" : "dias"} por semana
              </option>
            ))}
          </select>
        </label>
      )}

      {state.error && <p className="text-xs text-red-400 font-heading tracking-widest uppercase bg-red-950/30 p-2 rounded border border-red-500/30">{state.error}</p>}
      {state.message && <p className="text-xs text-emerald-400 font-heading tracking-widest uppercase bg-emerald-950/30 p-2 rounded border border-emerald-500/30">{state.message}</p>}

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="submit"
          disabled={pending || !!state.message}
          className="system-btn-primary w-full sm:w-auto"
        >
          {pending ? "Registrando no Sistema..." : "Aceitar Quest"}
        </button>
      </div>
    </form>
  );
}
