-- 中文分层练习网站 MVP schema
-- Run this in the Supabase SQL editor before connecting the frontend.

create extension if not exists pgcrypto;

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  class_code text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.class_students (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  student_name text not null,
  gender text not null default '',
  access_code text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (class_id, student_name)
);

alter table public.class_students add column if not exists gender text not null default '';
alter table public.class_students add column if not exists access_code text not null default '';

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references public.classes(id) on delete set null,
  title text not null,
  topic text not null default '',
  description text not null default '',
  practice_number integer not null default 1,
  level text not null check (level in ('level1', 'level2', 'level3')),
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tasks add column if not exists topic text not null default '';
alter table public.tasks add column if not exists description text not null default '';
alter table public.tasks add column if not exists practice_number integer not null default 1;
alter table public.tasks alter column class_id drop not null;
alter table public.tasks drop constraint if exists tasks_class_id_fkey;
alter table public.tasks
  add constraint tasks_class_id_fkey
  foreign key (class_id) references public.classes(id) on delete set null;

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  type text not null check (
    type in (
      'matching',
      'multiple_choice',
      'multi_select',
      'fill_blank',
      'sentence_ordering',
      'sentence_building',
      'open_response'
    )
  ),
  prompt text not null,
  options jsonb not null default '[]'::jsonb,
  correct_answer jsonb not null default '""'::jsonb,
  skill_tag text not null default '',
  grammar_tag text not null default '',
  sort_order integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_attempts (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  class_code text not null,
  student_name text not null,
  level text not null check (level in ('level1', 'level2', 'level3')),
  score integer not null default 0,
  max_score integer not null default 0,
  accuracy integer not null default 0,
  completed_count integer not null default 0,
  total_count integer not null default 0,
  duration_seconds integer,
  submitted_at timestamptz not null default now()
);

create table if not exists public.student_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.student_attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  question_type text not null,
  student_answer jsonb,
  is_correct boolean,
  score integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.student_task_scores (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  class_code text not null,
  student_name text not null,
  level text not null check (level in ('level1', 'level2', 'level3')),
  latest_score integer not null default 0,
  latest_max_score integer not null default 0,
  latest_accuracy integer not null default 0,
  latest_duration_seconds integer,
  best_score integer not null default 0,
  attempts_count integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (task_id, class_code, student_name)
);

create index if not exists idx_tasks_class_level_status on public.tasks(class_id, level, status);
create index if not exists idx_class_students_class_name on public.class_students(class_id, lower(student_name));
create unique index if not exists idx_class_students_access_code on public.class_students(lower(access_code)) where access_code <> '';

alter table public.student_attempts
  add column if not exists duration_seconds integer;

alter table public.student_task_scores
  add column if not exists latest_duration_seconds integer;
create index if not exists idx_questions_task_order on public.questions(task_id, sort_order);
create index if not exists idx_attempts_task_submitted on public.student_attempts(task_id, submitted_at desc);
create index if not exists idx_answers_question on public.student_answers(question_id);
create index if not exists idx_task_scores_student on public.student_task_scores(class_code, student_name, updated_at desc);

alter table public.classes enable row level security;
alter table public.class_students enable row level security;
alter table public.tasks enable row level security;
alter table public.questions enable row level security;
alter table public.student_attempts enable row level security;
alter table public.student_answers enable row level security;
alter table public.student_task_scores enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.classes to authenticated;
grant select on public.class_students to authenticated;
grant select on public.tasks to authenticated;
grant select on public.questions to authenticated;
grant insert on public.student_attempts to anon, authenticated;
grant insert on public.student_answers to anon, authenticated;
grant all on public.classes to authenticated;
grant all on public.class_students to authenticated;
grant all on public.tasks to authenticated;
grant all on public.questions to authenticated;
grant all on public.student_attempts to authenticated;
grant all on public.student_answers to authenticated;
grant all on public.student_task_scores to authenticated;
revoke select on public.classes from anon;
revoke select on public.class_students from anon;
revoke select on public.tasks from anon;
revoke select on public.questions from anon;

drop policy if exists "anon can read classes for class code entry" on public.classes;

drop policy if exists "teachers can manage classes" on public.classes;
create policy "teachers can manage classes"
  on public.classes for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "teachers can manage class students" on public.class_students;
create policy "teachers can manage class students"
  on public.class_students for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "anon can read published tasks" on public.tasks;

drop policy if exists "teachers can manage tasks" on public.tasks;
create policy "teachers can manage tasks"
  on public.tasks for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "anon can read published task questions" on public.questions;

drop policy if exists "teachers can manage questions" on public.questions;
create policy "teachers can manage questions"
  on public.questions for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "students can submit attempts" on public.student_attempts;
create policy "students can submit attempts"
  on public.student_attempts for insert
  to anon
  with check (
    exists (
      select 1
      from public.tasks
      where tasks.id = student_attempts.task_id
        and tasks.status = 'published'
        and tasks.level = student_attempts.level
        and exists (
          select 1
          from public.classes
          join public.class_students on class_students.class_id = classes.id
          where lower(classes.class_code) = lower(trim(student_attempts.class_code))
            and lower(class_students.student_name) = lower(trim(student_attempts.student_name))
            and class_students.active = true
        )
    )
  );

drop policy if exists "teachers can read and manage attempts" on public.student_attempts;
create policy "teachers can read and manage attempts"
  on public.student_attempts for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "students can submit answers" on public.student_answers;
create policy "students can submit answers"
  on public.student_answers for insert
  to anon
  with check (true);

drop policy if exists "teachers can read and manage answers" on public.student_answers;
create policy "teachers can read and manage answers"
  on public.student_answers for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "teachers can read and manage task scores" on public.student_task_scores;
create policy "teachers can read and manage task scores"
  on public.student_task_scores for all
  to authenticated
  using (true)
  with check (true);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop function if exists public.get_student_class(text);
drop function if exists public.get_student_tasks(text, text);
drop function if exists public.get_student_questions(text, text);
drop function if exists public.get_student_scores(text, text);
drop function if exists public.get_student_class(text, text);
drop function if exists public.get_student_tasks(text, text, text);
drop function if exists public.get_student_questions(text, text, text);
drop function if exists public.get_student_scores(text, text, text);
drop function if exists public.upsert_student_task_score(uuid, text, text, text, integer, integer, integer);
drop function if exists public.upsert_student_task_score(uuid, text, text, text, integer, integer, integer, integer);

create or replace function public.get_student_class(p_class_code text, p_student_name text)
returns table (
  id uuid,
  class_code text,
  name text,
  student_id uuid,
  student_name text,
  gender text,
  access_code text
)
language sql
security definer
set search_path = public
as $$
  select c.id, c.class_code, c.name, s.id as student_id, s.student_name, s.gender, s.access_code
  from public.classes c
  join public.class_students s on s.class_id = c.id
  where (
      lower(s.access_code) = lower(trim(p_class_code))
      or (
        lower(c.class_code) = lower(trim(p_class_code))
        and lower(s.student_name) = lower(trim(p_student_name))
      )
    )
    and s.active = true
  limit 1;
$$;

create or replace function public.get_student_tasks(p_class_code text, p_student_name text, p_level text)
returns table (
  id uuid,
  class_id uuid,
  title text,
  topic text,
  description text,
  practice_number integer,
  level text,
  status text,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select t.id, t.class_id, t.title, t.topic, t.description, t.practice_number,
         t.level, t.status, t.created_at, t.updated_at
  from public.tasks t
  where exists (
      select 1
      from public.classes c
      join public.class_students s on s.class_id = c.id
      where lower(c.class_code) = lower(trim(p_class_code))
        and lower(s.student_name) = lower(trim(p_student_name))
        and s.active = true
    )
    and t.level = p_level
    and t.status = 'published'
  order by t.title asc;
$$;

create or replace function public.get_student_questions(p_class_code text, p_student_name text, p_level text)
returns table (
  id uuid,
  task_id uuid,
  type text,
  prompt text,
  options jsonb,
  correct_answer jsonb,
  skill_tag text,
  grammar_tag text,
  sort_order integer,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select q.id, q.task_id, q.type, q.prompt, q.options, q.correct_answer,
         q.skill_tag, q.grammar_tag, q.sort_order, q.created_at, q.updated_at
  from public.questions q
  join public.tasks t on t.id = q.task_id
  where exists (
      select 1
      from public.classes c
      join public.class_students s on s.class_id = c.id
      where lower(c.class_code) = lower(trim(p_class_code))
        and lower(s.student_name) = lower(trim(p_student_name))
        and s.active = true
    )
    and t.level = p_level
    and t.status = 'published'
  order by q.sort_order;
$$;

create or replace function public.get_student_scores(p_class_code text, p_student_name text, p_level text)
returns table (
  id uuid,
  task_id uuid,
  class_code text,
  student_name text,
  level text,
  latest_score integer,
  latest_max_score integer,
  latest_accuracy integer,
  latest_duration_seconds integer,
  best_score integer,
  attempts_count integer,
  updated_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select sts.id, sts.task_id, sts.class_code, sts.student_name, sts.level,
         sts.latest_score, sts.latest_max_score, sts.latest_accuracy,
         sts.latest_duration_seconds, sts.best_score, sts.attempts_count, sts.updated_at
  from public.student_task_scores sts
  join public.tasks t on t.id = sts.task_id
  join public.classes c on c.id = t.class_id
  join public.class_students s on s.class_id = c.id
  where lower(c.class_code) = lower(trim(p_class_code))
    and lower(s.student_name) = lower(trim(p_student_name))
    and lower(sts.student_name) = lower(trim(p_student_name))
    and lower(sts.class_code) = lower(trim(p_class_code))
    and s.active = true
    and t.level = p_level
    and t.status = 'published'
  order by sts.updated_at desc;
$$;

create or replace function public.upsert_student_task_score(
  p_task_id uuid,
  p_class_code text,
  p_student_name text,
  p_level text,
  p_score integer,
  p_max_score integer,
  p_accuracy integer,
  p_duration_seconds integer default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.tasks t
    join public.classes c on c.id = t.class_id
    join public.class_students s on s.class_id = c.id
    where t.id = p_task_id
      and t.status = 'published'
      and t.level = p_level
      and lower(c.class_code) = lower(trim(p_class_code))
      and lower(s.student_name) = lower(trim(p_student_name))
      and s.active = true
  ) then
    raise exception 'Student is not authorized for this task';
  end if;

  insert into public.student_task_scores (
    task_id,
    class_code,
    student_name,
    level,
    latest_score,
    latest_max_score,
    latest_accuracy,
    latest_duration_seconds,
    best_score,
    attempts_count,
    updated_at
  )
  values (
    p_task_id,
    trim(p_class_code),
    trim(p_student_name),
    p_level,
    p_score,
    p_max_score,
    p_accuracy,
    p_duration_seconds,
    p_score,
    1,
    now()
  )
  on conflict (task_id, class_code, student_name)
  do update set
    level = excluded.level,
    latest_score = excluded.latest_score,
    latest_max_score = excluded.latest_max_score,
    latest_accuracy = excluded.latest_accuracy,
    latest_duration_seconds = excluded.latest_duration_seconds,
    best_score = greatest(public.student_task_scores.best_score, excluded.latest_score),
    attempts_count = public.student_task_scores.attempts_count + 1,
    updated_at = now();
end;
$$;

revoke all on function public.get_student_class(text, text) from public;
revoke all on function public.get_student_tasks(text, text, text) from public;
revoke all on function public.get_student_questions(text, text, text) from public;
revoke all on function public.get_student_scores(text, text, text) from public;
revoke all on function public.upsert_student_task_score(uuid, text, text, text, integer, integer, integer, integer) from public;
grant execute on function public.get_student_class(text, text) to anon, authenticated;
grant execute on function public.get_student_tasks(text, text, text) to anon, authenticated;
grant execute on function public.get_student_questions(text, text, text) to anon, authenticated;
grant execute on function public.get_student_scores(text, text, text) to anon, authenticated;
grant execute on function public.upsert_student_task_score(uuid, text, text, text, integer, integer, integer, integer) to anon, authenticated;

drop trigger if exists tasks_set_updated_at on public.tasks;
create trigger tasks_set_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

drop trigger if exists questions_set_updated_at on public.questions;
create trigger questions_set_updated_at
  before update on public.questions
  for each row execute function public.set_updated_at();

insert into public.classes (class_code, name)
values ('G7CN', 'Grade 7 Chinese')
on conflict (class_code) do nothing;

insert into public.class_students (class_id, student_name)
select id, 'Kevin'
from public.classes
where class_code = 'G7CN'
on conflict (class_id, student_name) do nothing;
