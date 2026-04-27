"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/modules/auth/server/session";

const createHabitSchema = z.object({
  title: z.string().min(2, "Titulo muito curto.").max(80).trim(),
  description: z.string().max(180).trim().optional().or(z.literal("")),
  frequency: z.enum(["daily", "weekdays", "custom"]),
});

const idSchema = z.object({
  habitId: z.uuid("Identificador de habito invalido."),
});

export async function createHabitAction(formData: FormData) {
  const parsed = createHabitSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    frequency: formData.get("frequency"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Dados invalidos.");
  }

  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("habits").insert({
    user_id: user.id,
    title: parsed.data.title,
    description: parsed.data.description || null,
    frequency: parsed.data.frequency,
  });

  if (error) {
    throw new Error("Nao foi possivel criar o habito.");
  }

  revalidatePath("/habitos");
  revalidatePath("/dashboard");
}

export async function toggleHabitAction(formData: FormData) {
  const parsed = idSchema.safeParse({
    habitId: formData.get("habitId"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Habito invalido.");
  }

  const supabase = await createSupabaseServerClient();

  const { data, error: loadError } = await supabase
    .from("habits")
    .select("id, active")
    .eq("id", parsed.data.habitId)
    .single();

  if (loadError || !data) {
    throw new Error("Habito nao encontrado.");
  }

  const { error } = await supabase
    .from("habits")
    .update({ active: !data.active })
    .eq("id", data.id);

  if (error) {
    throw new Error("Nao foi possivel atualizar o habito.");
  }

  revalidatePath("/habitos");
  revalidatePath("/dashboard");
}

export async function checkinHabitAction(formData: FormData) {
  const parsed = idSchema.safeParse({
    habitId: formData.get("habitId"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Habito invalido.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("complete_habit_checkin", {
    p_habit_id: parsed.data.habitId,
  });

  if (error) {
    throw new Error("Nao foi possivel registrar o check-in.");
  }

  revalidatePath("/habitos");
  revalidatePath("/dashboard");
}
