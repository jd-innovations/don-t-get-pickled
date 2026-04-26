
-- profiles table linked to auth.users
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  gender text,
  age_range text,
  fitness_level text,
  play_frequency text,
  injuries text[] not null default '{}',
  goals text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select to authenticated using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles
  for delete to authenticated using (auth.uid() = id);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create profile on new auth user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- sessions table
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  completed_at timestamptz not null,
  duration_sec integer not null default 0,
  exercise_ids text[] not null default '{}',
  total_reps integer not null default 0,
  total_hold_sec integer not null default 0,
  created_at timestamptz not null default now()
);

create index sessions_user_date_idx on public.sessions (user_id, date desc);

alter table public.sessions enable row level security;

create policy "sessions_select_own" on public.sessions
  for select to authenticated using (auth.uid() = user_id);
create policy "sessions_insert_own" on public.sessions
  for insert to authenticated with check (auth.uid() = user_id);
create policy "sessions_update_own" on public.sessions
  for update to authenticated using (auth.uid() = user_id);
create policy "sessions_delete_own" on public.sessions
  for delete to authenticated using (auth.uid() = user_id);
