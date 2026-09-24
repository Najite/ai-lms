-- Canonical curriculum tables used by lib/db-curriculum.ts.
create table if not exists public.curriculum_phases (
	id text primary key,
	title text not null,
	order_index integer not null,
	description text,
	created_at timestamptz not null default now()
);

create table if not exists public.curriculum_nodes (
	id text primary key,
	slug text unique not null,
	phase_id text references public.curriculum_phases(id) on delete cascade,
	title text not null,
	subtitle text,
	cs_foundation text not null default '',
	ai_convergence text not null default '',
	xp_reward integer not null default 100,
	level_required integer not null default 0,
	position_x double precision not null default 0,
	position_y double precision not null default 0,
	handbook_markdown text not null default '',
	notebooklm_audio_url text,
	starter_code jsonb not null default '{}'::jsonb,
	test_suite jsonb not null default '{}'::jsonb,
	defense_prompts jsonb not null default '[]'::jsonb,
	created_at timestamptz not null default now(),
	order_index integer
);

create table if not exists public.curriculum_edges (
	id uuid primary key default gen_random_uuid(),
	source_node_id text references public.curriculum_nodes(id) on delete cascade,
	target_node_id text references public.curriculum_nodes(id) on delete cascade,
	dependency_type text not null default 'prerequisite'
);

create table if not exists public.user_progress (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null references auth.users(id) on delete cascade,
	lesson_id text not null references public.curriculum_nodes(id) on delete cascade,
	is_completed boolean not null default false,
	saved_code_draft text,
	completed_at timestamptz,
	last_accessed_at timestamptz not null default now(),
	unique (user_id, lesson_id)
);

create index if not exists curriculum_nodes_phase_order_idx
	on public.curriculum_nodes (phase_id, order_index);

create index if not exists user_progress_user_lesson_idx
	on public.user_progress (user_id, lesson_id);

alter table public.curriculum_phases enable row level security;
alter table public.curriculum_nodes enable row level security;
alter table public.curriculum_edges enable row level security;
alter table public.user_progress enable row level security;

drop policy if exists "curriculum phases are public" on public.curriculum_phases;
create policy "curriculum phases are public"
	on public.curriculum_phases for select using (true);

drop policy if exists "curriculum nodes are public" on public.curriculum_nodes;
create policy "curriculum nodes are public"
	on public.curriculum_nodes for select using (true);

drop policy if exists "curriculum edges are public" on public.curriculum_edges;
create policy "curriculum edges are public"
	on public.curriculum_edges for select using (true);

drop policy if exists "users manage their own progress" on public.user_progress;
create policy "users manage their own progress"
	on public.user_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
