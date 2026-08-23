import type { Metadata } from "next";

import Link from "next/link";
import { notFound } from "next/navigation";

import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import Email from "@/components/bds/Email";
import { Wrap, Stack, Section } from "@/components/bds/Layout";
import PageHeader from "@/components/bds/PageHeader";
import Table from "@/components/bds/Table";
import { Heading, Text } from "@/components/bds/Type";
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
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

/**
 * `/privacy/processing-record`: the section 39 record of processing
 * activities (ROUTE-MAP-2.0 Wave 5F, BUILD-BRIEF-2.0 §8).
 *
 * EVERY ROW ON THIS PAGE COMES FROM `content/privacy/register.ts`. The
 * `activities`, `processors` and `dataRights` loops are the whole factual
 * content; the strings in `content` below are labels and connective
 * sentences only. Changing a fixture in the register changes what this page
 * says, because there is no second copy of any of it here.
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
  activitiesCaption: string;
  colCategory: string;
  colPurpose: string;
  colCollects: string;
  colBasis: string;
  colRecipients: string;
  colRetention: string;
  noRecipients: string;
  retentionYearsSuffix: string;
  retentionTriggerJoin: string;
  retentionTriggerLabels: Record<RetentionTrigger, string>;

  processorsTitle: string;
  processorsIntro: string;
  processorsCaption: string;
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
      "This page is the structured record section 39 of the Act requires a data controller to keep. It lists what we process, why, and how, in more formal detail than the plain language notice at /privacy. Both pages are generated from the same underlying record, so they cannot drift apart or contradict each other.",

    controllerTitle: "Controller",
    controllerBody:
      "BIRSA (the BIR Student Association), the student association of the BIR programme, Faculty of Political Science, Thammasat University, is the controller for all processing listed below.",
    controllerAddressLabel: "Address",
    controllerEmailLabel: "Email",

    activitiesTitle: "Processing activities",
    activitiesIntro: "Every category of personal data this site processes, one row per activity.",
    activitiesCaption: "Processing activities",
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
      "The outside organisations that process personal data on our behalf, and where they are based.",
    processorsCaption: "Processors",
    colProcessor: "Processor",
    colRole: "Role",
    colCountry: "Country",

    rightsTitle: "Rights and how to access data",
    rightsBody:
      "Data subjects hold the rights listed on our privacy notice, covering access, portability, correction, deletion, objection, restriction, withdrawing consent, and complaint. A request can be made through the /privacy/your-data journey or by emailing us directly.",
    rightsResponseNote: `We must answer an access request within ${RIGHTS_RESPONSE_DAYS} days, under section 30 of the Act.`,
    rightsCta: "See your rights in full",

    securityTitle: "Security measures, section 37(1)",
    securityIntro: "In plain terms, here is what protects the personal data we hold.",
    securityItems: [
      "Officer passcodes are stored as a scrypt hash, a one way scramble that cannot be turned back into the original passcode, even by us.",
      "Sign in sessions use a cookie that is cryptographically signed (HMAC), so it cannot be forged or edited by a visitor.",
      "Officers only see and act on what their role and their club scope allow. An officer of one club cannot see another club's borrower data.",
      "The site runs under a strict Content Security Policy, which limits what scripts and resources a page is allowed to load.",
      "Forms are rate limited, so one visitor cannot flood a form or overwhelm the system.",
      "All data in transit runs over encrypted connections (TLS).",
      "A scheduled job deletes or anonymises personal data automatically once it passes the two year retention period, rather than relying on someone remembering to do it.",
    ],

    breachTitle: "If something goes wrong",
    breachBody: `If we discover a personal data breach that is likely to risk your rights and freedoms, section 37(4) of the Act requires us to notify the Personal Data Protection Committee within ${BREACH_NOTIFICATION_HOURS} hours of becoming aware of it, and to tell affected people without delay where the risk to them is high.`,

    dpoTitle: "Data protection officer",
    dpoBody:
      "BIRSA is not required to appoint a data protection officer under section 41 of the Act. We are not a state agency, we do not monitor personal data on a large scale as a core activity, and we do not process the sensitive categories of data listed in section 26. We still give a named contact point, as section 23(5) requires, for anyone with a question about this record or their data.",

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
    controllerAddressLabel: "ที่อยู่",
    controllerEmailLabel: "อีเมล",

    activitiesTitle: "รายการกิจกรรมการประมวลผลข้อมูลส่วนบุคคล",
    activitiesIntro:
      "ข้อมูลส่วนบุคคลทุกประเภทที่เว็บไซต์นี้ประมวลผล โดยแสดงหนึ่งรายการต่อหนึ่งกิจกรรม",
    activitiesCaption: "รายการกิจกรรมการประมวลผลข้อมูลส่วนบุคคล",
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
    processorsCaption: "ผู้ประมวลผลข้อมูลส่วนบุคคล",
    colProcessor: "ผู้ประมวลผล",
    colRole: "ลักษณะการดำเนินการ",
    colCountry: "ประเทศที่ตั้ง",

    rightsTitle: "สิทธิของเจ้าของข้อมูลส่วนบุคคลและวิธีการเข้าถึงข้อมูล",
    rightsBody:
      "เจ้าของข้อมูลส่วนบุคคลมีสิทธิตามที่ระบุไว้ในประกาศความเป็นส่วนตัวของ BIRSA อันได้แก่ สิทธิขอเข้าถึงและขอรับสำเนาข้อมูล สิทธิขอให้โอนย้ายข้อมูล สิทธิขอให้แก้ไขข้อมูลให้ถูกต้อง สิทธิขอให้ลบหรือทำลายข้อมูล สิทธิคัดค้านการประมวลผล สิทธิขอให้ระงับการใช้ข้อมูล สิทธิขอถอนความยินยอม และสิทธิร้องเรียน ทั้งนี้ ท่านสามารถยื่นคำร้องผ่านขั้นตอนที่ /privacy/your-data หรือติดต่อ BIRSA ทางอีเมลโดยตรง",
    rightsResponseNote: `BIRSA จะดำเนินการตามคำขอเข้าถึงข้อมูลส่วนบุคคลโดยไม่ชักช้า แต่ต้องไม่เกิน ${RIGHTS_RESPONSE_DAYS} วันนับแต่วันที่ได้รับคำขอ ตามมาตรา 30 แห่งพระราชบัญญัติ`,
    rightsCta: "ดูรายละเอียดสิทธิฉบับเต็ม",

    securityTitle: "มาตรการรักษาความมั่นคงปลอดภัย มาตรา 37(1)",
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
        helpSlot={
          <Button href={localeHref(locale, "/contact")} variant="secondary">
            {dict.actions.contactUs}
          </Button>
        }
      />
      <Wrap className="flex max-w-[var(--measure)] flex-col gap-10 py-10">
        <Section as="div">
          <Stack gap="xs">
            <Heading level={2}>{t.aboutTitle}</Heading>
            <Text step="body" className="text-muted">
              {t.aboutBody}
            </Text>
          </Stack>
        </Section>

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
          <Stack gap="md">
            <Stack gap="xs">
              <Heading level={2}>{t.activitiesTitle}</Heading>
              <Text step="body" className="text-muted">
                {t.activitiesIntro}
              </Text>
            </Stack>
            <Table
              caption={t.activitiesCaption}
              captionHidden
              rowHeaders
              columns={[
                { key: "category", header: t.colCategory },
                { key: "purpose", header: t.colPurpose },
                { key: "collects", header: t.colCollects },
                { key: "basis", header: t.colBasis },
                { key: "recipients", header: t.colRecipients },
                { key: "retention", header: t.colRetention },
              ]}
              rows={activities.map((activity) => {
                const recipients = activity.recipients
                  .map((id) => processorById(id))
                  .filter((p): p is NonNullable<typeof p> => Boolean(p));

                return {
                  category: activity.name[locale],
                  purpose: activity.purpose[locale],
                  collects: (
                    <Stack as="ul" gap="2xs" className="list-disc pl-4">
                      {activity.collects.map((item) => (
                        <li key={item[locale]}>{item[locale]}</li>
                      ))}
                    </Stack>
                  ),
                  basis: activity.basis.section,
                  recipients:
                    recipients.length === 0
                      ? t.noRecipients
                      : recipients.map((p) => p.name).join(locale === "th" ? " และ " : ", "),
                  retention: retentionCell(t, activity),
                };
              })}
              rowKey={(row) => row.category as string}
            />
          </Stack>
        </Section>

        <Section as="div">
          <Stack gap="md">
            <Stack gap="xs">
              <Heading level={2}>{t.processorsTitle}</Heading>
              <Text step="body" className="text-muted">
                {t.processorsIntro}
              </Text>
            </Stack>
            <Table
              caption={t.processorsCaption}
              captionHidden
              rowHeaders
              columns={[
                { key: "name", header: t.colProcessor },
                { key: "role", header: t.colRole },
                { key: "country", header: t.colCountry },
              ]}
              rows={processors.map((processor) => ({
                name: processor.name,
                role: processor.role[locale],
                country: processor.country[locale],
              }))}
              rowKey={(row) => row.name as string}
            />
          </Stack>
        </Section>

        <Section as="div">
          <Stack gap="sm">
            <Heading level={2}>{t.rightsTitle}</Heading>
            <Text step="body" className="text-muted">
              {t.rightsBody}
            </Text>
            <Stack as="ul" gap="2xs" className="list-disc pl-5">
              {dataRights.map((right) => (
                <Text as="li" step="body" key={right.id} className="text-muted">
                  {right.name[locale]} ({right.section})
                </Text>
              ))}
            </Stack>
            <Text step="body" className="text-muted">
              {t.rightsResponseNote}
            </Text>
            <div>
              <Link
                href={localeHref(locale, "/privacy#your-rights")}
                className="font-semibold text-brand-deep underline hover:text-brand-dark"
              >
                {t.rightsCta}
              </Link>
            </div>
          </Stack>
        </Section>

        <Section as="div">
          <Stack gap="sm">
            <Heading level={2}>{t.securityTitle}</Heading>
            <Text step="body" className="text-muted">
              {t.securityIntro}
            </Text>
            <Stack as="ul" gap="xs" className="list-disc pl-5">
              {t.securityItems.map((item) => (
                <Text as="li" step="body" key={item} className="text-muted">
                  {item}
                </Text>
              ))}
            </Stack>
          </Stack>
        </Section>

        <Section as="div">
          <Stack gap="xs">
            <Heading level={2}>{t.breachTitle}</Heading>
            <Text step="body" className="text-muted">
              {t.breachBody}
            </Text>
          </Stack>
        </Section>

        <Section as="div">
          <Stack gap="xs">
            <Heading level={2}>{t.dpoTitle}</Heading>
            <Text step="body" className="text-muted">
              {t.dpoBody}
            </Text>
            <div>
              <Link
                href={localeHref(locale, "/contact")}
                className="font-semibold text-brand-deep underline hover:text-brand-dark"
              >
                {t.contactCta}
              </Link>
            </div>
          </Stack>
        </Section>
      </Wrap>
    </>
  );
}
