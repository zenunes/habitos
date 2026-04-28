import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/modules/auth/server/session";
import { logger } from "@/lib/logger";
import { UserProgress, calculateLevel } from "../domain/progression";

export async function getUserProgress(): Promise<UserProgress> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const [{ data: progressData, error: progressError }, { data: redemptionsData }] = await Promise.all([
    supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("reward_redemptions")
      .select("points_cost")
      .eq("user_id", user.id)
  ]);

  const spentPoints = redemptionsData?.reduce((acc, row) => acc + row.points_cost, 0) || 0;

  if (progressError) {
    if (progressError.code !== "PGRST116") { // Nao e "Row not found"
      logger.error("Erro ao buscar progresso do usuario", progressError, { userId: user.id });
    }
    // Retorna progresso vazio
    return {
      xpTotal: 0,
      level: 1,
      currentStreak: 0,
      bestStreak: 0,
      availablePoints: 0,
      lastCheckinDate: null,
    };
  }

  const xpTotal = progressData.xp_total;
  return {
    xpTotal,
    level: progressData.level || calculateLevel(xpTotal),
    currentStreak: progressData.current_streak,
    bestStreak: progressData.best_streak,
    availablePoints: Math.max(0, xpTotal - spentPoints),
    lastCheckinDate: progressData.last_checkin_date,
  };
}
