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
            en: "Opposite Tha Phra Chan",
            th: "ตรงข้ามท่าพระจันทร์",
          },
          {
            en: "Wat Maha That Yuvarat Rangsarit",
            th: "วัดมหาธาตุยุวราชรังสฤษฎิ์",
          },
          {
            en: "Silpakorn University, Wang Tha Phra Campus 1",
            th: "มหาวิทยาลัยศิลปากร วังท่าพระ จุดที่ 1",
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
            en: "Opposite Tha Phra Chan",
            th: "ตรงข้ามท่าพระจันทร์",
          },
          {
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
          },
          {
            en: "Ratcha Woradit Pier (Opposite)",
            th: "ตรงข้ามท่าราชวรดิษฐ์",
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
            en: "Opposite Tha Phra Chan",
            th: "ตรงข้ามท่าพระจันทร์",
          },
          {
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
          },
          {
            en: "Ratcha Woradit Pier (Opposite)",
            th: "ตรงข้ามท่าราชวรดิษฐ์",
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
        color: "fe9a2e",
        headsign: {
          en: "Wat Pho",
          th: "วัดโพธิ์",
        },
        downstream: [
          {
            en: "Ministry of Defense",
            th: "กระทรวงกลาโหม",
          },
          {
            en: "Wat Pho",
            th: "วัดโพธิ์",
          },
        ],
        terminus: {
          en: "Wat Pho",
          th: "วัดโพธิ์",
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
            en: "Opposite Tha Phra Chan",
            th: "ตรงข้ามท่าพระจันทร์",
          },
          {
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
          },
          {
            en: "Ratcha Woradit Pier (Opposite)",
            th: "ตรงข้ามท่าราชวรดิษฐ์",
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
            en: "Opposite Tha Phra Chan",
            th: "ตรงข้ามท่าพระจันทร์",
          },
          {
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
          },
          {
            en: "Ratcha Woradit Pier (Opposite)",
            th: "ตรงข้ามท่าราชวรดิษฐ์",
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
        color: "fe9a2e",
        headsign: {
          en: "Klongsan",
          th: "คลองสาน",
        },
        downstream: [
          {
            en: "Ministry of Defense",
            th: "กระทรวงกลาโหม",
          },
          {
            en: "Suan Chao Chet",
            th: "สวนเจ้าเชตุ",
          },
          {
            en: "Bangkok Land Office",
            th: "สำนักงานที่ดินกรุงเทพฯ",
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
          en: "Price 13.00 - 25.00 ฿",
          th: "ราคา 13.00 - 25.00 บาท",
        },
        serviceHours: {
          en: "Service Hours 00:00 - 23:00",
          th: "ให้บริการ 00:00 - 23:00",
        },
        headway: {
          en: "Departs every 15 - 120 minutes (approximately)",
          th: "ออกทุก 15 - 120 นาที (โดยประมาณ)",
        },
        airConditioned: true,
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
            en: "Opposite Tha Phra Chan",
            th: "ตรงข้ามท่าพระจันทร์",
          },
          {
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
          },
          {
            en: "Ratcha Woradit Pier (Opposite)",
            th: "ตรงข้ามท่าราชวรดิษฐ์",
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
        color: "FE9A2E",
        headsign: {
          en: "BRT Ratchapruek L",
          th: "สถานีรถไฟฟ้าราชพฤกษ์ วนซ้าย",
        },
        downstream: [
          {
            en: "Opposite Tha Phra Chan",
            th: "ตรงข้ามท่าพระจันทร์",
          },
          {
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
          },
          {
            en: "Ratcha Woradit Pier (Opposite)",
            th: "ตรงข้ามท่าราชวรดิษฐ์",
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
            en: "Opposite Tha Phra Chan",
            th: "ตรงข้ามท่าพระจันทร์",
          },
          {
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
          },
          {
            en: "Ratcha Woradit Pier (Opposite)",
            th: "ตรงข้ามท่าราชวรดิษฐ์",
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
            en: "Opposite Tha Phra Chan",
            th: "ตรงข้ามท่าพระจันทร์",
          },
          {
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
          },
          {
            en: "Ratcha Woradit Pier (Opposite)",
            th: "ตรงข้ามท่าราชวรดิษฐ์",
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
            en: "Opposite Tha Phra Chan",
            th: "ตรงข้ามท่าพระจันทร์",
          },
          {
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
          },
          {
            en: "Sanamluang Stop.1",
            th: "สนามหลวง (ตรงข้ามศาลฎีกา)",
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
        downstream: [
          {
            en: "Opposite Tha Phra Chan",
            th: "ตรงข้ามท่าพระจันทร์",
          },
          {
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
          },
          {
            en: "Ratcha Woradit Pier (Opposite)",
            th: "ตรงข้ามท่าราชวรดิษฐ์",
          },
        ],
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
            en: "Opposite Tha Phra Chan",
            th: "ตรงข้ามท่าพระจันทร์",
          },
          {
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
          },
          {
            en: "Ratcha Woradit Pier (Opposite)",
            th: "ตรงข้ามท่าราชวรดิษฐ์",
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
            en: "Opposite Tha Phra Chan",
            th: "ตรงข้ามท่าพระจันทร์",
          },
          {
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
          },
          {
            en: "Ratcha Woradit Pier (Opposite)",
            th: "ตรงข้ามท่าราชวรดิษฐ์",
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
            en: "Opposite Tha Phra Chan",
            th: "ตรงข้ามท่าพระจันทร์",
          },
          {
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
          },
          {
            en: "Sanamluang Stop.1",
            th: "สนามหลวง (ตรงข้ามศาลฎีกา)",
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
            en: "Opposite Tha Phra Chan",
            th: "ตรงข้ามท่าพระจันทร์",
          },
          {
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
          },
          {
            en: "Sanamluang Stop.1",
            th: "สนามหลวง (ตรงข้ามศาลฎีกา)",
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
            en: "Opposite Tha Phra Chan",
            th: "ตรงข้ามท่าพระจันทร์",
          },
          {
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
          },
          {
            en: "Ratcha Woradit Pier (Opposite)",
            th: "ตรงข้ามท่าราชวรดิษฐ์",
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
            en: "National Theater",
            th: "โรงละครแห่งชาติ",
          },
          {
            en: "Maliwan Palace",
            th: "วังมะลิวัลย์",
          },
          {
            en: "Tha Phra Athit",
            th: "ท่าพระอาทิตย์",
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
            en: "National Theater",
            th: "โรงละครแห่งชาติ",
          },
          {
            en: "Maliwan Palace",
            th: "วังมะลิวัลย์",
          },
          {
            en: "Tha Phra Athit",
            th: "ท่าพระอาทิตย์",
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
            en: "National Theater",
            th: "โรงละครแห่งชาติ",
          },
          {
            en: "Maliwan Palace",
            th: "วังมะลิวัลย์",
          },
          {
            en: "Tha Phra Athit",
            th: "ท่าพระอาทิตย์",
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
            en: "National Theater",
            th: "โรงละครแห่งชาติ",
          },
          {
            en: "Maliwan Palace",
            th: "วังมะลิวัลย์",
          },
          {
            en: "Tha Phra Athit",
            th: "ท่าพระอาทิตย์",
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
            en: "National Theater",
            th: "โรงละครแห่งชาติ",
          },
          {
            en: "Maliwan Palace",
            th: "วังมะลิวัลย์",
          },
          {
            en: "Tha Phra Athit",
            th: "ท่าพระอาทิตย์",
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
            en: "National Theater",
            th: "โรงละครแห่งชาติ",
          },
          {
            en: "Maliwan Palace",
            th: "วังมะลิวัลย์",
          },
          {
            en: "Tha Phra Athit",
            th: "ท่าพระอาทิตย์",
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
            en: "Sanamluang Stop.1",
            th: "สนามหลวง (ตรงข้ามศาลฎีกา)",
          },
          {
            en: "Sanamluang Stop.2",
            th: "สนามหลวง(ตรงข้ามศาลฎีกา) ป้ายที่2",
          },
          {
            en: "After Phra Pinklao Bridge",
            th: "หลังสะพานพระปิ่นเกล้า",
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
            en: "Sanamluang Stop.1",
            th: "สนามหลวง (ตรงข้ามศาลฎีกา)",
          },
          {
            en: "Sanamluang Stop.2",
            th: "สนามหลวง(ตรงข้ามศาลฎีกา) ป้ายที่2",
          },
          {
            en: "After Phra Pinklao Bridge",
            th: "หลังสะพานพระปิ่นเกล้า",
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
            en: "Wat Maha That Yuvarat Rangsarit",
            th: "วัดมหาธาตุยุวราชรังสฤษฎิ์",
          },
          {
            en: "Silpakorn University, Wang Tha Phra Campus 1",
            th: "มหาวิทยาลัยศิลปากร วังท่าพระ จุดที่ 1",
          },
          {
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
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
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
          },
          {
            en: "Ratcha Woradit Pier (Opposite)",
            th: "ตรงข้ามท่าราชวรดิษฐ์",
          },
          {
            en: "Opposite Tha Tian",
            th: "ตรงข้ามท่าเตียน",
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
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
          },
          {
            en: "Ratcha Woradit Pier (Opposite)",
            th: "ตรงข้ามท่าราชวรดิษฐ์",
          },
          {
            en: "Opposite Tha Tian",
            th: "ตรงข้ามท่าเตียน",
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
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
          },
          {
            en: "Ratcha Woradit Pier (Opposite)",
            th: "ตรงข้ามท่าราชวรดิษฐ์",
          },
          {
            en: "Opposite Tha Tian",
            th: "ตรงข้ามท่าเตียน",
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
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
          },
          {
            en: "Ratcha Woradit Pier (Opposite)",
            th: "ตรงข้ามท่าราชวรดิษฐ์",
          },
          {
            en: "Opposite Tha Tian",
            th: "ตรงข้ามท่าเตียน",
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
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
          },
          {
            en: "Ratcha Woradit Pier (Opposite)",
            th: "ตรงข้ามท่าราชวรดิษฐ์",
          },
          {
            en: "Opposite Tha Tian",
            th: "ตรงข้ามท่าเตียน",
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
        color: "FE9A2E",
        headsign: {
          en: "BRT Ratchapruek L",
          th: "สถานีรถไฟฟ้าราชพฤกษ์ วนซ้าย",
        },
        downstream: [
          {
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
          },
          {
            en: "Ratcha Woradit Pier (Opposite)",
            th: "ตรงข้ามท่าราชวรดิษฐ์",
          },
          {
            en: "Opposite Tha Tian",
            th: "ตรงข้ามท่าเตียน",
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
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
          },
          {
            en: "Ratcha Woradit Pier (Opposite)",
            th: "ตรงข้ามท่าราชวรดิษฐ์",
          },
          {
            en: "Opposite Tha Tian",
            th: "ตรงข้ามท่าเตียน",
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
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
          },
          {
            en: "Ratcha Woradit Pier (Opposite)",
            th: "ตรงข้ามท่าราชวรดิษฐ์",
          },
          {
            en: "Opposite Tha Tian",
            th: "ตรงข้ามท่าเตียน",
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
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
          },
          {
            en: "Sanamluang Stop.1",
            th: "สนามหลวง (ตรงข้ามศาลฎีกา)",
          },
          {
            en: "After Phra Pinklao Bridge",
            th: "หลังสะพานพระปิ่นเกล้า",
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
        downstream: [
          {
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
          },
          {
            en: "Ratcha Woradit Pier (Opposite)",
            th: "ตรงข้ามท่าราชวรดิษฐ์",
          },
        ],
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
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
          },
          {
            en: "Ratcha Woradit Pier (Opposite)",
            th: "ตรงข้ามท่าราชวรดิษฐ์",
          },
          {
            en: "Opposite Tha Tian",
            th: "ตรงข้ามท่าเตียน",
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
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
          },
          {
            en: "Ratcha Woradit Pier (Opposite)",
            th: "ตรงข้ามท่าราชวรดิษฐ์",
          },
          {
            en: "Opposite Tha Tian",
            th: "ตรงข้ามท่าเตียน",
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
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
          },
          {
            en: "Sanamluang Stop.1",
            th: "สนามหลวง (ตรงข้ามศาลฎีกา)",
          },
          {
            en: "After Phra Pinklao Bridge",
            th: "หลังสะพานพระปิ่นเกล้า",
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
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
          },
          {
            en: "Sanamluang Stop.1",
            th: "สนามหลวง (ตรงข้ามศาลฎีกา)",
          },
          {
            en: "After Phra Pinklao Bridge",
            th: "หลังสะพานพระปิ่นเกล้า",
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
            en: "Silpakorn University",
            th: "ม.ศิลปากร",
          },
          {
            en: "Ratcha Woradit Pier (Opposite)",
            th: "ตรงข้ามท่าราชวรดิษฐ์",
          },
          {
            en: "Opposite Tha Tian",
            th: "ตรงข้ามท่าเตียน",
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
