import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/modules/auth/server/session";
import { logger } from "@/lib/logger";
import { Habit } from "../domain/habit";

export async function getActiveHabits(): Promise<Habit[]> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    logger.error("Erro ao buscar habitos", error, { userId: user.id });
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description || "",
    frequency: row.frequency,
    targetPerWeek: row.target_per_week ?? null,
    active: row.active,
  }));
}

export async function getTodayHabitLogs(dateRef: string): Promise<{habit_id: string}[]> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("habit_logs")
    .select("habit_id")
    .eq("user_id", user.id)
    .eq("data_ref", dateRef);

  if (error) {
    logger.error("Erro ao buscar logs de habitos de hoje", error, { userId: user.id, dateRef });
    return [];
  }

  return data || [];
}

export type HabitLogSummary = {
  date: string;
  count: number;
};

export async function getHabitLogsSummary(days: number = 120): Promise<HabitLogSummary[]> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  // Calcula a data limite (há X dias atrás)
  const limitDate = new Date();
  limitDate.setDate(limitDate.getDate() - days);
  const limitDateStr = limitDate.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("habit_logs")
    .select("data_ref")
    .eq("user_id", user.id)
    .gte("data_ref", limitDateStr)
    .order("data_ref", { ascending: true });

  if (error) {
    logger.error("Erro ao buscar histórico de logs", error, { userId: user.id });
    return [];
  }

  // Agrupa e conta
  const summaryMap: Record<string, number> = {};
  for (const row of data || []) {
    const date = row.data_ref;
    summaryMap[date] = (summaryMap[date] || 0) + 1;
  }

  return Object.entries(summaryMap).map(([date, count]) => ({
    date,
    count,
  }));
}

export type DailyCompletionCount = {
  date: string;
  count: number;
};

export async function getDailyCompletionCountsByRange(
  startDateStr: string,
  endDateStr: string,
): Promise<DailyCompletionCount[]> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("habit_logs")
    .select("data_ref")
    .eq("user_id", user.id)
    .eq("status", "done")
    .gte("data_ref", startDateStr)
    .lte("data_ref", endDateStr)
    .order("data_ref", { ascending: true });

  if (error) {
    logger.error("Erro ao buscar histórico de conclusão por período", error, {
      userId: user.id,
      startDateStr,
      endDateStr,
    });
    return [];
  }

  const summaryMap: Record<string, number> = {};
  for (const row of data || []) {
    const date = row.data_ref;
    summaryMap[date] = (summaryMap[date] || 0) + 1;
  }

  return Object.entries(summaryMap).map(([date, count]) => ({ date, count }));
}

export type HabitWeeklyCount = {
  habitId: string;
  count: number;
};

function getWeekRange(dateStr: string) {
  const base = new Date(`${dateStr}T12:00:00Z`);
  const day = base.getUTCDay();
  const diffToMonday = (day + 6) % 7;
  const start = new Date(base);
  start.setUTCDate(base.getUTCDate() - diffToMonday);
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

export async function getWeeklyHabitCounts(dateRef: string): Promise<HabitWeeklyCount[]> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { start, end } = getWeekRange(dateRef);

  const { data, error } = await supabase
    .from("habit_logs")
    .select("habit_id")
    .eq("user_id", user.id)
    .eq("status", "done")
    .gte("data_ref", start)
    .lte("data_ref", end);

  if (error) {
    logger.error("Erro ao buscar contagem semanal de hábitos", error, { userId: user.id, start, end });
    return [];
  }

  const summaryMap: Record<string, number> = {};
  for (const row of data || []) {
    summaryMap[row.habit_id] = (summaryMap[row.habit_id] || 0) + 1;
  }

  return Object.entries(summaryMap).map(([habitId, count]) => ({ habitId, count }));
}
