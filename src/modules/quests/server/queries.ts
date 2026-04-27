import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/modules/auth/server/session";
import { logger } from "@/lib/logger";
import { Quest } from "../domain/quest";

export async function getActiveQuests(): Promise<Quest[]> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("quests")
    .select(`
      id,
      title,
      rule,
      xp_reward,
      active,
      user_quests!left (
        status
      )
    `)
    .eq("active", true)
    .eq("user_quests.user_id", user.id);

  if (error) {
    logger.error("Erro ao buscar quests ativas", error, { userId: user.id });
    return [];
  }

  return data.map((row: Record<string, unknown>) => {
    const userQuest = Array.isArray(row.user_quests) ? row.user_quests[0] : row.user_quests;
    const userQuestStatus = userQuest && typeof userQuest === "object" ? (userQuest as Record<string, unknown>).status : undefined;
    const rule = row.rule && typeof row.rule === "object" ? (row.rule as Record<string, unknown>) : {};

    return {
      id: row.id as string,
      title: row.title as string,
      description: (rule.description as string) || "Quest sem descricao",
      xpReward: row.xp_reward as number,
      completed: userQuestStatus === "completed",
    };
  });
}
