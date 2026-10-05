/**
 * 6 October 1976 commemoration page (`/6-october`).
 *
 * Every fact here comes from Documentation of Oct 6 (บันทึก 6 ตุลา, doct6.com),
 * the online archive of the massacre at Thammasat University, Tha Prachan, and
 * every image is served from that archive with the credit it gives. The Thai
 * copy quotes the archive's own wording wherever it can, trimmed at clause
 * boundaries; the English renders the same sentences faithfully. The archive
 * asks anyone who uses its material to credit it, and to ask permission before
 * any commercial use. Keep both rules if this page changes.
 */
import type { Locale } from "@/lib/i18n";

export const DOCT6 = "https://doct6.com";

export type SixOctoberImage = {
  src: string;
  width: number;
  height: number;
  /** The page on doct6.com where the image is published. */
  source: string;
  alt: Record<Locale, string>;
  caption: Record<Locale, string>;
  credit: Record<Locale, string>;
};

const unknownPhotographer: Record<Locale, string> = {
  en: "Photographer unknown. From the set Pathomporn Srimanta gave to Documentation of Oct 6 in 2017, which the archive says carries no record of photographer or owner.",
  th: "ไม่ทราบผู้ถ่ายภาพ ภาพชุดที่คุณปฐมพร ศรีมันตะ มอบให้โครงการบันทึก 6 ตุลา เมื่อปี 2560 ซึ่งโครงการระบุว่าไม่มีข้อมูลผู้ถ่ายภาพและเจ้าของ",
};

const lombard: Record<Locale, string> = {
  en: "Photograph by Frank Lombard, then a New Zealand radio reporter, who gave his colour film to Documentation of Oct 6.",
  th: "ภาพโดยแฟรงค์ ลอมบาร์ด ผู้สื่อข่าววิทยุชาวนิวซีแลนด์ในขณะนั้น ผู้มอบฟิล์มสีชุดนี้ให้โครงการบันทึก 6 ตุลา",
};

const archiveCredit: Record<Locale, string> = {
  en: "Photograph from Documentation of Oct 6, which does not name the photographer.",
  th: "ภาพจากโครงการบันทึก 6 ตุลา ซึ่งไม่ได้ระบุชื่อผู้ถ่ายภาพ",
};

/** The Tha Prachan gate, shown greyscale behind the page title. */
export const hero: SixOctoberImage = {
  src: "/6-october/hero.webp",
  width: 2000,
  height: 1234,
  source: `${DOCT6}/archives/2235`,
  alt: {
    en: "A crowd stands around a city bus pushed against the Tha Prachan gate of Thammasat University.",
    th: "ฝูงชนยืนล้อมรถเมล์ที่ถูกดันเข้าชนประตูท่าพระจันทร์ มหาวิทยาลัยธรรมศาสตร์",
  },
  caption: {
    en: "Behind the title, the Tha Prachan gate of Thammasat University.",
    th: "ภาพเบื้องหลังชื่อเรื่อง บริเวณประตูท่าพระจันทร์ มหาวิทยาลัยธรรมศาสตร์",
  },
  credit: unknownPhotographer,
};

export const images = {
  football: {
    src: "/6-october/football-field.webp",
    width: 1600,
    height: 977,
    source: `${DOCT6}/archives/2235`,
    alt: {
      en: "Young people walk in a line with their hands on their heads past an armed man on the Thammasat football field.",
      th: "คนหนุ่มสาวเดินเรียงแถวเอามือประสานบนศีรษะ ผ่านชายถืออาวุธในสนามฟุตบอลมหาวิทยาลัยธรรมศาสตร์",
    },
    caption: {
      en: "The football field at Thammasat University.",
      th: "บริเวณสนามฟุตบอล มหาวิทยาลัยธรรมศาสตร์",
    },
    credit: unknownPhotographer,
  },
  detained: {
    src: "/6-october/detained-students.webp",
    width: 1600,
    height: 1044,
    source: `${DOCT6}/archives/8753`,
    alt: {
      en: "Rows of students lie face down on the grass, many stripped to the waist, while police stand over them in front of parked buses.",
      th: "นักศึกษานอนคว่ำเรียงแถวบนสนามหญ้า หลายคนถูกถอดเสื้อ ตำรวจยืนคุมอยู่หน้ารถโดยสารที่จอดเรียงกัน",
    },
    caption: {
      en: "Students ordered to lie face down at Thammasat, late on the morning of 6 October 1976.",
      th: "นักศึกษาประชาชนถูกสั่งให้นอนคว่ำในมหาวิทยาลัยธรรมศาสตร์ สายวันที่ 6 ตุลาคม 2519",
    },
    credit: lombard,
  },
  rally: {
    src: "/6-october/royal-plaza-rally.webp",
    width: 1600,
    height: 1007,
    source: `${DOCT6}/archives/2235`,
    alt: {
      en: "A dense crowd fills the Royal Plaza in front of the Ananta Samakhom Throne Hall.",
      th: "ฝูงชนหนาแน่นเต็มลานพระบรมรูปทรงม้า หน้าพระที่นั่งอนันตสมาคม",
    },
    caption: {
      en: "A rally at the Royal Plaza.",
      th: "การชุมนุมที่ลานพระบรมรูปทรงม้า",
    },
    credit: unknownPhotographer,
  },
  scouts: {
    src: "/6-october/village-scouts.webp",
    width: 1600,
    height: 1032,
    source: `${DOCT6}/archives/2235`,
    alt: {
      en: "Village Scouts in neckerchiefs stand in a long line along a road, some holding flags.",
      th: "ลูกเสือชาวบ้านผูกผ้าพันคอยืนเรียงแถวยาวริมถนน บางคนถือธง",
    },
    caption: {
      en: "A line of Village Scouts at Wat Bowonniwet Vihara.",
      th: "แถวลูกเสือชาวบ้านบริเวณวัดบวรนิเวศวิหาร",
    },
    credit: unknownPhotographer,
  },
} satisfies Record<string, SixOctoberImage>;

export type Portrait = {
  name: Record<Locale, string>;
  src: string;
  width: number;
  height: number;
  /** The person's page on doct6.com. */
  href: string;
  about: Record<Locale, string>;
  credit: Record<Locale, string>;
};

export const portraits: Portrait[] = [
  {
    name: { en: "Wichitchai Amornkul", th: "วิชิตชัย อมรกุล" },
    src: "/6-october/wichitchai-amornkul.webp",
    width: 500,
    height: 375,
    href: `${DOCT6}/archives/8737`,
    about: {
      en: "19. A second year Political Science student at Chulalongkorn University, from Ubon Ratchathani.",
      th: "อายุ 19 ปี นักศึกษาชั้นปีที่ 2 คณะรัฐศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย ชาวอุบลราชธานี",
    },
    credit: archiveCredit,
  },
  {
    name: { en: "Jarupong Thongsin", th: "จารุพงษ์ ทองสินธุ์" },
    src: "/6-october/jarupong-thongsin.webp",
    width: 500,
    height: 375,
    href: `${DOCT6}/archives/4102`,
    about: {
      en: "19. A third year Liberal Arts student at Thammasat. His parents, Jinda and Lim, searched the country for their son.",
      th: "อายุ 19 ปี นักศึกษาชั้นปีที่ 3 คณะศิลปศาสตร์ มหาวิทยาลัยธรรมศาสตร์ พ่อจินดาและแม่ลิ้มพลิกแผ่นดินตามหาลูก",
    },
    credit: archiveCredit,
  },
  {
    name: { en: "Supol Phan", th: "สุพล พาน" },
    src: "/6-october/supol-phan.webp",
    width: 600,
    height: 717,
    href: `${DOCT6}/archives/4085`,
    about: {
      en: "24. From Udon Thani. He was shot while trying to drive the wounded to hospital.",
      th: "อายุ 24 ปี พื้นเพเป็นคนจังหวัดอุดรธานี ถูกยิงขณะพยายามขับรถพาคนเจ็บไปส่งโรงพยาบาล",
    },
    credit: archiveCredit,
  },
  {
    name: { en: "Danaisak Iamkhong", th: "ดนัยศักดิ์ เอี่ยมคง" },
    src: "/6-october/danaisak-iamkhong.webp",
    width: 1200,
    height: 675,
    href: `${DOCT6}/archives/2442`,
    about: {
      en: "21. A Political Science student at Ramkhamhaeng University, from Nakhon Si Thammarat.",
      th: "อายุ 21 ปี นักศึกษาคณะรัฐศาสตร์ มหาวิทยาลัยรามคำแหง ชาวนครศรีธรรมราช",
    },
    credit: archiveCredit,
  },
];

export type Victim = {
  /** As the victims page of Documentation of Oct 6 prints it, in Thai. */
  name: string;
  /** The person's story on doct6.com, where the archive has written one. */
  url: string | null;
  age: number | null;
  detail: Record<Locale, string> | null;
};

const unknownMan = "ชายไทยไม่ทราบชื่อ";
const burned = (n: number): Victim => ({
  name: `ศพถูกเผาไม่ทราบชื่อที่ ${n}`,
  url: null,
  age: null,
  detail: { en: "A burned body, never identified", th: "ยังระบุตัวตนไม่ได้" },
});

/**
 * The 40 dead as the victims page of Documentation of Oct 6 lists them, in its
 * order. Ages and details come from each person's profile, or from the
 * archive's list post (`/archives/10292`) where no profile exists yet.
 */
export const victims: Victim[] = [
  {
    name: "วิชิตชัย อมรกุล",
    url: `${DOCT6}/archives/8737`,
    age: 19,
    detail: {
      en: "Second year Political Science, Chulalongkorn University",
      th: "นักศึกษาชั้นปีที่ 2 คณะรัฐศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย",
    },
  },
  {
    name: "อรุณี ขำบุญเกิด",
    url: `${DOCT6}/archives/8220`,
    age: 19,
    detail: {
      en: "Ramkhamhaeng University student, from Chumphon",
      th: "นักศึกษามหาวิทยาลัยรามคำแหง เป็นชาวจังหวัดชุมพร",
    },
  },
  {
    name: "ปรีชา แซ่เฮีย (หรือแซ่เอีย)",
    url: `${DOCT6}/archives/8218`,
    age: 25,
    detail: {
      en: "Editorial and distribution staff, Asia Wikhro Khao magazine",
      th: "กองบรรณาธิการและสายส่งนิตยสาร เอเชียวิเคราะห์ข่าว",
    },
  },
  {
    name: "วิมลวรรณ รุ่งทองใบสุรีย์",
    url: `${DOCT6}/archives/8216`,
    age: 20,
    detail: {
      en: "Third year nursing, Ramathibodi School of Nursing",
      th: "นักศึกษาชั้นปีที่ 3 คณะพยาบาลศาสตร์ โรงเรียนพยาบาลรามาธิบดี",
    },
  },
  {
    name: "เนาวรัตน์ ศิริรังษี",
    url: `${DOCT6}/archives/8214`,
    age: 23,
    detail: {
      en: "Business Administration, Ramkhamhaeng University",
      th: "นักศึกษาคณะบริหารธุรกิจ มหาวิทยาลัยรามคำแหง",
    },
  },
  {
    name: "ภูมิศักดิ์ ศิระศุภฤกษ์ชัย",
    url: `${DOCT6}/archives/8212`,
    age: 22,
    detail: {
      en: "Second year Business Administration, Ramkhamhaeng University",
      th: "ชั้นปีที่ 2 คณะบริหารธุรกิจ มหาวิทยาลัยรามคำแหง",
    },
  },
  {
    name: "จารุพงษ์ ทองสินธุ์",
    url: `${DOCT6}/archives/4102`,
    age: 19,
    detail: {
      en: "Third year Liberal Arts, Thammasat University",
      th: "นักศึกษาชั้นปีที่ 3 คณะศิลปศาสตร์ มหาวิทยาลัยธรรมศาสตร์",
    },
  },
  {
    name: "มนัส เศียรสิงห์",
    url: `${DOCT6}/archives/4089`,
    age: 22,
    detail: { en: "Student at Poh Chang College", th: "นักศึกษาวิทยาลัยเพาะช่าง" },
  },
  {
    name: "สุพล พาน",
    url: `${DOCT6}/archives/4085`,
    age: 24,
    detail: {
      en: "Shot while trying to drive the wounded to hospital",
      th: "ถูกยิงขณะพยายามขับรถพาคนเจ็บไปส่งโรงพยาบาล",
    },
  },
  {
    name: "ดนัยศักดิ์ เอี่ยมคง",
    url: `${DOCT6}/archives/2442`,
    age: 21,
    detail: {
      en: "Political Science, Ramkhamhaeng University",
      th: "คณะรัฐศาสตร์ มหาวิทยาลัยรามคำแหง",
    },
  },
  {
    name: "อภิสิทธิ์ ไทยนิยม",
    url: `${DOCT6}/archives/2140`,
    age: 21,
    detail: {
      en: "Economics, Ramkhamhaeng University",
      th: "คณะเศรษฐศาสตร์ที่มหาวิทยาลัยรามคำแหง",
    },
  },
  {
    name: "พงษ์พันธ์ เพรามธุรส",
    url: `${DOCT6}/archives/2143`,
    age: 20,
    detail: { en: "Law, Ramkhamhaeng University", th: "คณะนิติศาสตร์ มหาวิทยาลัยรามคำแหง" },
  },
  {
    name: "อับดุลรอเฮง สาตา",
    url: `${DOCT6}/archives/2453`,
    age: 23,
    detail: {
      en: "Second year Public Health, Mahidol University",
      th: "นักศึกษาคณะสาธารณสุขศาสตร์ ชั้นปีที่ 2 มหาวิทยาลัยมหิดล",
    },
  },
  {
    name: "ไพบูลย์ เลาหจิรพันธ์",
    url: `${DOCT6}/archives/2451`,
    age: 22,
    detail: {
      en: "Fourth year Economics, Thammasat University",
      th: "นักศึกษาชั้นปีที่ 4 คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์",
    },
  },
  {
    name: "อนุวัตร อ่างแก้ว",
    url: `${DOCT6}/archives/10312`,
    age: 22,
    detail: {
      en: "Third year Economics, Thammasat University",
      th: "ชั้นปีที่ 3 คณะเศรษฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์",
    },
  },
  {
    name: "บุนนาค สมัครสมาน",
    url: `${DOCT6}/archives/10309`,
    age: 22,
    detail: { en: "Ramkhamhaeng University student", th: "นักศึกษามหาวิทยาลัยรามคำแหง" },
  },
  {
    name: "อัจฉริยะ ศรีสวาท",
    url: `${DOCT6}/archives/10314`,
    age: 23,
    detail: { en: "Third year, Bangkok College", th: "ชั้นปี 3 ของวิทยาลัยกรุงเทพฯ" },
  },
  {
    name: "สุรสิทธิ์ สุภาภา",
    url: `${DOCT6}/archives/10319`,
    age: 24,
    detail: {
      en: "Third year Public Health, Mahidol University",
      th: "นักศึกษาชั้นปีที่ 3 คณะสาธารณสุขศาสตร์ มหาวิทยาลัยมหิดล",
    },
  },
  {
    name: "ยุทธนา บูรศิริรักษ์",
    url: `${DOCT6}/archives/13616`,
    age: 22,
    detail: {
      en: "Fourth year Law, Ramkhamhaeng University",
      th: "นักศึกษาชั้นปีที่ 4 คณะนิติศาสตร์ มหาวิทยาลัยรามคำแหง",
    },
  },
  {
    name: "กมล แก้วไกรไทย",
    url: `${DOCT6}/archives/13634`,
    age: 19,
    detail: {
      en: "Delivered and sold newspapers at Tha Chang",
      th: "ทำงานจัดส่งและขายหนังสือพิมพ์ที่ท่าช้าง",
    },
  },
  {
    name: "มนู วิทยาภรณ์",
    url: null,
    age: 22,
    detail: {
      en: "Fourth year Political Science, Ramkhamhaeng University",
      th: "นักศึกษาชั้นปีที่ 4 คณะรัฐศาสตร์ มหาวิทยาลัยรามคำแหง",
    },
  },
  {
    name: "สัมพันธ์ เจริญสุข",
    url: null,
    age: 20,
    detail: {
      en: "Medical Technology, Mahidol University",
      th: "นักศึกษาคณะเทคนิคการแพทย์ มหาวิทยาลัยมหิดล",
    },
  },
  { name: "สุวิทย์ ทองประหลาด", url: null, age: 23, detail: null },
  {
    name: "วีระพล โอภาสวิไล",
    url: null,
    age: 19,
    detail: {
      en: "First year Medical Technology, Mahidol University",
      th: "นักศึกษาชั้นปีที่ 1 คณะเทคนิคการแพทย์ มหาวิทยาลัยมหิดล",
    },
  },
  { name: "สุพจน์ พันธุ์กาฬสินธุ์", url: null, age: 22, detail: null },
  {
    name: "ภรณี จุลละครินทร์",
    url: null,
    age: 19,
    detail: {
      en: "Second year Commerce and Accountancy, Thammasat University",
      th: "นักศึกษาชั้นปีที่ 2 คณะพาณิชยศาสตร์และการบัญชี มหาวิทยาลัยธรรมศาสตร์",
    },
  },
  {
    name: "วัชรี เพชรสุ่น",
    url: null,
    age: 20,
    detail: {
      en: "Science, Ramkhamhaeng University",
      th: "นักศึกษาคณะวิทยาศาสตร์ มหาวิทยาลัยรามคำแหง",
    },
  },
  {
    name: "ชัยพร อมรโรจนาวงศ์",
    url: null,
    age: 43,
    detail: { en: "Ran his own business", th: "ประกอบธุรกิจส่วนตัว" },
  },
  { name: "สงวนพันธุ์ ซุ่นเซ้ง", url: null, age: 23, detail: null },
  { name: "สมชาย ปิยะสกุลศักดิ์", url: null, age: 22, detail: null },
  {
    name: "วิสุทธิ์ พงษ์พานิช",
    url: null,
    age: 20,
    detail: {
      en: "Third year, Ramkhamhaeng University",
      th: "นักศึกษาชั้นปีที่ 3 มหาวิทยาลัยรามคำแหง",
    },
  },
  { name: "ศิริพงษ์ มัณตะเสถียร", url: null, age: 21, detail: null },
  { name: "วสันต์ บุญรักษ์", url: null, age: 19, detail: null },
  {
    name: unknownMan,
    url: null,
    age: null,
    detail: { en: "Name unknown. Struck in the head by shrapnel", th: "ถูกสะเก็ดระเบิดที่ศีรษะ" },
  },
  {
    name: unknownMan,
    url: null,
    age: null,
    detail: { en: "Name unknown. Shot through the lung", th: "ถูกกระสุนปืนเข้าช่องปอด" },
  },
  {
    name: unknownMan,
    url: null,
    age: null,
    detail: { en: "Name unknown. Shot", th: "ถูกกระสุนปืน" },
  },
  burned(1),
  burned(2),
  burned(3),
  burned(4),
];

export type Quote = {
  text: string;
  /** The Thai the archive printed, shown under an English rendering. */
  original?: string;
  cite: string;
  href: string;
};

export type Moment = { time: string; text: string };
export type Day = { heading: string; moments: Moment[] };

export type SixOctoberCopy = {
  title: string;
  eyebrow: string;
  lede: string;
  metaDescription: string;
  breadcrumb: string;
  contentNote: string;
  epigraph: Quote;
  remembranceHeading: string;
  remembrance: string[];
  backgroundHeading: string;
  background: string[];
  timelineHeading: string;
  timelineIntro: string;
  days: Day[];
  afterHeading: string;
  after: string[];
  afterQuote: Quote;
  namesHeading: string;
  namesQuote: Quote;
  namesIntro: string;
  readMoreAbout: string;
  age: (years: number) => string;
  separator: string;
  namesSource: string;
  deadHeading: string;
  deadIntro: string;
  figures: { value: string; label: string }[];
  figuresNote: string;
  whyHeading: string;
  why: string[];
  whyQuote: Quote;
  learnHeading: string;
  learnIntro: string;
  learnLinks: { label: string; href: string }[];
  closing: string;
  creditsHeading: string;
  creditsIntro: string;
  creditsTerms: string;
  photoSource: string;
};

const how = `${DOCT6}/learn-about/how`;
const victimsPage = `${DOCT6}/remember/victims`;

const epigraphTh = "ความใฝ่ฝันถึงสังคมใหม่ไม่ใช่ความผิด";
const impunityTh =
  "แต่ที่น่าประหลาดใจที่สุดก็คือ การก่อกรณีนองเลือดครั้งนี้ ไม่มีการจับกุมฆาตกรผู้ก่อการสังหารเลยแม้แต่คนเดียว";
const humanityTh = "การทำความรู้จักตัวตนของเหยื่อก็คือการแสดงความเคารพต่อความเป็นมนุษย์ของพวกเขา";
const aimTh =
  "เพื่อให้ผู้ที่สนใจสามารถเข้าถึงข้อมูลได้สะดวกมากยิ่งขึ้น เพื่อต่ออายุความสนใจและการค้นคว้าเกี่ยวกับ 6 ตุลาให้ไปอีกไกลในอนาคต และเพื่อต่อสู้กับความพยายามทำให้สังคมลืม 6 ตุลา";

export const copy: Record<Locale, SixOctoberCopy> = {
  en: {
    title: "6 October 1976",
    eyebrow: "50 years",
    lede: "On the morning of 6 October 1976, police and armed civilians massacred students and members of the public at Thammasat University, Tha Prachan. We remember them.",
    metaDescription:
      "Remembering the 6 October 1976 massacre at Thammasat University, Tha Prachan, fifty years on. What happened, the names of the dead and where to learn more.",
    breadcrumb: "6 October 1976",
    contentNote:
      "This page describes killing and violence against students. It contains historical photographs of the morning, but none that show the dead.",
    epigraph: {
      text: "The dream of a new society is not a crime.",
      original: epigraphTh,
      cite: "Suthachai Yimprasert, How 6 October happened, conclusion",
      href: `${how}/conclusion`,
    },
    remembranceHeading: "Fifty years on",
    remembrance: [
      "Tens of thousands of students and members of the public had gathered at Thammasat to protest against the return of Thanom Kittikachorn. Before dawn, Border Patrol Police surrounded the university, and then poured fire into it. The 3,094 people who survived the killing were all arrested that same day. That evening, the military seized power and restored dictatorship.",
      "The dead are too often remembered only as a number, and some still have no name. Tha Prachan is where we study today. It is also where this happened.",
    ],
    backgroundHeading: "How it came to this",
    background: [
      "Documentation of Oct 6 traces the massacre back to 14 October 1973, when the student movement won its struggle and brought the greatest democratic awakening in Thai history. Right wing groups grew in response. They included the Village Scouts, the Red Gaurs and Nawaphon, and parts of the state stood behind them.",
      "On 19 September 1976 Field Marshal Thanom Kittikachorn came home from Singapore as a novice and was ordained a monk at Wat Bowonniwet. On 24 September two Nakhon Pathom electricity workers were beaten to death while putting up posters against him, and their bodies were hanged at the gate of a housing estate.",
      "On 4 October students rallied at Lan Pho, and the Thammasat drama club staged a play about the Nakhon Pathom hanging. The next day the Dao Siam newspaper used a photograph of the play to attack the student movement, claiming the students had deliberately insulted the monarchy.",
    ],
    timelineHeading: "What happened",
    timelineIntro:
      "These moments follow the timeline Documentation of Oct 6 compiled from the records of the day.",
    days: [
      {
        heading: "Tuesday 5 October 1976",
        moments: [
          {
            time: "10.00",
            text: "Yan Kreua army radio runs a special programme. Its presenter repeats that the rally at Thammasat is no longer against Thanom, but an insult to the monarchy.",
          },
          {
            time: "13.30",
            text: "Ramkhamhaeng students prepare to set out for Thammasat in 25 vehicles.",
          },
          {
            time: "Evening",
            text: "The rally swells to tens of thousands and moves from Lan Pho to the football field.",
          },
          {
            time: "20.35",
            text: "For the first time, Yan Kreua and the Free Radio Association call the students and people at Thammasat “troublemakers”, and say there “may be bloodshed”.",
          },
          {
            time: "21.30",
            text: "The National Student Centre of Thailand brings the two student actors before the press to show their innocence.",
          },
          {
            time: "All night",
            text: "Yan Kreua and the Free Radio Association broadcast through the night, calling on the public and the Village Scouts to gather at the Royal Plaza.",
          },
        ],
      },
      {
        heading: "Wednesday 6 October 1976",
        moments: [
          {
            time: "01.40",
            text: "About 100 people burn posters at the Sanam Luang gate of the university. The first shot rings out. Scattered shots follow, but no one is hurt.",
          },
          {
            time: "04.00",
            text: "Border Patrol Police from Naresuan camp, Hua Hin, arrive, surround the university from the Sanam Luang side, and post armed men in the National Museum.",
          },
          {
            time: "05.30",
            text: "The first M79 grenade, fired by police outside the university, lands among the crowd on the football field. Four people are killed and others are wounded.",
          },
          {
            time: "07.00",
            text: "Police pour heavy fire into the university from the Great Hall and the National Museum. Thousands shelter in the buildings around the football field. Dozens are killed. Outside, the crowd drives two buses into the gate.",
          },
          {
            time: "08.25",
            text: "Border Patrol Police break into the university and move to seize the protesters sheltering around the football field.",
          },
          {
            time: "10.30",
            text: "Students and members of the public are ordered to lie face down. Men and women are forced to take off their shirts. They are loaded onto buses and trucks and taken to police stations.",
          },
          {
            time: "12.30",
            text: "Tens of thousands of Village Scouts and others rally at the Royal Plaza.",
          },
          {
            time: "18.00",
            text: "Admiral Sangad Chaloryu, head of the National Administrative Reform Council, announces that it has seized power.",
          },
        ],
      },
    ],
    afterHeading: "What came after",
    after: [
      "Police arrested 3,094 people that day, 2,432 men and 662 women. The 6 October defendants were held and tried for almost two years. On 16 September 1978 all 18 defendants, and one more in the criminal court, were amnestied and freed.",
      "The coup group made Thanin Kraivichien prime minister. Many students fled to the jungle. When General Kriangsak Chamanan's government released the defendants, he told the country to let bygones be bygones and “forget it”.",
    ],
    afterQuote: {
      text: "Most astonishing of all, for all this bloodshed, not a single one of the killers was ever arrested.",
      original: impunityTh,
      cite: "Suthachai Yimprasert, How 6 October happened",
      href: how,
    },
    namesHeading: "Victims of the violence",
    namesQuote: {
      text: "To come to know who the victims were is to honour their humanity.",
      original: humanityTh,
      cite: "Documentation of Oct 6, Victims of the violence",
      href: victimsPage,
    },
    namesIntro:
      "These are the 40 students and members of the public who died in the massacre, as Documentation of Oct 6 records them. The archive gives their names in Thai. Where it has written someone's story, their name links to it.",
    readMoreAbout: "Read about",
    age: (years) => `Aged ${years}`,
    separator: ". ",
    namesSource: "The victims page of Documentation of Oct 6",
    deadHeading: "How many died",
    deadIntro:
      "Fifty years on, even the number of dead is uncertain. The records do not agree, and Documentation of Oct 6 explains why.",
    figures: [
      { value: "39", label: "dead in the official figures" },
      { value: "46", label: "dead, at least, in the autopsy reports" },
      { value: "40", label: "students and members of the public, in the archive's count" },
      { value: "3,094", label: "arrested that day" },
    ],
    figuresNote:
      "The autopsy reports include five officials and one man who died in prison in January 1977. The archive leaves him out of its count of 40, and includes a student who died of her wounds in December 1976. Staff of the Ruamkatanyu Foundation who collected the bodies were reported to estimate 530 dead.",
    whyHeading: "Why we remember",
    why: [
      "Documentation of Oct 6 is an online archive that collects, preserves and organises evidence that was scattered for decades. It holds the autopsy reports, the newspapers, the radio recordings, the photographs, and the stories of the people who died, told by their families and friends.",
      "We are a student association at Tha Prachan. We keep their memory on the ground where they were killed.",
    ],
    whyQuote: {
      text: "So that anyone can reach the evidence more easily, so that interest and research into 6 October can carry far into the future, and to fight the effort to make society forget 6 October.",
      original: aimTh,
      cite: "Documentation of Oct 6, About the project",
      href: `${DOCT6}/about`,
    },
    learnHeading: "Learn more",
    learnIntro: "Most of the archive is in Thai.",
    learnLinks: [
      { label: "The full timeline", href: `${DOCT6}/learn-about/timeline` },
      { label: "How 6 October happened", href: how },
      { label: "Victims of the violence", href: victimsPage },
      { label: "The evidence", href: `${DOCT6}/documents` },
      { label: "Share a document or a memory", href: `${DOCT6}/contribute` },
    ],
    closing: "We do not forget.",
    creditsHeading: "Sources and credits",
    creditsIntro:
      "Every fact, quotation and photograph on this page comes from Documentation of Oct 6 (บันทึก 6 ตุลา, doct6.com). Each photograph and quotation links to the page where the archive publishes it.",
    creditsTerms:
      "The archive shares its material for education and the public interest and asks that it be credited. Ask the archive, or the families of the dead, before any commercial use.",
    photoSource: "View on doct6.com",
  },
  th: {
    title: "6 ตุลา 2519",
    eyebrow: "50 ปี 6 ตุลา",
    lede: "เช้าวันที่ 6 ตุลาคม 2519 เกิดการฆาตกรรมหมู่นักศึกษาและประชาชนในมหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์ เราขอรำลึกถึงพวกเขา",
    metaDescription:
      "รำลึก 50 ปี 6 ตุลา 2519 การฆาตกรรมหมู่ที่มหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์ เกิดอะไรขึ้น รายชื่อผู้เสียชีวิต และแหล่งข้อมูลจากโครงการบันทึก 6 ตุลา",
    breadcrumb: "6 ตุลา 2519",
    contentNote:
      "หน้านี้กล่าวถึงการสังหารและความรุนแรงต่อนักศึกษา มีภาพถ่ายทางประวัติศาสตร์ของเช้าวันนั้น แต่ไม่มีภาพผู้เสียชีวิต",
    epigraph: {
      text: epigraphTh,
      cite: "สุธาชัย ยิ้มประเสริฐ บทสรุป เหตุการณ์ 6 ตุลาฯ เกิดขึ้นได้อย่างไร",
      href: `${how}/conclusion`,
    },
    remembranceHeading: "ครบ 50 ปี",
    remembrance: [
      "นักศึกษาประชาชนนับหมื่นคนชุมนุมในมหาวิทยาลัยธรรมศาสตร์เพื่อต่อต้านพระถนอม ก่อนรุ่งสาง ตำรวจตระเวนชายแดนยกกำลังเข้าล้อมมหาวิทยาลัย แล้วระดมยิงเข้ามาอย่างหนัก นักศึกษาประชาชนที่เหลือรอดจากการถูกสังหารจำนวน 3,094 คน กลับถูกจับกุมทั้งหมดภายในวันนั้นเอง และในเย็นวันเดียวกันนั้นเอง ก็เกิดการรัฐประหารฟื้นเผด็จการ",
      "ผู้เสียชีวิตมักถูกจดจำในฐานะตัวเลขความตายเท่านั้น บางคนจนถึงวันนี้ยังไม่มีใครรู้ชื่อ ท่าพระจันทร์คือที่ที่เราเรียนกันทุกวันนี้ และเป็นที่ที่เรื่องทั้งหมดนี้เกิดขึ้น",
    ],
    backgroundHeading: "ย้อนดูที่มา",
    background: [
      "เหตุการณ์ 6 ตุลาคม 2519 เป็นผลผลิตอันสืบเนื่องจากเหตุการณ์ 14 ตุลาคม 2516 เมื่อขบวนการนักศึกษาได้รับชัยชนะในการต่อสู้ และนำมาซึ่งกระแสการตื่นตัวด้านประชาธิปไตยครั้งใหญ่ที่สุดในประวัติศาสตร์ ขณะเดียวกันกลุ่มฝ่ายขวาก็เติบโตขึ้น ทั้งลูกเสือชาวบ้าน กระทิงแดง และนวพล โดยมีกลไกรัฐบางส่วนหนุนหลัง",
      "วันที่ 19 กันยายน 2519 จอมพลถนอม กิตติขจร บวชเณรจากสิงคโปร์ แล้วเดินทางถึงประเทศไทย และอุปสมบทเป็นพระภิกษุที่วัดบวรนิเวศฯ วันที่ 24 กันยายน นายวิชัย เกษศรีพงษา และนายชุมพร ทุมไมย พนักงานการไฟฟ้านครปฐม ถูกซ้อมตายระหว่างออกติดโปสเตอร์ประท้วงต่อต้านพระถนอม และถูกนำศพไปแขวนคอที่ประตูทางเข้าที่จัดสรรแห่งหนึ่งในจังหวัดนครปฐม",
      "วันที่ 4 ตุลาคม มีการชุมนุมที่ลานโพธิ์ มีการอภิปรายและการแสดงละครเกี่ยวกับกรณีฆ่าแขวนคอพนักงานการไฟฟ้านครปฐม จัดโดยชุมนุมนาฏศิลป์และการละคร มหาวิทยาลัยธรรมศาสตร์ วันรุ่งขึ้น หนังสือพิมพ์ดาวสยามนำรูปละครแขวนคอมาเป็นเครื่องมือ ออกเผยแพร่โจมตีขบวนการนักศึกษาว่าจงใจหมิ่นพระบรมเดชานุภาพ",
    ],
    timelineHeading: "ลำดับเหตุการณ์",
    timelineIntro: "ลำดับเหตุการณ์ต่อไปนี้มาจากที่โครงการบันทึก 6 ตุลา รวบรวมจากบันทึกของวันนั้น",
    days: [
      {
        heading: "วันอังคารที่ 5 ตุลาคม 2519",
        moments: [
          {
            time: "10.00 น.",
            text: "สถานีวิทยุยานเกราะเปิดรายการพิเศษ เสียงของ พ.ท.อุทาร สนิทวงศ์ กล่าวเน้นเป็นระยะว่า “เดี๋ยวนี้การชุมนุมที่ธรรมศาสตร์ไม่ใช่เป็นเรื่องต่อต้านพระถนอมแล้ว หากแต่เป็นเรื่องหมิ่นพระบรมเดชานุภาพ”",
          },
          {
            time: "13.30 น.",
            text: "นักศึกษารามคำแหงเตรียมออกเดินทางไปสมทบที่ธรรมศาสตร์ 25 คันรถ",
          },
          {
            time: "ตกเย็น",
            text: "จำนวนผู้ร่วมชุมนุมเพิ่มมากขึ้นนับหมื่นคน จึงย้ายการชุมนุมจากบริเวณลานโพธิ์มายังสนามฟุตบอล",
          },
          {
            time: "20.35 น.",
            text: "นับเป็นครั้งแรกที่สถานีวิทยุยานเกราะ และชมรมวิทยุเสรี เรียกกลุ่มนักศึกษาประชาชนที่ธรรมศาสตร์ว่า “ผู้ก่อความไม่สงบ” และกล่าวคำว่า “อาจมีการนองเลือดขึ้น”",
          },
          {
            time: "21.30 น.",
            text: "ศนท. นำนายอภินันท์ บัวหภักดี และนายวิโรจน์ ตั้งวาณิชย์ สมาชิกชุมนุมนาฏศิลป์และการละคร มหาวิทยาลัยธรรมศาสตร์ มาแสดงความบริสุทธิ์ใจ",
          },
          {
            time: "ตลอดคืน",
            text: "สถานีวิทยุยานเกราะและชมรมวิทยุเสรีออกอากาศตลอดคืนเรียกร้องให้ประชาชนและลูกเสือชาวบ้านไปชุมนุมที่ลานพระบรมรูปทรงม้า",
          },
        ],
      },
      {
        heading: "วันพุธที่ 6 ตุลาคม 2519",
        moments: [
          {
            time: "01.40 น.",
            text: "กลุ่มคนประมาณ 100 คนได้บุกเข้าไปเผาแผ่นโปสเตอร์หน้าประตูมหาวิทยาลัยธรรมศาสตร์ ด้านสนามหลวง มีเสียงปืนนัดแรกดังขึ้นและมีการยิงตอบโต้ประปรายแต่ไม่มีใครบาดเจ็บ",
          },
          {
            time: "04.00 น.",
            text: "ตำรวจตระเวนชายแดน จากค่ายนเรศวร หัวหิน เดินทางมาถึง และยกกำลังเข้าล้อมมหาวิทยาลัยจากทางด้านสนามหลวง และนำกำลังติดอาวุธไปตั้งในพิพิธภัณฑสถานแห่งชาติ",
          },
          {
            time: "05.30 น.",
            text: "ระเบิดเอ็ม.๗๙ ลูกแรก ถูกยิงมาจากฝ่ายตำรวจนอกมหาวิทยาลัย ตกกลางผู้ชุมนุมที่สนามฟุตบอล มีผู้เสียชีวิต ๔ คน และบาดเจ็บอีกจำนวนหนึ่ง",
          },
          {
            time: "07.00 น.",
            text: "เจ้าหน้าที่ตำรวจระดมยิงเข้ามาในมหาวิทยาลัยอย่างหนัก จากด้านหน้าหอประชุมใหญ่ และพิพิธภัณฑสถาน ผู้ชุมนุมนับพันคน ต้องหนีเข้าไปหลบในอาคารรอบสนามฟุตบอล มีผู้เสียชีวิตหลายสิบคน ฝูงชนหน้าประตูมหาวิทยาลัยใช้รถบัสสองคันขับพุ่งเข้าชนประตู",
          },
          {
            time: "08.25 น.",
            text: "ตชด.บุกเข้าไปในมหาวิทยาลัยได้สำเร็จ และได้พยายามเข้าจับกุมฝ่ายผู้ชุมนุมที่หลบตามอาคารรอบสนามฟุตบอล",
          },
          {
            time: "10.30 น.",
            text: "นักศึกษาประชาชนถูกสั่งให้นอนคว่ำ นักศึกษาชายและหญิงถูกบังคับให้ถอดเสื้อ แล้วถูกควบคุมตัวทยอยลำเลียงขึ้นรถเมล์และรถสองแถวส่งไปขังตามสถานีตำรวจต่างๆ",
          },
          {
            time: "12.30 น.",
            text: "กลุ่มลูกเสือชาวบ้านและประชาชนจำนวนหลายหมื่นคนชุมนุมอยู่ที่ลานพระบรมรูปทรงม้า",
          },
          {
            time: "18.00 น.",
            text: "พล.ร.อ.สงัด ชลออยู่ หัวหน้าคณะปฏิรูปการปกครองแผ่นดิน ประกาศยึดอำนาจ",
          },
        ],
      },
    ],
    afterHeading: "หลังเหตุการณ์",
    after: [
      "นักศึกษาประชาชนถูกจับกุม 3,094 คน เป็นชาย 2,432 คน หญิง 662 คน ผู้ต้องหาคดี 6 ตุลา ถูกคุมขังและดำเนินคดีอยู่เกือบ 2 ปีจึงจะได้รับการปล่อยตัว วันที่ 16 กันยายน 2521 ผู้ต้องหาคดี 6 ตุลา ทั้ง 18 คน ได้รับการนิรโทษกรรม พร้อมกับผู้ต้องหาในศาลอาญาอีก 1 คน",
      "คณะปฏิรูปการปกครองแผ่นดินตั้งนายธานินทร์ กรัยวิเชียร เป็นนายกรัฐมนตรี นักศึกษาจำนวนมากเข้าป่า และเมื่อปล่อยผู้ต้องหา พลเอกเกรียงศักดิ์ ชมะนันทน์ นายกรัฐมนตรีในขณะนั้น ได้กล่าวว่า “แล้วก็ให้แล้วกันไป ลืมมันเสียเถิดนะ”",
    ],
    afterQuote: {
      text: impunityTh,
      cite: "สุธาชัย ยิ้มประเสริฐ เหตุการณ์ 6 ตุลาฯ เกิดขึ้นได้อย่างไร",
      href: how,
    },
    namesHeading: "เหยื่อความรุนแรง",
    namesQuote: {
      text: humanityTh,
      cite: "โครงการบันทึก 6 ตุลา เหยื่อความรุนแรง",
      href: victimsPage,
    },
    namesIntro:
      "นักศึกษาและประชาชนจำนวน 40 รายที่เสียชีวิตจากการฆาตกรรมหมู่เมื่อวันที่ 6 ตุลา ตามที่โครงการบันทึก 6 ตุลา รวบรวมไว้ ชื่อที่มีลิงก์จะพาไปยังเรื่องราวของแต่ละคน",
    readMoreAbout: "อ่านเรื่องราวของ",
    age: (years) => `อายุ ${years} ปี`,
    separator: " ",
    namesSource: "หน้าเหยื่อความรุนแรง โครงการบันทึก 6 ตุลา",
    deadHeading: "มีผู้เสียชีวิตกี่คน",
    deadIntro:
      "ผ่านมา 50 ปี ข้อเท็จจริงพื้นฐานอย่างจำนวนผู้เสียชีวิตก็ยังไม่ตรงกัน โครงการบันทึก 6 ตุลา อธิบายที่มาของแต่ละตัวเลขไว้",
    figures: [
      { value: "39", label: "ผู้เสียชีวิตตามตัวเลขทางการ" },
      { value: "46", label: "ผู้เสียชีวิตอย่างน้อย ตามเอกสารชันสูตรพลิกศพ" },
      { value: "40", label: "นักศึกษาและประชาชน ตามการรวบรวมของโครงการ" },
      { value: "3,094", label: "ผู้ถูกจับกุมในวันนั้น" },
    ],
    figuresNote:
      "เอกสารชันสูตรพลิกศพรวมเจ้าหน้าที่ 5 ราย และชายอีก 1 รายที่เสียชีวิตในห้องขังเมื่อเดือนมกราคม 2520 โครงการไม่นับรายนี้ในตัวเลข 40 แต่นับนักศึกษาหญิงที่เสียชีวิตจากบาดแผลเมื่อเดือนธันวาคม 2519 ขณะที่แหล่งข่าวอ้างอิงจากการเก็บศพของเจ้าหน้าที่มูลนิธิร่วมกตัญญู ประมาณว่ามีนักศึกษาประชาชนเสียชีวิต 530 คน",
    whyHeading: "ทำไมเราต้องจำ",
    why: [
      "โครงการ “บันทึก 6 ตุลา” คือแหล่งข้อมูลออนไลน์ที่มุ่งเก็บรวบรวมรักษาและจัดระบบข้อมูลที่ยังกระจัดกระจายในที่ต่างๆ ทั้งเอกสารชันสูตรพลิกศพ หนังสือพิมพ์ เสียงจากวิทยุ ภาพถ่าย และเรื่องราวของผู้เสียชีวิตจากปากคำของครอบครัวและเพื่อน",
      "เราเป็นสมาคมนักศึกษาที่ท่าพระจันทร์ เราขอร่วมรักษาความทรงจำของพวกเขาไว้บนผืนดินที่พวกเขาถูกสังหาร",
    ],
    whyQuote: {
      text: aimTh,
      cite: "โครงการบันทึก 6 ตุลา เกี่ยวกับโครงการ",
      href: `${DOCT6}/about`,
    },
    learnHeading: "ศึกษาเพิ่มเติม",
    learnIntro: "อ่านต่อได้ที่โครงการบันทึก 6 ตุลา",
    learnLinks: [
      { label: "ลำดับเหตุการณ์ฉบับเต็ม", href: `${DOCT6}/learn-about/timeline` },
      { label: "เหตุการณ์ 6 ตุลาฯ เกิดขึ้นได้อย่างไร", href: how },
      { label: "เหยื่อความรุนแรง", href: victimsPage },
      { label: "หลักฐาน", href: `${DOCT6}/documents` },
      { label: "ร่วมเผชิญอยุติธรรม ร่วมความทรงจำ", href: `${DOCT6}/contribute` },
    ],
    closing: "เราไม่ลืม",
    creditsHeading: "แหล่งที่มาและเครดิต",
    creditsIntro:
      "ข้อเท็จจริง ข้อความที่อ้างอิง และภาพถ่ายทุกภาพในหน้านี้มาจากโครงการบันทึก 6 ตุลา (Documentation of Oct 6, doct6.com) ภาพและข้อความแต่ละชิ้นมีลิงก์ไปยังหน้าที่โครงการเผยแพร่ไว้",
    creditsTerms:
      "เอกสารหรือหลักฐานที่ปรากฏในเว็บไซต์ “บันทึก 6 ตุลา” มีจุดประสงค์เพื่อการเรียนรู้และประโยชน์ต่อสังคมเท่านั้น หากต้องการนำไปใช้ในทางธุรกิจหรือเพื่อแสวงหากำไร กรุณาติดต่อโครงการก่อนหรือขออนุญาตโดยตรงจากครอบครัวของผู้เสียชีวิต",
    photoSource: "ดูที่ doct6.com",
  },
};
