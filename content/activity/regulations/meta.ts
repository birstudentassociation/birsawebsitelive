/**
 * Front-matter of the Notice: citation, issuing authority, recital, and the
 * signature block. Authored bilingually; the Thai is transcribed from the
 * official document, the English is a faithful reference translation.
 */
import type { Regulation } from "./types";

export const meta: Omit<Regulation, "parts"> = {
  shortTitle: {
    en: "Student Activities Notice (B.E. 2565)",
    th: "ประกาศ เรื่อง กิจกรรมนักศึกษา คณะรัฐศาสตร์ พ.ศ. 2565",
  },
  citation: {
    en: "Notice of the Faculty of Political Science, Thammasat University, on Student Activities of the Faculty of Political Science, B.E. 2565 (2022)",
    th: "ประกาศคณะรัฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์ เรื่อง กิจกรรมนักศึกษา คณะรัฐศาสตร์ พ.ศ. 2565",
  },
  authority: {
    en: "Faculty of Political Science, Thammasat University",
    th: "คณะรัฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์",
  },
  preamble: {
    en: "Whereas it is expedient to issue a notice on the student activities of the Faculty of Political Science; by virtue of Chapter 3 of the Regulation of Thammasat University on Student Activities, B.E. 2563 (2020), the Faculty of Political Science hereby issues the following Notice.",
    th: "โดยที่เป็นการสมควรออกประกาศว่าด้วยกิจกรรมนักศึกษา คณะรัฐศาสตร์ อาศัยอำนาจตามความในข้อบังคับมหาวิทยาลัยธรรมศาสตร์ ว่าด้วยกิจกรรมนักศึกษา มหาวิทยาลัยธรรมศาสตร์ พ.ศ. 2563 หมวด 3 จึงออกประกาศคณะรัฐศาสตร์ ไว้ดังต่อไปนี้",
  },
  made: {
    en: "Made on 24 February B.E. 2565 (2022)",
    th: "ประกาศ ณ วันที่ 24 กุมภาพันธ์ พ.ศ. 2565",
  },
  signatory: {
    en: "Assistant Professor Dr Tavida Kamolvej, Dean of the Faculty of Political Science",
    th: "(ผู้ช่วยศาสตราจารย์ ดร. ทวิดา กมลเวชช) คณบดีคณะรัฐศาสตร์",
  },
};
