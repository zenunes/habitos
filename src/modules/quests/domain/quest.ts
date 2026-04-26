export type Quest = {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
};

export const weeklyQuest: Quest = {
  id: "q1",
  title: "Semana da consistencia",
  description: "Concluir ao menos 1 habito por 5 dias na semana.",
  xpReward: 80,
  completed: false,
};
