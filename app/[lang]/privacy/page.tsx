import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Email from "@/components/Email";
import { contact } from "@/content/site";
import {
  activities,
  dataRights,
  processorById,
  type RetentionTrigger,
} from "@/content/privacy/register";

/**
 * The retention period and the rights deadline are spelled out as words in
 * the copy below ("two years", "thirty days") rather than interpolated from
 * `RETENTION_YEARS` and `RIGHTS_RESPONSE_DAYS`, because turning a number back
 * into a word in both English and Thai costs more than it is worth for two
 * values that change roughly never.
 *
 * They cannot silently drift out of step with the code that enforces them:
 * tests/unit/privacy-register.test.ts asserts both constants still hold their
 * expected values, so changing either one fails the suite and forces whoever
 * changed it to come and update this prose too.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const t = content[locale];

  return buildMetadata({ locale, title: t.title, description: t.lede, path: "/privacy" });
}

type Labels = {
  title: string;
  lede: string;

  controllerTitle: string;
  controllerBody: string;
  controllerAddressLabel: string;
  controllerEmailLabel: string;

  basisTitle: string;
  basisBody1: string;
  basisBody2: string;
  basisBody3: string;

  activitiesTitle: string;
  activitiesIntro: string;
  purposeLabel: string;
  ifYouDoNotLabel: string;
  collectsLabel: string;
  legalBasisPrefix: string;
  legalBasisOfAct: string;
  recipientsLabel: string;
  noRecipients: string;
  retentionLabel: string;
  retentionPrefix: string;
  /** Separator between the prefix and the trigger label. Thai takes none. */
  retentionTriggerJoin: string;
  /** Separator between the trigger label and the closing clause. Thai takes no comma. */
  retentionSuffixJoin: string;
  retentionSuffix: string;
  retentionTriggerLabels: Record<RetentionTrigger, string>;

  retentionTitle: string;
  retentionBody1: string;
  retentionBody2: string;

  transferTitle: string;
  transferBody1: string;
  transferBody2: string;

  automatedTitle: string;
  automatedBody: string;

  noAdsTitle: string;
  noAdsBody: string;

  rightsTitle: string;
  rightsIntro: string;
  rightsResponseNote: string;
  rightsSectionLabel: string;
  rightsCta: string;

  linksTitle: string;
  linksIntro: string;
  cookiesLinkTitle: string;
  cookiesLinkBody: string;
  cookiesLinkCta: string;
  recordLinkTitle: string;
  recordLinkBody: string;
  recordLinkCta: string;
  yourDataLinkTitle: string;
  yourDataLinkBody: string;
  yourDataLinkCta: string;

  contactIntro: string;
  contactCta: string;
};

const content: Record<Locale, Labels> = {
  en: {
    title: "Privacy",
    lede: "A plain-language notice of what this site collects, why, how long we keep it, and the rights you have over it.",

    controllerTitle: "Who runs this site",
    controllerBody:
      "BIRSA (the BIR Student Association), the student association of the BIR programme, Faculty of Political Science, Thammasat University, is the data controller for this site: it decides what data is collected and why.",
    controllerAddressLabel: "Address:",
    controllerEmailLabel: "Email:",

    basisTitle: "Why we don't ask for your consent",
    basisBody1:
      "Almost nothing on this site runs on your consent. We rely on two other grounds in the Personal Data Protection Act instead: section 24(3), because you've asked us to do something for you, and section 24(5), where we have a legitimate interest, such as running the equipment loan service fairly for everyone.",
    basisBody2:
      "This matters in practice. The age of majority in Thailand is twenty, so most first-year students are minors, and a minor's consent normally needs a guardian's consent too, under section 20 of the Act. Because we don't rely on consent, that requirement never comes up. Borrowing club equipment is, in any case, something a minor can decide for themselves: section 24 of the Civil and Commercial Code lets a minor carry out an act that suits their condition in life and is reasonably needed to meet their ordinary needs, and returning a borrowed camera or tent fits that description.",
    basisBody3:
      "If we ever add a feature that is genuinely optional and not needed to run a service you asked for, we'll ask for your consent separately, in plain language, and you'll be free to say no. See \"Withdraw consent\" among your rights below.",

    activitiesTitle: "What we collect, and why",
    activitiesIntro:
      "This is every place on this site where we collect personal data. For each one, we say why we collect it, whether you have to give it, what we collect, our legal basis, who else sees it, and how long we keep it.",
    purposeLabel: "Why we collect it",
    ifYouDoNotLabel: "Do you have to give this?",
    collectsLabel: "What we collect",
    legalBasisPrefix: "Legal basis: section",
    legalBasisOfAct: "of the Personal Data Protection Act.",
    recipientsLabel: "Who else sees it",
    noRecipients: "Nobody outside BIRSA.",
    retentionLabel: "How long we keep it",
    retentionPrefix: "Kept for up to two years, counted from",
    retentionTriggerJoin: " ",
    retentionSuffixJoin: ", ",
    retentionSuffix: "then deleted automatically.",
    retentionTriggerLabels: {
      created: "the day we receive it",
      closed: "the day the record closes",
      "last-active": "the last time it changed",
    },

    retentionTitle: "How long we keep it, in short",
    retentionBody1:
      "Every category of personal data on this site is kept for up to two years and then deleted automatically. What differs is when the clock starts, which is set out activity by activity above.",
    retentionBody2:
      "For an equipment loan, the two years start on the day the loan closes, not the day you ask to borrow something. An open loan is never deleted, however old it is. The full deletion rules are set out on our record of processing activities, linked below.",

    transferTitle: "Sending your data outside Thailand",
    transferBody1:
      "Some of the outside providers we use are not based in Thailand. Resend, which delivers our email, and Vercel, which hosts this site and its database, are both in the United States. OpenStreetMap, which supplies the maps on this site, is in the United Kingdom. Thailand's Personal Data Protection Committee has not found either country to give an adequate level of protection, and we don't claim it has.",
    transferBody2:
      "Instead, we rely on section 28(3) of the Act: the transfer is necessary to perform a contract with you, or to take steps you've asked for before entering one, for example sending you an email or running the equipment loan you requested. Each provider's data processing agreement also carries the safeguards required under section 29, paragraph 3, of the Act.",

    automatedTitle: "Automated decisions",
    automatedBody:
      "When you ask to borrow equipment, the system automatically checks whether the item is free and whether your account is blocked or already at its loan limit, and stops an invalid request there. It never decides on its own whether to approve or reject a request: a BIRSA officer makes that decision every time.",

    noAdsTitle: "No ads, no selling your data",
    noAdsBody:
      "We don't run advertising on this site, and we never sell or trade your data. The providers named on this page only ever act on our instructions, for the purposes described here, and never for their own purposes.",

    rightsTitle: "Your rights",
    rightsIntro:
      "The Personal Data Protection Act gives you these rights over the data we hold about you. You can use any of them by writing to us.",
    rightsResponseNote:
      "If you ask to see your data, we have thirty days to answer, under section 30 of the Act.",
    rightsSectionLabel: "Section",
    rightsCta: "Use your rights",

    linksTitle: "More detail",
    linksIntro:
      "This page is a summary written in plain language. Three pages go into more depth, and all three are built from the same record we use here, so nothing on them can contradict this page.",
    cookiesLinkTitle: "Cookies",
    cookiesLinkBody: "Every cookie this site sets, what it's for, and how long it lasts.",
    cookiesLinkCta: "Read about cookies",
    recordLinkTitle: "Record of processing activities",
    recordLinkBody:
      "The formal record required by section 39 of the Act, including our security measures and how we handle a data breach.",
    recordLinkCta: "Read the record",
    yourDataLinkTitle: "Your data",
    yourDataLinkBody: "Ask to see, correct, delete, or get a copy of your data.",
    yourDataLinkCta: "Manage your data",

    contactIntro: "Questions about this notice, or about your data? Get in touch:",
    contactCta: "Contact BIRSA",
  },
  th: {
    title: "ประกาศความเป็นส่วนตัว",
    lede: "ประกาศฉบับนี้ชี้แจงว่าเว็บไซต์นี้เก็บรวบรวมข้อมูลส่วนบุคคลใด เพื่อวัตถุประสงค์ใด เก็บรักษาไว้เป็นระยะเวลาเท่าใด และท่านมีสิทธิใดบ้างเหนือข้อมูลดังกล่าว",

    controllerTitle: "ผู้ควบคุมข้อมูลส่วนบุคคล",
    controllerBody:
      "BIRSA (สโมสรนักศึกษาหลักสูตร BIR) หลักสูตรการเมืองและการระหว่างประเทศ (BIR) คณะรัฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์ เป็นผู้ควบคุมข้อมูลส่วนบุคคลของเว็บไซต์นี้ กล่าวคือ เป็นผู้มีอำนาจตัดสินใจเกี่ยวกับการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคล",
    controllerAddressLabel: "ที่อยู่:",
    controllerEmailLabel: "อีเมล:",

    basisTitle: "เหตุใด BIRSA จึงมิได้ขอความยินยอมจากท่าน",
    basisBody1:
      "การดำเนินการเกือบทั้งหมดบนเว็บไซต์นี้มิได้อาศัยความยินยอมของท่าน แต่อาศัยฐานทางกฎหมายอื่นตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 สองประการ ได้แก่ มาตรา 24(3) ความจำเป็นเพื่อการปฏิบัติตามสัญญาซึ่งท่านเป็นคู่สัญญา หรือเพื่อดำเนินการตามคำขอของท่านก่อนเข้าทำสัญญานั้น และมาตรา 24(5) ความจำเป็นเพื่อประโยชน์โดยชอบด้วยกฎหมายของ BIRSA เช่น การดูแลบริการยืมอุปกรณ์ให้เป็นธรรมแก่ผู้ใช้บริการทุกราย",
    basisBody2:
      "ข้อนี้มีนัยสำคัญในทางปฏิบัติ เนื่องจากบุคคลย่อมบรรลุนิติภาวะเมื่อมีอายุยี่สิบปีบริบูรณ์ตามกฎหมายไทย นักศึกษาชั้นปีที่หนึ่งส่วนใหญ่จึงยังเป็นผู้เยาว์ และโดยหลักแล้วการขอความยินยอมจากผู้เยาว์ต้องได้รับความยินยอมจากผู้ใช้อำนาจปกครองด้วย ตามมาตรา 20 แห่งพระราชบัญญัติดังกล่าว เมื่อ BIRSA มิได้อาศัยความยินยอมเป็นฐานในการประมวลผล กรณีจึงไม่ตกอยู่ภายใต้บังคับของบทบัญญัติดังกล่าว อนึ่ง การยืมอุปกรณ์ของชมรมเป็นการอันผู้เยาว์อาจกระทำได้โดยลำพัง เนื่องจากเป็นการสมแก่ฐานานุรูปและจำเป็นในการดำรงชีพตามสมควร ตามมาตรา 24 แห่งประมวลกฎหมายแพ่งและพาณิชย์",
    basisBody3:
      "ในกรณีที่ BIRSA เพิ่มบริการซึ่งเป็นทางเลือกโดยแท้ และมิได้มีความจำเป็นต่อการให้บริการตามที่ท่านร้องขอ BIRSA จะขอความยินยอมจากท่านแยกต่างหากโดยชัดแจ้ง ด้วยข้อความที่เข้าถึงได้ง่ายและเข้าใจได้ และท่านมีอิสระที่จะปฏิเสธ ทั้งนี้ โปรดดูหัวข้อ \"สิทธิขอถอนความยินยอม\" ในรายการสิทธิด้านล่าง",

    activitiesTitle: "ข้อมูลส่วนบุคคลที่เก็บรวบรวมและวัตถุประสงค์",
    activitiesIntro:
      "รายการต่อไปนี้คือกิจกรรมทั้งหมดบนเว็บไซต์นี้ที่มีการเก็บรวบรวมข้อมูลส่วนบุคคล โดยแต่ละรายการระบุวัตถุประสงค์ในการเก็บรวบรวม ข้อมูลที่ต้องกรอกและผลของการไม่ให้ข้อมูล ข้อมูลที่เก็บรวบรวม ฐานทางกฎหมาย ผู้รับข้อมูล และระยะเวลาการเก็บรักษา",
    purposeLabel: "วัตถุประสงค์ในการเก็บรวบรวม",
    ifYouDoNotLabel: "ข้อมูลที่ต้องกรอกและผลของการไม่ให้ข้อมูล",
    collectsLabel: "ข้อมูลส่วนบุคคลที่เก็บรวบรวม",
    legalBasisPrefix: "ฐานทางกฎหมาย: มาตรา",
    legalBasisOfAct: "แห่งพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562",
    recipientsLabel: "ผู้รับข้อมูลส่วนบุคคล",
    noRecipients: "ไม่มีการเปิดเผยแก่บุคคลอื่นนอกจาก BIRSA",
    retentionLabel: "ระยะเวลาการเก็บรักษา",
    retentionPrefix: "เก็บรักษาไว้ไม่เกินสองปี นับแต่",
    retentionTriggerJoin: "",
    retentionSuffixJoin: " ",
    retentionSuffix: "จากนั้นระบบจะลบข้อมูลโดยอัตโนมัติ",
    retentionTriggerLabels: {
      created: "วันที่ได้รับข้อมูล",
      closed: "วันที่รายการดังกล่าวสิ้นสุด",
      "last-active": "วันที่มีการเปลี่ยนแปลงข้อมูลครั้งล่าสุด",
    },

    retentionTitle: "ระยะเวลาการเก็บรักษาข้อมูลส่วนบุคคล",
    retentionBody1:
      "ข้อมูลส่วนบุคคลทุกประเภทบนเว็บไซต์นี้เก็บรักษาไว้ไม่เกินสองปี จากนั้นระบบจะลบโดยอัตโนมัติ สิ่งที่แตกต่างกันคือจุดเริ่มต้นนับระยะเวลา ซึ่งได้ระบุไว้แยกตามแต่ละกิจกรรมข้างต้น",
    retentionBody2:
      "สำหรับการยืมอุปกรณ์ ระยะเวลาสองปีเริ่มนับแต่วันที่รายการยืมสิ้นสุด มิใช่วันที่ท่านยื่นคำขอ รายการยืมที่ยังไม่สิ้นสุดจะไม่ถูกลบไม่ว่าจะล่วงเลยมานานเพียงใด ทั้งนี้ หลักเกณฑ์การลบข้อมูลฉบับเต็มปรากฏอยู่ในบันทึกรายการกิจกรรมการประมวลผลข้อมูลส่วนบุคคล ตามลิงก์ด้านล่าง",

    transferTitle: "การส่งหรือโอนข้อมูลส่วนบุคคลไปยังต่างประเทศ",
    transferBody1:
      "ผู้ให้บริการภายนอกบางรายที่ BIRSA ใช้บริการมิได้ตั้งอยู่ในราชอาณาจักร ได้แก่ Resend ซึ่งให้บริการจัดส่งอีเมล และ Vercel ซึ่งให้บริการโฮสติ้งและฐานข้อมูล ทั้งสองรายตั้งอยู่ในสหรัฐอเมริกา ส่วน OpenStreetMap ซึ่งให้บริการภาพแผนที่ ตั้งอยู่ในสหราชอาณาจักร คณะกรรมการคุ้มครองข้อมูลส่วนบุคคลยังมิได้ประกาศกำหนดว่าประเทศปลายทางดังกล่าวมีมาตรฐานการคุ้มครองข้อมูลส่วนบุคคลที่เพียงพอ และ BIRSA มิได้กล่าวอ้างเช่นนั้น",
    transferBody2:
      "การส่งหรือโอนข้อมูลดังกล่าวจึงอาศัยข้อยกเว้นตามมาตรา 28(3) แห่งพระราชบัญญัติ กล่าวคือ เป็นการจำเป็นเพื่อการปฏิบัติตามสัญญาซึ่งท่านเป็นคู่สัญญา หรือเพื่อดำเนินการตามคำขอของท่านก่อนเข้าทำสัญญานั้น เช่น การจัดส่งอีเมลถึงท่าน หรือการดำเนินการตามคำขอยืมอุปกรณ์ นอกจากนี้ ข้อตกลงการประมวลผลข้อมูลส่วนบุคคลของผู้ให้บริการแต่ละรายยังได้จัดให้มีมาตรการคุ้มครองที่เหมาะสมตามมาตรา 29 วรรคสาม แห่งพระราชบัญญัติด้วย",

    automatedTitle: "การตัดสินใจโดยระบบอัตโนมัติ",
    automatedBody:
      "เมื่อท่านยื่นคำขอยืมอุปกรณ์ ระบบจะตรวจสอบโดยอัตโนมัติว่าอุปกรณ์ว่างหรือไม่ และบัญชีของท่านถูกระงับสิทธิหรือครบโควตาการยืมแล้วหรือไม่ และจะระงับคำขอที่ไม่เป็นไปตามเงื่อนไขไว้ตั้งแต่ขั้นตอนดังกล่าว ทั้งนี้ ระบบมิได้อนุมัติหรือปฏิเสธคำขอโดยอัตโนมัติแต่อย่างใด การพิจารณาคำขอทุกรายการกระทำโดยเจ้าหน้าที่ BIRSA เสมอ",

    noAdsTitle: "ไม่มีการโฆษณาและไม่มีการจำหน่ายข้อมูล",
    noAdsBody:
      "เว็บไซต์นี้ไม่มีการโฆษณา และ BIRSA ไม่จำหน่ายหรือแลกเปลี่ยนข้อมูลส่วนบุคคลของท่านแก่บุคคลใด ผู้ให้บริการที่ระบุไว้ในประกาศฉบับนี้ดำเนินการตามคำสั่งของ BIRSA เท่านั้น เพื่อวัตถุประสงค์ที่ระบุไว้ในประกาศฉบับนี้ โดยมิได้นำไปใช้เพื่อประโยชน์ของตนเอง",

    rightsTitle: "สิทธิของเจ้าของข้อมูลส่วนบุคคล",
    rightsIntro:
      "พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 รับรองสิทธิดังต่อไปนี้แก่ท่านในฐานะเจ้าของข้อมูลส่วนบุคคล ท่านสามารถใช้สิทธิดังกล่าวได้โดยยื่นคำร้องมายัง BIRSA",
    rightsResponseNote:
      "ในกรณีที่ท่านใช้สิทธิขอเข้าถึงและขอรับสำเนาข้อมูลส่วนบุคคล BIRSA จะดำเนินการตามคำขอโดยไม่ชักช้า แต่ต้องไม่เกินสามสิบวันนับแต่วันที่ได้รับคำขอ ตามมาตรา 30 แห่งพระราชบัญญัติ",
    rightsSectionLabel: "มาตรา",
    rightsCta: "ยื่นคำร้องขอใช้สิทธิ",

    linksTitle: "เอกสารประกอบ",
    linksIntro:
      "ประกาศฉบับนี้เป็นเอกสารสรุป ยังมีเอกสารอีกสามฉบับที่ให้รายละเอียดเพิ่มเติม โดยทั้งสามฉบับจัดทำขึ้นจากชุดข้อมูลเดียวกันกับประกาศฉบับนี้ จึงไม่อาจขัดหรือแย้งกันได้",
    cookiesLinkTitle: "คุกกี้",
    cookiesLinkBody: "รายการคุกกี้ทั้งหมดที่เว็บไซต์นี้ใช้ วัตถุประสงค์ และระยะเวลาการจัดเก็บ",
    cookiesLinkCta: "อ่านรายละเอียดเรื่องคุกกี้",
    recordLinkTitle: "บันทึกรายการกิจกรรมการประมวลผลข้อมูลส่วนบุคคล",
    recordLinkBody:
      "บันทึกรายการตามที่มาตรา 39 แห่งพระราชบัญญัติกำหนดให้ต้องจัดทำ รวมถึงมาตรการรักษาความมั่นคงปลอดภัยและแนวปฏิบัติเมื่อเกิดเหตุการละเมิดข้อมูลส่วนบุคคล",
    recordLinkCta: "อ่านบันทึกรายการฉบับเต็ม",
    yourDataLinkTitle: "การใช้สิทธิของท่าน",
    yourDataLinkBody:
      "ยื่นคำร้องขอเข้าถึง ขอรับสำเนา ขอแก้ไข ขอลบ หรือขอใช้สิทธิอื่นเกี่ยวกับข้อมูลส่วนบุคคลของท่าน",
    yourDataLinkCta: "ยื่นคำร้องขอใช้สิทธิ",

    contactIntro:
      "หากท่านมีข้อสงสัยเกี่ยวกับประกาศฉบับนี้ หรือเกี่ยวกับข้อมูลส่วนบุคคลของท่าน โปรดติดต่อ:",
    contactCta: "ติดต่อ BIRSA",
  },
};

/**
 * Builds "Kept for up to two years, counted from the day we receive it, then
 * deleted automatically." from the three parts in the locale's copy.
 *
 * The joins are per-locale rather than hard-coded because Thai does not
 * punctuate this sentence the way English does: it takes no comma, and
 * นับแต่ runs straight into the phrase that follows it with no space. Joining
 * with a literal ", " produced "นับแต่ วันที่ได้รับข้อมูล, จากนั้น...", which
 * is visibly wrong to a Thai reader.
 */
function retentionSentence(t: Labels, activity: (typeof activities)[number]): string {
  const triggerLabel = t.retentionTriggerLabels[activity.retentionTrigger];
  return `${t.retentionPrefix}${t.retentionTriggerJoin}${triggerLabel}${t.retentionSuffixJoin}${t.retentionSuffix}`;
}

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = content[locale];

  return (
    <>
      <PageHeader
        title={t.title}
        lede={t.lede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[{ label: dict.site.name, href: "/" }, { label: t.title }]}
          />
        }
      />
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-10 py-10">
        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.controllerTitle}</h2>
          <p className="text-muted leading-relaxed">{t.controllerBody}</p>
          <p className="text-muted leading-relaxed">
            {t.controllerAddressLabel} {contact.address[locale]}
          </p>
          <p className="text-muted leading-relaxed">
            {t.controllerEmailLabel} <Email address={contact.email} className="text-brand-deep hover:text-brand-dark" />
            {locale === "th" ? " หรือ " : " or "}
            <Email address={contact.secondaryEmail} className="text-brand-deep hover:text-brand-dark" />
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-display text-2xl">{t.basisTitle}</h2>
          <p className="text-muted leading-relaxed">{t.basisBody1}</p>
          <p className="text-muted leading-relaxed">{t.basisBody2}</p>
          <p className="text-muted leading-relaxed">{t.basisBody3}</p>
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-2xl">{t.activitiesTitle}</h2>
            <p className="text-muted leading-relaxed">{t.activitiesIntro}</p>
          </div>
          <ul className="flex flex-col gap-6">
            {activities.map((activity) => {
              const recipients = activity.recipients
                .map((id) => processorById(id))
                .filter((p): p is NonNullable<typeof p> => Boolean(p));

              return (
                <li key={activity.id} className="border-line rounded-md border p-5">
                  <h3 className="font-display text-lg">{activity.name[locale]}</h3>

                  <dl className="mt-3 flex flex-col gap-3">
                    <div>
                      <dt className="text-ink font-semibold">{t.purposeLabel}</dt>
                      <dd className="text-muted leading-relaxed">{activity.purpose[locale]}</dd>
                    </div>

                    <div>
                      <dt className="text-ink font-semibold">{t.ifYouDoNotLabel}</dt>
                      <dd className="text-muted leading-relaxed">{activity.ifYouDoNot[locale]}</dd>
                    </div>

                    <div>
                      <dt className="text-ink font-semibold">{t.collectsLabel}</dt>
                      <dd>
                        <ul className="text-muted flex list-disc flex-col gap-1 pl-5 leading-relaxed">
                          {activity.collects.map((item) => (
                            <li key={item[locale]}>{item[locale]}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>

                    <div>
                      <dt className="text-ink font-semibold">{t.recipientsLabel}</dt>
                      <dd className="text-muted leading-relaxed">
                        {recipients.length === 0
                          ? t.noRecipients
                          : recipients
                              .map((p) => `${p.name} (${p.role[locale]})`)
                              .join(locale === "th" ? " และ " : ", ")}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-ink font-semibold">{t.retentionLabel}</dt>
                      <dd className="text-muted leading-relaxed">
                        {retentionSentence(t, activity)}
                        {activity.retentionNote ? ` ${activity.retentionNote[locale]}` : ""}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-ink font-semibold">
                        {t.legalBasisPrefix} {activity.basis.section}
                      </dt>
                      <dd className="text-muted leading-relaxed">
                        {t.legalBasisOfAct} {activity.basis.label[locale]}
                      </dd>
                    </div>
                  </dl>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.retentionTitle}</h2>
          <p className="text-muted leading-relaxed">{t.retentionBody1}</p>
          <p className="text-muted leading-relaxed">{t.retentionBody2}</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.transferTitle}</h2>
          <p className="text-muted leading-relaxed">{t.transferBody1}</p>
          <p className="text-muted leading-relaxed">{t.transferBody2}</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.automatedTitle}</h2>
          <p className="text-muted leading-relaxed">{t.automatedBody}</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.noAdsTitle}</h2>
          <p className="text-muted leading-relaxed">{t.noAdsBody}</p>
        </section>

        <section id="your-rights" className="flex scroll-mt-24 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-2xl">{t.rightsTitle}</h2>
            <p className="text-muted leading-relaxed">{t.rightsIntro}</p>
          </div>
          <dl className="flex flex-col gap-3">
            {dataRights.map((right) => (
              <div key={right.id}>
                <dt className="text-ink font-semibold">
                  {right.name[locale]}{" "}
                  <span className="text-muted font-normal">
                    ({t.rightsSectionLabel} {right.section})
                  </span>
                </dt>
                <dd className="text-muted leading-relaxed">{right.description[locale]}</dd>
              </div>
            ))}
          </dl>
          <p className="text-muted leading-relaxed">{t.rightsResponseNote}</p>
          <p>
            <Link
              href={localeHref(locale, "/privacy/your-data")}
              className="text-brand-deep hover:text-brand-dark font-semibold underline"
            >
              {t.rightsCta}
            </Link>
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-2xl">{t.linksTitle}</h2>
            <p className="text-muted leading-relaxed">{t.linksIntro}</p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-3">
            <li className="border-line rounded-md border p-4">
              <h3 className="text-ink font-semibold">{t.cookiesLinkTitle}</h3>
              <p className="text-muted mt-1 text-sm leading-relaxed">{t.cookiesLinkBody}</p>
              <Link
                href={localeHref(locale, "/privacy/cookies")}
                className="text-brand-deep hover:text-brand-dark mt-2 inline-block text-sm font-semibold underline"
              >
                {t.cookiesLinkCta}
              </Link>
            </li>
            <li className="border-line rounded-md border p-4">
              <h3 className="text-ink font-semibold">{t.recordLinkTitle}</h3>
              <p className="text-muted mt-1 text-sm leading-relaxed">{t.recordLinkBody}</p>
              <Link
                href={localeHref(locale, "/privacy/processing-record")}
                className="text-brand-deep hover:text-brand-dark mt-2 inline-block text-sm font-semibold underline"
              >
                {t.recordLinkCta}
              </Link>
            </li>
            <li className="border-line rounded-md border p-4">
              <h3 className="text-ink font-semibold">{t.yourDataLinkTitle}</h3>
              <p className="text-muted mt-1 text-sm leading-relaxed">{t.yourDataLinkBody}</p>
              <Link
                href={localeHref(locale, "/privacy/your-data")}
                className="text-brand-deep hover:text-brand-dark mt-2 inline-block text-sm font-semibold underline"
              >
                {t.yourDataLinkCta}
              </Link>
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <p className="text-muted leading-relaxed">
            {t.contactIntro}{" "}
            <Link
              href={localeHref(locale, "/contact")}
              className="text-brand-deep hover:text-brand-dark font-semibold underline"
            >
              {t.contactCta}
            </Link>
            {locale === "th"
              ? ` หรืออีเมล ${contact.email} หรือ ${contact.secondaryEmail}`
              : ` or email ${contact.email} or ${contact.secondaryEmail}.`}
          </p>
        </section>
      </div>
    </>
  );
}
