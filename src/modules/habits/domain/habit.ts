export type HabitFrequency = "daily" | "weekdays" | "custom";

export type Habit = {
  id: string;
  title: string;
  description?: string;
  frequency: HabitFrequency;
  active: boolean;
};

export const sampleHabits: Habit[] = [
  {
    id: "h1",
    title: "Beber agua ao acordar",
    frequency: "daily",
    active: true,
  },
  {
    id: "h2",
    title: "Planejar 3 prioridades do dia",
    frequency: "weekdays",
    active: true,
  },
  {
    id: "h3",
    title: "Alongar por 10 minutos",
    frequency: "daily",
    active: false,
  },
];
