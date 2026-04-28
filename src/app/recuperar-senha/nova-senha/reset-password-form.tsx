"use client";

import { useActionState, useEffect, useState } from "react";
import { resetPasswordAction, type AuthActionState } from "@/modules/auth/actions";
import { Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const initialState: AuthActionState = {};

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(resetPasswordAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-xs font-heading font-semibold tracking-widest uppercase text-emerald-400">
          Nova Senha de Acesso
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock size={16} className="text-slate-500" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="No mínimo 8 caracteres"
            className="system-input pl-10 pr-10"
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="system-btn-primary w-full py-3 mt-4 !bg-emerald-600/20 !border-emerald-500/50 !text-emerald-400 hover:!bg-emerald-500/30 hover:!shadow-[0_0_15px_rgba(16,185,129,0.3)]"
      >
        {pending ? "Autenticando..." : "Confirmar Nova Senha"}
      </button>
    </form>
  );
}