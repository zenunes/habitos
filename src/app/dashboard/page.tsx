import Link from "next/link";
import { logoutAction } from "@/modules/auth/actions";
import { requireUser } from "@/modules/auth/server/session";
import { getUserProgress } from "@/modules/progression/server/queries";
import { getUserProfile } from "@/modules/profile/server/queries";
import { getActiveQuests } from "@/modules/quests/server/queries";
import { getActiveHabits, getTodayHabitLogs } from "@/modules/habits/server/queries";
import { CheckinButton } from "./checkin-button";
import { ShoppingCart, Trophy, Target, LogOut, Swords, Scroll, ShieldAlert, Zap, CheckCircle2, User as UserIcon } from "lucide-react";

export default async function DashboardPage() {
  const user = await requireUser();
  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  
  const [progress, quests, allHabits, todayLogs, profile] = await Promise.all([
    getUserProgress(),
    getActiveQuests(),
    getActiveHabits(),
    getTodayHabitLogs(todayStr),
    getUserProfile()
  ]);

  const mainQuest = quests.length > 0 ? quests[0] : null;
  const userName = profile?.name || user.email?.split("@")[0] || "Caçador";

  // Identificar missões pendentes e concluídas
  const completedHabitIds = new Set(todayLogs.map(log => log.habit_id));
  const activeHabits = allHabits.filter(h => h.active);
  const pendingHabits = activeHabits.filter(h => !completedHabitIds.has(h.id));
  const completedHabits = activeHabits.filter(h => completedHabitIds.has(h.id));

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
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
            <p className="text-xs uppercase tracking-[0.2em] text-sky-400 font-heading font-bold">Status do Sistema</p>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] flex items-center gap-3">
            {userName}
          </h1>
          <p className="text-slate-400 mt-1">O sistema está registrando sua evolução diária.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/loja" className="system-btn-secondary !p-3 flex items-center justify-center border-purple-500/30 text-purple-400 hover:border-purple-400 hover:text-purple-300 hover:bg-purple-500/10" title="Loja do Sistema">
            <ShoppingCart size={20} />
          </Link>
          <Link href="/conquistas" className="system-btn-secondary !p-3 flex items-center justify-center border-amber-500/30 text-amber-400 hover:border-amber-400 hover:text-amber-300 hover:bg-amber-500/10" title="Títulos e Conquistas">
            <Trophy size={20} />
          </Link>
          <Link href="/habitos" className="system-btn-secondary !p-3 flex items-center justify-center hover:bg-slate-800" title="Gerenciar Quests">
            <Target size={20} />
          </Link>
          <Link href="/perfil" className="system-btn-secondary !p-3 flex items-center justify-center border-sky-500/30 text-sky-400 hover:border-sky-400 hover:text-sky-300 hover:bg-sky-500/10" title="Perfil do Caçador">
            <UserIcon size={20} />
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="system-btn-secondary !p-3 flex items-center justify-center border-red-900/50 text-red-400 hover:border-red-500 hover:text-red-300 hover:bg-red-900/20" title="Desconectar">
              <LogOut size={20} />
            </button>
          </form>
        </div>
      </header>

      {/* PAINEL DE STATUS */}
      <section className="system-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-600/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="flex flex-col items-center justify-center min-w-[120px] relative">
            <div className="absolute inset-0 bg-sky-500/20 blur-2xl rounded-full"></div>
            <span className="text-sm font-heading font-bold uppercase tracking-widest text-sky-500 mb-1">Level</span>
            <span className="text-7xl font-heading font-bold text-white drop-shadow-[0_0_20px_rgba(14,165,233,0.8)]">
              {progress.level}
            </span>
          </div>

          <div className="flex-1 w-full">
            <div className="flex justify-between text-sm mb-2 font-heading tracking-wider">
              <span className="text-slate-400 flex items-center gap-2"><Zap size={14} className="text-sky-400"/> EXPERIÊNCIA (XP)</span>
              <span className="text-sky-400 font-bold">{currentLevelXp} / {xpForNextLevel}</span>
            </div>
            
            {/* Barra de Progresso */}
            <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
              <div 
                className="h-full bg-sky-500 rounded-full relative shadow-[0_0_15px_var(--primary-glow)]"
                style={{ width: `${progressPercent}%`, transition: 'width 1s ease-in-out' }}
              >
                <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/40" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-4 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-colors" />
                <span className="text-xs text-slate-500 uppercase tracking-wider font-heading flex items-center gap-2 mb-1">
                  <Swords size={12} className="text-emerald-500"/> Ofensiva Atual
                </span>
                <p className="text-3xl font-bold text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">{progress.currentStreak} <span className="text-sm text-emerald-500/70">Dias</span></p>
              </div>
              <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-4 relative overflow-hidden group hover:border-purple-500/50 transition-colors">
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-colors" />
                <span className="text-xs text-slate-500 uppercase tracking-wider font-heading flex items-center gap-2 mb-1">
                  <ShoppingCart size={12} className="text-purple-500"/> Pontos de Troca
                </span>
                <p className="text-3xl font-bold text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">{progress.xpTotal} <span className="text-sm text-purple-500/70">pts</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-8">
        {/* MAIN QUEST */}
        {mainQuest && (
          <section className="system-card p-6 border-amber-500/40 bg-gradient-to-r from-[#0b0f19] via-amber-950/20 to-[#0b0f19] relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b border-amber-900/40 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/30">
                  <ShieldAlert size={24} className="text-amber-500" />
                </div>
                <div>
                  <h2 className="text-xl font-heading font-bold tracking-widest text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">Missão Especial (Urgente)</h2>
                  <p className="text-xs text-amber-500/70 font-heading tracking-widest uppercase">Recompensa Alta</p>
                </div>
              </div>
              {mainQuest.completed && (
                <span className="mt-3 sm:mt-0 rounded bg-amber-500/20 px-3 py-1.5 text-xs font-heading font-bold tracking-widest text-amber-400 uppercase border border-amber-500/50">
                  Concluída
                </span>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{mainQuest.title}</h3>
                <p className="text-slate-300 font-body">{mainQuest.description}</p>
              </div>
              <div className="flex items-center gap-2 bg-amber-950/40 border border-amber-500/30 rounded-lg px-4 py-3 min-w-[140px] justify-center shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                <Trophy size={18} className="text-amber-500" />
                <span className="font-bold text-xl text-amber-400">+{mainQuest.xpReward} XP</span>
              </div>
            </div>
          </section>
        )}

        {/* QUESTS DIÁRIAS (HÁBITOS) */}
        <section className="system-card p-6 border-sky-900/30">
          <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-500/10 rounded-lg border border-sky-500/30">
                <Scroll size={24} className="text-sky-400" />
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold tracking-widest text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">Missões Diárias</h2>
                <p className="text-xs text-sky-500/70 font-heading tracking-widest uppercase">Renovação Diária</p>
              </div>
            </div>
            <Link href="/habitos" className="text-xs font-heading font-bold tracking-widest uppercase text-sky-400 hover:text-sky-300 transition-colors bg-sky-950/30 px-3 py-1.5 rounded border border-sky-900/50 hover:bg-sky-900/50">
              Gerenciar
            </Link>
          </div>
          
          {activeHabits.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-700 rounded-xl bg-slate-900/30">
              <div className="mx-auto h-16 w-16 rounded-full bg-sky-900/20 flex items-center justify-center mb-4 border border-sky-900/30">
                <Scroll size={28} className="text-sky-500/50" />
              </div>
              <p className="text-lg text-slate-300 font-heading font-bold tracking-widest uppercase mb-2">Nenhuma Missão Atribuída</p>
              <p className="text-sm text-slate-500 font-body mb-6">O sistema aguarda suas diretrizes para continuar a evolução.</p>
              <Link href="/habitos" className="system-btn-primary inline-flex items-center gap-2 w-auto px-6 py-3">
                <Target size={18} /> Aceitar Novas Missões
              </Link>
            </div>
          ) : pendingHabits.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingHabits.map(habit => (
                <li key={habit.id} className="group relative flex flex-col justify-between bg-slate-900/60 border border-slate-700 rounded-xl p-4 hover:border-sky-500/60 hover:bg-slate-800/80 transition-all shadow-sm hover:shadow-[0_0_20px_rgba(14,165,233,0.15)]">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-sky-900/40 group-hover:text-sky-400 text-slate-500 transition-colors border border-slate-700 group-hover:border-sky-500/30">
                      <Target size={18} />
                    </div>
                    <div>
                      <p className="text-base font-heading font-bold text-slate-100 group-hover:text-white transition-colors leading-tight">{habit.title}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-[10px] font-heading tracking-widest uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                          {habit.frequency === 'daily' ? 'Diária' : 'Dias Úteis'}
                        </span>
                        <span className="text-[10px] font-heading tracking-widest uppercase text-sky-500/70 flex items-center gap-1">
                          <Zap size={10} /> +10 XP
                        </span>
                      </div>
                    </div>
                  </div>
                  <CheckinButton habitId={habit.id} todayDateRef={todayStr} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12 border border-dashed border-slate-700 rounded-xl bg-slate-900/30">
              <div className="mx-auto h-16 w-16 rounded-full bg-emerald-900/20 flex items-center justify-center mb-4 border border-emerald-900/30">
                <CheckCircle2 size={28} className="text-emerald-500/50" />
              </div>
              <p className="text-lg text-emerald-400 font-heading font-bold tracking-widest uppercase mb-2 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">Todas as Missões Concluídas!</p>
              <p className="text-sm text-slate-500 font-body mb-6">O sistema reconhece o seu esforço hoje. Descanse para amanhã.</p>
            </div>
          )}
          
          {/* MISSÕES CONCLUÍDAS HOJE */}
          {completedHabits.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-800">
              <h3 className="text-sm font-heading font-bold tracking-widest text-slate-500 mb-4 uppercase flex items-center gap-2">
                <CheckCircle2 size={16} /> Registros de Hoje
              </h3>
              <ul className="grid grid-cols-1 gap-3 opacity-60">
                {completedHabits.map(habit => (
                  <li key={habit.id} className="flex items-center justify-between bg-slate-900/40 border border-emerald-900/30 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      <p className="text-sm font-heading font-bold text-slate-300 line-through decoration-emerald-500/30">{habit.title}</p>
                    </div>
                    <span className="text-[10px] font-heading font-bold tracking-widest uppercase text-emerald-500 bg-emerald-950/30 px-2 py-1 rounded border border-emerald-900/50">
                      Concluída
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
