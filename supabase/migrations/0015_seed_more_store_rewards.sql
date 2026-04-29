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
      ('Recompensa Épica (algo grande)', 800),
      ('Kit de Primeiros Socorros (50 HP)', 80),
      ('Reanimação (1 uso)', 150),
      ('Selo do Caçador (Cancelar 1 inimigo)', 70),
      ('Escudo Temporal (24h)', 300),
      ('Pergaminho de Disciplina (24h)', 120),
      ('Amuleto do Foco (24h)', 120),
      ('Cosmético: Moldura do Perfil (Rara)', 200),
      ('Cosmético: Título Dourado (Raro)', 250),
      ('Cosmético: Tema de Classe (Raro)', 350)
  ) AS v(title, points_cost)
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.rewards r
    WHERE r.user_id = p_user_id
      AND r.title = v.title
  );
END;
$$;

DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT p.id
    FROM public.profiles p
  LOOP
    PERFORM public.seed_default_rewards(r.id);
  END LOOP;
END;
$$;

