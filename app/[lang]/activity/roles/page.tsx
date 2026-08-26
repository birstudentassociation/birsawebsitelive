import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getDictionary, isLocale, locales, localeHref, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { findPortrait } from "@/lib/committee-portrait";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import { committee, committeeGroupLabels, type CommitteeGroup } from "@/content/committee";

/**
 * The Rights Advocate and Student Welfare Officer is one of the two official
 * harassment and bullying reporting channels (`content/reporting.ts`). No
 * other card on this page carries contact details, so this points at the
 * reporting section on /contact rather than printing a personal phone number
 * on the card.
 */
const REPORTING_OFFICER_KEY = "punsak-ketmalasiri";

const reportingLinkCopy: Record<Locale, string> = {
  en: "How to report harassment or bullying",
  th: "วิธีแจ้งเหตุคุกคามหรือการกลั่นแกล้ง",
};

function PortraitPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="flex aspect-[3/4] w-full items-center justify-center border-b border-line bg-sunken"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-16 w-16 text-muted"
      >
        <circle cx="12" cy="8" r="3.5" />
        <path d="M4.5 20c1.4-3.8 4.7-6 7.5-6s6.1 2.2 7.5 6" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const t = copy[locale];

  return buildMetadata({ locale, title: t.title, description: t.lede, path: "/activity/roles" });
}

const copy: Record<Locale, { activity: string; title: string; lede: string }> = {
  en: {
    activity: "BIRSA activity",
    title: "Current officers",
    lede: "These are the members of the BIRSA committee: officers first, then the assistant officers who support them.",
  },
  th: {
    activity: "การดำเนินงานของ BIRSA",
    title: "คณะกรรมการชุดปัจจุบัน",
    lede: "นี่คือรายชื่อคณะกรรมการ BIRSA เริ่มจากกรรมการสโมสร ตามด้วยอนุกรรมการที่ช่วยสนับสนุนงาน",
  },
};

export default async function ActivityRolesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];

  const groups: CommitteeGroup[] = ["officer", "assistant"];

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
              { label: t.activity, href: "/activity" },
              { label: t.title },
            ]}
          />
        }
      />
      <div className="wrap flex flex-col gap-10 py-10">
        {groups.map((group) => {
          const members = committee.filter((member) => member.group === group);
          return (
            <section key={group} className="flex flex-col gap-4">
              <h2 className="font-display text-2xl">{committeeGroupLabels[group][locale]}</h2>
              <ul className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                {members.map((member) => {
                  const m = member[locale];
                  const portraitSrc = findPortrait(member.key);
                  return (
                    <li
                      key={member.key}
                      className="flex flex-col gap-3 overflow-hidden rounded-lg border border-line bg-surface shadow-sm"
                    >
                      {portraitSrc ? (
                        <Image
                          src={portraitSrc}
                          alt=""
                          width={360}
                          height={480}
                          className="aspect-[3/4] w-full object-cover"
                        />
                      ) : (
                        <PortraitPlaceholder />
                      )}
                      <div className="flex flex-col gap-3 px-4 pb-4">
                        <div>
                          <p className="font-semibold text-ink">
                            {m.firstName} {m.lastName} ({m.nickname})
                          </p>
                          <p className="text-sm text-muted">{m.title}</p>
                        </div>
                        {member.key === REPORTING_OFFICER_KEY ? (
                          <Link
                            href={`${localeHref(locale, "/contact")}#report-harassment`}
                            className="text-sm font-semibold text-brand-deep hover:underline"
                          >
                            {reportingLinkCopy[locale]}
                          </Link>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
