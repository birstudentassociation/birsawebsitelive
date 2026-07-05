/**
 * Clubs directory — typed module (not MDX). Every club below is a plausible
 * placeholder for a politics/IR student programme; BIRSA will replace these
 * with the real club list. `slug` is the shared key across locales.
 *
 * Never invent real people's names — `lead` is a role title only.
 */
import type { Locale } from "@/lib/i18n";

export type ClubCategory = "academic" | "sports" | "arts" | "community" | "social";

export type ClubLocaleContent = {
  name: string;
  tagline: string;
  /** 2-3 paragraphs. */
  description: string[];
  meets?: string;
  /** Role title only, e.g. "President" — never a person's name. */
  lead?: string;
  howToJoin: string;
};

export type Club = {
  key: string;
  slug: string;
  category: ClubCategory;
  /** True while this entry is example content pending BIRSA's real list. */
  placeholder: boolean;
  email?: string;
  instagram?: string;
  join: { open: boolean };
  en: ClubLocaleContent;
  th: ClubLocaleContent;
};

export const clubCategories: Record<ClubCategory, Record<Locale, string>> = {
  academic: { en: "Academic", th: "วิชาการ" },
  sports: { en: "Sports", th: "กีฬา" },
  arts: { en: "Arts & culture", th: "ศิลปะและวัฒนธรรม" },
  community: { en: "Community & service", th: "ชุมชนและจิตอาสา" },
  social: { en: "Social", th: "สังสรรค์" },
};

export const clubs: Club[] = [
  {
    key: "debate-society",
    slug: "debate-society",
    category: "academic",
    placeholder: true,
    email: "debate.birsa@tu.ac.th",
    instagram: "https://www.instagram.com/",
    join: { open: true },
    en: {
      name: "Debate Society",
      tagline: "Argue both sides, then argue them better.",
      description: [
        "The Debate Society is where BIR students practise the art of arguing clearly under pressure — British Parliamentary format, current-affairs motions, and the occasional friendly grudge match against other faculties.",
        "Sessions mix short lectures on argumentation with live rounds, so first-timers and experienced debaters both get something out of it. No prior competition experience is expected.",
        "Members have gone on to represent Thammasat at inter-university debate tournaments, but most people join simply to get better at thinking on their feet.",
      ],
      meets: "Thursdays, 5:30–7:30pm, Faculty of Political Science seminar room (check socials for room changes)",
      lead: "President",
      howToJoin: "Turn up to any Thursday session — no sign-up needed for your first visit. To join properly, message the club Instagram or email the address below.",
    },
    th: {
      name: "ชมรมโต้วาที",
      tagline: "เถียงได้ทั้งสองฝั่ง แล้วเถียงให้ดีขึ้นเรื่อย ๆ",
      description: [
        "ชมรมโต้วาทีคือพื้นที่ให้นักศึกษา BIR ได้ฝึกพูดโต้แย้งอย่างมีเหตุผลภายใต้ความกดดัน ในรูปแบบ British Parliamentary พร้อมญัตติจากสถานการณ์บ้านเมืองปัจจุบัน และบางครั้งก็มีแมตช์กระชับมิตรกับคณะอื่น ๆ",
        "แต่ละครั้งจะมีทั้งการสอนหลักการโต้แย้งสั้น ๆ และรอบแข่งจริง เหมาะทั้งคนที่เพิ่งเริ่มต้นและคนที่โต้วาทีมาแล้ว ไม่จำเป็นต้องมีประสบการณ์แข่งขันมาก่อน",
        "รุ่นพี่หลายคนเคยเป็นตัวแทนธรรมศาสตร์ไปแข่งระดับมหาวิทยาลัย แต่ส่วนใหญ่ที่มาร่วมก็แค่อยากคิดและพูดให้ไวขึ้น",
      ],
      meets: "ทุกวันพฤหัสบดี 17:30–19:30 น. ห้องสัมมนา คณะรัฐศาสตร์ (เช็กห้องอีกครั้งทางโซเชียลของชมรม)",
      lead: "ประธานชมรม",
      howToJoin: "แวะมาร่วมงานวันพฤหัสบดีได้เลยโดยไม่ต้องสมัครล่วงหน้าในครั้งแรก หากต้องการสมัครเป็นสมาชิก ทักไปที่ Instagram หรืออีเมลของชมรมด้านล่าง",
    },
  },
  {
    key: "model-united-nations",
    slug: "model-united-nations",
    category: "academic",
    placeholder: true,
    email: "mun.birsa@tu.ac.th",
    instagram: "https://www.instagram.com/",
    join: { open: true },
    en: {
      name: "Model United Nations Club",
      tagline: "Diplomacy, resolutions, and a lot of note-passing.",
      description: [
        "This club prepares BIR students for Model UN conferences — researching country positions, drafting resolutions, and practising the procedure and public speaking that MUN runs on.",
        "Weekly meetings rotate between committee-style practice sessions and workshops on topics like resolution writing, lobbying, and crisis committees.",
        "The club typically sends delegations to a couple of conferences a year, both in Bangkok and abroad, and welcomes complete beginners alongside seasoned delegates.",
      ],
      meets: "Alternate Wednesdays, 6:00–8:00pm, room TBC each term",
      lead: "Secretary-General",
      howToJoin: "Join the group chat linked on the club's Instagram at the start of each semester, or come to the first open session — details posted there.",
    },
    th: {
      name: "ชมรมจำลองสหประชาชาติ (MUN)",
      tagline: "การทูต มติที่ประชุม และโน้ตส่งกันในห้อง",
      description: [
        "ชมรมนี้เตรียมความพร้อมนักศึกษา BIR สำหรับการแข่งขัน Model UN ทั้งการค้นคว้าจุดยืนของประเทศ การร่างมติ และฝึกขั้นตอนการประชุมรวมถึงการพูดในที่สาธารณะ",
        "นัดพบประจำสัปดาห์จะสลับกันระหว่างการซ้อมแบบคณะกรรมการจำลอง กับเวิร์กช็อปหัวข้อต่าง ๆ เช่น การเขียนมติ การล็อบบี้ และคณะกรรมการภาวะวิกฤต",
        "โดยทั่วไปชมรมจะส่งคณะผู้แทนไปแข่งปีละ 2-3 รายการ ทั้งในกรุงเทพฯ และต่างประเทศ ยินดีต้อนรับทั้งมือใหม่และผู้แทนที่มีประสบการณ์แล้ว",
      ],
      meets: "ทุกวันพุธเว้นพุธ 18:00–20:00 น. (ห้องแจ้งอีกครั้งในแต่ละเทอม)",
      lead: "เลขาธิการชมรม",
      howToJoin: "เข้าร่วมกลุ่มแชทที่ลิงก์ไว้ใน Instagram ของชมรมตอนต้นเทอม หรือมาร่วมงานเปิดรับสมาชิกครั้งแรก — รายละเอียดจะประกาศที่นั่น",
    },
  },
  {
    key: "bir-football-club",
    slug: "bir-football-club",
    category: "sports",
    placeholder: true,
    instagram: "https://www.instagram.com/",
    join: { open: true },
    en: {
      name: "BIR Football Club",
      tagline: "Five-a-side, most weeks, all levels welcome.",
      description: [
        "BIR Football Club gets students out from behind their laptops for a kickabout — casual five-a-side games on campus pitches, open to any skill level.",
        "The club also enters a team into the Faculty of Political Science's internal sports tournament each year, alongside informal matches against other programmes.",
        "No trials, no fees to just turn up and play — bring trainers and water.",
      ],
      meets: "Saturdays, 4:00pm, Thammasat Tha Prachan sports field (weather permitting)",
      lead: "Team captain",
      howToJoin: "Show up on a Saturday, or message the club Instagram to be added to the match-day group chat.",
    },
    th: {
      name: "ชมรมฟุตบอล BIR",
      tagline: "ฟุตบอล 5 คน แทบทุกสัปดาห์ ทุกระดับฝีเท้า",
      description: [
        "ชมรมฟุตบอล BIR ชวนเพื่อน ๆ ออกมาวิ่งเตะบอลนอกจอคอม เป็นเกมฟุตบอล 5 คนแบบสบาย ๆ ที่สนามในมหาวิทยาลัย เปิดรับทุกระดับฝีเท้า",
        "ทุกปีชมรมยังส่งทีมลงแข่งกีฬาภายในของคณะรัฐศาสตร์ และมีแมตช์กระชับมิตรกับหลักสูตรอื่น ๆ เป็นครั้งคราว",
        "ไม่มีการคัดตัว ไม่มีค่าใช้จ่ายสำหรับการมาเตะเล่น แค่เตรียมรองเท้าผ้าใบกับน้ำมาเอง",
      ],
      meets: "ทุกวันเสาร์ 16:00 น. สนามกีฬา มธ. ท่าพระจันทร์ (ขึ้นอยู่กับสภาพอากาศ)",
      lead: "กัปตันทีม",
      howToJoin: "มาเตะด้วยกันได้เลยในวันเสาร์ หรือทักไปที่ Instagram ของชมรมเพื่อขอเข้ากลุ่มแชทนัดแข่ง",
    },
  },
  {
    key: "photography-club",
    slug: "photography-club",
    category: "arts",
    placeholder: true,
    email: "photo.birsa@tu.ac.th",
    instagram: "https://www.instagram.com/",
    join: { open: true },
    en: {
      name: "Photography Club",
      tagline: "Documenting campus life, one frame at a time.",
      description: [
        "The Photography Club is for anyone who likes carrying a camera (or just a phone) around campus — covering BIRSA events, street photography around Tha Prachan, and portrait practice with fellow members.",
        "Monthly themed challenges and casual photo walks make it easy to join even without your own gear; some members share lenses and tips.",
        "The club also handles informal photo coverage for some BIRSA events, which is a nice way to build a small portfolio.",
      ],
      meets: "Monthly photo walk — date posted on Instagram each month",
      lead: "Club coordinator",
      howToJoin: "Follow the club Instagram and reply to the latest post, or email to be added to the group chat.",
    },
    th: {
      name: "ชมรมถ่ายภาพ",
      tagline: "บันทึกชีวิตในรั้วมหาวิทยาลัย ทีละเฟรม",
      description: [
        "ชมรมถ่ายภาพเปิดรับทุกคนที่ชอบพกกล้อง (หรือแค่มือถือ) เดินถ่ายรอบมหาวิทยาลัย ทั้งบันทึกงานกิจกรรมของ BIRSA ถ่ายภาพสตรีทแถวท่าพระจันทร์ และฝึกถ่ายภาพบุคคลกับเพื่อนสมาชิก",
        "มีชาเลนจ์หัวข้อประจำเดือนและทริปเดินถ่ายภาพแบบชิล ๆ ทำให้เข้าร่วมได้ง่ายแม้ไม่มีอุปกรณ์ของตัวเอง สมาชิกบางคนพร้อมแบ่งปันเลนส์และเทคนิคให้กัน",
        "ชมรมยังช่วยถ่ายภาพงานกิจกรรมบางงานของ BIRSA แบบไม่เป็นทางการ ซึ่งเป็นโอกาสดีในการสร้างพอร์ตเล็ก ๆ ของตัวเอง",
      ],
      meets: "ทริปถ่ายภาพประจำเดือน — ประกาศวันที่ทาง Instagram ทุกเดือน",
      lead: "ผู้ประสานงานชมรม",
      howToJoin: "ติดตาม Instagram ของชมรมแล้วทักตอบโพสต์ล่าสุด หรืออีเมลมาเพื่อขอเข้ากลุ่มแชท",
    },
  },
  {
    key: "volunteer-community-service",
    slug: "volunteer-community-service",
    category: "community",
    placeholder: true,
    email: "volunteer.birsa@tu.ac.th",
    instagram: "https://www.instagram.com/",
    join: { open: true },
    en: {
      name: "Volunteer & Community Service Club",
      tagline: "Putting BIR's politics degree into practice, locally.",
      description: [
        "This club organises volunteering trips and community projects — from teaching English at nearby schools to environmental clean-ups and fundraising drives for causes members choose together.",
        "Most projects run over a weekend or during semester breaks, and the club tries to partner with local organisations rather than running one-off drop-in visits.",
        "You don't need any special skills to join, just time and willingness — many members say it's the most grounding thing they do outside lectures.",
      ],
      meets: "Planning meeting monthly; project dates vary by term",
      lead: "Volunteer coordinator",
      howToJoin: "Email the club or message Instagram to be added to the planning group chat before the next project is announced.",
    },
    th: {
      name: "ชมรมจิตอาสาและกิจกรรมเพื่อชุมชน",
      tagline: "เอาความรู้ด้านรัฐศาสตร์มาลงมือทำจริงในชุมชน",
      description: [
        "ชมรมนี้จัดทริปอาสาและโครงการเพื่อชุมชน ตั้งแต่สอนภาษาอังกฤษให้โรงเรียนใกล้เคียง กิจกรรมทำความสะอาดสิ่งแวดล้อม ไปจนถึงระดมทุนเพื่อประเด็นที่สมาชิกร่วมกันเลือก",
        "โครงการส่วนใหญ่จัดในวันหยุดสุดสัปดาห์หรือช่วงปิดเทอม และพยายามร่วมมือกับหน่วยงานในพื้นที่จริง มากกว่าไปเยี่ยมแบบครั้งเดียวจบ",
        "ไม่ต้องมีทักษะพิเศษในการเข้าร่วม แค่มีเวลาและใจที่พร้อม สมาชิกหลายคนบอกว่านี่คือกิจกรรมที่ทำให้รู้สึกเชื่อมโยงกับโลกจริงมากที่สุดนอกห้องเรียน",
      ],
      meets: "ประชุมวางแผนทุกเดือน วันที่ทำโครงการแตกต่างกันไปในแต่ละเทอม",
      lead: "ผู้ประสานงานอาสาสมัคร",
      howToJoin: "อีเมลหรือทัก Instagram ของชมรมเพื่อขอเข้ากลุ่มวางแผนก่อนประกาศโครงการถัดไป",
    },
  },
  {
    key: "film-society",
    slug: "film-society",
    category: "arts",
    placeholder: true,
    instagram: "https://www.instagram.com/",
    join: { open: true },
    en: {
      name: "Film Society",
      tagline: "Watch something that isn't for a course, for once.",
      description: [
        "Film Society runs regular screening nights — a mix of political dramas, documentaries, and whatever members are curious about, followed by a relaxed discussion (no essay required).",
        "Occasional themed weeks tie into BIR topics — election-year cinema, Southeast Asian film, diplomacy on screen — but the club is just as happy watching something purely for fun.",
        "New members are welcome any time; you don't need to have seen the previous films to join in.",
      ],
      meets: "Fortnightly screening, evenings — room and film posted on Instagram",
      lead: "Programme lead",
      howToJoin: "Follow the Instagram for screening announcements and just show up — seats are first-come, first-served.",
    },
    th: {
      name: "ชมรมภาพยนตร์",
      tagline: "ได้ดูหนังที่ไม่ต้องเอาไปสอบ สักครั้งในชีวิต",
      description: [
        "ชมรมภาพยนตร์จัดคืนฉายหนังเป็นประจำ ทั้งหนังดราม่าการเมือง สารคดี และเรื่องที่สมาชิกอยากดู ตามด้วยวงพูดคุยแบบสบาย ๆ ไม่ต้องเขียนรายงานส่ง",
        "บางช่วงมีธีมพิเศษที่เชื่อมกับเนื้อหา BIR เช่น หนังปีเลือกตั้ง หนังเอเชียตะวันออกเฉียงใต้ หรือการทูตบนจอ แต่ส่วนใหญ่ก็แค่ดูเพื่อความสนุก",
        "เปิดรับสมาชิกใหม่ตลอดเวลา ไม่จำเป็นต้องเคยดูเรื่องก่อนหน้ามาก่อนก็ร่วมสนุกได้",
      ],
      meets: "ฉายหนังทุกสองสัปดาห์ ช่วงเย็น (ห้องและชื่อเรื่องประกาศทาง Instagram)",
      lead: "หัวหน้าฝ่ายจัดฉาย",
      howToJoin: "ติดตาม Instagram เพื่อดูประกาศรอบฉาย แล้วมาได้เลย ที่นั่งมาก่อนได้ก่อน",
    },
  },
  {
    key: "board-games-club",
    slug: "board-games-club",
    category: "social",
    placeholder: true,
    instagram: "https://www.instagram.com/",
    join: { open: true },
    en: {
      name: "Board Games Club",
      tagline: "Strategy, diplomacy, and betrayal — just on a tabletop.",
      description: [
        "A relaxed weekly hangout for card and board games, from party games to longer strategy titles — a good way to meet people outside your own year or section.",
        "The club keeps a small shared library of games; members are also welcome to bring their own to teach the group.",
        "No commitment needed — drop in for one session or every week.",
      ],
      meets: "Fridays, 5:00–8:00pm, student common area",
      lead: "Club organiser",
      howToJoin: "Just show up on a Friday — new faces are always welcome, no sign-up required.",
    },
    th: {
      name: "ชมรมบอร์ดเกม",
      tagline: "กลยุทธ์ การทูต และการหักหลัง แค่บนโต๊ะเกม",
      description: [
        "นัดพบประจำสัปดาห์แบบชิล ๆ สำหรับคนชอบเล่นการ์ดเกมและบอร์ดเกม ตั้งแต่เกมปาร์ตี้ไปจนถึงเกมกลยุทธ์ยาว ๆ เป็นโอกาสดีที่จะได้รู้จักเพื่อนต่างชั้นปีหรือต่างกลุ่ม",
        "ชมรมมีเกมส่วนกลางให้ยืมเล่นจำนวนหนึ่ง และยินดีถ้าใครอยากพกเกมของตัวเองมาสอนเพื่อน ๆ เล่นด้วย",
        "ไม่ต้องผูกมัด แวะมาครั้งเดียวหรือมาทุกสัปดาห์ก็ได้",
      ],
      meets: "ทุกวันศุกร์ 17:00–20:00 น. พื้นที่ส่วนกลางของนักศึกษา",
      lead: "ผู้จัดกิจกรรมชมรม",
      howToJoin: "มาได้เลยในวันศุกร์ ยินดีต้อนรับหน้าใหม่เสมอ ไม่ต้องลงชื่อล่วงหน้า",
    },
  },
  {
    key: "mooting-negotiation-club",
    slug: "mooting-negotiation-club",
    category: "academic",
    placeholder: true,
    email: "mooting.birsa@tu.ac.th",
    instagram: "https://www.instagram.com/",
    join: { open: true },
    en: {
      name: "Mooting & Negotiation Club",
      tagline: "Practising the arguments behind international agreements.",
      description: [
        "This club practises simulated negotiation and mooting exercises relevant to international relations — treaty negotiations, mock arbitration, and crisis-response scenarios.",
        "Sessions are run as structured exercises with assigned roles and a short debrief, useful for anyone interested in diplomacy, law, or international organisations after graduation.",
        "The club occasionally partners with the Model UN and Debate Society for joint practice sessions.",
      ],
      meets: "Bi-weekly, evenings — schedule confirmed each term",
      lead: "Convenor",
      howToJoin: "Email the club with a short line about your interest, or come to the first session of term — open to all years.",
    },
    th: {
      name: "ชมรมจำลองการเจรจาต่อรอง",
      tagline: "ฝึกซ้อมเบื้องหลังข้อตกลงระหว่างประเทศ",
      description: [
        "ชมรมนี้ฝึกซ้อมการเจรจาต่อรองจำลองและกิจกรรมโต้แย้งที่เกี่ยวข้องกับความสัมพันธ์ระหว่างประเทศ เช่น การเจรจาสนธิสัญญาจำลอง การอนุญาโตตุลาการจำลอง และสถานการณ์จำลองภาวะวิกฤต",
        "แต่ละครั้งจัดเป็นกิจกรรมที่มีบทบาทกำหนดไว้ชัดเจนพร้อมสรุปบทเรียนสั้น ๆ ท้ายกิจกรรม เหมาะกับใครที่สนใจสายการทูต กฎหมาย หรือองค์กรระหว่างประเทศหลังเรียนจบ",
        "บางครั้งชมรมร่วมมือกับชมรม MUN และชมรมโต้วาทีจัดซ้อมร่วมกัน",
      ],
      meets: "ทุกสองสัปดาห์ ช่วงเย็น (ตารางยืนยันอีกครั้งในแต่ละเทอม)",
      lead: "ผู้ประสานงานชมรม",
      howToJoin: "อีเมลบอกความสนใจสั้น ๆ มาที่ชมรม หรือมาร่วมงานแรกของเทอมได้เลย เปิดรับทุกชั้นปี",
    },
  },
];

export function getClub(slug: string): Club | undefined {
  return clubs.find((club) => club.slug === slug);
}
