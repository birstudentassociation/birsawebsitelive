-- Satisfaction feedback: the GOV.UK-style "how was this service" prompt,
-- collected after a completed journey and at other stages (Service Manual,
-- "feedback pages"). Deliberately does NOT store IP address, user agent,
-- name or email: the guidance requires a feedback form to collect no
-- personal or financial information, so nothing here can identify who
-- submitted a response. Mirrors the table appended to db/schema.sql.

create table if not exists satisfaction_feedback (
  id uuid primary key default gen_random_uuid(),
  rating text not null
    check (rating in ('very_satisfied', 'satisfied', 'neither', 'dissatisfied', 'very_dissatisfied')),
  comment text,
  locale text not null
    check (locale in ('en', 'th')),
  source_path text not null,
  created_at timestamptz not null default now()
);

-- Powers the officer console's rating distribution summary.
create index if not exists satisfaction_feedback_rating_idx
  on satisfaction_feedback (rating);

-- Powers the recent-comments list and the CSV export, both newest first.
create index if not exists satisfaction_feedback_created_at_idx
  on satisfaction_feedback (created_at desc);

-- Lets the officer console group or filter feedback by the page it came from.
create index if not exists satisfaction_feedback_source_path_idx
  on satisfaction_feedback (source_path);
