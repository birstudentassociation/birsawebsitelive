/**
 * Site-wide configuration: socials, contact details, official external
 * links. Typed and per-locale so components never hard-code copy.
 */
import type { Locale } from "@/lib/i18n";

export type LocalizedText = Record<Locale, string>;

export type Social = {
  id: "instagram" | "facebook" | "email";
  label: string;
  href: string;
  /** True when the destination is not yet a real BIRSA-owned channel. */
  placeholder?: boolean;
};

export const socials: Social[] = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/student_birsa/",
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/BIRStudentAssociation/",
  },
  {
    id: "email",
    label: "Email",
    href: "mailto:birsa@tu.ac.th",
  },
];

export const contact = {
  address: {
    th: "หลักสูตร BIR คณะรัฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์ 2 ถนนพระจันทร์ กรุงเทพฯ 10200",
    en: "BIR, Faculty of Political Science, Thammasat University, 2 Prachan Road, Bangkok 10200",
  } satisfies LocalizedText,
  phone: "02-221-6111 ext. 3409",
  email: "birsa@tu.ac.th",
  secondaryEmail: "birstudentassociation@gmail.com",
};

/**
 * The BIR office, the Faculty's own office for the programme (see the "About
 * BIR" guide). It answers academic questions and announces BIR's academic
 * dates, on its website and the BIR Program Facebook page. BIRSA does neither,
 * so every "ask about your studies" route on this site ends here.
 */
export const birOffice = {
  email: "bir@tu.ac.th",
  phone: { phone: "02-221-6111", ext: "3409" },
  website: "https://www.birpolsci.com",
  websiteLabel: "birpolsci.com",
  /** The guide section with the office's contact details, and its heading's anchor in each language. */
  contactPath: "/student-life/first-weeks/about-bir",
  contactAnchor: {
    en: "contact-the-bir-office",
    th: "ติดต่อสำนักงานโครงการ-bir",
  } satisfies LocalizedText,
};

export type OfficialLink = {
  id: "birProgram" | "faculty" | "registrar" | "university";
  label: LocalizedText;
  href: string;
};

export const officialLinks: OfficialLink[] = [
  {
    id: "birProgram",
    label: { th: "หลักสูตร BIR", en: "BIR Programme" },
    href: "https://www.birpolsci.com",
  },
  {
    id: "faculty",
    label: { th: "คณะรัฐศาสตร์ มธ.", en: "Faculty of Political Science" },
    href: "https://polsci.tu.ac.th",
  },
  {
    id: "registrar",
    label: { th: "สำนักทะเบียน มธ.", en: "TU registrar" },
    href: "https://www.reg.tu.ac.th",
  },
  {
    id: "university",
    label: { th: "มหาวิทยาลัยธรรมศาสตร์", en: "Thammasat University" },
    href: "https://tu.ac.th",
  },
];
