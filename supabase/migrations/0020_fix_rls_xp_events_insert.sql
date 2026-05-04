CREATE POLICY "xp_events_insert_own" ON public.xp_events
FOR INSERT WITH CHECK (auth.uid() = user_id);

