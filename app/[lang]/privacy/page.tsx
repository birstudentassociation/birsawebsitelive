import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import { contact } from "@/content/site";

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

const content: Record<
  Locale,
  {
    title: string;
    lede: string;
    collectTitle: string;
    collectBody: string;
    cookiesTitle: string;
    cookiesBody: string;
    analyticsTitle: string;
    analyticsBody: string;
    adsTitle: string;
    adsBody: string;
    choicesTitle: string;
    choicesBody: string;
    contactCta: string;
  }
> = {
  en: {
    title: "Privacy",
    lede: "A plain-language summary of what we collect on this site, and why — there's less than you might think.",
    collectTitle: "What we collect",
    collectBody:
      "When you use a contact form on this site, we collect what you type in: your name, email address, and message. We use this only to reply to you, and it's sent to us by email. We don't store form submissions in a database.",
    cookiesTitle: "Cookies",
    cookiesBody:
      "This site sets one functional cookie, NEXT_LOCALE, which remembers whether you last read the site in Thai or English so we don't ask again. We don't set any tracking or advertising cookies. If you switch the light/dark mode toggle, we also save that choice in your browser's local storage (key birsa-theme) so the site remembers it next time — this stays on your device and is never sent to us.",
    analyticsTitle: "Analytics",
    analyticsBody:
      "We use cookieless, privacy-friendly analytics that count things like page views in aggregate. This doesn't identify you personally and can't be linked back to an individual visitor.",
    adsTitle: "No ads, no data sales",
    adsBody: "We don't run advertising on this site, and we never sell or share your data with third parties.",
    choicesTitle: "Your choices and questions",
    choicesBody:
      "You can clear your cookies at any time using your browser settings — this just means we'll ask your language preference again. If you have any questions about this notice or your data, get in touch.",
    contactCta: "Contact BIRSA",
  },
  th: {
    title: "ความเป็นส่วนตัว",
    lede: "สรุปสั้น ๆ แบบเข้าใจง่ายว่าเว็บไซต์นี้เก็บข้อมูลอะไรบ้างและทำไม ซึ่งน้อยกว่าที่คุณอาจคิด",
    collectTitle: "ข้อมูลที่เราเก็บ",
    collectBody:
      "เมื่อคุณใช้แบบฟอร์มติดต่อในเว็บไซต์นี้ เราจะเก็บสิ่งที่คุณกรอก ได้แก่ ชื่อ อีเมล และข้อความ เราใช้ข้อมูลนี้เพื่อตอบกลับคุณเท่านั้น โดยส่งถึงเราทางอีเมล เราไม่เก็บข้อมูลที่ส่งในฐานข้อมูลใด ๆ",
    cookiesTitle: "คุกกี้",
    cookiesBody:
      "เว็บไซต์นี้ใช้คุกกี้เพื่อการทำงานเพียงตัวเดียวคือ NEXT_LOCALE ซึ่งจดจำว่าครั้งล่าสุดคุณอ่านเว็บนี้เป็นภาษาไทยหรืออังกฤษ เพื่อไม่ต้องถามซ้ำ เราไม่ใช้คุกกี้เพื่อติดตามหรือโฆษณา นอกจากนี้ หากคุณสลับโหมดสว่าง/มืดด้วยปุ่มที่ส่วนหัวเว็บไซต์ เราจะบันทึกตัวเลือกนั้นไว้ใน local storage ของเบราว์เซอร์คุณ (คีย์ birsa-theme) เพื่อจดจำไว้ใช้ครั้งถัดไป ข้อมูลนี้อยู่บนอุปกรณ์ของคุณเท่านั้น ไม่ถูกส่งมาหาเรา",
    analyticsTitle: "การวิเคราะห์ข้อมูลการใช้งาน",
    analyticsBody:
      "เราใช้ระบบวิเคราะห์ข้อมูลแบบไม่ใช้คุกกี้และเป็นมิตรกับความเป็นส่วนตัว ซึ่งนับจำนวนการเข้าชมหน้าต่าง ๆ แบบภาพรวมเท่านั้น ไม่สามารถระบุตัวตนของคุณ หรือเชื่อมโยงกลับไปหาผู้เข้าชมรายใดรายหนึ่งได้",
    adsTitle: "ไม่มีโฆษณา ไม่ขายข้อมูล",
    adsBody: "เว็บไซต์นี้ไม่มีการลงโฆษณา และเราไม่ขายหรือแบ่งปันข้อมูลของคุณให้บุคคลที่สามเด็ดขาด",
    choicesTitle: "ทางเลือกของคุณและคำถามเพิ่มเติม",
    choicesBody:
      "คุณสามารถล้างคุกกี้ได้ทุกเมื่อผ่านการตั้งค่าเบราว์เซอร์ ซึ่งแปลว่าเราจะถามภาษาที่คุณต้องการอีกครั้งเท่านั้น หากมีคำถามเกี่ยวกับประกาศนี้หรือข้อมูลของคุณ ติดต่อเราได้เลย",
    contactCta: "ติดต่อ BIRSA",
  },
};

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
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-8 py-10">
        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.collectTitle}</h2>
          <p className="text-muted leading-relaxed">{t.collectBody}</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.cookiesTitle}</h2>
          <p className="text-muted leading-relaxed">{t.cookiesBody}</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.analyticsTitle}</h2>
          <p className="text-muted leading-relaxed">{t.analyticsBody}</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.adsTitle}</h2>
          <p className="text-muted leading-relaxed">{t.adsBody}</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-display text-2xl">{t.choicesTitle}</h2>
          <p className="text-muted leading-relaxed">
            {t.choicesBody}{" "}
            <Link
              href={localeHref(locale, "/services/contact")}
              className="text-brand-deep hover:text-brand-dark font-semibold underline"
            >
              {t.contactCta}
            </Link>{" "}
            {locale === "th" ? `หรืออีเมล ${contact.email}` : `or email ${contact.email}.`}
          </p>
        </section>
      </div>
    </>
  );
}
