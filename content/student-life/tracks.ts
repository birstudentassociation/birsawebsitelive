/**
 * Per-track title/lede copy for the three student-life guide tracks (home,
 * international, handbook). Shared between `[audience]/page.tsx` (each
 * track's own listing page) and the `/student-life` index (`page.tsx`),
 * which surfaces all three tracks as cards. Authored natively per locale,
 * not translated (see `content/home/th.ts` for the same convention).
 */
import type { Locale } from "@/lib/i18n";
import type { GuideAudience } from "@/lib/content";

export type StudentLifeTrackCopy = { title: string; lede: string };

export const studentLifeTracks: Record<Locale, Record<GuideAudience, StudentLifeTrackCopy>> = {
  en: {
    home: {
      title: "Student life and culture guides",
      lede: "Practical, everyday guidance for all BIR students, plus the kind of non-obvious, culturally-enriching knowledge you only pick up from someone who's already been through it. Pick a topic below to get started.",
    },
    international: {
      title: "For international students",
      lede: "Everything you need for your first weeks and beyond in Bangkok. A condensed Thai-language version of each section is also available, written for Thai buddies and staff who support international students.",
    },
    handbook: {
      title: "Student handbook",
      lede: "The BIR student handbook: admission and fees, the curriculum and the 2023 revised study plan, the academic rules that govern your degree, the internship, and academic activities. Based on the 2021 edition, with the study plan updated to the 2023 revision. Read it in order or jump to the chapter you need.",
    },
  },
  th: {
    home: {
      title: "คู่มือชีวิตนักศึกษาและวัฒนธรรม",
      lede: "คำแนะนำที่ใช้ได้จริงในชีวิตประจำวันสำหรับนักศึกษา BIR ทุกคน พร้อมเกร็ดความรู้ด้านวัฒนธรรมที่ไม่ค่อยมีใครพูดถึง เลือกหัวข้อด้านล่างเพื่อเริ่มอ่าน",
    },
    international: {
      title: "สำหรับนักศึกษาต่างชาติ",
      lede: "หน้านี้เป็นเวอร์ชันสรุปย่อของคู่มือสำหรับนักศึกษาต่างชาติ เขียนไว้ให้เพื่อนบัดดี้ไทยและเจ้าหน้าที่ที่ช่วยดูแลนักศึกษาต่างชาติเข้าใจภาพรวม เนื้อหาฉบับเต็มอยู่ในเวอร์ชันภาษาอังกฤษ",
    },
    handbook: {
      title: "คู่มือนักศึกษา",
      lede: "คู่มือนักศึกษา BIR ครอบคลุมการรับเข้าและค่าเล่าเรียน โครงสร้างหลักสูตรและแผนการศึกษาฉบับปรับปรุง พ.ศ. 2566 ระเบียบด้านการเรียนที่เกี่ยวกับการสำเร็จการศึกษา การฝึกงาน และกิจกรรมทางวิชาการ อ้างอิงจากฉบับ พ.ศ. 2564 โดยปรับแผนการศึกษาเป็นฉบับปรับปรุง พ.ศ. 2566 อ่านตามลำดับหรือข้ามไปยังบทที่ต้องการได้เลย",
    },
  },
};
