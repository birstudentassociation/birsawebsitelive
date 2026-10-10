/**
 * Cross-version course equivalences: pairs of course codes that stand for the
 * same requirement in different curriculum versions.
 *
 * The curriculum modules cannot hold this. Each version lists its own courses
 * and a code that disappears simply is not there, so nothing in them says that
 * a student who passed TU104 under 2564 has met what LAS101 asks of a 2023
 * revision student. That is a judgement, so it is hand-maintained here and
 * every entry carries a `Derivation` saying where the judgement came from and,
 * when it is inferred, the reason a student can read. `verifiedBy` and
 * `verifiedOn` stay null until someone at the faculty or Academic Affairs has
 * signed the pairing off, as `Verification` does for a whole version.
 *
 * A code that exists unchanged in several versions (PI211, say) is not listed
 * here. Same code means same course, and `lib/courses/graph.ts` treats it so
 * without an entry.
 *
 * Entries are deliberately few. Only a pairing the data itself supports is
 * included, and `tests/unit/course-graph.test.ts` re-checks the facts each
 * `reason` leans on (credits, category, recommended term) so an entry cannot
 * quietly outlive them. What was left out, and why:
 *
 * - `PO211` to `PI211`, and the other 2561 prefix changes. The design spec
 *   records that core codes changed prefix wholesale between 2561 and 2564, but
 *   2561 is out of scope for this service and has no curriculum module, so
 *   neither the `PO` codes nor their titles are held anywhere in the repo.
 *   An edge needs a real code at both ends.
 * - `TU050`. The 2023 revision drops this 0-credit English course and nothing
 *   takes its place in the data, so there is no counterpart to name.
 * - `PI131` and `PI132` against `AH208` and `EL295`. The 2023 revision swaps
 *   the two-way choice in Year 1 semester 2 for another two-way choice. The slot
 *   is clearly the same one, but nothing says which course replaces which, and
 *   "Sports and Politics" does not obviously pair with either. The slot-level
 *   link is visible in each version's recommended plan already.
 */
import type { CurriculumVersionId, Derivation } from "./types";

export type Equivalence = {
  /** The code in the earlier version. */
  from: string;
  /** The code that takes its place. */
  to: string;
  /** The first version in which `to` is listed and `from` no longer is. */
  since: CurriculumVersionId;
  /** Where the pairing came from. `inferred` carries the reason shown to students. */
  derivation: Derivation;
  /** A named person at the faculty, once someone has actually checked. */
  verifiedBy: string | null;
  /** ISO date. */
  verifiedOn: string | null;
};

export const EQUIVALENCES: Equivalence[] = [
  {
    from: "TU104",
    to: "LAS101",
    since: "2564-rev2566",
    derivation: {
      kind: "inferred",
      from: "2564",
      source: "bir64rev66",
      reason: {
        en: "The 2023 revision lists LAS101 where 2564 listed TU104. Both are called Critical Thinking, Reading and Writing, carry 3 credits, count as general education part 1 and sit in Year 1 semester 2 of the recommended plan. The pairing is inferred from that and has not been confirmed by the faculty.",
        th: "หลักสูตรฉบับปรับปรุง พ.ศ. 2566 ใช้ LAS101 ในตำแหน่งเดียวกับที่หลักสูตร พ.ศ. 2564 ใช้ TU104 ทั้งสองวิชามีชื่อเดียวกันคือ Critical Thinking, Reading and Writing มี 3 หน่วยกิต นับเป็นวิชาศึกษาทั่วไป ส่วนที่ 1 และอยู่ในปี 1 ภาคเรียนที่ 2 ของแผนการเรียนที่แนะนำเหมือนกัน การจับคู่นี้เป็นข้อสรุปจากข้อมูลดังกล่าว ยังไม่ได้รับการยืนยันจากคณะ",
      },
    },
    verifiedBy: null,
    verifiedOn: null,
  },
  {
    from: "TU105",
    to: "EL105",
    since: "2564-rev2566",
    derivation: {
      kind: "inferred",
      from: "2564",
      source: "bir64rev66",
      reason: {
        en: "The 2023 revision lists EL105 where 2564 listed TU105. They are English communication courses (Communication Skills in English, then English Communication Skills), carry 3 credits, count as general education part 1 and sit in Year 1 semester 1 of the recommended plan. The pairing is inferred from that and has not been confirmed by the faculty.",
        th: "หลักสูตรฉบับปรับปรุง พ.ศ. 2566 ใช้ EL105 ในตำแหน่งเดียวกับที่หลักสูตร พ.ศ. 2564 ใช้ TU105 ทั้งสองวิชาเป็นวิชาการสื่อสารภาษาอังกฤษ (Communication Skills in English และ English Communication Skills) มี 3 หน่วยกิต นับเป็นวิชาศึกษาทั่วไป ส่วนที่ 1 และอยู่ในปี 1 ภาคเรียนที่ 1 ของแผนการเรียนที่แนะนำเหมือนกัน การจับคู่นี้เป็นข้อสรุปจากข้อมูลดังกล่าว ยังไม่ได้รับการยืนยันจากคณะ",
      },
    },
    verifiedBy: null,
    verifiedOn: null,
  },
];
