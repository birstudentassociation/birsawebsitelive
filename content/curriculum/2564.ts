/**
 * Curriculum 2021 (B.E. 2564) as published for cohorts 64 and 65 in
 * `BIR_64.pdf`. The 127-credit total is never printed as a total in that
 * document; it is 30 + 91 + 6, which is recorded as a contradiction and
 * disclosed to the student.
 *
 * Prerequisites come from the Student Handbook, which lists them inline with
 * its course descriptions. The handout itself states none.
 */
import { SOURCES } from "./sources";
import type { CurriculumVersion, Course, CreditCategory, Minor, PlannedTerm } from "./types";

const categories: CreditCategory[] = [
  {
    id: "genEdPart1",
    name: { en: "General education, part 1", th: "วิชาศึกษาทั่วไป ส่วนที่ 1" },
    credits: 21,
    chooseFrom: false,
  },
  {
    id: "genEdPart2",
    name: { en: "General education, part 2", th: "วิชาศึกษาทั่วไป ส่วนที่ 2" },
    credits: 9,
    chooseFrom: false,
  },
  { id: "core", name: { en: "Core courses", th: "วิชาแกน" }, credits: 30, chooseFrom: false },
  {
    id: "concentrationRequired",
    name: { en: "Required courses in concentration", th: "วิชาบังคับในสาขา" },
    credits: 19,
    chooseFrom: false,
  },
  {
    id: "economics",
    name: { en: "Required course in Faculty of Economics", th: "วิชาบังคับคณะเศรษฐศาสตร์" },
    credits: 3,
    chooseFrom: false,
  },
  {
    id: "concentrationElectiveArea",
    name: { en: "Elective courses, area studies", th: "วิชาเลือกในสาขา กลุ่มอาณาบริเวณศึกษา" },
    credits: 9,
    chooseFrom: true,
  },
  {
    id: "concentrationElectiveApproaches",
    name: {
      en: "Elective courses, approaches and issues",
      th: "วิชาเลือกในสาขา กลุ่มแนวทางและประเด็นศึกษา",
    },
    credits: 9,
    chooseFrom: true,
  },
  {
    id: "minorRequired",
    name: { en: "Minor required courses", th: "วิชาโท วิชาบังคับ" },
    credits: 9,
    chooseFrom: false,
  },
  {
    id: "minorElective",
    name: { en: "Minor elective courses", th: "วิชาโท วิชาเลือก" },
    credits: 6,
    chooseFrom: true,
  },
  {
    id: "minorElectiveOther",
    name: { en: "Elective courses in other minors", th: "วิชาเลือกในวิชาโทอื่น" },
    credits: 6,
    chooseFrom: true,
  },
  {
    id: "freeElective",
    name: { en: "Free electives", th: "วิชาเลือกเสรี" },
    credits: 6,
    chooseFrom: true,
  },
];

const courses: Course[] = [
  // General education, part 1 (21 credits)
  { code: "TU050", title: "English Skill Development", credits: 0, category: "genEdPart1", prerequisites: [], excludedFromTotal: true },
  { code: "TU100", title: "Civic Engagement", credits: 3, category: "genEdPart1", prerequisites: [] },
  { code: "TU101", title: "Thailand, ASEAN and the World", credits: 3, category: "genEdPart1", prerequisites: [] },
  { code: "TU102", title: "Social Life Skills", credits: 3, category: "genEdPart1", prerequisites: [] },
  { code: "TU103", title: "Life and Sustainability", credits: 3, category: "genEdPart1", prerequisites: [] },
  { code: "TU104", title: "Critical Thinking, Reading, and Writing", credits: 3, category: "genEdPart1", prerequisites: [] },
  { code: "TU105", title: "Communication Skills in English", credits: 3, category: "genEdPart1", prerequisites: [] },
  { code: "TU106", title: "Creativity and Communication", credits: 3, category: "genEdPart1", prerequisites: [] },

  // General education, part 2 (9 credits)
  { code: "PI121", title: "Introduction to Social Science", credits: 3, category: "genEdPart2", prerequisites: [] },
  { code: "PI122", title: "Introduction to Humanities", credits: 3, category: "genEdPart2", prerequisites: [] },
  { code: "PI131", title: "Sports and Politics", credits: 3, category: "genEdPart2", prerequisites: [] },
  { code: "PI132", title: "Data, Science and Technology Governance", credits: 3, category: "genEdPart2", prerequisites: [] },

  // Core courses (30 credits). Prerequisites from the Handbook.
  { code: "PI210", title: "Introduction to Political Philosophy", credits: 3, category: "core", prerequisites: [] },
  { code: "PI211", title: "Introduction to Political Science", credits: 3, category: "core", prerequisites: [] },
  { code: "PI241", title: "Introduction to Public Administration and Public Policy", credits: 3, category: "core", prerequisites: [] },
  { code: "PI271", title: "Introduction to International Relations", credits: 3, category: "core", prerequisites: [] },
  { code: "PI280", title: "International Relations Theories and Current Affairs", credits: 3, category: "core", prerequisites: ["PI271"] },
  { code: "PI282", title: "Reading and Analysis in International Relations", credits: 3, category: "core", prerequisites: [] },
  { code: "PI300", title: "Social Science Methodology", credits: 3, category: "core", prerequisites: ["PI211"] },
  { code: "PI320", title: "Comparative Politics", credits: 3, category: "core", prerequisites: ["PI211"] },
  { code: "PI321", title: "Thai Politics and Government", credits: 3, category: "core", prerequisites: ["PI211"] },
  { code: "PI390", title: "Global Political Economy", credits: 3, category: "core", prerequisites: ["PI271"] },

  // Required courses in concentration (19 credits)
  { code: "PI270", title: "Diplomatic History", credits: 3, category: "concentrationRequired", prerequisites: [] },
  { code: "PI272", title: "Foreign Policy Analysis", credits: 3, category: "concentrationRequired", prerequisites: [] },
  { code: "PI291", title: "International Law", credits: 3, category: "concentrationRequired", prerequisites: [] },
  { code: "PI292", title: "International Organizations and Regimes", credits: 3, category: "concentrationRequired", prerequisites: [] },
  { code: "PI370", title: "Thai Foreign Affairs", credits: 3, category: "concentrationRequired", prerequisites: [] },
  { code: "PI470", title: "Seminar: International Relations Theories", credits: 3, category: "concentrationRequired", prerequisites: [] },
  { code: "PI574", title: "Internship in Politics and International Relations", credits: 1, category: "concentrationRequired", prerequisites: [] },

  // Required course in Faculty of Economics (3 credits)
  { code: "EE210", title: "Introductory Economics", credits: 3, category: "economics", prerequisites: [] },

  // Elective courses in concentration, Area Studies Group (choose 3 of 12, 9 credits).
  // Every area studies elective takes ["PI280"] as its prerequisite, per the Handbook.
  { code: "PI364", title: "Middle East in Global Politics", credits: 3, category: "concentrationElectiveArea", prerequisites: ["PI280"] },
  { code: "PI365", title: "Russia in Global Politics", credits: 3, category: "concentrationElectiveArea", prerequisites: ["PI280"] },
  { code: "PI366", title: "The United States of America in Global Politics", credits: 3, category: "concentrationElectiveArea", prerequisites: ["PI280"] },
  { code: "PI367", title: "Europe in Global Politics", credits: 3, category: "concentrationElectiveArea", prerequisites: ["PI280"] },
  { code: "PI368", title: "South Asia in Global Politics", credits: 3, category: "concentrationElectiveArea", prerequisites: ["PI280"] },
  { code: "PI369", title: "Africa in Global Politics", credits: 3, category: "concentrationElectiveArea", prerequisites: ["PI280"] },
  { code: "PI374", title: "China in Global Politics", credits: 3, category: "concentrationElectiveArea", prerequisites: ["PI280"] },
  { code: "PI375", title: "Latin America in Global Politics", credits: 3, category: "concentrationElectiveArea", prerequisites: ["PI280"] },
  { code: "PI378", title: "Japan in Global Politics", credits: 3, category: "concentrationElectiveArea", prerequisites: ["PI280"] },
  { code: "PI474", title: "East Asia in Global Politics", credits: 3, category: "concentrationElectiveArea", prerequisites: ["PI280"] },
  { code: "PI475", title: "Southeast Asia in Global Politics", credits: 3, category: "concentrationElectiveArea", prerequisites: ["PI280"] },
  { code: "PI476", title: "ASEAN in Global Politics", credits: 3, category: "concentrationElectiveArea", prerequisites: ["PI280"] },

  // Elective courses in concentration, Approaches and Issues Group (choose 3 of 13, 9 credits).
  { code: "PI376", title: "Alternative Approaches in International Relations", credits: 3, category: "concentrationElectiveApproaches", prerequisites: [] },
  { code: "PI377", title: "Security Studies", credits: 3, category: "concentrationElectiveApproaches", prerequisites: [] },
  { code: "PI379", title: "Religion and Global Politics", credits: 3, category: "concentrationElectiveApproaches", prerequisites: [] },
  { code: "PI477", title: "Global Geopolitics", credits: 3, category: "concentrationElectiveApproaches", prerequisites: [] },
  { code: "PI478", title: "Political Psychology and International Relations", credits: 3, category: "concentrationElectiveApproaches", prerequisites: [] },
  { code: "PI479", title: "Global Politics through Film", credits: 3, category: "concentrationElectiveApproaches", prerequisites: [] },
  { code: "PI483", title: "Seminar: Non-Western International Relations Theories", credits: 3, category: "concentrationElectiveApproaches", prerequisites: [] },
  { code: "PI484", title: "Seminar: International Regimes, Institutions, and Governance", credits: 3, category: "concentrationElectiveApproaches", prerequisites: [] },
  { code: "PI485", title: "Selected Topics in Political Science", credits: 3, category: "concentrationElectiveApproaches", prerequisites: [] },
  { code: "PI486", title: "Comparative Regionalism", credits: 3, category: "concentrationElectiveApproaches", prerequisites: [] },
  { code: "PI487", title: "The International Relations of Rising Powers", credits: 3, category: "concentrationElectiveApproaches", prerequisites: [] },
  { code: "PI488", title: "Classical Theories in International Relations", credits: 3, category: "concentrationElectiveApproaches", prerequisites: [] },
  { code: "PI489", title: "Epistemology and Global Politics", credits: 3, category: "concentrationElectiveApproaches", prerequisites: [] },

  // Minor courses. Every course belonging to any of the three minors takes
  // `category: "minor"`, never one of the three minor requirement buckets.
  // Which bucket a course counts toward depends on which minor the student
  // chose, and is resolved at runtime; see the `CategoryId` comment in
  // types.ts and the `minors` array below.

  // Governance and Transnational Studies
  { code: "PI380", title: "Nation-State and Transnationalism", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI381", title: "Globalization and Global Governance", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI382", title: "Politics of International Development", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI313", title: "Media and Global Politics", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI373", title: "Transnational Crime and Global Governance", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI383", title: "Ethics and International Relations", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI384", title: "Selected Topics in Global Governance", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI385", title: "Peace Studies", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI386", title: "Gender Studies", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI387", title: "Environment and Global Politics", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI388", title: "Human Security in Global Politics", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI389", title: "Global Civil Society", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI413", title: "Seminar: Globalization, Regional Grouping and the State", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI414", title: "Seminar: International Conflict and Resolutions", credits: 3, category: "minor", prerequisites: [] },

  // Public Administration and Public Policy
  { code: "PI340", title: "Public Policy and Management in the Global Context", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI341", title: "Policy Analysis and Evaluation: Concepts and Techniques", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI342", title: "Organization and Human Resource Management: Theories and Practices", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI343", title: "Strategic Planning and Management", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI344", title: "Environmental Management and Policy", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI345", title: "Disaster and Emergency Management", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI346", title: "Urban Planning and Development Policy", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI347", title: "Fiscal and Budgeting", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI348", title: "Comparative Public Administration", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI349", title: "Information Technology Management in the Public Sector", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI443", title: "Selected Topics in Public Policy", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI444", title: "Selected Topics in Public Administration", credits: 3, category: "minor", prerequisites: [] },

  // Global Political Economy
  { code: "PI392", title: "Comparative Political Economy", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI480", title: "Seminar: Issues in Global Political Economy", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI490", title: "Political Economy of Development", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI293", title: "Introduction to Political Economy", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI395", title: "International Political Economy in Asia", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI396", title: "Game Theory for Political Scientists", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI397", title: "Public Choice in Global Affairs", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI398", title: "Politics of International Trade", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI399", title: "Politics of International Finance", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI494", title: "Selected Topics in International Political Economy", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI495", title: "Contemporary Debates in Global Political Economy", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI496", title: "Economic Diplomacy and Negotiation", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI497", title: "Politics of International Trade in Services", credits: 3, category: "minor", prerequisites: [] },
  { code: "PI498", title: "Global Politics of Digital Economy", credits: 3, category: "minor", prerequisites: [] },
];

/**
 * The three minors, transcribed from the same MDX file. `required` is the
 * 9 credits every student in that minor takes; `electives` is the pool they
 * choose 2 courses from. A course in another minor's lists counts toward the
 * 6 credits of "electives in other minors".
 */
const minors: Minor[] = [
  {
    id: "governance",
    name: {
      en: "Governance and Transnational Studies",
      th: "ธรรมาภิบาลและการศึกษาข้ามชาติ",
    },
    required: ["PI380", "PI381", "PI382"],
    electives: [
      "PI313",
      "PI373",
      "PI383",
      "PI384",
      "PI385",
      "PI386",
      "PI387",
      "PI388",
      "PI389",
      "PI413",
      "PI414",
    ],
  },
  {
    id: "publicAdministration",
    name: {
      en: "Public Administration and Public Policy",
      th: "บริหารรัฐกิจและนโยบายสาธารณะ",
    },
    required: ["PI340", "PI341", "PI342"],
    electives: ["PI343", "PI344", "PI345", "PI346", "PI347", "PI348", "PI349", "PI443", "PI444"],
  },
  {
    id: "globalPoliticalEconomy",
    name: { en: "Global Political Economy", th: "เศรษฐศาสตร์การเมืองโลก" },
    required: ["PI392", "PI480", "PI490"],
    electives: [
      "PI293",
      "PI395",
      "PI396",
      "PI397",
      "PI398",
      "PI399",
      "PI494",
      "PI495",
      "PI496",
      "PI497",
      "PI498",
    ],
  },
];

/**
 * The Handout's four-year study plan. Year 1 uses the 2564 general education
 * codes; TU050 is exemption-dependent and excluded from the total, so it does
 * not appear as a fixed plan entry. Years 2 to 4 are identical to the 2023
 * revision. The Handout for this version does not list a Semester 2 for
 * Year 4; a student's final semester is arranged with the Registrar's Office.
 */
const recommendedPlan: PlannedTerm[] = [
  {
    term: { year: 1, kind: "semester1" },
    optional: false,
    entries: [
      { kind: "course", code: "TU100" },
      { kind: "course", code: "TU101" },
      { kind: "course", code: "TU103" },
      { kind: "course", code: "TU105" },
      { kind: "course", code: "TU106" },
      { kind: "course", code: "PI121" },
    ],
  },
  {
    term: { year: 1, kind: "semester2" },
    optional: false,
    entries: [
      { kind: "course", code: "TU102" },
      { kind: "course", code: "TU104" },
      { kind: "course", code: "PI122" },
      {
        kind: "placeholder",
        id: "genEdPart2Elective1",
        label: {
          en: "Select 1 course from: PI131 Sports and Politics, or PI132 Data, Science and Technology Governance",
          th: "เลือก 1 วิชาจาก PI131 กีฬาและการเมือง หรือ PI132 ข้อมูล วิทยาศาสตร์ และธรรมาภิบาลเทคโนโลยี",
        },
        category: "genEdPart2",
      },
      { kind: "course", code: "PI211" },
      { kind: "course", code: "PI271" },
    ],
  },
  {
    term: { year: 2, kind: "semester1" },
    optional: false,
    entries: [
      { kind: "course", code: "PI210" },
      { kind: "course", code: "PI241" },
      { kind: "course", code: "PI280" },
      { kind: "course", code: "PI282" },
      { kind: "course", code: "PI291" },
      { kind: "course", code: "EE210" },
    ],
  },
  {
    term: { year: 2, kind: "semester2" },
    optional: false,
    entries: [
      { kind: "course", code: "PI270" },
      { kind: "course", code: "PI272" },
      { kind: "course", code: "PI292" },
      { kind: "course", code: "PI321" },
      { kind: "course", code: "PI370" },
      {
        kind: "placeholder",
        id: "approachesElective1",
        label: {
          en: "Elective course in concentration (Approaches and Issues Group) 1",
          th: "วิชาเลือกในสาขา (กลุ่มแนวทางและประเด็นศึกษา) 1",
        },
        category: "concentrationElectiveApproaches",
      },
    ],
  },
  {
    term: { year: 2, kind: "summer" },
    optional: true,
    entries: [
      {
        kind: "placeholder",
        id: "minorElective1",
        label: { en: "Minor elective course 1", th: "วิชาโท วิชาเลือก 1" },
        category: "minorElective",
      },
      {
        kind: "placeholder",
        id: "minorElectiveOther1",
        label: {
          en: "Minor elective course in other minors 1",
          th: "วิชาเลือกในวิชาโทอื่น 1",
        },
        category: "minorElectiveOther",
      },
    ],
  },
  {
    term: { year: 3, kind: "semester1" },
    optional: false,
    entries: [
      { kind: "course", code: "PI300" },
      { kind: "course", code: "PI390" },
      {
        kind: "placeholder",
        id: "minorRequired1",
        label: { en: "Minor required course 1", th: "วิชาโท วิชาบังคับ 1" },
        category: "minorRequired",
      },
      {
        kind: "placeholder",
        id: "minorRequired2",
        label: { en: "Minor required course 2", th: "วิชาโท วิชาบังคับ 2" },
        category: "minorRequired",
      },
      {
        kind: "placeholder",
        id: "areaElective1",
        label: {
          en: "Elective course in concentration (Area Studies Group) 1",
          th: "วิชาเลือกในสาขา (กลุ่มอาณาบริเวณศึกษา) 1",
        },
        category: "concentrationElectiveArea",
      },
      {
        kind: "placeholder",
        id: "freeElective1",
        label: { en: "Free elective course 1", th: "วิชาเลือกเสรี 1" },
        category: "freeElective",
      },
    ],
  },
  {
    term: { year: 3, kind: "semester2" },
    optional: false,
    entries: [
      { kind: "course", code: "PI320" },
      {
        kind: "placeholder",
        id: "minorRequired3",
        label: { en: "Minor required course 3", th: "วิชาโท วิชาบังคับ 3" },
        category: "minorRequired",
      },
      {
        kind: "placeholder",
        id: "minorElective2",
        label: { en: "Minor elective course 2", th: "วิชาโท วิชาเลือก 2" },
        category: "minorElective",
      },
      {
        kind: "placeholder",
        id: "approachesElective2",
        label: {
          en: "Elective course in concentration (Approaches and Issues Group) 2",
          th: "วิชาเลือกในสาขา (กลุ่มแนวทางและประเด็นศึกษา) 2",
        },
        category: "concentrationElectiveApproaches",
      },
      {
        kind: "placeholder",
        id: "areaElective2",
        label: {
          en: "Elective course in concentration (Area Studies Group) 2",
          th: "วิชาเลือกในสาขา (กลุ่มอาณาบริเวณศึกษา) 2",
        },
        category: "concentrationElectiveArea",
      },
      {
        kind: "placeholder",
        id: "freeElective2",
        label: { en: "Free elective course 2", th: "วิชาเลือกเสรี 2" },
        category: "freeElective",
      },
    ],
  },
  {
    term: { year: 3, kind: "summer" },
    optional: false,
    entries: [{ kind: "course", code: "PI574" }],
  },
  {
    term: { year: 4, kind: "semester1" },
    optional: false,
    entries: [
      { kind: "course", code: "PI470" },
      {
        kind: "placeholder",
        id: "approachesElective3",
        label: {
          en: "Elective course in concentration (Approaches and Issues Group) 3",
          th: "วิชาเลือกในสาขา (กลุ่มแนวทางและประเด็นศึกษา) 3",
        },
        category: "concentrationElectiveApproaches",
      },
      {
        kind: "placeholder",
        id: "areaElective3",
        label: {
          en: "Elective course in concentration (Area Studies Group) 3",
          th: "วิชาเลือกในสาขา (กลุ่มอาณาบริเวณศึกษา) 3",
        },
        category: "concentrationElectiveArea",
      },
      {
        kind: "placeholder",
        id: "minorElectiveOther2",
        label: {
          en: "Minor elective course in other minors 2",
          th: "วิชาเลือกในวิชาโทอื่น 2",
        },
        category: "minorElectiveOther",
      },
    ],
  },
];

export const curriculum2564: CurriculumVersion = {
  id: "2564",
  label: { en: "Curriculum 2021 (B.E. 2564)", th: "หลักสูตร พ.ศ. 2564" },
  cohorts: [
    { code: "64", provenance: { kind: "document", source: "bir64", page: 1 } },
    { code: "65", provenance: { kind: "document", source: "bir64", page: 1 } },
  ],
  graduationCredits: { value: 127, derivation: { kind: "published", source: "bir64" } },
  categories,
  minors,
  courses: { value: courses, derivation: { kind: "published", source: "bir64" } },
  recommendedPlan: { value: recommendedPlan, derivation: { kind: "published", source: "bir64" } },
  rules: {
    value: {
      minCreditsRegularTerm: 9,
      maxCreditsRegularTerm: 21,
      maxCreditsSummerTerm: 6,
      minSemesters: 7,
      maxYears: 7,
      minGpa: 2,
      source: {
        document: "handbook2021",
        provision:
          "Thammasat University Bachelor Degrees Regulations, 3rd Edition (2012), item 10.4",
      },
    },
    derivation: { kind: "published", source: "handbook2021" },
  },
  distinguishingCourses: ["TU105", "TU104", "PI121"],
  verification: {
    verifiedBy: null,
    verifiedOn: null,
    sources: [SOURCES.bir64, SOURCES.handbook2021],
    contradictions: [
      {
        id: "total-never-printed",
        summary:
          "The 127-credit graduation total is never printed as a total in BIR_64.pdf. It is 30 + 91 + 6.",
        disclosure: {
          en: "The 127-credit total is not printed in the handout. We worked it out by adding the three parts together. Check it with your advisor.",
          th: "เอกสารหลักสูตรไม่ได้ระบุยอดรวม 127 หน่วยกิตไว้โดยตรง ยอดนี้ได้จากการรวมสามหมวดเข้าด้วยกัน โปรดตรวจสอบกับอาจารย์ที่ปรึกษา",
        },
      },
    ],
  },
};
