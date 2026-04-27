-- Extensoes
create extension if not exists "pgcrypto";

-- Atualizacao automatica de updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Perfil
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  timezone text not null default 'America/Sao_Paulo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, split_part(new.email, '@', 1))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Habitos
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  frequency text not null default 'daily',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_habits_updated_at
before update on public.habits
for each row execute function public.set_updated_at();

create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  data_ref date not null,
  status text not null default 'done',
  created_at timestamptz not null default now(),
  unique (habit_id, data_ref)
);

-- Progresso e pontuacao
create table if not exists public.xp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source text not null,
  points int not null check (points > 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  xp_total int not null default 0,
  level int not null default 1,
  current_streak int not null default 0,
  best_streak int not null default 0,
  updated_at timestamptz not null default now()
);

create trigger trg_user_progress_updated_at
before update on public.user_progress
for each row execute function public.set_updated_at();

-- Quests e badges
create table if not exists public.quests (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  title text not null,
  rule jsonb not null default '{}'::jsonb,
  xp_reward int not null default 0,
  active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.user_quests (
  id uuid primary key default gen_random_uuid(),
  quest_id uuid not null references public.quests(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'in_progress',
  progress jsonb not null default '{}'::jsonb,
  completed_at timestamptz,
  unique (quest_id, user_id)
);

create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  title text not null,
  criteria jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  badge_id uuid not null references public.badges(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  granted_at timestamptz not null default now(),
  unique (badge_id, user_id)
);

-- Recompensas pessoais
create table if not exists public.rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  points_cost int not null check (points_cost > 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_rewards_updated_at
before update on public.rewards
for each row execute function public.set_updated_at();

create table if not exists public.reward_redemptions (
  id uuid primary key default gen_random_uuid(),
  reward_id uuid not null references public.rewards(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  points_cost int not null check (points_cost > 0),
  redeemed_at timestamptz not null default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.xp_events enable row level security;
alter table public.user_progress enable row level security;
alter table public.user_quests enable row level security;
alter table public.user_badges enable row level security;
alter table public.rewards enable row level security;
alter table public.reward_redemptions enable row level security;
alter table public.quests enable row level security;
alter table public.badges enable row level security;

-- Policies: isolamento por usuario
create policy "profiles_select_own" on public.profiles
for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
for update using (auth.uid() = id);

create policy "habits_rw_own" on public.habits
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "habit_logs_rw_own" on public.habit_logs
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "xp_events_read_own" on public.xp_events
for select using (auth.uid() = user_id);

create policy "user_progress_rw_own" on public.user_progress
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "user_quests_rw_own" on public.user_quests
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "user_badges_read_own" on public.user_badges
for select using (auth.uid() = user_id);

create policy "rewards_rw_own" on public.rewards
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "reward_redemptions_rw_own" on public.reward_redemptions
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Tabelas globais de jogo
create policy "quests_read_authenticated" on public.quests
for select using (auth.role() = 'authenticated');
create policy "badges_read_authenticated" on public.badges
for select using (auth.role() = 'authenticated');
