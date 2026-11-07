import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import type { Locale } from "@/lib/i18n";
import { OG_SIZE } from "@/lib/og-image";
import { fitText, lineText, TextBlock } from "@/lib/og-text";

export const CAREER_EXHIBITION_SLUG = "bir-career-exhibition-2026";

const RED = "#e3262e";
const INK = "#211c19";
const PINK = "#f19ea1";
const WHITE = "#ffffff";

const LOGO_DIR = path.join("assets", "og", CAREER_EXHIBITION_SLUG);

const LOGOS: { file: string; background: string; height: number }[] = [
  { file: "fao-wordmark", background: WHITE, height: 50 },
  { file: "bitkub", background: WHITE, height: 40 },
  { file: "department-of-employment", background: WHITE, height: 64 },
  { file: "eef", background: WHITE, height: 32 },
  { file: "amnesty", background: "#ffff00", height: 50 },
  { file: "vero", background: WHITE, height: 28 },
  { file: "education-new-zealand", background: "#101d2d", height: 46 },
  { file: "konrad-adenauer-stiftung", background: WHITE, height: 40 },
  { file: "mae-fah-luang-foundation", background: WHITE, height: 64 },
  { file: "teach-for-thailand", background: WHITE, height: 42 },
  { file: "anfrel", background: WHITE, height: 58 },
  { file: "riffai", background: "#000000", height: 56 },
];

const COPY: Record<Locale, { kicker: string; when: string; ribbon: string; place: string[] }> = {
  en: {
    kicker: "Looking for an internship? Meet 12 organisations.",
    when: "Wednesday 11 November, 14:00 to 17:30",
    ribbon: "Every faculty welcome",
    place: ["Room 103, Faculty of Political Science", "Thammasat University Tha Prachan"],
  },
  th: {
    kicker: "หาที่ฝึกงานอยู่ใช่ไหม เตรียมพบ 12 องค์กรชั้นนำ",
    when: "วันพุธที่ 11 พฤศจิกายน 2569 เวลา 14.00 ถึง 17.30 น.",
    ribbon: "ไม่ว่าคณะไหนก็มาได้",
    place: ["ห้อง 103 คณะรัฐศาสตร์", "มหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์"],
  },
};

function pngSrc(file: string) {
  const data = fs.readFileSync(path.join(process.cwd(), file));
  return {
    src: `data:image/png;base64,${data.toString("base64")}`,
    width: data.readUInt32BE(16),
    height: data.readUInt32BE(20),
  };
}

const TILE_W = 178;

const PILLS: [string, string, number][] = [
  ["NGOs", "#ff7b7b", -4],
  ["IGOs", "#8fe36b", 3],
  ["Private Sector", "#ffb36b", -3],
  ["Foundations", "#ffe46b", 2],
  ["Think Tanks", "#c5f27a", -2],
  ["Government Agencies", "#9be9f0", 2],
  ["Research Institutes", "#8cc8ff", -3],
];
const TILE_H = 70;

function Circle({
  size,
  top,
  left,
  fill,
}: {
  size: number;
  top: number;
  left: number;
  fill: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        borderRadius: 999,
        backgroundColor: fill,
        border: `3px solid ${RED}`,
        opacity: 0.55,
      }}
    />
  );
}

export async function renderCareerExhibitionOgImage(locale: Locale) {
  const copy = COPY[locale];
  const [kicker, career, exhibition, year, when, place1, place2, org, uni, ribbon] =
    await Promise.all([
      fitText(copy.kicker, {
        style: "strong",
        color: INK,
        sizes: [24, 22, 20],
        maxWidth: 500,
        maxLines: 1,
      }),
      fitText("CAREER", {
        style: "strong",
        color: INK,
        sizes: [118, 108, 100],
        maxWidth: 500,
        maxLines: 1,
      }),
      lineText("Exhibition", "strong", INK, 64),
      lineText("2026", "strong", INK, 50),
      fitText(copy.when, {
        style: "strong",
        color: INK,
        sizes: [24, 22, 20, 18],
        maxWidth: 456,
        maxLines: 1,
      }),
      lineText(copy.place[0]!, "strong", WHITE, 28),
      lineText(copy.place[1]!, "text", WHITE, 24),
      lineText("BIR Student Association", "strong", RED, 24),
      lineText("THAMMASAT UNIVERSITY", "text", RED, 16),
      lineText(copy.ribbon, "strong", WHITE, 22),
    ]);
  const birsa = pngSrc(path.join("public", "birsa-logo.png"));
  const pills = await Promise.all(PILLS.map(([label]) => lineText(label, "strong", INK, 16)));

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        backgroundImage: "linear-gradient(180deg, #ffffff 0%, #fde6e7 50%, #f4a6a9 100%)",
      }}
    >
      <Circle size={70} top={22} left={620} fill="#fbd0d1" />
      <Circle size={46} top={300} left={-14} fill={PINK} />
      <Circle size={36} top={430} left={540} fill="#f07f83" />
      <Circle size={54} top={360} left={1166} fill="#f07f83" />
      <div
        style={{
          position: "absolute",
          top: 28,
          right: 44,
          display: "flex",
          backgroundColor: RED,
          border: `3px solid ${INK}`,
          borderRadius: 999,
          padding: "6px 22px",
          boxShadow: `4px 4px 0 ${INK}`,
          transform: "rotate(4deg)",
        }}
      >
        <TextBlock text={ribbon} />
      </div>

      <div style={{ flex: 1, display: "flex", padding: "34px 56px 0", gap: 34 }}>
        <div style={{ width: 500, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img src={birsa.src} width={60} height={60} alt="" />
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextBlock text={org} />
              <TextBlock text={uni} />
            </div>
          </div>
          <div style={{ display: "flex", marginTop: 14 }}>
            <TextBlock text={kicker} />
          </div>
          <TextBlock text={career} leading={0.92} />
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", backgroundColor: PINK, padding: "0 18px" }}>
              <TextBlock text={exhibition} />
            </div>
            <TextBlock text={year} />
          </div>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              marginTop: 12,
              backgroundColor: WHITE,
              border: `3px solid ${INK}`,
              borderRadius: 20,
              padding: "8px 20px",
              boxShadow: `5px 5px 0 ${INK}`,
            }}
          >
            <TextBlock text={when} />
          </div>
        </div>

        <div
          style={{
            width: 3 * TILE_W + 2 * 10 + 2 * 18 + 8,
            alignSelf: "flex-start",
            marginTop: 70,
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            backgroundColor: WHITE,
            border: `4px solid ${RED}`,
            borderRadius: 30,
            padding: 18,
          }}
        >
          {LOGOS.map((logo) => {
            const img = pngSrc(path.join(LOGO_DIR, `${logo.file}.png`));
            const width = Math.min(TILE_W - 20, (img.width / img.height) * logo.height);
            const height = (width / img.width) * img.height;
            return (
              <div
                key={logo.file}
                style={{
                  width: TILE_W,
                  height: TILE_H,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: logo.background,
                  borderRadius: 14,
                }}
              >
                <img src={img.src} width={width} height={height} alt="" />
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: RED,
          padding: "14px 40px 16px 56px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <TextBlock text={place1} />
          <TextBlock text={place2} />
        </div>
        <div
          style={{
            width: 560,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-end",
            gap: 8,
          }}
        >
          {pills.map((text, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                backgroundColor: PILLS[i]![1],
                border: `2px solid ${INK}`,
                borderRadius: 999,
                padding: "1px 12px",
                boxShadow: `3px 3px 0 ${INK}`,
                transform: `rotate(${PILLS[i]![2]}deg)`,
              }}
            >
              <TextBlock text={text} />
            </div>
          ))}
        </div>
      </div>
    </div>,
    OG_SIZE
  );
}
