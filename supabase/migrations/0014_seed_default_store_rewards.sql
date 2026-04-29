CREATE OR REPLACE FUNCTION public.seed_default_rewards(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY definer
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.rewards (user_id, title, points_cost, active)
  SELECT p_user_id, v.title, v.points_cost, true
  FROM (
    VALUES
      ('Pausa Estratégica (15 min)', 20),
      ('Café Especial', 35),
      ('30 min de Jogo', 60),
      ('1 Episódio de Série', 70),
      ('Sobremesa (sem culpa)', 90),
      ('Cinema / Encontro', 200),
      ('Day Off (meio período)', 260),
      ('Compra Pequena (até R$30)', 300),
      ('Livro / Curso (investimento)', 450),
      ('Recompensa Épica (algo grande)', 800)
  ) AS v(title, points_cost)
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.rewards r
    WHERE r.user_id = p_user_id
      AND r.title = v.title
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, focus)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'name', ''), split_part(NEW.email, '@', 1)),
    NULLIF(NEW.raw_user_meta_data->>'focus', '')
  )
  ON CONFLICT (id) DO NOTHING;

  PERFORM public.seed_default_rewards(NEW.id);

  RETURN NEW;
END;
$$;

DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT p.id
    FROM public.profiles p
    WHERE NOT EXISTS (
      SELECT 1
      FROM public.rewards rw
      WHERE rw.user_id = p.id
    )
  LOOP
    PERFORM public.seed_default_rewards(r.id);
  END LOOP;
END;
$$;

