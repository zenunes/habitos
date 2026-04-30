UPDATE public.profiles p
SET profile_frame = 'epic'
WHERE p.profile_frame IS DISTINCT FROM 'epic'
  AND EXISTS (
    SELECT 1
    FROM public.reward_redemptions rr
    JOIN public.rewards r ON r.id = rr.reward_id
    WHERE rr.user_id = p.id
      AND rr.points_cost >= 300
      AND lower(r.title) LIKE '%moldura do perfil%'
  );

UPDATE public.profiles p
SET profile_frame = 'rare'
WHERE p.profile_frame IS NULL
  AND EXISTS (
    SELECT 1
    FROM public.reward_redemptions rr
    JOIN public.rewards r ON r.id = rr.reward_id
    WHERE rr.user_id = p.id
      AND rr.points_cost > 0
      AND rr.points_cost < 300
      AND lower(r.title) LIKE '%moldura do perfil%'
  );

