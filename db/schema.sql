-- Equipment Loan Service schema.
-- Run this once against the Vercel Postgres database (site owner / officer).

create extension if not exists "pgcrypto";

create table if not exists equipment_loans (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  item_key text not null,
  student_name text not null,
  student_id text not null,
  student_email text not null,
  pickup_date date not null,
  return_date date not null,
  reason text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'returned', 'cancelled')),
  decided_by text,
  decided_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists equipment_loans_item_key_status_idx
  on equipment_loans (item_key, status);

create index if not exists equipment_loans_status_created_at_idx
  on equipment_loans (status, created_at);

-- Satisfaction feedback: the GOV.UK-style "how was this service" prompt,
-- collected after a completed journey and at other stages. Deliberately does
-- NOT store IP address, user agent, name or email: the Service Manual
-- requires a feedback form to collect no personal or financial information,
-- so nothing in this table can identify who submitted a response.

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
