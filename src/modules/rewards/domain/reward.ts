export type Reward = {
  id: string;
  title: string;
  pointsCost: number;
  available: boolean;
};

export const sampleRewards: Reward[] = [
  { id: "r1", title: "Assistir um episodio da serie", pointsCost: 120, available: true },
  { id: "r2", title: "Pedir comida favorita", pointsCost: 250, available: true },
];
