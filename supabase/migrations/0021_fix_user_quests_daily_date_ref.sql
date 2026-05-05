ALTER TABLE public.user_quests
ADD COLUMN IF NOT EXISTS starts_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.user_quests
ADD COLUMN IF NOT EXISTS date_ref text;

UPDATE public.user_quests
SET date_ref = to_char((starts_at at time zone 'America/Sao_Paulo')::date, 'YYYY-MM-DD')
WHERE date_ref IS NULL;

ALTER TABLE public.user_quests
ALTER COLUMN date_ref SET DEFAULT to_char((now() at time zone 'America/Sao_Paulo')::date, 'YYYY-MM-DD');

ALTER TABLE public.user_quests
ALTER COLUMN date_ref SET NOT NULL;

ALTER TABLE public.user_quests
DROP CONSTRAINT IF EXISTS user_quests_quest_id_user_id_key;

ALTER TABLE public.user_quests
DROP CONSTRAINT IF EXISTS user_quests_user_id_quest_id_key;

CREATE UNIQUE INDEX IF NOT EXISTS user_quests_user_id_date_ref_key
ON public.user_quests (user_id, date_ref);

