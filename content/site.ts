/**
 * Site-wide configuration: socials, contact details, official external
 * links. Typed and per-locale so components never hard-code copy.
 */
import type { Locale } from "@/lib/i18n";

export type LocalizedText = Record<Locale, string>;

export type Social = {
  id: "instagram" | "facebook" | "email" | "line";
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
  {
    id: "line",
    label: "LINE",
    href: "#",
    placeholder: true,
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
