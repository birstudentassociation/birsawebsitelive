# How we know if a service works

Service Standard point 10 asks every service to say what success looks like and to measure
it. This is that, for BIRSA's four form services and the site as a whole. The committee
reviews the numbers each semester and publishes a summary on `/standards`.

Everything here is measured without personal data: page counts from cookieless Vercel
Analytics, counts from BIRSA's own database, and answers to the feedback form. Pages listed in
`lib/analytics-exclusions.ts` (welfare, safety, complaints, personal data requests) are never
measured, by design.

## Borrow equipment

**Purpose.** Students can borrow the association's equipment without finding an officer first.

| Measure                | How                                                                             |
| ---------------------- | ------------------------------------------------------------------------------- |
| Completion rate        | Loan requests submitted (database) divided by visits to the first question page |
| Time to a decision     | Median hours from request to approve or decline (database)                      |
| Satisfaction           | Feedback form answers from the confirmation page                                |
| Loans returned on time | Share of loans checked in by the due date (database)                            |

## Plan your studies

**Purpose.** Students can check a study plan against the curriculum rules without an advisor
appointment for the routine questions.

| Measure            | How                                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| Completion rate    | Visits to the plan page divided by visits to the first question page                                      |
| "Cannot help" rate | Visits to the cannot-help page divided by starts: a rising number means the tool is missing a common case |
| Satisfaction       | Feedback form answers                                                                                     |

## Start a club

**Purpose.** Students can propose a club without knowing whom to ask.

| Measure         | How                                                             |
| --------------- | --------------------------------------------------------------- |
| Completion rate | Proposals received divided by visits to the first question page |
| Time to a reply | Days from proposal to first reply (officer log)                 |

## Contact BIRSA and Ask about your data

Not measured with analytics: people use these to complain or to exercise legal rights, and
being counted should never be a reason not to. Measure only what the inbox already shows:
number of messages each month, and days to first reply.

## The website as a whole

Not transactional, so measured with a usability benchmark (GOV.UK Service Manual, "usability
benchmarking"). Each semester, 10 or more students try the same five tasks, and we record
whether they succeed and how long it takes:

1. Find the next BIRSA event.
2. Borrow a projector.
3. Check whether a failed course has to be retaken.
4. Contact the welfare officer.
5. Find a club to join.

Keep the tasks the same from year to year, so the results can be compared. Include students
who use assistive technology.

## A known gap

Completion rates need each journey to end on a page with its own address. Loan requests and
club proposals currently show their confirmation on the check-answers page, so completions
are counted from the database instead. Giving each journey its own confirmation page is item
Q7 in `docs/GDS-ALIGNMENT-PLAN.md`.
