"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/modules/auth/server/session";
import { logger } from "@/lib/logger";

const profileSchema = z.object({
  name: z.string().min(2, "O codinome deve ter no mínimo 2 caracteres.").max(30, "Codinome muito longo."),
  focus: z.string().min(2, "O foco deve ter no mínimo 2 caracteres.").max(60, "Foco muito longo."),
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
    focus: formData.get("focus"),
  });

  if (!parseResult.success) {
    return { error: parseResult.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("profiles")
    .upsert(
      { id: user.id, name: parseResult.data.name, focus: parseResult.data.focus },
      { onConflict: "id" },
    );

  if (error) {
    logger.error("Erro ao atualizar perfil", error, { userId: user.id });
    return { error: "Falha ao atualizar o perfil. Tente novamente." };
  }

  logger.info("Perfil atualizado", { userId: user.id, name: parseResult.data.name });
  
  revalidatePath("/dashboard");
  revalidatePath("/perfil");
  return { message: "Perfil atualizado com sucesso!" };
}
