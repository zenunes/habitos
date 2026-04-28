/**
 * Retorna a data atual no formato YYYY-MM-DD ajustada para o fuso horário oficial (America/Sao_Paulo).
 * Impede que missões e streaks resetem durante a noite no Brasil se o servidor em nuvem estiver na Europa/EUA.
 */
export function getTodayDateStr(): string {
  // Cria a data atual e formata explicitamente para o fuso horário de São Paulo
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  // O en-CA formata como YYYY-MM-DD naturalmente
  return formatter.format(new Date());
}

/**
 * Retorna se a data atual (no fuso de São Paulo) é fim de semana (Sábado = 6 ou Domingo = 0).
 */
export function isWeekendInTimezone(): boolean {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short'
  });
  
  const weekday = formatter.format(new Date());
  return weekday === 'Sat' || weekday === 'Sun';
}
