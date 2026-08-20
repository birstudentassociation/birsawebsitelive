import type { about as EnAbout } from "../en/about";

/**
 * Thai UI microcopy: the `about` namespace. Authored natively in Thai, never
 * translated from English (REDESIGN-2.0 §11.7; docs/EDITING.md).
 *
 * น้ำเสียง: เป็นทางการ ตรงไปตรงมา กระชับ และเป็นกลาง ไม่ใช้น้ำเสียงกันเองแบบรุ่นพี่คุยกับรุ่นน้อง
 * และไม่ใช้ภาษาราชการแข็ง ๆ ดูมาตรฐานเต็มได้ที่ docs/EDITING.md หัวข้อ "Voice and language"
 * โครงสร้างต้องตรงกับภาษาอังกฤษ แต่ถ้อยคำเขียนขึ้นใหม่สำหรับผู้อ่านภาษาไทย
 *
 * The annotation is the per-namespace half of the parity assertion: a missing
 * key or an invented one does not compile.
 */
export const about: typeof EnAbout = {
  // Empty for now. The wave that owns this namespace fills it in.
  // Adding a key here means adding the same key to the other locale in the
  // same change; the compiler will not let you forget.
};
