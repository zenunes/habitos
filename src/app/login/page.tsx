import { AuthForms } from "./auth-forms";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-50" />

      <main className="w-full max-w-md relative z-10">
        <header className="mb-10 text-center">
          <div className="inline-block mb-3 px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 text-xs font-bold tracking-[0.2em] uppercase">
            System Initialization
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white mb-2 drop-shadow-[0_0_10px_rgba(14,165,233,0.5)]">
            SOLO LEVELING
          </h1>
          <p className="text-slate-400 font-body">
            O sistema o escolheu. Faça login para continuar sua evolução.
          </p>
        </header>
        <Suspense fallback={<div className="h-[400px] w-full system-card animate-pulse" />}>
          <AuthForms />
        </Suspense>
      </main>
    </div>
  );
}
