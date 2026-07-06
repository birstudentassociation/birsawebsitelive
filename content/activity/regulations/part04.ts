import type { Part } from "./types";

export const part04: Part = {
  num: 4,
  title: { en: "The BIR Student Association (BIRSA)", th: "สโมสรนักศึกษาสาขาการเมืองและการระหว่างประเทศ ภาคภาษาอังกฤษ" },
  provisions: [
    {
      num: 24,
      title: { en: "Establishment of BIRSA", th: "การจัดตั้ง BIRSA" },
      lead: {
        en: "There shall be a \"BIR Student Association\", responsible for conducting student activities within the Politics and International Relations (English) programme (\"the BIR programme\"), with the English name \"BIR Student Association\", abbreviated \"BIRSA\", under the supervision of the faculty executive appointed by the Dean to oversee the international-programme project.",
        th: "ให้มี “สโมสรนักศึกษาสาขาการเมืองและการระหว่างประเทศ ภาคภาษาอังกฤษ” เป็นผู้รับผิดชอบดำเนินการเกี่ยวกับกิจกรรมนักศึกษาภายในสาขาการเมืองและการระหว่างประเทศ ภาคภาษาอังกฤษ มีชื่อภาษาอังกฤษว่า BIR Student Association ใช้อักษรย่อ “BIRSA” อยู่ในความดูแลของผู้บริหารคณะที่คณบดีแต่งตั้งให้เป็นผู้ดูแลโครงการหลักสูตรนานาชาติ",
      },
    },
    {
      num: 25,
      title: { en: "Composition of BIRSA", th: "องค์ประกอบ BIRSA" },
      lead: {
        en: "BIRSA shall consist of not fewer than 7 but not more than 13 committee members, elected by students of the BIR programme, holding the following positions:",
        th: "BIRSA ประกอบด้วย กรรมการจำนวนไม่น้อยกว่า 7 คน แต่ไม่เกิน 13 คน ซึ่งนักศึกษาสาขาการเมืองและการระหว่างประเทศ ภาคภาษาอังกฤษเป็นผู้เลือกตั้ง มีตำแหน่ง ดังต่อไปนี้",
      },
      items: [
        { marker: "(1)", text: { en: "President", th: "นายกสโมสร" } },
        { marker: "(2)", text: { en: "Vice-President", th: "อุปนายกสโมสร" } },
        { marker: "(3)", text: { en: "First Secretary", th: "เลขานุการ คนที่ 1" } },
        { marker: "(4)", text: { en: "Second Secretary", th: "เลขานุการ คนที่ 2" } },
        { marker: "(5)", text: { en: "Treasurer", th: "เหรัญญิก" } },
        { marker: "(6)", text: { en: "Spokesperson", th: "โฆษก" } },
        { marker: "(7)", text: { en: "Head of Academic Affairs", th: "กรรมการฝ่ายวิชาการ" } },
        { marker: "(8)", text: { en: "Head of Public Relations", th: "กรรมการฝ่ายประชาสัมพันธ์" } },
        { marker: "(9)", text: { en: "Head of Student Activities", th: "กรรมการฝ่ายกิจกรรมนักศึกษา" } },
        { marker: "(10)", text: { en: "Head of Internal and Rangsit Coordination", th: "กรรมการฝ่ายประสานงานกิจการภายในและรังสิต" } },
        { marker: "(11)", text: { en: "Not more than 3 further committee members, holding such other positions as appropriate", th: "กรรมการอีกไม่เกิน 3 คน ซึ่งดำเนินตำแหน่งอื่นๆ ตามความเหมาะสม" } },
      ],
    },
    {
      num: 26,
      title: { en: "Powers and duties", th: "อำนาจหน้าที่" },
      lead: {
        en: "BIRSA shall jointly have the following powers, duties, and responsibilities:",
        th: "BIRSA มีอำนาจหน้าที่และความรับผิดชอบร่วมกัน ดังต่อไปนี้",
      },
      items: [
        { marker: "(1)", text: { en: "To manage and coordinate all affairs relating to student activities within the BIR programme", th: "บริหารจัดการและประสานงานกิจการทั้งปวงที่เกี่ยวกับกิจกรรมนักศึกษาสาขาการเมืองและการระหว่างประเทศ ภาคภาษาอังกฤษ" } },
        { marker: "(2)", text: { en: "To set policy and prepare BIRSA's annual work plan, projects, and budget, for submission to the faculty executive appointed by the Dean to oversee the international-programme project", th: "กำหนดนโยบาย จัดทำแผนงาน โครงการ และงบประมาณประจำปีของ BIRSA เสนอต่อผู้บริหารคณะที่คณบดีแต่งตั้งให้เป็นผู้ดูแลโครงการหลักสูตรนานาชาติ" } },
        { marker: "(3)", text: { en: "Removal of a committee member holding a position on BIRSA under section 25 shall be at the discretion of the President of BIRSA, who must nominate the person to the Dean for the Dean to sign the order of removal", th: "การถอดถอนกรรมการที่ดำรงตำแหน่งใน BIRSA ตามข้อ 25 ให้เป็นไปตามดุลยพินิจของนายก BIRSA โดย นายก BIRSA ต้องเสนอชื่อต่อคณบดีเพื่อให้คณบดีลงนามถอดถอน" } },
        { marker: "(4)", text: { en: "To hear the opinions of students and faculty members on matters relating to student activities within the BIR programme", th: "รับฟังความคิดเห็นจากนักศึกษาและอาจารย์ในเรื่องเกี่ยวกับกิจกรรมนักศึกษาภายในสาขาการเมืองและการระหว่างประเทศ ภาคภาษาอังกฤษ" } },
        { marker: "(5)", text: { en: "To appoint subcommittees to perform functions relating to student activities within the BIR programme as it sees fit", th: "แต่งตั้งอนุกรรมการขึ้นเพื่อทำหน้าที่เกี่ยวกับกิจกรรมนักศึกษาสาขาการเมืองและการระหว่างประเทศ ภาคภาษาอังกฤษตามที่เห็นสมควร" } },
      ],
    },
    {
      num: 27,
      title: { en: "Right to vote", th: "สิทธิเลือกตั้ง BIRSA" },
      lead: {
        en: "Students of the Faculty of Political Science enrolled in the BIR programme, of every year of study, are entitled to vote in BIRSA elections.",
        th: "ผู้มีสิทธิเลือกตั้ง BIRSA คือ นักศึกษาคณะรัฐศาสตร์ สาขาการเมืองและการระหว่างประเทศ ภาคภาษาอังกฤษ ทุกชั้นปี",
      },
    },
    {
      num: 28,
      title: { en: "Eligibility to stand", th: "คุณสมบัติผู้สมัคร" },
      lead: {
        en: "A person entitled to stand for election to BIRSA must have the following qualifications:",
        th: "ผู้มีสิทธิรับเลือกตั้งเป็น BIRSA ต้องมีคุณสมบัติดังนี้",
      },
      items: [
        { marker: "(1)", text: { en: "Be a student of the Faculty of Political Science, BIR programme, currently studying at undergraduate level at the University", th: "เป็นนักศึกษาคณะรัฐศาสตร์สาขาการเมืองและการระหว่างประเทศ ภาคภาษาอังกฤษที่กำลังศึกษาอยู่ในชั้นปริญญาตรีของมหาวิทยาลัย" } },
        { marker: "(2)", text: { en: "Have an academic record with a GPA not lower than 2.00", th: "ต้องมีผลการศึกษาอยู่ในเกณฑ์ไม่ต่ำกว่า 2.00" } },
        { marker: "(3)", text: { en: "Not be a committee member of any group or other activity within the Faculty of Political Science, Thammasat University", th: "ไม่เป็นกรรมการกลุ่ม หรือกิจกรรมอื่นๆ ในคณะรัฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์" } },
        { marker: "(4)", text: { en: "Have studied at the University for not more than 4 years as of the year of standing for election", th: "ได้ศึกษาอยู่ในมหาวิทยาลัยมาแล้วไม่เกิน 4 ปี ในปีที่สมัครเข้ารับเลือกตั้ง" } },
        { marker: "(5)", text: { en: "Not be under disciplinary punishment under the University's regulations", th: "ไม่อยู่ในระหว่างถูกลงโทษทางวินัย ตามข้อบังคับของมหาวิทยาลัย" } },
        { marker: "(6)", text: { en: "Not be on a leave of absence during that academic year", th: "ไม่อยู่ในขณะลาพักการศึกษาในปีการศึกษานั้น" } },
      ],
    },
    {
      num: 29,
      title: { en: "Timing of elections", th: "กำหนดเวลาเลือกตั้ง" },
      lead: {
        en: "The election of BIRSA for that academic year shall be completed within 30 days before the end of the second semester, save that where necessary or in a proper emergency it shall be at the Dean's discretion to extend the time as appropriate, and the date, time, and place of the election shall be announced to students not less than 15 days in advance.",
        th: "ให้ดำเนินการเลือกตั้ง BIRSA ประจำปีการศึกษานั้นให้เสร็จสิ้นภายใน 30 วันก่อนปิดการศึกษาภาคสอง เว้นแต่มีเหตุจำเป็น/ฉุกเฉินอันสมควร ให้เป็นดุลพินิจของคณบดีในการขยายเวลาได้ตามความเหมาะสม โดยให้ประกาศวัน เวลา และสถานที่ที่จะมีการเลือกตั้งให้นักศึกษาทราบล่วงหน้าไม่น้อยกว่า 15 วัน",
      },
    },
    {
      num: 30,
      title: { en: "Manner of election", th: "วิธีการสมัครรับเลือกตั้ง" },
      lead: {
        en: "The election of BIRSA shall be conducted as a general election within the BIR programme, in which candidates must stand together as a group, naming persons for every position required under section 25.",
        th: "การเลือกตั้ง BIRSA ให้กระทำโดยการเลือกตั้งทั่วไปภายในสาขาการเมืองและการระหว่างประเทศ ภาคภาษาอังกฤษ โดยผู้สมัครเข้ารับการเลือกตั้งต้องรวมกันเป็นกลุ่ม โดยระบุตำแหน่งหน้าที่ให้ครบตามข้อที่ 25",
      },
    },
    {
      num: 31,
      title: { en: "Voting and determination of result", th: "การลงคะแนนและผลการเลือกตั้ง" },
      lead: {
        en: "In the election of BIRSA, each voter shall cast a vote for only one group; the group receiving the highest number of votes shall be deemed elected. If the highest number of votes is tied, a fresh election shall be held only among the groups tied for the highest score, until one group achieves the highest score. If only one group stands, it must receive endorsing votes of not less than one-half of the voters; if it is not so endorsed, a fresh election must be completed within 7 days from the date of the first election.",
        th: "การเลือกตั้ง BIRSA ให้ผู้เลือกตั้งลงคะแนนเสียงเพียง 1 กลุ่ม การนับคะแนนให้ถือว่ากลุ่มที่ได้รับคะแนนสูงสุดได้รับการเลือกตั้ง ถ้าคะแนนสูงสุดเท่ากัน ให้มีการเลือกตั้งใหม่เฉพาะกลุ่มที่ได้คะแนนสูงสุดเท่ากันจนกว่าจะได้กลุ่มที่ได้คะแนนสูงสุด ถ้าสมัครเพียงกลุ่มเดียว ต้องได้คะแนนเสียงรับรองไม่น้อยกว่ากึ่งหนึ่งของผู้ลงคะแนนเสียงหากไม่ได้รับการรับรองจะต้องดำเนินการเลือกตั้งใหม่ให้เสร็จสิ้นภายใน 7 วัน นับแต่วันเลือกตั้งครั้งแรก",
      },
    },
    {
      num: 32,
      title: { en: "Voting method", th: "วิธีการลงคะแนน" },
      lead: {
        en: "The BIRSA election shall be conducted at a polling booth, save that where there is necessity or an obstacle making it impossible to hold the election at a polling booth, the Dean may, in the Dean's discretion, change the method to an online election, provided that this is announced not less than 7 days in advance.",
        th: "วิธีการเลือกตั้ง BIRSA ให้จัดการเลือกตั้ง ณ คูหาเลือกตั้ง เว้นแต่มีเหตุจำเป็น หรือมีอุปสรรคจนทำให้ไม่สามารถจัดเลือกตั้ง ณ คูหาเลือกตั้งได้ ให้คณบดีใช้ดุลพินิจเปลี่ยนไปใช้วิธีเลือกตั้งแบบออนไลน์ได้ โดยต้องประกาศให้ทราบล่วงหน้าอย่างน้อย 7 วัน",
      },
    },
    {
      num: 33,
      title: { en: "Appointment and removal", th: "การแต่งตั้งและถอดถอน" },
      lead: {
        en: "The Dean shall sign the notice of appointment and removal of BIRSA.",
        th: "คณบดีเป็นผู้ลงนามประกาศแต่งตั้ง และถอดถอน BIRSA",
      },
    },
    {
      num: 34,
      title: { en: "Term of office", th: "วาระการดำรงตำแหน่ง" },
      lead: {
        en: "BIRSA shall hold office for one academic year at a time, beginning work from the date the Dean announces its appointment. BIRSA must complete the handover of duties to the next BIRSA within 15 days of the date it is elected. The term of the outgoing BIRSA ends on the day duties are handed over to the new BIRSA.",
        th: "BIRSA อยู่ในตำแหน่งคราวละ 1 ปีการศึกษา โดยเริ่มปฏิบัติงานตั้งแต่วันที่คณบดีประกาศแต่งตั้ง และ BIRSA ต้องมอบงานต่อ BIRSA ชุดต่อไปให้เสร็จสิ้นภายใน 15 วัน นับแต่วันที่ได้รับการเลือกตั้ง อายุของ BIRSA สิ้นสุดลงในวันมอบงานแก่ BIRSA ชุดใหม่",
      },
    },
    {
      num: 35,
      title: { en: "Vacation of office", th: "การพ้นจากตำแหน่ง" },
      lead: {
        en: "A committee member of BIRSA vacates office when:",
        th: "กรรมการ BIRSA พ้นจากตำแหน่งเมื่อ",
      },
      items: [
        { marker: "(1)", text: { en: "Retiring at the end of the term", th: "ออกตามวาระ" } },
        { marker: "(2)", text: { en: "Death", th: "ตาย" } },
        { marker: "(3)", text: { en: "Resignation", th: "ลาออก" } },
        { marker: "(4)", text: { en: "Losing the qualifications required under section 28", th: "ขาดคุณสมบัติตามข้อ 28" } },
        { marker: "(5)", text: { en: "Removal under section 26(3)", th: "ออกตามข้อ 26 (3)" } },
        { marker: "(6)", text: { en: "Being subject to disciplinary punishment under the University's regulations", th: "ถูกลงโทษทางวินัย ตามข้อบังคับของมหาวิทยาลัย" } },
        { marker: "(7)", text: { en: "More than one-half of all undergraduate students of the Faculty of Political Science in the BIR programme sign a petition for the member's removal, whether the whole committee or an individual member, with the Dean's approval", th: "นักศึกษาคณะรัฐศาสตร์ระดับปริญญาตรี สาขาการเมืองและการระหว่างประเทศ ภาคภาษาอังกฤษ เกินกว่ากึ่งหนึ่งของทั้งหมด เข้าชื่อกันให้ออก อาจเป็นทั้งคณะหรือรายบุคคล โดยความเห็นชอบของคณบดี" } },
      ],
    },
    {
      num: 36,
      title: { en: "Whole-committee vacancy", th: "การพ้นตำแหน่งทั้งคณะ" },
      lead: {
        en: "When BIRSA vacates office as a whole committee under section 35(5) or 35(7), a new BIRSA election shall be held to be completed within 20 days after BIRSA vacates office, and the outgoing BIRSA shall continue to perform its duties until the new BIRSA takes office. The term of the new BIRSA begins on the date of the notice of appointment and ends according to the term that the previous BIRSA would have had. If BIRSA vacates office not more than 60 days before the end of the second semester, a fresh election under paragraph one is not required; instead, BIRSA shall consider nominating suitable persons to the Dean for appointment to the vacant positions.",
        th: "เมื่อ BIRSA พ้นจากตำแหน่งทั้งคณะตามข้อ 35 (5) หรือ 35 (7) ในกรณีนี้ให้มีการเลือกตั้ง BIRSA ใหม่ให้เสร็จสิ้นภายใน 20 วัน หลังจาก BIRSA พ้นจากตำแหน่งโดยให้ BIRSA ชุดเดิมปฏิบัติหน้าที่ต่อไปจนกว่า BIRSA ชุดใหม่เข้ารับตำแหน่ง อายุของ BIRSA ชุดใหม่นี้เริ่มตั้งแต่วันประกาศแต่งตั้ง และสิ้นสุดลง ตามอายุของ BIRSA ชุดก่อน ถ้า BIRSA พ้นจากตำแหน่งก่อนปิดการศึกษาภาคสองไม่เกิน 60 วัน ก็ไม่ต้องมีการเลือกตั้งใหม่ตามวรรคหนึ่ง ให้ BIRSA พิจารณาเสนอชื่อบุคคลที่สมควรต่อคณบดี เพื่อแต่งตั้งให้ดำรงตำแหน่งแทน",
      },
    },
    {
      num: 37,
      title: { en: "Individual vacancy", th: "การพ้นตำแหน่งรายบุคคล" },
      lead: {
        en: "Where any one committee member of BIRSA vacates office, BIRSA shall consider nominating a suitable person to the Dean for appointment to the vacant position.",
        th: "ในกรณีที่กรรมการ BIRSA คนหนึ่งคนใดพ้นจากตำแหน่ง ให้ BIRSA พิจารณาเสนอชื่อบุคคลที่สมควรต่อคณบดี เพื่อแต่งตั้งให้ดำรงตำแหน่งแทน",
      },
    },
    {
      num: 38,
      title: { en: "Meetings and quorum", th: "การประชุมและองค์ประชุม" },
      lead: {
        en: "BIRSA shall hold meetings during the academic semester at least twice a month.",
        th: "ให้มีการประชุม BIRSA ระหว่างเปิดภาคการศึกษา อย่างน้อยเดือนละ 2 ครั้ง",
      },
      items: [
        { marker: "(1)", text: { en: "A BIRSA meeting requires the attendance of not less than one-half of all committee members to constitute a quorum", th: "ในการประชุม BIRSA ต้องมีกรรมการเข้าประชุมไม่น้อยกว่ากึ่งหนึ่งของจำนวนกรรมการทั้งหมด จึงถือว่าเป็นองค์ประชุม" } },
        { marker: "(2)", text: { en: "The President of BIRSA shall chair the meeting; if the President of BIRSA is absent or unable to perform this duty, the Vice-President shall act in the President's place; if both are absent, the members present shall select one of themselves to chair the meeting", th: "ให้ นายก BIRSA เป็นประธานที่ประชุม ในกรณีที่ นายก BIRSA ไม่อยู่ หรือไม่อาจปฏิบัติหน้าที่ได้ ให้อุปนายกฯ ทำหน้าที่แทน กรณีที่บุคคลทั้งสองไม่อยู่ให้เลือกกรรมการคนใดคนหนึ่งที่เข้าร่วมประชุม เป็นประธานดำเนินการประชุมแทน" } },
        { marker: "(3)", text: { en: "Resolutions shall be by majority vote of the meeting, each committee member having one vote. Where votes are tied and the chair of the meeting has not yet cast a vote, the chair shall have a casting vote, except that in matters BIRSA deems important, and in the cases under section 35(7) and section 86, a two-thirds majority of all BIRSA committee members shall be required", th: "การลงมติ ให้ถือเสียงข้างมากของที่ประชุม กรรมการคนหนึ่งออกเสียงได้หนึ่งเสียง ในกรณีที่คะแนนเสียงเท่ากันโดยประธานที่ประชุมยังไม่ได้ใช้สิทธิ์ออกเสียง ให้ประธานที่ประชุมมีสิทธิ์ออกเสียงชี้ขาด เฉพาะกรณีที่ BIRSA ถือเป็นเรื่องสำคัญและกรณีข้อ 35 (7) และข้อ 86 ให้ใช้มติ 2 ใน 3 ของจำนวนกรรมการ BIRSA ทั้งหมด" } },
      ],
    },
    {
      num: 39,
      title: { en: "Coordination with the PSC", th: "การประสานงานกับ กนศ.ร." },
      lead: {
        en: "BIRSA may coordinate with the PSC on student activities as appropriate.",
        th: "BIRSA อาจประสานงานกับ กนศ.ร. เกี่ยวกับกิจกรรมของนักศึกษาได้ ตามสมควร",
      },
    },
  ],
};
