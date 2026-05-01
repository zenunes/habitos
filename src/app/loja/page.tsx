import { requireUser } from "@/modules/auth/server/session";
import { getUserRewards, getUserRedeemedRewards } from "@/modules/rewards/server/queries";
import { getUserProgress } from "@/modules/progression/server/queries";
import { StoreManager } from "./store-manager";
import { TopNav } from "@/components/layout/top-nav";
import { InventoryItem } from "./inventory-item";
import { ShoppingCart, History } from "lucide-react";

export default async function LojaPage() {
  await requireUser();
  
  const [rewards, redeemedRewards, progress] = await Promise.all([
    getUserRewards(),
    getUserRedeemedRewards(),
    getUserProgress(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10 relative z-10 pb-24 md:pb-10">
      <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.5)]"></span>
            <p className="text-xs uppercase tracking-[0.2em] text-purple-400 font-heading font-bold">Comércio de Habilidades</p>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] flex items-center gap-3">
            <ShoppingCart size={32} className="text-purple-500 hidden sm:block" /> Loja do Sistema
          </h1>
          <p className="text-sm md:text-base text-slate-400 mt-1">Utilize seu ouro para adquirir recompensas e itens.</p>
        </div>
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 mt-4 md:mt-0">
          <div className="bg-amber-900/20 border border-amber-500/30 px-4 py-2 rounded-lg flex flex-col items-start md:items-end w-full md:w-auto">
            <span className="text-[10px] md:text-xs text-amber-400 font-heading uppercase tracking-widest block mb-1">Ouro</span>
            <span className="text-xl md:text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">{progress.coins} 🪙</span>
          </div>
          <div className="hidden md:flex">
            <TopNav />
          </div>
        </div>
      </header>

      <StoreManager initialRewards={rewards} availablePoints={progress.coins} />

      {/* HISTÓRICO DE INVENTÁRIO (COMPRAS RECENTES) */}
      <section className="system-card p-6 border-slate-800 bg-slate-950/30">
        <h2 className="text-xl font-heading font-bold text-white tracking-widest uppercase flex items-center gap-3 mb-6 border-b border-slate-800 pb-3">
          <History size={24} className="text-slate-400" />
          Inventário do Caçador
        </h2>
        
        {redeemedRewards.length > 0 ? (
          <ul className="space-y-3">
            {redeemedRewards.map((item) => (
              <InventoryItem key={item.id} item={item} />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500 font-body text-center py-6">Você ainda não adquiriu nenhum item da Loja do Sistema.</p>
        )}
      </section>
    </main>
  );
}
