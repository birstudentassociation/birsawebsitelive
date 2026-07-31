# PDPA compliance and privacy notice rewrite

Date: 2026-07-31
Status: approved

## Why

The site's privacy page carries two "Not yet confirmed" placeholders, understates
the cookies actually set (it names one; six exist), and rests every processing
activity on consent. Thailand's Personal Data Protection Act B.E. 2562 sets a
precise notice checklist and requires a working deletion mechanism, neither of
which the site currently meets.

BIRSA has now fixed the retention period: **two years, for every category of
personal data.**

## What the Act requires of this site

Read from the Act itself
(<https://ratchakitcha.soc.go.th/documents/17082307.pdf>), the provisions that
bite here are:

| Section | Obligation | Current state |
| --- | --- | --- |
| s.19 | Consent must be express, separable, plain, freely given; withdrawal as easy as giving | Consent claimed as the basis for everything, never actually collected |
| s.20 | A minor's consent needs a guardian unless the act is one a minor may do alone | Not addressed. Majority in Thailand is 20, so most first-years are minors |
| s.21 | Use only for the purpose notified at collection | Met in practice |
| s.22 | Collect only what is necessary | Met, with two exceptions noted below |
| s.23 | Six-item notice before or at collection | (2) missing entirely, (3) placeholder, (6) lists 4 of 8 rights |
| s.24 | A lawful basis for collection | Only consent claimed |
| s.27 | Use and disclosure limits | Met |
| s.28 | Cross-border transfer needs adequacy or an exception | Placeholder |
| s.30 to s.36 | Data-subject rights, 30-day deadline on s.30 | No route to exercise them |
| s.37(1) | Appropriate security measures | Strong already |
| s.37(3) | **A system that checks and deletes on expiry** | Does not exist |
| s.37(4) | Breach notification within 72 hours | No procedure |
| s.39 | Record of processing activities, inspectable | Does not exist |
| s.40 | Processor agreements | Not recorded |
| s.41 | DPO | Not required for BIRSA; contact point still needed under s.23(5) |

s.41 is worth stating plainly: BIRSA is not a state agency, does not monitor
personal data on a large scale as a core activity, and does not process s.26
sensitive data. A data protection officer is therefore **not** mandatory. A named
privacy contact is still required by s.23(5), and the notice will give one.

## Design

### 1. One register, three pages

A single typed source of truth at `content/privacy/register.ts`:

```ts
export const RETENTION_YEARS = 2;

export type ProcessingActivity = {
  id: string;
  name: LocalizedText;
  purpose: LocalizedText;
  lawfulBasis: { section: string; text: LocalizedText };
  dataCollected: LocalizedText[];
  required: LocalizedText;      // s.23(2): is it required, and what if you don't give it
  recipients: string[];         // processor ids
  retention: LocalizedText;     // derived from RETENTION_YEARS
  storage: "email" | "postgres" | "cookie" | "none";
};

export type CookieRecord = { name; purpose; maxAge; essential; setBy };
export type Processor = { id; name; role; country; dataReceived };
```

Three pages render from it, so they cannot drift apart:

- `/privacy` — the s.23 notice, rewritten.
- `/privacy/cookies` — the GOV.UK cookies-page pattern, a table of all six
  cookies plus the two localStorage keys.
- `/privacy/processing-record` — the s.39 record.

`RETENTION_YEARS` is imported by both the notice and the purge job, so the stated
period and the enforced period are the same number.

### 2. Lawful bases, remapped off consent

| Activity | Basis |
| --- | --- |
| Contact and start-a-club messages | s.24(3), steps taken at your request |
| Equipment loan request and record | s.24(3), performance of a contract |
| Borrower blocklist and loan limits | s.24(5), legitimate interest in getting equipment back |
| Officer accounts | s.24(3) |
| Audit log | s.24(5), accountability and security |
| Satisfaction feedback | s.24(5), improving the service |
| Rate-limiting IP addresses | s.24(5), security. Held in memory, never stored |

Consent is then reserved for anything genuinely optional. This removes the s.20
guardian problem: none of these rest on a minor's consent. The notice will say
so, and will explain that borrowing club equipment is in any case an act suitable
to a student's condition in life under s.24 of the Civil and Commercial Code, so
a minor may do it alone.

### 3. Enforced two-year retention (s.37(3))

`lib/privacy/retention.ts` exports `purgeExpiredPersonalData()`, called from the
existing daily cron at `app/api/cron/daily/route.ts`. It runs in one transaction
and returns a per-table count for the cron's JSON response.

Order matters, because of foreign keys:

1. `loans` where the loan closed (returned, rejected, or cancelled) more than two
   years ago — deleted.
2. `equipment_loans` (the legacy table) older than two years — deleted.
3. `borrowers` with no remaining loan rows and not updated within two years —
   deleted.
4. `audit_log` older than two years — deleted.
5. `satisfaction_feedback` older than two years — deleted. The free-text comment
   is unmoderated and may contain whatever a visitor chose to type.
6. `custodians` contact fields, where the club has been inactive two years —
   cleared.
7. `officers` who have been inactive two years — **anonymised, not deleted**,
   because `audit_log.officer_id` and `loans.decided_by` reference them and
   nulling those would gut the accountability record s.37(1) depends on. Name,
   email and passcode hash are overwritten with a tombstone.

An open loan is never purged regardless of age: the two-year clock starts when
the loan closes, not when it opens. The notice says this explicitly.

A `db/migrations/012_retention.sql` adds the indexes the purge needs and a
`purge_log` table recording each run, which doubles as evidence for s.37(3).

### 4. Notice at the point of collection (s.23)

s.23 requires the notice *before or at* collection, so a separate page is not
enough on its own. Each journey gets a short privacy line linking to `/privacy`,
on the step where the first identifying field is asked:

contact (name), clubs/start (name), equipment-loan request (name), loan status
lookup (email), feedback (comment), officer login (email).

Each line also carries the s.23(2) point the current page omits entirely: whether
the field is required and what happens if you do not give it. For example, on the
student ID step: "We need your student ID to check your loan limit. Without it we
cannot process the request."

### 5. Rights requests (s.30 to s.36)

A new `/privacy/your-data` journey, built on the site's existing server-driven
one-question-per-page pattern with a `birsa_rights_draft` cookie:

`start → what (request type) → name → email → details → check → sent`

Request types map one-to-one onto the Act: access and copy (s.30), portability
(s.31), object (s.32), delete (s.33), restrict (s.34), correct (s.35 and s.36),
withdraw consent (s.19), complain (s.73). The submission emails BIRSA a
structured request naming the section and the 30-day deadline s.30 imposes, so a
request cannot arrive looking like ordinary correspondence.

The confirmation page tells the requester the 30-day deadline too.

### 6. Data minimisation fixes found in the audit

- `audit_log` detail stores the officer's email on login and on officer creation,
  which is redundant beside `officer_id`. Remove it.
- `feedbackCsv()` is uncapped. Cap it to match `listRecentFeedback`.
- The Google Forms embed hands data straight to Google. Add a notice above the
  embed saying so, since BIRSA does not control those forms.
- OpenStreetMap tile requests expose the visitor's IP to a third party. Disclose
  it in the notice; it is too useful to remove.

### 7. Cross-border transfers (s.28)

Replace the placeholder with the real analysis. Resend and Vercel are both in the
United States, which the PDPC has not found adequate. The transfer relies on
**s.28(3)**, necessary for the performance of a contract with the data subject or
to take steps at their request, together with the appropriate safeguards in each
provider's data processing agreement under s.29 paragraph 3. Stated plainly, with
no claim that an adequacy decision exists.

### 8. Documents

- `docs/pdpa/breach-response.md` — the s.37(4) 72-hour procedure.
- `docs/pdpa/processor-agreements.md` — the s.40 register, with a "BIRSA must
  do" list for the agreements only the committee can sign.

## Writing

The notice follows the site's existing standards: GOV.UK plain language, no em
dashes, ranges written "two years" not "2 yrs", contractions in English, Thai in
its own register rather than translated English. Sections are short, each headed
with the question a reader is actually asking ("How long we keep it", "Sending
data outside Thailand").

## What this design does not do

Three things need a BIRSA committee decision and cannot be settled in code. The
notice is written so they are visible rather than hidden:

1. Naming the privacy contact person. The notice uses the BIRSA inbox until a
   name is chosen.
2. Signing data processing agreements with Resend and Vercel under s.40.
3. Auditing what the embedded Google Forms actually collect.

## Testing

- Unit tests for `purgeExpiredPersonalData()` against a seeded schema, covering
  the foreign-key order, the open-loan exemption, and officer anonymisation.
- Existing form-journey smoke tests extended to the `/privacy/your-data` journey.
- A test asserting the notice's stated retention equals `RETENTION_YEARS`, so the
  prose and the code cannot diverge.
