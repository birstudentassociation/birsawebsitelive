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
  en: { name: string; nickname: string; title: string };
  th: { name: string; nickname: string; title: string };
};

export const committee: CommitteeMember[] = [
  // ---------------------------------------------------------------------
  // Officers
  // ---------------------------------------------------------------------
  {
    key: "chayapon-srisukho",
    group: "officer",
    en: { name: "Chayapon Srisukho", nickname: "Best", title: "President" },
    th: { name: "ชยพล ศรีสุโข", nickname: "เบส", title: "นายกสโมสร" },
  },
  {
    key: "anantachai-korkiertsatean",
    group: "officer",
    en: {
      name: "Anantachai Korkiertsatean",
      nickname: "Bank",
      title: "Vice President and Public Relations Commissioner",
    },
    th: { name: "อนันตชัย ก่อเกียรติเสถียร", nickname: "แบงค์", title: "อุปนายกสโมสร" },
  },
  {
    key: "kittiya-kanboonma",
    group: "officer",
    en: { name: "Kittiya Kanboonma", nickname: "Pin", title: "Secretary 1" },
    th: { name: "กิตติยา กันบุญมา", nickname: "ปิ่น", title: "เลขานุการ คนที่ 1" },
  },
  {
    key: "nicharee-wutthironprasert",
    group: "officer",
    en: { name: "Nicharee Wutthironprasert", nickname: "Aoey", title: "Secretary 2" },
    th: { name: "ณิชารีย์ วุฒิรณประเสริฐ", nickname: "เอย", title: "เลขานุการ คนที่ 2" },
  },
  {
    key: "kimitha-saikasin",
    group: "officer",
    en: { name: "Kimitha Saikasin", nickname: "Nene", title: "Treasurer" },
    th: { name: "กิมิทา สายกระสินธุ์", nickname: "เนเน่", title: "เหรัญญิก" },
  },
  {
    key: "sujira-onpocha",
    group: "officer",
    en: { name: "Sujira Onpocha", nickname: "Mew", title: "Spokesperson" },
    th: { name: "ศุจิรา อ่อนโพธิ์ชา", nickname: "หมิว", title: "โฆษก" },
  },
  {
    key: "pitchayamon-jensirisak",
    group: "officer",
    en: { name: "Pitchayamon Jensirisak", nickname: "Mook", title: "Academic Affairs Officer" },
    th: { name: "พิชญามณฑ์ เจนศิริศักดิ์", nickname: "มุก", title: "กรรมการฝ่ายวิชาการ" },
  },
  {
    key: "nonnaree-timklay",
    group: "officer",
    en: { name: "Nonnaree Timklay", nickname: "Aing", title: "General Coordinator" },
    th: {
      name: "นนนรี ทิมคล้าย",
      nickname: "อิ้ง",
      title: "กรรมการฝ่ายประสานกิจการภายในและรังสิต",
    },
  },
  {
    key: "janyawat-chaiyaroj",
    group: "officer",
    en: { name: "Janyawat Chaiyaroj", nickname: "Thumb", title: "Sport Coordinator" },
    th: { name: "จรรยวรรธน์ ไชยโรจน์", nickname: "ธัมบ์", title: "กรรมการฝ่ายกีฬา" },
  },
  {
    key: "punsak-ketmalasiri",
    group: "officer",
    en: {
      name: "Punsak Ketmalasiri",
      nickname: "Beam",
      title: "Rights Advocate and Student Welfare Officer",
    },
    th: {
      name: "พันศักดิ์ เกตุมาลาศิริ",
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
    en: { name: "Naphut Nilkamhang", nickname: "Phut", title: "Assistant Officer, Secretariat" },
    th: { name: "ณพุทธ นิลกำแหง", nickname: "พุธ", title: "อนุกรรมการฝ่ายเลขานุการ" },
  },
  {
    key: "pannawit-binsanorh",
    group: "assistant",
    en: {
      name: "Pannawit Binsanorh",
      nickname: "Fida",
      title: "Assistant Officer, Academic Affairs",
    },
    th: { name: "ปัณณวิชญ์ บิลเสนาะ", nickname: "ฟีดา", title: "อนุกรรมการฝ่ายวิชาการ" },
  },
  {
    key: "jidapa-rattanaburee",
    group: "assistant",
    en: {
      name: "Jidapa Rattanaburee",
      nickname: "Baipor",
      title: "Assistant Officer, Public Relations",
    },
    th: { name: "จิดาภา รัตนบุรี", nickname: "ใบปอ", title: "อนุกรรมการฝ่ายประชาสัมพันธ์" },
  },
  {
    key: "sovanpannha-rith",
    group: "assistant",
    en: {
      name: "Sovanpannha Rith",
      nickname: "Pannha",
      title: "Assistant Officer, Public Relations",
    },
    th: { name: "โสวรรณปัญญา ฤทธิ์", nickname: "ปัญญา", title: "อนุกรรมการฝ่ายประชาสัมพันธ์" },
  },
  {
    key: "issaree-suwanprapa",
    group: "assistant",
    en: {
      name: "Issaree Suwanprapa",
      nickname: "Fah",
      title: "Assistant Officer, Public Relations",
    },
    th: { name: "อิสรีย์ สุวรรณประภา", nickname: "ฟ้า", title: "อนุกรรมการฝ่ายประชาสัมพันธ์" },
  },
  {
    key: "preamrudee-yaikla",
    group: "assistant",
    en: {
      name: "Preamrudee Yaikla",
      nickname: "Ink",
      title: "Assistant Officer, Sport Coordination",
    },
    th: { name: "เปรมฤดี ใยกล้า", nickname: "อิ้งค์", title: "อนุกรรมการฝ่ายกีฬา" },
  },
  {
    key: "pitchaya-singmui",
    group: "assistant",
    en: {
      name: "Pitchaya Singmui",
      nickname: "Ya",
      title: "Assistant Officer, Rights Advocacy and Student Welfare",
    },
    th: {
      name: "พิชญะ สิงห์มุ่ย",
      nickname: "ยะ",
      title: "อนุกรรมการฝ่ายพิทักษ์สิทธิ์และสวัสดิการ",
    },
  },
  {
    key: "yositar-rouythanapanich",
    group: "assistant",
    en: {
      name: "Yositar Rouythanapanich",
      nickname: "Vava",
      title: "Assistant Officer, Student Activities",
    },
    th: { name: "โยษิตา รวยธนพานิช", nickname: "วาวา", title: "อนุกรรมการฝ่ายกิจกรรมนักศึกษา" },
  },
  {
    key: "phaotip-thipayasothorn",
    group: "assistant",
    en: {
      name: "Phaotip Thipayasothorn",
      nickname: "Pie",
      title: "Assistant Officer, Merchandise",
    },
    th: { name: "เผ่าทิพย์ ทิพยโสธร", nickname: "พาย", title: "อนุกรรมการฝ่ายการขาย" },
  },
  {
    key: "torlap-sonprathed",
    group: "assistant",
    en: {
      name: "Torlap Sonprathed",
      nickname: "Pentor",
      title: "Assistant Officer, Foreign Students Assistance",
    },
    th: {
      name: "ต่อลาภ สนประเทศ",
      nickname: "เป็นต่อ",
      title: "อนุกรรมการฝ่ายบริการนักศึกษาต่างชาติ",
    },
  },
  {
    key: "kritpol-komkai",
    group: "assistant",
    en: {
      name: "Kritpol Komkai",
      nickname: "Krit",
      title: "Assistant Officer, IT Infrastructure",
    },
    th: { name: "กฤตพล คมคาย", nickname: "กฤต", title: "อนุกรรมการฝ่ายเทคโนโลยีสารสนเทศ" },
  },
];

export const committeeGroupLabels: Record<CommitteeGroup, { en: string; th: string }> = {
  officer: { en: "Officers", th: "คณะกรรมการสโมสร" },
  assistant: { en: "Assistant Officers", th: "คณะอนุกรรมการ" },
};
