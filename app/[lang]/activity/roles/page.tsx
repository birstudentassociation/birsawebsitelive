import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { findPortrait } from "@/lib/committee-portrait";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import { committee, committeeGroupLabels, type CommitteeGroup } from "@/content/committee";
import { roleDescriptions } from "@/content/activity/roleInfo";

function PortraitPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="bg-sunken border-line flex h-14 w-14 shrink-0 items-center justify-center rounded-full border"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="text-muted h-7 w-7"
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
    title: "Officer roles",
    lede: "These are the roles that make up the BIRSA committee: officers first, then the assistant officers who support them.",
  },
  th: {
    activity: "การดำเนินงานของ BIRSA",
    title: "บทบาทหน้าที่ของคณะกรรมการ",
    lede: "นี่คือตำแหน่งต่าง ๆ ที่ประกอบกันเป็นคณะกรรมการ BIRSA เริ่มจากกรรมการสโมสร ตามด้วยอนุกรรมการที่ช่วยสนับสนุนงาน",
  },
};

export default async function ActivityRolesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
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
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {members.map((member) => {
                  const m = member[locale];
                  const description = roleDescriptions[member.key]?.[locale];
                  const portraitSrc = findPortrait(member.key);
                  return (
                    <li
                      key={member.key}
                      className="bg-surface border-line flex flex-col gap-3 rounded-lg border p-4 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        {portraitSrc ? (
                          <Image
                            src={portraitSrc}
                            alt=""
                            width={112}
                            height={112}
                            className="border-line h-14 w-14 shrink-0 rounded-full border object-cover"
                          />
                        ) : (
                          <PortraitPlaceholder />
                        )}
                        <div className="min-w-0">
                          <p className="text-ink font-semibold">
                            {m.firstName} {m.lastName} ({m.nickname})
                          </p>
                          <p className="text-muted text-sm">{m.title}</p>
                        </div>
                      </div>
                      {description ? (
                        <p className="text-muted text-sm leading-relaxed">{description}</p>
                      ) : null}
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
