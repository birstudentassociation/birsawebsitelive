import type { studies as EnStudies } from "../en/studies";

/**
 * Thai UI microcopy: the `studies` namespace. Authored natively in Thai, never
 * translated from English (REDESIGN-2.0 §11.7; docs/EDITING.md).
 *
 * น้ำเสียง: เป็นทางการ ตรงไปตรงมา กระชับ และเป็นกลาง ไม่ใช้น้ำเสียงกันเองแบบรุ่นพี่คุยกับรุ่นน้อง
 * และไม่ใช้ภาษาราชการแข็ง ๆ ดูมาตรฐานเต็มได้ที่ docs/EDITING.md หัวข้อ "Voice and language"
 * โครงสร้างต้องตรงกับภาษาอังกฤษ แต่ถ้อยคำเขียนขึ้นใหม่สำหรับผู้อ่านภาษาไทย
 *
 * The annotation is the per-namespace half of the parity assertion: a missing
 * key or an invented one does not compile.
 */
export const studies: typeof EnStudies = {
  courseReview: {
    title: "รีวิวรายวิชา",
    lede: "ค้นหารายวิชาทั้งหมดของ BIR ทั้งรหัสวิชา หน่วยกิต วิชาบังคับก่อน และคำอธิบายของทุกรายวิชาในหลักสูตร",
    browseHeading: "เรียกดูรายวิชา",
    searchPlaceholder: "ค้นหาด้วยรหัสวิชา ชื่อวิชา หรือคำสำคัญ…",
    statsHeading: "ภาพรวม",
    statsTotalCourses: "จำนวนรายวิชาทั้งหมด",
    statsTotalCredits: "หน่วยกิตรวม ถ้าลงทุกวิชา",
    statsTracks: "กลุ่มวิชาโท",
    statsByTrack: "จำนวนวิชาแยกตามกลุ่ม",
    trackLabel: "กลุ่มวิชา",
    allTracks: "ทุกกลุ่มวิชา",
    tracks: {
      foundational: "วิชาพื้นฐาน",
      "international-relations": "ความสัมพันธ์ระหว่างประเทศ",
      "governance-transnational": "โลกาภิบาลและประเด็นข้ามชาติ",
      "public-admin-policy": "บริหารรัฐกิจและนโยบายสาธารณะ",
      "global-political-economy": "เศรษฐกิจการเมืองโลก",
    },
    categories: {
      "general-education": "ศึกษาทั่วไป",
      core: "วิชาบังคับ",
      required: "วิชาบังคับเฉพาะ",
      "elective-area": "วิชาเลือก: อาณาบริเวณศึกษา",
      "elective-approach": "วิชาเลือก: แนวทางการศึกษา",
      "minor-required": "วิชาโท: บังคับ",
      "minor-elective": "วิชาโท: เลือก",
      "free-elective": "วิชาเลือกเสรี",
    },
    credits: "หน่วยกิต",
    yearLabel: "ชั้นปี",
    prerequisite: "วิชาบังคับก่อน",
    instructorsHeading: "ผู้สอน",
    instructorsNote: "ข้อมูลจากทำเนียบคณาจารย์ คณะรัฐศาสตร์ ผู้สอนอาจเปลี่ยนแปลงในแต่ละภาคการศึกษา",
    previous: "ก่อนหน้า",
    next: "ถัดไป",
    pageOf: "หน้า {current} จาก {total}",
    backToGuides: "กลับไปคู่มือชีวิตนักศึกษาและวัฒนธรรม",
    openCourse: "ดูรายวิชาและรีวิว",
    reviewedBadge: "มีรีวิว",
    sampleBadge: "รีวิวตัวอย่าง",
    sampleReviewTitle: "เนื้อหาตัวอย่าง ไม่ใช่รีวิวจริง",
    sampleReviewBody:
      "ทุกอย่างในส่วนนี้เขียนขึ้นเพื่อแสดงให้เห็นว่ารีวิวรายวิชาฉบับสมบูรณ์จะมีหน้าตาอย่างไร คะแนน ปริมาณงาน เคล็ดลับ และคำพูดด้านล่างไม่ใช่ความเห็นจริงของนักศึกษา จึงไม่ควรใช้ประกอบการตัดสินใจลงทะเบียนเรียน BIRSA จะแทนที่ด้วยรีวิวจริงเมื่อรวบรวมได้แล้ว",
    descriptionHeading: "คำอธิบายรายวิชา",
    reviewHeading: "รีวิวจากนักศึกษา",
    reviewBasedOn: "รวบรวมจากรีวิวของนักศึกษา {count} คน",
    ratingOverall: "คะแนนโดยรวม",
    ratingWorkload: "ปริมาณงาน",
    ratingDifficulty: "ความยาก",
    ratingOutOf: "/ 5",
    workloadHeading: "ปริมาณงานเป็นอย่างไร",
    assessmentHeading: "วัดผลอย่างไร",
    tipsHeading: "เคล็ดลับจากรุ่นพี่",
    quotesHeading: "เสียงจากนักศึกษา",
    noReviewTitle: "ยังไม่มีรีวิวจากนักศึกษา",
    noReviewBody:
      "BIRSA ยังไม่มีรีวิวจากนักศึกษาสำหรับวิชานี้ ถ้าคุณเคยเรียนวิชานี้และยินดีเขียนรีวิวสั้น ๆ อย่างตรงไปตรงมา ติดต่อเราได้",
    backToCatalog: "กลับไปหน้ารวมรายวิชา",
  },
};
