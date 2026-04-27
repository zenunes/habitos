"use client";

import { useActionState } from "react";
import { resetPasswordAction, type AuthActionState } from "@/modules/auth/actions";

const initialState: AuthActionState = {};

function AuthMessage({ state }: { state: AuthActionState }) {
  if (state.error) {
    return <p className="text-sm text-red-600">{state.error}</p>;
  }

  if (state.message) {
    return <p className="text-sm text-emerald-700">{state.message}</p>;
  }

  return null;
}

export default function NovaSenhaPage() {
  const [state, formAction, pending] = useActionState(resetPasswordAction, initialState);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 py-10 font-sans text-zinc-900">
      <main className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Nova Senha</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Digite sua nova senha abaixo.
          </p>
        </header>

        <form action={formAction} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-zinc-700">Nova Senha</span>
            <input
              className="w-full rounded-lg border border-zinc-300 px-3 py-2"
              name="password"
              type="password"
              autoComplete="new-password"
              required
            />
          </label>
          
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-700 disabled:opacity-60"
          >
            {pending ? "Salvando..." : "Redefinir senha"}
          </button>
          
          <AuthMessage state={state} />
        </form>
      </main>
    </div>
  );
}
