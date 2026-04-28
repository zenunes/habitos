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
      redeemed_at,
      consumed_at,
      rewards (
        title
      )
    `)
    .eq("user_id", user.id)
    .order("redeemed_at", { ascending: false });

  if (error) {
    logger.error("Erro ao buscar historico de resgates", error, { userId: user.id });
    return [];
  }

  return (data || []).map((row) => {
    const r = row as Record<string, unknown>;
    const rewards = (r.rewards ?? null) as Record<string, unknown> | null;
    const title = rewards && typeof rewards.title === "string" ? rewards.title : "Recompensa Excluída";

    return {
      id: String(r.id ?? ""),
      title,
      pointsCost: typeof r.points_cost === "number" ? r.points_cost : Number(r.points_cost ?? 0),
      redeemedAt: String(r.redeemed_at ?? ""),
      consumedAt: r.consumed_at ? String(r.consumed_at) : null,
    };
  });
}
