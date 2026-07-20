import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import ExternalLink from "@/components/ExternalLink";
import Email from "@/components/Email";
import { contact, socials } from "@/content/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const t = content[locale];

  // Deliberately unindexed: this page only matters while an emergency is
  // active, and it should never rank in search results or show up on the
  // sitemap between incidents.
  return {
    ...buildMetadata({ locale, title: t.title, description: t.lede, path: "/emergency" }),
    robots: { index: false, follow: false },
  };
}

const content: Record<
  Locale,
  {
    title: string;
    lede: string;
    whatToDoTitle: string;
    whatToDoItems: string[];
    contactsTitle: string;
    contactsBody: string;
  }
> = {
  en: {
    title: "Emergency information",
    lede: "This page carries important updates during an emergency. Check back here for the latest guidance from BIRSA.",
    whatToDoTitle: "What to do",
    whatToDoItems: [
      "Stay calm and follow instructions from Thammasat University staff and official channels.",
      "Check this page and BIRSA's official social channels for the latest updates before acting on other sources.",
      "If you are in immediate danger, contact emergency services or campus security first, before contacting BIRSA.",
    ],
    contactsTitle: "Contacts and official channels",
    contactsBody:
      "BIRSA will post updates through the channels below. If you need to reach us directly, use the contact details listed here.",
  },
  th: {
    title: "ข้อมูลสถานการณ์ฉุกเฉิน",
    lede: "หน้านี้ใช้แจ้งข้อมูลสำคัญระหว่างเกิดเหตุฉุกเฉิน กรุณากลับมาตรวจสอบหน้านี้เพื่อติดตามคำแนะนำล่าสุดจาก BIRSA",
    whatToDoTitle: "สิ่งที่ควรทำ",
    whatToDoItems: [
      "ตั้งสติและปฏิบัติตามคำแนะนำของเจ้าหน้าที่มหาวิทยาลัยธรรมศาสตร์และช่องทางทางการ",
      "ติดตามหน้านี้และช่องทางโซเชียลมีเดียทางการของ BIRSA เพื่อรับข้อมูลล่าสุดก่อนเชื่อแหล่งอื่น",
      "หากตกอยู่ในอันตรายเฉพาะหน้า ให้ติดต่อหน่วยงานฉุกเฉินหรือเจ้าหน้าที่รักษาความปลอดภัยของมหาวิทยาลัยก่อนติดต่อ BIRSA",
    ],
    contactsTitle: "ช่องทางติดต่อและช่องทางทางการ",
    contactsBody: "BIRSA จะอัปเดตข้อมูลผ่านช่องทางด้านล่างนี้ หากต้องการติดต่อเราโดยตรง สามารถใช้ข้อมูลติดต่อที่ระบุไว้ได้",
  },
};

export default async function EmergencyPage({ params }: { params: Promise<{ lang: string }> }) {
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
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-8 py-10">
        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.whatToDoTitle}</h2>
          <ul className="text-muted flex list-disc flex-col gap-2 pl-5 leading-relaxed">
            {t.whatToDoItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.contactsTitle}</h2>
          <p className="text-muted leading-relaxed">{t.contactsBody}</p>
          <ul className="text-muted mt-2 flex flex-col gap-2 text-sm">
            <li>
              <Email address={contact.email} className="hover:text-brand-deep underline" />
            </li>
            <li>{contact.phone}</li>
            <li>{contact.address[locale]}</li>
            {socials
              .filter((social) => !social.placeholder && social.id !== "email")
              .map((social) => (
                <li key={social.id}>
                  <ExternalLink
                    href={social.href}
                    newTabLabel={dict.a11y.newTab}
                    className="hover:text-brand-deep underline"
                  >
                    {social.label}
                  </ExternalLink>
                </li>
              ))}
          </ul>
        </section>
      </div>
    </>
  );
}
