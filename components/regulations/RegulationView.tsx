import { createElement } from "react";
import Link from "next/link";
import { localeHref, type Locale } from "@/lib/i18n";
import Notice from "@/components/Notice";
import type {
  Bi,
  Block,
  Provision,
  ProvisionItem,
  RegulationDoc,
  Section,
} from "@/content/activity/regulations";

/**
 * Renders a regulation document (any depth of Title → Chapter → Division →
 * provisions) in a legislation.gov.uk-style layout: an arrangement-of-
 * provisions contents list, then the body with a short-title marginal note on
 * every numbered provision, plus a signature block. Provisions may use either
 * the simple shape (`lead`/`items`/`tail`/`definitions`) or ordered `body`
 * blocks.
 */

const ui: Record<
  Locale,
  { contents: string; aboutTitle: string; aboutBody: string; back: string }
> = {
  en: {
    contents: "Arrangement of provisions",
    aboutTitle: "About this document",
    aboutBody:
      "This is a reference rendering of an official Thai-language instrument. A short summary heading has been added to each provision. The Thai text is authoritative; the English is a translation.",
    back: "Back to the regulations library",
  },
  th: {
    contents: "สารบัญข้อกำหนด",
    aboutTitle: "เกี่ยวกับเอกสารนี้",
    aboutBody:
      "นี่คือการนำเสนอเอกสารฉบับทางการภาษาไทย โดยเพิ่มหัวข้อสรุปสั้น ๆ ไว้ที่แต่ละข้อ ให้ถือข้อความภาษาไทยเป็นฉบับที่มีผลบังคับ ส่วนภาษาอังกฤษเป็นคำแปล",
    back: "กลับไปที่คลังระเบียบข้อบังคับ",
  },
};

function Heading({
  level,
  className,
  children,
  id,
}: {
  level: number;
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return createElement(`h${Math.min(level, 6)}`, { className, id }, children);
}

function sectionLabel(section: Section, locale: Locale): string {
  const title = section.title[locale];
  if (section.kind && section.number) {
    return `${section.kind[locale]} ${section.number}: ${title}`;
  }
  return title;
}

function ItemList({ items, pick }: { items: ProvisionItem[]; pick: (b: Bi) => string }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item, i) => (
        <li key={`${item.marker}-${i}`} className="flex gap-2.5">
          <span className="text-ink shrink-0 tabular-nums">{item.marker}</span>
          <div className="flex min-w-0 flex-col gap-1.5">
            <span>{pick(item.text)}</span>
            {item.note ? <span className="text-muted italic">{pick(item.note)}</span> : null}
            {item.children ? (
              <div className="mt-1">
                <ItemList items={item.children} pick={pick} />
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

function Definitions({
  entries,
  pick,
}: {
  entries: { term: Bi; meaning: Bi }[];
  pick: (b: Bi) => string;
}) {
  return (
    <dl className="border-line flex flex-col gap-2 border-l-2 pl-4">
      {entries.map((def) => (
        <div key={def.term.en} className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
          <dt className="text-ink font-semibold">{pick(def.term)}</dt>
          <dd className="sm:before:mr-2 sm:before:content-[':']">{pick(def.meaning)}</dd>
        </div>
      ))}
    </dl>
  );
}

function BlockView({ block, pick }: { block: Block; pick: (b: Bi) => string }) {
  if (block.kind === "para") return <p>{pick(block.text)}</p>;
  if (block.kind === "list") return <ItemList items={block.items} pick={pick} />;
  return <Definitions entries={block.entries} pick={pick} />;
}

function ProvisionView({
  provision,
  pick,
  headingLevel,
}: {
  provision: Provision;
  pick: (b: Bi) => string;
  headingLevel: number;
}) {
  return (
    <article id={`prov-${provision.num}`} className="flex scroll-mt-24 gap-3 sm:gap-4">
      <div className="text-brand-deep font-display w-6 shrink-0 pt-0.5 text-sm font-semibold tabular-nums sm:w-8 sm:text-base">
        {provision.num}
      </div>
      <div className="min-w-0 flex-1">
        <Heading
          level={headingLevel}
          className="font-display text-ink text-lg leading-snug font-semibold"
        >
          {pick(provision.title)}
        </Heading>
        <div className="text-muted mt-2 flex flex-col gap-3 leading-relaxed">
          {provision.body ? (
            provision.body.map((block, i) => <BlockView key={i} block={block} pick={pick} />)
          ) : (
            <>
              {provision.lead ? <p>{pick(provision.lead)}</p> : null}
              {provision.definitions ? (
                <Definitions entries={provision.definitions} pick={pick} />
              ) : null}
              {provision.items ? <ItemList items={provision.items} pick={pick} /> : null}
              {provision.tail ? <p>{pick(provision.tail)}</p> : null}
            </>
          )}
        </div>
      </div>
    </article>
  );
}

function ContentsNode({
  section,
  locale,
  pick,
  path,
  depth,
}: {
  section: Section;
  locale: Locale;
  pick: (b: Bi) => string;
  path: string;
  depth: number;
}) {
  return (
    <div className={depth > 0 ? "border-line mt-2 border-l pl-4" : undefined}>
      <p className="text-ink font-semibold">
        <Link href={`#${path}`} className="hover:text-brand-deep hover:underline">
          {sectionLabel(section, locale)}
        </Link>
      </p>
      {section.provisions ? (
        <ul className="mt-1.5 flex flex-col gap-1">
          {section.provisions.map((provision) => (
            <li key={provision.num} className="text-sm">
              <Link
                href={`#prov-${provision.num}`}
                className="text-muted hover:text-brand-deep flex gap-2 hover:underline"
              >
                <span className="tabular-nums">{provision.num}.</span>
                <span>{pick(provision.title)}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      {section.children?.map((child, i) => (
        <ContentsNode
          key={`${path}-${i}`}
          section={child}
          locale={locale}
          pick={pick}
          path={`${path}-${i}`}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}

export default function RegulationView({ doc, locale }: { doc: RegulationDoc; locale: Locale }) {
  const pick = (b: Bi) => b[locale];
  const t = ui[locale];

  return (
    <div className="wrap flex max-w-[72ch] flex-col gap-10 py-10">
      {/* Prelims */}
      <div className="flex flex-col gap-4">
        <p className="text-ink font-semibold">{doc.authority[locale]}</p>
        <p className="text-muted leading-relaxed">{doc.preamble[locale]}</p>
        <Notice variant="info" title={t.aboutTitle}>
          <p>{t.aboutBody}</p>
        </Notice>
      </div>

      {/* Arrangement of provisions */}
      <nav
        aria-labelledby="contents-heading"
        className="border-line bg-sunken rounded-lg border p-6"
      >
        <h2 id="contents-heading" className="font-display mb-4 text-xl">
          {t.contents}
        </h2>
        <div className="flex flex-col gap-4">
          {doc.sections.map((section, i) => (
            <ContentsNode
              key={`sec-${i}`}
              section={section}
              locale={locale}
              pick={pick}
              path={`sec-${i}`}
              depth={0}
            />
          ))}
        </div>
      </nav>

      {/* Body */}
      <div className="flex flex-col gap-10">
        {doc.sections.map((section, i) => (
          <SectionViewResolved
            key={`sec-${i}`}
            section={section}
            locale={locale}
            pick={pick}
            depth={0}
            path={`sec-${i}`}
          />
        ))}
      </div>

      {/* Signature */}
      <div className="border-line text-muted flex flex-col items-end gap-1 border-t pt-6 text-sm">
        <p>{doc.made[locale]}</p>
        <p className="text-ink font-semibold">{doc.signatory[locale]}</p>
      </div>

      <Link
        href={localeHref(locale, "/activity/regulations")}
        className="text-brand-deep hover:text-brand-dark text-sm font-semibold"
      >
        &larr; {t.back}
      </Link>
    </div>
  );
}

/** Wrapper that passes `locale` through so `sectionLabel` can localise
 * headings (kept separate from ContentsNode to keep the body recursion tidy). */
function SectionViewResolved({
  section,
  locale,
  pick,
  depth,
  path,
}: {
  section: Section;
  locale: Locale;
  pick: (b: Bi) => string;
  depth: number;
  path: string;
}) {
  const headingLevel = Math.min(2 + depth, 6);
  const isTop = depth === 0;
  return (
    <section id={path} className="flex scroll-mt-24 flex-col gap-6">
      <Heading
        level={headingLevel}
        className={
          isTop
            ? "border-brand font-display border-b-2 pb-2 text-2xl"
            : "font-display text-ink text-xl"
        }
      >
        {sectionLabel(section, locale)}
      </Heading>
      {section.provisions?.map((provision) => (
        <ProvisionView
          key={provision.num}
          provision={provision}
          pick={pick}
          headingLevel={Math.min(headingLevel + 1, 6)}
        />
      ))}
      {section.children?.map((child, i) => (
        <SectionViewResolved
          key={`${path}-${i}`}
          section={child}
          locale={locale}
          pick={pick}
          depth={depth + 1}
          path={`${path}-${i}`}
        />
      ))}
    </section>
  );
}
