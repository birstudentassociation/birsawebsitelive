import type { a11y as EnA11y } from "../en/a11y";

/**
 * Thai UI microcopy: the `a11y` namespace. Authored natively in Thai, never
 * translated from English (REDESIGN-2.0 §11.7; docs/EDITING.md).
 *
 * น้ำเสียง: เป็นทางการ ตรงไปตรงมา กระชับ และเป็นกลาง ไม่ใช้น้ำเสียงกันเองแบบรุ่นพี่คุยกับรุ่นน้อง
 * และไม่ใช้ภาษาราชการแข็ง ๆ ดูมาตรฐานเต็มได้ที่ docs/EDITING.md หัวข้อ "Voice and language"
 * โครงสร้างต้องตรงกับภาษาอังกฤษ แต่ถ้อยคำเขียนขึ้นใหม่สำหรับผู้อ่านภาษาไทย
 *
 * The annotation is the per-namespace half of the parity assertion: a missing
 * key or an invented one does not compile.
 */
export const a11y: typeof EnA11y = {
  a11y: {
    skip: "ข้ามไปยังเนื้อหาหลัก",
    primaryNav: "เมนูหลัก",
    openMenu: "เมนู",
    closeMenu: "ปิดเมนู",
    closeSearch: "ปิดการค้นหา",
    breadcrumb: "เส้นทางการนำทาง",
    youAreHere: "คุณอยู่ที่นี่",
    currentPage: "หน้าปัจจุบัน",
    onThisPage: "ในหน้านี้",
    newTab: "เปิดในแท็บใหม่",
    externalLink: "ลิงก์ภายนอก",
    table: "ตาราง",
    languageSelector: "ภาษา",
    logoHome: "BIRSA, กลับหน้าแรก",
    loading: "กำลังโหลด",
    theme: "ธีม",
    themeDark: "เปลี่ยนเป็นโหมดมืด",
    themeLight: "เปลี่ยนเป็นโหมดสว่าง",
    back: "ย้อนกลับ",
    serviceNavigation: "เมนูสำหรับ{service}",
    footerNav: "ลิงก์ท้ายเว็บไซต์",
    paginationNav: "การแบ่งหน้า",
    paginationPrevious: "ก่อนหน้า",
    paginationNext: "ถัดไป",
    paginationPage: "หน้า {page}",
    paginationPreviousPage: "ย้อนกลับไปหน้า {page}",
    paginationNextPage: "ไปหน้า {page}",
  },
};
