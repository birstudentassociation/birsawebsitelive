/**
 * Today's date on the calendar the portal's readers actually live on.
 *
 * Every date a student types into this site — a loan pickup date, a return
 * date — is a Thai calendar date, but the servers rendering those pages run
 * on UTC. Bangkok is UTC+7, so for the first seven hours of every Thai day
 * `new Date().toISOString().slice(0, 10)` still reports yesterday. Anything
 * that compares a user-entered date against "today" has to ask for the
 * Bangkok date or it spends those seven hours enforcing the wrong day.
 *
 * `en-CA` is used purely because it formats as `YYYY-MM-DD`, which is the
 * shape the rest of the codebase (and Postgres `date`) expects.
 */
const TIME_ZONE = "Asia/Bangkok";

/** The date in Asia/Bangkok at `now`, as `YYYY-MM-DD`. */
export function todayInBangkok(now: Date = new Date()): string {
  return now.toLocaleDateString("en-CA", { timeZone: TIME_ZONE });
}
