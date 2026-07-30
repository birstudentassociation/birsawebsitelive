import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Notice from "@/components/Notice";
import Email from "@/components/Email";
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
    a11yComplianceStatus: string;
    a11yWhatWeDoTitle: string;
    a11yWhatWeDo: string[];
    a11yTestTitle: string;
    a11yTest: string;
    a11yLimitsTitle: string;
    a11yLimitsIntro: string;
    a11yIssues: { title: string; body: string }[];
    a11yPreparedTitle: string;
    a11yPrepared: string;
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
    a11yTitle: "Accessibility statement",
    a11yIntro:
      "This is a voluntary accessibility statement, modelled on the one the UK Government Digital Service asks its services to publish. BIRSA is a student-run society, not a public body, so no law requires this. We publish it because we think every site should be honest about how usable it is.",
    a11yComplianceStatus:
      "This site is partially compliant with the Web Content Accessibility Guidelines (WCAG) 2.2 level AA. It is “partially” compliant because we have not yet tested it with real assistive technology, and because of the other known issues listed below, not because of a specific failure we are aware of.",
    a11yWhatWeDoTitle: "What we do",
    a11yWhatWeDo: [
      "Every feature can be operated with a keyboard alone, with a visible focus indicator.",
      "Pages use correct heading structure and landmark regions so screen readers can navigate them predictably.",
      "Our colour palette is contrast-checked, and we never use colour as the only way to convey meaning.",
      'Motion respects your system\'s "reduce motion" setting: we do not add animation that ignores it.',
      "Pages stay readable and usable at 320px-wide screens and at 400% browser zoom.",
      "The whole site is bilingual, with the correct `lang` attribute set on every page.",
      "The site supports both light and dark colour modes, both checked against WCAG contrast requirements. It follows your device setting by default, and you can switch it any time with the toggle in the header.",
    ],
    a11yTestTitle: "How we test",
    a11yTest:
      "Two automated test suites run on every code change, in Chrome, Firefox and Safari's rendering engines. The first (axe-core) sweeps every page template, in both Thai and English and in both light and dark colour mode, against the WCAG 2.0, 2.1 and 2.2 A and AA rules. The second drives every page with a keyboard only, checking things the first cannot: that focus is always visible and never trapped, that menus and dialogs open and close correctly, and that a complete form can be finished without a mouse. Automated testing alone does not prove a service is accessible: it catches a defined set of technical faults and nothing more. We have not yet tested this site with real assistive technology, such as a screen reader, a screen magnifier, or speech-recognition software. That is the biggest gap in our current testing, and the reason this statement says “partially compliant” rather than “compliant”.",
    a11yLimitsTitle: "Known issues",
    a11yLimitsIntro: "These are the known issues:",
    a11yIssues: [
      {
        title: "No assistive-technology testing yet",
        body: "Our automated checks catch a defined set of technical faults, but automated testing alone cannot show whether the site actually works well for someone using a screen reader, a screen magnifier, or speech-recognition software. We have not carried out that testing yet, with any of those technologies, so some barriers may go unnoticed (WCAG 4.1.2 and others). Planned before we leave beta; use the reporting route below if you hit a barrier before then.",
      },
      {
        title: "Some placeholder content",
        body: "A few details (example dates, room numbers and similar) are placeholder text pending review by the BIRSA committee, and are labelled as such. This is a content-accuracy gap rather than an accessibility barrier, but we mention it for honesty.",
      },
    ],
    a11yPreparedTitle: "When we prepared this",
    a11yPrepared:
      "This statement was first prepared on 14 July 2026 and last reviewed on 30 July 2026. We review it at least once a year, and whenever we make a significant change to the site.",
    a11yReportTitle: "Report a problem",
    a11yReportBody:
      "If something on this site is hard to use, contact BIRSA and describe the problem and, if you can, the page and device you were using. You can also email us directly at",
    a11yReportCta: "Contact BIRSA",
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
    a11yIntro:
      "นี่คือคำแถลงการเข้าถึงแบบสมัครใจ ซึ่งอิงตามแบบที่หน่วยงาน Government Digital Service ของสหราชอาณาจักรกำหนดให้บริการต่าง ๆ เผยแพร่ BIRSA เป็นสโมสรที่ดูแลโดยนักศึกษา ไม่ใช่หน่วยงานรัฐ จึงไม่มีกฎหมายบังคับ แต่เราเผยแพร่เพราะเชื่อว่าทุกเว็บไซต์ควรพูดตรง ๆ ว่าใช้งานได้ดีแค่ไหน",
    a11yComplianceStatus:
      "เว็บไซต์นี้ผ่านมาตรฐาน WCAG 2.2 ระดับ AA เป็นบางส่วน คำว่า “บางส่วน” มาจากการที่เรายังไม่ได้ทดสอบด้วยเทคโนโลยีสิ่งอำนวยความสะดวกจริง และข้อจำกัดอื่นที่ระบุไว้ด้านล่าง ไม่ใช่เพราะมีจุดที่เรารู้ว่าไม่ผ่านโดยเฉพาะ",
    a11yWhatWeDoTitle: "สิ่งที่เราทำ",
    a11yWhatWeDo: [
      "ทุกฟีเจอร์ใช้งานได้ด้วยคีย์บอร์ดอย่างเดียว พร้อมเส้นโฟกัสที่มองเห็นชัดเจน",
      "แต่ละหน้าจัดโครงสร้างหัวข้อและแลนด์มาร์กอย่างถูกต้อง เพื่อให้โปรแกรมอ่านหน้าจอนำทางได้อย่างคาดเดาได้",
      "โทนสีของเราผ่านการตรวจสอบคอนทราสต์ และเราไม่ใช้สีเป็นวิธีเดียวในการสื่อความหมาย",
      'การเคลื่อนไหวบนเว็บเคารพการตั้งค่า "ลดการเคลื่อนไหว" ของระบบคุณ เราไม่เพิ่มแอนิเมชันที่ไม่สนใจการตั้งค่านี้',
      "หน้าเว็บยังอ่านและใช้งานได้ที่ความกว้างหน้าจอ 320px และเมื่อซูมเบราว์เซอร์ 400%",
      "เว็บไซต์ทั้งหมดรองรับสองภาษา และตั้งค่า `lang` ที่ถูกต้องในทุกหน้า",
      "เว็บไซต์นี้มีทั้งโหมดสว่างและโหมดมืด ผ่านการตรวจสอบคอนทราสต์สีแล้วทั้งคู่ โดยค่าเริ่มต้นจะเป็นไปตามการตั้งค่าของอุปกรณ์คุณ และสลับได้ทุกเมื่อด้วยปุ่มที่ส่วนหัวของเว็บไซต์",
    ],
    a11yTestTitle: "เราตรวจสอบอย่างไร",
    a11yTest:
      "ทุกครั้งที่มีการแก้โค้ด ระบบทดสอบอัตโนมัติสองชุดจะทำงานบนเอนจินการแสดงผลของ Chrome, Firefox และ Safari ชุดแรก (axe-core) ตรวจทุกรูปแบบหน้า ทั้งภาษาไทยและอังกฤษ ทั้งโหมดสว่างและมืด เทียบกับกฎ WCAG 2.0, 2.1 และ 2.2 ระดับ A และ AA ชุดที่สองใช้งานทุกหน้าด้วยคีย์บอร์ดอย่างเดียว เพื่อตรวจสิ่งที่ชุดแรกตรวจไม่ได้ ได้แก่ โฟกัสต้องมองเห็นชัดเจนเสมอและไม่ติดค้าง เมนูและกล่องโต้ตอบเปิดปิดได้ถูกต้อง และแบบฟอร์มทั้งหมดกรอกจนจบได้โดยไม่ต้องใช้เมาส์ การทดสอบอัตโนมัติเพียงอย่างเดียวไม่สามารถพิสูจน์ได้ว่าบริการเข้าถึงได้จริง เพราะจับได้เฉพาะข้อบกพร่องทางเทคนิคชุดหนึ่งเท่านั้น เรายังไม่ได้ทดสอบเว็บไซต์นี้ด้วยเทคโนโลยีสิ่งอำนวยความสะดวกจริง เช่น โปรแกรมอ่านหน้าจอ โปรแกรมขยายหน้าจอ หรือซอฟต์แวร์สั่งงานด้วยเสียง นี่คือช่องว่างที่ใหญ่ที่สุดในการทดสอบปัจจุบันของเรา และเป็นเหตุผลที่คำแถลงนี้ระบุว่า “ผ่านมาตรฐานบางส่วน” แทนที่จะเป็น “ผ่านมาตรฐานเต็มรูปแบบ”",
    a11yLimitsTitle: "ข้อจำกัดที่เรารู้",
    a11yLimitsIntro: "ข้อจำกัดที่ทราบมีดังนี้",
    a11yIssues: [
      {
        title: "ยังไม่มีการทดสอบด้วยเทคโนโลยีสิ่งอำนวยความสะดวก",
        body: "การตรวจสอบอัตโนมัติของเราจับข้อบกพร่องทางเทคนิคได้เฉพาะชุดหนึ่งเท่านั้น แต่การทดสอบอัตโนมัติเพียงอย่างเดียวไม่สามารถบอกได้ว่าเว็บไซต์ใช้งานได้ดีจริงสำหรับผู้ใช้โปรแกรมอ่านหน้าจอ โปรแกรมขยายหน้าจอ หรือซอฟต์แวร์สั่งงานด้วยเสียง เรายังไม่ได้ทดสอบด้วยเทคโนโลยีเหล่านี้เลย จึงอาจมีอุปสรรคบางอย่างที่ยังไม่ถูกพบ (WCAG 4.1.2 และข้ออื่น ๆ) เราวางแผนจะทำก่อนออกจากช่วงเบต้า หากพบอุปสรรคก่อนหน้านั้น ใช้ช่องทางแจ้งปัญหาด้านล่าง",
      },
      {
        title: "มีเนื้อหาตัวอย่างบางส่วน",
        body: "รายละเอียดบางอย่าง (เช่น วันที่ตัวอย่าง หมายเลขห้องตัวอย่าง) เป็นเนื้อหาตัวอย่างที่รอ BIRSA ตรวจสอบ และมีการระบุไว้ชัดเจน นี่เป็นเรื่องความถูกต้องของเนื้อหา ไม่ใช่อุปสรรคด้านการเข้าถึง แต่เราขอบอกไว้เพื่อความตรงไปตรงมา",
      },
    ],
    a11yPreparedTitle: "จัดทำเมื่อไร",
    a11yPrepared:
      "คำแถลงนี้จัดทำครั้งแรกเมื่อวันที่ 14 กรกฎาคม 2026 และทบทวนล่าสุดเมื่อวันที่ 30 กรกฎาคม 2026 เราทบทวนอย่างน้อยปีละครั้ง และทุกครั้งที่มีการเปลี่ยนแปลงสำคัญกับเว็บไซต์",
    a11yReportTitle: "แจ้งปัญหา",
    a11yReportBody:
      "ถ้ามีจุดไหนในเว็บไซต์นี้ใช้งานยาก ติดต่อ BIRSA พร้อมอธิบายปัญหา และถ้าเป็นไปได้ ระบุหน้าและอุปกรณ์ที่คุณใช้ด้วย หรืออีเมลถึงเราโดยตรงที่",
    a11yReportCta: "ติดต่อ BIRSA",
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
                <h3 className="text-ink font-semibold">{principle.title}</h3>
                <p className="text-muted mt-1 leading-relaxed">{principle.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="accessibility" className="flex scroll-mt-24 flex-col gap-4">
          <h2 className="font-display text-2xl">{t.a11yTitle}</h2>
          <p className="text-muted leading-relaxed">{t.a11yIntro}</p>
          <p className="text-muted leading-relaxed">{t.a11yComplianceStatus}</p>

          <h3 className="text-ink font-semibold">{t.a11yWhatWeDoTitle}</h3>
          <ul className="flex flex-col gap-2">
            {t.a11yWhatWeDo.map((item) => (
              <li key={item} className="text-muted leading-relaxed">
                {item}
              </li>
            ))}
          </ul>

          <h3 className="text-ink font-semibold">{t.a11yTestTitle}</h3>
          <p className="text-muted leading-relaxed">{t.a11yTest}</p>

          <h3 className="text-ink font-semibold">{t.a11yLimitsTitle}</h3>
          <p className="text-muted leading-relaxed">{t.a11yLimitsIntro}</p>
          <ul className="flex flex-col gap-3">
            {t.a11yIssues.map((issue) => (
              <li key={issue.title}>
                <h4 className="text-ink font-semibold">{issue.title}</h4>
                <p className="text-muted mt-1 leading-relaxed">{issue.body}</p>
              </li>
            ))}
          </ul>

          <h3 className="text-ink font-semibold">{t.a11yPreparedTitle}</h3>
          <p className="text-muted leading-relaxed">{t.a11yPrepared}</p>

          <h3 className="text-ink font-semibold">{t.a11yReportTitle}</h3>
          <p className="text-muted leading-relaxed">
            {t.a11yReportBody}{" "}
            <Email
              address={contact.email}
              className="text-brand-deep hover:text-brand-dark font-semibold"
            />{" "}
            /{" "}
            <Email
              address={contact.secondaryEmail}
              className="text-brand-deep hover:text-brand-dark font-semibold"
            />
            .{" "}
            <Link
              href={localeHref(locale, "/contact")}
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
