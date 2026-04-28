"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/modules/auth/server/session";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import { evaluateBadges } from "@/modules/progression/server/badges";
import { calculateLevel, getHunterClass } from "@/modules/progression/domain/progression";

export async function completeBossQuestAction(questId: string): Promise<{ message?: string, error?: string }> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  // 1. Busca a user_quest para garantir que ela existe e nao foi completada
  const { data: userQuest, error: uqError } = await supabase
    .from("user_quests")
    .select("id, status, quests(xp_reward)")
    .eq("user_id", user.id)
    .eq("quest_id", questId)
    .eq("status", "in_progress")
    .single();

  if (uqError || !userQuest) {
    logger.error("Erro ao buscar user_quest do boss", uqError, { userId: user.id, questId });
    return { error: "Quest não encontrada ou já concluída." };
  }

  const qData = userQuest.quests as any;
  const xpReward = qData?.xp_reward || 100;
  const coinsReward = Math.floor(xpReward / 2); // Moedas são metade do XP

  // 2. Atualiza a user_quest para completed
  const { error: updateError } = await supabase
    .from("user_quests")
    .update({ 
      status: "completed", 
      completed_at: new Date().toISOString() 
    })
    .eq("id", userQuest.id);

  if (updateError) {
    logger.error("Erro ao completar boss quest", updateError, { userId: user.id });
    return { error: "Falha ao completar a quest." };
  }

  // 3. Registra evento de XP
  await supabase.from("xp_events").insert({
    user_id: user.id,
    source: `boss_quest_${questId}`,
    points: xpReward,
  });

  // 4. Atualiza o progresso do usuário
  const { data: progress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const currentXp = progress?.xp_total || 0;
  const currentCoins = progress?.coins || 0;
  const currentStreak = progress?.current_streak || 0;

  const newXp = currentXp + xpReward;
  const newCoins = currentCoins + coinsReward;

  const { error: progressError } = await supabase
    .from("user_progress")
    .update({
      xp_total: newXp,
      coins: newCoins
    })
    .eq("user_id", user.id);

  if (progressError) {
    logger.error("Erro ao atualizar progresso (Boss)", progressError, { userId: user.id });
  }

  // 5. Avalia badges e classes
  const unlockedTitles = await evaluateBadges(user.id, newXp, currentStreak);
  const oldLevel = calculateLevel(currentXp);
  const newLevel = calculateLevel(newXp);
  const leveledUp = newLevel > oldLevel;
  const oldClass = getHunterClass(oldLevel);
  const newClass = getHunterClass(newLevel);
  const classChanged = newClass !== oldClass;

  revalidatePath("/dashboard");
  revalidatePath("/conquistas");

  let returnMessage = `BOSS DERROTADO! +${xpReward} XP | +${coinsReward} 🪙`;

  if (classChanged) {
    returnMessage = `CLASS UP! Você despertou como: ${newClass}! (+${xpReward} XP)`;
  } else if (leveledUp) {
    returnMessage = `LEVEL UP! Você alcançou o Nível ${newLevel}! (+${xpReward} XP)`;
  }

  if (unlockedTitles.length > 0) {
    returnMessage += ` | Título: ${unlockedTitles.join(", ")}`;
  }

  return { message: returnMessage };
}