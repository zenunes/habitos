import Link from "next/link";
import { requireUser } from "@/modules/auth/server/session";
import { getUserProfile } from "@/modules/profile/server/queries";
import { ProfileForm } from "./profile-form";
import { UserIcon, ArrowLeft } from "lucide-react";

export default async function PerfilPage() {
  const user = await requireUser();
  const profile = await getUserProfile();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10 relative z-10">
      <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse shadow-[0_0_8px_rgba(14,165,233,0.5)]"></span>
            <p className="text-xs uppercase tracking-[0.2em] text-sky-400 font-heading font-bold">Identificação</p>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] flex items-center gap-3">
            <UserIcon size={32} className="text-sky-500" /> Perfil do Caçador
          </h1>
          <p className="text-slate-400 mt-1">Gerencie suas credenciais de acesso ao sistema.</p>
        </div>
        <Link
          href="/dashboard"
          className="system-btn-secondary flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Voltar ao Sistema
        </Link>
      </header>

      <section className="system-card p-6 border-sky-900/30">
        <h2 className="text-xl font-heading font-bold tracking-widest text-white mb-6 border-b border-slate-800 pb-3">
          Dados Pessoais
        </h2>
        <div className="mb-8">
          <p className="text-xs text-slate-500 font-heading tracking-widest uppercase mb-1">Email Registrado</p>
          <p className="text-slate-300 font-body p-3 bg-slate-900/50 rounded border border-slate-800 max-w-md">
            {user.email}
          </p>
        </div>

        <ProfileForm initialProfile={profile} />
      </section>
    </main>
  );
}
