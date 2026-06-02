# Mock Data Migration Plan

## Dependency Report

| Mock dependency | Current users | Role in UI | Migration target |
| --- | --- | --- | --- |
| `mockOffers` | `src/components/offers/offers-workspace.tsx` | Seeds the offers list and local CRUD state. | `offers` query, passed as `initialOffers` from `src/app/(dashboard)/offers/page.tsx`. |
| `mockOffers` | `src/components/offers/offer-detail-workspace.tsx` | Builds related opportunities on the offer detail page. | `offers` query, passed as `relatedOffers` from `src/app/(dashboard)/offers/[offerId]/page.tsx`. |
| `mockPipelineCards` | `src/components/pipeline/pipeline-board.tsx` | Seeds the local Kanban board. | `applications` query, mapped into pipeline cards and passed as `initialCards` from `src/app/(dashboard)/pipeline/page.tsx`. |
| `getMockOfferById` | `src/app/(dashboard)/offers/[offerId]/page.tsx` | Resolves the detail page fallback offer. | `offers` detail query by `id` or `slug`. |
| `getAggregatedJobSources` | `src/app/(dashboard)/dashboard/page.tsx` | Supplies job discovery source rows for scoring and recommendations. | `saved_jobs` query, mapped to `AggregatedJob[]` before `discoverJobs`. |

Adjacent mock-like data not covered by the four named dependencies:

| Location | Current mock behavior | Proposed table |
| --- | --- | --- |
| `src/app/(dashboard)/dashboard/page.tsx` | Inline dashboard application tracker rows. | `applications` |
| `src/app/(dashboard)/dashboard/page.tsx` | Inline resume insight cards. | `resume_scores` |
| `src/components/scoring/ai-scoring-workspace.tsx` | Inline score, strengths, weaknesses, and recommendations. | `resume_scores` |

## Proposed Supabase Schema

### `offers`

- `id uuid primary key`
- `profile_id uuid references profiles(id)`
- `slug text`
- `company text`
- `role text`
- `location text`
- `compensation text`
- `status text check ('Applied', 'Interview', 'Offer', 'Rejected')`
- `owner text`
- `applied_at date`
- `next_step text`
- `score integer check 0-100`
- `notes text`
- timestamps

### `applications`

- `id uuid primary key`
- `profile_id uuid references profiles(id)`
- `offer_id uuid references offers(id)`
- `company text`
- `role text`
- `status text`
- `stage text check ('Applied', 'Screening', 'Interview', 'Final Round', 'Offer', 'Rejected')`
- `owner text`
- `due_label text`
- `score integer check 0-100`
- `applied_at date`
- `source_url text`
- timestamps

### `saved_jobs`

- `id uuid primary key`
- `profile_id uuid references profiles(id)`
- `external_id text`
- `source text check ('greenhouse', 'lever', 'ashby', 'workday', 'manual')`
- `source_url text`
- `title text`
- `company text`
- `location text`
- `description text`
- salary, recruiter, employment, seniority, skills, posting, expiry, applicant, and remote fields
- timestamps

### `resume_scores`

- `id uuid primary key`
- `profile_id uuid references profiles(id)`
- `resume_path text`
- `target_role text`
- `resume_score integer check 0-100`
- `skills_match integer check 0-100`
- `ats_score integer check 0-100`
- `strengths text[]`
- `weaknesses text[]`
- `recommendations text[]`
- `model text`
- timestamps

## Migration Steps

1. Add schema and type definitions while preserving existing mock exports.
2. Add server-side query helpers that read Supabase and fall back to mocks when Supabase is not configured, the new tables are absent, or no rows exist yet.
3. Pass queried data into the existing client workspaces as initial state.
4. Later slice: replace localStorage create/edit/delete with server actions or route handlers for `offers` and `applications`.
5. Later slice: move dashboard resume insight and scoring pages to `resume_scores`.

## Implemented Slice

- Added Supabase schema coverage for `offers`, `applications`, `saved_jobs`, and `resume_scores`.
- Added server query helpers for offers, pipeline cards, saved job sources, and latest resume score summaries.
- Updated offers, offer details, pipeline, dashboard, and scoring routes to load data through Supabase-aware query functions.
- Kept `mockOffers`, `mockPipelineCards`, `getMockOfferById`, and `getAggregatedJobSources` in place as explicit fallback/demo data.
