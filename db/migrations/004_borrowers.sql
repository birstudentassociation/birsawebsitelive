-- Inventory management suite: borrowers (students who request loans).

create table if not exists borrowers (
  id uuid primary key default gen_random_uuid(),
  tu_student_id text unique not null,
  name text not null,
  email text not null,
  phone text,
  blocklisted boolean not null default false,
  blocklist_reason text,
  max_concurrent_loans int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
