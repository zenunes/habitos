export type HabitFrequency = "daily" | "weekdays" | "weekly" | "custom" | "once" | "negative";

export type Habit = {
  id: string;
  title: string;
  description?: string;
  frequency: HabitFrequency;
  targetPerWeek?: number | null;
  active: boolean;
};
