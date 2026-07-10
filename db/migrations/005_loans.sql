-- Inventory management suite: loans.
-- This is a separate table from the legacy `equipment_loans` table used by
-- the existing Equipment Loan Service; do not touch that table here.

create table if not exists loans (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  item_id uuid not null references items(id),
  unit_id uuid references units(id),
  borrower_id uuid not null references borrowers(id),
  quantity int not null default 1,
  start_date date not null,
  end_date date not null,
  reason text,
  status text not null default 'pending'
    check (status in (
      'pending', 'approved', 'checked_out', 'overdue',
      'returned', 'rejected', 'cancelled', 'no_show'
    )),
  decided_by uuid references officers(id),
  decided_at timestamptz,
  checked_out_by uuid references officers(id),
  checked_out_at timestamptz,
  checked_in_by uuid references officers(id),
  checked_in_at timestamptz,
  condition_out text,
  condition_in text,
  created_at timestamptz not null default now()
);

create index if not exists loans_item_id_status_idx
  on loans (item_id, status);

create index if not exists loans_unit_id_status_idx
  on loans (unit_id, status);

create index if not exists loans_borrower_id_status_idx
  on loans (borrower_id, status);

create index if not exists loans_status_created_at_idx
  on loans (status, created_at);
