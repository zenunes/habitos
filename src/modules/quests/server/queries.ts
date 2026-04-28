import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/modules/auth/server/session";
import { logger } from "@/lib/logger";
import { Quest } from "../domain/quest";
import { getTodayDateStr } from "@/lib/date-utils";

export async function getActiveQuests(): Promise<Quest[]> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const todayStr = getTodayDateStr();

  // 1. Tenta buscar uma "user_quests" ativa (que tenha starts_at hoje)
  const { data: userQuests, error: userQuestsError } = await supabase
    .from("user_quests")
    .select(`
      status,
      quest_id,
      starts_at,
      quests (
        id, title, rule, xp_reward, code
      )
    `)
    .eq("user_id", user.id)
    .gte("starts_at", `${todayStr}T00:00:00Z`)
    .lte("starts_at", `${todayStr}T23:59:59Z`)
    .order("starts_at", { ascending: false })
    .limit(1);

  let dailyBossQuest = userQuests && userQuests.length > 0 ? userQuests[0] : null;

  // 2. Se o usuário NÃO tiver um Boss para hoje, vamos sortear um e criar
  if (!dailyBossQuest) {
    const { data: allBosses, error: bossesError } = await supabase
      .from("quests")
      .select("*")
      .eq("active", true);

    if (!bossesError && allBosses && allBosses.length > 0) {
      // Sorteia um boss
      const randomBoss = allBosses[Math.floor(Math.random() * allBosses.length)];

      // Insere na user_quests para este usuário, travando para o dia de hoje
      const { data: newAssignedBoss, error: insertError } = await supabase
        .from("user_quests")
        .insert({
          user_id: user.id,
          quest_id: randomBoss.id,
          status: "in_progress",
          progress: {},
          starts_at: new Date().toISOString()
        })
        .select(`
          status,
          quest_id,
          starts_at,
          quests (
            id, title, rule, xp_reward, code
          )
        `)
        .single();

      if (!insertError && newAssignedBoss) {
        dailyBossQuest = newAssignedBoss;
      }
    }
  }

  if (!dailyBossQuest) {
    return []; // Se por algum motivo falhar, retorna vazio
  }

  // 3. Formata para retornar o Boss do Dia
  const qData = dailyBossQuest.quests as any;
  const rule = qData.rule && typeof qData.rule === "object" ? qData.rule : {};

  return [{
    id: qData.id,
    code: qData.code,
    title: qData.title,
    description: rule.description || "Enfrente esse desafio épico hoje.",
    xpReward: qData.xp_reward,
    completed: dailyBossQuest.status === "completed",
  }];
}
