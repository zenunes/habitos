"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/modules/auth/server/session";
import { logger } from "@/lib/logger";
import { getUserProgress } from "@/modules/progression/server/queries";

const createRewardSchema = z.object({
  title: z.string().min(3, "O título deve ter no mínimo 3 caracteres.").trim(),
  pointsCost: z.coerce.number().min(1, "O custo deve ser maior que 0."),
});

export type RewardActionState = {
  error?: string;
  message?: string;
};

export async function createRewardAction(
  _previousState: RewardActionState,
  formData: FormData,
): Promise<RewardActionState> {
  const parseResult = createRewardSchema.safeParse({
    title: formData.get("title"),
    pointsCost: formData.get("pointsCost"),
  });

  if (!parseResult.success) {
    return { error: parseResult.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("rewards").insert({
    user_id: user.id,
    title: parseResult.data.title,
    points_cost: parseResult.data.pointsCost,
  });

  if (error) {
    logger.error("Erro ao criar recompensa", error, { userId: user.id });
    return { error: "Não foi possível criar a recompensa no momento." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/loja");
  return { message: "Recompensa adicionada à Loja do Sistema." };
}

export async function redeemRewardAction(
  rewardId: string,
  pointsCost: number
): Promise<{ error?: string; message?: string; isPotion?: boolean; isProfileFrame?: boolean }> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const progress = await getUserProgress();

  if (rewardId === "frame_test") {
    const { data: currentProfile, error: profileError } = await supabase
      .from("profiles")
      .select("profile_frame")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) return { error: "Erro ao aplicar moldura." };
    if (currentProfile?.profile_frame === "rare") {
      return { error: "Você já possui esta moldura." };
    }

    const { error: frameError } = await supabase
      .from("profiles")
      .update({ profile_frame: "rare" })
      .eq("id", user.id);

    if (frameError) return { error: "Erro ao aplicar moldura." };

    revalidatePath("/perfil");
    revalidatePath("/loja");
    return { message: "Moldura de teste aplicada no perfil!", isProfileFrame: true };
  }

  if (progress.coins < pointsCost) {
    return { error: "Moedas insuficientes para comprar esta recompensa." };
  }

  // Verifica se é a Poção de Cura pelo ID especial "potion"
  if (rewardId === "potion") {
    if (progress.hpCurrent >= 100) {
      return { error: "Seu HP já está no máximo." };
    }

    const newHp = Math.min(100, progress.hpCurrent + 30); // Poção cura 30 HP
    const newCoins = progress.coins - pointsCost;

    // 1. Atualiza HP e Moedas do usuário
    const { error: hpError } = await supabase
      .from("user_progress")
      .update({ hp_current: newHp, coins: newCoins })
      .eq("user_id", user.id);

    if (hpError) return { error: "Erro ao comprar poção." };

    revalidatePath("/dashboard");
    revalidatePath("/loja");
    return { message: "Poção consumida! +30 HP restaurado.", isPotion: true };
  }

  const { data: rewardRow, error: rewardError } = await supabase
    .from("rewards")
    .select("id, title, points_cost")
    .eq("id", rewardId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (rewardError || !rewardRow) {
    return { error: "Item não encontrado." };
  }

  const rewardTitle = rewardRow.title;
  const normalizedTitle = rewardTitle.toLowerCase();

  // Comprando item normal da loja
  const newCoins = progress.coins - pointsCost;
  
  // Atualiza moedas do usuário
  const { error: coinsError } = await supabase
    .from("user_progress")
    .update({ coins: newCoins })
    .eq("user_id", user.id);

  if (coinsError) return { error: "Erro ao descontar moedas." };

  if (normalizedTitle.includes("moldura do perfil")) {
    const { data: currentProfile, error: profileError } = await supabase
      .from("profiles")
      .select("profile_frame")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) return { error: "Erro ao aplicar moldura." };
    if (currentProfile?.profile_frame === "rare") {
      return { error: "Você já possui esta moldura." };
    }

    const { error: frameError } = await supabase
      .from("profiles")
      .update({ profile_frame: "rare" })
      .eq("id", user.id);

    if (frameError) return { error: "Erro ao aplicar moldura." };
  }

  const { error } = await supabase.from("reward_redemptions").insert({
    user_id: user.id,
    reward_id: rewardId,
    points_cost: pointsCost,
  });

  if (error) {
    logger.error("Erro ao resgatar recompensa", error, { userId: user.id, rewardId });
    return { error: "Erro ao processar o resgate." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/loja");
  if (normalizedTitle.includes("moldura do perfil")) {
    revalidatePath("/perfil");
    return { message: "Moldura aplicada no perfil!", isProfileFrame: true };
  }
  return { message: "Recompensa resgatada com sucesso!" };
}

export async function deleteRewardAction(rewardId: string) {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("rewards")
    .delete()
    .eq("id", rewardId)
    .eq("user_id", user.id);

  if (error) {
    logger.error("Erro ao excluir recompensa", error, { userId: user.id, rewardId });
    throw new Error("Falha ao excluir recompensa");
  }

  revalidatePath("/dashboard");
  revalidatePath("/loja");
}

export async function consumeRewardAction(redemptionId: string): Promise<{ error?: string; message?: string }> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("reward_redemptions")
    .update({ consumed_at: new Date().toISOString() })
    .eq("id", redemptionId)
    .eq("user_id", user.id)
    .is("consumed_at", null); // Garante que não será consumido duas vezes

  if (error) {
    logger.error("Erro ao consumir recompensa", error, { userId: user.id, redemptionId });
    return { error: "Falha ao utilizar o item." };
  }

  revalidatePath("/loja");
  return { message: "Item consumido com sucesso!" };
}
