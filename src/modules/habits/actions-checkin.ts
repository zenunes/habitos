"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/modules/auth/server/session";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";

const XP_PER_CHECKIN = 10;

export async function checkinHabitAction(habitId: string, dataRef: string) {
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
    .single();

  const currentXp = progress?.xp_total || 0;
  const currentStreak = progress?.current_streak || 0;
  const bestStreak = progress?.best_streak || 0;

  const newXp = currentXp + XP_PER_CHECKIN;
  // Apenas simulando um acrescimo de streak se for o primeiro do dia
  // Em um sistema real e robusto, isso precisa considerar as datas do ultimo check-in e fuso horario
  const newStreak = currentStreak + 1; 

  const progressPayload = {
    user_id: user.id,
    xp_total: newXp,
    current_streak: newStreak,
    best_streak: Math.max(newStreak, bestStreak),
  };

  // 4. Atualizar progresso do usuario (Upsert)
  const { error: progressError } = await supabase
    .from("user_progress")
    .upsert(progressPayload, { onConflict: "user_id" });

  if (progressError) {
    logger.error("Erro ao atualizar progresso", progressError, { userId: user.id });
  }

  logger.info("Check-in concluido com sucesso", { userId: user.id, habitId, newXp });
  revalidatePath("/habitos");
  revalidatePath("/dashboard");
  return { message: "Sucesso: Quest concluída! +10 XP" };
}
