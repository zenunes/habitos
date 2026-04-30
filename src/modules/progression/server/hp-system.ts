import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/modules/auth/server/session";
import { logger } from "@/lib/logger";
import { getTodayDateStr } from "@/lib/date-utils";

function addDays(dateStr: string, deltaDays: number) {
  const base = new Date(`${dateStr}T12:00:00Z`);
  base.setUTCDate(base.getUTCDate() + deltaDays);
  return base.toISOString().slice(0, 10);
}

function getWeekStart(dateStr: string) {
  const base = new Date(`${dateStr}T12:00:00Z`);
  const day = base.getUTCDay();
  const diffToMonday = (day + 6) % 7;
  const start = new Date(base);
  start.setUTCDate(base.getUTCDate() - diffToMonday);
  return start.toISOString().slice(0, 10);
}

/**
 * Calcula se o usuário perdeu HP desde o último login.
 * Se houver dias não logados/missões não cumpridas desde o last_hp_calc_date, 
 * o HP é subtraído e a tabela user_progress é atualizada.
 * 
 * Penalidade: -10 HP por missão ativa não concluída no dia anterior.
 */
export async function evaluateDailyHP() {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const todayStr = getTodayDateStr();

  const { data: progress } = await supabase
    .from("user_progress")
    .select("hp_current, last_hp_calc_date, current_streak")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!progress) return; // Nada a fazer se não há progresso ainda

  const currentHp = progress.hp_current ?? 100;
  const lastCalcDate = progress.last_hp_calc_date;

  // Se já calculou o HP de hoje, retorna
  if (lastCalcDate === todayStr) return;

  // Se nunca calculou, apenas marca como hoje (dia 1 do usuário)
  if (!lastCalcDate) {
    await supabase
      .from("user_progress")
      .update({ last_hp_calc_date: todayStr })
      .eq("user_id", user.id);
    return;
  }

  // Calcula a diferença de dias
  const todayDate = new Date(`${todayStr}T12:00:00Z`);
  const lastDate = new Date(`${lastCalcDate}T12:00:00Z`);
  const utcToday = Date.UTC(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
  const utcLast = Date.UTC(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
  const diffDays = Math.floor((utcToday - utcLast) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return;

  // Se chegou aqui, passou 1 dia ou mais desde o último cálculo.
  // Vamos simplificar: Para cada dia perdido, verificamos as missões ativas e tiramos 10 HP por cada uma.
  // (Para não ficar muito pesado, se passou mais de 1 dia, tiramos um valor fixo de punição máxima, ex: 50 HP por dia inteiro perdido)
  
  let hpDamage = 0;
  
  if (diffDays > 1) {
    // Ficou dias sem logar
    hpDamage = (diffDays - 1) * 30; // -30 HP por dia completamente ausente
  }

  // Avalia especificamente as missões perdidas ONTEM
  const yesterdayStr = addDays(todayStr, -1);
  const yesterdayDate = new Date(`${yesterdayStr}T12:00:00Z`);

  // Busca hábitos ativos e logs de ontem
  const [{ data: habits }, { data: logs }] = await Promise.all([
    supabase.from("habits").select("id, frequency").eq("user_id", user.id).eq("active", true),
    supabase
      .from("habit_logs")
      .select("habit_id")
      .eq("user_id", user.id)
      .eq("status", "done")
      .eq("data_ref", yesterdayStr),
  ]);

  if (habits) {
    const completedIds = new Set(logs?.map(l => l.habit_id) || []);
    const isYesterdayWeekend = yesterdayDate.getUTCDay() === 0 || yesterdayDate.getUTCDay() === 6;

    let uncompletedCount = 0;
    habits.forEach(h => {
      if (h.frequency !== "daily" && h.frequency !== "weekdays") return;
      // Ignora missões de dias úteis se ontem foi fds
      if (isYesterdayWeekend && h.frequency === 'weekdays') return;
      
      if (!completedIds.has(h.id)) {
        uncompletedCount++;
      }
    });

    hpDamage += uncompletedCount * 10; // -10 HP por missão de ontem não feita
  }

  const weekStart = getWeekStart(todayStr);
  if (lastCalcDate < weekStart) {
    const lastWeekStart = addDays(weekStart, -7);
    const lastWeekEnd = addDays(weekStart, -1);

    const [{ data: weeklyHabits }, { data: weeklyLogs }] = await Promise.all([
      supabase
        .from("habits")
        .select("id, target_per_week")
        .eq("user_id", user.id)
        .eq("active", true)
        .eq("frequency", "weekly"),
      supabase
        .from("habit_logs")
        .select("habit_id")
        .eq("user_id", user.id)
        .eq("status", "done")
        .gte("data_ref", lastWeekStart)
        .lte("data_ref", lastWeekEnd),
    ]);

    const weeklyCountMap: Record<string, number> = {};
    for (const row of weeklyLogs || []) {
      weeklyCountMap[row.habit_id] = (weeklyCountMap[row.habit_id] || 0) + 1;
    }

    let weeklyMissingTotal = 0;
    for (const habit of weeklyHabits || []) {
      const target = typeof habit.target_per_week === "number" ? habit.target_per_week : null;
      if (!target || target <= 0) continue;
      const count = weeklyCountMap[habit.id] || 0;
      weeklyMissingTotal += Math.max(0, target - count);
    }

    if (weeklyMissingTotal > 0) {
      hpDamage += weeklyMissingTotal * 10;
      logger.info("Weekly goals missed. HP damage applied.", {
        userId: user.id,
        weekStart: lastWeekStart,
        weekEnd: lastWeekEnd,
        missing: weeklyMissingTotal,
      });
    }
  }

  if (hpDamage > 0) {
    let newHp = Math.max(0, currentHp - hpDamage);
    let streakToUpdate = progress.current_streak;

    // Se HP chegar a 0, punição severa (ex: perde toda a ofensiva) e recupera 100 HP
    if (newHp === 0) {
      streakToUpdate = 0;
      newHp = 100;
      logger.info("Player HP reached 0. Penalties applied.", { userId: user.id });
    }

    await supabase
      .from("user_progress")
      .update({ 
        hp_current: newHp, 
        last_hp_calc_date: todayStr,
        current_streak: streakToUpdate
      })
      .eq("user_id", user.id);
      
    logger.info("HP calculated and damage applied", { userId: user.id, damage: hpDamage, newHp });
  } else {
    // Não sofreu dano, apenas atualiza a data
    await supabase
      .from("user_progress")
      .update({ last_hp_calc_date: todayStr })
      .eq("user_id", user.id);
  }
}
