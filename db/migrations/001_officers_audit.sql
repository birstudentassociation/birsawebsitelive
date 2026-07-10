-- Inventory management suite: officers and audit log.
-- Run via scripts/migrate.mjs, not applied directly.

create extension if not exists "pgcrypto";

create table if not exists officers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  role text not null
    check (role in ('admin', 'inventory_manager', 'loan_officer', 'read_only')),
  passcode_hash text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);

create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  officer_id uuid references officers(id),
  action text not null,
  entity_type text not null,
  entity_id text not null,
  detail jsonb,
  created_at timestamptz not null default now()
);

create index if not exists officers_email_idx
  on officers (email);

create index if not exists audit_log_officer_id_created_at_idx
  on audit_log (officer_id, created_at);
