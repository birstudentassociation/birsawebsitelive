-- Course review collection: anonymous student submissions, the officer
-- moderation queue that works through them, and the published summaries the
-- course pages read. Also adds the academic_affairs officer role, which can
-- use the moderation console and nothing else in the inventory suite.
--
-- Deliberately does NOT store a name, student ID, email address, IP address
-- or user agent on a submission: the form asks for none of them, so nothing
-- in this table can identify who wrote a review. The free-text fields are
-- still unmoderated until an officer approves them, which is why raw
-- submissions are on the same two-year retention clock as everything else
-- (lib/privacy/retention.ts). Mirrors the tables appended to db/schema.sql.

-- The role check was created inline on officers.role in 001 and so carries
-- Postgres's generated name. Drop and recreate it to admit the new role.
alter table officers drop constraint if exists officers_role_check;
alter table officers add constraint officers_role_check
  check (role in ('admin', 'inventory_manager', 'loan_officer', 'read_only', 'academic_affairs'));

create table if not exists course_review_submissions (
  id uuid primary key default gen_random_uuid(),
  course_code text not null,
  -- Buddhist Era academic year, e.g. 2567, and the semester within it.
  term_year integer not null
    check (term_year between 2500 and 2700),
  term_semester text not null
    check (term_semester in ('1', '2', 'summer')),
  -- A stable key from lib/course-review/instructors.ts, or 'other' for
  -- someone not on the course's instructor list.
  instructor_key text not null,
  workload text not null,
  -- Optional reported estimate of hours a week. A band, never a number.
  workload_band text
    check (workload_band in ('under_3', '3_to_6', 'over_6')),
  assessment text not null,
  tips text[] not null default '{}',
  quote text,
  locale text not null
    check (locale in ('en', 'th')),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  moderated_by uuid references officers(id),
  moderated_at timestamptz,
  created_at timestamptz not null default now()
);

-- Powers the moderation queue, which groups by course, term and instructor.
create index if not exists course_review_submissions_group_idx
  on course_review_submissions (course_code, term_year, term_semester, instructor_key);

-- Powers the per-status counts against the publication threshold.
create index if not exists course_review_submissions_status_idx
  on course_review_submissions (status);

-- Powers the retention purge's age check.
create index if not exists course_review_submissions_created_at_idx
  on course_review_submissions (created_at);

create table if not exists published_course_reviews (
  id uuid primary key default gen_random_uuid(),
  course_code text not null,
  term_year integer not null
    check (term_year between 2500 and 2700),
  term_semester text not null
    check (term_semester in ('1', '2', 'summer')),
  instructor_key text not null,
  -- A snapshot of the instructor's name when the summary was published, so
  -- the review still reads correctly if the course's instructor list changes
  -- later. Null when instructor_key is 'other'.
  instructor_name_en text,
  instructor_name_th text,
  -- How many approved submissions the summary was drawn from. The publication
  -- threshold (PUBLICATION_THRESHOLD in lib/course-review/groups.ts) is enforced
  -- in code when this row is written, not here, so changing it needs no migration.
  review_count integer not null
    check (review_count > 0),
  workload_en text not null,
  workload_th text not null,
  assessment_en text not null,
  assessment_th text not null,
  -- [{ "en": "...", "th": "..." }]
  tips jsonb not null default '[]'::jsonb,
  -- [{ "en": "...", "th": "..." }]
  quotes jsonb not null default '[]'::jsonb,
  -- { "under_3": 2, "3_to_6": 8, "over_6": 2 }: how many students chose each
  -- band. Shown as a distribution in words, never averaged.
  band_counts jsonb not null default '{}'::jsonb,
  published_by uuid references officers(id),
  published_at timestamptz not null default now(),
  -- The submissions the summary was drawn from. Not a foreign key: raw
  -- submissions are purged after the retention period and the summary stays.
  submission_ids uuid[] not null default '{}',
  -- One published summary per group; publishing again replaces it.
  unique (course_code, term_year, term_semester, instructor_key)
);

-- Powers the course page's lookup of every summary for one course.
create index if not exists published_course_reviews_course_code_idx
  on published_course_reviews (course_code);
