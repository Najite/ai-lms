alter table public.curriculum_nodes
  add column if not exists content_status text not null default 'draft';

alter table public.curriculum_nodes
  add column if not exists content_reviewed_at timestamptz;

alter table public.curriculum_nodes
  drop constraint if exists curriculum_nodes_content_status_check;

alter table public.curriculum_nodes
  add constraint curriculum_nodes_content_status_check
  check (content_status in ('draft', 'reviewed', 'verified'));

create index if not exists curriculum_nodes_content_status_idx
  on public.curriculum_nodes (content_status);
