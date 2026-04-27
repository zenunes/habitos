import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/modules/auth/server/session";

export type DashboardSummary = {
  xpTotal: number;
  level: number;
  currentStreak: number;
  bestStreak: number;
  activeHabits: number;
  doneToday: number;
};

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const today = new Date().toISOString().slice(0, 10);

  const [
    { data: progress, error: progressError },
    { count: activeHabitsCount, error: activeHabitsError },
    { count: doneTodayCount, error: doneTodayError },
  ] = await Promise.all([
    supabase
      .from("user_progress")
      .select("xp_total, level, current_streak, best_streak")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("habits")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("active", true),
    supabase
      .from("habit_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("data_ref", today),
  ]);

  if (progressError || activeHabitsError || doneTodayError) {
    throw new Error("Nao foi possivel carregar o resumo do dashboard.");
  }

  return {
    xpTotal: progress?.xp_total ?? 0,
    level: progress?.level ?? 1,
    currentStreak: progress?.current_streak ?? 0,
    bestStreak: progress?.best_streak ?? 0,
    activeHabits: activeHabitsCount ?? 0,
    doneToday: doneTodayCount ?? 0,
  };
}
