import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/modules/auth/server/session";
import { logger } from "@/lib/logger";
import { UserProgress, calculateLevel } from "../domain/progression";

export async function getUserProgress(): Promise<UserProgress> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    if (error.code !== "PGRST116") { // Nao e "Row not found"
      logger.error("Erro ao buscar progresso do usuario", error, { userId: user.id });
    }
    // Retorna progresso vazio
    return {
      xpTotal: 0,
      level: 1,
      currentStreak: 0,
      bestStreak: 0,
    };
  }

  return {
    xpTotal: data.xp_total,
    level: data.level || calculateLevel(data.xp_total),
    currentStreak: data.current_streak,
    bestStreak: data.best_streak,
  };
}
