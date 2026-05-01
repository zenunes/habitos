"use client";

import { useMemo } from "react";
import { HabitLogSummary } from "@/modules/habits/server/queries";
import { getTodayDateStr } from "@/lib/date-utils";

type HeatmapProps = {
  data: HabitLogSummary[];
  days?: number;
};

export function Heatmap({ data, days = 140 }: HeatmapProps) {
  const { grid, maxCount } = useMemo(() => {
    // Cria o dicionário de busca rápida
    const countsByDate = new Map<string, number>();
    let max = 0;
    
    data.forEach((item) => {
      countsByDate.set(item.date, item.count);
      if (item.count > max) max = item.count;
    });

    // Data de hoje (final do grid)
    const todayStr = getTodayDateStr();
    const today = new Date(`${todayStr}T12:00:00Z`); // Usa meio-dia pra evitar virada de fuso

    
    // Data de início
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - days + 1);

    // Ajustar para começar no domingo daquela semana
    const startDayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - startDayOfWeek);

    const gridDates = [];
    const current = new Date(startDate);

    while (current <= today || current.getDay() !== 0) { // Vai até preencher a última semana (sábado)
      if (current > today && current.getDay() === 0) break;

      const dateStr = current.toISOString().split("T")[0];
      const count = countsByDate.get(dateStr) || 0;
      
      gridDates.push({
        date: dateStr,
        count,
        isFuture: current > today,
      });

      current.setDate(current.getDate() + 1);
    }

    return { grid: gridDates, maxCount: max || 1 }; // Evita maxCount = 0
  }, [data, days]);

  const getColorClass = (count: number, isFuture: boolean) => {
    if (isFuture) return "bg-transparent";
    if (count === 0) return "bg-slate-800/50";
    
    // Calcula a intensidade baseada no maxCount (para ser dinâmico)
    const ratio = count / maxCount;
    if (ratio <= 0.25) return "bg-sky-900/60";
    if (ratio <= 0.5) return "bg-sky-700/80";
    if (ratio <= 0.75) return "bg-sky-500";
    return "bg-sky-300 shadow-[0_0_8px_rgba(125,211,252,0.6)]"; // Brilho no nível máximo
  };

  return (
    <div className="flex flex-col gap-2 w-full overflow-x-auto pb-4 custom-scrollbar">
      <div 
        className="grid grid-rows-7 gap-1 w-max"
        style={{ gridAutoFlow: "column" }}
      >
        {grid.map((cell) => (
          <div
            key={cell.date}
            title={`${cell.date}: ${cell.count} quests`}
            className={`w-3 h-3 rounded-[2px] transition-colors duration-300 ${getColorClass(cell.count, cell.isFuture)}`}
          />
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 text-[10px] text-slate-500 font-heading uppercase mt-2 w-full max-w-full">
        <span>Menos</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-[2px] bg-slate-800/50" />
          <div className="w-3 h-3 rounded-[2px] bg-sky-900/60" />
          <div className="w-3 h-3 rounded-[2px] bg-sky-700/80" />
          <div className="w-3 h-3 rounded-[2px] bg-sky-500" />
          <div className="w-3 h-3 rounded-[2px] bg-sky-300" />
        </div>
        <span>Mais</span>
      </div>
    </div>
  );
}
