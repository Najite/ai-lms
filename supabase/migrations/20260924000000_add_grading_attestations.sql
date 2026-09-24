create table if not exists public.grading_attestations (
  run_id text primary key,
  repo text not null,
  payload jsonb not null,
  passed boolean not null default false,
  score numeric,
  signed_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists grading_attestations_created_at_idx
  on public.grading_attestations (created_at desc);

alter table public.grading_attestations enable row level security;