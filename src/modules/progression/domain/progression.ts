export type UserProgress = {
  xpTotal: number;
  level: number;
  currentStreak: number;
  bestStreak: number;
  availablePoints: number;
};

const XP_PER_LEVEL = 120;

export function calculateLevel(xpTotal: number): number {
  return Math.max(1, Math.floor(xpTotal / XP_PER_LEVEL) + 1);
}
