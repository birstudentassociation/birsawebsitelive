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
