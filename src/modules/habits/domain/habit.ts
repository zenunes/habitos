export type HabitFrequency = "daily" | "weekdays" | "custom" | string;

export type Habit = {
  id: string;
  title: string;
  description?: string;
  frequency: HabitFrequency;
  active: boolean;
};
