/**
 * Pure data + map math for the "Food and housing nearby" guide
 * (`content/student-life/{en,th}/home/places-nearby.mdx`). No React here so
 * this stays fully unit-testable; see `tests/unit/places.test.ts`.
 *
 * The entries below are extracted from two Google Maps lists curated by a
 * BIRSA senior ("ตามรอยของกิน" for food, "หอพัก คอนโดแนะนำ" for housing),
 * exported July 2026. Ratings and review counts are Google Maps averages as
 * captured at that date, so treat them as a snapshot rather than live data.
 *
 * Coordinates are each place's own Google Maps pin, rounded to four decimal
 * places (about 10 m), which is far finer than the small orientation maps
 * need; the "Open in Google Maps" link on each entry is still the
 * authoritative location. When editing, keep `id` values stable: list items
 * use them as anchor targets for the map markers.
 */

export type Bilingual = { en: string; th: string };

/**
 * Which of the two neighbourhood maps a place appears on: the Tha Prachan /
 * old-town side of the river (including Wang Lang, reached by ferry) or the
 * Pinklao / Charansanitwong side.
 */
export type PlaceArea = "oldtown" | "pinklao";

export type Place = {
  id: string;
  name: Bilingual;
  /** Thai-script name shown in parentheses on the English page, e.g. "โรตีมะตะบะ". */
  nameLocal?: string;
  /** The place type from the Google Maps list, e.g. "Noodle Shop". */
  category: Bilingual;
  note?: Bilingual;
  area: PlaceArea;
  lat: number;
  lng: number;
  /** Google Maps average rating, July 2026 snapshot. */
  rating?: number;
  /** Google Maps review count behind `rating`, July 2026 snapshot. */
  ratingCount?: number;
  /** Human search string used to build the Google Maps link. */
  mapsQuery: string;
};

export type PlaceGroup = {
  id: string;
  title: Bilingual;
  places: Place[];
};

const cat = {
  restaurant: { en: "Restaurant", th: "ร้านอาหาร" },
  thai: { en: "Thai", th: "อาหารไทย" },
  noodles: { en: "Noodle shop", th: "ร้านก๋วยเตี๋ยว" },
  chineseNoodles: { en: "Chinese noodles", th: "บะหมี่จีน" },
  porridge: { en: "Rice porridge", th: "ข้าวต้ม-โจ๊ก" },
  chinese: { en: "Chinese", th: "อาหารจีน" },
  dimSum: { en: "Dim sum", th: "ติ่มซำ" },
  korean: { en: "Korean", th: "อาหารเกาหลี" },
  northIndian: { en: "North Indian", th: "อาหารอินเดียเหนือ" },
  indianSweets: { en: "Indian sweets", th: "ขนมอินเดีย" },
  halal: { en: "Halal", th: "อาหารฮาลาล" },
  israeli: { en: "Israeli", th: "อาหารอิสราเอล" },
  steak: { en: "Steak", th: "สเต็ก" },
  shabu: { en: "Shabu shabu", th: "ชาบู" },
  buffet: { en: "Buffet", th: "บุฟเฟ่ต์" },
  barbecue: { en: "Barbecue", th: "บาร์บีคิว" },
  breakfast: { en: "Breakfast", th: "อาหารเช้า" },
  bakery: { en: "Bakery", th: "เบเกอรี่" },
  cafe: { en: "Café", th: "คาเฟ่" },
  coffee: { en: "Coffee shop", th: "ร้านกาแฟ" },
  iceCream: { en: "Ice cream", th: "ไอศกรีม" },
  hawker: { en: "Hawker stall", th: "ร้านริมทาง" },
  cocktailBar: { en: "Cocktail bar", th: "ค็อกเทลบาร์" },
  cafeteria: { en: "Cafeteria", th: "โรงอาหาร" },
  market: { en: "Market", th: "ตลาด" },
  mall: { en: "Shopping mall", th: "ห้างสรรพสินค้า" },
  chicken: { en: "Chicken dishes", th: "เมนูไก่" },
  apartment: { en: "Apartment", th: "อพาร์ตเมนต์" },
  dorm: { en: "Student dormitory", th: "หอพักนักศึกษา" },
  condo: { en: "Condominium", th: "คอนโดมิเนียม" },
  lodging: { en: "Lodging", th: "ที่พัก" },
} satisfies Record<string, Bilingual>;

export const foodGroups: PlaceGroup[] = [
  {
    id: "noodles",
    title: { en: "Noodles and noodle soups", th: "ก๋วยเตี๋ยวและเส้นทุกทรง" },
    places: [
      {
        id: "khun-daeng",
        name: { en: "Khun Daeng's Vietnamese Noodle", th: "คุณแดง ก๋วยจั๊บญวน" },
        nameLocal: "คุณแดง",
        category: cat.noodles,
        area: "oldtown",
        lat: 13.7621,
        lng: 100.4937,
        rating: 4.4,
        ratingCount: 4023,
        note: {
          en: "Served with pork sausage and fried spring rolls in a peppery broth.",
          th: "เสิร์ฟคู่หมูยอและปอเปี๊ยะทอด น้ำซุปรสพริกไทยหอม",
        },
        mapsQuery: "คุณแดง ก๋วยจั๊บญวน พระอาทิตย์",
      },
      {
        id: "nai-soie",
        name: { en: "Nai Soie Beef Noodle", th: "นายโส่ย เนื้อตุ๋น" },
        nameLocal: "นายโส่ย",
        category: cat.noodles,
        area: "oldtown",
        lat: 13.7627,
        lng: 100.4945,
        rating: 3.9,
        ratingCount: 3724,
        note: {
          en: "On Phra Athit Road since 1976, one of the older shops on the street.",
          th: "อยู่บนถนนพระอาทิตย์มาตั้งแต่ปี 2519 เป็นร้านเก่าแก่ร้านหนึ่งของย่านนี้",
        },
        mapsQuery: "นายโส่ย เนื้อตุ๋น พระอาทิตย์",
      },
      {
        id: "kua-gai-pa-pien",
        name: { en: "Kuay Teow Kua Gai Aunty Pien", th: "ก๋วยเตี๋ยวคั่วไก่ป้าเพียร" },
        category: cat.noodles,
        area: "oldtown",
        lat: 13.7482,
        lng: 100.4987,
        rating: 4.5,
        ratingCount: 819,
        note: {
          en: "Fried to order in a brass wok over charcoal, the way the shop has done it for decades.",
          th: "ผัดสดทีละจานในกระทะทองเหลืองบนเตาถ่านแบบเดิมมาหลายสิบปี",
        },
        mapsQuery: "Kuay Teow Kua Gai Aunty Pien Bangkok",
      },
      {
        id: "banglamphu-duck",
        name: {
          en: "Banglamphu Duck Noodles & Duck Rice",
          th: "ก๋วยเตี๋ยวเป็ดย่างบางลำพู เจ้าเก่า",
        },
        nameLocal: "เป็ดย่างบางลำพู",
        category: cat.noodles,
        area: "oldtown",
        lat: 13.7612,
        lng: 100.4969,
        rating: 4.5,
        ratingCount: 193,
        note: {
          en: "Open since 1967, and known for noodles cut wider than most shops serve.",
          th: "เปิดขายมาตั้งแต่ปี 2510 ขึ้นชื่อเรื่องเส้นใหญ่พิเศษที่หากินยากในร้านอื่น",
        },
        mapsQuery: "ก๋วยเตี๋ยวเป็ดย่างบางลำพู เจ้าเก่า",
      },
      {
        id: "khanom-jeen-banglamphu",
        name: { en: "Khanom Jeen Banglamphu", th: "ขนมจีนบางลำพู ตรอกตั้งฮั่วเส็ง" },
        nameLocal: "ขนมจีนบางลำพู",
        category: cat.hawker,
        area: "oldtown",
        lat: 13.7618,
        lng: 100.4978,
        rating: 4.4,
        ratingCount: 85,
        note: {
          en: "In the alley beside the old Tang Hua Seng store, with a choice of curry broths and vegetables to help yourself to.",
          th: "อยู่ในตรอกข้างห้างตั้งฮั่วเส็งเดิม มีน้ำยาให้เลือกหลายอย่าง ผักตักได้ไม่อั้น",
        },
        mapsQuery: "ขนมจีนบางลำพู ตรอกตั้งฮั่วเส็ง",
      },
      {
        id: "nai-uan-yentafo",
        name: { en: "Nai Uan Yentafo (Sao Chingcha)", th: "นายอ้วนเย็นตาโฟ เสาชิงช้า" },
        nameLocal: "นายอ้วนเย็นตาโฟ",
        category: cat.noodles,
        area: "oldtown",
        lat: 13.7527,
        lng: 100.4992,
        rating: 4.2,
        ratingCount: 2164,
        note: {
          en: "A third-generation shop by the Giant Swing, awarded a Michelin Bib Gourmand since 2018.",
          th: "ร้านรุ่นที่ 3 ใกล้เสาชิงช้า ได้บิบกูร์มองจากมิชลินไกด์ตั้งแต่ปี 2561",
        },
        mapsQuery: "นายอ้วนเย็นตาโฟ เสาชิงช้า",
      },
      {
        id: "saimai-wonton",
        name: { en: "Saimai Shrimp Wonton Noodle", th: "สายไหม บะหมี่เกี๊ยวกุ้ง" },
        category: cat.chineseNoodles,
        area: "oldtown",
        lat: 13.7554,
        lng: 100.4863,
        rating: 4.2,
        ratingCount: 392,
        note: {
          en: "Handmade noodles and wontons stuffed with whole shrimp, opposite Siriraj Hospital.",
          th: "บะหมี่ทำมือและเกี๊ยวไส้กุ้งตัวโต อยู่ตรงข้ามโรงพยาบาลศิริราช",
        },
        mapsQuery: "สายไหม บะหมี่เกี๊ยวกุ้ง วังหลัง",
      },
      {
        id: "mit-potchana",
        name: { en: "Mit Potchana", th: "มิตรโภชนา" },
        category: cat.noodles,
        area: "oldtown",
        lat: 13.7563,
        lng: 100.4893,
        rating: 4.1,
        ratingCount: 136,
        mapsQuery: "Mit Potchana Pinklao Bangkok",
      },
      {
        id: "uncle-aunt-pork-noodle",
        name: { en: "Uncle & Aunt Pork Noodle", th: "ก๋วยเตี๋ยวหมูลุงกับป้า" },
        category: cat.noodles,
        area: "pinklao",
        lat: 13.7749,
        lng: 100.483,
        rating: 4.0,
        ratingCount: 1668,
        note: {
          en: "Tom yum pork noodles by the Pinklao intersection, open 4pm to 3am and closed Sundays.",
          th: "ก๋วยเตี๋ยวต้มยำหมูบะช่อแถวแยกปิ่นเกล้า เปิดสี่โมงเย็นถึงตีสาม หยุดวันอาทิตย์",
        },
        mapsQuery: "ลุงกับป้า ก๋วยเตี๋ยวต้มยำหมูบะช่อ จรัญสนิทวงศ์ 49",
      },
    ],
  },
  {
    id: "rice-and-late-night",
    title: { en: "Rice plates, khao tom and late-night", th: "ข้าวราดแกง ข้าวต้ม และมื้อดึก" },
    places: [
      {
        id: "khao-tom-bowon",
        name: { en: "Khao Tom Bowon", th: "ข้าวต้มบวร" },
        nameLocal: "ข้าวต้มบวร",
        category: cat.porridge,
        area: "oldtown",
        lat: 13.761,
        lng: 100.5003,
        rating: 4.3,
        ratingCount: 1610,
        note: {
          en: "Opposite Wat Bowon Niwet, with the kitchen out front, open from late afternoon to about 11pm.",
          th: "ตรงข้ามวัดบวรนิเวศ ครัวอยู่หน้าร้าน เปิดบ่ายแก่ ๆ ถึงราวห้าทุ่ม",
        },
        mapsQuery: "ข้าวต้มบวร บางลำพู",
      },
      {
        id: "fat-duck-porridge",
        name: {
          en: "The Fat Duck rice porridge (original)",
          th: "ข้าวต้มเป็ด เป็ดอ้วน เจ้าเก่า (ประตูผี)",
        },
        category: cat.porridge,
        area: "oldtown",
        lat: 13.7528,
        lng: 100.5037,
        rating: 4.5,
        ratingCount: 714,
        note: {
          en: "Around 60 years old, next to Wat Thepthidaram, and known for using every part of the duck.",
          th: "เปิดมาราว 60 ปี อยู่ข้างวัดเทพธิดาราม ขึ้นชื่อเรื่องเครื่องในและทุกส่วนของเป็ด",
        },
        mapsQuery: "ข้าวต้มเป็ด เป็ดอ้วน เจ้าเก่า ประตูผี",
      },
      {
        id: "khao-dong-moo-daeng",
        name: { en: "Khao Dong Moo Daeng", th: "ข้าวด้งหมูแดง เตาถ่าน ศิริราช วังหลัง" },
        category: cat.thai,
        area: "oldtown",
        lat: 13.7555,
        lng: 100.4866,
        rating: 4.7,
        ratingCount: 1243,
        note: {
          en: "Red pork and crispy pork grilled over charcoal, from an 80 year old recipe, inside Wang Lang market.",
          th: "หมูแดงและหมูกรอบย่างเตาถ่านตามสูตรอายุ 80 ปี อยู่ในตลาดวังหลัง",
        },
        mapsQuery: "ข้าวด้งหมูแดง เตาถ่าน ศิริราช วังหลัง",
      },
      {
        id: "chok-dee-kota",
        name: { en: "Chok Dee Kota", th: "ร้านโชคดี โกตา" },
        nameLocal: "โชคดี โกตา",
        category: cat.chicken,
        area: "oldtown",
        lat: 13.766,
        lng: 100.5018,
        rating: 4.4,
        ratingCount: 493,
        note: {
          en: "Hainanese chicken rice from a recipe close to 90 years old, first sold in Yaowarat.",
          th: "ข้าวมันไก่ไหหลำสูตรเกือบ 90 ปี เริ่มขายที่เยาวราชก่อนย้ายมาแถวนี้",
        },
        mapsQuery: "ร้านโชคดี โกตา",
      },
      {
        id: "jin-tod-pa-tue",
        name: {
          en: "Jin Tod Pa Tue (Lotus's Mall Charan)",
          th: "จิ๊นทอดป้าตือ โลตัสมอลล์ แม็คโครจรัญ",
        },
        nameLocal: "จิ๊นทอดป้าตือ",
        category: cat.restaurant,
        area: "pinklao",
        lat: 13.7607,
        lng: 100.4699,
        rating: 3.6,
        ratingCount: 119,
        note: {
          en: "A Thonburi-side branch of a northern fried meat chain that grew popular through social media.",
          th: "สาขาฝั่งธนฯ ของร้านจิ๊นทอดสไตล์เหนือที่ดังขึ้นมาจากโซเชียล",
        },
        mapsQuery: "จิ๊นทอดป้าตือ โลตัสมอลล์ แม็คโครจรัญ",
      },
      {
        id: "khao-gaeng-ho-charan",
        name: { en: "Khao Gaeng Ho Charan", th: "ร้านข้าวแกงห่อจรัญ" },
        nameLocal: "ข้าวแกงห่อจรัญ",
        category: cat.restaurant,
        area: "pinklao",
        lat: 13.777,
        lng: 100.4851,
        rating: 4.0,
        ratingCount: 70,
        note: {
          en: "Sells one thing only: curry over rice, wrapped in banana leaf.",
          th: "ขายอย่างเดียวคือข้าวแกงห่อใบตอง ไม่มีเมนูอื่น",
        },
        mapsQuery: "ร้านข้าวแกงห่อจรัญ",
      },
    ],
  },
  {
    id: "thai-tables",
    title: { en: "Thai tables and family restaurants", th: "ร้านอาหารไทยนั่งกินเป็นเรื่องเป็นราว" },
    places: [
      {
        id: "elle-tha-prachan",
        name: { en: "ELLE ThaPhra Chan", th: "ร้านแอ๊ว ท่าพระจันทร์" },
        category: cat.thai,
        area: "oldtown",
        lat: 13.7562,
        lng: 100.4889,
        rating: 4.1,
        ratingCount: 142,
        note: {
          en: "Two air-conditioned floors on Maha Raj Road, busy with Thammasat and Silpakorn students.",
          th: "สองชั้นติดแอร์บนถนนมหาราช นักศึกษาธรรมศาสตร์และศิลปากรแวะกินประจำ",
        },
        mapsQuery: "ร้านแอ๊ว ท่าพระจันทร์",
      },
      {
        id: "khun-ek",
        name: { en: "Khun Ek", th: "คุณเอก" },
        category: cat.restaurant,
        area: "oldtown",
        lat: 13.7561,
        lng: 100.489,
        rating: 4.4,
        ratingCount: 110,
        note: {
          en: "Made-to-order dishes on the riverside walkway at Tha Prachan pier.",
          th: "ร้านตามสั่งริมทางเดินท่าน้ำท่าพระจันทร์",
        },
        mapsQuery: "ร้านคุณเอก ท่าพระจันทร์",
      },
      {
        id: "new-yong-hua",
        name: { en: "New Yong Hua Phochana", th: "นิวย่งฮั้วโภชนา" },
        category: cat.restaurant,
        area: "oldtown",
        lat: 13.7563,
        lng: 100.4894,
        rating: 4.5,
        ratingCount: 135,
        note: {
          en: "Roast duck and red pork rice, served opposite the Thammasat gate for more than 45 years.",
          th: "ข้าวหน้าเป็ดและหมูแดง ขายอยู่ตรงข้ามประตูธรรมศาสตร์มากว่า 45 ปี",
        },
        mapsQuery: "นิวย่งฮั้วโภชนา ท่าพระจันทร์",
      },
      {
        id: "watchara-phochana",
        name: { en: "Watchara Phochana", th: "วัชระโภชนา" },
        category: cat.thai,
        area: "pinklao",
        lat: 13.7497,
        lng: 100.4701,
        rating: 4.3,
        ratingCount: 1311,
        note: {
          en: "A late-night khao tom restaurant on Charansanitwong Road, open since the 1970s.",
          th: "ร้านข้าวต้มเปิดดึกบนถนนจรัญสนิทวงศ์ เปิดมาตั้งแต่ยุค 2510",
        },
        mapsQuery: "วัชระโภชนา จรัญสนิทวงศ์",
      },
      {
        id: "supanniga",
        name: { en: "Supanniga Eating Room Tha Tien", th: "ห้องทานข้าวสุพรรณิการ์ ท่าเตียน" },
        nameLocal: "สุพรรณิการ์",
        category: cat.thai,
        area: "oldtown",
        lat: 13.7441,
        lng: 100.4917,
        rating: 4.5,
        ratingCount: 2803,
        note: {
          en: "Trat and Isan family recipes, with a rooftop looking across the river to Wat Arun.",
          th: "อาหารสูตรครอบครัวจากตราดและอีสาน ชั้นดาดฟ้ามองเห็นวัดอรุณข้ามแม่น้ำ",
        },
        mapsQuery: "Supanniga Eating Room Tha Tien",
      },
      {
        id: "mit-ko-yuan",
        name: { en: "Mit Ko Yuan", th: "มิตรโกหย่วน" },
        nameLocal: "มิตรโกหย่วน",
        category: cat.thai,
        area: "oldtown",
        lat: 13.7538,
        lng: 100.5011,
        rating: 4.4,
        ratingCount: 1255,
        note: {
          en: "Its stewed beef tongue is traced to Western cooking that Pridi Banomyong taught the founder.",
          th: "เมนูสตูว์ลิ้นวัวเล่ากันว่ามาจากวิธีทำอาหารฝรั่งที่ปรีดี พนมยงค์ สอนเจ้าของร้านเอง",
        },
        mapsQuery: "มิตรโกหย่วน ดินสอ",
      },
      {
        id: "ban-wannakovit",
        name: { en: "Ban Wannakovit", th: "บ้านวรรณโกวิท" },
        category: cat.thai,
        area: "oldtown",
        lat: 13.7564,
        lng: 100.4995,
        rating: 4.3,
        ratingCount: 269,
        note: {
          en: "Khao chae served inside an old mansion behind the 14 October Monument.",
          th: "ข้าวแช่ในบ้านเก่าหลังอนุสรณ์สถาน 14 ตุลา",
        },
        mapsQuery: "Ban Wannakovit Bangkok",
      },
      {
        id: "chuan-aroy",
        name: { en: "Chuan Aroy Bistro", th: "ชวนอร่อย" },
        category: cat.thai,
        area: "oldtown",
        lat: 13.7557,
        lng: 100.4867,
        rating: 3.8,
        ratingCount: 342,
        note: {
          en: "An open-air riverside spot by Siriraj pier, cooking to order since 1978.",
          th: "ร้านเปิดโล่งริมน้ำแถวท่าน้ำศิริราช ทำอาหารตามสั่งมาตั้งแต่ปี 2521",
        },
        mapsQuery: "ชวนอร่อย ท่าน้ำศิริราช",
      },
      {
        id: "yellow-curry-studio",
        name: { en: "Yellow Curry Studio", th: "แกงเหลืองสตูดิโอ" },
        nameLocal: "แกงเหลืองสตูดิโอ",
        category: cat.restaurant,
        area: "oldtown",
        lat: 13.7467,
        lng: 100.4977,
        rating: 4.9,
        ratingCount: 110,
        note: {
          en: "Southern Thai cooking in the Surat Thani style, on Ban Mo Road in the old town.",
          th: "อาหารใต้สไตล์สุราษฎร์ธานี อยู่บนถนนบ้านหม้อย่านเมืองเก่า",
        },
        mapsQuery: "แกงเหลืองสตูดิโอ บ้านหม้อ",
      },
      {
        id: "yong-seng-lee",
        name: { en: "Yong Seng Lee", th: "ย่งเซ่งหลี" },
        category: cat.restaurant,
        area: "oldtown",
        lat: 13.7524,
        lng: 100.4963,
        rating: 4.9,
        ratingCount: 666,
        note: {
          en: "A Phraeng Nara shophouse that once sold curry over rice and now serves old-style Hainanese suki.",
          th: "ตึกแถวย่านแพร่งนรา เดิมขายข้าวราดแกง ตอนนี้ขายสุกี้สูตรไหหลำแบบเก่า",
        },
        mapsQuery: "ย่งเซ่งหลี แพร่งนรา",
      },
      {
        id: "grandmas",
        name: { en: "Grandma's (Thai-Portuguese home food)", th: "ครัวคุณยาย" },
        category: cat.restaurant,
        area: "oldtown",
        lat: 13.739,
        lng: 100.4932,
        rating: 4.9,
        ratingCount: 116,
        note: {
          en: "Home cooking from the Kudi Chin Thai-Portuguese community across the river.",
          th: "อาหารบ้าน ๆ ตำรับชุมชนไทย-โปรตุเกสกุฎีจีน ฝั่งธนฯ",
        },
        mapsQuery: "Grandma's Thai Portuguese home food Bangkok",
      },
      {
        id: "s-laab-ped",
        name: { en: "S. Laab Ped Yasothon", th: "ส.ลาบเป็ดยโสธร" },
        nameLocal: "ส.ลาบเป็ด",
        category: cat.restaurant,
        area: "pinklao",
        lat: 13.768,
        lng: 100.4868,
        rating: 4.5,
        ratingCount: 87,
        note: {
          en: "Isan grills near Pinklao bridge, open until about 2:30am.",
          th: "ร้านอีสานแถวสะพานปิ่นเกล้า เปิดถึงราวตีสองครึ่ง",
        },
        mapsQuery: "ส.ลาบเป็ดยโสธร ปิ่นเกล้า",
      },
      {
        id: "rod-dee-ded",
        name: { en: "Rod Dee Ded Pinklao", th: "รสดีเด็ด ปิ่นเกล้า" },
        nameLocal: "รสดีเด็ด",
        category: cat.restaurant,
        area: "pinklao",
        lat: 13.7711,
        lng: 100.4834,
        rating: 4.0,
        ratingCount: 201,
        note: {
          en: "Beef and pork noodles opposite PATA Pinklao, reached by the skywalk.",
          th: "ก๋วยเตี๋ยวเนื้อและหมูตุ๋น ตรงข้ามพาต้าปิ่นเกล้า ข้ามได้ทางสกายวอล์ก",
        },
        mapsQuery: "รสดีเด็ด ปิ่นเกล้า ตรงข้ามพาต้า",
      },
    ],
  },
  {
    id: "chinese",
    title: { en: "Chinese and dim sum", th: "อาหารจีนและติ่มซำ" },
    places: [
      {
        id: "dim-sum-zai",
        name: { en: "Dim Sum Zai", th: "ติ่มซำไจ๋" },
        category: cat.dimSum,
        area: "oldtown",
        lat: 13.7499,
        lng: 100.505,
        rating: 4.8,
        ratingCount: 322,
        mapsQuery: "ติ่มซำไจ๋ บริพัตร",
      },
      {
        id: "nan-fah",
        name: { en: "Nan Fah", th: "นันฟ้าเป็ดย่าง สูตรฮ่องกง" },
        category: cat.chinese,
        area: "oldtown",
        lat: 13.754,
        lng: 100.5011,
        rating: 4.4,
        ratingCount: 209,
        note: {
          en: "Roast duck on Din So Road for more than 70 years, glazed with honey.",
          th: "เป็ดย่างอบน้ำผึ้งบนถนนดินสอ เปิดขายมากว่า 70 ปี",
        },
        mapsQuery: "นันฟ้าเป็ดย่าง สูตรฮ่องกง ดินสอ",
      },
      {
        id: "jade-garden",
        name: { en: "Jade Garden", th: "ภัตตาคารเจดการ์เด้น" },
        category: cat.chinese,
        area: "pinklao",
        lat: 13.7705,
        lng: 100.488,
        rating: 4.3,
        ratingCount: 2176,
        note: {
          en: "Open for more than 38 years on Arun Amarin Road, known for Peking duck and pomfret.",
          th: "เปิดมากว่า 38 ปีบนถนนอรุณอมรินทร์ ขึ้นชื่อเป็ดปักกิ่งและปลาจีน",
        },
        mapsQuery: "ภัตตาคารเจดการ์เด้น อรุณอมรินทร์",
      },
    ],
  },
  {
    id: "korean",
    title: { en: "Korean corner", th: "มุมอาหารเกาหลี" },
    places: [
      {
        id: "dong-dae-moon",
        name: { en: "Dong Dae Moon", th: "ทงแดมุน" },
        category: cat.korean,
        area: "oldtown",
        lat: 13.7619,
        lng: 100.4945,
        rating: 4.2,
        ratingCount: 713,
        note: {
          en: "Korean grill buffet on Soi Rambuttri, with no time limit on the table.",
          th: "บุฟเฟ่ต์ปิ้งย่างเกาหลีในซอยรามบุตรี ไม่จำกัดเวลา",
        },
        mapsQuery: "ทงแดมุน ซอยรามบุตรี",
      },
      {
        id: "hotpokki",
        name: { en: "Hotpokki", th: "Hotpokki 핫뽀끼" },
        category: cat.restaurant,
        area: "pinklao",
        lat: 13.7787,
        lng: 100.4779,
        rating: 4.6,
        ratingCount: 217,
        note: {
          en: "Tteokbokki hotpot buffet on the second floor of Major Cineplex Pinklao.",
          th: "บุฟเฟ่ต์ต๊อกปกกีหม้อร้อน ชั้น 2 เมเจอร์ ซีนีเพล็กซ์ ปิ่นเกล้า",
        },
        mapsQuery: "Hotpokki เมเจอร์ ซีนีเพล็กซ์ ปิ่นเกล้า",
      },
    ],
  },
  {
    id: "indian-halal",
    title: { en: "Indian, halal and South Asian", th: "อาหารอินเดีย ฮาลาล และเอเชียใต้" },
    places: [
      {
        id: "tonys",
        name: { en: "Tony's", th: "Tony's" },
        category: cat.northIndian,
        area: "oldtown",
        lat: 13.7431,
        lng: 100.5019,
        rating: 4.3,
        ratingCount: 824,
        note: {
          en: "A few open-air tables beside Khlong Ong Ang.",
          th: "มีโต๊ะกลางแจ้งไม่กี่ตัวริมคลองโอ่งอ่าง",
        },
        mapsQuery: "Tony's North Indian restaurant Banglamphu Bangkok",
      },
      {
        id: "indian-kebab-curries",
        name: { en: "Indian Kebab and Curries", th: "Indian Kebab and Curries" },
        category: cat.northIndian,
        area: "oldtown",
        lat: 13.762,
        lng: 100.4943,
        rating: 4.6,
        ratingCount: 591,
        note: {
          en: "On Soi Chana Songkhram, a short walk from Khao San Road.",
          th: "อยู่ในซอยชนะสงคราม เดินจากถนนข้าวสารไม่ไกล",
        },
        mapsQuery: "Indian Kebab and Curries ซอยชนะสงคราม",
      },
      {
        id: "punjab-sweets",
        name: { en: "Punjab Sweets", th: "ปัญจาบ สวีท พาหุรัด" },
        category: cat.indianSweets,
        area: "oldtown",
        lat: 13.7438,
        lng: 100.5007,
        note: {
          en: "Indian sweets in Phahurat, Bangkok's Little India.",
          th: "ขนมอินเดียย่านพาหุรัด ลิตเติ้ลอินเดียของกรุงเทพฯ",
        },
        rating: 4.4,
        ratingCount: 526,
        mapsQuery: "ปัญจาบ สวีท พาหุรัด",
      },
      {
        id: "aheesah-roddee",
        name: { en: "Aheesah Roddee Halal", th: "อาอีซะฮ์ รสดี" },
        category: cat.halal,
        area: "oldtown",
        lat: 13.7603,
        lng: 100.4983,
        rating: 4.4,
        ratingCount: 1153,
        note: {
          en: "Halal biryani and satay, running since 1975 and listed in the Michelin Guide.",
          th: "บิรยานีและสะเต๊ะฮาลาล เปิดมาตั้งแต่ปี 2518 และติดโผมิชลินไกด์",
        },
        mapsQuery: "อาอีซะฮ์ รสดี ตานี",
      },
    ],
  },
  {
    id: "western",
    title: { en: "Steak, western and international", th: "สเต็กและอาหารนานาชาติ" },
    places: [
      {
        id: "shoshana",
        name: { en: "Shoshana", th: "Shoshana" },
        category: cat.israeli,
        area: "oldtown",
        lat: 13.76,
        lng: 100.4963,
        rating: 4.5,
        ratingCount: 2423,
        note: {
          en: "Banglamphu's long-running Israeli restaurant, a Khao San-area classic.",
          th: "ร้านอาหารอิสราเอลเก่าแก่ย่านบางลำพู อยู่คู่ข้าวสารมานาน",
        },
        mapsQuery: "Shoshana restaurant Bangkok",
      },
      {
        id: "medium-rare",
        name: { en: "Medium Rare Tha Tian", th: "Medium Rare ท่าเตียน" },
        category: cat.restaurant,
        area: "oldtown",
        lat: 13.746,
        lng: 100.4912,
        rating: 3.6,
        ratingCount: 581,
        note: {
          en: "Charcoal-grilled steak across the road from Wat Pho.",
          th: "สเต็กย่างเตาถ่าน อยู่ตรงข้ามวัดโพธิ์",
        },
        mapsQuery: "Medium Rare Tha Tian Bangkok",
      },
      {
        id: "chaluy-steak",
        name: { en: "Chaluy Steak", th: "ฉลุย สเต็ก" },
        nameLocal: "ฉลุย",
        category: cat.steak,
        area: "oldtown",
        lat: 13.7553,
        lng: 100.4847,
        rating: 4.2,
        ratingCount: 33,
        mapsQuery: "ฉลุย สเต็ก",
      },
      {
        id: "steak-charoen-phung",
        name: { en: "Steak Charoen Phung (Pinklao)", th: "สเต็กเจริญพุง สาขาปิ่นเกล้า" },
        nameLocal: "สเต็กเจริญพุง",
        category: cat.steak,
        area: "pinklao",
        lat: 13.7769,
        lng: 100.4796,
        rating: 4.7,
        ratingCount: 153,
        mapsQuery: "สเต็กเจริญพุง สาขาปิ่นเกล้า",
      },
      {
        id: "mcdonalds-pata",
        name: { en: "McDonald's PATA Pinklao", th: "แมคโดนัลด์ พาต้าปิ่นเกล้า" },
        category: cat.restaurant,
        area: "pinklao",
        lat: 13.7716,
        lng: 100.4838,
        rating: 4.3,
        ratingCount: 1241,
        mapsQuery: "McDonald's PATA Pinklao",
      },
    ],
  },
  {
    id: "hotpot-bbq",
    title: { en: "Hotpot, mookata, BBQ and buffets", th: "หม้อไฟ หมูกระทะ ปิ้งย่าง และบุฟเฟ่ต์" },
    places: [
      {
        id: "mheesuk",
        name: { en: "Mheesuk Hotpot Buffet", th: "MHEESUK หมีสุข ฮอทพอทบุฟเฟ่ต์" },
        category: cat.shabu,
        area: "pinklao",
        lat: 13.7704,
        lng: 100.484,
        rating: 4.9,
        ratingCount: 601,
        note: {
          en: "Conveyor-belt shabu with a choice of soup bases.",
          th: "ชาบูสายพาน เลือกน้ำซุปได้หลายแบบ",
        },
        mapsQuery: "MHEESUK HOTPOT BUFFET Bangkok",
      },
      {
        id: "pinklao-fish-head",
        name: { en: "Pinklao Fish Head Hot Pot", th: "หัวปลาหม้อไฟ ปิ่นเกล้า" },
        category: cat.restaurant,
        area: "pinklao",
        lat: 13.7654,
        lng: 100.4876,
        rating: 4.3,
        ratingCount: 1438,
        note: {
          en: "A Thonburi-side fixture for decades, built around fish head hot pot and tom yum.",
          th: "ร้านเก่าแก่ฝั่งธนฯ จุดเด่นคือหัวปลาหม้อไฟและต้มยำ",
        },
        mapsQuery: "Pinklao Fish Head Hot Pot",
      },
      {
        id: "kbbq-pinklao",
        name: { en: "KBBQ Pinklao", th: "KBBQ ปิ่นเกล้า" },
        category: cat.buffet,
        area: "pinklao",
        lat: 13.785,
        lng: 100.4707,
        rating: 4.3,
        ratingCount: 111,
        mapsQuery: "KBBQ Pinklao",
      },
      {
        id: "hon-buffet",
        name: { en: "Hon Buffet", th: "ฮ้อน บุฟเฟ่ต์" },
        nameLocal: "ฮ้อน",
        category: cat.buffet,
        area: "pinklao",
        lat: 13.7841,
        lng: 100.4711,
        rating: 4.7,
        ratingCount: 1279,
        note: {
          en: "Isan-style jaew hon hot pot with more than 100 dishes, open to midnight.",
          th: "แจ่วฮ้อนสไตล์อีสาน มีเมนูกว่า 100 อย่าง เปิดถึงเที่ยงคืน",
        },
        mapsQuery: "ฮ้อน บุฟเฟ่ต์ ปิ่นเกล้า",
      },
      {
        id: "tidmunz",
        name: { en: "Tidmunz Buffet", th: "ติดมันส์ บุฟเฟ่ต์" },
        category: cat.buffet,
        area: "pinklao",
        lat: 13.7878,
        lng: 100.4666,
        rating: 4.6,
        ratingCount: 1068,
        note: {
          en: "Grill and shabu with no time limit, open to about 3am.",
          th: "ปิ้งย่างและชาบูแบบไม่จำกัดเวลา เปิดถึงราวตีสาม",
        },
        mapsQuery: "Tidmunz Buffet Pinklao",
      },
      {
        id: "pookpik-mookata",
        name: { en: "Pookpik Mookata", th: "POOKPIK หมูกระทะ" },
        category: cat.restaurant,
        area: "pinklao",
        lat: 13.7835,
        lng: 100.4714,
        rating: 5.0,
        ratingCount: 18,
        mapsQuery: "POOKPIK หมูกระทะ ปิ่นเกล้า",
      },
      {
        id: "barbq-resort",
        name: { en: "Bar B Q Resort Pinklao", th: "BAR B Q RESORT ปิ่นเกล้า" },
        category: cat.buffet,
        area: "pinklao",
        lat: 13.78,
        lng: 100.476,
        rating: 4.5,
        ratingCount: 3036,
        note: {
          en: "A grill and seafood buffet chain; the Pinklao branch opens 4pm to 1am.",
          th: "เชนบุฟเฟ่ต์ปิ้งย่างและซีฟู้ด สาขาปิ่นเกล้าเปิดสี่โมงเย็นถึงตีหนึ่ง",
        },
        mapsQuery: "BAR B Q RESORT PINKLAO",
      },
      {
        id: "suki-teenoi",
        name: { en: "Suki Teenoi (The Sense Pinklao)", th: "สุกี้ตี๋น้อย เดอะเซ้นส์ ปิ่นเกล้า" },
        nameLocal: "สุกี้ตี๋น้อย",
        category: cat.buffet,
        area: "pinklao",
        lat: 13.7796,
        lng: 100.4748,
        rating: 4.3,
        ratingCount: 1326,
        note: {
          en: "Budget suki chain open until 5am; expect a queue at peak times.",
          th: "สุกี้ราคานักศึกษาเปิดถึงตีห้า ช่วงพีคคิวยาว",
        },
        mapsQuery: "Suki Teenoi The Sense Pinklao",
      },
      {
        id: "rimnam-bbq",
        name: { en: "Rimnam BBQ Buffet Pinklao", th: "หมูกระทะริมน้ำ ปิ่นเกล้า" },
        category: cat.barbecue,
        area: "pinklao",
        lat: 13.7627,
        lng: 100.4897,
        rating: 3.9,
        ratingCount: 2025,
        note: {
          en: "The tables sit right on the Chao Phraya riverbank; open 4pm to midnight.",
          th: "โต๊ะนั่งอยู่ริมแม่น้ำเจ้าพระยา เปิดสี่โมงเย็นถึงเที่ยงคืน",
        },
        mapsQuery: "หมูกระทะริมน้ำ ปิ่นเกล้า",
      },
      {
        id: "malahub",
        name: { en: "Malahub (Bang Yi Khan)", th: "หมาล่าฮับ บางยี่ขัน" },
        nameLocal: "หมาล่าฮับ",
        category: cat.restaurant,
        area: "pinklao",
        lat: 13.7766,
        lng: 100.4849,
        rating: 4.9,
        ratingCount: 469,
        note: {
          en: "Pay-by-weight mala skewers near MRT Bang Yi Khan; pick your own, then weigh them.",
          th: "หมาล่าทั่งชั่งน้ำหนัก ใกล้ MRT บางยี่ขัน เลือกเองแล้วเอาไปชั่ง",
        },
        mapsQuery: "MALAHUB หมาล่าฮับ บางยี่ขัน",
      },
      {
        id: "yija-suki-mala",
        name: { en: "Yija Suki Mala (Pinklao)", th: "อี้จาสุกี้หม่าล่า สาขาปิ่นเกล้า" },
        nameLocal: "อี้จา",
        category: cat.restaurant,
        area: "pinklao",
        lat: 13.7753,
        lng: 100.4832,
        rating: 3.5,
        ratingCount: 98,
        note: {
          en: "Conveyor-belt mala hotpot with a pot each, near MRT Bang Yi Khan; you pay per plate.",
          th: "สุกี้หม่าล่าสายพาน แยกหม้อต่อคน ใกล้ MRT บางยี่ขัน คิดเงินตามจาน",
        },
        mapsQuery: "อี้จาสุกี้หม่าล่า สาขาปิ่นเกล้า",
      },
      {
        id: "lucky-bbq",
        name: { en: "Lucky BBQ (Lotus's Mall)", th: "Lucky BBQ โลตัสมอลล์" },
        category: cat.restaurant,
        area: "pinklao",
        lat: 13.7606,
        lng: 100.47,
        rating: 4.3,
        ratingCount: 96,
        note: {
          en: "Grill buffet on the second floor of Lotus's Mall, beside Makro.",
          th: "บุฟเฟ่ต์ปิ้งย่าง ชั้น 2 โลตัสมอลล์ ข้างแม็คโคร",
        },
        mapsQuery: "Lucky BBQ โลตัสมอลล์ จรัญสนิทวงศ์",
      },
    ],
  },
  {
    id: "cafes-desserts",
    title: { en: "Breakfast, cafés and desserts", th: "อาหารเช้า คาเฟ่ และของหวาน" },
    places: [
      {
        id: "on-lok-yun",
        name: { en: "On Lok Yun", th: "ออน ล็อก หยุ่น" },
        nameLocal: "ออน ล็อก หยุ่น",
        category: cat.breakfast,
        area: "oldtown",
        lat: 13.747,
        lng: 100.5006,
        rating: 4.5,
        ratingCount: 2243,
        note: {
          en: "Old-school Thai-Chinese breakfast house on Charoen Krung, famous for eggs and toast.",
          th: "สภากาแฟโบราณบนถนนเจริญกรุง ขึ้นชื่อเรื่องไข่กระทะและขนมปังปิ้ง",
        },
        mapsQuery: "On Lok Yun Bangkok",
      },
      {
        id: "mont-nom-sod",
        name: { en: "Mont Nom Sod", th: "มนต์นมสด" },
        nameLocal: "มนต์นมสด",
        category: cat.bakery,
        area: "oldtown",
        lat: 13.7542,
        lng: 100.5011,
        rating: 4.4,
        ratingCount: 6229,
        note: {
          en: "Toast and fresh milk opposite Bangkok City Hall; the business started in 1964.",
          th: "ขนมปังปิ้งกับนมสด ตรงข้ามศาลาว่าการกรุงเทพฯ เริ่มกิจการมาตั้งแต่ปี 2507",
        },
        mapsQuery: "มนต์นมสด ดินสอ",
      },
      {
        id: "after-sunrise",
        name: { en: "After Sunrise", th: "After Sunrise" },
        category: cat.bakery,
        area: "oldtown",
        lat: 13.745,
        lng: 100.4919,
        rating: 4.9,
        ratingCount: 462,
        note: {
          en: "Churros and coffee upstairs in an old Tha Tien shophouse, within sight of Wat Pho.",
          th: "ชูโรสและกาแฟบนชั้นสองของตึกเก่าท่าเตียน มองเห็นวัดโพธิ์จากในร้าน",
        },
        mapsQuery: "After Sunrise bakery Bangkok",
      },
      {
        id: "ghee-gelato",
        name: { en: "Ghee Gelato House", th: "GHEE GELATO HOUSE" },
        category: cat.iceCream,
        area: "oldtown",
        lat: 13.744,
        lng: 100.4922,
        rating: 4.8,
        ratingCount: 336,
        note: {
          en: "Gelato made in house, with a quiet upstairs, in Soi Pansuk near Wat Pho.",
          th: "เจลาโต้ทำเอง มีชั้นบนเงียบ ๆ ให้นั่ง อยู่ซอยพานิชใกล้วัดโพธิ์",
        },
        mapsQuery: "GHEE GELATO HOUSE ท่าเตียน",
      },
      {
        id: "hia-mak-tofu",
        name: { en: "Hia Mak Tofu Pudding & Grass Jelly", th: "เต้าฮวย เฉาก๊วย เฮียมัก" },
        category: cat.hawker,
        area: "oldtown",
        lat: 13.7436,
        lng: 100.4934,
        rating: 4.8,
        ratingCount: 244,
        note: {
          en: "The same vendor has pushed this cart near Museum Siam for more than 60 years.",
          th: "เฮียมักเข็นรถขายอยู่แถวมิวเซียมสยามมากว่า 60 ปี",
        },
        mapsQuery: "เต้าฮวย เฉาก๊วย เฮียมัก",
      },
      {
        id: "second-cafe",
        name: { en: "Second Cafe Wanglang", th: "Second Cafe วังหลัง" },
        category: cat.cafe,
        area: "oldtown",
        lat: 13.7532,
        lng: 100.4864,
        rating: 4.6,
        ratingCount: 125,
        note: {
          en: "Upstairs above the Kiew Nong Bua noodle shop, with outdoor seats facing the river.",
          th: "อยู่ชั้นบนเหนือร้านเกี๊ยวหนองบัว มีที่นั่งด้านนอกหันออกแม่น้ำ",
        },
        mapsQuery: "Second Cafe วังหลัง",
      },
      {
        id: "chang-khua",
        name: { en: "Chang Khua (Tha Prachan)", th: "ช่างคั่ว สาขาท่าพระจันทร์" },
        nameLocal: "ช่างคั่ว",
        category: cat.coffee,
        area: "oldtown",
        lat: 13.7559,
        lng: 100.4904,
        rating: 4.8,
        ratingCount: 220,
        note: {
          en: "Roasts its own beans from farms in the north; on Phra Chan Road opposite Thammasat.",
          th: "คั่วเมล็ดเอง ใช้เมล็ดจากไร่ทางเหนือ อยู่ถนนพระจันทร์ตรงข้ามธรรมศาสตร์",
        },
        mapsQuery: "ช่างคั่ว สาขาท่าพระจันทร์",
      },
      {
        id: "lua-cafe",
        name: { en: "LUA Café", th: "LUA Café" },
        category: cat.cafe,
        area: "oldtown",
        lat: 13.7564,
        lng: 100.4891,
        rating: 4.7,
        ratingCount: 96,
        note: {
          en: "A short walk from campus, with a bright upstairs room that suits working.",
          th: "เดินจากมหาวิทยาลัยไม่ไกล ชั้นบนสว่าง เหมาะนั่งทำงาน",
        },
        mapsQuery: "LUA Cafe BKK Bangkok",
      },
      {
        id: "vanillary",
        name: { en: "Vanillary Cafe", th: "Vanillary cafe’" },
        category: cat.coffee,
        area: "oldtown",
        lat: 13.7595,
        lng: 100.4905,
        rating: 5.0,
        ratingCount: 3,
        mapsQuery: "Vanillary cafe Tha Prachan Bangkok",
      },
      {
        id: "inome",
        name: { en: "INOME Japanese Tea", th: "INOME Japanese TEA" },
        category: cat.coffee,
        area: "oldtown",
        lat: 13.762,
        lng: 100.4936,
        rating: 4.9,
        ratingCount: 135,
        note: {
          en: "Matcha made with tea from Ujitawara in Kyoto, on Phra Athit Road.",
          th: "มัทฉะจากใบชาอุจิตาวาระ เกียวโต อยู่บนถนนพระอาทิตย์",
        },
        mapsQuery: "INOME Japanese Tea พระอาทิตย์",
      },
    ],
  },
  {
    id: "night-spots",
    title: { en: "Night spots", th: "ร้านนั่งชิลตอนค่ำ" },
    places: [
      {
        id: "hippiebar",
        name: { en: "Hippiebar @ Rambuttri", th: "Hippiebar ถนนรามบุตรี" },
        category: cat.cocktailBar,
        area: "oldtown",
        lat: 13.761,
        lng: 100.4938,
        rating: 4.8,
        ratingCount: 112,
        mapsQuery: "Hippiebar Rambuttri Bangkok",
      },
    ],
  },
  {
    id: "markets-and-canteens",
    title: { en: "Markets, malls and canteens", th: "ตลาด ห้าง และโรงอาหาร" },
    places: [
      {
        id: "tu-60th-canteen",
        name: {
          en: "60th Anniversary Building Canteen (Thammasat)",
          th: "โรงอาหารอาคาร 60 ปี ธรรมศาสตร์",
        },
        category: cat.cafeteria,
        area: "oldtown",
        lat: 13.7589,
        lng: 100.4901,
        rating: 4.4,
        ratingCount: 156,
        note: {
          en: "The on-campus fallback: fast, cheap and air-conditioned.",
          th: "ตัวเลือกในมหาวิทยาลัย เร็ว ถูก แอร์เย็น",
        },
        mapsQuery: "60th Anniversary Thammasat Building Canteen",
      },
      {
        id: "wang-lang-market",
        name: { en: "Wang Lang Market", th: "ตลาดวังหลัง" },
        nameLocal: "ตลาดวังหลัง",
        category: cat.market,
        area: "oldtown",
        lat: 13.7561,
        lng: 100.4863,
        rating: 4.5,
        ratingCount: 4490,
        note: {
          en: "Street-food alleys and stalls across the river from campus, busiest from morning to late afternoon.",
          th: "ตรอกสตรีทฟู้ดและแผงลอยฝั่งตรงข้ามมหาวิทยาลัย คนเยอะสุดช่วงเช้าถึงบ่ายแก่ ๆ",
        },
        mapsQuery: "Wang Lang Market Bangkok",
      },
      {
        id: "tha-maharaj",
        name: { en: "Tha Maharaj", th: "ท่ามหาราช" },
        nameLocal: "ท่ามหาราช",
        category: cat.mall,
        area: "oldtown",
        lat: 13.7547,
        lng: 100.4887,
        rating: 4.3,
        ratingCount: 5475,
        note: {
          en: "Riverside mall with cafés and air-conditioned food options a short walk from campus.",
          th: "คอมมูนิตี้มอลล์ริมแม่น้ำ เดินจากมหาวิทยาลัยไม่ไกล มีคาเฟ่และร้านติดแอร์",
        },
        mapsQuery: "Tha Maharaj Bangkok",
      },
      {
        id: "central-pinklao",
        name: { en: "Central Pinklao", th: "เซ็นทรัล ปิ่นเกล้า" },
        category: cat.mall,
        area: "pinklao",
        lat: 13.778,
        lng: 100.4765,
        rating: 4.5,
        ratingCount: 27137,
        note: {
          en: "Open since 1995, and reopened on 6 November 2025 after a major renovation.",
          th: "เปิดมาตั้งแต่ปี 2538 และกลับมาเปิดใหม่วันที่ 6 พฤศจิกายน 2568 หลังรีโนเวตใหญ่",
        },
        mapsQuery: "Central Pinklao",
      },
      {
        id: "susco-square",
        name: { en: "Susco Square Pinklao", th: "Susco Square ปิ่นเกล้า" },
        category: cat.mall,
        area: "pinklao",
        lat: 13.7856,
        lng: 100.4712,
        rating: 4.6,
        ratingCount: 124,
        note: {
          en: "A petrol station that grew into a community mall, the largest in its chain.",
          th: "ปั๊มน้ำมันที่ขยายเป็นคอมมูนิตี้มอลล์ ใหญ่ที่สุดในเครือ",
        },
        mapsQuery: "Susco Square Pinklao",
      },
    ],
  },
];

/**
 * The "หอพัก คอนโดแนะนำ" list: recommended apartments, dorms and condos.
 * Everything sits on the Thonburi side, from behind Siriraj up through
 * Pinklao and Charansanitwong.
 */
export const housingPlaces: Place[] = [
  {
    id: "kitti-sathaporn",
    name: { en: "Kitti Sathaporn Apartment", th: "กิตติสถาพรอพาร์ทเมนท์" },
    nameLocal: "กิตติสถาพร",
    category: cat.apartment,
    area: "pinklao",
    lat: 13.7702,
    lng: 100.4768,
    rating: 4.8,
    ratingCount: 18,
    mapsQuery: "กิตติสถาพรอพาร์ทเมนท์",
  },
  {
    id: "baan-arun39",
    name: { en: "Baan Arun39 Siriraj", th: "บ้านอรุณ 39 ศิริราช" },
    category: cat.lodging,
    area: "pinklao",
    lat: 13.765,
    lng: 100.4805,
    rating: 4.6,
    ratingCount: 46,
    mapsQuery: "BAAN ARUN39 SIRIRAJ",
  },
  {
    id: "an-apartment",
    name: { en: "A. N. Apartment", th: "A. N. Apartment" },
    category: cat.apartment,
    area: "pinklao",
    lat: 13.766,
    lng: 100.491,
    rating: 4.6,
    ratingCount: 49,
    mapsQuery: "A. N. Apartment Siriraj Bangkok",
  },
  {
    id: "rachan-house",
    name: { en: "Rachan House", th: "Rachan house" },
    category: cat.dorm,
    area: "pinklao",
    lat: 13.7751,
    lng: 100.4894,
    rating: 4.7,
    ratingCount: 19,
    mapsQuery: "Rachan house dormitory Bangkok",
  },
  {
    id: "pk-residence",
    name: { en: "PK Residence Pinklao", th: "พีเค เรสซิเด้นซ์ ปิ่นเกล้า" },
    category: cat.apartment,
    area: "pinklao",
    lat: 13.766,
    lng: 100.4891,
    rating: 4.6,
    ratingCount: 114,
    mapsQuery: "PK Residence Pinklao",
  },
  {
    id: "lumpini-place-rama8",
    name: { en: "Lumpini Place Rama 8", th: "ลุมพินี เพลส พระราม 8" },
    category: cat.condo,
    area: "pinklao",
    lat: 13.7735,
    lng: 100.4921,
    rating: 4.4,
    ratingCount: 185,
    mapsQuery: "Lumpini Place Rama 8",
  },
  {
    id: "my-condo-pinklao",
    name: { en: "My Condo Pinklao", th: "มายคอนโด ปิ่นเกล้า" },
    category: cat.condo,
    area: "pinklao",
    lat: 13.7757,
    lng: 100.4835,
    rating: 4.2,
    ratingCount: 75,
    mapsQuery: "My Condo Pinklao",
  },
  {
    id: "ideo-mobi-charan",
    name: { en: "Ideo Mobi Charan Interchange", th: "ไอดีโอ โมบิ จรัญ อินเตอร์เชนจ์" },
    category: cat.condo,
    area: "pinklao",
    lat: 13.7624,
    lng: 100.4719,
    rating: 4.3,
    ratingCount: 278,
    note: {
      en: "On Charansanitwong Road near the MRT blue line (Bang Khun Si).",
      th: "ติดถนนจรัญสนิทวงศ์ ใกล้รถไฟฟ้า MRT สายสีน้ำเงิน",
    },
    mapsQuery: "Ideo Mobi Charan Interchange",
  },
  {
    id: "aspire-pinklao",
    name: { en: "Aspire Pinklao-Arunammarin", th: "แอสปาย ปิ่นเกล้า-อรุณอมรินทร์" },
    category: cat.condo,
    area: "pinklao",
    lat: 13.764,
    lng: 100.4846,
    rating: 4.3,
    ratingCount: 37,
    mapsQuery: "Aspire Pinklao Arunammarin",
  },
  {
    id: "parkland-charan",
    name: { en: "The Parkland Charan-Pinklao", th: "เดอะ พาร์คแลนด์ จรัญ-ปิ่นเกล้า" },
    category: cat.condo,
    area: "pinklao",
    lat: 13.7784,
    lng: 100.4861,
    rating: 4.2,
    ratingCount: 392,
    mapsQuery: "The Parkland Charan-Pinklao",
  },
  {
    id: "life-pinklao",
    name: { en: "Life Pinklao", th: "ไลฟ์ ปิ่นเกล้า" },
    category: cat.condo,
    area: "pinklao",
    lat: 13.7761,
    lng: 100.4853,
    rating: 4.4,
    ratingCount: 170,
    mapsQuery: "Life Pinklao condo",
  },
  {
    id: "lumpini-place-pinklao",
    name: { en: "Lumpini Place Pinklao", th: "ลุมพินี เพลส ปิ่นเกล้า" },
    category: cat.condo,
    area: "pinklao",
    lat: 13.7748,
    lng: 100.4808,
    rating: 4.4,
    ratingCount: 97,
    mapsQuery: "Lumpini Place Pinklao",
  },
  {
    id: "lumpini-suite-pinklao",
    name: { en: "Lumpini Suite Pinklao", th: "ลุมพินี สวีท ปิ่นเกล้า" },
    category: cat.condo,
    area: "pinklao",
    lat: 13.7731,
    lng: 100.4828,
    rating: 4.4,
    ratingCount: 97,
    mapsQuery: "Lumpini Suite Pinklao",
  },
  {
    id: "plum-condo-pinklao",
    name: { en: "Plum Condo Pinklao Station", th: "พลัมคอนโด ปิ่นเกล้า สเตชั่น" },
    category: cat.condo,
    area: "pinklao",
    lat: 13.7723,
    lng: 100.4834,
    rating: 4.3,
    ratingCount: 154,
    mapsQuery: "Plum Condo Pinklao Station",
  },
  {
    id: "lumpini-park-pinklao",
    name: { en: "Lumpini Park Pinklao", th: "ลุมพินี พาร์ค ปิ่นเกล้า" },
    category: cat.condo,
    area: "pinklao",
    lat: 13.7807,
    lng: 100.4754,
    rating: 4.4,
    ratingCount: 438,
    mapsQuery: "Lumpini Park Pinklao",
  },
  {
    id: "trust-residence",
    name: { en: "The Trust Residence Pinklao", th: "เดอะ ทรัสต์ เรสซิเด้นซ์ ปิ่นเกล้า" },
    category: cat.apartment,
    area: "pinklao",
    lat: 13.7854,
    lng: 100.4697,
    rating: 4.3,
    ratingCount: 115,
    mapsQuery: "The Trust Residence Pinklao",
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
  /**
   * Fractional tile bounds of the *visible frame*: the places' bounding box
   * plus `paddingTiles`. The frame is what the map element shows, so it is
   * deliberately not rounded to whole tiles; the tile layer below is drawn
   * larger and clipped to it.
   */
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  /** Frame width in tile units, i.e. `maxX - minX`. */
  cols: number;
  /** Frame height in tile units, i.e. `maxY - minY`. */
  rows: number;
  /** Integer tile range (inclusive) that covers the frame. */
  tileMinX: number;
  tileMaxX: number;
  tileMinY: number;
  tileMaxY: number;
  /** Number of tile columns/rows fetched, i.e. `tileMaxX - tileMinX + 1`. */
  tileCols: number;
  tileRows: number;
};

/**
 * How far the frame may depart from square before the short axis is widened,
 * as a width/height ratio. Without this a lopsided set of places (everything
 * strung along one road) would render as an unreadable sliver. The portrait
 * limit also bounds how tall a map gets: these render at the content column's
 * full width, so 0.75 keeps even the north-south Pinklao strip inside roughly
 * one screen.
 */
const MIN_ASPECT = 0.75;
const MAX_ASPECT = 2;

/**
 * The visible frame for `places` at `zoom`, plus the integer tile range
 * covering it. `paddingTiles` keeps edge markers off the border: a marker is
 * 28px against 256px tiles, so the default leaves room for one.
 */
export function computeMapView(places: Place[], zoom: number, paddingTiles = 0.1): MapView {
  if (places.length === 0) {
    throw new Error("computeMapView requires at least one place");
  }

  const tiles = places.map((place) => lonLatToTile(place.lng, place.lat, zoom));
  const xs = tiles.map((t) => t.x);
  const ys = tiles.map((t) => t.y);

  let minX = Math.min(...xs) - paddingTiles;
  let maxX = Math.max(...xs) + paddingTiles;
  let minY = Math.min(...ys) - paddingTiles;
  let maxY = Math.max(...ys) + paddingTiles;

  // Grow (never shrink) whichever axis is out of proportion, around the
  // frame's own centre, so the places stay centred.
  const aspect = (maxX - minX) / (maxY - minY);
  if (aspect < MIN_ASPECT) {
    const target = (maxY - minY) * MIN_ASPECT;
    const midX = (minX + maxX) / 2;
    minX = midX - target / 2;
    maxX = midX + target / 2;
  } else if (aspect > MAX_ASPECT) {
    const target = (maxX - minX) / MAX_ASPECT;
    const midY = (minY + maxY) / 2;
    minY = midY - target / 2;
    maxY = midY + target / 2;
  }

  const tileMinX = Math.floor(minX);
  const tileMaxX = Math.max(Math.ceil(maxX) - 1, tileMinX);
  const tileMinY = Math.floor(minY);
  const tileMaxY = Math.max(Math.ceil(maxY) - 1, tileMinY);

  return {
    zoom,
    minX,
    maxX,
    minY,
    maxY,
    cols: maxX - minX,
    rows: maxY - minY,
    tileMinX,
    tileMaxX,
    tileMinY,
    tileMaxY,
    tileCols: tileMaxX - tileMinX + 1,
    tileRows: tileMaxY - tileMinY + 1,
  };
}

export type FitZoomOptions = {
  maxCols?: number;
  maxRows?: number;
  minZoom?: number;
  maxZoom?: number;
};

/**
 * The largest zoom whose tile grid for `places` stays within the given
 * column/row budget. Keeps each map detailed enough to read street names
 * while bounding how many tiles a single map requests. The budget counts
 * tiles fetched (`tileCols`/`tileRows`), not the visible frame, since that
 * is what the zoom costs in requests.
 */
export function fitZoom(places: Place[], options: FitZoomOptions = {}): number {
  const { maxCols = 7, maxRows = 9, minZoom = 12, maxZoom = 17 } = options;
  for (let zoom = maxZoom; zoom > minZoom; zoom--) {
    const view = computeMapView(places, zoom);
    if (view.tileCols <= maxCols && view.tileRows <= maxRows) {
      return zoom;
    }
  }
  return minZoom;
}

/** Percentage position of a place inside the tile-grid pixel space of `view`. */
export function markerPosition(place: Place, view: MapView): { leftPct: number; topPct: number } {
  const { x, y } = lonLatToTile(place.lng, place.lat, view.zoom);
  const leftPct = ((x - view.minX) / view.cols) * 100;
  const topPct = ((y - view.minY) / view.rows) * 100;
  return { leftPct, topPct };
}

// ---------------------------------------------------------------------------
// Marker collision layout. Markers sit at percentage positions derived from
// real coordinates, and several old-town restaurants are genuinely next
// door to each other, so their 24px numbered markers end up overlapping and
// unclickable (WCAG 2.2 SC 2.5.8), or worse, land on top of some *other*
// place's anchor dot and hide it. The fix groups colliding places into
// clusters and lays each cluster out as a rosette — one evenly spaced ring
// of markers around the cluster's own centre — rather than fanning every
// marker out individually, so leader lines fan out in a single readable
// sweep instead of crossing each other at arbitrary angles. This module
// only computes the geometry; see `components/places/PlacesMap.tsx` for the
// rendering.
// ---------------------------------------------------------------------------

/**
 * Reference width, in CSS px, that the collision layout is solved for. The
 * map itself renders fluid — no min-width, no horizontal scroll — so this
 * isn't "the narrowest the map is ever shown"; it's the width whose solved
 * percentages the marker layer is built from. Above `MAP_LAYOUT_WIDTH` the
 * markers are pinned to a fixed px size while the percentage grid they sit
 * on keeps growing, so clearance only improves; below it the whole marker
 * layer scales down with the container (see `fluidPx` in `PlacesMap.tsx`),
 * shrinking every marker and gap by the same factor, so a layout that
 * clears at 360px clears, proportionally, at every narrower width too.
 */
export const MAP_LAYOUT_WIDTH = 360;

/** Marker diameter in CSS px, at `MAP_LAYOUT_WIDTH`. */
export const MARKER_SIZE = 24;

export type MarkerLayout = {
  place: Place;
  /** The place's true location, as a percentage of the map frame. */
  anchor: { leftPct: number; topPct: number };
  /** Where the numbered marker is drawn, as a percentage of the map frame. */
  marker: { leftPct: number; topPct: number };
  /** True when the marker had to be moved off its anchor to clear a neighbour. */
  displaced: boolean;
};

export type LayoutMarkersOptions = {
  /** Width, in CSS px, the layout is solved for. Defaults to MAP_LAYOUT_WIDTH. */
  mapWidth?: number;
  /** Marker diameter in CSS px. Defaults to MARKER_SIZE. */
  markerSize?: number;
  /** Extra clearance between marker edges in CSS px. Defaults to 2. */
  gap?: number;
  /**
   * Space, in CSS px, reserved beyond the marker's own edge for its focus
   * ring: `.focus-halo:focus-visible` (see app/globals.css) draws a 3px
   * outline at a 2px offset, so a focused marker needs 5px of clearance
   * past its own radius or the ring clips against the map frame (WCAG 2.2
   * SC 2.4.11). Defaults to 5.
   */
  focusRing?: number;
  /**
   * Extra clearance, in CSS px, kept between a marker's own edge and any
   * *other* place's anchor dot, so a displaced marker can never sit on top
   * of and hide a neighbour's pointer. The dot itself is drawn with radius
   * 2.5 and a 1px white stroke (see `PlacesMap.tsx`), so this only needs to
   * clear that visible radius, not more. Defaults to 4.
   */
  dotClearance?: number;
};

/**
 * How many rings of candidate positions to try, in the repair pass, before
 * giving up on a marker. Twelve rings is already a fan wider than any map
 * on this site, so hitting the cap means the spot is too dense to resolve,
 * not that the search needs to go further.
 */
const MAX_RING_SEARCH = 12;

/** Whether (x, y) is at least `minSeparation` from every already-placed point on some axis. */
function clearsAll(
  x: number,
  y: number,
  placed: { x: number; y: number }[],
  minSeparation: number
): boolean {
  for (const p of placed) {
    if (Math.abs(x - p.x) < minSeparation && Math.abs(y - p.y) < minSeparation) {
      return false;
    }
  }
  return true;
}

/**
 * Whether (x, y) is far enough from every place's anchor *other than*
 * `ownIndex` to avoid covering that place's dot (C2): a marker is always
 * allowed to sit near its own anchor, since that's the point it's meant to
 * mark.
 */
function clearsAllDots(
  x: number,
  y: number,
  ownIndex: number,
  anchorsPx: { x: number; y: number }[],
  dotRadius: number
): boolean {
  for (let j = 0; j < anchorsPx.length; j++) {
    if (j === ownIndex) continue;
    const dot = anchorsPx[j]!;
    if (Math.hypot(x - dot.x, y - dot.y) < dotRadius) {
      return false;
    }
  }
  return true;
}

/**
 * Ring-relative angle offsets, in units of the ring's angle step, ordered
 * so the candidate closest to the outward direction comes first and ties
 * break clockwise before anticlockwise: 0, +1, -1, +2, -2, ... This is what
 * makes a fan bloom symmetrically away from the direction pointing out of
 * the cluster, and makes the search order (so its output) deterministic.
 */
function ringOffsets(count: number): number[] {
  const offsets: number[] = [0];
  for (let k = 1; offsets.length < count; k++) {
    offsets.push(k);
    if (offsets.length < count) offsets.push(-k);
  }
  return offsets;
}

/** Nudges `v` into `[lo, hi]`, leaving it unchanged when it already fits. */
function clampInto(v: number, lo: number, hi: number): number {
  return Math.min(Math.max(v, lo), hi);
}

/** Normalises an angle, in radians, into `[0, 2*PI)`. */
function normaliseAngle(angle: number): number {
  const twoPi = 2 * Math.PI;
  return ((angle % twoPi) + twoPi) % twoPi;
}

/**
 * Union-find over `0..count - 1`. Used to group anchors into collision
 * clusters by single linkage: union two indices whenever their anchors are
 * closer than `minSeparation`, and every index that ends up sharing a root
 * with another is in the same cluster, transitively, even if the two
 * anchors that triggered the union aren't the pair that's furthest apart.
 */
function makeUnionFind(count: number): {
  find: (i: number) => number;
  union: (a: number, b: number) => void;
} {
  const parent = Array.from({ length: count }, (_, i) => i);
  function find(i: number): number {
    while (parent[i] !== i) {
      parent[i] = parent[parent[i]!]!;
      i = parent[i]!;
    }
    return i;
  }
  function union(a: number, b: number): void {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  }
  return { find, union };
}

/**
 * Resolves marker positions so no two overlap and no marker covers another
 * place's anchor dot, by grouping colliding places into clusters and laying
 * each one out as a rosette. Solved in pixel space at `mapWidth` (see
 * `MAP_LAYOUT_WIDTH` for why a layout solved there holds at every width the
 * map actually renders at).
 *
 * The approach, in three passes:
 *
 * 1. **Cluster.** Two anchors are linked when they're closer than
 *    `minSeparation` on both axes (`clearsAll`'s own test), and clustering
 *    is transitive (single-linkage via union-find), so a chain of
 *    next-door places all end up in one cluster even if the two ends of
 *    the chain are far apart. A cluster of one keeps its marker on its own
 *    (edge-clamped) anchor, exactly as before.
 * 2. **Rosette.** A cluster of n >= 2 places gets one marker per member,
 *    evenly spaced around a circle centred on the cluster's own anchor
 *    centroid. The radius is whichever is larger: enough for neighbouring
 *    ring markers to clear each other, or enough that the ring itself
 *    clears every one of the cluster's own anchor dots. Members take ring
 *    slots in the same angular order as their anchors sit around the
 *    centroid (measured from the direction pointing away from the map's
 *    overall middle, so the rosette opens outward), which is what keeps
 *    the leader lines from crossing: spoke order matches ring order.
 * 3. **Repair.** Rosettes are placed independently of each other and of
 *    the frame, so two rosettes can still collide, or a slot can fall
 *    outside the frame. A final pass walks every place in input order and
 *    re-tests its candidate position against everything placed so far and
 *    every anchor; anything that still fails gets the old fallback — a
 *    ring search fanning out from its own true anchor, capped at
 *    `MAX_RING_SEARCH`, falling back to the clamped anchor rather than
 *    throwing if even that can't find a clear spot.
 *
 * A marker is `displaced: true` whenever it isn't sitting exactly on its
 * true anchor — clamped for the frame edge, moved onto a rosette, or moved
 * again by the repair pass — since that's what tells `PlacesMap` to draw
 * its leader line and anchor dot.
 *
 * Places are walked in input order, and callers pass them pre-sorted by
 * label, so earlier places win contested spots in the repair pass; later
 * places are the ones nudged further if a collision remains. That keeps
 * the numbering legible even where the map gets crowded.
 */
export function layoutMarkers(
  places: Place[],
  view: MapView,
  options: LayoutMarkersOptions = {}
): MarkerLayout[] {
  const {
    mapWidth = MAP_LAYOUT_WIDTH,
    markerSize = MARKER_SIZE,
    gap = 2,
    focusRing = 5,
    dotClearance = 4,
  } = options;
  const mapHeight = (mapWidth * view.rows) / view.cols;
  const minSeparation = markerSize + gap;
  const step = minSeparation;
  const markerRadius = markerSize / 2;
  // Every marker centre, whether displaced or not, has to clear the frame
  // edge by enough for its own focus ring to render unclipped.
  const inset = markerRadius + focusRing;
  // How far a marker centre must stay from any *other* place's anchor so
  // its disc doesn't cover that anchor's dot (C2).
  const dotRadius = markerRadius + dotClearance;

  const anchorsPx = places.map((place) => {
    const { leftPct, topPct } = markerPosition(place, view);
    return { x: (leftPct / 100) * mapWidth, y: (topPct / 100) * mapHeight };
  });

  // The centroid of every anchor, computed once, is the "middle" that
  // clusters (and the repair pass's fallback fan) point away from: it
  // decides which direction counts as outward.
  const allAnchorsCentroid = {
    x: anchorsPx.reduce((sum, p) => sum + p.x, 0) / anchorsPx.length,
    y: anchorsPx.reduce((sum, p) => sum + p.y, 0) / anchorsPx.length,
  };

  const clampedAnchors = anchorsPx.map((anchor) => ({
    x: clampInto(anchor.x, inset, mapWidth - inset),
    y: clampInto(anchor.y, inset, mapHeight - inset),
  }));

  // --- Pass 1: cluster anchors by single-linkage collision. -----------------
  const uf = makeUnionFind(anchorsPx.length);
  for (let i = 0; i < anchorsPx.length; i++) {
    for (let j = i + 1; j < anchorsPx.length; j++) {
      const a = anchorsPx[i]!;
      const b = anchorsPx[j]!;
      if (Math.abs(a.x - b.x) < minSeparation && Math.abs(a.y - b.y) < minSeparation) {
        uf.union(i, j);
      }
    }
  }
  const clusters = new Map<number, number[]>();
  for (let i = 0; i < anchorsPx.length; i++) {
    const root = uf.find(i);
    const members = clusters.get(root);
    if (members) {
      members.push(i);
    } else {
      clusters.set(root, [i]);
    }
  }

  // --- Pass 2: lay out each cluster — singleton on its anchor, n >= 2 as a
  // rosette — into an initial candidate position per place. ------------------
  const initial: { x: number; y: number }[] = new Array(anchorsPx.length);
  for (const members of clusters.values()) {
    if (members.length === 1) {
      const i = members[0]!;
      initial[i] = clampedAnchors[i]!;
      continue;
    }

    const n = members.length;
    const memberAnchors = members.map((i) => anchorsPx[i]!);
    const clusterCentroid = {
      x: memberAnchors.reduce((sum, p) => sum + p.x, 0) / n,
      y: memberAnchors.reduce((sum, p) => sum + p.y, 0) / n,
    };
    const maxAnchorDistance = Math.max(
      ...memberAnchors.map((p) => Math.hypot(p.x - clusterCentroid.x, p.y - clusterCentroid.y))
    );
    // Large enough that adjacent ring slots clear each other, and large
    // enough that the ring itself clears every anchor dot the cluster owns.
    const radius = Math.max(
      minSeparation / (2 * Math.sin(Math.PI / n)),
      maxAnchorDistance + markerRadius + dotClearance
    );
    const outward = Math.atan2(
      clusterCentroid.y - allAnchorsCentroid.y,
      clusterCentroid.x - allAnchorsCentroid.x
    );

    // Slot order follows anchor angular order (both measured from the same
    // outward direction), so spoke i never crosses spoke i+1: the ring and
    // the anchors it points back to are wound the same way. Ties (identical
    // angle) fall back to input order for determinism.
    const ordered = members
      .map((i) => ({
        i,
        angle: normaliseAngle(
          Math.atan2(anchorsPx[i]!.y - clusterCentroid.y, anchorsPx[i]!.x - clusterCentroid.x) -
            outward
        ),
      }))
      .sort((a, b) => a.angle - b.angle || a.i - b.i);

    const angleStep = (2 * Math.PI) / n;
    ordered.forEach(({ i }, slot) => {
      const angle = outward + slot * angleStep;
      initial[i] = {
        x: clusterCentroid.x + radius * Math.cos(angle),
        y: clusterCentroid.y + radius * Math.sin(angle),
      };
    });
  }

  // --- Pass 3: repair, in input order, anything the independent rosette
  // placements above still left in violation of C1/C2/C3. --------------------
  const isValid = (
    x: number,
    y: number,
    ownIndex: number,
    placed: { x: number; y: number }[]
  ): boolean => {
    if (x < inset || x > mapWidth - inset) return false;
    if (y < inset || y > mapHeight - inset) return false;
    if (!clearsAll(x, y, placed, minSeparation)) return false;
    if (!clearsAllDots(x, y, ownIndex, anchorsPx, dotRadius)) return false;
    return true;
  };

  const placed: { x: number; y: number }[] = [];
  const results: MarkerLayout[] = [];

  for (let i = 0; i < places.length; i++) {
    const place = places[i]!;
    const anchor = anchorsPx[i]!;
    const clampedAnchor = clampedAnchors[i]!;

    let markerPx = initial[i]!;

    if (!isValid(markerPx.x, markerPx.y, i, placed)) {
      // The fallback fan still radiates from the true anchor, clamped or
      // not, so a clamped corner marker's leader line still points the
      // right way.
      const outward = Math.atan2(anchor.y - allAnchorsCentroid.y, anchor.x - allAnchorsCentroid.x);
      let found: { x: number; y: number } | null = null;

      for (let ring = 1; ring <= MAX_RING_SEARCH && !found; ring++) {
        const r = ring * step;
        const count = Math.max(8, Math.round((2 * Math.PI * r) / step));
        const angleStep = (2 * Math.PI) / count;

        for (const offset of ringOffsets(count)) {
          const angle = outward + offset * angleStep;
          const x = anchor.x + r * Math.cos(angle);
          const y = anchor.y + r * Math.sin(angle);
          if (isValid(x, y, i, placed)) {
            found = { x, y };
            break;
          }
        }
      }

      // Even a cluster too dense to fully resolve within the ring cap must
      // still render something: fall back to the clamped anchor (never the
      // raw one, which may sit outside the safe inset) rather than throw.
      markerPx = found ?? clampedAnchor;
    }

    placed.push(markerPx);
    results.push({
      place,
      anchor: { leftPct: (anchor.x / mapWidth) * 100, topPct: (anchor.y / mapHeight) * 100 },
      marker: { leftPct: (markerPx.x / mapWidth) * 100, topPct: (markerPx.y / mapHeight) * 100 },
      displaced: markerPx.x !== anchor.x || markerPx.y !== anchor.y,
    });
  }

  return results;
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

/** Every housing place, lettered A, B, C... in list order. */
export function housingPlacesLettered(): NumberedPlace[] {
  return housingPlaces.map((place, i) => ({ place, label: letterLabel(i) }));
}
