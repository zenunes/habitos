-- Adiciona a coluna coins à tabela user_progress, com valor padrão 0.
-- Agora, o XP (xp_total) servirá apenas para subir de nível e desbloquear classes.
-- O "coins" será a moeda de troca usada na Loja.

ALTER TABLE public.user_progress
ADD COLUMN IF NOT EXISTS coins int NOT NULL DEFAULT 0 CHECK (coins >= 0);

-- Para ser justo com os usuários antigos que já tinham acumulado XP,
-- vamos dar a eles um bônus inicial de moedas equivalente a 1/3 do seu XP total
UPDATE public.user_progress
SET coins = (xp_total / 3)
WHERE coins = 0 AND xp_total > 0;
