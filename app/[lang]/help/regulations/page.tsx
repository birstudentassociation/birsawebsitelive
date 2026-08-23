import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import HelpPageShell from "@/components/help/HelpPageShell";
import NavList, { NavListItem } from "@/components/bds/NavList";
import Accordion from "@/components/bds/Accordion";
import { Heading, Text } from "@/components/bds/Type";
import { Stack } from "@/components/bds/Layout";
import { documents } from "@/content/activity/regulations";

/**
 * `/help/regulations` (ROUTE-MAP-2.0 Wave 5C, SCOPE-AUDIT-2.0 §3.2 ABSORB
 * row for `home/rights-and-welfare.mdx`).
 *
 * Two things share this page because both are, in the audit's phrase, "the
 * rules that apply to you": BIRSA's own regulation library (the University
 * Regulation and the Faculty Notice, migrated from `/activity/regulations`,
 * `documents`/`getDocument` from `content/activity/regulations` is a frozen
 * data source this page reads but does not edit), and the BIR-specific
 * slice of `rights-and-welfare.mdx`, the entitlements a Thammasat student
 * already has (dress and title freedom, voting rights, free menstrual
 * products and condoms).
 *
 * What was NOT carried over from `rights-and-welfare.mdx`: the facility
 * opening hours, the common-questions accordion about prayer rooms, sports
 * equipment and parking, and the "which app do I need" answer. None of that
 * is a rule; it is campus directory information the audit's ABSORB
 * definition ("keep the BIR-specific slice, fold it in, delete the rest")
 * does not ask this page to carry.
 */

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const copy = {
  en: {
    title: "Rules and rights",
    lede: "The regulations that govern BIRSA and student activity, and the rights you already have as a Thammasat student.",
    documentsHeading: "BIRSA's governing regulations",
    documentsLede:
      "The University's own Regulation and the Faculty Notice issued under it, each set out provision by provision.",
    rightsHeading: "Rights you already have",
    rightsLede:
      "These are entitlements you already have as a Thammasat student, not favours anyone needs to grant you.",
    votingTitle: "Your vote",
    votingBody:
      "As a Thammasat student, you vote in three separate elections: the Student Council (TUSC), elected at campus level; the Thammasat University Student Union (TUSU), at both campus and central level; and your own faculty or programme's student committee.",
    dressTitle: "Freedom of dress and forms of address",
    dressItems: [
      "You may wear your own clothes on general occasions, including classes and exams, as long as you do not disturb others' concentration or rights.",
      "You may wear the student uniform according to your own gender identity for classes, exams, placements, university business, ceremonies and faculty-specific events.",
      "You may have your photograph taken in uniform according to your own gender identity.",
      "If you are graduating, you may dress in academic dress and submit your graduation photographs according to your own gender identity.",
      "No gendered title is imposed in any part of student business, except where the law requires one or a specific process needs one. No title appears on your student card.",
    ],
    productsTitle: "Free menstrual products and condoms",
    productsBody:
      "At Tha Prachan, free menstrual products are available from your own faculty or from the TUSU Tha Prachan room, and a condom dispenser is on floor 1 of the student activity building. At Rangsit, menstrual products are available at the Thammasat Well Being Center and at dispensing points near the toilets at Puey Ungphakorn Library and the Princess Narathiwat Learning Centre.",
    complaintTitle: "If any of this is not respected",
    complaintBody:
      "That includes the right to feel safe. If anyone's behaviour ever makes you feel unsafe, uncomfortable or violated, you have the right to report it.",
    complaintCta: "How to report it",
  },
  th: {
    title: "กฎและสิทธิของคุณ",
    lede: "ระเบียบที่กำกับ BIRSA และกิจกรรมนักศึกษา และสิทธิที่คุณมีอยู่แล้วในฐานะนักศึกษาธรรมศาสตร์",
    documentsHeading: "ระเบียบที่กำกับ BIRSA",
    documentsLede:
      "ข้อบังคับของมหาวิทยาลัยและประกาศของคณะที่ออกตามข้อบังคับนั้น จัดเรียงเป็นรายข้อ",
    rightsHeading: "สิทธิที่คุณมีอยู่แล้ว",
    rightsLede:
      "สิทธิเหล่านี้เป็นของคุณอยู่แล้วในฐานะนักศึกษาธรรมศาสตร์ ไม่ใช่เรื่องที่ต้องขอร้องใคร",
    votingTitle: "สิทธิการเลือกตั้งของคุณ",
    votingBody:
      "ในฐานะนักศึกษาธรรมศาสตร์ คุณมีสิทธิเลือกตั้งถึง 3 ระดับ ได้แก่ สภานักศึกษา (TUSC) ซึ่งเลือกตั้งระดับศูนย์ องค์การนักศึกษามหาวิทยาลัยธรรมศาสตร์ (TUSU) ทั้งระดับศูนย์และระดับส่วนกลาง และกรรมการนักศึกษาประจำคณะหรือสาขาของคุณเอง",
    dressTitle: "สิทธิและเสรีภาพในการแต่งกายและการใช้คำนำหน้านาม",
    dressItems: [
      "แต่งชุดไปรเวทได้ในโอกาสทั่วไป เช่น การเข้าชั้นเรียนและการเข้าสอบ โดยไม่รบกวนสมาธิและสิทธิของผู้อื่น",
      "แต่งกายด้วยเครื่องแบบนักศึกษาได้ตามเพศวิถีของตน เพื่อเข้าชั้นเรียน เข้าสอบ ฝึกปฏิบัติงาน ติดต่อหน่วยงานในมหาวิทยาลัย งานพิธี หรืองานเฉพาะของคณะ",
      "ถ่ายรูปโดยแต่งเครื่องแบบนักศึกษาได้ตามเพศวิถีของตน",
      "บัณฑิตที่เข้ารับพระราชทานปริญญาบัตรแต่งกายและส่งรูปภาพชุดครุยได้ตามเพศวิถีของตน",
      "ไม่มีการบังคับใช้คำนำหน้านามที่แสดงเพศในทุกส่วนงานของนักศึกษา เว้นแต่กฎหมายกำหนดหรือมีความจำเป็นเฉพาะกรณี และจะไม่มีคำนำหน้านามปรากฏบนบัตรนักศึกษา",
    ],
    productsTitle: "ผ้าอนามัยและถุงยางอนามัยฟรี",
    productsBody:
      "ที่ท่าพระจันทร์ ขอผ้าอนามัยฟรีได้ที่คณะของตนหรือที่ห้ององค์การนักศึกษามหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์ และมีตู้ถุงยางอนามัยที่ชั้น 1 อาคารกิจกรรมนักศึกษา ที่ศูนย์รังสิต ขอผ้าอนามัยได้ที่ Thammasat Well Being Center และจุดแจกใกล้ห้องน้ำที่หอสมุดป๋วย อึ๊งภากรณ์ และศูนย์การเรียนรู้กรมหลวงนราธิวาสราชนครินทร์",
    complaintTitle: "หากสิทธิเหล่านี้ไม่ได้รับการเคารพ",
    complaintBody:
      "รวมถึงสิทธิที่จะรู้สึกปลอดภัยด้วย หากพฤติกรรมของใครก็ตามทำให้คุณรู้สึกไม่ปลอดภัย ไม่สบายใจ หรือถูกล่วงละเมิด คุณมีสิทธิ์ที่จะแจ้งเรื่อง",
    complaintCta: "วิธีแจ้งเรื่อง",
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
  return buildMetadata({ locale, title: t.title, description: t.lede, path: "/help/regulations" });
}

export default async function RegulationsPage({ params }: { params: Promise<{ lang: string }> }) {
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
        <Stack gap="xs">
          <Heading level={2}>{t.documentsHeading}</Heading>
          <Text step="body" className="text-muted">
            {t.documentsLede}
          </Text>
        </Stack>
        <NavList>
          {documents.map((doc) => (
            <NavListItem
              key={doc.slug}
              href={localeHref(locale, `/help/regulations/${doc.slug}`)}
              title={doc.shortTitle[locale]}
              level={3}
              footnote={doc.made[locale]}
            >
              {doc.citation[locale]}
            </NavListItem>
          ))}
        </NavList>
      </Stack>

      <Stack gap="lg">
        <Stack gap="xs">
          <Heading level={2}>{t.rightsHeading}</Heading>
          <Text step="body" className="text-muted">
            {t.rightsLede}
          </Text>
        </Stack>

        <Stack gap="sm">
          <Heading level={3}>{t.votingTitle}</Heading>
          <Text step="body">{t.votingBody}</Text>
        </Stack>

        <Stack gap="sm">
          <Heading level={3}>{t.dressTitle}</Heading>
          <Text as="ul" step="body" className="list-disc space-y-2 pl-6">
            {t.dressItems.map((item, index) => (
              <Text as="li" step="body" key={index}>
                {item}
              </Text>
            ))}
          </Text>
        </Stack>

        <Stack gap="sm">
          <Heading level={3}>{t.productsTitle}</Heading>
          <Text step="body">{t.productsBody}</Text>
        </Stack>

        <Accordion
          items={[
            {
              id: "complaint",
              summary: t.complaintTitle,
              children: (
                <Stack gap="xs">
                  <Text step="body-sm">{t.complaintBody}</Text>
                  <a
                    href={localeHref(locale, "/help/reporting")}
                    className="focus-halo font-semibold text-brand-deep underline decoration-1 underline-offset-4 hover:decoration-[3px]"
                  >
                    <Text as="span" step="body-sm">
                      {t.complaintCta}
                    </Text>
                  </a>
                </Stack>
              ),
            },
          ]}
        />
      </Stack>
    </HelpPageShell>
  );
}
