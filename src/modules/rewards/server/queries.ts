import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/modules/auth/server/session";
import { logger } from "@/lib/logger";
import { Reward } from "../domain/reward";

export async function getUserRewards(): Promise<Reward[]> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("rewards")
    .select("*")
    .eq("user_id", user.id)
    .eq("active", true)
    .order("created_at", { ascending: true });

  if (error) {
    logger.error("Erro ao buscar recompensas", error, { userId: user.id });
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    pointsCost: row.points_cost,
    available: row.active,
  }));
}

export type RedeemedItem = {
  id: string;
  title: string;
  pointsCost: number;
  redeemedAt: string;
  consumedAt: string | null;
};

export async function getUserRedeemedRewards(): Promise<RedeemedItem[]> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("reward_redemptions")
    .select(`
      id,
      points_cost,
      created_at,
      consumed_at,
      rewards (
        title
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    logger.error("Erro ao buscar historico de resgates", error, { userId: user.id });
    return [];
  }

  return data.map((row: any) => ({
    id: row.id,
    title: row.rewards?.title || "Recompensa Excluída",
    pointsCost: row.points_cost,
    redeemedAt: row.created_at,
    consumedAt: row.consumed_at || null,
  }));
}
