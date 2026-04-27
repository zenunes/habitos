"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { publicEnv } from "@/config/env";
import { logger } from "@/lib/logger";

const authSchema = z.object({
  email: z.email("Informe um e-mail valido.").trim(),
  password: z
    .string()
    .min(8, "A senha precisa ter no minimo 8 caracteres.")
    .trim(),
});

export type AuthActionState = {
  message?: string;
  error?: string;
};

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parseResult = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parseResult.success) {
    logger.warn("Tentativa de login com dados invalidos", { issues: parseResult.error.issues });
    return {
      error: parseResult.error.issues[0]?.message ?? "Dados de login invalidos.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parseResult.data);

  if (error) {
    logger.error("Falha ao autenticar usuario", error, { email: parseResult.data.email });
    return { error: "Nao foi possivel autenticar. Verifique suas credenciais." };
  }

  logger.info("Usuario autenticado com sucesso", { email: parseResult.data.email });
  redirect("/dashboard");
}

export async function signupAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parseResult = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parseResult.success) {
    logger.warn("Tentativa de cadastro com dados invalidos", { issues: parseResult.error.issues });
    return {
      error:
        parseResult.error.issues[0]?.message ??
        "Dados de cadastro invalidos.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp(parseResult.data);

  if (error) {
    logger.error("Falha ao cadastrar usuario", error, { email: parseResult.data.email });
    return { error: "Nao foi possivel concluir o cadastro." };
  }

  logger.info("Usuario cadastrado com sucesso", { email: parseResult.data.email });
  return {
    message:
      "Cadastro iniciado com sucesso. Se sua instancia exigir confirmacao, valide o e-mail para continuar.",
  };
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  logger.info("Usuario fez logout");
  redirect("/login");
}

export async function forgotPasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = formData.get("email")?.toString();

  if (!email) {
    logger.warn("Tentativa de recuperacao de senha sem e-mail");
    return { error: "Informe um e-mail valido." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${publicEnv.appUrl}/auth/callback?next=/recuperar-senha/nova-senha`,
  });

  if (error) {
    logger.error("Erro ao solicitar recuperacao de senha", error, { email });
    return { error: "Nao foi possivel solicitar a recuperacao de senha." };
  }

  logger.info("Recuperacao de senha solicitada", { email });
  return { message: "Se o e-mail existir, voce recebera as instrucoes para redefinir sua senha." };
}

export async function resetPasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = formData.get("password")?.toString();

  if (!password || password.length < 8) {
    return { error: "A senha precisa ter no minimo 8 caracteres." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    logger.error("Erro ao redefinir senha", error);
    return { error: "Nao foi possivel redefinir a senha. O link pode ter expirado." };
  }

  logger.info("Senha redefinida com sucesso");
  redirect("/login");
}
