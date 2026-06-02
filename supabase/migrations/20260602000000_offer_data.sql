create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  slug text not null,
  company text not null,
  role text not null,
  location text not null default 'Remote',
  compensation text not null default '',
  status text not null default 'Applied'
    check (status in ('Applied', 'Interview', 'Offer', 'Rejected')),
  owner text not null default '',
  applied_at date,
  next_step text not null default '',
  score integer not null default 0 check (score between 0 and 100),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, slug)
);

create index if not exists offers_profile_id_idx
  on public.offers (profile_id);

create index if not exists offers_profile_status_idx
  on public.offers (profile_id, status);

drop trigger if exists offers_set_updated_at on public.offers;

create trigger offers_set_updated_at
before update on public.offers
for each row
execute function public.set_updated_at();

alter table public.offers enable row level security;

drop policy if exists "Service role can manage offers" on public.offers;

create policy "Service role can manage offers"
on public.offers
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  offer_id uuid references public.offers (id) on delete set null,
  company text not null,
  role text not null,
  status text not null default 'Recommended',
  stage text not null default 'Applied'
    check (stage in ('Applied', 'Screening', 'Interview', 'Final Round', 'Offer', 'Rejected')),
  owner text not null default '',
  due_label text not null default '',
  score integer not null default 0 check (score between 0 and 100),
  applied_at date,
  source_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists applications_profile_id_idx
  on public.applications (profile_id);

create index if not exists applications_profile_stage_idx
  on public.applications (profile_id, stage);

drop trigger if exists applications_set_updated_at on public.applications;

create trigger applications_set_updated_at
before update on public.applications
for each row
execute function public.set_updated_at();

alter table public.applications enable row level security;

drop policy if exists "Service role can manage applications" on public.applications;

create policy "Service role can manage applications"
on public.applications
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create table if not exists public.saved_jobs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  external_id text,
  source text not null default 'manual'
    check (source in ('greenhouse', 'lever', 'ashby', 'workday', 'manual')),
  source_url text not null,
  title text not null,
  company text not null,
  location text not null default '',
  description text not null default '',
  salary_min integer,
  salary_max integer,
  currency text,
  recruiter_name text,
  recruiter_email text,
  employment_type text not null default 'full-time'
    check (employment_type in ('full-time', 'contract', 'part-time', 'internship')),
  seniority text check (seniority in ('junior', 'mid', 'senior', 'lead', 'executive')),
  skills text[] not null default '{}',
  posted_at timestamptz not null default now(),
  expires_at timestamptz,
  applicant_count integer,
  is_remote boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, source, source_url)
);

create index if not exists saved_jobs_profile_id_idx
  on public.saved_jobs (profile_id);

create index if not exists saved_jobs_profile_posted_at_idx
  on public.saved_jobs (profile_id, posted_at desc);

drop trigger if exists saved_jobs_set_updated_at on public.saved_jobs;

create trigger saved_jobs_set_updated_at
before update on public.saved_jobs
for each row
execute function public.set_updated_at();

alter table public.saved_jobs enable row level security;

drop policy if exists "Service role can manage saved jobs" on public.saved_jobs;

create policy "Service role can manage saved jobs"
on public.saved_jobs
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create table if not exists public.resume_scores (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  resume_path text,
  target_role text,
  resume_score integer not null default 0 check (resume_score between 0 and 100),
  skills_match integer not null default 0 check (skills_match between 0 and 100),
  ats_score integer not null default 0 check (ats_score between 0 and 100),
  strengths text[] not null default '{}',
  weaknesses text[] not null default '{}',
  recommendations text[] not null default '{}',
  model text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists resume_scores_profile_id_idx
  on public.resume_scores (profile_id);

create index if not exists resume_scores_profile_created_at_idx
  on public.resume_scores (profile_id, created_at desc);

drop trigger if exists resume_scores_set_updated_at on public.resume_scores;

create trigger resume_scores_set_updated_at
before update on public.resume_scores
for each row
execute function public.set_updated_at();

alter table public.resume_scores enable row level security;

drop policy if exists "Service role can manage resume scores" on public.resume_scores;

create policy "Service role can manage resume scores"
on public.resume_scores
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
