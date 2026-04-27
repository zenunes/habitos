"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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
    return {
      error: parseResult.error.issues[0]?.message ?? "Dados de login invalidos.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parseResult.data);

  if (error) {
    return { error: "Nao foi possivel autenticar. Verifique suas credenciais." };
  }

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
    return {
      error:
        parseResult.error.issues[0]?.message ??
        "Dados de cadastro invalidos.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp(parseResult.data);

  if (error) {
    return { error: "Nao foi possivel concluir o cadastro." };
  }

  return {
    message:
      "Cadastro iniciado com sucesso. Se sua instancia exigir confirmacao, valide o e-mail para continuar.",
  };
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
