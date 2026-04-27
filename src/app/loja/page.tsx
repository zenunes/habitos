import Link from "next/link";
import { requireUser } from "@/modules/auth/server/session";
import { getUserRewards, getUserRedeemedRewards } from "@/modules/rewards/server/queries";
import { getUserProgress } from "@/modules/progression/server/queries";
import { StoreManager } from "./store-manager";
import { ArrowLeft, ShoppingCart, History } from "lucide-react";

export default async function LojaPage() {
  await requireUser();
  
  const [rewards, redeemedRewards, progress] = await Promise.all([
    getUserRewards(),
    getUserRedeemedRewards(),
    getUserProgress(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10 relative z-10">
      <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.5)]"></span>
            <p className="text-xs uppercase tracking-[0.2em] text-purple-400 font-heading font-bold">Comércio de Habilidades</p>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] flex items-center gap-3">
            <ShoppingCart size={32} className="text-purple-500" /> Loja do Sistema
          </h1>
          <p className="text-slate-400 mt-1">Utilize seus pontos de evolução para adquirir recompensas.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="bg-purple-900/20 border border-purple-500/30 px-4 py-2 rounded-lg">
            <span className="text-xs text-purple-400 font-heading uppercase tracking-widest block mb-1">Pontos Disponíveis</span>
            <span className="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">{progress.availablePoints} pts</span>
          </div>
          <Link
            href="/dashboard"
            className="system-btn-secondary flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Voltar ao Sistema
          </Link>
        </div>
      </header>

      <StoreManager initialRewards={rewards} availablePoints={progress.availablePoints} />

      {/* HISTÓRICO DE INVENTÁRIO (COMPRAS RECENTES) */}
      <section className="system-card p-6 border-slate-800 bg-slate-950/30">
        <h2 className="text-xl font-heading font-bold text-white tracking-widest uppercase flex items-center gap-3 mb-6 border-b border-slate-800 pb-3">
          <History size={24} className="text-slate-400" />
          Inventário Recente
        </h2>
        
        {redeemedRewards.length > 0 ? (
          <ul className="space-y-3">
            {redeemedRewards.slice(0, 5).map((item) => (
              <li key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                <div className="mb-2 sm:mb-0">
                  <p className="font-heading font-bold text-slate-200">{item.title}</p>
                  <p className="text-xs text-slate-500">Resgatado em {new Date(item.redeemedAt).toLocaleDateString('pt-BR')} às {new Date(item.redeemedAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
                <span className="text-[10px] text-purple-400 font-heading tracking-widest font-bold uppercase bg-purple-950/30 px-2 py-1 rounded border border-purple-500/30 self-start sm:self-auto">
                  -{item.pointsCost} pts
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500 font-body text-center py-6">Você ainda não adquiriu nenhum item da Loja do Sistema.</p>
        )}
      </section>
    </main>
  );
}
