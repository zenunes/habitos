import { requireUser } from "@/modules/auth/server/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { TopNav } from "@/components/layout/top-nav";
import { Trophy } from "lucide-react";

export default async function ConquistasPage() {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const [{ data: allBadges }, { data: userBadges }] = await Promise.all([
    supabase.from("badges").select("*").order("created_at", { ascending: true }),
    supabase.from("user_badges").select("badge_id, granted_at").eq("user_id", user.id)
  ]);

  const earnedBadgeIds = new Set(userBadges?.map((ub) => ub.badge_id) || []);
  const earnedCount = earnedBadgeIds.size;
  const totalCount = allBadges?.length || 0;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10 relative z-10">
      <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-400 font-heading font-bold">Hall da Fama</p>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] flex items-center gap-3">
            <Trophy size={32} className="text-amber-500" /> Títulos e Conquistas
          </h1>
          <p className="text-slate-400 mt-1">Exiba seus feitos e o respeito que conquistou.</p>
        </div>
        <div className="flex flex-col items-end gap-4">
          <div className="bg-amber-900/20 border border-amber-500/30 px-4 py-2 rounded-lg">
            <span className="text-xs text-amber-400 font-heading uppercase tracking-widest block mb-1">Progresso</span>
            <span className="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
              {earnedCount} / {totalCount}
            </span>
          </div>
          <TopNav />
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allBadges?.map((badge) => {
          const isEarned = earnedBadgeIds.has(badge.id);
          const criteria = (badge.criteria ?? {}) as Record<string, unknown>;
          const criteriaType = typeof criteria.type === "string" ? criteria.type : "";
          const criteriaDescription = typeof criteria.description === "string" ? criteria.description : "";
          const ub = userBadges?.find((ub) => ub.badge_id === badge.id);
          const dateEarned = ub ? new Date(ub.granted_at).toLocaleDateString("pt-BR") : null;

          return (
            <div 
              key={badge.id}
              className={`relative overflow-hidden rounded-xl border p-5 transition-all ${
                isEarned 
                  ? "bg-slate-900/80 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]" 
                  : "bg-slate-900/30 border-slate-800 opacity-60 grayscale hover:grayscale-0"
              }`}
            >
              {isEarned && (
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
              )}
              
              <div className="flex items-center gap-3 mb-3">
                <div className={`h-10 w-10 flex items-center justify-center rounded-lg border ${
                  isEarned ? "bg-amber-950/50 border-amber-500/30 text-amber-400" : "bg-slate-800 border-slate-700 text-slate-500"
                }`}>
                  <span className="text-xl font-heading font-bold">
                    {criteriaType === "level" ? "Lvl" : "🔥"}
                  </span>
                </div>
                <div>
                  <h3 className={`font-heading font-bold tracking-widest uppercase text-lg ${
                    isEarned ? "text-amber-400" : "text-slate-400"
                  }`}>
                    {badge.title}
                  </h3>
                  {isEarned && <p className="text-[10px] text-amber-500/70 font-bold uppercase tracking-wider">Adquirido em {dateEarned}</p>}
                </div>
              </div>
              
              <p className="text-sm text-slate-400 font-body">
                {criteriaDescription}
              </p>
            </div>
          );
        })}
      </section>
    </main>
  );
}
