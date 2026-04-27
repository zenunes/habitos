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
): Promise<{ error?: string; message?: string }> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const progress = await getUserProgress();
  if (progress.availablePoints < pointsCost) {
    return { error: "Pontos insuficientes para resgatar esta recompensa." };
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
