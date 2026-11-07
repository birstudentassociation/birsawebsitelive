import type { AboutSection } from "@/lib/open-data";

/**
 * "About the data" for the 2021 to 2022 edition: how the figures were made,
 * how privacy was protected, where sources disagree and what BIRSA does not hold.
 */
export const about: AboutSection[] = [
  {
    id: "how",
    heading: { en: "How these figures were made", th: "ตัวเลขเหล่านี้มาจากไหน" },
    paragraphs: [
      {
        en: "Every figure comes from BIRSA's own working files for the year, such as its vote count sheet, welfare budget plan, project plans, election notice and meeting minutes. Nothing was estimated. Where a value was missing from the source, the table leaves the cell empty and a note says why.",
        th: "ตัวเลขทุกตัวมาจากเอกสารทำงานของ BIRSA ในปีนั้น เช่น ตารางนับคะแนนประชามติ แผนงบประมาณสวัสดิการ ใบโครงการ ประกาศเลือกตั้ง และรายงานการประชุม เราไม่ได้ประมาณตัวเลขใดขึ้นเอง หากเอกสารต้นทางไม่มีค่าใด ช่องในตารางจะเว้นว่างไว้ และมีหมายเหตุบอกเหตุผล",
      },
      {
        en: "The year here runs from June 2021 to May 2022. Percentages marked as computed were worked out from the counts in the same table. The figures were gathered after the year ended and published once. They will not be revised.",
        th: "ปีนี้นับตั้งแต่มิถุนายน 2564 ถึงพฤษภาคม 2565 ร้อยละที่ระบุว่าคำนวณมาจากจำนวนในตารางเดียวกัน ตัวเลขชุดนี้รวบรวมหลังจบปีการศึกษาและเผยแพร่ครั้งเดียว จะไม่มีการแก้ไขอีก",
      },
      {
        en: "Money and people are labelled planned or actual. A planned figure is what a document said would happen. It is not proof that it did.",
        th: "จำนวนเงินและจำนวนคนระบุว่าเป็นตามแผนหรือจำนวนจริง ตัวเลขตามแผนคือสิ่งที่เอกสารระบุว่าจะเกิดขึ้น ไม่ได้พิสูจน์ว่าเกิดขึ้นจริง",
      },
    ],
  },
  {
    id: "privacy",
    heading: { en: "How people's privacy was protected", th: "เราปกป้องข้อมูลส่วนบุคคลอย่างไร" },
    paragraphs: [
      {
        en: "The source files hold names, email addresses, student ID numbers and phone numbers. None of these appear here. The vote sheet was used only for its totals by year group. People are shown only as role titles or counts. Original documents are not published.",
        th: "เอกสารต้นทางมีชื่อ อีเมล เลขทะเบียนนักศึกษา และเบอร์โทรศัพท์ ข้อมูลเหล่านี้ไม่ปรากฏในหน้านี้เลย เราใช้ตารางนับคะแนนเฉพาะยอดรวมแยกตามชั้นปี และแสดงบุคคลเป็นตำแหน่งหรือจำนวนเท่านั้น ไม่เผยแพร่เอกสารต้นฉบับ",
      },
    ],
  },
  {
    id: "disagree",
    heading: { en: "Where sources disagree", th: "ที่ที่เอกสารให้ตัวเลขไม่ตรงกัน" },
    items: [
      {
        en: "Referendum percentages. The written report divides by 514 submissions, so agree is 93.39%. The vote count sheet divides by 506 valid votes, so agree is 94.86%. We show both and name the total each uses.",
        th: "ร้อยละของผลประชามติ รายงานสรุปหารด้วยบัตรที่ส่งเข้ามา 514 ใบ เห็นด้วยจึงเป็นร้อยละ 93.39 ส่วนตารางนับคะแนนหารด้วยบัตรที่ใช้ได้ 506 ใบ เห็นด้วยจึงเป็นร้อยละ 94.86 เราแสดงทั้งสองแบบและระบุฐานที่ใช้",
      },
      {
        en: "Turnout. The report describes 506 voters out of 1,391 students. The sheet counts 514 submissions as turnout, which is 36.95%, and 506 as valid. We show both.",
        th: "ผู้ใช้สิทธิ รายงานสรุปกล่าวถึงผู้ใช้สิทธิ 506 คนจากนักศึกษา 1,391 คน ส่วนตารางนับบัตรที่ส่งเข้ามา 514 ใบเป็นผู้ใช้สิทธิ คิดเป็นร้อยละ 36.95 และบัตรที่ใช้ได้ 506 ใบ เราแสดงทั้งสองแบบ",
      },
      {
        en: "The rights protection talk. An early draft planned 20 people and ฿8,660 for 5 February 2022. A later copy planned 12 people and ฿7,150 for 5 March 2022. We use the later one.",
        th: "เสวนาพิทักษ์สิทธิ ฉบับร่างแรกวางแผนผู้เข้าร่วม 20 คน งบ 8,660 บาท วันที่ 5 กุมภาพันธ์ 2565 สำเนาฉบับหลังวางแผน 12 คน งบ 7,150 บาท วันที่ 5 มีนาคม 2565 เราใช้ฉบับหลัง",
      },
      {
        en: "The welfare plan. It states ฿168,000, but its priced lines add up to ฿164,500. The library total is ฿3,500 more than its lines. We show the stated total by category and the lines separately.",
        th: "แผนสวัสดิการ ระบุยอด 168,000 บาท แต่รายการที่มีราคารวมได้ 164,500 บาท ยอดหมวดห้องสมุดมากกว่ารายการ 3,500 บาท เราแสดงยอดที่ระบุแยกตามหมวด และแสดงรายการแยกต่างหาก",
      },
    ],
  },
  {
    id: "not-held",
    heading: { en: "What BIRSA does not hold", th: "ข้อมูลที่ BIRSA ไม่มี" },
    paragraphs: [
      {
        en: "Some figures you might expect are missing because BIRSA never recorded them or the records were not kept, not because they were left out.",
        th: "ตัวเลขบางอย่างที่คุณอาจคาดว่าจะเห็นไม่ได้อยู่ในหน้านี้ เพราะ BIRSA ไม่เคยบันทึกไว้หรือไม่ได้เก็บเอกสารไว้ ไม่ใช่เพราะเราตัดออก",
      },
    ],
    items: [
      {
        en: "Money actually received or spent. There is no account, ledger, balance or financial report for this year. Every amount is a plan.",
        th: "รายรับรายจ่ายจริง ไม่มีบัญชี ยอดคงเหลือ หรือรายงานการเงินของปีนี้ ทุกจำนวนเป็นเพียงแผน",
      },
      {
        en: "Attendance at events. Only the public discussion, the survey and the referendum have recorded numbers. BIRSA has no record of how many came to the three projects planned for 2022, or that they were held.",
        th: "จำนวนผู้เข้าร่วมกิจกรรมจริง มีบันทึกเฉพาะเวทีเสวนาสาธารณะ แบบสอบถาม และประชามติ BIRSA ไม่มีบันทึกจำนวนผู้มาร่วมสามโครงการที่วางแผนไว้ในปี 2565 และไม่มีบันทึกว่าจัดแล้ว",
      },
      {
        en: "Satisfaction. Evaluation forms existed for some events, but no results were kept.",
        th: "ความพึงพอใจ มีแบบประเมินของบางกิจกรรม แต่ไม่มีผลที่เก็บไว้",
      },
      {
        en: "Election results. There are no vote counts, turnout or candidate numbers for the April 2022 election.",
        th: "ผลการเลือกตั้ง ไม่มีคะแนน อัตราผู้ใช้สิทธิ หรือจำนวนผู้สมัครของการเลือกตั้งเดือนเมษายน 2565",
      },
      {
        en: "Recruitment. There are no numbers of applicants or places for the committee.",
        th: "การสรรหา ไม่มีจำนวนผู้สมัครหรือจำนวนที่นั่งของคณะกรรมการ",
      },
      {
        en: "Clubs. There is no register of clubs for this year.",
        th: "ชมรม ไม่มีทะเบียนชมรมของปีนี้",
      },
    ],
  },
  {
    id: "left-out",
    heading: { en: "What was left out on purpose", th: "ข้อมูลที่ตั้งใจไม่เผยแพร่" },
    items: [
      {
        en: "Free text comments in the sanitary pad survey. Only the number of responses is shown, 84.",
        th: "ความเห็นแบบข้อความอิสระในแบบสอบถามผ้าอนามัย แสดงเฉพาะจำนวนผู้ตอบ 84 คน",
      },
      {
        en: "Names of speakers, organisers and committee members, and quotes from the public discussion.",
        th: "ชื่อวิทยากร ผู้จัดงาน และกรรมการ รวมถึงคำพูดจากเวทีเสวนาสาธารณะ",
      },
      {
        en: "Records from before June 2021, and a few files for this year that could not be read in full, such as one scanned project form.",
        th: "เอกสารก่อนเดือนมิถุนายน 2564 และไฟล์บางส่วนของปีนี้ที่อ่านได้ไม่ครบ เช่นแบบฟอร์มโครงการที่เป็นภาพสแกนหนึ่งฉบับ",
      },
    ],
  },
  {
    id: "contact",
    heading: { en: "Questions about the figures", th: "สอบถามเรื่องตัวเลข" },
    paragraphs: [
      {
        en: "If you think a figure is wrong, or you want to know more about how it was made, contact BIRSA.",
        th: "หากคิดว่าตัวเลขใดไม่ถูกต้อง หรืออยากทราบว่าได้ตัวเลขมาอย่างไร ติดต่อ BIRSA ได้",
      },
    ],
  },
];
