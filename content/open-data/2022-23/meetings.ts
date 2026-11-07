import type { Topic } from "@/lib/open-data";

const body = { en: "Executive committee", th: "คณะกรรมการบริหารสโมสร" };
const note = { en: "Meeting note", th: "บันทึกการประชุม" };

export const meetings: Topic = {
  slug: "meetings",
  title: {
    en: "How many committee meetings did BIRSA record?",
    th: "BIRSA บันทึกการประชุมคณะกรรมการไว้กี่ครั้ง",
  },
  summary: {
    en: "BIRSA kept notes of 7 committee meetings between June and December 2022, with no record of who attended.",
    th: "BIRSA เก็บบันทึกการประชุมคณะกรรมการ 7 ครั้งระหว่างมิถุนายนถึงธันวาคม 2565 โดยไม่มีบันทึกผู้เข้าประชุม",
  },
  mainPoints: [
    {
      en: "BIRSA's shared folder holds notes for 7 committee meetings, from 9 June to 17 December 2022.",
      th: "โฟลเดอร์ร่วมของ BIRSA มีบันทึกการประชุมคณะกรรมการ 7 ครั้ง ตั้งแต่วันที่ 9 มิถุนายนถึง 17 ธันวาคม 2565",
    },
    {
      en: "Five of the 7 notes are dated June to August 2022, before the new academic year began.",
      th: "บันทึก 5 จาก 7 ฉบับลงวันที่มิถุนายนถึงสิงหาคม 2565 ก่อนเริ่มปีการศึกษาใหม่",
    },
    {
      en: "None of the 7 notes records who attended, so attendance cannot be counted.",
      th: "ไม่มีบันทึกใดใน 7 ฉบับที่ระบุผู้เข้าประชุม จึงนับจำนวนผู้เข้าประชุมไม่ได้",
    },
    {
      en: "The notes are working summaries of plans and decisions, not formal minutes with votes.",
      th: "บันทึกเหล่านี้เป็นสรุปแผนงานและข้อตัดสินใจ ไม่ใช่รายงานการประชุมแบบทางการที่มีมติ",
    },
  ],
  datasets: [
    {
      id: "meeting-notes",
      title: { en: "Committee meeting notes", th: "บันทึกการประชุมคณะกรรมการ" },
      summary: {
        en: "BIRSA's files hold 7 dated meeting notes, all from the executive committee, in June, July, August, October and December 2022.",
        th: "เอกสารของ BIRSA มีบันทึกการประชุมที่ระบุวันที่ 7 ฉบับ ทั้งหมดเป็นของคณะกรรมการบริหารสโมสร",
      },
      columns: [
        { key: "date", label: { en: "Date", th: "วันที่ประชุม" }, kind: "date" },
        { key: "body", label: { en: "Body", th: "คณะที่ประชุม" }, kind: "text" },
        { key: "record", label: { en: "Record", th: "เอกสาร" }, kind: "text" },
      ],
      rows: [
        { date: "2022-06-09", body, record: note },
        { date: "2022-06-11", body, record: note },
        { date: "2022-06-20", body, record: note },
        { date: "2022-07-05", body, record: note },
        { date: "2022-08-30", body, record: note },
        { date: "2022-10-01", body, record: note },
        { date: "2022-12-17", body, record: note },
      ],
      notes: [
        {
          en: "Dates are the titles of the note files. The 1 October note was saved on 15 October 2022.",
          th: "วันที่คือชื่อไฟล์บันทึก บันทึกวันที่ 1 ตุลาคมถูกบันทึกไว้เมื่อวันที่ 15 ตุลาคม 2565",
        },
        {
          en: "A further note from a meeting with a faculty officer is also dated 5 July. It is not counted as a committee meeting here.",
          th: "มีบันทึกอีกฉบับจากการพบเจ้าหน้าที่คณะ ลงวันที่ 5 กรกฎาคมเช่นกัน ซึ่งไม่นับเป็นการประชุมคณะกรรมการในตารางนี้",
        },
        {
          en: "No attendance, quorum or vote counts are recorded in any note, so none are shown.",
          th: "ไม่มีบันทึกจำนวนผู้เข้าประชุม องค์ประชุม หรือคะแนนเสียงในบันทึกใดเลย จึงไม่แสดง",
        },
      ],
      source: {
        en: "BIRSA committee meeting notes",
        th: "บันทึกการประชุมคณะกรรมการของ BIRSA",
      },
      period: { en: "June to December 2022", th: "มิถุนายนถึงธันวาคม 2565" },
    },
  ],
};
