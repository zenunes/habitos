import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import { calculateLevel } from "../domain/progression";

export async function evaluateBadges(userId: string, newXpTotal: number, currentStreak: number): Promise<string[]> {
  const supabase = await createSupabaseServerClient();
  const unlockedTitles: string[] = [];
  const currentLevel = calculateLevel(newXpTotal);

  // 1. Busca todas as badges globais
  const { data: allBadges, error: badgesError } = await supabase.from("badges").select("*");
  if (badgesError || !allBadges) {
    logger.error("Erro ao buscar badges globais", badgesError);
    return [];
  }

  // 2. Busca as badges que o usuário já possui
  const { data: userBadges, error: userBadgesError } = await supabase
    .from("user_badges")
    .select("badge_id")
    .eq("user_id", userId);
  
  if (userBadgesError) {
    logger.error("Erro ao buscar badges do usuario", userBadgesError);
    return [];
  }

  const existingBadgeIds = new Set(userBadges?.map(ub => ub.badge_id) || []);

  // 3. Avalia os critérios para cada badge não adquirida
  for (const badge of allBadges) {
    if (existingBadgeIds.has(badge.id)) continue;

    const criteria = badge.criteria as any;
    let qualifies = false;

    if (criteria.type === "level" && currentLevel >= criteria.target) {
      qualifies = true;
    } else if (criteria.type === "streak" && currentStreak >= criteria.target) {
      qualifies = true;
    }

    if (qualifies) {
      const { error: insertError } = await supabase.from("user_badges").insert({
        user_id: userId,
        badge_id: badge.id
      });

      if (!insertError) {
        unlockedTitles.push(badge.title);
        logger.info("Nova badge desbloqueada", { userId, badgeCode: badge.code });
      } else {
        logger.error("Erro ao inserir user_badge", insertError, { userId, badgeId: badge.id });
      }
    }
  }

  return unlockedTitles;
}
