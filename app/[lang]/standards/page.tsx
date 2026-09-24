import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Notice from "@/components/Notice";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const t = content[locale];

  const description =
    locale === "th"
      ? "วิธีที่ BIRSA สร้างเว็บไซต์นี้ ทั้งหลักการออกแบบ การเข้าถึงสำหรับทุกคน ข้อมูลการใช้งาน และการดูแลเว็บไซต์ให้ถูกต้องเป็นปัจจุบัน"
      : "How BIRSA builds this site, including our design principles, our approach to accessibility, performance and data, and how the site is maintained.";
  return buildMetadata({ locale, title: t.title, description, path: "/standards" });
}

const content: Record<
  Locale,
  {
    title: string;
    lede: string;
    principlesTitle: string;
    principles: { title: string; body: string }[];
    a11yTitle: string;
    a11ySummary: string;
    a11yLink: string;
    perfTitle: string;
    perfBody: string;
    perfNotice: string;
    maintainTitle: string;
    maintainBody: string;
  }
> = {
  en: {
    title: "How this site works",
    lede: "We build this site openly, against a clear set of standards.",
    principlesTitle: "Our design principles",
    principles: [
      {
        title: "Start with what students need",
        body: "Every page exists because students asked a real question, not because it looked good on an org chart. If a page does not help you do something, we cut it.",
      },
      {
        title: "Use simple, direct language",
        body: "Short sentences, everyday words, no jargon. If a rule or process is genuinely complicated, we explain it in the smallest number of plain steps we can.",
      },
      {
        title: "Make it work for everyone",
        body: "Keyboard-only, screen readers, small screens, slow connections, both languages: the site should work well under all of these, not just the easy case.",
      },
      {
        title: "Join up our channels",
        body: "This site, our socials, and the official BIR office links should tell a consistent story. Where information comes from the BIR office or the university rather than from BIRSA, we say so and link to the source.",
      },
      {
        title: "Keep improving in the open",
        body: "Content is never really 'finished'. We'd rather ship something useful now and fix gaps quickly than wait for a perfect version that never arrives.",
      },
    ],
    a11yTitle: "Accessibility",
    a11ySummary:
      "Our accessibility statement says how accessible this site is, lists the problems we know about, and explains how to report one or ask for information in another format.",
    a11yLink: "Read the accessibility statement",
    perfTitle: "Performance and data",
    perfBody:
      "We use cookieless, privacy-friendly analytics to understand which pages are useful and where people get stuck, never to track individuals.",
    perfNotice:
      "We'll publish usage statistics here once the site has launched and we have meaningful data to share.",
    maintainTitle: "How this site is maintained",
    maintainBody:
      "The content and code for this site live in a version-controlled repository. Changes are reviewed by the BIRSA committee before they go live, and we expect to iterate on this site frequently rather than treat it as a one-off project.",
  },
  th: {
    title: "เว็บไซต์นี้ทำงานอย่างไร",
    lede: "เราสร้างเว็บไซต์นี้อย่างเปิดเผย โดยยึดมาตรฐานที่ชัดเจน",
    principlesTitle: "หลักการออกแบบของเรา",
    principles: [
      {
        title: "เริ่มจากสิ่งที่นักศึกษาต้องการจริง ๆ",
        body: "ทุกหน้าในเว็บนี้มีที่มาจากคำถามจริงของนักศึกษา ไม่ใช่เพราะดูดีในผังองค์กร ถ้าหน้าไหนช่วยคุณทำอะไรไม่ได้จริง เราจะตัดทิ้ง",
      },
      {
        title: "ใช้ภาษาที่เข้าใจง่ายและตรงประเด็น",
        body: "ประโยคสั้น ใช้คำที่คนทั่วไปเข้าใจ ไม่ใช้ศัพท์เทคนิคโดยไม่จำเป็น ถ้าเรื่องไหนซับซ้อนจริง เราจะอธิบายเป็นขั้นตอนที่น้อยและง่ายที่สุดเท่าที่ทำได้",
      },
      {
        title: "ทำให้ทุกคนใช้งานได้",
        body: "ไม่ว่าจะใช้คีย์บอร์ดอย่างเดียว ใช้โปรแกรมอ่านหน้าจอ หน้าจอมือถือขนาดเล็ก อินเทอร์เน็ตช้า หรืออ่านภาษาไทยหรืออังกฤษ เว็บนี้ควรใช้งานได้ดีในทุกกรณี ไม่ใช่แค่กรณีที่ง่ายที่สุด",
      },
      {
        title: "เชื่อมโยงทุกช่องทางให้ไปด้วยกัน",
        body: "เว็บไซต์นี้ โซเชียลของเรา และลิงก์ทางการของ BIR ควรให้ข้อมูลที่สอดคล้องกัน ข้อมูลส่วนใดมาจากสำนักงาน BIR หรือมหาวิทยาลัยแทนที่จะมาจาก BIRSA เราจะระบุและลิงก์ไปยังแหล่งที่มา",
      },
      {
        title: "พัฒนาต่อเนื่องอย่างเปิดเผย",
        body: 'เนื้อหาในเว็บนี้ไม่มีวัน "เสร็จสมบูรณ์" จริง ๆ เราเลือกที่จะเผยแพร่สิ่งที่มีประโยชน์ตอนนี้ แล้วรีบแก้ไขจุดที่ขาดหาย แทนที่จะรอเวอร์ชันสมบูรณ์แบบที่ไม่มีวันมาถึง',
      },
    ],
    a11yTitle: "การเข้าถึงเว็บไซต์",
    a11ySummary:
      "คำแถลงการเข้าถึงเว็บไซต์ของเราบอกว่าเว็บไซต์นี้เข้าถึงได้ดีเพียงใด ปัญหาที่เรารับทราบ และวิธีแจ้งปัญหาหรือขอข้อมูลในรูปแบบอื่น",
    a11yLink: "อ่านคำแถลงการเข้าถึงเว็บไซต์",
    perfTitle: "ข้อมูลการใช้งาน",
    perfBody:
      "เราใช้ระบบวิเคราะห์ข้อมูลแบบไม่ใช้คุกกี้และเป็นมิตรกับความเป็นส่วนตัว เพื่อดูว่าหน้าไหนมีประโยชน์และตรงไหนที่คนใช้งานติดขัด โดยไม่ติดตามตัวบุคคล",
    perfNotice:
      "เราจะเผยแพร่สถิติการใช้งานที่นี่หลังจากเว็บไซต์เปิดใช้งานจริงและมีข้อมูลที่พอจะแชร์ได้",
    maintainTitle: "การดูแลเว็บไซต์",
    maintainBody:
      "เนื้อหาและโค้ดของเว็บไซต์นี้เก็บอยู่ในระบบควบคุมเวอร์ชัน การเปลี่ยนแปลงทุกครั้งจะผ่านการตรวจสอบโดยคณะกรรมการ BIRSA ก่อนเผยแพร่ และเราตั้งใจจะปรับปรุงเว็บไซต์นี้อย่างต่อเนื่อง ไม่ใช่ทำครั้งเดียวจบ",
  },
};

export default async function StandardsPage({ params }: { params: Promise<{ lang: string }> }) {
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
        <section className="flex flex-col gap-5">
          <h2 className="font-display text-2xl">{t.principlesTitle}</h2>
          <ol className="flex flex-col gap-4">
            {t.principles.map((principle) => (
              <li key={principle.title}>
                <h3 className="font-semibold text-ink">{principle.title}</h3>
                <p className="mt-1 leading-relaxed text-muted">{principle.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="accessibility" className="flex flex-col gap-4">
          <h2 className="font-display text-2xl">{t.a11yTitle}</h2>
          <p className="leading-relaxed text-muted">{t.a11ySummary}</p>
          <p>
            <Link
              href={localeHref(locale, "/accessibility")}
              className="font-semibold text-brand-deep underline hover:text-brand-dark"
            >
              {t.a11yLink}
            </Link>
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-2xl">{t.perfTitle}</h2>
          <p className="leading-relaxed text-muted">{t.perfBody}</p>
          <Notice variant="info">{t.perfNotice}</Notice>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-2xl">{t.maintainTitle}</h2>
          <p className="leading-relaxed text-muted">{t.maintainBody}</p>
        </section>
      </div>
    </>
  );
}
