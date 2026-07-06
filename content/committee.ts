/**
 * BIRSA committee roster — typed module (not MDX). This is the REAL 2026
 * committee: officers first, then assistant officers, in the order BIRSA
 * supplied. `key` is the shared identifier across locales and also doubles
 * as the portrait filename stem (see `components/about/CommitteeRoster.tsx`
 * and `docs/EDITING.md` for how to add a photo).
 *
 * Never add emails or student IDs here — see `tests/unit/content.test.ts`
 * for the guard that enforces this.
 */

export type CommitteeGroup = "officer" | "assistant";

export type CommitteeMember = {
  /** kebab-case; also the portrait filename stem in `public/committee/`. */
  key: string;
  group: CommitteeGroup;
  en: { firstName: string; lastName: string; nickname: string; title: string };
  th: { firstName: string; lastName: string; nickname: string; title: string };
};

export const committee: CommitteeMember[] = [
  // ---------------------------------------------------------------------
  // Officers
  // ---------------------------------------------------------------------
  {
    key: "chayapon-srisukho",
    group: "officer",
    en: { firstName: "Chayapon", lastName: "Srisukho", nickname: "Best", title: "President" },
    th: { firstName: "ชยพล", lastName: "ศรีสุโข", nickname: "เบส", title: "นายกสโมสร" },
  },
  {
    key: "anantachai-korkiertsatean",
    group: "officer",
    en: {
      firstName: "Anantachai",
      lastName: "Korkiertsatean",
      nickname: "Bank",
      title: "Vice President and Public Relations Commissioner",
    },
    th: {
      firstName: "อนันตชัย",
      lastName: "ก่อเกียรติเสถียร",
      nickname: "แบงค์",
      title: "อุปนายกสโมสร",
    },
  },
  {
    key: "kittiya-kanboonma",
    group: "officer",
    en: {
      firstName: "Kittiya",
      lastName: "Kanboonma",
      nickname: "Pin",
      title: "Secretary 1",
    },
    th: { firstName: "กิตติยา", lastName: "กันบุญมา", nickname: "ปิ่น", title: "เลขานุการ คนที่ 1" },
  },
  {
    key: "nicharee-wutthironprasert",
    group: "officer",
    en: {
      firstName: "Nicharee",
      lastName: "Wutthironprasert",
      nickname: "Aoey",
      title: "Secretary 2",
    },
    th: {
      firstName: "ณิชารีย์",
      lastName: "วุฒิรณประเสริฐ",
      nickname: "เอย",
      title: "เลขานุการ คนที่ 2",
    },
  },
  {
    key: "kimitha-saikasin",
    group: "officer",
    en: {
      firstName: "Kimitha",
      lastName: "Saikasin",
      nickname: "Nene",
      title: "Treasurer",
    },
    th: { firstName: "กิมิทา", lastName: "สายกระสินธุ์", nickname: "เนเน่", title: "เหรัญญิก" },
  },
  {
    key: "sujira-onpocha",
    group: "officer",
    en: {
      firstName: "Sujira",
      lastName: "Onpocha",
      nickname: "Mew",
      title: "Spokesperson",
    },
    th: { firstName: "ศุจิรา", lastName: "อ่อนโพธิ์ชา", nickname: "หมิว", title: "โฆษก" },
  },
  {
    key: "pitchayamon-jensirisak",
    group: "officer",
    en: {
      firstName: "Pitchayamon",
      lastName: "Jensirisak",
      nickname: "Mook",
      title: "Academic Affairs Officer",
    },
    th: {
      firstName: "พิชญามณฑ์",
      lastName: "เจนศิริศักดิ์",
      nickname: "มุก",
      title: "กรรมการฝ่ายวิชาการ",
    },
  },
  {
    key: "nonnaree-timklay",
    group: "officer",
    en: {
      firstName: "Nonnaree",
      lastName: "Timklay",
      nickname: "Aing",
      title: "General Coordinator",
    },
    th: {
      firstName: "นนนรี",
      lastName: "ทิมคล้าย",
      nickname: "อิ้ง",
      title: "กรรมการฝ่ายประสานกิจการภายในและรังสิต",
    },
  },
  {
    key: "janyawat-chaiyaroj",
    group: "officer",
    en: {
      firstName: "Janyawat",
      lastName: "Chaiyaroj",
      nickname: "Thumb",
      title: "Sport Coordinator",
    },
    th: {
      firstName: "จรรยวรรธน์",
      lastName: "ไชยโรจน์",
      nickname: "ธัมบ์",
      title: "กรรมการฝ่ายกีฬา",
    },
  },
  {
    key: "punsak-ketmalasiri",
    group: "officer",
    en: {
      firstName: "Punsak",
      lastName: "Ketmalasiri",
      nickname: "Beam",
      title: "Rights Advocate and Student Welfare Officer",
    },
    th: {
      firstName: "พันศักดิ์",
      lastName: "เกตุมาลาศิริ",
      nickname: "บีม",
      title: "กรรมการฝ่ายพิทักษ์สิทธิ์และสวัสดิการ",
    },
  },

  // ---------------------------------------------------------------------
  // Assistant officers
  // ---------------------------------------------------------------------
  {
    key: "naphut-nilkamhang",
    group: "assistant",
    en: {
      firstName: "Naphut",
      lastName: "Nilkamhang",
      nickname: "Phut",
      title: "Assistant Officer, Secretariat",
    },
    th: {
      firstName: "ณพุทธ",
      lastName: "นิลกำแหง",
      nickname: "พุธ",
      title: "อนุกรรมการฝ่ายเลขานุการ",
    },
  },
  {
    key: "pannawit-binsanorh",
    group: "assistant",
    en: {
      firstName: "Pannawit",
      lastName: "Binsanorh",
      nickname: "Fida",
      title: "Assistant Officer, Academic Affairs",
    },
    th: {
      firstName: "ปัณณวิชญ์",
      lastName: "บิลเสนาะ",
      nickname: "ฟีดา",
      title: "อนุกรรมการฝ่ายวิชาการ",
    },
  },
  {
    key: "jidapa-rattanaburee",
    group: "assistant",
    en: {
      firstName: "Jidapa",
      lastName: "Rattanaburee",
      nickname: "Baipor",
      title: "Assistant Officer, Public Relations",
    },
    th: {
      firstName: "จิดาภา",
      lastName: "รัตนบุรี",
      nickname: "ใบปอ",
      title: "อนุกรรมการฝ่ายประชาสัมพันธ์",
    },
  },
  {
    key: "sovanpannha-rith",
    group: "assistant",
    en: {
      firstName: "Sovanpannha",
      lastName: "Rith",
      nickname: "Pannha",
      title: "Assistant Officer, Public Relations",
    },
    th: {
      firstName: "โสวรรณปัญญา",
      lastName: "ฤทธิ์",
      nickname: "ปัญญา",
      title: "อนุกรรมการฝ่ายประชาสัมพันธ์",
    },
  },
  {
    key: "issaree-suwanprapa",
    group: "assistant",
    en: {
      firstName: "Issaree",
      lastName: "Suwanprapa",
      nickname: "Fah",
      title: "Assistant Officer, Public Relations",
    },
    th: {
      firstName: "อิสรีย์",
      lastName: "สุวรรณประภา",
      nickname: "ฟ้า",
      title: "อนุกรรมการฝ่ายประชาสัมพันธ์",
    },
  },
  {
    key: "preamrudee-yaikla",
    group: "assistant",
    en: {
      firstName: "Preamrudee",
      lastName: "Yaikla",
      nickname: "Ink",
      title: "Assistant Officer, Sport Coordination",
    },
    th: {
      firstName: "เปรมฤดี",
      lastName: "ใยกล้า",
      nickname: "อิ้งค์",
      title: "อนุกรรมการฝ่ายกีฬา",
    },
  },
  {
    key: "pitchaya-singmui",
    group: "assistant",
    en: {
      firstName: "Pitchaya",
      lastName: "Singmui",
      nickname: "Ya",
      title: "Assistant Officer, Rights Advocacy and Student Welfare",
    },
    th: {
      firstName: "พิชญะ",
      lastName: "สิงห์มุ่ย",
      nickname: "ยะ",
      title: "อนุกรรมการฝ่ายพิทักษ์สิทธิ์และสวัสดิการ",
    },
  },
  {
    key: "yositar-rouythanapanich",
    group: "assistant",
    en: {
      firstName: "Yositar",
      lastName: "Rouythanapanich",
      nickname: "Vava",
      title: "Assistant Officer, Student Activities",
    },
    th: {
      firstName: "โยษิตา",
      lastName: "รวยธนพานิช",
      nickname: "วาวา",
      title: "อนุกรรมการฝ่ายกิจกรรมนักศึกษา",
    },
  },
  {
    key: "phaotip-thipayasothorn",
    group: "assistant",
    en: {
      firstName: "Phaotip",
      lastName: "Thipayasothorn",
      nickname: "Pie",
      title: "Assistant Officer, Merchandise",
    },
    th: {
      firstName: "เผ่าทิพย์",
      lastName: "ทิพยโสธร",
      nickname: "พาย",
      title: "อนุกรรมการฝ่ายการขาย",
    },
  },
  {
    key: "torlap-sonprathed",
    group: "assistant",
    en: {
      firstName: "Torlap",
      lastName: "Sonprathed",
      nickname: "Pentor",
      title: "Assistant Officer, Foreign Students Assistance",
    },
    th: {
      firstName: "ต่อลาภ",
      lastName: "สนประเทศ",
      nickname: "เป็นต่อ",
      title: "อนุกรรมการฝ่ายบริการนักศึกษาต่างชาติ",
    },
  },
  {
    key: "kritpol-komkai",
    group: "assistant",
    en: {
      firstName: "Kritpol",
      lastName: "Komkai",
      nickname: "Krit",
      title: "Assistant Officer, IT Infrastructure",
    },
    th: {
      firstName: "กฤตพล",
      lastName: "คมคาย",
      nickname: "กฤต",
      title: "อนุกรรมการฝ่ายเทคโนโลยีสารสนเทศ",
    },
  },
];

export const committeeGroupLabels: Record<CommitteeGroup, { en: string; th: string }> = {
  officer: { en: "Officers", th: "คณะกรรมการสโมสร" },
  assistant: { en: "Assistant Officers", th: "คณะอนุกรรมการ" },
};
