import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import Email from "@/components/bds/Email";
import { Wrap, Stack, Section } from "@/components/bds/Layout";
import PageHeader from "@/components/bds/PageHeader";
import { Heading, Text } from "@/components/bds/Type";
import { contact } from "@/content/site";
import {
  activities,
  dataRights,
  processorById,
  type RetentionTrigger,
} from "@/content/privacy/register";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

/**
 * `/privacy`: the plain-language privacy notice (ROUTE-MAP-2.0 Wave 5F,
 * BUILD-BRIEF-2.0 §8).
 *
 * EVERY FACT ON THIS PAGE COMES FROM `content/privacy/register.ts`, never
 * from prose written here. The `activities`, `dataRights` and
 * `processorById` loops below are the whole page's factual content; the
 * strings in `content` are labels and connective sentences only, never a
 * restated fact the register already carries (a retention period, a lawful
 * basis section number, what is collected). Changing a fixture in the
 * register changes what this page says, because there is no second copy of
 * any of it sitting in this file to fall out of step.
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
  retentionTriggerJoin: string;
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
    lede: "A plain language notice of what this site collects, why, how long we keep it, and the rights you have over it.",

    controllerTitle: "Who runs this site",
    controllerBody:
      "BIRSA (the BIR Student Association), the student association of the BIR programme, Faculty of Political Science, Thammasat University, is the data controller for this site. It decides what data is collected and why.",
    controllerAddressLabel: "Address",
    controllerEmailLabel: "Email",

    basisTitle: "Why we do not ask for your consent",
    basisBody1:
      "Almost nothing on this site runs on your consent. We rely on two other grounds in the Personal Data Protection Act instead. Section 24(3), because you have asked us to do something for you, and section 24(5), where we have a legitimate interest, such as running the equipment loan service fairly for everyone.",
    basisBody2:
      "This matters in practice. The age of majority in Thailand is twenty, so most first year students are minors, and a minor's consent normally needs a guardian's consent too, under section 20 of the Act. Because we do not rely on consent for these activities, that requirement never comes up for them. Borrowing club equipment is, in any case, something a minor can decide for themselves. Section 24 of the Civil and Commercial Code lets a minor carry out an act that suits their condition in life and is reasonably needed to meet their ordinary needs, and returning a borrowed camera or tent fits that description.",
    basisBody3:
      "Publishing a photograph of an identifiable person is the one thing on this site that does run on consent, listed among the activities below. If we ever add another feature that is genuinely optional and not needed to run a service you asked for, we will ask for your consent separately, in plain language, and you will be free to say no. See withdraw consent among your rights below.",

    activitiesTitle: "What we collect, and why",
    activitiesIntro:
      "This is every place on this site where we collect personal data. For each one, we say why we collect it, whether you have to give it, what we collect, our legal basis, who else sees it, and how long we keep it.",
    purposeLabel: "Why we collect it",
    ifYouDoNotLabel: "Do you have to give this",
    collectsLabel: "What we collect",
    legalBasisPrefix: "Legal basis, section",
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
      "Some of the outside providers we use are not based in Thailand. See our record of processing activities, linked below, for exactly which ones, what they receive, and where they are based. Thailand's Personal Data Protection Committee has not found any of those countries to give an adequate level of protection, and we do not claim it has.",
    transferBody2:
      "Instead, we rely on section 28(3) of the Act. The transfer is necessary to perform a contract with you, or to take steps you have asked for before entering one, for example sending you an email or running the equipment loan you requested. Each provider's data processing agreement also carries the safeguards required under section 29, paragraph 3, of the Act.",

    automatedTitle: "Automated decisions",
    automatedBody:
      "When you ask to borrow equipment, the system automatically checks whether the item is free and whether your account is blocked or already at its loan limit, and stops an invalid request there. It never decides on its own whether to approve or reject a request. A BIRSA officer makes that decision every time.",

    noAdsTitle: "No ads, no selling your data",
    noAdsBody:
      "We do not run advertising on this site, and we never sell or trade your data. The providers named in our record of processing activities only ever act on our instructions, for the purposes described there, and never for their own purposes.",

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
    cookiesLinkBody: "Every cookie this site sets, what it is for, and how long it lasts.",
    cookiesLinkCta: "Read about cookies",
    recordLinkTitle: "Record of processing activities",
    recordLinkBody:
      "The formal record required by section 39 of the Act, including our security measures and how we handle a data breach.",
    recordLinkCta: "Read the record",
    yourDataLinkTitle: "Your data",
    yourDataLinkBody: "Ask to see, correct, delete, or get a copy of your data.",
    yourDataLinkCta: "Manage your data",

    contactIntro: "Questions about this notice, or about your data? Get in touch.",
    contactCta: "Contact BIRSA",
  },
  th: {
    title: "ประกาศความเป็นส่วนตัว",
    lede: "ประกาศฉบับนี้ชี้แจงว่าเว็บไซต์นี้เก็บรวบรวมข้อมูลส่วนบุคคลใด เพื่อวัตถุประสงค์ใด เก็บรักษาไว้เป็นระยะเวลาเท่าใด และท่านมีสิทธิใดบ้างเหนือข้อมูลดังกล่าว",

    controllerTitle: "ผู้ควบคุมข้อมูลส่วนบุคคล",
    controllerBody:
      "BIRSA (สโมสรนักศึกษาหลักสูตร BIR) หลักสูตรการเมืองและการระหว่างประเทศ (BIR) คณะรัฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์ เป็นผู้ควบคุมข้อมูลส่วนบุคคลของเว็บไซต์นี้ กล่าวคือ เป็นผู้มีอำนาจตัดสินใจเกี่ยวกับการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคล",
    controllerAddressLabel: "ที่อยู่",
    controllerEmailLabel: "อีเมล",

    basisTitle: "เหตุใด BIRSA จึงมิได้ขอความยินยอมจากท่าน",
    basisBody1:
      "การดำเนินการเกือบทั้งหมดบนเว็บไซต์นี้มิได้อาศัยความยินยอมของท่าน แต่อาศัยฐานทางกฎหมายอื่นตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 สองประการ ได้แก่ มาตรา 24(3) ความจำเป็นเพื่อการปฏิบัติตามสัญญาซึ่งท่านเป็นคู่สัญญา หรือเพื่อดำเนินการตามคำขอของท่านก่อนเข้าทำสัญญานั้น และมาตรา 24(5) ความจำเป็นเพื่อประโยชน์โดยชอบด้วยกฎหมายของ BIRSA เช่น การดูแลบริการยืมอุปกรณ์ให้เป็นธรรมแก่ผู้ใช้บริการทุกราย",
    basisBody2:
      "ข้อนี้มีนัยสำคัญในทางปฏิบัติ เนื่องจากบุคคลย่อมบรรลุนิติภาวะเมื่อมีอายุยี่สิบปีบริบูรณ์ตามกฎหมายไทย นักศึกษาชั้นปีที่หนึ่งส่วนใหญ่จึงยังเป็นผู้เยาว์ และโดยหลักแล้วการขอความยินยอมจากผู้เยาว์ต้องได้รับความยินยอมจากผู้ใช้อำนาจปกครองด้วย ตามมาตรา 20 แห่งพระราชบัญญัติดังกล่าว เมื่อ BIRSA มิได้อาศัยความยินยอมเป็นฐานในการประมวลผลกิจกรรมเหล่านี้ กรณีจึงไม่ตกอยู่ภายใต้บังคับของบทบัญญัติดังกล่าว อนึ่ง การยืมอุปกรณ์ของชมรมเป็นการอันผู้เยาว์อาจกระทำได้โดยลำพัง เนื่องจากเป็นการสมแก่ฐานานุรูปและจำเป็นในการดำรงชีพตามสมควร ตามมาตรา 24 แห่งประมวลกฎหมายแพ่งและพาณิชย์",
    basisBody3:
      "สิ่งเดียวบนเว็บไซต์นี้ที่อาศัยความยินยอมของท่านคือการเผยแพร่ภาพถ่ายที่ระบุตัวบุคคลได้ ซึ่งปรากฏอยู่ในรายการกิจกรรมด้านล่าง หาก BIRSA เพิ่มบริการอื่นซึ่งเป็นทางเลือกโดยแท้ และมิได้มีความจำเป็นต่อการให้บริการตามที่ท่านร้องขอ BIRSA จะขอความยินยอมจากท่านแยกต่างหากโดยชัดแจ้ง ด้วยข้อความที่เข้าถึงได้ง่ายและเข้าใจได้ และท่านมีอิสระที่จะปฏิเสธ ทั้งนี้ โปรดดูหัวข้อสิทธิขอถอนความยินยอมในรายการสิทธิด้านล่าง",

    activitiesTitle: "ข้อมูลส่วนบุคคลที่เก็บรวบรวมและวัตถุประสงค์",
    activitiesIntro:
      "รายการต่อไปนี้คือกิจกรรมทั้งหมดบนเว็บไซต์นี้ที่มีการเก็บรวบรวมข้อมูลส่วนบุคคล โดยแต่ละรายการระบุวัตถุประสงค์ในการเก็บรวบรวม ข้อมูลที่ต้องกรอกและผลของการไม่ให้ข้อมูล ข้อมูลที่เก็บรวบรวม ฐานทางกฎหมาย ผู้รับข้อมูล และระยะเวลาการเก็บรักษา",
    purposeLabel: "วัตถุประสงค์ในการเก็บรวบรวม",
    ifYouDoNotLabel: "ข้อมูลที่ต้องกรอกและผลของการไม่ให้ข้อมูล",
    collectsLabel: "ข้อมูลส่วนบุคคลที่เก็บรวบรวม",
    legalBasisPrefix: "ฐานทางกฎหมาย มาตรา",
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
      "ผู้ให้บริการภายนอกบางรายที่ BIRSA ใช้บริการมิได้ตั้งอยู่ในราชอาณาจักร โปรดดูบันทึกรายการกิจกรรมการประมวลผลข้อมูลส่วนบุคคลตามลิงก์ด้านล่าง เพื่อทราบว่ามีรายใดบ้าง ได้รับข้อมูลใด และตั้งอยู่ประเทศใด คณะกรรมการคุ้มครองข้อมูลส่วนบุคคลยังมิได้ประกาศกำหนดว่าประเทศปลายทางเหล่านั้นมีมาตรฐานการคุ้มครองข้อมูลส่วนบุคคลที่เพียงพอ และ BIRSA มิได้กล่าวอ้างเช่นนั้น",
    transferBody2:
      "การส่งหรือโอนข้อมูลดังกล่าวจึงอาศัยข้อยกเว้นตามมาตรา 28(3) แห่งพระราชบัญญัติ กล่าวคือ เป็นการจำเป็นเพื่อการปฏิบัติตามสัญญาซึ่งท่านเป็นคู่สัญญา หรือเพื่อดำเนินการตามคำขอของท่านก่อนเข้าทำสัญญานั้น เช่น การจัดส่งอีเมลถึงท่าน หรือการดำเนินการตามคำขอยืมอุปกรณ์ นอกจากนี้ ข้อตกลงการประมวลผลข้อมูลส่วนบุคคลของผู้ให้บริการแต่ละรายยังได้จัดให้มีมาตรการคุ้มครองที่เหมาะสมตามมาตรา 29 วรรคสาม แห่งพระราชบัญญัติด้วย",

    automatedTitle: "การตัดสินใจโดยระบบอัตโนมัติ",
    automatedBody:
      "เมื่อท่านยื่นคำขอยืมอุปกรณ์ ระบบจะตรวจสอบโดยอัตโนมัติว่าอุปกรณ์ว่างหรือไม่ และบัญชีของท่านถูกระงับสิทธิหรือครบโควตาการยืมแล้วหรือไม่ และจะระงับคำขอที่ไม่เป็นไปตามเงื่อนไขไว้ตั้งแต่ขั้นตอนดังกล่าว ทั้งนี้ ระบบมิได้อนุมัติหรือปฏิเสธคำขอโดยอัตโนมัติแต่อย่างใด การพิจารณาคำขอทุกรายการกระทำโดยเจ้าหน้าที่ BIRSA เสมอ",

    noAdsTitle: "ไม่มีการโฆษณาและไม่มีการจำหน่ายข้อมูล",
    noAdsBody:
      "เว็บไซต์นี้ไม่มีการโฆษณา และ BIRSA ไม่จำหน่ายหรือแลกเปลี่ยนข้อมูลส่วนบุคคลของท่านแก่บุคคลใด ผู้ให้บริการที่ระบุไว้ในบันทึกรายการกิจกรรมการประมวลผลข้อมูลส่วนบุคคลดำเนินการตามคำสั่งของ BIRSA เท่านั้น เพื่อวัตถุประสงค์ที่ระบุไว้ในบันทึกนั้น โดยมิได้นำไปใช้เพื่อประโยชน์ของตนเอง",

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
      "หากท่านมีข้อสงสัยเกี่ยวกับประกาศฉบับนี้ หรือเกี่ยวกับข้อมูลส่วนบุคคลของท่าน โปรดติดต่อ BIRSA",
    contactCta: "ติดต่อ BIRSA",
  },
};

/**
 * Builds "Kept for up to two years, counted from the day we receive it, then
 * deleted automatically." from the three parts in the locale's copy.
 *
 * The joins are per-locale rather than hard coded because Thai does not
 * punctuate this sentence the way English does. It takes no comma, and
 * นับแต่ runs straight into the phrase that follows it with no space.
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
        helpSlot={
          <Button href={localeHref(locale, "/contact")} variant="secondary">
            {dict.actions.contactUs}
          </Button>
        }
      />
      <Wrap className="flex max-w-[var(--measure)] flex-col gap-10 py-10">
        <Section as="div">
          <Stack gap="xs">
            <Heading level={2}>{t.controllerTitle}</Heading>
            <Text step="body" className="text-muted">
              {t.controllerBody}
            </Text>
            <Text step="body" className="text-muted">
              {t.controllerAddressLabel} {contact.address[locale]}
            </Text>
            <Text step="body" className="text-muted">
              {t.controllerEmailLabel}{" "}
              <Email address={contact.email} className="text-brand-deep hover:text-brand-dark" />
              {locale === "th" ? " หรือ " : " or "}
              <Email
                address={contact.secondaryEmail}
                className="text-brand-deep hover:text-brand-dark"
              />
            </Text>
          </Stack>
        </Section>

        <Section as="div">
          <Stack gap="sm">
            <Heading level={2}>{t.basisTitle}</Heading>
            <Text step="body" className="text-muted">
              {t.basisBody1}
            </Text>
            <Text step="body" className="text-muted">
              {t.basisBody2}
            </Text>
            <Text step="body" className="text-muted">
              {t.basisBody3}
            </Text>
          </Stack>
        </Section>

        <Section as="div">
          <Stack gap="lg">
            <Stack gap="xs">
              <Heading level={2}>{t.activitiesTitle}</Heading>
              <Text step="body" className="text-muted">
                {t.activitiesIntro}
              </Text>
            </Stack>
            <Stack as="ul" gap="lg">
              {activities.map((activity) => {
                const recipients = activity.recipients
                  .map((id) => processorById(id))
                  .filter((p): p is NonNullable<typeof p> => Boolean(p));

                return (
                  <li key={activity.id} className="rounded-md border border-line p-5">
                    <Heading level={3}>{activity.name[locale]}</Heading>

                    <dl className="mt-3 flex flex-col gap-3">
                      <div>
                        <Text as="dt" step="body" className="font-semibold text-ink">
                          {t.purposeLabel}
                        </Text>
                        <Text as="dd" step="body" className="text-muted">
                          {activity.purpose[locale]}
                        </Text>
                      </div>

                      <div>
                        <Text as="dt" step="body" className="font-semibold text-ink">
                          {t.ifYouDoNotLabel}
                        </Text>
                        <Text as="dd" step="body" className="text-muted">
                          {activity.ifYouDoNot[locale]}
                        </Text>
                      </div>

                      <div>
                        <Text as="dt" step="body" className="font-semibold text-ink">
                          {t.collectsLabel}
                        </Text>
                        <dd>
                          <Stack as="ul" gap="2xs" className="list-disc pl-5">
                            {activity.collects.map((item) => (
                              <Text as="li" step="body" key={item[locale]} className="text-muted">
                                {item[locale]}
                              </Text>
                            ))}
                          </Stack>
                        </dd>
                      </div>

                      <div>
                        <Text as="dt" step="body" className="font-semibold text-ink">
                          {t.recipientsLabel}
                        </Text>
                        <Text as="dd" step="body" className="text-muted">
                          {recipients.length === 0
                            ? t.noRecipients
                            : recipients
                                .map((p) => `${p.name} (${p.role[locale]})`)
                                .join(locale === "th" ? " และ " : ", ")}
                        </Text>
                      </div>

                      <div>
                        <Text as="dt" step="body" className="font-semibold text-ink">
                          {t.retentionLabel}
                        </Text>
                        <Text as="dd" step="body" className="text-muted">
                          {retentionSentence(t, activity)}
                          {activity.retentionNote ? ` ${activity.retentionNote[locale]}` : ""}
                        </Text>
                      </div>

                      <div>
                        <Text as="dt" step="body" className="font-semibold text-ink">
                          {t.legalBasisPrefix} {activity.basis.section}
                        </Text>
                        <Text as="dd" step="body" className="text-muted">
                          {t.legalBasisOfAct} {activity.basis.label[locale]}
                        </Text>
                      </div>
                    </dl>
                  </li>
                );
              })}
            </Stack>
          </Stack>
        </Section>

        <Section as="div">
          <Stack gap="xs">
            <Heading level={2}>{t.retentionTitle}</Heading>
            <Text step="body" className="text-muted">
              {t.retentionBody1}
            </Text>
            <Text step="body" className="text-muted">
              {t.retentionBody2}
            </Text>
          </Stack>
        </Section>

        <Section as="div">
          <Stack gap="xs">
            <Heading level={2}>{t.transferTitle}</Heading>
            <Text step="body" className="text-muted">
              {t.transferBody1}
            </Text>
            <Text step="body" className="text-muted">
              {t.transferBody2}
            </Text>
          </Stack>
        </Section>

        <Section as="div">
          <Stack gap="xs">
            <Heading level={2}>{t.automatedTitle}</Heading>
            <Text step="body" className="text-muted">
              {t.automatedBody}
            </Text>
          </Stack>
        </Section>

        <Section as="div">
          <Stack gap="xs">
            <Heading level={2}>{t.noAdsTitle}</Heading>
            <Text step="body" className="text-muted">
              {t.noAdsBody}
            </Text>
          </Stack>
        </Section>

        <div id="your-rights" className="scroll-mt-24">
          <Section as="div">
            <Stack gap="md">
              <Stack gap="xs">
                <Heading level={2}>{t.rightsTitle}</Heading>
                <Text step="body" className="text-muted">
                  {t.rightsIntro}
                </Text>
              </Stack>
              <dl className="flex flex-col gap-3">
                {dataRights.map((right) => (
                  <div key={right.id}>
                    <Text as="dt" step="body" className="font-semibold text-ink">
                      {right.name[locale]}{" "}
                      <Text as="span" step="body" className="font-normal text-muted">
                        ({t.rightsSectionLabel} {right.section})
                      </Text>
                    </Text>
                    <Text as="dd" step="body" className="text-muted">
                      {right.description[locale]}
                    </Text>
                  </div>
                ))}
              </dl>
              <Text step="body" className="text-muted">
                {t.rightsResponseNote}
              </Text>
              <div>
                <Link
                  href={localeHref(locale, "/privacy/your-data")}
                  className="font-semibold text-brand-deep underline hover:text-brand-dark"
                >
                  {t.rightsCta}
                </Link>
              </div>
            </Stack>
          </Section>
        </div>

        <Section as="div">
          <Stack gap="md">
            <Stack gap="xs">
              <Heading level={2}>{t.linksTitle}</Heading>
              <Text step="body" className="text-muted">
                {t.linksIntro}
              </Text>
            </Stack>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-md border border-line p-4">
                <Text as="p" step="body" className="font-semibold text-ink">
                  {t.cookiesLinkTitle}
                </Text>
                <Text as="p" step="body-sm" className="mt-1 text-muted">
                  {t.cookiesLinkBody}
                </Text>
                <Link
                  href={localeHref(locale, "/privacy/cookies")}
                  className="mt-2 inline-block font-semibold text-brand-deep underline hover:text-brand-dark"
                >
                  <Text as="span" step="body-sm">
                    {t.cookiesLinkCta}
                  </Text>
                </Link>
              </div>
              <div className="rounded-md border border-line p-4">
                <Text as="p" step="body" className="font-semibold text-ink">
                  {t.recordLinkTitle}
                </Text>
                <Text as="p" step="body-sm" className="mt-1 text-muted">
                  {t.recordLinkBody}
                </Text>
                <Link
                  href={localeHref(locale, "/privacy/processing-record")}
                  className="mt-2 inline-block font-semibold text-brand-deep underline hover:text-brand-dark"
                >
                  <Text as="span" step="body-sm">
                    {t.recordLinkCta}
                  </Text>
                </Link>
              </div>
              <div className="rounded-md border border-line p-4">
                <Text as="p" step="body" className="font-semibold text-ink">
                  {t.yourDataLinkTitle}
                </Text>
                <Text as="p" step="body-sm" className="mt-1 text-muted">
                  {t.yourDataLinkBody}
                </Text>
                <Link
                  href={localeHref(locale, "/privacy/your-data")}
                  className="mt-2 inline-block font-semibold text-brand-deep underline hover:text-brand-dark"
                >
                  <Text as="span" step="body-sm">
                    {t.yourDataLinkCta}
                  </Text>
                </Link>
              </div>
            </div>
          </Stack>
        </Section>

        <Section as="div">
          <Text step="body" className="text-muted">
            {t.contactIntro}{" "}
            <Link
              href={localeHref(locale, "/contact")}
              className="font-semibold text-brand-deep underline hover:text-brand-dark"
            >
              {t.contactCta}
            </Link>
            {locale === "th"
              ? ` หรืออีเมล ${contact.email} หรือ ${contact.secondaryEmail}`
              : ` or email ${contact.email} or ${contact.secondaryEmail}.`}
          </Text>
        </Section>
      </Wrap>
    </>
  );
}
