-- Inventory management suite: backfill items.custodian_id, then enforce it.
--
-- Migration 009 added items.custodian_id as a nullable column so existing
-- rows wouldn't break. Here we backfill every item that doesn't have a
-- custodian yet to BIRSA (marking it online-loanable, matching current
-- behaviour where every item is loanable), and only then tighten the column
-- to not-null. The update is a no-op once every row has a custodian_id, so
-- this migration is safe to rerun.

update items
set custodian_id = (select id from custodians where slug = 'birsa'),
    online_loanable = true
where custodian_id is null;

alter table items alter column custodian_id set not null;
