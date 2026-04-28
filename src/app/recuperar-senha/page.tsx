import { ForgotPasswordForm } from "./forgot-password-form";
import { ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Recuperação de Acesso | Hábitos Game",
  description: "Solicite o resgate de sua conta do sistema.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 md:p-8 bg-[#030712] relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-sky-900/10 rounded-full blur-[120px] mix-blend-screen" />
        
        {/* Linhas de grade futuristas */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)`,
            backgroundSize: '4rem 4rem'
          }}
        />
      </div>

      <div className="system-card w-full max-w-md p-8 md:p-10 relative z-10 shadow-2xl shadow-amber-900/20 border-amber-900/30">
        
        <div className="flex flex-col items-center mb-10 text-center relative">
          <div className="absolute -top-4 w-24 h-24 bg-amber-500/20 rounded-full blur-xl" />
          <div className="p-4 bg-slate-900/80 border border-amber-500/30 rounded-2xl mb-6 shadow-[0_0_20px_rgba(245,158,11,0.2)] relative">
            <ShieldAlert size={40} className="text-amber-500" />
          </div>
          
          <h1 className="text-3xl font-heading font-bold text-white tracking-widest uppercase mb-3">
            Protocolo de Resgate
          </h1>
          <p className="text-slate-400 text-sm">
            Informe suas credenciais para iniciarmos o processo de recuperação de acesso.
          </p>
        </div>

        <ForgotPasswordForm />
        
      </div>
    </main>
  );
}