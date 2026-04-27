"use client";

import { useState, useTransition } from "react";
import { checkinHabitAction } from "@/modules/habits/actions-checkin";
import { CheckCircle2, CircleDashed } from "lucide-react";

type CheckinButtonProps = {
  habitId: string;
  todayDateRef: string; // no formato YYYY-MM-DD
};

export function CheckinButton({ habitId, todayDateRef }: CheckinButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleCheckin = () => {
    startTransition(async () => {
      try {
        const result = await checkinHabitAction(habitId, todayDateRef);
        setStatusMsg(result.message);
        
        // Limpa a msg após alguns segundos
        setTimeout(() => setStatusMsg(null), 3000);
      } catch {
        setStatusMsg("Erro ao realizar check-in");
      }
    });
  };

  const isSuccess = statusMsg?.includes("Sucesso");

  return (
    <div className="flex flex-col items-end gap-1 mt-4 sm:mt-0 w-full sm:w-auto">
      <button
        onClick={handleCheckin}
        disabled={isPending || isSuccess}
        className={`system-btn-primary py-2 px-5 text-sm flex items-center justify-center gap-2 w-full sm:w-auto ${
          isSuccess 
            ? "!bg-emerald-600/20 !border-emerald-500/50 !text-emerald-400 !shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-not-allowed" 
            : ""
        }`}
      >
        {isPending ? (
          <>Sincronizando...</>
        ) : isSuccess ? (
          <><CheckCircle2 size={18} /> Quest Concluída</>
        ) : (
          <><CircleDashed size={18} className="text-sky-300" /> Completar Quest</>
        )}
      </button>
      {statusMsg && (
        <p className={`text-xs font-heading font-bold tracking-widest uppercase mt-2 text-right ${
          statusMsg.includes("Erro") ? "text-red-400" : "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]"
        }`}>
          {statusMsg}
        </p>
      )}
    </div>
  );
}
