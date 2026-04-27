import Link from "next/link";
import { logoutAction } from "@/modules/auth/actions";
import { requireUser } from "@/modules/auth/server/session";
import { getUserProgress } from "@/modules/progression/server/queries";
import { getUserRewards } from "@/modules/rewards/server/queries";
import { getActiveQuests } from "@/modules/quests/server/queries";
import { getActiveHabits } from "@/modules/habits/server/queries";
import { CheckinButton } from "./checkin-button";

export default async function DashboardPage() {
  const user = await requireUser();
  
  const [progress, rewards, quests, habits] = await Promise.all([
    getUserProgress(),
    getUserRewards(),
    getActiveQuests(),
    getActiveHabits()
  ]);

  const mainQuest = quests.length > 0 ? quests[0] : null;
  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const userName = user.email?.split("@")[0] || "Caçador";

  // Mock progress calculation for visual effect
  const xpForNextLevel = progress.level * 120;
  const currentLevelXp = progress.xpTotal % 120;
  const progressPercent = Math.min(100, Math.max(0, (currentLevelXp / xpForNextLevel) * 100));

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10 relative z-10">
      
      {/* HEADER DO JOGADOR */}
      <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-xs uppercase tracking-[0.2em] text-sky-400 font-heading font-bold">Status do Sistema</p>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
            {userName}
          </h1>
          <p className="text-slate-400 mt-1">O sistema está registrando sua evolução diária.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/habitos" className="system-btn-secondary">
            Gerenciar Quests
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="system-btn-secondary border-red-900/50 text-red-400 hover:border-red-500 hover:text-red-300">
              Desconectar
            </button>
          </form>
        </div>
      </header>

      {/* PAINEL DE STATUS */}
      <section className="system-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-600/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="flex flex-col items-center justify-center min-w-[120px]">
            <span className="text-sm font-heading font-bold uppercase tracking-widest text-sky-500 mb-1">Level</span>
            <span className="text-6xl font-heading font-bold text-white drop-shadow-[0_0_15px_rgba(14,165,233,0.5)]">
              {progress.level}
            </span>
          </div>

          <div className="flex-1 w-full">
            <div className="flex justify-between text-sm mb-2 font-heading tracking-wider">
              <span className="text-slate-400">EXPERIÊNCIA (XP)</span>
              <span className="text-sky-400 font-bold">{currentLevelXp} / {xpForNextLevel}</span>
            </div>
            
            {/* Barra de Progresso */}
            <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
              <div 
                className="h-full bg-sky-500 rounded-full relative shadow-[0_0_10px_var(--primary-glow)]"
                style={{ width: `${progressPercent}%`, transition: 'width 1s ease-in-out' }}
              >
                <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/30" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-4 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-colors" />
                <span className="text-xs text-slate-500 uppercase tracking-wider font-heading block mb-1">Ofensiva Atual</span>
                <p className="text-2xl font-bold text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">{progress.currentStreak} Dias</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-4 relative overflow-hidden group hover:border-sky-500/50 transition-colors">
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-sky-500/10 rounded-full blur-xl group-hover:bg-sky-500/20 transition-colors" />
                <span className="text-xs text-slate-500 uppercase tracking-wider font-heading block mb-1">XP Total Acumulado</span>
                <p className="text-2xl font-bold text-slate-200">{progress.xpTotal} pts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        {/* QUESTS DIÁRIAS (HÁBITOS) */}
        <section className="system-card p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-3">
            <div className="h-4 w-1 bg-sky-500 rounded-full shadow-[0_0_8px_var(--primary-glow)]" />
            <h2 className="text-lg font-heading font-bold tracking-widest text-white">Missões Diárias</h2>
          </div>
          
          {habits.length > 0 ? (
            <ul className="space-y-3">
              {habits.filter(h => h.active).map(habit => (
                <li key={habit.id} className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900/40 border border-slate-800 rounded-lg p-4 hover:border-sky-500/50 transition-colors">
                  <div className="mb-3 sm:mb-0">
                    <p className="font-heading font-bold text-slate-200 group-hover:text-white transition-colors">{habit.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{habit.frequency}</p>
                  </div>
                  <CheckinButton habitId={habit.id} todayDateRef={todayStr} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 border border-dashed border-slate-800 rounded-lg">
              <p className="text-sm text-slate-500 font-body mb-3">Nenhuma missão atribuída.</p>
              <Link href="/habitos" className="text-sky-400 hover:text-sky-300 text-sm font-heading tracking-wider uppercase font-bold underline">
                Aceitar novas missões
              </Link>
            </div>
          )}
        </section>

        <div className="space-y-6">
          {/* MAIN QUEST */}
          {mainQuest && (
            <section className="system-card p-6 border-amber-500/30 bg-gradient-to-br from-[#0b0f19] to-amber-950/20">
              <div className="flex items-center justify-between mb-4 border-b border-amber-900/30 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-1 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  <h2 className="text-lg font-heading font-bold tracking-widest text-amber-500">Missão Especial</h2>
                </div>
                {mainQuest.completed && (
                  <span className="rounded bg-amber-500/20 px-2 py-1 text-[10px] font-heading font-bold tracking-widest text-amber-400 uppercase border border-amber-500/50">
                    Concluída
                  </span>
                )}
              </div>
              <h3 className="font-bold text-white mb-2">{mainQuest.title}</h3>
              <p className="text-sm text-slate-400 mb-4">{mainQuest.description}</p>
              <div className="inline-block bg-amber-500/10 border border-amber-500/30 rounded px-3 py-1.5">
                <span className="text-xs text-amber-500/70 uppercase tracking-wider mr-2 font-heading">Recompensa</span>
                <span className="font-bold text-amber-400">+{mainQuest.xpReward} XP</span>
              </div>
            </section>
          )}

          {/* LOJA DO SISTEMA */}
          <section className="system-card p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-3">
              <div className="h-4 w-1 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
              <h2 className="text-lg font-heading font-bold tracking-widest text-white">Loja do Sistema</h2>
            </div>
            
            {rewards.length > 0 ? (
              <ul className="space-y-3">
                {rewards.map((reward) => (
                  <li key={reward.id} className="flex justify-between items-center bg-slate-900/50 rounded p-3 border border-slate-800">
                    <span className="text-sm text-slate-300 font-medium">{reward.title}</span>
                    <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20">
                      {reward.pointsCost} pts
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 italic text-center py-4">A loja está indisponível no momento.</p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
