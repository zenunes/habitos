"use client";

import { useTransition } from "react";
import { completeBossQuestAction } from "@/modules/quests/actions";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export function BossButton({ questId }: { questId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleComplete = () => {
    startTransition(async () => {
      const result = await completeBossQuestAction(questId);
      if (result.error) {
        toast.error(result.error, {
          style: { borderColor: "#ef4444", color: "#f87171" }
        });
      } else if (result.message) {
        toast.success(result.message, {
          icon: <ShieldAlert className="text-amber-400" />,
          style: { borderColor: "#f59e0b", color: "#fcd34d", background: "rgba(245, 158, 11, 0.1)" },
          duration: 5000,
        });

        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: ReturnType<typeof setInterval> = setInterval(() => {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          confetti({
            ...defaults, particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: ['#f59e0b', '#fbbf24', '#fcd34d', '#ef4444']
          });
          confetti({
            ...defaults, particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: ['#f59e0b', '#fbbf24', '#fcd34d', '#ef4444']
          });
        }, 250);
      }
    });
  };

  return (
    <button
      onClick={handleComplete}
      disabled={isPending}
      className="system-btn-primary !bg-amber-600 hover:!bg-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.6)] py-3 px-6 text-sm flex items-center justify-center gap-2 w-full sm:w-auto text-amber-950 font-bold transition-all disabled:opacity-50"
    >
      {isPending ? "Processando..." : <><CheckCircle2 size={18} /> Confirmar Vitória</>}
    </button>
  );
}
