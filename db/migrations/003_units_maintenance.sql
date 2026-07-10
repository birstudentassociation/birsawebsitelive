-- Inventory management suite: individually-tracked units and their maintenance log.

create table if not exists units (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references items(id),
  label text not null,
  condition text not null default 'good'
    check (condition in ('good', 'worn', 'damaged', 'lost')),
  state text not null default 'available'
    check (state in ('available', 'reserved', 'on_loan', 'maintenance', 'retired')),
  location_id uuid references locations(id),
  photo_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (item_id, label)
);

create table if not exists maintenance_log (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references units(id),
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  issue text not null,
  action_taken text,
  condition_before text,
  condition_after text,
  officer_id uuid references officers(id),
  created_at timestamptz not null default now()
);

create index if not exists units_item_id_state_idx
  on units (item_id, state);

create index if not exists units_location_id_idx
  on units (location_id);

create index if not exists maintenance_log_unit_id_opened_at_idx
  on maintenance_log (unit_id, opened_at);

-- Seed: one physical unit for the first-aid kit.
insert into units (item_id, label)
values ((select id from items where key = 'first-aid-kit'), 'FAK-01')
on conflict do nothing;
