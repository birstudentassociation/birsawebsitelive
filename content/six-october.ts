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
  en: "Photographer unknown. Pathomporn Srimanta set, Documentation of Oct 6.",
  th: "ไม่ทราบผู้ถ่ายภาพ ภาพชุดคุณปฐมพร ศรีมันตะ โครงการบันทึก 6 ตุลา",
};

const lombard: Record<Locale, string> = {
  en: "Photograph by Frank Lombard, then a New Zealand radio reporter, who gave his colour film to Documentation of Oct 6.",
  th: "ภาพโดยแฟรงค์ ลอมบาร์ด ผู้สื่อข่าววิทยุชาวนิวซีแลนด์ในขณะนั้น ผู้มอบฟิล์มสีชุดนี้ให้โครงการบันทึก 6 ตุลา",
};

const archiveCredit: Record<Locale, string> = {
  en: "Photograph from Documentation of Oct 6, which does not name the photographer.",
  th: "ภาพจากโครงการบันทึก 6 ตุลา ซึ่งไม่ได้ระบุชื่อผู้ถ่ายภาพ",
};

const s011 = `${DOCT6}/archives/2235`;

const photo = (
  src: string,
  width: number,
  height: number,
  alt: Record<Locale, string>,
  caption: Record<Locale, string>,
  credit: Record<Locale, string> = unknownPhotographer,
  source: string = s011
): SixOctoberImage => ({ src, width, height, source, alt, caption, credit });

const khaosod = "https://www.khaosod.co.th/wpapp/uploads/2018/10/Thailand-Massacre-Ann_Cham-12.jpg";

export const hero: SixOctoberImage = {
  src: "/6-october/hero-thammasat.webp",
  width: 2400,
  height: 1619,
  source: khaosod,
  alt: {
    en: "Hundreds of students lie face down across the Thammasat football field, most stripped to the waist with their hands behind their heads, while a policeman holding a rifle stands over them. The Dome building and its spire rise behind.",
    th: "นักศึกษาหลายร้อยคนนอนคว่ำเต็มสนามฟุตบอลธรรมศาสตร์ ถูกถอดเสื้อ โดนสั่งให้เอามือประสานไว้ที่ท้ายทอย ตำรวจถือปืนยืนคุมอยู่ เบื้องหลังคือตึกโดมและยอดโดม",
  },
  caption: {
    en: "Behind the title, the football field of Thammasat University on the morning of 6 October 1976, with the Dome behind.",
    th: "ภาพพื้นหลังแสดงให้เห็นสนามฟุตบอล มหาวิทยาลัยธรรมศาสตร์ เช้าวันที่ 6 ตุลาคม 2519",
  },
  credit: {
    en: "Photograph by The Associated Press, published by Khaosod.",
    th: "ภาพโดยสำนักข่าวเอพี เผยแพร่โดยข่าวสด",
  },
};

export const images = {
  fieldBuses: photo(
    "/6-october/field-buses.webp",
    2200,
    1434,
    {
      en: "Police with rifles stand among buses on the wet Thammasat football field, with the Dome building and its spire behind them and an empty chair in the foreground.",
      th: "ตำรวจถืออาวุธยืนอยู่ท่ามกลางรถโดยสารบนสนามฟุตบอลธรรมศาสตร์ที่เปียกน้ำ เบื้องหลังคือตึกโดม เบื้องหน้ามีเก้าอี้ว่างตัวหนึ่ง",
    },
    {
      en: "The football field at Thammasat University, with the Dome behind.",
      th: "บริเวณสนามฟุตบอล มหาวิทยาลัยธรรมศาสตร์ เบื้องหลังคือตึกโดม",
    }
  ),
  museum: photo(
    "/6-october/police-national-museum.webp",
    1600,
    986,
    {
      en: "Uniformed police run crouching past the gate of the National Museum.",
      th: "ตำรวจในเครื่องแบบวิ่งก้มตัวผ่านประตูพิพิธภัณฑสถานแห่งชาติ",
    },
    { en: "In front of the National Museum.", th: "บริเวณหน้าพิพิธภัณฑสถานแห่งชาติ" }
  ),
  mainGate: photo(
    "/6-october/main-gate.webp",
    1600,
    1013,
    {
      en: "A wrecked sentry box and an overturned cart lie at the main gate, with a dense crowd beyond the railings.",
      th: "ป้อมยามพังและรถเข็นคว่ำอยู่หน้าประตูใหญ่ ฝูงชนหนาแน่นอยู่หลังรั้ว",
    },
    { en: "The main gate of Thammasat University.", th: "บริเวณประตูใหญ่ มหาวิทยาลัยธรรมศาสตร์" }
  ),
  greatHall: photo(
    "/6-october/great-hall-rifle.webp",
    1600,
    1001,
    {
      en: "A policeman kneels and aims a rifle while others crouch on the grass beside him.",
      th: "ตำรวจคุกเข่าเล็งปืนไรเฟิล ขณะที่คนอื่นหมอบอยู่บนสนามหญ้าเรียงกัน",
    },
    { en: "At the Great Hall.", th: "เหตุการณ์บริเวณหอประชุมใหญ่" }
  ),
  inside: photo(
    "/6-october/inside-building.webp",
    1600,
    1014,
    {
      en: "Armed men stand in the shadows of a corridor inside a university building.",
      th: "ชายถืออาวุธยืนอยู่ในเงามืดของทางเดินภายในอาคาร",
    },
    { en: "Inside a teaching building.", th: "ภายในอาคารเรียน" }
  ),
  gate: photo(
    "/6-october/tha-prachan-gate.webp",
    1600,
    1020,
    {
      en: "A crowd stands around a city bus pushed against the Tha Prachan gate of Thammasat University.",
      th: "ฝูงชนยืนล้อมรถเมล์ที่ถูกดันเข้าชนประตูท่าพระจันทร์ มหาวิทยาลัยธรรมศาสตร์",
    },
    {
      en: "The Tha Prachan gate of Thammasat University.",
      th: "บริเวณประตูท่าพระจันทร์ มหาวิทยาลัยธรรมศาสตร์",
    }
  ),
  fieldLying: photo(
    "/6-october/field-lying.webp",
    1600,
    1032,
    {
      en: "Students in shirts and trousers lie and crawl across the grass of the football field.",
      th: "นักศึกษาใส่เสื้อเชิ้ตและกางเกง นอนและคลานอยู่บนสนามหญ้า",
    },
    {
      en: "The football field at Thammasat University.",
      th: "บริเวณสนามฟุตบอล มหาวิทยาลัยธรรมศาสตร์",
    }
  ),
  surrender: photo(
    "/6-october/football-field.webp",
    1600,
    977,
    {
      en: "Young people walk in a line with their hands on their heads past an armed man on the Thammasat football field.",
      th: "คนเดินเรียงแถวเอามือประสานบนศีรษะ มีเจ้าหน้าที่ถืออาวุธในสนามฟุตบอลมหาวิทยาลัยธรรมศาสตร์",
    },
    {
      en: "The football field at Thammasat University.",
      th: "บริเวณสนามฟุตบอล มหาวิทยาลัยธรรมศาสตร์",
    }
  ),
  fieldWide: photo(
    "/6-october/field-wide.webp",
    2200,
    1370,
    {
      en: "Hundreds of students lie face down in rows across the football field, many stripped to the waist, while police stand along the far side in front of the university buildings.",
      th: "นักศึกษาหลายร้อยคนนอนคว่ำเรียงแถวเต็มสนามฟุตบอล ซึ่งทุกคนได้ถูกสั่งให้ถอดเสื้อ ตำรวจยืนเรียงอยู่ด้านหลังหน้าอาคารของมหาวิทยาลัย",
    },
    {
      en: "The football field at Thammasat University.",
      th: "บริเวณสนามฟุตบอล มหาวิทยาลัยธรรมศาสตร์",
    }
  ),
  crawling: photo(
    "/6-october/field-crawling.webp",
    1600,
    1000,
    {
      en: "Shirtless young men crawl on hands and knees in a line between police officers holding rifles.",
      th: "ชายหนุ่มถูกถอดเสื้อคลานเข่าเรียงแถวผ่านตำรวจที่ถือปืน",
    },
    {
      en: "The football field at Thammasat University.",
      th: "บริเวณสนามฟุตบอล มหาวิทยาลัยธรรมศาสตร์",
    }
  ),
  guard: photo(
    "/6-october/field-guard.webp",
    1600,
    1024,
    {
      en: "Two armed police stand over rows of students lying face down with their hands behind their heads.",
      th: "ตำรวจถืออาวุธสองนายยืนคุมนักศึกษาที่นอนคว่ำเรียงแถว มือประสานไว้ที่ท้ายทอย",
    },
    {
      en: "The football field at Thammasat University.",
      th: "บริเวณสนามฟุตบอล มหาวิทยาลัยธรรมศาสตร์",
    }
  ),
  detained: photo(
    "/6-october/detained-students.webp",
    1600,
    1044,
    {
      en: "Rows of students lie face down on the grass, many stripped to the waist, while police stand over them in front of parked buses.",
      th: "นักศึกษานอนคว่ำเรียงแถวบนสนามหญ้า หลายคนถูกถอดเสื้อ ตำรวจยืนคุมอยู่หน้ารถโดยสารที่จอดเรียงกัน",
    },
    {
      en: "Thammasat, late on the morning of 6 October 1976. Frank Lombard arrived at about 10.45.",
      th: "มหาวิทยาลัยธรรมศาสตร์ สายวันที่ 6 ตุลาคม 2519 แฟรงค์ ลอมบาร์ดไปถึงประมาณ 10.45 น.",
    },
    lombard,
    `${DOCT6}/archives/8753`
  ),
  busLine: photo(
    "/6-october/bus-line.webp",
    1600,
    1061,
    {
      en: "Shirtless detainees stand in a line with their hands on their heads beside a bus, watched by a helmeted policeman.",
      th: "ผู้ถูกจับถูกถอดเสื้อยืนเรียงแถวเอามือประสานบนศีรษะข้างรถโดยสาร มีตำรวจสวมหมวกเหล็กคุม",
    },
    {
      en: "The football field at Thammasat University.",
      th: "บริเวณสนามฟุตบอล มหาวิทยาลัยธรรมศาสตร์",
    }
  ),
  busLoading: photo(
    "/6-october/bus-loading.webp",
    1600,
    1007,
    {
      en: "Detainees with their hands on their heads climb onto a bus while a policeman looks on.",
      th: "ผู้ถูกจับเอามือประสานบนศีรษะทยอยขึ้นรถโดยสาร มีตำรวจยืนคุม",
    },
    {
      en: "The football field at Thammasat University.",
      th: "บริเวณสนามฟุตบอล มหาวิทยาลัยธรรมศาสตร์",
    }
  ),
  fieldPolice: photo(
    "/6-october/field-police.webp",
    1600,
    990,
    {
      en: "Armed Border Patrol Police gather on the litter strewn football field.",
      th: "ตำรวจตระเวนชายแดนถืออาวุธรวมกลุ่มอยู่บนสนามฟุตบอลที่เกลื่อนไปด้วยเศษกระดาษ",
    },
    {
      en: "The football field at Thammasat University.",
      th: "บริเวณสนามฟุตบอล มหาวิทยาลัยธรรมศาสตร์",
    }
  ),
  rally: photo(
    "/6-october/royal-plaza-rally.webp",
    1600,
    1007,
    {
      en: "A dense crowd fills the Royal Plaza in front of the Ananta Samakhom Throne Hall.",
      th: "ฝูงชนหนาแน่นเต็มลานพระบรมรูปทรงม้า หน้าพระที่นั่งอนันตสมาคม",
    },
    { en: "A rally at the Royal Plaza.", th: "การชุมนุมที่ลานพระบรมรูปทรงม้า" }
  ),
  scouts: photo(
    "/6-october/village-scouts.webp",
    1600,
    1032,
    {
      en: "Village Scouts in neckerchiefs stand in a long line along a road, some holding flags.",
      th: "ลูกเสือชาวบ้านผูกผ้าพันคอยืนเรียงแถวยาวริมถนน บางคนถือธง",
    },
    {
      en: "A line of Village Scouts at Wat Bowonniwet Vihara.",
      th: "แถวลูกเสือชาวบ้านบริเวณวัดบวรนิเวศวิหาร",
    }
  ),
};

export type PhotoKey = keyof typeof images;

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
      en: "19. A third year Liberal Arts student at Thammasat. His parents, Chinda and Lim, searched the country for their son.",
      th: "อายุ 19 ปี นักศึกษาชั้นปีที่ 3 คณะศิลปศาสตร์ มหาวิทยาลัยธรรมศาสตร์ ซึ่งพ่อจินดาและแม่ลิ้มพลิกแผ่นดินตามหาเขา",
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

type L = Record<Locale, string>;

/**
 * Words of survivors, families and witnesses, copied exactly from the pages of
 * Documentation of Oct 6 named in `href`. The English is a faithful rendering.
 * None of them describes the dead in detail, and none touches the monarchy.
 */
export type Testimony = { th: string; en: string; speaker: L; href: string };

const suchada = `${DOCT6}/archives/10259`;
const thongchai = `${DOCT6}/archives/13829`;
const thatsanee = `${DOCT6}/archives/8216`;
const somthat = `${DOCT6}/archives/4085`;
const thongsin = `${DOCT6}/archives/10262`;

const suchadaSpeaker: L = {
  en: "Suchada Chakphisut, a first year Thammasat student in the drama club in 1976",
  th: "สุชาดา จักรพิสุทธิ์ นักศึกษาปีหนึ่ง ชมรมนาฎศิลป์และการละคร มหาวิทยาลัยธรรมศาสตร์ ในปี 2519",
};
const thongchaiSpeaker: L = {
  en: "Thongchai Winichakul, a student leader on the stage that morning, in a 2000 interview",
  th: "ธงชัย วินิจจะกูล ผู้นำนักศึกษา ในบทสัมภาษณ์ปี 2543",
};
const thatsaneeSpeaker: L = {
  en: "Thatsanee Sichan, a close friend of Wimonwan Rungthongbaisuri",
  th: "ทัศนีย์ ศรีจันทร์ เพื่อนสนิทของวิมลวรรณ รุ่งทองใบสุรีย์",
};
const somthatSpeaker: L = {
  en: "Somthat Bunthaphan, the eldest brother of Supol Phan",
  th: "สมทัด บุญทะพาน พี่ชายคนโตของสุพล พาน",
};
const limSpeaker: L = {
  en: "Lim Thongsin, Jarupong's mother, in 2002",
  th: "แม่ลิ้ม ทองสินธุ์ แม่ของจารุพงษ์ ปี 2545",
};
const natdaSpeaker: L = {
  en: "Natda Iamkhong, Danaisak's elder sister",
  th: "นัดดา เอี่ยมคง พี่สาวของดนัยศักดิ์ เอี่ยมคง",
};

export const testimonies = {
  radio: {
    th: "สถานีวิทยุยานเกราะจึงได้เริ่มผนึกกำลังกับผู้บริหารสถานีวิทยุต่าง ๆ สองร้อยหกสิบสถานี พร้อมกับผู้จัดรายการจำนวนมาก ซึ่งเป็นชมรมวิทยุเสรีและด้านมวลชนมหาศาล ซึ่งเป็นผู้ฟังเป็นกำลังร่วมปฏิบัติการ",
    en: "Yan Kraw radio therefore began joining forces with the managers of two hundred and sixty radio stations and many presenters, the Free Radio Association and an enormous mass base, whose listeners were a force taking part in the operation.",
    speaker: {
      en: "Lieutenant Colonel Uthan Sanitwong na Ayutthaya of Yan Kraw radio, in his statement to police in December 1976",
      th: "พ.ท.อุทาร สนิทวงศ์ ณ อยุธยา สถานีวิทยุยานเกราะ ในบันทึกคำให้การต่อตำรวจ ธันวาคม 2519",
    },
    href: `${DOCT6}/archives/15228`,
  },
  waiting: {
    th: "จนตกเย็น ฉันก็ ยังไม่ได้กินข้าว และดูเหมือนไม่มีใครในห้องชมรมได้กินข้าวเย็น เราเอาขนมของขบเคี้ยวมาแบ่งกันกิน",
    en: "By evening I still had not eaten, and it seemed nobody in the club room had eaten supper. We shared out snacks.",
    speaker: suchadaSpeaker,
    href: suchada,
  },
  boom: {
    th: "ฉันง่วงหลับไปและมาสะดุ้งสุดตัวตื่นขึ้น ด้วยเสียง ‘ตูม’ ที่ดังสนั่นหวั่นไหวจนตึกสะเทือน",
    en: "I had dozed off, and I woke with a violent start at a ‘boom’ so loud the whole building shook.",
    speaker: suchadaSpeaker,
    href: suchada,
  },
  grenade: {
    th: "ตี 5 ครึ่ง น. พอระเบิดลงเห็นคนนอนเป็นแพ แล้วก็มีคนมาบอกว่าตายเป็นสิบ บาดเจ็บจำนวนหนึ่ง",
    en: "At half past five, when the bomb came down, I saw people lying all across the ground. Then someone came to tell me ten or more were dead, and others wounded.",
    speaker: thongchaiSpeaker,
    href: thongchai,
  },
  stopFiring: {
    th: "‘หยุดยิง ! หยุดยิงครับ พวกเราไม่มีอาวุธ เราไม่มีอะไร พี่ๆทหารครับ พี่ๆตำรวจครับ ให้พวกเราออกไป…’ เสียงนั้นแหบแห้งสั่นเครือ บีบคั้นหัวใจฉันยิ่งนัก",
    en: "‘Stop firing! Please stop firing! We have no weapons. We have nothing. Brothers in the army, brothers in the police, let us out…’ The voice was hoarse and trembling, and it wrung my heart.",
    speaker: suchadaSpeaker,
    href: suchada,
  },
  schoolgirl: {
    th: "ฉันเหลือบเห็นเด็กผู้หญิงในชุดนักเรียนคอซอง นั่งปิดหน้าซุกตัวร้องไห้โฮๆกับมุมตึก ฉันรีบคว้าตัวน้องมากอดไว้ แล้วเราก็ร้องไห้ด้วยกัน",
    en: "I caught sight of a schoolgirl in her sailor collar uniform, huddled in the corner of the building with her face in her hands, sobbing. I pulled her to me and held her, and we cried together.",
    speaker: suchadaSpeaker,
    href: suchada,
  },
  river: {
    th: "มีเสียงตำรวจน้ำตะโกนบอกว่า นักศึกษาธรรมศาสตร์ที่หนีออกนั้นให้กลับขึ้นฝั่งเดี๋ยวนี้ ไม่งั้นจะยิง พวกเรากลัวกันมาก มีเพื่อนนักศึกษาชายถอดเสื้อ บอกไปว่า พวกเรายอมแพ้แล้วนะ ไม่ทันขาดคำ แป๊บเดียวเสียงปืนดังมาหนึ่งนัด มีเสียงตะโกนว่ามีคนถูกยิง",
    en: "The river police shouted that the Thammasat students who had fled must come back ashore at once, or they would shoot. We were terrified. A male student took off his shirt and called out that we surrendered. Before he had finished, a single shot rang out, and someone shouted that a person had been hit.",
    speaker: thatsaneeSpeaker,
    href: thatsanee,
  },
  strip: {
    th: "เวลาขึ้นจากน้ำก็เอาปืนจี้ บังคับให้คุณถอดเสื้อแล้ววิ่งไปรวมกันอยู่ที่ วัดมหาธาตุ",
    en: "As you came up out of the water they put a gun to you, made you take off your shirt, and run to gather at Wat Mahathat.",
    speaker: thongchaiSpeaker,
    href: thongchai,
  },
  bangKhen: {
    th: "จากนั้น พี่ถูกนำไปขังรวมกันกับเพื่อนๆ อีกประมาณสามพันคนที่บางเขน แล้วก็ได้ข่าวตรงนั้นเองว่า เพื่อนที่ถูกยิงนั้นคือวิมลวรรณซึ่งไปเสียชีวิตที่โรงพยาบาลศิริราช",
    en: "Then I was locked up at Bang Khen with about three thousand of my friends, and it was there that I heard the friend who had been shot was Wimonwan. She had died at Siriraj Hospital.",
    speaker: thatsaneeSpeaker,
    href: thatsanee,
  },
  unknownMan: {
    th: "คนเสียชีวิตนี่เขาจะเขียนว่าชายไทยไม่ทราบชื่อ ยังจำได้ตลอดว่า ชายไทยไม่ทราบชื่อ เพราะเขาไม่มีหลักฐานไม่มีอะไรที่จะรู้ เราก็ไม่เคยคิดว่าน้องจะเสียชีวิต เพราะเขาเป็นคนฉลาด",
    en: "The dead were written down as ‘Thai man, name unknown’. I have never forgotten it, ‘Thai man, name unknown’, because there was no paper, nothing to say who he was. We never thought our brother could have died, because he was clever.",
    speaker: natdaSpeaker,
    href: `${DOCT6}/archives/2442`,
  },
  morgue: {
    th: "ผมไม่กล้าเข้าไป ผมยืนอยู่ข้างนอก ผมเป็นผู้ชายแต่ผมไม่กล้าไป แม่ผมกับพี่สาวคนหนึ่งเขาเข้าไปดูด้วยกัน ด้วยความที่แม่เป็นห่วงลูก เขาต้องเข้าไปดู",
    en: "I could not bring myself to go in. I stood outside. I am a man, but I did not dare. My mother and one of my sisters went in together, because a mother who fears for her child has to go and see.",
    speaker: somthatSpeaker,
    href: somthat,
  },
  sleeves: {
    th: "ความจริงเขาจับลูกแม่แล้วนะ เพราะตอนที่ไปรับศพ แขนเสื้อทั้งสองข้างยังผูกอยู่กับเอว เขาจับแล้วทำไมต้องฆ่ากัน ยิงทำไม เขาจับคนไม่ผิดอย่างนั้น ใครจะรับผิดชอบ",
    en: "They had already caught my son. When I went to collect him, both his shirt sleeves were still tied around his waist. If they had caught him, why kill him? Why shoot? They caught a boy who had done nothing wrong. Who will take responsibility?",
    speaker: {
      en: "Lek, mother of Manu Witthayaphon",
      th: "แม่เล็ก แม่ของมนู วิทยาภรณ์",
    },
    href: `${DOCT6}/archives/13471`,
  },
  neighbour: {
    th: "ข้างบ้านนี่ ลูกเขากลับจากกรุงเทพ ได้ยินเสียงเขาเรียกว่า อภิสิทธิ์มา ไอ้น้องมาเว้ยๆ เปิดประตูออกไป อ้าว ไม่ใช่",
    en: "Next door, the neighbours' son came home from Bangkok, and I heard them call out, ‘Apisit is here, the boy is here!’ I opened the door and went out. Oh. It was not him.",
    speaker: {
      en: "Bangoen Thainiyom, mother of Apisit Thainiyom",
      th: "บังเอิญ ไทยนิยม แม่ของอภิสิทธิ์ ไทยนิยม",
    },
    href: `${DOCT6}/archives/2140`,
  },
  crowds: {
    th: "เห็นคนหมื่น คนแสน แต่ลูกเรา เราไม่เห็นว่าไปไหน ทำไมมันไม่ออกให้แม่เห็นสักที",
    en: "I see tens of thousands, hundreds of thousands of people, but my own child I never see. Why will he not come out, just once, and let his mother see him?",
    speaker: limSpeaker,
    href: thongsin,
  },
  silence: {
    th: "เราต่างก็มองหน้ากันแล้วก็ไม่มีใครพูด แต่หลายคนเขาก็ร้องไห้ แต่ก็ไม่มีใครพูดอะไร หรือปรึกษาหารือกัน ในยุคสมัยนั้นความหวาดกลัวมันสูงมาก",
    en: "We all looked at one another and nobody spoke. Many were crying, but nobody said anything or talked it over. In those days the fear was very great.",
    speaker: somthatSpeaker,
    href: somthat,
  },
  justice: {
    th: "ลูกของเราอยากหาความเป็นธรรม หาความยุติธรรม และให้คนทุกคนได้รับสิทธิเสรีภาพ สมควรตามรัฐธรรมนูญ",
    en: "Our son wanted fairness, he wanted justice, and he wanted everyone to have the rights and freedoms the constitution gives them.",
    speaker: {
      en: "Chinda Thongsin, a teacher and Jarupong's father, in 2002",
      th: "ครูจินดา ทองสินธุ์ พ่อของจารุพงษ์ ปี 2545",
    },
    href: thongsin,
  },
  innocent: {
    th: "ผมรู้ดีอยู่ว่า น้องชายผมเขาไม่มีอาวุธอะไรเลย เขาเป็นคนบริสุทธิ์คนหนึ่งที่มีความรู้สึกอยากเรียกร้องสิ่งที่ถูกต้อง เรียกร้องสิ่งซึ่งสังคมขณะนั้นต้องการให้มันดีกว่าเดิม แค่นั้นเอง",
    en: "I know very well my brother had no weapon at all. He was an innocent man who wanted to ask for what was right, to ask for the society of his time to be better than it was. That is all.",
    speaker: somthatSpeaker,
    href: somthat,
  },
  heroes: {
    th: "พี่ไม่เข้าใจว่า ทำไม 6 ตุลาถึงไม่ใช่วีรชน ในสายตาของคนไทย จริงๆ แล้ว เขาเป็นวีรชนของคนไทยทุกๆ คน",
    en: "I do not understand why the people of 6 October are not heroes in the eyes of Thai people. In truth, they are heroes to every Thai.",
    speaker: {
      en: "Rungthip Wongngamdi, younger sister of Phumisak Sirasuphaluekchai",
      th: "รุ่งทิพย์ วงศ์งามดี น้องสาวของภูมิศักดิ์ ศิระศุภฤกษ์ชัย",
    },
    href: `${DOCT6}/archives/8212`,
  },
  door: {
    th: "ไม่มีเหตุผลอะไรเลยในลักษณะของเหตุการณ์หนึ่งที่เราจะปิดประตูของความเป็นจริงเอาไว้ไม่ให้คนรับรู้ โอเค เราอาจจะค่อยๆ ลืมมันไป แต่บานประตูนั้นก็ควรจะแง้มออกมาเพื่อให้ทุกคนได้มองเข้าไปว่า เกิดอะไรขึ้นในช่วงประวัติศาสตร์ช่วงนั้นมากกว่า",
    en: "There is no reason to shut the door on the truth of an event like this so that people never know. Fine, we may slowly forget. But that door should be left ajar, so that everyone can look in and see what happened in that part of our history.",
    speaker: somthatSpeaker,
    href: somthat,
  },
  cannotForget: {
    th: "คิดว่าวันไหนก็ตามหากหมดชีวิตก็จะลืม … แต่นี่มันลืมไม่ลง แม่ลืมไม่ได้",
    en: "I think that whenever my life ends, then I will forget… but this I cannot let go. A mother cannot forget.",
    speaker: limSpeaker,
    href: thongsin,
  },
  neverForgotten: {
    th: "อยากบอกว่า พี่รักน้อง พี่ไม่เคยลืมเลย … ไม่ได้ไปจากหัวใจเราเลย",
    en: "I want to tell him, your sister loves you, I have never forgotten… you have never left our hearts.",
    speaker: natdaSpeaker,
    href: `${DOCT6}/archives/2442`,
  },
} satisfies Record<string, Testimony>;

export type TestimonyKey = keyof typeof testimonies;

export type Block =
  | { kind: "moment"; time: L; text: L }
  | { kind: "photo"; photo: PhotoKey; wide?: boolean }
  | { kind: "pair"; photos: [PhotoKey, PhotoKey] }
  | { kind: "testimony"; id: TestimonyKey };

export type Chapter = { id: string; kicker: L; heading: L; blocks: Block[] };

const loose: Record<string, number> = { Evening: 18 * 60, "All night": 23 * 60 };

export function momentClock(chapterId: string, time: string) {
  const match = /^(\d{2})\.(\d{2})$/.exec(time);
  const minutes = match ? Number(match[1]) * 60 + Number(match[2]) : loose[time];
  return { day: chapterId === "night" ? 5 : 6, minutes: minutes ?? 0 };
}

const at = (en: string, th: string, textEn: string, textTh: string): Block => ({
  kind: "moment",
  time: { en, th },
  text: { en: textEn, th: textTh },
});
const say = (id: TestimonyKey): Block => ({ kind: "testimony", id });
const show = (p: PhotoKey, wide = false): Block => ({ kind: "photo", photo: p, wide });
const pair = (a: PhotoKey, b: PhotoKey): Block => ({ kind: "pair", photos: [a, b] });

/**
 * The day, chapter by chapter. Times and the Thai of each moment follow the
 * timeline of Documentation of Oct 6; photographs sit where their archive
 * captions place them, though the archive records no clock time for them.
 */
export const story: Chapter[] = [
  {
    id: "night",
    kicker: { en: "Tuesday 5 October 1976", th: "วันอังคารที่ 5 ตุลาคม 2519" },
    heading: { en: "The night before", th: "คืนก่อนเกิดเหตุ" },
    blocks: [
      at(
        "10.00",
        "10.00 น.",
        "Yan Kraw army radio runs a special programme. Its presenter repeats that the rally at Thammasat is no longer against Thanom, but an insult to the monarchy.",
        "สถานีวิทยุยานเกราะเปิดรายการพิเศษ เสียงของ พ.ท.อุทาร สนิทวงศ์ กล่าวเน้นเป็นระยะว่า “เดี๋ยวนี้การชุมนุมที่ธรรมศาสตร์ไม่ใช่เป็นเรื่องต่อต้านพระถนอมแล้ว หากแต่เป็นเรื่องหมิ่นพระบรมเดชานุภาพ”"
      ),
      say("radio"),
      at(
        "13.30",
        "13.30 น.",
        "Ramkhamhaeng students prepare to set out for Thammasat in 25 vehicles.",
        "นักศึกษารามคำแหงเตรียมออกเดินทางไปสมทบที่ธรรมศาสตร์ 25 คันรถ"
      ),
      at(
        "Evening",
        "ตกเย็น",
        "The rally swells to tens of thousands and moves from Lan Pho to the football field.",
        "จำนวนผู้ร่วมชุมนุมเพิ่มมากขึ้นนับหมื่นคน จึงย้ายการชุมนุมจากบริเวณลานโพธิ์มายังสนามฟุตบอล"
      ),
      say("waiting"),
      at(
        "20.35",
        "20.35 น.",
        "For the first time, Yan Kraw and the Free Radio Association call the students and people at Thammasat “troublemakers”, and say there “may be bloodshed”.",
        "นับเป็นครั้งแรกที่สถานีวิทยุยานเกราะ และชมรมวิทยุเสรี เรียกกลุ่มนักศึกษาประชาชนที่ธรรมศาสตร์ว่า “ผู้ก่อความไม่สงบ” และกล่าวคำว่า “อาจมีการนองเลือดขึ้น”"
      ),
      at(
        "21.30",
        "21.30 น.",
        "The National Student Centre of Thailand brings the two student actors before the press to show their innocence.",
        "ศนท. นำนายอภินันท์ บัวหภักดี และนายวิโรจน์ ตั้งวาณิชย์ สมาชิกชุมนุมนาฏศิลป์และการละคร มหาวิทยาลัยธรรมศาสตร์ มาแสดงความบริสุทธิ์ใจ"
      ),
      at(
        "All night",
        "ตลอดคืน",
        "Yan Kraw and the Free Radio Association broadcast through the night, calling on the public and the Village Scouts to gather at the Royal Plaza.",
        "สถานีวิทยุยานเกราะและชมรมวิทยุเสรีออกอากาศตลอดคืนเรียกร้องให้ประชาชนและลูกเสือชาวบ้านไปชุมนุมที่ลานพระบรมรูปทรงม้า"
      ),
    ],
  },
  {
    id: "dawn",
    kicker: { en: "Wednesday 6 October, before dawn", th: "วันพุธที่ 6 ตุลาคม ก่อนรุ่งสาง" },
    heading: { en: "The first shots", th: "เสียงปืนนัดแรก" },
    blocks: [
      at(
        "01.40",
        "01.40 น.",
        "About 100 people burn posters at the Sanam Luang gate of the university. The first shot rings out. Scattered shots follow, but no one is hurt.",
        "กลุ่มคนประมาณ 100 คนได้บุกเข้าไปเผาแผ่นโปสเตอร์หน้าประตูมหาวิทยาลัยธรรมศาสตร์ ด้านสนามหลวง มีเสียงปืนนัดแรกดังขึ้นและมีการยิงตอบโต้ประปรายแต่ไม่มีใครบาดเจ็บ"
      ),
      at(
        "04.00",
        "04.00 น.",
        "Border Patrol Police from Naresuan camp, Hua Hin, arrive, surround the university from the Sanam Luang side, and post armed men in the National Museum.",
        "ตำรวจตระเวนชายแดน จากค่ายนเรศวร หัวหิน เดินทางมาถึง และยกกำลังเข้าล้อมมหาวิทยาลัยจากทางด้านสนามหลวง และนำกำลังติดอาวุธไปตั้งในพิพิธภัณฑสถานแห่งชาติ"
      ),
      show("museum"),
      say("boom"),
      at(
        "05.30",
        "05.30 น.",
        "The first M79 grenade, fired by police outside the university, lands among the crowd on the football field. Four people are killed and others are wounded.",
        "ระเบิดเอ็ม.๗๙ ลูกแรก ถูกยิงมาจากฝ่ายตำรวจนอกมหาวิทยาลัย ตกกลางผู้ชุมนุมที่สนามฟุตบอล มีผู้เสียชีวิต ๔ คน และบาดเจ็บอีกจำนวนหนึ่ง"
      ),
      say("grenade"),
    ],
  },
  {
    id: "fire",
    kicker: { en: "6 October, from 07.00", th: "6 ตุลาคม ตั้งแต่ 07.00 น." },
    heading: { en: "Under fire", th: "ใต้ห่ากระสุน" },
    blocks: [
      at(
        "07.00",
        "07.00 น.",
        "Police pour heavy fire into the university from the Great Hall and the National Museum. Thousands shelter in the buildings around the football field. Dozens are killed.",
        "เจ้าหน้าที่ตำรวจระดมยิงเข้ามาในมหาวิทยาลัยอย่างหนัก จากด้านหน้าหอประชุมใหญ่ และพิพิธภัณฑสถาน ผู้ชุมนุมนับพันคน ต้องหนีเข้าไปหลบในอาคารรอบสนามฟุตบอล มีผู้เสียชีวิตหลายสิบคน"
      ),
      pair("greatHall", "inside"),
      say("stopFiring"),
      say("schoolgirl"),
      at(
        "07.00",
        "07.00 น.",
        "Outside, the crowd at the gate drives two buses into it to force a way in.",
        "ฝูงชนหน้าประตูมหาวิทยาลัยพยายามบุกเข้าไปในมหาวิทยาลัยโดยใช้รถบัสสองคันขับพุ่งเข้าชนประตู"
      ),
      pair("gate", "mainGate"),
      say("river"),
    ],
  },
  {
    id: "surrender",
    kicker: { en: "6 October, from 08.25", th: "6 ตุลาคม ตั้งแต่ 08.25 น." },
    heading: { en: "Surrender", th: "ยอมจำนน" },
    blocks: [
      at(
        "08.25",
        "08.25 น.",
        "Border Patrol Police break into the university and move to seize the protesters sheltering in the buildings around the football field.",
        "ตชด.บุกเข้าไปในมหาวิทยาลัยได้สำเร็จ และได้พยายามเข้าจับกุมฝ่ายผู้ชุมนุมที่หลบตามอาคารรอบสนามฟุตบอล"
      ),
      pair("fieldLying", "surrender"),
      at(
        "10.30",
        "10.30 น.",
        "Students and members of the public are ordered to lie face down. Men and women are forced to take off their shirts.",
        "นักศึกษาประชาชนถูกสั่งให้นอนคว่ำ นักศึกษาชายและหญิงถูกบังคับให้ถอดเสื้อ"
      ),
      show("fieldWide", true),
      say("strip"),
      pair("crawling", "guard"),
      show("detained", true),
    ],
  },
  {
    id: "taken",
    kicker: { en: "6 October, late morning", th: "6 ตุลาคม ช่วงสาย" },
    heading: { en: "Taken away", th: "ถูกควบคุมตัว" },
    blocks: [
      at(
        "10.30",
        "10.30 น.",
        "They are loaded onto buses and trucks and taken to be locked up at police stations, the largest at Nakhon Pathom, Chonburi and the Bang Khen police school. By the end of the day, 3,094 people have been arrested.",
        "ผู้ถูกจับถูกควบคุมตัวไว้ทยอยลำเลียงขึ้นรถเมล์และรถสองแถวส่งไปขังตามสถานีตำรวจต่างๆ มี 3 แหล่งใหญ่ๆ ได้แก่ นครปฐม ชลบุรี และ ร.ร.ตำรวจนครบาลบางเขน ตลอดวันนั้นนักศึกษาประชาชนถูกจับกุม 3,094 คน"
      ),
      pair("busLine", "busLoading"),
      say("bangKhen"),
      show("fieldBuses", true),
    ],
  },
  {
    id: "coup",
    kicker: { en: "6 October, afternoon and evening", th: "6 ตุลาคม บ่ายถึงค่ำ" },
    heading: { en: "The coup", th: "รัฐประหาร" },
    blocks: [
      at(
        "12.30",
        "12.30 น.",
        "Tens of thousands of Village Scouts and others rally at the Royal Plaza.",
        "กลุ่มลูกเสือชาวบ้านและประชาชนจำนวนหลายหมื่นคนชุมนุมอยู่ที่ลานพระบรมรูปทรงม้า"
      ),
      pair("rally", "fieldPolice"),
      at(
        "18.00",
        "18.00 น.",
        "Admiral Sangad Chaloryu, head of the National Administrative Reform Council, announces that it has seized power.",
        "พล.ร.อ.สงัด ชลออยู่ หัวหน้าคณะปฏิรูปการปกครองแผ่นดิน ประกาศยึดอำนาจ"
      ),
    ],
  },
  {
    id: "search",
    kicker: { en: "The days after", th: "วันต่อๆ มา" },
    heading: { en: "The search", th: "การตามหา" },
    blocks: [
      say("unknownMan"),
      say("morgue"),
      say("sleeves"),
      say("neighbour"),
      say("crowds"),
      say("silence"),
    ],
  },
];

export type Quote = {
  text: string;
  /** The Thai the archive printed, shown under an English rendering. */
  original?: string;
  cite: string;
  href: string;
};

export type WalkingTour = {
  heading: string;
  intro: string;
  details: { label: string; value: string }[];
  stopsHeading: string;
  stops: { place: string; about: string }[];
  note: string;
  sourceLabel: string;
  sourceHref: string;
};

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
  storyHeading: string;
  storyIntro: string;
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
  playMusic: string;
  pauseMusic: string;
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
  walkingTour: WalkingTour;
  creditsHeading: string;
  creditsIntro: string;
  creditsTerms: string;
  photoSource: string;
  heroSource: string;
  atThisHour: string;
};

const how = `${DOCT6}/learn-about/how`;
const saengDaoWiki =
  "https://th.wikipedia.org/wiki/%E0%B9%81%E0%B8%AA%E0%B8%87%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B9%81%E0%B8%AB%E0%B9%88%E0%B8%87%E0%B8%A8%E0%B8%A3%E0%B8%B1%E0%B8%97%E0%B8%98%E0%B8%B2";
const victimsPage = `${DOCT6}/remember/victims`;

const epigraphTh = "ขอเยาะเย้ยทุกข์ยากขวากหนามลำเค็ญ\nคนยังคง ยืนเด่นโดยท้าทาย";
const impunityTh =
  "แต่ที่น่าประหลาดใจที่สุดก็คือ การก่อกรณีนองเลือดครั้งนี้ ไม่มีการจับกุมฆาตกรผู้ก่อการสังหารเลยแม้แต่คนเดียว";
const humanityTh = "การทำความรู้จักตัวตนของเหยื่อก็คือการแสดงความเคารพต่อความเป็นมนุษย์ของพวกเขา";
const aimTh =
  "เพื่อให้ผู้ที่สนใจสามารถเข้าถึงข้อมูลได้สะดวกมากยิ่งขึ้น เพื่อต่ออายุความสนใจและการค้นคว้าเกี่ยวกับ 6 ตุลาให้ไปอีกไกลในอนาคต และเพื่อต่อสู้กับความพยายามทำให้สังคมลืม 6 ตุลา";

export const copy: Record<Locale, SixOctoberCopy> = {
  en: {
    title: "6 October 1976",
    eyebrow: "50 YEARS ON",
    lede: "On the morning of 6 October 1976, police and armed civilians massacred students and members of the public at Thammasat University, Tha Prachan. We remember them.",
    metaDescription:
      "Remembering the 6 October 1976 massacre at Thammasat University, Tha Prachan, fifty years on.",
    breadcrumb: "6 October 1976",
    contentNote:
      "This page describes killing and violence against students. None of the photographs shown on this page depict the dead.",
    epigraph: {
      text: "I scoff at sorrow, at the thorns and bitter trial; man yet stands tall, magnificent in defiance.",
      original: epigraphTh,
      cite: "Jit Phumisak, from the song Saeng Dao Haeng Sattha",
      href: saengDaoWiki,
    },
    remembranceHeading: "Fifty years on",
    remembrance: [
      "Tens of thousands of students and members of the public had gathered at Thammasat to protest against the return of Thanom Kittikachorn. Before dawn, Border Patrol Police surrounded the university, and then poured fire into it. The 3,094 people who survived the killing were all arrested that same day. That evening, the military seized power and restored dictatorship.",
      "The dead are too often remembered only as a number, and some still have no name. Tha Prachan is where we study today. It is also where this happened.",
    ],
    backgroundHeading: "How it came to this",
    background: [
      "The origins of the massacre can be traced back to 14 October 1973, when the student movement won its struggle and brought the greatest democratic awakening in Thai history. Right wing groups grew in response. They included the Village Scouts, the Red Gaurs and Nawaphon, and parts of the state stood behind them.",
      "On 19 September 1976 Field Marshal Thanom Kittikachorn came home from Singapore as a novice and was ordained a monk at Wat Bowonniwet. On 24 September two Nakhon Pathom electricity workers were beaten to death while putting up posters against him, and their bodies were hanged at the gate of a housing estate.",
      "On 4 October students rallied at Lan Pho, and the Thammasat drama club staged a play about the Nakhon Pathom hanging. The next day the Dao Siam newspaper used a photograph of the play to attack the student movement, claiming the students had deliberately insulted the monarchy.",
    ],
    storyHeading: "What happened",
    storyIntro:
      "The times follow the timeline Documentation of Oct 6 compiled from the records of the day. The words are those of the people who were there, and of the families who lost them.",
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
    namesIntro: "These are the 40 students and members of the public who died in the massacre.",
    readMoreAbout: "Read about",
    age: (years) => `Aged ${years}`,
    separator: ". ",
    namesSource: "The victims page of Documentation of Oct 6",
    playMusic: "Play music",
    pauseMusic: "Pause music",
    deadHeading: "How many died",
    deadIntro:
      "Fifty years on, even the number of dead is uncertain. The official figures, the autopsy reports, and the archive's count of the dead all differ.",
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
      "BIRSA would like to contribute to keeping their memory on the ground where they were killed.",
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
    closing: "We will never forget them.",
    walkingTour: {
      heading: "Walking tour of the 6 October sites",
      intro:
        "The 50 years of 6 October events at Thammasat University, Tha Prachan, include a walking tour of four places where the massacre and the events around it happened. The tour is a chance to understand the story on the ground where it took place.",
      details: [
        { label: "Dates", value: "4 and 6 October 2026" },
        { label: "Tour times", value: "One tour each day, from 4.30pm to 6.30pm" },
        {
          label: "Registration",
          value: "Open on both days, from 1pm to 1.30pm and from 4pm to 4.30pm",
        },
        { label: "Place", value: "Thammasat University, Tha Prachan" },
      ],
      stopsHeading: "The four stops",
      stops: [
        {
          place: "In front of the Main Hall",
          about:
            "The shooting from the museum side into the area in front of the Main Hall, and the death of Jarupong Thongsin and the five women who died on 6 October 1976.",
        },
        {
          place: "The football field, beside the Faculty of Commerce and Accountancy",
          about:
            "The volunteer nurses of the Medical Volunteers for the People, and the mass arrest and detention.",
        },
        {
          place: "Lan Pho",
          about:
            "The play performed on 4 October 1976, and the going out to negotiate with the government, and the arrests that followed.",
        },
        {
          place: "The pier at Lan Pridi",
          about:
            "The escape down to the river and the swim across it, the shooting by river police, and what followed at Siriraj Hospital.",
        },
      ],
      note: "The tour starts as soon as registration closes. Bring an umbrella or rain gear.",
      sourceLabel: "Announcement from 6tula2519 on Instagram",
      sourceHref: "https://www.instagram.com/6tula2519/",
    },
    creditsHeading: "Sources and credits",
    creditsIntro:
      "Every fact, quotation and photograph on this page comes from Documentation of Oct 6 (บันทึก 6 ตุลา, doct6.com). Each photograph and quotation links to the page where the archive publishes it. Most of the photographs come from a set Pathomporn Srimanta gave to the archive in 2017, which carries no record of photographer or owner. The photograph behind the title is the one exception. It is an Associated Press photograph, published by Khaosod.",
    creditsTerms:
      "The archive shares its material for education and the public interest and asks that it be credited. Ask the archive, or the families of the dead, before any commercial use.",
    photoSource: "View on doct6.com",
    heroSource: "View on Khaosod",
    atThisHour: "50 years ago at this hour",
  },
  th: {
    title: "6 ตุลา 2519",
    eyebrow: "50 ปี 6 ตุลา",
    lede: "เช้าวันที่ 6 ตุลาคม 2519 เกิดการฆาตกรรมหมู่นักศึกษาและประชาชนในมหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์ เราขอร่วมรำลึกถึงผู้วายชนม์",
    metaDescription: "รำลึก 50 ปี 6 ตุลา 2519 การฆาตกรรมหมู่ที่มหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์",
    breadcrumb: "6 ตุลา 2519",
    contentNote:
      "หน้านี้กล่าวถึงการสังหารและความรุนแรงต่อนักศึกษา ไม่มีภาพที่ปรากฏการกระทำต่อผู้เสียชีวิต",
    epigraph: {
      text: epigraphTh,
      cite: "จิตร ภูมิศักดิ์ เพลง แสงดาวแห่งศรัทธา",
      href: saengDaoWiki,
    },
    remembranceHeading: "ครบ 50 ปี",
    remembrance: [
      "นักศึกษาและประชาชนนับหมื่นคนชุมนุมในมหาวิทยาลัยธรรมศาสตร์เพื่อต่อต้านพระถนอม ในวันที่ 6 ตุลา ก่อนรุ่งสาง ตำรวจตระเวนชายแดนยกกำลังเข้าล้อมมหาวิทยาลัย แล้วระดมยิงเข้ามาอย่างหนัก มีการจับกุมนักศึกษาและประชาชนที่เหลือรอดจากการถูกสังหารจำนวน 3,094 คน และในเย็นวันเดียวกันนั้นเอง ก็เกิดการรัฐประหารฟื้นเผด็จการ",
      "เราขอร่วมรำลึกถึงผู้วายชนม์ และรำลึกถึงเหตุการณ์ที่เกิดขึ้นในวันนั้น",
    ],
    backgroundHeading: "ย้อนดูที่มา",
    background: [
      "เหตุการณ์ 6 ตุลาคม 2519 เป็นผลผลิตอันสืบเนื่องจากเหตุการณ์ 14 ตุลาคม 2516 เมื่อขบวนการนักศึกษาได้รับชัยชนะในการต่อสู้ และนำมาซึ่งกระแสการตื่นตัวด้านประชาธิปไตยครั้งใหญ่ที่สุดในประวัติศาสตร์ ขณะเดียวกันกลุ่มฝ่ายขวาก็เติบโตขึ้น ทั้งลูกเสือชาวบ้าน กระทิงแดง และนวพล โดยมีกลไกรัฐบางส่วนหนุนหลัง",
      "วันที่ 19 กันยายน 2519 จอมพลถนอม กิตติขจร บวชเณรจากสิงคโปร์ แล้วเดินทางถึงประเทศไทย และอุปสมบทเป็นพระภิกษุที่วัดบวรนิเวศฯ วันที่ 24 กันยายน นายวิชัย เกษศรีพงษา และนายชุมพร ทุมไมย พนักงานการไฟฟ้านครปฐม ถูกซ้อมตายระหว่างออกติดโปสเตอร์ประท้วงต่อต้านพระถนอม และถูกนำศพไปแขวนคอที่ประตูทางเข้าที่จัดสรรแห่งหนึ่งในจังหวัดนครปฐม",
      "วันที่ 4 ตุลาคม มีการชุมนุมที่ลานโพธิ์ มีการอภิปรายและการแสดงละครเกี่ยวกับกรณีฆ่าแขวนคอพนักงานการไฟฟ้านครปฐม จัดโดยชุมนุมนาฏศิลป์และการละคร มหาวิทยาลัยธรรมศาสตร์ วันรุ่งขึ้น หนังสือพิมพ์ดาวสยามนำรูปละครแขวนคอมาเป็นเครื่องมือ ออกเผยแพร่โจมตีขบวนการนักศึกษาว่าจงใจหมิ่นพระบรมเดชานุภาพ",
    ],
    storyHeading: "เกิดอะไรขึ้น",
    storyIntro:
      "ลำดับเวลาเป็นไปตามที่โครงการบันทึก 6 ตุลา รวบรวมจากบันทึกของวันนั้น ส่วนถ้อยคำเป็นของผู้อยู่ในเหตุการณ์ และครอบครัวของผู้ที่จากไป",
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
    playMusic: "เปิดเพลง",
    pauseMusic: "หยุดเพลง",
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
      "เราขอร่วมรักษาความทรงจำของพวกเขาไว้",
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
    closing: "เราจะไม่มีวันลืมพวกเขา",
    walkingTour: {
      heading: "Walking Tour 4 จุดเหตุการณ์สำคัญ",
      intro:
        "งาน 50 ปี 6 ตุลา ที่มหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์ มีกิจกรรม Walking Tour 4 จุดเหตุการณ์สำคัญ ที่จะพาทุกท่านร่วมทำความเข้าใจเรื่องราวบนพื้นที่เหตุการณ์จริง",
      details: [
        { label: "วันที่", value: "4 และ 6 ตุลาคม 2569" },
        { label: "รอบเดินทัวร์", value: "วันละ 1 รอบ เวลา 16.30 ถึง 18.30 น." },
        {
          label: "ลงทะเบียน",
          value:
            "เปิดทั้งสองวัน ช่วงที่ 1 เวลา 13.00 ถึง 13.30 น. ช่วงที่ 2 เวลา 16.00 ถึง 16.30 น.",
        },
        { label: "สถานที่", value: "มหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์" },
      ],
      stopsHeading: "4 จุดที่ไปเยือน",
      stops: [
        {
          place: "หน้าหอประชุมใหญ่",
          about:
            "การบุกยิงจากฝั่งพิพิธภัณฑ์เข้ามายังบริเวณหน้าหอประชุมใหญ่ การเสียชีวิตของคุณจารุพงษ์ ทองสินธุ์ และผู้หญิงทั้ง 5 คนที่เสียชีวิตในวันที่ 6 ตุลาคม 2519",
        },
        {
          place: "สนามฟุตบอล (ตึกบัญชี)",
          about: "พยาบาลเพื่อมวลชน (พ.ม.ช.) และการถูกจับกุมคุมขัง",
        },
        {
          place: "ลานโพธิ์",
          about: "การแสดงละครในวันที่ 4 ตุลาคม 2519 การออกไปเจรจากับรัฐบาล และการถูกจับกุมคุมขัง",
        },
        {
          place: "ท่าน้ำ ลานปรีดี",
          about:
            "การหนีลงท่าว่ายน้ำข้าม และการถูกยิงจากตำรวจน้ำ ไปจนถึงเหตุการณ์ที่โรงพยาบาลศิริราช",
        },
      ],
      note: "กิจกรรมจะเริ่มทันทีหลังปิดการลงทะเบียน ขอให้นำร่มหรืออุปกรณ์กันฝนติดตัวมาด้วย",
      sourceLabel: "ประกาศจาก 6tula2519 บน Instagram",
      sourceHref: "https://www.instagram.com/6tula2519/",
    },
    creditsHeading: "แหล่งที่มาและเครดิต",
    creditsIntro:
      "ข้อเท็จจริง ข้อความที่อ้างอิง และภาพถ่ายทุกภาพในหน้านี้มาจากโครงการบันทึก 6 ตุลา (Documentation of Oct 6, doct6.com) ภาพและข้อความแต่ละชิ้นมีลิงก์ไปยังหน้าที่โครงการเผยแพร่ไว้ ภาพส่วนใหญ่มาจากภาพชุดที่คุณปฐมพร ศรีมันตะ มอบให้โครงการเมื่อปี 2560 ซึ่งโครงการระบุว่าไม่มีข้อมูลผู้ถ่ายภาพและเจ้าของ ยกเว้นภาพเบื้องหลังชื่อเรื่อง ซึ่งเป็นภาพของสำนักข่าวเอพี เผยแพร่โดยข่าวสด",
    creditsTerms:
      "เอกสารหรือหลักฐานที่ปรากฏในเว็บไซต์ “บันทึก 6 ตุลา” มีจุดประสงค์เพื่อการเรียนรู้และประโยชน์ต่อสังคมเท่านั้น หากต้องการนำไปใช้ในทางธุรกิจหรือเพื่อแสวงหากำไร กรุณาติดต่อโครงการก่อนหรือขออนุญาตโดยตรงจากครอบครัวของผู้เสียชีวิต",
    photoSource: "ดูที่ doct6.com",
    heroSource: "ดูที่ข่าวสด",
    atThisHour: "เมื่อ 50 ปีก่อน ณ เวลานี้",
  },
};
