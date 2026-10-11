-- Elective demand signal: the elective courses students choose to share from
-- the study plan screen, one row per course and term, with nothing that says
-- who shared them. Academic Affairs reads the counts in the officer console,
-- and a course page says "Planned by 20 or more students" once a term crosses
-- the threshold (lib/elective-demand/threshold.ts).
--
-- Deliberately does NOT store a name, student ID, email address, cohort,
-- minor, passed courses, IP address or user agent: the form does not send
-- them, so nothing in this table can identify who shared a plan. It also has
-- no submission id, the row id is random, and the date is a day rather than a
-- timestamp, so rows from one student cannot be matched up again. Rows are on
-- the same two-year retention clock as everything else
-- (lib/privacy/retention.ts). Mirrors the table appended to db/schema.sql.

create table if not exists elective_demand_entries (
  id uuid primary key default gen_random_uuid(),
  -- The curriculum the plan follows, the one thing about the student kept.
  curriculum_version text not null
    check (curriculum_version in ('2564', '2564-rev2566', '2568')),
  course_code text not null,
  -- Buddhist Era academic year, e.g. 2569, and the semester within it.
  term_year integer not null
    check (term_year between 2500 and 2700),
  term_semester text not null
    check (term_semester in ('1', '2', 'summer')),
  -- The day it arrived, for the retention purge. A day, not a time, so rows
  -- from one submission cannot be told apart from another day's by timestamp.
  created_on date not null default current_date
);

-- Powers the per-course count a course page reads and the officer totals.
create index if not exists elective_demand_entries_course_term_idx
  on elective_demand_entries (course_code, term_year, term_semester);

-- Powers the retention purge's age check.
create index if not exists elective_demand_entries_created_on_idx
  on elective_demand_entries (created_on);
