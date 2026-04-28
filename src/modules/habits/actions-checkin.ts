"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/modules/auth/server/session";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import { evaluateBadges } from "@/modules/progression/server/badges";
import { calculateLevel, getHunterClass } from "@/modules/progression/domain/progression";

const XP_PER_CHECKIN = 10;

export async function checkinHabitAction(habitId: string, dataRef: string): Promise<{ message?: string, error?: string }> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  // 1. Inserir o log com tratamento de erro (idempotencia via constraint unique)
  const { error: logError } = await supabase.from("habit_logs").insert({
    user_id: user.id,
    habit_id: habitId,
    data_ref: dataRef,
    status: "done",
  });

  if (logError) {
    if (logError.code === "23505") { // Unique violation
      logger.info("Check-in ignorado (ja realizado para o dia)", { habitId, dataRef, userId: user.id });
      return { message: "Sucesso: Quest já concluída hoje." };
    }
    logger.error("Erro ao registrar habit_log", logError, { habitId, dataRef, userId: user.id });
    throw new Error("Falha ao registrar check-in.");
  }

  // 2. Registrar evento de XP
  const { error: xpError } = await supabase.from("xp_events").insert({
    user_id: user.id,
    source: `checkin_${habitId}`,
    points: XP_PER_CHECKIN,
    metadata: { habit_id: habitId, data_ref: dataRef },
  });

  if (xpError) {
    logger.error("Erro ao registrar XP", xpError, { userId: user.id });
  }

  // 3. Buscar progresso atual
  const { data: progress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const currentXp = progress?.xp_total || 0;
  const currentStreak = progress?.current_streak || 0;
  const bestStreak = progress?.best_streak || 0;
  const lastCheckinDate = progress?.last_checkin_date || null;

  const newXp = currentXp + XP_PER_CHECKIN;
  let newStreak = currentStreak;

  if (!lastCheckinDate) {
    // Primeiro check-in do usuário
    newStreak = 1;
  } else {
    // dataRef e lastCheckinDate estão no formato 'YYYY-MM-DD'
    const todayDate = new Date(dataRef);
    const lastDate = new Date(lastCheckinDate);
    
    // Convertendo para UTC para evitar problemas de timezone/horário de verão
    const utcToday = Date.UTC(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
    const utcLast = Date.UTC(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
    
    // Calcula a diferença em dias inteiros
    const diffDays = Math.floor((utcToday - utcLast) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      newStreak += 1; // Dia consecutivo, aumenta a ofensiva
    } else if (diffDays > 1) {
      newStreak = 1; // Perdeu a ofensiva (pulou um dia ou mais)
    }
    // Se diffDays === 0 (mesmo dia), a ofensiva não muda
  }

  const progressPayload = {
    user_id: user.id,
    xp_total: newXp,
    current_streak: newStreak,
    best_streak: Math.max(newStreak, bestStreak),
    last_checkin_date: dataRef,
  };

  // 4. Atualizar progresso do usuario (Upsert)
  const { error: progressError } = await supabase
    .from("user_progress")
    .upsert(progressPayload, { onConflict: "user_id" });

  if (progressError) {
    logger.error("Erro ao atualizar progresso", progressError, { userId: user.id });
  }

  // 5. Avaliar Conquistas / Títulos Desbloqueados
  const unlockedTitles = await evaluateBadges(user.id, newXp, newStreak);

  const oldLevel = calculateLevel(currentXp);
  const newLevel = calculateLevel(newXp);
  const leveledUp = newLevel > oldLevel;
  
  const oldClass = getHunterClass(oldLevel);
  const newClass = getHunterClass(newLevel);
  const classChanged = newClass !== oldClass;

  logger.info("Check-in concluido com sucesso", { userId: user.id, habitId, newXp, unlockedTitles, leveledUp, classChanged });
  revalidatePath("/habitos");
  revalidatePath("/dashboard");
  revalidatePath("/conquistas");
  
  let returnMessage = "Sucesso: Quest concluída! +10 XP";

  if (classChanged) {
    returnMessage = `CLASS UP! Você despertou como: ${newClass}!`;
  } else if (leveledUp) {
    returnMessage = `LEVEL UP! Você alcançou o Nível ${newLevel}!`;
  }

  if (unlockedTitles.length > 0) {
    if (leveledUp || classChanged) {
      returnMessage += ` Título: ${unlockedTitles.join(", ")}`;
    } else {
      returnMessage = `Sucesso: Quest concluída! +10 XP. Título desbloqueado: ${unlockedTitles.join(", ")}`;
    }
  }

  return { message: returnMessage };
}
