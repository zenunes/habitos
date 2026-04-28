-- Adiciona 20 novas conquistas mapeando os novos ícones e a lore do Solo Leveling
INSERT INTO public.badges (code, title, criteria)
VALUES 
  -- Streaks
  ('streak_3', 'Primeiros Passos', '{"type": "streak", "target": 3, "description": "Manteve a ofensiva por 3 dias seguidos.", "icon": "target", "color": "text-sky-300"}'::jsonb),
  ('streak_14', 'Foco Inabalável', '{"type": "streak", "target": 14, "description": "Manteve a ofensiva por 14 dias seguidos.", "icon": "swords", "color": "text-blue-500"}'::jsonb),
  ('streak_21', 'Hábito Formado', '{"type": "streak", "target": 21, "description": "Alcançou 21 dias. A ciência diz que virou rotina.", "icon": "sun", "color": "text-yellow-400"}'::jsonb),
  ('streak_50', 'Caminho sem Volta', '{"type": "streak", "target": 50, "description": "Alcançou 50 dias de ofensiva.", "icon": "gem", "color": "text-emerald-400"}'::jsonb),
  ('streak_100', 'O Centurião', '{"type": "streak", "target": 100, "description": "100 dias ininterruptos de pura disciplina.", "icon": "crown", "color": "text-amber-400"}'::jsonb),
  ('streak_180', 'Meio Ano de Glória', '{"type": "streak", "target": 180, "description": "180 dias de ofensiva. Imparável.", "icon": "moon", "color": "text-indigo-400"}'::jsonb),
  ('streak_365', 'Lenda Viva', '{"type": "streak", "target": 365, "description": "1 ano completo sem falhar. Você é o Sistema.", "icon": "trophy", "color": "text-rose-500"}'::jsonb),

  -- Levels (Classes & Intermediários)
  ('level_5', 'Saindo do Berço', '{"type": "level", "target": 5, "description": "Alcançou o Nível 5.", "icon": "star", "color": "text-sky-200"}'::jsonb),
  ('level_15', 'Aura Emergente', '{"type": "level", "target": 15, "description": "Alcançou o Nível 15.", "icon": "zap", "color": "text-cyan-400"}'::jsonb),
  ('level_20', 'Forjador de Rotinas', '{"type": "level", "target": 20, "description": "Alcançou o Nível 20 (Mudança de Classe).", "icon": "shield", "color": "text-emerald-500"}'::jsonb),
  ('level_25', 'Passos Firmes', '{"type": "level", "target": 25, "description": "Alcançou o Nível 25.", "icon": "mountain", "color": "text-emerald-300"}'::jsonb),
  ('level_30', 'Arquiteto do Tempo', '{"type": "level", "target": 30, "description": "Alcançou o Nível 30 (Mudança de Classe).", "icon": "sun", "color": "text-amber-500"}'::jsonb),
  ('level_40', 'Especialista', '{"type": "level", "target": 40, "description": "Alcançou o Nível 40 (Mudança de Classe).", "icon": "target", "color": "text-rose-500"}'::jsonb),
  ('level_50', 'Mestre do Controle', '{"type": "level", "target": 50, "description": "Alcançou o Nível 50 (Mudança de Classe).", "icon": "crown", "color": "text-purple-500"}'::jsonb),
  ('level_60', 'Poder Absoluto', '{"type": "level", "target": 60, "description": "Alcançou o Nível 60.", "icon": "swords", "color": "text-purple-300"}'::jsonb),
  ('level_70', 'O Transcendente', '{"type": "level", "target": 70, "description": "Alcançou o Nível 70 (Mudança de Classe).", "icon": "moon", "color": "text-fuchsia-500"}'::jsonb),
  ('level_80', 'Quase Divino', '{"type": "level", "target": 80, "description": "Alcançou o Nível 80.", "icon": "gem", "color": "text-fuchsia-300"}'::jsonb),
  ('level_90', 'Arquiteto da Realidade', '{"type": "level", "target": 90, "description": "Alcançou o Nível 90 (Mudança de Classe).", "icon": "cpu", "color": "text-indigo-500"}'::jsonb),
  ('level_100', 'A Anomalia', '{"type": "level", "target": 100, "description": "Alcançou o Nível 100 (O Ápice do Sistema).", "icon": "trophy", "color": "text-red-600"}'::jsonb)
ON CONFLICT (code) DO UPDATE SET 
  title = EXCLUDED.title, 
  criteria = EXCLUDED.criteria;