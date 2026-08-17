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
  /** Separator before the trigger label. Thai runs นับแต่ straight into it with no space. */
  retentionTriggerJoin: string;
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
    lede: "The formal record section 39 of the Personal Data Protection Act requires us to keep, open for you or the regulator to inspect.",
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
    activitiesIntro: "Every category of personal data this site processes, one row per activity.",
    colCategory: "Category",
    colPurpose: "Purpose",
    colCollects: "Data collected",
    colBasis: "Legal basis",
    colRecipients: "Recipients",
    colRetention: "Retention",
    noRecipients: "None outside BIRSA",
    retentionYearsSuffix: "years, from",
    retentionTriggerJoin: " ",
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
    securityIntro: "In plain terms, here's what protects the personal data we hold:",
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
    lede: "บันทึกรายการตามที่มาตรา 39 แห่งพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 กำหนดให้ผู้ควบคุมข้อมูลส่วนบุคคลต้องจัดทำ เพื่อให้เจ้าของข้อมูลส่วนบุคคลและสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคลสามารถตรวจสอบได้",
    privacyBreadcrumb: "ประกาศความเป็นส่วนตัว",

    aboutTitle: "ความมุ่งหมายของบันทึกฉบับนี้",
    aboutBody:
      "เอกสารฉบับนี้คือบันทึกรายการที่มาตรา 39 แห่งพระราชบัญญัติกำหนดให้ผู้ควบคุมข้อมูลส่วนบุคคลต้องจัดทำ โดยระบุรายละเอียดของการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคลอย่างเป็นทางการยิ่งกว่าประกาศความเป็นส่วนตัว ทั้งนี้ เอกสารทั้งสองฉบับจัดทำขึ้นจากชุดข้อมูลเดียวกัน จึงไม่อาจขัดหรือแย้งกันได้",

    controllerTitle: "ผู้ควบคุมข้อมูลส่วนบุคคล",
    controllerBody:
      "BIRSA (สโมสรนักศึกษาหลักสูตร BIR) หลักสูตรการเมืองและการระหว่างประเทศ (BIR) คณะรัฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์ เป็นผู้ควบคุมข้อมูลส่วนบุคคลสำหรับกิจกรรมการประมวลผลทั้งหมดที่ปรากฏด้านล่าง",
    controllerAddressLabel: "ที่อยู่:",
    controllerEmailLabel: "อีเมล:",

    activitiesTitle: "รายการกิจกรรมการประมวลผลข้อมูลส่วนบุคคล",
    activitiesIntro:
      "ข้อมูลส่วนบุคคลทุกประเภทที่เว็บไซต์นี้ประมวลผล โดยแสดงหนึ่งรายการต่อหนึ่งกิจกรรม",
    colCategory: "ประเภทข้อมูล",
    colPurpose: "วัตถุประสงค์",
    colCollects: "ข้อมูลที่เก็บรวบรวม",
    colBasis: "ฐานทางกฎหมาย",
    colRecipients: "ผู้รับข้อมูล",
    colRetention: "ระยะเวลาการเก็บรักษา",
    noRecipients: "ไม่มีการเปิดเผยแก่บุคคลอื่นนอกจาก BIRSA",
    retentionYearsSuffix: "ปี นับแต่",
    retentionTriggerJoin: "",
    retentionTriggerLabels: {
      created: "วันที่ได้รับข้อมูล",
      closed: "วันที่รายการสิ้นสุด",
      "last-active": "วันที่มีการเปลี่ยนแปลงข้อมูลครั้งล่าสุด",
    },

    processorsTitle: "ผู้ประมวลผลข้อมูลส่วนบุคคล",
    processorsIntro:
      "นิติบุคคลภายนอกซึ่งดำเนินการประมวลผลข้อมูลส่วนบุคคลตามคำสั่งของ BIRSA พร้อมประเทศที่ตั้ง",
    colProcessor: "ผู้ประมวลผล",
    colRole: "ลักษณะการดำเนินการ",
    colCountry: "ประเทศที่ตั้ง",

    rightsTitle: "สิทธิของเจ้าของข้อมูลส่วนบุคคลและวิธีการเข้าถึงข้อมูล",
    rightsBody:
      "เจ้าของข้อมูลส่วนบุคคลมีสิทธิตามที่ระบุไว้ในประกาศความเป็นส่วนตัวของ BIRSA อันได้แก่ สิทธิขอเข้าถึงและขอรับสำเนาข้อมูล สิทธิขอให้โอนย้ายข้อมูล สิทธิขอให้แก้ไขข้อมูลให้ถูกต้อง สิทธิขอให้ลบหรือทำลายข้อมูล สิทธิคัดค้านการประมวลผล สิทธิขอให้ระงับการใช้ข้อมูล สิทธิขอถอนความยินยอม และสิทธิร้องเรียน ทั้งนี้ ท่านสามารถยื่นคำร้องผ่านขั้นตอนที่ /privacy/your-data หรือติดต่อ BIRSA ทางอีเมลโดยตรง",
    rightsResponseNote: `BIRSA จะดำเนินการตามคำขอเข้าถึงข้อมูลส่วนบุคคลโดยไม่ชักช้า แต่ต้องไม่เกิน ${RIGHTS_RESPONSE_DAYS} วันนับแต่วันที่ได้รับคำขอ ตามมาตรา 30 แห่งพระราชบัญญัติ`,
    rightsCta: "ดูรายละเอียดสิทธิฉบับเต็ม",

    securityTitle: "มาตรการรักษาความมั่นคงปลอดภัย (มาตรา 37(1))",
    securityIntro:
      "มาตรการที่ BIRSA จัดให้มีเพื่อป้องกันการสูญหาย เข้าถึง ใช้ เปลี่ยนแปลง แก้ไข หรือเปิดเผยข้อมูลส่วนบุคคลโดยปราศจากอำนาจหรือโดยมิชอบ มีดังนี้",
    securityItems: [
      "รหัสผ่านของเจ้าหน้าที่จัดเก็บในรูปแบบที่ผ่านการแปลงค่าด้วยวิธี scrypt ซึ่งเป็นการแปลงค่าทางเดียวที่ไม่อาจย้อนกลับเป็นรหัสผ่านเดิมได้ แม้โดย BIRSA เอง",
      "เซสชันการเข้าใช้งานระบบใช้คุกกี้ที่ลงลายมือชื่อทางการเข้ารหัสด้วยวิธี HMAC จึงไม่อาจปลอมแปลงหรือแก้ไขโดยผู้เข้าชมได้",
      "เจ้าหน้าที่เข้าถึงและดำเนินการได้เฉพาะเท่าที่บทบาทหน้าที่และขอบเขตชมรมของตนกำหนดไว้ เจ้าหน้าที่ของชมรมหนึ่งไม่อาจเข้าถึงข้อมูลผู้ยืมของอีกชมรมหนึ่งได้",
      "เว็บไซต์ดำเนินการภายใต้ Content Security Policy ที่เข้มงวด ซึ่งจำกัดสคริปต์และทรัพยากรที่หน้าเว็บสามารถเรียกใช้ได้",
      "แบบฟอร์มทุกรายการมีการจำกัดอัตราการส่งข้อมูล เพื่อป้องกันการส่งข้อมูลจำนวนมากจนกระทบต่อการให้บริการ",
      "ข้อมูลทั้งหมดระหว่างการรับส่งได้รับการเข้ารหัสด้วยโพรโทคอล TLS",
      "ระบบจัดให้มีการตรวจสอบและลบหรือทำให้ข้อมูลส่วนบุคคลไม่สามารถระบุตัวบุคคลได้โดยอัตโนมัติ เมื่อพ้นกำหนดระยะเวลาการเก็บรักษาสองปี ตามมาตรา 37(3) แห่งพระราชบัญญัติ",
    ],

    breachTitle: "การแจ้งเหตุการละเมิดข้อมูลส่วนบุคคล",
    breachBody: `ในกรณีที่ BIRSA ทราบว่ามีเหตุการละเมิดข้อมูลส่วนบุคคลซึ่งมีความเสี่ยงที่จะมีผลกระทบต่อสิทธิและเสรีภาพของท่าน มาตรา 37(4) แห่งพระราชบัญญัติกำหนดให้ต้องแจ้งเหตุดังกล่าวแก่สำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคลโดยไม่ชักช้า ภายใน ${BREACH_NOTIFICATION_HOURS} ชั่วโมงนับแต่ทราบเหตุเท่าที่จะสามารถกระทำได้ และในกรณีที่การละเมิดมีความเสี่ยงสูง ต้องแจ้งเจ้าของข้อมูลส่วนบุคคลที่ได้รับผลกระทบพร้อมแนวทางการเยียวยาโดยไม่ชักช้าด้วย`,
    dpoTitle: "เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล",
    dpoBody:
      "BIRSA ไม่มีหน้าที่ต้องจัดให้มีเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคลตามมาตรา 41 แห่งพระราชบัญญัติ เนื่องจากมิได้เป็นหน่วยงานของรัฐ มิได้มีกิจกรรมหลักในการตรวจสอบข้อมูลส่วนบุคคลหรือระบบอย่างสม่ำเสมอโดยเหตุที่มีข้อมูลส่วนบุคคลเป็นจำนวนมาก และมิได้ประมวลผลข้อมูลส่วนบุคคลตามมาตรา 26 เป็นกิจกรรมหลัก อย่างไรก็ดี BIRSA ยังคงจัดให้มีช่องทางติดต่อตามที่มาตรา 23(5) แห่งพระราชบัญญัติกำหนด สำหรับผู้ที่มีข้อสงสัยเกี่ยวกับบันทึกฉบับนี้หรือเกี่ยวกับข้อมูลส่วนบุคคลของตน",

    contactCta: "ติดต่อ BIRSA",
  },
};

function retentionCell(t: Labels, activity: (typeof activities)[number]): string {
  const trigger = t.retentionTriggerLabels[activity.retentionTrigger];
  return `${RETENTION_YEARS} ${t.retentionYearsSuffix}${t.retentionTriggerJoin}${trigger}`;
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
          <p className="leading-relaxed text-muted">{t.aboutBody}</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.controllerTitle}</h2>
          <p className="leading-relaxed text-muted">{t.controllerBody}</p>
          <p className="leading-relaxed text-muted">
            {t.controllerAddressLabel} {contact.address[locale]}
          </p>
          <p className="leading-relaxed text-muted">
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
            <p className="leading-relaxed text-muted">{t.activitiesIntro}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-line text-sm">
              <thead>
                <tr className="border-b border-line text-left">
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
                    <tr key={activity.id} className="border-b border-line align-top">
                      <td className="p-2 font-semibold whitespace-nowrap">
                        {activity.name[locale]}
                      </td>
                      <td className="p-2 leading-relaxed text-muted">{activity.purpose[locale]}</td>
                      <td className="p-2 leading-relaxed text-muted">
                        <ul className="flex list-disc flex-col gap-1 pl-4">
                          {activity.collects.map((item) => (
                            <li key={item[locale]}>{item[locale]}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-2 leading-relaxed whitespace-nowrap text-muted">
                        {activity.basis.section}
                      </td>
                      <td className="p-2 leading-relaxed text-muted">
                        {recipients.length === 0
                          ? t.noRecipients
                          : recipients.map((p) => p.name).join(locale === "th" ? " และ " : ", ")}
                      </td>
                      <td className="p-2 leading-relaxed whitespace-nowrap text-muted">
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
            <p className="leading-relaxed text-muted">{t.processorsIntro}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-line text-sm">
              <thead>
                <tr className="border-b border-line text-left">
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
                  <tr key={processor.id} className="border-b border-line align-top">
                    <td className="p-2 font-semibold whitespace-nowrap">{processor.name}</td>
                    <td className="p-2 leading-relaxed text-muted">{processor.role[locale]}</td>
                    <td className="p-2 leading-relaxed whitespace-nowrap text-muted">
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
          <p className="leading-relaxed text-muted">{t.rightsBody}</p>
          <ul className="flex list-disc flex-col gap-1 pl-5 leading-relaxed text-muted">
            {dataRights.map((right) => (
              <li key={right.id}>
                {right.name[locale]} ({right.section})
              </li>
            ))}
          </ul>
          <p className="leading-relaxed text-muted">{t.rightsResponseNote}</p>
          <p>
            <Link
              href={localeHref(locale, "/privacy#your-rights")}
              className="font-semibold text-brand-deep underline hover:text-brand-dark"
            >
              {t.rightsCta}
            </Link>
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-display text-2xl">{t.securityTitle}</h2>
          <p className="leading-relaxed text-muted">{t.securityIntro}</p>
          <ul className="flex list-disc flex-col gap-2 pl-5 leading-relaxed text-muted">
            {t.securityItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.breachTitle}</h2>
          <p className="leading-relaxed text-muted">{t.breachBody}</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.dpoTitle}</h2>
          <p className="leading-relaxed text-muted">{t.dpoBody}</p>
          <p>
            <Link
              href={localeHref(locale, "/contact")}
              className="font-semibold text-brand-deep underline hover:text-brand-dark"
            >
              {t.contactCta}
            </Link>
          </p>
        </section>
      </div>
    </>
  );
}
