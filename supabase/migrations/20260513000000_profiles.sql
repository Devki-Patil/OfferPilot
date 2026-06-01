create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  full_name text not null,
  email text,
  headline text,
  target_role text not null,
  salary_expectation text,
  location text,
  skills text[] not null default '{}',
  experience jsonb not null default '[]'::jsonb,
  projects jsonb not null default '[]'::jsonb,
  links jsonb not null default '{}'::jsonb,
  resume_path text,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_clerk_user_id_idx
  on public.profiles (clerk_user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;

drop policy if exists "Service role can manage profiles" on public.profiles;

create policy "Service role can manage profiles"
on public.profiles
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
