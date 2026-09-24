-- Make the database enforce the serialized curriculum contract.

create unique index if not exists curriculum_edges_unique_dependency_idx
  on public.curriculum_edges (source_node_id, target_node_id, dependency_type);

create index if not exists curriculum_edges_target_node_id_idx
  on public.curriculum_edges (target_node_id);

create index if not exists user_progress_lesson_id_idx
  on public.user_progress (lesson_id);

-- The application curriculum is ordered within each module. Link each lesson
-- to the next lesson, then link module boundaries to preserve one path across
-- the complete curriculum.
insert into public.curriculum_edges (source_node_id, target_node_id, dependency_type)
select current_node.id, next_node.id, 'prerequisite'
from public.curriculum_nodes current_node
join public.curriculum_nodes next_node
  on next_node.phase_id = current_node.phase_id
 and next_node.order_index = current_node.order_index + 1
where not exists (
  select 1
  from public.curriculum_edges edge
  where edge.source_node_id = current_node.id
    and edge.target_node_id = next_node.id
    and edge.dependency_type = 'prerequisite'
);

insert into public.curriculum_edges (source_node_id, target_node_id, dependency_type)
select previous_phase_last.id, next_phase_first.id, 'prerequisite'
from public.curriculum_phases previous_phase
join public.curriculum_phases next_phase
  on next_phase.order_index = previous_phase.order_index + 1
join public.curriculum_nodes previous_phase_last
  on previous_phase_last.phase_id = previous_phase.id
 and previous_phase_last.order_index = (
   select max(last_node.order_index)
   from public.curriculum_nodes last_node
   where last_node.phase_id = previous_phase.id
 )
join public.curriculum_nodes next_phase_first
  on next_phase_first.phase_id = next_phase.id
 and next_phase_first.order_index = (
   select min(first_node.order_index)
   from public.curriculum_nodes first_node
   where first_node.phase_id = next_phase.id
 )
where not exists (
  select 1
  from public.curriculum_edges edge
  where edge.source_node_id = previous_phase_last.id
    and edge.target_node_id = next_phase_first.id
    and edge.dependency_type = 'prerequisite'
);

-- Keep one public read policy per curriculum table.
drop policy if exists "Public read curriculum phases" on public.curriculum_phases;
drop policy if exists "Public read curriculum nodes" on public.curriculum_nodes;
drop policy if exists "Public read curriculum edges" on public.curriculum_edges;

-- Auth functions are evaluated once per statement rather than once per row.
drop policy if exists "users manage their own progress" on public.user_progress;
create policy "users manage their own progress"
  on public.user_progress
  for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Attestations are written by the service-role webhook only. Keep direct
-- client reads denied while still defining an explicit RLS policy.
drop policy if exists "no direct grading attestation reads" on public.grading_attestations;
create policy "no direct grading attestation reads"
  on public.grading_attestations
  for select
  using (false);
