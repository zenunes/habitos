import Link from "next/link";
import { LoginForm, SignupForm } from "@/app/login/auth-forms";
import { ShieldAlert, Zap, UserPlus } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 md:p-8 bg-[#030712] relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-24 left-1/3 w-[28rem] h-[28rem] bg-sky-600/10 rounded-full blur-[140px] mix-blend-screen" />
        <div className="absolute -bottom-24 right-1/4 w-[30rem] h-[30rem] bg-amber-600/10 rounded-full blur-[160px] mix-blend-screen" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)",
            backgroundSize: "4rem 4rem",
          }}
        />
      </div>

      <div className="w-full max-w-5xl relative z-10">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-900/80 border border-theme-base/30 rounded-2xl shadow-[0_0_20px_var(--theme-glow)]">
              <Zap size={28} className="text-theme-light" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-theme-light font-heading font-bold flex items-center gap-2">
                <ShieldAlert size={14} /> Portal de Acesso
              </p>
              <h1 className="text-2xl md:text-3xl font-heading font-bold tracking-widest uppercase text-white">
                Solo Leveling System
              </h1>
            </div>
          </div>

          <Link
            href="/"
            className="system-btn-secondary !px-4 !py-2 text-xs"
          >
            Voltar
          </Link>
        </div>

        <section className="grid w-full gap-6 md:grid-cols-2">
          <article className="system-card p-7 md:p-8 border-theme-base/30 shadow-2xl shadow-sky-900/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-theme-base/10 rounded-lg border border-theme-base/30">
                <ShieldAlert size={20} className="text-theme-light" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold tracking-widest uppercase text-white">
                  Entrar
                </h2>
                <p className="text-sm text-slate-400">
                  Acesse sua evolução diária.
                </p>
              </div>
            </div>
            <LoginForm />
          </article>

          <article className="system-card p-7 md:p-8 border-amber-500/25 shadow-2xl shadow-amber-900/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/30">
                <UserPlus size={20} className="text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold tracking-widest uppercase text-white">
                  Criar Conta
                </h2>
                <p className="text-sm text-slate-400">
                  Defina seu codinome e objetivo inicial.
                </p>
              </div>
            </div>
            <SignupForm />
          </article>
        </section>
      </div>
    </main>
  );
}
