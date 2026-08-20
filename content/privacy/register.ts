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
 *
 * On the two languages: the English follows the site's usual plain-language
 * standard, but the Thai is deliberately written in formal official register
 * (ท่าน rather than คุณ, BIRSA named as the actor rather than เรา) and reuses
 * the Act's own statutory vocabulary wherever the Act supplies it, for
 * example เก็บรวบรวม ใช้ หรือเปิดเผย, เจ้าของข้อมูลส่วนบุคคล, and
 * ผู้ควบคุมข้อมูลส่วนบุคคล. A privacy notice is a legal instrument that a
 * regulator may read, and Thai readers expect a document of that kind to
 * sound like one. Matching the Act's wording also removes any argument about
 * whether a translated paraphrase means the same thing as the statute.
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
    th: "ความจำเป็นเพื่อการปฏิบัติตามสัญญาซึ่งท่านเป็นคู่สัญญา หรือเพื่อดำเนินการตามคำขอของท่านก่อนเข้าทำสัญญานั้น",
  },
};

export const BASIS_LEGITIMATE_INTEREST: LawfulBasis = {
  section: "24(5)",
  label: {
    en: "Necessary for BIRSA's legitimate interests, weighed against your rights",
    th: "ความจำเป็นเพื่อประโยชน์โดยชอบด้วยกฎหมายของ BIRSA โดยได้ชั่งน้ำหนักกับสิทธิขั้นพื้นฐานในข้อมูลส่วนบุคคลของท่านแล้ว",
  },
};

/**
 * Section 19. The site relies on consent for exactly one thing, publishing a
 * photograph of an identifiable person, and it is worth being explicit about
 * why that one is different from everything else here.
 *
 * Nothing else on this site rests on consent, deliberately, for the reason
 * given above `BASIS_CONTRACT`: Thai majority is twenty, so most first year
 * students are minors, and section 20 makes a minor's consent the guardian's
 * to give. That reasoning does not disappear for photographs. It applies with
 * more force, because a photograph identifies someone for as long as it is
 * published and cannot be pseudonymised after the fact.
 *
 * So a photo consent record MUST capture whether the subject was twenty or
 * over at the time, and where they were not, that a guardian consented.
 * BIRSA cannot publish a recognisable photograph of a student under twenty on
 * the student's own say so, however willingly it is given.
 *
 * Consent is also withdrawable at any time under section 19 paragraph 5, which
 * is why `photo-consent` carries a takedown commitment rather than a retention
 * period alone. A photograph that cannot be removed quickly is a photograph
 * that should not have been published.
 */
export const BASIS_CONSENT: LawfulBasis = {
  section: "19",
  label: {
    en: "Your consent, which you can withdraw at any time",
    th: "ความยินยอมของท่าน ซึ่งท่านสามารถถอนได้ทุกเมื่อ",
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
    name: { en: "Messages you send us", th: "ข้อความที่ท่านส่งถึง BIRSA" },
    purpose: {
      en: "So a BIRSA officer can read your message and reply to you.",
      th: "เพื่อให้เจ้าหน้าที่ BIRSA พิจารณาข้อความของท่านและติดต่อกลับ",
    },
    basis: BASIS_CONTRACT,
    collects: [
      { en: "Your name", th: "ชื่อของท่าน" },
      { en: "Your email address", th: "ที่อยู่อีเมลของท่าน" },
      {
        en: "What you write in the message, including the subject you pick",
        th: "เนื้อหาข้อความที่ท่านกรอก รวมถึงหัวข้อเรื่องที่ท่านเลือก",
      },
    ],
    ifYouDoNot: {
      en: "You have to give a name and an email address, because without them we have no way to reply. Nothing else is required.",
      th: "ท่านต้องระบุชื่อและที่อยู่อีเมล เนื่องจาก BIRSA ไม่อาจติดต่อกลับได้หากไม่มีข้อมูลดังกล่าว ข้อมูลอื่นนอกเหนือจากนี้มิใช่ข้อมูลที่ต้องกรอก",
    },
    recipients: ["resend"],
    storage: "email",
    retentionTrigger: "created",
  },
  {
    id: "club-proposal",
    name: { en: "Proposals to start a club", th: "ข้อเสนอขอจัดตั้งชมรม" },
    purpose: {
      en: "So the committee can consider your proposal and get back to you about it.",
      th: "เพื่อให้คณะกรรมการพิจารณาข้อเสนอของท่านและแจ้งผลการพิจารณากลับ",
    },
    basis: BASIS_CONTRACT,
    collects: [
      { en: "Your name and email address", th: "ชื่อและที่อยู่อีเมลของท่าน" },
      { en: "The club name and what you want it to do", th: "ชื่อชมรมและวัตถุประสงค์ของชมรม" },
      {
        en: "Any other people you list as interested members",
        th: "รายชื่อผู้ที่ท่านระบุว่าประสงค์จะเข้าร่วม",
      },
    ],
    ifYouDoNot: {
      en: "The name, email address, club name and description are required, because the committee cannot consider a proposal without them. Listing other members is optional.",
      th: "ชื่อ ที่อยู่อีเมล ชื่อชมรม และคำอธิบายวัตถุประสงค์ เป็นข้อมูลที่ต้องกรอก เนื่องจากคณะกรรมการไม่อาจพิจารณาข้อเสนอได้หากขาดข้อมูลดังกล่าว ส่วนการระบุรายชื่อผู้ประสงค์จะเข้าร่วมเป็นทางเลือกของท่าน",
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
      th: "เพื่อให้เจ้าหน้าที่พิจารณาคำขอ ส่งมอบอุปกรณ์ และติดตามการส่งคืน",
    },
    basis: BASIS_CONTRACT,
    collects: [
      { en: "Your name", th: "ชื่อของท่าน" },
      {
        en: "Your Thammasat student ID",
        th: "รหัสนักศึกษามหาวิทยาลัยธรรมศาสตร์ของท่าน",
      },
      { en: "Your email address", th: "ที่อยู่อีเมลของท่าน" },
      {
        en: "Your phone number, if you give one",
        th: "หมายเลขโทรศัพท์ หากท่านประสงค์จะระบุ",
      },
      {
        en: "The dates you want the equipment, and why",
        th: "ช่วงวันที่ที่ท่านประสงค์จะยืม และเหตุผลในการยืม",
      },
      {
        en: "What condition the equipment was in when it went out and came back",
        th: "สภาพอุปกรณ์ ณ เวลาส่งมอบและเวลารับคืน",
      },
    ],
    ifYouDoNot: {
      en: "We need your name, student ID, email address and dates. Without the student ID we cannot check your loan limit, and without an email address we cannot tell you the decision, so we cannot take the request. Your phone number and your reason are optional, though a reason helps an officer decide.",
      th: "ท่านต้องระบุชื่อ รหัสนักศึกษา ที่อยู่อีเมล และช่วงวันที่ที่ประสงค์จะยืม หากไม่มีรหัสนักศึกษา BIRSA ไม่อาจตรวจสอบโควตาการยืมของท่านได้ และหากไม่มีที่อยู่อีเมล BIRSA ไม่อาจแจ้งผลการพิจารณาได้ จึงไม่อาจรับคำขอไว้พิจารณา ส่วนหมายเลขโทรศัพท์และเหตุผลในการยืมเป็นทางเลือก แม้การระบุเหตุผลจะเป็นประโยชน์ต่อการพิจารณาของเจ้าหน้าที่",
    },
    recipients: ["resend", "vercel-postgres"],
    storage: "database",
    retentionTrigger: "closed",
    retentionNote: {
      en: "The two years run from the day the loan closes, not the day you ask. A loan that is still open is never deleted.",
      th: "ระยะเวลาสองปีเริ่มนับจากวันที่รายการยืมสิ้นสุด มิใช่วันที่ท่านยื่นคำขอ รายการยืมที่ยังไม่สิ้นสุดจะไม่ถูกลบ",
    },
  },
  {
    id: "borrower-record",
    name: { en: "Borrower records", th: "ข้อมูลผู้ยืม" },
    purpose: {
      en: "So we can see someone's loan history, hold them to a sensible number of loans at once, and block a borrower who does not return equipment.",
      th: "เพื่อให้ BIRSA ตรวจสอบประวัติการยืม กำหนดจำนวนรายการที่ยืมพร้อมกันได้ตามสมควร และระงับสิทธิผู้ที่ไม่ส่งคืนอุปกรณ์",
    },
    basis: BASIS_LEGITIMATE_INTEREST,
    collects: [
      {
        en: "Your name, student ID, email address and phone number",
        th: "ชื่อ รหัสนักศึกษา ที่อยู่อีเมล และหมายเลขโทรศัพท์ของท่าน",
      },
      {
        en: "How many loans you may hold at once",
        th: "จำนวนรายการที่ท่านยืมพร้อมกันได้",
      },
      {
        en: "Whether you are blocked, and the reason an officer recorded",
        th: "สถานะการระงับสิทธิ และเหตุผลที่เจ้าหน้าที่บันทึกไว้",
      },
    ],
    ifYouDoNot: {
      en: "This record is built from what you give us when you request a loan. There is nothing separate to fill in.",
      th: "ข้อมูลนี้จัดทำขึ้นจากข้อมูลที่ท่านกรอกในการขอยืมอุปกรณ์ ท่านไม่ต้องกรอกแบบฟอร์มเพิ่มเติมแต่อย่างใด",
    },
    recipients: ["vercel-postgres"],
    storage: "database",
    retentionTrigger: "last-active",
  },
  {
    id: "loan-status",
    name: {
      en: "Checking a loan you already made",
      th: "การตรวจสอบสถานะรายการยืม",
    },
    purpose: {
      en: "So you can look up or cancel your own request without asking an officer.",
      th: "เพื่อให้ท่านตรวจสอบหรือยกเลิกคำขอของท่านเองได้ โดยไม่ต้องติดต่อเจ้าหน้าที่",
    },
    basis: BASIS_CONTRACT,
    collects: [
      {
        en: "Your reference number and the email address you used",
        th: "หมายเลขอ้างอิงและที่อยู่อีเมลที่ท่านใช้ในการยื่นคำขอ",
      },
    ],
    ifYouDoNot: {
      en: "Both are required. They are how we check the loan is yours before showing it to you.",
      th: "ท่านต้องระบุทั้งสองรายการ เนื่องจากเป็นวิธีการที่ BIRSA ใช้ตรวจสอบว่ารายการยืมดังกล่าวเป็นของท่านก่อนเปิดเผยข้อมูล",
    },
    recipients: ["vercel-postgres"],
    storage: "none",
    retentionTrigger: "created",
    retentionNote: {
      en: "Looking something up does not create a new record. Nothing is stored beyond the loan itself.",
      th: "การตรวจสอบสถานะไม่ก่อให้เกิดการเก็บรวบรวมข้อมูลใหม่ และไม่มีการจัดเก็บข้อมูลเพิ่มเติมนอกเหนือจากรายการยืมที่มีอยู่เดิม",
    },
  },
  {
    id: "feedback",
    name: { en: "Page feedback", th: "ความคิดเห็นต่อหน้าเว็บไซต์" },
    purpose: {
      en: "So we can tell which pages work and which do not.",
      th: "เพื่อให้ BIRSA ทราบว่าหน้าใดใช้งานได้ดีและหน้าใดควรปรับปรุง",
    },
    basis: BASIS_LEGITIMATE_INTEREST,
    collects: [
      {
        en: "Whether you found the page useful",
        th: "ความเห็นของท่านว่าหน้าดังกล่าวเป็นประโยชน์หรือไม่",
      },
      {
        en: "Anything you type in the comment box",
        th: "ข้อความที่ท่านกรอกในช่องความคิดเห็น",
      },
      {
        en: "Which page you were on, and whether you were reading in Thai or English",
        th: "หน้าเว็บไซต์ที่ท่านใช้งาน และภาษาที่ท่านเลือกอ่าน",
      },
    ],
    ifYouDoNot: {
      en: "Feedback is entirely optional. We do not ask for your name, your email address or anything else that identifies you, so please do not type those into the comment box.",
      th: "การแสดงความคิดเห็นเป็นไปตามความสมัครใจทั้งหมด BIRSA มิได้ขอชื่อ ที่อยู่อีเมล หรือข้อมูลอื่นใดที่ระบุตัวท่านได้ จึงขอความร่วมมือมิให้กรอกข้อมูลดังกล่าวลงในช่องความคิดเห็น",
    },
    recipients: ["vercel-postgres"],
    storage: "database",
    retentionTrigger: "created",
  },
  {
    id: "rights-request",
    name: {
      en: "Requests about your own data",
      th: "คำร้องขอใช้สิทธิของเจ้าของข้อมูลส่วนบุคคล",
    },
    purpose: {
      en: "So we can find your data, act on your request, and prove we answered it in time.",
      th: "เพื่อให้ BIRSA ตรวจสอบข้อมูลของท่าน ดำเนินการตามคำร้อง และแสดงได้ว่าได้ตอบกลับภายในระยะเวลาที่กฎหมายกำหนด",
    },
    basis: BASIS_CONTRACT,
    collects: [
      { en: "Your name and email address", th: "ชื่อและที่อยู่อีเมลของท่าน" },
      {
        en: "Which right you are using, and anything you tell us to help us find your data",
        th: "สิทธิที่ท่านประสงค์จะใช้ และข้อมูลประกอบที่ช่วยให้ BIRSA ค้นหาข้อมูลของท่านได้",
      },
    ],
    ifYouDoNot: {
      en: "We need a name and an email address to answer you and to be reasonably sure the request is really yours.",
      th: "BIRSA จำเป็นต้องมีชื่อและที่อยู่อีเมลเพื่อตอบกลับท่าน และเพื่อตรวจสอบตามสมควรว่าคำร้องดังกล่าวเป็นของท่านจริง",
    },
    recipients: ["resend"],
    storage: "email",
    retentionTrigger: "created",
  },
  {
    id: "officer-account",
    name: {
      en: "BIRSA officer accounts",
      th: "บัญชีผู้ใช้งานของเจ้าหน้าที่ BIRSA",
    },
    purpose: {
      en: "So the people who run the equipment service can sign in, and so each action has a name against it.",
      th: "เพื่อให้ผู้ดูแลบริการยืมอุปกรณ์เข้าใช้งานระบบได้ และเพื่อให้การดำเนินการแต่ละรายการมีผู้รับผิดชอบกำกับ",
    },
    collects: [
      {
        en: "The officer's name, email address and role",
        th: "ชื่อ ที่อยู่อีเมล และบทบาทหน้าที่ของเจ้าหน้าที่",
      },
      {
        en: "A scrambled form of their passcode, which cannot be turned back into the passcode",
        th: "รหัสผ่านที่ผ่านการแปลงค่าด้วยวิธีการทางเทคนิค ซึ่งไม่อาจย้อนกลับเป็นรหัสผ่านเดิมได้",
      },
      { en: "When they last signed in", th: "เวลาที่เข้าใช้งานระบบครั้งล่าสุด" },
    ],
    basis: BASIS_CONTRACT,
    ifYouDoNot: {
      en: "This only applies to BIRSA officers. An officer who does not want an account cannot run the equipment service.",
      th: "รายการนี้ใช้กับเจ้าหน้าที่ BIRSA เท่านั้น เจ้าหน้าที่ที่ไม่ประสงค์จะมีบัญชีผู้ใช้งานจะไม่สามารถปฏิบัติหน้าที่ดูแลบริการยืมอุปกรณ์ได้",
    },
    recipients: ["vercel-postgres"],
    storage: "database",
    retentionTrigger: "last-active",
    retentionNote: {
      en: "After two years without signing in, an officer's name and email address are overwritten. The record itself stays, because the log of who approved which loan would otherwise lose its meaning.",
      th: "เมื่อไม่มีการเข้าใช้งานระบบเป็นเวลาสองปี ชื่อและที่อยู่อีเมลของเจ้าหน้าที่จะถูกแทนที่ด้วยข้อมูลที่ไม่ระบุตัวบุคคล โดยยังคงรายการไว้ เนื่องจากมิฉะนั้นบันทึกว่าผู้ใดอนุมัติรายการยืมใดย่อมสิ้นความหมาย",
    },
  },
  {
    id: "audit-log",
    name: {
      en: "Log of officer actions",
      th: "บันทึกการดำเนินการของเจ้าหน้าที่",
    },
    purpose: {
      en: "So that if something goes wrong with an item or a loan, we can see who did what and when.",
      th: "เพื่อให้ตรวจสอบย้อนหลังได้ว่าผู้ใดดำเนินการสิ่งใดในเวลาใด เมื่อเกิดปัญหาเกี่ยวกับอุปกรณ์หรือรายการยืม",
    },
    basis: BASIS_LEGITIMATE_INTEREST,
    collects: [
      {
        en: "Which officer acted, what they did, and when",
        th: "เจ้าหน้าที่ผู้ดำเนินการ ลักษณะการดำเนินการ และเวลาที่ดำเนินการ",
      },
      {
        en: "Which item, loan or record they acted on",
        th: "อุปกรณ์ รายการยืม หรือข้อมูลที่ถูกดำเนินการ",
      },
    ],
    ifYouDoNot: {
      en: "This is written automatically when an officer acts. It records officers, not visitors, and it does not record your IP address or your browser.",
      th: "ระบบบันทึกรายการโดยอัตโนมัติเมื่อเจ้าหน้าที่ดำเนินการ โดยบันทึกเฉพาะการกระทำของเจ้าหน้าที่ มิใช่ของผู้เข้าชม และไม่มีการบันทึกหมายเลขไอพีหรือข้อมูลเบราว์เซอร์ของท่าน",
    },
    recipients: ["vercel-postgres"],
    storage: "database",
    retentionTrigger: "created",
  },
  {
    id: "photo-consent",
    name: {
      en: "Photographs of identifiable people, and the consent to publish them",
      th: "ภาพถ่ายบุคคลที่ระบุตัวตนได้ และความยินยอมในการเผยแพร่",
    },
    purpose: {
      en: "So BIRSA can publish a photograph of you on this site, and can prove you agreed to it and take it down when you ask.",
      th: "เพื่อให้ BIRSA เผยแพร่ภาพถ่ายของท่านบนเว็บไซต์นี้ได้ พร้อมทั้งพิสูจน์ได้ว่าท่านให้ความยินยอม และนำภาพออกเมื่อท่านร้องขอ",
    },
    basis: BASIS_CONSENT,
    collects: [
      { en: "The photograph itself", th: "ตัวภาพถ่าย" },
      { en: "Your name", th: "ชื่อของท่าน" },
      {
        en: "A way to contact you to check or withdraw consent",
        th: "ช่องทางติดต่อท่านเพื่อยืนยันหรือถอนความยินยอม",
      },
      {
        en: "What you agreed the photograph could be used for, and when you agreed it",
        th: "ขอบเขตการใช้ภาพที่ท่านให้ความยินยอม และวันที่ให้ความยินยอม",
      },
      {
        en: "Whether you were twenty or over at the time, and if not, your guardian's consent",
        th: "ข้อมูลว่าท่านมีอายุยี่สิบปีบริบูรณ์แล้วหรือไม่ ณ เวลาที่ให้ความยินยอม และหากยังไม่บรรลุนิติภาวะ ความยินยอมของผู้ใช้อำนาจปกครอง",
      },
    ],
    ifYouDoNot: {
      en: "You do not have to agree to anything. If you do not, BIRSA does not publish a photograph of you, and nothing else changes. Saying no costs you nothing and you do not have to give a reason.",
      th: "ท่านไม่จำเป็นต้องให้ความยินยอม หากท่านไม่ให้ความยินยอม BIRSA จะไม่เผยแพร่ภาพถ่ายของท่าน และไม่มีผลกระทบอื่นใดต่อท่าน การปฏิเสธไม่มีค่าใช้จ่ายใด และท่านไม่จำเป็นต้องให้เหตุผล",
    },
    recipients: ["vercel-postgres", "vercel-blob"],
    storage: "database",
    retentionTrigger: "last-active",
    retentionNote: {
      en: "The photograph and the consent record are deleted together when consent is withdrawn, and BIRSA aims to remove a published photograph within two working days of being asked. Otherwise the two years run from the last time the photograph was still published.",
      th: "ภาพถ่ายและบันทึกความยินยอมจะถูกลบพร้อมกันเมื่อท่านถอนความยินยอม โดย BIRSA ตั้งเป้านำภาพที่เผยแพร่แล้วออกภายในสองวันทำการนับแต่ได้รับการร้องขอ ในกรณีอื่น ระยะเวลาสองปีเริ่มนับจากวันสุดท้ายที่ภาพยังคงเผยแพร่อยู่",
    },
  },
  {
    id: "rate-limiting",
    name: {
      en: "Stopping form abuse",
      th: "การป้องกันการใช้แบบฟอร์มโดยมิชอบ",
    },
    purpose: {
      en: "So one person cannot flood a form with hundreds of submissions.",
      th: "เพื่อป้องกันมิให้ผู้ใดส่งแบบฟอร์มซ้ำเป็นจำนวนมากจนกระทบต่อการให้บริการ",
    },
    basis: BASIS_LEGITIMATE_INTEREST,
    collects: [
      {
        en: "Your IP address, and a count of how many times you submitted a form recently",
        th: "หมายเลขไอพีของท่าน และจำนวนครั้งที่ส่งแบบฟอร์มในช่วงเวลาที่ผ่านมา",
      },
    ],
    ifYouDoNot: {
      en: "This happens automatically on every form. There is no way to turn it off, and no way to use the forms without it.",
      th: "ระบบดำเนินการโดยอัตโนมัติกับทุกแบบฟอร์ม ไม่อาจปิดการทำงานได้ และไม่อาจใช้แบบฟอร์มโดยไม่ผ่านขั้นตอนนี้",
    },
    recipients: [],
    storage: "memory",
    retentionTrigger: "created",
    retentionNote: {
      en: "Held in the server's memory for ten minutes and never written to a database. It disappears sooner if the server restarts.",
      th: "จัดเก็บไว้ในหน่วยความจำของเซิร์ฟเวอร์เป็นเวลาสิบนาที โดยไม่มีการบันทึกลงฐานข้อมูล และจะถูกลบเร็วกว่ากำหนดหากเซิร์ฟเวอร์เริ่มการทำงานใหม่",
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
    role: {
      en: "Delivers every email this site sends",
      th: "ให้บริการจัดส่งอีเมลทุกฉบับที่เว็บไซต์นี้ส่งออก",
    },
    country: { en: "United States", th: "สหรัฐอเมริกา" },
    outsideThailand: true,
    receives: {
      en: "Your name, email address, and anything in the message. For a loan, also your student ID, phone number, dates and reason.",
      th: "ชื่อ ที่อยู่อีเมล และเนื้อหาข้อความของท่าน ในกรณีการยืมอุปกรณ์ รวมถึงรหัสนักศึกษา หมายเลขโทรศัพท์ ช่วงวันที่ และเหตุผลในการยืมด้วย",
    },
  },
  {
    id: "vercel-hosting",
    name: "Vercel",
    role: {
      en: "Hosts the site and serves every page",
      th: "ให้บริการโฮสติ้งและเผยแพร่หน้าเว็บไซต์",
    },
    country: { en: "United States", th: "สหรัฐอเมริกา" },
    outsideThailand: true,
    receives: {
      en: "Ordinary web server records of each request, which include your IP address. BIRSA does not add anything to these and does not use them to identify anyone.",
      th: "บันทึกการเรียกใช้งานของเซิร์ฟเวอร์ตามปกติ ซึ่งรวมถึงหมายเลขไอพีของท่าน BIRSA มิได้เพิ่มเติมข้อมูลใดลงในบันทึกดังกล่าว และมิได้ใช้เพื่อระบุตัวบุคคล",
    },
  },
  {
    id: "vercel-postgres",
    name: "Vercel Postgres",
    role: {
      en: "The database behind the equipment loan service",
      th: "ให้บริการฐานข้อมูลสำหรับบริการยืมอุปกรณ์",
    },
    country: { en: "United States", th: "สหรัฐอเมริกา" },
    outsideThailand: true,
    receives: {
      en: "Loan and borrower records, officer accounts, the log of officer actions, and page feedback.",
      th: "รายการยืมและข้อมูลผู้ยืม บัญชีผู้ใช้งานของเจ้าหน้าที่ บันทึกการดำเนินการของเจ้าหน้าที่ และความคิดเห็นต่อหน้าเว็บไซต์",
    },
  },
  {
    id: "vercel-blob",
    name: "Vercel Blob",
    role: {
      en: "Stores photographs of equipment",
      th: "ให้บริการจัดเก็บภาพถ่ายอุปกรณ์",
    },
    country: { en: "United States", th: "สหรัฐอเมริกา" },
    outsideThailand: true,
    receives: {
      en: "Photographs of equipment that officers upload. No personal data.",
      th: "ภาพถ่ายอุปกรณ์ที่เจ้าหน้าที่อัปโหลด โดยไม่มีข้อมูลส่วนบุคคล",
    },
  },
  {
    id: "openstreetmap",
    name: "OpenStreetMap",
    role: {
      en: "Supplies the map tiles on the places pages",
      th: "ให้บริการภาพแผนที่ในหน้าข้อมูลสถานที่",
    },
    country: { en: "United Kingdom", th: "สหราชอาณาจักร" },
    outsideThailand: true,
    receives: {
      en: "If you open a page with a map, your browser fetches the map images directly from OpenStreetMap, so they see your IP address. BIRSA sends them nothing else.",
      th: "เมื่อท่านเปิดหน้าที่มีแผนที่ เบราว์เซอร์ของท่านจะเรียกภาพแผนที่จาก OpenStreetMap โดยตรง ผู้ให้บริการดังกล่าวจึงทราบหมายเลขไอพีของท่าน ทั้งนี้ BIRSA มิได้ส่งข้อมูลอื่นใดให้",
    },
  },
  {
    id: "google-forms",
    name: "Google Forms",
    role: {
      en: "Some club sign-up forms are Google Forms shown inside a page here",
      th: "แบบฟอร์มรับสมัครของบางชมรมเป็น Google Form ที่แสดงผลอยู่ภายในหน้าเว็บไซต์นี้",
    },
    country: { en: "United States", th: "สหรัฐอเมริกา" },
    outsideThailand: true,
    receives: {
      en: "Whatever you type into that form goes straight to Google and to whoever set the form up. It does not pass through this site, and BIRSA cannot see it or delete it for you.",
      th: "ข้อมูลที่ท่านกรอกในแบบฟอร์มดังกล่าวจะถูกส่งตรงไปยัง Google และผู้จัดทำแบบฟอร์ม โดยไม่ผ่านเว็บไซต์นี้ BIRSA จึงไม่อาจเข้าถึงหรือลบข้อมูลดังกล่าวแทนท่านได้",
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
      th: "บันทึกภาษาที่ท่านเลือกอ่านครั้งล่าสุด ไทยหรืออังกฤษ เพื่อมิให้ต้องสอบถามซ้ำ",
    },
    expires: { en: "One year", th: "หนึ่งปี" },
    essential: true,
  },
  {
    name: "birsa_contact_draft",
    purpose: {
      en: "Holds your answers as you move between the pages of the contact form, so going back does not lose them.",
      th: "จัดเก็บคำตอบของท่านระหว่างการเปลี่ยนหน้าในแบบฟอร์มติดต่อ เพื่อมิให้ข้อมูลสูญหายเมื่อย้อนกลับ",
    },
    expires: { en: "Thirty minutes", th: "สามสิบนาที" },
    essential: true,
  },
  {
    name: "birsa_start_club_draft",
    purpose: {
      en: "The same, for the start-a-club form.",
      th: "ทำหน้าที่เช่นเดียวกัน สำหรับแบบฟอร์มขอจัดตั้งชมรม",
    },
    expires: { en: "Thirty minutes", th: "สามสิบนาที" },
    essential: true,
  },
  {
    name: "birsa_loan_request_draft",
    purpose: {
      en: "The same, for an equipment loan request.",
      th: "ทำหน้าที่เช่นเดียวกัน สำหรับคำขอยืมอุปกรณ์",
    },
    expires: { en: "Thirty minutes", th: "สามสิบนาที" },
    essential: true,
  },
  {
    name: "birsa_loan_status_draft",
    purpose: {
      en: "The same, for looking up a loan you already made.",
      th: "ทำหน้าที่เช่นเดียวกัน สำหรับการตรวจสอบสถานะรายการยืม",
    },
    expires: { en: "Thirty minutes", th: "สามสิบนาที" },
    essential: true,
  },
  {
    name: "birsa_rights_draft",
    purpose: {
      en: "The same, for a request about your own data.",
      th: "ทำหน้าที่เช่นเดียวกัน สำหรับคำร้องขอใช้สิทธิของเจ้าของข้อมูลส่วนบุคคล",
    },
    expires: { en: "Thirty minutes", th: "สามสิบนาที" },
    essential: true,
  },
  {
    name: "birsa_study_plan_draft",
    purpose: {
      en: "The same, for the study plan service, while you work out which curriculum applies to you.",
      th: "ทำหน้าที่เช่นเดียวกัน สำหรับบริการวางแผนการศึกษา ระหว่างตรวจสอบว่าท่านใช้หลักสูตรใด",
    },
    expires: { en: "Thirty minutes", th: "สามสิบนาที" },
    essential: true,
  },
  {
    name: "birsa_inventory",
    purpose: {
      en: "Keeps a BIRSA officer signed in to the equipment console. Only ever set for officers, never for ordinary visitors.",
      th: "รักษาสถานะการเข้าใช้งานระบบจัดการอุปกรณ์ของเจ้าหน้าที่ BIRSA กำหนดเฉพาะกับเจ้าหน้าที่เท่านั้น มิได้กำหนดกับผู้เข้าชมทั่วไป",
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
      th: "บันทึกการเลือกโหมดสว่างหรือโหมดมืดของท่าน กำหนดเมื่อท่านใช้ปุ่มสลับโหมดเท่านั้น",
    },
  },
  {
    key: "birsa-onboarding-*",
    purpose: {
      en: "Remembers which tasks you ticked off on the step-by-step pages, one key per track. We never see this.",
      th: "บันทึกรายการที่ท่านทำเครื่องหมายไว้ในหน้าแนะนำแบบทีละขั้นตอน โดยแยกคีย์ตามแต่ละเส้นทาง BIRSA ไม่สามารถเข้าถึงข้อมูลนี้ได้",
    },
  },
  {
    key: "birsa-study-plan",
    purpose: {
      en: "Keeps a copy of the study plan you built, so it is still there if you close the tab and come back. Only set once you reach the plan screen, never sent to BIRSA, and cleared straight away by the delete button on that screen.",
      th: "เก็บสำเนาแผนการศึกษาที่ท่านจัดทำไว้ เพื่อให้ยังคงอยู่แม้ท่านปิดแท็บแล้วกลับมาใหม่ กำหนดค่าเมื่อท่านไปถึงหน้าแผนการศึกษาเท่านั้น ไม่มีการส่งข้อมูลนี้ไปยัง BIRSA แต่อย่างใด และจะถูกลบทันทีเมื่อท่านกดปุ่มลบในหน้าดังกล่าว",
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
    name: {
      en: "See what we hold about you",
      th: "สิทธิขอเข้าถึงและขอรับสำเนาข้อมูลส่วนบุคคล",
    },
    description: {
      en: "Ask us what personal data we hold about you, get a copy of it, and ask how we got it.",
      th: "ขอทราบว่า BIRSA เก็บรวบรวมข้อมูลส่วนบุคคลใดของท่านไว้ ขอรับสำเนาข้อมูลดังกล่าว และขอให้เปิดเผยถึงการได้มาซึ่งข้อมูลนั้น",
    },
  },
  {
    id: "portability",
    section: "31",
    name: {
      en: "Get your data in a reusable format",
      th: "สิทธิขอให้โอนย้ายข้อมูลส่วนบุคคล",
    },
    description: {
      en: "Ask for your data in a format you or another organisation can read with a computer.",
      th: "ขอรับข้อมูลส่วนบุคคลของท่านในรูปแบบที่สามารถอ่านหรือใช้งานได้ด้วยเครื่องมือหรืออุปกรณ์ที่ทำงานโดยอัตโนมัติ และขอให้ส่งหรือโอนข้อมูลดังกล่าวไปยังผู้ควบคุมข้อมูลส่วนบุคคลรายอื่น",
    },
  },
  {
    id: "correct",
    section: "35 and 36",
    name: {
      en: "Correct something that is wrong",
      th: "สิทธิขอให้แก้ไขข้อมูลส่วนบุคคลให้ถูกต้อง",
    },
    description: {
      en: "Tell us to fix data that is wrong, out of date, incomplete or misleading.",
      th: "ขอให้ BIRSA ดำเนินการให้ข้อมูลส่วนบุคคลของท่านถูกต้อง เป็นปัจจุบัน สมบูรณ์ และไม่ก่อให้เกิดความเข้าใจผิด",
    },
  },
  {
    id: "delete",
    section: "33",
    name: {
      en: "Have your data deleted",
      th: "สิทธิขอให้ลบหรือทำลายข้อมูลส่วนบุคคล",
    },
    description: {
      en: "Ask us to delete or anonymise your data, for example when we no longer need it for the purpose we collected it.",
      th: "ขอให้ BIRSA ลบ ทำลาย หรือทำให้ข้อมูลส่วนบุคคลของท่านเป็นข้อมูลที่ไม่สามารถระบุตัวบุคคลได้ เช่น เมื่อหมดความจำเป็นในการเก็บรักษาตามวัตถุประสงค์ในการเก็บรวบรวม",
    },
  },
  {
    id: "object",
    section: "32",
    name: {
      en: "Object to what we are doing with it",
      th: "สิทธิคัดค้านการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคล",
    },
    description: {
      en: "Object to us collecting, using or disclosing your data where we rely on our legitimate interests.",
      th: "คัดค้านการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคลของท่าน ในกรณีที่ BIRSA อาศัยฐานประโยชน์โดยชอบด้วยกฎหมาย",
    },
  },
  {
    id: "restrict",
    section: "34",
    name: {
      en: "Ask us to pause using it",
      th: "สิทธิขอให้ระงับการใช้ข้อมูลส่วนบุคคล",
    },
    description: {
      en: "Ask us to hold your data but stop using it, for example while we look into a correction you asked for.",
      th: "ขอให้ BIRSA เก็บรักษาข้อมูลส่วนบุคคลไว้แต่ระงับการใช้งาน เช่น ระหว่างการตรวจสอบความถูกต้องของข้อมูลตามที่ท่านร้องขอ",
    },
  },
  {
    id: "withdraw",
    section: "19",
    name: { en: "Withdraw consent", th: "สิทธิขอถอนความยินยอม" },
    description: {
      en: "Where we ever rely on your consent, take it back. It is as easy to withdraw as it was to give, and withdrawing does not undo what was already done lawfully.",
      th: "ในกรณีที่ BIRSA อาศัยความยินยอมของท่าน ท่านมีสิทธิถอนความยินยอมเมื่อใดก็ได้ โดยกระทำได้โดยง่ายเช่นเดียวกับการให้ความยินยอม ทั้งนี้ การถอนความยินยอมย่อมไม่ส่งผลกระทบต่อการดำเนินการที่ได้กระทำไปแล้วโดยชอบด้วยกฎหมาย",
    },
  },
  {
    id: "complain",
    section: "73",
    name: { en: "Complain about us", th: "สิทธิร้องเรียน" },
    description: {
      en: "Complain to the Personal Data Protection Committee's expert committee if you think we have broken the law.",
      th: "ร้องเรียนต่อคณะกรรมการผู้เชี่ยวชาญ ในกรณีที่ท่านเห็นว่า BIRSA มิได้ปฏิบัติตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562",
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
