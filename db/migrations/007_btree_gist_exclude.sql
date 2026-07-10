-- Inventory management suite: prevent overlapping active loans for the same
-- physical unit at the database level.

create extension if not exists btree_gist;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'loans_unit_no_overlap'
  ) then
    alter table loans
      add constraint loans_unit_no_overlap
      exclude using gist (
        unit_id with =,
        daterange(start_date, end_date, '[]') with &&
      )
      where (
        status in ('pending', 'approved', 'checked_out', 'overdue')
        and unit_id is not null
      );
  end if;
end
$$;
