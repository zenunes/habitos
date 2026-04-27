"use client";

import { useActionState, useState } from "react";
import { loginAction, signupAction, type AuthActionState } from "@/modules/auth/actions";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const initialState: AuthActionState = {};

function AuthMessage({ state }: { state: AuthActionState }) {
  if (state.error) {
    return <p className="mt-4 rounded bg-red-950/50 border border-red-500/50 p-3 text-sm text-red-400 font-body shadow-[0_0_10px_rgba(239,68,68,0.2)]">{state.error}</p>;
  }
  if (state.message) {
    return <p className="mt-4 rounded bg-emerald-950/50 border border-emerald-500/50 p-3 text-sm text-emerald-400 font-body shadow-[0_0_10px_rgba(16,185,129,0.2)]">{state.message}</p>;
  }
  return null;
}

export function AuthForms() {
  const searchParams = useSearchParams();
  const defaultIsLogin = searchParams.get("mode") !== "signup";
  const [isLogin, setIsLogin] = useState(defaultIsLogin);

  const [loginState, loginFormAction, isLoginPending] = useActionState(loginAction, initialState);
  const [signupState, signupFormAction, isSignupPending] = useActionState(signupAction, initialState);

  const activeState = isLogin ? loginState : signupState;
  const isPending = isLogin ? isLoginPending : isSignupPending;
  const action = isLogin ? loginFormAction : signupFormAction;

  return (
    <div className="system-card p-8">
      <div className="mb-6 flex rounded-lg bg-slate-900 p-1 border border-slate-800">
        <button
          type="button"
          className={`flex-1 rounded-md py-2 text-sm font-heading tracking-widest font-bold uppercase transition-all ${
            isLogin ? "bg-sky-600 text-white shadow-[0_0_10px_var(--primary-glow)]" : "text-slate-400 hover:text-white"
          }`}
          onClick={() => setIsLogin(true)}
        >
          Acessar Sistema
        </button>
        <button
          type="button"
          className={`flex-1 rounded-md py-2 text-sm font-heading tracking-widest font-bold uppercase transition-all ${
            !isLogin ? "bg-sky-600 text-white shadow-[0_0_10px_var(--primary-glow)]" : "text-slate-400 hover:text-white"
          }`}
          onClick={() => setIsLogin(false)}
        >
          Despertar (Criar)
        </button>
      </div>

      <form action={action} className="space-y-5">
        {!isLogin && (
          <label className="block animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="mb-1.5 block text-xs font-heading font-semibold tracking-widest uppercase text-sky-400">Nome de Caçador (Codinome)</span>
            <input
              className="system-input"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Sung Jin-Woo"
              required={!isLogin}
            />
          </label>
        )}

        <label className="block">
          <span className="mb-1.5 block text-xs font-heading font-semibold tracking-widest uppercase text-sky-400">Identificação (E-mail)</span>
          <input
            className="system-input"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="caçador@sistema.com"
            required
          />
        </label>

        <label className="block">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="block text-xs font-heading font-semibold tracking-widest uppercase text-sky-400">Código de Acesso (Senha)</span>
            {isLogin && (
              <Link href="/recuperar-senha" className="text-xs font-body text-slate-400 hover:text-sky-400 transition-colors">
                Esqueceu a senha?
              </Link>
            )}
          </div>
          <input
            className="system-input"
            name="password"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            placeholder="••••••••"
            required
            minLength={8}
          />
        </label>

        <button
          type="submit"
          disabled={isPending}
          className="system-btn-primary mt-2"
        >
          {isPending ? "Processando..." : isLogin ? "Entrar" : "Criar Conta"}
        </button>

        <AuthMessage state={activeState} />
      </form>
    </div>
  );
}
