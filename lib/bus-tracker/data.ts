/**
 * GENERATED FILE — do not edit by hand.
 *
 * Baked static structure for the live public-bus tracker: which lines call at
 * each tracked stop, where each goes next, and the terminus. Regenerate with
 * `node scripts/generate-bus-data.mjs` then `npm run format`. Live arrival
 * times are fetched at runtime through `/api/bus-eta`, not stored here.
 *
 * Source: Namtang open data (https://namtang-api.otp.go.th/front).
 */
import type { BusStopData } from "@/lib/bus-tracker/types";

export const busTrackerGeneratedAt = "2026-08-28";

export const busTrackerData: BusStopData[] = [
  {
    stopId: 2373,
    name: {
      en: "Sanamluang (Opposite Thammasart U.)",
      th: "สนามหลวง (ตรงข้ามม.ธรรมศาสตร์)",
    },
    lines: [
      {
        patternKey: "1|Sanam Luang",
        routeName: "1",
        routeLongName: {
          en: "Thanon Tok - Tha Tian",
          th: "ถนนตก - ท่าเตียน",
        },
        color: "063970",
        headsign: {
          en: "Sanam Luang",
          th: "สนามหลวง",
        },
        downstream: [
          {
            en: "Opposite Tha Chang Pier",
            th: "ตรงข้ามท่าช้าง",
          },
        ],
        terminus: {
          en: "Opposite Tha Tian",
          th: "ตรงข้ามท่าเตียน",
        },
        operator: {
          en: "Thai Smile Bus",
          th: "ไทย สมายล์ บัส",
        },
        fare: {
          en: "Price 15.00 - 20.00 ฿",
          th: "ราคา 15.00 - 20.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: true,
      },
      {
        patternKey: "1-9E|Thammasat Rangsit",
        routeName: "1-9E",
        routeLongName: {
          en: "Thammasat (Rangsit) - Sanam Luang",
          th: "มธ.ศูนย์รังสิต - สนามหลวง (ทางด่วน)",
        },
        color: "063970",
        headsign: {
          en: "Thammasat Rangsit",
          th: "ม.ธรรมศาสตร์ (ศูนย์รังสิต)",
        },
        downstream: [
          {
            en: "Sanamluang Stop.1",
            th: "สนามหลวง (ตรงข้ามศาลฎีกา)",
          },
          {
            en: "Phaniang Road",
            th: "ถนนพะเนียง",
          },
          {
            en: "Opp TU Dome Plaza",
            th: "ตรงข้ามทียูโดม",
          },
        ],
        terminus: {
          en: "Thailand Science Park (TSP)",
          th: "ก่อนอุทยานวิทยาศาสตร์ประเทศไทย",
        },
        operator: {
          en: "Thai Smile Bus",
          th: "ไทย สมายล์ บัส",
        },
        fare: {
          en: "Price 15.00 - 25.00 ฿",
          th: "ราคา 15.00 - 25.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: true,
      },
      {
        patternKey: "2-4 (30)|Wat Paknam Nonthaburi",
        routeName: "2-4 (30)",
        routeLongName: {
          en: "Wat Paknam Nonthaburi - Southern Bus (Pinklao)",
          th: "วัดปากน้ำนนทบุรี - สายใต้ (ปิ่นเกล้า)",
        },
        color: "063970",
        headsign: {
          en: "Wat Paknam Nonthaburi",
          th: "วัดปากน้ำ นนทบุรี",
        },
        downstream: [
          {
            en: "Sanamluang Stop.2",
            th: "สนามหลวง(ตรงข้ามศาลฎีกา) ป้ายที่2",
          },
          {
            en: "Opposite Wat Bowon Niwet",
            th: "ตรงข้ามวัดบวรนิเวศฯ",
          },
          {
            en: "Opposite Si Sao Thewet Market",
            th: "ตรงข้ามตลาดสี่เสาเทเวศน์",
          },
          {
            en: "Soi Suan Oi",
            th: "ซอยสวนอ้อย",
          },
        ],
        terminus: {
          en: "Opposite Satrinonthaburi School",
          th: "ตรงข้ามโรงเรียนสตรีนนทบุรี",
        },
        operator: {
          en: "Thai Smile Bus",
          th: "ไทย สมายล์ บัส",
        },
        fare: {
          en: "Price 15.00 - 25.00 ฿",
          th: "ราคา 15.00 - 25.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: true,
      },
      {
        patternKey: "2-5 (32)|Wat Pho",
        routeName: "2-5 (32)",
        routeLongName: {
          en: "Pak Kret - Wat Pho",
          th: "ปากเกร็ด - วัดโพธิ์",
        },
        color: "ff0000",
        headsign: {
          en: "Wat Pho",
          th: "วัดโพธิ์",
        },
        downstream: [],
        terminus: {
          en: "Wat Pho",
          th: "วัดโพธิ์",
        },
        operator: {
          en: "Bangkok Mass Transit Authority",
          th: "องค์การขนส่งมวลชนกรุงเทพ (ขสมก.)",
        },
        fare: {
          en: "Price 8.00 ฿",
          th: "ราคา 8.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: false,
        wheelchairAccessible: false,
      },
      {
        patternKey: "2-9 (53L)|Thewet",
        routeName: "2-9 (53L)",
        routeLongName: {
          en: "Sanamluang - Thewet",
          th: "สนามหลวง - เทเวศร์  (วนซ้าย)",
        },
        color: "ff0000",
        headsign: {
          en: "Thewet",
          th: "เทเวศร์",
        },
        downstream: [
          {
            en: "Wat Pho (Maharat side)",
            th: "วัดโพธิ์ (ฝั่งมหาราช)",
          },
          {
            en: "S. A. B. Intersection",
            th: "แยกเอสเอบี",
          },
          {
            en: "Before Noppawong Intersection",
            th: "ก่อนแยกนพวงศ์",
          },
          {
            en: "NT Krungkasem",
            th: "เอ็นที กรุงเกษม",
          },
        ],
        terminus: {
          en: "Sanam Luang Bus Terminal",
          th: "ท่ารถสนามหลวง (อนุสาวรีย์ทหารอาสา)",
        },
        operator: {
          en: "Bangkok Mass Transit Authority",
          th: "องค์การขนส่งมวลชนกรุงเทพ (ขสมก.)",
        },
        fare: {
          en: "Price 8.00 ฿",
          th: "ราคา 8.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: false,
        wheelchairAccessible: false,
      },
      {
        patternKey: "2-11 (64)|Ministry of Public Health",
        routeName: "2-11 (64)",
        routeLongName: {
          en: "Ministry of Public Health - Sanamluang",
          th: "กระทรวงสาธารณสุข - สนามหลวง",
        },
        color: "063970",
        headsign: {
          en: "Ministry of Public Health",
          th: "กระทรวงสาธารณสุข",
        },
        downstream: [
          {
            en: "Sanamluang Stop.1",
            th: "สนามหลวง (ตรงข้ามศาลฎีกา)",
          },
          {
            en: "Central Pinklao",
            th: "เซ็นทรัลปิ่นเกล้า",
          },
          {
            en: "Sirindhorn Anthropology Centre",
            th: "ศูนย์มานุษยวิทยาสิรินธร",
          },
          {
            en: "Bangkruai-Chong Thanom Road",
            th: "ถนนบางกรวย-จงถนอม",
          },
        ],
        terminus: {
          en: "Opposite Ministry of Public Health",
          th: "ตรงข้ามกระทรวงสาธารณสุข",
        },
        operator: {
          en: "Thai Smile Bus",
          th: "ไทย สมายล์ บัส",
        },
        fare: {
          en: "Price 15.00 - 25.00 ฿",
          th: "ราคา 15.00 - 25.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: true,
      },
      {
        patternKey: "2-37 (3)|Klongsan",
        routeName: "2-37 (3)",
        routeLongName: {
          en: "Klongsan - Krung Thep Aphiwat",
          th: "คลองสาน - กรุงเทพอถิวัฒน์",
        },
        color: "ff0000",
        headsign: {
          en: "Klongsan",
          th: "คลองสาน",
        },
        downstream: [
          {
            en: "Pha Phuttha Yodfa Bridge",
            th: "สะพานพุทธ",
          },
          {
            en: "Soi Latya 8",
            th: "ซอยลาดหญ้า 8",
          },
          {
            en: "BTS Wongwianyai (Exit 3)",
            th: "BTS วงเวียนใหญ่ (ทางออก3)",
          },
        ],
        terminus: {
          en: "BTS Krungthonburi (Exit 3)",
          th: "BTS กรุงธนบุรี (ทางออก3)",
        },
        operator: {
          en: "Bangkok Mass Transit Authority",
          th: "องค์การขนส่งมวลชนกรุงเทพ (ขสมก.)",
        },
        fare: {
          en: "Price 8.00 ฿",
          th: "ราคา 8.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 00:00 - 23:00",
          th: "ให้บริการ 00:00 - 23:00",
        },
        headway: {
          en: "Departs every 15 - 120 minutes (approximately)",
          th: "ออกทุก 15 - 120 นาที (โดยประมาณ)",
        },
        airConditioned: false,
        wheelchairAccessible: false,
      },
      {
        patternKey: "3-35 (1)|Rama III Road",
        routeName: "3-35 (1)",
        routeLongName: {
          en: "Central Rama III - Sanam Luang",
          th: "เซ็นทรัลพระราม 3 - สนามหลวง",
        },
        color: "063970",
        headsign: {
          en: "Rama III Road",
          th: "พระราม 3",
        },
        downstream: [
          {
            en: "Wat Pho (Maharat side)",
            th: "วัดโพธิ์ (ฝั่งมหาราช)",
          },
          {
            en: "S. A. B. Intersection",
            th: "แยกเอสเอบี",
          },
          {
            en: "Hua Lamphong Intersection",
            th: "แยกหัวลำโพง",
          },
          {
            en: "Bangrak Police Station",
            th: "สน.บางรัก",
          },
        ],
        terminus: {
          en: "Central Rama 3",
          th: "เซ็นทรัลพระราม 3",
        },
        operator: {
          en: "Thai Smile Bus",
          th: "ไทย สมายล์ บัส",
        },
        fare: {
          en: "Price 15.00 - 25.00 ฿",
          th: "ราคา 15.00 - 25.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: true,
      },
      {
        patternKey: "4-2 (15)|BRT Ratchapruek L",
        routeName: "4-2 (15)",
        routeLongName: {
          en: "BRT Ratchapruek - Bang Lamphu - Siam",
          th: "วงกลมBRT ราชพฤกษ์ - บางลำพู - สยาม (วนซ้าย)",
        },
        color: "ff0000",
        headsign: {
          en: "BRT Ratchapruek L",
          th: "สถานีรถไฟฟ้าราชพฤกษ์ วนซ้าย",
        },
        downstream: [
          {
            en: "Wat Pho (Maharat side)",
            th: "วัดโพธิ์ (ฝั่งมหาราช)",
          },
          {
            en: "Wat Chaichana Songkhram (Wat Tuek)",
            th: "วัดตึก",
          },
          {
            en: "Soi Somdet Phra Chao Taksin 13",
            th: "ซอยสมเด็จพระเจ้าตากสิน 13",
          },
          {
            en: "Soi Ratchadaphisek 5",
            th: "ซอยรัชดาภิเษก 5",
          },
        ],
        terminus: {
          en: "BRT Ratchapruek",
          th: "BRT ราชพฤกษ์",
        },
        operator: {
          en: "Bangkok Mass Transit Authority",
          th: "องค์การขนส่งมวลชนกรุงเทพ (ขสมก.)",
        },
        fare: {
          en: "Price 8.00 ฿",
          th: "ราคา 8.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: false,
        wheelchairAccessible: false,
      },
      {
        patternKey: "4-11 (43)|Thai Smile Bus Ekkachai",
        routeName: "4-11 (43)",
        routeLongName: {
          en: "Ekachai - Thewet",
          th: "เอกชัย - เทเวศร์",
        },
        color: "063970",
        headsign: {
          en: "Thai Smile Bus Ekkachai",
          th: "อู่ไทยสมายล์บัส เอกชัย",
        },
        downstream: [
          {
            en: "Wat Pho (Maharat side)",
            th: "วัดโพธิ์ (ฝั่งมหาราช)",
          },
          {
            en: "Wat Chaichana Songkhram (Wat Tuek)",
            th: "วัดตึก",
          },
          {
            en: "Somdet Chao Phraya Hospital (Opposite)",
            th: "ตรงข้าม รพ.สมเด็จเจ้าพระยา",
          },
          {
            en: "Bangkok Latya Cooperative",
            th: "สหกรณ์กรุงเทพ ลาดหญ้า",
          },
        ],
        terminus: {
          en: "Thai Smile Bus Ekkachai",
          th: "อู่ไทยสมายล์บัส เอกชัย",
        },
        operator: {
          en: "Thai Smile Bus",
          th: "ไทย สมายล์ บัส",
        },
        fare: {
          en: "Price 15.00 - 25.00 ฿",
          th: "ราคา 15.00 - 25.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: true,
      },
      {
        patternKey: "4-15 (82)|Phra Pradaeng",
        routeName: "4-15 (82)",
        routeLongName: {
          en: "Phra Pradaeng - บางลัมซู",
          th: "ท่าน้ำพระประแดง - บางลำพู",
        },
        color: "063970",
        headsign: {
          en: "Phra Pradaeng",
          th: "ท่าน้ำพระประแดง",
        },
        downstream: [
          {
            en: "Wat Pho (Maharat side)",
            th: "วัดโพธิ์ (ฝั่งมหาราช)",
          },
          {
            en: "Suksanari School (Opposite)",
            th: "ตรงข้ามโรงเรียนศึกษานารี",
          },
          {
            en: "Bangkok Latya Cooperative",
            th: "สหกรณ์กรุงเทพ ลาดหญ้า",
          },
          {
            en: "Samre Market",
            th: "ตลาดสำเหร่",
          },
        ],
        terminus: {
          en: "Phra Pradaeng Bus Terminal",
          th: "ท่าน้ำพระประแดง",
        },
        operator: {
          en: "Thai Smile Bus",
          th: "ไทย สมายล์ บัส",
        },
        fare: {
          en: "Price 15.00 - 25.00 ฿",
          th: "ราคา 15.00 - 25.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: true,
      },
      {
        patternKey: "4-43 (80)|Wat Si Nuan Thammawimon",
        routeName: "4-43 (80)",
        routeLongName: {
          en: "Wat Srinualthammawimol - Sanamluang",
          th: "วัดศรีนวลธรรมวิมล - สนามหลวง",
        },
        color: "fe9a2e",
        headsign: {
          en: "Wat Si Nuan Thammawimon",
          th: "วัดศรีนวลธรรมวิมล",
        },
        downstream: [
          {
            en: "Pata Pinklao (Opposite)",
            th: "ตรงข้ามพาต้าปิ่นเกล้า",
          },
          {
            en: "Bangkok Noi District Office",
            th: "สน.บางกอกน้อย",
          },
          {
            en: "Metropolitan Electricity Authority Thon Buri",
            th: "กฟน.ธนบุรี",
          },
          {
            en: "Tha Phra Post Office",
            th: "ไปรษณีย์ท่าพระ",
          },
        ],
        terminus: {
          en: "Wat Srinualthammawimol Bus Terminal (Line 80)",
          th: "ท่ารถวัดศรีนวลธรรมวิมล (สาย 80)",
        },
        operator: {
          en: "Bangkok Mass Transit Authority",
          th: "องค์การขนส่งมวลชนกรุงเทพ (ขสมก.)",
        },
        fare: {
          en: "Price 13.00 - 25.00 ฿",
          th: "ราคา 13.00 - 25.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 00:00 - 23:00",
          th: "ให้บริการ 00:00 - 23:00",
        },
        headway: {
          en: "Departs every 15 - 140 minutes (approximately)",
          th: "ออกทุก 15 - 140 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: false,
      },
      {
        patternKey: "4-45 (81)|Sanam Luang",
        routeName: "4-45 (81)",
        routeLongName: {
          en: "Aom Noi - Sanam Luang",
          th: "อ้อมน้อย - สนามหลวง",
        },
        color: "063970",
        headsign: {
          en: "Sanam Luang",
          th: "สนามหลวง",
        },
        downstream: [],
        terminus: {
          en: "Ratcha Woradit Pier (Opposite)",
          th: "ตรงข้ามท่าราชวรดิษฐ์",
        },
        operator: {
          en: "Thai Smile Bus",
          th: "ไทย สมายล์ บัส",
        },
        fare: {
          en: "Price 15.00 - 25.00 ฿",
          th: "ราคา 15.00 - 25.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: true,
      },
      {
        patternKey: "4-50 (123)|Om Yai",
        routeName: "4-50 (123)",
        routeLongName: {
          en: "Om Yai, Sam Phran - Sanam Luang",
          th: "อ้อมใหญ่ - สนามหลวง",
        },
        color: "063970",
        headsign: {
          en: "Om Yai",
          th: "อ้อมใหญ่",
        },
        downstream: [
          {
            en: "Sanamluang Stop.1",
            th: "สนามหลวง (ตรงข้ามศาลฎีกา)",
          },
          {
            en: "Central Pinklao",
            th: "เซ็นทรัลปิ่นเกล้า",
          },
          {
            en: "Sirindhorn Anthropology Centre",
            th: "ศูนย์มานุษยวิทยาสิรินธร",
          },
          {
            en: "Nantawan Pinklao-Ratchaphruek Village",
            th: "หมู่บ้านนันทวัน ปิ่นเกล้า-ราชพฤกษ์",
          },
        ],
        terminus: {
          en: "Joseph Upatham School (Stop 1)",
          th: "โรงเรียนยอแซฟอุปถัมภ์ (จุดที่ 1)",
        },
        operator: {
          en: "Thai Smile Bus",
          th: "ไทย สมายล์ บัส",
        },
        fare: {
          en: "Price 15.00 - 25.00 ฿",
          th: "ราคา 15.00 - 25.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: true,
      },
      {
        patternKey: "4-51 (124)|Ban Eua Arthorn Salaya",
        routeName: "4-51 (124)",
        routeLongName: {
          en: "Ban Eua Arthorn Salaya  - Sanam Luang",
          th: "บ้านเอื้ออาทรศาลายา - สนามหลวง",
        },
        color: "063970",
        headsign: {
          en: "Ban Eua Arthorn Salaya",
          th: "บ้านเอื้ออาทรศาลายา",
        },
        downstream: [
          {
            en: "Sanamluang Stop.1",
            th: "สนามหลวง (ตรงข้ามศาลฎีกา)",
          },
          {
            en: "Central Pinklao",
            th: "เซ็นทรัลปิ่นเกล้า",
          },
          {
            en: "Sirindhorn Anthropology Centre",
            th: "ศูนย์มานุษยวิทยาสิรินธร",
          },
          {
            en: "Nantawan Pinklao-Ratchaphruek Village",
            th: "หมู่บ้านนันทวัน ปิ่นเกล้า-ราชพฤกษ์",
          },
        ],
        terminus: {
          en: "Thai Smile Bus Salaya",
          th: "อู่ไทยสมายล์บัส ศาลายา",
        },
        operator: {
          en: "Thai Smile Bus",
          th: "ไทย สมายล์ บัส",
        },
        fare: {
          en: "Price 0.00 - 25.00 ฿",
          th: "ราคา 0.00 - 25.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: true,
      },
      {
        patternKey: "91|Setthakit Village",
        routeName: "91",
        routeLongName: {
          en: "Setthakit Village - Sanamluang",
          th: "ม.เศรษฐกิจ (โรงเรียนอัสสัมชัญธนบุรี) - สนามหลวง",
        },
        color: "FE9A2E",
        headsign: {
          en: "Setthakit Village",
          th: "ม.เศรษฐกิจ (โรงเรียนอัสสัมชัญธนบุรี)",
        },
        downstream: [
          {
            en: "Flotilla Naval Transportation Department",
            th: "กองเรือเล็ก",
          },
          {
            en: "Wat Yang Sutharam",
            th: "วัดยางสุทธาราม",
          },
          {
            en: "Wat Poreang",
            th: "วัดโพธิ์เรียง",
          },
          {
            en: "Opposite Bangkok Thonburi Vocational College",
            th: "ตรงข้ามวิทยาลัยอาชีวศึกษากรุงเทพธนบุรี",
          },
        ],
        terminus: {
          en: "Muban Setthakit Bus Terminal (Line 91)",
          th: "ท่ารถหมู่บ้านเศรษฐกิจ (สาย 91)",
        },
        operator: {
          en: "Bangkok Mass Transit Authority",
          th: "องค์การขนส่งมวลชนกรุงเทพ (ขสมก.)",
        },
        fare: {
          en: "Price 11.00 - 20.00 ฿",
          th: "ราคา 11.00 - 20.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: false,
      },
      {
        patternKey: "91ก|Sanamluang 2",
        routeName: "91ก",
        routeLongName: {
          en: "Sanamluang - Sanamluang 2",
          th: "สนามหลวง  - สนามหลวง 2",
        },
        color: "ff0000",
        headsign: {
          en: "Sanamluang 2",
          th: "สนามหลวง 2",
        },
        downstream: [
          {
            en: "Soi Arun Amarin Road 28",
            th: "ซอยอรุณอัมรินทร์ 28",
          },
          {
            en: "Opposite Prannok Plaza",
            th: "ตรงข้ามพรานนกพลาซ่า",
          },
          {
            en: "Metropolitan Electricity Authority Thon Buri",
            th: "กฟน.ธนบุรี",
          },
          {
            en: "Tha Phra Post Office",
            th: "ไปรษณีย์ท่าพระ",
          },
        ],
        terminus: {
          en: "Thonburi Market Sanam Luang 2",
          th: "ตลาดธนบุรี สนามหลวง 2",
        },
        operator: {
          en: "Bangkok Mass Transit Authority",
          th: "องค์การขนส่งมวลชนกรุงเทพ (ขสมก.)",
        },
        fare: {
          en: "Price 8.00 ฿",
          th: "ราคา 8.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: false,
        wheelchairAccessible: false,
      },
      {
        patternKey: "203|Tha It",
        routeName: "203",
        routeLongName: {
          en: "Tha It - Sanamluang",
          th: "ท่าอิฐ - สนามหลวง",
        },
        color: "ffcc00",
        headsign: {
          en: "Tha It",
          th: "ท่าอิฐ",
        },
        downstream: [
          {
            en: "Sanamluang Stop.1",
            th: "สนามหลวง (ตรงข้ามศาลฎีกา)",
          },
          {
            en: "Opposite Phong Sap Market",
            th: "ตรงข้ามตลาดพงษ์ทรัพย์",
          },
          {
            en: "Opposite Lotus's Charan Sanitwong",
            th: "ตรงข้ามโลตัสจรัญสนิทวงศ์",
          },
          {
            en: "MRT Bang O (Exit 2)",
            th: "MRT บางอ้อ (ทางออก 2)",
          },
        ],
        terminus: {
          en: "Sai Ma Bus Terminal Line 203",
          th: "อู่ไทรม้า (สาย 203)",
        },
        operator: {
          en: "Bangkok Mass Transit Authority",
          th: "องค์การขนส่งมวลชนกรุงเทพ (ขสมก.)",
        },
        fare: {
          en: "Price 13.00 ฿",
          th: "ราคา 13.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: false,
      },
    ],
    detail: {
      en: "Sanamluang ([Opp.] Thammasart U.)",
      th: "สนามหลวง (ตรงข้าม ม.ธรรมศาสตร์)",
    },
  },
  {
    stopId: 1573,
    name: {
      en: "Thammasat University",
      th: "ม.ธรรมศาสตร์",
    },
    lines: [
      {
        patternKey: "2-5 (32)|Pak Kret",
        routeName: "2-5 (32)",
        routeLongName: {
          en: "Pak Kret - Wat Pho",
          th: "ปากเกร็ด - วัดโพธิ์",
        },
        color: "ff0000",
        headsign: {
          en: "Pak Kret",
          th: "ปากเกร็ด",
        },
        downstream: [
          {
            en: "Opposite Wat Bowon Niwet",
            th: "ตรงข้ามวัดบวรนิเวศฯ",
          },
          {
            en: "Opposite Si Sao Thewet Market",
            th: "ตรงข้ามตลาดสี่เสาเทเวศน์",
          },
          {
            en: "Soi Suan Oi",
            th: "ซอยสวนอ้อย",
          },
          {
            en: "Makro Samsen",
            th: "แม็คโครสามเสน",
          },
        ],
        terminus: {
          en: "Pakkret Pier",
          th: "ท่าเรือปากเกร็ด",
        },
        operator: {
          en: "Bangkok Mass Transit Authority",
          th: "องค์การขนส่งมวลชนกรุงเทพ (ขสมก.)",
        },
        fare: {
          en: "Price 8.00 ฿",
          th: "ราคา 8.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: false,
        wheelchairAccessible: false,
      },
      {
        patternKey: "2-9 (53R)|Sanamluang",
        routeName: "2-9 (53R)",
        routeLongName: {
          en: "Thewet - Sanamluang",
          th: "เทเวศร์ - สนามหลวง (วนขวา)",
        },
        color: "ff0000",
        headsign: {
          en: "Sanamluang",
          th: "สนามหลวง",
        },
        downstream: [
          {
            en: "Opposite Wat Bowon Niwet",
            th: "ตรงข้ามวัดบวรนิเวศฯ",
          },
        ],
        terminus: {
          en: "After Thewet Intersection",
          th: "หลังแยกเทเวศร์",
        },
        operator: {
          en: "Bangkok Mass Transit Authority",
          th: "องค์การขนส่งมวลชนกรุงเทพ (ขสมก.)",
        },
        fare: {
          en: "Price 8.00 ฿",
          th: "ราคา 8.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: false,
        wheelchairAccessible: false,
      },
      {
        patternKey: "2-42 (44)|Housing Khlong Chan",
        routeName: "2-42 (44)",
        routeLongName: {
          en: "Housing Khlong Chan - Tha Tien",
          th: "เคหะคลองจั่น - ท่าเตียน",
        },
        color: "063970",
        headsign: {
          en: "Housing Khlong Chan",
          th: "เคหะคลองจั่น",
        },
        downstream: [
          {
            en: "Khaosan Road",
            th: "ถนนข้าวสาร",
          },
          {
            en: "Phaniang Road",
            th: "ถนนพะเนียง",
          },
          {
            en: "Mahidol University (Faculty of Science)",
            th: "ม.มหิดล (คณะวิทยาศาสตร์)",
          },
          {
            en: "Samsen Wittayalai School",
            th: "โรงเรียนสามเสนวิทยาลัย",
          },
        ],
        terminus: {
          en: "Opposite Soi Sri Burapha 21",
          th: "ตรงข้ามซอยศรีบูรพา 21",
        },
        operator: {
          en: "Thai Smile Bus",
          th: "ไทย สมายล์ บัส",
        },
        fare: {
          en: "Price 15.00 - 25.00 ฿",
          th: "ราคา 15.00 - 25.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: true,
      },
      {
        patternKey: "3-41 (47)|Khlong Toey",
        routeName: "3-41 (47)",
        routeLongName: {
          en: "Khlong Toey - Bangkok Metropolitan Land Office",
          th: "ท่าเรือคลองเตย - สนง.ที่ดินกรุงเทพฯ",
        },
        color: "ff0000",
        headsign: {
          en: "Khlong Toey",
          th: "ท่าเรือคลองเตย",
        },
        downstream: [
          {
            en: "The Government Lottery Office",
            th: "กองสลาก",
          },
          {
            en: "Soi Maen Si",
            th: "ซอยแม้นศรี",
          },
          {
            en: "Bangkok Art and Culture Center",
            th: "หอศิลปวัฒนธรรมแห่งกรุงเทพมหานคร",
          },
          {
            en: "Chulalongkorn University (Faculty of Commerce and Accountancy)",
            th: "จุฬาฯ (คณะพาณิชยศาสตร์และการบัญชี)",
          },
        ],
        terminus: {
          en: "Khlong Toei Bus Terminal",
          th: "ท่าเรือคลองเตย",
        },
        operator: {
          en: "Bangkok Mass Transit Authority",
          th: "องค์การขนส่งมวลชนกรุงเทพ (ขสมก.)",
        },
        fare: {
          en: "Price 8.00 ฿",
          th: "ราคา 8.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: false,
        wheelchairAccessible: false,
      },
      {
        patternKey: "4-2 (15)|BRT Ratchapruek R",
        routeName: "4-2 (15)",
        routeLongName: {
          en: "BRT Ratchapruek - Bang Lamphu - Siam",
          th: "วงกลมBRT ราชพฤกษ์ - บางลำพู - สยาม (วนขวา)",
        },
        color: "FE9A2E",
        headsign: {
          en: "BRT Ratchapruek R",
          th: "สถานีรถไฟฟ้าราชพฤกษ์ วนขวา",
        },
        downstream: [
          {
            en: "The Government Lottery Office",
            th: "กองสลาก",
          },
          {
            en: "Soi Maen Si",
            th: "ซอยแม้นศรี",
          },
          {
            en: "Bangkok Art and Culture Center",
            th: "หอศิลปวัฒนธรรมแห่งกรุงเทพมหานคร",
          },
          {
            en: "AUA",
            th: "เอยูเอ",
          },
        ],
        terminus: {
          en: "BRT Ratchapruek",
          th: "BRT ราชพฤกษ์",
        },
        operator: {
          en: "Bangkok Mass Transit Authority",
          th: "องค์การขนส่งมวลชนกรุงเทพ (ขสมก.)",
        },
        fare: {
          en: "Price 13.00 - 25.00 ฿",
          th: "ราคา 13.00 - 25.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: false,
      },
      {
        patternKey: "4-15 (82)|Bang Lamphu",
        routeName: "4-15 (82)",
        routeLongName: {
          en: "Phra Pradaeng - บางลัมซู",
          th: "ท่าน้ำพระประแดง - บางลำพู",
        },
        color: "063970",
        headsign: {
          en: "Bang Lamphu",
          th: "บางลำพู",
        },
        downstream: [
          {
            en: "Khaosan Road",
            th: "ถนนข้าวสาร",
          },
        ],
        terminus: {
          en: "Wat Bowonniwet (Bowonniwet side)",
          th: "วัดบวรนิเวศฯ (ฝั่งบวรนิเวศน์)",
        },
        operator: {
          en: "Thai Smile Bus",
          th: "ไทย สมายล์ บัส",
        },
        fare: {
          en: "Price 15.00 - 25.00 ฿",
          th: "ราคา 15.00 - 25.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: true,
      },
      {
        patternKey: "ต.4|Hunsa Village",
        routeName: "ต.4",
        routeLongName: {
          en: "Phra Pin-klao Bridge - Hunsa Village",
          th: "เชิงสะพานสมเด็จพระปิ่นเกล้า - หมู่บ้านหรรษา",
        },
        color: "FF00FF",
        headsign: {
          en: "Hunsa Village",
          th: "หมู่บ้านหรรษา",
        },
        downstream: [
          {
            en: "Soi Borommaratchachonnani 5",
            th: "ซอยบรมราชชนนี 5",
          },
          {
            en: "The Trust Residence Pinklao",
            th: "เดอะทรัสต์ เรสซิเด้นซ์ ปิ่นเกล้า",
          },
          {
            en: "Borom-Ratchaphruek Interchange (Outbound)",
            th: "ต่างระดับบรมฯ-ราชพฤกษ์ (ขาออก)",
          },
          {
            en: "Baan Panu (Soi Borommaratchachonnani 99)",
            th: "บ้านภาณุ(ซอยบรมราชชนนี 99)",
          },
        ],
        terminus: {
          en: "visual stop",
          th: "จุดขึ้นลง",
        },
        operator: {
          en: "Department of Land Transport",
          th: "กรมการขนส่งทางบก",
        },
        fare: {
          en: "Price 17.00 ฿",
          th: "ราคา 17.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 06:00 - 22:00",
          th: "ให้บริการ 06:00 - 22:00",
        },
        headway: {
          en: "Departs every 10 - 25 minutes (approximately)",
          th: "ออกทุก 10 - 25 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: false,
      },
      {
        patternKey: "ต.8|Rattanathibate Village",
        routeName: "ต.8",
        routeLongName: {
          en: "Phra Pin-klao Bridge - Rattanathibate Village",
          th: "เชิงสะพานสมเด็จพระปิ่นเกล้า - หมู่บ้านรัตนาธิเบศร์",
        },
        color: "FF00FF",
        headsign: {
          en: "Rattanathibate Village",
          th: "หมู่บ้านรัตนาธิเบศร์",
        },
        downstream: [
          {
            en: "Soi Borommaratchachonnani 5",
            th: "ซอยบรมราชชนนี 5",
          },
          {
            en: "The Trust Residence Pinklao",
            th: "เดอะทรัสต์ เรสซิเด้นซ์ ปิ่นเกล้า",
          },
          {
            en: "Borom-Ratchaphruek Interchange (Outbound)",
            th: "ต่างระดับบรมฯ-ราชพฤกษ์ (ขาออก)",
          },
          {
            en: "Baan Panu (Soi Borommaratchachonnani 99)",
            th: "บ้านภาณุ(ซอยบรมราชชนนี 99)",
          },
        ],
        terminus: {
          en: "visual stop",
          th: "จุดขึ้นลง",
        },
        operator: {
          en: "Department of Land Transport",
          th: "กรมการขนส่งทางบก",
        },
        fare: {
          en: "Price 19.00 ฿",
          th: "ราคา 19.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 06:00 - 22:00",
          th: "ให้บริการ 06:00 - 22:00",
        },
        headway: {
          en: "Departs every 10 - 25 minutes (approximately)",
          th: "ออกทุก 10 - 25 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: false,
      },
    ],
    detail: {
      en: "Thammasat University Tha Prachan,Bangkok National Museum",
      th: "ม.ธรรมศาสตร์ ท่าพระจันทร์,มหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์,พิพิธภัณฑสถานแห่งชาติ พระนคร",
    },
  },
  {
    stopId: 1061,
    name: {
      en: "Opposite Tha Phra Chan",
      th: "ตรงข้ามท่าพระจันทร์",
    },
    lines: [
      {
        patternKey: "1|Sanam Luang",
        routeName: "1",
        routeLongName: {
          en: "Thanon Tok - Tha Tian",
          th: "ถนนตก - ท่าเตียน",
        },
        color: "063970",
        headsign: {
          en: "Sanam Luang",
          th: "สนามหลวง",
        },
        downstream: [
          {
            en: "Ratcha Woradit Pier (Opposite)",
            th: "ตรงข้ามท่าราชวรดิษฐ์",
          },
        ],
        terminus: {
          en: "Opposite Tha Tian",
          th: "ตรงข้ามท่าเตียน",
        },
        operator: {
          en: "Thai Smile Bus",
          th: "ไทย สมายล์ บัส",
        },
        fare: {
          en: "Price 15.00 - 20.00 ฿",
          th: "ราคา 15.00 - 20.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: true,
      },
      {
        patternKey: "1-9E|Thammasat Rangsit",
        routeName: "1-9E",
        routeLongName: {
          en: "Thammasat (Rangsit) - Sanam Luang",
          th: "มธ.ศูนย์รังสิต - สนามหลวง (ทางด่วน)",
        },
        color: "063970",
        headsign: {
          en: "Thammasat Rangsit",
          th: "ม.ธรรมศาสตร์ (ศูนย์รังสิต)",
        },
        downstream: [
          {
            en: "The Government Lottery Office",
            th: "กองสลาก",
          },
          {
            en: "After the Thevakarma intersection",
            th: "หลังแยกเทวกรรม",
          },
          {
            en: "Khlong Luang",
            th: "ม.ธรรมศาสตร์ ศูนย์รังสิต (ทางเข้าประตูเชียงราก1)",
          },
        ],
        terminus: {
          en: "Thailand Science Park (TSP)",
          th: "ก่อนอุทยานวิทยาศาสตร์ประเทศไทย",
        },
        operator: {
          en: "Thai Smile Bus",
          th: "ไทย สมายล์ บัส",
        },
        fare: {
          en: "Price 15.00 - 25.00 ฿",
          th: "ราคา 15.00 - 25.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: true,
      },
      {
        patternKey: "2-4 (30)|Wat Paknam Nonthaburi",
        routeName: "2-4 (30)",
        routeLongName: {
          en: "Wat Paknam Nonthaburi - Southern Bus (Pinklao)",
          th: "วัดปากน้ำนนทบุรี - สายใต้ (ปิ่นเกล้า)",
        },
        color: "063970",
        headsign: {
          en: "Wat Paknam Nonthaburi",
          th: "วัดปากน้ำ นนทบุรี",
        },
        downstream: [
          {
            en: "National Theater",
            th: "โรงละครแห่งชาติ",
          },
          {
            en: "Wat Tritossathep",
            th: "วัดตรีทศเทพฯ",
          },
          {
            en: "National Olympic Committee of Thailand",
            th: "คณะกรรมการโอลิมปิคแห่งประเทศไทย",
          },
          {
            en: "Opposite Masterpiece Hospital",
            th: "ตรงข้ามรพ.มาสเตอร์พีซ",
          },
        ],
        terminus: {
          en: "Opposite Satrinonthaburi School",
          th: "ตรงข้ามโรงเรียนสตรีนนทบุรี",
        },
        operator: {
          en: "Thai Smile Bus",
          th: "ไทย สมายล์ บัส",
        },
        fare: {
          en: "Price 15.00 - 25.00 ฿",
          th: "ราคา 15.00 - 25.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: true,
      },
      {
        patternKey: "2-9 (53L)|Thewet",
        routeName: "2-9 (53L)",
        routeLongName: {
          en: "Sanamluang - Thewet",
          th: "สนามหลวง - เทเวศร์  (วนซ้าย)",
        },
        color: "ff0000",
        headsign: {
          en: "Thewet",
          th: "เทเวศร์",
        },
        downstream: [
          {
            en: "Tangtrongchit College",
            th: "ตั้งตรงจิตรพณิชยการ",
          },
          {
            en: "Klongthom (Charoenkrung Side)",
            th: "คลองถม (ฝั่งเจริญกรุง)",
          },
          {
            en: "Wat Thep Sirin",
            th: "วัดเทพศิรินทร์",
          },
          {
            en: "Before the Thevakarma intersection",
            th: "ก่อนแยกเทวกรรม",
          },
        ],
        terminus: {
          en: "Sanam Luang Bus Terminal",
          th: "ท่ารถสนามหลวง (อนุสาวรีย์ทหารอาสา)",
        },
        operator: {
          en: "Bangkok Mass Transit Authority",
          th: "องค์การขนส่งมวลชนกรุงเทพ (ขสมก.)",
        },
        fare: {
          en: "Price 8.00 ฿",
          th: "ราคา 8.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: false,
        wheelchairAccessible: false,
      },
      {
        patternKey: "2-11 (64)|Ministry of Public Health",
        routeName: "2-11 (64)",
        routeLongName: {
          en: "Ministry of Public Health - Sanamluang",
          th: "กระทรวงสาธารณสุข - สนามหลวง",
        },
        color: "063970",
        headsign: {
          en: "Ministry of Public Health",
          th: "กระทรวงสาธารณสุข",
        },
        downstream: [
          {
            en: "After Phra Pinklao Bridge",
            th: "หลังสะพานพระปิ่นเกล้า",
          },
          {
            en: "Lumpini Place Pinklao 2",
            th: "ลุมพินีเพลส ปิ่นเกล้า 2",
          },
          {
            en: "Cedar Mansion",
            th: "ซีด้าร์แมนชั่น",
          },
          {
            en: "HomePro Ratchaphruek",
            th: "โฮมโปรราชพฤกษ์",
          },
        ],
        terminus: {
          en: "Opposite Ministry of Public Health",
          th: "ตรงข้ามกระทรวงสาธารณสุข",
        },
        operator: {
          en: "Thai Smile Bus",
          th: "ไทย สมายล์ บัส",
        },
        fare: {
          en: "Price 15.00 - 25.00 ฿",
          th: "ราคา 15.00 - 25.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: true,
      },
      {
        patternKey: "3-35 (1)|Rama III Road",
        routeName: "3-35 (1)",
        routeLongName: {
          en: "Central Rama III - Sanam Luang",
          th: "เซ็นทรัลพระราม 3 - สนามหลวง",
        },
        color: "063970",
        headsign: {
          en: "Rama III Road",
          th: "พระราม 3",
        },
        downstream: [
          {
            en: "Tangtrongchit College",
            th: "ตั้งตรงจิตรพณิชยการ",
          },
          {
            en: "Klongthom (Charoenkrung Side)",
            th: "คลองถม (ฝั่งเจริญกรุง)",
          },
          {
            en: "Wat Mahapruttaram",
            th: "วัดมหาพฤฒาราม",
          },
          {
            en: "Neilson Hays Library",
            th: "ห้องสมุดเนียลสันเฮส์",
          },
        ],
        terminus: {
          en: "Central Rama 3",
          th: "เซ็นทรัลพระราม 3",
        },
        operator: {
          en: "Thai Smile Bus",
          th: "ไทย สมายล์ บัส",
        },
        fare: {
          en: "Price 15.00 - 25.00 ฿",
          th: "ราคา 15.00 - 25.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: true,
      },
      {
        patternKey: "4-2 (15)|BRT Ratchapruek L",
        routeName: "4-2 (15)",
        routeLongName: {
          en: "BRT Ratchapruek - Bang Lamphu - Siam",
          th: "วงกลมBRT ราชพฤกษ์ - บางลำพู - สยาม (วนซ้าย)",
        },
        color: "ff0000",
        headsign: {
          en: "BRT Ratchapruek L",
          th: "สถานีรถไฟฟ้าราชพฤกษ์ วนซ้าย",
        },
        downstream: [
          {
            en: "Tangtrongchit College",
            th: "ตั้งตรงจิตรพณิชยการ",
          },
          {
            en: "Sampeng (Chakrawat side)",
            th: "สำเพ็ง (ฝั่งจักรวรรดิ์)",
          },
          {
            en: "Samre Market",
            th: "ตลาดสำเหร่",
          },
          {
            en: "Soi Ratchadaphisek 9",
            th: "ซอยรัชดาภิเษก 9",
          },
        ],
        terminus: {
          en: "BRT Ratchapruek",
          th: "BRT ราชพฤกษ์",
        },
        operator: {
          en: "Bangkok Mass Transit Authority",
          th: "องค์การขนส่งมวลชนกรุงเทพ (ขสมก.)",
        },
        fare: {
          en: "Price 8.00 ฿",
          th: "ราคา 8.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: false,
        wheelchairAccessible: false,
      },
      {
        patternKey: "4-11 (43)|Thai Smile Bus Ekkachai",
        routeName: "4-11 (43)",
        routeLongName: {
          en: "Ekachai - Thewet",
          th: "เอกชัย - เทเวศร์",
        },
        color: "063970",
        headsign: {
          en: "Thai Smile Bus Ekkachai",
          th: "อู่ไทยสมายล์บัส เอกชัย",
        },
        downstream: [
          {
            en: "Tangtrongchit College",
            th: "ตั้งตรงจิตรพณิชยการ",
          },
          {
            en: "Sampeng (Chakrawat side)",
            th: "สำเพ็ง (ฝั่งจักรวรรดิ์)",
          },
          {
            en: "Soi Lat Ya 18",
            th: "ซอยลาดหญ้า 18",
          },
          {
            en: "Opposite Wongwian Yai platform",
            th: "ตรงข้ามแพลทฟอร์มวงเวียนใหญ่",
          },
        ],
        terminus: {
          en: "Thai Smile Bus Ekkachai",
          th: "อู่ไทยสมายล์บัส เอกชัย",
        },
        operator: {
          en: "Thai Smile Bus",
          th: "ไทย สมายล์ บัส",
        },
        fare: {
          en: "Price 15.00 - 25.00 ฿",
          th: "ราคา 15.00 - 25.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: true,
      },
      {
        patternKey: "4-15 (82)|Phra Pradaeng",
        routeName: "4-15 (82)",
        routeLongName: {
          en: "Phra Pradaeng - บางลัมซู",
          th: "ท่าน้ำพระประแดง - บางลำพู",
        },
        color: "063970",
        headsign: {
          en: "Phra Pradaeng",
          th: "ท่าน้ำพระประแดง",
        },
        downstream: [
          {
            en: "Tangtrongchit College",
            th: "ตั้งตรงจิตรพณิชยการ",
          },
          {
            en: "Opposite Pattana Wittaya School",
            th: "ตรงข้ามโรงเรียนพัฒนาวิทยา",
          },
          {
            en: "Opposite Wongwian Yai platform",
            th: "ตรงข้ามแพลทฟอร์มวงเวียนใหญ่",
          },
          {
            en: "Somdejprapinklao Hospital (Opposite)",
            th: "ตรงข้าม รพ.สมเด็จพระปิ่นเกล้า",
          },
        ],
        terminus: {
          en: "Phra Pradaeng Bus Terminal",
          th: "ท่าน้ำพระประแดง",
        },
        operator: {
          en: "Thai Smile Bus",
          th: "ไทย สมายล์ บัส",
        },
        fare: {
          en: "Price 15.00 - 25.00 ฿",
          th: "ราคา 15.00 - 25.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: true,
      },
      {
        patternKey: "4-43 (80)|Wat Si Nuan Thammawimon",
        routeName: "4-43 (80)",
        routeLongName: {
          en: "Wat Srinualthammawimol - Sanamluang",
          th: "วัดศรีนวลธรรมวิมล - สนามหลวง",
        },
        color: "fe9a2e",
        headsign: {
          en: "Wat Si Nuan Thammawimon",
          th: "วัดศรีนวลธรรมวิมล",
        },
        downstream: [
          {
            en: "Charan Sanitwong Soi 34/1",
            th: "ซอยจรัญสนิทวงศ์ 34/1",
          },
          {
            en: "Opposite Bang Khun Sri Market",
            th: "ตรงข้ามตลาดบางขุนศรี",
          },
          {
            en: "Wat Poreang",
            th: "วัดโพธิ์เรียง",
          },
          {
            en: "Wat Pradu Nai Songtham",
            th: "วัดประดู่ในทรงธรรม",
          },
        ],
        terminus: {
          en: "Wat Srinualthammawimol Bus Terminal (Line 80)",
          th: "ท่ารถวัดศรีนวลธรรมวิมล (สาย 80)",
        },
        operator: {
          en: "Bangkok Mass Transit Authority",
          th: "องค์การขนส่งมวลชนกรุงเทพ (ขสมก.)",
        },
        fare: {
          en: "Price 13.00 - 25.00 ฿",
          th: "ราคา 13.00 - 25.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 00:00 - 23:00",
          th: "ให้บริการ 00:00 - 23:00",
        },
        headway: {
          en: "Departs every 15 - 140 minutes (approximately)",
          th: "ออกทุก 15 - 140 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: false,
      },
      {
        patternKey: "4-45 (81)|Sanam Luang",
        routeName: "4-45 (81)",
        routeLongName: {
          en: "Aom Noi - Sanam Luang",
          th: "อ้อมน้อย - สนามหลวง",
        },
        color: "063970",
        headsign: {
          en: "Sanam Luang",
          th: "สนามหลวง",
        },
        downstream: [],
        terminus: {
          en: "Ratcha Woradit Pier (Opposite)",
          th: "ตรงข้ามท่าราชวรดิษฐ์",
        },
        operator: {
          en: "Thai Smile Bus",
          th: "ไทย สมายล์ บัส",
        },
        fare: {
          en: "Price 15.00 - 25.00 ฿",
          th: "ราคา 15.00 - 25.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: true,
      },
      {
        patternKey: "4-50 (123)|Om Yai",
        routeName: "4-50 (123)",
        routeLongName: {
          en: "Om Yai, Sam Phran - Sanam Luang",
          th: "อ้อมใหญ่ - สนามหลวง",
        },
        color: "063970",
        headsign: {
          en: "Om Yai",
          th: "อ้อมใหญ่",
        },
        downstream: [
          {
            en: "After Phra Pinklao Bridge",
            th: "หลังสะพานพระปิ่นเกล้า",
          },
          {
            en: "Lumpini Place Pinklao 2",
            th: "ลุมพินีเพลส ปิ่นเกล้า 2",
          },
          {
            en: "Cedar Mansion",
            th: "ซีด้าร์แมนชั่น",
          },
          {
            en: "Soi Wat Makok (Borom side)",
            th: "ซอยวัดมะกอก (ฝั่งบรมฯ)",
          },
        ],
        terminus: {
          en: "Joseph Upatham School (Stop 1)",
          th: "โรงเรียนยอแซฟอุปถัมภ์ (จุดที่ 1)",
        },
        operator: {
          en: "Thai Smile Bus",
          th: "ไทย สมายล์ บัส",
        },
        fare: {
          en: "Price 15.00 - 25.00 ฿",
          th: "ราคา 15.00 - 25.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: true,
      },
      {
        patternKey: "4-51 (124)|Ban Eua Arthorn Salaya",
        routeName: "4-51 (124)",
        routeLongName: {
          en: "Ban Eua Arthorn Salaya  - Sanam Luang",
          th: "บ้านเอื้ออาทรศาลายา - สนามหลวง",
        },
        color: "063970",
        headsign: {
          en: "Ban Eua Arthorn Salaya",
          th: "บ้านเอื้ออาทรศาลายา",
        },
        downstream: [
          {
            en: "After Phra Pinklao Bridge",
            th: "หลังสะพานพระปิ่นเกล้า",
          },
          {
            en: "Lumpini Place Pinklao 2",
            th: "ลุมพินีเพลส ปิ่นเกล้า 2",
          },
          {
            en: "Cedar Mansion",
            th: "ซีด้าร์แมนชั่น",
          },
          {
            en: "Soi Wat Makok (Borom side)",
            th: "ซอยวัดมะกอก (ฝั่งบรมฯ)",
          },
        ],
        terminus: {
          en: "Thai Smile Bus Salaya",
          th: "อู่ไทยสมายล์บัส ศาลายา",
        },
        operator: {
          en: "Thai Smile Bus",
          th: "ไทย สมายล์ บัส",
        },
        fare: {
          en: "Price 0.00 - 25.00 ฿",
          th: "ราคา 0.00 - 25.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: true,
      },
      {
        patternKey: "91|Setthakit Village",
        routeName: "91",
        routeLongName: {
          en: "Setthakit Village - Sanamluang",
          th: "ม.เศรษฐกิจ (โรงเรียนอัสสัมชัญธนบุรี) - สนามหลวง",
        },
        color: "FE9A2E",
        headsign: {
          en: "Setthakit Village",
          th: "ม.เศรษฐกิจ (โรงเรียนอัสสัมชัญธนบุรี)",
        },
        downstream: [
          {
            en: "Siriraj Hospital",
            th: "รพ.ศิริราช",
          },
          {
            en: "Soi Phran Nok 4",
            th: "ซอยพรานนก 4",
          },
          {
            en: "Opposite Charansanitwong 13",
            th: "ตรงข้ามซอยจรัญสนิทวงศ์ 13",
          },
          {
            en: "Wat Nuannoradit",
            th: "วัดนวลนรดิศ",
          },
        ],
        terminus: {
          en: "Muban Setthakit Bus Terminal (Line 91)",
          th: "ท่ารถหมู่บ้านเศรษฐกิจ (สาย 91)",
        },
        operator: {
          en: "Bangkok Mass Transit Authority",
          th: "องค์การขนส่งมวลชนกรุงเทพ (ขสมก.)",
        },
        fare: {
          en: "Price 11.00 - 20.00 ฿",
          th: "ราคา 11.00 - 20.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: false,
      },
      {
        patternKey: "91ก|Sanamluang 2",
        routeName: "91ก",
        routeLongName: {
          en: "Sanamluang - Sanamluang 2",
          th: "สนามหลวง  - สนามหลวง 2",
        },
        color: "ff0000",
        headsign: {
          en: "Sanamluang 2",
          th: "สนามหลวง 2",
        },
        downstream: [
          {
            en: "Flotilla Naval Transportation Department",
            th: "กองเรือเล็ก",
          },
          {
            en: "Wat Yang Sutharam",
            th: "วัดยางสุทธาราม",
          },
          {
            en: "Wat Poreang",
            th: "วัดโพธิ์เรียง",
          },
          {
            en: "Wat Pradu Nai Songtham",
            th: "วัดประดู่ในทรงธรรม",
          },
        ],
        terminus: {
          en: "Thonburi Market Sanam Luang 2",
          th: "ตลาดธนบุรี สนามหลวง 2",
        },
        operator: {
          en: "Bangkok Mass Transit Authority",
          th: "องค์การขนส่งมวลชนกรุงเทพ (ขสมก.)",
        },
        fare: {
          en: "Price 8.00 ฿",
          th: "ราคา 8.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: false,
        wheelchairAccessible: false,
      },
      {
        patternKey: "203|Tha It",
        routeName: "203",
        routeLongName: {
          en: "Tha It - Sanamluang",
          th: "ท่าอิฐ - สนามหลวง",
        },
        color: "ffcc00",
        headsign: {
          en: "Tha It",
          th: "ท่าอิฐ",
        },
        downstream: [
          {
            en: "After Phra Pinklao Bridge",
            th: "หลังสะพานพระปิ่นเกล้า",
          },
          {
            en: "Land Office Bangkok Bangkok Noi",
            th: "สำนักงานที่ดินบางกอกน้อย",
          },
          {
            en: "Wat Bang Phlat77/3",
            th: "วัดบางพลัด",
          },
          {
            en: "Yanhee International Hospital (Opposite)",
            th: "ตรงข้ามรพ.ยันฮี",
          },
        ],
        terminus: {
          en: "Sai Ma Bus Terminal Line 203",
          th: "อู่ไทรม้า (สาย 203)",
        },
        operator: {
          en: "Bangkok Mass Transit Authority",
          th: "องค์การขนส่งมวลชนกรุงเทพ (ขสมก.)",
        },
        fare: {
          en: "Price 13.00 ฿",
          th: "ราคา 13.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 05:00 - 22:00",
          th: "ให้บริการ 05:00 - 22:00",
        },
        headway: {
          en: "Departs every 15 minutes (approximately)",
          th: "ออกทุก 15 นาที (โดยประมาณ)",
        },
        airConditioned: true,
        wheelchairAccessible: false,
      },
    ],
    detail: {
      en: "Phra Chan Pier (OPP Thammasat U)",
      th: "ท่าพระจันทร์ (ตรงข้าม ม.ธรรมศาสตร์)",
    },
  },
];
