export type UserProgress = {
  xpTotal: number;
  level: number;
  currentStreak: number;
  bestStreak: number;
  availablePoints: number;
  lastCheckinDate?: string | null;
  hpCurrent: number;
  lastHpCalcDate?: string | null;
  className?: string; // Título atual baseado no nível
};

/**
 * Retorna a quantidade TOTAL de XP acumulado necessária para atingir um determinado nível.
 * Fórmula: Nível^1.5 * 100
 * Isso cria uma curva exponencial. Exemplo de XP total para cada nível:
 * Lv 1: 0 XP (Ponto de partida)
 * Lv 2: 282 XP
 * Lv 5: 1118 XP
 * Lv 10: 3162 XP
 * Lv 20: 8944 XP
 * Lv 50: 35355 XP
 * Lv 100: 100000 XP
 */
export function getXpRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(Math.pow(level, 1.5) * 100);
}

/**
 * Calcula o Nível Atual do usuário com base no total de XP.
 * A função inverte a lógica da equação de XP de forma segura.
 */
export function calculateLevel(xpTotal: number): number {
  if (xpTotal <= 0) return 1;
  // A inversa de XP = L^1.5 * 100 é L = (XP / 100)^(1/1.5)
  const exactLevel = Math.pow(xpTotal / 100, 1 / 1.5);
  return Math.max(1, Math.floor(exactLevel));
}

/**
 * Retorna o XP necessário no nível ATUAL para passar pro PRÓXIMO nível.
 * (Apenas a diferença entre a meta do próximo nível e a base do nível atual).
 */
export function getLevelProgress(xpTotal: number, currentLevel: number) {
  const currentLevelBaseXp = getXpRequiredForLevel(currentLevel);
  const nextLevelBaseXp = getXpRequiredForLevel(currentLevel + 1);
  
  const xpIntoCurrentLevel = xpTotal - currentLevelBaseXp;
  const xpNeededForNextLevel = nextLevelBaseXp - currentLevelBaseXp;
  
  return {
    xpIntoCurrentLevel: Math.max(0, xpIntoCurrentLevel),
    xpNeededForNextLevel,
    progressPercent: Math.min(100, Math.max(0, (xpIntoCurrentLevel / xpNeededForNextLevel) * 100))
  };
}

/**
 * Retorna o título/classe da pessoa com base no nível ("O Caminho do Despertar").
 */
export function getHunterClass(level: number): string {
  if (level < 10) return "O Adormecido";
  if (level < 20) return "O Desperto";
  if (level < 30) return "Forjador de Rotinas";
  if (level < 40) return "Arquiteto do Tempo";
  if (level < 50) return "Especialista";
  if (level < 70) return "Mestre do Controle";
  if (level < 90) return "O Transcendente";
  if (level < 100) return "Arquiteto da Realidade";
  return "A Anomalia"; // Apex
}

/**
 * Retorna a classe de cor/tema do CSS (data-theme) baseado no nível do jogador.
 * Os temas são injetados no html globalmente.
 */
export function getThemeByLevel(level: number): string {
  if (level < 10) return "theme-sky";       // O Adormecido: Azul céu (padrão)
  if (level < 20) return "theme-cyan";      // O Desperto: Ciano (evolução do azul)
  if (level < 30) return "theme-emerald";   // Forjador de Rotinas: Verde
  if (level < 40) return "theme-amber";     // Arquiteto do Tempo: Dourado/Amarelo
  if (level < 50) return "theme-rose";      // Especialista: Vermelho rose
  if (level < 70) return "theme-purple";    // Mestre do Controle: Roxo
  if (level < 90) return "theme-fuchsia";   // O Transcendente: Fuchsia/Rosa
  if (level < 100) return "theme-indigo";   // Arquiteto da Realidade: Indigo
  return "theme-crimson";                   // A Anomalia: Vermelho Sangue
}
