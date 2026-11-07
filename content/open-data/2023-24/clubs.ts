import type { Bilingual, Topic } from "@/lib/open-data";

const sport: Bilingual = { en: "Sports", th: "กีฬา" };

export const clubs: Topic = {
  slug: "clubs",
  title: {
    en: "Which clubs took part in Club Day",
    th: "ชมรมใดบ้างที่ร่วมงาน Club Day",
  },
  summary: {
    en: "Eight clubs were registered under BIRSA for Club Day on 21 August 2023, four of them sports clubs.",
    th: "มี 8 ชมรมที่ขึ้นทะเบียนกับ BIRSA เพื่อร่วม Club Day วันที่ 21 สิงหาคม 2566 โดย 4 ชมรมเป็นชมรมกีฬา",
  },
  mainPoints: [
    {
      en: "The Club Day meeting of 24 July 2023 records 8 clubs registered under BIRSA.",
      th: "การประชุม Club Day วันที่ 24 กรกฎาคม 2566 บันทึกว่ามี 8 ชมรมขึ้นทะเบียนกับ BIRSA",
    },
    {
      en: "Four of the 8 clubs are sports clubs. The others cover music, media, writing and volunteering.",
      th: "4 จาก 8 ชมรมเป็นชมรมกีฬา ที่เหลือเป็นดนตรี สื่อ การเขียน และจิตอาสา",
    },
    {
      en: "Club Day budgeted ฿4,300 for equipment for all clubs.",
      th: "Club Day ตั้งงบค่าอุปกรณ์สำหรับทุกชมรม 4,300 บาท",
    },
    {
      en: "BIRSA met club representatives on 12 June 2023, and met clubs 4 times in total.",
      th: "BIRSA พบตัวแทนชมรมวันที่ 12 มิถุนายน 2566 และประชุมกับชมรมรวม 4 ครั้ง",
    },
  ],
  warning: {
    en: "This is the list of Club Day booths in July 2023. It is not a full club register and holds no membership or funding figures.",
    th: "นี่คือรายชื่อบูธ Club Day ในเดือนกรกฎาคม 2566 ไม่ใช่ทะเบียนชมรมฉบับเต็ม และไม่มีตัวเลขสมาชิกหรืองบสนับสนุน",
  },
  datasets: [
    {
      id: "club-day-booths",
      title: { en: "Clubs registered for Club Day", th: "ชมรมที่ลงทะเบียนร่วม Club Day" },
      summary: {
        en: "Eight clubs were registered under BIRSA for Club Day, including four sports clubs.",
        th: "มี 8 ชมรมลงทะเบียนกับ BIRSA เพื่อร่วม Club Day รวมชมรมกีฬา 4 ชมรม",
      },
      columns: [
        { key: "club", label: { en: "Club", th: "ชมรม" }, kind: "text" },
        { key: "type", label: { en: "Type", th: "ประเภท" }, kind: "text" },
      ],
      rows: [
        { club: { en: "Basketball, women", th: "บาสเกตบอลหญิง" }, type: sport },
        { club: { en: "Basketball, men", th: "บาสเกตบอลชาย" }, type: sport },
        { club: { en: "Volleyball", th: "วอลเลย์บอล" }, type: sport },
        { club: { en: "Football", th: "ฟุตบอล" }, type: sport },
        { club: { en: "BIR Music", th: "BIR Music" }, type: { en: "Music", th: "ดนตรี" } },
        { club: { en: "BIRify", th: "BIRify" }, type: { en: "Media", th: "สื่อ" } },
        {
          club: { en: "Writer club", th: "ชมรมนักเขียน" },
          type: { en: "Writing", th: "การเขียน" },
        },
        { club: { en: "ASA IR", th: "ASA IR" }, type: { en: "Volunteering", th: "จิตอาสา" } },
      ],
      notes: [
        {
          en: "Club types are grouped by this page from what the minutes say about each club.",
          th: "ประเภทของชมรมจัดกลุ่มโดยหน้านี้ จากสิ่งที่รายงานการประชุมกล่าวถึงแต่ละชมรม",
        },
      ],
      source: {
        en: "BIRSA Club Day meeting minutes of 24 July 2023",
        th: "รายงานการประชุม Club Day ของ BIRSA วันที่ 24 กรกฎาคม 2566",
      },
      period: { en: "July 2023", th: "กรกฎาคม 2566" },
    },
  ],
};
