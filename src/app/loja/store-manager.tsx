"use client";

import { useState } from "react";
import { CreateRewardForm } from "./create-reward-form";
import { RewardItem } from "./reward-item";
import { Reward } from "@/modules/rewards/domain/reward";
import { Plus, X, ShoppingCart } from "lucide-react";

export function StoreManager({ initialRewards, availablePoints }: { initialRewards: Reward[], availablePoints: number }) {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-4">
        <h2 className="text-xl font-heading font-bold text-white tracking-widest uppercase flex items-center gap-3">
          <ShoppingCart size={24} className="text-amber-500" />
          Itens Disponíveis
        </h2>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="system-btn-primary !bg-amber-600 hover:!bg-amber-500 hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] py-2 px-4 text-xs shadow-[0_0_10px_rgba(245,158,11,0.2)] flex items-center gap-2 w-full sm:w-auto text-amber-950 font-bold"
          >
            <Plus size={16} /> Adicionar Nova Recompensa
          </button>
        )}
      </div>

      {isCreating && (
        <div className="system-card p-6 border-amber-500/50 bg-amber-950/10">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <h3 className="font-heading text-lg font-bold text-amber-400 tracking-widest uppercase">Criar Item na Loja</h3>
            <button 
              onClick={() => setIsCreating(false)}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-heading uppercase tracking-widest"
            >
              <X size={16} /> Cancelar
            </button>
          </div>
          <CreateRewardForm onSuccess={() => setIsCreating(false)} />
        </div>
      )}

      <section className="system-card p-6 border-amber-900/30">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* ITEM FIXO DO SISTEMA: POÇÃO DE CURA */}
          <RewardItem
            key="potion"
            reward={{
              id: "potion",
              title: "Poção de Cura (Restaura 30 HP)",
              pointsCost: 50, // 50 Gold
              available: true,
            }}
            availablePoints={availablePoints}
            isSystemItem={true}
          />

          {initialRewards.map((reward) => (
            <RewardItem
              key={reward.id}
              reward={reward}
              availablePoints={availablePoints}
            />
          ))}
        </ul>

        {initialRewards.length === 0 && (
          <div className="text-center py-10 mt-6 border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
            <div className="mx-auto h-16 w-16 rounded-full bg-purple-900/20 flex items-center justify-center mb-4 border border-purple-900/30">
              <ShoppingCart size={28} className="text-purple-500/50" />
            </div>
            <p className="text-lg text-slate-300 font-heading font-bold tracking-widest uppercase mb-2">Sem Itens Personalizados</p>
            <p className="text-sm text-slate-500 font-body mb-6">Defina suas próprias recompensas além dos itens do Sistema.</p>
          </div>
        )}
      </section>
    </div>
  );
}
