import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import { committee, committeeGroupLabels, type CommitteeGroup } from "@/content/committee";
import { roleDescriptions } from "@/content/activity/roleInfo";

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
                  return (
                    <li
                      key={member.key}
                      className="bg-surface border-line flex flex-col gap-1 rounded-lg border p-4 shadow-sm"
                    >
                      <p className="text-ink font-semibold">
                        {m.firstName} {m.lastName} ({m.nickname})
                      </p>
                      <p className="text-muted text-sm">{m.title}</p>
                      {description ? (
                        <p className="text-muted mt-2 text-sm leading-relaxed">{description}</p>
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
