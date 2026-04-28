import Link from "next/link";
import { requireUser } from "@/modules/auth/server/session";
import { getUserProfile } from "@/modules/profile/server/queries";
import { getUserProgress } from "@/modules/progression/server/queries";
import { getLevelProgress } from "@/modules/progression/domain/progression";
import { getDailyCompletionCountsByRange, getHabitLogsSummary } from "@/modules/habits/server/queries";
import { getUserBadges } from "@/modules/progression/server/badges";
import { ProfileForm } from "./profile-form";
import { TopNav } from "@/components/layout/top-nav";
import { UserIcon, Shield, Star, Zap, Activity, CalendarDays, Medal, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Heatmap } from "./heatmap";
import { BadgesList } from "./badges-list";
import { ProductivityChart, type ProductivityPoint } from "./productivity-chart";
import { getTodayDateStr } from "@/lib/date-utils";

export default async function PerfilPage({
  searchParams,
}: {
  searchParams?: { month?: string };
}) {
  const user = await requireUser();
  const profile = await getUserProfile();
  const progress = await getUserProgress();
  const levelData = getLevelProgress(progress.xpTotal, progress.level);
  
  // Buscar histórico de até 140 dias (20 semanas de 7 dias)
  const logsSummary = await getHabitLogsSummary(140);
  
  // Buscar conquistas (badges) do usuário
  const badges = await getUserBadges();

  const currentMonthStr = getTodayDateStr().slice(0, 7);
  const monthStr =
    searchParams?.month && /^\d{4}-\d{2}$/.test(searchParams.month)
      ? searchParams.month
      : currentMonthStr;

  const [yearStr, monthNumStr] = monthStr.split("-");
  const year = Number(yearStr);
  const monthNum = Number(monthNumStr);
  const lastDay = new Date(year, monthNum, 0).getDate();

  const pad2 = (n: number) => String(n).padStart(2, "0");
  const startDateStr = `${monthStr}-01`;
  const endDateStr = `${monthStr}-${pad2(lastDay)}`;

  const completionCounts = await getDailyCompletionCountsByRange(startDateStr, endDateStr);
  const countsMap = new Map(completionCounts.map((r) => [r.date, r.count]));

  const monthPoints: ProductivityPoint[] = Array.from({ length: lastDay }, (_, i) => {
    const day = i + 1;
    const date = `${monthStr}-${pad2(day)}`;
    const count = countsMap.get(date) ?? 0;
    return { date, day, count, score: 0 };
  });

  const maxCount = Math.max(0, ...monthPoints.map((p) => p.count));
  const finalMonthPoints = monthPoints.map((p) => {
    if (p.count <= 0 || maxCount <= 0) return { ...p, score: 0 };
    const score = Math.max(1, Math.min(5, Math.ceil((p.count / maxCount) * 5)));
    return { ...p, score };
  });

  const monthLabel = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(`${monthStr}-01T12:00:00Z`));

  const prevDate = new Date(`${monthStr}-01T12:00:00Z`);
  prevDate.setUTCMonth(prevDate.getUTCMonth() - 1);
  const prevMonth = `${prevDate.getUTCFullYear()}-${pad2(prevDate.getUTCMonth() + 1)}`;

  const nextDate = new Date(`${monthStr}-01T12:00:00Z`);
  nextDate.setUTCMonth(nextDate.getUTCMonth() + 1);
  const nextMonth = `${nextDate.getUTCFullYear()}-${pad2(nextDate.getUTCMonth() + 1)}`;
  const canGoNext = monthStr < currentMonthStr;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10 relative z-10 pb-24 md:pb-10">
      <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse shadow-[0_0_8px_rgba(14,165,233,0.5)]"></span>
            <p className="text-xs uppercase tracking-[0.2em] text-sky-400 font-heading font-bold">Identificação</p>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] flex items-center gap-3">
            <UserIcon size={32} className="text-sky-500" /> Perfil do Caçador
          </h1>
          <p className="text-slate-400 mt-1">Gerencie suas credenciais e verifique seu status atual.</p>
        </div>
        <div className="flex flex-col items-end gap-4 hidden md:flex">
          <TopNav />
        </div>
      </header>

      {/* PAINEL DE STATUS GERAL */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card da Classe */}
        <div className="system-card p-6 border-sky-900/30 flex flex-col justify-center items-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-sky-900/5 group-hover:bg-sky-900/10 transition-colors duration-500" />
          <Shield size={48} className="text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] mb-4" />
          <p className="text-xs text-slate-400 font-heading tracking-widest uppercase mb-1">Classe Atual</p>
          <h2 className="text-2xl font-bold text-white tracking-wider text-center">{progress.className}</h2>
          <div className="mt-4 flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-full border border-slate-800">
            <span className="text-sky-500 font-bold">LVL</span>
            <span className="text-white font-bold">{progress.level}</span>
          </div>
        </div>

        {/* Card de Atributos */}
        <div className="system-card p-6 border-sky-900/30 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded border border-slate-800/50">
            <div className="flex items-center gap-3">
              <Activity className="text-red-400" size={20} />
              <span className="text-sm font-heading tracking-wider text-slate-300">Vitalidade (HP)</span>
            </div>
            <span className="font-bold text-white">{progress.hpCurrent} / 100</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded border border-slate-800/50">
            <div className="flex items-center gap-3">
              <Zap className="text-orange-400" size={20} />
              <span className="text-sm font-heading tracking-wider text-slate-300">Ofensiva (Streak)</span>
            </div>
            <span className="font-bold text-white">{progress.currentStreak} dias</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded border border-slate-800/50">
            <div className="flex items-center gap-3">
              <Star className="text-yellow-400" size={20} />
              <span className="text-sm font-heading tracking-wider text-slate-300">Ofensiva Máxima</span>
            </div>
            <span className="font-bold text-white">{progress.bestStreak} dias</span>
          </div>
        </div>
      </section>

      {/* MAPA DE CALOR (CONTRIBUIÇÕES) */}
      <section className="system-card p-6 border-sky-900/30">
        <h2 className="text-xl font-heading font-bold tracking-widest text-white mb-6 flex items-center gap-3">
          <CalendarDays size={24} className="text-sky-500" /> Histórico de Quests
        </h2>
        <Heatmap data={logsSummary} days={140} />
      </section>

      <section className="system-card p-6 border-sky-900/30">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <TrendingUp size={22} className="text-theme-light" />
            <div>
              <h2 className="text-xl font-heading font-bold tracking-widest text-white">Gráfico de Produtividade</h2>
              <p className="text-xs text-slate-400 mt-1">Toque e arraste para inspecionar os dias</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/perfil?month=${prevMonth}`}
              className="h-9 w-9 rounded-lg border border-slate-800 bg-slate-900/40 flex items-center justify-center text-slate-300 hover:text-white hover:border-theme-base/50 transition-colors"
              aria-label="Mês anterior"
            >
              <ChevronLeft size={18} />
            </Link>
            <div className="px-3 py-2 rounded-lg border border-slate-800 bg-slate-900/40 text-xs font-heading tracking-widest uppercase text-slate-300 min-w-[140px] text-center">
              {monthLabel}
            </div>
            <Link
              href={`/perfil?month=${nextMonth}`}
              className={`h-9 w-9 rounded-lg border border-slate-800 bg-slate-900/40 flex items-center justify-center text-slate-300 transition-colors ${
                canGoNext ? "hover:text-white hover:border-theme-base/50" : "opacity-40 pointer-events-none"
              }`}
              aria-label="Próximo mês"
            >
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>

        <ProductivityChart points={finalMonthPoints} />
      </section>

      {/* CONQUISTAS / BADGES */}
      <section className="system-card p-6 border-sky-900/30">
        <h2 className="text-xl font-heading font-bold tracking-widest text-white mb-6 flex items-center gap-3">
          <Medal size={24} className="text-amber-500" /> Conquistas Desbloqueadas
        </h2>
        <BadgesList badges={badges} />
      </section>

      {/* BARRA DE PROGRESSO DE XP */}

      <section className="system-card p-6 border-sky-900/30">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-lg font-heading font-bold tracking-widest text-white">Progresso de Despertar</h2>
            <p className="text-xs text-slate-400 mt-1">XP Necessário para o próximo nível</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-sky-400">{Math.floor(levelData.xpIntoCurrentLevel)}</span>
            <span className="text-slate-500"> / {levelData.xpNeededForNextLevel} XP</span>
          </div>
        </div>
        <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
          <div 
            className="h-full bg-gradient-to-r from-sky-600 to-sky-400 relative transition-all duration-1000 ease-out"
            style={{ width: `${levelData.progressPercent}%` }}
          >
            <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" />
          </div>
        </div>
        <div className="mt-4 flex justify-between text-xs font-heading tracking-widest text-slate-500">
          <span>LVL {progress.level}</span>
          <span>LVL {progress.level + 1}</span>
        </div>
      </section>

      <section className="system-card p-6 border-sky-900/30">
        <h2 className="text-xl font-heading font-bold tracking-widest text-white mb-6 border-b border-slate-800 pb-3">
          Dados Pessoais
        </h2>
        <div className="mb-8">
          <p className="text-xs text-slate-500 font-heading tracking-widest uppercase mb-1">Email Registrado</p>
          <p className="text-slate-300 font-body p-3 bg-slate-900/50 rounded border border-slate-800 max-w-md">
            {user.email}
          </p>
        </div>

        <ProfileForm initialProfile={profile} />
      </section>
    </main>
  );
}
