import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { manifest, type ManifestEntry } from "@/components/bds/manifest";
import {
  colorTokens,
  spaceTokens,
  typeSteps,
  type ColorToken,
  type SpaceToken,
  type TypeStep,
} from "@/components/bds/tokens";
import type { Locale } from "@/lib/i18n";

/**
 * The `/design` reference page skeleton (REDESIGN-2.0 §4.1, §11.6 point 5).
 *
 * Renders from the same enumerations the rest of the system reads, so it
 * cannot drift from what actually exists:
 *
 *   - every colour token in `components/bds/tokens.ts`, as a swatch
 *   - every step of the bilingual type scale, shown in both scripts so a
 *     step that reads wrong in Thai is visible here rather than theoretical
 *   - the spacing scale
 *   - every entry in `components/bds/manifest.ts`, marked "not yet built"
 *     where `components/bds/<Name>.tsx` does not exist on disk yet
 *
 * This is the Wave 1 skeleton. It deliberately does not import
 * `components/bds/Type.tsx`: another agent is writing it in parallel this
 * wave and it may not exist at any given moment. Wave 2 wires it in once
 * that lands. Typography below uses the `text-*` scale class names
 * directly, which is also the rule every other `bds/` component follows
 * (`components/bds/tokens.css`: "use `text-display-2`, never `text-4xl`").
 */

/**
 * Read a CSS custom property declaration block by prefix, first match wins.
 * `tokens.css` declares every colour, size and space token exactly once in
 * its light-theme / default scope before any theme override redeclares the
 * same name later in the file, so "first match" is the light-theme /
 * script-independent value without needing to slice out a specific block.
 */
function extractDeclarations(source: string, prefix: string): Record<string, string> {
  const map: Record<string, string> = {};
  const re = new RegExp(`--${prefix}-([a-z0-9-]+):\\s*([^;]+);`, "g");
  let match: RegExpExecArray | null;
  while ((match = re.exec(source)) !== null) {
    const name = match[1];
    const value = match[2]?.trim();
    if (name && value !== undefined && !(name in map)) map[name] = value;
  }
  return map;
}

function readTokensCss(): string {
  return readFileSync(path.join(process.cwd(), "components/bds/tokens.css"), "utf8");
}

function componentFileExists(name: string): boolean {
  return existsSync(path.join(process.cwd(), "components/bds", `${name}.tsx`));
}

const copy: Record<
  Locale,
  {
    colorTitle: string;
    colorIntro: string;
    colorNote: string;
    typeTitle: string;
    typeIntro: string;
    typeLatinSample: string;
    typeThaiSample: string;
    spaceTitle: string;
    spaceIntro: string;
    componentsTitle: string;
    componentsIntro: string;
    colName: string;
    colGds: string;
    colStatus: string;
    colUsage: string;
    built: string;
    notYetBuilt: string;
    gdsNone: string;
  }
> = {
  en: {
    colorTitle: "Colour",
    colorIntro:
      "Every colour token declared in components/bds/tokens.ts, checked against components/bds/tokens.css. The block recolours automatically in dark mode; the hex value printed beside each one is the light theme value declared in tokens.css.",
    colorNote:
      "Every pair used for text or a control boundary is checked by npm run check:contrast against the WCAG 2.2 minimum for that pairing, in both themes.",
    typeTitle: "Typography",
    typeIntro:
      "The seven steps of the bilingual type scale. Each step is shown with a Latin sample and a Thai sample at the same size, so a step that reads wrong in Thai is visible here rather than theoretical. Line height and letter spacing are set per script through components/bds/tokens.css, not by this page.",
    typeLatinSample: "The quick brown fox jumps over the lazy dog.",
    typeThaiSample: "เป็นมนุษย์สุดประเสริฐเลิศคุณค่า กว่าบรรดาฝูงสัตว์เดรัจฉาน",
    spaceTitle: "Spacing",
    spaceIntro:
      "The spacing scale from components/bds/tokens.css. --space-section is the vertical rhythm between page sections; the rest sit inside a component.",
    componentsTitle: "Components",
    componentsIntro:
      'Every entry in components/bds/manifest.ts, grouped by its Wave 2 cluster. A component that exists on disk and is not listed here, or is listed here with no file, both fail tests/unit/design-completeness.test.ts. Marked "not yet built" is expected for most rows at this point in the build; it is not a fault.',
    colName: "Name",
    colGds: "GDS component",
    colStatus: "Status",
    colUsage: "Usage",
    built: "Built",
    notYetBuilt: "Not yet built",
    gdsNone: "None (BIRSA specific)",
  },
  th: {
    colorTitle: "โทนสี",
    colorIntro:
      "โทนสีทุกตัวที่ประกาศไว้ใน components/bds/tokens.ts ตรวจสอบกับ components/bds/tokens.css กล่องสีจะเปลี่ยนเองอัตโนมัติในโหมดมืด ส่วนค่าฐานสิบหกที่แสดงข้างกล่องแต่ละอันคือค่าของโหมดสว่างตามที่ประกาศไว้ใน tokens.css",
    colorNote:
      "คู่สีทุกคู่ที่ใช้กับตัวอักษรหรือขอบของช่องกรอกข้อมูล ถูกตรวจสอบด้วย npm run check:contrast เทียบกับค่าต่ำสุดตามมาตรฐาน WCAG 2.2 ของคู่นั้น ทั้งสองโหมดสี",
    typeTitle: "ตัวอักษร",
    typeIntro:
      "มาตราส่วนตัวอักษรสองภาษาทั้งเจ็ดระดับ แต่ละระดับแสดงตัวอย่างภาษาอังกฤษและภาษาไทยที่ขนาดเดียวกัน เพื่อให้เห็นได้ทันทีหากระดับใดแสดงผลภาษาไทยผิดปกติ ระยะบรรทัดและระยะห่างตัวอักษรของแต่ละภาษากำหนดไว้ใน components/bds/tokens.css ไม่ใช่หน้านี้",
    typeLatinSample: "The quick brown fox jumps over the lazy dog.",
    typeThaiSample: "เป็นมนุษย์สุดประเสริฐเลิศคุณค่า กว่าบรรดาฝูงสัตว์เดรัจฉาน",
    spaceTitle: "ระยะห่าง",
    spaceIntro:
      "มาตราส่วนระยะห่างจาก components/bds/tokens.css โดย --space-section คือจังหวะแนวตั้งระหว่างส่วนต่าง ๆ ของหน้า ส่วนที่เหลือใช้ภายในองค์ประกอบย่อย",
    componentsTitle: "องค์ประกอบ",
    componentsIntro:
      'รายการทุกแถวจาก components/bds/manifest.ts จัดกลุ่มตามกลุ่มงานของ Wave 2 องค์ประกอบใดที่มีไฟล์อยู่จริงแต่ไม่มีในรายการนี้ หรือมีในรายการนี้แต่ไม่มีไฟล์ จะทำให้ tests/unit/design-completeness.test.ts ไม่ผ่านทั้งสองกรณี แถวส่วนใหญ่ในช่วงนี้ของการสร้างจะระบุว่า "ยังไม่ได้สร้าง" ซึ่งเป็นเรื่องปกติ ไม่ใช่ข้อผิดพลาด',
    colName: "ชื่อ",
    colGds: "องค์ประกอบ GDS",
    colStatus: "สถานะ",
    colUsage: "วิธีใช้",
    built: "สร้างแล้ว",
    notYetBuilt: "ยังไม่ได้สร้าง",
    gdsNone: "ไม่มี (เฉพาะของ BIRSA)",
  },
};

const clusterLabel: Record<ManifestEntry["cluster"], { en: string; th: string }> = {
  forms: { en: "Forms", th: "แบบฟอร์ม" },
  navigation: { en: "Navigation", th: "การนำทาง" },
  status: { en: "Status", th: "สถานะ" },
  content: { en: "Content", th: "เนื้อหา" },
  service: { en: "Service UI", th: "หน้าจอบริการ" },
  media: { en: "Media", th: "สื่อ" },
};

function ColorSwatches({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const hexByToken = extractDeclarations(readTokensCss(), "color");

  return (
    <section aria-labelledby="design-colour" className="flex flex-col gap-4">
      <h2 id="design-colour" className="text-heading-1">
        {t.colorTitle}
      </h2>
      <p className="text-body text-muted">{t.colorIntro}</p>
      <p className="text-body-sm text-muted">{t.colorNote}</p>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {(colorTokens as readonly ColorToken[]).map((token) => {
          const hex = hexByToken[token] ?? "?";
          return (
            <li key={token} className="flex flex-col gap-2 rounded-lg border border-line p-3">
              <span
                aria-hidden="true"
                className="block h-16 w-full rounded-md border border-line-strong"
                style={{ background: `var(--color-${token})` }}
              />
              {/* Never colour alone (§7): the name and hex are printed text,
                  not implied by the swatch. */}
              <span className="text-body-sm font-semibold text-ink">{token}</span>
              <span className="text-body-sm text-muted">{hex}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function TypeSpecimen({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <section aria-labelledby="design-type" className="flex flex-col gap-4">
      <h2 id="design-type" className="text-heading-1">
        {t.typeTitle}
      </h2>
      <p className="text-body text-muted">{t.typeIntro}</p>
      <ul className="flex flex-col gap-8">
        {(typeSteps as readonly TypeStep[]).map((step) => (
          <li key={step} className="flex flex-col gap-1 border-b border-line pb-6">
            <span className="text-body-sm font-semibold text-muted">text-{step}</span>
            {/* The scale's class name directly, per components/bds/tokens.css:
                "use text-display-2, never text-4xl". */}
            <p lang="en" className={`text-${step}`}>
              {t.typeLatinSample}
            </p>
            <p lang="th" className={`text-${step}`}>
              {t.typeThaiSample}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SpacingScale({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const cssSource = readTokensCss();
  const spaceValues = extractDeclarations(cssSource, "space");

  return (
    <section aria-labelledby="design-space" className="flex flex-col gap-4">
      <h2 id="design-space" className="text-heading-1">
        {t.spaceTitle}
      </h2>
      <p className="text-body text-muted">{t.spaceIntro}</p>
      <ul className="flex flex-col gap-3">
        {(spaceTokens as readonly SpaceToken[]).map((token) => (
          <li key={token} className="flex flex-wrap items-center gap-3">
            <span className="text-body-sm w-32 shrink-0 font-semibold text-ink">
              --space-{token}
            </span>
            <span
              aria-hidden="true"
              className="block h-3 rounded-sm bg-brand"
              style={{ width: `var(--space-${token})` }}
            />
            <span className="text-body-sm text-muted">{spaceValues[token] ?? "?"}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ManifestTable({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const clusters = [...new Set(manifest.map((entry) => entry.cluster))];

  return (
    <section aria-labelledby="design-components" className="flex flex-col gap-6">
      <h2 id="design-components" className="text-heading-1">
        {t.componentsTitle}
      </h2>
      <p className="text-body text-muted">{t.componentsIntro}</p>
      {clusters.map((cluster) => {
        const entries = manifest.filter((entry) => entry.cluster === cluster);
        return (
          <div key={cluster} className="flex flex-col gap-3">
            <h3 className="text-heading-2">{clusterLabel[cluster][locale]}</h3>
            <div className="overflow-x-auto">
              <table className="text-body-sm w-full min-w-[720px] border-collapse">
                <caption className="sr-only">{clusterLabel[cluster][locale]}</caption>
                <thead>
                  <tr className="border-b border-line-strong text-left">
                    <th scope="col" className="py-2 pr-4">
                      {t.colName}
                    </th>
                    <th scope="col" className="py-2 pr-4">
                      {t.colGds}
                    </th>
                    <th scope="col" className="py-2 pr-4">
                      {t.colStatus}
                    </th>
                    <th scope="col" className="py-2 pr-4">
                      {t.colUsage}
                    </th>
                    <th scope="col" className="py-2">
                      {t.built}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => {
                    const built = componentFileExists(entry.name);
                    return (
                      <tr key={entry.name} className="border-b border-line align-top">
                        <th scope="row" className="py-2 pr-4 font-semibold text-ink">
                          {entry.name}
                        </th>
                        <td className="py-2 pr-4 text-muted">{entry.gds ?? t.gdsNone}</td>
                        <td className="py-2 pr-4 text-muted">{entry.status}</td>
                        <td className="max-w-[28rem] py-2 pr-4 text-muted">{entry.usage}</td>
                        <td className="py-2">
                          <span
                            className={
                              built
                                ? "inline-block rounded-full bg-success-tint px-2 py-0.5 font-semibold text-success"
                                : "inline-block rounded-full bg-sunken px-2 py-0.5 font-semibold text-muted"
                            }
                          >
                            {built ? t.built : t.notYetBuilt}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default function DesignReference({ locale }: { locale: Locale }) {
  return (
    <div className="flex flex-col gap-16">
      <ColorSwatches locale={locale} />
      <TypeSpecimen locale={locale} />
      <SpacingScale locale={locale} />
      <ManifestTable locale={locale} />
    </div>
  );
}
