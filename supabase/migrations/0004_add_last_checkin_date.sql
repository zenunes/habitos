-- Adiciona a coluna last_checkin_date para rastrear a ofensiva (streak) de forma precisa

ALTER TABLE public.user_progress
ADD COLUMN IF NOT EXISTS last_checkin_date text;

-- O formato armazenado será 'YYYY-MM-DD'
