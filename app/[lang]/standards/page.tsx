import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Accordion from "@/components/bds/Accordion";
import Breadcrumbs from "@/components/bds/Breadcrumbs";
import Button from "@/components/bds/Button";
import Email from "@/components/bds/Email";
import { Wrap, Stack, Section } from "@/components/bds/Layout";
import Notice from "@/components/bds/Notice";
import PageHeader from "@/components/bds/PageHeader";
import { Heading, Text } from "@/components/bds/Type";
import { contact } from "@/content/site";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

/**
 * `/standards`: the accessibility statement (ROUTE-MAP-2.0 Wave 5F,
 * REDESIGN-2.0 §9, BUILD-BRIEF-2.0 §7, docs/ACCESSIBILITY-TESTING.md).
 *
 * WCAG 2.2 AA is stated here as the floor BIRSA holds itself to, publicly,
 * and the honesty this page depends on cuts both ways: what is tested and
 * caught automatically, and what is NOT yet tested, named plainly rather
 * than folded into vague reassurance. A disabled reader deciding whether to
 * trust this site needs to know where the untested edges are, not be told
 * there are none.
 *
 * docs/ACCESSIBILITY-TESTING.md is the internal checklist a person with real
 * assistive technology works through; it is not published (it says so
 * itself), and this page is the honest public summary of where that
 * checklist currently stands: not yet run. The moment a row in that
 * checklist has a genuine date, tester and result, this statement is the
 * place that gets to say so by name.
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
        body: "Keyboard-only, screen readers, small screens, slow connections, both languages. The site should work well under all of these, not just the easy case.",
      },
      {
        title: "Join up our channels",
        body: "This site, our socials, and the official BIR office links should tell a consistent story. Where information comes from the BIR office or the university rather than from BIRSA, we say so and link to the source.",
      },
      {
        title: "Keep improving in the open",
        body: "Content is never really finished. We would rather ship something useful now and fix gaps quickly than wait for a perfect version that never arrives.",
      },
    ],
    a11yTitle: "Accessibility statement",
    a11yIntro:
      "This is a voluntary accessibility statement, modelled on the one the UK Government Digital Service asks its services to publish. BIRSA is a student-run society, not a public body, so no law requires this. We publish it because we think every site should be honest about how usable it actually is.",
    a11yComplianceStatus:
      "This site is partially compliant with the Web Content Accessibility Guidelines (WCAG) 2.2 level AA. It is partially compliant because we have not yet tested it with real assistive technology, and because of the other known issues listed below, not because of a specific failure we are aware of and have not fixed.",
    a11yWhatWeDoTitle: "What we do",
    a11yWhatWeDo: [
      "Every feature can be operated with a keyboard alone, with a visible focus indicator that we never remove.",
      "Pages use one heading per page and a correct heading order, plus landmark regions, so screen readers can navigate them predictably.",
      "Our colour palette is contrast checked in both light and dark mode, and we never use colour as the only way to convey meaning.",
      "Motion respects your system's reduce motion setting. We do not add animation that ignores it.",
      "Pages stay readable and usable at 320 pixel wide screens and at 400 percent browser zoom, with a target size of at least 44 pixels for anything you tap or click.",
      "The whole site is bilingual, with the correct lang attribute set on every page, and every page carries a consistent help link in the same place.",
      "The site supports both light and dark colour modes, both checked against WCAG contrast requirements. It follows your device setting by default, and you can switch it any time with the toggle in the header.",
    ],
    a11yTestTitle: "How we test",
    a11yTest:
      "Two automated test suites run on every code change, in Chrome, Firefox and Safari's rendering engines. The first, built on axe-core, sweeps every page template, in both Thai and English and in both light and dark colour mode, against the WCAG 2.0, 2.1 and 2.2 A and AA rules. The second drives every page with a keyboard only, checking things the first cannot, such as whether focus is always visible and never trapped, whether menus and dialogs open and close correctly, and whether a complete form can be finished without a mouse. Automated testing alone does not prove a service is accessible. It catches a defined set of technical faults and nothing more.",
    a11yLimitsTitle: "Known gaps",
    a11yLimitsIntro:
      "These are the gaps we already know about. We would rather name them than let you find them without warning.",
    a11yIssues: [
      {
        title: "No assistive technology testing yet",
        body: "We have not tested this site with a real screen reader, screen magnifier or speech recognition software. Our automated checks catch a defined set of technical faults, but they cannot show whether the site genuinely works well for someone using one of those tools, so some barriers may exist that we have not found yet (this touches WCAG 4.1.2 and others). We keep an internal checklist for exactly this testing and plan to work through it before we leave beta. If you hit a barrier before then, use the reporting route below.",
      },
      {
        title: "Sanity Studio, the editing tool BIRSA officers use, is not fully covered",
        body: "The public site is what this statement is about, and it is what the automated suites above test. The separate editing tool officers use to publish content is a third party product, so its accessibility is not fully within our control, and we have not yet tested it directly with assistive technology either. If a BIRSA officer relies on assistive technology and finds the editing tool hard to use, that is worth telling the committee, since it affects who can safely take on an editing role.",
      },
      {
        title: "Some placeholder content",
        body: "A few details, such as example dates or room numbers, are placeholder text pending review by the BIRSA committee, and are labelled as such. This is a content accuracy gap rather than an accessibility barrier, but we mention it for honesty.",
      },
    ],
    a11yPreparedTitle: "When we prepared this",
    a11yPrepared:
      "This statement was first prepared on 14 July 2026 and last reviewed on 23 August 2026. We review it at least once a year, and whenever we make a significant change to the site.",
    a11yReportTitle: "Report a problem",
    a11yReportBody:
      "If something on this site is hard to use, contact BIRSA and describe the problem and, if you can, the page and device you were using. You can also email us directly.",
    a11yReportCta: "Contact BIRSA",
    perfTitle: "Performance and data",
    perfBody:
      "We use cookieless, privacy-friendly analytics to understand which pages are useful and where people get stuck, never to track individuals. See our cookies page for exactly what this site sets in your browser and why.",
    perfNotice:
      "We will publish usage statistics here once the site has launched and we have meaningful data to share.",
    maintainTitle: "How this site is maintained",
    maintainBody:
      "The content and code for this site live in a version controlled repository. Changes are reviewed by the BIRSA committee before they go live, and we expect to iterate on this site frequently rather than treat it as a one-off project.",
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
        body: "เนื้อหาในเว็บนี้ไม่มีวันเสร็จสมบูรณ์จริง เราเลือกที่จะเผยแพร่สิ่งที่มีประโยชน์ตอนนี้ แล้วรีบแก้ไขจุดที่ขาดหาย แทนที่จะรอเวอร์ชันสมบูรณ์แบบที่ไม่มีวันมาถึง",
      },
    ],
    a11yTitle: "การเข้าถึงเว็บไซต์",
    a11yIntro:
      "นี่คือคำแถลงการเข้าถึงแบบสมัครใจ ซึ่งอิงตามแบบที่หน่วยงาน Government Digital Service ของสหราชอาณาจักรกำหนดให้บริการต่าง ๆ เผยแพร่ BIRSA เป็นสโมสรที่ดูแลโดยนักศึกษา ไม่ใช่หน่วยงานรัฐ จึงไม่มีกฎหมายบังคับ แต่เราเผยแพร่เพราะเชื่อว่าทุกเว็บไซต์ควรพูดตรง ๆ ว่าใช้งานได้ดีแค่ไหน",
    a11yComplianceStatus:
      "เว็บไซต์นี้ผ่านมาตรฐาน WCAG 2.2 ระดับ AA เป็นบางส่วน ที่ระบุว่าเป็นบางส่วนเพราะเรายังไม่ได้ทดสอบด้วยเทคโนโลยีสิ่งอำนวยความสะดวกจริง และเพราะข้อจำกัดอื่นที่ระบุไว้ด้านล่าง ไม่ใช่เพราะมีจุดที่เรารู้ว่าไม่ผ่านแล้วยังไม่แก้ไข",
    a11yWhatWeDoTitle: "สิ่งที่เราทำ",
    a11yWhatWeDo: [
      "ทุกฟีเจอร์ใช้งานได้ด้วยคีย์บอร์ดอย่างเดียว พร้อมเส้นโฟกัสที่มองเห็นชัดเจน ซึ่งเราไม่เคยลบออก",
      "แต่ละหน้ามีหัวข้อหลักเดียวและลำดับหัวข้อที่ถูกต้อง พร้อมแลนด์มาร์ก เพื่อให้โปรแกรมอ่านหน้าจอนำทางได้อย่างคาดเดาได้",
      "โทนสีของเราผ่านการตรวจสอบคอนทราสต์ทั้งโหมดสว่างและโหมดมืด และเราไม่ใช้สีเป็นวิธีเดียวในการสื่อความหมาย",
      "การเคลื่อนไหวบนเว็บเคารพการตั้งค่าลดการเคลื่อนไหวของระบบคุณ เราไม่เพิ่มแอนิเมชันที่ไม่สนใจการตั้งค่านี้",
      "หน้าเว็บยังอ่านและใช้งานได้ที่ความกว้างหน้าจอ 320 พิกเซล และเมื่อซูมเบราว์เซอร์ 400 เปอร์เซ็นต์ โดยปุ่มและลิงก์ทุกจุดมีขนาดอย่างน้อย 44 พิกเซล",
      "เว็บไซต์ทั้งหมดรองรับสองภาษา ตั้งค่า lang ที่ถูกต้องในทุกหน้า และทุกหน้ามีลิงก์ขอความช่วยเหลือในตำแหน่งเดียวกันเสมอ",
      "เว็บไซต์นี้มีทั้งโหมดสว่างและโหมดมืด ผ่านการตรวจสอบคอนทราสต์สีแล้วทั้งคู่ โดยค่าเริ่มต้นจะเป็นไปตามการตั้งค่าของอุปกรณ์คุณ และสลับได้ทุกเมื่อด้วยปุ่มที่ส่วนหัวของเว็บไซต์",
    ],
    a11yTestTitle: "เราตรวจสอบอย่างไร",
    a11yTest:
      "ทุกครั้งที่มีการแก้โค้ด ระบบทดสอบอัตโนมัติสองชุดจะทำงานบนเอนจินการแสดงผลของ Chrome, Firefox และ Safari ชุดแรกใช้ axe-core ตรวจทุกรูปแบบหน้า ทั้งภาษาไทยและอังกฤษ ทั้งโหมดสว่างและมืด เทียบกับกฎ WCAG 2.0, 2.1 และ 2.2 ระดับ A และ AA ชุดที่สองใช้งานทุกหน้าด้วยคีย์บอร์ดอย่างเดียว เพื่อตรวจสิ่งที่ชุดแรกตรวจไม่ได้ เช่น โฟกัสต้องมองเห็นชัดเจนเสมอและไม่ติดค้าง เมนูและกล่องโต้ตอบเปิดปิดได้ถูกต้อง และแบบฟอร์มทั้งหมดกรอกจนจบได้โดยไม่ต้องใช้เมาส์ การทดสอบอัตโนมัติเพียงอย่างเดียวไม่สามารถพิสูจน์ได้ว่าบริการเข้าถึงได้จริง เพราะจับได้เฉพาะข้อบกพร่องทางเทคนิคชุดหนึ่งเท่านั้น",
    a11yLimitsTitle: "ข้อจำกัดที่เรารู้",
    a11yLimitsIntro:
      "นี่คือข้อจำกัดที่เรารู้อยู่แล้ว เราเลือกที่จะบอกไว้ตรง ๆ ดีกว่าปล่อยให้คุณเจอเองโดยไม่ทันตั้งตัว",
    a11yIssues: [
      {
        title: "ยังไม่มีการทดสอบด้วยเทคโนโลยีสิ่งอำนวยความสะดวก",
        body: "เรายังไม่ได้ทดสอบเว็บไซต์นี้ด้วยโปรแกรมอ่านหน้าจอ โปรแกรมขยายหน้าจอ หรือซอฟต์แวร์สั่งงานด้วยเสียงตัวจริง การตรวจสอบอัตโนมัติของเราจับข้อบกพร่องทางเทคนิคได้เฉพาะชุดหนึ่งเท่านั้น แต่ไม่สามารถบอกได้ว่าเว็บไซต์ใช้งานได้ดีจริงสำหรับผู้ใช้เครื่องมือเหล่านั้นหรือไม่ จึงอาจมีอุปสรรคบางอย่างที่ยังไม่ถูกพบ (เกี่ยวข้องกับ WCAG 4.1.2 และข้ออื่น) เรามีรายการตรวจสอบภายในสำหรับการทดสอบนี้โดยเฉพาะ และวางแผนจะทำให้ครบก่อนออกจากช่วงเบต้า หากพบอุปสรรคก่อนหน้านั้น ใช้ช่องทางแจ้งปัญหาด้านล่าง",
      },
      {
        title: "Sanity Studio ซึ่งเป็นเครื่องมือแก้ไขเนื้อหาของเจ้าหน้าที่ BIRSA ยังตรวจสอบไม่ครบ",
        body: "คำแถลงฉบับนี้พูดถึงเว็บไซต์สาธารณะ ซึ่งเป็นสิ่งที่ชุดทดสอบอัตโนมัติข้างต้นตรวจสอบ ส่วนเครื่องมือแก้ไขเนื้อหาที่เจ้าหน้าที่ใช้เป็นผลิตภัณฑ์ของผู้ให้บริการภายนอก การเข้าถึงของเครื่องมือนี้จึงไม่ได้อยู่ในการควบคุมของเราทั้งหมด และเรายังไม่ได้ทดสอบโดยตรงด้วยเทคโนโลยีสิ่งอำนวยความสะดวกเช่นกัน หากเจ้าหน้าที่ BIRSA คนใดใช้เทคโนโลยีสิ่งอำนวยความสะดวกและพบว่าเครื่องมือนี้ใช้งานยาก ควรแจ้งคณะกรรมการ เพราะเกี่ยวข้องโดยตรงกับว่าใครสามารถรับหน้าที่แก้ไขเนื้อหาได้อย่างปลอดภัย",
      },
      {
        title: "มีเนื้อหาตัวอย่างบางส่วน",
        body: "รายละเอียดบางอย่าง เช่น วันที่ตัวอย่างหรือหมายเลขห้องตัวอย่าง เป็นเนื้อหาตัวอย่างที่รอ BIRSA ตรวจสอบ และมีการระบุไว้ชัดเจน นี่เป็นเรื่องความถูกต้องของเนื้อหา ไม่ใช่อุปสรรคด้านการเข้าถึง แต่เราขอบอกไว้เพื่อความตรงไปตรงมา",
      },
    ],
    a11yPreparedTitle: "จัดทำเมื่อไร",
    a11yPrepared:
      "คำแถลงนี้จัดทำครั้งแรกเมื่อวันที่ 14 กรกฎาคม 2026 และทบทวนล่าสุดเมื่อวันที่ 23 สิงหาคม 2026 เราทบทวนอย่างน้อยปีละครั้ง และทุกครั้งที่มีการเปลี่ยนแปลงสำคัญกับเว็บไซต์",
    a11yReportTitle: "แจ้งปัญหา",
    a11yReportBody:
      "ถ้ามีจุดไหนในเว็บไซต์นี้ใช้งานยาก ติดต่อ BIRSA พร้อมอธิบายปัญหา และถ้าเป็นไปได้ ระบุหน้าและอุปกรณ์ที่คุณใช้ด้วย หรืออีเมลถึงเราโดยตรง",
    a11yReportCta: "ติดต่อ BIRSA",
    perfTitle: "ข้อมูลการใช้งาน",
    perfBody:
      "เราใช้ระบบวิเคราะห์ข้อมูลแบบไม่ใช้คุกกี้และเป็นมิตรกับความเป็นส่วนตัว เพื่อดูว่าหน้าไหนมีประโยชน์และตรงไหนที่คนใช้งานติดขัด โดยไม่ติดตามตัวบุคคล ดูรายละเอียดที่หน้าคุกกี้ว่าเว็บไซต์นี้ตั้งค่าอะไรไว้ในเบราว์เซอร์ของคุณบ้างและเพราะเหตุใด",
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
        helpSlot={
          <Button href={localeHref(locale, "/contact")} variant="secondary">
            {dict.actions.contactUs}
          </Button>
        }
      />
      <Wrap className="flex max-w-[var(--measure)] flex-col gap-10 py-10">
        <Section as="div">
          <Stack gap="lg">
            <Heading level={2}>{t.principlesTitle}</Heading>
            <Stack as="ul" gap="md">
              {t.principles.map((principle) => (
                <li key={principle.title}>
                  <Text as="p" step="body" className="font-semibold text-ink">
                    {principle.title}
                  </Text>
                  <Text as="p" step="body" className="mt-1 text-muted">
                    {principle.body}
                  </Text>
                </li>
              ))}
            </Stack>
          </Stack>
        </Section>

        <div id="accessibility" className="scroll-mt-24">
          <Section as="div">
            <Stack gap="md">
              <Heading level={2}>{t.a11yTitle}</Heading>
              <Text step="body" className="text-muted">
                {t.a11yIntro}
              </Text>
              <Text step="body" className="text-muted">
                {t.a11yComplianceStatus}
              </Text>

              <Heading level={3}>{t.a11yWhatWeDoTitle}</Heading>
              <Stack as="ul" gap="xs" className="list-disc pl-5">
                {t.a11yWhatWeDo.map((item) => (
                  <Text as="li" step="body" key={item} className="text-muted">
                    {item}
                  </Text>
                ))}
              </Stack>

              <Heading level={3}>{t.a11yTestTitle}</Heading>
              <Text step="body" className="text-muted">
                {t.a11yTest}
              </Text>

              <Heading level={3}>{t.a11yLimitsTitle}</Heading>
              <Text step="body" className="text-muted">
                {t.a11yLimitsIntro}
              </Text>
              <Accordion
                items={t.a11yIssues.map((issue) => ({
                  id: issue.title,
                  summary: issue.title,
                  children: issue.body,
                }))}
              />

              <Heading level={3}>{t.a11yPreparedTitle}</Heading>
              <Text step="body" className="text-muted">
                {t.a11yPrepared}
              </Text>

              <Heading level={3}>{t.a11yReportTitle}</Heading>
              <Text step="body" className="text-muted">
                {t.a11yReportBody}{" "}
                <Email
                  address={contact.email}
                  className="font-semibold text-brand-deep hover:text-brand-dark"
                />{" "}
                {locale === "th" ? "หรือ" : "or"}{" "}
                <Email
                  address={contact.secondaryEmail}
                  className="font-semibold text-brand-deep hover:text-brand-dark"
                />
                .{" "}
                <Link
                  href={localeHref(locale, "/contact")}
                  className="font-semibold text-brand-deep underline hover:text-brand-dark"
                >
                  {t.a11yReportCta}
                </Link>
              </Text>
            </Stack>
          </Section>
        </div>

        <Section as="div">
          <Stack gap="md">
            <Heading level={2}>{t.perfTitle}</Heading>
            <Text step="body" className="text-muted">
              {t.perfBody}
            </Text>
            <Notice variant="info">{t.perfNotice}</Notice>
          </Stack>
        </Section>

        <Section as="div">
          <Stack gap="md">
            <Heading level={2}>{t.maintainTitle}</Heading>
            <Text step="body" className="text-muted">
              {t.maintainBody}
            </Text>
          </Stack>
        </Section>
      </Wrap>
    </>
  );
}
