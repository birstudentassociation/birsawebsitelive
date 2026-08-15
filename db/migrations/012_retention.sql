-- Inventory management suite: enforced two-year retention (PDPA s.37(3)).
-- Adds the column and indexes lib/privacy/retention.ts needs to find expired
-- personal data efficiently, plus purge_log, which is the evidence that a
-- system to check and delete on expiry actually runs, not just a promise in
-- the privacy notice.

-- Every terminal loan needs a "closed" timestamp distinct from created_at:
-- the retention clock for a loan starts the day it closes, not the day it
-- was requested, so an old loan that is still open must never be caught by
-- an age check. lib/inventory/loans.ts sets this column going forward
-- (decideLoan on rejection, checkinLoan on return, cancelLoan on
-- cancellation); the backfill below covers rows written before this
-- migration ran, using the best timestamp already on the row.
alter table loans add column if not exists closed_at timestamptz;

update loans
set closed_at = coalesce(checked_in_at, decided_at, created_at)
where status in ('returned', 'rejected', 'cancelled', 'no_show')
  and closed_at is null;

-- Powers purgeExpiredPersonalData()'s "closed loans older than RETENTION_YEARS" query.
create index if not exists loans_status_closed_at_idx
  on loans (status, closed_at);

-- Powers the legacy equipment_loans age check. Nothing in the current app
-- reads or writes this table any more (see db/migrations/005_loans.sql), so
-- age alone is enough to purge a row.
--
-- Guarded on the table existing, because it does not always. `equipment_loans`
-- is created by db/schema.sql, the one-time bootstrap for the pre-inventory
-- tables — it is not created by any migration. A database stood up the way the
-- README describes (attach Postgres, run scripts/migrate.mjs) therefore never
-- has it, and an unguarded `create index` here failed the whole migration,
-- taking 012 and everything after it down with it.
do $$
begin
  if to_regclass('public.equipment_loans') is not null then
    create index if not exists equipment_loans_created_at_idx
      on equipment_loans (created_at);
  end if;
end
$$;

-- Powers the borrower age check (paired with a lookup against
-- loans_borrower_id_status_idx to find borrowers with no remaining loans).
create index if not exists borrowers_updated_at_idx
  on borrowers (updated_at);

-- Powers the audit_log age check.
create index if not exists audit_log_created_at_idx
  on audit_log (created_at);

-- Powers the officer inactivity check.
create index if not exists officers_last_login_at_idx
  on officers (last_login_at);

-- Evidence that the s.37(3) system actually runs: one row per daily cron
-- run, with a per-table count of what it did. `counts` is jsonb rather than
-- one column per table so a new purge step never needs another migration
-- just to be recorded.
create table if not exists purge_log (
  id uuid primary key default gen_random_uuid(),
  ran_at timestamptz not null default now(),
  counts jsonb not null
);

create index if not exists purge_log_ran_at_idx
  on purge_log (ran_at desc);
