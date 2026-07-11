-- Inventory management suite: custodian organisations (BIRSA + clubs).
-- Adds club multi-tenancy: every item and officer can be scoped to an
-- owning custodian organisation.

create table if not exists custodians (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  kind text not null
    check (kind in ('birsa', 'club')),
  name_en text not null,
  name_th text not null,
  contact_name_en text not null default '',
  contact_name_th text not null default '',
  contact_email text,
  contact_instagram text,
  contact_other text,
  borrow_note_en text not null default '',
  borrow_note_th text not null default '',
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists custodians_is_active_idx
  on custodians (is_active);

alter table officers add column if not exists custodian_id uuid references custodians(id);

alter table items add column if not exists custodian_id uuid references custodians(id);
alter table items add column if not exists online_loanable boolean not null default false;

create index if not exists items_custodian_id_idx
  on items (custodian_id);

create index if not exists officers_custodian_id_idx
  on officers (custodian_id);

-- Seed: BIRSA plus the four clubs.
insert into custodians (slug, kind, name_en, name_th, sort_order)
values
  ('birsa', 'birsa', 'BIRSA', 'BIRSA', 0),
  ('bir-football', 'club', 'BIR Football', 'ฟุตบอล BIR', 1),
  ('bir-volleyball', 'club', 'BIR Volleyball', 'วอลเลย์บอล BIR', 2),
  ('bir-basketball', 'club', 'BIR Basketball', 'บาสเกตบอล BIR', 3),
  ('asa-ir', 'club', 'ASA IR', 'ASA IR', 4)
on conflict do nothing;
