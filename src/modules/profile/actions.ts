"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/modules/auth/server/session";
import { logger } from "@/lib/logger";

const profileSchema = z.object({
  name: z.string().min(2, "O codinome deve ter no mínimo 2 caracteres.").max(30, "Codinome muito longo."),
});

export type ProfileActionState = {
  error?: string;
  message?: string;
};

export async function updateProfileAction(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const parseResult = profileSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parseResult.success) {
    return { error: parseResult.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("profiles")
    .update({ name: parseResult.data.name })
    .eq("id", user.id);

  if (error) {
    logger.error("Erro ao atualizar perfil", error, { userId: user.id });
    return { error: "Falha ao atualizar o perfil. Tente novamente." };
  }

  logger.info("Perfil atualizado", { userId: user.id, name: parseResult.data.name });
  
  revalidatePath("/dashboard");
  revalidatePath("/perfil");
  return { message: "Perfil atualizado com sucesso!" };
}
