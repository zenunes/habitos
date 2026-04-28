import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/modules/auth/server/session";
import { logger } from "@/lib/logger";
import { UserProgress, calculateLevel, getHunterClass } from "../domain/progression";

export async function getUserProgress(): Promise<UserProgress> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const [{ data: progressData, error: progressError }, { data: redemptionsData }, { data: potionBuysData }] = await Promise.all([
    supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("reward_redemptions")
      .select("points_cost")
      .eq("user_id", user.id),
    supabase
      .from("xp_events")
      .select("points")
      .eq("user_id", user.id)
      .eq("source", "potion_buy")
  ]);

  const spentPoints = redemptionsData?.reduce((acc, row) => acc + row.points_cost, 0) || 0;
  const potionSpentPoints = potionBuysData?.reduce((acc, row) => acc + Math.abs(row.points), 0) || 0;

  if (progressError) {
    logger.error("Erro ao buscar progresso do usuario", progressError, { userId: user.id });
  }

  if (progressError || !progressData) {
    // Retorna progresso vazio
    return {
      xpTotal: 0,
      level: 1,
      currentStreak: 0,
      bestStreak: 0,
      availablePoints: 0,
      coins: 0,
      lastCheckinDate: null,
      hpCurrent: 100,
      lastHpCalcDate: null,
      className: getHunterClass(1),
    };
  }

  const xpTotal = progressData.xp_total;
  const currentLevel = progressData.level || calculateLevel(xpTotal);
  
  return {
    xpTotal,
    level: currentLevel,
    currentStreak: progressData.current_streak,
    bestStreak: progressData.best_streak,
    availablePoints: Math.max(0, xpTotal - spentPoints - potionSpentPoints),
    coins: progressData.coins || 0,
    lastCheckinDate: progressData.last_checkin_date,
    hpCurrent: progressData.hp_current ?? 100,
    lastHpCalcDate: progressData.last_hp_calc_date,
    className: getHunterClass(currentLevel),
  };
}
