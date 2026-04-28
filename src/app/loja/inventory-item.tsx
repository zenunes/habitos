"use client";

import { useTransition } from "react";
import { consumeRewardAction } from "@/modules/rewards/actions";
import { RedeemedItem } from "@/modules/rewards/server/queries";
import { CheckCircle2, Play } from "lucide-react";
import { toast } from "sonner";

export function InventoryItem({ item }: { item: RedeemedItem }) {
  const [isPending, startTransition] = useTransition();

  const handleConsume = () => {
    if (window.confirm(`Deseja utilizar o item "${item.title}" agora?`)) {
      startTransition(async () => {
        const result = await consumeRewardAction(item.id);
        if (result.error) {
          toast.error(result.error, {
            style: { borderColor: "#ef4444", color: "#f87171" }
          });
        } else {
          toast.success(result.message, {
            style: { borderColor: "#10b981", color: "#34d399", background: "rgba(16, 185, 129, 0.1)" }
          });
        }
      });
    }
  };

  const isConsumed = !!item.consumedAt;

  return (
    <li className={`flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900/50 p-4 rounded-lg border ${isConsumed ? 'border-emerald-900/30 opacity-70' : 'border-slate-800 hover:border-purple-500/30'} transition-all`}>
      <div className="mb-3 sm:mb-0">
        <p className={`font-heading font-bold ${isConsumed ? 'text-slate-400 line-through decoration-emerald-500/30' : 'text-slate-200'}`}>
          {item.title}
        </p>
        <p className="text-xs text-slate-500">
          Resgatado em {new Date(item.redeemedAt).toLocaleDateString('pt-BR')} às {new Date(item.redeemedAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
        </p>
      </div>
      
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
        <span className="text-[10px] text-amber-400 font-heading tracking-widest font-bold uppercase bg-amber-950/30 px-2 py-1 rounded border border-amber-500/30">
          -{item.pointsCost} 🪙
        </span>
        
        {isConsumed ? (
          <span className="flex items-center gap-1 text-[10px] font-heading font-bold tracking-widest uppercase text-emerald-500 bg-emerald-950/30 px-2 py-1 rounded border border-emerald-900/50">
            <CheckCircle2 size={12} /> Consumido
          </span>
        ) : (
          <button
            onClick={handleConsume}
            disabled={isPending}
            className="flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-heading font-bold tracking-widest uppercase transition-all bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 hover:shadow-[0_0_10px_rgba(16,185,129,0.3)] disabled:opacity-50"
          >
            <Play size={14} /> {isPending ? "Processando..." : "Utilizar"}
          </button>
        )}
      </div>
    </li>
  );
}
