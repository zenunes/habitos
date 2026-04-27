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
    active: row.active,
  }));
}
