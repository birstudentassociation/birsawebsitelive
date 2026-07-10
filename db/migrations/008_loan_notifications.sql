-- Inventory management suite: loan notification dedupe columns.
-- Records when each notification kind was last sent for a loan, so the
-- daily cron job (lib/inventory/notifications.ts) never re-sends the same
-- email twice.

alter table loans add column if not exists reminder_sent_at timestamptz;
alter table loans add column if not exists overdue_notified_at timestamptz;
alter table loans add column if not exists pickup_alert_sent_at timestamptz;
