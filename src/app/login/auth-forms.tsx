"use client";

import { useActionState } from "react";
import {
  loginAction,
  signupAction,
  type AuthActionState,
} from "@/modules/auth/actions";

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

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-zinc-700">E-mail</span>
        <input
          className="w-full rounded-lg border border-zinc-300 px-3 py-2"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </label>
      <label className="block">
        <div className="mb-1 flex items-center justify-between text-sm font-medium text-zinc-700">
          <span>Senha</span>
          <a href="/recuperar-senha" className="text-xs text-blue-600 hover:underline">
            Esqueceu a senha?
          </a>
        </div>
        <input
          className="w-full rounded-lg border border-zinc-300 px-3 py-2"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-700 disabled:opacity-60"
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>
      <AuthMessage state={state} />
    </form>
  );
}

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signupAction, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-zinc-700">E-mail</span>
        <input
          className="w-full rounded-lg border border-zinc-300 px-3 py-2"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-zinc-700">Senha</span>
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
        className="w-full rounded-lg border border-zinc-300 px-4 py-2 font-medium text-zinc-800 hover:bg-zinc-100 disabled:opacity-60"
      >
        {pending ? "Criando conta..." : "Criar conta"}
      </button>
      <AuthMessage state={state} />
    </form>
  );
}
