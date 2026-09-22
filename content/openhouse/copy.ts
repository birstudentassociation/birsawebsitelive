import type { Locale } from "@/lib/i18n";

export type Bi = { en: string; th: string };

/** 31 October 2026, 08:00–16:00, Faculty of Political Science, TU Tha Prachan. */
export const OPEN_HOUSE = {
  dateISO: "2026-10-31",
  startHour: 8,
  endHour: 16,
  venue: {
    en: "Faculty of Political Science, Thammasat University, Tha Prachan",
    th: "คณะรัฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์",
  } satisfies Bi,
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Faculty+of+Political+Science+Thammasat+University+Tha+Prachan",
  programmeUrl: "https://polsci.tu.ac.th",
} as const;

/**
 * A short, honest glimpse of what each subject actually grapples with — "what
 * could this class teach you", not a syllabus. Grounded in the official
 * curriculum descriptions in `content/course-review/courses.ts`; the framing is
 * BIRSA editorial and names only ideas genuinely central to the field, never a
 * claim about a specific term's teaching.
 */
export type CourseTeaser = {
  hook: Bi;
  opens: Bi;
  thinkers: Bi[];
  takeaway: Bi;
};

/**
 * Curated for the 09:15 scene. The set deliberately spans political theory,
 * public policy, law, political economy, media and international relations so
 * the breadth of the programme is felt rather than argued. Titles are resolved
 * from the real course catalogue at build time.
 */
export const CURATED_COURSES: { code: string; field: Bi; teaser: CourseTeaser }[] = [
  {
    code: "PI210",
    field: { en: "Political theory", th: "ปรัชญาการเมือง" },
    teaser: {
      hook: { en: "What makes power worth obeying?", th: "อำนาจแบบไหนที่คนควรยอมทำตาม" },
      opens: {
        en: "Justice, the state, freedom, the good life — the oldest arguments in politics, still unsettled. You read Hobbes and Rousseau and Rawls alongside traditions from beyond the West, Confucian ideas of virtuous rule and Kautilya's statecraft, and learn to take an idea apart instead of just agreeing with it.",
        th: "ความยุติธรรม รัฐ เสรีภาพ ชีวิตที่ดี ล้วนเป็นคำถามที่เก่าแก่ที่สุดของการเมืองและยังไม่มีใครตอบจบ คุณจะได้อ่านงานของฮอบส์ รุสโซ และรอลส์ ควบคู่ไปกับแนวคิดนอกสายตะวันตก ทั้งการปกครองโดยผู้มีคุณธรรมแบบขงจื๊อและตำราการปกครองของเกาฏิลยะ แล้วฝึกแยกแยะความคิดออกเป็นชิ้น ๆ แทนที่จะแค่เห็นด้วย",
      },
      thinkers: [
        { en: "Justice", th: "ความยุติธรรม" },
        { en: "Social contract", th: "สัญญาประชาคม" },
        { en: "Hobbes to Rawls", th: "ฮอบส์ถึงรอลส์" },
        { en: "Confucius & Kautilya", th: "ขงจื๊อและเกาฏิลยะ" },
      ],
      takeaway: {
        en: "You leave able to argue a position — and find its weakest point.",
        th: "คุณจะออกไปพร้อมกับการโต้แย้งความคิดได้ และมองเห็นจุดอ่อนของมันด้วย",
      },
    },
  },
  {
    code: "PI241",
    field: { en: "Public policy", th: "นโยบายสาธารณะ" },
    teaser: {
      hook: {
        en: "How does a decision reach real life?",
        th: "การตัดสินใจหนึ่งไปถึงชีวิตจริงได้อย่างไร",
      },
      opens: {
        en: "Between a policy on paper and a service you actually use sits a whole machinery — Weber's bureaucracy, budgets, accountability, ethics — and the old question of where politics ends and administration begins. This is where you learn how the state is run, and where it breaks.",
        th: "ระหว่างนโยบายบนกระดาษกับบริการที่คุณใช้จริง มีกลไกทั้งระบบคั่นอยู่ ทั้งระบบราชการแบบเวเบอร์ งบประมาณ ความรับผิดชอบ และจริยธรรม รวมถึงคำถามเก่าแก่ว่าการเมืองสิ้นสุดตรงไหนและการบริหารเริ่มต้นตรงไหน ที่นี่คือที่ที่คุณจะได้เรียนว่ารัฐทำงานอย่างไร และพังตรงไหน",
      },
      thinkers: [
        { en: "Politics vs administration", th: "การเมืองกับการบริหาร" },
        { en: "Weber's bureaucracy", th: "ระบบราชการแบบเวเบอร์" },
        { en: "The policy cycle", th: "วงจรนโยบาย" },
        { en: "Accountability", th: "ความรับผิดชอบ" },
      ],
      takeaway: {
        en: "You learn to trace a decision from intention to impact.",
        th: "คุณจะฝึกไล่ตามการตัดสินใจตั้งแต่ความตั้งใจจนถึงผลกระทบจริง",
      },
    },
  },
  {
    code: "PI291",
    field: { en: "International law", th: "กฎหมายระหว่างประเทศ" },
    teaser: {
      hook: {
        en: "What binds a country that answers to no one?",
        th: "อะไรผูกมัดประเทศที่ไม่ต้องขึ้นกับใคร",
      },
      opens: {
        en: "With no world government, what makes international law real? You work case by case through its sources, sovereignty, the law of the sea, and moments like Nuremberg that held individuals answerable — reasoning the way it is actually argued.",
        th: "ในเมื่อไม่มีรัฐบาลโลก อะไรทำให้กฎหมายระหว่างประเทศมีผลจริง คุณจะได้ไล่เรียงทีละกรณี ทั้งที่มาของกฎหมาย อำนาจอธิปไตย กฎหมายทะเล และเหตุการณ์อย่างการพิจารณาคดีนูเรมเบิร์กที่เอาผิดบุคคลได้ อย่างที่เขาถกเถียงกันจริง",
      },
      thinkers: [
        { en: "Sovereignty", th: "อำนาจอธิปไตย" },
        { en: "Sources of law", th: "ที่มาของกฎหมาย" },
        { en: "Nuremberg", th: "นูเรมเบิร์ก" },
        { en: "Law of the sea", th: "กฎหมายทะเล" },
      ],
      takeaway: {
        en: "You learn to reason like a lawyer about a world with no single ruler.",
        th: "คุณจะฝึกคิดอย่างนักกฎหมายในโลกที่ไม่มีผู้ปกครองคนเดียว",
      },
    },
  },
  {
    code: "PI293",
    field: { en: "Political economy", th: "เศรษฐกิจการเมือง" },
    teaser: {
      hook: {
        en: "Why are some countries rich and others kept poor?",
        th: "ทำไมบางประเทศรวย บางประเทศถูกทำให้จน",
      },
      opens: {
        en: "Markets and power have never been separate. You trace capitalism from the first global trade to today's developmental states, following the arguments — Smith, Marx, Polanyi — over whether a market is natural or built, and who ends up with what.",
        th: "ตลาดกับอำนาจไม่เคยแยกออกจากกัน คุณจะได้ไล่ประวัติทุนนิยมตั้งแต่การค้าโลกยุคแรกจนถึงรัฐนำการพัฒนาในปัจจุบัน ผ่านข้อถกเถียงของสมิธ มาร์กซ์ และโพลานยี ว่าตลาดเป็นเรื่องธรรมชาติหรือถูกสร้างขึ้น และสุดท้ายใครได้อะไร",
      },
      thinkers: [
        { en: "History of capitalism", th: "ประวัติทุนนิยม" },
        { en: "Smith to Marx", th: "สมิธถึงมาร์กซ์" },
        { en: "Polanyi", th: "โพลานยี" },
        { en: "The developmental state", th: "รัฐนำการพัฒนา" },
      ],
      takeaway: {
        en: "You stop seeing the economy as natural, and start seeing it as built.",
        th: "คุณจะเลิกมองเศรษฐกิจว่าเป็นเรื่องธรรมชาติ แล้วเห็นว่ามันถูกสร้างขึ้น",
      },
    },
  },
  {
    code: "PI313",
    field: { en: "Media and politics", th: "สื่อกับการเมือง" },
    teaser: {
      hook: { en: "Who decides what the world notices?", th: "ใครเป็นคนกำหนดว่าโลกจะสนใจอะไร" },
      opens: {
        en: "News, memes and feeds don't just report politics — they shape it. You study how media set the agenda and frame what we argue about, how information and misinformation spread, and how social platforms rewired who gets to speak.",
        th: "ข่าว มีม และฟีดไม่ได้แค่รายงานการเมือง แต่กำหนดการเมืองด้วย คุณจะได้ศึกษาว่าสื่อจัดวาระและวางกรอบสิ่งที่เราถกเถียงกันอย่างไร ข้อมูลจริงและข้อมูลลวงแพร่กระจายอย่างไร และแพลตฟอร์มออนไลน์เปลี่ยนว่าใครมีสิทธิ์พูดไปแค่ไหน",
      },
      thinkers: [
        { en: "Agenda-setting", th: "การจัดวาระ" },
        { en: "Framing", th: "การวางกรอบ" },
        { en: "How news is made", th: "ข่าวถูกสร้างอย่างไร" },
        { en: "Social media", th: "สื่อสังคมออนไลน์" },
      ],
      takeaway: {
        en: "You learn to read the medium, not just the message.",
        th: "คุณจะอ่านตัวสื่อเป็น ไม่ใช่แค่เนื้อหาที่มันบอก",
      },
    },
  },
  {
    code: "PI280",
    field: { en: "International relations", th: "ความสัมพันธ์ระหว่างประเทศ" },
    teaser: {
      hook: {
        en: "Why do states go to war, and why do they stop?",
        th: "ทำไมรัฐถึงทำสงคราม และทำไมถึงหยุด",
      },
      opens: {
        en: "Terrorism, nuclear weapons, human rights, trade — this is where IR theory meets the headlines. You pit realism, liberalism and constructivism against real events — “anarchy is what states make of it” — to see which explanations actually hold up.",
        th: "การก่อการร้าย อาวุธนิวเคลียร์ สิทธิมนุษยชน การค้า ที่นี่คือจุดที่ทฤษฎีความสัมพันธ์ระหว่างประเทศมาเจอกับพาดหัวข่าว คุณจะได้เอาสัจนิยม เสรีนิยม และคอนสตรัคติวิสต์มาปะทะกับเหตุการณ์จริง แล้วดูว่าคำอธิบายไหนอยู่รอด",
      },
      thinkers: [
        { en: "Realism vs liberalism", th: "สัจนิยมกับเสรีนิยม" },
        { en: "Constructivism", th: "คอนสตรัคติวิสต์" },
        { en: "Nuclear proliferation", th: "การแพร่ขยายนิวเคลียร์" },
        { en: "Human rights", th: "สิทธิมนุษยชน" },
      ],
      takeaway: {
        en: "You learn to explain the news instead of just following it.",
        th: "คุณจะอธิบายข่าวได้ ไม่ใช่แค่ตามข่าว",
      },
    },
  },
];

/** The real ways people reach the Tha Prachan campus. Order is editorial. */
export const ARRIVE_MODES: { key: string; label: Bi; card: Bi }[] = [
  {
    key: "ferry",
    label: { en: "Ferry", th: "เรือข้ามฟาก" },
    card: { en: "Ferry across the river", th: "นั่งเรือข้ามฟาก" },
  },
  {
    key: "bus",
    label: { en: "Public bus", th: "รถเมล์" },
    card: { en: "Bus into the old city", th: "นั่งรถเมล์เข้าเมืองเก่า" },
  },
  {
    key: "mrt",
    label: { en: "MRT + walk", th: "MRT แล้วเดินต่อ" },
    card: { en: "MRT to Sanam Chai, then walk", th: "MRT ลงสนามไชยแล้วเดินต่อ" },
  },
  {
    key: "shuttle",
    label: { en: "TU shuttle", th: "รถรับส่งธรรมศาสตร์" },
    card: { en: "The Thammasat shuttle", th: "รถรับส่งของธรรมศาสตร์" },
  },
  {
    key: "walk",
    label: { en: "On foot", th: "เดินมา" },
    card: { en: "On foot through the old city", th: "เดินผ่านเมืองเก่ามา" },
  },
];

/**
 * Two honest lunch directions within the 53-minute window: a short walk around
 * Tha Prachan, or a quick ferry across to Wang Lang. `places` are real ids from
 * `lib/places.ts`, resolved to full entries at build time.
 */
export const LUNCH_DIRECTIONS: {
  key: string;
  label: Bi;
  blurb: Bi;
  ferry: boolean;
  places: string[];
}[] = [
  {
    key: "near",
    label: { en: "Stay by Tha Prachan", th: "อยู่แถวท่าพระจันทร์" },
    blurb: {
      en: "A few minutes on foot, back before the bell.",
      th: "เดินไม่กี่นาที กลับทันเข้าเรียน",
    },
    ferry: false,
    places: ["elle-tha-prachan", "nai-soie", "nai-uan-yentafo"],
  },
  {
    key: "wanglang",
    label: { en: "Cross to Wang Lang", th: "ข้ามไปวังหลัง" },
    blurb: {
      en: "A quick ferry over the river and back.",
      th: "นั่งเรือข้ามฟากไปกลับ",
    },
    ferry: true,
    places: ["khao-dong-moo-daeng", "chuan-aroy", "wang-lang-market"],
  },
];

type Copy = {
  eyebrow: Bi;
  event: Bi;
  headline: Bi;
  sub: Bi;
  walk: Bi;
  hereToday: Bi;
  scroll: Bi;
  arrivalTime: Bi;
  classTime: Bi;
  classKicker: Bi;
  classPrompt: Bi;
  classNote: Bi;
  classHint: Bi;
  keyIdeas: Bi;
  curriculumLink: Bi;
  arriveTime: Bi;
  arriveKicker: Bi;
  arrivePrompt: Bi;
  arriveNote: Bi;
  lunchTime: Bi;
  lunchKicker: Bi;
  lunchPrompt: Bi;
  lunchNote: Bi;
  lunchMap: Bi;
  lunchMapLink: Bi;
  openMaps: Bi;
  newTab: Bi;
  ferryMotif: Bi;
  clubsTime: Bi;
  clubsKicker: Bi;
  clubsPrompt: Bi;
  clubsNote: Bi;
  clubsAll: Bi;
  joinLabel: Bi;
  joinOpen: Bi;
  fnArrive: Bi;
  fnLunch: Bi;
  fnClub: Bi;
  betweenTime: Bi;
  betweenKicker: Bi;
  betweenLine: Bi;
  betweenBody: Bi;
  backTime: Bi;
  backKicker: Bi;
  backLine: Bi;
  backQuestions: Bi[];
  backNote: Bi;
  duskTime: Bi;
  duskKicker: Bi;
  duskLine: Bi;
  homeTime: Bi;
  homeKicker: Bi;
  homePrompt: Bi;
  homeNote: Bi;
  homeArrived: Bi;
  homeNext: Bi;
  homeMinutes: Bi;
  homeWeekend: Bi;
  homeClosed: Bi;
  evtWelcome: Bi;
  evtLead: Bi;
  evtProgramme: Bi;
  evtProgrammeTbc: Bi;
  evtFindRoom: Bi;
  evtExplore: Bi;
  evtAsk: Bi;
  arcHeadline: Bi;
  arcLead: Bi;
  dayTime: Bi;
  dayKicker: Bi;
  daySubtitle: Bi;
  dayEmpty: Bi;
  nameLabel: Bi;
  namePlaceholder: Bi;
  save: Bi;
  copy: Bi;
  copied: Bi;
  share: Bi;
  restart: Bi;
  inviteKicker: Bi;
  inviteHeadline: Bi;
  whenLabel: Bi;
  whereLabel: Bi;
  directions: Bi;
  programme: Bi;
  programmeNote: Bi;
  folioArrival: Bi;
  folioDay: Bi;
  cardChoiceCourse: Bi;
};

export const COPY: Copy = {
  eyebrow: { en: "BIR · Tha Prachan", th: "BIR · ท่าพระจันทร์" },
  event: { en: "Open House · 31 October", th: "Open House · 31 ตุลาคม" },
  headline: {
    en: "A degree is one part of the day.",
    th: "ปริญญาเป็นแค่ส่วนหนึ่งของวันหนึ่ง",
  },
  sub: {
    en: "Come and spend the rest of it with us.",
    th: "มาใช้เวลาที่เหลือของวันด้วยกันสิ",
  },
  walk: { en: "Walk through a day", th: "ลองเดินดูสักวันที่นี่" },
  hereToday: { en: "I’m here at Open House", th: "ฉันอยู่ที่งาน Open House" },
  scroll: { en: "Scroll to begin", th: "เลื่อนลงเพื่อเริ่ม" },
  arrivalTime: { en: "08:42", th: "08:42" },
  classTime: { en: "09:15", th: "09:15" },
  classKicker: { en: "First class", th: "คาบแรก" },
  classPrompt: { en: "What would you sit in on?", th: "อยากลองเข้าเรียนวิชาไหน" },
  classNote: {
    en: "Six of the things people study here. Sit in on one, and it stays with your day.",
    th: "หกวิชาที่คนที่นี่เรียนกัน ลองเข้าไปนั่งเรียนสักวิชา แล้วมันจะติดอยู่กับวันของคุณ",
  },
  classHint: {
    en: "Pick a class to sit in on",
    th: "เลือกวิชาที่อยากเข้าไปนั่งเรียน",
  },
  keyIdeas: { en: "Ideas you'd meet", th: "แนวคิดที่จะได้เจอ" },
  curriculumLink: {
    en: "See the full BIR curriculum",
    th: "ดูหลักสูตร BIR แบบเต็ม",
  },
  arriveTime: { en: "08:42", th: "08:42" },
  arriveKicker: { en: "Getting there", th: "การเดินทางมา" },
  arrivePrompt: { en: "How would you get here?", th: "คุณจะเดินทางมายังไง" },
  arriveNote: {
    en: "Tha Prachan sits right on the river in the old city. People arrive one of a few ways.",
    th: "ท่าพระจันทร์อยู่ริมแม่น้ำในย่านเมืองเก่า คนที่นี่มากันอยู่ไม่กี่ทาง",
  },
  lunchTime: { en: "12:07", th: "12:07" },
  lunchKicker: { en: "Fifty-three minutes for lunch", th: "มีเวลากินข้าวห้าสิบสามนาที" },
  lunchPrompt: {
    en: "Your next class is at 13:00. Where are we going?",
    th: "คาบต่อไปบ่ายโมง จะไปกินที่ไหนดี",
  },
  lunchNote: {
    en: "Not far, and back before the bell. A couple of directions, a few real places.",
    th: "ไม่ไกล กลับทันเข้าเรียน มีสองทางให้เลือก กับร้านจริงไม่กี่ร้าน",
  },
  lunchMap: {
    en: "BIRSA keeps a much larger student map of Tha Prachan, Wang Lang and Pinklao.",
    th: "BIRSA มีแผนที่นักศึกษาที่ใหญ่กว่านี้มาก ทั้งท่าพระจันทร์ วังหลัง และปิ่นเกล้า",
  },
  lunchMapLink: { en: "Explore student life", th: "ดูชีวิตนักศึกษาเพิ่มเติม" },
  openMaps: { en: "Open in Maps", th: "เปิดในแผนที่" },
  newTab: { en: "opens in a new tab", th: "เปิดในแท็บใหม่" },
  ferryMotif: { en: "the river again", th: "แม่น้ำอีกครั้ง" },
  clubsTime: { en: "16:34", th: "16:34" },
  clubsKicker: { en: "Class is over", th: "เลิกเรียนแล้ว" },
  clubsPrompt: { en: "Class is done. Where do you go?", th: "เลิกเรียนแล้ว จะไปไหนต่อ" },
  clubsNote: {
    en: "BIR runs a wall of student clubs — different things, different people. Open one.",
    th: "BIR มีชมรมนักศึกษาเต็มไปหมด แต่ละชมรมต่างกันทั้งกิจกรรมและผู้คน ลองเปิดดูสักชมรม",
  },
  clubsAll: { en: "See all BIR clubs", th: "ดูชมรม BIR ทั้งหมด" },
  joinLabel: { en: "Joining", th: "การเข้าร่วม" },
  joinOpen: { en: "Open to join", th: "เปิดรับสมาชิก" },
  fnArrive: { en: "Arrived by", th: "มาถึงโดย" },
  fnLunch: { en: "Lunch", th: "มื้อกลางวัน" },
  fnClub: { en: "Then", th: "แล้วก็" },
  betweenTime: { en: "10:47", th: "10:47" },
  betweenKicker: { en: "Between classes", th: "ช่วงว่างระหว่างคาบ" },
  betweenLine: {
    en: "There is a lot of university in the hours that aren't on a timetable.",
    th: "มหาวิทยาลัยมีอะไรอยู่เยอะในชั่วโมงที่ไม่มีอยู่ในตารางเรียน",
  },
  betweenBody: {
    en: "A coffee on the way to the next building. Printing something too close to a deadline. Someone you know, on the steps by the river. Most of it never makes the prospectus.",
    th: "กาแฟแก้วหนึ่งระหว่างเดินไปตึกถัดไป งานที่ปรินต์เอาตอนใกล้เดดไลน์ คนรู้จักสักคนที่บันไดริมน้ำ เรื่องพวกนี้ส่วนใหญ่ไม่เคยอยู่ในโบรชัวร์",
  },
  backTime: { en: "13:23", th: "13:23" },
  backKicker: { en: "Back to class", th: "กลับเข้าเรียน" },
  backLine: {
    en: "The afternoon seminar is quieter, and it turns over questions like these.",
    th: "คาบสัมมนาช่วงบ่ายจะเงียบกว่า และมักวนอยู่กับคำถามทำนองนี้",
  },
  backQuestions: [
    {
      en: "Who gets to define security, and for whom?",
      th: "ใครเป็นคนนิยามความมั่นคง และเพื่อใคร",
    },
    {
      en: "When does domestic politics become foreign policy?",
      th: "การเมืองในประเทศกลายเป็นนโยบายต่างประเทศตอนไหน",
    },
    {
      en: "What does international law actually constrain?",
      th: "จริง ๆ แล้วกฎหมายระหว่างประเทศจำกัดอะไรได้บ้าง",
    },
  ],
  backNote: {
    en: "No single answer, which is rather the point.",
    th: "ไม่มีคำตอบเดียว ซึ่งนั่นแหละคือประเด็น",
  },
  duskTime: { en: "17:48", th: "17:48" },
  duskKicker: { en: "The campus changes", th: "เมื่อคณะเปลี่ยนไป" },
  duskLine: {
    en: "Some days end when class does. Some don't.",
    th: "บางวันจบลงตอนเลิกเรียน บางวันไม่จบ",
  },
  homeTime: { en: "18:11", th: "18:11" },
  homeKicker: { en: "Getting home", th: "เดินทางกลับ" },
  homePrompt: {
    en: "The last of the light, and the way back.",
    th: "แสงสุดท้ายของวัน กับทางกลับบ้าน",
  },
  homeNote: {
    en: "Scheduled departures from the Tha Prachan campus, weekdays. A timetable, not live tracking.",
    th: "เวลาออกรถตามตารางจากท่าพระจันทร์ เฉพาะวันธรรมดา เป็นตารางเวลา ไม่ใช่การติดตามแบบเรียลไทม์",
  },
  homeArrived: { en: "This morning you came by", th: "เมื่อเช้าคุณมาโดย" },
  homeNext: { en: "Next scheduled departure", th: "รอบออกถัดไปตามตาราง" },
  homeMinutes: { en: "min", th: "นาที" },
  homeWeekend: { en: "No service at weekends", th: "วันหยุดสุดสัปดาห์ไม่มีบริการ" },
  homeClosed: { en: "Finished for the day", th: "หมดรอบของวันแล้ว" },
  evtWelcome: { en: "You’re here. Welcome.", th: "คุณมาถึงแล้ว ยินดีต้อนรับ" },
  evtLead: {
    en: "Open House is on today. Here is what is useful while you're on campus.",
    th: "วันนี้มีงาน Open House นี่คือสิ่งที่น่าจะมีประโยชน์ระหว่างอยู่ในคณะ",
  },
  evtProgramme: { en: "Today’s programme", th: "กำหนดการวันนี้" },
  evtProgrammeTbc: {
    en: "The full programme is being confirmed. Times and rooms will appear here closer to the day.",
    th: "กำหนดการฉบับเต็มกำลังยืนยัน เวลาและห้องจะขึ้นตรงนี้เมื่อใกล้ถึงวันงาน",
  },
  evtFindRoom: { en: "Find the room", th: "หาห้อง" },
  evtExplore: { en: "Explore BIR", th: "สำรวจ BIR" },
  evtAsk: { en: "Ask a BIR student", th: "ถามรุ่นพี่ BIR" },
  arcHeadline: {
    en: "Open House has ended. BIR is still here.",
    th: "Open House จบไปแล้ว แต่ BIR ยังอยู่ตรงนี้",
  },
  arcLead: {
    en: "You can still walk the day, and everything it points to is open all year.",
    th: "คุณยังลองเดินดูทั้งวันได้ และทุกอย่างที่มันพาไปก็เปิดให้ดูได้ตลอดทั้งปี",
  },
  dayTime: { en: "Your day", th: "วันของคุณ" },
  dayKicker: { en: "Your day", th: "วันของคุณ" },
  daySubtitle: { en: "A day you tried on", th: "วันหนึ่งที่คุณได้ลองใช้" },
  dayEmpty: {
    en: "Make a choice above and it will gather here.",
    th: "เลือกด้านบนสักอย่าง แล้วมันจะมารวมกันตรงนี้",
  },
  nameLabel: { en: "Add your name (optional)", th: "ใส่ชื่อก็ได้ ถ้าอยากใส่" },
  namePlaceholder: { en: "Your name", th: "ชื่อของคุณ" },
  save: { en: "Save card", th: "บันทึกการ์ด" },
  copy: { en: "Copy link", th: "คัดลอกลิงก์" },
  copied: { en: "Link copied", th: "คัดลอกลิงก์แล้ว" },
  share: { en: "Share", th: "แชร์" },
  restart: { en: "Start the day again", th: "เริ่มวันใหม่อีกครั้ง" },
  inviteKicker: { en: "31 October", th: "31 ตุลาคม" },
  inviteHeadline: {
    en: "Come and see it without the screen.",
    th: "มาดูของจริงโดยไม่ต้องผ่านหน้าจอ",
  },
  whenLabel: { en: "When", th: "เมื่อไหร่" },
  whereLabel: { en: "Where", th: "ที่ไหน" },
  directions: { en: "Directions", th: "เส้นทาง" },
  programme: { en: "Official BIR programme", th: "ข้อมูลหลักสูตร BIR อย่างเป็นทางการ" },
  programmeNote: {
    en: "Admissions and programme details are handled by the Faculty, not BIRSA.",
    th: "เรื่องการรับเข้าและรายละเอียดหลักสูตรเป็นของคณะ ไม่ใช่ BIRSA",
  },
  folioArrival: { en: "Arrival", th: "มาถึง" },
  folioDay: { en: "Your day", th: "วันของคุณ" },
  cardChoiceCourse: { en: "Sat in on", th: "เข้าเรียน" },
};

export function t(bi: Bi, locale: Locale): string {
  return bi[locale];
}
