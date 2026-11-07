import type { Topic } from "@/lib/open-data";

export const activities: Topic = {
  slug: "activities",
  title: {
    en: "What did BIRSA run in 2022 to 2023?",
    th: "BIRSA จัดกิจกรรมอะไรบ้างในปีการศึกษา 2565",
  },
  summary: {
    en: "BIRSA's files hold reports for 3 events between October 2022 and February 2023, and 138 people came to Open House.",
    th: "เอกสารของ BIRSA มีรายงาน 3 กิจกรรมระหว่างตุลาคม 2565 ถึงกุมภาพันธ์ 2566 และมีผู้มางาน Open House 138 คน",
  },
  headlines: [
    {
      value: "138",
      label: { en: "People at Open House", th: "ผู้เข้าร่วมงาน Open House" },
      context: { en: "Actual, 10 February 2023", th: "จำนวนจริง วันที่ 10 กุมภาพันธ์ 2566" },
    },
    {
      value: "350",
      label: { en: "Students expected at Sports Day", th: "นักศึกษาที่คาดว่าจะมางานกีฬาสี" },
      context: { en: "Actual turnout not recorded", th: "ไม่ได้บันทึกจำนวนที่มาจริง" },
    },
    {
      value: "45",
      label: { en: "People at the Japan policy seminar", th: "ผู้เข้าร่วมงานเสวนาเรื่องญี่ปุ่น" },
      context: { en: "As reported, 22 October 2022", th: "ตามรายงาน วันที่ 22 ตุลาคม 2565" },
    },
  ],
  mainPoints: [
    {
      en: "Reports exist for three events, from Sports Day on 7 October 2022 to Open House on 10 February 2023.",
      th: "มีรายงานของ 3 กิจกรรม ตั้งแต่งานกีฬาสีวันที่ 7 ตุลาคม 2565 ถึงงาน Open House วันที่ 10 กุมภาพันธ์ 2566",
    },
    {
      en: "Open House had 138 people, including 90 guests. The plan costed snacks and lunch for 45.",
      th: "งาน Open House มีผู้เข้าร่วม 138 คน เป็นผู้เข้าร่วมงาน 90 คน แผนงบคิดอาหารว่างและอาหารกลางวันไว้ 45 คน",
    },
    {
      en: "Sports Day expected 350 students. A flood watch lowered turnout, but no count was recorded.",
      th: "งานกีฬาสีคาดว่ามีนักศึกษา 350 คน การประกาศเฝ้าระวังน้ำท่วมทำให้คนมาน้อยลง แต่ไม่ได้บันทึกจำนวน",
    },
    {
      en: "The Japan policy seminar on 22 October 2022 reported 45 people, the same number as planned.",
      th: "งานเสวนาเรื่องญี่ปุ่นวันที่ 22 ตุลาคม 2565 รายงานผู้เข้าร่วม 45 คน เท่ากับที่วางแผนไว้",
    },
    {
      en: "The internship talk planned for 4 November 2022 and a rights seminar planned for 18 March 2023 have no report.",
      th: "งานพูดคุยเรื่องฝึกงานที่วางแผนวันที่ 4 พฤศจิกายน 2565 และงานเสวนาด้านสิทธิที่วางแผนวันที่ 18 มีนาคม 2566 ไม่มีรายงาน",
    },
  ],
  datasets: [
    {
      id: "events",
      title: { en: "Events in 2022 to 2023", th: "กิจกรรมในปีการศึกษา 2565" },
      summary: {
        en: "Three of the six events on record have a report, and only Open House and the seminar have an attendance count.",
        th: "จาก 6 กิจกรรมที่มีบันทึก มี 3 กิจกรรมที่มีรายงาน และมีเพียงงาน Open House กับงานเสวนาที่มีจำนวนผู้เข้าร่วม",
      },
      columns: [
        { key: "event", label: { en: "Event", th: "กิจกรรม" }, kind: "text" },
        { key: "date", label: { en: "Date", th: "วันที่จัด" }, kind: "date" },
        { key: "venue", label: { en: "Venue", th: "สถานที่" }, kind: "text" },
        {
          key: "planned",
          label: { en: "Planned participants", th: "ผู้เข้าร่วมที่วางแผนไว้" },
          kind: "number",
        },
        {
          key: "actual",
          label: { en: "Actual participants", th: "ผู้เข้าร่วมจริง" },
          kind: "number",
        },
        {
          key: "budget",
          label: { en: "Planned budget (baht)", th: "งบประมาณที่ตั้งไว้ (บาท)" },
          kind: "money",
        },
        { key: "status", label: { en: "Status", th: "สถานะ" }, kind: "text" },
      ],
      rows: [
        {
          event: { en: "BIR orientation", th: "ปฐมนิเทศ BIR" },
          date: "2022-07-25",
          venue: null,
          planned: null,
          actual: null,
          budget: null,
          status: { en: "Date recorded, no report", th: "มีวันที่ ไม่มีรายงาน" },
        },
        {
          event: { en: "BIR Sports Day", th: "กีฬาสี BIR" },
          date: "2022-10-07",
          venue: {
            en: "Gymnasium, Tha Prachan campus",
            th: "โรงยิม มหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์",
          },
          planned: 350,
          actual: null,
          budget: 21590,
          status: { en: "Held, report", th: "จัดแล้ว มีรายงาน" },
        },
        {
          event: {
            en: "Academic seminar on Japan policy",
            th: "งานเสวนาวิชาการเรื่องนโยบายต่างประเทศญี่ปุ่น",
          },
          date: "2022-10-22",
          venue: {
            en: "Room R102 and Facebook Live",
            th: "ห้อง ร.102 และถ่ายทอดสดทาง Facebook",
          },
          planned: 45,
          actual: 45,
          budget: 7350,
          status: { en: "Held, report", th: "จัดแล้ว มีรายงาน" },
        },
        {
          event: { en: "Informal talk on internships", th: "งานพูดคุยเรื่องการฝึกงาน" },
          date: "2022-11-04",
          venue: { en: "Online", th: "ออนไลน์" },
          planned: null,
          actual: null,
          budget: null,
          status: { en: "Planned, no report", th: "วางแผนไว้ ไม่มีรายงาน" },
        },
        {
          event: { en: "BIR Open House 2023", th: "BIR Open House" },
          date: "2023-02-10",
          venue: {
            en: "Room R103, Faculty of Political Science, Tha Prachan",
            th: "ห้อง ร.103 คณะรัฐศาสตร์ ท่าพระจันทร์",
          },
          planned: null,
          actual: 138,
          budget: 16800,
          status: { en: "Held, report", th: "จัดแล้ว มีรายงาน" },
        },
        {
          event: { en: "Rights seminar, semester 2", th: "งานเสวนาส่งเสริมสิทธิ ภาคการศึกษาที่ 2" },
          date: "2023-03-18",
          venue: null,
          planned: null,
          actual: null,
          budget: 8900,
          status: { en: "Planned, no report", th: "วางแผนไว้ ไม่มีรายงาน" },
        },
      ],
      notes: [
        {
          en: "No actual cost is recorded for any event. Budgets are from project forms for Sports Day, the seminar and Open House, and from the budget plan for the rights seminar.",
          th: "ไม่มีบันทึกค่าใช้จ่ายจริงของกิจกรรมใดเลย งบของงานกีฬาสี งานเสวนา และงาน Open House มาจากแบบเสนอโครงการ ส่วนงบงานเสวนาด้านสิทธิมาจากแผนงบประมาณ",
        },
        {
          en: "The seminar report gives the same 45 people as the plan, made up of 40 students, 4 speakers and 1 host. It does not count online viewers.",
          th: "รายงานงานเสวนาระบุผู้เข้าร่วม 45 คนเท่ากับแผน ประกอบด้วยนักศึกษา 40 คน วิทยากร 4 คน และผู้ดำเนินรายการ 1 คน โดยไม่นับผู้ชมออนไลน์",
        },
        {
          en: "Sports Day survey answers (62 and 161) are not an attendance count. The report says a flood watch cut turnout below the 350 expected.",
          th: "จำนวนผู้ตอบแบบสอบถามงานกีฬาสี (62 และ 161 คน) ไม่ใช่จำนวนผู้เข้าร่วม รายงานระบุว่าการเฝ้าระวังน้ำท่วมทำให้คนมาน้อยกว่า 350 คนที่คาดไว้",
        },
        {
          en: "The rights seminar date comes from a project tracker that gives no year. The year is taken from semester 2 of 2022 to 2023. The Open House plan said room 107 and its report says room R103.",
          th: "วันที่งานเสวนาด้านสิทธิมาจากตารางติดตามโครงการที่ไม่ระบุปี ปีนี้อนุมานจากภาคการศึกษาที่ 2 ของปีการศึกษา 2565 แผนงาน Open House ระบุห้อง 107 ส่วนรายงานระบุห้อง ร.103",
        },
        {
          en: "Recurring events this year are orientation, Sports Day, the academic seminar and Open House.",
          th: "กิจกรรมที่จัดซ้ำทุกปีในปีนี้ ได้แก่ ปฐมนิเทศ งานกีฬาสี งานเสวนาวิชาการ และงาน Open House",
        },
      ],
      source: {
        en: "BIRSA project forms, event reports and project tracker",
        th: "แบบเสนอโครงการ รายงานโครงการ และตารางติดตามโครงการของ BIRSA",
      },
      period: { en: "July 2022 to March 2023", th: "กรกฎาคม 2565 ถึงมีนาคม 2566" },
    },
    {
      id: "open-house-attendance",
      title: {
        en: "Open House people against the plan",
        th: "ผู้เข้าร่วมงาน Open House เทียบกับแผน",
      },
      summary: {
        en: "Open House had 138 people against a budget for 48, because 90 guests came and the plan costed none of them.",
        th: "งาน Open House มีผู้เข้าร่วม 138 คน เทียบกับงบที่ตั้งไว้สำหรับ 48 คน เพราะมีผู้เข้าร่วมงาน 90 คนที่แผนไม่ได้คิดงบไว้",
      },
      columns: [
        { key: "group", label: { en: "Group", th: "กลุ่ม" }, kind: "text" },
        {
          key: "budgeted",
          label: { en: "Budgeted for (people)", th: "จำนวนที่ตั้งงบไว้ (คน)" },
          kind: "number",
          total: true,
        },
        {
          key: "actual",
          label: { en: "Actual attendance (people)", th: "ผู้เข้าร่วมจริง (คน)" },
          kind: "number",
          total: true,
        },
      ],
      declaredTotal: { actual: 138 },
      rows: [
        {
          group: { en: "Guests", th: "ผู้เข้าร่วมงานทั่วไป" },
          budgeted: null,
          actual: 90,
        },
        {
          group: { en: "BIR student organisers", th: "นักศึกษา BIR ผู้จัดงาน" },
          budgeted: 45,
          actual: 45,
        },
        {
          group: { en: "Speakers", th: "วิทยากร" },
          budgeted: 3,
          actual: 3,
        },
      ],
      notes: [
        {
          en: "The plan costs snacks and lunch for 45 people and fees for 3 speakers. It does not cost refreshments for guests.",
          th: "แผนคิดอาหารว่างและอาหารกลางวันสำหรับ 45 คน และค่าวิทยากร 3 คน และไม่ได้คิดงบเครื่องดื่มสำหรับผู้เข้าร่วมงาน",
        },
        {
          en: "119 people registered on the online form between 23 January and 8 February 2023. The proposal's own attendance section already lists 138, the same as the report.",
          th: "มีผู้ลงทะเบียนในแบบฟอร์มออนไลน์ 119 คน ระหว่างวันที่ 23 มกราคมถึง 8 กุมภาพันธ์ 2566 ส่วนข้อมูลผู้เข้าร่วมในข้อเสนอโครงการก็ระบุ 138 คนเท่ากับรายงาน",
        },
      ],
      source: {
        en: "BIRSA Open House proposal, event report and registration form",
        th: "ข้อเสนอโครงการ รายงานโครงการ และแบบฟอร์มลงทะเบียนงาน Open House ของ BIRSA",
      },
      period: { en: "10 February 2023", th: "10 กุมภาพันธ์ 2566" },
    },
  ],
};
