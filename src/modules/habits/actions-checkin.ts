"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/modules/auth/server/session";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import { evaluateBadges } from "@/modules/progression/server/badges";
import { calculateLevel, getHunterClass } from "@/modules/progression/domain/progression";

const XP_PER_CHECKIN = 10;
const COINS_PER_CHECKIN = 5;

export async function checkinHabitAction(habitId: string, dataRef: string): Promise<{ message?: string, error?: string }> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  // 0. Buscar detalhes do Hábito para saber o tipo
  const { data: habitData, error: habitError } = await supabase
    .from("habits")
    .select("frequency")
    .eq("id", habitId)
    .single();

  if (habitError || !habitData) {
    logger.error("Erro ao buscar hábito no check-in", habitError, { habitId });
    throw new Error("Hábito não encontrado.");
  }

  const isNegative = habitData.frequency === "negative";
  const isOnce = habitData.frequency === "once";

  // 1. Inserir o log com tratamento de erro (idempotencia via constraint unique)
  const { error: logError } = await supabase.from("habit_logs").insert({
    user_id: user.id,
    habit_id: habitId,
    data_ref: dataRef,
    status: isNegative ? "failed" : "done",
  });

  if (logError) {
    if (logError.code === "23505") { // Unique violation
      logger.info("Check-in ignorado (ja realizado para o dia)", { habitId, dataRef, userId: user.id });
      return { message: "Esta ação já foi registrada hoje." };
    }
    logger.error("Erro ao registrar habit_log", logError, { habitId, dataRef, userId: user.id });
    throw new Error("Falha ao registrar check-in.");
  }

  // 2. Buscar progresso atual
  const { data: progress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const currentXp = progress?.xp_total || 0;
  const currentCoins = progress?.coins || 0;
  const currentStreak = progress?.current_streak || 0;
  const bestStreak = progress?.best_streak || 0;
  const currentHp = progress?.hp_current ?? 100;
  const lastCheckinDate = progress?.last_checkin_date || null;

  let newXp = currentXp;
  let newCoins = currentCoins;
  let newStreak = currentStreak;
  let newHp = currentHp;

  if (isNegative) {
    // Hábito negativo dá Dano ao invés de XP
    newHp = Math.max(0, currentHp - 10);
    
    // Se HP zerar, reseta ofensiva
    if (newHp === 0 && currentHp > 0) {
      newStreak = 0;
    }
  } else {
    // Hábito normal dá XP e Coins
    newXp = currentXp + XP_PER_CHECKIN;
    newCoins = currentCoins + COINS_PER_CHECKIN;

    // Registrar evento de XP
    const { error: xpError } = await supabase.from("xp_events").insert({
      user_id: user.id,
      source: `checkin_${habitId}`,
      points: XP_PER_CHECKIN,
      metadata: { habit_id: habitId, data_ref: dataRef },
    });

    if (xpError) {
      logger.error("Erro ao registrar XP", xpError, { userId: user.id });
    }

    // Lógica de Ofensiva (Streak)
    if (!lastCheckinDate) {
      newStreak = 1;
    } else {
      const todayDate = new Date(dataRef);
      const lastDate = new Date(lastCheckinDate);
      const utcToday = Date.UTC(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
      const utcLast = Date.UTC(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
      const diffDays = Math.floor((utcToday - utcLast) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    }
  }

  const progressPayload = {
    user_id: user.id,
    xp_total: newXp,
    coins: newCoins,
    current_streak: newStreak,
    best_streak: Math.max(newStreak, bestStreak),
    hp_current: newHp,
    last_checkin_date: isNegative ? lastCheckinDate : dataRef, // Não atualiza last_checkin se for negativo
  };

  // 4. Atualizar progresso do usuario
  const { error: progressError } = await supabase
    .from("user_progress")
    .upsert(progressPayload, { onConflict: "user_id" });

  if (progressError) {
    logger.error("Erro ao atualizar progresso", progressError, { userId: user.id });
  }

  // 5. Se for "once" (Tarefa Única), desativa ou deleta
  if (isOnce) {
    await supabase.from("habits").update({ active: false }).eq("id", habitId);
  }

  // 6. Avaliar Conquistas / Títulos Desbloqueados
  const unlockedTitles = await evaluateBadges(user.id, newXp, newStreak);

  const oldLevel = calculateLevel(currentXp);
  const newLevel = calculateLevel(newXp);
  const leveledUp = newLevel > oldLevel;
  
  const oldClass = getHunterClass(oldLevel);
  const newClass = getHunterClass(newLevel);
  const classChanged = newClass !== oldClass;

  revalidatePath("/habitos");
  revalidatePath("/dashboard");
  revalidatePath("/conquistas");
  
  if (isNegative) {
    if (newHp === 0 && currentHp > 0) {
      return { message: "Você cedeu ao inimigo. -10 HP. SEU HP ZEROU! Ofensiva reiniciada." };
    }
    return { message: "Você cedeu ao inimigo. -10 HP." };
  }

  let returnMessage = isOnce ? "Tarefa única concluída! +10 XP | +5 Gold" : "Sucesso: Quest concluída! +10 XP | +5 Gold";

  if (classChanged) {
    returnMessage = `CLASS UP! Você despertou como: ${newClass}!`;
  } else if (leveledUp) {
    returnMessage = `LEVEL UP! Você alcançou o Nível ${newLevel}!`;
  }

  if (unlockedTitles.length > 0) {
    if (leveledUp || classChanged) {
      returnMessage += ` Título: ${unlockedTitles.join(", ")}`;
    } else {
      returnMessage = `Quest concluída! +10 XP | +5 Gold. Título desbloqueado: ${unlockedTitles.join(", ")}`;
    }
  }

  return { message: returnMessage };
}
