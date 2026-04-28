import { ResetPasswordForm } from "./reset-password-form";
import { KeyRound } from "lucide-react";

export const metadata = {
  title: "Nova Senha | Hábitos Game",
  description: "Crie uma nova senha de acesso.",
};

export default function NewPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 md:p-8 bg-[#030712] relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 left-1/4 w-[30rem] h-[30rem] bg-sky-900/10 rounded-full blur-[120px] mix-blend-screen" />
        
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)`,
            backgroundSize: '4rem 4rem'
          }}
        />
      </div>

      <div className="system-card w-full max-w-md p-8 md:p-10 relative z-10 shadow-2xl shadow-emerald-900/20 border-emerald-900/30">
        
        <div className="flex flex-col items-center mb-10 text-center relative">
          <div className="absolute -top-4 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl" />
          <div className="p-4 bg-slate-900/80 border border-emerald-500/30 rounded-2xl mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)] relative">
            <KeyRound size={40} className="text-emerald-500" />
          </div>
          
          <h1 className="text-3xl font-heading font-bold text-white tracking-widest uppercase mb-3">
            Nova Senha
          </h1>
          <p className="text-slate-400 text-sm">
            Identidade confirmada. Crie uma nova chave de acesso segura para o sistema.
          </p>
        </div>

        <ResetPasswordForm />
        
      </div>
    </main>
  );
}