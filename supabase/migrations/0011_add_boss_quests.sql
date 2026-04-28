-- Limpa quests antigas para recriar as novas Dinâmicas
DELETE FROM public.quests;

-- Insere um Pool de Bosses (Quests Épicas) que serão sorteadas
INSERT INTO public.quests (code, title, rule, xp_reward, active)
VALUES
  ('boss_clean_house', 'Limpeza Profunda', '{"description": "Limpe a casa inteira (varrer, passar pano, organizar). O ambiente reflete a mente.", "type": "boss"}'::jsonb, 150, true),
  ('boss_read_book', 'Devorador de Conhecimento', '{"description": "Leia pelo menos 50 páginas de um livro hoje.", "type": "boss"}'::jsonb, 100, true),
  ('boss_digital_detox', 'Desintoxicação Digital', '{"description": "Fique 4 horas seguidas sem encostar no celular (exceto emergências).", "type": "boss"}'::jsonb, 200, true),
  ('boss_workout', 'Treino de Espartano', '{"description": "Faça um treino intenso de pelo menos 1 hora sem interrupções.", "type": "boss"}'::jsonb, 150, true),
  ('boss_meditation', 'Mente de Monge', '{"description": "Faça 30 minutos ininterruptos de meditação ou silêncio absoluto.", "type": "boss"}'::jsonb, 120, true),
  ('boss_no_sugar', 'Açúcar é Veneno', '{"description": "Passe 24 horas inteiras sem consumir nenhum grama de açúcar adicionado.", "type": "boss"}'::jsonb, 180, true),
  ('boss_early_bird', 'Milagre da Manhã', '{"description": "Acorde antes das 6:00 AM e comece o dia sendo produtivo.", "type": "boss"}'::jsonb, 150, true),
  ('boss_cold_shower', 'Aço Frio', '{"description": "Tome um banho 100% gelado por pelo menos 3 minutos.", "type": "boss"}'::jsonb, 100, true);
