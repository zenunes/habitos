import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/modules/auth/server/session";
import { logger } from "@/lib/logger";

export type UserProfile = {
  id: string;
  name: string;
};

export async function getUserProfile(): Promise<UserProfile | null> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, name")
    .eq("id", user.id)
    .single();

  if (error) {
    logger.error("Erro ao buscar perfil do usuario", error, { userId: user.id });
    return null;
  }

  return data;
}
