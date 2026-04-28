-- Adiciona a coluna consumed_at para permitir o rastreamento do consumo de itens no Inventário

ALTER TABLE public.reward_redemptions
ADD COLUMN IF NOT EXISTS consumed_at timestamp with time zone;
