/**
 * The site's single record of what personal data it handles.
 *
 * Three pages render from this file and nothing else: the privacy notice
 * (/privacy), the cookies page (/privacy/cookies), and the record of
 * processing activities (/privacy/processing-record) that section 39 of the
 * Personal Data Protection Act B.E. 2562 requires a controller to keep where
 * a data subject and the PDPC can inspect it. Keeping one register rather
 * than three hand-written pages is the point: a notice that disagrees with
 * the code is worse than no notice, and three prose pages drift apart within
 * a term.
 *
 * `RETENTION_YEARS` is imported by lib/privacy/retention.ts, the job that
 * actually deletes expired data. The period this file promises and the period
 * the database enforces are therefore the same number, which is what section
 * 37(3) asks for: not a stated period, but a system that checks and deletes
 * when the period runs out.
 */
import type { Locale } from "@/lib/i18n";

export type LocalizedText = Record<Locale, string>;

/**
 * BIRSA's retention period, fixed by the committee at two years for every
 * category of personal data. Deliberately one number rather than a schedule:
 * a student association turns its committee over annually, and a per-category
 * schedule nobody remembers is not a retention policy.
 */
export const RETENTION_YEARS = 2;

/**
 * When the clock starts. For a loan this is the day the loan closes, not the
 * day it opens, so an open loan is never purged out from under an officer who
 * still needs to get the equipment back.
 */
export type RetentionTrigger = "created" | "closed" | "last-active";

export type LawfulBasis = {
  /** The subsection of section 24 relied on, e.g. "24(3)". */
  section: string;
  label: LocalizedText;
};

/**
 * Section 24 permits collection without consent on these grounds. The site
 * relies on two of them and not on consent, which matters for more than
 * tidiness: Thai majority is twenty, so most first-year students are minors
 * whose consent would need a guardian under section 20. Resting the equipment
 * loan on contract necessity instead of consent removes that problem, and
 * stops a withdrawal of consent being able to erase a loan record while the
 * equipment is still out.
 */
export const BASIS_CONTRACT: LawfulBasis = {
  section: "24(3)",
  label: {
    en: "Necessary to do what you asked us to do, or to carry out an agreement with you",
    th: "จำเป็นเพื่อดำเนินการตามที่คุณร้องขอ หรือเพื่อปฏิบัติตามข้อตกลงที่มีกับคุณ",
  },
};

export const BASIS_LEGITIMATE_INTEREST: LawfulBasis = {
  section: "24(5)",
  label: {
    en: "Necessary for BIRSA's legitimate interests, weighed against your rights",
    th: "จำเป็นเพื่อประโยชน์โดยชอบด้วยกฎหมายของ BIRSA โดยชั่งน้ำหนักกับสิทธิของคุณแล้ว",
  },
};

export type StorageKind = "email" | "database" | "memory" | "none";

export type ProcessingActivity = {
  id: string;
  name: LocalizedText;
  /** Section 23(1): why we collect it. */
  purpose: LocalizedText;
  /** Section 24: what makes the collection lawful. */
  basis: LawfulBasis;
  /** Section 23(3), first half: the data collected. */
  collects: LocalizedText[];
  /**
   * Section 23(2): whether you have to give it, and what happens if you do
   * not. The current notice omits this item of the checklist entirely.
   */
  ifYouDoNot: LocalizedText;
  /** Section 23(4): processor ids from `processors` below. */
  recipients: string[];
  storage: StorageKind;
  retentionTrigger: RetentionTrigger;
  /** Set where the two-year rule needs a caveat, e.g. an open loan. */
  retentionNote?: LocalizedText;
};

export const activities: ProcessingActivity[] = [
  {
    id: "contact-message",
    name: { en: "Messages you send us", th: "ข้อความที่คุณส่งถึงเรา" },
    purpose: {
      en: "So a BIRSA officer can read your message and reply to you.",
      th: "เพื่อให้เจ้าหน้าที่ BIRSA อ่านข้อความของคุณและตอบกลับได้",
    },
    basis: BASIS_CONTRACT,
    collects: [
      { en: "Your name", th: "ชื่อของคุณ" },
      { en: "Your email address", th: "อีเมลของคุณ" },
      { en: "What you write in the message, including the subject you pick", th: "เนื้อความที่คุณเขียน รวมถึงหัวข้อที่คุณเลือก" },
    ],
    ifYouDoNot: {
      en: "You have to give a name and an email address, because without them we have no way to reply. Nothing else is required.",
      th: "คุณต้องกรอกชื่อและอีเมล เพราะหากไม่มี เราจะไม่มีช่องทางตอบกลับคุณ นอกจากนี้ไม่มีข้อมูลใดที่บังคับกรอก",
    },
    recipients: ["resend"],
    storage: "email",
    retentionTrigger: "created",
  },
  {
    id: "club-proposal",
    name: { en: "Proposals to start a club", th: "ข้อเสนอจัดตั้งชมรม" },
    purpose: {
      en: "So the committee can consider your proposal and get back to you about it.",
      th: "เพื่อให้คณะกรรมการพิจารณาข้อเสนอของคุณและติดต่อกลับ",
    },
    basis: BASIS_CONTRACT,
    collects: [
      { en: "Your name and email address", th: "ชื่อและอีเมลของคุณ" },
      { en: "The club name and what you want it to do", th: "ชื่อชมรมและสิ่งที่คุณต้องการให้ชมรมทำ" },
      { en: "Any other people you list as interested members", th: "รายชื่อผู้ที่คุณระบุว่าสนใจเข้าร่วม" },
    ],
    ifYouDoNot: {
      en: "The name, email address, club name and description are required, because the committee cannot consider a proposal without them. Listing other members is optional.",
      th: "ชื่อ อีเมล ชื่อชมรม และคำอธิบาย เป็นข้อมูลที่ต้องกรอก เพราะคณะกรรมการพิจารณาไม่ได้หากขาดข้อมูลเหล่านี้ ส่วนการระบุรายชื่อสมาชิกอื่นเป็นทางเลือก",
    },
    recipients: ["resend"],
    storage: "email",
    retentionTrigger: "created",
  },
  {
    id: "equipment-loan",
    name: { en: "Equipment loan requests", th: "คำขอยืมอุปกรณ์" },
    purpose: {
      en: "So an officer can decide on your request, hand the equipment over, and get it back.",
      th: "เพื่อให้เจ้าหน้าที่พิจารณาคำขอ ส่งมอบอุปกรณ์ และรับคืน",
    },
    basis: BASIS_CONTRACT,
    collects: [
      { en: "Your name", th: "ชื่อของคุณ" },
      { en: "Your Thammasat student ID", th: "รหัสนักศึกษาธรรมศาสตร์ของคุณ" },
      { en: "Your email address", th: "อีเมลของคุณ" },
      { en: "Your phone number, if you give one", th: "เบอร์โทรศัพท์ หากคุณกรอก" },
      { en: "The dates you want the equipment, and why", th: "วันที่คุณต้องการยืม และเหตุผล" },
      { en: "What condition the equipment was in when it went out and came back", th: "สภาพอุปกรณ์ตอนส่งมอบและตอนรับคืน" },
    ],
    ifYouDoNot: {
      en: "We need your name, student ID, email address and dates. Without the student ID we cannot check your loan limit, and without an email address we cannot tell you the decision, so we cannot take the request. Your phone number and your reason are optional, though a reason helps an officer decide.",
      th: "เราจำเป็นต้องมีชื่อ รหัสนักศึกษา อีเมล และวันที่ หากไม่มีรหัสนักศึกษา เราตรวจสอบโควตาการยืมของคุณไม่ได้ และหากไม่มีอีเมล เราแจ้งผลให้คุณไม่ได้ จึงรับคำขอไว้ไม่ได้ ส่วนเบอร์โทรศัพท์และเหตุผลเป็นทางเลือก แม้เหตุผลจะช่วยให้เจ้าหน้าที่ตัดสินใจได้ง่ายขึ้น",
    },
    recipients: ["resend", "vercel-postgres"],
    storage: "database",
    retentionTrigger: "closed",
    retentionNote: {
      en: "The two years run from the day the loan closes, not the day you ask. A loan that is still open is never deleted.",
      th: "ระยะเวลาสองปีเริ่มนับจากวันที่รายการยืมสิ้นสุด ไม่ใช่วันที่คุณยื่นคำขอ รายการที่ยังไม่สิ้นสุดจะไม่ถูกลบ",
    },
  },
  {
    id: "borrower-record",
    name: { en: "Borrower records", th: "ข้อมูลผู้ยืม" },
    purpose: {
      en: "So we can see someone's loan history, hold them to a sensible number of loans at once, and block a borrower who does not return equipment.",
      th: "เพื่อให้เราเห็นประวัติการยืม จำกัดจำนวนรายการที่ยืมพร้อมกันได้ตามสมควร และระงับสิทธิผู้ที่ไม่คืนอุปกรณ์",
    },
    basis: BASIS_LEGITIMATE_INTEREST,
    collects: [
      { en: "Your name, student ID, email address and phone number", th: "ชื่อ รหัสนักศึกษา อีเมล และเบอร์โทรศัพท์ของคุณ" },
      { en: "How many loans you may hold at once", th: "จำนวนรายการที่คุณยืมพร้อมกันได้" },
      { en: "Whether you are blocked, and the reason an officer recorded", th: "สถานะการถูกระงับสิทธิ และเหตุผลที่เจ้าหน้าที่บันทึกไว้" },
    ],
    ifYouDoNot: {
      en: "This record is built from what you give us when you request a loan. There is nothing separate to fill in.",
      th: "ข้อมูลนี้สร้างจากสิ่งที่คุณกรอกตอนขอยืมอุปกรณ์ ไม่มีแบบฟอร์มแยกให้กรอกเพิ่ม",
    },
    recipients: ["vercel-postgres"],
    storage: "database",
    retentionTrigger: "last-active",
  },
  {
    id: "loan-status",
    name: { en: "Checking a loan you already made", th: "การตรวจสอบรายการยืมที่มีอยู่" },
    purpose: {
      en: "So you can look up or cancel your own request without asking an officer.",
      th: "เพื่อให้คุณตรวจสอบหรือยกเลิกคำขอของตัวเองได้โดยไม่ต้องติดต่อเจ้าหน้าที่",
    },
    basis: BASIS_CONTRACT,
    collects: [
      { en: "Your reference number and the email address you used", th: "หมายเลขอ้างอิงและอีเมลที่คุณใช้ยื่นคำขอ" },
    ],
    ifYouDoNot: {
      en: "Both are required. They are how we check the loan is yours before showing it to you.",
      th: "ต้องกรอกทั้งสองอย่าง เพราะเป็นวิธีที่เราใช้ยืนยันว่ารายการนั้นเป็นของคุณก่อนแสดงข้อมูล",
    },
    recipients: ["vercel-postgres"],
    storage: "none",
    retentionTrigger: "created",
    retentionNote: {
      en: "Looking something up does not create a new record. Nothing is stored beyond the loan itself.",
      th: "การตรวจสอบไม่ได้สร้างข้อมูลใหม่ ไม่มีการเก็บสิ่งใดเพิ่มเติมนอกจากตัวรายการยืมเอง",
    },
  },
  {
    id: "feedback",
    name: { en: "Page feedback", th: "ความคิดเห็นเกี่ยวกับหน้าเว็บ" },
    purpose: {
      en: "So we can tell which pages work and which do not.",
      th: "เพื่อให้เรารู้ว่าหน้าไหนใช้งานได้ดีและหน้าไหนยังไม่ดี",
    },
    basis: BASIS_LEGITIMATE_INTEREST,
    collects: [
      { en: "Whether you found the page useful", th: "ว่าคุณเห็นว่าหน้านั้นมีประโยชน์หรือไม่" },
      { en: "Anything you type in the comment box", th: "ข้อความที่คุณพิมพ์ในช่องความคิดเห็น" },
      { en: "Which page you were on, and whether you were reading in Thai or English", th: "หน้าที่คุณอยู่ และภาษาที่คุณกำลังอ่าน" },
    ],
    ifYouDoNot: {
      en: "Feedback is entirely optional. We do not ask for your name, your email address or anything else that identifies you, so please do not type those into the comment box.",
      th: "การให้ความคิดเห็นเป็นทางเลือกทั้งหมด เราไม่ได้ขอชื่อ อีเมล หรือสิ่งใดที่ระบุตัวคุณ จึงขอความกรุณาอย่าพิมพ์ข้อมูลเหล่านั้นลงในช่องความคิดเห็น",
    },
    recipients: ["vercel-postgres"],
    storage: "database",
    retentionTrigger: "created",
  },
  {
    id: "rights-request",
    name: { en: "Requests about your own data", th: "คำร้องเกี่ยวกับข้อมูลของคุณเอง" },
    purpose: {
      en: "So we can find your data, act on your request, and prove we answered it in time.",
      th: "เพื่อให้เราค้นหาข้อมูลของคุณ ดำเนินการตามคำร้อง และแสดงได้ว่าเราตอบภายในกำหนด",
    },
    basis: BASIS_CONTRACT,
    collects: [
      { en: "Your name and email address", th: "ชื่อและอีเมลของคุณ" },
      { en: "Which right you are using, and anything you tell us to help us find your data", th: "สิทธิที่คุณต้องการใช้ และข้อมูลที่คุณแจ้งเพื่อช่วยให้เราค้นหาข้อมูลของคุณเจอ" },
    ],
    ifYouDoNot: {
      en: "We need a name and an email address to answer you and to be reasonably sure the request is really yours.",
      th: "เราจำเป็นต้องมีชื่อและอีเมลเพื่อตอบกลับคุณ และเพื่อให้มั่นใจตามสมควรว่าคำร้องนั้นเป็นของคุณจริง",
    },
    recipients: ["resend"],
    storage: "email",
    retentionTrigger: "created",
  },
  {
    id: "officer-account",
    name: { en: "BIRSA officer accounts", th: "บัญชีเจ้าหน้าที่ BIRSA" },
    purpose: {
      en: "So the people who run the equipment service can sign in, and so each action has a name against it.",
      th: "เพื่อให้ผู้ดูแลบริการยืมอุปกรณ์เข้าสู่ระบบได้ และเพื่อให้ทุกการกระทำมีชื่อผู้รับผิดชอบกำกับ",
    },
    basis: BASIS_CONTRACT,
    collects: [
      { en: "The officer's name, email address and role", th: "ชื่อ อีเมล และบทบาทของเจ้าหน้าที่" },
      { en: "A scrambled form of their passcode, which cannot be turned back into the passcode", th: "รหัสผ่านในรูปแบบที่เข้ารหัสแล้ว ซึ่งย้อนกลับเป็นรหัสเดิมไม่ได้" },
      { en: "When they last signed in", th: "เวลาที่เข้าสู่ระบบครั้งล่าสุด" },
    ],
    ifYouDoNot: {
      en: "This only applies to BIRSA officers. An officer who does not want an account cannot run the equipment service.",
      th: "ใช้กับเจ้าหน้าที่ BIRSA เท่านั้น เจ้าหน้าที่ที่ไม่ต้องการมีบัญชีจะดูแลบริการยืมอุปกรณ์ไม่ได้",
    },
    recipients: ["vercel-postgres"],
    storage: "database",
    retentionTrigger: "last-active",
    retentionNote: {
      en: "After two years without signing in, an officer's name and email address are overwritten. The record itself stays, because the log of who approved which loan would otherwise lose its meaning.",
      th: "หากไม่เข้าสู่ระบบเป็นเวลาสองปี ชื่อและอีเมลของเจ้าหน้าที่จะถูกเขียนทับ ตัวรายการยังคงอยู่ เพราะมิฉะนั้นบันทึกว่าใครอนุมัติรายการยืมใดจะไม่มีความหมาย",
    },
  },
  {
    id: "audit-log",
    name: { en: "Log of officer actions", th: "บันทึกการกระทำของเจ้าหน้าที่" },
    purpose: {
      en: "So that if something goes wrong with an item or a loan, we can see who did what and when.",
      th: "เพื่อให้เมื่อเกิดปัญหากับอุปกรณ์หรือรายการยืม เราตรวจสอบได้ว่าใครทำอะไรเมื่อใด",
    },
    basis: BASIS_LEGITIMATE_INTEREST,
    collects: [
      { en: "Which officer acted, what they did, and when", th: "เจ้าหน้าที่คนใด ทำอะไร และเมื่อใด" },
      { en: "Which item, loan or record they acted on", th: "อุปกรณ์ รายการยืม หรือข้อมูลที่ถูกดำเนินการ" },
    ],
    ifYouDoNot: {
      en: "This is written automatically when an officer acts. It records officers, not visitors, and it does not record your IP address or your browser.",
      th: "ระบบบันทึกโดยอัตโนมัติเมื่อเจ้าหน้าที่ดำเนินการ บันทึกเฉพาะเจ้าหน้าที่ ไม่ใช่ผู้เข้าชม และไม่บันทึกหมายเลข IP หรือเบราว์เซอร์ของคุณ",
    },
    recipients: ["vercel-postgres"],
    storage: "database",
    retentionTrigger: "created",
  },
  {
    id: "rate-limiting",
    name: { en: "Stopping form abuse", th: "การป้องกันการใช้แบบฟอร์มในทางที่ผิด" },
    purpose: {
      en: "So one person cannot flood a form with hundreds of submissions.",
      th: "เพื่อไม่ให้ผู้ใดส่งแบบฟอร์มซ้ำจำนวนมากจนระบบล่ม",
    },
    basis: BASIS_LEGITIMATE_INTEREST,
    collects: [
      { en: "Your IP address, and a count of how many times you submitted a form recently", th: "หมายเลข IP ของคุณ และจำนวนครั้งที่คุณส่งแบบฟอร์มในช่วงที่ผ่านมา" },
    ],
    ifYouDoNot: {
      en: "This happens automatically on every form. There is no way to turn it off, and no way to use the forms without it.",
      th: "ระบบทำงานอัตโนมัติกับทุกแบบฟอร์ม ไม่มีวิธีปิด และใช้แบบฟอร์มโดยไม่ผ่านขั้นตอนนี้ไม่ได้",
    },
    recipients: [],
    storage: "memory",
    retentionTrigger: "created",
    retentionNote: {
      en: "Held in the server's memory for ten minutes and never written to a database. It disappears sooner if the server restarts.",
      th: "เก็บไว้ในหน่วยความจำของเซิร์ฟเวอร์เป็นเวลาสิบนาที ไม่เคยบันทึกลงฐานข้อมูล และจะหายไปเร็วกว่านั้นหากเซิร์ฟเวอร์รีสตาร์ท",
    },
  },
];

export type Processor = {
  id: string;
  name: string;
  role: LocalizedText;
  /** Where the processing happens, for the section 28 analysis. */
  country: LocalizedText;
  outsideThailand: boolean;
  receives: LocalizedText;
};

export const processors: Processor[] = [
  {
    id: "resend",
    name: "Resend",
    role: { en: "Delivers every email this site sends", th: "ส่งอีเมลทุกฉบับที่เว็บไซต์นี้ส่งออก" },
    country: { en: "United States", th: "สหรัฐอเมริกา" },
    outsideThailand: true,
    receives: {
      en: "Your name, email address, and anything in the message. For a loan, also your student ID, phone number, dates and reason.",
      th: "ชื่อ อีเมล และเนื้อความของคุณ กรณีการยืมอุปกรณ์ รวมถึงรหัสนักศึกษา เบอร์โทรศัพท์ วันที่ และเหตุผลด้วย",
    },
  },
  {
    id: "vercel-hosting",
    name: "Vercel",
    role: { en: "Hosts the site and serves every page", th: "โฮสต์เว็บไซต์และให้บริการทุกหน้า" },
    country: { en: "United States", th: "สหรัฐอเมริกา" },
    outsideThailand: true,
    receives: {
      en: "Ordinary web server records of each request, which include your IP address. BIRSA does not add anything to these and does not use them to identify anyone.",
      th: "บันทึกคำขอของเซิร์ฟเวอร์ตามปกติ ซึ่งรวมถึงหมายเลข IP ของคุณ BIRSA ไม่ได้เพิ่มข้อมูลใดลงในบันทึกนี้ และไม่ได้ใช้เพื่อระบุตัวบุคคล",
    },
  },
  {
    id: "vercel-postgres",
    name: "Vercel Postgres",
    role: { en: "The database behind the equipment loan service", th: "ฐานข้อมูลเบื้องหลังบริการยืมอุปกรณ์" },
    country: { en: "United States", th: "สหรัฐอเมริกา" },
    outsideThailand: true,
    receives: {
      en: "Loan and borrower records, officer accounts, the log of officer actions, and page feedback.",
      th: "รายการยืมและข้อมูลผู้ยืม บัญชีเจ้าหน้าที่ บันทึกการกระทำของเจ้าหน้าที่ และความคิดเห็นเกี่ยวกับหน้าเว็บ",
    },
  },
  {
    id: "vercel-blob",
    name: "Vercel Blob",
    role: { en: "Stores photographs of equipment", th: "เก็บรูปถ่ายอุปกรณ์" },
    country: { en: "United States", th: "สหรัฐอเมริกา" },
    outsideThailand: true,
    receives: {
      en: "Photographs of equipment that officers upload. No personal data.",
      th: "รูปถ่ายอุปกรณ์ที่เจ้าหน้าที่อัปโหลด ไม่มีข้อมูลส่วนบุคคล",
    },
  },
  {
    id: "openstreetmap",
    name: "OpenStreetMap",
    role: { en: "Supplies the map tiles on the places pages", th: "ให้บริการภาพแผนที่ในหน้าสถานที่" },
    country: { en: "United Kingdom", th: "สหราชอาณาจักร" },
    outsideThailand: true,
    receives: {
      en: "If you open a page with a map, your browser fetches the map images directly from OpenStreetMap, so they see your IP address. BIRSA sends them nothing else.",
      th: "หากคุณเปิดหน้าที่มีแผนที่ เบราว์เซอร์ของคุณจะดึงภาพแผนที่จาก OpenStreetMap โดยตรง ทำให้ผู้ให้บริการเห็นหมายเลข IP ของคุณ BIRSA ไม่ได้ส่งข้อมูลอื่นใดให้",
    },
  },
  {
    id: "google-forms",
    name: "Google Forms",
    role: { en: "Some club sign-up forms are Google Forms shown inside a page here", th: "แบบฟอร์มสมัครของบางชมรมเป็น Google Form ที่แสดงอยู่ในหน้าเว็บนี้" },
    country: { en: "United States", th: "สหรัฐอเมริกา" },
    outsideThailand: true,
    receives: {
      en: "Whatever you type into that form goes straight to Google and to whoever set the form up. It does not pass through this site, and BIRSA cannot see it or delete it for you.",
      th: "สิ่งที่คุณกรอกในแบบฟอร์มนั้นจะส่งตรงไปยัง Google และผู้สร้างแบบฟอร์ม ไม่ได้ผ่านเว็บไซต์นี้ BIRSA จึงไม่เห็นข้อมูลนั้นและลบให้คุณไม่ได้",
    },
  },
];

export type CookieRecord = {
  name: string;
  purpose: LocalizedText;
  expires: LocalizedText;
  /** Every cookie here is strictly necessary, which is why there is no banner. */
  essential: true;
};

/**
 * All six cookies, not just the language one. The previous notice named only
 * NEXT_LOCALE, which was wrong in a way a reader could check for themselves.
 *
 * None of these are tracking or advertising cookies, and none are optional in
 * the sense the GOV.UK cookie banner guidance means: each is needed for a
 * thing the reader asked for. That is why the site has no cookie banner. The
 * guidance is that you should not interrupt people to ask consent for cookies
 * you would set anyway.
 */
export const cookieRecords: CookieRecord[] = [
  {
    name: "NEXT_LOCALE",
    purpose: {
      en: "Remembers whether you last read the site in Thai or English, so we do not ask again.",
      th: "จดจำว่าครั้งล่าสุดคุณอ่านเว็บไซต์เป็นภาษาไทยหรืออังกฤษ เพื่อไม่ต้องถามซ้ำ",
    },
    expires: { en: "One year", th: "หนึ่งปี" },
    essential: true,
  },
  {
    name: "birsa_contact_draft",
    purpose: {
      en: "Holds your answers as you move between the pages of the contact form, so going back does not lose them.",
      th: "เก็บคำตอบของคุณระหว่างเปลี่ยนหน้าในแบบฟอร์มติดต่อ เพื่อไม่ให้ข้อมูลหายเมื่อย้อนกลับ",
    },
    expires: { en: "Thirty minutes", th: "สามสิบนาที" },
    essential: true,
  },
  {
    name: "birsa_start_club_draft",
    purpose: {
      en: "The same, for the start-a-club form.",
      th: "ทำหน้าที่เดียวกัน สำหรับแบบฟอร์มเสนอจัดตั้งชมรม",
    },
    expires: { en: "Thirty minutes", th: "สามสิบนาที" },
    essential: true,
  },
  {
    name: "birsa_loan_request_draft",
    purpose: {
      en: "The same, for an equipment loan request.",
      th: "ทำหน้าที่เดียวกัน สำหรับคำขอยืมอุปกรณ์",
    },
    expires: { en: "Thirty minutes", th: "สามสิบนาที" },
    essential: true,
  },
  {
    name: "birsa_loan_status_draft",
    purpose: {
      en: "The same, for looking up a loan you already made.",
      th: "ทำหน้าที่เดียวกัน สำหรับการตรวจสอบรายการยืมที่มีอยู่",
    },
    expires: { en: "Thirty minutes", th: "สามสิบนาที" },
    essential: true,
  },
  {
    name: "birsa_rights_draft",
    purpose: {
      en: "The same, for a request about your own data.",
      th: "ทำหน้าที่เดียวกัน สำหรับคำร้องเกี่ยวกับข้อมูลของคุณเอง",
    },
    expires: { en: "Thirty minutes", th: "สามสิบนาที" },
    essential: true,
  },
  {
    name: "birsa_inventory",
    purpose: {
      en: "Keeps a BIRSA officer signed in to the equipment console. Only ever set for officers, never for ordinary visitors.",
      th: "รักษาสถานะการเข้าสู่ระบบของเจ้าหน้าที่ BIRSA ในระบบจัดการอุปกรณ์ ตั้งค่าเฉพาะกับเจ้าหน้าที่ ไม่เคยตั้งกับผู้เข้าชมทั่วไป",
    },
    expires: { en: "Twelve hours", th: "สิบสองชั่วโมง" },
    essential: true,
  },
];

export type BrowserStorageRecord = {
  key: string;
  purpose: LocalizedText;
};

/**
 * Not cookies, but the GOV.UK guidance is explicit that local storage counts
 * as something you have to tell people about. Neither of these ever leaves
 * the reader's device.
 */
export const browserStorage: BrowserStorageRecord[] = [
  {
    key: "birsa-theme",
    purpose: {
      en: "Remembers that you chose light or dark mode. Only set if you use the toggle.",
      th: "จดจำว่าคุณเลือกโหมดสว่างหรือมืด ตั้งค่าเมื่อคุณกดปุ่มสลับเท่านั้น",
    },
  },
  {
    key: "birsa-onboarding-*",
    purpose: {
      en: "Remembers which tasks you ticked off on the step-by-step pages, one key per track. We never see this.",
      th: "จดจำรายการที่คุณติ๊กในหน้าทีละขั้นตอน โดยแยกคีย์ตามแต่ละเส้นทาง เราไม่เห็นข้อมูลนี้",
    },
  },
];

/**
 * Sections 30 to 36 and 73, in the order a reader is likely to want them
 * rather than the order the Act puts them in. Each `id` is also the value the
 * /privacy/your-data journey submits, so the request that reaches BIRSA names
 * the section it is made under.
 */
export type DataRight = {
  id: string;
  section: string;
  name: LocalizedText;
  description: LocalizedText;
};

export const dataRights: DataRight[] = [
  {
    id: "access",
    section: "30",
    name: { en: "See what we hold about you", th: "ขอดูข้อมูลที่เราเก็บเกี่ยวกับคุณ" },
    description: {
      en: "Ask us what personal data we hold about you, get a copy of it, and ask how we got it.",
      th: "ขอทราบว่าเราเก็บข้อมูลส่วนบุคคลใดของคุณไว้ ขอสำเนา และขอทราบว่าเราได้ข้อมูลนั้นมาอย่างไร",
    },
  },
  {
    id: "portability",
    section: "31",
    name: { en: "Get your data in a reusable format", th: "ขอรับข้อมูลในรูปแบบที่นำไปใช้ต่อได้" },
    description: {
      en: "Ask for your data in a format you or another organisation can read with a computer.",
      th: "ขอรับข้อมูลของคุณในรูปแบบที่คุณหรือองค์กรอื่นอ่านได้ด้วยเครื่องคอมพิวเตอร์",
    },
  },
  {
    id: "correct",
    section: "35 and 36",
    name: { en: "Correct something that is wrong", th: "ขอแก้ไขข้อมูลที่ไม่ถูกต้อง" },
    description: {
      en: "Tell us to fix data that is wrong, out of date, incomplete or misleading.",
      th: "แจ้งให้เราแก้ไขข้อมูลที่ผิด ล้าสมัย ไม่ครบถ้วน หรือทำให้เข้าใจผิด",
    },
  },
  {
    id: "delete",
    section: "33",
    name: { en: "Have your data deleted", th: "ขอให้ลบข้อมูลของคุณ" },
    description: {
      en: "Ask us to delete or anonymise your data, for example when we no longer need it for the purpose we collected it.",
      th: "ขอให้เราลบหรือทำให้ข้อมูลของคุณไม่สามารถระบุตัวตนได้ เช่น เมื่อเราไม่จำเป็นต้องใช้ตามวัตถุประสงค์ที่เก็บมาแล้ว",
    },
  },
  {
    id: "object",
    section: "32",
    name: { en: "Object to what we are doing with it", th: "ขอคัดค้านการใช้ข้อมูลของคุณ" },
    description: {
      en: "Object to us collecting, using or disclosing your data where we rely on our legitimate interests.",
      th: "คัดค้านการเก็บ ใช้ หรือเปิดเผยข้อมูลของคุณ ในกรณีที่เราอาศัยฐานประโยชน์โดยชอบด้วยกฎหมาย",
    },
  },
  {
    id: "restrict",
    section: "34",
    name: { en: "Ask us to pause using it", th: "ขอให้ระงับการใช้ข้อมูล" },
    description: {
      en: "Ask us to hold your data but stop using it, for example while we look into a correction you asked for.",
      th: "ขอให้เราเก็บข้อมูลไว้แต่หยุดใช้งาน เช่น ระหว่างที่เรากำลังตรวจสอบการแก้ไขที่คุณขอ",
    },
  },
  {
    id: "withdraw",
    section: "19",
    name: { en: "Withdraw consent", th: "ขอถอนความยินยอม" },
    description: {
      en: "Where we ever rely on your consent, take it back. It is as easy to withdraw as it was to give, and withdrawing does not undo what was already done lawfully.",
      th: "ในกรณีที่เราอาศัยความยินยอมของคุณ คุณถอนคืนได้ การถอนทำได้ง่ายเท่ากับตอนให้ และไม่กระทบสิ่งที่ได้ดำเนินการไปแล้วโดยชอบ",
    },
  },
  {
    id: "complain",
    section: "73",
    name: { en: "Complain about us", th: "ขอร้องเรียนเกี่ยวกับเรา" },
    description: {
      en: "Complain to the Personal Data Protection Committee's expert committee if you think we have broken the law.",
      th: "ร้องเรียนต่อคณะกรรมการผู้เชี่ยวชาญของคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล หากคุณเห็นว่าเราทำผิดกฎหมาย",
    },
  },
];

/** Section 30 gives BIRSA thirty days to answer an access request. */
export const RIGHTS_RESPONSE_DAYS = 30;

/** Section 37(4) gives BIRSA seventy-two hours to report a breach to the PDPC. */
export const BREACH_NOTIFICATION_HOURS = 72;

export function activityById(id: string): ProcessingActivity | undefined {
  return activities.find((activity) => activity.id === id);
}

export function processorById(id: string): Processor | undefined {
  return processors.find((processor) => processor.id === id);
}
