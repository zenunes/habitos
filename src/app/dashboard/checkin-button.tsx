"use client";

import { useState, useTransition } from "react";
import { checkinHabitAction } from "@/modules/habits/actions-checkin";

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

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleCheckin}
        disabled={isPending || statusMsg?.includes("Sucesso")}
        className={`system-btn-primary py-2 px-4 text-xs ${
          statusMsg?.includes("Sucesso") 
            ? "!bg-emerald-600/20 !border-emerald-500/50 !text-emerald-400 !shadow-[0_0_10px_rgba(16,185,129,0.3)] cursor-not-allowed" 
            : ""
        }`}
      >
        {isPending ? "Sincronizando..." : statusMsg?.includes("Sucesso") ? "Quest Concluída" : "Completar Quest"}
      </button>
      {statusMsg && (
        <p className={`text-[10px] font-heading tracking-widest uppercase mt-1 ${
          statusMsg.includes("Erro") ? "text-red-400" : "text-emerald-400"
        }`}>
          {statusMsg}
        </p>
      )}
    </div>
  );
}
