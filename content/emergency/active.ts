/**
 * The live emergency alert. `null` means no alert.
 *
 * To raise one, set this to an object and deploy (a commit to master deploys
 * in about a minute). The banner appears on every page and the guide shows the
 * issue time and updates at the top. To add an update, put a new entry at the
 * start of `updates` and deploy again. To end the alert, set this back to
 * `null` and deploy. Step-by-step instructions are in `docs/EDITING.md`.
 *
 * Example:
 *
 *   export const activeEmergency: ActiveEmergency<ScenarioId> | null = {
 *     scenario: "flooding",
 *     issuedAt: "2026-10-12T07:30:00+07:00",
 *     banner: {
 *       en: "Roads around Tha Prachan are flooded. Classes today are online.",
 *       th: "ถนนรอบท่าพระจันทร์น้ำท่วม วันนี้เรียนออนไลน์",
 *     },
 *     updates: [
 *       {
 *         at: "2026-10-12T07:30:00+07:00",
 *         text: {
 *           en: "Prachan Road and Na Phra That Road are flooded. The faculty has moved today's classes online.",
 *           th: "ถนนพระจันทร์และถนนหน้าพระธาตุน้ำท่วม คณะให้เรียนออนไลน์ทุกวิชาในวันนี้",
 *         },
 *       },
 *     ],
 *   };
 */
import type { ActiveEmergency } from "@/content/emergency/types";
import type { ScenarioId } from "@/content/emergency/scenarios";

export const activeEmergency: ActiveEmergency<ScenarioId> | null = {
  scenario: "flooding",
  issuedAt: "2026-09-26T10:30:00+07:00",
  banner: {
    en: "All 50 districts of Bangkok are now a declared disaster area. Canals are at critical levels and many roads are flooded. Check your route and keep out of floodwater.",
    th: "กทม. ประกาศให้ทั้ง 50 เขตเป็นเขตพื้นที่ประสบสาธารณภัยแล้ว น้ำในคลองอยู่ในระดับวิกฤต ถนนหลายสายน้ำท่วมขัง ตรวจเส้นทางก่อนเดินทาง และอย่าลุยน้ำ",
  },
  updates: [
    {
      at: "2026-09-26T10:45:00+07:00",
      text: {
        en: "All 50 districts of Bangkok are now a declared disaster area.",
        th: "กรุงเทพฯ ทั้ง 50 เขตเป็นเขตพื้นที่ประสบสาธารณภัยแล้ว",
      },
      points: {
        en: [
          "Governor Chadchart Sittipunt signed the announcement under the Disaster Prevention and Mitigation Act 2007.",
          "It extends the declaration made on 25 September for Nong Chok, Suan Luang and Khan Na Yao to the whole city.",
          "It lets government agencies, district offices and the private sector act quickly, and is the basis for help to people affected.",
          "If your home or belongings are damaged, take photographs before you clean up and keep them for a claim.",
          "To report flooding or ask for help, call 1555 or use Traffy Fondue on LINE. For a medical emergency, call 1669.",
        ],
        th: [
          "นายชัชชาติ สิทธิพันธุ์ ผู้ว่าราชการกรุงเทพมหานคร ลงนามในประกาศตามพระราชบัญญัติป้องกันและบรรเทาสาธารณภัย พ.ศ. 2550",
          "ขยายจากประกาศเมื่อวันที่ 25 กันยายน ที่ครอบคลุมเขตหนองจอก สวนหลวง และคันนายาว ให้ครอบคลุมทั้งเมือง",
          "ส่วนราชการ หน่วยงาน องค์กรปกครองส่วนท้องถิ่น และภาคเอกชนเข้าดำเนินการได้อย่างรวดเร็ว และเป็นฐานในการช่วยเหลือผู้ได้รับผลกระทบ",
          "ถ้าที่พักหรือทรัพย์สินเสียหาย ให้ถ่ายรูปเก็บไว้เป็นหลักฐานก่อนทำความสะอาด",
          "แจ้งเหตุหรือขอความช่วยเหลือได้ที่ 1555 หรือ Traffy Fondue ใน LINE เจ็บป่วยฉุกเฉินโทร 1669",
        ],
      },
    },
    {
      at: "2026-09-26T10:30:00+07:00",
      text: {
        en: "DDPM sent a cell broadcast to phones in Bangkok at 09:22. Canal levels are critical and still rising.",
        th: "เวลา 09.22 น. ปภ. ส่งข้อความ Cell Broadcast ถึงโทรศัพท์ในกรุงเทพฯ ว่าระดับน้ำในคลองอยู่ในขั้นวิกฤตและยังสูงขึ้น",
      },
      points: {
        en: [
          "If you live beside a canal or on low ground, move belongings and valuables higher, avoid flooded roads and check your route before you set off.",
          "At 10:10, 151 of about 300 BMA canal stations were at critical level, mostly in the north and east of the city and in western Thonburi.",
          "Roads were flooded at 15 points. The deepest were Sena Nikhom 1 (64 cm), Lat Phrao 122 (58 cm), Ngam Wong Wan at Phong Phet (56 cm), New Phetchaburi at Singha Complex (52 cm) and Ramkhamhaeng 43/1 (50 cm).",
          "In the 24 hours to 10:15, 111 of 122 working rain gauges recorded more than 100 mm, peaking at 212.5 mm at Bueng Khwang in Min Buri. The east of the city has had nearly 300 mm since Thursday, and up to 15 mm fell in the past hour in Sai Mai.",
          "Around Tha Prachan, 134 to 161 mm fell, but the canals are normal and the road sensors in and around the old town are dry. The Chao Phraya at Pak Khlong Talat is 1.06 m, well below the 2.30 m warning level.",
          "The BMA is opening shelters in BMA schools.",
          "The Thai Meteorological Department expects heavy to very heavy rain until 27 September.",
        ],
        th: [
          "ใครอยู่ริมคลองหรือในพื้นที่ลุ่มต่ำ ให้ยกสิ่งของและของมีค่าขึ้นที่สูง เลี่ยงเส้นทางที่น้ำท่วม และตรวจเส้นทางก่อนออกเดินทาง",
          "เวลา 10.10 น. สถานีวัดระดับน้ำในคลองของ กทม. อยู่ในขั้นวิกฤต 151 จากราว 300 สถานี ส่วนใหญ่อยู่ทางเหนือและตะวันออกของเมือง และฝั่งธนบุรีด้านตะวันตก",
          "ถนนมีน้ำท่วมขัง 15 จุด ลึกที่สุดที่ถนนเสนานิคม 1 (64 ซม.) ซอยลาดพร้าว 122 (58 ซม.) ถนนงามวงศ์วานแยกพงษ์เพชร (56 ซม.) ถนนเพชรบุรีตัดใหม่หน้าสิงห์คอมเพล็กซ์ (52 ซม.) และซอยรามคำแหง 43/1 (50 ซม.)",
          "ใน 24 ชั่วโมงถึงเวลา 10.15 น. สถานีวัดน้ำฝนที่ใช้งานได้ 111 จาก 122 สถานีวัดฝนได้เกิน 100 มม. สูงสุด 212.5 มม. ที่ประตูระบายน้ำบึงขวาง เขตมีนบุรี ฝั่งตะวันออกมีฝนสะสมเกือบ 300 มม. ตั้งแต่วันพฤหัสบดี และในชั่วโมงที่ผ่านมาเขตสายไหมยังวัดฝนได้สูงสุด 15 มม.",
          "รอบท่าพระจันทร์ฝนตก 134 ถึง 161 มม. แต่น้ำในคลองยังปกติ และจุดวัดน้ำบนถนนย่านเมืองเก่ายังแห้ง แม่น้ำเจ้าพระยาที่ปากคลองตลาดอยู่ที่ 1.06 ม. ต่ำกว่าระดับเตือนภัย 2.30 ม. มาก",
          "กทม. เปิดศูนย์พักพิงในโรงเรียนสังกัด กทม.",
          "กรมอุตุนิยมวิทยาคาดว่าจะมีฝนตกหนักถึงหนักมากไปจนถึงวันที่ 27 กันยายน",
        ],
      },
    },
  ],
};
