"use client";

import { BadgeInfo } from "@/modules/progression/server/badges";
import { Droplet, Flame, Cpu, Shield, Medal, HeartPulse, Star, Zap, Crown, Swords, Sun, Moon, Mountain, Trophy, Target, Gem } from "lucide-react";

type BadgesListProps = {
  badges: BadgeInfo[];
};

function getIconComponent(iconName: string, colorClass: string, unlocked: boolean) {
  const finalColor = unlocked ? colorClass : "text-slate-700";
  const size = 32;

  switch (iconName) {
    case "droplet": return <Droplet size={size} className={finalColor} />;
    case "flame": return <Flame size={size} className={finalColor} />;
    case "cpu": return <Cpu size={size} className={finalColor} />;
    case "shield": return <Shield size={size} className={finalColor} />;
    case "heart-pulse": return <HeartPulse size={size} className={finalColor} />;
    case "star": return <Star size={size} className={finalColor} />;
    case "zap": return <Zap size={size} className={finalColor} />;
    case "crown": return <Crown size={size} className={finalColor} />;
    case "swords": return <Swords size={size} className={finalColor} />;
    case "sun": return <Sun size={size} className={finalColor} />;
    case "moon": return <Moon size={size} className={finalColor} />;
    case "mountain": return <Mountain size={size} className={finalColor} />;
    case "trophy": return <Trophy size={size} className={finalColor} />;
    case "target": return <Target size={size} className={finalColor} />;
    case "gem": return <Gem size={size} className={finalColor} />;
    default: return <Medal size={size} className={finalColor} />;
  }
}

export function BadgesList({ badges }: BadgesListProps) {
  if (!badges || badges.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500 font-heading tracking-widest text-sm uppercase">
          Nenhuma conquista disponível no sistema.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {badges.map((badge) => (
        <div 
          key={badge.id}
          className={`flex flex-col items-center text-center p-4 rounded border transition-all duration-500 ${
            badge.unlocked 
              ? "bg-slate-900/80 border-slate-700 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:border-sky-500/50 hover:-translate-y-1" 
              : "bg-slate-900/30 border-slate-800/50 opacity-60 grayscale-[0.8]"
          }`}
        >
          <div className="mb-3 relative">
            {badge.unlocked && (
              <div className="absolute inset-0 blur-md opacity-40 mix-blend-screen" />
            )}
            {getIconComponent(badge.icon, badge.color, badge.unlocked)}
          </div>
          
          <h3 className={`font-bold text-sm mb-1 ${badge.unlocked ? "text-white" : "text-slate-500"}`}>
            {badge.title}
          </h3>
          <p className="text-[10px] text-slate-400 leading-tight">
            {badge.description}
          </p>
          
          {!badge.unlocked && (
            <div className="mt-3 text-[9px] uppercase tracking-widest font-heading text-slate-600 border border-slate-800 px-2 py-1 rounded">
              Bloqueado
            </div>
          )}
        </div>
      ))}
    </div>
  );
}