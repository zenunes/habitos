"use client";

import { useState, useTransition } from "react";
import { checkinHabitAction } from "@/modules/habits/actions-checkin";
import { CheckCircle2, CircleDashed, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

type CheckinButtonProps = {
  habitId: string;
  todayDateRef: string; // no formato YYYY-MM-DD
};

export function CheckinButton({ habitId, todayDateRef }: CheckinButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleCheckin = () => {
    startTransition(async () => {
      try {
        const result = await checkinHabitAction(habitId, todayDateRef);
        
        if (result.message?.includes("Sucesso")) {
          // Toast de sucesso padrao
          toast.success("Quest Concluída! +10 XP", {
            style: { borderColor: "#10b981", color: "#34d399", background: "rgba(16, 185, 129, 0.1)" }
          });
          
          // Efeito de particulas
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#0ea5e9', '#38bdf8', '#7dd3fc']
          });

          // Checa se desbloqueou um título novo
          if (result.message.includes("Título desbloqueado")) {
            const title = result.message.split("Título desbloqueado: ")[1];
            
            // Dispara um toast epico para titulo
            setTimeout(() => {
              toast(`NOVO TÍTULO: ${title}`, {
                icon: <ShieldAlert className="text-amber-500" />,
                style: { 
                  borderColor: "#f59e0b", 
                  color: "#fbbf24", 
                  background: "rgba(245, 158, 11, 0.15)",
                  boxShadow: "0 0 20px rgba(245, 158, 11, 0.4)"
                },
                duration: 5000,
              });
              
              // Explosao dourada
              confetti({
                particleCount: 100,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#f59e0b', '#fbbf24', '#fcd34d']
              });
            }, 800);
          }
        } else if (result.error) {
          toast.error(result.error, {
            style: { borderColor: "#ef4444", color: "#f87171" }
          });
        }
      } catch {
        toast.error("Erro ao realizar check-in", {
          style: { borderColor: "#ef4444", color: "#f87171" }
        });
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-1 mt-4 sm:mt-0 w-full sm:w-auto">
      <button
        onClick={handleCheckin}
        disabled={isPending}
        className="system-btn-primary py-2 px-5 text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
      >
        {isPending ? (
          <>Sincronizando...</>
        ) : (
          <><CircleDashed size={18} className="text-sky-300" /> Completar Quest</>
        )}
      </button>
    </div>
  );
}
