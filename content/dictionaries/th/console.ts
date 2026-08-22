import type { officerConsole as EnOfficerConsole } from "../en/console";

/**
 * Thai UI microcopy: the `console` namespace. Authored natively in Thai, never
 * translated from English (REDESIGN-2.0 §11.7; docs/EDITING.md).
 *
 * น้ำเสียง: เป็นทางการ ตรงไปตรงมา กระชับ และเป็นกลาง ไม่ใช้น้ำเสียงกันเองแบบรุ่นพี่คุยกับรุ่นน้อง
 * และไม่ใช้ภาษาราชการแข็ง ๆ ดูมาตรฐานเต็มได้ที่ docs/EDITING.md หัวข้อ "Voice and language"
 * โครงสร้างต้องตรงกับภาษาอังกฤษ แต่ถ้อยคำเขียนขึ้นใหม่สำหรับผู้อ่านภาษาไทย
 *
 * The annotation is the per-namespace half of the parity assertion: a missing
 * key or an invented one does not compile.
 */
export const officerConsole: typeof EnOfficerConsole = {
  officerHub: {
    metaTitle: "คอนโซลเจ้าหน้าที่",
    metaDescription:
      "หน้าสำหรับเจ้าหน้าที่ BIRSA เข้าสู่ระบบเพื่อจัดการการยืมอุปกรณ์ สิทธิ์การเข้าถึงของเจ้าหน้าที่ และบริการออนไลน์อื่นของเว็บไซต์",
    title: "คอนโซลเจ้าหน้าที่",
    lede: "เข้าสู่ระบบเพื่อจัดการการยืมอุปกรณ์ สิทธิ์การเข้าถึงของเจ้าหน้าที่ และบริการออนไลน์อื่นของ BIRSA",
    authNotConfiguredTitle: "ยังไม่ได้ตั้งค่าบัญชีเจ้าหน้าที่",
    authNotConfiguredBody: "ขณะนี้ยังไม่มีใครเข้าสู่ระบบคอนโซลเจ้าหน้าที่ได้",
    greeting: "เข้าสู่ระบบในชื่อ {name}",
    inventoryTitle: "อุปกรณ์และการยืม",
    inventoryBody: "รายการครุภัณฑ์ คำขอยืม ผู้ยืม และรายงานของ CBEMS",
    accessTitle: "ทะเบียนสิทธิ์การเข้าถึง",
    accessBody: "บัญชีเจ้าหน้าที่ทุกคน ฝ่ายที่รับผิดชอบ และวันที่สิทธิ์การเข้าถึงจะสิ้นสุด",
    studioTitle: "สตูดิโอจัดการเนื้อหา",
    studioBody: "ที่เจ้าหน้าที่ใช้แก้ไขหน้าเว็บและบทความ",
    studioSignInNote: "สตูดิโอใช้ระบบเข้าสู่ระบบแยกจากคอนโซลนี้ ให้เข้าสู่ระบบด้วยบัญชี Sanity ที่ BIRSA มอบให้",
    studioHistoryNote: "แผนนี้เก็บประวัติเอกสารไว้ {days} วัน หลังจากนั้นต้องให้ผู้ดูแลระบบกู้คืนเวอร์ชันเก่าจากข้อมูลสำรอง",
    studioLinkLabel: "เปิดสตูดิโอจัดการเนื้อหา",
  },
  officerAccess: {
    metaTitle: "ทะเบียนสิทธิ์การเข้าถึง",
    metaDescription:
      "บัญชีเจ้าหน้าที่ทุกคนและสิ่งที่แต่ละคนถืออยู่ พร้อมผลการตรวจสอบสิทธิ์ที่คลาดเคลื่อนประจำวัน",
    title: "ทะเบียนสิทธิ์การเข้าถึง",
    lede: "บัญชีเจ้าหน้าที่ทุกคนและสิ่งที่แต่ละคนถืออยู่ พร้อมรายชื่อผู้แก้ไขหน้าเว็บได้เมื่อเชื่อมต่อสตูดิโอแล้ว",
    consoleHomeLabel: "คอนโซลเจ้าหน้าที่",
    signInNeededTitle: "กรุณาเข้าสู่ระบบก่อน",
    signInNeededBody: "เข้าสู่ระบบที่หน้าแรกของคอนโซลเจ้าหน้าที่เพื่อดูทะเบียนสิทธิ์การเข้าถึง",
    signInLink: "ไปที่คอนโซลเจ้าหน้าที่",
    adminsOnlyTitle: "สำหรับผู้ดูแลระบบเท่านั้น",
    adminsOnlyBody:
      "เฉพาะเจ้าหน้าที่ที่มีบทบาทผู้ดูแลระบบเท่านั้นที่ดูทะเบียนสิทธิ์การเข้าถึงได้ เนื่องจากมีข้อมูลส่วนบุคคลของทุกคน",
    dbNotConfiguredTitle: "ยังไม่ได้เชื่อมต่อฐานข้อมูลเจ้าหน้าที่",
    dbNotConfiguredBody: "ยังไม่ได้ตั้งค่า POSTGRES_URL จึงยังไม่มีทะเบียนให้แสดงในขณะนี้",
    officersHeading: "เจ้าหน้าที่",
    officersLede: "บัญชีทุกบัญชีที่เข้าสู่ระบบคอนโซลเจ้าหน้าที่ได้",
    officersCaption: "บัญชีเจ้าหน้าที่",
    officersEmpty: "ยังไม่มีบัญชีเจ้าหน้าที่",
    colName: "ชื่อ",
    colEmail: "อีเมล",
    colRole: "บทบาทในคอนโซล",
    colPortfolio: "ฝ่ายที่รับผิดชอบ",
    colTermEnd: "วันที่สิ้นสุดวาระ",
    colStatus: "สถานะ",
    statusActive: "ใช้งานอยู่",
    statusInactive: "ปิดใช้งาน",
    noPortfolioText: "ไม่ได้ระบุ (เจ้าหน้าที่ส่วนกลาง)",
    unrecognisedPortfolioSuffix: "(ไม่ตรงกับฝ่ายที่มีอยู่)",
    noTermEndText: "ไม่ได้ตั้งวันสิ้นสุด",
    termEndedSuffix: "วาระสิ้นสุดแล้ว",
    studioHeading: "สตูดิโอจัดการเนื้อหา",
    studioBlockedTitle: "ยังไม่ได้เชื่อมต่อสตูดิโอ",
    studioBlockedBody:
      "BIRSA ยังไม่ได้ยื่นขอแผนโฮสติ้ง Sanity จึงยังไม่มีโปรเจกต์สตูดิโอให้อ่านรายชื่อสมาชิก ทะเบียนนี้จึงยังแสดงรายชื่อผู้แก้ไขหน้าเว็บและบทความไม่ได้จนกว่าจะตั้งค่าเสร็จ เมื่อพร้อมแล้วจะแสดงรายชื่อสมาชิกสตูดิโอในหน้านี้ควบคู่กับเจ้าหน้าที่",
    driftHeading: "สิทธิ์การเข้าถึงที่คลาดเคลื่อน",
    driftLede: "ผลการตรวจสอบประจำวัน",
    pastTermEndHeading: "พ้นวาระแล้ว",
    pastTermEndEmpty: "ไม่มีเจ้าหน้าที่คนใดพ้นวาระ",
    noTermEndHeading: "ไม่ได้ตั้งวันสิ้นสุดวาระ",
    noTermEndEmpty: "เจ้าหน้าที่ที่ใช้งานอยู่ทุกคนมีวันสิ้นสุดวาระแล้ว",
    underStaffedHeading: "มีผู้ถือครองน้อยกว่าสองคน",
    underStaffedEmpty: "ทุกฝ่ายมีผู้ถือครองอย่างน้อยสองคน",
    underStaffedCapabilityCol: "ฝ่ายหรือบทบาท",
    underStaffedHoldersCol: "ผู้ถือครอง",
    studioDriftHeading: "สมาชิกสตูดิโอที่ไม่มีบัญชีเจ้าหน้าที่",
    studioDriftBlockedBody: "ยังตรวจสอบรายการนี้ไม่ได้ ต้องรอการเชื่อมต่อสตูดิโอด้านบนก่อน",
    studioDriftEmpty: "สมาชิกสตูดิโอทุกคนมีบัญชีเจ้าหน้าที่แล้ว",
  },
};
