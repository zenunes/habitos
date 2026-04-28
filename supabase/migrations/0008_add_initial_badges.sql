-- Insere as conquistas iniciais do sistema
INSERT INTO public.badges (code, title, criteria)
VALUES 
  ('first_blood', 'Primeiro Sangue', '{"type": "checkin", "description": "Completou sua primeira missão.", "icon": "droplet", "color": "text-red-500"}'::jsonb),
  ('streak_7', 'Semana Perfeita', '{"type": "streak", "target": 7, "description": "Manteve a ofensiva por 7 dias seguidos.", "icon": "flame", "color": "text-orange-500"}'::jsonb),
  ('streak_30', 'Máquina', '{"type": "streak", "target": 30, "description": "Alcançou 30 dias de ofensiva.", "icon": "cpu", "color": "text-slate-400"}'::jsonb),
  ('level_10', 'O Desperto', '{"type": "level", "target": 10, "description": "Alcançou o Nível 10 (Mudança de Classe).", "icon": "shield", "color": "text-amber-500"}'::jsonb)
ON CONFLICT (code) DO UPDATE SET 
  title = EXCLUDED.title, 
  criteria = EXCLUDED.criteria;

-- Permite que a propria API insira na tabela de user_badges (conceda a conquista pro usuario logado)
CREATE POLICY "user_badges_insert_own" ON public.user_badges
FOR INSERT WITH CHECK (auth.uid() = user_id);