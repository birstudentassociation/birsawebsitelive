/**
 * Copy for the `/emergency` index page that is not tied to one guide: the
 * national numbers, official phone alerts, and being ready in advance.
 *
 * Cell broadcast facts from DDPM as reported by The Nation (January 2026).
 */
import type { EmergencySection, LocalizedText } from "@/content/emergency/types";
import type { Locale } from "@/lib/i18n";

/** Contact ids shown as call buttons at the top of the index page. */
export const helpNumbers = ["police", "ambulance", "fire", "touristPolice"];

export const landingSources: { label: LocalizedText; href: string }[] = [
  {
    label: {
      en: "The Nation, DDPM nationwide cell broadcast test",
      th: "The Nation การทดสอบระบบแจ้งเตือน Cell Broadcast ทั่วประเทศของ ปภ.",
    },
    href: "https://www.nationthailand.com/news/general/40061477",
  },
  {
    label: {
      en: "The Nation, turn on cell broadcast to get emergency warnings",
      th: "The Nation เปิดรับ Cell Broadcast เพื่อรับคำเตือนภัย",
    },
    href: "https://www.nationthailand.com/blogs/news/general/40061474",
  },
];

export const landingSections: Record<Locale, EmergencySection[]> = {
  en: [
    {
      id: "phone-alerts",
      heading: "Get official alerts on your phone",
      body: [
        "The Department of Disaster Prevention and Mitigation sends emergency alerts straight to every phone in an affected area by cell broadcast. Alerts come in Thai and English, make a loud sound even on silent, and arrive within seconds. They cover floods, storms, earthquakes, PM2.5, fires, public violence and more.",
      ],
      steps: [
        "Update your phone. Alerts need iOS 18 or later, or Android 11 or later, on a 4G or 5G network.",
        "On an iPhone, open Settings, then Notifications, and turn on the alerts listed at the bottom under TH-ALERT.",
        'On Android, search Settings for "Wireless emergency alerts" or "Safety and emergency" and turn the alerts on.',
      ],
    },
    {
      id: "be-ready",
      heading: "Be ready before anything happens",
      items: [
        "Save 191, 1669, 199 and 1155 in your phone.",
        "In every building you use, know two ways out and where the stairs are.",
        "Keep a charged power bank, and some cash, with you.",
        "Agree with a friend or family member how you will contact each other if phone lines are busy.",
        "Write one emergency contact on paper and keep it in your wallet.",
        "If you are an international student, register with your embassy if it offers that and save its emergency number.",
      ],
    },
  ],
  th: [
    {
      id: "phone-alerts",
      heading: "รับคำเตือนภัยทางการผ่านโทรศัพท์",
      body: [
        "กรมป้องกันและบรรเทาสาธารณภัยส่งข้อความเตือนภัยเข้าโทรศัพท์ทุกเครื่องในพื้นที่เสี่ยงผ่านระบบ Cell Broadcast เป็นภาษาไทยและอังกฤษ มีเสียงดังแม้ตั้งเป็นโหมดเงียบ และถึงภายในไม่กี่วินาที ครอบคลุมน้ำท่วม พายุ แผ่นดินไหว ฝุ่น PM2.5 เพลิงไหม้ ความรุนแรงในที่สาธารณะ และอื่น ๆ",
      ],
      steps: [
        "อัปเดตโทรศัพท์ ระบบนี้ใช้ได้กับ iOS 18 ขึ้นไป หรือ Android 11 ขึ้นไป บนเครือข่าย 4G หรือ 5G",
        "บน iPhone เข้า การตั้งค่า แล้ว การแจ้งเตือน เลื่อนลงล่างสุดแล้วเปิดการแจ้งเตือนในหัวข้อ TH-ALERT",
        'บน Android ค้นหาในการตั้งค่าว่า "การแจ้งเตือนเหตุฉุกเฉินแบบไร้สาย" หรือ "ความปลอดภัยและเหตุฉุกเฉิน" แล้วเปิดการแจ้งเตือน',
      ],
    },
    {
      id: "be-ready",
      heading: "เตรียมพร้อมไว้ก่อนเกิดเหตุ",
      items: [
        "บันทึกเบอร์ 191 1669 199 และ 1155 ไว้ในโทรศัพท์",
        "ทุกอาคารที่ใช้เป็นประจำ ให้รู้ทางออกอย่างน้อยสองทางและรู้ว่าบันไดอยู่ตรงไหน",
        "พกพาวเวอร์แบงก์ที่ชาร์จเต็มและเงินสดจำนวนหนึ่งติดตัว",
        "ตกลงกับเพื่อนหรือครอบครัวไว้ก่อนว่าจะติดต่อกันทางไหนถ้าโทรไม่ติด",
        "จดเบอร์ติดต่อฉุกเฉินหนึ่งเบอร์ลงกระดาษเก็บไว้ในกระเป๋าสตางค์",
        "ถ้ามีเพื่อนนักศึกษาต่างชาติ ชวนให้ลงทะเบียนกับสถานทูตและบันทึกเบอร์ฉุกเฉินของสถานทูตไว้",
      ],
    },
  ],
};
