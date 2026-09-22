import type { Bi } from "./copy";

/**
 * Open House "clubs wall" data, digested from the real club files in
 * `content/clubs/{en,th}`. Every field traces to those files; a club with no
 * external link in its frontmatter carries `link: null` rather than an invented
 * one. `texture` drives per-club visual variation so the wall doesn't read as
 * twelve identical tiles.
 */
export type ClubTexture =
  "sport" | "simulation" | "writing" | "music" | "volunteering" | "media" | "games" | "finance";

export type OpenHouseClub = {
  slug: string;
  name: Bi;
  tagline: Bi;
  joinOpen: boolean;
  detail: Bi;
  join: Bi | null;
  link: { url: string; label: string } | null;
  texture: ClubTexture;
};

export const CLUBS: OpenHouseClub[] = [
  {
    slug: "asa-ir",
    name: { en: "ASA IR", th: "อาสาไออาร์ (ASA IR)" },
    tagline: {
      en: "Student volunteer camps built around sustainable development.",
      th: "ค่ายอาสาของนักศึกษาที่ยึดการพัฒนาอย่างยั่งยืนเป็นหัวใจ",
    },
    joinOpen: true,
    detail: {
      en: "Now on its sixth volunteer camp, ASA IR 6.",
      th: "ตอนนี้ชมรมจัดค่ายมาแล้วถึงรุ่นที่หก คือ ASA IR 6",
    },
    join: {
      en: "Recruitment opens on Instagram ahead of each camp.",
      th: "เปิดรับสมาชิกทาง Instagram ก่อนถึงกำหนดจัดค่ายแต่ละครั้ง",
    },
    link: { url: "https://www.instagram.com/asa.ir.tu/", label: "Instagram" },
    texture: "volunteering",
  },
  {
    slug: "birify",
    name: { en: "BIRify", th: "BIRify" },
    tagline: {
      en: "The BIR student podcast: making it BIR.",
      th: "พอดแคสต์ของนักศึกษา BIR: making it BIR",
    },
    joinOpen: true,
    detail: {
      en: "More than 50 episodes and over a thousand YouTube subscribers.",
      th: "ช่องมีอีพีมากกว่า 50 ตอนและผู้ติดตามบน YouTube เกินหนึ่งพันคน",
    },
    join: {
      en: "Follow @birify on Instagram, where recruitment is posted.",
      th: "ติดตาม @birify ทาง Instagram ซึ่งจะประกาศการรับสมาชิก",
    },
    link: { url: "https://www.instagram.com/birify/", label: "Instagram" },
    texture: "media",
  },
  {
    slug: "kien-club",
    name: { en: "Kien Club", th: "Kien Club" },
    tagline: {
      en: "A writers' club publishing student work on the humanities.",
      th: "ชมรมนักเขียนที่ตีพิมพ์ผลงานนักศึกษาด้านมนุษยศาสตร์",
    },
    joinOpen: true,
    detail: {
      en: "Publishes articles every two weeks and poetry once a month.",
      th: "ตีพิมพ์บทความทุกสองสัปดาห์และบทกวีเดือนละครั้ง",
    },
    join: {
      en: "Follow @kien.club on Instagram; it recruits all three roles.",
      th: "ติดตาม @kien.club ทาง Instagram ชมรมเปิดรับทั้งสามบทบาท",
    },
    link: { url: "https://www.instagram.com/kien.club/", label: "Instagram" },
    texture: "writing",
  },
  {
    slug: "bir-music-club",
    name: { en: "BIR Music Club", th: "ชมรมดนตรี BIR" },
    tagline: {
      en: "The biggest music club in BIR, for players, singers, and anyone who wants to jam.",
      th: "ชมรมดนตรีที่ใหญ่ที่สุดของ BIR สำหรับคนเล่นดนตรี นักร้อง และใครก็ตามที่อยากมาแจมด้วยกัน",
    },
    joinOpen: true,
    detail: {
      en: "Has played BIR Byenior, SD Crazy Week, and SDSD 2025.",
      th: "เคยขึ้นแสดงในงาน BIR Byenior, SD Crazy Week และ SDSD 2025",
    },
    join: {
      en: "Auditions announced on Instagram, new members each semester.",
      th: "ประกาศรอบออดิชันทาง Instagram รับสมาชิกใหม่ช่วงต้นเทอมแต่ละเทอม",
    },
    link: { url: "https://www.instagram.com/birmusicclub/", label: "Instagram" },
    texture: "music",
  },
  {
    slug: "tu-mun",
    name: { en: "TU MUN", th: "TU MUN" },
    tagline: {
      en: "Thailand's first university Model United Nations club, running since 2011.",
      th: "ชมรมจำลองการประชุมสหประชาชาติระดับมหาวิทยาลัยแห่งแรกของไทย ดำเนินงานมาตั้งแต่ปี 2011",
    },
    joinOpen: true,
    detail: {
      en: "Has hosted Thailand's largest university MUN since 2014.",
      th: "เป็นเจ้าภาพจัดงาน MUN ระดับมหาวิทยาลัยที่ใหญ่ที่สุดในไทยมาตั้งแต่ปี 2014",
    },
    join: {
      en: "Watch @thammasatmun for staff recruitment and delegate selection.",
      th: "ติดตาม @thammasatmun เพื่อดูการรับสมัครสตาฟและการคัดเลือกผู้แทน",
    },
    link: { url: "https://www.instagram.com/thammasatmun/", label: "Instagram" },
    texture: "simulation",
  },
  {
    slug: "parliamock-tu",
    name: { en: "Parliamock.TU", th: "รัฐสภาจำลอง (Parliamock.TU)" },
    tagline: {
      en: "A simulated Thai Parliament, run by students for high school participants.",
      th: "รัฐสภาไทยจำลองที่นักศึกษาเป็นผู้จัด สำหรับน้อง ๆ มัธยมปลาย",
    },
    joinOpen: true,
    detail: {
      en: "Members run the camp; participants are high school students.",
      th: "สมาชิกทำหน้าที่จัดค่าย ส่วนผู้เข้าร่วมคือน้อง ๆ มัธยมปลาย",
    },
    join: {
      en: "Follow @parliamock.tu for the sign-up link and camp dates.",
      th: "ติดตาม @parliamock.tu เพื่อดูลิงก์สมัครและกำหนดการค่าย",
    },
    link: { url: "https://www.instagram.com/parliamock.tu/", label: "Instagram" },
    texture: "simulation",
  },
  {
    slug: "bir-mock-fund",
    name: { en: "BIR Mock Fund (IAIC)", th: "กองทุนจำลอง BIR (IAIC)" },
    tagline: {
      en: "A mock investment fund where geopolitics drives the portfolio.",
      th: "กองทุนลงทุนจำลองที่ให้ภูมิรัฐศาสตร์เป็นตัวขับเคลื่อนพอร์ต",
    },
    joinOpen: true,
    detail: {
      en: "Members manage notional capital split across four sector desks.",
      th: "สมาชิกบริหารเงินทุนสมมติที่แบ่งเป็นโต๊ะตามภาคธุรกิจสี่โต๊ะ",
    },
    join: {
      en: "Follow @iaic_club and join the LINE group; all desks open.",
      th: "ติดตาม @iaic_club และเข้ากลุ่ม LINE เปิดรับสมัครทุกโต๊ะ",
    },
    link: { url: "https://www.instagram.com/iaic_club/", label: "Instagram" },
    texture: "finance",
  },
  {
    slug: "bir-football",
    name: { en: "BIR Football", th: "ฟุตบอล BIR" },
    tagline: {
      en: "Eleven-a-side, every Friday, all levels welcome.",
      th: "ฟุตบอล 11 คน ทุกวันศุกร์ เปิดรับทุกระดับฝีเท้า",
    },
    joinOpen: true,
    detail: {
      en: "Fields both a women's team and a men's team.",
      th: "มีทั้งทีมฟุตบอลชายและทีมฟุตบอลหญิง",
    },
    join: {
      en: "No trials or experience needed; bring trainers and turn up.",
      th: "ไม่มีการคัดตัว ไม่ต้องมีประสบการณ์ เตรียมรองเท้าผ้าใบมาได้เลย",
    },
    link: { url: "https://www.instagram.com/birfootballclub/", label: "Instagram" },
    texture: "sport",
  },
  {
    slug: "bir-basketball",
    name: { en: "BIR Basketball", th: "บาสเกตบอล BIR" },
    tagline: {
      en: "Pick-up games and a BIR team, from beginners to competitive players.",
      th: "เล่นบาสสบาย ๆ และทีม BIR ตั้งแต่มือใหม่จนถึงสายแข่งขัน",
    },
    joinOpen: true,
    detail: {
      en: "Held its first meet in May 2026, playing since.",
      th: "จัดนัดรวมตัวครั้งแรกเมื่อพฤษภาคม 2026 และเล่นต่อเนื่องมาตั้งแต่นั้น",
    },
    join: {
      en: "Follow @bir.basketballclub for session times and the LINE group.",
      th: "ติดตาม @bir.basketballclub เพื่อดูเวลาซ้อมและลิงก์กลุ่ม LINE",
    },
    link: { url: "https://www.instagram.com/bir.basketballclub/", label: "Instagram" },
    texture: "sport",
  },
  {
    slug: "bir-esports-club",
    name: { en: "BIR Esports Club", th: "ชมรมอีสปอร์ต BIR" },
    tagline: {
      en: "Competitive and casual gaming, and the team that represents BIR.",
      th: "เกมทั้งสายแข่งและสายชิล พร้อมทีมตัวแทน BIR",
    },
    joinOpen: true,
    detail: {
      en: "Won ROV first place at last year's TPC Games.",
      th: "คว้าอันดับหนึ่ง ROV ใน TPC Games ปีที่ผ่านมา",
    },
    join: {
      en: "Follow @biresport.club for LINE, Discord, and member sign-ups.",
      th: "ติดตาม @biresport.club เพื่อดูลิงก์ LINE, Discord และการรับสมาชิก",
    },
    link: { url: "https://www.instagram.com/biresport.club/", label: "Instagram" },
    texture: "games",
  },
  {
    slug: "bir-volleyball",
    name: { en: "BIR Volleyball", th: "วอลเลย์บอล BIR" },
    tagline: {
      en: "Volleyball for BIR students, from first-timers to regulars.",
      th: "วอลเลย์บอลสำหรับชาว BIR ตั้งแต่มือใหม่จนถึงขาประจำ",
    },
    joinOpen: true,
    detail: {
      en: "Casual sessions and friendly matches, open to first-timers.",
      th: "จัดการซ้อมและแมตช์กระชับมิตร เปิดรับผู้เล่นมือใหม่",
    },
    join: {
      en: "Sessions announced through BIRSA at the start of each semester.",
      th: "ตารางซ้อมประกาศผ่าน BIRSA ช่วงต้นเทอมแต่ละเทอม",
    },
    link: null,
    texture: "sport",
  },
  {
    slug: "bir-cardgame-club",
    name: { en: "BIR CardGame Club", th: "ชมรมการ์ดเกม BIR" },
    tagline: {
      en: "Trading card games, tabletop games, and people to play them with.",
      th: "การ์ดเกมสะสม เกมกระดาน และเพื่อนให้ได้ลงเล่นด้วยกัน",
    },
    joinOpen: true,
    detail: {
      en: "Members have played outside tournaments up to regional championship level.",
      th: "สมาชิกเคยแข่งทัวร์นาเมนต์ภายนอกถึงระดับแชมป์ภูมิภาค",
    },
    join: {
      en: "Follow @bircardgame; sign-ups announced at the start of each semester.",
      th: "ติดตาม @bircardgame การรับสมัครประกาศช่วงต้นเทอมแต่ละเทอม",
    },
    link: { url: "https://www.instagram.com/bircardgame/", label: "Instagram" },
    texture: "games",
  },
];

export const CLUB_SLUGS = CLUBS.map((c) => c.slug);
