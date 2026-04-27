import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/modules/auth/server/session";

export type HabitListItem = {
  id: string;
  title: string;
  description: string | null;
  frequency: string;
  active: boolean;
  checkedToday: boolean;
};

export async function getHabitsWithTodayStatus(): Promise<HabitListItem[]> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const today = new Date().toISOString().slice(0, 10);

  const [{ data: habits, error: habitsError }, { data: logs, error: logsError }] =
    await Promise.all([
      supabase
        .from("habits")
        .select("id, title, description, frequency, active")
        .order("created_at", { ascending: false }),
      supabase
        .from("habit_logs")
        .select("habit_id")
        .eq("user_id", user.id)
        .eq("data_ref", today),
    ]);

  if (habitsError) {
    throw new Error("Nao foi possivel carregar os habitos.");
  }

  if (logsError) {
    throw new Error("Nao foi possivel carregar os check-ins de hoje.");
  }

  const checkedTodayIds = new Set((logs ?? []).map((log) => log.habit_id));

  return (habits ?? []).map((habit) => ({
    ...habit,
    checkedToday: checkedTodayIds.has(habit.id),
  }));
}
