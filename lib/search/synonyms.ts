/**
 * Bilingual synonym groups.
 *
 * Two problems this solves. First, students search in whichever language
 * comes to mind, often mixing both in one query, while a page is written in
 * only one: someone typing "หอพัก" should still find the English housing
 * guide. Second, the word the university uses is rarely the word a student
 * types — "ผ่อนผันทหาร" for military service postponement, "ใบเกรด" for a
 * transcript, "ยืมของ" for the equipment loan service.
 *
 * Every term in a group is treated as an alternative wording of every other
 * term, in both directions, across both languages. Terms are compared after
 * folding, and Thai terms also match as substrings of a longer query run,
 * because Thai is written without spaces (see `lib/search/text.ts`).
 *
 * Adding a term here is the second cheapest fix for "search can't find X",
 * after adding a keyword to the page itself in `lib/search/pages.ts`. Prefer
 * this file when the word is generic and should work everywhere; prefer page
 * keywords when the word should point at one specific page.
 */
import { fold, tokenize } from "@/lib/search/text";

/** Terms that mean the same thing to a reader, in either language. */
export const synonymGroups: string[][] = [
  ["wifi", "wi-fi", "internet", "eduroam", "network", "อินเทอร์เน็ต", "เน็ต", "ไวไฟ", "สัญญาณ"],
  [
    "dorm",
    "dormitory",
    "hostel",
    "housing",
    "accommodation",
    "apartment",
    "condo",
    "room to rent",
    "หอ",
    "หอพัก",
    "ที่พัก",
    "อพาร์ทเมนท์",
    "คอนโด",
    "เช่าห้อง",
    "ห้องเช่า",
  ],
  ["borrow", "loan", "lend", "rent", "reserve", "book", "ยืม", "ขอยืม", "เช่า", "จอง", "ยืมของ"],
  [
    "transcript",
    "grades",
    "gpa",
    "gpax",
    "results",
    "ใบเกรด",
    "ทรานสคริปต์",
    "ใบแสดงผลการศึกษา",
    "เกรด",
    "ผลการเรียน",
  ],
  [
    "register",
    "registration",
    "enrol",
    "enroll",
    "add drop",
    "sign up",
    "ลงทะเบียน",
    "ลงทะเบียนเรียน",
    "เพิ่มถอน",
    "ถอนรายวิชา",
    "ลงวิชา",
  ],
  [
    "military",
    "conscription",
    "draft",
    "ทหาร",
    "เกณฑ์ทหาร",
    "ผ่อนผัน",
    "ผ่อนผันทหาร",
    "รด",
    "รักษาดินแดน",
  ],
  ["insurance", "accident insurance", "ประกัน", "ประกันอุบัติเหตุ", "ประกันสุขภาพ"],
  ["student card", "id card", "student id", "บัตรนักศึกษา", "บัตรประจำตัวนักศึกษา"],
  [
    "scholarship",
    "tuition",
    "fees",
    "fee",
    "payment",
    "money",
    "financial aid",
    "ทุน",
    "ทุนการศึกษา",
    "ค่าเทอม",
    "ค่าธรรมเนียม",
    "จ่ายเงิน",
    "ผ่อนผันค่าเทอม",
    "เงิน",
  ],
  ["internship", "intern", "work placement", "ฝึกงาน", "สหกิจ", "สหกิจศึกษา"],
  ["club", "society", "ชมรม", "กลุ่มกิจกรรม", "สมาคม"],
  ["birsa", "student association", "student union", "สโมสร", "สโมสรนักศึกษา", "องค์การนักศึกษา"],
  ["contact", "email", "phone", "reach", "ติดต่อ", "อีเมล", "เบอร์โทร", "โทร", "ติดต่อสอบถาม"],
  [
    "harassment",
    "bullying",
    "abuse",
    "complaint",
    "report a problem",
    "misconduct",
    "คุกคาม",
    "ล่วงละเมิด",
    "กลั่นแกล้ง",
    "ร้องเรียน",
    "แจ้งเรื่อง",
    "ถูกรังแก",
    "ไม่เป็นธรรม",
  ],
  [
    "health",
    "clinic",
    "hospital",
    "doctor",
    "sick",
    "mental health",
    "counselling",
    "stress",
    "สุขภาพ",
    "พยาบาล",
    "โรงพยาบาล",
    "หมอ",
    "ป่วย",
    "สุขภาพจิต",
    "ปรึกษา",
    "เครียด",
    "ซึมเศร้า",
  ],
  [
    "shuttle",
    "bus",
    "transport",
    "boat",
    "ferry",
    "getting around",
    "รถรับส่ง",
    "รถเมล์",
    "เรือ",
    "เดินทาง",
    "ขนส่ง",
    "รถตู้",
  ],
  ["library", "ห้องสมุด", "หนังสือ", "ยืมหนังสือ"],
  ["exam", "midterm", "final", "test", "สอบ", "สอบกลางภาค", "สอบปลายภาค", "ตารางสอบ", "สอบไล่"],
  ["graduate", "graduation", "จบ", "จบการศึกษา", "สำเร็จการศึกษา", "รับปริญญา"],
  ["credit", "credits", "หน่วยกิต"],
  ["course", "subject", "class", "module", "วิชา", "รายวิชา", "คลาส", "กระบวนวิชา"],
  [
    "calendar",
    "schedule",
    "timetable",
    "dates",
    "ปฏิทิน",
    "ตาราง",
    "ตารางเรียน",
    "กำหนดการ",
    "วันสำคัญ",
  ],
  [
    "food",
    "eat",
    "restaurant",
    "canteen",
    "cafeteria",
    "อาหาร",
    "กิน",
    "ร้านอาหาร",
    "โรงอาหาร",
    "ของกิน",
    "ร้านอร่อย",
  ],
  ["visa", "immigration", "re-entry", "90 day report", "วีซ่า", "ตม", "ตรวจคนเข้าเมือง"],
  ["dress code", "uniform", "การแต่งกาย", "ชุดนักศึกษา", "เครื่องแบบ", "แต่งตัว"],
  ["projector", "screen", "โปรเจคเตอร์", "เครื่องฉาย", "จอ"],
  ["speaker", "microphone", "mic", "sound", "ลำโพง", "ไมค์", "ไมโครโฟน", "เครื่องเสียง"],
  ["emergency", "urgent", "danger", "ฉุกเฉิน", "ด่วน", "อันตราย"],
  ["room", "venue", "book a room", "space", "ห้อง", "จองห้อง", "สถานที่", "ห้องประชุม"],
  ["print", "printing", "photocopy", "ปริ้น", "พิมพ์งาน", "ถ่ายเอกสาร"],
  ["lost", "found", "lost property", "ของหาย", "ลืมของ", "ทำของหาย"],
  ["rules", "regulation", "policy", "ระเบียบ", "ข้อบังคับ", "กฎ", "นโยบาย"],
  ["thammasat", "tu", "university", "ธรรมศาสตร์", "มธ", "มหาวิทยาลัย"],
  ["faculty", "political science", "คณะ", "รัฐศาสตร์", "คณะรัฐศาสตร์"],
  ["minor", "วิชาโท"],
  ["advisor", "supervisor", "อาจารย์ที่ปรึกษา", "ที่ปรึกษา"],
  ["teacher", "lecturer", "professor", "instructor", "อาจารย์", "ผู้สอน"],
  ["volunteer", "activity hours", "จิตอาสา", "ชั่วโมงกิจกรรม", "กิจกรรมบังคับ"],
];

/** A folded term paired with the groups it belongs to. */
type TermEntry = { term: string; groups: number[]; thai: boolean };

let termIndex: Map<string, TermEntry> | null = null;
let thaiTerms: TermEntry[] | null = null;

function ensureIndex(): { byTerm: Map<string, TermEntry>; thai: TermEntry[] } {
  if (termIndex && thaiTerms) return { byTerm: termIndex, thai: thaiTerms };

  const byTerm = new Map<string, TermEntry>();
  synonymGroups.forEach((group, groupIndex) => {
    for (const raw of group) {
      const folded = fold(raw);
      if (!folded) continue;
      const existing = byTerm.get(folded);
      if (existing) {
        existing.groups.push(groupIndex);
        continue;
      }
      // Whether the term is Thai decides how it is matched: Thai terms also
      // match inside a longer unsegmented run.
      const isThai = tokenize(folded).some((token) => token.script === "thai");
      byTerm.set(folded, { term: folded, groups: [groupIndex], thai: isThai });
    }
  });

  termIndex = byTerm;
  thaiTerms = [...byTerm.values()].filter((entry) => entry.thai);
  return { byTerm, thai: thaiTerms };
}

/** Cap per term so an unusually connected word cannot dominate a query. */
const MAX_ALTERNATIVES = 8;

/**
 * Map each token of `query` to alternative wordings drawn from the groups it
 * belongs to. The result is passed to the engine as `expansions`, where each
 * alternative is scored as another way of writing that same token.
 */
export function buildExpansions(query: string): Map<string, string[]> {
  const { byTerm, thai } = ensureIndex();
  const out = new Map<string, string[]>();

  for (const token of tokenize(query)) {
    const groups = new Set<number>();

    const direct = byTerm.get(token.value);
    if (direct) for (const group of direct.groups) groups.add(group);

    if (token.script === "thai") {
      // "อยากยืมของ" contains the group term "ยืม". Three characters is the
      // shortest that is specific enough: shorter Thai fragments turn up
      // inside unrelated words and would match half the corpus.
      for (const entry of thai) {
        if (entry.term.length < 3) continue;
        if (token.value.includes(entry.term) || entry.term.includes(token.value)) {
          for (const group of entry.groups) groups.add(group);
        }
      }
    }

    if (groups.size === 0) continue;

    const alternatives: string[] = [];
    for (const groupIndex of groups) {
      for (const raw of synonymGroups[groupIndex] ?? []) {
        const folded = fold(raw);
        if (!folded || folded === token.value) continue;
        // Multi-word entries are kept in the groups because they read clearly
        // and are useful as intent triggers, but they are not expanded: the
        // engine would match their words separately, and a common word inside
        // a phrase ("rent" in "room to rent") drags in every page that shares
        // it. Single-word entries carry the recall we actually want.
        if (tokenize(folded).length !== 1) continue;
        if (!alternatives.includes(folded)) alternatives.push(folded);
      }
    }

    if (alternatives.length > 0) out.set(token.value, alternatives.slice(0, MAX_ALTERNATIVES));
  }

  return out;
}
