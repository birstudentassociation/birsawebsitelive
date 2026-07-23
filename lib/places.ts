/**
 * Pure data + map math for the "Food and places nearby" guide
 * (`content/student-life/{en,th}/home/places-nearby.mdx`). No React here so
 * this stays fully unit-testable; see `tests/unit/places.test.ts`.
 *
 * The entries in `foodGroups` and `essentialPlaces` below are placeholder
 * examples chosen to exercise the page's layout, not an endorsed or
 * complete list. BIRSA is preparing its own curated recommendations before
 * launch; until then the MDX page marks this content with
 * `<Notice variant="placeholder">`. Coordinates are approximate (eyeballed
 * to the right street/block, not surveyed) and are only precise enough for
 * a small illustrative map — always confirm a real address before relying
 * on one of these for navigation.
 */

export type Bilingual = { en: string; th: string };

export type Place = {
  id: string;
  name: Bilingual;
  /** Thai-script name shown in parentheses on the English page, e.g. "โรตีมะตะบะ". */
  nameLocal?: string;
  note: Bilingual;
  lat: number;
  lng: number;
  price?: "฿" | "฿฿" | "฿฿฿";
  /** Human search string used to build the Google Maps link. */
  mapsQuery: string;
};

export type PlaceGroup = {
  id: string;
  title: Bilingual;
  blurb?: Bilingual;
  places: Place[];
};

export const foodGroups: PlaceGroup[] = [
  {
    id: "rice-and-curry",
    title: { en: "Rice, curry and all-day Thai", th: "ข้าวแกงและอาหารตามสั่ง" },
    places: [
      {
        id: "ming-lee",
        name: { en: "Ming Lee", th: "หมิงลี" },
        nameLocal: "หมิงลี",
        note: {
          en: "Old-school Thai–Western restaurant near the Grand Palace; a Na Phra Lan institution.",
          th: "ร้านอาหารไทย–ฝรั่งสไตล์โบราณย่านหน้าพระลาน อยู่คู่ย่านนี้มานาน",
        },
        lat: 13.7517,
        lng: 100.4913,
        price: "฿฿",
        mapsQuery: "Ming Lee restaurant Na Phra Lan Bangkok",
      },
      {
        id: "tha-prachan-stalls",
        name: { en: "Tha Prachan market stalls", th: "ร้านรวงตลาดท่าพระจันทร์" },
        nameLocal: "ตลาดท่าพระจันทร์",
        note: {
          en: "Rice-and-curry shops and quick single-plate meals right outside the campus gate.",
          th: "ข้าวแกงและอาหารจานเดียวหน้าประตูมหาวิทยาลัย อิ่มไวราคานักศึกษา",
        },
        lat: 13.757,
        lng: 100.4896,
        price: "฿",
        mapsQuery: "Tha Prachan market Bangkok",
      },
    ],
  },
  {
    id: "noodles",
    title: { en: "Noodles and quick bowls", th: "ก๋วยเตี๋ยวและเมนูชามด่วน" },
    places: [
      {
        id: "wang-lang-boat-noodles",
        name: { en: "Wang Lang boat-noodle alley", th: "ซอยก๋วยเตี๋ยวเรือวังหลัง" },
        nameLocal: "ก๋วยเตี๋ยวเรือวังหลัง",
        note: {
          en: "Cheap, fast bowls in the lanes behind Wang Lang Market — cross by ferry from Tha Prachan.",
          th: "ก๋วยเตี๋ยวชามละไม่กี่บาทในซอยหลังตลาดวังหลัง นั่งเรือข้ามฟากจากท่าพระจันทร์",
        },
        lat: 13.756,
        lng: 100.4846,
        price: "฿",
        mapsQuery: "boat noodles Wang Lang Bangkok",
      },
    ],
  },
  {
    id: "halal",
    title: { en: "Halal and Thai-Muslim", th: "อาหารฮาลาลและมุสลิม" },
    places: [
      {
        id: "roti-mataba",
        name: { en: "Roti Mataba", th: "โรตีมะตะบะ" },
        nameLocal: "โรตีมะตะบะ",
        note: {
          en: "Famous roti and mataba house on Phra Athit Road, by Phra Sumen Fort.",
          th: "ร้านโรตีและมะตะบะชื่อดังบนถนนพระอาทิตย์ ใกล้ป้อมพระสุเมรุ",
        },
        lat: 13.7634,
        lng: 100.4941,
        price: "฿",
        mapsQuery: "Roti Mataba Phra Athit Bangkok",
      },
    ],
  },
  {
    id: "sweets-and-cafes",
    title: { en: "Desserts, snacks and cafés", th: "ของหวาน ของว่าง และคาเฟ่" },
    places: [
      {
        id: "kor-panich",
        name: { en: "Kor Panich sticky rice", th: "ข้าวเหนียวมูล ก.พานิช" },
        nameLocal: "ก.พานิช",
        note: {
          en: "Century-old mango sticky rice shop on Tanao Road.",
          th: "ร้านข้าวเหนียวมูลเก่าแก่บนถนนตะนาว เปิดมากว่าร้อยปี",
        },
        lat: 13.7513,
        lng: 100.4979,
        price: "฿฿",
        mapsQuery: "Kor Panich sticky rice Tanao Road Bangkok",
      },
      {
        id: "nuttaporn",
        name: { en: "Nuttaporn coconut ice cream", th: "ไอศกรีมกะทิสดนัฐพร" },
        nameLocal: "นัฐพร",
        note: {
          en: "Hand-made coconut ice cream in Phraeng Phuthon, going since 1948.",
          th: "ไอศกรีมกะทิสดโฮมเมดย่านแพร่งภูธร เปิดมาตั้งแต่ พ.ศ. 2491",
        },
        lat: 13.7508,
        lng: 100.4972,
        price: "฿",
        mapsQuery: "Nuttaporn ice cream Phraeng Phuthon Bangkok",
      },
      {
        id: "mont-nom-sod",
        name: { en: "Mont Nom Sod", th: "มนต์นมสด" },
        nameLocal: "มนต์นมสด",
        note: {
          en: "Toast-and-fresh-milk institution on Dinso Road — a classic after-class stop.",
          th: "ร้านขนมปังปิ้ง–นมสดในตำนานบนถนนดินสอ เหมาะแวะหลังเลิกเรียน",
        },
        lat: 13.7534,
        lng: 100.5008,
        price: "฿",
        mapsQuery: "Mont Nom Sod Dinso Road Bangkok",
      },
    ],
  },
  {
    id: "markets",
    title: { en: "Markets and food courts", th: "ตลาดและศูนย์อาหาร" },
    places: [
      {
        id: "wang-lang-market",
        name: { en: "Wang Lang Market", th: "ตลาดวังหลัง" },
        nameLocal: "ตลาดวังหลัง",
        note: {
          en: "Street-food and snack paradise across the river — the classic Thammasat lunch run.",
          th: "สวรรค์สตรีทฟู้ดฝั่งธนฯ ตรงข้ามมหาวิทยาลัย ข้ามเรือไปกินมื้อเที่ยงกันประจำ",
        },
        lat: 13.7562,
        lng: 100.485,
        price: "฿",
        mapsQuery: "Wang Lang Market Bangkok",
      },
      {
        id: "tha-maharaj",
        name: { en: "Tha Maharaj", th: "ท่ามหาราช" },
        nameLocal: "ท่ามหาราช",
        note: {
          en: "Riverside mall with cafés and air-conditioned food options a short walk north of campus.",
          th: "คอมมูนิตี้มอลล์ริมแม่น้ำ เดินจากมหาวิทยาลัยไม่ไกล มีคาเฟ่และร้านอาหารติดแอร์",
        },
        lat: 13.7588,
        lng: 100.489,
        price: "฿฿",
        mapsQuery: "Tha Maharaj Bangkok",
      },
    ],
  },
];

export const essentialPlaces: Place[] = [
  {
    id: "tha-prachan-pier",
    name: { en: "Tha Prachan Pier", th: "ท่าเรือท่าพระจันทร์" },
    note: {
      en: "Cross-river ferry to Wang Lang and Chao Phraya Express boats.",
      th: "เรือข้ามฟากไปวังหลังและเรือด่วนเจ้าพระยา",
    },
    lat: 13.7571,
    lng: 100.4891,
    mapsQuery: "Tha Prachan Pier Bangkok",
  },
  {
    id: "wang-lang-pier",
    name: { en: "Wang Lang (Siriraj) Pier", th: "ท่าเรือวังหลัง (ศิริราช)" },
    note: {
      en: "The other end of the ferry — gateway to Wang Lang Market and Siriraj Hospital.",
      th: "ปลายทางเรือข้ามฟาก ทางเข้าตลาดวังหลังและโรงพยาบาลศิริราช",
    },
    lat: 13.7563,
    lng: 100.4859,
    mapsQuery: "Wang Lang Pier Bangkok",
  },
  {
    id: "maharaj-pier",
    name: { en: "Maharaj Pier", th: "ท่าเรือมหาราช" },
    note: {
      en: "Express-boat and tourist-boat pier at Tha Maharaj.",
      th: "ท่าเรือด่วนและเรือท่องเที่ยวที่ท่ามหาราช",
    },
    lat: 13.7588,
    lng: 100.4886,
    mapsQuery: "Maharaj Pier Bangkok",
  },
  {
    id: "sanam-luang",
    name: { en: "Sanam Luang", th: "สนามหลวง" },
    note: {
      en: "The royal field next to campus — landmark for buses and meeting points.",
      th: "ทุ่งพระเมรุข้างมหาวิทยาลัย จุดสังเกตสำหรับรถเมล์และนัดพบ",
    },
    lat: 13.7549,
    lng: 100.493,
    mapsQuery: "Sanam Luang Bangkok",
  },
  {
    id: "national-museum",
    name: { en: "National Museum Bangkok", th: "พิพิธภัณฑสถานแห่งชาติ พระนคร" },
    note: {
      en: "Right next to campus; free or discounted entry days are worth watching for.",
      th: "อยู่ติดมหาวิทยาลัย มีวันเข้าชมฟรีหรือลดราคาให้ติดตาม",
    },
    lat: 13.7576,
    lng: 100.4926,
    mapsQuery: "National Museum Bangkok",
  },
  {
    id: "grand-palace",
    name: { en: "Grand Palace and Wat Phra Kaew", th: "พระบรมมหาราชวังและวัดพระแก้ว" },
    note: {
      en: "Ten minutes' walk south — useful when friends and family visit.",
      th: "เดินจากมหาวิทยาลัยราวสิบนาที เหมาะพาเพื่อนหรือครอบครัวไปเที่ยว",
    },
    lat: 13.75,
    lng: 100.4913,
    mapsQuery: "Grand Palace Bangkok",
  },
  {
    id: "phra-athit",
    name: { en: "Phra Athit Road", th: "ถนนพระอาทิตย์" },
    note: {
      en: "Riverside strip of cafés, bars and live music north of campus.",
      th: "ถนนเลียบแม่น้ำ มีคาเฟ่ ร้านนั่งชิลและดนตรีสด อยู่เหนือมหาวิทยาลัยขึ้นไป",
    },
    lat: 13.7627,
    lng: 100.4938,
    mapsQuery: "Phra Athit Road Bangkok",
  },
];

// ---------------------------------------------------------------------------
// Web Mercator tile math (the projection used by OpenStreetMap's raster
// tiles). Kept pure and framework-free so it's unit-testable without
// rendering anything; see `components/places/PlacesMap.tsx` for the
// consumer.
// ---------------------------------------------------------------------------

/** Fractional Web Mercator tile coordinates for a lng/lat at a given zoom. */
export function lonLatToTile(lng: number, lat: number, zoom: number): { x: number; y: number } {
  const latRad = (lat * Math.PI) / 180;
  const scale = 2 ** zoom;
  const x = ((lng + 180) / 360) * scale;
  const y = ((1 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2) * scale;
  return { x, y };
}

export type MapView = {
  zoom: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  /** Number of tile columns spanned, i.e. `maxX - minX + 1`. */
  cols: number;
  /** Number of tile rows spanned, i.e. `maxY - minY + 1`. */
  rows: number;
};

/**
 * Integer tile range (inclusive) covering every place, plus a little
 * padding so markers near the edge aren't flush against the map's border.
 * `paddingTiles` is applied to the fractional bounding box before flooring
 * / ceiling to integers.
 */
export function computeMapView(places: Place[], zoom: number, paddingTiles = 0.25): MapView {
  if (places.length === 0) {
    throw new Error("computeMapView requires at least one place");
  }

  const tiles = places.map((place) => lonLatToTile(place.lng, place.lat, zoom));
  const xs = tiles.map((t) => t.x);
  const ys = tiles.map((t) => t.y);

  const minX = Math.floor(Math.min(...xs) - paddingTiles);
  const maxX = Math.ceil(Math.max(...xs) + paddingTiles);
  const minY = Math.floor(Math.min(...ys) - paddingTiles);
  const maxY = Math.ceil(Math.max(...ys) + paddingTiles);

  return {
    zoom,
    minX,
    maxX,
    minY,
    maxY,
    cols: maxX - minX + 1,
    rows: maxY - minY + 1,
  };
}

/** Percentage position of a place inside the tile-grid pixel space of `view`. */
export function markerPosition(place: Place, view: MapView): { leftPct: number; topPct: number } {
  const { x, y } = lonLatToTile(place.lng, place.lat, view.zoom);
  const leftPct = ((x - view.minX) / view.cols) * 100;
  const topPct = ((y - view.minY) / view.rows) * 100;
  return { leftPct, topPct };
}

// ---------------------------------------------------------------------------
// Global numbering, shared by the map markers and the list items so the two
// can never drift apart (see `components/places/PlacesSection.tsx`).
// ---------------------------------------------------------------------------

export type NumberedPlace = { place: Place; label: string };

/** Every food place, numbered 1..n in group order (group order, then place order within the group). */
export function foodPlacesFlat(): NumberedPlace[] {
  const flat: NumberedPlace[] = [];
  let n = 0;
  for (const group of foodGroups) {
    for (const place of group.places) {
      n += 1;
      flat.push({ place, label: String(n) });
    }
  }
  return flat;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** Bijective base-26 letter label for a 0-based index: 0 -> "A", 25 -> "Z", 26 -> "AA", ... */
function letterLabel(index: number): string {
  let n = index;
  let label = "";
  do {
    label = ALPHABET[n % 26] + label;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return label;
}

/** Every essential place, lettered A, B, C... in list order. */
export function essentialPlacesLettered(): NumberedPlace[] {
  return essentialPlaces.map((place, i) => ({ place, label: letterLabel(i) }));
}
