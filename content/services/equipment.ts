/**
 * Equipment loan catalogue. Each item is quantity-tracked: `quantity` is the
 * total number of units BIRSA owns, and availability is computed at request
 * time from active (pending/approved) loan rows in the database.
 */

export type EquipmentItem = {
  key: string;
  category: { en: string; th: string };
  name: { en: string; th: string };
  description: { en: string; th: string };
  quantity: number;
  storageLocation: { en: string; th: string };
  maxLoanDays: number;
};

export const equipmentItems: EquipmentItem[] = [
  {
    key: "first-aid-kit",
    quantity: 1,
    maxLoanDays: 7,
    category: {
      en: "Health & safety",
      th: "สุขภาพและความปลอดภัย",
    },
    name: {
      en: "First-aid kit",
      th: "ชุดปฐมพยาบาล",
    },
    description: {
      en: "A basic first-aid kit for events and activities, stocked with bandages, antiseptic wipes, plasters, and other essential supplies. Please check contents before and after use and report anything missing or running low.",
      th: "ชุดปฐมพยาบาลเบื้องต้นสำหรับกิจกรรมและงานต่าง ๆ ประกอบด้วยผ้าพันแผล แอลกอฮอล์เช็ดทำความสะอาด พลาสเตอร์ปิดแผล และอุปกรณ์จำเป็นอื่น ๆ กรุณาตรวจสอบอุปกรณ์ภายในก่อนและหลังใช้งาน และแจ้งหากมีของขาดหรือใกล้หมด",
    },
    // Placeholder location: update once BIRSA confirms a permanent office/storage room.
    storageLocation: {
      en: "BIRSA office (room to be confirmed)",
      th: "ห้อง BIRSA (รอยืนยันห้อง)",
    },
  },
];

export function getEquipmentItem(key: string): EquipmentItem | undefined {
  return equipmentItems.find((item) => item.key === key);
}
