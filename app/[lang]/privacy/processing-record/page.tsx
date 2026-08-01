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
  BREACH_NOTIFICATION_HOURS,
  RETENTION_YEARS,
  RIGHTS_RESPONSE_DAYS,
  activities,
  dataRights,
  processorById,
  processors,
  type RetentionTrigger,
} from "@/content/privacy/register";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const t = content[locale];

  return buildMetadata({
    locale,
    title: t.title,
    description: t.lede,
    path: "/privacy/processing-record",
  });
}

type Labels = {
  title: string;
  lede: string;
  privacyBreadcrumb: string;

  aboutTitle: string;
  aboutBody: string;

  controllerTitle: string;
  controllerBody: string;
  controllerAddressLabel: string;
  controllerEmailLabel: string;

  activitiesTitle: string;
  activitiesIntro: string;
  colCategory: string;
  colPurpose: string;
  colCollects: string;
  colBasis: string;
  colRecipients: string;
  colRetention: string;
  noRecipients: string;
  retentionYearsSuffix: string;
  retentionTriggerLabels: Record<RetentionTrigger, string>;

  processorsTitle: string;
  processorsIntro: string;
  colProcessor: string;
  colRole: string;
  colCountry: string;

  rightsTitle: string;
  rightsBody: string;
  rightsResponseNote: string;
  rightsCta: string;

  securityTitle: string;
  securityIntro: string;
  securityItems: string[];

  breachTitle: string;
  breachBody: string;

  dpoTitle: string;
  dpoBody: string;

  contactCta: string;
};

const content: Record<Locale, Labels> = {
  en: {
    title: "Record of processing activities",
    lede:
      "The formal record section 39 of the Personal Data Protection Act requires us to keep, open for you or the regulator to inspect.",
    privacyBreadcrumb: "Privacy",

    aboutTitle: "About this record",
    aboutBody:
      "This page is the structured record section 39 of the Act requires a data controller to keep. It lists what we process, why, and how, in more formal detail than the plain-language notice at /privacy. Both pages are generated from the same underlying record, so they can't drift apart or contradict each other.",

    controllerTitle: "Controller",
    controllerBody:
      "BIRSA (the BIR Student Association), the student association of the BIR programme, Faculty of Political Science, Thammasat University, is the controller for all processing listed below.",
    controllerAddressLabel: "Address:",
    controllerEmailLabel: "Email:",

    activitiesTitle: "Processing activities",
    activitiesIntro:
      "Every category of personal data this site processes, one row per activity.",
    colCategory: "Category",
    colPurpose: "Purpose",
    colCollects: "Data collected",
    colBasis: "Legal basis",
    colRecipients: "Recipients",
    colRetention: "Retention",
    noRecipients: "None outside BIRSA",
    retentionYearsSuffix: "years, from",
    retentionTriggerLabels: {
      created: "creation",
      closed: "closure",
      "last-active": "last activity",
    },

    processorsTitle: "Processors",
    processorsIntro:
      "The outside organisations that process personal data on our behalf, and where they're based.",
    colProcessor: "Processor",
    colRole: "Role",
    colCountry: "Country",

    rightsTitle: "Rights and how to access data",
    rightsBody:
      "Data subjects hold the rights listed on our privacy notice, covering access, portability, correction, deletion, objection, restriction, withdrawing consent, and complaint. A request can be made through the /privacy/your-data journey or by emailing us directly.",
    rightsResponseNote: `We must answer an access request within ${RIGHTS_RESPONSE_DAYS} days, under section 30 of the Act.`,
    rightsCta: "See your rights in full",

    securityTitle: "Security measures (section 37(1))",
    securityIntro:
      "In plain terms, here's what protects the personal data we hold:",
    securityItems: [
      "Officer passcodes are stored as a scrypt hash, a one-way scramble that cannot be turned back into the original passcode, even by us.",
      "Sign-in sessions use a cookie that's cryptographically signed (HMAC), so it can't be forged or edited by a visitor.",
      "Officers only see and act on what their role and their club scope allow: an officer of one club cannot see another club's borrower data.",
      "The site runs under a strict Content Security Policy, which limits what scripts and resources a page is allowed to load.",
      "Forms are rate-limited, so one visitor cannot flood a form or overwhelm the system.",
      "All data in transit runs over encrypted connections (TLS).",
      "A scheduled job deletes or anonymises personal data automatically once it passes the two-year retention period, rather than relying on someone remembering to do it.",
    ],

    breachTitle: "If something goes wrong",
    breachBody: `If we discover a personal data breach that's likely to risk your rights and freedoms, section 37(4) of the Act requires us to notify the Personal Data Protection Committee within ${BREACH_NOTIFICATION_HOURS} hours of becoming aware of it, and to tell affected people without delay where the risk to them is high.`,

    dpoTitle: "Data protection officer",
    dpoBody:
      "BIRSA is not required to appoint a data protection officer under section 41 of the Act: we're not a state agency, we don't monitor personal data on a large scale as a core activity, and we don't process the sensitive categories of data listed in section 26. We still give a named contact point, as section 23(5) requires, for anyone with a question about this record or their data.",

    contactCta: "Contact BIRSA",
  },
  th: {
    title: "บันทึกรายการกิจกรรมการประมวลผลข้อมูลส่วนบุคคล",
    lede:
      "บันทึกอย่างเป็นทางการที่มาตรา 39 แห่งพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคลกำหนดให้เราต้องจัดทำ เปิดให้คุณหรือหน่วยงานกำกับดูแลตรวจสอบได้",
    privacyBreadcrumb: "ความเป็นส่วนตัว",

    aboutTitle: "เกี่ยวกับบันทึกนี้",
    aboutBody:
      "หน้านี้คือบันทึกเชิงโครงสร้างที่มาตรา 39 ของพระราชบัญญัติกำหนดให้ผู้ควบคุมข้อมูลต้องจัดทำ โดยระบุว่าเราประมวลผลอะไร เพราะอะไร และอย่างไร ในรายละเอียดที่เป็นทางการกว่าประกาศฉบับภาษาง่าย ๆ ที่ /privacy ทั้งสองหน้าสร้างจากข้อมูลชุดเดียวกัน จึงไม่มีทางขัดแย้งกันเอง",

    controllerTitle: "ผู้ควบคุมข้อมูล",
    controllerBody:
      "BIRSA (สโมสรนักศึกษาหลักสูตร BIR) หลักสูตรการเมืองและการระหว่างประเทศ (BIR) คณะรัฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์ เป็นผู้ควบคุมข้อมูลสำหรับการประมวลผลทั้งหมดที่ระบุด้านล่าง",
    controllerAddressLabel: "ที่อยู่:",
    controllerEmailLabel: "อีเมล:",

    activitiesTitle: "กิจกรรมการประมวลผลข้อมูล",
    activitiesIntro: "ข้อมูลส่วนบุคคลทุกประเภทที่เว็บไซต์นี้ประมวลผล แสดงเป็นหนึ่งแถวต่อหนึ่งกิจกรรม",
    colCategory: "หมวดหมู่",
    colPurpose: "วัตถุประสงค์",
    colCollects: "ข้อมูลที่เก็บ",
    colBasis: "ฐานทางกฎหมาย",
    colRecipients: "ผู้รับข้อมูล",
    colRetention: "ระยะเวลาเก็บ",
    noRecipients: "ไม่มีใครนอกจาก BIRSA",
    retentionYearsSuffix: "ปี นับจาก",
    retentionTriggerLabels: {
      created: "วันที่สร้างข้อมูล",
      closed: "วันที่ปิดรายการ",
      "last-active": "ครั้งล่าสุดที่มีการเปลี่ยนแปลง",
    },

    processorsTitle: "ผู้ประมวลผลข้อมูล",
    processorsIntro: "องค์กรภายนอกที่ประมวลผลข้อมูลส่วนบุคคลแทนเรา และประเทศที่ตั้งอยู่",
    colProcessor: "ผู้ประมวลผล",
    colRole: "บทบาท",
    colCountry: "ประเทศ",

    rightsTitle: "สิทธิและวิธีเข้าถึงข้อมูล",
    rightsBody:
      "เจ้าของข้อมูลมีสิทธิตามที่ระบุไว้ในประกาศความเป็นส่วนตัวของเรา ครอบคลุมการขอเข้าถึงข้อมูล การขอรับข้อมูล การแก้ไข การลบ การคัดค้าน การระงับการใช้ การถอนความยินยอม และการร้องเรียน คุณสามารถยื่นคำร้องผ่านขั้นตอน /privacy/your-data หรืออีเมลถึงเราโดยตรง",
    rightsResponseNote: `เราต้องตอบคำร้องขอเข้าถึงข้อมูลภายใน ${RIGHTS_RESPONSE_DAYS} วัน ตามมาตรา 30 ของพระราชบัญญัติ`,
    rightsCta: "ดูสิทธิของคุณแบบเต็ม",

    securityTitle: "มาตรการรักษาความมั่นคงปลอดภัย (มาตรา 37(1))",
    securityIntro: "อธิบายแบบเข้าใจง่าย นี่คือสิ่งที่ปกป้องข้อมูลส่วนบุคคลที่เราเก็บไว้",
    securityItems: [
      "รหัสผ่านของเจ้าหน้าที่เก็บในรูปแบบที่เข้ารหัสด้วย scrypt ซึ่งเป็นการเข้ารหัสทางเดียวที่ย้อนกลับเป็นรหัสเดิมไม่ได้ แม้แต่ตัวเราเองก็ทำไม่ได้",
      "เซสชันการเข้าสู่ระบบใช้คุกกี้ที่เซ็นชื่อทางการเข้ารหัส (HMAC) จึงปลอมแปลงหรือแก้ไขโดยผู้เข้าชมไม่ได้",
      "เจ้าหน้าที่จะเห็นและดำเนินการได้เฉพาะสิ่งที่บทบาทและขอบเขตชมรมของตนอนุญาตเท่านั้น เจ้าหน้าที่ของชมรมหนึ่งจะเห็นข้อมูลผู้ยืมของอีกชมรมหนึ่งไม่ได้",
      "เว็บไซต์ทำงานภายใต้ Content Security Policy ที่เข้มงวด ซึ่งจำกัดว่าสคริปต์และทรัพยากรใดที่หน้าเว็บโหลดได้",
      "แบบฟอร์มทุกแบบมีการจำกัดอัตราการส่ง เพื่อไม่ให้ผู้เข้าชมรายใดส่งข้อมูลถล่มระบบ",
      "ข้อมูลทุกอย่างระหว่างการรับส่งเข้ารหัสด้วย TLS",
      "ระบบมีงานอัตโนมัติที่ลบหรือทำให้ข้อมูลส่วนบุคคลไม่สามารถระบุตัวตนได้ทันทีที่ครบระยะเวลาเก็บสองปี โดยไม่ต้องพึ่งให้ใครมาจำทำเอง",
    ],

    breachTitle: "หากเกิดข้อผิดพลาด",
    breachBody: `หากเราพบว่ามีการรั่วไหลของข้อมูลส่วนบุคคลที่มีความเสี่ยงต่อสิทธิและเสรีภาพของคุณ มาตรา 37(4) ของพระราชบัญญัติกำหนดให้เราต้องแจ้งคณะกรรมการคุ้มครองข้อมูลส่วนบุคคลภายใน ${BREACH_NOTIFICATION_HOURS} ชั่วโมงนับแต่ทราบเหตุ และต้องแจ้งผู้ได้รับผลกระทบโดยไม่ชักช้าในกรณีที่ความเสี่ยงนั้นสูง`,
    dpoTitle: "เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล",
    dpoBody:
      "BIRSA ไม่มีหน้าที่ต้องแต่งตั้งเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคลตามมาตรา 41 ของพระราชบัญญัติ เพราะเราไม่ใช่หน่วยงานของรัฐ ไม่ได้ติดตามข้อมูลส่วนบุคคลในขนาดใหญ่เป็นกิจกรรมหลัก และไม่ได้ประมวลผลข้อมูลอ่อนไหวตามมาตรา 26 อย่างไรก็ตาม เรายังคงให้ช่องทางติดต่อที่ระบุตัวบุคคลได้ ตามที่มาตรา 23(5) กำหนด สำหรับผู้ที่มีคำถามเกี่ยวกับบันทึกนี้หรือข้อมูลของตน",

    contactCta: "ติดต่อ BIRSA",
  },
};

function retentionCell(t: Labels, activity: (typeof activities)[number]): string {
  const trigger = t.retentionTriggerLabels[activity.retentionTrigger];
  return `${RETENTION_YEARS} ${t.retentionYearsSuffix} ${trigger}`;
}

export default async function ProcessingRecordPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
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
            items={[
              { label: dict.site.name, href: "/" },
              { label: t.privacyBreadcrumb, href: "/privacy" },
              { label: t.title },
            ]}
          />
        }
      />
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-10 py-10">
        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.aboutTitle}</h2>
          <p className="text-muted leading-relaxed">{t.aboutBody}</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.controllerTitle}</h2>
          <p className="text-muted leading-relaxed">{t.controllerBody}</p>
          <p className="text-muted leading-relaxed">
            {t.controllerAddressLabel} {contact.address[locale]}
          </p>
          <p className="text-muted leading-relaxed">
            {t.controllerEmailLabel}{" "}
            <Email address={contact.email} className="text-brand-deep hover:text-brand-dark" />
            {locale === "th" ? " หรือ " : " or "}
            <Email
              address={contact.secondaryEmail}
              className="text-brand-deep hover:text-brand-dark"
            />
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-2xl">{t.activitiesTitle}</h2>
            <p className="text-muted leading-relaxed">{t.activitiesIntro}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="border-line w-full border-collapse text-sm">
              <thead>
                <tr className="border-line border-b text-left">
                  <th scope="col" className="p-2 font-semibold">
                    {t.colCategory}
                  </th>
                  <th scope="col" className="p-2 font-semibold">
                    {t.colPurpose}
                  </th>
                  <th scope="col" className="p-2 font-semibold">
                    {t.colCollects}
                  </th>
                  <th scope="col" className="p-2 font-semibold">
                    {t.colBasis}
                  </th>
                  <th scope="col" className="p-2 font-semibold">
                    {t.colRecipients}
                  </th>
                  <th scope="col" className="p-2 font-semibold">
                    {t.colRetention}
                  </th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => {
                  const recipients = activity.recipients
                    .map((id) => processorById(id))
                    .filter((p): p is NonNullable<typeof p> => Boolean(p));

                  return (
                    <tr key={activity.id} className="border-line border-b align-top">
                      <td className="p-2 font-semibold whitespace-nowrap">
                        {activity.name[locale]}
                      </td>
                      <td className="text-muted p-2 leading-relaxed">{activity.purpose[locale]}</td>
                      <td className="text-muted p-2 leading-relaxed">
                        <ul className="flex list-disc flex-col gap-1 pl-4">
                          {activity.collects.map((item) => (
                            <li key={item[locale]}>{item[locale]}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="text-muted p-2 leading-relaxed whitespace-nowrap">
                        {activity.basis.section}
                      </td>
                      <td className="text-muted p-2 leading-relaxed">
                        {recipients.length === 0
                          ? t.noRecipients
                          : recipients.map((p) => p.name).join(locale === "th" ? " และ " : ", ")}
                      </td>
                      <td className="text-muted p-2 leading-relaxed whitespace-nowrap">
                        {retentionCell(t, activity)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-2xl">{t.processorsTitle}</h2>
            <p className="text-muted leading-relaxed">{t.processorsIntro}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="border-line w-full border-collapse text-sm">
              <thead>
                <tr className="border-line border-b text-left">
                  <th scope="col" className="p-2 font-semibold">
                    {t.colProcessor}
                  </th>
                  <th scope="col" className="p-2 font-semibold">
                    {t.colRole}
                  </th>
                  <th scope="col" className="p-2 font-semibold">
                    {t.colCountry}
                  </th>
                </tr>
              </thead>
              <tbody>
                {processors.map((processor) => (
                  <tr key={processor.id} className="border-line border-b align-top">
                    <td className="p-2 font-semibold whitespace-nowrap">{processor.name}</td>
                    <td className="text-muted p-2 leading-relaxed">{processor.role[locale]}</td>
                    <td className="text-muted p-2 leading-relaxed whitespace-nowrap">
                      {processor.country[locale]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-display text-2xl">{t.rightsTitle}</h2>
          <p className="text-muted leading-relaxed">{t.rightsBody}</p>
          <ul className="text-muted flex list-disc flex-col gap-1 pl-5 leading-relaxed">
            {dataRights.map((right) => (
              <li key={right.id}>
                {right.name[locale]} ({right.section})
              </li>
            ))}
          </ul>
          <p className="text-muted leading-relaxed">{t.rightsResponseNote}</p>
          <p>
            <Link
              href={localeHref(locale, "/privacy#your-rights")}
              className="text-brand-deep hover:text-brand-dark font-semibold underline"
            >
              {t.rightsCta}
            </Link>
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-display text-2xl">{t.securityTitle}</h2>
          <p className="text-muted leading-relaxed">{t.securityIntro}</p>
          <ul className="text-muted flex list-disc flex-col gap-2 pl-5 leading-relaxed">
            {t.securityItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.breachTitle}</h2>
          <p className="text-muted leading-relaxed">{t.breachBody}</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.dpoTitle}</h2>
          <p className="text-muted leading-relaxed">{t.dpoBody}</p>
          <p>
            <Link
              href={localeHref(locale, "/contact")}
              className="text-brand-deep hover:text-brand-dark font-semibold underline"
            >
              {t.contactCta}
            </Link>
          </p>
        </section>
      </div>
    </>
  );
}
