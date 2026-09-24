import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Email from "@/components/Email";
import { contact } from "@/content/site";

type Section = { heading: string; paragraphs?: string[] };

type Labels = {
  title: string;
  description: string;
  intro: string[];
  canDoLead: string;
  canDo: string[];
  voluntary: string;
  howAccessibleTitle: string;
  compliance: string;
  issuesLead: string;
  issues: { title: string; body: string }[];
  formatTitle: string;
  format: string;
  reportTitle: string;
  report: string;
  reportCta: string;
  sections: Section[];
  preparedTitle: string;
  prepared: string;
};

/**
 * The accessibility statement, on its own page and in the order of the GOV.UK
 * sample statement: who runs the site and what you should be able to do,
 * how accessible it is, what to do if you cannot use part of it, how to
 * report a problem, how it was tested, what is being improved, and when the
 * statement was prepared. BIRSA is not a public body, so the Public Sector
 * Bodies Accessibility Regulations and their enforcement procedure do not
 * apply; the statement says so rather than borrowing that section.
 */
const content: Record<Locale, Labels> = {
  en: {
    title: "Accessibility statement",
    description:
      "How accessible the BIRSA website is, the problems we know about, and how to report a barrier or ask for information in another format.",
    intro: [
      "This statement covers the BIRSA website, in Thai and English. It is run by the BIR Student Association (BIRSA), Faculty of Political Science, Thammasat University.",
      "We want as many people as possible to be able to use this website.",
    ],
    canDoLead: "You should be able to:",
    canDo: [
      "use every feature with a keyboard alone, with a visible focus indicator",
      "zoom in up to 400% and read pages on a screen 320 pixels wide without scrolling sideways",
      "use light or dark mode, both checked for colour contrast",
      "turn off animation with your device's reduce motion setting",
      "navigate by headings and landmarks with a screen reader",
      "have Thai words on English pages read in a Thai voice",
    ],
    voluntary:
      "BIRSA is a student association, not a public body, so no law requires this statement. We follow the structure the UK Government Digital Service asks public services to use because we think every site should be honest about how usable it is.",
    howAccessibleTitle: "How accessible this website is",
    compliance:
      "This website is partially compliant with the Web Content Accessibility Guidelines (WCAG) 2.2 level AA. It is partially compliant because we have not yet tested it with assistive technology, and because of the other known issues below, not because of a specific failure we know about.",
    issuesLead: "These are the known issues:",
    issues: [
      {
        title: "No assistive technology testing yet",
        body: "Automated checks catch a defined set of technical faults. They cannot show whether the site works well with a screen reader, a screen magnifier or speech recognition software. We have not done that testing yet, so some barriers may be unnoticed (WCAG 4.1.2 and others).",
      },
      {
        title: "Some placeholder content",
        body: "A few details, such as example dates and room numbers, are placeholders waiting for the BIRSA committee to confirm them. They are labelled. This is about accuracy rather than access, but we mention it to be complete.",
      },
    ],
    formatTitle: "What to do if you cannot use part of this website",
    format:
      "If you need something on this website in a different format, such as a regulation in large print, plain text or read aloud, email",
    reportTitle: "Reporting accessibility problems",
    report:
      "If something on this website is hard to use, tell us what the problem is, which page it was on and, if you can, what device and software you were using.",
    reportCta: "Report a problem to BIRSA",
    sections: [
      {
        heading: "How we tested this website",
        paragraphs: [
          "Two automated test suites run on every change, in the rendering engines of Chrome, Firefox and Safari. The first (axe-core) checks every page template, in Thai and English and in light and dark mode, against the WCAG 2.0, 2.1 and 2.2 A and AA rules. The second drives the site with a keyboard only: it checks that focus is always visible and never trapped, that menus and dialogs open and close correctly, that forms can be completed without a mouse, and that the header never covers the focused control at 400% zoom.",
          "We have not yet tested the site with assistive technology.",
        ],
      },
      {
        heading: "What we are doing to improve accessibility",
        paragraphs: [
          "We are testing the site with the combinations the UK Government Digital Service recommends: JAWS and NVDA screen readers on Windows, VoiceOver on iPhone, TalkBack on Android, a screen magnifier and Dragon speech recognition. We will list the results here.",
        ],
      },
    ],
    preparedTitle: "Preparation of this statement",
    prepared:
      "This statement was first prepared on 14 July 2026 and last reviewed on 24 September 2026. We review it at least once a year, when the committee changes each June, and whenever we make a significant change to the site.",
  },
  th: {
    title: "คำแถลงการเข้าถึงเว็บไซต์",
    description:
      "เว็บไซต์ BIRSA เข้าถึงได้ดีเพียงใด ปัญหาที่เรารับทราบ และวิธีแจ้งอุปสรรคหรือขอข้อมูลในรูปแบบอื่น",
    intro: [
      "คำแถลงนี้ครอบคลุมเว็บไซต์ BIRSA ทั้งภาษาไทยและภาษาอังกฤษ ดูแลโดยสโมสรนักศึกษาโครงการ BIR (BIRSA) คณะรัฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์",
      "เราต้องการให้ทุกคนใช้เว็บไซต์นี้ได้มากที่สุด",
    ],
    canDoLead: "คุณควรทำสิ่งต่อไปนี้ได้",
    canDo: [
      "ใช้ทุกฟีเจอร์ด้วยคีย์บอร์ดอย่างเดียว พร้อมเส้นโฟกัสที่มองเห็นชัดเจน",
      "ซูมได้ถึง 400% และอ่านหน้าบนจอกว้าง 320 พิกเซลได้โดยไม่ต้องเลื่อนด้านข้าง",
      "ใช้โหมดสว่างหรือโหมดมืด ซึ่งผ่านการตรวจคอนทราสต์สีแล้วทั้งคู่",
      "ปิดแอนิเมชันได้ด้วยการตั้งค่าลดการเคลื่อนไหวของอุปกรณ์",
      "ใช้โปรแกรมอ่านหน้าจอไล่ตามหัวข้อและแลนด์มาร์กได้",
      "ฟังคำภาษาไทยในหน้าภาษาอังกฤษด้วยเสียงภาษาไทย",
    ],
    voluntary:
      "BIRSA เป็นสโมสรนักศึกษา ไม่ใช่หน่วยงานรัฐ จึงไม่มีกฎหมายบังคับให้ต้องมีคำแถลงนี้ เราใช้โครงสร้างที่ Government Digital Service ของสหราชอาณาจักรกำหนดให้บริการภาครัฐใช้ เพราะเชื่อว่าทุกเว็บไซต์ควรบอกตรง ๆ ว่าใช้งานได้ดีแค่ไหน",
    howAccessibleTitle: "เว็บไซต์นี้เข้าถึงได้ดีเพียงใด",
    compliance:
      "เว็บไซต์นี้ผ่านมาตรฐาน WCAG 2.2 ระดับ AA เป็นบางส่วน คำว่า “บางส่วน” มาจากการที่เรายังไม่ได้ทดสอบด้วยเทคโนโลยีสิ่งอำนวยความสะดวก และข้อจำกัดอื่นที่ระบุไว้ด้านล่าง ไม่ใช่เพราะมีจุดที่เรารู้ว่าไม่ผ่านโดยเฉพาะ",
    issuesLead: "ข้อจำกัดที่ทราบมีดังนี้",
    issues: [
      {
        title: "ยังไม่มีการทดสอบด้วยเทคโนโลยีสิ่งอำนวยความสะดวก",
        body: "การตรวจสอบอัตโนมัติจับได้เฉพาะข้อบกพร่องทางเทคนิคชุดหนึ่ง แต่บอกไม่ได้ว่าเว็บไซต์ใช้งานได้ดีกับโปรแกรมอ่านหน้าจอ โปรแกรมขยายหน้าจอ หรือซอฟต์แวร์สั่งงานด้วยเสียงหรือไม่ เรายังไม่ได้ทดสอบส่วนนี้ จึงอาจมีอุปสรรคที่ยังไม่ถูกพบ (WCAG 4.1.2 และข้ออื่น ๆ)",
      },
      {
        title: "มีเนื้อหาตัวอย่างบางส่วน",
        body: "รายละเอียดบางอย่าง เช่น วันที่หรือหมายเลขห้องตัวอย่าง ยังรอคณะกรรมการ BIRSA ยืนยัน และมีการระบุไว้ชัดเจน เรื่องนี้เป็นความถูกต้องของเนื้อหามากกว่าการเข้าถึง แต่เราขอบอกไว้ให้ครบถ้วน",
      },
    ],
    formatTitle: "หากคุณใช้บางส่วนของเว็บไซต์นี้ไม่ได้",
    format:
      "หากต้องการเนื้อหาในเว็บไซต์นี้ในรูปแบบอื่น เช่น ระเบียบแบบตัวอักษรขนาดใหญ่ ข้อความล้วน หรือแบบอ่านออกเสียง อีเมลถึง",
    reportTitle: "แจ้งปัญหาการเข้าถึง",
    report:
      "หากมีจุดใดในเว็บไซต์นี้ใช้งานยาก บอกเราว่าปัญหาคืออะไร เกิดที่หน้าไหน และหากเป็นไปได้ ใช้อุปกรณ์และซอฟต์แวร์อะไรอยู่",
    reportCta: "แจ้งปัญหาถึง BIRSA",
    sections: [
      {
        heading: "เราทดสอบเว็บไซต์นี้อย่างไร",
        paragraphs: [
          "ทุกครั้งที่มีการเปลี่ยนแปลง ระบบทดสอบอัตโนมัติสองชุดจะทำงานบนเอนจินการแสดงผลของ Chrome, Firefox และ Safari ชุดแรก (axe-core) ตรวจทุกรูปแบบหน้า ทั้งภาษาไทยและอังกฤษ ทั้งโหมดสว่างและมืด เทียบกับกฎ WCAG 2.0, 2.1 และ 2.2 ระดับ A และ AA ชุดที่สองใช้งานเว็บไซต์ด้วยคีย์บอร์ดอย่างเดียว เพื่อตรวจว่าโฟกัสมองเห็นได้เสมอและไม่ติดค้าง เมนูและกล่องโต้ตอบเปิดปิดได้ถูกต้อง แบบฟอร์มกรอกจนจบได้โดยไม่ใช้เมาส์ และส่วนหัวไม่บังตำแหน่งโฟกัสเมื่อซูม 400%",
          "เรายังไม่ได้ทดสอบเว็บไซต์ด้วยเทคโนโลยีสิ่งอำนวยความสะดวก",
        ],
      },
      {
        heading: "สิ่งที่เรากำลังปรับปรุง",
        paragraphs: [
          "เรากำลังทดสอบเว็บไซต์ตามชุดที่ Government Digital Service ของสหราชอาณาจักรแนะนำ ได้แก่ โปรแกรมอ่านหน้าจอ JAWS และ NVDA บน Windows, VoiceOver บน iPhone, TalkBack บน Android, โปรแกรมขยายหน้าจอ และซอฟต์แวร์สั่งงานด้วยเสียง Dragon และจะรายงานผลไว้ที่หน้านี้",
        ],
      },
    ],
    preparedTitle: "การจัดทำคำแถลงนี้",
    prepared:
      "คำแถลงนี้จัดทำครั้งแรกเมื่อวันที่ 14 กรกฎาคม 2026 และทบทวนล่าสุดเมื่อวันที่ 24 กันยายน 2026 เราทบทวนอย่างน้อยปีละครั้ง ทุกครั้งที่คณะกรรมการเปลี่ยนชุดในเดือนมิถุนายน และทุกครั้งที่มีการเปลี่ยนแปลงสำคัญกับเว็บไซต์",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = content[lang];
  return buildMetadata({
    locale: lang,
    title: t.title,
    description: t.description,
    path: "/accessibility",
  });
}

export default async function AccessibilityPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = content[locale];
  const stop = locale === "en" ? "." : "";
  const link = "font-semibold text-brand-deep underline underline-offset-4 hover:text-brand-dark";

  return (
    <>
      <PageHeader
        title={t.title}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[{ label: dict.site.name, href: "/" }, { label: t.title }]}
          />
        }
      />
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-10 py-10">
        <section className="flex flex-col gap-4">
          {t.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p>{t.canDoLead}</p>
          <ul className="flex list-disc flex-col gap-2 pl-6">
            {t.canDo.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>{t.voluntary}</p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-2xl">{t.howAccessibleTitle}</h2>
          <p>{t.compliance}</p>
          <p>{t.issuesLead}</p>
          <ul className="flex flex-col gap-4">
            {t.issues.map((issue) => (
              <li key={issue.title}>
                <h3 className="font-semibold text-ink">{issue.title}</h3>
                <p className="mt-1">{issue.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-2xl">{t.formatTitle}</h2>
          <p>
            {t.format} <Email address={contact.email} className={link} />
            {stop}
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-2xl">{t.reportTitle}</h2>
          <p>{t.report}</p>
          <p>
            <Link href={`${localeHref(locale, "/contact")}?category=problem`} className={link}>
              {t.reportCta}
            </Link>
          </p>
        </section>

        {t.sections.map((section) => (
          <section key={section.heading} className="flex flex-col gap-4">
            <h2 className="font-display text-2xl">{section.heading}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-2xl">{t.preparedTitle}</h2>
          <p>{t.prepared}</p>
        </section>
      </div>
    </>
  );
}
