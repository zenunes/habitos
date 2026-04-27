"use client";

import { useTransition } from "react";
import { redeemRewardAction, deleteRewardAction } from "@/modules/rewards/actions";
import { Reward } from "@/modules/rewards/domain/reward";
import { Trash2, ShoppingBag } from "lucide-react";

export function RewardItem({ reward, availablePoints }: { reward: Reward, availablePoints: number }) {
  const [isPending, startTransition] = useTransition();
  const canAfford = availablePoints >= reward.pointsCost;

  const handleRedeem = () => {
    if (window.confirm(`Deseja resgatar "${reward.title}" por ${reward.pointsCost} pontos?`)) {
      startTransition(async () => {
        const result = await redeemRewardAction(reward.id, reward.pointsCost);
        if (result.error) {
          alert(result.error);
        }
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Deseja realmente excluir a recompensa "${reward.title}"?`)) {
      startTransition(async () => {
        await deleteRewardAction(reward.id);
      });
    }
  };

  return (
    <li className={`group relative flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900/60 border border-slate-700 rounded-xl p-4 hover:border-purple-500/60 hover:bg-slate-800/80 transition-all shadow-sm hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] ${isPending ? "opacity-50" : "opacity-100"}`}>
      <div className="flex items-start gap-4 mb-4 sm:mb-0">
        <div className="mt-1 p-2 bg-slate-800 rounded-lg group-hover:bg-purple-900/40 group-hover:text-purple-400 text-slate-500 transition-colors border border-slate-700 group-hover:border-purple-500/30">
          <ShoppingBag size={20} />
        </div>
        <div>
          <p className="text-lg font-heading font-bold text-slate-100 group-hover:text-white transition-colors">{reward.title}</p>
          <p className="text-[10px] text-purple-400 mt-1 font-heading tracking-widest font-bold uppercase bg-purple-950/30 inline-block px-2 py-0.5 rounded border border-purple-500/30">Custo: {reward.pointsCost} pts</p>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4 sm:mt-0">
        <button
          onClick={handleRedeem}
          disabled={isPending || !canAfford}
          className={`rounded px-4 py-2 text-xs font-heading font-bold tracking-widest uppercase transition-all w-full sm:w-auto ${
            canAfford
              ? "bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20 hover:shadow-[0_0_10px_rgba(168,85,247,0.3)]"
              : "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
          }`}
        >
          {isPending ? "Processando..." : canAfford ? "Comprar" : "Pontos Insuf."}
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="flex items-center justify-center p-2 rounded text-red-400/70 hover:text-red-400 bg-red-950/10 border border-transparent hover:border-red-900/30 hover:bg-red-950/30 transition-all disabled:opacity-50"
          title="Excluir Recompensa"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
}
