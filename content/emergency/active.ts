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
  issuedAt: "2026-09-26T10:15:00+07:00",
  banner: {
    en: "Heavy rain is flooding roads across Bangkok until at least 27 September. Check your route before you travel and keep out of floodwater.",
    th: "ฝนตกหนักทำให้ถนนหลายสายในกรุงเทพฯ น้ำท่วมขังไปจนถึงอย่างน้อยวันที่ 27 กันยายน ตรวจเส้นทางก่อนเดินทาง และอย่าลุยน้ำ",
  },
  updates: [
    {
      at: "2026-09-26T10:15:00+07:00",
      text: {
        en: "At 09:22 today DDPM sent a cell broadcast alert to phones in Bangkok. Water in the city's canals is at critical levels and still rising. If you live beside a canal or on low ground, move your belongings and vehicle somewhere higher, keep documents and valuables safe, watch out for electrical hazards and check on anyone who may need help. The Thai Meteorological Department expects heavy to very heavy rain in Bangkok until 27 September. The worst flooding so far is in the east and north of the city, including Min Buri, Lat Krabang, Sai Mai, Chatuchak and Chaeng Watthana Road, where several roads are closed to small cars. We have not seen reports of flooding around Tha Prachan. DDPM has also told Bangkok to watch the Chao Phraya, which is expected to rise towards 29 September as more water is released upstream, so take care at piers and check express boat services before you travel.",
        th: "เวลา 09.22 น. วันนี้ ปภ. ส่งข้อความเตือนภัยผ่านระบบ Cell Broadcast ถึงโทรศัพท์ในกรุงเทพฯ ว่าระดับน้ำในคลองอยู่ในขั้นวิกฤตและยังสูงขึ้น ใครพักริมคลองหรือในพื้นที่ลุ่มต่ำ ให้ขนย้ายสิ่งของและรถขึ้นที่สูง เก็บเอกสารและของมีค่าให้ปลอดภัย ระวังไฟฟ้าดูด และดูแลคนที่ต้องการความช่วยเหลือ กรมอุตุนิยมวิทยาคาดว่ากรุงเทพฯ จะมีฝนตกหนักถึงหนักมากไปจนถึงวันที่ 27 กันยายน ตอนนี้น้ำท่วมหนักที่สุดทางฝั่งตะวันออกและทางเหนือของเมือง เช่น มีนบุรี ลาดกระบัง สายไหม จตุจักร และถนนแจ้งวัฒนะ ถนนหลายสายห้ามรถเล็กผ่าน ยังไม่พบรายงานน้ำท่วมแถวท่าพระจันทร์ นอกจากนี้ ปภ. ให้กรุงเทพฯ เฝ้าระวังแม่น้ำเจ้าพระยาซึ่งคาดว่าจะสูงขึ้นไปจนถึงราววันที่ 29 กันยายน เพราะมีการระบายน้ำจากทางเหนือเพิ่มขึ้น ระวังตัวเมื่ออยู่ที่ท่าเรือ และตรวจการเดินเรือด่วนก่อนออกเดินทาง",
      },
    },
  ],
};
