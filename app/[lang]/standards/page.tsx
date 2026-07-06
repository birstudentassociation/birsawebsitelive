import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Notice from "@/components/Notice";
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

  return buildMetadata({ locale, title: t.title, description: t.lede, path: "/standards" });
}

const content: Record<
  Locale,
  {
    title: string;
    lede: string;
    principlesTitle: string;
    principles: { title: string; body: string }[];
    a11yTitle: string;
    a11yIntro: string;
    a11yWhatWeDoTitle: string;
    a11yWhatWeDo: string[];
    a11yLimitsTitle: string;
    a11yLimits: string;
    a11yReportTitle: string;
    a11yReportBody: string;
    a11yReportCta: string;
    perfTitle: string;
    perfBody: string;
    perfNotice: string;
    maintainTitle: string;
    maintainBody: string;
  }
> = {
  en: {
    title: "How this site works",
    lede: "We build this site openly, against a clear set of standards — here's what we aim for, and where we're still catching up.",
    principlesTitle: "Our design principles",
    principles: [
      {
        title: "Start with what students need",
        body: "Every page exists because students asked a real question — not because it looked good on an org chart. If a page doesn't help you do something, we cut it.",
      },
      {
        title: "Use simple, direct language",
        body: "Short sentences, everyday words, no jargon. If a rule or process is genuinely complicated, we explain it in the smallest number of plain steps we can.",
      },
      {
        title: "Make it work for everyone",
        body: "Keyboard-only, screen readers, small screens, slow connections, both languages — the site should work well under all of these, not just the easy case.",
      },
      {
        title: "Join up our channels",
        body: "This site, our socials, and the official BIR office links should tell a consistent story. Where something is unofficial or student-run, we say so clearly.",
      },
      {
        title: "Keep improving in the open",
        body: "Content is never really 'finished'. We'd rather ship something useful now and fix gaps quickly than wait for a perfect version that never arrives.",
      },
    ],
    a11yTitle: "Accessibility statement",
    a11yIntro: "We aim to meet WCAG 2.2 at level AA across this site.",
    a11yWhatWeDoTitle: "What we do",
    a11yWhatWeDo: [
      "Every feature can be operated with a keyboard alone, with a visible focus indicator.",
      "Pages use correct heading structure and landmark regions so screen readers can navigate them predictably.",
      "Our colour palette is contrast-checked, and we never use colour as the only way to convey meaning.",
      "Motion respects your system's \"reduce motion\" setting — we don't add animation that ignores it.",
      "Pages stay readable and usable at 320px-wide screens and at 400% browser zoom.",
      "The whole site is bilingual, with the correct `lang` attribute set on every page.",
      "The site supports both light and dark colour modes, both checked against WCAG contrast requirements. It follows your device setting by default, and you can switch it any time with the toggle in the header.",
    ],
    a11yLimitsTitle: "Known limitations",
    a11yLimits:
      "We're honest that this site is still young. Some content (example dates, room numbers, and similar details) is placeholder text pending review by the BIRSA committee, and is marked as such. If you hit a genuine accessibility barrier, it's a bug — please tell us.",
    a11yReportTitle: "Report a problem",
    a11yReportBody: `If something on this site is hard to use, contact BIRSA and describe the problem and, if you can, the page and device you were using. You can also email us directly at ${contact.email}.`,
    a11yReportCta: "Contact BIRSA",
    perfTitle: "Performance and data",
    perfBody: "We use cookieless, privacy-friendly analytics to understand which pages are useful and where people get stuck — never to track individuals.",
    perfNotice: "We'll publish usage statistics here once the site has launched and we have meaningful data to share.",
    maintainTitle: "How this site is maintained",
    maintainBody:
      "The content and code for this site live in a version-controlled repository. Changes are reviewed by the BIRSA committee before they go live, and we expect to iterate on this site frequently rather than treat it as a one-off project.",
  },
  th: {
    title: "เว็บไซต์นี้ทำงานอย่างไร",
    lede: "เราสร้างเว็บไซต์นี้อย่างเปิดเผย โดยยึดมาตรฐานที่ชัดเจน นี่คือสิ่งที่เราตั้งใจทำ และส่วนที่เรายังต้องพัฒนาต่อ",
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
        body: "เว็บไซต์นี้ โซเชียลของเรา และลิงก์ทางการของ BIR ควรให้ข้อมูลที่สอดคล้องกัน ตรงไหนที่ไม่เป็นทางการหรือดูแลโดยนักศึกษา เราจะบอกให้ชัดเจน",
      },
      {
        title: "พัฒนาต่อเนื่องอย่างเปิดเผย",
        body: "เนื้อหาในเว็บนี้ไม่มีวัน \"เสร็จสมบูรณ์\" จริง ๆ เราเลือกที่จะเผยแพร่สิ่งที่มีประโยชน์ตอนนี้ แล้วรีบแก้ไขจุดที่ขาดหาย แทนที่จะรอเวอร์ชันสมบูรณ์แบบที่ไม่มีวันมาถึง",
      },
    ],
    a11yTitle: "การเข้าถึงเว็บไซต์",
    a11yIntro: "เราตั้งเป้าให้เว็บไซต์นี้ผ่านมาตรฐาน WCAG 2.2 ระดับ AA",
    a11yWhatWeDoTitle: "สิ่งที่เราทำ",
    a11yWhatWeDo: [
      "ทุกฟีเจอร์ใช้งานได้ด้วยคีย์บอร์ดอย่างเดียว พร้อมเส้นโฟกัสที่มองเห็นชัดเจน",
      "แต่ละหน้าจัดโครงสร้างหัวข้อและแลนด์มาร์กอย่างถูกต้อง เพื่อให้โปรแกรมอ่านหน้าจอนำทางได้อย่างคาดเดาได้",
      "โทนสีของเราผ่านการตรวจสอบคอนทราสต์ และเราไม่ใช้สีเป็นวิธีเดียวในการสื่อความหมาย",
      "การเคลื่อนไหวบนเว็บเคารพการตั้งค่า \"ลดการเคลื่อนไหว\" ของระบบคุณ เราไม่เพิ่มแอนิเมชันที่ไม่สนใจการตั้งค่านี้",
      "หน้าเว็บยังอ่านและใช้งานได้ที่ความกว้างหน้าจอ 320px และเมื่อซูมเบราว์เซอร์ 400%",
      "เว็บไซต์ทั้งหมดรองรับสองภาษา และตั้งค่า `lang` ที่ถูกต้องในทุกหน้า",
      "เว็บไซต์นี้มีทั้งโหมดสว่างและโหมดมืด ผ่านการตรวจสอบคอนทราสต์สีแล้วทั้งคู่ โดยค่าเริ่มต้นจะเป็นไปตามการตั้งค่าของอุปกรณ์คุณ และสลับได้ทุกเมื่อด้วยปุ่มที่ส่วนหัวของเว็บไซต์",
    ],
    a11yLimitsTitle: "ข้อจำกัดที่เรายอมรับตรง ๆ",
    a11yLimits:
      "เราขอบอกตรง ๆ ว่าเว็บไซต์นี้ยังใหม่ เนื้อหาบางส่วน (เช่น วันที่ตัวอย่าง หรือหมายเลขห้องตัวอย่าง) เป็นเนื้อหาตัวอย่างที่รอ BIRSA ตรวจสอบ และมีการระบุไว้ชัดเจน ถ้าคุณเจออุปสรรคในการเข้าถึงจริง ๆ นั่นคือข้อบกพร่องที่เราต้องแก้ บอกเราได้เลย",
    a11yReportTitle: "แจ้งปัญหา",
    a11yReportBody: `ถ้ามีจุดไหนในเว็บไซต์นี้ใช้งานยาก ติดต่อ BIRSA พร้อมอธิบายปัญหา และถ้าเป็นไปได้ ระบุหน้าและอุปกรณ์ที่คุณใช้ด้วย หรืออีเมลถึงเราโดยตรงที่ ${contact.email}`,
    a11yReportCta: "ติดต่อ BIRSA",
    perfTitle: "ข้อมูลการใช้งาน",
    perfBody: "เราใช้ระบบวิเคราะห์ข้อมูลแบบไม่ใช้คุกกี้และเป็นมิตรกับความเป็นส่วนตัว เพื่อดูว่าหน้าไหนมีประโยชน์และตรงไหนที่คนใช้งานติดขัด โดยไม่ติดตามตัวบุคคล",
    perfNotice: "เราจะเผยแพร่สถิติการใช้งานที่นี่หลังจากเว็บไซต์เปิดใช้งานจริงและมีข้อมูลที่พอจะแชร์ได้",
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
                <h3 className="text-ink font-semibold">{principle.title}</h3>
                <p className="text-muted mt-1 leading-relaxed">{principle.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-2xl">{t.a11yTitle}</h2>
          <p className="text-muted leading-relaxed">{t.a11yIntro}</p>

          <h3 className="text-ink font-semibold">{t.a11yWhatWeDoTitle}</h3>
          <ul className="flex flex-col gap-2">
            {t.a11yWhatWeDo.map((item) => (
              <li key={item} className="text-muted leading-relaxed">
                {item}
              </li>
            ))}
          </ul>

          <h3 className="text-ink font-semibold">{t.a11yLimitsTitle}</h3>
          <p className="text-muted leading-relaxed">{t.a11yLimits}</p>

          <h3 className="text-ink font-semibold">{t.a11yReportTitle}</h3>
          <p className="text-muted leading-relaxed">
            {t.a11yReportBody}{" "}
            <Link
              href={localeHref(locale, "/services/contact")}
              className="text-brand-deep hover:text-brand-dark font-semibold underline"
            >
              {t.a11yReportCta}
            </Link>
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-2xl">{t.perfTitle}</h2>
          <p className="text-muted leading-relaxed">{t.perfBody}</p>
          <Notice variant="info">{t.perfNotice}</Notice>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-2xl">{t.maintainTitle}</h2>
          <p className="text-muted leading-relaxed">{t.maintainBody}</p>
        </section>
      </div>
    </>
  );
}
