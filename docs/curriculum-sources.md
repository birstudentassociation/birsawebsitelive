# Curriculum sources

Nine faculty documents were crawled on 2026-08-01. This is the narrative
record: what each document is, how it was retrieved, and every contradiction
found across them. Every fact in `content/curriculum/*` cites one of these
documents by id (see `content/curriculum/sources.ts`).

Thai text extraction degraded in all three large documents (`mko2561`,
`handbook2021`, and `comparison2568`). Any Thai passage quoted from those
three in this record, or anywhere downstream, is unverified and should be
checked against the source PDF before it is relied on.

Exact page counts were not captured during the crawl for most documents; where
a page count is not known it is marked "not recorded" below rather than
guessed at. The one page count stated in the design spec (`comparison2568`,
358 pages) is recorded as such.

## Sources

### Sample Study Plan (Curri. 2561) — `sampleStudyPlan`

- URL: https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/Sample_Study_Plan.pdf
- What it is: the recommended term-by-term study plan for the 2561 curriculum,
  mostly a table of course codes and placeholders.
- Page count: not recorded.
- Extraction: PDF text extraction (English course codes and titles, Thai
  headings).
- Contradictions: item 7 (major requirements stated as 94 in the structure
  table and 91 in the course listing), item 8 (`EE214` titled "Introductory
  Microeconomics" here, "Introductory Macroeconomics" in the course
  descriptions), item 12 (no Year 4 Semester 2 shown in the 2564 handout;
  contrast with the 2561 มคอ.2 which does show one).

### Outline, BIR Curriculum 2018 — `outline2018`

- URL: https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/Outline_BIR_Curr_2018.pdf
- What it is: the structural outline of the 2561 curriculum, credit
  categories and their totals.
- Page count: not recorded.
- Extraction: PDF text extraction.
- Contradictions: item 7 (major requirements 94 here against 91 in the course
  listing), item 8 (`EE214` titled "Introductory Microeconomics" here, as in
  the sample plan), item 9 (`TU100` titled "Civic Engagement" here).

### BIR Curriculum 2018 Course Descriptions — `courseDescriptions2018`

- URL: https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/BIR_Curr2018_CourseDescription.pdf
- What it is: the full course catalogue for the 2561 curriculum, one entry
  per course with description and credit weight.
- Page count: not recorded.
- Extraction: PDF text extraction.
- Contradictions: item 8 (`EE214` titled "Introductory Macroeconomics" here;
  this document takes precedence per item 8's resolution), item 9 (`TU100`
  titled "Civic Education" here, against "Civic Engagement" elsewhere).

### BIR มคอ.2 2561 — `mko2561`

- URL: https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/BIR_%E0%B8%A1%E0%B8%84%E0%B8%AD_2561.pdf?v=202012190947
- What it is: the official มคอ.2 curriculum specification document for the
  2561 curriculum, filed with the ministry. Large, mostly Thai.
- Page count: not recorded. One of the three large documents whose Thai
  extraction degraded; see the note at the top of this file.
- Extraction: PDF text extraction; Thai text quality degraded, English course
  codes and numeric fields generally intact.
- Contradictions: item 10 (`PI574`'s title, taken as authoritative here per
  item 10's resolution, differs from its title in the other two 2561
  documents), item 12 (shows a Year 4 Semester 2 at 9 credits, where the 2564
  handout's sample plan shows none).

### BIR Academic Handout, Curriculum 2021 (B.E. 2564), รหัส 64, 65 — `bir64`

- URL: https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/BIR_64.pdf?v=202305101549
- What it is: the two-page student handout for the 2564 curriculum: sample
  plan, credit categories, and totals. Governs cohorts 64 and 65.
- Page count: not recorded (described in the design spec as "two pages of
  tables").
- Extraction: PDF text extraction.
- Contradictions: item 4 (the 127 graduation total is never printed as a
  single figure here; it is reached by summing 30, 91 and 6), item 11
  (`PI292` extracted as 1 credit from this document, against 3 credits
  everywhere else, almost certainly a column artifact), item 12 (no Year 4
  Semester 2 shown).

### BIR Academic Handout, Curriculum 2021 (B.E. 2564) Revision 2023, รหัส 66 — `bir64rev66`

- URL: https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/BIR_64_rev66.pdf?v=202305101549
- What it is: the 2023 revision of the 2564 handout, replacing five Year 1
  general education courses with new code families (`EL`, `LAS`, `PD`).
  Governs cohort 66, and cohort 67 by attestation (item 5). Also used as the
  basis for the inferred 2568 sequence (item 1).
- Page count: not recorded.
- Extraction: PDF text extraction.
- Contradictions: item 4 (same 127-total-as-sum issue as `bir64`), item 5
  (cohort 67's mapping to this revision is attested by BIRSA, not printed
  here or anywhere else).

### BIR Student Handbook, Revision 2021, Online Edition — `handbook2021`

- URL: https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/Handbook2021_OnlineEdition_1.pdf?v=202012190947
- What it is: the full student handbook, of which the curriculum chapter is
  one part; also the source of the academic rules (credit limits, GPA,
  semester minimums, the seven-year limit). Large, mixed English and Thai.
- Page count: not recorded. One of the three large documents whose Thai
  extraction degraded; see the note at the top of this file.
- Extraction: PDF text extraction; Thai text quality degraded in places,
  particularly in narrative sections rather than tables.
- Contradictions: item 14 (the 2561 free elective rule is grammatically
  broken in the source text; 2561 only, record only).

### BIR Double Degree, curriculum revision B.E. 2564 — `doubleDegree64`

- URL: https://image.makewebeasy.net/makeweb/0/fAusajSlU/Document/BIR_DoubleDegree_64.pdf?v=202012190947
- What it is: the double degree route definitions for the 2564 revision,
  covering five routes across three partner institutions. Out of scope for
  this service; double degree students are routed to the stop page.
- Page count: not recorded.
- Extraction: PDF text extraction.
- Contradictions: not part of the section 9 list. Recorded separately in the
  design spec's scope section: the Aberystwyth and Bristol routes are counted
  in UK module credits that do not compare to Thai credits, and the Meiji
  route 3 total is given as 162, 142 and 144 in three different places within
  this document and its companions.

### Curriculum comparison, B.E. 2564 against B.E. 2568 — `comparison2568`

- URL: https://image.makewebcdn.com/makeweb/0/fAusajSlU/Document/68_2025.pdf?v=202405291424
- What it is: a side-by-side comparison of the 2564 and 2568 curricula. The
  2568 curriculum has no published study plan handout of its own; this
  document is the only source for its credit structure, and it contains no
  sample plan.
- Page count: 358 pages. One of the three large documents whose Thai
  extraction degraded; see the note at the top of this file.
- Extraction: PDF text extraction; Thai text quality degraded, English course
  codes and numeric fields generally intact.
- Contradictions: item 1 (no sample plan for 2568; the semester sequence is
  inferred from `bir64rev66` instead), item 3 (with `PI574` at 3 credits from
  2568 onward, the stated concentration-required total of 18 only balances if
  `PI574` sits outside that category, which also explains the graduation
  total falling from 127 to 126), item 5 (cohort 69's mapping to 2568 is
  attested by BIRSA, not printed here), item 6 (the 2568 catalogue is
  code-for-code identical to 2564, so no course in this comparison
  distinguishes cohort 66 from 68).

## Contradictions affecting what a student is told

Copied verbatim from section 9 of
`docs/superpowers/specs/2026-08-01-study-plan-service-design.md`.

| # | Issue | Affects | How the service handles it |
| --- | --- | --- | --- |
| 1 | The 2568 curriculum has no published study plan handout; the 358-page comparison document contains no sample plan. | Cohorts 68, 69 (Years 1 and 2) | The semester sequence is inferred from `BIR_64_rev66`, with the credit structure taken from `68_2025`. Disclosed as an `inferred` derivation on every screen. Replace as soon as the 2568 handout exists. |
| 2 | `PI574` is 1 credit up to the 2564 family and 3 credits from 2568 onward. Attested by BIRSA on 2026-08-01, not stated in any source. | All cohorts | Resolved. Encoded per version. What remains open is where its 3 credits sit: see item 3. |
| 3 | With `PI574` at 3 credits, the stated 2568 concentration-required total of 18 only balances if `PI574` sits outside that category, which also explains the graduation total falling 127 to 126. The alternative, that it stays inside and a 3-credit course was dropped, requires a dropped course the crawl never found. | Cohorts 68, 69 | Encode reading (b): the six 3-credit courses make 18, `PI574` counts outside the 126. Disclosed on the plan screen, because it changes whether a plan reaching 126 is complete. Confirm with the faculty. |
| 4 | The 2564 graduation total of 127 is never printed as a total anywhere. It is reached by adding 30, 91 and 6. | Cohorts 64 to 67 | Use 127, disclose that it is a sum rather than a quoted figure. Ask the faculty to confirm. |
| 5 | Cohort 67 mapping to the 2023 revision, and cohort 69 to 2568, are attested by BIRSA and appear in no document. | Cohorts 67, 69 | Recorded as `provenance: attested` in the cohort map. Named on the confirm screen so the student can challenge it. |
| 6 | The 2568 catalogue is code-for-code identical to 2564, so no course distinguishes cohort 66 from 68 on the confirm screen. | Cohorts 66 to 69 | The confirm screen leans on the graduation total and the inference notice instead. Accepted weakness. |

## Contradictions recorded only, with no student-visible effect

Copied verbatim from section 9 of
`docs/superpowers/specs/2026-08-01-study-plan-service-design.md`.

| # | Issue | Resolution |
| --- | --- | --- |
| 7 | The 2561 document states major requirements as 94 in its structure table and 91 in its course listing. | Out of scope: no enrolled cohort uses 2561. Record only. |
| 8 | `EE214` is titled "Introductory Microeconomics" in the outline and sample plan, "Introductory Macroeconomics" in the course descriptions. | Course descriptions take precedence. 2561 only. |
| 9 | `TU100` is "Civic Engagement" in two documents and "Civic Education" in a third. | Pick one, footnote the other. |
| 10 | `PI574`'s title differs across all three 2561 documents. | Pick the มคอ.2 wording. |
| 11 | `PI292` extracted as 1 credit from `BIR_64`, against 3 credits everywhere else. | Almost certainly a column artifact in text extraction. Verify visually. |
| 12 | The 2564 handout's sample plan shows no Year 4 Semester 2. The 2561 มคอ.2 does show one, at 9 credits. | Treat the handout as incomplete rather than the year as empty. Ask the faculty. |
| 13 | Whether the 21-credit minor sits inside the 91-credit major total or on top of it is never stated; the arithmetic implies inside. | Confirm. |
| 14 | The 2561 free elective rule is grammatically broken in the source. | 2561 only. Record. |

Items 1 to 6 are what "sorted out before the service can be used" means in
practice. They are not enforced in the build. What enforces them instead is
the disclosure test in the design spec's testing section: the service may
ship uncertain data, but a student must be told which parts are uncertain and
where they came from.

Item 1 is the one to chase. Everything else is a number to confirm in one
conversation with the faculty; item 1 needs a document that may not exist
yet, and until it does, Years 1 and 2 are planning against a sequence written
for a curriculum that is not theirs.
