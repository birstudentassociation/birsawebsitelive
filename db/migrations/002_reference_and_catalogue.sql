-- Inventory management suite: categories, locations, and items catalogue.

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_en text not null,
  name_th text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists locations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_en text not null,
  name_th text not null,
  description_en text not null default '',
  description_th text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  category_id uuid references categories(id),
  name_en text not null,
  name_th text not null,
  description_en text not null default '',
  description_th text not null default '',
  tracking_mode text not null
    check (tracking_mode in ('asset', 'consumable')),
  default_location_id uuid references locations(id),
  max_loan_days int not null,
  photo_url text,
  qty_on_hand int,
  reorder_threshold int,
  is_retired boolean not null default false,
  created_by uuid references officers(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint items_consumable_qty
    check ((tracking_mode = 'consumable') = (qty_on_hand is not null))
);

create index if not exists items_category_id_idx
  on items (category_id);

create index if not exists items_is_retired_idx
  on items (is_retired);

-- Seed: health & safety category, BIRSA office location, and the first-aid
-- kit item, carried over from content/services/equipment.ts.
insert into categories (slug, name_en, name_th)
values ('health-safety', 'Health & safety', 'สุขภาพและความปลอดภัย')
on conflict do nothing;

insert into locations (slug, name_en, name_th)
values (
  'birsa-office',
  'BIRSA office (room to be confirmed)',
  'ห้อง BIRSA (รอยืนยันห้อง)'
)
on conflict do nothing;

insert into items (
  key,
  category_id,
  name_en,
  name_th,
  description_en,
  description_th,
  tracking_mode,
  default_location_id,
  max_loan_days
)
values (
  'first-aid-kit',
  (select id from categories where slug = 'health-safety'),
  'First-aid kit',
  'ชุดปฐมพยาบาล',
  'A basic first-aid kit for events and activities, stocked with bandages, antiseptic wipes, plasters, and other essential supplies. Please check contents before and after use and report anything missing or running low.',
  'ชุดปฐมพยาบาลเบื้องต้นสำหรับกิจกรรมและงานต่าง ๆ ประกอบด้วยผ้าพันแผล แอลกอฮอล์เช็ดทำความสะอาด พลาสเตอร์ปิดแผล และอุปกรณ์จำเป็นอื่น ๆ กรุณาตรวจสอบอุปกรณ์ภายในก่อนและหลังใช้งาน และแจ้งหากมีของขาดหรือใกล้หมด',
  'asset',
  (select id from locations where slug = 'birsa-office'),
  7
)
on conflict do nothing;
