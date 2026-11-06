import type { Topic } from "@/lib/open-data";

export const activities: Topic = {
  slug: "activities",
  title: {
    en: "What BIRSA ran during the year",
    th: "BIRSA จัดกิจกรรมอะไรบ้างในปีนี้",
  },
  summary: {
    en: "BIRSA ran 10 projects between July 2568 and March 2569, and sold 17 shirts for ฿5,283.",
    th: "BIRSA จัดโครงการ 10 โครงการระหว่างเดือนกรกฎาคม 2568 ถึงมีนาคม 2569 และขายเสื้อได้ 17 ตัว เป็นเงิน 5,283 บาท",
  },
  headlines: [
    {
      value: "10",
      label: { en: "Projects run", th: "โครงการที่จัด" },
      context: { en: "July 2025 to March 2026", th: "กรกฎาคม 2568 ถึงมีนาคม 2569" },
    },
    {
      value: "฿51,860",
      label: { en: "Budgeted on project forms", th: "งบประมาณรวมตามแบบเสนอโครงการ" },
      context: {
        en: "Eight projects have a budget figure",
        th: "มีตัวเลขงบประมาณ 8 โครงการ",
      },
    },
    {
      value: "60",
      label: {
        en: "Students expected at the largest events",
        th: "นักศึกษาที่คาดว่าจะมาในงานใหญ่ที่สุด",
      },
      context: { en: "Job Fair and Meet Ajarn", th: "Job Fair และ Meet Ajarn" },
    },
    {
      value: "17",
      label: { en: "Shirts sold", th: "เสื้อที่ขายได้" },
      context: { en: "Sales of ฿5,283", th: "ยอดขาย 5,283 บาท" },
    },
  ],
  mainPoints: [
    {
      en: "BIRSA ran 10 projects, from the BIR orientation on 24 July 2025 to Polsci Inter Union on 21 March 2026.",
      th: "BIRSA จัดโครงการ 10 โครงการ ตั้งแต่ปฐมนิเทศ BIR วันที่ 24 กรกฎาคม 2568 ถึง Polsci Inter Union วันที่ 21 มีนาคม 2569",
    },
    {
      en: "Project forms for the eight projects with a figure budgeted ฿51,860 in total.",
      th: "แบบเสนอโครงการของ 8 โครงการที่มีตัวเลข ตั้งงบประมาณรวม 51,860 บาท",
    },
    {
      en: "Open House on 1 November 2568 had the largest budget, at ฿32,000, and 50 student organisers.",
      th: "งาน Open House วันที่ 1 พฤศจิกายน 2568 ใช้งบมากที่สุด 32,000 บาท โดยมีนักศึกษาผู้จัดงาน 50 คน",
    },
    {
      en: "Job Fair on 5 March 2569 expected 60 students and had 22 staff on a budget of ฿2,760.",
      th: "งาน Job Fair วันที่ 5 มีนาคม 2569 คาดว่ามีนักศึกษา 60 คน และมีทีมงาน 22 คน ใช้งบ 2,760 บาท",
    },
    {
      en: "Meet Ajarn on 10 February 2569 asked for no funding, so its budget is ฿0.",
      th: "งาน Meet Ajarn วันที่ 10 กุมภาพันธ์ 2569 ไม่ขอสนับสนุนงบประมาณ จึงมีงบประมาณ 0 บาท",
    },
    {
      en: "BIRSA sold 17 shirts for ฿5,283, mostly at ฿299 each.",
      th: "BIRSA ขายเสื้อได้ 17 ตัว เป็นเงิน 5,283 บาท ส่วนใหญ่ราคาตัวละ 299 บาท",
    },
  ],
  datasets: [
    {
      id: "projects",
      title: { en: "Projects run, 2025 to 2026", th: "โครงการที่จัด ปี 2568 ถึง 2569" },
      summary: {
        en: "BIRSA ran 10 projects in the year, with ฿51,860 budgeted on project forms where a figure is recorded.",
        th: "BIRSA จัดโครงการ 10 โครงการในปีนี้ โดยตั้งงบประมาณในแบบเสนอโครงการรวม 51,860 บาท ในโครงการที่มีตัวเลข",
      },
      columns: [
        { key: "project", label: { en: "Project", th: "โครงการ" }, kind: "text" },
        { key: "date", label: { en: "Date", th: "วันที่จัด" }, kind: "date" },
        { key: "venue", label: { en: "Venue", th: "สถานที่" }, kind: "text" },
        {
          key: "students",
          label: { en: "Expected students", th: "นักศึกษาที่คาดว่าจะเข้าร่วม" },
          kind: "number",
        },
        { key: "staff", label: { en: "Staff", th: "ทีมงาน" }, kind: "number" },
        {
          key: "budget",
          label: { en: "Budget on project form (baht)", th: "งบประมาณตามแบบเสนอโครงการ (บาท)" },
          kind: "money",
          total: true,
        },
        { key: "status", label: { en: "Status", th: "สถานะ" }, kind: "text" },
      ],
      rows: [
        {
          project: { en: "BIR orientation", th: "ปฐมนิเทศ BIR" },
          date: "2025-07-24",
          venue: null,
          students: null,
          staff: null,
          budget: null,
          status: { en: "Completed", th: "เสร็จสิ้น" },
        },
        {
          project: { en: "BIR pre-session", th: "Pre-session BIR" },
          date: "2025-07-25",
          venue: null,
          students: null,
          staff: null,
          budget: null,
          status: { en: "Completed", th: "เสร็จสิ้น" },
        },
        {
          project: {
            en: "Movie Day, August to November 2025",
            th: "Movie Day สิงหาคมถึงพฤศจิกายน 2568",
          },
          date: "2025-08",
          venue: {
            en: "Room R103, Faculty of Political Science, Tha Phra Chan",
            th: "ห้อง ร.103 คณะรัฐศาสตร์ ท่าพระจันทร์",
          },
          students: 50,
          staff: null,
          budget: 2000,
          status: { en: "Completed", th: "เสร็จสิ้น" },
        },
        {
          project: { en: "Club Day", th: "Club Day" },
          date: "2025-08-21",
          venue: {
            en: "Room R103, Faculty of Political Science, Tha Phra Chan",
            th: "ห้อง ร.103 คณะรัฐศาสตร์ ท่าพระจันทร์",
          },
          students: 50,
          staff: 10,
          budget: 4200,
          status: { en: "Completed", th: "เสร็จสิ้น" },
        },
        {
          project: { en: "Halloween Night x Movie Day", th: "Halloween Night x Movie Day" },
          date: "2025-10-30",
          venue: {
            en: "Room R103, Faculty of Political Science, Tha Phra Chan",
            th: "ห้อง ร.103 คณะรัฐศาสตร์ ท่าพระจันทร์",
          },
          students: 50,
          staff: null,
          budget: 650,
          status: { en: "Completed", th: "เสร็จสิ้น" },
        },
        {
          project: { en: "BIR Open House", th: "BIR Open House" },
          date: "2025-11-01",
          venue: {
            en: "Rooms 102, 103 and 202, Faculty of Political Science, Tha Phra Chan",
            th: "ห้อง 102 103 และ 202 คณะรัฐศาสตร์ ท่าพระจันทร์",
          },
          students: null,
          staff: 50,
          budget: 32000,
          status: { en: "Completed", th: "เสร็จสิ้น" },
        },
        {
          project: {
            en: "Movie Day, February to April 2026",
            th: "Movie Day กุมภาพันธ์ถึงเมษายน 2569",
          },
          date: "2026-02",
          venue: {
            en: "Room R103, Faculty of Political Science, Tha Phra Chan",
            th: "ห้อง ร.103 คณะรัฐศาสตร์ ท่าพระจันทร์",
          },
          students: 50,
          staff: null,
          budget: 1500,
          status: { en: "Completed", th: "เสร็จสิ้น" },
        },
        {
          project: { en: "Meet Ajarn", th: "Meet Ajarn" },
          date: "2026-02-10",
          venue: {
            en: "Room R102, Faculty of Political Science, Tha Phra Chan",
            th: "ห้อง ร.102 คณะรัฐศาสตร์ ท่าพระจันทร์",
          },
          students: 60,
          staff: null,
          budget: 0,
          status: { en: "Completed", th: "เสร็จสิ้น" },
        },
        {
          project: { en: "BIR Job Fair", th: "BIR Job Fair" },
          date: "2026-03-05",
          venue: {
            en: "Room R103, Faculty of Political Science, Tha Phra Chan",
            th: "ห้อง ร.103 คณะรัฐศาสตร์ ท่าพระจันทร์",
          },
          students: 60,
          staff: 22,
          budget: 2760,
          status: { en: "Completed", th: "เสร็จสิ้น" },
        },
        {
          project: { en: "Polsci Inter Union 2026", th: "Polsci Inter Union 2569" },
          date: "2026-03-21",
          venue: {
            en: "Faculty of Political Science, Chulalongkorn University, 13th floor meeting room",
            th: "ห้องประชุมชั้น 13 คณะรัฐศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย",
          },
          students: 30,
          staff: 10,
          budget: 8750,
          status: { en: "Completed", th: "เสร็จสิ้น" },
        },
      ],
      notes: [
        {
          en: "Students and staff are the numbers expected on the approval forms, not counted attendance. Open House lists 50 student organisers and no figure for visitors. Club Day also had 30 members of other student groups running 10 stalls.",
          th: "จำนวนนักศึกษาและทีมงานเป็นตัวเลขที่คาดไว้ในแบบฟอร์มขออนุมัติ ไม่ใช่จำนวนผู้เข้าร่วมจริง งาน Open House ระบุนักศึกษาผู้จัดงาน 50 คนและไม่ระบุจำนวนผู้เข้าชม งาน Club Day ยังมีสมาชิกกลุ่มกิจกรรมอื่นอีก 30 คนที่ดูแลบูธ 10 บูธ",
        },
        {
          en: "Budgets come from the project forms, which are what BIRSA asked for, not what it spent. The master sheet agrees except for Polsci Inter Union, where it shows ฿14,000 against ฿8,750 on the form. The Open House form is marked as a draft. The master sheet also lists Meet Ajarn as not started, although it records the project as 100% complete.",
          th: "งบประมาณมาจากแบบเสนอโครงการ ซึ่งเป็นยอดที่ขอ ไม่ใช่ยอดที่ใช้จริง ตาราง Master Sheet ตรงกันทุกโครงการ ยกเว้น Polsci Inter Union ที่ตารางระบุ 14,000 บาท แต่แบบฟอร์มระบุ 8,750 บาท แบบฟอร์ม Open House ระบุว่าเป็นฉบับร่าง ตาราง Master Sheet ยังระบุว่า Meet Ajarn ยังไม่เริ่ม ทั้งที่บันทึกว่าโครงการเสร็จ 100%",
        },
        {
          en: "There is no approval form for the orientation or the pre-session, so venue, numbers and budget are not known. The master sheet records both as 100% complete.",
          th: "ไม่มีแบบฟอร์มขออนุมัติของปฐมนิเทศและ Pre-session จึงไม่ทราบสถานที่ จำนวนคน และงบประมาณ ตาราง Master Sheet บันทึกทั้งสองโครงการว่าเสร็จ 100%",
        },
        {
          en: "Movie Day had two approval forms, each for monthly screenings, so the date shows the starting month. Halloween Night was approved on its own and is counted as a separate project.",
          th: "Movie Day มีแบบฟอร์มขออนุมัติสองฉบับ ฉบับละหนึ่งช่วงที่ฉายหนังทุกเดือน วันที่จึงแสดงเดือนที่เริ่ม งาน Halloween Night ได้รับอนุมัติแยกต่างหากและนับเป็นอีกโครงการหนึ่ง",
        },
        {
          en: "Five planned events did not go ahead, and the master sheet shows them at 0%. They were the postgraduate fair, the book exhibition, Valentine, the library exhibition and the mental health exhibition.",
          th: "มีงานที่วางแผนไว้ 5 งานที่ไม่ได้จัด และตาราง Master Sheet แสดงที่ 0% ได้แก่ Postgrad Fair นิทรรศการหนังสือ Valentine นิทรรศการห้องสมุด และนิทรรศการสุขภาพจิต",
        },
      ],
      source: {
        en: "Project approval forms, and the missions tab of the BIRSA 2025 to 2026 master sheet",
        th: "แบบฟอร์มขออนุมัติโครงการ และแท็บ Mission ของ Master Sheet BIRSA ปี 2568 ถึง 2569",
      },
      period: { en: "July 2025 to March 2026", th: "กรกฎาคม 2568 ถึงมีนาคม 2569" },
    },
    {
      id: "merchandise",
      title: { en: "Shirt sales by size", th: "ยอดขายเสื้อแยกตามไซซ์" },
      summary: {
        en: "BIRSA sold 17 shirts for ฿5,283, at ฿299 for sizes M to XL and ฿349 for larger sizes.",
        th: "BIRSA ขายเสื้อได้ 17 ตัว เป็นเงิน 5,283 บาท ไซซ์ M ถึง XL ตัวละ 299 บาท และไซซ์ใหญ่กว่านั้นตัวละ 349 บาท",
      },
      columns: [
        { key: "item", label: { en: "Item", th: "รายการ" }, kind: "text" },
        { key: "price", label: { en: "Price each (baht)", th: "ราคาต่อตัว (บาท)" }, kind: "money" },
        {
          key: "units",
          label: { en: "Units sold", th: "จำนวนที่ขาย" },
          kind: "number",
          total: true,
        },
        {
          key: "sales",
          label: { en: "Sales (baht)", th: "ยอดขาย (บาท)" },
          kind: "money",
          total: true,
        },
      ],
      rows: [
        {
          item: { en: "Shirt, size M", th: "เสื้อ ไซซ์ M" },
          price: 299,
          units: 5,
          sales: 1495,
        },
        {
          item: { en: "Shirt, size L", th: "เสื้อ ไซซ์ L" },
          price: 299,
          units: 5,
          sales: 1495,
        },
        {
          item: { en: "Shirt, size XL", th: "เสื้อ ไซซ์ XL" },
          price: 299,
          units: 3,
          sales: 897,
        },
        {
          item: { en: "Shirt, size 2XL", th: "เสื้อ ไซซ์ 2XL" },
          price: 349,
          units: 3,
          sales: 1047,
        },
        {
          item: { en: "Shirt, size 4XL", th: "เสื้อ ไซซ์ 4XL" },
          price: 349,
          units: 1,
          sales: 349,
        },
      ],
      declaredTotal: { units: 17, sales: 5283 },
      notes: [
        {
          en: "Costs in the minutes were about ฿100 a shirt for 13 shirts and ฿120 a shirt for four, ฿50 a shirt for printing, and a ฿400 fee for the print block.",
          th: "ต้นทุนในรายงานการประชุมคือเสื้อตัวละประมาณ 100 บาท จำนวน 13 ตัว และตัวละ 120 บาท จำนวน 4 ตัว ค่าพิมพ์ตัวละ 50 บาท และค่าบล็อกพิมพ์ 400 บาท",
        },
        {
          en: "BIRSA's account tracker records only one ฿630 shirt entry as a debt and does not show the ฿5,283 of shirt sales. The two sources disagree. This table follows the final minutes of the commercial affairs team.",
          th: "ตารางบัญชีของ BIRSA บันทึกเพียงรายการเสื้อ 630 บาทเป็นหนี้ และไม่แสดงยอดขายเสื้อ 5,283 บาท ข้อมูลสองแหล่งจึงไม่ตรงกัน ตารางนี้ใช้ตามรายงานการประชุมครั้งสุดท้ายของฝ่ายพาณิชย์",
        },
        {
          en: "The minutes also record ฿550 for pencils and ฿140 for tea without saying whether these are sales or costs, so they are not in the table. Of the 17 shirts, 14 were collected in person and 3 were delivered.",
          th: "รายงานการประชุมยังบันทึกดินสอ 550 บาท และชา 140 บาท โดยไม่ระบุว่าเป็นยอดขายหรือต้นทุน จึงไม่รวมในตาราง เสื้อ 17 ตัวนี้ มารับเอง 14 ตัว และจัดส่ง 3 ตัว",
        },
      ],
      source: {
        en: "Minutes of the commercial affairs team meetings, December 2025 to March 2026",
        th: "รายงานการประชุมฝ่ายพาณิชย์ ธันวาคม 2568 ถึงมีนาคม 2569",
      },
      period: { en: "December 2025 to March 2026", th: "ธันวาคม 2568 ถึงมีนาคม 2569" },
    },
  ],
};
