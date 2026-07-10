-- Inventory management suite: consumable stock adjustments.

create table if not exists consumable_adjustments (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references items(id),
  delta int not null,
  reason text,
  borrower_id uuid references borrowers(id),
  officer_id uuid references officers(id),
  resulting_qty int not null,
  created_at timestamptz not null default now()
);

create index if not exists consumable_adjustments_item_id_created_at_idx
  on consumable_adjustments (item_id, created_at);
