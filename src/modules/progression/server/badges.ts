import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import { calculateLevel } from "../domain/progression";
import { requireUser } from "@/modules/auth/server/session";

export type BadgeInfo = {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  grantedAt?: string;
};

export async function getUserBadges(): Promise<BadgeInfo[]> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data: allBadges, error: badgesError } = await supabase.from("badges").select("*");
  if (badgesError || !allBadges) {
    logger.error("Erro ao buscar badges globais", badgesError);
    return [];
  }

  const { data: userBadges, error: userBadgesError } = await supabase
    .from("user_badges")
    .select("badge_id, granted_at")
    .eq("user_id", user.id);
  
  if (userBadgesError) {
    logger.error("Erro ao buscar badges do usuario", userBadgesError);
    return [];
  }

  const userBadgeMap = new Map(userBadges?.map(ub => [ub.badge_id, ub.granted_at]) || []);

  return allBadges.map((badge) => {
    const criteria = (badge.criteria ?? {}) as Record<string, unknown>;
    const description = typeof criteria.description === "string" ? criteria.description : "";
    const icon = typeof criteria.icon === "string" ? criteria.icon : "medal";
    const color = typeof criteria.color === "string" ? criteria.color : "text-slate-400";
    return {
      id: badge.id,
      code: badge.code,
      title: badge.title,
      description,
      icon,
      color,
      unlocked: userBadgeMap.has(badge.id),
      grantedAt: userBadgeMap.get(badge.id),
    };
  });
}

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

    const criteria = (badge.criteria ?? {}) as Record<string, unknown>;
    const type = typeof criteria.type === "string" ? criteria.type : "";
    const target = typeof criteria.target === "number" ? criteria.target : 0;
    let qualifies = false;

    if (type === "level" && currentLevel >= target) {
      qualifies = true;
    } else if (type === "streak" && currentStreak >= target) {
      qualifies = true;
    } else if (type === "checkin" && newXpTotal > 0) {
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
