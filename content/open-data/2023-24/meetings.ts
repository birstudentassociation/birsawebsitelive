import type { Bilingual, Row, Topic } from "@/lib/open-data";

const body = {
  committee: { en: "BIRSA committee", th: "คณะกรรมการ BIRSA" },
  group: { en: "Project working group", th: "คณะทำงานโครงการ" },
  clubs: { en: "BIRSA and clubs", th: "BIRSA และชมรม" },
  union: { en: "BIRSA and the student union", th: "BIRSA และองค์การนักศึกษา" },
  partners: { en: "BIRSA and partner programmes", th: "BIRSA และหลักสูตรพันธมิตร" },
  classes: { en: "BIRSA and class committees", th: "BIRSA และคณะกรรมการชั้นปี" },
  staff: { en: "BIRSA and faculty staff", th: "BIRSA และเจ้าหน้าที่คณะ" },
} satisfies Record<string, Bilingual>;

const m = (date: string, who: Bilingual, en: string, th: string): Row => ({
  date,
  body: who,
  topic: { en, th },
});

const register: Row[] = [
  m("2023-06-01", body.group, "Pride Month activities", "กิจกรรม Pride Month"),
  m("2023-06-02", body.committee, "Working system and tools", "ระบบและเครื่องมือการทำงาน"),
  m(
    "2023-06-06",
    body.staff,
    "Working system, roles and annual plan",
    "ระบบการทำงาน บทบาท และแผนประจำปี"
  ),
  m("2023-06-11", body.committee, "Activity calendar for the year", "ปฏิทินกิจกรรมตลอดปี"),
  m("2023-06-12", body.clubs, "Introductions with club representatives", "แนะนำตัวกับตัวแทนชมรม"),
  m("2023-06-13", body.union, "Activity schedules for the year", "ตารางกิจกรรมตลอดปี"),
  m("2023-06-26", body.committee, "Working system within BIRSA", "ระบบการทำงานภายใน BIRSA"),
  m("2023-07-01", body.clubs, "ASA IR activity plan", "แผนกิจกรรมของ ASA IR"),
  m("2023-07-05", body.clubs, "Club Day format", "รูปแบบงาน Club Day"),
  m(
    "2023-07-06",
    body.group,
    "BIR orientation afternoon plan",
    "แผนกิจกรรมช่วงบ่ายของปฐมนิเทศ BIR"
  ),
  m("2023-07-08", body.group, "Merchandise and Club Day", "Merchandise และ Club Day"),
  m(
    "2023-07-10",
    body.union,
    "Activity review and homecoming update",
    "ทบทวนกิจกรรมและความคืบหน้างานรับน้อง"
  ),
  m("2023-07-15", body.group, "BIR Cortex guidelines", "แนวทางของ BIR Cortex"),
  m("2023-07-17", body.clubs, "TED Club recruitment and plan", "การรับสมัครและแผนของ TED Club"),
  m(
    "2023-07-21",
    body.group,
    "Merchandise shirt makers and pre-order",
    "ผู้ผลิตเสื้อและการสั่งจอง Merchandise"
  ),
  m("2023-07-24", body.group, "Club Day preparations", "การเตรียมงาน Club Day"),
  m(
    "2023-07-28",
    body.union,
    "Orientation and homecoming run-throughs",
    "การซ้อมปฐมนิเทศและงานรับน้อง"
  ),
  m("2023-07-29", body.group, "BIR orientation roles", "หน้าที่ในปฐมนิเทศ BIR"),
  m("2023-07-31", body.partners, "Joint activity with IRGA", "กิจกรรมร่วมกับ IRGA"),
  m("2023-08-12", body.committee, "Feedback on the homecoming", "ทบทวนการทำงานงานรับน้อง"),
  m(
    "2023-08-23",
    body.group,
    "First year cohort election and feedback system",
    "การเลือกตั้งแกนนำปี 1 และระบบรับความคิดเห็น"
  ),
  m("2023-08-30", body.partners, "IRGA field trip survey", "แบบสอบถามทัศนศึกษากับ IRGA"),
  m("2023-09-05", body.group, "First year cohort election timetable", "ตารางการเลือกตั้งแกนนำปี 1"),
  m("2023-09-11", body.classes, "Annual activity calendar", "ปฏิทินกิจกรรมประจำปี"),
  m("2023-09-14", body.partners, "Field trip proposals", "ข้อเสนอการทัศนศึกษา"),
  m("2023-09-28", body.group, "Halloween Night concept", "แนวคิดงาน Halloween Night"),
  m(
    "2023-10-10",
    body.committee,
    "Team updates and feedback",
    "ความคืบหน้าและข้อเสนอแนะของแต่ละฝ่าย"
  ),
  m("2023-10-12", body.group, "Halloween Night update", "ความคืบหน้างาน Halloween Night"),
  m(
    "2023-10-17",
    body.group,
    "Halloween Night and Chit Chat updates",
    "ความคืบหน้า Halloween Night และ Chit Chat"
  ),
  m(
    "2023-10-19",
    body.classes,
    "Annual activity plan and spending",
    "แผนกิจกรรมประจำปีและการเบิกจ่าย"
  ),
  m(
    "2023-10-25",
    body.group,
    "Halloween Night and Chit Chat updates",
    "ความคืบหน้า Halloween Night และ Chit Chat"
  ),
  m("2023-11-06", body.group, "Halloween Night review", "ทบทวนงาน Halloween Night"),
  m(
    "2023-11-10",
    body.group,
    "Halloween Night review, second session",
    "ทบทวนงาน Halloween Night ครั้งที่สอง"
  ),
  m(
    "2023-11-17",
    body.committee,
    "Team updates and BIR Festival",
    "ความคืบหน้าแต่ละฝ่ายและ BIR Festival"
  ),
  m("2023-11-22", body.committee, "Sub-committee appointments", "การแต่งตั้งอนุกรรมการ"),
  m("2024-01-15", body.committee, "Working structure and review", "โครงสร้างการทำงานและการทบทวน"),
  m("2024-01-16", body.group, "BIR Festival plan", "แผนงาน BIR Festival"),
  m(
    "2024-01-24",
    body.committee,
    "BIR Festival and Rights seminar updates",
    "ความคืบหน้า BIR Festival และสัมมนาด้านสิทธิ"
  ),
  m("2024-01-31", body.committee, "Weekly update", "ประชุมประจำสัปดาห์"),
  m("2024-02-07", body.committee, "Peace Day preparations", "การเตรียมงาน Peace Day"),
  m("2024-02-21", body.committee, "Weekly update", "ประชุมประจำสัปดาห์"),
  m(
    "2024-02-26",
    body.partners,
    "Polsci Inter Union first meeting",
    "การประชุมครั้งแรกของ Polsci Inter Union"
  ),
  m("2024-03-13", body.committee, "Weekly update", "ประชุมประจำสัปดาห์"),
];

const count = (who: Bilingual) => register.filter((r) => r.body === who).length;

export const meetings: Topic = {
  slug: "meetings",
  title: {
    en: "How often did BIRSA meet during the year",
    th: "BIRSA ประชุมบ่อยแค่ไหนในปีนี้",
  },
  summary: {
    en: "BIRSA's minutes record 43 meetings from June 2023 to March 2024, and 13 were of the full committee.",
    th: "รายงานการประชุมของ BIRSA มี 43 ครั้ง ระหว่างมิถุนายน 2566 ถึงมีนาคม 2567 และ 13 ครั้งเป็นการประชุมคณะกรรมการ",
  },
  headlines: [
    { value: "43", label: { en: "Meetings recorded", th: "การประชุมที่มีบันทึก" } },
    { value: "16", label: { en: "Project working group meetings", th: "ประชุมคณะทำงานโครงการ" } },
    { value: "13", label: { en: "Committee meetings", th: "ประชุมคณะกรรมการ" } },
  ],
  warning: {
    en: "The minutes do not clearly separate who was present from who was absent, so this page does not count attendance.",
    th: "รายงานการประชุมไม่แยกชัดเจนว่าใครมาและใครไม่มา หน้านี้จึงไม่นับจำนวนผู้เข้าประชุม",
  },
  chart: {
    datasetId: "meetings-by-body",
    labelKey: "body",
    valueKey: "meetings",
    title: {
      en: "Project working groups met more often than the committee",
      th: "คณะทำงานโครงการประชุมบ่อยกว่าคณะกรรมการ",
    },
    subtitle: {
      en: "Meetings recorded by who met, June 2023 to March 2024",
      th: "การประชุมที่มีบันทึก แยกตามผู้เข้าประชุม มิถุนายน 2566 ถึงมีนาคม 2567",
    },
    alt: {
      en: "A bar chart showing that project working groups held 16 meetings and the committee 13, ahead of clubs and partner programmes with 4 each.",
      th: "แผนภูมิแท่งแสดงว่าคณะทำงานโครงการประชุม 16 ครั้ง และคณะกรรมการ 13 ครั้ง มากกว่าการประชุมกับชมรมและหลักสูตรพันธมิตรที่มีอย่างละ 4 ครั้ง",
    },
  },
  mainPoints: [
    {
      en: "The minutes record 43 meetings, from 1 June 2023 to 13 March 2024.",
      th: "รายงานการประชุมมี 43 ครั้ง ตั้งแต่ 1 มิถุนายน 2566 ถึง 13 มีนาคม 2567",
    },
    {
      en: "Project working groups met 16 times, six of them for Halloween Night.",
      th: "คณะทำงานโครงการประชุม 16 ครั้ง โดย 6 ครั้งเป็นงาน Halloween Night",
    },
    {
      en: "The committee met 13 times, with a weekly meeting in the minutes from 31 January 2024.",
      th: "คณะกรรมการประชุม 13 ครั้ง และมีการประชุมประจำสัปดาห์ในบันทึกตั้งแต่ 31 มกราคม 2567",
    },
    {
      en: "BIRSA met the student union 3 times and the class committees twice.",
      th: "BIRSA ประชุมกับองค์การนักศึกษา 3 ครั้ง และกับคณะกรรมการชั้นปี 2 ครั้ง",
    },
    {
      en: "No minutes are held after 13 March 2024.",
      th: "ไม่มีรายงานการประชุมหลังวันที่ 13 มีนาคม 2567",
    },
  ],
  datasets: [
    {
      id: "meetings-by-body",
      title: { en: "Meetings by who met", th: "การประชุมแยกตามผู้เข้าประชุม" },
      summary: {
        en: "Project working groups met 16 times and the committee 13 times, out of 43 recorded meetings.",
        th: "คณะทำงานโครงการประชุม 16 ครั้งและคณะกรรมการ 13 ครั้ง จากทั้งหมด 43 ครั้งที่มีบันทึก",
      },
      columns: [
        { key: "body", label: { en: "Who met", th: "ผู้เข้าประชุม" }, kind: "text" },
        {
          key: "meetings",
          label: { en: "Meetings", th: "จำนวนครั้ง" },
          kind: "number",
          total: true,
        },
      ],
      declaredTotal: { meetings: 43 },
      rows: [
        { body: body.group, meetings: count(body.group) },
        { body: body.committee, meetings: count(body.committee) },
        { body: body.clubs, meetings: count(body.clubs) },
        { body: body.partners, meetings: count(body.partners) },
        { body: body.union, meetings: count(body.union) },
        { body: body.classes, meetings: count(body.classes) },
        { body: body.staff, meetings: count(body.staff) },
      ],
      notes: [
        {
          en: "Minutes from March to May 2023 belong to the election period before this committee took office and are not counted. Meetings about the faculty common room are not counted.",
          th: "รายงานการประชุมเดือนมีนาคมถึงพฤษภาคม 2566 เป็นช่วงเลือกตั้งก่อนคณะกรรมการชุดนี้เข้ารับตำแหน่ง จึงไม่นับ และไม่นับการประชุมเรื่องห้องคอมมอนของคณะ",
        },
      ],
      source: { en: "BIRSA meeting minutes", th: "รายงานการประชุมของ BIRSA" },
      period: { en: "June 2023 to March 2024", th: "มิถุนายน 2566 ถึงมีนาคม 2567" },
    },
    {
      id: "meetings-register",
      title: { en: "Register of meetings", th: "ทะเบียนการประชุม" },
      summary: {
        en: "The register lists 43 meetings by date, from 1 June 2023 to 13 March 2024.",
        th: "ทะเบียนนี้รวม 43 การประชุมเรียงตามวันที่ ตั้งแต่ 1 มิถุนายน 2566 ถึง 13 มีนาคม 2567",
      },
      columns: [
        { key: "date", label: { en: "Date", th: "วันที่" }, kind: "date" },
        { key: "body", label: { en: "Who met", th: "ผู้เข้าประชุม" }, kind: "text" },
        { key: "topic", label: { en: "Main subject", th: "เรื่องหลัก" }, kind: "text" },
      ],
      rows: register,
      notes: [
        {
          en: "Minutes of 15 and 16 January 2024 print the year as 2023. They were filed on those dates in 2024, so 2024 is used.",
          th: "รายงานการประชุมวันที่ 15 และ 16 มกราคม 2567 พิมพ์ปีเป็น 2566 แต่เก็บไฟล์ในวันดังกล่าวของปี 2567 จึงใช้ปี 2567",
        },
      ],
      source: { en: "BIRSA meeting minutes", th: "รายงานการประชุมของ BIRSA" },
      period: { en: "June 2023 to March 2024", th: "มิถุนายน 2566 ถึงมีนาคม 2567" },
    },
  ],
};
