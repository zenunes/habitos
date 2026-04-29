"use client";

import { useTransition } from "react";
import { redeemRewardAction, deleteRewardAction } from "@/modules/rewards/actions";
import { Reward } from "@/modules/rewards/domain/reward";
import { Trash2, ShoppingBag, Gift, Heart } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export function RewardItem({
  reward,
  availablePoints,
  isSystemItem = false,
  meta,
}: {
  reward: Reward;
  availablePoints: number;
  isSystemItem?: boolean;
  meta?: { categoryLabel?: string; description?: string };
}) {
  const [isPending, startTransition] = useTransition();
  const canAfford = availablePoints >= reward.pointsCost;

  const handleRedeem = () => {
    if (window.confirm(`Deseja comprar "${reward.title}" por ${reward.pointsCost} moedas?`)) {
      startTransition(async () => {
        const result = await redeemRewardAction(reward.id, reward.pointsCost);
        if (result.error) {
          toast.error(result.error, {
            style: { borderColor: "#ef4444", color: "#f87171" }
          });
        } else {
          // Toast específico para Poção
          if (result.isPotion) {
            toast.success(result.message, {
              icon: <Heart className="text-rose-400" fill="currentColor" />,
              style: { borderColor: "#f43f5e", color: "#fda4af", background: "rgba(244, 63, 94, 0.15)" }
            });
            confetti({
              particleCount: 50,
              spread: 70,
              origin: { y: 0.7 },
              colors: ['#f43f5e', '#fb7185', '#fda4af']
            });
          } else {
            toast.success(`Comprado: ${reward.title}`, {
              icon: <Gift className="text-amber-400" />,
              style: { borderColor: "#f59e0b", color: "#fcd34d", background: "rgba(245, 158, 11, 0.1)" }
            });
            
            confetti({
              particleCount: 50,
              spread: 70,
              origin: { y: 0.7 },
              colors: ['#f59e0b', '#fbbf24', '#fcd34d']
            });
          }
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
    <li className={`group relative flex flex-col sm:flex-row sm:items-center justify-between ${isSystemItem ? 'bg-rose-950/20 border-rose-900/50 hover:border-rose-500/60' : 'bg-slate-900/60 border-slate-700 hover:border-amber-500/60'} border rounded-xl p-4 hover:bg-slate-800/80 transition-all shadow-sm ${isSystemItem ? 'hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]' : 'hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]'} ${isPending ? "opacity-50" : "opacity-100"}`}>
      <div className="flex items-start gap-4 mb-4 sm:mb-0">
        <div className={`mt-1 p-2 rounded-lg transition-colors border ${isSystemItem ? 'bg-rose-900/20 text-rose-500 border-rose-900/40 group-hover:bg-rose-900/40 group-hover:border-rose-500/40' : 'bg-slate-800 group-hover:bg-amber-900/40 group-hover:text-amber-400 text-slate-500 border-slate-700 group-hover:border-amber-500/30'}`}>
          {isSystemItem ? <Heart size={20} /> : <ShoppingBag size={20} />}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className={`text-lg font-heading font-bold transition-colors ${isSystemItem ? 'text-rose-200 group-hover:text-rose-100' : 'text-slate-100 group-hover:text-white'}`}>{reward.title}</p>
            {meta?.categoryLabel && (
              <span className={`text-[10px] font-heading tracking-widest font-bold uppercase inline-block px-2 py-0.5 rounded border ${
                isSystemItem
                  ? 'text-rose-300 bg-rose-950/40 border-rose-500/30'
                  : meta.categoryLabel === 'Consumível'
                    ? 'text-emerald-300 bg-emerald-950/30 border-emerald-500/30'
                    : meta.categoryLabel === 'Boost'
                      ? 'text-indigo-300 bg-indigo-950/30 border-indigo-500/30'
                      : meta.categoryLabel === 'Cosmético'
                        ? 'text-fuchsia-300 bg-fuchsia-950/30 border-fuchsia-500/30'
                        : 'text-amber-300 bg-amber-950/30 border-amber-500/30'
              }`}>
                {meta.categoryLabel}
              </span>
            )}
          </div>

          {meta?.description && (
            <p className="text-xs text-slate-400 mt-2 font-body leading-relaxed">
              {meta.description}
            </p>
          )}

          <p className={`text-[10px] mt-2 font-heading tracking-widest font-bold uppercase inline-block px-2 py-0.5 rounded border ${isSystemItem ? 'text-rose-400 bg-rose-950/40 border-rose-500/30' : 'text-amber-400 bg-amber-950/30 border-amber-500/30'}`}>Custo: {reward.pointsCost} 🪙</p>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4 sm:mt-0">
        <button
          onClick={handleRedeem}
          disabled={isPending || !canAfford}
          className={`rounded px-4 py-2 text-xs font-heading font-bold tracking-widest uppercase transition-all w-full sm:w-auto ${
            canAfford
              ? isSystemItem
                ? "bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 hover:shadow-[0_0_10px_rgba(244,63,94,0.3)]"
                : "bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 hover:shadow-[0_0_10px_rgba(245,158,11,0.3)]"
              : "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
          }`}
        >
          {isPending ? "Processando..." : canAfford ? "Comprar" : "Ouro Insuf."}
        </button>
        
        {!isSystemItem && (
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex items-center justify-center p-2 rounded text-red-400/70 hover:text-red-400 bg-red-950/10 border border-transparent hover:border-red-900/30 hover:bg-red-950/30 transition-all disabled:opacity-50"
            title="Excluir Recompensa"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </li>
  );
}
