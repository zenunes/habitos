"use client";

import { useState, useTransition } from "react";
import { checkinHabitAction } from "@/modules/habits/actions-checkin";

type CheckinButtonProps = {
  habitId: string;
  habitTitle: string;
  todayDateRef: string; // no formato YYYY-MM-DD
};

export function CheckinButton({ habitId, habitTitle, todayDateRef }: CheckinButtonProps) {
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
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={handleCheckin}
        disabled={isPending}
        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
      >
        {isPending ? "Registrando..." : `Concluir ${habitTitle}`}
      </button>
      {statusMsg && <p className="text-xs text-emerald-700">{statusMsg}</p>}
    </div>
  );
}
