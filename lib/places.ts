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
 * Coordinates are approximate (eyeballed to the right street or block, not
 * surveyed) and are only precise enough for the small orientation maps —
 * the "Open in Google Maps" link on each entry is the authoritative
 * location. When editing, keep `id` values stable: list items use them as
 * anchor targets for the map markers.
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
  porridge: { en: "Rice porridge", th: "ข้าวต้ม–โจ๊ก" },
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
        lat: 13.762,
        lng: 100.4943,
        rating: 4.4,
        ratingCount: 4023,
        mapsQuery: "Khun Daeng Vietnamese Noodle Phra Athit",
      },
      {
        id: "nai-soie",
        name: { en: "Nai Soie Beef Noodle", th: "นายโส่ย เนื้อตุ๋น" },
        nameLocal: "นายโส่ย",
        category: cat.noodles,
        area: "oldtown",
        lat: 13.7605,
        lng: 100.4946,
        rating: 3.9,
        ratingCount: 3724,
        mapsQuery: "Nai Soie Beef Noodle Phra Athit Bangkok",
      },
      {
        id: "kua-gai-pa-pien",
        name: { en: "Kuay Teow Kua Gai Aunty Pien", th: "ก๋วยเตี๋ยวคั่วไก่ป้าเพียร" },
        category: cat.noodles,
        area: "oldtown",
        lat: 13.7495,
        lng: 100.4995,
        rating: 4.5,
        ratingCount: 819,
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
        lat: 13.7595,
        lng: 100.4977,
        rating: 4.5,
        ratingCount: 193,
        mapsQuery: "ก๋วยเตี๋ยวเป็ดย่างบางลำพู เจ้าเก่า",
      },
      {
        id: "khanom-jeen-banglamphu",
        name: { en: "Khanom Jeen Banglamphu", th: "ขนมจีนบางลำพู ตรอกตั้งฮั่วเส็ง" },
        nameLocal: "ขนมจีนบางลำพู",
        category: cat.hawker,
        area: "oldtown",
        lat: 13.7601,
        lng: 100.4969,
        rating: 4.4,
        ratingCount: 85,
        mapsQuery: "ขนมจีนบางลำพู ตรอกตั้งฮั่วเส็ง",
      },
      {
        id: "nai-uan-yentafo",
        name: { en: "Nai Uan Yentafo (Sao Chingcha)", th: "นายอ้วนเย็นตาโฟ เสาชิงช้า" },
        nameLocal: "นายอ้วนเย็นตาโฟ",
        category: cat.noodles,
        area: "oldtown",
        lat: 13.752,
        lng: 100.501,
        rating: 4.2,
        ratingCount: 2164,
        mapsQuery: "นายอ้วนเย็นตาโฟ เสาชิงช้า",
      },
      {
        id: "saimai-wonton",
        name: { en: "Saimai Shrimp Wonton Noodle", th: "Saimai Shrimp Wonton Noodle" },
        category: cat.chineseNoodles,
        area: "oldtown",
        lat: 13.7565,
        lng: 100.4853,
        rating: 4.2,
        ratingCount: 392,
        mapsQuery: "Saimai Shrimp Wonton Noodle Bangkok",
      },
      {
        id: "mit-potchana",
        name: { en: "Mit Potchana", th: "มิตรโภชนา" },
        category: cat.noodles,
        area: "oldtown",
        lat: 13.7567,
        lng: 100.4925,
        rating: 4.1,
        ratingCount: 136,
        mapsQuery: "Mit Potchana Pinklao Bangkok",
      },
      {
        id: "uncle-aunt-pork-noodle",
        name: { en: "Uncle & Aunt Pork Noodle", th: "ก๋วยเตี๋ยวหมูลุงกับป้า" },
        category: cat.noodles,
        area: "pinklao",
        lat: 13.764,
        lng: 100.482,
        rating: 4.0,
        ratingCount: 1668,
        mapsQuery: "Uncle and Aunt Pork Noodle Pinklao Bangkok",
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
        lat: 13.7605,
        lng: 100.4998,
        rating: 4.3,
        ratingCount: 1610,
        note: {
          en: "A Banglamphu khao tom institution, best known as a late-night stop.",
          th: "ข้าวต้มเจ้าดังย่านบางลำพู เหมาะเป็นมื้อดึกหลังอ่านหนังสือ",
        },
        mapsQuery: "Khao Tom Bowon Bangkok",
      },
      {
        id: "fat-duck-porridge",
        name: {
          en: "The Fat Duck rice porridge (original)",
          th: "โจ๊กเป็ด The Fat Duck (เจ้าเดิม)",
        },
        category: cat.porridge,
        area: "oldtown",
        lat: 13.752,
        lng: 100.501,
        rating: 4.5,
        ratingCount: 714,
        mapsQuery: "The Fat Duck rice porridge Bangkok",
      },
      {
        id: "khao-dong-moo-daeng",
        name: { en: "Khao Dong Moo Daeng", th: "Khao Dong Moo Daeng" },
        category: cat.thai,
        area: "oldtown",
        lat: 13.7572,
        lng: 100.4852,
        rating: 4.7,
        ratingCount: 1243,
        mapsQuery: "Khao Dong Moo Daeng Bangkok",
      },
      {
        id: "chok-dee-kota",
        name: { en: "Chok Dee Kota", th: "ร้านโชคดี โกตา" },
        nameLocal: "โชคดี โกตา",
        category: cat.chicken,
        area: "oldtown",
        lat: 13.7695,
        lng: 100.4995,
        rating: 4.4,
        ratingCount: 493,
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
        lat: 13.7632,
        lng: 100.4803,
        rating: 3.6,
        ratingCount: 119,
        mapsQuery: "จิ๊นทอดป้าตือ โลตัสมอลล์ แม็คโครจรัญ",
      },
      {
        id: "khao-gaeng-ho-charan",
        name: { en: "Khao Gaeng Ho Charan", th: "ร้านข้าวแกงห่อจรัญ" },
        nameLocal: "ข้าวแกงห่อจรัญ",
        category: cat.restaurant,
        area: "pinklao",
        lat: 13.7738,
        lng: 100.4776,
        rating: 4.0,
        ratingCount: 70,
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
        name: { en: "ELLE ThaPhra Chan", th: "ELLE ท่าพระจันทร์" },
        category: cat.thai,
        area: "oldtown",
        lat: 13.7576,
        lng: 100.4907,
        rating: 4.1,
        ratingCount: 142,
        mapsQuery: "ELLE ThaPhra Chan Restaurant",
      },
      {
        id: "khun-ek",
        name: { en: "Khun Ek", th: "Khun Ek" },
        category: cat.restaurant,
        area: "oldtown",
        lat: 13.758,
        lng: 100.4905,
        rating: 4.4,
        ratingCount: 110,
        mapsQuery: "Khun Ek restaurant Tha Prachan Bangkok",
      },
      {
        id: "new-yong-hua",
        name: { en: "New Yong Hua Phochana", th: "New Yong Hua Phochana" },
        category: cat.restaurant,
        area: "oldtown",
        lat: 13.7568,
        lng: 100.4915,
        rating: 4.5,
        ratingCount: 135,
        mapsQuery: "New Yong Hua Phochana Bangkok",
      },
      {
        id: "watchara-phochana",
        name: { en: "Watchara Phochana", th: "วัชระโภชนา" },
        category: cat.thai,
        area: "pinklao",
        lat: 13.7595,
        lng: 100.469,
        rating: 4.3,
        ratingCount: 1311,
        mapsQuery: "Watchara Phochana Bangkok",
      },
      {
        id: "supanniga",
        name: { en: "Supanniga Eating Room Tha Tien", th: "สุพรรณิการ์ ท่าเตียน" },
        nameLocal: "สุพรรณิการ์",
        category: cat.thai,
        area: "oldtown",
        lat: 13.745,
        lng: 100.4905,
        rating: 4.5,
        ratingCount: 2803,
        note: {
          en: "Isan–Trat family recipes with a river view; good for a treat-yourself dinner.",
          th: "ตำรับอีสาน–ตราด วิวแม่น้ำ เหมาะมื้อพิเศษให้รางวัลตัวเอง",
        },
        mapsQuery: "Supanniga Eating Room Tha Tien",
      },
      {
        id: "mit-ko-yuan",
        name: { en: "Mit Ko Yuan", th: "มิตรโกหย่วน" },
        nameLocal: "มิตรโกหย่วน",
        category: cat.thai,
        area: "oldtown",
        lat: 13.7525,
        lng: 100.501,
        rating: 4.4,
        ratingCount: 1255,
        mapsQuery: "Mit Ko Yuan Restaurant Bangkok",
      },
      {
        id: "ban-wannakovit",
        name: { en: "Ban Wannakovit", th: "บ้านวรรณโกวิท" },
        category: cat.thai,
        area: "oldtown",
        lat: 13.7565,
        lng: 100.4997,
        rating: 4.3,
        ratingCount: 269,
        mapsQuery: "Ban Wannakovit Bangkok",
      },
      {
        id: "chuan-aroy",
        name: { en: "Chuan Aroy Bistro", th: "ชวนอร่อย บิสโทร" },
        category: cat.thai,
        area: "oldtown",
        lat: 13.755,
        lng: 100.4865,
        rating: 3.8,
        ratingCount: 342,
        mapsQuery: "Chuan Aroy Bistro Bangkok",
      },
      {
        id: "yellow-curry-studio",
        name: { en: "Yellow Curry Studio", th: "แกงเหลืองสตูดิโอ" },
        nameLocal: "แกงเหลืองสตูดิโอ",
        category: cat.restaurant,
        area: "oldtown",
        lat: 13.746,
        lng: 100.4995,
        rating: 4.9,
        ratingCount: 110,
        mapsQuery: "Yellow Curry Studio แกงเหลืองสตูดิโอ",
      },
      {
        id: "yong-seng-lee",
        name: { en: "Yong Seng Lee", th: "Yong Seng Lee" },
        category: cat.restaurant,
        area: "oldtown",
        lat: 13.7495,
        lng: 100.4985,
        rating: 4.9,
        ratingCount: 666,
        mapsQuery: "Yong Seng Lee restaurant Bangkok",
      },
      {
        id: "grandmas",
        name: { en: "Grandma's (Thai–Portuguese home food)", th: "Grandma's อาหารไทย–โปรตุเกส" },
        category: cat.restaurant,
        area: "oldtown",
        lat: 13.7395,
        lng: 100.488,
        rating: 4.9,
        ratingCount: 116,
        note: {
          en: "Home cooking from the Kudi Chin Thai–Portuguese community across the river.",
          th: "อาหารบ้าน ๆ ตำรับชุมชนไทย–โปรตุเกสกุฎีจีน ฝั่งธนฯ",
        },
        mapsQuery: "Grandma's Thai Portuguese home food Bangkok",
      },
      {
        id: "s-laab-ped",
        name: { en: "S. Laab Ped Yasothon", th: "ส.ลาบเป็ดยโสธร" },
        nameLocal: "ส.ลาบเป็ด",
        category: cat.restaurant,
        area: "pinklao",
        lat: 13.766,
        lng: 100.48,
        rating: 4.5,
        ratingCount: 87,
        mapsQuery: "S Laab Ped Yasothon Pinklao",
      },
      {
        id: "rod-dee-ded",
        name: { en: "Rod Dee Ded Pinklao", th: "รสดีเด็ด ปิ่นเกล้า" },
        nameLocal: "รสดีเด็ด",
        category: cat.restaurant,
        area: "pinklao",
        lat: 13.7658,
        lng: 100.4843,
        rating: 4.0,
        ratingCount: 201,
        mapsQuery: "Rod Dee Ded Pinklao",
      },
    ],
  },
  {
    id: "chinese",
    title: { en: "Chinese and dim sum", th: "อาหารจีนและติ่มซำ" },
    places: [
      {
        id: "dim-sum-zai",
        name: { en: "Dim Sum Zai", th: "Dim Sum Zai" },
        category: cat.dimSum,
        area: "oldtown",
        lat: 13.753,
        lng: 100.512,
        rating: 4.8,
        ratingCount: 322,
        mapsQuery: "Dim sum zai Wang Lang Bangkok",
      },
      {
        id: "nan-fah",
        name: { en: "Nan Fah", th: "น่านฟ้า" },
        category: cat.chinese,
        area: "oldtown",
        lat: 13.7532,
        lng: 100.5006,
        rating: 4.4,
        ratingCount: 209,
        mapsQuery: "Nan Fah restaurant Bangkok",
      },
      {
        id: "jade-garden",
        name: { en: "Jade Garden", th: "Jade Garden" },
        category: cat.chinese,
        area: "pinklao",
        lat: 13.769,
        lng: 100.4855,
        rating: 4.3,
        ratingCount: 2176,
        mapsQuery: "Jade Garden restaurant Pinklao Bangkok",
      },
    ],
  },
  {
    id: "korean",
    title: { en: "Korean corner", th: "มุมอาหารเกาหลี" },
    places: [
      {
        id: "dong-dae-moon",
        name: { en: "Dong Dae Moon", th: "Dong Dae Moon" },
        category: cat.korean,
        area: "oldtown",
        lat: 13.7593,
        lng: 100.4972,
        rating: 4.2,
        ratingCount: 713,
        mapsQuery: "Dong Dae Moon Restaurant Pinklao",
      },
      {
        id: "hotpokki",
        name: { en: "Hotpokki", th: "Hotpokki 핫뽀끼" },
        category: cat.restaurant,
        area: "pinklao",
        lat: 13.7785,
        lng: 100.4735,
        rating: 4.6,
        ratingCount: 217,
        mapsQuery: "Hotpokki Wang Lang Bangkok",
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
        lat: 13.7455,
        lng: 100.501,
        rating: 4.3,
        ratingCount: 824,
        mapsQuery: "Tony's North Indian restaurant Banglamphu Bangkok",
      },
      {
        id: "indian-kebab-curries",
        name: { en: "Indian Kebab and Curries", th: "Indian Kebab and Curries" },
        category: cat.northIndian,
        area: "oldtown",
        lat: 13.7596,
        lng: 100.4971,
        rating: 4.6,
        ratingCount: 591,
        mapsQuery: "Indian Kebab and Curries Bangkok",
      },
      {
        id: "punjab-sweets",
        name: { en: "Punjab Sweets", th: "Punjab Sweets พาหุรัด" },
        category: cat.indianSweets,
        area: "oldtown",
        lat: 13.746,
        lng: 100.4995,
        note: {
          en: "Indian sweets in Phahurat, Bangkok's Little India.",
          th: "ขนมอินเดียย่านพาหุรัด ลิตเติ้ลอินเดียของกรุงเทพฯ",
        },
        rating: 4.4,
        ratingCount: 526,
        mapsQuery: "Punjab Sweets Phahurat Bangkok",
      },
      {
        id: "aheesah-roddee",
        name: { en: "Aheesah Roddee Halal", th: "Aheesah roddee Halal" },
        category: cat.halal,
        area: "oldtown",
        lat: 13.7599,
        lng: 100.4966,
        rating: 4.4,
        ratingCount: 1153,
        mapsQuery: "Aheesah roddee Halal Bangkok",
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
        lat: 13.7605,
        lng: 100.4972,
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
        lat: 13.7444,
        lng: 100.4898,
        rating: 3.6,
        ratingCount: 581,
        mapsQuery: "Medium Rare Tha Tian Bangkok",
      },
      {
        id: "chaluy-steak",
        name: { en: "Chaluy Steak", th: "ฉลุย สเต็ก" },
        nameLocal: "ฉลุย",
        category: cat.steak,
        area: "oldtown",
        lat: 13.7568,
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
        lat: 13.779,
        lng: 100.4718,
        rating: 4.7,
        ratingCount: 153,
        mapsQuery: "สเต็กเจริญพุง สาขาปิ่นเกล้า",
      },
      {
        id: "mcdonalds-pata",
        name: { en: "McDonald's PATA Pinklao", th: "แมคโดนัลด์ พาต้าปิ่นเกล้า" },
        category: cat.restaurant,
        area: "pinklao",
        lat: 13.7655,
        lng: 100.484,
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
        lat: 13.7663,
        lng: 100.4838,
        rating: 4.9,
        ratingCount: 601,
        mapsQuery: "MHEESUK HOTPOT BUFFET Bangkok",
      },
      {
        id: "pinklao-fish-head",
        name: { en: "Pinklao Fish Head Hot Pot", th: "หัวปลาหม้อไฟ ปิ่นเกล้า" },
        category: cat.restaurant,
        area: "pinklao",
        lat: 13.7635,
        lng: 100.4855,
        rating: 4.3,
        ratingCount: 1438,
        mapsQuery: "Pinklao Fish Head Hot Pot",
      },
      {
        id: "kbbq-pinklao",
        name: { en: "KBBQ Pinklao", th: "KBBQ ปิ่นเกล้า" },
        category: cat.buffet,
        area: "pinklao",
        lat: 13.779,
        lng: 100.4715,
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
        lat: 13.7795,
        lng: 100.471,
        rating: 4.7,
        ratingCount: 1279,
        mapsQuery: "ฮ้อน บุฟเฟ่ต์ ปิ่นเกล้า",
      },
      {
        id: "tidmunz",
        name: { en: "Tidmunz Buffet", th: "ติดมันส์ บุฟเฟ่ต์" },
        category: cat.buffet,
        area: "pinklao",
        lat: 13.778,
        lng: 100.4685,
        rating: 4.6,
        ratingCount: 1068,
        mapsQuery: "Tidmunz Buffet Pinklao",
      },
      {
        id: "pookpik-mookata",
        name: { en: "Pookpik Mookata", th: "POOKPIK หมูกระทะ" },
        category: cat.restaurant,
        area: "pinklao",
        lat: 13.7645,
        lng: 100.483,
        rating: 5.0,
        ratingCount: 18,
        mapsQuery: "POOKPIK หมูกระทะ ปิ่นเกล้า",
      },
      {
        id: "barbq-resort",
        name: { en: "Bar B Q Resort Pinklao", th: "BAR B Q RESORT ปิ่นเกล้า" },
        category: cat.buffet,
        area: "pinklao",
        lat: 13.777,
        lng: 100.477,
        rating: 4.5,
        ratingCount: 3036,
        mapsQuery: "BAR B Q RESORT PINKLAO",
      },
      {
        id: "suki-teenoi",
        name: { en: "Suki Teenoi (The Sense Pinklao)", th: "สุกี้ตี๋น้อย เดอะเซ้นส์ ปิ่นเกล้า" },
        nameLocal: "สุกี้ตี๋น้อย",
        category: cat.buffet,
        area: "pinklao",
        lat: 13.777,
        lng: 100.4742,
        rating: 4.3,
        ratingCount: 1326,
        note: {
          en: "Late-night budget suki chain; expect a queue at peak times.",
          th: "สุกี้ราคานักศึกษาเปิดถึงดึก ช่วงพีคคิวยาว",
        },
        mapsQuery: "Suki Teenoi The Sense Pinklao",
      },
      {
        id: "rimnam-bbq",
        name: { en: "Rimnam BBQ Buffet Pinklao", th: "หมูกระทะริมน้ำ ปิ่นเกล้า" },
        category: cat.barbecue,
        area: "pinklao",
        lat: 13.7625,
        lng: 100.486,
        rating: 3.9,
        ratingCount: 2025,
        mapsQuery: "Rimnam BBQ Buffet Pin Klao",
      },
      {
        id: "malahub",
        name: { en: "Malahub (Bang Yi Khan)", th: "หมาล่าฮับ บางยี่ขัน" },
        nameLocal: "หมาล่าฮับ",
        category: cat.restaurant,
        area: "pinklao",
        lat: 13.7735,
        lng: 100.478,
        rating: 4.9,
        ratingCount: 469,
        note: {
          en: "Pay-by-weight mala skewers.",
          th: "หมาล่าทั่งแบบชั่งน้ำหนัก",
        },
        mapsQuery: "MALAHUB หมาล่าฮับ บางยี่ขัน",
      },
      {
        id: "yija-suki-mala",
        name: { en: "Yija Suki Mala (Pinklao)", th: "อี้จาสุกี้หม่าล่า สาขาปิ่นเกล้า" },
        nameLocal: "อี้จา",
        category: cat.restaurant,
        area: "pinklao",
        lat: 13.778,
        lng: 100.4775,
        rating: 3.5,
        ratingCount: 98,
        mapsQuery: "อี้จาสุกี้หม่าล่า สาขาปิ่นเกล้า",
      },
      {
        id: "lucky-bbq",
        name: { en: "Lucky BBQ (Lotus's Mall)", th: "Lucky BBQ โลตัสมอลล์" },
        category: cat.restaurant,
        area: "pinklao",
        lat: 13.763,
        lng: 100.48,
        rating: 4.3,
        ratingCount: 96,
        mapsQuery: "Lucky BBQ Lotus Mall Charansanitwong",
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
        lat: 13.7469,
        lng: 100.5007,
        rating: 4.5,
        ratingCount: 2243,
        note: {
          en: "Old-school Thai–Chinese breakfast house on Charoen Krung, famous for eggs and toast.",
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
        lat: 13.7541,
        lng: 100.5012,
        rating: 4.4,
        ratingCount: 6229,
        note: {
          en: "Toast-and-fresh-milk institution on Dinso Road — a classic after-class stop.",
          th: "ร้านขนมปังปิ้ง–นมสดในตำนานบนถนนดินสอ เหมาะแวะหลังเลิกเรียน",
        },
        mapsQuery: "Mont Nom Sod Dinso Road Bangkok",
      },
      {
        id: "after-sunrise",
        name: { en: "After Sunrise", th: "After Sunrise" },
        category: cat.bakery,
        area: "oldtown",
        lat: 13.7445,
        lng: 100.4907,
        rating: 4.9,
        ratingCount: 462,
        mapsQuery: "After Sunrise bakery Bangkok",
      },
      {
        id: "ghee-gelato",
        name: { en: "Ghee Gelato House", th: "GHEE GELATO HOUSE" },
        category: cat.iceCream,
        area: "oldtown",
        lat: 13.7448,
        lng: 100.4903,
        rating: 4.8,
        ratingCount: 336,
        mapsQuery: "GHEE GELATO HOUSE Bangkok",
      },
      {
        id: "hia-mak-tofu",
        name: { en: "Hia Mak Tofu Pudding & Grass Jelly", th: "Hia Mak เต้าฮวย–เฉาก๊วย" },
        category: cat.hawker,
        area: "oldtown",
        lat: 13.7447,
        lng: 100.49,
        rating: 4.8,
        ratingCount: 244,
        mapsQuery: "Hia Mak Tofu Pudding Grass Jelly Bangkok",
      },
      {
        id: "second-cafe",
        name: { en: "Second Cafe Wanglang", th: "Second Cafe วังหลัง" },
        category: cat.cafe,
        area: "oldtown",
        lat: 13.7555,
        lng: 100.4855,
        rating: 4.6,
        ratingCount: 125,
        mapsQuery: "Second Cafe Wanglang Bangkok",
      },
      {
        id: "chang-khua",
        name: { en: "Chang Khua (Tha Prachan)", th: "ช่างคั่ว สาขาท่าพระจันทร์" },
        nameLocal: "ช่างคั่ว",
        category: cat.coffee,
        area: "oldtown",
        lat: 13.7573,
        lng: 100.491,
        rating: 4.8,
        ratingCount: 220,
        mapsQuery: "ช่างคั่ว สาขาท่าพระจันทร์",
      },
      {
        id: "lua-cafe",
        name: { en: "LUA Café", th: "LUA Café" },
        category: cat.cafe,
        area: "oldtown",
        lat: 13.757,
        lng: 100.4912,
        rating: 4.7,
        ratingCount: 96,
        mapsQuery: "LUA Cafe BKK Bangkok",
      },
      {
        id: "vanillary",
        name: { en: "Vanillary Cafe", th: "Vanillary cafe’" },
        category: cat.coffee,
        area: "oldtown",
        lat: 13.7566,
        lng: 100.4917,
        rating: 5.0,
        ratingCount: 3,
        mapsQuery: "Vanillary cafe Tha Prachan Bangkok",
      },
      {
        id: "inome",
        name: { en: "INOME Japanese Tea", th: "INOME Japanese TEA" },
        category: cat.coffee,
        area: "oldtown",
        lat: 13.7613,
        lng: 100.4938,
        rating: 4.9,
        ratingCount: 135,
        mapsQuery: "INOME Japanese TEA Bangkok",
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
        lat: 13.7595,
        lng: 100.4962,
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
        lat: 13.7563,
        lng: 100.4922,
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
        lat: 13.7562,
        lng: 100.485,
        rating: 4.5,
        ratingCount: 4490,
        note: {
          en: "Street-food and snack paradise across the river — the classic Thammasat lunch run.",
          th: "สวรรค์สตรีทฟู้ดฝั่งธนฯ ตรงข้ามมหาวิทยาลัย ข้ามเรือไปกินมื้อเที่ยงกันประจำ",
        },
        mapsQuery: "Wang Lang Market Bangkok",
      },
      {
        id: "tha-maharaj",
        name: { en: "Tha Maharaj", th: "ท่ามหาราช" },
        nameLocal: "ท่ามหาราช",
        category: cat.mall,
        area: "oldtown",
        lat: 13.7588,
        lng: 100.489,
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
        lat: 13.7776,
        lng: 100.4757,
        rating: 4.5,
        ratingCount: 27137,
        mapsQuery: "Central Pinklao",
      },
      {
        id: "susco-square",
        name: { en: "Susco Square Pinklao", th: "Susco Square ปิ่นเกล้า" },
        category: cat.mall,
        area: "pinklao",
        lat: 13.781,
        lng: 100.465,
        rating: 4.6,
        ratingCount: 124,
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
    lat: 13.7735,
    lng: 100.4745,
    rating: 4.8,
    ratingCount: 18,
    mapsQuery: "กิตติสถาพรอพาร์ทเมนท์",
  },
  {
    id: "baan-arun39",
    name: { en: "Baan Arun39 Siriraj", th: "บ้านอรุณ 39 ศิริราช" },
    category: cat.lodging,
    area: "pinklao",
    lat: 13.766,
    lng: 100.483,
    rating: 4.6,
    ratingCount: 46,
    mapsQuery: "BAAN ARUN39 SIRIRAJ",
  },
  {
    id: "an-apartment",
    name: { en: "A. N. Apartment", th: "A. N. Apartment" },
    category: cat.apartment,
    area: "pinklao",
    lat: 13.7645,
    lng: 100.4835,
    rating: 4.6,
    ratingCount: 49,
    mapsQuery: "A. N. Apartment Siriraj Bangkok",
  },
  {
    id: "rachan-house",
    name: { en: "Rachan House", th: "Rachan house" },
    category: cat.dorm,
    area: "pinklao",
    lat: 13.7735,
    lng: 100.479,
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
    lng: 100.482,
    rating: 4.6,
    ratingCount: 114,
    mapsQuery: "PK Residence Pinklao",
  },
  {
    id: "lumpini-place-rama8",
    name: { en: "Lumpini Place Rama 8", th: "ลุมพินี เพลส พระราม 8" },
    category: cat.condo,
    area: "pinklao",
    lat: 13.7745,
    lng: 100.483,
    rating: 4.4,
    ratingCount: 185,
    mapsQuery: "Lumpini Place Rama 8",
  },
  {
    id: "my-condo-pinklao",
    name: { en: "My Condo Pinklao", th: "มายคอนโด ปิ่นเกล้า" },
    category: cat.condo,
    area: "pinklao",
    lat: 13.782,
    lng: 100.4745,
    rating: 4.2,
    ratingCount: 75,
    mapsQuery: "My Condo Pinklao",
  },
  {
    id: "ideo-mobi-charan",
    name: { en: "Ideo Mobi Charan Interchange", th: "ไอดีโอ โมบิ จรัญ อินเตอร์เชนจ์" },
    category: cat.condo,
    area: "pinklao",
    lat: 13.76,
    lng: 100.4695,
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
    name: { en: "Aspire Pinklao – Arunammarin", th: "แอสปาย ปิ่นเกล้า–อรุณอมรินทร์" },
    category: cat.condo,
    area: "pinklao",
    lat: 13.7655,
    lng: 100.4825,
    rating: 4.3,
    ratingCount: 37,
    mapsQuery: "Aspire Pinklao Arunammarin",
  },
  {
    id: "parkland-charan",
    name: { en: "The Parkland Charan–Pinklao", th: "เดอะ พาร์คแลนด์ จรัญ–ปิ่นเกล้า" },
    category: cat.condo,
    area: "pinklao",
    lat: 13.773,
    lng: 100.4785,
    rating: 4.2,
    ratingCount: 392,
    mapsQuery: "The Parkland Charan-Pinklao",
  },
  {
    id: "life-pinklao",
    name: { en: "Life Pinklao", th: "ไลฟ์ ปิ่นเกล้า" },
    category: cat.condo,
    area: "pinklao",
    lat: 13.7745,
    lng: 100.4775,
    rating: 4.4,
    ratingCount: 170,
    mapsQuery: "Life Pinklao condo",
  },
  {
    id: "lumpini-place-pinklao",
    name: { en: "Lumpini Place Pinklao", th: "ลุมพินี เพลส ปิ่นเกล้า" },
    category: cat.condo,
    area: "pinklao",
    lat: 13.777,
    lng: 100.472,
    rating: 4.4,
    ratingCount: 97,
    mapsQuery: "Lumpini Place Pinklao",
  },
  {
    id: "lumpini-suite-pinklao",
    name: { en: "Lumpini Suite Pinklao", th: "ลุมพินี สวีท ปิ่นเกล้า" },
    category: cat.condo,
    area: "pinklao",
    lat: 13.77,
    lng: 100.48,
    rating: 4.4,
    ratingCount: 97,
    mapsQuery: "Lumpini Suite Pinklao",
  },
  {
    id: "plum-condo-pinklao",
    name: { en: "Plum Condo Pinklao Station", th: "พลัมคอนโด ปิ่นเกล้า สเตชั่น" },
    category: cat.condo,
    area: "pinklao",
    lat: 13.77,
    lng: 100.4805,
    rating: 4.3,
    ratingCount: 154,
    mapsQuery: "Plum Condo Pinklao Station",
  },
  {
    id: "lumpini-park-pinklao",
    name: { en: "Lumpini Park Pinklao", th: "ลุมพินี พาร์ค ปิ่นเกล้า" },
    category: cat.condo,
    area: "pinklao",
    lat: 13.781,
    lng: 100.4715,
    rating: 4.4,
    ratingCount: 438,
    mapsQuery: "Lumpini Park Pinklao",
  },
  {
    id: "trust-residence",
    name: { en: "The Trust Residence Pinklao", th: "เดอะ ทรัสต์ เรสซิเด้นซ์ ปิ่นเกล้า" },
    category: cat.apartment,
    area: "pinklao",
    lat: 13.7745,
    lng: 100.473,
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

export type FitZoomOptions = {
  maxCols?: number;
  maxRows?: number;
  minZoom?: number;
  maxZoom?: number;
};

/**
 * The largest zoom whose tile grid for `places` stays within the given
 * column/row budget. Keeps each map detailed enough to read street names
 * while bounding how many tiles a single map requests.
 */
export function fitZoom(places: Place[], options: FitZoomOptions = {}): number {
  const { maxCols = 5, maxRows = 6, minZoom = 12, maxZoom = 17 } = options;
  for (let zoom = maxZoom; zoom > minZoom; zoom--) {
    const view = computeMapView(places, zoom);
    if (view.cols <= maxCols && view.rows <= maxRows) {
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
