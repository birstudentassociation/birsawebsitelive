import type { Bilingual, Row, Topic } from "@/lib/open-data";

const presented: Bilingual = { en: "Presented at the orientation", th: "แนะนำตัวในงานปฐมนิเทศ" };
const mentioned: Bilingual = {
  en: "Mentioned by the host at the orientation",
  th: "พิธีกรกล่าวถึงในงานปฐมนิเทศ",
};
const listOnly: Bilingual = { en: "On the planning list only", th: "อยู่ในรายชื่อวางแผนเท่านั้น" };

function group(en: string, th: string, how: Bilingual): Row {
  return { group: { en, th }, how };
}

export const clubs: Topic = {
  slug: "clubs",
  title: {
    en: "Which student groups did BIRSA work with in 2024 to 2025?",
    th: "BIRSA ทำงานกับกลุ่มนักศึกษากลุ่มใดบ้างในปีการศึกษา 2567",
  },
  summary: {
    en: "BIRSA's files name 10 student groups, but no club register or club funding figures were kept.",
    th: "เอกสารของ BIRSA ระบุกลุ่มนักศึกษา 10 กลุ่ม แต่ไม่มีทะเบียนชมรมหรือตัวเลขงบสนับสนุนชมรม",
  },
  mainPoints: [
    {
      en: "BIRSA's files name 10 student groups, from the orientation plan and the 14 June 2024 meeting.",
      th: "เอกสารของ BIRSA ระบุกลุ่มนักศึกษา 10 กลุ่ม จากแผนปฐมนิเทศและการประชุมวันที่ 14 มิถุนายน 2567",
    },
    {
      en: "4 groups had a slot of about 5 minutes on stage at the orientation on 5 August 2024.",
      th: "4 กลุ่มได้เวลาบนเวทีประมาณ 5 นาทีในงานปฐมนิเทศวันที่ 5 สิงหาคม 2567",
    },
    {
      en: "4 more groups were mentioned by the host, including 3 sports groups.",
      th: "อีก 4 กลุ่มพิธีกรกล่าวถึง รวมถึงกลุ่มกีฬา 3 กลุ่ม",
    },
    {
      en: "Registration for independent activity groups ran from 18 to 25 September 2024.",
      th: "การรับขึ้นทะเบียนกลุ่มกิจกรรมอิสระดำเนินการวันที่ 18 ถึง 25 กันยายน 2567",
    },
  ],
  warning: {
    en: "This is a list of groups named in BIRSA's files, not a register. The number of registered clubs is not recorded.",
    th: "นี่คือรายชื่อกลุ่มที่ปรากฏในเอกสารของ BIRSA ไม่ใช่ทะเบียนชมรม ไม่มีบันทึกจำนวนชมรมที่ขึ้นทะเบียน",
  },
  datasets: [
    {
      id: "groups-named",
      title: {
        en: "Student groups named in BIRSA's files",
        th: "กลุ่มนักศึกษาที่ปรากฏในเอกสารของ BIRSA",
      },
      summary: {
        en: "BIRSA's files name 10 student groups, 4 of which presented at the 2024 orientation.",
        th: "เอกสารของ BIRSA ระบุกลุ่มนักศึกษา 10 กลุ่ม โดย 4 กลุ่มแนะนำตัวในงานปฐมนิเทศปี 2567",
      },
      columns: [
        { key: "group", label: { en: "Group", th: "กลุ่ม" }, kind: "text" },
        { key: "how", label: { en: "How it appears", th: "ปรากฏอย่างไร" }, kind: "text" },
      ],
      rows: [
        group("BIRIFY", "BIRIFY", presented),
        group("Kien Club", "Kien Club", presented),
        group("BIR Music", "BIR Music", presented),
        group("TUMUN", "TUMUN", presented),
        group("ASA IR", "ASA IR", mentioned),
        group("BIR Football", "BIR Football", mentioned),
        group("BIR Basketball", "BIR Basketball", mentioned),
        group("BIR Volleyball", "BIR Volleyball", mentioned),
        group("Writing club", "ชมรมเขียน", listOnly),
        group("Volunteer club", "ชมรมอาสา", listOnly),
      ],
      notes: [
        {
          en: "The planning list is from the meeting on 14 June 2024. It also names BIRIFY, BIR Music and the three sports groups.",
          th: "รายชื่อวางแผนมาจากการประชุมวันที่ 14 มิถุนายน 2567 ซึ่งระบุ BIRIFY BIR Music และกลุ่มกีฬาสามกลุ่มด้วย",
        },
      ],
      source: {
        en: "BIRSA orientation plan and meeting notes of 14 June 2024",
        th: "แผนปฐมนิเทศและบันทึกการประชุมวันที่ 14 มิถุนายน 2567 ของ BIRSA",
      },
      period: { en: "June to August 2024", th: "มิถุนายนถึงสิงหาคม 2567" },
    },
    {
      id: "club-dates",
      title: { en: "Key dates for student groups", th: "วันสำคัญของกลุ่มนักศึกษา" },
      summary: {
        en: "Groups were introduced on 5 August 2024, and independent groups could register from 18 to 25 September 2024.",
        th: "กลุ่มต่าง ๆ แนะนำตัววันที่ 5 สิงหาคม 2567 และกลุ่มอิสระขึ้นทะเบียนได้วันที่ 18 ถึง 25 กันยายน 2567",
      },
      columns: [
        { key: "date", label: { en: "Date", th: "วันที่" }, kind: "date" },
        { key: "event", label: { en: "What happened", th: "เหตุการณ์" }, kind: "text" },
      ],
      rows: [
        {
          date: "2024-08-05",
          event: {
            en: "Student groups were introduced to new students at the orientation",
            th: "กลุ่มนักศึกษาแนะนำตัวกับนักศึกษาใหม่ในงานปฐมนิเทศ",
          },
        },
        {
          date: "2024-09-18",
          event: {
            en: "Registration for independent activity groups opened",
            th: "เปิดรับขึ้นทะเบียนกลุ่มกิจกรรมอิสระ",
          },
        },
        {
          date: "2024-09-25",
          event: {
            en: "Registration for independent activity groups closed",
            th: "ปิดรับขึ้นทะเบียนกลุ่มกิจกรรมอิสระ",
          },
        },
      ],
      notes: [
        {
          en: "No record says how many groups registered.",
          th: "ไม่มีบันทึกว่ามีกลุ่มขึ้นทะเบียนกี่กลุ่ม",
        },
      ],
      source: {
        en: "BIRSA activity timeline and orientation plan",
        th: "ตารางกิจกรรมและแผนปฐมนิเทศของ BIRSA",
      },
      period: { en: "August to September 2024", th: "สิงหาคมถึงกันยายน 2567" },
    },
  ],
};
