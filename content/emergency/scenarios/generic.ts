import type { EmergencyScenario } from "@/content/emergency/types";

/**
 * Fallback scenario. Used whenever Edge Config is active but names no scenario,
 * or names one that does not exist, so the banner and page never render blank
 * or 404 during an incident. Deliberately non-specific: it points people to
 * official instructions and the emergency services.
 */
const generic: EmergencyScenario = {
  id: "generic",
  severity: "warning",
  en: {
    bannerMessage: "There is an emergency affecting the faculty. Follow official instructions.",
    title: "Emergency information",
    lede: "An emergency is currently affecting the faculty. Follow the instructions of the emergency services and Thammasat University at all times.",
    immediateActions: [
      "If you or anyone near you is in immediate danger, call the emergency services first: police 191, medical 1669, fire 199.",
      "Follow any instructions from Thammasat University staff and the emergency services.",
      "Check this page and BIRSA's official channels for the latest updates before acting on unverified sources.",
      "Keep your phone charged and let family or friends know you are safe.",
    ],
    sections: [
      {
        heading: "Stay informed",
        body: [
          "Rely on official sources: Thammasat University announcements, the emergency services, and this page.",
          "Be careful with rumours on social media. Confirm anything important against an official source before you act on it.",
        ],
      },
      {
        heading: "For international students",
        items: [
          "Keep your passport and important documents somewhere safe and easy to reach.",
          "Check your government's travel advice, and contact your embassy if you need help.",
        ],
      },
    ],
    extraContacts: [
      { label: "Police (general emergency)", value: "191", href: "tel:191" },
      { label: "Medical emergency (EMS)", value: "1669", href: "tel:1669" },
      { label: "Fire and rescue", value: "199", href: "tel:199" },
    ],
  },
  th: {
    bannerMessage: "มีเหตุฉุกเฉินที่ส่งผลต่อคณะ กรุณาปฏิบัติตามคำแนะนำจากทางการ",
    title: "ข้อมูลสถานการณ์ฉุกเฉิน",
    lede: "ขณะนี้มีเหตุฉุกเฉินที่ส่งผลต่อคณะ โปรดปฏิบัติตามคำแนะนำของหน่วยงานฉุกเฉินและมหาวิทยาลัยธรรมศาสตร์เสมอ",
    immediateActions: [
      "หากคุณหรือคนใกล้ตัวตกอยู่ในอันตรายเฉพาะหน้า ให้โทรหาหน่วยงานฉุกเฉินก่อน: ตำรวจ 191 การแพทย์ 1669 ดับเพลิง 199",
      "ปฏิบัติตามคำแนะนำของเจ้าหน้าที่มหาวิทยาลัยธรรมศาสตร์และหน่วยงานฉุกเฉิน",
      "ติดตามหน้านี้และช่องทางทางการของ BIRSA เพื่อรับข้อมูลล่าสุดก่อนเชื่อแหล่งข้อมูลที่ยังไม่ยืนยัน",
      "ชาร์จโทรศัพท์ให้พร้อม และแจ้งครอบครัวหรือเพื่อนว่าคุณปลอดภัย",
    ],
    sections: [
      {
        heading: "ติดตามข้อมูล",
        body: [
          "ยึดแหล่งข้อมูลทางการเป็นหลัก: ประกาศของมหาวิทยาลัยธรรมศาสตร์ หน่วยงานฉุกเฉิน และหน้านี้",
          "ระวังข่าวลือในโซเชียลมีเดีย ตรวจสอบข้อมูลสำคัญกับแหล่งทางการก่อนตัดสินใจทำตาม",
        ],
      },
      {
        heading: "สำหรับนักศึกษาต่างชาติ",
        items: [
          "เก็บหนังสือเดินทางและเอกสารสำคัญไว้ในที่ปลอดภัยและหยิบใช้ได้ง่าย",
          "ตรวจสอบคำแนะนำการเดินทางจากรัฐบาลของคุณ และติดต่อสถานทูตหากต้องการความช่วยเหลือ",
        ],
      },
    ],
    extraContacts: [
      { label: "ตำรวจ (เหตุฉุกเฉินทั่วไป)", value: "191", href: "tel:191" },
      { label: "การแพทย์ฉุกเฉิน (EMS)", value: "1669", href: "tel:1669" },
      { label: "ดับเพลิงและกู้ภัย", value: "199", href: "tel:199" },
    ],
  },
};

export default generic;
