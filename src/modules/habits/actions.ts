"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/modules/auth/server/session";
import { logger } from "@/lib/logger";

const habitSchema = z.object({
  title: z.string().min(2, "O titulo precisa ter pelo menos 2 caracteres.").max(50, "O titulo esta muito longo."),
  description: z.string().max(200, "A descricao esta muito longa.").optional().or(z.literal("")),
  frequency: z.enum(["daily", "weekdays", "custom"]).default("daily"),
});

export type HabitActionState = {
  message?: string;
  error?: string;
};

export async function createHabitAction(
  _previousState: HabitActionState,
  formData: FormData,
): Promise<HabitActionState> {
  const user = await requireUser();
  
  const parseResult = habitSchema.safeParse({
    title: formData.get("title")?.toString().trim(),
    description: formData.get("description")?.toString().trim(),
    frequency: formData.get("frequency")?.toString(),
  });

  if (!parseResult.success) {
    logger.warn("Tentativa de criar habito com dados invalidos", { issues: parseResult.error.issues, userId: user.id });
    return {
      error: parseResult.error.issues[0]?.message ?? "Dados invalidos.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("habits").insert({
    user_id: user.id,
    title: parseResult.data.title,
    description: parseResult.data.description || null,
    frequency: parseResult.data.frequency,
    active: true,
  });

  if (error) {
    logger.error("Falha ao criar habito no banco", error, { userId: user.id });
    return { error: `Nao foi possivel salvar o habito. Detalhe: ${error.message}` };
  }

  logger.info("Habito criado com sucesso", { userId: user.id });
  revalidatePath("/habitos");
  revalidatePath("/dashboard");
  return { message: "Habito criado com sucesso!" };
}

export async function toggleHabitStatusAction(habitId: string, currentStatus: boolean) {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("habits")
    .update({ active: !currentStatus })
    .eq("id", habitId)
    .eq("user_id", user.id);

  if (error) {
    logger.error("Falha ao alterar status do habito", error, { userId: user.id, habitId });
    throw new Error("Nao foi possivel alterar o status do habito.");
  }

  logger.info("Status do habito alterado", { userId: user.id, habitId, newStatus: !currentStatus });
  revalidatePath("/habitos");
}

export async function deleteHabitAction(habitId: string) {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("habits")
    .delete()
    .eq("id", habitId)
    .eq("user_id", user.id);

  if (error) {
    logger.error("Falha ao excluir habito", error, { userId: user.id, habitId });
    throw new Error("Nao foi possivel excluir o habito.");
  }

  logger.info("Habito excluido", { userId: user.id, habitId });
  revalidatePath("/habitos");
}
