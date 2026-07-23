/**
 * Clubs directory: typed module (not MDX). These are the real BIR programme
 * clubs. `slug` is the shared key across locales.
 *
 * Sourcing notes:
 * - ASA IR, BIRify, and Kien Club have confirmed public accounts, linked below.
 *   Their descriptions are drawn from their own public material.
 * - The remaining clubs (music, card games, the three sports, esports) are real
 *   but keep little public footprint. Their entries describe what the club does
 *   in general terms and do NOT state meeting times, emails, or handles we could
 *   not verify. Do not add unverified specifics.
 *
 * Never invent real people's names. `lead` is a role title only. Do not
 * fabricate contact details: leave `email`/`instagram` unset unless confirmed.
 */
import type { Locale } from "@/lib/i18n";

export type ClubCategory = "academic" | "sports" | "arts" | "community" | "social";

/** A single labelled item in a club's activities list. */
export type ClubActivity = {
  label: string;
  body: string;
};

/**
 * An optional longer welcome from the club itself, in the club's own voice.
 * Kept separate from the neutral `description`. Each locale supplies its own,
 * written entirely in that one language (no mixing).
 */
export type ClubWelcome = {
  heading: string;
  /** Paragraphs before the activities list. */
  intro: string[];
  activitiesHeading: string;
  activities: ClubActivity[];
  /** Paragraphs after the activities list. */
  outro: string[];
};

export type ClubLocaleContent = {
  name: string;
  tagline: string;
  /** 2-3 paragraphs. */
  description: string[];
  /** Optional longer message from the club, in its own voice. */
  welcome?: ClubWelcome;
  meets?: string;
  /** Role title only, e.g. "President". Never a person's name. */
  lead?: string;
  howToJoin: string;
};

export type Club = {
  key: string;
  slug: string;
  category: ClubCategory;
  email?: string;
  instagram?: string;
  join: { open: boolean };
  /**
   * Slug of this club's matching Custodian in the inventory system
   * (`db/migrations/009_custodians.sql`). Club slugs here and custodian
   * slugs there are independent, unrelated data sources, so this is set
   * manually and only when confirmed, never assumed from a matching slug
   * string. When set, the club page links to this club's section of the
   * equipment directory; when unset, no link is rendered.
   */
  custodianSlug?: string;
  en: ClubLocaleContent;
  th: ClubLocaleContent;
};

export const clubCategories: Record<ClubCategory, Record<Locale, string>> = {
  academic: { en: "Academic", th: "วิชาการ" },
  sports: { en: "Sports", th: "กีฬา" },
  arts: { en: "Arts and culture", th: "ศิลปะและวัฒนธรรม" },
  community: { en: "Community and service", th: "ชุมชนและจิตอาสา" },
  social: { en: "Social", th: "สังสรรค์" },
};

export const clubs: Club[] = [
  {
    key: "asa-ir",
    slug: "asa-ir",
    category: "community",
    instagram: "https://www.instagram.com/asa.ir.tu/",
    join: { open: true },
    custodianSlug: "asa-ir",
    en: {
      name: "ASA IR",
      tagline: "Student volunteer camps built around sustainable development.",
      description: [
        "ASA IR is the BIR programme's volunteer club. It runs student-led camps and community projects under the theme of sustainable development, taking what you study about politics and society and putting it to work outside the classroom.",
        "The club follows the Thai volunteer-camp tradition of working alongside a host community rather than dropping in for a single visit, so the aim is help that still stands once the camp packs up. Planning, fundraising, and the camps themselves all need hands.",
        "You do not need any special skills to take part, just time and a willingness to pitch in. Many members say it is the most grounding thing they do outside lectures.",
      ],
      lead: "Committee",
      howToJoin:
        "Follow the club on Instagram at @asa.ir.tu, where camp dates and member recruitment are posted. Recruitment usually opens ahead of each camp.",
    },
    th: {
      name: "อาสาไออาร์ (ASA IR)",
      tagline: "ค่ายอาสาของนักศึกษาที่ยึดการพัฒนาอย่างยั่งยืนเป็นหัวใจ",
      description: [
        "อาสาไออาร์คือชมรมจิตอาสาของหลักสูตร BIR จัดค่ายและโครงการเพื่อชุมชนที่นักศึกษาเป็นผู้ขับเคลื่อน ภายใต้แนวคิดการพัฒนาอย่างยั่งยืน เป็นการนำสิ่งที่เรียนเรื่องการเมืองและสังคมมาลงมือทำจริงนอกห้องเรียน",
        "ชมรมยึดแนวทางค่ายอาสาแบบไทยที่ลงไปทำงานร่วมกับชุมชนเจ้าบ้าน ไม่ใช่แค่ไปเยี่ยมครั้งเดียวจบ เป้าหมายคือความช่วยเหลือที่ยังอยู่ต่อไปแม้ค่ายจะเลิกแล้ว ทั้งการวางแผน การระดมทุน และตัวค่ายเองล้วนต้องการคนมาช่วยกัน",
        "ไม่ต้องมีทักษะพิเศษในการเข้าร่วม แค่มีเวลาและใจที่พร้อมลงมือ สมาชิกหลายคนบอกว่านี่คือกิจกรรมที่ทำให้รู้สึกเชื่อมโยงกับโลกจริงมากที่สุดนอกห้องเรียน",
      ],
      lead: "คณะกรรมการชมรม",
      howToJoin:
        "ติดตามชมรมได้ทาง Instagram @asa.ir.tu ซึ่งจะประกาศวันจัดค่ายและการรับสมาชิก โดยปกติจะเปิดรับก่อนถึงกำหนดจัดค่ายแต่ละครั้ง",
    },
  },
  {
    key: "bir-music-club",
    slug: "bir-music-club",
    category: "arts",
    instagram: "https://www.instagram.com/birmusicclub/",
    join: { open: true },
    en: {
      name: "BIR Music Club",
      tagline: "For BIR students who play, sing, or just want to jam.",
      description: [
        "BIR Music Club brings together students who make music, whether you play an instrument, sing, produce, or simply want people to jam with between classes.",
        "It is a way to find bandmates, share what you are working on, and put together performances for BIR and BIRSA events through the year.",
        "All levels are welcome. You do not need to read music or own expensive gear to take part.",
      ],
      lead: "Committee",
      howToJoin:
        "Follow the club on Instagram at @birmusicclub, where jam sessions, performances, and member sign-ups are posted. New members are usually welcomed at the start of each semester.",
    },
    th: {
      name: "ชมรมดนตรี BIR",
      tagline: "สำหรับชาว BIR ที่เล่นดนตรี ร้องเพลง หรือแค่อยากมาแจมด้วยกัน",
      description: [
        "ชมรมดนตรี BIR รวมนักศึกษาที่รักการทำดนตรี ไม่ว่าจะเล่นเครื่องดนตรี ร้องเพลง ทำเพลง หรือแค่อยากหาเพื่อนมาแจมกันระหว่างคาบเรียน",
        "เป็นพื้นที่ให้หาเพื่อนร่วมวง แชร์ผลงานที่กำลังทำอยู่ และรวมตัวกันขึ้นแสดงในงานของ BIR และ BIRSA ตลอดทั้งปี",
        "ยินดีต้อนรับทุกระดับฝีมือ ไม่จำเป็นต้องอ่านโน้ตเป็นหรือมีอุปกรณ์ราคาแพงก็ร่วมได้",
      ],
      lead: "คณะกรรมการชมรม",
      howToJoin:
        "ติดตามชมรมได้ทาง Instagram @birmusicclub ซึ่งจะประกาศการนัดแจม การแสดง และการรับสมาชิก โดยปกติจะเปิดรับสมาชิกใหม่ช่วงต้นเทอมแต่ละเทอม",
    },
  },
  {
    key: "birify",
    slug: "birify",
    category: "arts",
    instagram: "https://www.instagram.com/birify/",
    join: { open: true },
    en: {
      name: "BIRify",
      tagline: "The BIR student podcast: making it BIR.",
      description: [
        "BIRify is a podcast made by BIR students to introduce listeners to the world of the programme. Episodes run in Thai and English and cover popular culture, philosophy, history, politics, and students' own experiences of studying BIR.",
        "Past episodes have picked apart everything from the film Inside Out to menstruation policy, urban loneliness, and the reign of Henry VIII. A spin-off series, '(History of) NO IDEA', digs into intellectual history.",
        "A new episode goes up every two weeks. You can listen on Spotify and YouTube, and follow @birify for updates.",
      ],
      lead: "Host and production team",
      howToJoin:
        "Listen on Spotify and YouTube, and follow the show on Instagram at @birify. Watch there for calls when the team is looking for new hosts and producers.",
    },
    th: {
      name: "BIRify",
      tagline: "พอดแคสต์ของนักศึกษา BIR: making it BIR",
      description: [
        "BIRify คือพอดแคสต์ที่นักศึกษา BIR ทำขึ้นเพื่อพาผู้ฟังไปรู้จักโลกของหลักสูตร แต่ละอีพีมีทั้งภาษาไทยและภาษาอังกฤษ ครอบคลุมทั้งวัฒนธรรมป็อป ปรัชญา ประวัติศาสตร์ การเมือง และประสบการณ์ตรงของนักศึกษาที่เรียน BIR",
        "อีพีที่ผ่านมาชวนคุยหลากหลาย ตั้งแต่หนังเรื่อง Inside Out ไปจนถึงนโยบายเรื่องประจำเดือน ความเหงาในเมืองใหญ่ และรัชสมัยของพระเจ้าเฮนรีที่ 8 พร้อมซีรีส์แยก '(History of) NO IDEA' ที่เจาะลึกประวัติศาสตร์ทางความคิด",
        "ปล่อยอีพีใหม่ทุกสองสัปดาห์ ฟังได้ทาง Spotify และ YouTube และติดตามความเคลื่อนไหวได้ที่ @birify",
      ],
      lead: "ทีมผู้ดำเนินรายการและผลิต",
      howToJoin:
        "ฟังได้ทาง Spotify และ YouTube และติดตามรายการทาง Instagram @birify คอยดูประกาศเมื่อทีมงานเปิดรับผู้ดำเนินรายการและทีมผลิตใหม่",
    },
  },
  {
    key: "kien-club",
    slug: "kien-club",
    category: "arts",
    instagram: "https://www.instagram.com/kien.club/",
    join: { open: true },
    en: {
      name: "Kien Club",
      tagline: "A student e-zine: writing, editing, and design.",
      description: [
        "Kien Club is a BIR student publication. Its members write, edit, and illustrate essays on culture, society, and city life, then publish them for anyone to read.",
        "Work is organised into teams, roughly writing, editorial, and graphics, so there is a place for you whether you want to report an idea, sharpen someone else's draft, or design how it looks on the page.",
        "Recent pieces have looked at subjects like gentrification in Bangkok's older neighbourhoods. Articles go out through the club's Instagram.",
      ],
      lead: "Editorial team",
      howToJoin:
        "Follow @kien.club on Instagram. The club recruits for all its teams once a year, usually around August to September, and posts the details there.",
    },
    th: {
      name: "Kien Club",
      tagline: "อีซีนของนักศึกษา: เขียน บรรณาธิการ และออกแบบ",
      description: [
        "Kien Club คือสื่อสิ่งพิมพ์ของนักศึกษา BIR สมาชิกร่วมกันเขียน เรียบเรียง และวาดภาพประกอบบทความว่าด้วยวัฒนธรรม สังคม และชีวิตในเมือง แล้วเผยแพร่ให้ทุกคนได้อ่าน",
        "งานแบ่งออกเป็นทีมย่อย ทั้งทีมเขียน กองบรรณาธิการ และกราฟิก จึงมีที่ทางสำหรับทุกคน ไม่ว่าจะอยากนำเสนอไอเดีย ช่วยขัดเกลาต้นฉบับของคนอื่น หรือออกแบบหน้าตาของบทความ",
        "ผลงานช่วงหลังพูดถึงประเด็นอย่างเจนทริฟิเคชันในย่านเก่าของกรุงเทพฯ โดยบทความจะเผยแพร่ผ่าน Instagram ของชมรม",
      ],
      lead: "กองบรรณาธิการ",
      howToJoin:
        "ติดตาม @kien.club ทาง Instagram ชมรมเปิดรับสมาชิกทุกทีมปีละครั้ง โดยปกติราวเดือนสิงหาคมถึงกันยายน และจะประกาศรายละเอียดไว้ที่นั่น",
    },
  },
  {
    key: "bir-cardgame-club",
    slug: "bir-cardgame-club",
    category: "social",
    join: { open: true },
    en: {
      name: "BIR CardGame Club",
      tagline: "Trading card games and a table to play them on.",
      description: [
        "BIR CardGame Club is a relaxed space for card games, from trading card games to quicker party decks, and a good way to meet people across year groups.",
        "Members bring games to teach, run casual matches, and organise the occasional friendly tournament.",
        "Whether you are a seasoned player or have never shuffled a deck, you are welcome to drop in.",
      ],
      lead: "Committee",
      howToJoin:
        "Club sign-ups are announced at the start of each semester. Watch BIRSA's Instagram (@student_birsa) for the announcement, or ask around at BIRSA's welcome events.",
    },
    th: {
      name: "ชมรมการ์ดเกม BIR",
      tagline: "การ์ดเกมและโต๊ะให้ได้ลงเล่นด้วยกัน",
      description: [
        "ชมรมการ์ดเกม BIR คือพื้นที่สบาย ๆ สำหรับคนชอบการ์ดเกม ตั้งแต่เกมการ์ดสะสมไปจนถึงเกมปาร์ตี้เล่นเร็ว และเป็นโอกาสดีที่จะได้รู้จักเพื่อนต่างชั้นปี",
        "สมาชิกพกเกมมาสอนกัน จัดแมตช์แบบชิล ๆ และมีทัวร์นาเมนต์กระชับมิตรเป็นครั้งคราว",
        "ไม่ว่าจะเป็นมือเก๋าหรือไม่เคยจับไพ่สับเลย ก็แวะมาร่วมได้เสมอ",
      ],
      lead: "คณะกรรมการชมรม",
      howToJoin:
        "การรับสมาชิกจะประกาศช่วงต้นเทอมแต่ละเทอม ติดตามได้ทาง Instagram ของ BIRSA (@student_birsa) หรือสอบถามในงานต้อนรับของ BIRSA",
    },
  },
  {
    key: "bir-football",
    slug: "bir-football",
    category: "sports",
    instagram: "https://www.instagram.com/birfootballclub/",
    join: { open: true },
    custodianSlug: "bir-football",
    en: {
      name: "BIR Football",
      tagline: "Casual football and friendly matches, all levels welcome.",
      description: [
        "BIR Football gets students out from behind their laptops for a game, from casual kickabouts to friendly matches against other programmes and faculties.",
        "The club is a relaxed way to play regularly, meet people across year groups, and represent BIR when there is a match on.",
        "No trials and no experience required. Bring trainers and water and turn up.",
      ],
      welcome: {
        heading: "A word from the club",
        intro: [
          "Congratulations on becoming part of BIR: reaching this point took real effort, and every one of you should be proud. On behalf of BIR Football Club, congratulations, and if football sounds like your thing, we would love for you to come join us.",
          "If we had to sum up our club in one word, it would be “family.” We care most about having fun and building togetherness, carrying forward the warm community culture that Singh Daeng, the Red Lion, is known for.",
        ],
        activitiesHeading: "What we get up to",
        activities: [
          {
            label: "Practice",
            body: "Training is relaxed and unpressured, held a few times a month depending on everyone's availability. We usually head out for good food together afterwards, which is where a lot of the good vibes happen: a great way to build connections and camaraderie across year groups.",
          },
          {
            label: "Matches",
            body: "Beyond our own training and socials, we also get chances to play friendly matches against other universities and faculties.",
          },
        ],
        outro: [
          "One more thing worth knowing: we are not just a men's team; we have a women's team too. And if playing isn't your thing but you'd still like to be part of it, we would love to have you on board behind the scenes. You don't need any football experience: just an open mind, a willingness to learn, and a readiness to have fun together. See you on the pitch! ⚽",
        ],
      },
      lead: "Team captain",
      howToJoin:
        "Follow the club on Instagram at @birfootballclub, where match days and new-player sign-ups are posted. New players are usually welcomed at the start of each semester.",
    },
    th: {
      name: "ฟุตบอล BIR",
      tagline: "ฟุตบอลแบบสบาย ๆ และแมตช์กระชับมิตร ทุกระดับฝีเท้า",
      description: [
        "ฟุตบอล BIR ชวนเพื่อน ๆ ออกมาวิ่งเตะบอลนอกจอคอม ตั้งแต่เตะเล่นสบาย ๆ ไปจนถึงแมตช์กระชับมิตรกับหลักสูตรและคณะอื่น ๆ",
        "เป็นวิธีชิล ๆ ที่จะได้เล่นบอลสม่ำเสมอ ได้รู้จักเพื่อนต่างชั้นปี และได้เป็นตัวแทน BIR เมื่อมีแมตช์",
        "ไม่มีการคัดตัว ไม่ต้องมีประสบการณ์ แค่เตรียมรองเท้าผ้าใบกับน้ำแล้วมาได้เลย",
      ],
      welcome: {
        heading: "คำทักทายจากชมรมฟุตบอล BIR",
        intro: [
          "ยินดีต้อนรับน้อง ๆ และทุกคนที่สนใจเข้าร่วมชมรมฟุตบอล BIR ครับ ไม่ว่าจะเพิ่งก้าวเข้ามาเป็นส่วนหนึ่งของ BIR หรือกำลังมองหาที่ที่ได้เตะบอลไปพร้อมกับสร้างมิตรภาพดี ๆ พวกพี่ขอเชิญชวนให้ลองเข้ามาร่วมกลุ่มกับพวกเราครับ",
          "ถ้าให้อธิบายภาพรวมของชมรมเรา คำว่า “ครอบครัว” น่าจะเป็นคำที่เหมาะที่สุด พวกเราให้ความสำคัญกับความสนุกและความสามัคคีกลมเกลียว เพื่อสืบทอดวัฒนธรรมชุมชนสิงห์แดงที่อบอุ่นให้คงอยู่ต่อไป",
        ],
        activitiesHeading: "กิจกรรมหลักของชมรม",
        activities: [
          {
            label: "การซ้อมฟุตบอล",
            body: "ซ้อมกันแบบสบาย ๆ หลายครั้งต่อเดือน ขึ้นอยู่กับความสะดวกและความสมัครใจของทุกคน หลังซ้อมเสร็จก็มักจะชวนกันไปหาของอร่อยกินต่อ ซึ่งเป็นช่วงเวลาดี ๆ ที่ช่วยสร้างบรรยากาศเป็นกันเองและความสนิทสนมระหว่างรุ่นพี่รุ่นน้อง",
          },
          {
            label: "การแข่งขัน",
            body: "นอกจากกิจกรรมภายในชมรมแล้ว เรายังมีโอกาสไปแข่งกระชับมิตรกับมหาวิทยาลัยและคณะอื่น ๆ ด้วยครับ",
          },
        ],
        outro: [
          "ที่สำคัญ ชมรมเราไม่ได้มีแค่ทีมชายเท่านั้น แต่ยังมีทีมฟุตบอลหญิงด้วย และถ้าใครไม่อยากลงเล่นแต่อยากมาช่วยเป็นทีมงานเบื้องหลัง พวกเราก็ยินดีต้อนรับอย่างยิ่ง ไม่จำเป็นต้องมีประสบการณ์หรือเล่นเก่งมาก่อน ขอแค่เปิดใจ พร้อมเรียนรู้ และสนุกไปด้วยกัน แล้วเจอกันในสนามนะครับ ⚽",
        ],
      },
      lead: "กัปตันทีม",
      howToJoin:
        "ติดตามชมรมได้ทาง Instagram @birfootballclub ซึ่งจะประกาศวันแข่งและการรับผู้เล่นใหม่ โดยปกติจะเปิดรับผู้เล่นใหม่ช่วงต้นเทอมแต่ละเทอม",
    },
  },
  {
    key: "bir-volleyball",
    slug: "bir-volleyball",
    category: "sports",
    join: { open: true },
    custodianSlug: "bir-volleyball",
    en: {
      name: "BIR Volleyball",
      tagline: "Volleyball for BIR students, from first-timers to regulars.",
      description: [
        "BIR Volleyball runs casual sessions and friendly matches for anyone who wants to play, whatever your level.",
        "It is an easy way to keep active during term, learn the game if you are new to it, and play alongside other BIR students.",
        "Just bring water and shoes you can move in; no experience is needed to join a session.",
      ],
      lead: "Team captain",
      howToJoin:
        "Sessions and new players are announced through BIRSA at the start of each semester. Watch BIRSA's Instagram (@student_birsa), or ask around at BIRSA's welcome events.",
    },
    th: {
      name: "วอลเลย์บอล BIR",
      tagline: "วอลเลย์บอลสำหรับชาว BIR ตั้งแต่มือใหม่จนถึงขาประจำ",
      description: [
        "วอลเลย์บอล BIR จัดซ้อมแบบสบาย ๆ และแมตช์กระชับมิตรให้ทุกคนที่อยากเล่น ไม่ว่าจะระดับไหน",
        "เป็นวิธีง่าย ๆ ที่จะได้ขยับร่างกายระหว่างเทอม ได้หัดเล่นถ้าเพิ่งเริ่ม และได้เล่นกับเพื่อน ๆ ชาว BIR",
        "แค่เตรียมน้ำและรองเท้าที่ขยับสะดวกมาก็พอ ไม่ต้องมีประสบการณ์ก็มาร่วมซ้อมได้",
      ],
      lead: "กัปตันทีม",
      howToJoin:
        "ตารางซ้อมและการรับผู้เล่นใหม่จะประกาศผ่าน BIRSA ช่วงต้นเทอมแต่ละเทอม ติดตามได้ทาง Instagram ของ BIRSA (@student_birsa) หรือสอบถามในงานต้อนรับของ BIRSA",
    },
  },
  {
    key: "bir-basketball",
    slug: "bir-basketball",
    category: "sports",
    instagram: "https://www.instagram.com/bir.basketballclub/",
    join: { open: true },
    custodianSlug: "bir-basketball",
    en: {
      name: "BIR Basketball",
      tagline: "Pick-up games and a BIR team to play for.",
      description: [
        "BIR Basketball is for students who want to shoot some hoops, from casual pick-up games to playing for BIR in friendly matches.",
        "The club welcomes regulars and complete beginners alike, and is a relaxed way to stay active and meet people across the programme.",
        "Turn up in trainers, bring water, and get on the court.",
      ],
      lead: "Team captain",
      howToJoin:
        "Follow the club on Instagram at @bir.basketballclub, where game days and new-player sign-ups are posted. New players are usually welcomed at the start of each semester.",
    },
    th: {
      name: "บาสเกตบอล BIR",
      tagline: "เล่นบาสสบาย ๆ และทีม BIR ให้ได้ลงสนาม",
      description: [
        "บาสเกตบอล BIR สำหรับคนที่อยากมาชู้ตบาส ตั้งแต่เล่นกันเองสบาย ๆ ไปจนถึงลงเล่นให้ BIR ในแมตช์กระชับมิตร",
        "ชมรมยินดีต้อนรับทั้งขาประจำและมือใหม่หัดเล่น เป็นวิธีชิล ๆ ที่จะได้ออกกำลังและรู้จักเพื่อน ๆ ในหลักสูตร",
        "ใส่รองเท้าผ้าใบ เตรียมน้ำ แล้วลงสนามได้เลย",
      ],
      lead: "กัปตันทีม",
      howToJoin:
        "ติดตามชมรมได้ทาง Instagram @bir.basketballclub ซึ่งจะประกาศวันแข่งและการรับผู้เล่นใหม่ โดยปกติจะเปิดรับผู้เล่นใหม่ช่วงต้นเทอมแต่ละเทอม",
    },
  },
  {
    key: "bir-esports-club",
    slug: "bir-esports-club",
    category: "sports",
    instagram: "https://www.instagram.com/biresport.club/",
    join: { open: true },
    en: {
      name: "BIR Esports Club",
      tagline: "Competitive and casual gaming for BIR students.",
      description: [
        "BIR Esports Club is for students who game, whether you want to compete or just play together. It brings players together across popular titles and sorts out teams and casual sessions.",
        "The club runs internal matches and helps members team up for inter-faculty and online tournaments.",
        "All skill levels are welcome, whatever you play.",
      ],
      lead: "Committee",
      howToJoin:
        "Follow the club on Instagram at @biresport.club, where tournaments and member sign-ups are posted. New members are usually welcomed at the start of each semester.",
    },
    th: {
      name: "ชมรมอีสปอร์ต BIR",
      tagline: "เกมทั้งสายแข่งและสายชิลสำหรับชาว BIR",
      description: [
        "ชมรมอีสปอร์ต BIR สำหรับคนที่ชอบเล่นเกม ไม่ว่าจะอยากลงแข่งจริงจังหรือแค่มาเล่นด้วยกัน ชมรมรวมผู้เล่นจากหลากหลายเกมยอดนิยม และช่วยจัดทีมกับนัดเล่นแบบสบาย ๆ",
        "ชมรมจัดแมตช์ภายในและช่วยสมาชิกจับทีมลงแข่งทั้งรายการระหว่างคณะและทัวร์นาเมนต์ออนไลน์",
        "ยินดีต้อนรับทุกระดับฝีมือ ไม่ว่าคุณจะเล่นเกมอะไร",
      ],
      lead: "คณะกรรมการชมรม",
      howToJoin:
        "ติดตามชมรมได้ทาง Instagram @biresport.club ซึ่งจะประกาศทัวร์นาเมนต์และการรับสมาชิก โดยปกติจะเปิดรับสมาชิกใหม่ช่วงต้นเทอมแต่ละเทอม",
    },
  },
  {
    key: "tu-mun",
    slug: "tu-mun",
    category: "academic",
    join: { open: true },
    en: {
      name: "TU MUN",
      tagline: "Model United Nations: debate, diplomacy, and drafting resolutions.",
      description: [
        "TU MUN is Thammasat University's Model United Nations club, where students simulate United Nations committees and practise the diplomacy that happens in the real thing. Each member is assigned a country to represent, then researches that country's positions and speaks for it in committee sessions alongside everyone else.",
        "Sessions run like the real thing: opening statements, caucusing, negotiating with other delegations, and eventually drafting and voting on resolutions. It is a hands-on way to build public speaking, research, negotiation, and formal writing skills, all while getting into the details of a global issue you might otherwise only read about.",
        "The club also prepares members for and takes part in Model UN conferences, both at Thammasat and beyond, so training carries over into real competitive rounds.",
      ],
      lead: "Committee",
      howToJoin:
        "Recruitment and conference details are announced through the club and BIRSA's channels; watch for updates there rather than a fixed sign-up date.",
    },
    th: {
      name: "TU MUN",
      tagline: "จำลองการประชุมสหประชาชาติ ฝึกโต้วาที การทูต และร่างข้อมติ",
      description: [
        "TU MUN คือชมรมจำลองการประชุมสหประชาชาติ (Model United Nations) ของธรรมศาสตร์ ให้นักศึกษาได้จำลองคณะกรรมการของ UN และฝึกฝนงานการทูตแบบที่เกิดขึ้นจริง สมาชิกแต่ละคนจะได้รับมอบหมายให้เป็นตัวแทนประเทศหนึ่ง ต้องศึกษาจุดยืนของประเทศนั้นแล้วนำมาอภิปรายในที่ประชุมร่วมกับตัวแทนประเทศอื่น ๆ",
        "การประชุมจำลองเดินตามรูปแบบจริง ทั้งการกล่าวถ้อยแถลงเปิด การล็อบบี้ การเจรจากับคณะผู้แทนอื่น ไปจนถึงการร่างและลงมติข้อมติในที่สุด เป็นวิธีฝึกทักษะการพูดในที่สาธารณะ การค้นคว้า การเจรจาต่อรอง และการเขียนเชิงทางการ พร้อมได้ลงลึกในประเด็นระดับโลกที่ปกติอาจได้แค่อ่านผ่าน ๆ",
        "นอกจากนี้ชมรมยังเตรียมความพร้อมสมาชิกสำหรับการแข่งขัน Model UN และพาไปร่วมงานจริงทั้งในธรรมศาสตร์และที่อื่น ๆ ทำให้การฝึกซ้อมต่อยอดไปสู่สนามแข่งจริงได้",
      ],
      lead: "คณะกรรมการชมรม",
      howToJoin:
        "รายละเอียดการรับสมาชิกและการแข่งขันจะประกาศผ่านชมรมและช่องทางของ BIRSA คอยติดตามไว้แทนที่จะมีกำหนดวันตายตัว",
    },
  },
];

export function getClub(slug: string): Club | undefined {
  return clubs.find((club) => club.slug === slug);
}
