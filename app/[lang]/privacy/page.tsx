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
    title: "ความเป็นส่วนตัว",
    lede: "ประกาศฉบับนี้อธิบายว่าเว็บไซต์นี้เก็บข้อมูลอะไร เพราะเหตุใด เก็บไว้นานเท่าไร และคุณมีสิทธิอะไรเหนือข้อมูลนั้นบ้าง เขียนด้วยภาษาที่เข้าใจง่าย",

    controllerTitle: "ผู้ดูแลเว็บไซต์นี้",
    controllerBody:
      "BIRSA (สโมสรนักศึกษาหลักสูตร BIR) หลักสูตรการเมืองและการระหว่างประเทศ (BIR) คณะรัฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์ เป็นผู้ควบคุมข้อมูลของเว็บไซต์นี้ เป็นผู้กำหนดว่าจะเก็บข้อมูลอะไรและเพราะเหตุใด",
    controllerAddressLabel: "ที่อยู่:",
    controllerEmailLabel: "อีเมล:",

    basisTitle: "เหตุใดเราจึงไม่ขอความยินยอมจากคุณ",
    basisBody1:
      "แทบทุกส่วนของเว็บไซต์นี้ไม่ได้อาศัยความยินยอมของคุณเลย เราใช้ฐานทางกฎหมายอีกสองข้อในพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคลแทน คือมาตรา 24(3) เพราะคุณร้องขอให้เราดำเนินการบางอย่างให้ และมาตรา 24(5) ในกรณีที่เรามีประโยชน์โดยชอบด้วยกฎหมาย เช่น การดูแลบริการยืมอุปกรณ์ให้เป็นธรรมกับทุกคน",
    basisBody2:
      "เรื่องนี้มีความหมายจริงในทางปฏิบัติ เพราะบุคคลบรรลุนิติภาวะเมื่ออายุครบยี่สิบปีตามกฎหมายไทย นักศึกษาชั้นปีที่หนึ่งส่วนใหญ่จึงยังเป็นผู้เยาว์ และตามปกติความยินยอมของผู้เยาว์ต้องได้รับความยินยอมจากผู้ปกครองด้วยตามมาตรา 20 ของพระราชบัญญัติ เมื่อเราไม่ได้อาศัยความยินยอมเป็นฐาน ข้อกำหนดนี้จึงไม่เกี่ยวข้องกับเรา และไม่ว่าอย่างไร การยืมอุปกรณ์ของชมรมก็เป็นสิ่งที่ผู้เยาว์ตัดสินใจได้เอง เพราะมาตรา 24 แห่งประมวลกฎหมายแพ่งและพาณิชย์ ให้ผู้เยาว์ทำนิติกรรมที่จำเป็นในการดำรงชีพตามสมควรแก่ฐานานุรูปได้ด้วยตนเอง ซึ่งการยืมและคืนกล้องหรือเต็นท์ของชมรมเข้าข่ายเช่นนั้น",
    basisBody3:
      "หากในอนาคตเราเพิ่มฟีเจอร์ที่เป็นทางเลือกจริง ๆ และไม่จำเป็นต่อการให้บริการที่คุณร้องขอ เราจะขอความยินยอมจากคุณแยกต่างหาก ด้วยภาษาที่เข้าใจง่าย และคุณปฏิเสธได้เสมอ ดูหัวข้อ \"ขอถอนความยินยอม\" ในรายการสิทธิของคุณด้านล่าง",

    activitiesTitle: "ข้อมูลที่เราเก็บ และเหตุผล",
    activitiesIntro:
      "นี่คือทุกจุดบนเว็บไซต์นี้ที่เราเก็บข้อมูลส่วนบุคคล แต่ละจุดเราจะบอกว่าเก็บเพราะอะไร คุณต้องกรอกหรือไม่ เก็บอะไรบ้าง ใช้ฐานทางกฎหมายใด ใครอื่นเห็นข้อมูลนี้บ้าง และเก็บไว้นานเท่าไร",
    purposeLabel: "เหตุผลที่เราเก็บ",
    ifYouDoNotLabel: "คุณต้องกรอกข้อมูลนี้หรือไม่",
    collectsLabel: "ข้อมูลที่เราเก็บ",
    legalBasisPrefix: "ฐานทางกฎหมาย: มาตรา",
    legalBasisOfAct: "แห่งพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล",
    recipientsLabel: "ใครอื่นเห็นข้อมูลนี้บ้าง",
    noRecipients: "ไม่มีใครนอกจาก BIRSA",
    retentionLabel: "เก็บไว้นานเท่าไร",
    retentionPrefix: "เก็บไว้ไม่เกินสองปี นับจาก",
    retentionSuffix: "จากนั้นจะถูกลบโดยอัตโนมัติ",
    retentionTriggerLabels: {
      created: "วันที่เราได้รับข้อมูล",
      closed: "วันที่รายการนั้นสิ้นสุด",
      "last-active": "ครั้งล่าสุดที่มีการเปลี่ยนแปลงข้อมูล",
    },

    retentionTitle: "สรุประยะเวลาที่เราเก็บข้อมูล",
    retentionBody1:
      "ข้อมูลส่วนบุคคลทุกประเภทบนเว็บไซต์นี้เก็บไว้ไม่เกินสองปี แล้วจะถูกลบโดยอัตโนมัติ สิ่งที่ต่างกันคือจุดเริ่มนับเวลา ซึ่งระบุไว้แยกตามแต่ละกิจกรรมด้านบน",
    retentionBody2:
      "สำหรับการยืมอุปกรณ์ ระยะเวลาสองปีเริ่มนับจากวันที่รายการยืมสิ้นสุด ไม่ใช่วันที่คุณยื่นคำขอ รายการที่ยังเปิดอยู่จะไม่ถูกลบไม่ว่าจะเก่าแค่ไหน กฎการลบข้อมูลฉบับเต็มอยู่ในบันทึกรายการกิจกรรมการประมวลผลข้อมูล ซึ่งมีลิงก์อยู่ด้านล่าง",

    transferTitle: "การส่งข้อมูลของคุณออกนอกประเทศไทย",
    transferBody1:
      "ผู้ให้บริการภายนอกบางรายที่เราใช้ไม่ได้ตั้งอยู่ในประเทศไทย Resend ซึ่งส่งอีเมลของเรา และ Vercel ซึ่งโฮสต์เว็บไซต์นี้และฐานข้อมูล ต่างตั้งอยู่ในสหรัฐอเมริกา ส่วน OpenStreetMap ซึ่งให้บริการแผนที่บนเว็บไซต์นี้ ตั้งอยู่ในสหราชอาณาจักร คณะกรรมการคุ้มครองข้อมูลส่วนบุคคลของไทยยังไม่ได้ประกาศว่าประเทศใดในสองประเทศนี้มีมาตรฐานคุ้มครองข้อมูลที่เพียงพอ และเราไม่ได้อ้างว่ามี",
    transferBody2:
      "เราจึงอาศัยมาตรา 28(3) ของพระราชบัญญัติแทน คือการส่งข้อมูลนี้จำเป็นเพื่อปฏิบัติตามสัญญากับคุณ หรือเพื่อดำเนินการตามที่คุณร้องขอก่อนเข้าทำสัญญา เช่น การส่งอีเมลถึงคุณ หรือการดำเนินการยืมอุปกรณ์ที่คุณร้องขอ นอกจากนี้ ข้อตกลงประมวลผลข้อมูลของผู้ให้บริการแต่ละรายยังมีมาตรการคุ้มครองตามที่มาตรา 29 วรรคสาม ของพระราชบัญญัติกำหนดไว้ด้วย",

    automatedTitle: "การตัดสินใจอัตโนมัติ",
    automatedBody:
      "เมื่อคุณขอยืมอุปกรณ์ ระบบจะตรวจสอบอัตโนมัติว่าอุปกรณ์ว่างหรือไม่ และบัญชีของคุณถูกระงับหรือครบโควตาการยืมหรือไม่ และจะหยุดคำขอที่ไม่ถูกต้องไว้ตั้งแต่ขั้นตอนนี้ ระบบไม่เคยตัดสินใจอนุมัติหรือปฏิเสธคำขอด้วยตัวเอง เจ้าหน้าที่ BIRSA เป็นผู้ตัดสินใจทุกคำขอเสมอ",

    noAdsTitle: "ไม่มีโฆษณา ไม่ขายข้อมูลของคุณ",
    noAdsBody:
      "เว็บไซต์นี้ไม่มีการลงโฆษณา และเราไม่ขายหรือแลกเปลี่ยนข้อมูลของคุณกับใคร ผู้ให้บริการที่ระบุไว้ในหน้านี้ทำงานตามคำสั่งของเราเท่านั้น เพื่อวัตถุประสงค์ที่ระบุไว้ในหน้านี้ ไม่เคยนำไปใช้เพื่อประโยชน์ของตนเอง",

    rightsTitle: "สิทธิของคุณ",
    rightsIntro:
      "พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคลให้สิทธิเหล่านี้แก่คุณเหนือข้อมูลที่เราเก็บไว้ คุณใช้สิทธิใดก็ได้โดยติดต่อเรา",
    rightsResponseNote: "หากคุณขอดูข้อมูลของคุณ เรามีเวลาสามสิบวันในการตอบกลับ ตามมาตรา 30 ของพระราชบัญญัติ",
    rightsSectionLabel: "มาตรา",
    rightsCta: "ใช้สิทธิของคุณ",

    linksTitle: "รายละเอียดเพิ่มเติม",
    linksIntro:
      "หน้านี้เป็นบทสรุปที่เขียนด้วยภาษาที่เข้าใจง่าย ยังมีอีกสามหน้าที่ลงรายละเอียดมากขึ้น และทั้งสามหน้าสร้างจากข้อมูลชุดเดียวกับที่ใช้ในหน้านี้ จึงไม่มีทางขัดแย้งกับหน้านี้",
    cookiesLinkTitle: "คุกกี้",
    cookiesLinkBody: "คุกกี้ทุกตัวที่เว็บไซต์นี้ตั้งค่า ใช้ทำอะไร และอยู่ได้นานเท่าไร",
    cookiesLinkCta: "อ่านเรื่องคุกกี้",
    recordLinkTitle: "บันทึกรายการกิจกรรมการประมวลผลข้อมูล",
    recordLinkBody: "บันทึกที่มาตรา 39 ของพระราชบัญญัติกำหนดให้ต้องมี รวมถึงมาตรการรักษาความมั่นคงปลอดภัยและวิธีจัดการเมื่อข้อมูลรั่วไหล",
    recordLinkCta: "อ่านบันทึกฉบับเต็ม",
    yourDataLinkTitle: "ข้อมูลของคุณ",
    yourDataLinkBody: "ขอดู แก้ไข ลบ หรือขอสำเนาข้อมูลของคุณ",
    yourDataLinkCta: "จัดการข้อมูลของคุณ",

    contactIntro: "มีคำถามเกี่ยวกับประกาศนี้ หรือเกี่ยวกับข้อมูลของคุณ ติดต่อเรา:",
    contactCta: "ติดต่อ BIRSA",
  },
};

function retentionSentence(t: Labels, activity: (typeof activities)[number]): string {
  const triggerLabel = t.retentionTriggerLabels[activity.retentionTrigger];
  return `${t.retentionPrefix} ${triggerLabel}, ${t.retentionSuffix}`;
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
