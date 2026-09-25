/**
 * Every phone line, address and site the emergency guides point to, defined
 * once. Guides list contacts by id, so a number that changes is changed in one
 * place, and the `tel:` link is derived from the digits shown so the two cannot
 * drift apart.
 *
 * Checked against each organisation's own published details on 25 September
 * 2026 (see the `sources` on each guide).
 */
import type { LocalizedText } from "@/content/emergency/types";

type Base = {
  name: LocalizedText;
  /** Hours, languages or what the line is for. */
  note?: LocalizedText;
};

export type EmergencyContact = Base &
  (
    | { kind: "phone"; phone: string; ext?: string }
    | { kind: "email"; email: string }
    | { kind: "web"; url: string; display: string }
  );

const allHours: LocalizedText = { en: "24 hours, free", th: "ตลอด 24 ชั่วโมง ไม่เสียค่าโทร" };

export const contacts = {
  police: {
    kind: "phone",
    phone: "191",
    name: { en: "Police emergency", th: "แจ้งเหตุด่วนเหตุร้าย ตำรวจ" },
    note: allHours,
  },
  ambulance: {
    kind: "phone",
    phone: "1669",
    name: { en: "Ambulance and medical emergency", th: "เจ็บป่วยฉุกเฉิน เรียกรถพยาบาล" },
    note: allHours,
  },
  fire: {
    kind: "phone",
    phone: "199",
    name: { en: "Fire and rescue", th: "ดับเพลิงและกู้ภัย" },
    note: allHours,
  },
  touristPolice: {
    kind: "phone",
    phone: "1155",
    name: { en: "Tourist Police", th: "ตำรวจท่องเที่ยว" },
    note: {
      en: "24 hours, in English and other languages. The best line if you do not speak Thai.",
      th: "ตลอด 24 ชั่วโมง มีเจ้าหน้าที่พูดภาษาอังกฤษและภาษาอื่น เหมาะกับเพื่อนต่างชาติที่ไม่พูดภาษาไทย",
    },
  },
  erawan: {
    kind: "phone",
    phone: "1646",
    name: {
      en: "Erawan Centre, Bangkok's emergency medical service",
      th: "ศูนย์เอราวัณ กรุงเทพมหานคร",
    },
    note: allHours,
  },
  ddpm: {
    kind: "phone",
    phone: "1784",
    name: {
      en: "Department of Disaster Prevention and Mitigation (DDPM)",
      th: "กรมป้องกันและบรรเทาสาธารณภัย (ปภ.)",
    },
    note: {
      en: "24 hours. Disaster reports and help after floods, storms and earthquakes.",
      th: "ตลอด 24 ชั่วโมง แจ้งเหตุและขอความช่วยเหลือจากภัยพิบัติ เช่น น้ำท่วม วาตภัย แผ่นดินไหว",
    },
  },
  bma: {
    kind: "phone",
    phone: "1555",
    name: { en: "Bangkok Metropolitan Administration (BMA)", th: "กรุงเทพมหานคร สายด่วน 1555" },
    note: {
      en: "24 hours. Report flooding, blocked drains and fallen trees in Bangkok.",
      th: "ตลอด 24 ชั่วโมง แจ้งน้ำท่วม ท่อระบายน้ำอุดตัน ต้นไม้ล้ม ในกรุงเทพฯ",
    },
  },
  bmaFlood: {
    kind: "phone",
    phone: "02-248-5115",
    name: { en: "BMA flood control centre", th: "ศูนย์ป้องกันน้ำท่วม สำนักการระบายน้ำ กทม." },
  },
  mea: {
    kind: "phone",
    phone: "1130",
    name: {
      en: "Metropolitan Electricity Authority (MEA)",
      th: "การไฟฟ้านครหลวง (MEA)",
    },
    note: {
      en: "24 hours. Fallen cables, sparking equipment and power cuts.",
      th: "ตลอด 24 ชั่วโมง สายไฟขาด อุปกรณ์ไฟฟ้ามีประกายไฟ ไฟดับ",
    },
  },
  tmd: {
    kind: "phone",
    phone: "1182",
    name: { en: "Thai Meteorological Department", th: "กรมอุตุนิยมวิทยา" },
    note: {
      en: "Weather warnings and earthquake reports.",
      th: "ประกาศเตือนสภาพอากาศและรายงานแผ่นดินไหว",
    },
  },
  ddc: {
    kind: "phone",
    phone: "1422",
    name: { en: "Department of Disease Control hotline", th: "สายด่วนกรมควบคุมโรค" },
    note: {
      en: "Advice on infectious diseases and outbreaks.",
      th: "ให้คำแนะนำเรื่องโรคติดต่อและการระบาด",
    },
  },
  mentalHealth: {
    kind: "phone",
    phone: "1323",
    name: { en: "Mental health hotline", th: "สายด่วนสุขภาพจิต กรมสุขภาพจิต" },
    note: {
      en: "24 hours, free, mostly in Thai. Talk to someone if what happened is weighing on you.",
      th: "ตลอด 24 ชั่วโมง ไม่เสียค่าใช้จ่าย โทรคุยได้เมื่อรู้สึกหนักใจกับสิ่งที่เกิดขึ้น",
    },
  },
  tuClinic: {
    kind: "phone",
    phone: "02-613-3961",
    name: { en: "TU Virtual Clinic, Tha Prachan", th: "ห้องพยาบาล Virtual Clinic ท่าพระจันทร์" },
    note: {
      en: "Weekdays 08:30 to 16:30, closed on public holidays. Ground floor of the Student Activities Centre (Building 21).",
      th: "วันจันทร์ถึงศุกร์ 08.30 ถึง 16.30 น. ปิดวันหยุดราชการ ชั้น 1 อาคารกิจกรรมนักศึกษา (อาคาร 21)",
    },
  },
  siriraj: {
    kind: "phone",
    phone: "02-419-7000",
    name: { en: "Siriraj Hospital", th: "โรงพยาบาลศิริราช" },
    note: {
      en: "The nearest large hospital, across the river from Tha Prachan. The line is in Thai only.",
      th: "โรงพยาบาลขนาดใหญ่ที่ใกล้ที่สุด อยู่ฝั่งตรงข้ามแม่น้ำจากท่าพระจันทร์",
    },
  },
  tlhr: {
    kind: "phone",
    phone: "092-271-3172",
    name: {
      en: "Thai Lawyers for Human Rights (TLHR)",
      th: "ศูนย์ทนายความเพื่อสิทธิมนุษยชน",
    },
    note: {
      en: "24 hours. Free legal help if you or someone you know is detained or charged over free expression or assembly. Second line 096-789-3173.",
      th: "ตลอด 24 ชั่วโมง ช่วยเหลือทางกฎหมายโดยไม่มีค่าใช้จ่าย หากคุณหรือคนรู้จักถูกควบคุมตัวหรือถูกดำเนินคดีจากการแสดงออกหรือการชุมนุม สายสำรอง 096-789-3173",
    },
  },
  tuLaw: {
    kind: "phone",
    phone: "02-613-2128",
    name: {
      en: "TU Law Center, Tha Prachan",
      th: "ศูนย์นิติศาสตร์ มหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์",
    },
    note: {
      en: "Free legal advice for Thammasat students.",
      th: "ให้คำปรึกษาทางกฎหมายแก่นักศึกษาธรรมศาสตร์โดยไม่มีค่าใช้จ่าย",
    },
  },
  tuSwitchboard: {
    kind: "phone",
    phone: "02-613-3333",
    name: { en: "Thammasat University switchboard", th: "มหาวิทยาลัยธรรมศาสตร์ (โทรศัพท์กลาง)" },
  },
  facultyOffice: {
    kind: "phone",
    phone: "02-221-6111",
    ext: "3400",
    name: { en: "Faculty of Political Science office", th: "สำนักงานคณะรัฐศาสตร์" },
    note: {
      en: "Weekdays 09:00 to 16:00. Email polscitu@tu.ac.th.",
      th: "วันจันทร์ถึงศุกร์ 09.00 ถึง 16.00 น. อีเมล polscitu@tu.ac.th",
    },
  },
  birOffice: {
    kind: "phone",
    phone: "02-221-6111",
    ext: "3409",
    name: { en: "BIR Programme office", th: "สำนักงานหลักสูตร BIR" },
    note: {
      en: "Weekdays. Email bir@tu.ac.th.",
      th: "วันจันทร์ถึงศุกร์ อีเมล bir@tu.ac.th",
    },
  },
  oia: {
    kind: "phone",
    phone: "02-613-3022",
    name: {
      en: "Office of International Affairs (OIA), Thammasat",
      th: "กองวิเทศสัมพันธ์ มหาวิทยาลัยธรรมศาสตร์",
    },
    note: {
      en: "Visas and help for international students. Email info.inter@tu.ac.th.",
      th: "เรื่องวีซ่าและการช่วยเหลือนักศึกษาต่างชาติ อีเมล info.inter@tu.ac.th",
    },
  },
  air4thai: {
    kind: "web",
    url: "https://air4thai.pcd.go.th",
    display: "air4thai.pcd.go.th",
    name: {
      en: "Air4Thai, official air quality readings",
      th: "Air4Thai ค่าคุณภาพอากาศอย่างเป็นทางการ",
    },
    note: {
      en: "Pollution Control Department. Also an app.",
      th: "กรมควบคุมมลพิษ มีแอปพลิเคชันด้วย",
    },
  },
} satisfies Record<string, EmergencyContact>;

export type ContactId = keyof typeof contacts;

/** Look up a contact by id. */
export function getContact(id: string): EmergencyContact | undefined {
  return Object.prototype.hasOwnProperty.call(contacts, id)
    ? (contacts as Record<string, EmergencyContact>)[id]
    : undefined;
}

/**
 * `tel:` target for a phone contact. Digits only, with a pause (`,`) before
 * any extension so the phone dials it once the call connects.
 */
export function telHref(contact: { phone: string; ext?: string }): string {
  const digits = contact.phone.replace(/\D/g, "");
  return `tel:${digits}${contact.ext ? `,${contact.ext}` : ""}`;
}
