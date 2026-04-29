"use client";

import { useActionState } from "react";
import {
  loginAction,
  signupAction,
  type AuthActionState,
} from "@/modules/auth/actions";
import Link from "next/link";

const initialState: AuthActionState = {};

function AuthMessage({ state }: { state: AuthActionState }) {
  if (state.error) {
    return (
      <p className="text-xs text-red-400 font-heading tracking-widest uppercase bg-red-950/30 p-3 rounded border border-red-500/30">
        {state.error}
      </p>
    );
  }

  if (state.message) {
    return (
      <p className="text-xs text-emerald-400 font-heading tracking-widest uppercase bg-emerald-950/30 p-3 rounded border border-emerald-500/30">
        {state.message}
      </p>
    );
  }

  return null;
}

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-xs font-heading font-semibold tracking-widest uppercase text-theme-light">
          E-mail
        </span>
        <input
          className="system-input"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </label>
      <label className="block">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs font-heading font-semibold tracking-widest uppercase text-theme-light">
            Senha
          </span>
          <Link
            href="/recuperar-senha"
            className="text-[10px] font-heading font-bold uppercase tracking-widest text-theme-light/80 hover:text-theme-light transition-colors"
          >
            Esqueceu a senha?
          </Link>
        </div>
        <input
          className="system-input"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="system-btn-primary w-full py-3"
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
    <form action={formAction} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-xs font-heading font-semibold tracking-widest uppercase text-amber-400">
          Codinome (Nome)
        </span>
        <input
          className="system-input"
          name="name"
          type="text"
          placeholder="Ex: Sung Jin-Woo"
          required
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-heading font-semibold tracking-widest uppercase text-amber-400">
          E-mail
        </span>
        <input
          className="system-input"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-heading font-semibold tracking-widest uppercase text-amber-400">
          Senha
        </span>
        <input
          className="system-input"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-heading font-semibold tracking-widest uppercase text-amber-400">
          Foco Inicial
        </span>
        <input
          className="system-input"
          name="focus"
          type="text"
          placeholder="Ex: Saúde, Disciplina, Emagrecer, Estudo..."
          required
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="system-btn-primary w-full py-3 !bg-amber-600 hover:!bg-amber-500 hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] text-amber-950 font-bold"
      >
        {pending ? "Criando conta..." : "Criar conta"}
      </button>
      <AuthMessage state={state} />
    </form>
  );
}
