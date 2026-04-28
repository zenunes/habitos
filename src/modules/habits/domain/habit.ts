export type HabitFrequency = "daily" | "weekdays" | "custom" | "once" | "negative";

export type Habit = {
  id: string;
  title: string;
  description?: string;
  frequency: HabitFrequency;
  active: boolean;
};
