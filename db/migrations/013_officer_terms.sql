-- Access register (REDESIGN-2.0 section 6.8).
--
-- Two fields, both there so an account expires by default rather than by
-- memory. Section 7.4 is that BIRSA turns over every June, and the existing
-- `is_active` flag only records that somebody remembered to switch it off.
--
-- `portfolio` scopes what an officer sees to the portfolio they hold, which is
-- what section 7.1's permission model needs to be enforceable rather than
-- documented. Null means a global officer, which `isGlobalOfficer` already
-- treats as a real state.
--
-- `term_end` is the date the grant lapses. Null means open ended, which is a
-- deliberate state rather than a missing value: the daily drift cron reports
-- both an officer past their term end AND a grant with no end date at all,
-- because an account nobody ever has to renew is the thing section 6.8 exists
-- to make visible.
alter table officers add column if not exists portfolio text;
alter table officers add column if not exists term_end date;

create index if not exists officers_term_end_idx
  on officers (term_end)
  where term_end is not null;
