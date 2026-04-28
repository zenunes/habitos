"use client";

import { useState, useTransition } from "react";
import { checkinHabitAction } from "@/modules/habits/actions-checkin";
import { CheckCircle2, CircleDashed, ShieldAlert, Zap, Swords } from "lucide-react";
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
        
        if (result.message?.includes("LEVEL UP") || result.message?.includes("Sucesso") || result.message?.includes("CLASS UP")) {
          
          if (result.message.includes("CLASS UP")) {
            const classMatch = result.message.match(/como: (.*?)!/);
            const className = classMatch ? classMatch[1] : "Nova Classe";
            
            toast.success(`MUDANÇA DE CLASSE! Você despertou como ${className}`, {
              icon: <Swords className="text-amber-400" />,
              style: { 
                borderColor: "#f59e0b", 
                color: "#fbbf24", 
                background: "rgba(245, 158, 11, 0.15)",
                boxShadow: "0 0 20px rgba(245, 158, 11, 0.6)"
              },
              duration: 8000,
            });

            // Efeito explosivo Épico (Âmbar/Dourado) de Class UP
            confetti({
              particleCount: 200,
              spread: 160,
              origin: { y: 0.5 },
              colors: ['#f59e0b', '#fbbf24', '#fcd34d', '#ffffff'],
              zIndex: 9999
            });
          } else if (result.message.includes("LEVEL UP")) {
            const levelMatch = result.message.match(/Nível (\d+)/);
            const level = levelMatch ? levelMatch[1] : "";
            
            toast.success(`LEVEL UP! Você atingiu o Nível ${level}`, {
              icon: <Zap className="text-sky-400" />,
              style: { 
                borderColor: "#0ea5e9", 
                color: "#38bdf8", 
                background: "rgba(14, 165, 233, 0.15)",
                boxShadow: "0 0 20px rgba(14, 165, 233, 0.4)"
              },
              duration: 6000,
            });

            // Efeito explosivo ciano de Level UP
            confetti({
              particleCount: 150,
              spread: 120,
              origin: { y: 0.6 },
              colors: ['#0ea5e9', '#38bdf8', '#bae6fd'],
              zIndex: 9999
            });
          } else {
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
          }

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
                colors: ['#f59e0b', '#fbbf24', '#fcd34d'],
                zIndex: 10000
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
    <div className="flex flex-col mt-2 w-full">
      <button
        onClick={handleCheckin}
        disabled={isPending}
        className="system-btn-primary py-2.5 px-4 text-xs flex items-center justify-center gap-2 w-full shadow-[0_0_10px_rgba(14,165,233,0.15)]"
      >
        {isPending ? (
          <>Sincronizando...</>
        ) : (
          <><CircleDashed size={16} className="text-sky-300" /> Completar Quest</>
        )}
      </button>
    </div>
  );
}
