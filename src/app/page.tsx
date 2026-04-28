import Link from "next/link";
import { ShieldAlert, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030712] px-6 py-10 font-sans relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-900/20 via-[#030712] to-[#030712] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="w-full max-w-3xl system-card p-10 relative z-10 text-center flex flex-col items-center">
        
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-sky-500/20 blur-xl rounded-full" />
          <div className="h-20 w-20 border border-sky-500/50 bg-slate-900/80 rounded-xl flex items-center justify-center relative z-10 shadow-[0_0_15px_var(--primary-glow)] transform rotate-45">
            <Zap size={32} className="text-sky-400 -rotate-45" />
          </div>
        </div>

        <p className="text-xs font-heading font-bold uppercase tracking-[0.3em] text-sky-500 mb-4 flex items-center gap-2">
          <ShieldAlert size={14} /> 
          Iniciando Protocolo de Despertar
        </p>
        
        <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(14,165,233,0.5)] mb-6 uppercase">
          Solo Leveling
        </h1>
        
        <p className="text-slate-400 font-body text-lg max-w-xl mx-auto leading-relaxed">
          O sistema escolheu você. Transforme sua rotina em quests diárias, acumule experiência e suba de nível na vida real.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link
            href="/dashboard"
            className="system-btn-primary flex-1 py-4 text-sm flex items-center justify-center gap-2 group"
          >
            Acessar o Sistema
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <Link
            href="/login"
            className="system-btn-secondary flex-1 py-4 text-sm w-full text-center"
          >
            Despertar / Cadastro
          </Link>
        </div>
      </main>
    </div>
  );
}
