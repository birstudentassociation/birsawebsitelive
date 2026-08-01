# Breach response runbook

Who this is for: whichever BIRSA officer notices, or is told about, something that
looks like a personal data breach. You do not need to be the committee chair to
start this. You need to start it now.

The law behind this document is section 37(4) of the Personal Data Protection Act
B.E. 2562. It gives BIRSA **seventy-two hours** from becoming aware of a breach to
notify the Personal Data Protection Committee (PDPC), unless the breach is
unlikely to affect people's rights and freedoms. Where the risk to people is high,
BIRSA must also tell the people affected, without delay, and tell them how to
protect themselves. `BREACH_NOTIFICATION_HOURS` in
`content/privacy/register.ts` is the same number, seventy-two, so the code and
this document cannot quietly drift apart.

The clock starts when BIRSA becomes aware, not when the breach happened. Finding
out on a Tuesday about something that started last month still gives you until
Friday, not less.

## What counts as a breach

A personal data breach is any incident where personal data BIRSA holds is lost,
stolen, altered without permission, or exposed to someone who should not see it.
That includes, in plain terms:

- A database, spreadsheet, or export containing names, emails, student IDs,
  phone numbers, or loan records ends up somewhere it shouldn't: sent to the
  wrong person, posted publicly, or left on a device that gets lost or stolen.
- An officer account is compromised: someone signs in who isn't the officer, or
  a passcode is shared, guessed, or phished.
- A bug in the site exposes one person's data to another person, for example a
  loan record, borrower record, or rights request that the wrong visitor can
  read.
- A processor BIRSA uses (Resend, Vercel Postgres, Vercel Blob) reports an
  incident on their side that touches BIRSA's data.
- A laptop, phone, or paper note with borrower or officer information is lost.

If you're not sure whether something counts, treat it as a breach until someone
more senior says otherwise. Starting this process and standing it down later
costs little. Not starting it and being wrong costs a lot.

## The first hour

Do these in order. Don't wait for permission to start step 1.

1. **Write down what you know, right now, before you do anything else.** A
   plain text note is fine. Record: what happened, how you found out, what
   time you found out (this is when the clock starts), which system is
   involved, and what you've touched so far. You will need this note later and
   your memory of "just now" is more reliable than your memory of "three hours
   ago."
2. **Stop the bleeding, if you safely can, without destroying evidence.**
   Concretely:
   - Suspected compromised officer account: sign the officer out (or ask
     someone with access to `officers` in Vercel Postgres to revoke the
     session) and reset that officer's passcode before doing anything else
     with that account.
   - Data exposed in a public place (a leaked URL, a public repo, a Slack
     channel outside BIRSA): take it down or restrict access immediately, but
     note down the exact URL and timestamp first.
   - A bug exposing data between visitors: this needs a code fix, so tell a
     developer immediately (see "Who to tell" below); don't try to patch
     production yourself unless you are that developer.
   - Lost device: report it lost through the normal university/BIRSA channel
     for lost equipment as well, that's a separate but related step.
   Do not delete logs, database rows, or files to "clean up." They are
   evidence of what happened and how many people are affected. Deleting them
   makes the 72-hour report harder to write, not easier.
3. **Tell the BIRSA committee chair and the privacy contact named in the
   privacy notice at `/privacy`, immediately, by whatever channel gets a
   response fastest** (phone call beats a message that might not be read
   until morning). If it's genuinely 2am and you cannot reach anyone, keep
   going with steps 1 and 2 yourself, and keep trying to reach someone. The
   72-hour clock does not pause because it's night.
4. **Do not post about it publicly, and do not email affected people yet.**
   Public notification and people-notification happen after you understand
   the scope (see below), not before, so you don't tell people something
   wrong or incomplete. This is a matter of days at most, not an excuse to
   delay.

## Who to tell, and when

| Who | When | Why |
| --- | --- | --- |
| BIRSA committee chair and privacy contact | Immediately, within the first hour | They decide whether this is reportable and run the response |
| A developer with access to the affected system | Immediately, if the cause is technical (a bug, a compromised account, a processor incident) | Only they can stop an ongoing technical exposure |
| The PDPC | Within 72 hours of becoming aware, unless the breach is unlikely to affect people's rights and freedoms | Section 37(4) requires this |
| Affected people | Without delay, once the scope is known, if the risk to them is high | Section 37(4) requires this when risk is high, and it's the right thing to do regardless |
| Everyone else at BIRSA | Once the chair decides it's appropriate | Avoid rumour and inconsistent messages while the facts are still being established |

"Without delay" for affected people does not mean "immediately with no
information." It means as soon as BIRSA reasonably can once it knows who is
affected and what they should do, not held back for weeks while a full report
is polished.

## Working out whether it's reportable to the PDPC

A breach does **not** need reporting to the PDPC only where it is genuinely
unlikely to cause a risk to people's rights and freedoms. Ask:

- Is the data itself sensitive or capable of harm on its own (student ID plus
  name plus contact details is enough to cause real harm through impersonation
  or targeted phishing)?
- How many people are affected: one borrower record, or the whole
  `borrowers` table?
- Is the exposure still ongoing, or has it definitely stopped?
- Could someone realistically get hold of the exposed data (a public URL
  indexed by a search engine is very different from a file that only reached
  one trusted person by mistake and was deleted on request)?

If there's real doubt, report it. The PDPC would rather receive a report about
something that turns out to be minor than not receive one about something that
turns out to matter. Getting this decision right is the committee chair's call,
not something to decide alone at 2am, but you can and should keep gathering the
facts that will let them decide quickly once they're reachable.

## What to write down for the PDPC report

Whoever ends up filing the report needs, at minimum:

- What happened, and how it happened, in plain language.
- When it happened (or your best estimate) and when BIRSA became aware.
- What categories of personal data were involved (names, emails, student IDs,
  phone numbers, loan history, passcode hashes, and so on) and roughly how many
  people are affected.
- What BIRSA has already done about it (see "the first hour" above).
- What BIRSA is going to do to stop it happening again.
- A contact point at BIRSA for the PDPC to follow up with.

This is exactly the note you started in step 1 of the first hour, filled in
further as the picture becomes clearer. Keep updating it rather than starting a
new document each time new facts come in.

## Telling affected people, if the risk is high

If the committee decides the risk to people is high, tell them directly (email,
using the same address BIRSA already holds for them, is normally the fastest
route BIRSA has). Include:

- What happened, plainly, without minimising it or over-explaining the
  technical cause.
- What data of theirs was involved.
- What they can do to protect themselves: for a password or passcode
  exposure, change it and change it elsewhere if reused; for contact details,
  watch for phishing that uses the leaked information to look convincing; for
  a student ID exposure, be alert to anyone using it to impersonate them.
- Who to contact at BIRSA with questions, using the privacy contact named at
  `/privacy`.

Do not ask them to click a link to "verify" anything as part of this message.
A breach notification that itself asks people to click a link and enter
details would look exactly like the phishing attempt you're warning them
about.

## The systems this covers

Concretely, on this site, a breach could touch:

- **Vercel Postgres**: loan records, borrower records, officer accounts, the
  audit log, satisfaction feedback. The largest concentration of personal
  data on the site.
- **Resend**: every email the site sends, including contact messages, club
  proposals, loan notifications, and rights requests. A Resend-side incident
  is a BIRSA breach too, because BIRSA chose to send the data there.
- **Vercel Blob**: equipment photographs. Not usually personal data, but
  check the specific photos before assuming that.
- **The officer console**: the login itself, and everything an officer can
  see once signed in. A compromised officer account is a route into
  everything above.

## After the immediate response

Once the report is filed (or the committee has decided, with reasons written
down, that it didn't need to be), do a short write-up of what happened and
what changes as a result, technical or procedural. Keep it with this document
so the next officer who has to run this process at 2am has one more example to
learn from.
