import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import HelpPageShell from "@/components/help/HelpPageShell";
import { Heading, Text } from "@/components/bds/Type";
import { Stack } from "@/components/bds/Layout";
import Link from "next/link";

/**
 * `/help/getting-started` (ROUTE-MAP-2.0 Wave 5C, SCOPE-AUDIT-2.0 §3.2/§3.3
 * ABSORB rows for `home/getting-around.mdx` and
 * `international/arrival-and-first-week.mdx`).
 *
 * Absorbs the BIR-specific slice of both 1.0 pages: the setup order for a
 * new student's first week, and the Rangsit routing table (BIR classes are
 * at Tha Prachan, so reaching Rangsit is a BIR-specific need). The generic
 * Bangkok transit content in `getting-around.mdx` is dropped rather than
 * carried over: the 1.0 page says itself that it duplicates what Google
 * Maps transit directions already do live.
 */

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const copy = {
  en: {
    title: "Getting started at BIR",
    lede: "Arriving, your first week, and getting to Rangsit when a class or an office takes you there.",
    setupTitle: "What to set up first",
    setupSteps: [
      "Confirm your accommodation and get the keys or access sorted.",
      "Get a local SIM card, so you have data and a Thai number.",
      "If you are an international student, register with TU International Affairs and complete any arrival paperwork they require.",
      "Open a Thai bank account once you have the documents you need.",
      "Walk the route from where you live to campus at least once before your first class.",
      "Save key numbers: campus security, the BIR Programme office, and BIRSA's contact.",
    ],
    checklistTitle: "Your first week",
    checklist: [
      "Attend orientation sessions run by BIR and, if you are an international student, TU International Affairs.",
      "Find your faculty building and where your classes are held.",
      "Meet your academic advisor or programme coordinator if you are introduced to one.",
      "Join BIRSA's channels for events and updates.",
      "Identify the nearest pharmacy, hospital and grocery store to where you live.",
      "If you are an international student, note your visa's 90 day reporting deadline.",
    ],
    rangsitTitle: "Getting to Rangsit campus",
    rangsitLede:
      "BIR classes are at Tha Prachan, but you may still need to reach Thammasat's Rangsit campus for a joint faculty event, a central office, or a course held there. Five routes work.",
    rangsitTableCaption: "Routes between Tha Prachan and Rangsit campus",
    rangsitColumns: ["Route", "Legs", "Fare", "Journey time"],
    rangsitRows: [
      {
        route: "Expressway bus 1-9E",
        legs: "Direct bus from the Sanam Luang stop opposite Tha Prachan to Rangsit",
        fare: "27 baht",
        time: "About 1 hour 30 minutes, traffic dependent",
      },
      {
        route: "MRT then van",
        legs: 'MRT Sanam Chai to Chatuchak Park, then the "Mo Chit to Thammasat Rangsit" van from exit 4',
        fare: "45 baht MRT plus 45 baht van",
        time: "About 30 minutes MRT plus about 1 hour van, traffic dependent",
      },
      {
        route: "MRT then SRT Red Line",
        legs: "MRT Sanam Chai to Bang Sue, a 5 minute walk to Krung Thep Aphiwat, then the Red Line to Rangsit, then a taxi or ride hail to campus",
        fare: "45 baht MRT plus from 20 baht SRT",
        time: "About 30 minutes MRT plus about 25 minutes SRT plus about 20 minutes final leg",
      },
      {
        route: "Bus then van",
        legs: 'Bus 59 or 503 from Tha Prachan to Victory Monument, then the "Victory Monument to Thammasat Rangsit" van from Koh Phaya Thai',
        fare: "25 baht bus plus 47 baht van",
        time: "About 1 hour bus plus about 40 minutes van, both traffic dependent",
      },
      {
        route: "Bus then bus",
        legs: "Bus 59 or 503 from Tha Prachan to Victory Monument, then bus route 510 from Koh Phahonyothin to Thammasat Rangsit",
        fare: "25 baht plus 25 baht",
        time: "About 1 hour plus about 1 hour 30 minutes, traffic dependent",
      },
    ],
    rangsitNote:
      "The expressway bus 1-9E is a single direct journey. The MRT and SRT combination is usually the fastest but involves the most changes. Journey times depend on traffic and can run longer at peak hours.",
    socialTitle: "Settling in socially",
    socialBody:
      "BIRSA runs welcome events for new students to meet each other, international and home students alike.",
    socialCta: "See what's on",
    safetyTitle: "If anything feels wrong",
    safetyBody:
      "If anything ever leaves you feeling unsafe, uncomfortable or violated, by anyone, you have the right to report it.",
    safetyCta: "How to report it",
  },
  th: {
    title: "เริ่มต้นที่ BIR",
    lede: "การมาถึง สัปดาห์แรกของคุณ และการเดินทางไปรังสิตเมื่อวิชาหรือหน่วยงานพาคุณไปที่นั่น",
    setupTitle: "สิ่งที่ควรจัดการก่อนเป็นอันดับแรก",
    setupSteps: [
      "ยืนยันที่พักและจัดการเรื่องกุญแจหรือการเข้าออก",
      "ทำซิมการ์ดในไทย เพื่อให้มีอินเทอร์เน็ตและเบอร์โทรไทยใช้งาน",
      "ถ้าคุณเป็นนักศึกษาต่างชาติ ให้ลงทะเบียนกับกองงานวิเทศสัมพันธ์ (TU International Affairs) และทำเอกสารการมาถึงที่หน่วยงานกำหนด",
      "เปิดบัญชีธนาคารไทยเมื่อมีเอกสารที่จำเป็นครบ",
      "เดินสำรวจเส้นทางจากที่พักไปมหาวิทยาลัยอย่างน้อยหนึ่งครั้งก่อนเข้าเรียนวันแรก",
      "บันทึกเบอร์โทรสำคัญไว้ ทั้งฝ่ายรักษาความปลอดภัยของมหาวิทยาลัย สำนักงานหลักสูตร BIR และช่องทางติดต่อ BIRSA",
    ],
    checklistTitle: "สัปดาห์แรกของคุณ",
    checklist: [
      "เข้าร่วมกิจกรรมปฐมนิเทศของ BIR และของกองงานวิเทศสัมพันธ์ ถ้าคุณเป็นนักศึกษาต่างชาติ",
      "หาตำแหน่งอาคารคณะและห้องเรียนของคุณ",
      "พบอาจารย์ที่ปรึกษาหรือผู้ประสานงานหลักสูตร หากมีการแนะนำให้รู้จัก",
      "เข้าร่วมช่องทางของ BIRSA เพื่อติดตามกิจกรรมและข่าวสาร",
      "หาร้านขายยา โรงพยาบาล และร้านของใช้ที่ใกล้ที่พักของคุณ",
      "ถ้าคุณเป็นนักศึกษาต่างชาติ จดกำหนดการรายงานตัว 90 วันของวีซ่าไว้",
    ],
    rangsitTitle: "การเดินทางไปศูนย์รังสิต",
    rangsitLede:
      "วิชาของ BIR เรียนที่ท่าพระจันทร์ แต่บางครั้งคุณอาจต้องไปศูนย์รังสิตเพื่อร่วมกิจกรรมร่วมคณะ ติดต่อหน่วยงานส่วนกลาง หรือเรียนวิชาที่เปิดสอนที่นั่น มีเส้นทางที่ใช้ได้ 5 เส้นทาง",
    rangsitTableCaption: "เส้นทางระหว่างท่าพระจันทร์และศูนย์รังสิต",
    rangsitColumns: ["เส้นทาง", "ขั้นตอนการเดินทาง", "ค่าโดยสาร", "ระยะเวลา"],
    rangsitRows: [
      {
        route: "รถด่วนพิเศษสาย 1-9E",
        legs: "รถประจำทางตรงจากป้ายสนามหลวง ตรงข้ามท่าพระจันทร์ ไปยังรังสิต",
        fare: "27 บาท",
        time: "ประมาณ 1 ชั่วโมง 30 นาที ขึ้นกับสภาพจราจร",
      },
      {
        route: "รถไฟฟ้าใต้ดินต่อรถตู้",
        legs: "MRT สถานีสนามไชย ไปสถานีจตุจักร แล้วต่อรถตู้สาย \"หมอชิต ธรรมศาสตร์รังสิต\" ที่ทางออก 4",
        fare: "45 บาท (MRT) บวก 45 บาท (รถตู้)",
        time: "ประมาณ 30 นาที (MRT) บวกประมาณ 1 ชั่วโมง (รถตู้) ขึ้นกับสภาพจราจร",
      },
      {
        route: "รถไฟฟ้าใต้ดินต่อรถไฟสายสีแดง",
        legs: "MRT สนามไชย ไปบางซื่อ เดิน 5 นาทีไปสถานีกลางกรุงเทพอภิวัฒน์ แล้วต่อรถไฟสายสีแดงไปรังสิต จากนั้นต่อแท็กซี่หรือเรียกรถเข้ามหาวิทยาลัย",
        fare: "45 บาท (MRT) บวกเริ่มต้น 20 บาท (รถไฟสายสีแดง)",
        time: "ประมาณ 30 นาที บวก 25 นาที บวกประมาณ 20 นาทีช่วงสุดท้าย",
      },
      {
        route: "รถเมล์ต่อรถตู้",
        legs: "รถเมล์สาย 59 หรือ 503 จากท่าพระจันทร์ไปอนุสาวรีย์ชัยสมรภูมิ แล้วต่อรถตู้สาย \"อนุสาวรีย์ชัยสมรภูมิ ธรรมศาสตร์รังสิต\" ที่เกาะพญาไท",
        fare: "25 บาท (รถเมล์) บวก 47 บาท (รถตู้)",
        time: "ประมาณ 1 ชั่วโมง บวกประมาณ 40 นาที ขึ้นกับสภาพจราจรทั้งสองช่วง",
      },
      {
        route: "รถเมล์ต่อรถเมล์",
        legs: "รถเมล์สาย 59 หรือ 503 จากท่าพระจันทร์ไปอนุสาวรีย์ชัยสมรภูมิ แล้วต่อรถเมล์สาย 510 จากถนนพหลโยธินไปธรรมศาสตร์รังสิต",
        fare: "25 บาท บวก 25 บาท",
        time: "ประมาณ 1 ชั่วโมง บวกประมาณ 1 ชั่วโมง 30 นาที ขึ้นกับสภาพจราจร",
      },
    ],
    rangsitNote:
      "รถด่วนพิเศษสาย 1-9E เป็นเส้นทางตรงเที่ยวเดียว ส่วนการต่อ MRT กับรถไฟสายสีแดงมักเร็วที่สุดแต่ต้องเปลี่ยนต่อหลายครั้ง เวลาเดินทางขึ้นกับสภาพจราจรและอาจนานขึ้นในชั่วโมงเร่งด่วน",
    socialTitle: "การปรับตัวเข้าสังคม",
    socialBody:
      "BIRSA จัดกิจกรรมต้อนรับให้นักศึกษาใหม่ได้รู้จักกัน ทั้งนักศึกษาไทยและนักศึกษาต่างชาติ",
    socialCta: "ดูกิจกรรมที่กำลังจะเกิดขึ้น",
    safetyTitle: "ถ้ามีอะไรที่รู้สึกไม่ปลอดภัย",
    safetyBody:
      "หากมีเหตุการณ์ใดที่ทำให้คุณรู้สึกไม่ปลอดภัย ไม่สบายใจ หรือถูกล่วงละเมิด ไม่ว่าโดยใคร คุณมีสิทธิ์ที่จะแจ้งเรื่อง",
    safetyCta: "วิธีแจ้งเรื่อง",
  },
} satisfies Record<Locale, unknown>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const t = copy[locale];
  return buildMetadata({ locale, title: t.title, description: t.lede, path: "/help/getting-started" });
}

export default async function GettingStartedPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];

  return (
    <HelpPageShell
      locale={locale}
      title={t.title}
      lede={t.lede}
      breadcrumbItems={[
        { label: dict.site.name, href: "/" },
        { label: dict.hub.title, href: "/help" },
        { label: t.title },
      ]}
    >
      <Stack gap="md">
        <Heading level={2}>{t.setupTitle}</Heading>
        <Text as="ol" step="body" className="list-decimal space-y-2 pl-6">
          {t.setupSteps.map((step, index) => (
            <Text as="li" step="body" key={index}>
              {step}
            </Text>
          ))}
        </Text>
      </Stack>

      <Stack gap="md">
        <Heading level={2}>{t.checklistTitle}</Heading>
        <Text as="ul" step="body" className="list-disc space-y-2 pl-6">
          {t.checklist.map((item, index) => (
            <Text as="li" step="body" key={index}>
              {item}
            </Text>
          ))}
        </Text>
      </Stack>

      <Stack gap="md">
        <Heading level={2}>{t.rangsitTitle}</Heading>
        <Text step="body" className="text-muted">
          {t.rangsitLede}
        </Text>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <caption className="sr-only">{t.rangsitTableCaption}</caption>
            <thead>
              <tr className="border-b border-line">
                {t.rangsitColumns.map((col) => (
                  <th scope="col" key={col} className="py-2 pr-4">
                    <Text as="span" step="body-sm" className="font-semibold text-ink">
                      {col}
                    </Text>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.rangsitRows.map((row) => (
                <tr key={row.route} className="border-b border-line align-top">
                  <th scope="row" className="py-3 pr-4">
                    <Text as="span" step="body-sm" className="font-semibold text-ink">
                      {row.route}
                    </Text>
                  </th>
                  <Text as="td" step="body-sm" className="py-3 pr-4 text-muted">
                    {row.legs}
                  </Text>
                  <Text as="td" step="body-sm" className="py-3 pr-4 text-muted">
                    {row.fare}
                  </Text>
                  <Text as="td" step="body-sm" className="py-3 text-muted">
                    {row.time}
                  </Text>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Text step="body-sm" className="text-muted">
          {t.rangsitNote}
        </Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>{t.socialTitle}</Heading>
        <Text step="body">{t.socialBody}</Text>
        <div>
          <Link
            href={localeHref(locale, "/whats-on")}
            className="focus-halo font-semibold text-brand-deep underline decoration-1 underline-offset-4 hover:decoration-[3px]"
          >
            <Text as="span" step="body">
              {t.socialCta}
            </Text>
          </Link>
        </div>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>{t.safetyTitle}</Heading>
        <Text step="body">{t.safetyBody}</Text>
        <div>
          <Link
            href={localeHref(locale, "/help/reporting")}
            className="focus-halo font-semibold text-brand-deep underline decoration-1 underline-offset-4 hover:decoration-[3px]"
          >
            <Text as="span" step="body">
              {t.safetyCta}
            </Text>
          </Link>
        </div>
      </Stack>
    </HelpPageShell>
  );
}
