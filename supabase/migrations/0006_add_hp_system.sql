-- Adiciona colunas para controlar o HP/Fadiga do usuário
-- HP máximo é 100. Cada missão perdida custa HP. Se HP chegar a 0, penalidades podem ocorrer (ex: reset completo de Streak).

ALTER TABLE public.user_progress
ADD COLUMN IF NOT EXISTS hp_current integer DEFAULT 100,
ADD COLUMN IF NOT EXISTS last_hp_calc_date text;

-- Restrição para não deixar HP ficar negativo ou acima de 100
ALTER TABLE public.user_progress
ADD CONSTRAINT hp_bounds CHECK (hp_current >= 0 AND hp_current <= 100);
