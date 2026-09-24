alter table public.curriculum_nodes
  add column if not exists curriculum_spec_markdown text not null default '';

alter table public.curriculum_nodes
  add column if not exists curriculum_spec_hash text not null default '';

-- Preserve the source contract that is currently embedded in the handbook,
-- then allow future articles to be rewritten without changing the contract.
update public.curriculum_nodes
set curriculum_spec_markdown = btrim(
      substring(
        handbook_markdown
        from position('## Source specification' in handbook_markdown) + length('## Source specification')
        for position('## Practice contract' in handbook_markdown)
          - (position('## Source specification' in handbook_markdown) + length('## Source specification'))
      )
    ),
    curriculum_spec_hash = md5(
      btrim(
        substring(
          handbook_markdown
          from position('## Source specification' in handbook_markdown) + length('## Source specification')
          for position('## Practice contract' in handbook_markdown)
            - (position('## Source specification' in handbook_markdown) + length('## Source specification'))
        )
      )
    )
where curriculum_spec_markdown = ''
  and position('## Source specification' in handbook_markdown) > 0
  and position('## Practice contract' in handbook_markdown) > position('## Source specification' in handbook_markdown);

create index if not exists curriculum_nodes_spec_hash_idx
  on public.curriculum_nodes (curriculum_spec_hash);
