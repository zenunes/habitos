"use client";

import { useActionState } from "react";
import { updateProfileAction, type ProfileActionState } from "@/modules/profile/actions";
import { UserProfile } from "@/modules/profile/server/queries";

const initialState: ProfileActionState = {};

export function ProfileForm({ initialProfile }: { initialProfile: UserProfile | null }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, initialState);

  return (
    <form action={formAction} className="space-y-6 max-w-md">
      <label className="block">
        <span className="mb-1.5 block text-xs font-heading font-semibold tracking-widest uppercase text-sky-400">Codinome do Caçador</span>
        <input
          className="system-input focus:ring-sky-500 focus:border-sky-500"
          name="name"
          type="text"
          defaultValue={initialProfile?.name || ""}
          placeholder="Ex: Sung Jin-Woo"
          required
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-heading font-semibold tracking-widest uppercase text-sky-400">
          Foco Atual
        </span>
        <input
          className="system-input focus:ring-sky-500 focus:border-sky-500"
          name="focus"
          type="text"
          defaultValue={initialProfile?.focus || ""}
          placeholder="Ex: Saúde, Disciplina, Estudo..."
          required
        />
      </label>

      {state.error && (
        <p className="text-xs text-red-400 font-heading tracking-widest uppercase bg-red-950/30 p-3 rounded border border-red-500/30">
          {state.error}
        </p>
      )}
      
      {state.message && (
        <p className="text-xs text-emerald-400 font-heading tracking-widest uppercase bg-emerald-950/30 p-3 rounded border border-emerald-500/30">
          {state.message}
        </p>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={pending}
          className="system-btn-primary w-full"
        >
          {pending ? "Sincronizando..." : "Atualizar Status"}
        </button>
      </div>
    </form>
  );
}
