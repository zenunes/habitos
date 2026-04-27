create or replace function public.complete_habit_checkin(
  p_habit_id uuid,
  p_data_ref date default current_date,
  p_points int default 20
)
returns table (
  inserted boolean,
  xp_awarded int,
  current_streak int,
  level int,
  xp_total int
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid;
  v_habit_owner uuid;
  v_habit_active boolean;
  v_rows_inserted int;
  v_had_logs_today boolean;
  v_had_logs_yesterday boolean;
  v_progress user_progress%rowtype;
  v_new_streak int;
  v_new_best_streak int;
  v_new_xp_total int;
  v_new_level int;
begin
  v_uid := auth.uid();

  if v_uid is null then
    raise exception 'Usuario nao autenticado';
  end if;

  if p_points <= 0 then
    raise exception 'Pontuacao invalida';
  end if;

  select h.user_id, h.active
  into v_habit_owner, v_habit_active
  from public.habits h
  where h.id = p_habit_id;

  if v_habit_owner is null then
    raise exception 'Habito nao encontrado';
  end if;

  if v_habit_owner <> v_uid then
    raise exception 'Sem permissao para este habito';
  end if;

  if v_habit_active is false then
    raise exception 'Habito pausado';
  end if;

  select exists (
    select 1
    from public.habit_logs hl
    where hl.user_id = v_uid
      and hl.data_ref = p_data_ref
  ) into v_had_logs_today;

  insert into public.habit_logs (habit_id, user_id, data_ref, status)
  values (p_habit_id, v_uid, p_data_ref, 'done')
  on conflict (habit_id, data_ref) do nothing;

  get diagnostics v_rows_inserted = row_count;

  insert into public.user_progress (user_id)
  values (v_uid)
  on conflict (user_id) do nothing;

  select *
  into v_progress
  from public.user_progress up
  where up.user_id = v_uid
  for update;

  if v_rows_inserted = 0 then
    return query
    select
      false,
      0,
      v_progress.current_streak,
      v_progress.level,
      v_progress.xp_total;
    return;
  end if;

  insert into public.xp_events (user_id, source, points, metadata)
  values (
    v_uid,
    'habit_checkin',
    p_points,
    jsonb_build_object('habit_id', p_habit_id, 'date', p_data_ref)
  );

  if v_had_logs_today then
    v_new_streak := v_progress.current_streak;
  else
    select exists (
      select 1
      from public.habit_logs hl
      where hl.user_id = v_uid
        and hl.data_ref = (p_data_ref - interval '1 day')::date
    ) into v_had_logs_yesterday;

    if v_had_logs_yesterday then
      v_new_streak := v_progress.current_streak + 1;
    else
      v_new_streak := 1;
    end if;
  end if;

  v_new_best_streak := greatest(v_progress.best_streak, v_new_streak);
  v_new_xp_total := v_progress.xp_total + p_points;
  v_new_level := floor(v_new_xp_total / 120) + 1;

  update public.user_progress
  set
    xp_total = v_new_xp_total,
    level = v_new_level,
    current_streak = v_new_streak,
    best_streak = v_new_best_streak
  where user_id = v_uid;

  return query
  select
    true,
    p_points,
    v_new_streak,
    v_new_level,
    v_new_xp_total;
end;
$$;

revoke all on function public.complete_habit_checkin(uuid, date, int) from public;
grant execute on function public.complete_habit_checkin(uuid, date, int) to authenticated;
