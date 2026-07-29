/**
 * Typed model for the PI (Politics and International Relations) course
 * catalogue under /student-life/course-reviews. Sourced from the
 * Faculty of Political Science, Thammasat University curriculum document
 * (BIR programme, B.E. 2568/2025 revision).
 *
 * `en` is a faithful reference translation; the Thai (`th`) is authoritative,
 * matching the convention used by `content/activity/regulations`.
 */

/** A bilingual string. `th` is the authoritative original; `en` is a translation. */
export type Bi = { en: string; th: string };

/**
 * The requirement type a course is offered under, per the curriculum's own
 * structure (หมวด 4.3.2.2). Matches the document's literal grouping so the
 * category is verifiable against the source rather than inferred.
 */
export type CourseCategory =
  | "general-education" // วิชาศึกษาทั่วไป (PI121, PI122 only: the PI-coded gen-ed courses)
  | "core" // วิชาบังคับ: required of every BIR student
  | "required" // วิชาบังคับเฉพาะ: major-required, but distinct from the "core" block
  | "elective-area" // วิชาเลือก กลุ่มอาณาบริเวณศึกษา (Area Studies)
  | "elective-approach" // วิชาเลือก กลุ่มแนวทางการศึกษา (Approaches and Issues)
  | "minor-required" // วิชาโท: วิชาบังคับศึกษา (compulsory within a minor track)
  | "minor-elective" // วิชาโท: วิชาเลือกในกลุ่มวิชา (elective within a minor track)
  | "free-elective"; // วิชาเลือกเสรี (PI574 Internship)

/**
 * The disciplinary track a course belongs to. Distinct from `category`
 * (which encodes *how* a course is required). This encodes *what field* it
 * covers, derived from the curriculum's subject-group grouping (4.3.2.1) and
 * the three วิชาโท (minor) tracks in 4.3.2.2 §2.5.
 */
export type CourseTrack =
  | "foundational" // gen-ed + core + required-major + the free-elective internship; every student takes these regardless of minor
  | "international-relations" // the Area Studies / Approaches and Issues elective pools (2.4)
  | "governance-transnational" // minor: กลุ่มวิชาโลกาภิบาลและประเด็นข้ามชาติ
  | "public-admin-policy" // minor: กลุ่มวิชาบริหารรัฐกิจและนโยบายสาธารณะ
  | "global-political-economy"; // minor: กลุ่มวิชาเศรษฐกิจการเมืองโลก

/** Lecture-lab-self-study credit breakdown, e.g. "3 (3-0-6)". */
export type CourseCredits = {
  total: number;
  lecture: number;
  lab: number;
  selfStudy: number;
};

/**
 * A course instructor, sourced from the Faculty of Political Science staff
 * directory (polsci.tu.ac.th/en/team). The name is bilingual: `en` is the
 * romanised form with academic title as shown on the faculty site, `th` is
 * the Thai form from the faculty directory. The mapping is drawn from each
 * lecturer's profile "Courses" listing; teaching assignments can change term
 * to term, so treat it as indicative.
 */
export type Instructor = {
  /** Name with academic title, e.g. "Assoc. Prof. Dr. Charlie Thame". */
  name: Bi;
  /**
   * Absolute URL of the lecturer's faculty profile page. Omitted for
   * instructors with no current profile on the faculty directory (e.g.
   * retired staff or those based in another faculty), so their name renders
   * as plain text rather than a broken link.
   */
  profileUrl?: string;
};

/** A short, optionally-attributed student quote about a course. */
export type ReviewQuote = {
  text: Bi;
  /** e.g. "3rd-year student"; kept general, never a real name. */
  attribution?: Bi;
};

/**
 * Structured, aggregated student feedback for a course, distinct from the
 * official curriculum `description`. Optional: most courses won't have this
 * until BIRSA collects real submissions (see the course detail page's
 * "no review yet" state, which invites students to write one via /contact).
 */
export type StudentReview = {
  /**
   * Marks the review as made-up demonstration content rather than real
   * student feedback, so the pages that render it can say so. Set this on
   * any review written to show the layout, and remove it once the entry is
   * replaced by an actual submission.
   */
  sample?: boolean;
  /** How many students' feedback this summary is drawn from. */
  reviewCount: number;
  /** 1 to 5, overall recommendation. */
  overallRating: number;
  /** 1 to 5, 1 = light workload, 5 = heavy. */
  workloadRating: number;
  /** 1 to 5, 1 = easy, 5 = very difficult. */
  difficultyRating: number;
  workload: Bi;
  assessmentStyle: Bi;
  tips: Bi[];
  quotes?: ReviewQuote[];
};

export type Course = {
  /** Course code, e.g. "PI280". */
  code: string;
  title: Bi;
  credits: CourseCredits;
  category: CourseCategory;
  track: CourseTrack;
  /** Curriculum year(s) the course is typically taught in, e.g. [1] or [3, 4]. */
  yearLevel: number[];
  /** Prerequisite note, when the curriculum states one (e.g. PI280 requires PI271). */
  prerequisite?: Bi;
  /**
   * Lecturer(s) who teach this course, per the faculty staff directory.
   * Present only for courses a listed lecturer names on their profile; many
   * electives have no assignment published and omit this field.
   */
  instructors?: Instructor[];
  description: Bi;
  /** Aggregated student review: present only once BIRSA has collected one. */
  review?: StudentReview;
};
