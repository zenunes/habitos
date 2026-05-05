/**
 * Retorna a data atual no formato YYYY-MM-DD ajustada para o fuso horário oficial (America/Sao_Paulo).
 * Impede que missões e streaks resetem durante a noite no Brasil se o servidor em nuvem estiver na Europa/EUA.
 */
const DEFAULT_TIMEZONE = "America/Sao_Paulo";
const SAO_PAULO_OFFSET = "-03:00";

export function formatDateStrInTimezone(date: Date, timeZone: string = DEFAULT_TIMEZONE): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function getTodayDateStr(timeZone: string = DEFAULT_TIMEZONE): string {
  return formatDateStrInTimezone(new Date(), timeZone);
}

export function getWeekdayIndexInTimezone(date: Date, timeZone: string = DEFAULT_TIMEZONE): number {
  const weekday = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(date);
  const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return map[weekday] ?? 0;
}

export function addDaysToDateStr(dateStr: string, deltaDays: number, timeZone: string = DEFAULT_TIMEZONE): string {
  const base = new Date(`${dateStr}T12:00:00${SAO_PAULO_OFFSET}`);
  base.setUTCDate(base.getUTCDate() + deltaDays);
  return formatDateStrInTimezone(base, timeZone);
}

export function getWeekStartDateStr(dateStr: string, timeZone: string = DEFAULT_TIMEZONE): string {
  const base = new Date(`${dateStr}T12:00:00${SAO_PAULO_OFFSET}`);
  const day = getWeekdayIndexInTimezone(base, timeZone);
  const diffToMonday = (day + 6) % 7;
  return addDaysToDateStr(dateStr, -diffToMonday, timeZone);
}

export function getWeekRangeDateStr(dateStr: string, timeZone: string = DEFAULT_TIMEZONE) {
  const start = getWeekStartDateStr(dateStr, timeZone);
  const end = addDaysToDateStr(start, 6, timeZone);
  return { start, end };
}

export function getUtcRangeForDateStr(dateStr: string) {
  const start = new Date(`${dateStr}T00:00:00${SAO_PAULO_OFFSET}`);
  const end = new Date(`${dateStr}T23:59:59.999${SAO_PAULO_OFFSET}`);
  return { start: start.toISOString(), end: end.toISOString() };
}

/**
 * Retorna se a data atual (no fuso de São Paulo) é fim de semana (Sábado = 6 ou Domingo = 0).
 */
export function isWeekendInTimezone(timeZone: string = DEFAULT_TIMEZONE): boolean {
  const day = getWeekdayIndexInTimezone(new Date(), timeZone);
  return day === 0 || day === 6;
}
