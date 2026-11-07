import type { Topic } from "@/lib/open-data";

export const clubs: Topic = {
  slug: "clubs",
  title: {
    en: "Which student groups were set up in 2022 to 2023?",
    th: "มีกลุ่มนักศึกษาอิสระใดตั้งขึ้นในปีการศึกษา 2565",
  },
  summary: {
    en: "Four free student groups were set up between 1 August and 26 October 2022.",
    th: "มีกลุ่มนักศึกษาอิสระ 4 กลุ่มตั้งขึ้นระหว่างวันที่ 1 สิงหาคมถึง 26 ตุลาคม 2565",
  },
  mainPoints: [
    {
      en: "BIRSA's group register lists 4 free student groups set up in the year.",
      th: "ทะเบียนกลุ่มของ BIRSA มีกลุ่มนักศึกษาอิสระที่ตั้งขึ้นในปีนี้ 4 กลุ่ม",
    },
    {
      en: "BIRIFY was first, on 1 August 2022.",
      th: "กลุ่ม BIRIFY ตั้งก่อน เมื่อวันที่ 1 สิงหาคม 2565",
    },
    {
      en: "Three groups were set up in October 2022, ASA IR on the 25th and the football and volleyball groups on the 26th.",
      th: "อีก 3 กลุ่มตั้งในเดือนตุลาคม 2565 คือ ASA IR วันที่ 25 และกลุ่มฟุตบอลกับกลุ่มวอลเลย์บอลวันที่ 26",
    },
    {
      en: "No funding for any group is recorded, apart from a ฿3,000 microphone line for BIRIFY in the budget plan.",
      th: "ไม่มีบันทึกงบสนับสนุนกลุ่มใดเลย ยกเว้นรายการไมโครโฟน 3,000 บาทของ BIRIFY ในแผนงบประมาณ",
    },
  ],
  datasets: [
    {
      id: "free-groups",
      title: { en: "Free student groups set up", th: "กลุ่มนักศึกษาอิสระที่ตั้งขึ้น" },
      summary: {
        en: "Four free student groups were set up, one in August 2022 and three in October 2022.",
        th: "กลุ่มนักศึกษาอิสระ 4 กลุ่มตั้งขึ้น โดยหนึ่งกลุ่มในเดือนสิงหาคม 2565 และอีกสามกลุ่มในเดือนตุลาคม 2565",
      },
      columns: [
        { key: "group", label: { en: "Group", th: "กลุ่ม" }, kind: "text" },
        { key: "founded", label: { en: "Set up on", th: "วันที่จัดตั้ง" }, kind: "date" },
      ],
      rows: [
        { group: { en: "BIRIFY", th: "BIRIFY" }, founded: "2022-08-01" },
        { group: { en: "ASA IR", th: "ASA IR" }, founded: "2022-10-25" },
        { group: { en: "BIR Football Club", th: "ชมรมฟุตบอล BIR" }, founded: "2022-10-26" },
        { group: { en: "Volleyball group", th: "กลุ่มวอลเลย์บอล" }, founded: "2022-10-26" },
      ],
      notes: [
        {
          en: "The register also names each group's leaders and contacts. Those are personal details and are not published.",
          th: "ทะเบียนมีชื่อและช่องทางติดต่อของผู้นำแต่ละกลุ่มด้วย ซึ่งเป็นข้อมูลส่วนบุคคลและไม่เผยแพร่",
        },
        {
          en: "The register records no member counts or funding for these groups.",
          th: "ทะเบียนไม่มีจำนวนสมาชิกหรืองบสนับสนุนของกลุ่มเหล่านี้",
        },
      ],
      source: {
        en: "BIRSA free student group register",
        th: "ทะเบียนกลุ่มนักศึกษาอิสระของ BIRSA",
      },
      period: { en: "August to October 2022", th: "สิงหาคมถึงตุลาคม 2565" },
    },
  ],
};
