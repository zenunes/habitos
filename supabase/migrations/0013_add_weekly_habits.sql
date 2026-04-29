ALTER TABLE public.habits
ADD COLUMN IF NOT EXISTS target_per_week int;

ALTER TABLE public.habits
ADD CONSTRAINT habits_target_per_week_valid
CHECK (
  frequency <> 'weekly'
  OR (target_per_week IS NOT NULL AND target_per_week BETWEEN 1 AND 7)
);

