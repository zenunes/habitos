"use client";

import { useActionState } from "react";
import { createRewardAction, type RewardActionState } from "@/modules/rewards/actions";

const initialState: RewardActionState = {};

export function CreateRewardForm({ onSuccess }: { onSuccess: () => void }) {
  const [state, formAction, pending] = useActionState(createRewardAction, initialState);

  if (state.message) {
    setTimeout(onSuccess, 500);
  }

  return (
    <form action={formAction} className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
      <label className="block">
        <span className="mb-1.5 block text-xs font-heading font-semibold tracking-widest uppercase text-purple-400">Título da Recompensa</span>
        <input
          className="system-input focus:ring-purple-500 focus:border-purple-500"
          name="title"
          type="text"
          placeholder="Ex: 1 Hora de Jogos (Videogame)"
          required
        />
      </label>
      
      <label className="block">
        <span className="mb-1.5 block text-xs font-heading font-semibold tracking-widest uppercase text-slate-400">Custo (Em XP / Pontos)</span>
        <input
          className="system-input focus:ring-purple-500 focus:border-purple-500"
          name="pointsCost"
          type="number"
          min="1"
          placeholder="Ex: 50"
          required
        />
      </label>

      {state.error && <p className="text-xs text-red-400 font-heading tracking-widest uppercase bg-red-950/30 p-2 rounded border border-red-500/30">{state.error}</p>}
      {state.message && <p className="text-xs text-emerald-400 font-heading tracking-widest uppercase bg-emerald-950/30 p-2 rounded border border-emerald-500/30">{state.message}</p>}

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="submit"
          disabled={pending || !!state.message}
          className="system-btn-primary w-full sm:w-auto !bg-purple-600 hover:!bg-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
        >
          {pending ? "Registrando Item..." : "Adicionar à Loja"}
        </button>
      </div>
    </form>
  );
}
