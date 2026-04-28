"use client";

import { useActionState } from "react";
import { forgotPasswordAction, type AuthActionState } from "@/modules/auth/actions";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

const initialState: AuthActionState = {};

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-xs font-heading font-semibold tracking-widest uppercase text-sky-400">
          E-mail de Identificação
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail size={16} className="text-slate-500" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="cacador@sistema.com"
            className="system-input pl-10"
          />
        </div>
      </div>

      {state.error && (
        <div className="p-3 text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded font-body">
          {state.error}
        </div>
      )}

      {state.message && (
        <div className="p-3 text-sm text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 rounded font-body">
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="system-btn-primary w-full py-3 mt-2"
      >
        {pending ? "Processando..." : "Solicitar Resgate"}
      </button>

      <div className="text-center mt-4">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-sky-400 transition-colors font-heading tracking-widest uppercase"
        >
          <ArrowLeft size={16} /> Voltar para o Portal
        </Link>
      </div>
    </form>
  );
}